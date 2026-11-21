# Interface de CineVault

[English](README.md) · **Français**

Interface en React 19 + TypeScript + Vite + Tailwind v4, hébergée par l'enveloppe Tauri 2 de `src-tauri/`.

Pile technique : Radix (`radix-ui`), TanStack Router / Query / Virtual, Zustand, cmdk, Motion, lucide-react.

- `bun install` (ici et à la racine du dépôt, où se trouve `@tauri-apps/cli`)
- `bun run dev` sert Vite sur `127.0.0.1:1420` (l'URL de développement de Tauri) ; la fenêtre de bureau se lance
  depuis la racine du dépôt avec `bun run tauri dev`, qui démarre aussi ce serveur de développement.
- `bun run typecheck`, `bun run test`, `bun run build`.

Les jetons de design sont dans `src/styles/tokens.css` (les couleurs changent avec `[data-theme]` et sont associées aux utilitaires Tailwind). Utilisez les variables CSS ou les utilitaires adossés aux jetons ; n'écrivez pas
de couleurs en dur.

## Composants du système de design

- Les polices (Geist, Geist Mono, Instrument Serif) sont intégrées depuis les paquets `@fontsource` via
  `src/styles/fonts.css` ; rien n'est chargé depuis le réseau.
- `src/styles/design-tokens.json` est le jumeau lisible par machine de `tokens.css`. `tokens.test.ts` vérifie
  que `tokens.css` lui correspond exactement (noms et valeurs) ; mettez donc les deux à jour ensemble.
- Les styles de texte sont des classes `.type-*` (`src/styles/typography.css`).
- Les composants de base se trouvent dans `src/components/` (Button, IconButton, FilterChip, SegmentedControl, Input,
  Badge, TechBadge, Toast, Drawer, InspectorPanel). Ouvrez `/gallery` pour les voir dans les deux thèmes.
- Contraste : `src/styles/contrastPairs.ts` liste les paires de jetons utilisées par les composants et le seuil AA
  que chacune doit atteindre ; `a11y.contrast.test.ts` les vérifie dans les deux thèmes. Les paires que les jetons publiés
  n'amènent pas au niveau AA figurent dans `KNOWN_TOKEN_SHORTFALLS` ; gardez les composants à l'écart de celles-ci.

## Infrastructure d'accessibilité

- `src/styles/a11y.css` contient l'anneau de focus (2 px `--focus-ring`, décalage de 2 px), les règles de
  mouvement réduit et les styles du contraste élevé de Windows (`forced-colors`). `a11y.css.test.ts` les vérifie.
- Le mouvement réduit est un fondu enchaîné de 100 ms : les glissements utilisent `--motion-shift`, qui devient 0, et les transitions
  ne conservent que la couleur et l'opacité. Il suit `prefers-reduced-motion`, sauf si le réglage Animations
  (`appearance.motion` : Système, Réduites, Complètes) place `data-motion` sur `<html>`. Le mouvement de la
  bibliothèque d'animation suit le même réglage via `MotionConfig` dans `AppShell`. Un élément de scintillement (shimmer) doit porter
  `data-cv-shimmer` pour que le mouvement réduit l'arrête.
- `src/lib/roving.ts` fournit `useRovingTabindex` et `nextRovingIndex` pour les groupes qui ne forment qu'un seul arrêt de tabulation
  (barres d'outils, listes, grille d'affiches) : flèches, Début/Fin, bouclage facultatif, colonnes de la grille, éléments désactivés.
- `features/chrome/shell.a11y.test.tsx` lance axe-core sur l'enveloppe (barre de titre, barre latérale, pages,
  centre de notifications). jsdom ne sait pas mesurer les couleurs affichées ; la règle
  `color-contrast` d'axe y est donc désactivée et `a11y.contrast.test.ts` couvre le contraste à partir des jetons.

## Textes, dates, nombres et tailles

- Pas d'anglais en dur dans l'enveloppe : écrivez `t("key", { param })` (depuis `src/i18n/catalog.ts`) et ajoutez le
  message à `src/i18n/messages/en.ts`. Pluriels : `{count, plural, one {# job} other {# jobs}}`.
- Affichez les dates, les heures, les nombres et les tailles de fichier avec `useFormat()` (ou `<FileSize bytes>`), jamais avec
  `toLocaleString()` ni un objet `Intl` partagé. Ils suivent Paramètres › Général › Format régional et
  Paramètres › Avancé › Unités de taille de fichier (base 10 : Go, base 2 : Gio).
