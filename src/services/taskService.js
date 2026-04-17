import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  onSnapshot,
} from "@firebase/firestore";

/**
 * Récupère toutes les tâches privées d'un utilisateur
 */
export async function getUserTasks(userId) {
  try {
    const q = query(
      collection(db, `users/${userId}/tasks`),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
  } catch (err) {
    throw new Error("Impossible de récupérer les tâches : " + err.message);
  }
}

/**
 * Ajoute une tâche privée
 */
export async function addTask(userId, task) {
  try {
    const ref = collection(db, `users/${userId}/tasks`);
    const docRef = await addDoc(ref, {
      title: task.title,
      completed: false,
      priority: task.priority || "medium",
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (err) {
    throw new Error("Impossible d'ajouter la tâche : " + err.message);
  }
}

/**
 * Met à jour une tâche
 */
export async function updateTask(userId, taskId, updates) {
  try {
    const ref = doc(db, `users/${userId}/tasks/${taskId}`);
    await updateDoc(ref, updates);
  } catch (err) {
    throw new Error("Impossible de mettre à jour la tâche : " + err.message);
  }
}

/**
 * Supprime une tâche
 */
export async function deleteTask(userId, taskId) {
  try {
    const ref = doc(db, `users/${userId}/tasks/${taskId}`);
    await deleteDoc(ref);
  } catch (err) {
    throw new Error("Impossible de supprimer la tâche : " + err.message);
  }
}

/**
 * Écoute les changements en temps réel des tâches
 * /!\ IMPORTANT : Utiliser la fonction retournée pour cleanup dans useEffect (React)
 * @param {string} userId
 * @param {(tasks: Array, errorMsg?: string|null) => void} callback
 * @returns {() => void} unsubscribe (à utiliser dans le cleanup du useEffect)
 */
export function subscribeToTasks(userId, callback) {
  const q = query(
    collection(db, `users/${userId}/tasks`),
    orderBy("createdAt", "desc")
  );
  // onSnapshot retourne la fonction de nettoyage (unsubscribe)
  return onSnapshot(
    q,
    (snapshot) => {
      // Tri côté Firestore déjà garanti par orderBy
      const tasks = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
      callback(tasks, null);
    },
    (err) => {
      callback([], "Erreur de synchronisation des tâches : " + err.message);
    }
  );
}
