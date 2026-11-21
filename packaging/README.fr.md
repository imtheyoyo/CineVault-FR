# CineVault dans un navigateur (bêta)

[English](README.md) · **Français**

CineVault peut tourner comme un petit serveur sur l’ordinateur qui contient vos films (un PC de bureau, un mini-PC
ou un NAS) et s’utiliser depuis un navigateur sur n’importe quel appareil de votre maison : la même bibliothèque, Scanner, Scraper,
Renommer, les illustrations, l’Historique et la lecture dans le navigateur. C’est l’**Accès navigateur**, nouveau dans la version 1.2.0 et
encore en **bêta**. Vos fichiers restent où ils sont ; CineVault n’utilise que les dossiers que vous lui donnez.

- [Installation](#installation) : une seule commande pour Linux, Windows ou macOS
- [Première visite](#première-visite) : mot de passe, dossiers, clé TMDB
- [Utilisation au quotidien](#utilisation-au-quotidien) : démarrer, arrêter, mettre à jour, mot de passe oublié, journaux, désinstallation
- [Installation manuelle](#installation-manuelle-avec-docker) avec `docker run` ou Docker Compose
- [NAS](#nas-unraid-synology-truenas), [dossiers de bibliothèque sur un NAS](#dossiers-de-bibliothèque-sur-un-nas),
  [paquets Linux installés à la main](#installation-manuelle-des-paquets-linux)
- [Dépannage](#dépannage), [Pour les mainteneurs](#pour-les-mainteneurs)

**Pas encore disponible dans la bêta :** le serveur n’est construit que pour les ordinateurs Intel et AMD 64 bits (pas d’ARM,
donc ni Raspberry Pi ni NAS ARM) ; « Ouvrir dans Kodi » n’est pas encore proposé ; ce qu’un navigateur ne peut pas faire
à votre place (ouvrir un dossier dans l’Explorateur ou le Finder, lancer un lecteur vidéo de bureau, transmettre un torrent à
une application de bureau) reste dans l’application de bureau.

## Installation

### Linux (Ubuntu, Debian, Fedora, openSUSE et autres)

Ouvrez un terminal et collez :

```sh
curl -fsSL https://imtheyoyo.github.io/CineVault-FR/install.sh | sh
```

Il installe CineVault comme un programme et un service ordinaires, à la manière des autres serveurs multimédias domestiques : il télécharge
le paquet `cinevault-server` de la dernière version (`.deb` sur Debian et Ubuntu, `.rpm` sur Fedora,
RHEL et openSUSE, une archive tarball ailleurs), vérifie son SHA-256, l’installe, demande quels dossiers de films et de séries
CineVault peut utiliser, puis démarre le service `cinevault-server`, qui démarre aussi avec
l’ordinateur. Il vous demande votre mot de passe une seule fois (sudo). Le service s’exécute sous votre compte, il peut donc écrire à côté de
vos médias ; la bibliothèque se trouve dans `/srv/cinevault`. Il faut un ordinateur Intel ou AMD 64 bits avec
glibc 2.34 ou plus récente (Ubuntu 22.04, Debian 12, Fedora 36 ou ultérieures).

Vous préférez Docker sous Linux ? Ajoutez `-s -- --docker` :
`curl -fsSL https://imtheyoyo.github.io/CineVault-FR/install.sh | sh -s -- --docker`.

### Windows

1. Installez [Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/) (gratuit pour
   un usage personnel), ouvrez-le une fois et acceptez ses conditions. Laissez activée l’option Docker Desktop › Settings › General ›
   **Start Docker Desktop when you sign in to your computer** (démarrer Docker Desktop à l’ouverture de session), afin que CineVault revienne après un
   redémarrage.
2. Ouvrez **PowerShell** (menu Démarrer › tapez « PowerShell ») et collez :

   ```powershell
   irm https://imtheyoyo.github.io/CineVault-FR/install.ps1 | iex
   ```

   Dans l’Invite de commandes classique (cmd.exe), collez plutôt
   `powershell -c "irm https://imtheyoyo.github.io/CineVault-FR/install.ps1 | iex"`.

### macOS

1. Installez [Docker Desktop](https://docs.docker.com/desktop/setup/install/mac-install/), ouvrez-le une fois
   et acceptez ses conditions, et laissez activée l’option **Start Docker Desktop when you sign in to your computer**.
2. Ouvrez **Terminal** et collez :

   ```sh
   curl -fsSL https://imtheyoyo.github.io/CineVault-FR/install.sh | sh
   ```

Sous Windows et macOS, l’installateur demande vos dossiers de films et de séries ainsi que l’endroit où CineVault peut conserver
ses données (appuyez sur Entrée pour `CineVault` dans votre dossier utilisateur), crée la clé qui protège vos
clés de fournisseurs, démarre CineVault dans Docker et l’ouvre dans votre navigateur. Il n’exige aucun droit
d’administrateur.

### À propos de l’installateur

Il n’envoie rien nulle part : il télécharge seulement depuis github.com et ghcr.io. Vous pouvez le lire d’abord :
[install.sh](https://imtheyoyo.github.io/CineVault-FR/install.sh) et
[install.ps1](https://imtheyoyo.github.io/CineVault-FR/install.ps1) (source :
[`scripts/install/`](../scripts/install)). À la fin, il affiche l’adresse à utiliser depuis votre téléphone ou
un autre ordinateur ainsi que les noms de dossiers à choisir dans la configuration.

**Relancez la même commande** pour mettre CineVault à jour vers la dernière version, changer ses dossiers ou
le supprimer. Votre bibliothèque, vos paramètres et votre mot de passe sont conservés ; la suppression demande confirmation avant de les effacer.

<details>
<summary>Sans questions (pour les scripts et les utilisateurs avancés)</summary>

`CINEVAULT_YES=1` accepte toutes les valeurs par défaut ; `CINEVAULT_MEDIA` liste les dossiers de la bibliothèque, séparés par
`;`. Les actions sont `install` (par défaut), `update`, `folders` et `uninstall`.

```sh
curl -fsSL https://imtheyoyo.github.io/CineVault-FR/install.sh | CINEVAULT_YES=1 CINEVAULT_MEDIA="/srv/movies;/srv/tv" sh
curl -fsSL https://imtheyoyo.github.io/CineVault-FR/install.sh | sh -s -- update
curl -fsSL https://imtheyoyo.github.io/CineVault-FR/install.sh | sh -s -- uninstall
```

```powershell
$env:CINEVAULT_YES = '1'; $env:CINEVAULT_MEDIA = 'D:\Movies;E:\TV'; irm https://imtheyoyo.github.io/CineVault-FR/install.ps1 | iex
& ([scriptblock]::Create((irm https://imtheyoyo.github.io/CineVault-FR/install.ps1))) update
& ([scriptblock]::Create((irm https://imtheyoyo.github.io/CineVault-FR/install.ps1))) uninstall
```

Un partage dans `CINEVAULT_MEDIA` (`//nas/movies`) demande aussi `CINEVAULT_SHARE_USER` et
`CINEVAULT_SHARE_PASSWORD_FILE` ([Dossiers de bibliothèque sur un NAS](#dossiers-de-bibliothèque-sur-un-nas)).
Il existe aussi : `CINEVAULT_PORT` (8787 par défaut ; le port libre suivant est utilisé si celui-ci est pris),
`CINEVAULT_NO_BROWSER=1`, `CINEVAULT_VERSION` (paquets Linux : une version précise au lieu de la dernière),
et, pour Docker, `CINEVAULT_DIR` (`~/cinevault` par défaut, `%USERPROFILE%\CineVault` sous Windows) et
`CINEVAULT_IMAGE` (par exemple `ghcr.io/imtheyoyo/cinevault-fr:1.2.0`).

</details>

## Première visite

1. **Ouvrez CineVault.** Sur l’ordinateur où il tourne : <http://localhost:8787>. Depuis un téléphone, une tablette ou
   un autre ordinateur : `http://<adresse de l’ordinateur>:8787`, par exemple `http://192.168.1.20:8787`.
   L’installateur affiche cette adresse. Pour la trouver vous-même :
   - Windows : lancez `ipconfig` dans PowerShell et utilisez la ligne « Adresse IPv4 ».
   - macOS : Réglages Système › Wi-Fi (ou Réseau) › Détails, ou `ipconfig getifaddr en0` dans Terminal.
   - Linux : `hostname -I` (la première adresse).
2. **Choisissez un mot de passe** (12 caractères ou plus) sur la page d’accueil. Elle reste ouverte tant qu’aucun
   mot de passe n’est défini, mais seulement pour les navigateurs du même ordinateur ou de votre réseau domestique ; de partout
   ailleurs, elle affiche « Finish setup from your home network » (terminez la configuration depuis votre réseau domestique ; ce message est en anglais). (Avec le mappage de ports de Docker, chaque client
   paraît local à CineVault ; gardez donc le port hors d’Internet.)
3. **Ajoutez vos dossiers** dans la configuration avec le navigateur de dossiers.
   - **Service Linux :** vos dossiers gardent leurs chemins habituels (`/srv/media/movies`) ; le navigateur de
     dossiers montre les dossiers que vous avez donnés à l’installateur.
   - **Docker (Windows, macOS, NAS) :** CineVault vit dans sa propre boîte et voit vos dossiers sous des
     noms qui commencent par `/media/` : votre `D:\Movies` devient `/media/Movies`. L’installateur a affiché la
     liste (`/media/<name>    (your folder ...)`). **Ne saisissez pas `D:\Movies` dans CineVault ; il ne le
     trouvera pas.**
4. **Saisissez votre clé TMDB.** CineVault identifie les titres avec votre propre
   [clé d’API TMDB](https://www.themoviedb.org/settings/api) gratuite. Elle est enregistrée chiffrée ; l’installateur a créé
   la clé qui la protège (`/etc/cinevault/cinevault.key` pour le service Linux, `secret.key`
   à côté du dossier de données pour Docker).
5. **Scannez.** MediaInfo et FFmpeg se téléchargent dans le dossier de données la première fois qu’on en a besoin.

Gardez le serveur dans votre réseau domestique. Ne redirigez jamais son port vers Internet ; pour y accéder de
l’extérieur, utilisez un VPN. Pour du HTTPS derrière un proxy inverse ou un tunnel, définissez `CINEVAULT_WEB_TRUST_PROXY` avec
l’adresse du proxy (`127.0.0.1` pour un proxy sur le même ordinateur) : CineVault prend alors l’adresse du
visiteur auprès du proxy et marque le cookie de connexion comme sécurisé. Tant que ce n’est pas défini, une requête
qui passe par un proxy compte comme extérieure à votre réseau domestique ; la page d’accueil et **Forgot
the password?** (« Mot de passe oublié ? », sur la page de connexion, en anglais) la refusent, et le journal le dit une fois.

## Utilisation au quotidien

CineVault démarre tout seul avec l’ordinateur (le service Linux) ou avec Docker
(`--restart unless-stopped`). Pour mettre à jour, changer les dossiers ou le supprimer, relancez la commande d’installation
et choisissez dans son menu.

| Pour | Service Linux | Docker (tous systèmes) |
| --- | --- | --- |
| Arrêter | `sudo systemctl stop cinevault-server` | `docker stop cinevault` |
| Démarrer | `sudo systemctl start cinevault-server` | `docker start cinevault` |
| Redémarrer | `sudo systemctl restart cinevault-server` | `docker restart cinevault` |
| Voir ce qu’il fait | `journalctl -u cinevault-server -e` | `docker logs --tail 100 cinevault` |
| Où se trouve la bibliothèque | `/srv/cinevault` | le dossier `data` que vous avez choisi |

**Mot de passe oublié ?** Sur la page de connexion, choisissez **Forgot the password?** (« Mot de passe oublié ? », depuis un appareil de votre
réseau domestique). CineVault écrit un code PIN à usage unique dans `password-reset-pin.txt`, dans son dossier de données ; saisissez-le
avec un nouveau mot de passe. Le PIN ne fonctionne qu’une fois, pendant 15 minutes, et déconnecte tous les autres navigateurs.
Pour le lire :

| Service Linux | Docker |
| --- | --- |
| `sudo cat /srv/cinevault/password-reset-pin.txt` | `docker exec cinevault cat /data/password-reset-pin.txt` |

Ou définissez un nouveau mot de passe directement sur l’ordinateur où CineVault tourne.

Service Linux :

```sh
sudo -u "$(systemctl show -p User --value cinevault-server)" env CINEVAULT_DATA_DIR=/srv/cinevault cinevault-server passwd
```

Docker :

```sh
docker exec -it -u cinevault cinevault cinevault-server passwd
```

Ou effacez-le et choisissez-en un nouveau sur la page d’accueil : ajoutez `--reset` après `passwd` (pour Docker,
sans `-it`), redémarrez CineVault comme dans le tableau et ouvrez la page.

Les navigateurs restent connectés quand CineVault redémarre ou se met à jour (jusqu’à 30 jours sans utilisation). Un nouveau
mot de passe, défini dans les Paramètres, avec un PIN ou avec `passwd`, déconnecte tous les navigateurs.

**Votre propre MediaInfo ou FFmpeg.** CineVault télécharge ses propres copies. Pour utiliser à la place des programmes déjà présents sur
le serveur, indiquez leurs chemins sur le serveur lui-même ; un navigateur ne peut pas choisir un programme que
le serveur exécute. Arrêtez CineVault, ouvrez `settings.json` dans le dossier de données et ajoutez le chemin dans son bloc
`"values"`, par exemple `"tools.path.ffmpeg": "/usr/bin/ffmpeg"` (ou `tools.path.mediainfo`
pour la bibliothèque MediaInfo), puis redémarrez CineVault. Avec Docker, le chemin est celui à l’intérieur du
conteneur. Le canal de mise à jour et les réglages du lecteur, qu’un navigateur ne peut pas non plus modifier, ne signifient
rien sur le serveur.

**Sauvegardes quotidiennes.** Pendant qu’il tourne, CineVault conserve chaque jour une copie vérifiée de la bibliothèque dans le dossier
`backups` du dossier de données (`/srv/cinevault/backups`, ou `backups` dans le dossier `data` de Docker),
sous le nom `library-YYYY-MM-DD.db`, et garde les sept dernières. Si les sauvegardes échouent trois jours de suite, le
centre de notifications le signale. Pour en restaurer une :

1. Arrêtez CineVault : `sudo systemctl stop cinevault-server` ou `docker stop cinevault`.
2. Dans le dossier de données, renommez `library.db` en `library-before-restore.db`, et mettez de côté
   `library.db-wal` et `library.db-shm` s’ils existent.
3. Copiez `backups/library-YYYY-MM-DD.db` dans le dossier de données sous le nom `library.db`, avec le même propriétaire
   que les autres fichiers (`sudo cp -p` sous Linux ; le conteneur corrige le propriétaire de `/data` au démarrage).
4. Redémarrez CineVault.

La bibliothèque, l’Historique et Annuler reviennent à ce jour-là. Les fichiers renommés ou déplacés après cette date sont retrouvés
au scan suivant, mais ces changements ne peuvent plus être annulés depuis CineVault. Échangez les fichiers de la même façon pour
revenir en arrière.

**Sauvegardez** la bibliothèque avec sa clé (`/srv/cinevault` et
`/etc/cinevault/cinevault.key`, ou le dossier `data` de Docker et `secret.key`), idéalement pendant que
CineVault est arrêté. Sans la clé, vos clés de fournisseurs enregistrées ne peuvent plus être lues ; vous n’auriez qu’à
les saisir de nouveau.

**`latest` ou un numéro de version ?** L’installateur installe toujours la dernière version. Avec Docker, les
exemples utilisent `ghcr.io/imtheyoyo/cinevault-fr:latest`, donc mettre à jour revient à « télécharger et recréer » ; pour rester sur
une version précise, utilisez son numéro à la place, par exemple `:1.2.0`, et changez-le quand vous choisissez de mettre à jour.
Revenir à une version plus ancienne demande la sauvegarde d’avant la mise à jour, car une version plus récente peut
mettre à niveau la bibliothèque.

## Installation manuelle avec Docker

L’installateur fait exactement cela ; utilisez cette méthode si vous préférez voir chaque étape. Créez un dossier de données et le
fichier de clé une seule fois, puis démarrez le conteneur. Ne changez que le dossier à gauche de
`:/media/movies` ; ajoutez une ligne `-v` de plus par dossier supplémentaire (`-v "E:\TV:/media/tv"`).

**Windows (PowerShell) :**

```powershell
New-Item -ItemType Directory -Force "$HOME\CineVault\data" | Out-Null
if (-not (Test-Path "$HOME\CineVault\secret.key")) { $b = New-Object byte[] 32; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b); [IO.File]::WriteAllText("$HOME\CineVault\secret.key", [Convert]::ToBase64String($b)) }
docker run -d --name cinevault `
  -p 8787:8787 `
  -v "$HOME\CineVault\data:/data" `
  -v "$HOME\CineVault\secret.key:/run/secrets/cinevault_key:ro" `
  -e CINEVAULT_SECRET_KEY_FILE=/run/secrets/cinevault_key `
  -v "D:\Movies:/media/movies" `
  --restart unless-stopped `
  ghcr.io/imtheyoyo/cinevault-fr:latest
```

L’accent grave (backtick) en fin de ligne poursuit la commande dans PowerShell. L’Invite de commandes (cmd.exe)
ne le comprend pas ; utilisez PowerShell ou l’installation en une commande.

**macOS et Linux (Terminal, bash ou zsh) :**

```sh
mkdir -p ~/cinevault/data
[ -s ~/cinevault/secret.key ] || openssl rand -base64 32 > ~/cinevault/secret.key
docker run -d --name cinevault \
  -p 8787:8787 \
  -e PUID=$(id -u) -e PGID=$(id -g) \
  -v ~/cinevault/data:/data \
  -v ~/cinevault/secret.key:/run/secrets/cinevault_key:ro \
  -e CINEVAULT_SECRET_KEY_FILE=/run/secrets/cinevault_key \
  -v /path/to/movies:/media/movies \
  --restart unless-stopped \
  ghcr.io/imtheyoyo/cinevault-fr:latest
```

Le fichier de clé n’est créé qu’une seule fois (la deuxième ligne l’ignore s’il existe) : une nouvelle clé ne peut pas lire les
clés de fournisseurs enregistrées avec l’ancienne.

**Mise à jour** manuelle : téléchargez la nouvelle image, supprimez le conteneur et relancez la même commande `docker run`.
Tout ce que vous avez configuré se trouve dans le dossier de données, rien n’est donc perdu :

```sh
docker pull ghcr.io/imtheyoyo/cinevault-fr:latest
docker stop cinevault
docker rm cinevault
# then the docker run command above, unchanged
```

**Désinstallation :** `docker stop cinevault`, `docker rm cinevault`, puis
`docker image rm ghcr.io/imtheyoyo/cinevault-fr:latest`. Supprimez vous-même le dossier de données `CineVault`
si vous ne voulez plus de la bibliothèque.

### Docker Compose

[`docker-compose.yml`](../docker-compose.yml) fait la même chose dans un fichier. Placez-le dans un dossier vide,
créez `secret.key` à côté comme l’indiquent ses commentaires, remplacez la ligne des médias par votre dossier (sous Windows
`D:/Movies:/media/movies`), puis :

```sh
docker compose up -d                              # start
docker compose pull && docker compose up -d       # update
docker compose down                               # remove (data stays in ./data)
```

## NAS (Unraid, Synology, TrueNAS)

- **Unraid :** le modèle [`packaging/unraid/cinevault.xml`](unraid/cinevault.xml) remplit les champs du
  conteneur. Copiez-le dans `/boot/config/plugins/dockerMan/templates-user/my-CineVault.xml`, puis
  Docker › Add Container › Template : CineVault. Créez la Secret key dans le terminal Unraid avec
  `openssl rand -base64 32`, collez-la, gardez-en une copie, et réglez le Media path sur votre partage.
  PUID 99 et PGID 100 correspondent au propriétaire habituel des partages Unraid.
- **Synology (Container Manager) et TrueNAS SCALE (Apps › Discover › Custom App, Install via
  YAML) :** utilisez [`docker-compose.yml`](../docker-compose.yml) comme projet. Faites pointer la ligne des médias vers
  votre dossier partagé, placez `secret.key` à côté du fichier (ou remplacez le secret par
  `CINEVAULT_SECRET_KEY: <la clé>` sous `environment`), et réglez `PUID`/`PGID` sur l’utilisateur propriétaire
  du partage (Synology : `id <user>` en SSH, souvent 1026 et 100).
- **Autres NAS avec Docker :** la commande manuelle `docker run` ci-dessus fonctionne partout où l’image
  tourne (Intel ou AMD 64 bits).

Gardez le dossier de données sur un disque local ou sur le volume propre du NAS, pas sur un partage réseau monté
depuis ailleurs : la base de données de la bibliothèque ne fonctionne pas de façon fiable sur SMB ou NFS.

## Dossiers de bibliothèque sur un NAS

Vos films se trouvent sur un partage de NAS qui demande son propre nom d’utilisateur et mot de passe, et CineVault tourne sur
un autre ordinateur ? Le serveur ne peut pas connecter un partage lui-même (il s’exécute sous un compte ordinaire, ou
dans un conteneur) ; c’est donc l’installateur qui le connecte sur l’ordinateur où CineVault tourne :

1. Relancez la commande d’installation et choisissez **2  Change which movie and TV folders CineVault may
   use** (« Changer les dossiers de films et de séries que CineVault peut utiliser » ; le menu de l’installateur est en anglais), ou indiquez le partage dès la première installation.
2. Saisissez le partage là où l’on vous demande un dossier : `//nas/movies`, `\\nas\movies` ou `smb://nas/movies`,
   avec un dossier à l’intérieur si vous le souhaitez (`//nas/movies/Films`).
3. Saisissez l’utilisateur du partage (`DOMAINE\nom` fonctionne aussi) et son mot de passe. Le mot de passe ne s’affiche pas, et
   il n’apparaît jamais dans une ligne de commande ni dans la sortie de l’installateur.

L’installateur connecte le partage une première fois pour vérifier l’identifiant et le dossier (SMB 3.0 d’abord, puis 2.1
pour les NAS plus anciens) et dit clairement ce qui ne va pas : un nom d’utilisateur ou un mot de passe incorrect, un serveur qui
est injoignable, un partage qui n’existe pas, ou un dossier qui n’y figure pas. Ensuite, il configure le partage pour qu’il revienne après un redémarrage :

- **Linux :** le partage est monté dans `/mnt/<server>-<share>`, par exemple `/mnt/nas-movies`, par une
  unité de montage systemd, et son identifiant est conservé dans `/etc/cinevault/shares/nas-movies.cred`, que seul
  root peut lire. L’installateur demande avant d’installer `cifs-utils`. Dans CineVault, choisissez **Ajouter un dossier…** et
  sélectionnez `/mnt/nas-movies/Films`. Si le NAS est éteint au démarrage de l’ordinateur, CineVault démarre quand même
  et les dossiers du partage apparaissent hors ligne, leurs titres étant conservés ; une fois le NAS allumé, montez-le de nouveau
  avec `sudo systemctl start /mnt/nas-movies`.
- **Docker sous Linux (`--docker`) :** le même montage sur l’ordinateur, transmis au conteneur sous le nom
  `/media/movies` (sélectionnez `/media/movies/Films` dans CineVault). Le mot de passe reste dans le fichier réservé à root,
  pas dans Docker, et un partage monté après le démarrage du conteneur y apparaît quand même.
- **Docker Desktop (Windows et macOS) :** Docker Desktop ne voit pas les partages auxquels votre ordinateur est
  connecté ; l’installateur crée donc un volume CIFS, `cinevault-nas-movies`, que le conteneur
  voit sous le nom `/media/movies`. Il est créé par l’API propre à Docker, le mot de passe n’apparaît donc jamais dans une
  ligne de commande, mais Docker le conserve dans les options du volume, que quiconque peut utiliser Docker sur
  cet ordinateur peut lire (`docker volume inspect`). Si le NAS est éteint au démarrage du conteneur,
  Docker redémarre le conteneur jusqu’à ce que le partage puisse être monté. Docker résout lui-même le nom du NAS ;
  s’il n’y parvient pas (un nom en `.local`, par exemple), saisissez plutôt l’adresse IP du NAS.

Quand « Changer les dossiers » retire un partage, ou quand vous supprimez CineVault, l’installateur supprime son montage, son
fichier d’identifiants et son volume. Il ne supprime jamais rien sur le NAS, et un dossier de montage n’est retiré que
lorsqu’il n’est plus monté.

Sans questions, indiquez l’utilisateur dans `CINEVAULT_SHARE_USER` et le mot de passe dans un fichier désigné par
`CINEVAULT_SHARE_PASSWORD_FILE` (sa première ligne ; ne mettez pas le mot de passe dans des variables d’environnement) :

```sh
curl -fsSL https://imtheyoyo.github.io/CineVault-FR/install.sh | CINEVAULT_YES=1 CINEVAULT_MEDIA="//nas/movies/Films;/srv/tv" CINEVAULT_SHARE_USER=alex CINEVAULT_SHARE_PASSWORD_FILE=$HOME/nas-password sh
```

<details>
<summary>Avec Docker Compose</summary>

[`docker-compose.yml`](../docker-compose.yml) contient un volume CIFS commenté pour un partage. Décommentez
les lignes `nas-movies`, remplacez `//nas/movies` et `addr=nas` par votre NAS et votre partage, et conservez
l’identifiant dans un fichier `.env` à côté, que vous seul pouvez lire (`chmod 600 .env`) :

```sh
NAS_USER=alex
NAS_PASSWORD='your password'
PUID=1000
PGID=1000
```

Les apostrophes simples gardent un `$` du mot de passe tel quel ; écrivez une virgule deux fois (`,,`). Docker conserve
l’identifiant dans les options du volume. Docker crée le volume une seule fois : après avoir changé l’identifiant, lancez
`docker compose down`, `docker volume rm <dossier>_nas-movies` (supprimer le volume ne touche pas aux fichiers
du NAS) puis `docker compose up -d`. Sur un hôte Linux, vous pouvez monter le partage sur l’hôte
à la place (voir ci-dessous) et le lier comme n’importe quel dossier : `- /mnt/nas-movies:/media/movies:rslave`.

</details>

<details>
<summary>Monter un partage à la main sous Linux (systemd)</summary>

C’est ce que fait l’installateur. Installez `cifs-utils` (`sudo apt install cifs-utils` ou
`sudo dnf install cifs-utils`), puis créez le fichier d’identifiants, que seul root peut lire, et saisissez-y les deux
lignes `username=alex` et `password=…` :

```sh
sudo install -d -m 0700 /etc/cinevault/shares
sudo install -m 0600 /dev/null /etc/cinevault/shares/nas-movies.cred
sudoedit /etc/cinevault/shares/nas-movies.cred
```

Le nom de l’unité de montage doit correspondre à son dossier : pour `/mnt/nas-movies`, c’est `mnt-nas\x2dmovies.mount`
(`systemd-escape --path --suffix=mount /mnt/nas-movies` l’affiche). Créez-la avec
`sudoedit '/etc/systemd/system/mnt-nas\x2dmovies.mount'`, en réglant `uid` et `gid` sur le compte sous lequel le
service s’exécute (`id -u`, `id -g`) :

```ini
[Unit]
Description=NAS share //nas/movies
Wants=network-online.target
After=network-online.target

[Mount]
What=//nas/movies
Where=/mnt/nas-movies
Type=cifs
Options=credentials=/etc/cinevault/shares/nas-movies.cred,uid=1000,gid=1000,file_mode=0664,dir_mode=0775,iocharset=utf8,vers=3.0,_netdev,nofail
TimeoutSec=30

[Install]
WantedBy=remote-fs.target
```

Démarrez-la avec `sudo systemctl daemon-reload` et `sudo systemctl enable --now 'mnt-nas\x2dmovies.mount'`
(utilisez `vers=2.1` pour un NAS plus ancien). Ensuite, avec `sudo systemctl edit cinevault-server`, faites en sorte que le
service veuille le montage sans en dépendre, et ajoutez le dossier à ses racines de dossiers :

```ini
[Unit]
Wants=mnt-nas\x2dmovies.mount
After=mnt-nas\x2dmovies.mount

[Service]
Environment="CINEVAULT_WEB_ROOTS=/mnt/nas-movies/Films"
```

</details>

## Installation manuelle des paquets Linux

L’installateur Linux fait ces étapes à votre place ; suivez-les pour tout faire vous-même ou pour voir ce qui change.
Chaque version propose un `.deb`, un `.rpm` et une archive tarball de `cinevault-server` pour Linux Intel et AMD
64 bits avec glibc 2.34 ou plus récente, sur la
[page des versions](https://github.com/imtheyoyo/CineVault-FR/releases/latest), avec leurs sommes SHA-256 dans
`SHA256SUMS-Linux.txt`. Ils sont distincts du paquet `cinevault` de l’application de bureau, les deux peuvent donc être
installés.

```sh
# Debian, Ubuntu
curl -fLO https://github.com/imtheyoyo/CineVault-FR/releases/download/v1.2.0/cinevault-server_1.2.0_amd64.deb
sudo apt install ./cinevault-server_1.2.0_amd64.deb

# Fedora, RHEL, openSUSE
curl -fLO https://github.com/imtheyoyo/CineVault-FR/releases/download/v1.2.0/cinevault-server-1.2.0-1.x86_64.rpm
sudo dnf install ./cinevault-server-1.2.0-1.x86_64.rpm
```

Le paquet installe `/usr/local/bin/cinevault-server`, la ligne de commande `cinevault`, l’interface
dans `/usr/share/cinevault/ui` et le service systemd `cinevault-server`, et crée l’utilisateur système `cinevault`
avec le dossier de bibliothèque `/srv/cinevault`. Il ne démarre pas le service. Créez la clé,
puis ajoutez vos réglages au service :

```sh
sudo install -d -m 0755 /etc/cinevault
sudo sh -c 'umask 077; openssl rand -base64 32 > /etc/cinevault/cinevault.key'
sudo systemctl edit cinevault-server
```

Dans l’éditeur qui s’ouvre, ajoutez ces lignes et enregistrez (l’installateur écrit la même chose dans
`/etc/systemd/system/cinevault-server.service.d/cinevault-install.conf`) :

```ini
[Service]
LoadCredential=cinevault_key:/etc/cinevault/cinevault.key
Environment=CINEVAULT_SECRET_KEY_FILE=%d/cinevault_key
# Optional: run as the account that owns your media instead of "cinevault".
#User=yourname
#Group=yourname
# Optional: the folders the folder browser may open, separated by ":" (default: /media, /mnt, /srv).
#Environment="CINEVAULT_WEB_ROOTS=/srv/media/movies:/home/yourname/TV"
# Needed when a library folder is under /home.
#ProtectHome=false
```

```sh
sudo chown -R cinevault: /srv/cinevault     # or yourname: when you set User= above
sudo systemctl enable --now cinevault-server
```

Ouvrez `http://<serveur>:8787` et poursuivez avec [Première visite](#première-visite). Le compte du service doit
pouvoir lire et écrire dans les dossiers de la bibliothèque (`User=` ci-dessus, ou par exemple
`sudo chown -R cinevault: /srv/media`).

- **Mise à jour :** installez le paquet plus récent de la même façon, puis `sudo systemctl restart cinevault-server`.
  **Suppression :** `sudo apt purge cinevault-server` ou `sudo dnf remove cinevault-server` ;
  `/srv/cinevault` et `/etc/cinevault` restent jusqu’à ce que vous les supprimiez.
- **Tarball :** décompressez `cinevault-server-<version>-linux-amd64.tar.gz` et lancez `./run.sh` dans son
  dossier. Il conserve les données dans `./data` et n’écoute que sur `127.0.0.1:8787` ; utilisez
  `CINEVAULT_WEB_BIND=0.0.0.0 ./run.sh` pour y accéder depuis d’autres appareils et
  `CINEVAULT_SECRET_KEY_FILE=/path/to/secret.key` pour la clé. Le tarball contient aussi l’unité
  systemd.

## Dépannage

- **L’installateur Linux dit que ce Linux est trop ancien ou non pris en charge :** les paquets demandent glibc 2.34
  (Ubuntu 22.04, Debian 12, Fedora 36 ou ultérieures) sur x86_64. Utilisez plutôt Docker :
  `curl -fsSL https://imtheyoyo.github.io/CineVault-FR/install.sh | sh -s -- --docker`.
- **« Provider keys are locked »** (« Les clés de fournisseurs sont verrouillées ») quand vous saisissez la clé TMDB : CineVault a été démarré sans sa
  clé. Utilisez l’installateur ; à la main, ajoutez les deux lignes `secret.key` de la commande Docker et recréez
  le conteneur, ou les lignes `LoadCredential` de [Installation manuelle des paquets Linux](#installation-manuelle-des-paquets-linux). L’état de santé indique alors `"keys":"configured"` (`curl http://localhost:8787/healthz`).
- **« Finish setup from your home network »** au lieu de la page d’accueil : le navigateur n’est pas sur
  votre réseau domestique (ou passe par un proxy auquel CineVault ne fait pas confiance). Ouvrez la page depuis un appareil
  à la maison, ou définissez le mot de passe avec la commande `passwd` décrite dans [Utilisation au quotidien](#utilisation-au-quotidien).
- **Le port 8787 est déjà utilisé :** l’installateur choisit le port libre suivant et l’affiche. À la main,
  changez le nombre de gauche (`-p 8788:8787`) pour Docker, ou ajoutez `Environment=CINEVAULT_WEB_PORT=8788`
  avec `sudo systemctl edit cinevault-server`, puis ouvrez `http://<ordinateur>:8788`.
- **CineVault ne trouve pas mon dossier / la liste des dossiers est vide :** avec Docker, vous cherchez un
  chemin de votre ordinateur (`D:\Movies`, `/Users/me/Movies`) ; dans CineVault, c’est `/media/<name>`
  (voir [Première visite](#première-visite)). Un dossier que vous n’avez pas donné à l’installateur n’est pas visible du tout :
  relancez la commande d’installation et choisissez 2 pour changer les dossiers (à la main : ajoutez une ligne `-v` et
  recréez le conteneur, ou étendez `CINEVAULT_WEB_ROOTS`).
- **« This folder is not writable by the server »** (« Ce dossier n’est pas accessible en écriture par le serveur ») : CineVault écrit les illustrations, les fichiers NFO et les renommages
  à côté de vos médias. Le service Linux s’exécute sous l’utilisateur qui l’a installé
  (`systemctl show -p User cinevault-server`), qui doit pouvoir écrire dans les dossiers. Avec Docker sous
  Linux et sur les NAS, démarrez-le avec `PUID`/`PGID` de l’utilisateur propriétaire des fichiers (`id -u`,
  `id -g` ; l’installateur le fait). Vérifiez que le partage n’est pas en lecture seule. Sous
  Windows et macOS, cela signifie généralement que le dossier lui-même est en lecture seule ou se trouve sur un disque que Docker Desktop
  ne peut pas utiliser.
- **Windows : un disque ou un dossier est vide dans CineVault :** Docker Desktop avec WSL 2 (par défaut)
  peut utiliser tous les disques locaux. Un lecteur réseau mappé (`Z:`) n’est pas visible de Docker ; utilisez le
  Docker propre au NAS ou le chemin réel du partage.
- **macOS : un disque externe est absent :** Docker Desktop › Settings › Resources › File sharing
  doit lister `/Volumes` (c’est le cas par défaut).
- **Les autres appareils ne peuvent pas ouvrir la page :** utilisez l’adresse de l’ordinateur, pas `localhost`, et assurez-vous
  que les deux sont sur le même réseau. Sous Windows, autorisez Docker Desktop dans le Pare-feu Windows Defender
  quand on vous le demande (ou dans Sécurité Windows › Pare-feu et protection réseau › Autoriser une application via le pare-feu). Sous Linux, ouvrez le port :
  `sudo ufw allow 8787/tcp` (Ubuntu) ou `sudo firewall-cmd --add-port=8787/tcp --permanent && sudo firewall-cmd --reload` (Fedora).
- **Fedora ou autres systèmes SELinux :** si CineVault ne peut pas lire les médias, ajoutez une seule fois `:z` à la ligne
  `-v` des médias (`-v /srv/media:/media/media:z`) ; cela réétiquette le dossier pour les conteneurs.
- **Il ne revient pas après un redémarrage :** sous Windows et macOS, Docker Desktop doit démarrer à l’ouverture de
  session (Settings › General). Service Linux : `sudo systemctl enable cinevault-server` ; Linux avec
  Docker : `sudo systemctl enable docker`.
- **Il redémarre sans cesse ou est en mauvais état (unhealthy) :** `journalctl -u cinevault-server -e` ou
  `docker logs --tail 50 cinevault` en donne la raison.
  Un dossier de données sur un partage SMB ou NFS en est la cause habituelle ; gardez-le sur un disque local.
- **Déconnecté après une mise à jour :** le dossier de données a changé, ou le mot de passe aussi. Utilisez le même dossier de
  données à chaque fois ; le mot de passe et les sessions (`server-sessions.json`) s’y trouvent.
- **« This setting is changed on the computer that runs CineVault »** (« Ce réglage se change sur l’ordinateur qui exécute CineVault ») : le canal de mise à jour, les chemins
  des outils et le lecteur ne peuvent pas être modifiés depuis un navigateur. Pour les outils, voir **Votre propre MediaInfo ou
  FFmpeg** dans [Utilisation au quotidien](#utilisation-au-quotidien).

## Pour les mainteneurs

### Compilation

| Commande | Résultat |
| --- | --- |
| `bun run server:dev` | Construit l’interface et démarre le serveur sur l’adresse de bouclage |
| `bun run server:build` | Construit le programme `cinevault-server` de la version finale |
| `bun run server:image:build` | Construit les deux étapes de construction de l’image |
| `bun run server:image` | Construit `cinevault-server:local` |
| `bun run server:package` | Construit le `.deb` et le `.rpm` (Linux) dans `target/server-package/` |
| `bun run server:tarball` | Construit le tarball dans `target/server-tarball/` |

Le workflow de publication pousse l’image (`:<version>` et `:latest`, amd64) et joint les
paquets et le tarball à la version GitHub ; il s’arrête avant de publier si l’un d’eux
manque. Le tag de l’image et l’argument de construction `CINEVAULT_VERSION` sont comparés à la version du projet
par `node scripts/check-version.mjs`, qui vérifie aussi les noms des paquets et du tarball avec
`--server-artifacts`. Les scripts d’installation de `scripts/install/` sont publiés à la racine du site
par le workflow Deploy site.

### Où se trouve quoi

| Chemin | Contenu |
| --- | --- |
| `/usr/local/bin/cinevault-server` | Le serveur pour navigateur |
| `/usr/local/bin/cinevault` | La ligne de commande |
| `/usr/share/cinevault/ui` | L’interface compilée |
| `/usr/lib/systemd/system/cinevault-server.service` | L’unité systemd ([`cinevault-server.service`](cinevault-server.service)) |

Le conteneur conserve ses données dans `/data` et les dossiers de la bibliothèque sous `/media`. Son point d’entrée
([`entrypoint.sh`](entrypoint.sh)) associe l’utilisateur `cinevault` de l’image à `PUID`/`PGID` (1000 par défaut),
en rend propriétaire `/data` (seulement quand son dossier racine a un autre propriétaire, pour qu’un gros cache de
vignettes ne ralentisse pas chaque démarrage) et se remplace par le serveur sous cet utilisateur via `setpriv`, de sorte
qu’aucun processus root ne subsiste. Les groupes supplémentaires avec lesquels le conteneur est démarré (`--group-add 100`, ou
`group_add` dans Compose) sont conservés, sauf le groupe 0, pour les dossiers de NAS que seul un groupe peut atteindre.
Les dossiers de médias ne changent pas de propriétaire. Démarrer avec `--user` fonctionne aussi, mais alors
`PUID`/`PGID` doivent y correspondre. L’image vérifie `http://127.0.0.1:8787/healthz` toutes les 30 secondes et
arrête le serveur avec `SIGINT`, le signal qu’il utilise pour un arrêt propre.

La clé maîtresse du fichier chiffré des clés de fournisseurs (`secrets.enc` dans le dossier de données) est le base64 d’exactement
32 octets, lu depuis `CINEVAULT_SECRET_KEY_FILE` (un secret Docker ou Compose, un fichier monté
ou un identifiant systemd) ou `CINEVAULT_SECRET_KEY`. Toute autre valeur arrête le serveur au démarrage.
Sans clé, le serveur tourne quand même et ouvre la bibliothèque, l’état de santé indique `"keys":"locked"`, et
les clés de fournisseurs ne peuvent pas être enregistrées.

### Fichiers supprimés sur un montage bind

La Corbeille freedesktop n’est pas accessible en écriture sur un dossier de médias monté en bind mount. Dans Paramètres › Fichiers supprimés,
choisissez « dossier de corbeille sur chaque disque » ; CineVault utilise alors `.deletedByCineVault` à côté des médias et
peut y restaurer. Le vidage automatique ne touche qu’aux dossiers de corbeille propres à CineVault. La suppression définitive
est désactivée par défaut dans un navigateur et s’active dans Paramètres › Serveur.

### Revenir à une version antérieure

Télécharger une nouvelle image ou installer un nouveau paquet peut migrer `library.db`. Un serveur plus ancien refuse une
bibliothèque qu’un serveur plus récent a migrée : pour revenir en arrière, arrêtez le serveur, restaurez la copie du dossier de
données d’avant la mise à niveau, puis démarrez la version plus ancienne. Le serveur n’exécute jamais le programme de mise à jour du bureau ; Paramètres ›
Mises à jour indique la version en cours d’exécution et comment elle est mise à jour.
