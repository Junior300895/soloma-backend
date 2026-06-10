# SOLOMA SUARL — Backend API (NestJS 10)

## Prérequis
- Node.js 18+
- MySQL 8.0
- npm

## Installation

```bash
# 1. Cloner et installer les dépendances
npm install

# 2. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs MySQL et SMTP

# 3. Créer la base de données MySQL
mysql -u root -p
CREATE DATABASE soloma_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'soloma_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON soloma_db.* TO 'soloma_user'@'localhost';
FLUSH PRIVILEGES;

# 4. Démarrer en développement (synchronize: true crée les tables automatiquement)
npm run start:dev
```

## Chargement des données initiales (Seed)

Le seed peuple la base de données avec des données de démonstration :

| Données | Quantité |
|---------|----------|
| Utilisateurs | 2 (admin + éditeur) |
| Grues | 6 |
| Services | 4 |
| Projets | 6 (avec médias) |
| Devis | 6 |
| Messages de contact | 5 |
| Articles de blog | 6 (5 publiés + 1 brouillon) |

```bash
# Lancer le seed (la base doit être démarrée et les tables créées)
npm run seed
```

> Les tables sont créées automatiquement au premier démarrage (`npm run start:dev`).
> Arrêtez le serveur avant de lancer le seed si celui-ci tourne déjà.

### Identifiants créés par le seed

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@soloma.sn | Admin@2025! |
| Éditeur | editeur@soloma.sn | Editeur@2025! |

### Comportement du seed

- **Remet à zéro** toutes les tables avant insertion (pas d'ajout cumulatif).
- Désactive temporairement les contraintes de clé étrangère pour éviter les conflits d'ordre d'insertion.
- Utilise `tsconfig.seed.json` pour la compilation TypeScript.

## URLs
- API : http://localhost:3001/v1
- Swagger : http://localhost:3001/docs
- Admin frontend : http://localhost:3000/admin/login

## Endpoints principaux
| Module | Base URL |
|--------|----------|
| Grues | /v1/cranes |
| Devis | /v1/quotes |
| Projets | /v1/projects |
| Contact | /v1/contact |
| Blog | /v1/posts |
| Services | /v1/services |

## Production
```bash
npm run build
npm run start:prod
```
