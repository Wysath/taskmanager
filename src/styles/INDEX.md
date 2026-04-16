# 🎨 Index des Classes CSS Disponibles

## Boutons (components.css)
```css
.btn                 /* Bouton de base */
.btn-primary         /* Bouton primaire */
.btn-primary-full    /* Bouton primaire full-width */
.btn-secondary       /* Bouton secondaire */
.btn-error           /* Bouton d'erreur */
.btn-icon            /* Bouton icône */
```

## Cards & Conteneurs (components.css)
```css
.card                /* Carte principale */
.card-compact        /* Carte compacte */
.card-item           /* Item de liste */
.card-item.completed /* Item complété */
```

## Textes et Labels (components.css)
```css
.label               /* Label standard */
.label-required::after /* Ajout du "*" */
.help-text           /* Texte d'aide */
.error-text          /* Texte d'erreur */
.section-title       /* Titre de section */
.subsection-title    /* Sous-titre */
```

## Badges (components.css)
```css
.badge               /* Badge général */
.badge-primary       /* Badge primaire */
.badge-secondary     /* Badge secondaire */
.badge-owner         /* Badge propriétaire */
.priority-badge      /* Badge priorité */
.priority-haute      /* Priorité haute */
.priority-moyenne    /* Priorité moyenne */
.priority-basse      /* Priorité basse */
```

## Listes (components.css)
```css
.list-base           /* Liste verticale */
.list-horizontal     /* Liste horizontale */
.empty-state         /* Conteneur état vide */
.empty-state-content /* Contenu état vide */
.empty-state-icon    /* Icône état vide */
.empty-state-title   /* Titre état vide */
.empty-state-text    /* Texte état vide */
```

## Formulaires (forms.css)
```css
.form                /* Formulaire conteneur */
.form-group          /* Groupe de champs */
.form-row            /* Ligne de formulaire */
.form-row-half       /* Demi-largeur */

.input-base          /* Input de base */
.input-sm            /* Input petit */
.input-lg            /* Input grand */
.input-text          /* Input texte */
.input-email         /* Input email */
.input-password      /* Input password */
.input-text-error    /* Input avec erreur */

.select-base         /* Select de base */
.select-lg           /* Select grand */
.select-styled       /* Select stylisé */

.textarea-base       /* Textarea de base */
.textarea-lg         /* Textarea grand */

.input-with-icon     /* Input avec icône */
.input-icon          /* Icône input */

.checkpoint          /* Checkbox */
.radio               /* Radio */
.checkbox-label      /* Label checkbox */
.radio-label         /* Label radio */

.task-form           /* Formulaire tâche */
.task-form-input     /* Input formulaire tâche */
.task-form-priority  /* Select priorité */

.invite-form         /* Formulaire invitation */
.invite-input        /* Input invitation */
```

## Layout & Navigation (layout.css)
```css
.header              /* Header */
.header-nav          /* Navigation header */
.header-brand        /* Logo/brand */
.header-menu         /* Menu */
.header-link         /* Lien navigation */

.main-wrapper        /* Wrapper principal */
.main-content        /* Contenu principal */
.container-centered  /* Conteneur centré */

.page                /* Page */
.page-loading        /* Page chargement */
.page-empty          /* Page vide */
.page-loading-text   /* Texte chargement */
.page-empty-text     /* Texte vide */

.section             /* Section */
.divider             /* Diviseur */
.space-top           /* Espacement top */

.grid-auto           /* Grille auto */
.grid-2              /* Grille 2 colonnes */
.grid-3              /* Grille 3 colonnes */

.flex-between        /* Flex espace-between */
.flex-center         /* Flex centré */
.flex-col-center     /* Flex col centré */

.modal-overlay       /* Overlay modale */
.modal-content       /* Contenu modale */
.modal-header        /* Header modale */
.modal-body          /* Body modale */
.modal-footer        /* Footer modale */

.pt-header           /* Padding top header */
```

