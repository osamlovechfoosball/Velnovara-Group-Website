// All visible text for the one-page site. Bulgarian is the default language.
// Registered company details (Търговски регистър). The footer shows the name, ЕИК and city;
// the privacy policy and structured data use the rest. An empty field is simply left out.
export const company = {
  legalName: { bg: 'Велновара Груп ЕООД', en: 'Velnovara Group Ltd.' },
  eik: '208991366', // ЕИК / UIC
  vat: '',          // ДДС номер, if registered
  address: {
    bg: 'ул. „Градина“ № 53, Киноцентъра III, р-н Витоша, 1616 София, България',
    en: '53 Gradina St., Kinotsentara III, Vitosha district, 1616 Sofia, Bulgaria'
  },
  postal: { street: { bg: 'ул. „Градина“ № 53', en: '53 Gradina St.' }, code: '1616', city: { bg: 'София', en: 'Sofia' }, country: { bg: 'България', en: 'Bulgaria' } },
  contactEmail: 'support@velnovaragroup.eu', // public address; Porkbun forwards it to velnovaragroup@gmail.com
  contactPhone: '+359 896 726 277',
  // Web3Forms access key for the contact form. It is meant to be public: it only lets the
  // form deliver to the inbox registered at web3forms.com (velnovaragroup@gmail.com).
  formKey: '00935146-dedd-4ffe-bcf2-4ccaf908e2fd'
};

