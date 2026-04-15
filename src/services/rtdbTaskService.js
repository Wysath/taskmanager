
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
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// Ajout d'une tâche (Firestore)
export async function addTask(userId, task) {
  const ref = collection(db, `users/${userId}/tasks`);
  console.log("[addTask] userId:", userId, "task:", task);
  try {
    await addDoc(ref, {
      title: task.title,
      completed: false,
      priority: task.priority || "medium",
      createdAt: serverTimestamp(),
    });
    console.log("[addTask] Tâche ajoutée avec succès");
  } catch (err) {
    console.error("[addTask] Erreur Firestore:", err);
    throw err;
  }
}

// Mise à jour d'une tâche (Firestore)
export async function updateTask(userId, taskId, updates) {
  const ref = doc(db, `users/${userId}/tasks/${taskId}`);
  await updateDoc(ref, updates);
}

// Suppression d'une tâche (Firestore)
export async function deleteTask(userId, taskId) {
  const ref = doc(db, `users/${userId}/tasks/${taskId}`);
  await deleteDoc(ref);
}

// Écoute en temps réel de la liste des tâches (Firestore)
export function subscribeToTasks(userId, callback) {
  console.log("[subscribeToTasks] Initialisation pour userId:", userId);
  const q = query(
    collection(db, `users/${userId}/tasks`),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log("[subscribeToTasks] Reçu", tasks.length, "tâches");
      callback(tasks, null); // Pas d'erreur
    },
    (err) => {
      // Gestion d'erreur Firestore
      console.error("[subscribeToTasks] Erreur Firestore:", err.code, err.message);
      callback([], err.message); // Passe l'erreur comme deuxième paramètre
    }
  );
}
