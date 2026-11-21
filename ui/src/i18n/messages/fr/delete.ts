/** Textes français de la section Suppression. Fusionnés avec les autres sections dans `../../catalog.ts`. */
export const deleteMessages = {
  // Suppression vers la corbeille (spec title-deletion) ; `{bin}` est la Corbeille, selon la plateforme
  "delete.toast.one": "{title} envoyé à la {bin}",
  "delete.toast.many": "{count} titres envoyés à la {bin}",
  "delete.toast.folder.one":
    "{title} envoyé dans le dossier de corbeille du dossier de bibliothèque",
  "delete.toast.folder.many":
    "{count} titres envoyés dans le dossier de corbeille du dossier de bibliothèque",
  "delete.toast.erased.one":
    "{title} effacé : Fichiers supprimés est réglé sur Supprimer définitivement",
  "delete.toast.erased.many":
    "{count} titres effacés : Fichiers supprimés est réglé sur Supprimer définitivement",
  "delete.toast.nothingOnDisk": "{title} retiré : il n’avait aucun fichier sur le disque",
  "delete.refused":
    "{count, plural, one {# titre n’a pas été supprimé} other {# titres n’ont pas été supprimés}}",
  "delete.failed": "{subject} n’a pas pu être supprimé",

  // La confirmation de suppression (modes corbeille et dossier de corbeille)
  "delete.confirm.title.one": "Supprimer « {title} » ?",
  "delete.confirm.title.many": "Supprimer {count} titres ?",
  "delete.confirm.body.bin":
    "{count, plural, one {Le dossier sera envoyé} other {Les dossiers seront envoyés}} à la {bin}. Vous pouvez annuler depuis l’Historique.",
  "delete.confirm.body.folder":
    "{count, plural, one {Le dossier sera envoyé dans le dossier de corbeille de son disque} other {Les dossiers seront envoyés dans le dossier de corbeille de leurs disques}}. Vous pouvez annuler depuis l’Historique.",
  "delete.confirm.body.custom":
    "{count, plural, one {Le dossier sera envoyé} other {Les dossiers seront envoyés}} dans votre dossier de corbeille {folder} (les fichiers d’autres disques vont dans le dossier de corbeille de leur propre disque). Vous pouvez annuler depuis l’Historique.",
  "delete.confirm.body.customUnset":
    "{count, plural, one {Le dossier sera envoyé} other {Les dossiers seront envoyés}} dans le dossier de corbeille {count, plural, one {de son disque} other {de leurs disques}}, car aucun dossier de corbeille personnalisé n’est choisi. Vous pouvez annuler depuis l’Historique.",
  "delete.confirm.list": "Ce qui sera supprimé",
  "delete.confirm.more": "{count, plural, one {et # titre de plus} other {et # titres de plus}}",
  "delete.confirm.total": "Total",
  "delete.confirm.dontAsk": "Ne plus demander",
  "delete.confirm.cancel": "Annuler",
  "delete.confirm.confirm": "Supprimer",

  // La boîte de dialogue de suppression définitive
  "delete.dialog.title":
    "{count, plural, one {Supprimer définitivement # titre ?} other {Supprimer définitivement # titres ?}}",
  "delete.dialog.body":
    "{count, plural, one {Son dossier et ses fichiers seront effacés} other {Leurs dossiers et leurs fichiers seront effacés}}. Cette action est irréversible.",
  "delete.dialog.reading": "Lecture du contenu de ces titres",
  "delete.dialog.planFailed":
    "CineVault n’a pas pu lire le contenu de ces titres ; rien ne peut donc être effacé.",
  "delete.dialog.list": "Ce qui sera effacé",
  "delete.dialog.shared": "Uniquement ses propres fichiers dans ce dossier partagé",
  "delete.dialog.root": "Uniquement ses propres fichiers ; le dossier de bibliothèque reste",
  "delete.dialog.noFolder": "Rien sur le disque",
  "delete.dialog.skipped": "Non supprimé",
  "delete.dialog.password": "Mot de passe actuel",
  "delete.dialog.cancel": "Annuler",
  "delete.dialog.confirm": "Supprimer définitivement",

  // Après une suppression définitive
  "delete.erased":
    "{count, plural, one {# titre supprimé définitivement} other {# titres supprimés définitivement}}",
  "delete.stopped": "{title} a été laissé dans la bibliothèque",
  "delete.erase.refused": "{title} n’a pas été effacé",
  "delete.erase.failed": "Rien n’a été effacé",
} as const;
