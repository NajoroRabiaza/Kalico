# Kalico - Un système de Gestion de Commandes Alimentaires

**Kalico** est une application Full-Stack conçue pour la gestion et la commande de plats en ligne. Ce projet repose sur une architecture découplée (Frontend en React et Backend en Node.js) avec une persistance des données sous MongoDB.

---

## 🛠️ Stack Technique

* **Frontend :** React, React Bootstrap, FontAwesome.
* **Backend :** Node.js, Express.
* **Base de données :** MongoDB.
* **Gestion de fichiers :** Multer (Stockage local des images).

---

## 🚀 Installation et Configuration

### 1. Prérequis
Assurez-vous d'avoir installé [Node.js](https://nodejs.org/) et [MongoDB](https://www.mongodb.com/try/download/community) sur votre machine.

### 2. Installation des dépendances
Depuis la racine du projet, installez les modules nécessaires pour le frontend :
```bash
# Installation des dépendances générales
npm install

# Installation des bibliothèques UI
npm install react-bootstrap bootstrap @fortawesome/fontawesome-free
```

Puis, installez les dépendances du serveur :
```bash
cd backend
npm install
npm install multer
```

---

## 🗄️ Configuration de la Base de Données

Le projet utilise une base de données MongoDB nommée **GeIt**.

1.  **Démarrage du service :** Assurez-vous que votre instance MongoDB est active.
    ```bash
    mongod
    ```
2.  **Initialisation des données :** Un script de réinitialisation est disponible pour configurer l'environnement de développement. Il vide les collections existantes et injecte des données de test (seeding).
    ```bash
    cd backend
    node resetAndSeed.js
    ```

---

## 📁 Gestion des médias
Le téléchargement des images est géré par la bibliothèque **Multer**. Les fichiers sont stockés localement dans le répertoire `backend/uploads/`. Veillez à ce que ce dossier dispose des droits d'écriture nécessaires.

---

## 💻 Exécution de l'application

Pour faire fonctionner le projet, vous devez lancer deux terminaux distincts :

**Terminal 1 : Frontend**
```bash
npm run dev
```

**Terminal 2 : Backend**
```bash
cd backend
npm start
```

---

## 👥 Organisation de l'équipe et Tâches

Le développement est réparti en trois pôles de compétences :

| Équipe | Membres | Responsabilités |
| :--- | :--- | :--- |
| **Équipe 1** | Danilo & Princia | Gestion du système de fichiers et logique d'upload des images. |
| **Équipe 2** | Hyacinthe & Victorio | UI/UX Design et intégration des interfaces utilisateur. |
| **Équipe 3** | Azaria & Najoro | Logique métier des boutons et intégration du tunnel de paiement. |

---

## 📝 Directives de Développement

* **Autonomie & Entraide :** Chaque équipe est responsable de ses livrables, mais la communication inter-équipes est encouragée pour garantir la cohérence globale.
* **Validation :** Avant chaque fin de session, assurez-vous de tester l'intégration de vos fonctionnalités avec le reste de l'application.

### Focus sur l'Expérience Utilisateur (UX)
Pour maximiser le taux de conversion, l'application supporte le **mode invité** :
* La consultation du catalogue est libre et ne nécessite pas de compte.
* Le **formulaire de commande anonyme** permet aux clients de passer commande en renseignant simplement leurs informations de livraison et de contact, sans obligation d'inscription préalable.

---

> **Note :** En cas de modification du schéma de données, pensez à mettre à jour le script `resetAndSeed.js` pour maintenir la synchronisation entre les membres de l'équipe.