## Listes Partagées (shared.css)
```css
.shared-list-view    /* Vue liste partagée */
.shared-list-header  /* Header */
.shared-list-title   /* Titre */

.members-section     /* Section membres */
.members-title       /* Titre membres */
.members-list        /* Liste membres */
.member-tag          /* Tag membre */
.member-email        /* Email du membre */
.member-owner-badge  /* Badge propriétaire */
.member-remove-btn   /* Bouton retrait */

.invite-section      /* Section invitation */
.invite-form-group   /* Groupe formulaire */
.invite-input        /* Input invitation */
.invite-btn          /* Bouton invitation */
.invite-error        /* Erreur invitation */

.shared-tasks-section   /* Section tâches */
.shared-tasks-title     /* Titre tâches */
.shared-tasks-list      /* Liste tâches */
.shared-task-item       /* Item tâche */
.shared-task-checkbox   /* Checkbox */
.shared-task-content    /* Contenu */
.shared-task-info       /* Infos */
.shared-task-title      /* Titre */
.shared-task-description /* Description */
.shared-task-addedby    /* Ajouté par */
.shared-task-priority   /* Priorité */
.shared-task-status     /* Statut */
.shared-task-actions    /* Actions */
.shared-task-btn        /* Bouton action */
.shared-task-btn-delete /* Bouton supprime */

.task-edit-form      /* Formulaire édition */
.task-edit-label     /* Label édition */
.task-edit-input     /* Input édition */
.task-edit-buttons   /* Boutons édition */
.task-edit-confirm   /* Bouton confirme */
.task-edit-cancel    /* Bouton annule */

.delete-confirmation /* Modale suppression */
.delete-modal        /* Contenu modale */
.delete-modal-title  /* Titre modale */
.delete-modal-text   /* Texte modale */
.delete-modal-buttons /* Boutons modale */
.delete-confirm-btn  /* Bouton confirme */
.delete-cancel-btn   /* Bouton annule */
```

## Utilities (utilities.css)
```css
/* Visibilité */
.sr-only             /* Écran lecture seulement */
.hidden-mobile       /* Caché mobile */
.hidden-desktop      /* Caché desktop */

/* Texte */
.text-truncate       /* Texte tronqué */
.text-clamp          /* 2 lignes max */
.text-clamp-3        /* 3 lignes max */
.line-through-text   /* Barré */

/* Opacité */
.opacity-hover       /* Opaque au hover */
.opacity-disabled    /* Désactivé */

/* Effets */
.hover-lift          /* Lift au hover */
.hover-shadow        /* Ombre au hover */
.hover-bg            /* BG au hover */

/* Focus */
.focus-ring          /* Ring focus standard */
.focus-ring-error    /* Ring focus erreur */

/* Transitions */
.transition-fast     /* 150ms */
.transition-normal   /* 300ms */
.transition-slow     /* 500ms */

/* Borders */
.border-subtle       /* Bordure légère */
.border-strong       /* Bordure prononcée */

/* Shadows */
.shadow-sm-custom    /* Ombre petite */
.shadow-md-custom    /* Ombre moyenne */
.shadow-lg-custom    /* Ombre grande */

/* Radius */
.radius-sm           /* rounded-lg */
.radius-md           /* rounded-xl */
.radius-lg           /* rounded-2xl */
.radius-full         /* rounded-full */

/* Padding */
.p-sm, .p-md, .p-lg, .p-xl           /* Full padding */
.px-sm, .px-md, .px-lg                /* Horizontal */
.py-sm, .py-md, .py-lg                /* Vertical */

/* Margin */
.mb-sm, .mb-md, .mb-lg, .mb-xl       /* Bottom margin */
.mt-sm, .mt-md, .mt-lg, .mt-xl       /* Top margin */

/* Gap */
.gap-sm, .gap-md, .gap-lg            /* Gap flex */

/* Responsif */
.sm-hidden, .sm-flex, .sm-full       /* Mobile utilities */

/* Position */
.absolute-center     /* Centré absolu */
.absolute-top-right  /* Top right */
.absolute-top-left   /* Top left */

/* Z-index */
.z-nav               /* z-50 */
.z-modal             /* z-50 */
.z-overlay           /* z-40 */

/* Cursor */
.cursor-pointer-custom
.cursor-not-allowed-custom

/* Transform */
.scale-hover         /* Scale au hover */
.translate-y-on-hover /* Translate Y hover */
```

---

## 📝 Exemples d'utilisation

### Bouton
```jsx
<button className="btn btn-primary">Ajouter</button>
<button className="btn btn-secondary">Annuler</button>
<button className="btn btn-error">Supprimer</button>
```

### Formulaire
```jsx
<form className="form">
  <div className="form-group">
    <label className="label">Email</label>
    <input className="input-email" type="email" />
  </div>
  <button className="btn btn-primary">Soumettre</button>
</form>
```

### Card
```jsx
<div className="card">
  <h1 className="section-title">Titre</h1>
  <p>Contenu...</p>
</div>
```

### Liste partagée
```jsx
<div className="shared-list-view">
  <h1 className="shared-list-title">Ma liste</h1>
  <div className="members-section">
    <h2 className="members-title">Membres</h2>
    <ul className="members-list">
      <li className="member-tag">
        <span className="member-email">user@example.com</span>
      </li>
    </ul>
  </div>
</div>
```

---

**Dernière mise à jour**: 15 avril 2026
