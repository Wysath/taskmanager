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
export async function createSharedList(userId, name) {
  try {
    const ref = collection(db, "sharedLists");
    const docRef = await addDoc(ref, {
      name,
      ownerId: userId,
      members: [userId],
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, name, ownerId: userId, members: [userId] };
  } catch (err) {
    console.error("[createSharedList]", err);
    throw err;
  }
}

// 2. Récupère les listes où l'utilisateur est membre
export async function getUserSharedLists(userId) {
  try {
    const q = query(collection(db, "sharedLists"), where("members", "array-contains", userId));
    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("[getUserSharedLists]", err);
    throw err;
  }
}

// 3. Écoute en temps réel les listes partagées
export function subscribeToSharedLists(userId, callback) {
  const q = query(collection(db, "sharedLists"), where("members", "array-contains", userId));
  return onSnapshot(
    q,
    (snap) => {
      callback(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })), null);
    },
    (err) => {
      console.error("[subscribeToSharedLists]", err);
      callback([], err.message);
    }
  );
}

// 4. Ajoute un membre par email
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
      const userDoc = usersSnap.docs[0];
      const userUid = userDoc.data().uid || userDoc.id;
      const listRef = doc(db, "sharedLists", listId);
      await updateDoc(listRef, { members: arrayUnion(userUid) });
      return userUid;
    }
    
    // Fallback : cherche tous les users et filtre par email localement (cas où l'email est stocké en casse différente)
    const allUsersQ = query(collection(db, "users"));
    const allUsersSnap = await getDocs(allUsersQ);
    const matchingUser = allUsersSnap.docs.find(doc => {
      const userEmail = doc.data().email?.trim().toLowerCase();
      return userEmail === normalizedEmail;
    });
    
    if (matchingUser) {
      const userUid = matchingUser.data().uid || matchingUser.id;
      const listRef = doc(db, "sharedLists", listId);
      await updateDoc(listRef, { members: arrayUnion(userUid) });
      return userUid;
    }
    
    throw new Error(`Aucun utilisateur trouvé avec l'email ${email}. Assurez-vous que cet utilisateur s'est inscrit.`);
  } catch (err) {
    console.error("[addMemberToList]", err);
    throw err;
  }
}

// 5. Retire un membre (seul le owner peut)
export async function removeMemberFromList(listId, memberUidToRemove, currentUserId) {
  try {
    const listRef = doc(db, "sharedLists", listId);
    const listSnap = await getDoc(listRef);
    if (!listSnap.exists()) throw new Error("Liste introuvable");
    const list = listSnap.data();
    if (list.ownerId !== currentUserId) throw new Error("Seul le propriétaire peut retirer un membre");
    await updateDoc(listRef, { members: arrayRemove(memberUidToRemove) });
  } catch (err) {
    console.error("[removeMemberFromList]", err);
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
