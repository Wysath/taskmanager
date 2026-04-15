import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Crée ou met à jour le profil utilisateur dans Firestore
export async function createOrUpdateUserProfile(uid, email) {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    
    // Si l'utilisateur existe déjà, on met à jour seulement ce qui manque
    if (userSnap.exists()) {
      const data = userSnap.data();
      if (!data.email) {
        // Ajoute l'email s'il manque
        await setDoc(userRef, { email }, { merge: true });
      }
    } else {
      // Crée un nouveau document utilisateur
      await setDoc(userRef, {
        uid,
        email,
        createdAt: new Date(),
      });
    }
  } catch (err) {
    console.error("[createOrUpdateUserProfile]", err);
    throw err;
  }
}
