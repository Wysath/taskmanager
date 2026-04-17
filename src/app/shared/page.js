"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRavenMessenger } from "@/hooks/useRavenMessenger";

const CreateListForm = dynamic(() => import("@/components/CreateListForm"), { ssr: false });
const SharedListView = dynamic(() => import("@/components/SharedListView"), { ssr: false });
// Services lazy-loaded in handlers to prevent blocking mobile render
// import statements moved to dynamic imports in useCallback hooks
import { Users, Sword, Crown } from "lucide-react";

export default function SharedListsPage() {
  return (
    <ProtectedRoute>
      <SharedListsContent />
    </ProtectedRoute>
  );
}

function SharedListsContent() {
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

  // Abonnement temps réel aux listes partagées (lazy-load service)
  useEffect(() => {
    if (!user || !user.email) {
      setLists([]);
      setListsLoading(false);
      return;
    }
    setListsLoading(true);
    setError("");
    
    (async () => {
      try {
        const { subscribeToSharedLists } = await import("@/services/sharedListService");
        const unsubscribe = subscribeToSharedLists(user.email, (data, err) => {
          if (err) {
            setError("Impossible de charger vos escouades. Vérifiez votre connexion.");
            setLists([]);
          } else {
            setLists(data);
          }
          setListsLoading(false);
        });
        return () => unsubscribe();
      } catch (err) {
        const message = "Erreur lors du chargement des escouades.";
        setError(message);
        toast.error(message);
        setListsLoading(false);
      }
    })();
  }, [user]);

  // Création d'une nouvelle liste (lazy-load service)
  const handleCreateList = useCallback(async (name) => {
    if (!user) {
      toast.error("Vous devez être connecté pour créer une escouade.");
      return;
    }
    try {
      const { createSharedList } = await import("@/services/sharedListService");
      await createSharedList(user.uid, name, user.email);
      toast.success(`Escouade "${name}" créée avec succès`);
    } catch (err) {
      const message = err?.message?.includes("permission")
        ? "Vous n'avez pas la permission de créer une escouade."
        : "Impossible de créer l'escouade. Vérifiez votre connexion.";
      toast.error(message);
    }
  }, [user]);

  // Notifications "Corbeau Messager" pour les nouvelles tâches
  useRavenMessenger({
    collectionQuery: tasksQuery,
    currentUserEmail: user?.email,
    enabled: !!selectedList && !!user,
  });

  // Abonnement temps réel aux tâches partagées et récupération membres (lazy-load service & Firebase)
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
    
    (async () => {
      try {
        const { subscribeToSharedTasks } = await import("@/services/sharedListService");
        const { collection, query, orderBy } = await import("@firebase/firestore");
        const { db } = await import("@/lib/firebase");

        const unsubscribe = subscribeToSharedTasks(selectedList.id, (tasks, err) => {
          if (err) {
            setTasksError("Impossible de charger les tâches. Vérifiez votre accès.");
            setSharedTasks([]);
          } else {
            setSharedTasks(tasks);
          }
          setTasksLoading(false);
        });

        const q = query(
          collection(db, `sharedLists/${selectedList.id}/tasks`),
          orderBy("createdAt", "desc")
        );
        setTasksQuery(q);

        if (!selectedList.members || selectedList.members.length === 0) {
          setMembers([]);
        } else {
          setMembers(selectedList.members);
        }

        return () => {
          if (unsubscribe) unsubscribe();
        };
      } catch (err) {
        const message = "Erreur lors du chargement des tâches de l'escouade.";
        setTasksError(message);
        toast.error(message);
        setTasksLoading(false);
      }
    })();
  }, [selectedList]);

  // Fonctions optimisées avec useCallback
  const handleOpenList = useCallback((list) => setSelectedList(list), []);
  const handleCloseList = useCallback(() => {
    setSelectedList(null);
    setSharedTasks([]);
    setTasksError("");
    setTasksLoading(false);
  }, []);

  const handleAddTask = useCallback(
    async ({ title, priority }) => {
      if (!selectedList || !user) {
        toast.error("Vous devez être connecté et avoir sélectionné une escouade.");
        return;
      }
      try {
        const { addSharedTask } = await import("@/services/sharedListService");
        await addSharedTask(selectedList.id, user.email, { title, priority });
        toast.success("Tâche ajoutée à l'escouade");
      } catch (err) {
        const message = "Impossible d'ajouter la tâche. Vérifiez votre accès.";
        toast.error(message);
      }
    },
    [selectedList, user]
  );

  const handleUpdateTask = useCallback(
    async (taskId, updates) => {
      if (!selectedList) {
        toast.error("Aucune escouade sélectionnée.");
        return;
      }
      try {
        const { updateSharedTask } = await import("@/services/sharedListService");
        await updateSharedTask(selectedList.id, taskId, updates);
        if (updates.completed !== undefined) {
          toast.success(updates.completed ? "Tâche complétée ! ✅" : "Tâche réactivée");
        }
      } catch (err) {
        toast.error("Impossible de mettre à jour la tâche. Vérifiez votre accès.");
      }
    },
    [selectedList]
  );

  const handleDeleteTask = useCallback(
    async (taskId) => {
      if (!selectedList) {
        toast.error("Aucune escouade sélectionnée.");
        return;
      }
      try {
        const { deleteSharedTask } = await import("@/services/sharedListService");
        await deleteSharedTask(selectedList.id, taskId);
        toast.success("Tâche supprimée");
      } catch (err) {
        toast.error("Impossible de supprimer la tâche. Vérifiez votre accès.");
      }
    },
    [selectedList]
  );

  const handleAddMember = useCallback(
    async (email) => {
      if (!selectedList) {
        toast.error("Aucune escouade sélectionnée.");
        return;
      }
      try {
        const { addMemberToList } = await import("@/services/sharedListService");
        await addMemberToList(selectedList.id, email);
        toast.success(`${email} a été invité à l'escouade`);
      } catch (err) {
        const message = err?.message?.includes("already") 
          ? `${email} est déjà dans l'escouade.`
          : err?.message?.includes("not found")
          ? `${email} n'existe pas.`
          : "Impossible d'inviter le membre. Vérifiez votre accès.";
        toast.error(message);
      }
    },
    [selectedList]
  );

  const handleRemoveMember = useCallback(
    async (memberEmail) => {
      if (!selectedList) {
        toast.error("Aucune escouade sélectionnée.");
        return;
      }
      if (!user) {
        toast.error("Vous devez être connecté.");
        return;
      }
      try {
        const { removeMemberFromList } = await import("@/services/sharedListService");
        await removeMemberFromList(selectedList.id, memberEmail, user.uid);
        setMembers(prevMembers => prevMembers.filter(m => m.email?.toLowerCase() !== memberEmail?.toLowerCase()));
        toast.success(`${memberEmail} a été retiré de l'escouade`);
      } catch (err) {
        const message = err?.message?.includes("permission")
          ? "Seul l'administrateur peut retirer des membres."
          : "Impossible de retirer le membre. Vérifiez votre accès.";
        toast.error(message);
      }
    },
    [selectedList, user]
  );

  const handleUpdateMemberRole = useCallback(
    async (memberEmail, newRole) => {
      if (!selectedList) {
        toast.error("Aucune escouade sélectionnée.");
        return;
      }
      if (!user) {
        toast.error("Vous devez être connecté.");
        return;
      }
      try {
        const { updateMemberRole } = await import("@/services/sharedListService");
        await updateMemberRole(selectedList.id, memberEmail, newRole, user.uid);
        setMembers(prevMembers => 
          prevMembers.map(m => 
            m.email?.toLowerCase() === memberEmail?.toLowerCase() 
              ? { ...m, role: newRole }
              : m
          )
        );
        const roleLabel = newRole === "admin" ? "Chef" : newRole === "editor" ? "Éditeur" : "Lecteur";
        toast.success(`Rôle de ${memberEmail} mis à jour en ${roleLabel}`);
      } catch (err) {
        const message = err?.message?.includes("permission")
          ? "Seul l'administrateur peut modifier les rôles."
          : "Impossible de mettre à jour le rôle. Vérifiez votre accès.";
        toast.error(message);
      }
    },
    [selectedList, user]
  );

  // Memo des tâches enrichies avec l'email de l'auteur (performance ++)
  const processedTasks = useMemo(
    () =>
      sharedTasks.map((task) => ({
        ...task,
        // Affiche l'email de l'auteur si possible
        addedBy:
          members.find((m) => m.email?.toLowerCase() === task.addedBy?.toLowerCase())?.email ||
          task.addedBy,
      })),
    [sharedTasks, members]
  );

  if (authLoading || listsLoading) {
    return (
      <main className="min-h-screen s flex-col items-center justify-center bg-[#151310] text-[#e3d5b8]">
        <div className="text-lg font-headline uppercase tracking-widest text-[#c28e46]">
          Chargement des Escouades...
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#151310] text-[#e3d5b8]">
        <div className="text-lg font-headline uppercase tracking-widest text-[#c28e46]">
          Veuillez vous connecter pour accéder aux Escouades.
        </div>
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
          <p className="text-[#8a8171] font-label text-sm uppercase tracking-wider">
            Regroupez-vous pour accomplir de plus grandes quêtes
          </p>
          <div className="h-1 w-24 bg-[#c28e46] mx-auto mt-4"></div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-6 bg-[#93000a]/20 border-2 border-[#93000a] text-[#ffb4ab] rounded font-medium">
            {error}
          </div>
        )}

        {!selectedList ? (
          <>
            {/* Create Squad Form */}
            <div className="bg-[#211f1c] border-4 border-[#504538] p-8">
              <h2 className="font-headline text-2xl text-[#c28e46] mb-6 uppercase tracking-widest">
                Former une nouvelle Escouade
              </h2>
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
                  <p className="text-[#5c564c] font-body text-sm">
                    Créez votre première Escouade pour recruter des Chasseurs et accomplir des quêtes ensemble!
                  </p>
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
                            <Users size={14} /> {list.members?.length || 0} Chasseur
                            {(list.members?.length || 0) > 1 ? "s" : ""}
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
        ) : (
          <SharedListView
            list={selectedList}
            tasks={processedTasks}
            currentUserId={user.uid}
            currentUserEmail={user.email}
            members={members}
            onBack={handleCloseList}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onAddMember={handleAddMember}
            onRemoveMember={handleRemoveMember}
            onUpdateMemberRole={handleUpdateMemberRole}
            tasksLoading={tasksLoading}
            tasksError={tasksError}
          />
        )}
      </div>
    </main>
  );
}
