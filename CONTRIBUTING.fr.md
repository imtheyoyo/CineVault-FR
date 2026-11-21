# Contribuer à CineVault

[English](CONTRIBUTING.md) · **Français**

Merci de votre intérêt pour CineVault ! Les rapports de bugs, les idées, les corrections de documentation et le code sont tous les bienvenus. Cette page explique comment installer le projet, quelles vérifications lancer et comment les changements sont proposés. [AGENTS.md](AGENTS.md) contient la liste complète des commandes et des conventions (il est écrit autant pour les personnes que pour les assistants de code IA).

En participant, vous vous engagez à respecter le [code de conduite](CODE_OF_CONDUCT.fr.md).

## Signaler un bug et demander une fonctionnalité

- Cherchez d'abord parmi les [tickets existants](https://github.com/imtheyoyo/CineVault-FR/issues).
- Les questions sur l'installation, les modèles de nommage, le format à écrire ou le comportement attendu d'une fonctionnalité vont dans les [Discussions](https://github.com/imtheyoyo/CineVault-FR/discussions). Les tickets sont réservés aux bugs et aux demandes de fonctionnalités précises.
- Utilisez les modèles de ticket : un rapport de bug demande la version de CineVault, votre système d'exploitation, les étapes pour reproduire le problème et, si possible, un journal.
- Ne collez jamais de clés d'API dans un ticket. Les problèmes de sécurité se signalent en privé (voir [SECURITY.md](SECURITY.fr.md)).

## Installer le projet

Il vous faut :

- la chaîne d'outils [Rust](https://rustup.rs) stable (la cible MSVC sous Windows) ;
- [bun](https://bun.sh) ;
- les [prérequis de Tauri 2](https://v2.tauri.app/start/prerequisites/) (WebView2 sous Windows, les paquets de développement WebKitGTK et `libdbus` sous Linux, les outils en ligne de commande de Xcode sous macOS) ;
- la [CLI OpenSpec](https://github.com/Fission-AI/OpenSpec) si vous travaillez sur une fonctionnalité.

Ensuite, depuis la racine du dépôt :

```sh
bun install
cd ui && bun install && cd ..
bun run tools:fetch      # pinned MediaInfo, FFmpeg and helper tools into .dev-tools/
bun run tauri dev        # start the desktop app
```

L'interface fonctionne aussi seule dans un navigateur (`bun run dev` dans `ui/`) avec une bibliothèque synthétique intégrée, ce qui est le moyen le plus rapide de travailler sur les écrans.

Pour Scraper dans une version de développement, il vous faut votre propre [clé d'API TMDB](https://www.themoviedb.org/settings/api) gratuite, saisie dans l'application ; elle est conservée dans le magasin d'identifiants du système. Le dépôt et la compilation ne contiennent jamais de clés d'API.

## Vérifications à lancer avant une pull request

Rust (sous Git Bash sur Windows, commencez par `export PATH="$HOME/.cargo/bin:$PATH"`) :

```sh
cargo fmt --all
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace
```

Interface (dans `ui/`) :

```sh
bun run lint
bun run typecheck
bun run format:check
bun run test
bun run build
```

La CI lance les mêmes vérifications à chaque pull request, sous Windows et Linux (macOS arrive avec le travail de la version 1.2.0), et les deux tâches de compilation doivent réussir avant la fusion d'une pull request. Les pull requests sont fusionnées en squash avec un titre au format Conventional Commits.

De plus, selon le cas :

- **Types IPC modifiés :** régénérez `ui/src/bindings.ts` avec `CINEVAULT_UPDATE_BINDINGS=1 cargo test -p cinevault-app` (ou en démarrant l'application de débogage) et commitez-le.
- **Sortie des NFO, du renommage ou de l'analyse des noms modifiée volontairement :** mettez à jour les fichiers de référence avec `CINEVAULT_UPDATE_COMPAT=1 cargo test -p cv-compat` et relisez le diff ligne par ligne ; voir [tests/compat/README.md](tests/compat/README.fr.md).
- **Changements d'interface :** vérifiez les écrans dans les deux thèmes avec `bun run shots -- --routes <routes>` et joignez des captures d'écran à la pull request ; lancez `bun run check:facts` après avoir modifié l'en-tête de la page Film, ses informations ou la carte Technique.

Les tests ne doivent ni créer de gros fichiers ni toucher à de vrais dossiers de médias ; utilisez des dossiers temporaires. Les tests qui appellent des services en ligne sont facultatifs, activés par une variable d'environnement, et ignorés sans elle.

## Comment les fonctionnalités sont proposées : OpenSpec

Le comportement de chaque capacité est consigné dans [`openspec/specs/`](openspec/specs). Une nouvelle fonctionnalité ou un changement de comportement passe par un changement OpenSpec avant le code :

1. **Discutez** d'abord de l'idée dans un ticket, pour que nous nous accordions sur son adéquation avec CineVault.
2. **Proposez-la** : créez `openspec/changes/<name>/` avec `proposal.md` (pourquoi et quoi), `design.md` (comment, pour tout ce qui n'est pas trivial), les spécifications delta dans `specs/<capability>/spec.md` et `tasks.md`. `openspec validate <name> --strict` doit réussir. La commande `/opsx:propose` de `.claude/commands/` le fait avec un assistant IA.
3. **Appliquez-la** : implémentez les tâches, en les cochant dans `tasks.md`, avec des tests.
4. **Archivez-la** une fois la pull request fusionnée (`/opsx:archive` ou `openspec archive <name>`), ce qui intègre les spécifications delta dans `openspec/specs/`.

Les corrections de bugs qui rétablissent un comportement spécifié, les refactorisations, les tests et les corrections de documentation n'ont pas besoin de dossier de changement.

## Commits

Les messages de commit suivent [Conventional Commits v1.0.0](https://www.conventionalcommits.org/fr/v1.0.0/) :

```
<type>(<optional scope>): <description>

<body: why and what>
```

Types : `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `build`, `ci`, `perf`, `style`. Signalez les changements incompatibles avec `!` ou un pied de page `BREAKING CHANGE:`. Limitez chaque commit à un seul changement logique ; la portée est généralement la crate ou le domaine (`scan`, `nfo`, `rename`, `ui`, `library`…).

## Pull requests

- Créez votre branche depuis `main` et gardez la pull request centrée sur un seul sujet. Lorsqu'une branche `release/<version>` est ouverte, le mainteneur peut vous demander de la cibler à la place (voir la section Release train dans [AGENTS.md](AGENTS.md)).
- Remplissez le modèle : quoi et pourquoi, comment cela a été vérifié, le ticket lié et le changement OpenSpec.
- Suivez les conventions d'[AGENTS.md](AGENTS.md) : uniquement des jetons de design dans l'interface, des contrôles accessibles au clavier, un seul verbe par action (Scanner, Scraper, Renommer), la sécurité des données avant tout (rien n'est supprimé sans le choix de l'utilisateur, les renommages sont annulables), et une compatibilité décrite comme les formats Kodi, Jellyfin, Emby ou MediaPortal, sans nommer d'autres applications de gestion de médias.
- N'utilisez que du code que vous avez le droit de proposer. Les contributions sont placées sous la [licence Apache 2.0](LICENSE), comme le reste du projet.
- Attendez-vous à des commentaires de relecture ; de petits commits de suivi sont acceptés et sont fusionnés en squash ou conservés selon ce que décide le mainteneur.
