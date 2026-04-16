"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRavenMessenger } from "@/hooks/useRavenMessenger";
import {
  subscribeToSharedLists,
  createSharedList,
  subscribeToSharedTasks,
} from "@/services/sharedListService";
import { collection, query, where, getDoc, doc, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CreateListForm from "@/components/CreateListForm";
import SharedListCard from "@/components/SharedListCard";
import SharedListView from "@/components/SharedListView";
import { Plus, Users, Sword } from "lucide-react";

/**
 * Composant réutilisable pour gérer les Escouades (listes partagées)
 * Intègre automatiquement les notifications "Corbeau Messager"
 * 
 * @param {Object} props
 * @param {string} props.className - Classes additionnelles pour la section
 * @param {boolean} props.enableNotifications - Active/désactive les notifications (défaut: true)
 */
export default function SharedSquads({ className = "", enableNotifications = true }) {
  const { user, loading: authLoading } = useAuth();
  const [lists, setLists] = useState([]);
  const [listsLoading, setListsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedList, setSelectedList] = useState(null);
  const [sharedTasks, setSharedTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState("");
  const [members, setMembers] = useState([]);
  const [tasksQuery, setTasksQuery] = useState(null);

  // Abonnement temps réel aux listes partagées
  useEffect(() => {
    if (!user || !user.email) {
      setLists([]);
      setListsLoading(false);
      return;
    }
    setListsLoading(true);
    setError("");
    const unsubscribe = subscribeToSharedLists(user.email, (data, err) => {
      if (err) {
        setError(err);
        setLists([]);
      } else {
        setLists(data);
      }
      setListsLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  // Notifications "Corbeau Messager" pour les nouvelles tâches
  useRavenMessenger({
    collectionQuery: tasksQuery,
    currentUserEmail: user?.email,
    enabled: enableNotifications && !!selectedList && !!user,
  });

  // Création d'une nouvelle liste
  const handleCreateList = useCallback(async (name) => {
    if (!user) throw new Error("Vous devez être connecté.");
    await createSharedList(user.uid, name, user.email);
  }, [user]);

  // Abonnement temps réel aux tâches partagées
  useEffect(() => {
    if (!selectedList) {
      setSharedTasks([]);
      setTasksError("");
      setTasksLoading(false);
      setMembers([]);
      setTasksQuery(null);
      return;
    }
    setTasksLoading(true);
    setTasksError("");
    
    // Abonnement temps réel aux tâches
    const unsubscribe = subscribeToSharedTasks(selectedList.id, (tasks, err) => {
      if (err) {
        setTasksError(err);
        setSharedTasks([]);
      } else {
        setSharedTasks(tasks);
      }
      setTasksLoading(false);
    });

    // Crée la requête pour le hook useRavenMessenger
    const q = query(
      collection(db, `sharedLists/${selectedList.id}/tasks`),
      orderBy("createdAt", "desc")
    );
    setTasksQuery(q);

    // Récupération des infos membres
    async function fetchMembers() {
      if (!selectedList.members || selectedList.members.length === 0) {
        setMembers([]);
        return;
      }
      // Firestore n'autorise pas plus de 10 dans 'in', donc batch
      let users = [];
      for (let i = 0; i < selectedList.members.length; i += 10) {
        const batch = selectedList.members.slice(i, i + 10);
        const q = query(collection(db, "users"), where("uid", "in", batch));
        const snap = await getDocs(q);
        users = users.concat(
          snap.docs.map((doc) => ({
            id: doc.id,
            uid: doc.data().uid || doc.id,
            email: doc.data().email,
          }))
        );
      }
      // Ajoute les membres non trouvés : essaie de chercher par ID de document
      const missing = selectedList.members.filter((uid) => !users.find((u) => u.uid === uid));
      for (const uid of missing) {
        try {
          const docRef = doc(db, "users", uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            users.push({
              id: docSnap.id,
              uid: docSnap.data().uid || uid,
              email: docSnap.data().email || uid,
            });
          } else {
            users.push({ id: uid, uid, email: uid });
          }
        } catch (err) {
          console.error(`[SharedSquads.fetchMembers] Erreur pour uid ${uid}:`, err);
          users.push({ id: uid, uid, email: uid });
        }
      }
      setMembers(users);
    }
    fetchMembers();
    return () => unsubscribe();
  }, [selectedList]);

  const handleOpenList = (list) => setSelectedList(list);
  const handleCloseList = () => {
    setSelectedList(null);
    setSharedTasks([]);
    setTasksError("");
    setTasksLoading(false);
  };

  // États de chargement
  if (authLoading || listsLoading) {
    return (
      <main className={`min-h-screen flex flex-col items-center justify-center bg-[#151310] text-[#e3d5b8] ${className}`}>
        <div className="text-lg font-headline uppercase tracking-widest text-[#c28e46]">
          Chargement des Escouades...
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className={`min-h-screen flex flex-col items-center justify-center bg-[#151310] text-[#e3d5b8] ${className}`}>
        <div className="text-lg font-headline uppercase tracking-widest text-[#c28e46]">
          Veuillez vous connecter pour accéder aux Escouades.
        </div>
      </main>
    );
  }

  // Affichage de la liste détaillée si une escouade est ouverte
  if (selectedList) {
    return (
      <SharedListView
        list={selectedList}
        tasks={sharedTasks}
        currentUserId={user.uid}
        currentUserEmail={user.email}
        members={members}
        onAddMember={(email) => {
          // La logique d'ajout de membre peut être passée comme prop si nécessaire
        }}
        onRemoveMember={(memberEmail) => {
          // La logique de suppression peut être passée comme prop si nécessaire
        }}
        onAddTask={() => {
          // Gestion de l'ajout de tâche
        }}
        onUpdateTask={() => {
          // Mise à jour de tâche
        }}
        onDeleteTask={() => {
          // Suppression de tâche
        }}
        onBack={handleCloseList}
      />
    );
  }

  // Affichage principal : liste des escouades
  return (
    <main className={`min-h-screen bg-[#151310] text-[#e3d5b8] flex flex-col items-center py-12 px-4 ${className}`}>
      <div className="w-full max-w-5xl flex flex-col gap-8">
        {/* Page Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sword size={32} className="text-[#c28e46]" />
            <h1 className="text-5xl font-headline text-[#c28e46] uppercase tracking-widest">
              Les Escouades
            </h1>
          </div>
          <p className="text-[#8a8171] font-label text-sm uppercase tracking-widest">
            Formez des groupes et complétez des quêtes ensemble
          </p>
        </div>

        {/* Création d'une nouvelle escouade */}
        <div className="bg-[#211f1c] border-4 border-[#504538] p-8">
          <h2 className="font-headline text-2xl text-[#c28e46] mb-4 flex items-center gap-2 uppercase tracking-widest">
            <Plus size={24} />
            Créer une Escouade
          </h2>
          <CreateListForm onCreateList={handleCreateList} />
        </div>

        {/* Messages d'erreur */}
        {error && (
          <div className="bg-[#93000a]/20 border-2 border-[#93000a] text-[#ffb4ab] p-4 font-body">
            Erreur: {error}
          </div>
        )}

        {/* Liste des escouades */}
        <div className="flex flex-col gap-6">
          <h2 className="font-headline text-2xl text-[#c28e46] flex items-center gap-2 uppercase tracking-widest">
            <Users size={24} />
            Vos Escouades ({lists.length})
          </h2>

          {lists.length === 0 ? (
            <div className="text-center py-16">
              <div className="flex justify-center mb-4">
                <Sword size={48} className="text-[#c28e46]" />
              </div>
              <div className="text-[#8a8171] font-label text-sm uppercase tracking-wider mb-4">
                Aucune Escouade pour le moment.
              </div>
              <p className="text-[#5c564c] font-body text-sm">
                Créez votre première Escouade pour recruter des Chasseurs et accomplir des quêtes ensemble!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lists.map((list) => (
                <SharedListCard
                  key={list.id}
                  list={list}
                  onClick={() => handleOpenList(list)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
