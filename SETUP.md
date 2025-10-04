# Guide d'Installation et de Lancement du Projet

Ce document vous guidera à travers les étapes nécessaires pour installer, configurer et lancer ce projet de backend Node.js sur votre machine locale.

## Prérequis

Avant de commencer, assurez-vous d'avoir les outils suivants installés :
- [Node.js](https://nodejs.org/) (version 18 ou supérieure recommandée)
- [npm](https://www.npmjs.com/) (généralement inclus avec Node.js)
- Une base de données [MySQL](https://www.mysql.com/downloads/) fonctionnelle sur votre machine.

## 1. Cloner le Dépôt

Si vous ne l'avez pas déjà fait, clonez le dépôt de code sur votre machine locale.

```bash
git clone <URL_DU_DEPOT>
cd <NOM_DU_DOSSIER>
```

## 2. Installer les Dépendances

Installez toutes les dépendances du projet en utilisant npm. Cette commande lira le fichier `package.json` et installera les paquets nécessaires dans le dossier `node_modules`.

```bash
npm install
```

## 3. Configurer les Variables d'Environnement

Le projet utilise un fichier `.env` pour gérer les variables d'environnement.

1.  **Créez un fichier `.env`** à la racine du projet. Vous pouvez copier le fichier `.env.example` s'il en existe un, ou créer le fichier manuellement.

2.  **Configurez votre URL de base de données**. Ouvrez le fichier `.env` et modifiez la variable `DATABASE_URL` pour qu'elle corresponde à votre configuration MySQL. Le format est le suivant :

    ```
    DATABASE_URL="mysql://<VOTRE_USER>:<VOTRE_MOT_DE_PASSE>@<VOTRE_HOTE>:<VOTRE_PORT>/<NOM_DE_LA_BASE_DE_DONNEES>"
    ```

    **Exemple :**
    ```
    DATABASE_URL="mysql://root:password@localhost:3306/ma_plateforme_cours"
    ```

## 4. Appliquer les Migrations de la Base de Données

Une fois votre base de données configurée, vous devez appliquer le schéma de données. Prisma gère cela avec la commande `migrate`. Cette commande va :
- Créer la base de données si elle n'existe pas.
- Appliquer toutes les migrations SQL qui se trouvent dans le dossier `prisma/migrations`.

```bash
npx prisma migrate dev
```

## 5. Peupler la Base de Données avec des Données de Test (Seeding)

Pour avoir un environnement de développement fonctionnel, vous pouvez peupler votre base de données avec des données de test (utilisateurs, cours, etc.).

Exécutez la commande suivante :

```bash
npx prisma db seed
```
Cette commande exécute le script qui se trouve dans `prisma/seed.ts`.

## 6. Lancer le Serveur de Développement

Vous êtes maintenant prêt à lancer le serveur. Le projet utilise `nodemon` pour redémarrer automatiquement le serveur à chaque modification de fichier.

```bash
npm run dev
```

Votre serveur backend devrait maintenant être en cours d'exécution. Par défaut, il est généralement accessible à l'adresse `http://localhost:3000` (ou tout autre port que vous avez configuré).

---

Félicitations ! Votre environnement de développement est maintenant prêt. Vous pouvez commencer à travailler sur le code.