/** Textes français de la section Copies. Fusionnés avec les autres sections dans `../../catalog.ts`. */
export const copies = {
  // La Bibliothèque : la pastille de filtre, le badge d’affiche, le tableau, le menu contextuel
  "copies.chip": "Copies",
  "copies.badge": "{count} copies",
  "copies.badge.tip": "Vous avez {count} copies de ce film",
  "copies.table.count": "{count} copies",
  "copies.act.compare": "Comparer {count} copies",

  // La page du film : les onglets de copies et la ligne Copies de la carte Technique
  "copies.tabs.aria": "{count} copies de ce film",
  "copies.tabs.best": "{label}, meilleure qualité",
  "copies.tabs.row": "Copies",
  "copies.tabs.keepOnly": "Garder uniquement celle-ci",
  "copies.tabs.delete": "Supprimer cette copie",
  "copies.tabs.compare": "Comparer",

  // La page Comparer les copies
  "copies.page.region": "Comparer les copies de {title}",
  "copies.page.title": "Comparer les copies · {title}",
  "copies.page.cancel": "Annuler",
  "copies.page.sub": "{count} copies · {size} au total",
  "copies.page.sub.same": "{count} copies · {size} au total · même image, même son, même taille",
  "copies.page.same.two": "Ces deux copies sont identiques.",
  "copies.page.same.many": "Ces {count} copies sont identiques.",
  "copies.page.lengths":
    "Les durées diffèrent de {minutes} min — ce sont peut-être des films différents.",
  "copies.lengthDiffers": "Durées différentes",
  "copies.page.same.frees": "En garder une libère {size}, et rien ne change pour le film.",
  "copies.page.sameFile.before":
    "Il s’agit peut-être du même fichier atteint par deux dossiers de la bibliothèque. CineVault n’en supprimera aucun d’ici ; vérifiez les dossiers sous ",
  "copies.page.sameFile.link": "Paramètres › Dossiers de la bibliothèque",
  "copies.page.sameFile.after": ".",
  "copies.page.intro.before":
    "Il s’agit du même film. Gardez celle que vous voulez ; les autres sont supprimées selon ce que précise ",
  "copies.page.intro.link": "Paramètres › Fichiers supprimés",
  "copies.page.intro.after": ".",
  "copies.dest.bin":
    "Actuellement, c’est la {bin} : Annuler rétablit {count, plural, one {l’autre copie} other {les # autres copies}}.",
  "copies.dest.folder":
    "Actuellement, c’est un dossier de corbeille sur chaque disque : Annuler rétablit {count, plural, one {l’autre copie} other {les # autres copies}}.",
  "copies.dest.custom":
    "Actuellement, c’est votre dossier de corbeille {folder} : Annuler rétablit {count, plural, one {l’autre copie} other {les # autres copies}}.",
  "copies.dest.erase":
    "Actuellement, c’est Supprimer définitivement : une confirmation vous est demandée, et {count, plural, one {l’autre copie ne pourra pas être rétablie} other {les # autres copies ne pourront pas être rétablies}}.",
  "copies.none.title": "Ce film n’a pas d’autre copie",
  "copies.none.body": "L’autre copie a été supprimée, déplacée ou est inaccessible.",
  "copies.none.back": "Retour au film",
  "copies.loading": "Lecture des copies",
  "copies.error": "Les copies n’ont pas pu être lues",

  // Les lignes
  "copies.row.resolution": "Résolution",
  "copies.row.resolution.hint": "Netteté de l’image",
  "copies.row.hdr": "HDR",
  "copies.row.hdr.hint": "Lumière et couleurs plus riches sur les écrans HDR",
  "copies.row.audio": "Audio",
  "copies.row.audio.hint": "Format et canaux du son",
  "copies.row.source": "Source",
  "copies.row.source.hint": "D’où vient la copie",
  "copies.row.bitrate": "Débit vidéo",
  "copies.row.bitrate.hint": "Plus il est élevé, plus il conserve de détails",
  "copies.row.length": "Durée",
  "copies.row.length.hint": "Durée de lecture",
  "copies.row.size": "Taille",
  "copies.row.size.hint": "Espace occupé sur le disque",
  "copies.row.folder": "Dossier",
  "copies.row.folder.hint": "Où il se trouve",
  "copies.res.2160p": "4K",
  "copies.res.1440p": "QHD",
  "copies.res.1080p": "Full HD",
  "copies.res.720p": "HD",
  "copies.value.sdr": "SDR",
  "copies.value.unread": "Pas encore lu",
  "copies.value.unknown": "Inconnu",
  "copies.value.none": "Aucun",
  "copies.value.bitrate": "{value} Mb/s",
  "copies.value.smaller": "{size} de moins",

  // Les cartes
  "copies.card.aria": "Copie {index} sur {count} : {title} sur {drive}",
  "copies.card.network": "Sur le réseau",
  "copies.card.local": "Sur cet ordinateur",
  "copies.best": "Meilleure qualité",
  "copies.better": "Meilleure",
  "copies.keep": "Garder celle-ci",
  "copies.keep.aria": "Garder celle-ci : {title}, {summary}",
  "copies.keep.refused": "Rien n’a été supprimé",

  // Garder les deux, Redemander
  "copies.keepBoth": "Garder les deux",
  "copies.keepAll": "Tout garder",
  "copies.keepBoth.note": "Conserve tous les fichiers. Ces copies ne s’affichent plus sous Copies.",
  "copies.kept": "Vous avez choisi de garder ces copies",
  "copies.askAgain": "Redemander",
  "copies.toast.kept.two": "Les deux copies de {title} ont été conservées",
  "copies.toast.kept.many": "Les {count} copies de {title} ont été conservées",
  "copies.toast.askedAgain": "Les copies de {title} s’affichent de nouveau sous Copies",
  "copies.failed": "La décision n’a pas pu être enregistrée",

  // Après Garder celle-ci
  "copies.dropLabel": "Renommer pour retirer la mention '- {label}' ?",

  // L’aperçu du renommage
  "copies.rename.hint.two": "Ajouté pour que vos deux copies gardent des noms différents",
  "copies.rename.hint.many": "Ajouté pour que vos {count} copies gardent des noms différents",
  "copies.rename.nth": "Copie {n} sur {count}",
} as const;
