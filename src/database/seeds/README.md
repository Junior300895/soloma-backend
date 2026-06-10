# 🌱 SOLOMA SUARL — Données Démo (Seed)

## Lancer le seed

```bash
# 1. S'assurer que la BDD est lancée et .env configuré
cp .env.example .env
# Remplir DB_HOST, DB_NAME, DB_USER, DB_PASSWORD

# 2. Démarrer l'appli une première fois (crée les tables via synchronize)
npm run start:dev
# Attendre "SOLOMA API démarrée", puis Ctrl+C

# 3. Lancer le seed
npm run seed
```

## Ce qui est créé

| Entité | Quantité | Détails |
|--------|----------|---------|
| Utilisateurs | 2 | 1 admin + 1 éditeur |
| Grues | 6 | LIEBHERR, TADANO, GROVE, DEMAG, MANITOWOC |
| Services | 4 | Manutention, Levage, Logistique, Associés |
| Projets | 6 | Avec descriptions et médias |
| Devis | 6 | Statuts variés (pending/processed/archived) |
| Messages | 5 | Lu/non lu |
| Articles | 6 | 5 publiés + 1 brouillon |
| Catégories blog | 5 | Manutention, Levage, Logistique, Sécurité, Actualités |

## Identifiants de connexion

### Administrateur
- **URL** : http://localhost:3000/admin/login
- **Email** : `admin@soloma.sn`
- **Mot de passe** : `Admin@2025!`

### Éditeur
- **Email** : `editeur@soloma.sn`
- **Mot de passe** : `Editeur@2025!`

## ⚠️ Important

Le seed **supprime toutes les données existantes** avant d'insérer
les nouvelles. Ne pas l'exécuter en production.

Pour relancer proprement :
```bash
npm run seed
```
