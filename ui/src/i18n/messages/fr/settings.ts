/** Textes français de la zone Paramètres. Fusionnés avec les autres zones dans `../../catalog.ts`. */
export const settings = {
  // Page Outils externes
  "tools.desktopOnly": "Les outils externes se gèrent dans l’application de bureau.",
  "providers.desktopOnly": "Les clés des fournisseurs se gèrent dans l’application de bureau.",
  "providers.loadFailed": "CineVault n’a pas pu lire la liste des fournisseurs. {message}",
  "providers.testFailed": "Le test a échoué.",
  "providers.removed": "Identifiants {name} supprimés.",
  "providers.restored": "Identifiants {name} rétablis.",
  "providers.saved": "Identifiants {name} enregistrés.",
  "settings.page.title": "Paramètres",
  "settings.control.format.httpsUrl":
    "Saisissez une adresse web commençant par https:// ou laissez le champ vide. Elle n’a pas été enregistrée.",
  "settings.control.format.url":
    "Saisissez une adresse web commençant par http:// ou https://, sans nom d’utilisateur ni requête, ou laissez le champ vide. Elle n’a pas été enregistrée.",
  "settings.control.format.signingKey":
    "Saisissez la clé en base64 (44 caractères se terminant par =) ou laissez le champ vide. Elle n’a pas été enregistrée.",
  "settings.source": "Paramètres",
  "settings.saveFailed": "Un paramètre n’a pas pu être enregistré",
  "settings.resetFailed": "Une réinitialisation n’a pas pu être enregistrée",
  "settings.restoreFailed": "Les paramètres précédents n’ont pas pu être rétablis",
  "settings.changeUndone": "{reason} La modification a été annulée.",
  "settings.unreadable": "Vos paramètres n’ont pas pu être lus",
  "settings.loadFailed":
    "Les paramètres n’ont pas pu être chargés ; les valeurs par défaut sont utilisées",

  // Paramètres : libellés des options
  "settings.appearance.theme.option.dark": "Sombre",
  "settings.appearance.theme.option.light": "Clair",
  "settings.appearance.theme.option.system": "Système",
  "settings.appearance.motion.option.system": "Système",
  "settings.appearance.motion.option.reduced": "Réduites",
  "settings.general.locale.option.system": "Suivre le système",
  "settings.general.language.option.system": "Suivre le système",
  "settings.tv.episode-order.option.aired": "Diffusion",
  "settings.tv.episode-order.option.dvd": "DVD",
  "settings.tv.episode-order.option.absolute": "Absolu",
  "settings.advanced.size-units.option.base10": "Base 10 (Go)",
  "settings.advanced.size-units.option.base2": "Base 2 (Gio)",
  "settings.library.skip-patterns.title": "Dossiers à ignorer pendant le scan",
  "settings.library.skip-patterns.description":
    "Noms de dossiers que le scan n’explore pas, séparés par des points-virgules. Chaque entrée est une expression régulière ou un chemin de dossier complet. Un dossier contenant un fichier .cinevaultignore est toujours ignoré.",
  "settings.library.skip-patterns.keywords":
    "exclure, ignorer, exclusion, regex, dossiers, échantillons, bonus, exclude, ignore, skip, folders, samples, extras",
  "settings.library.skip-nomedia.title": "Ignorer les dossiers marqués par .nomedia",
  "settings.library.skip-nomedia.description":
    "Exclut tout dossier contenant un fichier .nomedia, ainsi que tout ce qu’il contient.",
  "settings.library.skip-nomedia.keywords":
    "exclure, ignorer, marqueur, caché, nomedia, exclude, ignore, marker, hidden",
  "settings.library.vsmeta-artwork.title": "Utiliser les illustrations des fichiers .vsmeta",
  "settings.library.vsmeta-artwork.description":
    "Lit les affiches et les fonds qu’un NAS enregistre dans des fichiers .vsmeta à côté des vidéos.",
  "settings.library.vsmeta-artwork.keywords":
    "synology, nas, vsmeta, illustrations, affiche, importer, artwork, poster, import",
  "settings.library.bad-words.title": "Mots à retirer des titres",
  "settings.library.bad-words.description":
    "Mots supprimés des noms de fichiers et de dossiers avant la lecture du titre, séparés par des virgules. Chacun est une expression régulière, sans distinction de casse.",
  "settings.library.bad-words.keywords":
    "mots indésirables, bruit, étiquettes de release, analyse, titre, bad words, noise, release tags, parser, strip, title",
  "settings.metadata.country.title": "Pays de classification",
  "settings.metadata.country.description":
    "Le pays dont la classification d’âge est écrite quand un titre en a plusieurs. Sa date de sortie n’est utilisée que si le paramètre suivant le demande.",
  "settings.metadata.country.keywords":
    "classification, âge, mpaa, date de sortie, région, certification, age rating, release date, region",
  "settings.metadata.local-release-date.title": "Utiliser la date de sortie de ce pays",
  "settings.metadata.local-release-date.description":
    "Désactivé : la date de première est la sortie originale du film. Activé : c’est la première sortie dans le pays de classification.",
  "settings.metadata.local-release-date.keywords":
    "date de sortie, première, local, pays, région, sortie originale, release date, premiered, country, original release",
  "settings.media.aspect-mode.option.fast": "Rapide (4 échantillons courts)",
  "settings.media.aspect-mode.option.default": "Standard (6 échantillons)",
  "settings.media.aspect-mode.option.accurate": "Précis (30 échantillons)",
  "settings.media.aspect-multi-format.option.most-common": "Le format le plus fréquent",
  "settings.media.aspect-multi-format.option.higher": "L’image la plus haute",
  "settings.media.aspect-multi-format.option.wider": "L’image la plus large",
  "settings.artwork.size.option.small": "Petite",
  "settings.artwork.size.option.medium": "Moyenne",
  "settings.artwork.size.option.big": "Grande",
  "settings.artwork.size.option.large": "Très grande",
  "settings.artwork.size.option.xlarge": "Extra grande",
  "settings.library.watch-debounce-seconds.title": "Attente avant de scanner un dossier modifié",
  "settings.library.watch-debounce-seconds.description":
    "Durée pendant laquelle un dossier surveillé doit rester calme avant d’être scanné de nouveau, pour qu’une copie en cours ne soit pas lue à moitié terminée. Au moins 5 secondes.",
  "settings.library.watch-debounce-seconds.keywords":
    "surveillance, délai, calme, secondes, copie, nouveau scan, watch, delay, debounce, quiet, seconds, copy, rescan",
  "settings.media.aspect-mode.title": "Précision de la détection du format d’image",
  "settings.media.aspect-mode.description":
    "Nombre de courts échantillons de l’image mesurés. Seul le mode précis cherche un second format dans le même film.",
  "settings.media.aspect-mode.keywords":
    "format d’image, ratio, bandes noires, échantillons, rapide, précis, ffmpeg, letterbox, samples, fast, accurate",
  "settings.media.aspect-round-up.title": "Arrondir le format à la valeur supérieure",
  "settings.media.aspect-round-up.description":
    "Enregistre le format standard plus large suivant plutôt que le plus proche.",
  "settings.media.aspect-round-up.keywords":
    "ratio, format d’image, arrondi, plus proche, plus large, standard, rounding, nearest, wider",
  "settings.media.aspect-multi-format.title": "Films qui changent de format",
  "settings.media.aspect-multi-format.description":
    "Le format à enregistrer quand un scan précis trouve deux formats dans un même film.",
  "settings.media.aspect-multi-format.keywords":
    "ratio, format d’image, imax, deux formats, le plus fréquent, plus large, two formats, most common, wider",
  "settings.renamer.keep-subfolders.title": "Conserver les sous-dossiers",
  "settings.renamer.keep-subfolders.description":
    "Un titre renommé reste dans son sous-dossier : Films/Amadeus devient Films/Amadeus (1984). Les styles avec leurs propres dossiers, comme les dossiers par lettre, démarrent à la racine du dossier de la bibliothèque.",
  "settings.renamer.keep-subfolders.keywords":
    "sous-dossiers, catégorie, conserver, aplatir, dossier, structure, renommer, sub-folders, subfolders, category, keep, flatten, folder, rename",
  "settings.renamer.metadata-only.title": "Métadonnées uniquement",
  "settings.renamer.metadata-only.description":
    "Ne jamais renommer ni déplacer vos fichiers et dossiers multimédias. Le scan, le scraping, les fichiers NFO et les illustrations continuent de fonctionner.",
  "settings.renamer.metadata-only.keywords":
    "métadonnées uniquement, pas de renommage, ne jamais renommer, lecture seule, gestionnaire de téléchargement, conserver les noms, déplacer, scraper seulement, metadata only, no rename, never rename, read only, download manager, keep names, move, scrape only",
  "settings.renamer.after-scrape.title": "Renommer après le scraping",
  "settings.renamer.after-scrape.description":
    "Renomme un titre automatiquement une fois son scraping écrit, avec possibilité d’annuler. Les titres en conflit attendent dans Activité.",
  "settings.renamer.after-scrape.offByMetadataOnly":
    "Désactivé tant que Métadonnées uniquement est activé.",
  "settings.renamer.after-scrape.keywords":
    "renommer après le scraping, renommage automatique, renommer automatiquement, rename after scrape, automatic rename, auto rename",
  "settings.library.folder-loose-files.title":
    "Créer un dossier pour les fichiers en vrac lors du scraping",
  "settings.library.folder-loose-files.description":
    "Un film dont le fichier est en vrac dans un dossier de la bibliothèque, ou dans un dossier partagé avec d’autres films, reçoit d’abord son propre dossier lors du scraping : son NFO et ses illustrations y sont écrits. Le fichier est déplacé, pas renommé, et l’Historique peut annuler l’opération.",
  "settings.library.folder-loose-files.offByMetadataOnly":
    "Désactivé tant que Métadonnées uniquement est activé, car aucun fichier n’est déplacé alors.",
  "settings.library.folder-loose-files.keywords":
    "fichiers en vrac, dossier, créer un dossier, propre dossier, déplacer, scraping, nfo, illustrations, dossier partagé, racine de la bibliothèque, loose files, folder, create folder, own folder, move, scrape, artwork, shared folder, library root",
  "settings.files.deleted-mode.title": "Fichiers supprimés et remplacés",
  "settings.files.deleted-mode.description":
    "Destination des fichiers supprimés, des originaux d’un déplacement, des restes de renommage et des illustrations ou fichiers NFO remplacés.",
  "settings.files.deleted-mode.keywords":
    "supprimer, supprimés, corbeille, effacer, définitivement, remplacés, restes, originaux, delete, deleted, recycle bin, trash, bin, erase, permanently, replaced, leftovers, originals",
  "settings.files.deleted-mode.option.bin": "{bin}",
  "settings.files.deleted-mode.option.folder": "Dossier corbeille sur chaque disque",
  "settings.files.deleted-mode.option.custom": "Dossier corbeille personnalisé…",
  "settings.files.deleted-mode.option.erase": "Supprimer définitivement",
  "settings.files.trash-folder.title": "Dossier corbeille personnalisé",
  "settings.files.trash-folder.description":
    "Les fichiers du disque de ce dossier y sont déplacés. Les fichiers des autres disques vont dans le dossier corbeille de leur propre disque, car les déplacer ici reviendrait à les copier.",
  "settings.files.trash-folder.keywords":
    "corbeille, dossier, personnalisé, supprimés, trash, folder, custom, deleted, recycle",
  "settings.delete.confirm.title": "Demander avant de supprimer",
  "settings.delete.confirm.description":
    "Supprimer indique ce qui va où et demande d’abord. Quand Fichiers supprimés est réglé sur Supprimer définitivement, Supprimer demande toujours.",
  "settings.delete.confirm.keywords":
    "supprimer, confirmer, demander, confirmation, boîte de dialogue, delete, confirm, ask, dialog, prompt",
  "settings.files.auto-empty-days.title": "Vider automatiquement les dossiers corbeille",
  "settings.files.auto-empty-days.description":
    "Efface ce qui se trouve dans les dossiers corbeille de CineVault depuis plus longtemps que cette durée. Ne touche jamais à la {bin}.",
  "settings.files.auto-empty-days.keywords":
    "vider, corbeille, automatiquement, jours, nettoyer, effacer, ancien, empty, trash, automatically, days, clean, erase, old",
  "settings.files.auto-empty-days.option.off": "Désactivé",
  "settings.files.auto-empty-days.option.7": "Après 7 jours",
  "settings.files.auto-empty-days.option.30": "Après 30 jours",
  "settings.files.auto-empty-days.option.90": "Après 90 jours",
  "settings.renamer.cleanup-unwanted.title": "Mettre les fichiers indésirables à la corbeille",
  "settings.renamer.cleanup-unwanted.description":
    "Après un renommage, et avec l’action Nettoyer les fichiers indésirables, les fichiers des types ci-dessous vont dans le dossier corbeille du dossier de la bibliothèque. Rien n’est supprimé.",
  "settings.renamer.cleanup-unwanted.keywords":
    "indésirables, nettoyage, déchets, txt, url, sfv, corbeille, unwanted, clean-up, cleanup, junk, trash",
  "settings.renamer.unwanted-patterns.title": "Types de fichiers indésirables",
  "settings.renamer.unwanted-patterns.description":
    "Des extensions comme .txt ou .url, ou un motif de nom de fichier, séparés par des virgules.",
  "settings.renamer.unwanted-patterns.keywords":
    "indésirables, nettoyage, extensions, motifs, déchets, unwanted, clean-up, cleanup, patterns, junk",
  "settings.artwork.poster-size.title": "Taille d’affiche préférée",
  "settings.artwork.poster-size.description":
    "La taille d’affiche à choisir quand plusieurs sont proposées.",
  "settings.artwork.poster-size.keywords":
    "affiche, taille, résolution, images, poster, size, resolution",
  "settings.artwork.fanart-size.title": "Taille de fond préférée",
  "settings.artwork.fanart-size.description":
    "La taille d’image de fond à choisir quand plusieurs sont proposées.",
  "settings.artwork.fanart-size.keywords":
    "fond, fanart, taille, résolution, images, backdrop, size, resolution",
  "settings.artwork.other-resolutions.title": "Utiliser d’autres tailles si nécessaire",
  "settings.artwork.other-resolutions.description":
    "Se rabat sur les autres tailles quand aucune ne correspond à la taille préférée.",
  "settings.artwork.other-resolutions.keywords":
    "illustrations, taille, repli, résolution, artwork, size, fallback, resolution",
  "settings.artwork.languages.title": "Langues d’illustrations préférées",
  "settings.artwork.languages.description":
    "Codes de langue séparés par des virgules, la meilleure en premier. Utilisez none pour les images sans texte. Vide, la langue des métadonnées est suivie, puis l’anglais.",
  "settings.artwork.languages.keywords":
    "illustrations, langue, sans texte, affiche, images, artwork, language, textless, poster",
  "settings.artwork.fanart-without-text.title": "Préférer les fonds sans texte",
  "settings.artwork.fanart-without-text.description":
    "Place en premier une image de fond sans inscription.",
  "settings.artwork.fanart-without-text.keywords":
    "fond, fanart, sans texte, images, textless, backdrop",
  "settings.artwork.any-language.title": "Accepter n’importe quelle langue en dernier recours",
  "settings.artwork.any-language.description":
    "Quand aucune image ne correspond aux langues préférées, prend la meilleure, quelle que soit sa langue.",
  "settings.artwork.any-language.keywords":
    "illustrations, langue, repli, images, artwork, language, fallback",
  "settings.advanced.log-level.option.error": "Erreurs uniquement",
  "settings.advanced.log-level.option.info": "Normal",
  "settings.advanced.log-level.option.debug": "Détaillé",

  // Paramètres : sections et paramètres (titres, descriptions et mots-clés de recherche)
  "settings.general.language.title": "Langue de l’interface",
  "settings.general.language.description":
    "La langue des menus, boutons et messages. « Suivre le système » utilise la langue du système d’exploitation si CineVault la propose, sinon l’anglais. L’application se recharge quand vous la changez.",
  "settings.general.language.keywords":
    "langue, language, français, french, anglais, english, traduction, interface",
  "settings.general.locale.title": "Format régional",
  "settings.general.locale.description":
    "Les dates, heures et nombres suivent cette région ; « Suivre le système » utilise le réglage du système d’exploitation. La langue de l’interface se choisit dans le réglage ci-dessus.",
  "settings.general.locale.keywords":
    "date, heure, nombre, langue, locale, région, format, décimale, time, number, language, region, decimal",

  // Renommer : le mode de renommage se décide dans Automatisation
  "settings.appearance.theme.title": "Thème",
  "settings.appearance.theme.description":
    "Sombre est le réglage par défaut. Système suit le système d’exploitation.",
  "settings.appearance.theme.keywords":
    "sombre, clair, suivre le système, couleur, apparence, dark, light, follow system, colour, color, appearance",
  "settings.appearance.motion.title": "Animations",
  "settings.appearance.motion.description":
    "Réduites remplace les glissements, zooms et effets de scintillement par un court fondu. Système suit le système d’exploitation.",
  "settings.appearance.motion.keywords":
    "animations réduites, mouvement, fondu, accessibilité, apparence, reduced motion, animation, crossfade, accessibility, appearance",
  "settings.appearance.zoom.title": "Taille",
  "settings.appearance.zoom.description":
    "Taille d’affichage de toute l’application, de 80 % à 150 %. Ctrl et + ou − la modifient, Ctrl et 0 rétablit 100 % ; sous macOS, utilisez Commande.",
  "settings.appearance.zoom.keywords":
    "zoom, taille, échelle, plus grand, plus petit, taille du texte, apparence, size, scale, bigger, smaller, text size, appearance",
  "settings.general.check-updates.title": "Rechercher les mises à jour",
  "settings.general.check-updates.description":
    "Cherche une nouvelle version en arrière-plan. Vous voyez d’abord les notes de version, et rien ne s’installe sans vous.",
  "settings.general.check-updates.keywords":
    "mise à jour, mettre à jour, version, publication, update, upgrade, release",
  "settings.general.update-interval.title": "Fréquence de recherche des mises à jour",
  "settings.general.update-interval.description":
    "À quelle fréquence CineVault cherche une nouvelle version.",
  "settings.general.update-interval.keywords":
    "mise à jour, fréquence, quotidien, hebdomadaire, mensuel, update, upgrade, how often, daily, weekly, monthly",
  "settings.general.update-interval.option.daily": "Tous les jours",
  "settings.general.update-interval.option.weekly": "Toutes les semaines",
  "settings.general.update-interval.option.monthly": "Tous les mois",
  "settings.general.update-channel.title": "Canal de mise à jour",
  "settings.general.update-channel.description":
    "Laissez vide pour recevoir les mises à jour des versions officielles de CineVault. Pour utiliser un autre canal, saisissez l’adresse de son manifeste de mise à jour signé ; elle doit commencer par https.",
  "settings.general.update-channel.keywords":
    "mise à jour, canal, manifeste, publication, flux, adresse, update, channel, manifest, release, feed, url, address",
  "settings.general.update-public-key.title": "Clé de signature des mises à jour",
  "settings.general.update-public-key.description":
    "La clé publique avec laquelle le manifeste doit être signé, en base64. Laissez vide pour utiliser la clé intégrée à cette version de CineVault, si elle en a une.",
  "settings.general.update-public-key.keywords":
    "mise à jour, signature, signé, ed25519, clé publique, update, signed, public key",
  "settings.library.reset-new-on-update.title":
    "Réinitialiser Nouveau lors de la mise à jour des dossiers",
  "settings.library.reset-new-on-update.description":
    "Efface tous les marqueurs Nouveau au début d’une mise à jour de vos dossiers de bibliothèque, pour que seul ce que cette mise à jour trouve soit marqué.",
  "settings.library.reset-new-on-update.keywords":
    "nouveau, indicateur, badge, nouveau scan, actualiser, effacer, new, flag, rescan, refresh, clear",
  "settings.media.store-mediainfo-xml.title": "Enregistrer le XML MediaInfo à côté des médias",
  "settings.media.store-mediainfo-xml.description":
    "Enregistre les détails vidéo et audio à côté de chaque vidéo, pour qu’un partage réseau lent ne soit lu qu’une fois.",
  "settings.media.store-mediainfo-xml.keywords":
    "fichier annexe, mediainfo, xml, cache, détails des flux, sidecar, stream details",
  "settings.media.runtime-from-media.title": "Utiliser la durée de la vidéo comme durée du film",
  "settings.media.runtime-from-media.description":
    "Remplace la durée scrapée par la durée du fichier vidéo. Les parties d’un film en plusieurs fichiers sont additionnées.",
  "settings.media.runtime-from-media.keywords":
    "durée, minutes, longueur, plusieurs parties, scrapé, duration, length, stacked, scraped",
  "settings.media.detect-aspect-ratio.title": "Détecter le format d’image",
  "settings.media.detect-aspect-ratio.description":
    "Mesure l’image visible sans les bandes noires après la lecture des informations du média. Nécessite FFmpeg.",
  "settings.media.detect-aspect-ratio.keywords":
    "format d’image, ratio, bandes noires, recadrer, ffmpeg, grand écran, letterbox, black bars, crop, widescreen",
  "settings.media.checksums-after-scrape.title":
    "Calculer les sommes de contrôle après un scraping",
  "settings.media.checksums-after-scrape.description":
    "Calcule le CRC-32 ou l’empreinte d’image de la vidéo une fois un titre scrapé. L’empreinte d’image nécessite FFmpeg.",
  "settings.media.checksums-after-scrape.keywords":
    "somme de contrôle, empreinte, doublon, vérifier, crc32, phash, hash, duplicate, verify",
  "settings.media.checksums-after-scrape.option.off": "Désactivé",
  "settings.media.checksums-after-scrape.option.crc32": "CRC-32",
  "settings.media.checksums-after-scrape.option.phash": "Empreinte d’image",
  "settings.media.checksums-after-scrape.option.all": "Les deux",
  "settings.library.remember-filters.title": "Mémoriser les filtres",
  "settings.library.remember-filters.description":
    "Conserve la recherche et les filtres de chaque bibliothèque au redémarrage de CineVault.",
  "settings.library.remember-filters.keywords":
    "conserver, restaurer, recherche, puces, session, persist, restore, search, chips",
  "settings.subtitles.language-style.title": "Langue dans les noms de fichiers de sous-titres",
  "settings.subtitles.language-style.description":
    "Comment la langue est écrite dans le nom d’un sous-titre téléchargé ou déposé. Par défaut, le profil de nommage actif est suivi.",
  "settings.subtitles.language-style.keywords":
    "sous-titres, code de langue, iso, nom de fichier, subtitles, language code, file name",
  "settings.subtitles.language-style.option.profile": "Comme le profil de nommage",
  "settings.subtitles.language-style.option.ISO3T": "ISO 639-2/T (eng, deu)",
  "settings.subtitles.language-style.option.ISO3B": "ISO 639-2/B (eng, ger)",
  "settings.subtitles.language-style.option.ISO2": "ISO 639-1 (en, de)",
  "settings.subtitles.language-style.option.LANG_EN": "Nom anglais (English, German)",
  "settings.subtitles.language-style.option.LANG_LOCALIZED":
    "Nom dans la langue (English, Deutsch)",
  "settings.subtitles.language-style.option.ORIGINAL": "Tel que donné par le fournisseur",
  "settings.movies.collections.auto-group.title": "Regrouper les films en collections",
  "settings.movies.collections.auto-group.description":
    "Quand un film est scrapé, le place dans la collection indiquée par le fournisseur, et crée la collection si la bibliothèque n’en a pas. Désactivé, les collections sont laissées à Rechercher les collections et à vous.",
  "settings.movies.collections.auto-group.keywords":
    "ensembles, saga, franchise, série, coffret, sets, series, boxset",
  "settings.tv.episode-order.title": "Ordre des épisodes",
  "settings.tv.episode-order.description":
    "La numérotation dans laquelle une série démarre lors de son premier scraping, si le fournisseur la propose. Chaque série peut être changée sur sa propre page.",
  "settings.tv.episode-order.keywords":
    "diffusion, dvd, absolu, saisons, numérotation, aired, absolute, seasons, numbering",
  "settings.tv.specials.show.title": "Afficher les épisodes spéciaux",
  "settings.tv.specials.show.description":
    "Affiche la saison 0 (épisodes spéciaux, bonus) avec les autres saisons. Le commutateur Spéciaux au-dessus d’une liste de saisons la modifie aussi.",
  "settings.tv.specials.show.keywords": "saison 0, bonus, spéciaux, season 0, extras, specials",
  "settings.tv.season-art-fallback.title":
    "Utiliser les illustrations de la série pour les saisons qui n’en ont pas",
  "settings.tv.season-art-fallback.description":
    "Une saison sans affiche ni fond propres affiche ceux de la série. Les fichiers ne sont pas copiés.",
  "settings.tv.season-art-fallback.keywords":
    "affiche de saison, repli, illustrations, season poster, fallback, artwork",
  "settings.metadata.language.title": "Langue des métadonnées",
  "settings.metadata.language.description": "La langue des titres, des synopsis et des genres.",
  "settings.metadata.language.keywords": "langue, traduction, scraper, locale, translation",
  "settings.metadata.fallback-language.title": "Langue de repli",
  "settings.metadata.fallback-language.description":
    "Utilisée quand un titre ou un synopsis manque dans la langue des métadonnées.",
  "settings.metadata.fallback-language.keywords":
    "langue, traduction, manquant, repli, locale, translation, missing, fallback",
  "settings.matching.auto-accept-threshold.title": "Correspondance automatique à partir de",
  "settings.matching.auto-accept-threshold.description":
    "Un titre est associé sans demander quand son meilleur candidat atteint au moins ce niveau de confiance et qu’aucun autre candidat ne l’égale. Tout le reste attend dans la file de vérification.",
  "settings.matching.auto-accept-threshold.keywords":
    "correspondance, confiance, seuil, vérification, automatique, accepter, match, confidence, threshold, review, automatic, accept",
  "settings.metadata.scrape-do-not-overwrite.title": "Ne pas écraser les données existantes",
  "settings.metadata.scrape-do-not-overwrite.description":
    "Un scraping ne remplit que les champs vides et conserve tout ce que vous avez déjà.",
  "settings.metadata.scrape-do-not-overwrite.keywords":
    "scraping, écraser, conserver, vide, remplir, scrape, overwrite, keep, empty, fill",
  "settings.metadata.scrape-fields-movie.title": "Champs de film à scraper",
  "settings.metadata.scrape-fields-movie.description":
    "Les champs qu’un scraping peut écrire pour les films. Les champs verrouillés et les titres verrouillés ne sont jamais modifiés.",
  "settings.metadata.scrape-fields-movie.keywords":
    "scraping, champs, note, illustrations, verrou, actualiser, scrape, fields, rating, artwork, lock, refresh",
  "settings.metadata.scrape-fields-show.title": "Champs de série à scraper",
  "settings.metadata.scrape-fields-show.description":
    "Les champs qu’un scraping peut écrire pour les séries. Les champs verrouillés et les titres verrouillés ne sont jamais modifiés.",
  "settings.metadata.scrape-fields-show.keywords":
    "scraping, champs, note, illustrations, verrou, actualiser, scrape, fields, rating, artwork, lock, refresh",
  "settings.metadata.scrape-fields-episode.title": "Champs d’épisode à scraper",
  "settings.metadata.scrape-fields-episode.description":
    "Les champs qu’un scraping peut écrire pour les épisodes. Les champs verrouillés et les titres verrouillés ne sont jamais modifiés.",
  "settings.metadata.scrape-fields-episode.keywords":
    "scraping, champs, note, vignette, verrou, scrape, fields, rating, thumbnail, lock",
  "settings.ratings.preferred-source.title": "Note préférée",
  "settings.ratings.preferred-source.description":
    "La note affichée dans la colonne Note, utilisée pour le tri et écrite comme note par défaut dans les fichiers NFO. Un titre sans note de cette source affiche la source disponible suivante, signalée comme valeur de remplacement.",
  "settings.ratings.preferred-source.keywords":
    "note, imdb, tmdb, letterboxd, tri, colonne, score, rating, sort, column",
  "settings.ratings.source.imdb-dataset": "Jeu de données de notes IMDb",
  "settings.ratings.source.scraper": "Le fournisseur de scraping",
  "settings.ratings.source.omdb": "OMDb",
  "settings.ratings.source.mdblist": "MDBList",
  "settings.ratings.sources-movie.title": "Sources de notes pour les films",
  "settings.ratings.sources-movie.description":
    "Où Récupérer les notes cherche les notes d’un film. Une source dont la clé n’est pas définie est ignorée, et la note indique qu’une clé est requise tant que vous n’en ajoutez pas une dans Fournisseurs.",
  "settings.ratings.sources-movie.keywords":
    "note, omdb, mdblist, imdb, jeu de données, récupérer, rating, dataset, fetch",
  "settings.ratings.sources-show.title": "Sources de notes pour les séries",
  "settings.ratings.sources-show.description":
    "Où Récupérer les notes cherche les notes d’une série. Une source dont la clé n’est pas définie est ignorée, et la note indique qu’une clé est requise tant que vous n’en ajoutez pas une dans Fournisseurs.",
  "settings.ratings.sources-show.keywords":
    "note, omdb, mdblist, imdb, jeu de données, récupérer, séries, rating, dataset, fetch, series",
  "settings.ratings.fetch-after-scrape-movie.title":
    "Récupérer les notes après le scraping d’un film",
  "settings.ratings.fetch-after-scrape-movie.description":
    "Ajoute à un film, dès qu’il est scrapé, les notes des sources de notes pour les films (Paramètres › Scraping et fournisseurs).",
  "settings.ratings.fetch-after-scrape-movie.keywords":
    "note, automatique, scraping, récupérer, rating, automatic, scrape, fetch",
  "settings.ratings.fetch-after-scrape-show.title":
    "Récupérer les notes après le scraping d’une série",
  "settings.ratings.fetch-after-scrape-show.description":
    "Ajoute à une série, dès qu’elle est scrapée, les notes des sources de notes pour les séries (Paramètres › Scraping et fournisseurs).",
  "settings.ratings.fetch-after-scrape-show.keywords":
    "note, automatique, scraping, récupérer, séries, rating, automatic, scrape, fetch, series",
  "settings.providers.prefer-original-title.title": "Préférer le titre original",
  "settings.providers.prefer-original-title.description":
    "Affiche le titre dans sa langue originale sur les cartes, les listes et les pages de détail, quand le titre en a un.",
  "settings.providers.prefer-original-title.keywords":
    "titre original, langue d’origine, étranger, native, foreign",
  "settings.metadata.original-title-languages.title":
    "Conserver le titre original pour ces langues",
  "settings.metadata.original-title-languages.description":
    "Un film ou une série dont la langue originale est l’une de celles-ci utilise son titre original dans la bibliothèque, les noms de fichiers et le NFO dès son premier scraping.",
  "settings.metadata.original-title-languages.keywords":
    "titre original, titre localisé, étranger, langue, renommer, original title, localized, foreign, native, language, rename",
  "settings.metadata.nfo-format.title": "Format NFO",
  "settings.metadata.nfo-format.description":
    "La variante des fichiers .nfo écrits à côté de vos médias.",
  "settings.metadata.nfo-format.keywords":
    "kodi, jellyfin, emby, fichier annexe, fichiers de métadonnées, sidecar, metadata files",
  "settings.metadata.nfo-mediaportal-style.title": "Style NFO MediaPortal",
  "settings.metadata.nfo-mediaportal-style.description":
    "La disposition MediaPortal utilisée par les NFO de films quand le format est MediaPortal.",
  "settings.metadata.nfo-mediaportal-style.keywords":
    "mediaportal, moving pictures, myvideo, ancien, nfo, legacy",
  "settings.metadata.nfo-mediaportal-style.option.legacy": "Ancien",
  "settings.metadata.nfo-mediaportal-style.option.moving-pictures": "Moving Pictures",
  "settings.metadata.nfo-mediaportal-style.option.myvideo": "MyVideo",
  "settings.metadata.nfo-language.title": "Langue du NFO",
  "settings.metadata.nfo-language.description":
    "La langue des noms de genres et de langues parlées dans les fichiers NFO.",
  "settings.metadata.nfo-language.keywords":
    "nfo, genres, langues, traduction, fichier annexe, languages, translation, sidecar",
  "settings.metadata.nfo-certification.title": "Format de classification",
  "settings.metadata.nfo-certification.description":
    "Comment la classification d’âge est écrite dans les fichiers NFO.",
  "settings.metadata.nfo-certification.keywords":
    "nfo, mpaa, note, classification, fsk, âge, rating, certification, age",
  "settings.metadata.nfo-certification.option.short": "Court (PG-13)",
  "settings.metadata.nfo-certification.option.short-mpaa": "Court, US en Rated (Rated PG-13)",
  "settings.metadata.nfo-certification.option.medium": "Avec le pays (US: PG-13)",
  "settings.metadata.nfo-certification.option.medium-full":
    "Avec le nom du pays (United States: PG-13)",
  "settings.metadata.nfo-certification.option.large":
    "Toutes les formes (US:PG-13 / US:Rated PG-13)",
  "settings.metadata.nfo-certification.option.large-full": "Toutes les formes, noms de pays",
  "settings.metadata.nfo-certification.option.technical": "Technique (US_PG13)",
  "settings.metadata.nfo-certification.option.technical2": "Technique avec tiret (US-PG13)",
  "settings.metadata.nfo-create-outline.title": "Créer le résumé à partir du synopsis",
  "settings.metadata.nfo-create-outline.description":
    "Remplit le résumé du NFO à partir du synopsis quand un titre n’en a pas.",
  "settings.metadata.nfo-create-outline.keywords": "nfo, résumé, synopsis, outline, summary, plot",
  "settings.metadata.nfo-outline-first-sentence.title": "Le résumé est la première phrase",
  "settings.metadata.nfo-outline-first-sentence.description":
    "Utilise la première phrase du synopsis pour un résumé créé, plutôt que le synopsis entier.",
  "settings.metadata.nfo-outline-first-sentence.keywords":
    "nfo, résumé, phrase, synopsis, outline, sentence, plot",
  "settings.metadata.nfo-single-studio.title": "Écrire uniquement le premier studio",
  "settings.metadata.nfo-single-studio.description":
    "Indique un seul studio dans les fichiers NFO au lieu de tous.",
  "settings.metadata.nfo-single-studio.keywords":
    "nfo, studio, société de production, production company",
  "settings.metadata.nfo-date-added.title": "Écrire la date d’ajout",
  "settings.metadata.nfo-date-added.description":
    "Ajoute une entrée de date d’ajout dans les fichiers NFO.",
  "settings.metadata.nfo-date-added.keywords":
    "nfo, dateadded, date d’ajout, ajouté, ajouts récents, added, recently added",
  "settings.metadata.nfo-date-added-source.title": "L’origine de la date d’ajout",
  "settings.metadata.nfo-date-added-source.description":
    "La date que contient l’entrée de date d’ajout.",
  "settings.metadata.nfo-date-added-source.keywords":
    "nfo, dateadded, création du fichier, modifié, sortie, file creation, modified, release",
  "settings.metadata.nfo-date-added-source.option.added": "Ajout à CineVault",
  "settings.metadata.nfo-date-added-source.option.file-created": "Date de création du fichier",
  "settings.metadata.nfo-date-added-source.option.file-modified": "Date de modification du fichier",
  "settings.metadata.nfo-date-added-source.option.release": "Date de sortie",
  "settings.metadata.nfo-artwork-urls.title": "Écrire les adresses web des illustrations",
  "settings.metadata.nfo-artwork-urls.description":
    "Indique dans les fichiers NFO les adresses des affiches et des fonds, ainsi que les photos de la distribution.",
  "settings.metadata.nfo-artwork-urls.keywords":
    "nfo, vignette, fanart, affiche, images, adresses, thumb, poster, urls",
  "settings.metadata.nfo-trailer.title": "Écrire la bande-annonce",
  "settings.metadata.nfo-trailer.description":
    "Ajoute l’adresse de la bande-annonce dans les fichiers NFO.",
  "settings.metadata.nfo-trailer.keywords": "nfo, bande-annonce, trailer, youtube",
  "settings.metadata.nfo-fileinfo.title": "Écrire les détails du fichier",
  "settings.metadata.nfo-fileinfo.description":
    "Ajoute les détails vidéo, audio et sous-titres dans les fichiers NFO.",
  "settings.metadata.nfo-fileinfo.keywords":
    "nfo, fileinfo, flux, codec, résolution, streams, resolution",
  "settings.metadata.nfo-external-audio.title": "Inclure les fichiers audio à côté de la vidéo",
  "settings.metadata.nfo-external-audio.description":
    "Liste dans les détails du fichier les flux audio des fichiers audio séparés.",
  "settings.metadata.nfo-external-audio.keywords":
    "nfo, fileinfo, audio externe, flux, external audio, streams",
  "settings.metadata.nfo-lockdata.title": "Écrire l’indicateur de verrouillage",
  "settings.metadata.nfo-lockdata.description":
    "Indique à Jellyfin et Emby de ne pas modifier les métadonnées de ces titres.",
  "settings.metadata.nfo-lockdata.keywords":
    "nfo, lockdata, verrou, verrouillage, jellyfin, emby, lock",
  "settings.metadata.nfo-clean.title": "Écrire des fichiers NFO épurés",
  "settings.metadata.nfo-clean.description":
    "N’écrit que ce que CineVault connaît. Les éléments et l’historique de visionnage déjà présents dans le fichier ne sont pas conservés.",
  "settings.metadata.nfo-clean.keywords":
    "nfo, épuré, éléments inconnus, champs personnalisés, conserver, clean, unknown elements, custom fields, preserve",
  "settings.metadata.nfo-movie-names.title": "Noms des fichiers NFO de films",
  "settings.metadata.nfo-movie-names.description":
    "Le nom de fichier d’un NFO de film. Un dossier contenant plusieurs films utilise toujours le nom de la vidéo.",
  "settings.metadata.nfo-movie-names.keywords":
    "nfo, nommage, movie.nfo, nom de fichier, naming, file name",
  "settings.metadata.nfo-movie-names.option.video-base": "Nom de la vidéo (Film (2010).nfo)",
  "settings.metadata.nfo-movie-names.option.movie": "movie.nfo",
  "settings.metadata.nfo-movie-names.option.both": "Les deux",
  "settings.metadata.nfo-disc-folder.title": "NFO dans les dossiers de disque",
  "settings.metadata.nfo-disc-folder.description":
    "Place le NFO d’un film sur disque dans le dossier du disque, nommé d’après son fichier principal.",
  "settings.metadata.nfo-disc-folder.keywords": "nfo, disque, bluray, dvd, video_ts, bdmv, disc",
  "settings.metadata.nfo-set-names.title": "Noms des fichiers NFO de collections",
  "settings.metadata.nfo-set-names.description": "Le nom de fichier d’un NFO de collection.",
  "settings.metadata.nfo-set-names.keywords":
    "nfo, collection, ensemble, nommage, collection.nfo, set, naming",
  "settings.metadata.nfo-set-names.option.set-name": "Nom de la collection (Nom.nfo)",
  "settings.metadata.nfo-set-names.option.set": "set.nfo",
  "settings.metadata.nfo-set-names.option.collection": "collection.nfo",
  "settings.metadata.nfo-set-names.option.all": "Les trois",
  "settings.metadata.nfo-collection-folder.title": "Dossier des collections",
  "settings.metadata.nfo-collection-folder.description":
    "Où sont écrits les NFO de collections et les illustrations de collections de style Kodi et Automator. Les NFO de collections sont ignorés tant qu’il n’est pas défini.",
  "settings.metadata.nfo-collection-folder.keywords":
    "nfo, collection, ensemble, dossier, dossier d’illustrations, dossier de données, set, folder, artwork folder, data folder",
  "settings.metadata.nfo-collection-tmdb-id.title": "Ajouter l’ID TMDB aux dossiers de collections",
  "settings.metadata.nfo-collection-tmdb-id.description":
    "Ajoute l’ID de collection TMDB au nom du dossier et des fichiers de la collection (Nom-tmdb-123).",
  "settings.metadata.nfo-collection-tmdb-id.keywords":
    "nfo, collection, tmdb, nom de dossier, illustrations, folder name, artwork",
  "settings.metadata.collection-name-replacement.title":
    "Remplacer les caractères dans les noms de collections",
  "settings.metadata.collection-name-replacement.description":
    "Ce qui remplace chaque caractère qu’un nom de fichier ne peut pas contenir (comme les deux-points) dans les noms de dossiers et de fichiers de collections. Laissez vide pour les supprimer.",
  "settings.metadata.collection-name-replacement.keywords":
    "collection, ensemble, nom, caractères, deux-points, remplacer, interdit, nom de dossier, set, name, characters, colon, replace, illegal, folder name",
  "settings.metadata.nfo-season-names.title": "Noms des fichiers NFO de saisons",
  "settings.metadata.nfo-season-names.description": "Le nom de fichier d’un NFO de saison.",
  "settings.metadata.nfo-season-names.keywords": "nfo, saison, nommage, season.nfo, season, naming",
  "settings.metadata.nfo-season-names.option.season": "Dans le dossier de la série (season01.nfo)",
  "settings.metadata.nfo-season-names.option.season-folder":
    "Dans le dossier de la saison (season.nfo)",
  "settings.metadata.nfo-season-names.option.both": "Les deux",
  "settings.metadata.nfo-all-actors.title": "Écrire tous les acteurs dans le NFO de la série",
  "settings.metadata.nfo-all-actors.description":
    "Ajoute les acteurs invités des épisodes au NFO de la série.",
  "settings.metadata.nfo-all-actors.keywords":
    "nfo, acteurs, invités, distribution, série, actors, guest stars, cast, tv",
  "settings.metadata.nfo-episodeguide.title": "Guide des épisodes",
  "settings.metadata.nfo-episodeguide.description":
    "Comment l’entrée du guide des épisodes d’un NFO de série est écrite.",
  "settings.metadata.nfo-episodeguide.keywords":
    "nfo, episodeguide, guide des épisodes, tvdb, tmdb, série, tv",
  "settings.metadata.nfo-episodeguide.option.json": "JSON avec les ID de la série",
  "settings.metadata.nfo-episodeguide.option.url": "Adresse web",
  "settings.metadata.nfo-episodeguide.option.off": "Ne pas l’écrire",
  "settings.metadata.nfo-end-date.title": "Écrire la date de fin",
  "settings.metadata.nfo-end-date.description":
    "Ajoute la date du dernier épisode au NFO d’une série terminée (Jellyfin et Emby).",
  "settings.metadata.nfo-end-date.keywords":
    "nfo, enddate, date de fin, terminée, série, ended, tv",
  "settings.artwork.auto-select.title": "Choisir les illustrations automatiquement",
  "settings.artwork.auto-select.description":
    "Choisit l’image la mieux notée dans votre langue pour chaque type.",
  "settings.artwork.auto-select.keywords":
    "affiche, fond, fanart, images, automatique, poster, automatic",
  "settings.metadata.artwork-names.title": "Noms des fichiers d’illustrations",
  "settings.metadata.artwork-names.description":
    "Comment les affiches, les fonds et les autres images sont nommés. Plusieurs noms pour un même type reçoivent tous la même image.",
  "settings.metadata.artwork-names.keywords":
    "affiche, fond, fanart, nommage, folder.jpg, clearlogo, paysage, préfixe, personnalisé, centre multimédia, poster, naming, backdrop, landscape, prefix, custom, media centre",
  "settings.metadata.artwork-names.option.prefixed": "Nom du film devant",
  "settings.metadata.artwork-names.option.short": "Noms simples",
  "settings.metadata.artwork-names.option.both": "Les deux noms",
  "settings.metadata.artwork-names.option.jellyfin": "Jellyfin",
  "settings.metadata.artwork-names.option.emby": "Emby",
  "settings.metadata.artwork-names.option.kodi": "Kodi",
  "settings.metadata.artwork-names.option.xbmc": "Kodi, fonds supplémentaires dans un dossier",
  "settings.metadata.artwork-names.option.plex":
    "Noms simples, vignettes d’épisodes nommées comme la vidéo",
  "settings.artwork.extra-fanart-enabled.title": "Télécharger des fonds supplémentaires",
  "settings.artwork.extra-fanart-enabled.description":
    "Enregistre d’autres images de fond à côté de chaque titre. Non écrits pour les dossiers contenant plusieurs films.",
  "settings.artwork.extra-fanart-enabled.keywords":
    "extrafanart, fonds, images, fanart supplémentaire, backgrounds",
  "settings.artwork.extra-fanart.title": "Fonds supplémentaires par titre",
  "settings.artwork.extra-fanart.description":
    "Combien d’images de fond supplémentaires télécharger quand les fonds supplémentaires sont activés. Les précédentes sont remplacées.",
  "settings.artwork.extra-fanart.keywords":
    "extrafanart, fonds, images, nombre, backgrounds, count",
  "settings.artwork.extra-thumbs.title": "Télécharger des vignettes supplémentaires",
  "settings.artwork.extra-thumbs.description":
    "Enregistre des vignettes supplémentaires dans un dossier extrathumbs. Non écrites pour les dossiers contenant plusieurs films.",
  "settings.artwork.extra-thumbs.keywords": "extrathumbs, vignettes, images, thumbs",
  "settings.artwork.extra-thumbs-count.title": "Vignettes supplémentaires par titre",
  "settings.artwork.extra-thumbs-count.description":
    "Combien de vignettes supplémentaires télécharger quand les vignettes supplémentaires sont activées.",
  "settings.artwork.extra-thumbs-count.keywords":
    "extrathumbs, vignettes, images, nombre, thumbs, count",
  "settings.artwork.extra-thumbs-resize.title": "Réduire les vignettes supplémentaires",
  "settings.artwork.extra-thumbs-resize.description":
    "Réduit les vignettes supplémentaires à la largeur ci-dessous. Les images plus petites ne sont jamais agrandies.",
  "settings.artwork.extra-thumbs-resize.keywords":
    "extrathumbs, redimensionner, réduire, taille, resize, scale, size",
  "settings.artwork.extra-thumbs-width.title": "Largeur maximale des vignettes supplémentaires",
  "settings.artwork.extra-thumbs-width.description":
    "La largeur en pixels à laquelle les vignettes supplémentaires sont réduites.",
  "settings.artwork.extra-thumbs-width.keywords":
    "extrathumbs, redimensionner, largeur, pixels, resize, width",
  "settings.artwork.collection-locations.title": "Emplacement des illustrations de collections",
  "settings.artwork.collection-locations.description":
    "Où sont enregistrés les affiches et les fonds des collections. Les deux styles avec dossier utilisent le dossier des collections défini dans Films.",
  "settings.artwork.collection-locations.keywords":
    "collection, ensemble, illustrations, affiche, movieset, kodi, automator, dossier, set, artwork, poster, folder",
  "settings.artwork.collection-locations.option.movie-folder":
    "Dans chaque dossier de film (movieset-poster.jpg)",
  "settings.artwork.collection-locations.option.kodi":
    "Dossier des collections, style Kodi (Nom/poster.jpg)",
  "settings.artwork.collection-locations.option.automator":
    "Dossier des collections, style Artwork Automator (Nom-poster.jpg)",
  "settings.artwork.collection-locations.option.both": "Dossiers de films et style Kodi",
  "settings.artwork.actor-images.title": "Enregistrer les photos des acteurs",
  "settings.artwork.actor-images.description":
    "Enregistre les portraits dans un dossier .actors à côté de chaque titre. Les photos des personnes ayant quitté la distribution sont mises à la corbeille.",
  "settings.artwork.actor-images.keywords":
    "acteurs, distribution, portraits, photos, .actors, actors, cast",
  "settings.player.kind.option.system": "Lecteur par défaut du système",
  "settings.player.kind.option.mpv": "mpv",
  "settings.player.kind.option.vlc": "VLC",
  "settings.player.kind.option.mpc-hc": "MPC-HC / MPC-BE",
  "settings.player.kind.option.iina": "IINA",
  "settings.player.kind.option.custom": "Commande personnalisée",
  "settings.player.kind.title": "Lecteur vidéo",
  "settings.player.kind.description":
    "Le lecteur lancé par le bouton Lire. Le lecteur par défaut du système ouvre un fichier à la fois ; les autres lecteurs mettent en file toutes les parties d’un film en plusieurs fichiers, dans l’ordre.",
  "settings.player.kind.keywords":
    "lire, lecture, lecteur externe, lecteur multimédia, mpv, vlc, mpc-hc, mpc-be, iina, lecteur par défaut, play, external player, media player, default player",
  "settings.player.path.title": "Programme du lecteur",
  "settings.player.path.description":
    "L’emplacement d’installation du lecteur, quand CineVault ne le trouve pas tout seul. Laissez vide pour chercher aux endroits habituels.",
  "settings.player.path.keywords":
    "lire, exécutable, exe, emplacement, dossier d’installation, mpv, vlc, play, executable, location, install folder",
  "settings.player.custom-command.title": "Commande de lecteur personnalisée",
  "settings.player.custom-command.description":
    "Utilisée quand le lecteur vidéo est Commande personnalisée. Le premier mot est le programme. {file}, {files} et {folder} représentent les fichiers vidéo du titre ; sans aucun d’eux, les fichiers sont ajoutés à la fin. Mettez entre guillemets les mots contenant des espaces.",
  "settings.player.custom-command.keywords":
    "lire, arguments, ligne de commande, variable, lecteur externe, play, command line, placeholder, external player",
  "settings.advanced.size-units.title": "Unités de taille de fichier",
  "settings.advanced.size-units.description":
    "Base 10 affiche des Go (base 1000), comme le Finder. Base 2 affiche des Gio (base 1024), les valeurs de l’Explorateur Windows, et c’est le réglage par défaut sous Windows.",
  "settings.advanced.size-units.keywords":
    "base 10, base 2, gigaoctets, gibioctets, décimal, binaire, go, gio, gigabytes, gibibytes, decimal, binary",
  "settings.advanced.log-level.title": "Niveau de détail des journaux",
  "settings.advanced.log-level.description":
    "Plus de détails aident quand vous signalez un problème. Les secrets ne sont jamais journalisés.",
  "settings.advanced.log-level.keywords":
    "journal, journaux, débogage, diagnostic, verbeux, logging, debug, diagnostics, verbose",
  "settings.torrents.source.torrentio.title": "Torrentio",
  "settings.torrents.source.torrentio.description":
    "Releases par ID IMDb pour les films et les épisodes.",
  "settings.torrents.source.torrentio.keywords":
    "torrentio, stremio, torrent, magnet, releases, source",
  "settings.torrents.source.yts.title": "YTS",
  "settings.torrents.source.yts.description": "Releases de films par ID IMDb.",
  "settings.torrents.source.yts.keywords": "yts, torrent, magnet, films, releases, source, movies",
  "settings.torrents.source.eztv.title": "EZTV",
  "settings.torrents.source.eztv.description": "Releases de séries par ID IMDb.",
  "settings.torrents.source.eztv.keywords":
    "eztv, torrent, magnet, séries, tv, shows, releases, source",
  "settings.torrents.source.apibay.title": "The Pirate Bay",
  "settings.torrents.source.apibay.description":
    "Recherche textuelle sur l’interface JSON de The Pirate Bay.",
  "settings.torrents.source.apibay.keywords":
    "pirate bay, apibay, tpb, torrent, magnet, releases, source",
  "settings.torrents.source.knaben.title": "Knaben",
  "settings.torrents.source.knaben.description":
    "Recherche textuelle sur de nombreux trackers publics à la fois.",
  "settings.torrents.source.knaben.keywords":
    "knaben, torrent, magnet, agrégateur, releases, source, aggregator",
  "settings.torrents.source.nyaa.title": "Nyaa",
  "settings.torrents.source.nyaa.description":
    "Releases d’animes. Interrogée uniquement quand le titre est un anime.",
  "settings.torrents.source.nyaa.keywords":
    "nyaa, anime, animes, torrent, magnet, releases, source",
  "settings.torrents.indexer-service.enabled.title": "Service d’indexation",
  "settings.torrents.indexer-service.enabled.description":
    "Télécharge et lance le service d’indexation tant que CineVault est ouvert, pour accéder à bien plus de sites. Il démarre avec l’application et s’arrête quand elle se ferme.",
  "settings.torrents.indexer-service.enabled.keywords":
    "indexeur, indexation, jackett, service, torrent, sites, télécharger, arrière-plan, indexer, download, background",
  "settings.torrents.torznab.url.title": "Votre propre adresse Torznab",
  "settings.torrents.torznab.url.description":
    "L’adresse du flux de votre propre instance Torznab, interrogée comme une source de plus. Ajoutez la clé et testez-la dans la carte ci-dessus.",
  "settings.torrents.torznab.url.keywords":
    "torznab, jackett, prowlarr, indexeur, flux, adresse, torrent, indexer, feed, url",
  "settings.torrents.indexer-service.solver-url.title": "Adresse du résolveur de défis",
  "settings.torrents.indexer-service.solver-url.description":
    "L’adresse d’un résolveur de défis que le service d’indexation peut utiliser pour les sites qui exigent une vérification par navigateur. Laissez vide pour n’en utiliser aucun.",
  "settings.torrents.indexer-service.solver-url.keywords":
    "résolveur, flaresolverr, défi, cloudflare, indexeur, proxy, solver, challenge, indexer",
  "settings.torrents.url.torrentio.title": "Adresse de Torrentio",
  "settings.torrents.url.torrentio.description":
    "L’adresse web de cette source, quand le site a déménagé. Réinitialiser rétablit https://torrentio.strem.fun.",
  "settings.torrents.url.torrentio.keywords":
    "torrentio, adresse, miroir, domaine, torrent, address, url, mirror, domain",
  "settings.torrents.url.yts.title": "Adresse de YTS",
  "settings.torrents.url.yts.description":
    "L’adresse web de cette source, quand le site a déménagé. Réinitialiser rétablit https://movies-api.accel.li.",
  "settings.torrents.url.yts.keywords":
    "yts, adresse, miroir, domaine, torrent, address, url, mirror, domain",
  "settings.torrents.url.eztv.title": "Adresse de EZTV",
  "settings.torrents.url.eztv.description":
    "L’adresse web de cette source, quand le site a déménagé. Réinitialiser rétablit https://eztvx.to.",
  "settings.torrents.url.eztv.keywords":
    "eztv, adresse, miroir, domaine, torrent, address, url, mirror, domain",
  "settings.torrents.url.apibay.title": "Adresse de The Pirate Bay",
  "settings.torrents.url.apibay.description":
    "L’adresse web de cette source, quand le site a déménagé. Réinitialiser rétablit https://apibay.org.",
  "settings.torrents.url.apibay.keywords":
    "apibay, adresse, miroir, domaine, torrent, address, url, mirror, domain",
  "settings.torrents.url.knaben.title": "Adresse de Knaben",
  "settings.torrents.url.knaben.description":
    "L’adresse web de cette source, quand le site a déménagé. Réinitialiser rétablit https://api.knaben.org.",
  "settings.torrents.url.knaben.keywords":
    "knaben, adresse, miroir, domaine, torrent, address, url, mirror, domain",
  "settings.torrents.url.nyaa.title": "Adresse de Nyaa",
  "settings.torrents.url.nyaa.description":
    "L’adresse web de cette source, quand le site a déménagé. Réinitialiser rétablit https://nyaa.si.",
  "settings.torrents.url.nyaa.keywords":
    "nyaa, adresse, miroir, domaine, torrent, address, url, mirror, domain",
  "updates.source": "Mises à jour",
  "updates.title": "CineVault {version} est disponible",
  "updates.notNow": "Pas maintenant",
  "updates.install": "Mettre à jour maintenant",
  "updates.cancel": "Annuler",
  "updates.installing.title": "Installation de CineVault {version}…",
  "updates.jobs.title": "Une tâche est en cours.",
  "updates.jobs.body": "La mise à jour redémarre CineVault, ce qui interrompt le travail en cours.",
  "updates.jobs.wait": "Mettre à jour une fois terminée",
  "updates.jobs.stop": "Mettre à jour maintenant et l’arrêter",
  "updates.waiting.title": "CineVault {version} s’installera à la fin des tâches en cours.",
  "updates.started.body": "Suivez ses étapes pour terminer la mise à jour de CineVault.",
  "updates.upToDate": "CineVault est à jour",
  "updates.checkFailed": "Impossible de rechercher les mises à jour",
  "updates.checkFailedWith": "Impossible de rechercher les mises à jour. {reason}",
  "updates.check.noChannelHere": "Aucun canal de mise à jour n’est défini pour cette version.",
  "updates.check.noKeyHere": "Cette version n’a pas de clé de signature des mises à jour.",
  "updates.show": "Afficher",
  "updates.installFailed": "La mise à jour n’a pas été installée",
  "updates.desktopOnly": "Les mises à jour sont disponibles dans l’application de bureau.",

  // La page Paramètres de la refonte bureau (features/settings/SettingsPage.tsx)
  "settingsPage.region": "Paramètres",
  "settingsPage.index": "Sections des paramètres",
  "settingsPage.providers.title": "Fournisseurs",
  "settingsPage.providers.hint":
    "Les clés sont stockées dans le coffre d’identifiants du système, jamais dans des fichiers.",
  "settingsPage.providers.tmdb": "Clé TMDB",
  "settingsPage.providers.tmdb.hint": "Nécessaire pour scraper.",
  "settingsPage.providers.omdb": "Clé OMDb",
  "settingsPage.providers.omdb.hint":
    "Ajoute des données IMDb au scraping, ainsi que les notes IMDb, Rotten Tomatoes et Metacritic.",
  "settingsPage.providers.mdblist": "Clé MDBList",
  "settingsPage.providers.mdblist.hint": "Ajoute Letterboxd et d’autres notes.",
  "settingsPage.providers.fanart": "Clé Fanart.tv",
  "settingsPage.providers.fanart.hint": "Ajoute davantage d’illustrations.",
  "settingsPage.providers.tvdb": "Clé TheTVDB",
  "settingsPage.providers.tvdb.hint":
    "Ajoute les illustrations des séries et les données des épisodes.",
  "settingsPage.providers.getKey": "Obtenir une clé gratuite",
  "settingsPage.providers.language": "Langue des métadonnées",
  "settingsPage.providers.language.hint": "Titres, synopsis et texte des illustrations",
  "settingsPage.providers.country": "Pays des notes",
  "settingsPage.providers.originalTitles": "Conserver le titre original",
  "settingsPage.providers.originalTitles.hint":
    "Pour les titres de ces langues originales, dès leur premier scraping",
  "settingsPage.providers.originalTitles.list": "Langues qui conservent leur titre original",
  "settingsPage.providers.originalTitles.add": "Ajouter une langue",
  "settingsPage.providers.originalTitles.remove": "Retirer {language}",
  "settingsPage.providers.originalTitles.apply": "Appliquer à mes titres",
  "settingsPage.providers.originalTitles.applied":
    "{count, plural, =0 {Tous les titres de ces langues utilisent déjà leur titre original} one {Le titre original est maintenant utilisé pour # titre} other {Le titre original est maintenant utilisé pour # titres}}",
  "settingsPage.providers.originalTitles.failed": "Impossible de modifier les titres",
  "settingsPage.providers.countryOption": "Notes : {country}",
  "settingsPage.keys.paste": "Collez votre clé",
  "settingsPage.keys.unavailable": "Les clés se définissent dans l’application de bureau",
  "settingsPage.keys.works": "Fonctionne",
  "settingsPage.keys.rejectedTag": "Refusée",
  "settingsPage.keys.rejected":
    "{name} n’a pas accepté cette clé. Vérifiez qu’elle est copiée en entier.",
  "settingsPage.keys.show": "Afficher",
  "settingsPage.keys.hide": "Masquer",
  "settingsPage.keys.remove": "Supprimer",
  "settingsPage.keys.test": "Tester",
  "settingsPage.keys.testing": "Test en cours",
  "settingsPage.keys.testFor": "Tester la clé {name}",
  "settingsPage.naming.title": "Nommage",
  "settingsPage.naming.example": "Exemple :",
  "settingsPage.naming.style": "Style",
  "settingsPage.naming.style.hint": "Remplit les trois modèles à la fois",
  "settingsPage.naming.style.custom": "Personnalisé",
  "settingsPage.naming.replace.title": "Remplacer vos modèles personnalisés",
  "settingsPage.naming.replace.body":
    "Remplacer vos modèles personnalisés par le style {name} ? Vos modifications des modèles de films et de séries seront perdues.",
  "settingsPage.naming.replace.cancel": "Garder les miens",
  "settingsPage.naming.replace.go": "Remplacer",
  "settingsPage.naming.template": "Modèle {name}",
  "settingsPage.naming.tokens": "Jetons pour {name}",
  "settingsPage.naming.movieFolder": "Dossier de film",
  "settingsPage.naming.movieFolder.hint": "Utilisé par Renommer",
  "settingsPage.naming.movieFile": "Fichier de film",
  "settingsPage.naming.movieFile.hint": "Les bonus et les sous-titres suivent le fichier principal",
  "settingsPage.naming.episode": "Épisode de série",
  "settingsPage.naming.titleTokens":
    "{title} est le titre utilisé par chaque film : son titre localisé, ou son titre original si vous l’avez choisi. {original} est toujours le titre original : {example}.",
  "settingsPage.naming.colon": "Deux-points dans les titres",
  "settingsPage.naming.colon.remove": "Supprimer",
  "settingsPage.naming.colon.dash": "Utiliser « - »",
  "settingsPage.naming.colon.lookalike": "Utiliser « ꞉ »",
  "settingsPage.artworkNames.custom": "Personnalisé",
  "settingsPage.artworkNames.movies": "Films",
  "settingsPage.artworkNames.tv": "Séries",
  "settingsPage.artworkNames.column.names": "Noms",
  "settingsPage.artworkNames.column.files": "Fichiers",
  "settingsPage.artworkNames.name": "<nom>",
  "settingsPage.artworkNames.keepOne": "Chaque type garde au moins un nom",
  "settingsPage.artworkNames.single": "Nom : {type}",
  "settingsPage.artworkNames.sharedNote":
    "Dans un dossier contenant plusieurs films, les noms précédés du nom du film sont toujours utilisés, pour que leurs images ne se mélangent jamais.",
  "settingsPage.artworkNames.styleNote": "Choisir un style remplace ces noms.",
  "settingsPage.artworkNames.renameHint":
    "Renommer déplace les illustrations que vous avez déjà vers les nouveaux noms, et le prochain scraping les écrit.",
  "settingsPage.artworkNames.replaced": "Noms d’illustrations personnalisés remplacés par {name}",
  "settingsPage.artworkNames.type.movie.poster": "Affiche",
  "settingsPage.artworkNames.type.movie.fanart": "Fond",
  "settingsPage.artworkNames.type.movie.banner": "Bannière",
  "settingsPage.artworkNames.type.movie.clearart": "Clear art",
  "settingsPage.artworkNames.type.movie.thumb": "Paysage",
  "settingsPage.artworkNames.type.movie.clearlogo": "Logo",
  "settingsPage.artworkNames.type.movie.discart": "Illustration de disque",
  "settingsPage.artworkNames.type.movie.keyart": "Visuel principal",
  "settingsPage.artworkNames.type.movie.squareart": "Illustration carrée",
  "settingsPage.artworkNames.type.movie.extra-fanart": "Fonds supplémentaires",
  "settingsPage.artworkNames.type.tv.poster": "Affiche de la série",
  "settingsPage.artworkNames.type.tv.fanart": "Fond de la série",
  "settingsPage.artworkNames.type.tv.clearlogo": "Logo de la série",
  "settingsPage.artworkNames.type.tv.discart": "Illustration de disque de la série",
  "settingsPage.artworkNames.type.tv.thumb": "Paysage de la série",
  "settingsPage.artworkNames.type.tv.season-poster": "Affiche de la saison",
  "settingsPage.artworkNames.type.tv.season-fanart": "Fond de la saison",
  "settingsPage.artworkNames.type.tv.season-banner": "Bannière de la saison",
  "settingsPage.artworkNames.type.tv.season-thumb": "Paysage de la saison",
  "settingsPage.artworkNames.type.tv.episode-thumb": "Vignette de l’épisode",
  "settingsPage.folders.title": "Dossiers de la bibliothèque",
  "settingsPage.folders.movies": "Films",
  "settingsPage.folders.tv": "Séries",
  "settingsPage.folders.holds": "{path} contient",
  "settingsPage.folders.titles": "{count, plural, one {# titre} other {# titres}}",
  "settingsPage.folders.shows": "{count, plural, one {# série} other {# séries}}",
  "settingsPage.folders.watched": "surveillé pour détecter les changements",
  "settingsPage.folders.offline.titles":
    "hors ligne · {count, plural, one {# titre conservé} other {# titres conservés}}",
  "settingsPage.folders.offline.shows":
    "hors ligne · {count, plural, one {# série conservée} other {# séries conservées}}",
  "settingsPage.folders.remove": "Retirer",
  "settingsPage.folders.removeFor": "Retirer {path}",
  "settingsPage.folders.scanFor": "Scanner ce dossier : {path}",
  "settingsPage.folders.removed":
    "{count, plural, =0 {{path} retiré} one {{path} retiré · # titre reste, hors ligne} other {{path} retiré · # titres restent, hors ligne}}",
  "settingsPage.folders.add": "Ajouter un dossier…",
  "settingsPage.folders.drop": "ou déposez des dossiers ici",
  "settingsPage.folders.added":
    "{count, plural, one {# dossier ajouté} other {# dossiers ajoutés}}",
  "settingsPage.folders.addShare": "Partage réseau…",
  "settingsPage.folders.on": "sur",
  "settingsPage.folders.as": "en tant que {user}",
  "settingsPage.folders.offline": "hors ligne",
  "settingsPage.folders.kept.titles":
    "{count, plural, one {# titre conservé} other {# titres conservés}}",
  "settingsPage.folders.kept.shows":
    "{count, plural, one {# série conservée} other {# séries conservées}}",
  "settingsPage.folders.connect": "Connecter…",
  "settingsPage.folders.connectFor": "Se connecter à {address}",
  "networkShare.region": "Partage réseau",
  "networkShare.title": "Connecter un partage réseau",
  "networkShare.titleAgain": "Se connecter à {address}",
  "networkShare.sub.movie": "Ajoute un dossier à Films",
  "networkShare.sub.tv": "Ajoute un dossier à Séries",
  "networkShare.sub.any": "Ajoute un dossier de bibliothèque",
  "networkShare.subAgain":
    "{count, plural, one {# dossier de bibliothèque} other {# dossiers de bibliothèque}} · hors ligne · {reason}",
  "networkShare.app.windows": "l’Explorateur de fichiers",
  "networkShare.app.macos": "le Finder",
  "networkShare.app.linux": "votre gestionnaire de fichiers",
  "networkShare.intro.movie":
    "Collez l’adresse que vous voyez dans {app} et l’identifiant demandé par le NAS. CineVault connecte le partage et ajoute le dossier à Films.",
  "networkShare.intro.tv":
    "Collez l’adresse que vous voyez dans {app} et l’identifiant demandé par le NAS. CineVault connecte le partage et ajoute le dossier à Séries.",
  "networkShare.intro.any":
    "Collez l’adresse que vous voyez dans {app} et l’identifiant demandé par le NAS. CineVault connecte le partage et ajoute le dossier.",
  "networkShare.introAgain.wrong_password":
    "Le mot de passe enregistré pour {user} ne fonctionne plus sur {address}. Saisissez le mot de passe actuel pour remettre son dossier en ligne. Rien n’a été modifié dans la bibliothèque.",
  "networkShare.introAgain.password_needed":
    "CineVault ne conserve pas le mot de passe de {user} sur {address}. Saisissez-le pour remettre son dossier en ligne. Rien n’a été modifié dans la bibliothèque.",
  "networkShare.introAgain.other":
    "{address} est hors ligne. Saisissez l’identifiant de {user} pour remettre son dossier en ligne. Rien n’a été modifié dans la bibliothèque.",
  "networkShare.reason.wrong_password": "Mot de passe incorrect",
  "networkShare.reason.unreachable": "Serveur injoignable",
  "networkShare.reason.share_not_found": "Partage introuvable",
  "networkShare.reason.password_needed": "Mot de passe requis",
  "networkShare.reason.needs_restart": "Redémarrage nécessaire",
  "networkShare.reason.not_connected": "Non connecté",
  "networkShare.address": "Adresse",
  "networkShare.address.placeholder": "\\\\nas\\films",
  "networkShare.address.hint":
    "Vous pouvez coller {unc} ou {smb}, avec un dossier à l’intérieur si vous le souhaitez.",
  "networkShare.address.fixed": "Fixée pour ce partage",
  "networkShare.folder": "Dossier de la bibliothèque",
  "networkShare.folder.empty": "Rempli à partir de l’adresse",
  "networkShare.user": "Utilisateur",
  "networkShare.user.placeholder": "alex",
  "networkShare.user.hint": "DOMAINE\\nom fonctionne aussi.",
  "networkShare.password": "Mot de passe",
  "networkShare.password.show": "Afficher le mot de passe",
  "networkShare.password.hide": "Masquer le mot de passe",
  "networkShare.remember": "Mémoriser le mot de passe",
  "networkShare.store.windows": "Conservé dans le Gestionnaire d’identification Windows",
  "networkShare.store.macos": "Conservé dans le Trousseau macOS",
  "networkShare.store.linux": "Conservé dans le trousseau du système",
  "networkShare.cancel": "Annuler",
  "networkShare.needs": "Saisissez l’adresse et le nom d’utilisateur.",
  "networkShare.needsFix": "Renseignez l’adresse et l’utilisateur",
  "networkShare.connect": "Connecter et ajouter",
  "networkShare.connectAgain": "Connecter",
  "networkShare.connecting": "Connexion…",
  "networkShare.connected": "Connecté à {address}",
  "networkShare.error.wrongLogin": "Nom d’utilisateur ou mot de passe incorrect.",
  "networkShare.error.unreachable":
    "{server} est injoignable. Vérifiez le nom ou l’adresse et que l’appareil est allumé.",
  "networkShare.error.shareNotFound": "Il n’existe aucun partage nommé {share} sur {server}.",
  "networkShare.error.folderNotFound": "{folder} est introuvable sur {share}.",
  "networkShare.error.otherUser": "Windows est déjà connecté à {server} avec un autre utilisateur.",
  "networkShare.error.otherUserBody":
    "Windows n’autorise qu’une seule connexion par serveur. Déconnectez l’autre connexion dans l’Explorateur de fichiers, puis reconnectez-vous.",
  "networkShare.error.sessionInUse":
    "Windows est toujours connecté à {server} avec l’ancien mot de passe.",
  "networkShare.error.sessionInUseBody":
    "Redémarrez CineVault (ou fermez votre session Windows puis rouvrez-la), puis reconnectez-vous.",
  "networkShare.error.noKeyring":
    "Aucun trousseau du système n’est en cours d’exécution, le mot de passe ne peut donc pas être mémorisé.",
  "networkShare.error.noKeyringBody":
    "Démarrez le trousseau de votre bureau et réessayez, ou connectez-vous maintenant et saisissez de nouveau le mot de passe après chaque redémarrage.",
  "networkShare.error.withoutRemembering": "Se connecter sans mémoriser",
  "networkShare.unsupported.title":
    "Ce bureau ne peut pas connecter de partages réseau pour les applications",
  "networkShare.unsupported.body":
    "CineVault connecte les partages via le montage de partages propre au bureau, et ce bureau ne le propose pas. Montez le partage avec les outils de votre système, puis ajoutez son dossier avec Ajouter un dossier….",
  "networkShare.unsupported.terminal": "Dans un terminal",
  "networkShare.unsupported.hint":
    "mount demande le mot de passe. Pour monter le partage à chaque démarrage, ajoutez-le à /etc/fstab avec un fichier d’identifiants lisible uniquement par root.",
  "networkShare.unsupported.add": "Ajouter un dossier…",
  "networkShare.copy": "Copier",
  "networkShare.copied": "Copié",
  "networkShare.copyCommand": "Copier la commande",
  "networkShare.browser.label": "Partages réseau dans un navigateur",
  "networkShare.browser.title": "Les partages réseau sont connectés sur le serveur",
  "networkShare.browser.body":
    "Le serveur ne peut pas connecter un partage de lui-même ; c’est son programme d’installation qui s’en charge. Relancez le programme d’installation sur le serveur et choisissez « Changer les dossiers de films et de séries que CineVault peut utiliser » ; il demande l’utilisateur et le mot de passe du partage.",
  "networkShare.browser.then": "Ajoutez ensuite le dossier avec Ajouter un dossier….",
  "settingsPage.torrents.title": "Sources de torrents",
  "settingsPage.torrents.sources.hint": "Les sites interrogés par la Recherche de torrents",
  "settingsPage.appearance.title": "Apparence",
  "settingsPage.deleted.title": "Fichiers supprimés",
  "settingsPage.deleted.help.bin":
    "Annuler les rétablit. Un disque sans {bin} utilise son dossier .deletedByCineVault.",
  "settingsPage.deleted.help.folder":
    "Toujours le dossier .deletedByCineVault du disque du fichier ; la {bin} n’est jamais utilisée.",
  "settingsPage.deleted.help.custom":
    "Un dossier de votre choix, pour les fichiers de son disque ; les fichiers des autres disques vont dans le dossier corbeille de leur propre disque.",
  "settingsPage.deleted.help.erase":
    "Les fichiers supprimés et remplacés sont effacés immédiatement. Annuler ne peut pas les rétablir.",
  "settingsPage.deleted.noFolder":
    "Choisissez un dossier ; d’ici là, les fichiers vont dans le dossier corbeille de chaque disque.",
  "settingsPage.deleted.choose": "Choisir un dossier…",
  "settingsPage.deleted.pickTitle": "Choisir le dossier corbeille personnalisé",
  "settingsPage.deleted.confirmTitle": "Effacer immédiatement les fichiers supprimés ?",
  "settingsPage.deleted.confirm": "Effacer immédiatement",
  "settingsPage.appearance.theme": "Thème",
  "settingsPage.appearance.light": "Clair",
  "settingsPage.appearance.dark": "Sombre",
  "settingsPage.appearance.match": "Suivre Windows",
  "settingsPage.appearance.matchMac": "Suivre macOS",
  "settingsPage.appearance.matchSystem": "Suivre le système",
  "settingsPage.appearance.size": "Taille",
  "settingsPage.appearance.size.hint": "Ctrl + et Ctrl − la modifient, Ctrl 0 la rétablit.",
  "settingsPage.appearance.size.hintMac": "⌘ + et ⌘ − la modifient, ⌘ 0 la rétablit.",
  "settingsPage.appearance.sizeOption": "{percent} %",
  "settings.server.permanent-delete.title":
    "Autoriser la suppression définitive depuis un navigateur",
  "settings.server.permanent-delete.description":
    "La suppression définitive demande le mot de passe actuel, et la confirmation expire au bout d’une minute. Désactivée tant que vous ne l’activez pas.",
  "settings.server.permanent-delete.keywords":
    "supprimer, effacer, définitif, mot de passe, delete, erase, permanent, password",
  "settingsPage.server.title": "Serveur",
  "settingsPage.server.address": "Adresse",
  "settingsPage.server.address.hint": "Issue de CINEVAULT_WEB_BIND et CINEVAULT_WEB_PORT.",
  "settingsPage.server.version": "Version",
  "settingsPage.server.sessions": "Sessions ouvertes",
  "settingsPage.server.keys": "Clés des fournisseurs",
  "settingsPage.server.keys.hint": "Conservées dans le fichier de secrets chiffré du serveur.",
  "settingsPage.server.keys.locked": "Verrouillées",
  "settingsPage.server.keys.locked.hint":
    "La clé maître est absente. Définissez CINEVAULT_SECRET_KEY_FILE et redémarrez.",
  "settingsPage.server.keys.configured": "Configurées",
  "settingsPage.server.keys.unknown": "Pas encore vérifiées",
  "settingsPage.server.password": "Mot de passe",
  "settingsPage.server.password.change": "Changer le mot de passe",
  "settingsPage.server.password.current": "Mot de passe actuel",
  "settingsPage.server.password.new": "Nouveau mot de passe (12 caractères minimum)",
  "settingsPage.server.password.confirm": "Confirmer le nouveau mot de passe",
  "settingsPage.server.password.changed":
    "Le mot de passe a été changé. Toutes les autres sessions ont été fermées.",
  "settingsPage.server.sessions.hint": "Fermer toutes les sessions laisse ce navigateur connecté.",
  "settingsPage.server.sessions.signOutAll": "Fermer toutes les autres sessions",
  "settingsPage.server.sessions.signedOut": "Toutes les autres sessions ont été fermées.",
  "settingsPage.server.error": "Le serveur n’a pas répondu.",
  "settingsPage.server.address.desktop":
    "L’accès navigateur se gère dans les Paramètres de CineVault sur {computer}.",
  "settingsPage.browserAccess.title": "Accès navigateur",
  "settingsPage.browserAccess.hint":
    "Ouvrez votre bibliothèque depuis un téléphone, une télévision ou un autre ordinateur de votre réseau domestique.",
  "settingsPage.browserAccess.switch": "Accès navigateur",
  "settingsPage.browserAccess.switch.hint":
    "CineVault sert cette bibliothèque aux navigateurs de votre réseau tant qu’il fonctionne. Désactivé par défaut.",
  "settingsPage.browserAccess.state.off": "Désactivé",
  "settingsPage.browserAccess.state.running": "En cours",
  "settingsPage.browserAccess.state.portInUse": "Port utilisé",
  "settingsPage.browserAccess.state.error": "Arrêté",
  "settingsPage.browserAccess.state.noPassword": "Créez un mot de passe pour démarrer",
  "settingsPage.browserAccess.started": "L’accès navigateur est activé.",
  "settingsPage.browserAccess.stopped":
    "L’accès navigateur est désactivé. Tous les navigateurs ont été déconnectés.",
  "settingsPage.browserAccess.firewall":
    "Windows demandera d’autoriser CineVault sur les réseaux privés. Choisissez Autoriser.",
  "settingsPage.browserAccess.password": "Mot de passe",
  "settingsPage.browserAccess.password.needed":
    "Les navigateurs se connectent avec ce mot de passe. Créez-en un pour activer l’accès navigateur.",
  "settingsPage.browserAccess.password.hint":
    "Le changer déconnecte tous les navigateurs. Vous l’avez oublié ? Changez-le ici ; l’ancien mot de passe n’est pas nécessaire.",
  "settingsPage.browserAccess.password.new": "Nouveau mot de passe (12 caractères minimum)",
  "settingsPage.browserAccess.password.confirm": "Confirmer le nouveau mot de passe",
  "settingsPage.browserAccess.password.create": "Créer le mot de passe",
  "settingsPage.browserAccess.password.change": "Changer le mot de passe",
  "settingsPage.browserAccess.password.created": "Le mot de passe a été créé.",
  "settingsPage.browserAccess.password.changed":
    "Le mot de passe a été changé. Tous les navigateurs ont été déconnectés.",
  "settingsPage.browserAccess.cancel": "Annuler",
  "settingsPage.browserAccess.addresses": "Ouvrir depuis un autre appareil",
  "settingsPage.browserAccess.addresses.hint":
    "Saisissez une adresse dans un navigateur du même réseau, ou scannez le code avec un téléphone.",
  "settingsPage.browserAccess.copy": "Copier",
  "settingsPage.browserAccess.copied": "Copié",
  "settingsPage.browserAccess.copyAddress": "Copier {address}",
  "settingsPage.browserAccess.qr": "QR code pour {address}",
  "settingsPage.browserAccess.qr.caption": "À scanner avec un téléphone",
  "settingsPage.browserAccess.port": "Port",
  "settingsPage.browserAccess.port.hint":
    "8787 sauf si un autre programme l’utilise. Le changer redémarre l’accès navigateur et déconnecte tous les navigateurs.",
  "settingsPage.browserAccess.port.apply": "Appliquer",
  "settingsPage.browserAccess.port.invalid": "Choisissez un port de 1024 à 65535.",
  "settingsPage.browserAccess.lanOnly": "Uniquement les appareils de mon réseau domestique",
  "settingsPage.browserAccess.lanOnly.hint":
    "Les navigateurs extérieurs à votre réseau domestique sont refusés, même avec le mot de passe.",
  "settingsPage.browserAccess.lanOnly.off":
    "Toute personne pouvant atteindre ce port peut essayer le mot de passe. Activez cette option sauf si vous savez qu’il faut la désactiver.",
  "settingsPage.browserAccess.sessions": "Navigateurs connectés",
  "settingsPage.browserAccess.sessions.hint": "Désactiver l’accès navigateur les déconnecte tous.",
  "settingsPage.browserAccess.sessions.none": "Aucun navigateur n’est connecté.",
  "settingsPage.browserAccess.sessions.browser": "{browser} sur {system}",
  "settingsPage.browserAccess.sessions.unknown": "Un navigateur",
  "settingsPage.browserAccess.sessions.detail": "{address} · dernière utilisation {when}",
  "settingsPage.browserAccess.sessions.signOut": "Déconnecter",
  "settingsPage.browserAccess.sessions.signOutOne": "Déconnecter {name}",
  "settingsPage.browserAccess.sessions.signOutAll": "Déconnecter tous les navigateurs",
  "settingsPage.browserAccess.sessions.signedOutOne": "Ce navigateur a été déconnecté.",
  "settingsPage.browserAccess.sessions.signedOutAll": "Tous les navigateurs ont été déconnectés.",
  "settingsPage.browserAccess.tray":
    "Rester actif dans la zone de notification quand la fenêtre est fermée",
  "settingsPage.browserAccess.tray.hint":
    "Fermer la fenêtre la masque tant que l’accès navigateur est activé. Ouvrez ou quittez CineVault depuis son icône de la zone de notification.",
  "settingsPage.browserAccess.login": "Démarrer CineVault à l’ouverture de ma session",
  "settingsPage.browserAccess.login.hint":
    "Avec l’option de la zone de notification activée, il démarre dans la zone de notification avec l’accès navigateur actif.",
  "settingsPage.browserAccess.help":
    "Sur un téléphone, une télévision ou un autre ordinateur du même réseau, ouvrez l’une des adresses et connectez-vous avec le mot de passe. Gardez {computer} allumé et CineVault en cours d’exécution. La connexion n’est pas chiffrée : utilisez-la chez vous, pas sur un Wi-Fi public.",
  "settingsPage.updates.title": "Mises à jour",
  "settingsPage.updates.version": "CineVault {version}",
  "settingsPage.updates.whatsNew": "Nouveautés de la version {version}",
  "settingsPage.updates.checkNow": "Rechercher maintenant",
  "settingsPage.updates.checking": "Recherche de mises à jour…",
  "settingsPage.updates.notChecked": "Pas encore vérifié",
  "settingsPage.updates.upToDate": "À jour",
  "settingsPage.updates.today": "vérifié aujourd’hui à {time}",
  "settingsPage.updates.on": "vérifié le {date} à {time}",
  "settingsPage.updates.downloading": "Téléchargement de CineVault {version} · {percent} %",
  "settingsPage.updates.installOnClose": "Installer les mises à jour quand je ferme l’application",
  "settingsPage.updates.releaseNotes": "Notes de version",
  "settingsPage.updates.releaseNotes.hint": "Ce qui a changé dans chaque version de CineVault",
  "settingsPage.updates.releaseNotes.open": "Voir toutes les modifications",

  // Nouveautés après une mise à jour, et page des notes de version
  "changelog.whatsNew.title": "Mise à jour vers CineVault {version}",
  "changelog.whatsNew.subtitle": "Nouveautés",
  "changelog.whatsNew.seeAll": "Voir toutes les modifications",
  "changelog.page.title": "Notes de version",
  "changelog.page.back": "Retour",
  "changelog.page.intro": "Ce qui a changé dans chaque version de CineVault.",
  "changelog.page.version": "Version {version}",
  "changelog.page.unreleased": "À venir",
  "changelog.page.current": "Installée",
} as const;
