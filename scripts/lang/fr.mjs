// French. "Vous", with the French non-breaking space ( ) before : ; ? ! and inside « ».
export default {
  nav: ['Accueil', 'Services', 'À propos', 'Contact'],
  navLabel: 'Navigation principale',
  footerNavLabel: 'Navigation de bas de page',
  legalNavLabel: 'Informations légales',
  skip: 'Aller au contenu',
  menu: 'Menu',
  close: 'Fermer',
  home: 'Accueil',
  slogan: 'Créer de la valeur, bâtir l’avenir',
  meta: {
    title: 'Velnovara Group — logiciels, automatisation et solutions d’IA',
    description: 'Logiciels sur mesure, automatisation, solutions d’IA, plateformes SaaS, intégrations API et sites web pour les entreprises. Sofia, Bulgarie.'
  },

  hero: {
    title: ['Systèmes numériques', 'et automatisation.'],
    lead: 'Velnovara Group intervient dans l’automatisation, l’ingénierie de l’IA et le développement de logiciels.',
    primary: 'Nos domaines',
    secondary: 'Contact',
    cardsLabel: 'Ce que nous construisons',
    cards: [
      ['Automatisation', 'Des processus qui tournent sans intervention manuelle'],
      ['Solutions d’IA', 'L’intelligence artificielle dans de vrais processus de travail'],
      ['Plateformes', 'Nos propres produits SaaS'],
      ['Intégrations', 'Systèmes connectés et API']
    ]
  },

  services: {
    label: 'Services',
    title: 'Comment nous pouvons vous aider.',
    intro: 'Cinq domaines, une seule approche : nous partons du problème réel de votre activité, pas de la technologie.',
    indexLabel: 'Liste des services',
    items: [
      {
        id: 'automation',
        title: 'Automatisation des processus',
        pitch: 'Arrêtez de saisir les mêmes données à plusieurs endroits.',
        body: 'Nous relions les étapes qui passent aujourd’hui par des e-mails, des tableurs et des copier-coller.',
        features: ['Validations et notifications automatiques', 'Traitement des documents et des factures', 'Flux de travail dans le CRM']
      },
      {
        id: 'ai',
        title: 'Solutions d’IA',
        pitch: 'Trouvez des réponses dans vos propres documents en quelques secondes.',
        body: 'Des outils d’IA qui travaillent avec vos données et citent toujours leur source.',
        features: ['Recherche dans les documents de l’entreprise', 'Extraction et synthèse de données', 'Assistants avec vérification humaine']
      },
      {
        id: 'platforms',
        title: 'Plateformes SaaS et web',
        pitch: 'De l’idée à un produit qui fonctionne avec de vrais utilisateurs.',
        body: 'Nous commençons par la plus petite version utile et la faisons évoluer selon les retours.',
        features: ['Produits SaaS', 'Portails clients et partenaires', 'Systèmes internes']
      },
      {
        id: 'apis',
        title: 'Intégrations API',
        pitch: 'Vos systèmes communiquent enfin entre eux.',
        body: 'Des règles claires sur le système de référence : ni doublons ni données perdues.',
        features: ['Connexion à des services externes', 'Développement d’API sur mesure', 'Synchronisation et gestion des erreurs']
      },
      {
        id: 'websites',
        title: 'Sites web',
        pitch: 'Un site qui présente votre entreprise et vous apporte des demandes.',
        body: 'Des sites rapides et clairs, avec des formulaires de contact qui vous parviennent vraiment.',
        features: ['Sites d’entreprise', 'Conception pour mobile et ordinateur', 'Contenu multilingue']
      }
    ]
  },

  about: {
    label: 'À propos',
    title: 'À propos de Velnovara Group.',
    body: [
      'Velnovara Group est une entreprise basée en Bulgarie. Elle se consacre principalement au développement de logiciels et de plateformes, à l’automatisation des processus et à la connexion des systèmes numériques.',
      'Velnovara Group travaille dans l’automatisation des systèmes, l’ingénierie de l’IA et le développement de logiciels. Ces domaines couvrent les processus, les données, les applications et les liens qui les unissent. Le développement tient compte de la finalité du système, de l’accès des utilisateurs et de sa maintenance.'
    ],
    productsTitle: 'Nos produits',
    products: [
      { name: 'OutboundFinder', tagline: 'Votre prochaine opportunité d’affaires', body: 'Trouve des clients professionnels potentiels, envoie des campagnes d’e-mails depuis votre propre boîte mail connectée et réunit toutes les réponses dans un seul espace de travail.' },
      { name: 'Resido', tagline: 'Votre syndic en ligne, à portée de clic', body: 'Une plateforme pour les immeubles résidentiels : entrées, appartements, charges mensuelles et toute l’organisation de l’immeuble en une seule vue.' }
    ],
    photoAlt: 'Panorama de Sofia avec la cathédrale Saint-Alexandre-Nevski'
  },

  contact: {
    label: 'Contact',
    title: 'Parlons de votre projet.',
    lead: 'Dites-nous en quelques mots ce que vous souhaitez améliorer. Pas besoin de cahier des charges technique : nous vous aiderons à le formuler.',
    emailNote: 'Vous préférez l’e-mail ? Écrivez-nous à {email}',
    hintsTitle: 'Utile à mentionner',
    hints: ['La tâche qui prend le plus de temps à votre équipe', 'Les logiciels et systèmes que vous utilisez aujourd’hui', 'Le délai dans lequel vous avez besoin de la solution'],
    formTitle: 'Envoyer une demande',
    name: 'Nom',
    email: 'E-mail',
    message: 'Message',
    namePlaceholder: 'Votre nom',
    emailPlaceholder: 'nom@entreprise.fr',
    messagePlaceholder: 'Comment pouvons-nous vous aider ?',
    privacyNote: 'Nous utilisons vos données uniquement pour répondre à votre demande.'
  },

  form: {
    send: 'Envoyer la demande',
    sending: 'Envoi en cours…',
    success: 'Merci ! Votre demande a bien été envoyée. Nous vous recontacterons rapidement.',
    error: 'Votre message n’a pas été envoyé. Veuillez réessayer.',
    unavailable: 'Le formulaire est temporairement indisponible. Réessayez plus tard ou écrivez-nous à {email}.',
    rate: 'Trop de tentatives en peu de temps. Veuillez réessayer dans quelques minutes.'
  },

  footer: {
    privacy: 'Confidentialité et RGPD : Velnovara Group Ltd. traite votre nom, votre adresse e-mail et votre message exclusivement pour répondre à votre demande. Vous pouvez demander l’accès à vos données, leur rectification ou leur suppression à {email}.',
    eik: 'UIC',
    vat: 'N° de TVA'
  },

  legal: ['Politique de confidentialité', 'Protection des données (RGPD)'],
  backHome: 'Retour à l’accueil',
  langName: 'Français',
  languageMenu: 'Langue'
};
