import { company } from './content.mjs';

const updated = { bg: 'Последна актуализация: 11 ноември 2026 г.', en: 'Last updated: 11 November 2026' };
const contactLink = { bg: '<a href="/#contact">формата за контакт</a>', en: '<a href="/en/#contact">contact form</a>' };
const email = `<a href="mailto:${company.contactEmail}">${company.contactEmail}</a>`;
const phone = `<a href="tel:${company.contactPhone.replace(/\s/g, '')}">${company.contactPhone}</a>`;

const sections = {
  bg: {
    privacy: [
      ['Кои сме', `Администратор на личните данни е ${company.legalName.bg}, ЕИК ${company.eik}, със седалище и адрес на управление: ${company.address.bg}. Имейл: ${email}, телефон: ${phone}.`],
      ['Какви данни събираме и защо', 'Когато ни пишете чрез формата или по имейл, получаваме името, имейла и съобщението ви. Използваме ги само за да ви отговорим и, ако желаете, да подготвим предложение (чл. 6, пар. 1, б. „б“ от GDPR). За защита от спам доставчикът на формата може да обработва IP адреса ви (легитимен интерес от сигурен сайт, чл. 6, пар. 1, б. „е“). Предоставянето на данните е доброволно, но без тях не можем да ви отговорим.'],
      ['Кой има достъп до тях', 'Само ние и доставчиците, чрез които работи сайтът и пощата ни: GitHub (хостинг на сайта), Web3Forms (доставя съобщенията от формата), Google (Gmail) и Resend (изпращане на нашите отговори). Някои от тях обработват данни извън ЕИП въз основа на решение на Европейската комисия за адекватност или стандартни договорни клаузи. Не продаваме данни и не ги използваме за реклама.'],
      ['Колко дълго ги пазим', 'Докато са нужни за запитването или за последващ договор, а след това — само ако законът го изисква. Можете да поискате изтриването им по всяко време.'],
      ['Бисквитки', 'Сайтът не използва бисквитки и не проследява посещенията ви. Не вземаме автоматизирани решения и не извършваме профилиране.'],
      ['Вашите права', 'Имате право на достъп, корекция, изтриване, ограничаване и преносимост на данните си, както и да възразите срещу обработването им. Как да ги упражните, вижте на страницата <a href="/gdpr/">Защита на данните (GDPR)</a>.']
    ],
    gdpr: [
      ['Вашите права', 'Можете да поискате: достъп до данните, които пазим за вас; корекция на неточни данни; изтриване; ограничаване на обработването; копие на данните в преносим формат. Можете и да възразите срещу обработване на основание легитимен интерес.'],
      ['Как да подадете искане', `Пишете ни на ${email} или чрез ${contactLink.bg}, като посочите какво искате. Отговаряме в срок до един месец. Може да ви помолим само за информация, нужна, за да потвърдим самоличността ви.`],
      ['Жалба', 'Ако смятате, че правата ви са нарушени, можете да подадете жалба до <a href="https://cpdp.bg/">Комисията за защита на личните данни</a>.']
    ]
  },
  en: {
    privacy: [
      ['Who we are', `The data controller is ${company.legalName.en} (${company.legalName.bg}), UIC ${company.eik}, registered office: ${company.address.en}. Email: ${email}, phone: ${phone}.`],
      ['What we collect and why', 'When you write to us through the form or by email, we receive your name, email address and message. We use them only to reply and, if you wish, to prepare a proposal (GDPR Article 6(1)(b)). To prevent spam, the form provider may process your IP address (our legitimate interest in a secure website, Article 6(1)(f)). Providing your details is voluntary, but we cannot reply without them.'],
      ['Who can access it', 'Only us and the providers that run our website and email: GitHub (website hosting), Web3Forms (delivers the form messages), Google (Gmail) and Resend (sends our replies). Some of them process data outside the EEA under a European Commission adequacy decision or standard contractual clauses. We do not sell data or use it for advertising.'],
      ['How long we keep it', 'For as long as the enquiry or any resulting contract needs it, and after that only where the law requires. You can ask us to delete it at any time.'],
      ['Cookies', 'This website uses no cookies and does not track your visits. We make no automated decisions and do no profiling.'],
      ['Your rights', 'You have the right to access, correct, erase, restrict and port your data, and to object to its processing. See <a href="/en/gdpr/">Data protection (GDPR)</a> for how to use them.']
    ],
    gdpr: [
      ['Your rights', 'You can ask for: access to the data we hold about you; correction of inaccurate data; erasure; restriction of processing; a copy of your data in a portable format. You can also object to processing based on legitimate interest.'],
      ['How to make a request', `Email us at ${email} or use the ${contactLink.en}, saying what you would like. We reply within one month. We may ask only for the information needed to confirm your identity.`],
      ['Complaints', 'If you believe your rights have been breached, you can complain to the Bulgarian <a href="https://cpdp.bg/en/">Commission for Personal Data Protection</a>.']
    ]
  }
};

export const legalPage = (lang, page, title) =>
  `<article class="wrap legal-page"><p class="eyebrow">Velnovara Group</p><h1>${title}</h1><p class="legal-updated">${updated[lang]}</p>` +
  sections[lang][page].map(([heading, text]) => `<section><h2>${heading}</h2><p>${text}</p></section>`).join('') +
  `</article>`;
