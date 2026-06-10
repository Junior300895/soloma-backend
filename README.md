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

## URLs
- API : http://localhost:3001/v1
- Swagger : http://localhost:3001/docs

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
