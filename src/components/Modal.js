"use client";
import React, { useRef, useEffect, useMemo, useCallback } from "react";
import { X } from "lucide-react";

/**
 * Composant Modal - Modale réutilisable & cohérente
 * 
 * Utilisation:
 * <Modal open={isOpen} onClose={handleClose}>
 *   <Modal.Header>
 *     <Modal.Title>Titre</Modal.Title>
 *   </Modal.Header>
 *   <Modal.Body>
 *     Contenu...
 *   </Modal.Body>
 *   <Modal.Footer>
 *     <button className="btn btn-secondary">Annuler</button>
 *     <button className="btn btn-primary">Confirmer</button>
 *   </Modal.Footer>
 * </Modal>
 */
const SIZE_CLASSES = {
  small: "max-w-md",
  medium: "max-w-2xl",
  large: "max-w-4xl",
};

const VARIANT_CLASSES = {
  default: "border-outline-variant",
  danger: "border-error",
};

function getSizeClass(size) {
  return SIZE_CLASSES[size] || SIZE_CLASSES.medium;
}

function getVariantClass(variant) {
  return VARIANT_CLASSES[variant] || VARIANT_CLASSES.default;
}

const Modal = ({
  open = false,
  onClose = () => {},
  children,
  size = "medium",
  variant = "default",
}) => {
  const modalRef = useRef(null);

  // Focus sur la modale lors de son ouverture
  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.focus();
    }
  }, [open]);

  // Mémo : callbacks pour éviter les changements de référence
  const handleOverlayClick = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleCardClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  // Mémo : classes selon la taille et le variant
  const cardClassName = useMemo(
    () =>
      `modal-card focus-ring ${getSizeClass(size)} ${getVariantClass(variant)} bg-[#2c2a26] border-2 border-[#504538] p-8 max-h-[80vh] overflow-y-auto`,
    [size, variant]
  );

  // Rendu conditionnel : APRÈS tous les hooks
  if (!open) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black/60 z-50" 
      onClick={handleOverlayClick}
    >
      <div
        className={cardClassName}
        onClick={handleCardClick}
        tabIndex={-1}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {children}
      </div>
    </div>
  );
};

// ==== SOUS-COMPOSANTS ====

/**
 * Modal.Header - En-tête de la modale
 */
Modal.Header = function ModalHeader({ children, onClose }) {
  const handleClose = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);
  return (
    <div className="modal-header">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">{children}</div>
        {onClose ? (
          <button
            onClick={handleClose}
            className="btn btn-icon modal-close-btn ml-4"
            aria-label="Fermer la modale"
            tabIndex={0}
            type="button"
          >
            <X size={24} aria-hidden="true" focusable="false" />
          </button>
        ) : null}
      </div>
    </div>
  );
};

/**
 * Modal.Title - Titre de la modale
 */
Modal.Title = function ModalTitle({ children, className = "" }) {
  return (
    <h2 id="modal-title" className={`modal-title ${className}`}>
      {children}
    </h2>
  );
};

/**
 * Modal.Subtitle - Sous-titre optionnel
 */
Modal.Subtitle = function ModalSubtitle({ children }) {
  return <p className="modal-subtitle">{children}</p>;
};

/**
 * Modal.Body - Contenu de la modale
 */
Modal.Body = function ModalBody({ children }) {
  return <div className="modal-body">{children}</div>;
};

/**
 * Modal.Footer - Pied de page avec boutons
 */
Modal.Footer = function ModalFooter({ children }) {
  return <div className="modal-footer">{children}</div>;
};

/**
 * Modal.DangerZone - Conteneur pour actions dangereuses
 */
Modal.DangerZone = function ModalDangerZone({ children }) {
  return <div className="modal-danger-zone">{children}</div>;
};

export default Modal;
