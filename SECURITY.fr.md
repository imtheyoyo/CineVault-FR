# Politique de sécurité

[English](SECURITY.md) · **Français**

## Versions prises en charge

Les correctifs de sécurité vont dans la dernière version. CineVault recherche seul les mises à jour et vérifie chacune d'elles à l'aide d'une signature intégrée à l'application ; mettez donc à jour vers la version la plus récente avant de faire un signalement.

## Signaler une vulnérabilité

Merci de **ne pas ouvrir de ticket public** pour un problème de sécurité. Signalez-le plutôt en privé, via les avis de sécurité de GitHub :

<https://github.com/imtheyoyo/CineVault-FR/security/advisories/new>

Indiquez ce que vous avez trouvé, comment le reproduire, la version de CineVault et votre système d'exploitation. Vous recevrez une réponse dans les meilleurs délais et serez tenu informé pendant la préparation d'un correctif. Une fois le correctif publié, l'avis est publié, avec mention de votre nom si vous le souhaitez.

Les points qui méritent particulièrement d'être signalés :

- un moyen pour CineVault de supprimer, d'écraser ou de déplacer des fichiers au-delà de ce que l'utilisateur a demandé ;
- des clés d'API ou d'autres secrets qui se retrouvent dans les journaux, les fichiers NFO, les exports ou ailleurs que dans le magasin d'identifiants du système ;
- un moyen de faire accepter à l'application une mise à jour qui n'est pas signée avec la clé de version ;
- un moyen pour un autre utilisateur ou un client distant d'atteindre le canal local que la ligne de commande `cinevault` utilise pour communiquer avec une application en cours d'exécution.
