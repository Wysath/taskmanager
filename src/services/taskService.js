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
} from "firebase/firestore";

// 1. Récupère toutes les tâches privées d'un utilisateur
export async function getUserTasks(userId) {
  try {
    const q = query(
      collection(db, `users/${userId}/tasks`),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    throw new Error("Impossible de récupérer les tâches : " + err.message);
  }
}

// 2. Ajoute une tâche privée
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

// 3. Met à jour une tâche
export async function updateTask(userId, taskId, updates) {
  try {
    const ref = doc(db, `users/${userId}/tasks/${taskId}`);
    await updateDoc(ref, updates);
  } catch (err) {
    throw new Error("Impossible de mettre à jour la tâche : " + err.message);
  }
}

// 4. Supprime une tâche
export async function deleteTask(userId, taskId) {
  try {
    const ref = doc(db, `users/${userId}/tasks/${taskId}`);
    await deleteDoc(ref);
  } catch (err) {
    throw new Error("Impossible de supprimer la tâche : " + err.message);
  }
}

// 5. Écoute les changements en temps réel
export function subscribeToTasks(userId, callback) {
  const q = query(
    collection(db, `users/${userId}/tasks`),
    orderBy("createdAt", "desc")
  );
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(tasks);
    },
    (err) => {
      // On peut aussi passer l'erreur au callback si besoin
      callback([], "Erreur de synchronisation des tâches : " + err.message);
    }
  );
  return unsubscribe;
}
