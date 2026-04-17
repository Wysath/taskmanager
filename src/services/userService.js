import { getDbInstance } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "@firebase/firestore";

// Crée ou met à jour le profil utilisateur dans Firestore
export async function createOrUpdateUserProfile(uid, email) {
  try {
    const db = getDbInstance();
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Si l'utilisateur n'existe pas, création du document (early return pour simplifier)
      await setDoc(userRef, {
        uid,
        email,
        createdAt: new Date(),
      });
      return;
    }

    // Si l'utilisateur existe mais sans email, on l'ajoute (sinon rien à faire)
    const data = userSnap.data();
    if (!data.email) {
      await setDoc(userRef, { email }, { merge: true });
    }
  } catch (err) {
    console.error("[createOrUpdateUserProfile]", err);
    throw err;
  }
}
