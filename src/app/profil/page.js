"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { LogOut, ArrowLeft, User, CheckCircle2, Crown, Shield, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { subscribeToSharedLists, updateMemberRole, updateMyRole } from "@/services/sharedListService";
import { deleteUser } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, writeBatch, doc } from "firebase/firestore";
import toast from "react-hot-toast";
import Modal from "@/components/Modal";

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

  // Charger les escouades où l'utilisateur est admin ET toutes les escouades où il a un rôle
  useEffect(() => {
    if (!user?.email) {
      setLoadingSquads(false);
      return;
    }

    const unsubscribe = subscribeToSharedLists(user.email, (lists) => {
      // Filter escouades where user is admin
      const adminSquads = lists.filter(list => {
        const userMember = list.members?.find(m => m.email?.toLowerCase() === user.email?.toLowerCase());
        return userMember?.role === "admin";
      });
      setSquads(adminSquads);
      
      // Store all squads where user is member (for "Mes Rôles" section)
      setAllSquads(lists);
      setLoadingSquads(false);
    });

    return () => unsubscribe();
  }, [user?.email]);

  const toggleSquadExpanded = (squadId) => {
    setExpandedSquads(prev => ({
      ...prev,
      [squadId]: !prev[squadId]
    }));
  };

  const toggleMyRolesExpanded = (squadId) => {
    setExpandedMyRoles(prev => ({
      ...prev,
      [squadId]: !prev[squadId]
    }));
  };

  const handleRoleChange = async (squadId, memberEmail, newRole) => {
    const changeKey = `${squadId}-${memberEmail}`;
    setUpdatingRoles(prev => ({ ...prev, [changeKey]: true }));
    
    try {
      await updateMemberRole(squadId, memberEmail, newRole, user.uid);
      toast.success(`Rôle de ${memberEmail} mis à jour`);
    } catch (err) {
      toast.error(err.message || "Erreur lors de la mise à jour du rôle");
      console.error("[handleRoleChange]", err);
    } finally {
      setUpdatingRoles(prev => ({ ...prev, [changeKey]: false }));
    }
  };

  const handleUpdateMyRole = async (squadId, newRole) => {
    const changeKey = `myRole-${squadId}`;
    setUpdatingRoles(prev => ({ ...prev, [changeKey]: true }));
    
    try {
      await updateMyRole(squadId, user.email, newRole);
      toast.success("Ton rôle a été mis à jour");
    } catch (err) {
      toast.error(err.message || "Erreur lors de la mise à jour du rôle");
      console.error("[handleUpdateMyRole]", err);
    } finally {
      setUpdatingRoles(prev => ({ ...prev, [changeKey]: false }));
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmInput !== "CONFIRMER") {
      toast.error("Vous devez taper 'CONFIRMER' pour continuer");
      return;
    }

    setIsDeleting(true);
    try {
      // Étape 1: Supprimer toutes les tâches de l'utilisateur avec batch
      const tasksRef = collection(db, `users/${user.uid}/tasks`);
      const tasksSnapshot = await getDocs(tasksRef);
      
      if (tasksSnapshot.docs.length > 0) {
        const batch = writeBatch(db);
        tasksSnapshot.docs.forEach((docSnap) => {
          batch.delete(docSnap.ref);
        });
        await batch.commit();
      }

      // Étape 2: Supprimer le document utilisateur s'il existe
      const userDocRef = doc(db, "users", user.uid);
      const batch = writeBatch(db);
      batch.delete(userDocRef);
      await batch.commit();

      // Étape 3: Supprimer le compte Firebase Auth
      const currentUser = auth.currentUser;
      if (currentUser) {
        await deleteUser(currentUser);
      }

      // Étape 4: Redirection vers /login
      toast.success("Compte supprimé avec succès");
      setShowDeleteModal(false);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      console.error("[handleDeleteAccount]", err);
      
      // Gestion des erreurs spécifiques
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
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logOut();
      router.push("/login");
    } catch (err) {
      console.error("Erreur logout:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#151310]">
        <div className="text-center">
          <span className="text-2xl font-headline text-[#c28e46]">Chargement...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const displayName = user.displayName || "Utilisateur";
  const email = user.email || "";
  const avatarUrl = user.photoURL || null;

  return (
    <div className="min-h-screen bg-[#151310] text-[#e3d5b8]">
      {/* Main content */}
      <div className="ml-72 min-h-screen p-8">
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
            ) : squads.length === 0 ? (
              <p className="text-[#8a8171] font-body italic">Vous n'êtes chef d'aucune escouade.</p>
            ) : (
              <div className="space-y-4">
                {squads.map(squad => (
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
                            {squad.members?.length || 0} membre{(squad.members?.length || 0) > 1 ? 's' : ''}
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
                        {squad.members?.map(member => (
                          <div key={member.email} className="flex items-center justify-between gap-3 p-3 bg-[#3a3835] border border-[#504538]">
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
                            {member.email?.toLowerCase() !== user.email?.toLowerCase() && (
                              <select
                                value={member.role || "editor"}
                                onChange={(e) => handleRoleChange(squad.id, member.email, e.target.value)}
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
                            {member.email?.toLowerCase() === user.email?.toLowerCase() && (
                              <div className="px-3 py-2 bg-[#c28e46] text-[#151310] font-label text-xs uppercase rounded font-bold">
                                Vous
                              </div>
                            )}
                          </div>
                        ))}
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
            ) : allSquads.filter(list => {
              const userMember = list.members?.find(m => m.email?.toLowerCase() === user.email?.toLowerCase());
              return userMember && userMember.role !== "admin";
            }).length === 0 ? (
              <p className="text-[#8a8171] font-body italic">Vous n'êtes membre d'aucune escouade (sauf en tant que chef).</p>
            ) : (
              <div className="space-y-4">
                {allSquads.filter(list => {
                  const userMember = list.members?.find(m => m.email?.toLowerCase() === user.email?.toLowerCase());
                  return userMember && userMember.role !== "admin";
                }).map(squad => {
                  const userMember = squad.members?.find(m => m.email?.toLowerCase() === user.email?.toLowerCase());
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
                              Chef: {squad.members?.find(m => m.role === "admin")?.email || "Inconnu"}
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
                            {/* Dropdown pour changer ton propre rôle */}
                            <select
                              value={userMember?.role || "viewer"}
                              onChange={(e) => handleUpdateMyRole(squad.id, e.target.value)}
                              disabled={updatingRoles[`myRole-${squad.id}`]}
                              className="bg-[#2c2a26] text-[#e3d5b8] border border-[#504538] px-3 py-2 font-label text-xs uppercase rounded cursor-pointer hover:border-[#c28e46] transition-colors disabled:opacity-50"
                              aria-label="Changer ton rôle"
                            >
                              <option value="editor">Éditeur</option>
                              <option value="viewer">Lecteur</option>
                            </select>
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
            Rendre son Insigne
          </Modal.Title>
          <Modal.Subtitle>
            Vous êtes sur le point de supprimer votre compte définitivement. Cette action est irréversible.
          </Modal.Subtitle>
        </Modal.Header>

        <Modal.DangerZone>
          <h3>⚠️ Attention</h3>
          <p>Toutes vos tâches seront supprimées définitivement.</p>
        </Modal.DangerZone>

        <Modal.Body>
          <div className="form-group">
            <label className="form-label form-label-required">
              Confirmez en tapant "CONFIRMER"
            </label>
            <input
              type="text"
              value={deleteConfirmInput}
              onChange={(e) => setDeleteConfirmInput(e.target.value)}
              placeholder="CONFIRMER"
              className="input-base input-lg"
              disabled={isDeleting}
              aria-label="Confirmation de suppression"
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button
            onClick={() => {
              setShowDeleteModal(false);
              setDeleteConfirmInput("");
            }}
            disabled={isDeleting}
            className="btn btn-secondary"
          >
            Annuler
          </button>
          <button
            onClick={handleDeleteAccount}
            disabled={isDeleting || deleteConfirmInput !== "CONFIRMER"}
            className="btn btn-error"
          >
            {isDeleting ? "Suppression..." : "Supprimer définitivement"}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProfilePage;