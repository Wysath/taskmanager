# Design System - Monster Hunter Wilds Task Manager

## Guide Complet des Styles Unifiés

Ce document sert de référence pour l'utilisation cohérente des styles dans l'application.

---

## 🎨 Palette de Couleurs

### Surfaces & Backgrounds
```css
--surface: #151310;                    /* Fond principal */
--surface-container-lowest: #1d1b18;   /* Cartes claires */
--surface-container-low: #211f1c;      /* Containers secondaires */
--surface-container: #2c2a26;          /* Containers neutres */
--surface-container-high: #373431;     /* Containers sombres */
--surface-container-highest: #3b3935;  /* Containers très sombres */
```

### Textes
```css
--on-surface: #e3d5b8;           /* Texte principal (clair) */
--on-surface-variant: #d4c4b3;   /* Texte secondaire (gris) */
```

### Accents
```css
--primary: #c28e46;              /* Cuivre - accent principal */
--primary-container: #815511;    /* Cuivre foncé - backgrounds */
--on-primary: #151310;           /* Texte sur cuivre */
```

### Statuts
```css
--error: #93000a;                /* Rouge danger */
--error-container: #ffdad6;      /* Rouge light */
```

---

## 📝 Typographies

### Headings
```html
<!-- Titre principal (h1) -->
<h1>Mon Titre</h1>  <!-- 2rem, 700 weight, Manrope -->

<!-- Sous-titre (h2) -->
<h2>Sous-titre</h2>  <!-- 1.5rem -->

<!-- Autres -->
<h3>Catégorie</h3>   <!-- 1.25rem -->
<h4>Item</h4>       <!-- 1.125rem -->
<h5>Label</h5>      <!-- 1rem -->
<h6>Meta</h6>       <!-- 0.875rem -->
```

### Body Text
```html
<p>Paragraphe de texte standard</p>  <!-- 0.9375rem, Inter -->
<span class="text-sm">Texte petit</span>
<span class="text-xs">Très petit</span>
```

---

## 🔘 Boutons - Utilisation

### Variantes Primaires
```html
<!-- Bouton principal (cuivre) -->
<button class="btn btn-primary">Ajouter</button>

<!-- Bouton secondaire (outline) -->
<button class="btn btn-secondary">Annuler</button>

<!-- Bouton danger (rouge) -->
<button class="btn btn-error">Supprimer</button>

<!-- Bouton icône petit -->
<button class="btn btn-icon"><TrashIcon /></button>
```

### Tailles
```html
<button class="btn btn-primary">Standard</button>
<button class="btn btn-primary btn-sm">Petit</button>
<button class="btn btn-primary btn-lg">Grand (full width)</button>
```

### États
```html
<button class="btn btn-primary" disabled>Désactivé</button>
<button class="btn btn-primary">Actif</button>
```

---

## 🎴 Cartes & Conteneurs

### Carte Standard
```html
<div class="card">
  <h3>Titre de la carte</h3>
  <p>Contenu...</p>
</div>
```

### Carte Compacte
```html
<div class="card-compact">
  <span>Contenu compacte</span>
</div>
```

### Carte Surélevée
```html
<div class="card-elevated">
  <h3>Carte avec ombre</h3>
  <p>Contenu important...</p>
</div>
```

---

## 🪟 Modales - Composant Modal Réutilisable

### Import
```jsx
import Modal from "@/components/Modal";
```

### Variante Standard
```jsx
const [isOpen, setIsOpen] = useState(false);

<Modal open={isOpen} onClose={() => setIsOpen(false)}>
  <Modal.Header onClose={() => setIsOpen(false)}>
    <Modal.Title>Mon Titre</Modal.Title>
    <Modal.Subtitle>Sous-titre optionnel</Modal.Subtitle>
  </Modal.Header>
  
  <Modal.Body>
    <div className="form-group">
      <label className="form-label">Email</label>
      <input type="email" className="input-base" />
    </div>
  </Modal.Body>
  
  <Modal.Footer>
    <button className="btn btn-secondary" onClick={() => setIsOpen(false)}>
      Annuler
    </button>
    <button className="btn btn-primary">Confirmer</button>
  </Modal.Footer>
</Modal>
```

