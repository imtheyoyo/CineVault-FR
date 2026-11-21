/** Textes français de la section Activité (À traiter) et des déplacements inachevés. */
export const activity = {
  // La page et son entrée dans la barre latérale
  "activity.region": "Activité",
  "activity.nav": "Activité",
  "activity.nav.attention":
    "{count, plural, one {Activité, # élément à traiter} other {Activité, # éléments à traiter}}",

  // À traiter
  "activity.attention": "À traiter",
  "activity.attention.count": "{count, plural, one {# élément} other {# éléments}}",
  "activity.attention.dismissAll": "Tout ignorer",
  "activity.attention.dismissAllHint":
    "Efface les avertissements ; les déplacements inachevés restent tant qu’ils ne sont pas résolus",
  "activity.history": "Historique",
  "activity.running": "En cours",

  // Un lot inachevé
  "activity.batch.move": "Le déplacement vers {destination} n’a pas abouti",
  "activity.batch.moveNoPlace": "Un déplacement vers un autre dossier n’a pas abouti",
  "activity.batch.rename": "Un renommage n’a pas abouti",
  "activity.batch.running": "Reprise du déplacement vers {destination}",
  "activity.batch.runningNoPlace": "Reprise du déplacement",
  "activity.batch.titles": "{first} et {count, plural, one {# autre} other {# autres}}",
  "activity.batch.files": "{done} fichiers copiés sur {total}",
  "activity.batch.filesBytes": "{done} fichiers copiés sur {total}, {bytesDone} sur {bytesTotal}",
  "activity.batch.renamed": "{done} titres renommés sur {total}",
  "activity.batch.resume": "Reprendre",
  "activity.batch.rollBack": "Annuler les changements",
  "activity.batch.pause": "Pause",
  "activity.batch.paused": "En pause",
  "activity.batch.continue": "Continuer",
  "activity.batch.cancel": "Annuler",
  "activity.batch.cancelHint": "Arrête le déplacement et remet ce titre dans son état d’origine",
  "activity.batch.resumeHint": "Vérifie les fichiers déjà copiés, puis copie le reste",
  "activity.batch.rollBackHint":
    "Supprime uniquement ce que ce déplacement a créé ; les originaux restent en place",
  "activity.batch.busy": "Un autre déplacement est en cours. Attendez qu’il se termine.",

  // Une notification
  "activity.notice.dismiss": "Ignorer",
  "activity.notice.dismissLabel": "Ignorer « {title} »",
  "activity.notice.openKey": "Ouvrir la clé",
  "activity.notice.retry": "Réessayer",
  "activity.notice.repeats": "×{count}",

  // Ce que disent Reprendre et Annuler les changements
  "activity.toast.resuming": "Reprise du déplacement de {label}",
  "activity.toast.resumed": "Déplacement de {label} terminé",
  "activity.toast.resumedRename": "Renommage terminé",
  "activity.toast.stoppedAgain": "Le déplacement de {label} s’est de nouveau arrêté : {reason}",
  "activity.toast.rolledBack": "Déplacement de {label} annulé",
  "activity.toast.rolledBackRename": "Renommage annulé",
  "activity.toast.open": "Ouvrir l’Activité",
  "activity.toast.unfinished": "{title}. Reprenez-le ou annulez-le depuis l’Activité.",
  "activity.notice.resumeFailed": "Le déplacement n’a pas pu être repris",
  "activity.notice.rollBackFailed": "Le déplacement n’a pas pu être annulé",
  "activity.notice.rollBackProblems":
    "{count, plural, one {# élément n’a pas pu être restauré} other {# éléments n’ont pas pu être restaurés}}",
  "activity.notice.resumeNotes": "Le déplacement repris a laissé des remarques",

  // Le menu Déplacer vers
  "activity.move.blocked":
    "Un déplacement de {label} vers {destination} n’a pas abouti ({progress}).",
  "activity.move.blockedNoPlace": "Un déplacement de {label} n’a pas abouti ({progress}).",
  "activity.move.resume": "Reprendre ce déplacement",
  "activity.move.rollBack": "L’annuler",
  "activity.move.open": "Ouvrir dans l’Activité",
} as const;
