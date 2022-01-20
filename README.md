# Projet 7 Open Classrooms

## Démarrage de l'application

Dans VsCode:
Ouvrez deux terminaux (clic droit sur les dossiers puis "Open in integrated terminal") pour les dossiers backend et frontend.
Utiliser la commande npm start pour démarrer le serveur et le frontend.
Utiliser ctrl + C dans le terminal pour arrêter le serveur ou le frontend.

Puisque le token est stocké dans le localstorage, pour tester les connexions il faut aller dans les paramètres de votre navigateur
et vider le localstorage. Vous serez alors redirigé vers la page de connexion.

## librairies:

### frontend:

- axios pour les requêtes sql.
- formik pour le traitement de formulaires.
- react react-dom, react-router-dom: pour le traitement de l'affichage frontend.
- react-scripts traitement de fichiers lors de la création de l'app avec npx create-react-app.
- react-share pour gérer le fonctionnemente du bouton partager vers Reddit.
- yup pour la gestion des Schémas de formulaires et l'affichage de messages d'erreurs (créer un post et créer un compte).
- web-vitals installé par défaut avec npx create-react-app, utilisé pour surveiller les performances du site.

### backend:

- bcrypt pour encrypter le mot de passe.
- cors pour autoriser les requêtes vers l'application.
- express pour faire fonctionner le serveur.
- helmet pour sécuriser l'application à l'aide de divers headers.
- jsonwebtoken pour créer un token d'autentification afin de sécuriser les sessions d'utilisateurs.
- msql2 client Mysql pour node.js, permet d'effectuer des requêtes SQL.
- nodemon pour redémarrer le serveur automatiquement après modification des fichiers.
- sequelize il s'agit d'un ORM (Object Relational Mapper) ou mapping objet-relationnel. C'est un programme qui
  sert d'interface entre node.js et notre base de données relationnelle SQL.
- cloudinary-react pour mettre en ligne et afficher des image. Grâce à cette librairie, le site entre en relation avec l'hébergeur cloudinary.
  Ainsi, seul l'id de l'image est stocké pour ne pas avoir a conserver l'URI/URL de l'image ou l'image elle-même.

##Fonctionnalités:

- l'utilisateur peut s'inscrire et se connecter au site pour voir les posts.
- l'utilisateur peut commenter des posts et liker des posts.
- l'utilisateur peut mettre en ligne une image avec son post.
- l'utilisateur peut partager le post via le bouton de partage sur le réseau social reddit.
- l'utilisateur peut désactiver son compte: il ne s'agit pas d'une suppression véritable mais d'une désactivation du compte.
- l'utilisateur admin peut supprimer les posts et les commentaires des autres utilisateurs
