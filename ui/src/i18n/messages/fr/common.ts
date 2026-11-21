/** Textes français de la section commune. Fusionnés avec les autres sections dans `../../catalog.ts`. */
export const common = {
  // Mots courants
  "common.close": "Fermer",
  "common.dismiss": "Ignorer",
  "common.undo": "Annuler",
  "common.unknownSize": "Taille inconnue",

  // La corbeille où vont les fichiers supprimés, nommée selon la plateforme (shell/binName)
  "common.bin.recycle": "Corbeille",
  "common.bin.trash": "Corbeille",

  // Vocabulaire d’état (StatusTag) : un pictogramme et l’un de ces mots
  "status.done": "Terminé",
  "status.waiting": "En attente",
  "status.missing": "Manquant",
  "status.needsKey": "Clé requise",
  "status.inProgress": "En cours",
  "status.off": "Désactivé",

  // Composants partagés
  "components.removeFilter": "Retirer le filtre {field} {value}",
  "components.editFilter": "Modifier le filtre {chip}",
  "components.editFilter.hint": "Cliquer pour modifier, Alt+clic pour inverser",
  "components.negated": "non",

  // Tailles de fichier : symboles d’unité. La base 10 utilise les puissances de 1000, la base 2 celles de 1024.
  "size.value": "{value} {unit}",
  "size.base10.0": "o",
  "size.base10.1": "ko",
  "size.base10.2": "Mo",
  "size.base10.3": "Go",
  "size.base10.4": "To",
  "size.base10.5": "Po",
  "size.base2.0": "o",
  "size.base2.1": "Kio",
  "size.base2.2": "Mio",
  "size.base2.3": "Gio",
  "size.base2.4": "Tio",
  "size.base2.5": "Pio",

  // Scripts de post-traitement nommés
  "path.copyFailed": "Le chemin n’a pas pu être copié",
  "value.copied": "{value} copié",
  "stage.new": "Nouveau",
  "stage.scraped": "Scrapé",
  "stage.renamed": "Renommé",
  "stage.flag.needsReview": "À vérifier",
  "stage.flag.notMatched": "Sans correspondance",
} as const;
