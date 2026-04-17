# Grand Livre des Quêtes - Task Manager

Gestionnaire de tâches collaboratif avec authentification Firebase et synchronisation temps réel. Interface thématisée Monster Hunter.

## 🚀 Lien de Déploiement

**[https://taskmanager-filrouge-57492.web.app/](https://taskmanager-filrouge-57492.web.app/)**

## 📋 Fonctionnalités

### Authentification
- ✅ Inscription et connexion avec Firebase Auth
- ✅ Persistance de session avec sessionStorage
- ✅ Déconnexion sécurisée

### Gestion des Tâches
- ✅ Créer, modifier, supprimer des tâches
- ✅ Filtrer par priorité (haute, moyenne, basse)
- ✅ Filtrer par statut (en cours, complétées, archivées)
- ✅ Recherche en temps réel
- ✅ Tri par date ou priorité
- ✅ Synchronisation temps réel avec Firestore/RTDB

### Collaboration
- ✅ Partager des listes avec d'autres utilisateurs
- ✅ Gestion d'escouades (groupes d'utilisateurs)
- ✅ Permissions granulaires par liste

### Performance
- ✅ Lazy loading des composants
- ✅ Service Worker pour mode hors ligne
- ✅ Critical CSS inline
- ✅ Optimisation des images
- ✅ Cache statique côté client

## 🛠️ Technologies Utilisées

- **Frontend**: Next.js 16.2.3, React 19, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore/RTDB)
- **Styles**: Material Design 3, design system custom
- **Deployment**: Firebase Hosting
- **Build**: Turbopack

## 📦 Installation

### Prérequis
- Node.js 18+
- npm ou yarn

### Étapes

```bash
# 1. Cloner le repo
git clone <repo-url>
cd taskmanager

# 2. Installer les dépendances
npm install

# 3. Configurer Firebase
# Créer un fichier .env.local avec vos clés Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
# (voir .env.example)

# 4. Démarrer le serveur de développement
npm run dev

# Ouvrir http://localhost:3000
```

## 🏗️ Structure du Projet

```
src/
├── app/                    # Pages Next.js
│   ├── page.js            # Home (Dashboard)
│   ├── taches/            # Gestion des tâches
│   ├── shared/            # Gestion des listes partagées
│   ├── profil/            # Profil utilisateur
│   └── login/, signup/    # Authentification
├── components/            # Composants React
│   ├── ProtectedRoute.js  # Wrapper pour routes protégées
│   ├── SidebarNav.js      # Navigation latérale
│   └── ...                # Autres composants
├── contexts/
│   └── AuthContext.js     # Contexte d'authentification global
├── services/
│   ├── rtdbTaskService.js # Opérations tâches (RTDB)
│   ├── sharedListService.js
│   └── userService.js
├── styles/                # Feuilles de style CSS
├── hooks/                 # Hooks React personnalisés
└── lib/
    └── firebase.js        # Configuration Firebase
```

## 🚀 Déploiement

### Firebase Hosting

```bash
# 1. Build
npm run build

# 2. Deploy
firebase deploy --only hosting
```

## 📖 Scripts Disponibles

```bash
npm run dev       # Démarrer le serveur de développement
npm run build     # Compiler la production
npm run start     # Démarrer le serveur de production
npm run lint      # Vérifier la qualité du code
```

## 🔒 Sécurité

- Authentification Firebase (OAuth, email/password)
- Firestore Security Rules pour protected access
- Validation côté client et serveur
- Protection des routes (ProtectedRoute)

## 🎨 Design System

- **Couleurs**: Material Design 3 (Forbidden Lands theme)
- **Typographie**: Geist, Work Sans
- **Composants**: Custom components + Lucide icons

## 📋 Notes de Développement

- Session auth persiste via `sessionStorage` + Firebase `onAuthStateChanged`
- AuthProvider au niveau root pour éviter les réinitialisations
- Client-side routing avec `router.push()` pour SPA experience
- Lazy loading des routes protégées

## 👤 Auteur

Louna Petitfils

## 📄 Licence

MIT

