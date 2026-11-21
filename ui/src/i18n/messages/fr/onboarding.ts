/** Textes français de la configuration au premier lancement. Fusionnés avec les autres sections dans `../../catalog.ts`. */
export const onboarding = {
  // Cadre
  "setup.region": "Configuration au premier lancement",
  "setup.steps": "Étapes de configuration",
  "setup.step.folders": "Dossiers",
  "setup.step.tmdb": "Clé TMDB",
  "setup.step.ratings": "Clés de notes",
  "setup.step.naming": "Nommage",
  "setup.step.done": "terminé",
  "setup.skipSetup": "Ignorer la configuration",
  "setup.skipStep": "Ignorer cette étape",
  "setup.continue": "Continuer",
  "setup.building": "Configuration…",
  "setup.laterNote": "Chaque étape pourra être modifiée plus tard dans les Paramètres.",
  "setup.buildFailed": "Ce dossier n’a pas pu être ajouté. {reason}",
  "setup.tools.failed": "{name} n’a pas pu être téléchargé.",

  // Étape 1 : dossiers
  "setup.folders.title": "Où sont vos films et vos séries ?",
  "setup.folders.intro":
    "Ajoutez chaque dossier et indiquez ce qu’il contient. CineVault les scanne maintenant, puis à chaque modification. Rien n’est renommé ni déplacé tant que vous ne le demandez pas.",
  "setup.folders.list": "Dossiers",
  "setup.folders.looking": "Exploration…",
  "setup.folders.found": "{count, plural, one {# vidéo trouvée} other {# vidéos trouvées}}",
  "setup.folders.foundMore":
    "{count, plural, one {# vidéo trouvée pour l’instant} other {# vidéos trouvées pour l’instant}}",
  "setup.folders.looksTv": "semble contenir des séries",
  "setup.folders.both": "contient des films et des séries, choisissez-en un",
  "setup.folders.inside": "Dans {other}, qui est déjà dans la liste",
  "setup.folders.holds": "{path} contient",
  "setup.folders.movies": "Films",
  "setup.folders.tv": "Séries",
  "setup.folders.remove": "Retirer {path}",
  "setup.folders.add": "Ajouter un dossier…",
  "setup.folders.drop": "ou déposez des dossiers ici",
  "setup.folders.addShare": "Partage réseau…",
  "setup.folders.unreadable": "{path} n’a pas pu être lu.",
  "setup.folders.stillLooking": "CineVault explore encore un dossier.",
  "setup.folders.overlap": "Un dossier se trouve dans un autre du même type. Retirez-en un.",
  "setup.folders.needOne": "Ajoutez d’abord un dossier.",
  "setup.folders.needOneFix": "Ajoutez un dossier, ou ignorez cette étape.",

  // Étape 2 : TMDB
  "setup.tmdb.title": "Ajoutez votre clé TMDB",
  "setup.tmdb.intro":
    "CineVault trouve les titres, les affiches et les synopsis grâce à TMDB. La clé est gratuite et reste sur cet ordinateur.",
  "setup.tmdb.step1": "Connectez-vous à un compte TMDB gratuit.",
  "setup.tmdb.step2":
    "Ouvrez ses paramètres d’API et demandez une clé (le type Developer convient).",
  "setup.tmdb.step3": "Collez la clé d’API ci-dessus et cliquez sur Tester.",
  "setup.tmdb.needsKey": "Testez d’abord votre clé TMDB.",
  "setup.tmdb.needsKeyFix": "Collez la clé et cliquez sur Tester, ou ignorez cette étape.",

  // Étape 3 : clés facultatives (notes et illustrations)
  "setup.ratings.title": "Ajoutez vos clés facultatives",
  "setup.ratings.intro":
    "Toutes sont facultatives. Chaque clé ajoute des notes ou des illustrations à vos titres, et chacune peut être ajoutée plus tard dans les Paramètres.",
  "setup.ratings.optional": "Facultatif",
  "setup.ratings.omdb":
    "Ajoute les données IMDb au Scraping, ainsi que les notes IMDb, Rotten Tomatoes et Metacritic",
  "setup.ratings.mdblist": "Ajoute les notes Letterboxd et bien d’autres",
  "setup.ratings.fanart": "Ajoute davantage d’illustrations",
  "setup.ratings.tvdb": "Ajoute des illustrations de séries et les données des épisodes",

  // Étape 4 : nommage
  "setup.naming.title": "Comment nommer les dossiers et les fichiers ?",
  "setup.naming.intro":
    "Choisissez un style. CineVault l’utilise quand vous renommez depuis la page Renommer ; les modèles sont modifiables dans les Paramètres.",
  "setup.naming.styles": "Styles de nommage",
  "setup.naming.style.clean":
    "Titre et année, des noms courts lisibles par tous les lecteurs multimédias.",
  "setup.naming.style.detailed":
    "Ajoute les étiquettes de résolution, de source, de HDR et d’audio.",
  "setup.naming.style.media-server-safe":
    "Ajoute l’identifiant TMDB pour que les serveurs multimédias reconnaissent le titre.",
  "setup.naming.style.release-info":
    "Conserve les étiquettes de release et le groupe du nom du téléchargement, pour les gestionnaires de téléchargement.",
  "setup.naming.style.custom": "Vos propres modèles.",
  "setup.naming.example": "Exemple",
  "setup.naming.sample": "Exemple intégré",
  "setup.naming.yours": "Votre fichier",
  "setup.naming.failed": "L’exemple n’a pas pu être créé.",
  "setup.naming.loading": "Création de l’exemple…",
  "setup.naming.now": "Actuellement",
  "setup.naming.folder": "Dossier",
  "setup.naming.file": "Fichier",
  "setup.naming.nothing":
    "Rien n’est renommé tant que vous ne le demandez pas sur la page Renommer.",

  // Aperçu dans un navigateur ordinaire
  "onboarding.desktopOnly":
    "L’exploration des dossiers est disponible dans l’application de bureau.",
} as const;
