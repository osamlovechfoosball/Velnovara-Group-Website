// Italian. Plural "voi", as is usual for Italian business websites.
export default {
  nav: ['Home', 'Servizi', 'Chi siamo', 'Contatti'],
  navLabel: 'Navigazione principale',
  footerNavLabel: 'Navigazione a piè di pagina',
  legalNavLabel: 'Informazioni legali',
  skip: 'Vai al contenuto',
  menu: 'Menu',
  close: 'Chiudi',
  home: 'Home',
  slogan: 'Creiamo valore, costruiamo il futuro',
  meta: {
    title: 'Velnovara Group — software, automazione e soluzioni di IA',
    description: 'Software su misura, automazione, soluzioni di IA, piattaforme SaaS, integrazioni API e siti web per le aziende. Sofia, Bulgaria.'
  },

  hero: {
    title: ['Sistemi digitali', 'e automazione.'],
    lead: 'Velnovara Group opera nei settori dell’automazione, dell’ingegneria dell’IA e dello sviluppo software.',
    primary: 'Aree di attività',
    secondary: 'Contatti',
    cardsLabel: 'Cosa realizziamo',
    cards: [
      ['Automazione', 'Processi che funzionano senza lavoro manuale'],
      ['Soluzioni di IA', 'Intelligenza artificiale nei processi di lavoro reali'],
      ['Piattaforme', 'Prodotti SaaS proprietari'],
      ['Integrazioni', 'Sistemi collegati e API']
    ]
  },

  services: {
    label: 'Servizi',
    title: 'Come possiamo aiutarvi.',
    intro: 'Cinque aree, un unico approccio: partiamo dal problema reale del vostro lavoro, non dalla tecnologia.',
    indexLabel: 'Elenco dei servizi',
    items: [
      {
        id: 'automation',
        title: 'Automazione dei processi',
        pitch: 'Smettete di inserire gli stessi dati in più punti.',
        body: 'Colleghiamo i passaggi che oggi passano per e-mail, fogli di calcolo e copia e incolla.',
        features: ['Approvazioni e notifiche automatiche', 'Elaborazione di documenti e fatture', 'Flussi di lavoro nel CRM']
      },
      {
        id: 'ai',
        title: 'Soluzioni di IA',
        pitch: 'Trovate risposte nei vostri documenti in pochi secondi.',
        body: 'Strumenti di IA che lavorano con i vostri dati e indicano sempre la fonte.',
        features: ['Ricerca nei documenti aziendali', 'Estrazione e sintesi dei dati', 'Assistenti con verifica umana']
      },
      {
        id: 'platforms',
        title: 'Piattaforme SaaS e web',
        pitch: 'Dall’idea a un prodotto funzionante, con utenti reali.',
        body: 'Partiamo dalla versione utile più piccola e la facciamo crescere in base ai riscontri.',
        features: ['Prodotti SaaS', 'Portali per clienti e partner', 'Sistemi interni']
      },
      {
        id: 'apis',
        title: 'Integrazioni API',
        pitch: 'Finalmente i vostri sistemi dialogano tra loro.',
        body: 'Regole chiare su quale sistema è quello di riferimento: niente duplicati, nessun dato perso.',
        features: ['Collegamento con servizi esterni', 'Sviluppo di API proprietarie', 'Sincronizzazione e gestione degli errori']
      },
      {
        id: 'websites',
        title: 'Siti web',
        pitch: 'Un sito che presenta la vostra azienda e porta richieste.',
        body: 'Siti veloci e chiari, con moduli di contatto che vi raggiungono davvero.',
        features: ['Siti aziendali', 'Design per smartphone e computer', 'Contenuti multilingue']
      }
    ]
  },

  about: {
    label: 'Chi siamo',
    title: 'Chi è Velnovara Group.',
    body: [
      'Velnovara Group è un’azienda con sede in Bulgaria. Si occupa principalmente dello sviluppo di software e piattaforme, dell’automazione dei processi e del collegamento tra sistemi digitali.',
      'Velnovara Group lavora nell’automazione dei sistemi, nell’ingegneria dell’IA e nello sviluppo software. Questi ambiti riguardano processi, dati, applicazioni e i collegamenti tra di essi. Nello sviluppo si considerano lo scopo del sistema, l’accesso degli utenti e la sua manutenzione nel tempo.'
    ],
    productsTitle: 'I nostri prodotti',
    products: [
      { name: 'OutboundFinder', tagline: 'La vostra prossima opportunità di business', body: 'Trova potenziali clienti aziendali, invia campagne e-mail dalla vostra casella di posta collegata e raccoglie tutte le risposte in un unico spazio di lavoro.' },
      { name: 'Resido', tagline: 'Il vostro amministratore di condominio online, a portata di clic', body: 'Una piattaforma per gli edifici residenziali: ingressi, appartamenti, quote mensili e tutta la gestione del condominio in un’unica schermata.' }
    ],
    photoAlt: 'Panorama di Sofia con la cattedrale di Sant’Aleksandr Nevskij'
  },

  contact: {
    label: 'Contatti',
    title: 'Parliamo del vostro progetto.',
    lead: 'Raccontateci in breve cosa volete migliorare. Non serve un capitolato tecnico: vi aiuteremo noi a definirlo.',
    emailNote: 'Preferite l’e-mail? Scriveteci a {email}',
    hintsTitle: 'Utile da indicare',
    hints: ['Quale attività richiede più tempo al vostro team', 'Quali programmi e sistemi usate oggi', 'Entro quando vi serve la soluzione'],
    formTitle: 'Inviate una richiesta',
    name: 'Nome',
    email: 'E-mail',
    message: 'Messaggio',
    namePlaceholder: 'Il vostro nome',
    emailPlaceholder: 'nome@azienda.it',
    messagePlaceholder: 'Come possiamo aiutarvi?',
    privacyNote: 'Usiamo i vostri dati solo per rispondere alla vostra richiesta.'
  },

  form: {
    send: 'Invia la richiesta',
    sending: 'Invio in corso…',
    success: 'Grazie! La richiesta è stata inviata e vi contatteremo a breve.',
    error: 'Il messaggio non è stato inviato. Riprovate.',
    unavailable: 'Il modulo non è momentaneamente disponibile. Riprovate più tardi o scriveteci a {email}.',
    rate: 'Troppi tentativi in poco tempo. Riprovate tra qualche minuto.'
  },

  footer: {
    privacy: 'Privacy e GDPR: Velnovara Group Ltd. tratta il vostro nome, il vostro indirizzo e-mail e il vostro messaggio solo per rispondere alla vostra richiesta. Potete chiedere l’accesso, la rettifica o la cancellazione dei vostri dati scrivendo a {email}.',
    eik: 'UIC',
    vat: 'Partita IVA'
  },

  legal: ['Informativa sulla privacy', 'Protezione dei dati (GDPR)'],
  backHome: 'Torna alla home',
  langName: 'Italiano',
  languageMenu: 'Lingua'
};
