"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import CreateListForm from "@/components/CreateListForm";
import SharedListCard from "@/components/SharedListCard";
import SharedListView from "@/components/SharedListView";
import {
  subscribeToSharedLists,
  createSharedList,
  subscribeToSharedTasks,
  addSharedTask,
  updateSharedTask,
  deleteSharedTask,
  addMemberToList,
  removeMemberFromList
} from "@/services/sharedListService";
import { getDocs, collection, query, where, getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function SharedListsPage() {
  const { user, loading: authLoading } = useAuth();
  const [lists, setLists] = useState([]);
  const [listsLoading, setListsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedList, setSelectedList] = useState(null);
  const [sharedTasks, setSharedTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState("");
  const [members, setMembers] = useState([]);
  
  // Abonnement temps réel aux listes partagées
  useEffect(() => {
    if (!user) {
      setLists([]);
      setListsLoading(false);
      return;
    }
    setListsLoading(true);
    setError("");
    const unsubscribe = subscribeToSharedLists(user.uid, (data, err) => {
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

  // Création d'une nouvelle liste
  const handleCreateList = useCallback(async (name) => {
    if (!user) throw new Error("Vous devez être connecté.");
    await createSharedList(user.uid, name);
  }, [user]);

  // Gestion ouverture/fermeture d'une liste
  // Abonnement temps réel aux tâches partagées
  useEffect(() => {
    if (!selectedList) {
      setSharedTasks([]);
      setTasksError("");
      setTasksLoading(false);
      setMembers([]);
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
        users = users.concat(snap.docs.map(doc => ({ id: doc.id, uid: doc.data().uid || doc.id, email: doc.data().email })));
      }
      // Ajoute les membres non trouvés : essaie de chercher par ID de document
      const missing = selectedList.members.filter(uid => !users.find(u => u.uid === uid));
      for (const uid of missing) {
        try {
          const docRef = doc(db, "users", uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            users.push({ id: docSnap.id, uid: docSnap.data().uid || uid, email: docSnap.data().email || uid });
          } else {
            // Document innexistant
            users.push({ id: uid, uid, email: uid });
          }
        } catch (err) {
          console.error(`[fetchMembers] Erreur pour uid ${uid}:`, err);
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

  if (authLoading || listsLoading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-surface text-on-surface">
        <div className="text-lg font-semibold">Chargement...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-surface text-on-surface">
        <div className="text-lg font-semibold">Veuillez vous connecter pour accéder aux listes partagées.</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface text-on-surface flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <h1 className="text-2xl font-bold mb-2">Listes partagées</h1>
        {error && (
          <div className="p-4 bg-error-container text-error rounded-lg font-medium">{error}</div>
        )}
        {!selectedList && (
          <>
            <CreateListForm onCreateList={handleCreateList} />
            <div className="flex flex-col gap-4 mt-6">
              {lists.length === 0 ? (
                <div className="text-on-surface-variant text-center">Aucune liste partagée pour le moment.</div>
              ) : (
                lists.map((list) => (
                  <SharedListCard
                    key={list.id}
                    list={list}
                    onOpen={() => handleOpenList(list)}
                  />
                ))
              )}
            </div>
          </>
        )}
        {selectedList && (
          <SharedListView
            list={selectedList}
            tasks={sharedTasks}
            currentUserId={user.uid}
            members={members}
            onBack={handleCloseList}
            onAddTask={async ({ title, priority }) => {
              await addSharedTask(selectedList.id, user.uid, { title, priority });
            }}
            onUpdateTask={async (taskId, updates) => {
              await updateSharedTask(selectedList.id, taskId, updates);
            }}
            onDeleteTask={async (taskId) => {
              await deleteSharedTask(selectedList.id, taskId);
            }}
            onAddMember={async (email) => {
                await addMemberToList(selectedList.id, email);
            }}
                        tasks={sharedTasks.map(task => ({
                          ...task,
                          // Affiche l'email de l'auteur si possible
                          addedBy: members.find(m => m.uid === task.addedBy)?.email || task.addedBy
                        }))}
            onRemoveMember={async (member) => {
              await removeMemberFromList(selectedList.id, member.uid, user.uid);
            }}
            tasksLoading={tasksLoading}
            tasksError={tasksError}
          />
        )}
      </div>
    </main>
  );
}
