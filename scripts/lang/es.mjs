// Spanish (Spain). Formal "usted", as is usual for business websites.
export default {
  nav: ['Inicio', 'Servicios', 'Nosotros', 'Contacto'],
  navLabel: 'Navegación principal',
  footerNavLabel: 'Navegación del pie de página',
  legalNavLabel: 'Información legal',
  skip: 'Ir al contenido',
  menu: 'Menú',
  close: 'Cerrar',
  home: 'Inicio',
  slogan: 'Creamos valor, construimos futuro',
  meta: {
    title: 'Velnovara Group — software, automatización y soluciones de IA',
    description: 'Software a medida, automatización, soluciones de IA, plataformas SaaS, integraciones API y sitios web para empresas. Sofía, Bulgaria.'
  },

  hero: {
    title: ['Sistemas digitales', 'y automatización.'],
    lead: 'Velnovara Group trabaja en automatización, ingeniería de IA y desarrollo de software.',
    primary: 'Áreas de trabajo',
    secondary: 'Contacto',
    cardsLabel: 'Lo que construimos',
    cards: [
      ['Automatización', 'Procesos que funcionan sin trabajo manual'],
      ['Soluciones de IA', 'Inteligencia artificial en procesos de trabajo reales'],
      ['Plataformas', 'Productos SaaS propios'],
      ['Integraciones', 'Sistemas conectados y API']
    ]
  },

  services: {
    label: 'Servicios',
    title: 'En qué podemos ayudarle.',
    intro: 'Cinco áreas, un mismo enfoque: partimos del problema real de su trabajo, no de la tecnología.',
    indexLabel: 'Lista de servicios',
    items: [
      {
        id: 'automation',
        title: 'Automatización de procesos',
        pitch: 'Deje de introducir los mismos datos en varios sitios.',
        body: 'Conectamos los pasos que hoy pasan por correos electrónicos, hojas de cálculo y copiar y pegar.',
        features: ['Aprobaciones y avisos automáticos', 'Procesamiento de documentos y facturas', 'Flujos de trabajo en el CRM']
      },
      {
        id: 'ai',
        title: 'Soluciones de IA',
        pitch: 'Encuentre respuestas en sus propios documentos en segundos.',
        body: 'Herramientas de IA que trabajan con sus datos y siempre muestran su fuente.',
        features: ['Búsqueda en documentos de la empresa', 'Extracción y resumen de datos', 'Asistentes con revisión humana']
      },
      {
        id: 'platforms',
        title: 'Plataformas SaaS y web',
        pitch: 'De la idea a un producto que funciona, con usuarios reales.',
        body: 'Empezamos por la versión útil más pequeña y la desarrollamos según los comentarios de los usuarios.',
        features: ['Productos SaaS', 'Portales para clientes y socios', 'Sistemas internos']
      },
      {
        id: 'apis',
        title: 'Integraciones API',
        pitch: 'Por fin, sus sistemas se comunican entre sí.',
        body: 'Reglas claras sobre qué sistema es el principal: sin duplicados ni datos perdidos.',
        features: ['Conexión con servicios externos', 'Desarrollo de API propias', 'Sincronización y gestión de errores']
      },
      {
        id: 'websites',
        title: 'Sitios web',
        pitch: 'Una web que presenta su empresa y le trae consultas.',
        body: 'Sitios rápidos y claros, con formularios de contacto que de verdad le llegan.',
        features: ['Webs corporativas', 'Diseño para móvil y ordenador', 'Contenido multilingüe']
      }
    ]
  },

  about: {
    label: 'Nosotros',
    title: 'Sobre Velnovara Group.',
    body: [
      'Velnovara Group es una empresa con sede en Bulgaria. Se centra principalmente en el desarrollo de software y plataformas, la automatización de procesos y la conexión de sistemas digitales.',
      'Velnovara Group se dedica a la automatización de sistemas, la ingeniería de IA y el desarrollo de software. Estas áreas abarcan procesos, datos, aplicaciones y las conexiones entre ellos. En el desarrollo se tienen en cuenta la finalidad del sistema, el acceso de los usuarios y su mantenimiento.'
    ],
    productsTitle: 'Nuestros productos',
    products: [
      { name: 'OutboundFinder', tagline: 'Su próxima oportunidad de negocio', body: 'Encuentra posibles clientes empresariales, envía campañas de correo desde su propio buzón conectado y reúne todas las respuestas en un solo espacio de trabajo.' },
      { name: 'Resido', tagline: 'Su administrador de fincas en línea, a un clic', body: 'Una plataforma para edificios residenciales: portales, viviendas, cuotas mensuales y toda la gestión del edificio en una sola vista.' }
    ],
    photoAlt: 'Panorámica de Sofía con la catedral de Alejandro Nevski'
  },

  contact: {
    label: 'Contacto',
    title: 'Hablemos de su proyecto.',
    lead: 'Cuéntenos brevemente qué quiere mejorar. No hace falta un documento técnico: le ayudaremos a definirlo.',
    emailNote: '¿Prefiere el correo electrónico? Escríbanos a {email}',
    hintsTitle: 'Conviene mencionar',
    hints: ['Qué tarea le quita más tiempo a su equipo', 'Qué programas y sistemas usa hoy', 'Para cuándo necesita la solución'],
    formTitle: 'Enviar una consulta',
    name: 'Nombre',
    email: 'Correo electrónico',
    message: 'Mensaje',
    namePlaceholder: 'Su nombre',
    emailPlaceholder: 'nombre@empresa.es',
    messagePlaceholder: '¿En qué podemos ayudarle?',
    privacyNote: 'Solo usamos sus datos para responder a su consulta.'
  },

  form: {
    send: 'Enviar consulta',
    sending: 'Enviando…',
    success: '¡Gracias! Su consulta se ha enviado y nos pondremos en contacto con usted pronto.',
    error: 'El mensaje no se ha enviado. Inténtelo de nuevo.',
    unavailable: 'El formulario no está disponible en este momento. Inténtelo más tarde o escríbanos a {email}.',
    rate: 'Demasiados intentos en poco tiempo. Inténtelo de nuevo dentro de unos minutos.'
  },

  footer: {
    privacy: 'Privacidad y RGPD: Velnovara Group Ltd. trata su nombre, su correo electrónico y su mensaje únicamente para responder a su consulta. Puede solicitar el acceso, la rectificación o la supresión de sus datos en {email}.',
    eik: 'UIC',
    vat: 'NIF-IVA'
  },

  legal: ['Política de privacidad', 'Protección de datos (RGPD)'],
  backHome: 'Volver al inicio',
  langName: 'Español',
  languageMenu: 'Idioma'
};
