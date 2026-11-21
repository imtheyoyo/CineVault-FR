# Page d'accueil de CineVault

[English](README.md) · **Français**

Le site public est à l'adresse <https://imtheyoyo.github.io/CineVault-FR/>. C'est une page statique (un HTML, un CSS, un petit script, des captures d'écran WebP) servie par GitHub Pages, que le workflow **Deploy site** (`.github/workflows/site.yml`) alimente avec le contenu de ce dossier. Ce dossier est la source ; fusionner un changement qui le concerne (ou qui concerne `CHANGELOG.md`) dans `main` le publie.

- **Les liens de téléchargement** pointent vers `https://github.com/imtheyoyo/CineVault-FR/releases/latest/download/CineVault-setup-x64.exe` (ainsi que `CineVault-x64.msi` et `CineVault-portable-x64.zip`). `bun run release:publish` envoie ces copies sans numéro de version à chaque version, et celles de Linux aussi (`CineVault-x86_64.AppImage`, `CineVault-amd64.deb`, `CineVault-x86_64.rpm`), si bien que la page n'a pas besoin de changer pour une nouvelle version.
- **La version et la taille** sont écrites dans la page comme valeurs de secours ; `site.js` les remplace à partir de `api.github.com/repos/imtheyoyo/CineVault-FR/releases/latest` au chargement. Mettez à jour ces valeurs de secours (`data-version`, `data-size` dans `index.html`) de temps en temps.
- **Les captures d'écran** de `img/` viennent de `bun run shots` dans `ui/` avec le backend synthétique (affiches générées uniquement), une par thème (`*-dark.webp`, `*-light.webp`, choisies avec `prefers-color-scheme` ; bibliothèque, tableau, série, recherche, film, correspondance, renommage, nommage, disques, torrents et historique en 1440×900 ; les captures de la recherche et du nommage saisissent du texte dans la zone et cliquent dans la navigation avec des étapes `eval:` de `bun run shots`), converties avec FFmpeg de `.dev-tools/` (`-c:v libwebp -quality 82`). Gardez chacune sous 300 Ko environ. `og.png` est `assets/brand/social/social-preview.png` ; les favicons viennent de `assets/brand/favicon/`.
- **Scripts d'installation :** `scripts/install/install.sh` et `install.ps1` (l'installation du serveur en une commande) sont copiés à la racine du site par le workflow, et sont donc servis à `https://imtheyoyo.github.io/CineVault-FR/install.sh` et `install.ps1`. Ils ne sont pas dans ce dossier ; modifiez-les dans `scripts/install/`.
- **Règles :** pas de dégradés, jetons de marque issus de `ui/src/styles/tokens.css`, ne jamais nommer d'autres applications de gestion de médias, garder la mention TMDB dans le pied de page. La recherche de torrents s'affiche avec son propre avis de première visite : « You are responsible for what you download and share. » La page n'affirme que ce que fait l'application ; vérifiez toute nouvelle affirmation dans le code avant de l'ajouter. macOS est présenté comme « bientôt disponible » tant qu'aucun DMG n'est publié ; la page propose les téléchargements Windows et Linux.

## Déploiement

La page est déployée par le workflow **Deploy site** (`.github/workflows/site.yml`). Il se lance à chaque push sur `main` qui modifie `site/**`, `scripts/install/**` ou `CHANGELOG.md`, et à la main :

```sh
bun run site:changelog         # changelog.html must match CHANGELOG.md (CI and the workflow run it with -- --check)
gh workflow run site.yml       # redeploy without a change (Actions → Deploy site → Run workflow)
```

Le workflow compare `changelog.html` à `CHANGELOG.md`, copie ce dossier sans ce README dans l'artefact Pages et le déploie ; cela prend normalement environ une minute. Pages doit utiliser la source **GitHub Actions** (Settings → Pages → Build and deployment), ou, une seule fois, `gh api -X PUT repos/imtheyoyo/CineVault-FR/pages -f build_type=workflow`. L'ancienne branche `gh-pages` n'est plus utilisée. Vérifiez la page dans Chrome sans interface en 1440, 1024 et 390 px dans les deux thèmes avant de fusionner un changement qui la concerne.
