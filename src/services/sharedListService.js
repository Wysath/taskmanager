import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// 1. Crée une nouvelle liste partagée
export async function createSharedList(userId, name, userEmail) {
  try {
    const ref = collection(db, "sharedLists");
    const docRef = await addDoc(ref, {
      name,
      ownerId: userId,
      members: [{ email: userEmail, role: "admin" }],
      createdAt: serverTimestamp(),
    });
    return { 
      id: docRef.id, 
      name, 
      ownerId: userId, 
      members: [{ email: userEmail, role: "admin" }] 
    };
  } catch (err) {
    console.error("[createSharedList]", err);
    throw err;
  }
}

// 2. Récupère les listes où l'utilisateur est membre
export async function getUserSharedLists(userEmail) {
  try {
    // Récupère toutes les listes et filtre côté client
    const ref = collection(db, "sharedLists");
    const snap = await getDocs(ref);
    const lists = snap.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((list) => {
        // Filtre les listes où l'utilisateur est membre
        if (!Array.isArray(list.members)) return false;
        return list.members.some((m) => m.email === userEmail || m.email?.toLowerCase() === userEmail?.toLowerCase());
      });
    return lists;
  } catch (err) {
    console.error("[getUserSharedLists]", err);
    throw err;
  }
}

// 3. Écoute en temps réel les listes partagées
export function subscribeToSharedLists(userEmail, callback) {
  const ref = collection(db, "sharedLists");
  return onSnapshot(
    ref,
    (snap) => {
      const lists = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((list) => {
          // Filtre les listes où l'utilisateur est membre
          if (!Array.isArray(list.members)) return false;
          return list.members.some((m) => m.email === userEmail || m.email?.toLowerCase() === userEmail?.toLowerCase());
        });
      callback(lists, null);
    },
    (err) => {
      console.error("[subscribeToSharedLists]", err);
      callback([], err.message);
    }
  );
}

// 4. Ajoute un membre par email avec le rôle 'editor'
export async function addMemberToList(listId, email) {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    
    // Cherche l'utilisateur par email (avec lowercase pour robustesse)
    const usersQ = query(
      collection(db, "users"), 
      where("email", "==", normalizedEmail)
    );
    const usersSnap = await getDocs(usersQ);
    
    if (!usersSnap.empty) {
      const listRef = doc(db, "sharedLists", listId);
      await updateDoc(listRef, { 
        members: arrayUnion({ email: normalizedEmail, role: "editor" }) 
      });
      return normalizedEmail;
    }
    
    // Fallback : cherche tous les users et filtre par email localement (cas où l'email est stocké en casse différente)
    const allUsersQ = query(collection(db, "users"));
    const allUsersSnap = await getDocs(allUsersQ);
    const matchingUser = allUsersSnap.docs.find(doc => {
      const userEmail = doc.data().email?.trim().toLowerCase();
      return userEmail === normalizedEmail;
    });
    
    if (matchingUser) {
      const listRef = doc(db, "sharedLists", listId);
      await updateDoc(listRef, { 
        members: arrayUnion({ email: normalizedEmail, role: "editor" }) 
      });
      return normalizedEmail;
    }
    
    throw new Error(`Aucun utilisateur trouvé avec l'email ${email}. Assurez-vous que cet utilisateur s'est inscrit.`);
  } catch (err) {
    console.error("[addMemberToList]", err);
    throw err;
  }
}

// 5. Retire un membre (seul l'admin peut)
export async function removeMemberFromList(listId, memberEmail, currentUserId) {
  try {
    const listRef = doc(db, "sharedLists", listId);
    const listSnap = await getDoc(listRef);
    if (!listSnap.exists()) throw new Error("Liste introuvable");
    const list = listSnap.data();
    if (list.ownerId !== currentUserId) throw new Error("Seul l'administrateur peut retirer un membre");
    
    // Trouve et retire le membre avec cet email
    const memberToRemove = list.members.find(m => m.email?.toLowerCase() === memberEmail?.toLowerCase());
    if (memberToRemove) {
      await updateDoc(listRef, { members: arrayRemove(memberToRemove) });
    }
  } catch (err) {
    console.error("[removeMemberFromList]", err);
    throw err;
  }
}

