// German. Formal "Sie", as is usual for business websites.
export default {
  nav: ['Start', 'Leistungen', 'Über uns', 'Kontakt'],
  navLabel: 'Hauptnavigation',
  footerNavLabel: 'Navigation in der Fußzeile',
  legalNavLabel: 'Rechtliche Informationen',
  skip: 'Zum Inhalt springen',
  menu: 'Menü',
  close: 'Schließen',
  home: 'Startseite',
  slogan: 'Wir schaffen Werte und gestalten die Zukunft',
  meta: {
    title: 'Velnovara Group — Software, Automatisierung und KI-Lösungen',
    description: 'Individuelle Software, Automatisierung, KI-Lösungen, SaaS-Plattformen, API-Integrationen und Websites für Unternehmen. Sofia, Bulgarien.'
  },

  hero: {
    title: ['Digitale Systeme', 'und Automatisierung.'],
    lead: 'Velnovara Group ist in den Bereichen Automatisierung, KI-Engineering und Softwareentwicklung tätig.',
    primary: 'Tätigkeitsbereiche',
    secondary: 'Kontakt',
    cardsLabel: 'Was wir entwickeln',
    cards: [
      ['Automatisierung', 'Prozesse, die ohne manuelle Arbeit laufen'],
      ['KI-Lösungen', 'Künstliche Intelligenz in echten Arbeitsabläufen'],
      ['Plattformen', 'Eigene SaaS-Produkte'],
      ['Integrationen', 'Vernetzte Systeme und APIs']
    ]
  },

  services: {
    label: 'Leistungen',
    title: 'Wobei wir helfen können.',
    intro: 'Fünf Bereiche, ein Ansatz: Wir beginnen beim tatsächlichen Problem in Ihrer Arbeit, nicht bei der Technologie.',
    indexLabel: 'Liste der Leistungen',
    items: [
      {
        id: 'automation',
        title: 'Prozessautomatisierung',
        pitch: 'Schluss damit, dieselben Daten an mehreren Stellen einzugeben.',
        body: 'Wir verbinden die Schritte, die heute über E-Mails, Tabellen und manuelles Kopieren laufen.',
        features: ['Automatische Freigaben und Benachrichtigungen', 'Verarbeitung von Dokumenten und Rechnungen', 'Workflows im CRM']
      },
      {
        id: 'ai',
        title: 'KI-Lösungen',
        pitch: 'Finden Sie Antworten in Ihren eigenen Dokumenten – in Sekunden.',
        body: 'KI-Werkzeuge, die mit Ihren Daten arbeiten und immer ihre Quelle angeben.',
        features: ['Suche in Unternehmensdokumenten', 'Extraktion und Zusammenfassung von Daten', 'Assistenten mit menschlicher Prüfung']
      },
      {
        id: 'platforms',
        title: 'SaaS- und Webplattformen',
        pitch: 'Von der Idee zum funktionierenden Produkt mit echten Nutzern.',
        body: 'Wir beginnen mit der kleinsten sinnvollen Version und entwickeln sie anhand von Rückmeldungen weiter.',
        features: ['SaaS-Produkte', 'Kunden- und Partnerportale', 'Interne Systeme']
      },
      {
        id: 'apis',
        title: 'API-Integrationen',
        pitch: 'Ihre Systeme sprechen endlich miteinander.',
        body: 'Klare Regeln dafür, welches System führend ist – ohne Dubletten und ohne verlorene Daten.',
        features: ['Anbindung externer Dienste', 'Entwicklung eigener APIs', 'Synchronisierung und Fehlerbehandlung']
      },
      {
        id: 'websites',
        title: 'Websites',
        pitch: 'Eine Website, die Ihr Unternehmen präsentiert und Anfragen bringt.',
        body: 'Schnelle, übersichtliche Websites mit Kontaktformularen, die Sie wirklich erreichen.',
        features: ['Unternehmenswebsites', 'Design für Smartphone und Computer', 'Mehrsprachige Inhalte']
      }
    ]
  },

  about: {
    label: 'Über uns',
    title: 'Über Velnovara Group.',
    body: [
      'Velnovara Group ist ein Unternehmen mit Sitz in Bulgarien. Der Schwerpunkt liegt auf der Entwicklung von Software und Plattformen, der Automatisierung von Prozessen und der Vernetzung digitaler Systeme.',
      'Velnovara Group befasst sich mit Systemautomatisierung, KI-Engineering und Softwareentwicklung. Diese Bereiche umfassen Prozesse, Daten, Anwendungen und die Verbindungen zwischen ihnen. Bei der Entwicklung werden der Zweck eines Systems, der Zugriff der Nutzer und die laufende Wartung berücksichtigt.'
    ],
    productsTitle: 'Unsere Produkte',
    products: [
      { name: 'OutboundFinder', tagline: 'Ihre nächste Geschäftschance', body: 'Findet potenzielle Geschäftskunden, versendet E-Mail-Kampagnen über Ihr eigenes verbundenes Postfach und hält alle Antworten in einem Arbeitsbereich zusammen.' },
      { name: 'Resido', tagline: 'Ihre Online-Hausverwaltung, nur einen Klick entfernt', body: 'Eine Plattform für Wohngebäude: Eingänge, Wohnungen, monatliche Beiträge und die gesamte Organisation des Gebäudes in einer Ansicht.' }
    ],
    photoAlt: 'Panorama von Sofia mit der Alexander-Newski-Kathedrale'
  },

  contact: {
    label: 'Kontakt',
    title: 'Sprechen wir über Ihr Projekt.',
    lead: 'Beschreiben Sie uns kurz, was Sie verbessern möchten. Ein technisches Lastenheft ist nicht nötig – wir helfen Ihnen, es zu formulieren.',
    emailNote: 'Lieber per E-Mail? Schreiben Sie uns an {email}',
    hintsTitle: 'Hilfreich zu erwähnen',
    hints: ['Welche Aufgabe Ihr Team die meiste Zeit kostet', 'Mit welcher Software und welchen Systemen Sie heute arbeiten', 'Bis wann Sie die Lösung brauchen'],
    formTitle: 'Anfrage senden',
    name: 'Name',
    email: 'E-Mail',
    message: 'Nachricht',
    namePlaceholder: 'Ihr Name',
    emailPlaceholder: 'name@firma.de',
    messagePlaceholder: 'Wobei können wir helfen?',
    privacyNote: 'Wir verwenden Ihre Angaben nur, um Ihre Anfrage zu beantworten.'
  },

  form: {
    send: 'Anfrage senden',
    sending: 'Wird gesendet …',
    success: 'Vielen Dank! Ihre Anfrage wurde gesendet. Wir melden uns in Kürze bei Ihnen.',
    error: 'Ihre Nachricht wurde nicht gesendet. Bitte versuchen Sie es erneut.',
    unavailable: 'Das Formular ist vorübergehend nicht verfügbar. Bitte versuchen Sie es später erneut oder schreiben Sie uns an {email}.',
    rate: 'Zu viele Versuche in kurzer Zeit. Bitte versuchen Sie es in einigen Minuten erneut.'
  },

  footer: {
    privacy: 'Datenschutz und DSGVO: Velnovara Group Ltd. verarbeitet Ihren Namen, Ihre E-Mail-Adresse und Ihre Nachricht ausschließlich, um Ihre Anfrage zu beantworten. Auskunft, Berichtigung oder Löschung Ihrer Daten können Sie unter {email} verlangen.',
    eik: 'UIC',
    vat: 'USt-IdNr.'
  },

  legal: ['Datenschutzerklärung', 'Datenschutz (DSGVO)'],
  backHome: 'Zur Startseite',
  langName: 'Deutsch',
  languageMenu: 'Sprache'
};
