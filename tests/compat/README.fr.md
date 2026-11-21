# Fichiers de référence

[English](README.md) · **Français**

Les fichiers de référence (golden files) de CineVault : des entrées de test et la sortie exacte que CineVault produit pour elles. Ils figent, octet par octet, les fichiers NFO que CineVault écrit dans les formats Kodi, Jellyfin, Emby et MediaPortal, les noms de dossiers et de fichiers que construit le renommage, et ce que les analyseurs de noms lisent dans les noms de fichiers et de dossiers. Tout changement de cette sortie apparaît sous la forme d'un cas en échec.

```
tests/compat/
  fixtures/    inputs: file trees, entities, templates, settings (written by hand)
  expected/    CineVault's output for every input (written by the update mode, never by hand)
```

Le lanceur est la crate `cv-compat`.

## Exécution

```
cargo test -p cv-compat                                     # every case, plus the runner's own tests
cargo test -p cv-compat --test suite -- --nocapture         # prints the per-case report
cargo run -p cv-compat --bin compat-report -- --all         # one line per case
```

Chaque cas se termine par réussite, échec ou en attente (aucun gestionnaire enregistré pour sa famille). La suite échoue dès qu'un cas est en échec ou en attente.

## Mise à jour après un changement voulu

Quand un changement de comportement est voulu, écrivez la sortie actuelle de CineVault par-dessus les fichiers attendus :

```
CINEVAULT_UPDATE_COMPAT=1 cargo test -p cv-compat --test suite
# or
cargo run -p cv-compat --bin compat-report -- --update
```

Rien n'est écrit tant que chaque cas n'a pas produit de sortie. Ensuite, **relisez le diff de `tests/compat/expected/` avant de le commiter** : chaque ligne modifiée est un changement que les utilisateurs verront dans leurs fichiers NFO, leurs noms ou les résultats de scan. Commitez ensemble le changement de code et les fichiers de référence.

La sortie est déterministe : les gestionnaires fixent la date d'ajout des entités qui n'en ont pas (`2024-01-01 00:00:00`), écrivent `CineVault` sans version dans les commentaires des NFO, utilisent l'espace réservé `cv-compat-api-key` là où un NFO contient une clé d'API, et utilisent `/` comme séparateur de chemin pour les films et les NFO. Deux exécutions produisent des fichiers identiques.

## Familles

| Famille | Entrées | Sortie attendue |
|---|---|---|
| `classification` | `fixtures/classification.json` | `expected/classification.json` |
| `title-parsing` | `fixtures/title-parsing.json` | `expected/title-parsing.json` |
| `id-parsing` | `fixtures/id-parsing.json` | `expected/id-parsing.json` |
| `stacking` | `fixtures/stacking.json` | `expected/stacking.json` |
| `episodes` | `fixtures/episodes.json` | `expected/episodes.json` |
| `nfo` | `fixtures/nfo/cases.json`, `fixtures/nfo/entities/*.json` | `expected/nfo/<case id>/<relative path>.nfo`, `expected/nfo/index.json` |
| `rename-destinations`, `rename-trees` | `fixtures/rename/destinations.json`, `fixtures/rename/trees.json`, `fixtures/rename/entities/*.json` | `expected/rename/destinations.json`, `expected/rename/trees.json` |
| `rename-destinations-tv`, `rename-trees-tv` | `fixtures/rename/destinations-tv.json`, `fixtures/rename/trees-tv.json` | `expected/rename/destinations-tv.json`, `expected/rename/trees-tv.json` |
| `rename-copies` | `fixtures/rename/copies.json` | `expected/rename/copies.json` |

Les moteurs de rendu des jetons du renommage sont couverts par les cas `movie-token` et `tv-token` de `destinations*.json`. Pour ajouter une famille, implémentez `cv_compat::Handler` pour elle dans `crates/cv-compat/src/handlers.rs`.

### Formats de fichiers

Tous les fichiers JSON portent `"version": 1` et un tableau `"cases"` avec un cas par ligne. Chaque cas a un `id` unique ; un fichier attendu liste les mêmes `id` avec les résultats.

