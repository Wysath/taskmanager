"use client";

// Imports: Regroupés par bloc logique
// 1. React & hooks
import React, { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
// 2. Context & Router
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
// Firebase imports moved to lazy-load in handlers to prevent blocking mobile render
// 3. Services internes (also lazy-loaded in handlers)
// Services will be imported on demand in useCallback handlers
// 5. Composants
import Modal from "@/components/Modal";
// 6. Outils externes UI
import toast from "react-hot-toast";
// 7. Icônes
import {
  LogOut,
  ArrowLeft,
  User,
  CheckCircle2,
  Crown,
  Shield,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from "lucide-react";

const ProfilePage = () => {
  const { user, loading, logOut } = useAuth();
  const router = useRouter();

  const [squads, setSquads] = useState([]);
  const [loadingSquads, setLoadingSquads] = useState(true);
  const [expandedSquads, setExpandedSquads] = useState({});
  const [updatingRoles, setUpdatingRoles] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [allSquads, setAllSquads] = useState([]);
  const [expandedMyRoles, setExpandedMyRoles] = useState({});

  // Subscribe aux shared lists (écouteur temps réel : clean-up garanti)
  // Lazy-load the subscription service to prevent blocking initial render
  useEffect(() => {
    if (!user?.email) {
      setLoadingSquads(false);
      return;
    }

    let unsubscribe;
    
    (async () => {
      try {
        const { subscribeToSharedLists } = await import("@/services/sharedListService");
        
        unsubscribe = subscribeToSharedLists(user.email, (lists) => {
          // Calcul immédiat pour redux et autres parties
          const adminSquads = lists.filter((list) => {
            const userMember = list.members?.find(
              (m) => m.email?.toLowerCase() === user.email?.toLowerCase()
            );
            return userMember?.role === "admin";
          });
          setSquads(adminSquads);
          setAllSquads(lists);
          setLoadingSquads(false);
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[subscribeToSharedLists]", err);
        setLoadingSquads(false);
      }
    })();

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [user?.email]);

  // useCallback pour fonctions passées en props ou à des composants enfants
  const toggleSquadExpanded = useCallback((squadId) => {
    setExpandedSquads((prev) => ({
      ...prev,
      [squadId]: !prev[squadId],
    }));
  }, []);

  const toggleMyRolesExpanded = useCallback((squadId) => {
    setExpandedMyRoles((prev) => ({
      ...prev,
      [squadId]: !prev[squadId],
    }));
  }, []);

  const handleRoleChange = useCallback(
    async (squadId, memberEmail, newRole) => {
      const changeKey = `${squadId}-${memberEmail}`;
      setUpdatingRoles((prev) => ({ ...prev, [changeKey]: true }));

      try {
        const { updateMemberRole } = await import("@/services/sharedListService");
        await updateMemberRole(squadId, memberEmail, newRole, user.uid);
        toast.success(`Rôle de ${memberEmail} mis à jour`);
      } catch (err) {
        toast.error(err.message || "Erreur lors de la mise à jour du rôle");
        // eslint-disable-next-line no-console
        console.error("[handleRoleChange]", err);
      } finally {
        setUpdatingRoles((prev) => ({ ...prev, [changeKey]: false }));
      }
    },
    [user?.uid]
  );

  const handleUpdateMyRole = useCallback(
    async (squadId, newRole) => {
      const changeKey = `myRole-${squadId}`;
      setUpdatingRoles((prev) => ({ ...prev, [changeKey]: true }));

      try {
        const { updateMyRole } = await import("@/services/sharedListService");
        await updateMyRole(squadId, user.email, newRole);
        toast.success("Ton rôle a été mis à jour");
      } catch (err) {
        toast.error(err.message || "Erreur lors de la mise à jour du rôle");
        // eslint-disable-next-line no-console
        console.error("[handleUpdateMyRole]", err);
      } finally {
        setUpdatingRoles((prev) => ({ ...prev, [changeKey]: false }));
      }
    },
    [user?.email]
  );

  const handleDeleteAccount = useCallback(async () => {
    if (deleteConfirmInput !== "CONFIRMER") {
      toast.error("Vous devez taper 'CONFIRMER' pour continuer");
      return;
    }

    setIsDeleting(true);
    try {
      // Lazy-load Firebase modules to prevent blocking main thread
      const { collection, getDocs, writeBatch, doc, query, where, updateDoc, arrayRemove } = await import("@firebase/firestore");
      const { deleteUser } = await import("@firebase/auth");
      const { db, auth } = await import("@/lib/firebase");

      const userEmail = user.email?.toLowerCase();

      // Étape 1: Supprimer toutes les tâches personnelles de l'utilisateur
      const tasksRef = collection(db, `users/${user.uid}/tasks`);
      const tasksSnapshot = await getDocs(tasksRef);

      if (tasksSnapshot.docs.length > 0) {
        const batch = writeBatch(db);
        tasksSnapshot.docs.forEach((docSnap) => {
          batch.delete(docSnap.ref);
        });
        await batch.commit();
      }

      // Étape 2: Gérer les escouades (listes partagées)
      const sharedListsRef = collection(db, "sharedLists");
      const allListsSnapshot = await getDocs(sharedListsRef);
      
      const batch2 = writeBatch(db);
      
      for (const listDoc of allListsSnapshot.docs) {
        const listData = listDoc.data();
        const listId = listDoc.id;
        
        // Si l'utilisateur est le propriétaire, supprimer toute la liste et ses tâches
        if (listData.ownerId === user.uid) {
          // Supprimer toutes les tâches de cette liste
          const tasksInListRef = collection(db, `sharedLists/${listId}/tasks`);
          const tasksInListSnapshot = await getDocs(tasksInListRef);
          
          tasksInListSnapshot.docs.forEach((taskDoc) => {
            batch2.delete(taskDoc.ref);
          });
          
          // Supprimer la liste elle-même
          batch2.delete(listDoc.ref);
        } else if (listData.members && Array.isArray(listData.members)) {
          // Sinon, retirer l'utilisateur de la liste des membres
          const updatedMembers = listData.members.filter(
            (m) => m.email?.toLowerCase() !== userEmail
          );
          batch2.update(listDoc.ref, { members: updatedMembers });
        }
      }
      
      await batch2.commit();

      // Étape 3: Supprimer le document utilisateur s'il existe
      const userDocRef = doc(db, "users", user.uid);
      const batch3 = writeBatch(db);
      batch3.delete(userDocRef);
      await batch3.commit();

      // Étape 4: Supprimer le compte Firebase Auth
      const currentUser = auth.currentUser;
      if (currentUser) {
        await deleteUser(currentUser);
      }

      // Étape 5: Redirection vers /login
      toast.success("Compte et toutes les données supprimés avec succès");
      setShowDeleteModal(false);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[handleDeleteAccount]", err);

      if (err.code === "auth/requires-recent-login") {
        toast.error("Vous devez vous reconnecter avant de supprimer votre compte");
        setShowDeleteModal(false);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast.error(err.message || "Erreur lors de la suppression du compte");
      }
    } finally {
      setIsDeleting(false);
    }
  }, [deleteConfirmInput, router, user?.uid, user?.email]);

  // Sécurité navigation : redirection si déconnecté
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  const handleLogout = useCallback(async () => {
    try {
      await logOut();
      router.push("/login");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Erreur logout:", err);
    }
  }, [logOut, router]);

  // useMemo pour listes filtrées
  // 1. Mes Escouades (où je suis admin)
  const memoizedSquads = useMemo(() => squads, [squads]);

  // 2. Mes rôles (où je ne suis pas admin)
  const myRolesSquads = useMemo(() => {
    return allSquads.filter((list) => {
      const userMember = list.members?.find(
        (m) => m.email?.toLowerCase() === user?.email?.toLowerCase()
      );
      return userMember && userMember.role !== "admin";
    });
  }, [allSquads, user?.email]);

  const displayName = user?.displayName || "Utilisateur";
  const email = user?.email || "";
  const avatarUrl = user?.photoURL || null;

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#151310] text-[#e3d5b8]">
      {!user ? null : (
      <div suppressHydrationWarning>
        {/* Main content */}
        <div className="md:ml-72 min-h-screen p-8">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-[#c28e46] hover:text-[#e8e1dc] transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-headline uppercase tracking-widest">Retour</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[#8a8171] hover:text-[#e8e1dc] transition-colors hover:bg-[#2c2a26] px-4 py-2 rounded"
          >
            <LogOut size={20} />
            <span className="font-label uppercase text-xs font-semibold tracking-wider">Déconnexion</span>
          </button>
        </div>

        {/* Profile card */}
        <div className="max-w-2xl">
          <div className="bg-[#211f1c] border-4 border-[#504538] p-8 mb-8">
            {/* Avatar */}
            <div className="flex items-center gap-8 mb-8 pb-8 border-b border-[#504538]">
              <div className="w-32 h-32 bg-[#2c2a26] flex items-center justify-center border-4 border-[#c28e46]">
                {avatarUrl ? (
                  <img
                    alt={displayName}
                    className="w-full h-full object-cover"
                    src={avatarUrl}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User size={56} className="text-[#8a8171]" />
                )}
              </div>
              <div>
                <h1 className="font-headline text-4xl text-[#e8e1dc] mb-2 uppercase tracking-widest">{displayName}</h1>
                <p className="text-[#8a8171] font-label text-sm">{email}</p>
              </div>
            </div>

            {/* Profile info */}
            <div className="space-y-6">
              <div>
                <h2 className="font-headline text-xl text-[#c28e46] mb-3 uppercase tracking-widest">Informations du Chasseur</h2>
                <div className="space-y-3 text-[#e3d5b8]">
                  <div className="flex justify-between items-center pb-2 border-b border-[#504538]/50">
                    <span className="font-label text-xs uppercase tracking-wider text-[#8a8171]">Nom</span>
                    <span className="font-body">{displayName}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-[#504538]/50">
                    <span className="font-label text-xs uppercase tracking-wider text-[#8a8171]">E-mail</span>
                    <span className="font-body break-all">{email}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-[#504538]/50">
                    <span className="font-label text-xs uppercase tracking-wider text-[#8a8171]">Statut</span>
                    <div className="flex items-center gap-1 text-[#c28e46]">
                      <CheckCircle2 size={16} />
                      <span className="font-body">Connecté</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-[#211f1c] border-4 border-[#504538] p-8 mb-8">
            <h2 className="font-headline text-xl text-[#c28e46] mb-6 uppercase tracking-widest">Actions</h2>
            <div className="flex gap-4">
              <button
                onClick={() => router.push("/taches")}
                className="flex-1 bg-[#2c2a26] text-[#e8e1dc] border-2 border-[#c28e46] py-3 hover:bg-[#c28e46] hover:text-[#151310] transition-colors font-headline uppercase text-sm tracking-widest"
              >
                Mes Tâches
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-[#93000a] text-[#e3d5b8] border-2 border-[#93000a] py-3 hover:bg-[#c21e1e] transition-colors font-headline uppercase text-sm tracking-widest"
              >
                Déconnexion
              </button>
            </div>
          </div>

          {/* My Squads Section */}
          <div className="bg-[#211f1c] border-4 border-[#504538] p-8">
            <h2 className="font-headline text-xl text-[#c28e46] mb-6 uppercase tracking-widest flex items-center gap-2">
              <Crown size={24} />
              Mes Escouades (Chef)
            </h2>

            {loadingSquads ? (
              <p className="text-[#8a8171] font-body italic">Chargement des escouades...</p>
            ) : memoizedSquads.length === 0 ? (
              <p className="text-[#8a8171] font-body italic">Vous n'êtes chef d'aucune escouade.</p>
            ) : (
              <div className="space-y-4">
                {memoizedSquads.map((squad) => (
                  <div key={squad.id} className="bg-[#2c2a26] border-2 border-[#504538] overflow-hidden">
                    {/* Squad header */}
                    <button
                      onClick={() => toggleSquadExpanded(squad.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-[#3a3835] transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 text-left">
                        <Crown size={18} className="text-[#c28e46] shrink-0" />
                        <div>
                          <h3 className="font-headline text-[#e3d5b8] uppercase tracking-widest">{squad.name}</h3>
                          <p className="text-[#8a8171] font-label text-xs">
                            {squad.members?.length || 0} membre{(squad.members?.length || 0) > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      {expandedSquads[squad.id] ? (
                        <ChevronUp size={18} className="text-[#c28e46]" />
                      ) : (
                        <ChevronDown size={18} className="text-[#c28e46]" />
                      )}
                    </button>

                    {/* Squad members */}
                    {expandedSquads[squad.id] && (
                      <div className="border-t border-[#504538] p-4 space-y-3">
                        {squad.members?.map((member) => {
                          const isCurrentUser = member.email?.toLowerCase() === user.email?.toLowerCase();
                          return (
                            <div
                              key={member.email}
                              className="flex items-center justify-between gap-3 p-3 bg-[#3a3835] border border-[#504538]"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div className="w-8 h-8 bg-[#c28e46] flex items-center justify-center text-[#151310] font-bold rounded text-xs">
                                  {member.email?.[0]?.toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[#e3d5b8] font-body text-sm truncate">{member.email}</p>
                                  <p className="text-[#8a8171] font-label text-xs uppercase tracking-wider">
                                    {member.role === "admin" && "Chef d'Escouade"}
                                    {member.role === "editor" && "Éditeur"}
                                    {member.role === "viewer" && "Lecteur"}
                                  </p>
                                </div>
                              </div>

                              {/* Role selector - only for non-admin members */}
                              {!isCurrentUser && (
                                <select
                                  value={member.role || "editor"}
                                  onChange={(e) =>
                                    handleRoleChange(squad.id, member.email, e.target.value)
                                  }
                                  disabled={updatingRoles[`${squad.id}-${member.email}`]}
                                  className="bg-[#2c2a26] text-[#e3d5b8] border border-[#504538] px-3 py-2 font-label text-xs uppercase rounded cursor-pointer hover:border-[#c28e46] transition-colors disabled:opacity-50"
                                  aria-label={`Rôle de ${member.email}`}
                                >
                                  <option value="admin">Chef</option>
                                  <option value="editor">Éditeur</option>
                                  <option value="viewer">Lecteur</option>
                                </select>
                              )}

                              {/* Badge for current user */}
                              {isCurrentUser && (
                                <div className="px-3 py-2 bg-[#c28e46] text-[#151310] font-label text-xs uppercase rounded font-bold">
                                  Vous
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Roles Section - Escouades où l'utilisateur n'est pas admin */}
          <div className="bg-[#211f1c] border-4 border-[#504538] p-8 mt-8">
            <h2 className="font-headline text-xl text-[#c28e46] mb-6 uppercase tracking-widest flex items-center gap-2">
              <Shield size={24} />
              Mes Rôles
            </h2>

            {loadingSquads ? (
              <p className="text-[#8a8171] font-body italic">Chargement...</p>
            ) : myRolesSquads.length === 0 ? (
              <p className="text-[#8a8171] font-body italic">Vous n'êtes membre d'aucune escouade (sauf en tant que chef).</p>
            ) : (
              <div className="space-y-4">
                {myRolesSquads.map((squad) => {
                  const userMember = squad.members?.find(
                    (m) => m.email?.toLowerCase() === user.email?.toLowerCase()
                  );
                  const isOwner = squad.ownerId === user?.uid;

                  return (
                    <div key={squad.id} className="bg-[#2c2a26] border-2 border-[#504538] overflow-hidden">
                      {/* Squad header */}
                      <button
                        onClick={() => toggleMyRolesExpanded(squad.id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-[#3a3835] transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 text-left">
                          <Shield size={18} className="text-[#c28e46] shrink-0" />
                          <div>
                            <h3 className="font-headline text-[#e3d5b8] uppercase tracking-widest">{squad.name}</h3>
                            <p className="text-[#8a8171] font-label text-xs">
                              Chef: {squad.members?.find((m) => m.role === "admin")?.email || "Inconnu"}
                            </p>
                          </div>
                        </div>
                        {expandedMyRoles[squad.id] ? (
                          <ChevronUp size={18} className="text-[#c28e46]" />
                        ) : (
                          <ChevronDown size={18} className="text-[#c28e46]" />
                        )}
                      </button>

                      {/* User role info */}
                      {expandedMyRoles[squad.id] && (
                        <div className="border-t border-[#504538] p-4 space-y-3">
                          <div className="flex items-center justify-between p-3 bg-[#3a3835] border border-[#504538]">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-8 h-8 bg-[#c28e46] flex items-center justify-center text-[#151310] font-bold rounded text-xs">
                                {user.email?.[0]?.toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[#e3d5b8] font-body text-sm truncate">{user.email}</p>
                                <p className="text-[#8a8171] font-label text-xs uppercase tracking-wider">
                                  {userMember?.role === "editor" && "Éditeur"}
                                  {userMember?.role === "viewer" && "Lecteur"}
                                </p>
                              </div>
                            </div>
                            {/* Affichage du rôle (lecture seule) */}
                            <div className="text-[#c28e46] font-label text-xs uppercase tracking-wider">
                              {userMember?.role === "editor" && "Éditeur"}
                              {userMember?.role === "viewer" && "Lecteur"}
                            </div>
                          </div>
                          {isOwner && (
                            <p className="text-[#c28e46] font-label text-xs italic">Vous êtes le chef de cette escouade.</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Delete Account Section - Red danger zone */}
          <div className="bg-[#211f1c] border-4 border-[#93000a] p-8 mt-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={28} className="text-[#93000a]" />
              <h2 className="font-headline text-xl text-[#93000a] uppercase tracking-widest">Zone Dangereuse</h2>
            </div>
            <p className="text-[#8a8171] font-body text-sm mb-6">
              Une fois votre compte supprimé, il ne peut être récupéré. Toutes vos tâches et données seront perdues définitivement.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full bg-[#93000a] text-[#e3d5b8] border-2 border-[#93000a] py-3 hover:bg-[#c21e1e] transition-colors font-headline uppercase text-sm tracking-widest"
            >
              Déserter la Guilde (Supprimer le compte)
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      <Modal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteConfirmInput("");
        }}
        variant="danger"
        size="medium"
      >
        <Modal.Header
          onClose={() => {
            setShowDeleteModal(false);
            setDeleteConfirmInput("");
          }}
        >
          <Modal.Title style={{ color: "var(--error)" }}>
            ⚔️ Rendre son Insigne
          </Modal.Title>
          <Modal.Subtitle>
            Cette action est <span className="font-bold text-[#93000a]">définitive et irréversible</span>
          </Modal.Subtitle>
        </Modal.Header>

        <Modal.DangerZone>
          <div className="space-y-4">
            <div className="flex gap-3">
              <AlertTriangle size={28} className="text-[#93000a] shrink-0 mt-1" />
              <div>
                <h3 className="font-headline text-lg text-[#e3d5b8] mb-2 uppercase tracking-widest">Conséquences permanentes</h3>
                <ul className="space-y-2 text-[#d4af9f]">
                  <li className="flex gap-2">
                    <span className="text-[#93000a] font-bold">→</span>
                    <span>Toutes vos <strong>tâches</strong> seront supprimées sans possibilité de récupération</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#93000a] font-bold">→</span>
                    <span>Vous serez <strong>automatiquement retiré</strong> de toutes les escouades</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#93000a] font-bold">→</span>
                    <span>Votre <strong>historique</strong> sera supprimé complètement</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#93000a] font-bold">→</span>
                    <span>Les autres utilisateurs ne pourront plus vous <strong>inviter</strong></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Modal.DangerZone>

        <Modal.Body>
          <div className="space-y-4">
            <div className="bg-[#2c2a26] border-l-4 border-[#93000a] p-4">
              <p className="text-[#d4af9f] font-body text-sm">
                Pour confirmer la suppression définitive de votre compte, tapez exactement:
              </p>
              <p className="text-[#c28e46] font-headline font-bold text-lg mt-1">CONFIRMER</p>
            </div>
            <div className="form-group">
              <input
                type="text"
                value={deleteConfirmInput}
                onChange={(e) => setDeleteConfirmInput(e.target.value)}
                placeholder="Tapez CONFIRMER ici"
                className="input-base input-lg font-mono tracking-widest text-center"
                disabled={isDeleting}
                aria-label="Confirmation de suppression"
                autoComplete="off"
              />
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button
            onClick={() => {
              setShowDeleteModal(false);
              setDeleteConfirmInput("");
            }}
            disabled={isDeleting}
            className="btn btn-secondary flex-1"
          >
            Annuler
          </button>
          <button
            onClick={handleDeleteAccount}
            disabled={isDeleting || deleteConfirmInput !== "CONFIRMER"}
            className="btn btn-error flex-1 relative overflow-hidden group"
          >
            {isDeleting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block animate-spin">⚙️</span>
                Suppression en cours...
              </span>
            ) : (
              <>
                <span className="relative z-10">💀 Supprimer définitivement</span>
                <span className="absolute inset-0 bg-[#c21e1e] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200 z-0" />
              </>
            )}
          </button>
        </Modal.Footer>
      </Modal>
      </div>
      )}
    </div>
  );
};

export default function ProfilPage() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}