### Variante Danger (Suppression)
```jsx
<Modal open={showDelete} onClose={() => setShowDelete(false)} variant="danger" size="small">
  <Modal.Header onClose={() => setShowDelete(false)}>
    <Modal.Title>Supprimer ?</Modal.Title>
  </Modal.Header>
  
  <Modal.DangerZone>
    <h3>⚠️ Attention</h3>
    <p>cette action est irréversible.</p>
  </Modal.DangerZone>
  
  <Modal.Body>
    <p>Êtes-vous sûr de vouloir supprimer ?</p>
  </Modal.Body>
  
  <Modal.Footer>
    <button className="btn btn-secondary" onClick={() => setShowDelete(false)}>
      Annuler
    </button>
    <button className="btn btn-error">Supprimer</button>
  </Modal.Footer>
</Modal>
```

### Props & Variantes
```jsx
// Variantes de design
<Modal variant="default">...</Modal>  <!-- Standard -->
<Modal variant="danger">...</Modal>   <!-- Rouge, pour actions dangereuses -->

// Tailles
<Modal size="small">...</Modal>       <!-- max-w-sm (24rem) -->
<Modal size="medium">...</Modal>      <!-- max-w-md (28rem) - défaut -->
<Modal size="large">...</Modal>       <!-- max-w-lg (32rem) -->

// Contrôle d'ouverture
<Modal open={isOpen} onClose={handleClose}>...</Modal>
```

### Sous-Composants Disponibles
```jsx
<Modal.Header onClose={handleClose}>...</Modal.Header>      <!-- En-tête avec bordure -->
<Modal.Title>Titre Principal</Modal.Title>                  <!-- Titre h2 -->
<Modal.Subtitle>Texte explicatif</Modal.Subtitle>           <!-- Texte gris secondaire -->
<Modal.Body>...</Modal.Body>                                <!-- Contenu principal -->
<Modal.Footer>...</Modal.Footer>                            <!-- Boutons d'action -->
<Modal.DangerZone>...</Modal.DangerZone>                    <!-- Bordure rouge, attention -->
```

---

## 📋 Formulaires

### Groupe Formulaire Standard
```html
<div class="form">
  <div class="form-group">
    <label class="form-label">Titre<span class="form-label-required"></span></label>
    <input type="text" class="input-base input-lg" />
    <div class="form-help">Texte d'aide optionnel</div>
  </div>
  
  <div class="form-group">
    <label class="form-label">Priorité</label>
    <select class="select-base input-lg">
      <option>Haute</option>
      <option>Moyenne</option>
      <option>Basse</option>
    </select>
  </div>
  
  <button type="submit" class="btn btn-primary btn-lg">Soumettre</button>
</div>
```

### Avec Erreur
```html
<div class="form-group">
  <label class="form-label">Email</label>
  <input type="email" class="input-base" />
  <div class="form-error">Adresse email invalide</div>
</div>
```

---

## 🏷️ Badges & Tags

### Badges Standards
```html
<span class="badge badge-primary">Important</span>
<span class="badge badge-secondary">Info</span>
<span class="badge badge-error">Erreur</span>
<span class="badge badge-success">Succès</span>
```

### Badges Priorité
```html
<span class="priority-badge priority-haute">Haute</span>
<span class="priority-badge priority-moyenne">Moyenne</span>
<span class="priority-badge priority-basse">Basse</span>
```

### Badge Rôle
```html
<span class="badge-role">Admin</span>
```

---

## 📑 Listes

### Liste Standard - Avec fond noir (#0a0908)
```html
<ul class="list-base">
  <li class="list-item">
    <span>Mon item</span>
    <button class="btn btn-icon"><TrashIcon /></button>
  </li>
  <li class="list-item completed">
    <span>Item complété</span>
  </li>
</ul>
```

