import { useRef, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { onSnapshot } from "@firebase/firestore";

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
  const previousDocIdsRef = useRef(() => new Set());
  // Garantit la stabilité à travers les remontages du composant
  const previousDocIdsSet = useMemo(() => {
    if (typeof previousDocIdsRef.current === "function") {
      previousDocIdsRef.current = previousDocIdsRef.current();
    }
    return previousDocIdsRef.current;
  }, []);

  const getToastMessage = useCallback(
    ({ sender, data }) => {
      return formatMessage
        ? formatMessage({ sender, data })
        : `Nouvelle missive de ${sender} : ${data.title}`;
    },
    [formatMessage]
  );

  useEffect(() => {
    if (!collectionQuery || !currentUserEmail || !enabled) return;

    const unsubscribe = onSnapshot(
      collectionQuery,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type !== "added") return;

          const docId = change.doc.id;
          const docData = change.doc.data();
          const wasNeverSeen = !previousDocIdsSet.has(docId);

          // Ignore les docs déjà traités ou créés par l'utilisateur courant
          if (!wasNeverSeen || !docData?.addedBy || docData.addedBy === currentUserEmail) {
            previousDocIdsSet.add(docId);
            return;
          }

          toast(getToastMessage({ sender: docData.addedBy, data: docData }));
          previousDocIdsSet.add(docId);
        });
      },
      (err) => {
        console.error("[useRavenMessenger] Erreur lors de l'écoute:", err);
      }
    );

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [collectionQuery, currentUserEmail, enabled, getToastMessage, previousDocIdsSet]);
}
