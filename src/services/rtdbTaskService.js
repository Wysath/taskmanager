
import { getDbInstance } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  onSnapshot,
} from "@firebase/firestore";

/**
 * Ajoute une tâche à Firestore
 * @param {string} userId
 * @param {{ title: string, priority?: string }} task
 */
export async function addTask(userId, task) {
  const db = getDbInstance();
  const ref = collection(db, `users/${userId}/tasks`);
  try {
    await addDoc(ref, {
      title: task.title,
      completed: false,
      priority: task.priority || "medium",
      createdAt: serverTimestamp(),
    });
    // Optionnel en prod : retirer les logs verbose
    // console.log("[addTask] Tâche ajoutée pour userId:", userId);
  } catch (err) {
    // Logging d'erreur précis
    console.error("[addTask] Erreur Firestore:", err);
    throw err;
  }
}

/**
 * Met à jour une tâche existante sur Firestore
 * @param {string} userId
 * @param {string} taskId
 * @param {Object} updates
 */
export async function updateTask(userId, taskId, updates) {
  const db = getDbInstance();
  const ref = doc(db, `users/${userId}/tasks/${taskId}`);
  await updateDoc(ref, updates);
}

/**
 * Supprime une tâche de Firestore
 * @param {string} userId
 * @param {string} taskId
 */
export async function deleteTask(userId, taskId) {
  const db = getDbInstance();
  const ref = doc(db, `users/${userId}/tasks/${taskId}`);
  await deleteDoc(ref);
}

/**
 * Souscrit en temps réel à la liste des tâches d'un utilisateur (Firestore)
 * /!\ Important : La fonction retournée DOIT être utilisée comme cleanup dans un useEffect afin d'éviter les fuites mémoire !
 * @param {string} userId
 * @param {(tasks: Array, errorMsg: string|null) => void} callback
 * @returns {() => void} unsubscribe function
 */
export function subscribeToTasks(userId, callback) {
  const db = getDbInstance();
  const tasksCollection = collection(db, `users/${userId}/tasks`);
  const q = query(tasksCollection, orderBy("createdAt", "desc"));

  // OnSnapshot retourne un unsubscribe à utiliser dans le useEffect appelant.
  return onSnapshot(
    q,
    (snapshot) => {
      // Transformation optimisée des docs
      // Tri côté Firestore déjà garanti par orderBy
      const tasks = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      callback(tasks, null);
    },
    (err) => {
      // Gestion d'erreur précise
      console.error("[subscribeToTasks] Erreur Firestore:", err.code, err.message);
      callback([], err.message);
    }
  );
}