export const content = {
  bg: {
    nav: ['Начало', 'Услуги', 'За нас', 'Контакти'],
    // Phone layout: shortcut cards under the hero.
    mobile: { products: 'Продукти', shortcuts: 'Бързи връзки' },
    navLabel: 'Основна навигация',
    footerNavLabel: 'Навигация в долната част',
    legalNavLabel: 'Правна информация',
    skip: 'Към съдържанието',
    menu: 'Меню',
    close: 'Затвори',
    home: 'Начало',
    slogan: 'Създаваме стойност, изграждаме бъдеще',
    meta: {
      title: 'Velnovara Group — софтуер, автоматизация и AI решения',
      description: 'Създаваме софтуер по поръчка, автоматизации, AI решения, SaaS платформи, API интеграции и уебсайтове за бизнеса. София, България.'
    },

    hero: {
      title: ['Дигитални системи', 'и автоматизация.'],
      lead: 'Velnovara Group работи в областта на автоматизацията, AI и разработката на софтуер.',
      primary: 'Области на работа',
      secondary: 'Контакти',
      cardsLabel: 'Какво изграждаме',
      cards: [
        ['Автоматизация', 'Процеси, които работят без ръчна намеса'],
        ['AI решения', 'Изкуствен интелект в реални работни процеси'],
        ['Платформи', 'Собствени SaaS продукти'],
        ['Интеграции', 'Свързани системи и API']
      ]
    },

    services: {
      label: 'Услуги',
      title: 'С какво можем да помогнем.',
      intro: 'Пет направления, един подход: започваме от реалния проблем във вашата работа, а не от технологията.',
      indexLabel: 'Списък на услугите',
      exampleLabel: 'Например',
      items: [
        {
          id: 'automation',
          title: 'Автоматизация на процеси',
          pitch: 'Спрете да въвеждате едни и същи данни на няколко места.',
          body: 'Свързваме стъпките, които днес минават през имейли, таблици и ръчно копиране.',
          features: ['Автоматични одобрения и известия', 'Обработка на документи и фактури', 'Работни процеси в CRM'],
          example: 'Ново запитване от сайта автоматично създава запис в CRM и задача за екипа — без нито едно повторно въвеждане.'
        },
        {
          id: 'ai',
          title: 'AI решения',
          pitch: 'Намирайте отговори в собствените си документи за секунди.',
          body: 'AI инструменти, които работят с вашите данни и винаги показват източника си.',
          features: ['Търсене във фирмени документи', 'Извличане и обобщаване на данни', 'Асистенти с човешка проверка'],
          example: 'Служител пита „Какви са условията за връщане при клиент Х?“ и получава отговор с връзка към точния договор.'
        },
        {
          id: 'platforms',
          title: 'SaaS и уеб платформи',
          pitch: 'От идея до работещ продукт с реални потребители.',
          body: 'Започваме с най-малката полезна версия и я развиваме според обратната връзка.',
          features: ['SaaS продукти', 'Клиентски и партньорски портали', 'Вътрешни системи'],
          example: 'Клиентите ви подават заявки и следят статуса им в собствен портал, вместо да звънят за всяка промяна.'
        },
        {
          id: 'apis',
          title: 'API интеграции',
          pitch: 'Вашите системи най-сетне говорят помежду си.',
          body: 'Ясни правила коя система е водеща — без дубликати и изгубени данни.',
          features: ['Връзка с външни услуги', 'Разработка на собствени API', 'Синхронизация и обработка на грешки'],
          example: 'Промяна на клиентски запис в CRM се отразява автоматично в счетоводството и в онлайн магазина.'
        },
        {
          id: 'websites',
          title: 'Уебсайтове',
          pitch: 'Сайт, който представя бизнеса ви и носи запитвания.',
          body: 'Бързи и ясни сайтове с форми за контакт, които наистина достигат до вас.',
          features: ['Фирмени сайтове', 'Дизайн за телефон и компютър', 'Многоезично съдържание'],
          example: 'Двуезичен фирмен сайт, който обяснява услугите ви ясно и води посетителя директно до запитване.'
        }
      ]
    },

    about: {
      label: 'За нас',
      title: 'За Velnovara Group.',
      body: [
        'Velnovara Group е компания, базирана в България. Основният ѝ фокус е разработката на софтуер и платформи, автоматизацията на процеси и свързването на цифрови системи.',
        'Velnovara Group се занимава със системна автоматизация, AI инженерство и разработка на софтуер. Работата в тези области включва процеси, данни, приложения и връзките между тях. При разработката се разглеждат предназначението на системата, достъпът на потребителите и поддръжката ѝ.'
      ],
      productsTitle: 'Нашите продукти',
      products: [
        { name: 'OutboundFinder', tagline: 'Следващата ви бизнес възможност', body: 'Намира потенциални бизнес клиенти, изпраща имейл кампании от вашата собствена поща и събира всички отговори на едно място.' },
        { name: 'Resido', tagline: 'Твоят онлайн домоуправител на един клик разстояние', body: 'Платформа за етажна собственост: входове, апартаменти, месечни такси и цялата организация на сградата в един изглед.' }
      ],
      photoAlt: 'Панорама на София с катедралата „Св. Александър Невски“',
    },

    contact: {
      label: 'Контакти',
      title: 'Да поговорим за вашия проект.',
      lead: 'Разкажете ни накратко какво искате да подобрите. Не е нужно техническо задание — ще ви помогнем да го формулираме.',
      emailNote: 'Предпочитате имейл? Пишете ни на {email}',
      hintsTitle: 'Полезно е да споменете',
      hints: ['Коя задача отнема най-много време на екипа ви', 'С какви програми и системи работите днес', 'Кога ви трябва решението'],
      formTitle: 'Изпратете запитване',
      name: 'Име',
      email: 'Имейл',
      message: 'Съобщение',
      namePlaceholder: 'Вашето име',
      emailPlaceholder: 'ime@firma.bg',
      messagePlaceholder: 'С какво можем да помогнем?',
      privacyNote: 'Използваме данните само за да отговорим на запитването ви.'
    },

    form: {
      send: 'Изпрати запитването',
      sending: 'Изпращане…',
      success: 'Благодарим ви! Запитването е изпратено и ще се свържем с вас скоро.',
      error: 'Съобщението не беше изпратено. Моля, опитайте отново.',
      unavailable: 'Формулярът временно не е достъпен. Опитайте отново по-късно или ни пишете на support@velnovaragroup.eu.',
      rate: 'Твърде много опити за кратко време. Моля, опитайте отново след няколко минути.'
    },

    footer: {
      privacy: 'Поверителност и GDPR: Велновара Груп ЕООД обработва името, имейла и съобщението ви само за да отговори на запитването ви. Можете да поискате достъп, корекция или изтриване на данните си на {email}.',
      eik: 'ЕИК',
      vat: 'ДДС №',
    },

    legal: ['Политика за поверителност', 'Защита на данните (GDPR)'],
    backHome: 'Към началната страница',
    languageName: 'Превключи на български'
  },

  en: {
    nav: ['Home', 'Services', 'About', 'Contact'],
    mobile: { products: 'Products', shortcuts: 'Quick links' },
    navLabel: 'Main navigation',
    footerNavLabel: 'Footer navigation',
    legalNavLabel: 'Legal information',
    skip: 'Skip to content',
    menu: 'Menu',
    close: 'Close',
    home: 'Home',
    slogan: 'Building value, shaping the future',
    meta: {
      title: 'Velnovara Group — software, automation and AI solutions',
      description: 'Custom software, automation, AI solutions, SaaS platforms, API integrations and websites for businesses. Sofia, Bulgaria.'
    },

    hero: {
      title: ['Digital systems', 'and automation.'],
      lead: 'Velnovara Group works in automation, AI engineering and software development.',
      primary: 'Areas of work',
      secondary: 'Contact',
      cardsLabel: 'What we build',
      cards: [
        ['Automation', 'Processes that run without manual work'],
        ['AI solutions', 'Artificial intelligence in real workflows'],
        ['Platforms', 'Our own SaaS products'],
        ['Integrations', 'Connected systems and APIs']
      ]
    },

    services: {
      label: 'Services',
      title: 'What we can help with.',
      intro: 'Five areas, one approach: we start from the real problem in your work, not from the technology.',
      indexLabel: 'List of services',
      exampleLabel: 'For example',
      items: [
        {
          id: 'automation',
          title: 'Process automation',
          pitch: 'Stop typing the same data into several places.',
          body: 'We connect the steps that currently run through emails, spreadsheets and copy-paste.',
          features: ['Automatic approvals and notifications', 'Document and invoice processing', 'CRM workflows'],
          example: 'A new website enquiry automatically creates a CRM record and a task for your team — without retyping anything.'
        },
        {
          id: 'ai',
          title: 'AI solutions',
          pitch: 'Find answers in your own documents in seconds.',
          body: 'AI tools that work with your own data and always show their source.',
          features: ['Company document search', 'Data extraction and summaries', 'Assistants with human review'],
          example: 'An employee asks “What are the return terms for client X?” and gets an answer linked to the exact contract.'
        },
        {
          id: 'platforms',
          title: 'SaaS & web platforms',
          pitch: 'From idea to a working product with real users.',
          body: 'We start with the smallest useful version and grow it based on feedback.',
          features: ['SaaS products', 'Customer and partner portals', 'Internal systems'],
          example: 'Your customers submit requests and track their status in their own portal instead of calling about every change.'
        },
        {
          id: 'apis',
          title: 'API integrations',
          pitch: 'Your systems finally talk to each other.',
          body: 'Clear rules for which system leads — no duplicates, no lost data.',
          features: ['Third-party connections', 'Custom API development', 'Sync and error handling'],
          example: 'A change to a customer record in the CRM automatically reaches accounting and your online store.'
        },
        {
          id: 'websites',
          title: 'Websites',
          pitch: 'A website that presents your business and brings in enquiries.',
          body: 'Fast, clear websites with contact forms that actually reach you.',
          features: ['Company websites', 'Mobile and desktop design', 'Multilingual content'],
          example: 'A bilingual company website that explains your services clearly and leads visitors straight to an enquiry.'
        }
      ]
    },

    about: {
      label: 'About',
      title: 'About Velnovara Group.',
      body: [
        'Velnovara Group is a company based in Bulgaria. Its main focus is software and platform development, process automation and connecting digital systems.',
        'Velnovara Group focuses on system automation, AI engineering and software development. These areas involve processes, data, applications and the connections between them. Development considers the purpose of a system, user access and its ongoing maintenance.'
      ],
      productsTitle: 'Our products',
      products: [
        { name: 'OutboundFinder', tagline: 'Your next business opportunity', body: 'Finds potential business customers, sends email campaigns from your own connected mailbox and keeps every reply in one workspace.' },
        { name: 'Resido', tagline: 'Your online property manager, one click away', body: 'A platform for residential buildings: entrances, apartments, monthly fees and the day-to-day running of the building in one view.' }
      ],
      photoAlt: 'Sofia panorama featuring Saint Alexander Nevsky Cathedral',
    },

    contact: {
      label: 'Contact',
      title: 'Let’s talk about your project.',
      lead: 'Tell us briefly what you want to improve. No technical brief needed — we will help you shape it.',
      emailNote: 'Prefer email? Write to us at {email}',
      hintsTitle: 'Helpful to mention',
      hints: ['Which task takes up most of your team’s time', 'The software and systems you use today', 'When you need the solution in place'],
      formTitle: 'Send an enquiry',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      namePlaceholder: 'Your name',
      emailPlaceholder: 'you@company.com',
      messagePlaceholder: 'What can we help with?',
      privacyNote: 'We only use your details to reply to your enquiry.'
    },

    form: {
      send: 'Send enquiry',
      sending: 'Sending…',
      success: 'Thank you! Your enquiry has been sent and we will be in touch soon.',
      error: 'Your message was not sent. Please try again.',
      unavailable: 'The form is temporarily unavailable. Please try again later or email us at support@velnovaragroup.eu.',
      rate: 'Too many attempts in a short time. Please try again in a few minutes.'
    },

    footer: {
      privacy: 'Privacy and GDPR: Velnovara Group Ltd. processes your name, email address and message only to reply to your enquiry. You can request access to, correction or deletion of your data at {email}.',
      eik: 'UIC',
      vat: 'VAT No.',
    },

    legal: ['Privacy policy', 'Data protection (GDPR)'],
    backHome: 'Back to the homepage',
    languageName: 'Switch to English'
  }
};