- **classification :** `{id, path}` avec `path` relatif à une source de données (aucun fichier n'a besoin d'exister). Résultat : `{id, type, disc_file, main_disc_identifier}` où `type` est le nom du type de fichier média.
- **title-parsing :** `{id, input, bad_words?}` (expressions régulières en minuscules). Résultat : `{id, title, year}` ; un `year` vide signifie qu'il n'y en a pas.
- **id-parsing :** `{id, input}`. Résultat : `{id, imdb, tmdb, tvdb}` ; un identifiant absent vaut `""` (IMDb, TVDB) ou `0` (TMDB).
- **stacking :** `{id, input}`, évalué à la fois comme nom de fichier et comme nom de dossier. Résultat : `{id, marker, number, prefix, cleaned, folder_marker, folder_cleaned}`.
- **episodes :** `{id, input, show}` avec un chemin relatif à la série. Résultat : `{id, season, episodes, date, stacking_marker_found, cleaned_title}` ; `season` vaut `-1` quand aucune n'a été trouvée, `date` est `yyyy-MM-dd` ou `""`.
- **nfo :** un cas est `{id, kind, entity, profile, settings?, existing_nfo?, write?}`. `kind` vaut `movie`, `movie-set` ou `tv`. `entity` désigne un fichier de `fixtures/nfo/entities/`. `profile` désigne un profil de réglages de `cases.json` ; `settings` le surcharge (objets `movie` et `tvShow` de noms de réglages pour le connecteur, le nommage et les options). `existing_nfo` est `{file, content}`, présent avant l'exécution, pour tester le contenu conservé et le contenu inconnu. `write` (TV uniquement) sélectionne `show`, `seasons` et `episodes`. Le dossier attendu contient chaque NFO écrit par le cas, octet par octet (UTF-8, CRLF ; `.gitattributes` empêche git de les convertir).
- **destinations de renommage :** `{id, kind, entity, template, episode?, episodes?, renamer?}`. Types : `movie-folder`, `movie-file`, `movie-token` (le rendu brut avant nettoyage), `tv-show-folder`, `tv-season-folder`, `tv-episode-file`, `tv-token`, `invalid-characters`, `pattern-check`. `renamer` surcharge des champs du profil de renommage. Les épisodes de série sont sélectionnés sous la forme `{season, episode}`. Résultat : `{id, result}`, ou les valeurs de contrôle pour `pattern-check` (`folder_unique`, `file_valid`, `tv_recommended`, `tv_pattern_error`).
- **arborescences de renommage :** `{id, kind, entity, profile, files?, folder?, renamer?, settings?}`. `files` remplace les fichiers de l'entité par une arborescence (une chaîne de chemin est classée d'après son nom ; un objet ajoute des informations média comme `videoCodec`, `audio`, `subtitles`, ou `content` pour un fichier écrit sur le disque, puisque seuls les NFO analysables sont renommés). Résultat : `{id, new_path, needs_rename, problems, groups}`, tel que l'aperçu du renommage les regroupe ; chaque groupe est `{old, new, duped}` avec des chemins relatifs triés (`new` peut pointer hors du dossier avec `../` quand un fichier reste où il est).
- **copies de renommage :** `{id, title, year, copies}`, chaque copie étant `{id, folder, video, copy?, resolution?, hdr?, source?, audio?}` : des copies d'un même film renommées ensemble avec le profil par défaut dans un dossier de bibliothèque, avec les informations dont sont faites leurs étiquettes (`copy: false` pour un film sans copie). Résultat : `{id, conflicts, copies}`, chaque copie étant `{id, label, folder, files}` avec son étiquette (vide s'il n'y en a pas), son nouveau dossier et ses nouveaux chemins triés.
- **entités :** un objet par film ou série avec des noms de champs simples (`title`, `year`, `plot`, `certification`, dates sous la forme `yyyy-MM-dd[ HH:mm:ss]`), plus `ids`, `ratings`, `genres`, `tags`, `actors`/`directors`/`writers`/`producers`, `trailers`, `artwork` (type vers URL), `files` (avec `audio` et `subtitles`) et, pour les séries, `episodes`, `seasons` et `episodeGroups`.

Les modèles TV de `destinations-tv.json` ne contiennent aucun séparateur de chemin, leurs résultats sont donc identiques sur toutes les plateformes.

## Autres fichiers de test écrits à la main dans ce dossier

Ils ne sont pas exécutés par les familles ci-dessus ; chacun a son propre test.

- `scan/movie-trees.json` : les arborescences de fichiers du parcours des dossiers de films. Chaque cas liste les fichiers d'une source de données et les films, avec leurs fichiers, que `cv_scan::walk` doit produire (cas de film unique, de films multiples, de disque, de fichiers empilés et d'exclusion). À lancer avec `cargo test -p cv-scan --test movie_trees`.
- `scan/tv-trees.json` : la même chose pour le parcours des séries (dossiers de saison, multi-épisodes, épisodes datés, anime, spéciaux, parties empilées, épisodes sur disque, illustrations de saison, sous-titres dans des sous-dossiers, règles d'exclusion). À lancer avec `cargo test -p cv-scan --test tv_trees`.
- `rename/presets.json` : les préréglages de nommage Clean, Detailed et Media-server safe rendus sur des entités de test (d'abord `rename/entities/`, puis `fixtures/rename/entities/`). À lancer avec `cargo test -p cv-compat --test presets`.
- `artwork/naming.json` : les noms exacts de fichiers d'illustrations que `cv_artwork::naming` écrit pour chaque préréglage de centre multimédia et chaque choix de nommage, y compris les illustrations de collection. À lancer avec `cargo test -p cv-artwork --test naming_fixtures` ; ce test vérifie aussi les fichiers d'illustrations que le renommage planifie dans `trees.json` et `trees-tv.json`, de sorte que l'écriture et le renommage ne puissent pas diverger.

Modifiez-les à la main et ajoutez un cas par comportement.
