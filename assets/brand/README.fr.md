# Éléments de marque de CineVault

[English](README.md) · **Français**

Le logo, les icônes d'application, les images des installateurs et les glyphes de CineVault. Chaque fichier a d'abord été dessiné en SVG ; les fichiers PNG, BMP, ICO et ICNS ont été générés à partir des SVG. Tout le texte des images est en Archivo vectorisé, donc rien ne dépend des polices installées.

Couleurs : graphite `#121214`, os `#ebe9e4`, papier `#f2f1ee`, encre `#1a1a19`, champagne `#cbb68a` (sombre) / `#7a6438` (clair) ; tuile d'icône `#1e1e22`. Aplats uniquement : pas de dégradés, de lueurs ni d'ombres floues.

## Fichiers et destinations

| Fichier | Taille | Utilisé par | Remarques |
| --- | --- | --- | --- |
| `logo/symbol-on-dark.svg`, `symbol-on-light.svg` | grille de 48 | `ui/src/components/BrandMark.tsx` (tracés intégrés) | Symbole de référence. Anneau = couleur du texte, cadre = champagne. |
| `logo/symbol-mono-black.svg`, `symbol-mono-white.svg` | grille de 48 | partout où une seule couleur est exigée | |
| `logo/hinted/symbol-{16,24,32,48}-on-{dark,light}.svg` | selon la taille | `BrandMark` en 16/18/24 px | Bords alignés sur des pixels entiers en 16 et 32. |
| `logo/wordmark-*.svg` | 474 × 92 | page À propos | Archivo SemiExpanded 600 vectorisé. |
| `logo/lockup-horizontal-*.svg`, `lockup-stacked-*.svg` | | README, site web, page À propos | `logo/png/*@2x.png` pour les endroits qui demandent des images matricielles. |
| `app-icon/windows/icon.ico` | 16, 24, 32, 48, 64, 256 | `src-tauri/icons/icon.ico` | Optimisée à la main en 16–64 (entrées PNG). |
| `app-icon/windows/icon-*.svg`, `png/icon-*.png` | | sources de l'ICO | `png/icon-1024.png` est la référence pour `tauri icon`. |
| `app-icon/macos/icon.icns` | 16–1024 dont @2x | `src-tauri/icons/icon.icns` | Grille Big Sur (corps de 824 dans 1024). Le 16 et le 32 sont des dessins distincts. |
| `app-icon/macos/icon-master-1024.svg`, `png/icon_*.png` | | sources de l'ICNS | Les noms correspondent à un dossier `.iconset`. |
| `app-icon/tauri/*.png` | | `src-tauri/icons/` (mêmes noms) | Icône de fenêtre et PNG pour Linux. |
| `tray/*.png` | 18, 36 | pas encore utilisé | Icônes de la barre des menus / de la zone de notification, prêtes pour une fonctionnalité de zone de notification. |
| `favicon/*` | | site web | `ui/index.html` peut aussi utiliser `favicon.svg`. |
| `installer/*.svg`, `installer/png/*` | | `src-tauri/installer/*.bmp` | Sources des BMP 24 bits des installateurs NSIS et WiX. |
| `dmg/dmg-background*.svg` | 660 × 400, 1320 × 800 | `src-tauri/installer/dmg-background.png` | Icônes en (180, 190) et (480, 190). |
| `social/readme-banner.png`, `@2x.png` | 1280 × 320 | `.github/assets/readme-banner.png` | Haut de `README.md`. |
| `social/social-preview.png` | 1280 × 640 | GitHub → Settings → Social preview | À téléverser à la main. |
| `glyphs/*.svg` | 24 × 24, trait de 1,75 | `ui/src/components/glyphs/` sous forme de composants React | `currentColor`, conventions de lucide. |

## Régénérer les icônes de l'application

`tauri icon` réduit une seule image, il ne peut donc pas produire les petites tailles optimisées ni l'icône macOS. Lancez-le depuis la racine du dépôt, puis écrasez ses sorties avec les fichiers faits à la main :

```sh
bun run tauri icon assets/brand/app-icon/windows/png/icon-1024.png
cp assets/brand/app-icon/windows/icon.ico  src-tauri/icons/icon.ico
cp assets/brand/app-icon/macos/icon.icns   src-tauri/icons/icon.icns
cp assets/brand/app-icon/tauri/*.png       src-tauri/icons/
```

Si `tauri icon` crée aussi `src-tauri/icons/android` ou `ios`, supprimez-les (l'application est uniquement pour le bureau). Lancez ensuite `bun run bundle:check`.