**Styling des list-item:**
- Fond noir ultra-foncé (#0a0908) pour contraste maximal
- Bordure cuivre/grise au baseline
- Hover: Bordure passe à cuivre (#c28e46) avec ombre légère
- Completed: Texte barré + opacité réduite

### Avec Section
```html
<div class="section">
  <div class="section-header">
    <h3 class="section-title">Mes Tâches</h3>
    <p class="section-subtitle">5 tâches restantes</p>
  </div>
  
  <ul class="list-base">
    <!-- Items... -->
  </ul>
</div>
```

---

## 📭 États Vides

### Affichage Standard
```html
<div class="empty-state">
  <CheckSquareIcon class="empty-state-icon" />
  <h3 class="empty-state-title">Aucune tâche</h3>
  <p class="empty-state-text">Votre sanctuaire est en ordre</p>
</div>
```

### Avec Section
```html
<section class="empty-state-section">
  <!-- Contenu vide... -->
</section>
```

---

## ⏳ Loading & Animations

### Spinner
```html
<div class="spinner"></div>
```

### Animations
```html
<!-- Fade in -->
<div class="fade-in">Contenu qui apparait...</div>

<!-- Slide up (modales) -->
<div class="slide-in-up">Contenu qui monte...</div>
```

---

## 🎯 Classes Utilitaires

### Text
```html
<p class="truncate">Texte qui se coupe avec ...</p>
<p class="line-clamp-2">Texte limité sur 2 lignes</p>
<p class="line-clamp-3">Texte limité sur 3 lignes</p>
```

### Dividers
```html
<div class="divider"></div>  <!-- Horizontal -->
<div class="divider-vertical"></div>  <!-- Vertical -->
```

### Transitions
```html
<button class="btn btn-primary transition-fast">Rapide</button>
<div class="transition-normal">Normal (300ms)</div>
<div class="transition-slow">Lent (500ms)</div>
```

### Accessibility
```html
<button class="btn btn-primary focus-ring">Accessible</button>
```

---

## 📱 Responsive Design

### Mobile First
```css
/* Par défaut: mobile */
.btn-lg { width: 100%; }

/* Sur desktop et plus */
@media (min-width: 640px) {
  .form-row { grid-template-columns: repeat(2, 1fr); }
}
```

---

## ✨ Bonnes Pratiques

### ✅ À FAIRE
```html
<!-- Utiliser les classes unifiées -->
<button class="btn btn-primary">Ajouter</button>
<div class="card">Contenu</div>
<div class="modal-overlay"><div class="modal-card">...</div></div>
```

### ❌ À ÉVITER
```html
<!-- Pas de styles inline -->
<button style="background: #c28e46">Ne pas faire ça</button>

<!-- Pas de couleurs hardcodées -->
<div style="color: #e3d5b8">Mauvais</div>

<!-- Pas de CSS personnalisé non documenté -->
<div style="padding: 1.5rem; border-radius: 1rem;">...</div>
```

---

## 🎯 Améliorations V1.1 (15 avril 2026)

### ✨ Nouveautés

**1. Composant Modal Réutilisable**
- Créé [`Modal.js`](src/components/Modal.js)
- Remplace tous les HTML bruts `<div className="modal-overlay">`
- Structure: `Modal.Header` + `Modal.Body` + `Modal.Footer` + `Modal.DangerZone`
- Utilisé dans: `TaskList.js`, `SortableTaskItem.js`, `profil/page.js`

**2. Design Amélioré des Modales**
- Padding: 2.5rem (↑ de 2rem)
- Bordure: 2px solid (au lieu de 1px)
- Shadow: 0 25px 50px rgba(0,0,0,0.5) (plus profond)
- Backdrop: rgba(0,0,0,0.7) blur(6px) (plus opaque)
- Animation: slideUp 0.3s + fadeIn 0.2s

**3. Fond Noir pour les Tâches**
- Tâches ListItem: #0a0908 (noir ultra-foncé)
- Crée contraste maximal avec accueil (#151310)
- Hover: Bordure #c28e46 + ombre légère
- Completed: Opacité 0.6 + texte barré

**4. Espacement Amélioré**
- Gap entre éléments: 1.25rem (au lieu de 1rem)
- Modales footer: padding-top 1.5rem + border-top
- Section header: padding-bottom 1rem
- Form groups: gap 0.75rem

**5. Contraste Renforcé**
- Danger zone: Bordure + fond dégradé rouge
- Modales danger (variant="danger"): Bordure rouge
- Inputs/Select: Focus ring 3px var(--primary) avec blur effect
- Texte Alt: Contraste AAA maintenu partout

---

## 🔧 Maintenance

### Ajouter une Nouvelle Composante
1. Créer la classe dans `unified.css`
2. Documenter ici
3. Utiliser dans les composants
4. Tester sur mobile & desktop

### Modifier une Couleur
Éditer les variables CSS dans le bloc `:root` en haut du fichier.

### Ajouter une Animation
1. Créer la `@keyframes` dans `unified.css`
2. Créer la classe `.fade-in` etc.
3. Documenter ici

### Créer une Nouvelle Modale
```jsx
import Modal from "@/components/Modal";

<Modal open={isOpen} onClose={handleClose} variant="default|danger" size="small|medium|large">
  <Modal.Header onClose={handleClose}>
    <Modal.Title>Titre</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {/* Contenu */}
  </Modal.Body>
  <Modal.Footer>
    {/* Boutons */}
  </Modal.Footer>
</Modal>
```

---

**Dernière mise à jour:** 15 avril 2026
**Version:** 1.1 - Modal Component & Dark Task Backgrounds
