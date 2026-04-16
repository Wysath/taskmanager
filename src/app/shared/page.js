"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRavenMessenger } from "@/hooks/useRavenMessenger";
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
import { getDocs, collection, query, where, getDoc, doc, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, Users, Sword, Crown } from "lucide-react";

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

  // Création d'une nouvelle liste
  const handleCreateList = useCallback(async (name) => {
    if (!user) throw new Error("Vous devez être connecté.");
    await createSharedList(user.uid, name, user.email);
  }, [user]);

  // Notifications "Corbeau Messager" pour les nouvelles tâches
  useRavenMessenger({
    collectionQuery: tasksQuery,
    currentUserEmail: user?.email,
    enabled: !!selectedList && !!user,
  });

  // Gestion ouverture/fermeture d'une liste
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
      // Les membres sont déjà structurés comme {email, role} dans selectedList
      // On peut les utiliser directement
      setMembers(selectedList.members);
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
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#151310] text-[#e3d5b8]">
        <div className="text-lg font-headline uppercase tracking-widest text-[#c28e46]">Chargement des Escouades...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#151310] text-[#e3d5b8]">
        <div className="text-lg font-headline uppercase tracking-widest text-[#c28e46]">Veuillez vous connecter pour accéder aux Escouades.</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#151310] text-[#e3d5b8] flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-5xl flex flex-col gap-8">
        {/* Page Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sword size={32} className="text-[#c28e46]" />
            <h1 className="text-5xl font-headline text-[#c28e46] uppercase tracking-widest">Les Escouades</h1>
            <Users size={32} className="text-[#c28e46]" />
          </div>
          <p className="text-[#8a8171] font-label text-sm uppercase tracking-wider">Regroupez-vous pour accomplir de plus grandes quêtes</p>
          <div className="h-1 w-24 bg-[#c28e46] mx-auto mt-4"></div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-6 bg-[#93000a]/20 border-2 border-[#93000a] text-[#ffb4ab] rounded font-medium">
            {error}
          </div>
        )}

        {!selectedList && (
          <>
            {/* Create Squad Form */}
            <div className="bg-[#211f1c] border-4 border-[#504538] p-8">
              <h2 className="font-headline text-2xl text-[#c28e46] mb-6 uppercase tracking-widest">Former une nouvelle Escouade</h2>
              <CreateListForm onCreateList={handleCreateList} />
            </div>

            {/* Squad List */}
            <div className="flex flex-col gap-6 mt-6">
              {lists.length === 0 ? (
                <div className="text-center py-16">
                  <div className="flex justify-center mb-4">
                    <Sword size={48} className="text-[#c28e46]" />
                  </div>
                  <div className="text-[#8a8171] font-label text-sm uppercase tracking-wider mb-4">
                    Aucune Escouade pour le moment.
                  </div>
                  <p className="text-[#5c564c] font-body text-sm">Créez votre première Escouade pour recruter des Chasseurs et accomplir des quêtes ensemble!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {lists.map((list) => (
                    <div
                      key={list.id}
                      className="bg-[#211f1c] border-4 border-[#504538] p-6 hover:border-[#c28e46] transition-colors cursor-pointer"
                      onClick={() => handleOpenList(list)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-headline text-2xl text-[#e8e1dc] uppercase tracking-widest mb-2">
                            {list.name}
                          </h3>
                          <p className="text-[#8a8171] font-label text-xs uppercase tracking-wider flex items-center gap-1">
                            <Users size={14} /> {list.members?.length || 0} Chasseur{(list.members?.length || 0) > 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="text-[#c28e46]">
                          {list.ownerId === user.uid ? <Crown size={24} /> : <Sword size={24} />}
                        </div>
                      </div>
                      <button
                        onClick={() => handleOpenList(list)}
                        className="w-full bg-[#2c2a26] text-[#e8e1dc] border-2 border-[#c28e46] py-2 font-headline text-xs uppercase tracking-widest hover:bg-[#c28e46] hover:text-[#151310] transition-colors"
                      >
                        Accéder à l'Escouade
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {selectedList && (
          <SharedListView
            list={selectedList}
            tasks={sharedTasks}
            currentUserId={user.uid}
            currentUserEmail={user.email}
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
                          addedBy: members.find(m => m.email?.toLowerCase() === task.addedBy?.toLowerCase())?.email || task.addedBy
                        }))}
            onRemoveMember={async (memberEmail) => {
              await removeMemberFromList(selectedList.id, memberEmail, user.uid);
            }}
            tasksLoading={tasksLoading}
            tasksError={tasksError}
          />
        )}
      </div>
    </main>
  );
}
