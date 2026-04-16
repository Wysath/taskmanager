"use client";

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
export default function Modal({ 
  open = false, 
  onClose = () => {}, 
  children,
  size = "medium", // small, medium, large
  variant = "default" // default, danger
}) {
  if (!open) return null;

  const sizeClasses = {
    small: "max-w-sm",
    medium: "max-w-md",
    large: "max-w-lg",
  };

  const variantClasses = {
    default: "border-outline-variant",
    danger: "border-error",
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal-card ${sizeClasses[size]} ${variantClasses[variant]}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Modal.Header - En-tête de la modale
 */
Modal.Header = function ModalHeader({ children, onClose }) {
  return (
    <div className="modal-header">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {children}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="btn btn-icon ml-4"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Modal.Title - Titre de la modale
 */
Modal.Title = function ModalTitle({ children, className = "" }) {
  return <h2 className={`modal-title ${className}`}>{children}</h2>;
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
  return (
    <div className="modal-danger-zone">
      {children}
    </div>
  );
};
