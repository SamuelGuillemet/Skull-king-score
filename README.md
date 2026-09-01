# Skull King Score

Application mobile-first et local-first pour compter les points de Skull King.

## Fonctionnalités

- Modes Classique, Rascal et Rascal Enhanced
- Paris prudents ou risqués en mode Enhanced
- Bonus et pénalités de l'extension
- Feuille de score et classement en direct
- Persistance locale IndexedDB
- Installation PWA et fonctionnement hors connexion

## Développement

```bash
npm install
npm run dev
```

## Vérifications

```bash
npm test
npm run lint
npm run format:check
npm run build
```

Utilisez `npm run format` pour formater l'ensemble du projet avec Oxfmt.

Le workflow `.github/workflows/deploy.yml` publie automatiquement la branche `main` sur GitHub Pages.
