import { useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { onSnapshot, orderBy, query } from "firebase/firestore";

/**
 * Hook personnalisé pour les notifications "Corbeau Messager"
 * Détecte quand de nouveaux documents sont ajoutés à une collection Firestore
 * et déclenche une notification toast si ajouté par un autre utilisateur
 * 
 * @param {Object} params
 * @param {Object} params.collectionQuery - La requête Firestore (résultat de query())
 * @param {string} params.currentUserEmail - L'email de l'utilisateur courant
 * @param {Function} params.formatMessage - Fonction optionnelle pour formater le message
 *   Reçoit {sender: string, data: object} et retourne le message toast
 *   Par défaut: "Nouvelle missive de [sender] : [title]"
 * @param {boolean} params.enabled - Active/désactive le hook (défaut: true)
 */
export function useRavenMessenger({
  collectionQuery,
  currentUserEmail,
  formatMessage,
  enabled = true,
}) {
  const previousDocIdsRef = useRef(new Set());

  useEffect(() => {
    if (!collectionQuery || !currentUserEmail || !enabled) {
      return;
    }

    const unsubscribe = onSnapshot(
      collectionQuery,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const docId = change.doc.id;
            const docData = change.doc.data();
            const wasNeverSeen = !previousDocIdsRef.current.has(docId);

            // Déclenche la notification seulement si:
            // 1. Le document n'a jamais été vu (évite les doublons au premier chargement)
            // 2. Le document a un champ 'addedBy' (pour identification du sender)
            // 3. Le sender n'est pas l'utilisateur courant
            if (wasNeverSeen && docData.addedBy && docData.addedBy !== currentUserEmail) {
              const message = formatMessage
                ? formatMessage({ sender: docData.addedBy, data: docData })
                : `Nouvelle missive de ${docData.addedBy} : ${docData.title}`;

              toast(message);
            }

            previousDocIdsRef.current.add(docId);
          }
        });
      },
      (err) => {
        console.error("[useRavenMessenger] Erreur lors de l'écoute:", err);
      }
    );

    return () => unsubscribe();
  }, [collectionQuery, currentUserEmail, formatMessage, enabled]);
}