// 5b. Met à jour le rôle d'un membre (seul l'admin peut)
export async function updateMemberRole(listId, memberEmail, newRole, currentUserId) {
  try {
    if (!["admin", "editor", "viewer"].includes(newRole)) {
      throw new Error("Rôle invalide. Rôles acceptés: admin, editor, viewer");
    }

    const listRef = doc(db, "sharedLists", listId);
    const listSnap = await getDoc(listRef);
    if (!listSnap.exists()) throw new Error("Liste introuvable");
    
    const list = listSnap.data();
    if (list.ownerId !== currentUserId) {
      throw new Error("Seul l'administrateur peut modifier les rôles des membres");
    }
    
    // Trouve le membre et met à jour son rôle
    const memberIndex = list.members.findIndex(m => m.email?.toLowerCase() === memberEmail?.toLowerCase());
    if (memberIndex === -1) {
      throw new Error("Membre introuvable");
    }

    // Construit le nouvel array de membres
    const updatedMembers = [...list.members];
    updatedMembers[memberIndex] = { ...updatedMembers[memberIndex], role: newRole };
    
    await updateDoc(listRef, { members: updatedMembers });
  } catch (err) {
    console.error("[updateMemberRole]", err);
    throw err;
  }
}

// 5c. Met à jour son propre rôle (utilisateur peut changer son propre rôle)
export async function updateMyRole(listId, userEmail, newRole) {
  try {
    if (!["admin", "editor", "viewer"].includes(newRole)) {
      throw new Error("Rôle invalide. Rôles acceptés: admin, editor, viewer");
    }

    const listRef = doc(db, "sharedLists", listId);
    const listSnap = await getDoc(listRef);
    if (!listSnap.exists()) throw new Error("Liste introuvable");
    
    const list = listSnap.data();
    
    // Trouve le membre (l'utilisateur courant)
    const memberIndex = list.members.findIndex(m => m.email?.toLowerCase() === userEmail?.toLowerCase());
    if (memberIndex === -1) {
      throw new Error("Vous n'êtes pas membre de cette escouade");
    }

    // Empêche de passer soi-même admin si on ne l'est pas déjà
    const currentRole = list.members[memberIndex].role;
    if (currentRole !== "admin" && newRole === "admin") {
      throw new Error("Vous ne pouvez pas vous donner le rôle de chef");
    }

    // Construit le nouvel array de membres
    const updatedMembers = [...list.members];
    updatedMembers[memberIndex] = { ...updatedMembers[memberIndex], role: newRole };
    
    await updateDoc(listRef, { members: updatedMembers });
  } catch (err) {
    console.error("[updateMyRole]", err);
    throw err;
  }
}

// 6. Supprime la liste (et ses tâches)
export async function deleteSharedList(listId, userId) {
  try {
    const listRef = doc(db, "sharedLists", listId);
    const listSnap = await getDoc(listRef);
    if (!listSnap.exists()) throw new Error("Liste introuvable");
    const list = listSnap.data();
    if (list.ownerId !== userId) throw new Error("Seul le propriétaire peut supprimer la liste");
    // Supprime toutes les tâches
    const tasksRef = collection(db, `sharedLists/${listId}/tasks`);
    const tasksSnap = await getDocs(tasksRef);
    const batch = [];
    tasksSnap.forEach((taskDoc) => batch.push(deleteDoc(taskDoc.ref)));
    await Promise.all(batch);
    await deleteDoc(listRef);
  } catch (err) {
    console.error("[deleteSharedList]", err);
    throw err;
  }
}

// 7. Récupère les tâches d'une liste partagée
export async function getSharedListTasks(listId) {
  try {
    const q = query(collection(db, `sharedLists/${listId}/tasks`), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("[getSharedListTasks]", err);
    throw err;
  }
}

// 8. Ajoute une tâche à une liste partagée
export async function addSharedTask(listId, userId, task) {
  try {
    const ref = collection(db, `sharedLists/${listId}/tasks`);
    await addDoc(ref, {
      title: task.title,
      completed: false,
      priority: task.priority || "medium",
      createdAt: serverTimestamp(),
      addedBy: userId,
    });
  } catch (err) {
    console.error("[addSharedTask]", err);
    throw err;
  }
}

// 9. Met à jour une tâche partagée
export async function updateSharedTask(listId, taskId, updates) {
  try {
    const ref = doc(db, `sharedLists/${listId}/tasks/${taskId}`);
    await updateDoc(ref, updates);
  } catch (err) {
    console.error("[updateSharedTask]", err);
    throw err;
  }
}

// 10. Supprime une tâche partagée
export async function deleteSharedTask(listId, taskId) {
  try {
    const ref = doc(db, `sharedLists/${listId}/tasks/${taskId}`);
    await deleteDoc(ref);
  } catch (err) {
    console.error("[deleteSharedTask]", err);
    throw err;
  }
}

// 11. Écoute les tâches en temps réel
export function subscribeToSharedTasks(listId, callback) {
  const q = query(collection(db, `sharedLists/${listId}/tasks`), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      callback(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })), null);
    },
    (err) => {
      console.error("[subscribeToSharedTasks]", err);
      callback([], err.message);
    }
  );
}
