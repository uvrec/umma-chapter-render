// Centralized IDs and book configurations for imports
export const ImportIds = {
  lecturesBookId: "2c99d79a-5c20-4b02-ac86-00551c475379",
  lettersBookId: "4edac4c6-bcdf-413a-b444-6628ebfca892",
} as const;

export type ChapterLocator = {
  book_id: string;
  canto_id?: string | number;
  chapter_id?: string | number;
  verse_id?: string | number;
};

export type BookConfig = {
  title_ua: string;
  title_en: string;
  has_cantos: boolean;
  description_ua?: string;
  description_en?: string;
};

// Мапінг vedabase_slug → book info
export const BOOK_MAP: Record<string, BookConfig> = {
  'bg': {
    title_ua: 'Бгаґавад-ґіта як вона є',
    title_en: 'Bhagavad-gita As It Is',
    has_cantos: false,
    description_ua: 'Філософська розмова між Крішною та Арджуною на полі битви Курукшетра',
    description_en: 'A philosophical conversation between Krishna and Arjuna on the battlefield of Kurukshetra'
  },
  'sb': {
    title_ua: 'Шрімад-Бгаґаватам',
    title_en: 'Srimad-Bhagavatam',
    has_cantos: true,
    description_ua: 'Найголовніший та найдавніший пуранічний текст, також відомий як Бгаґавата Пурана',
    description_en: 'The most important and ancient Puranic text, also known as Bhagavata Purana'
  },
  'cc': {
    title_ua: 'Шрі Чайтанья-чарітамрита',
    title_en: 'Sri Caitanya-caritamrta',
    has_cantos: true,
    description_ua: 'Біографія Шрі Чайтаньї Махапрабгу',
    description_en: 'Biography of Sri Caitanya Mahaprabhu'
  },
  'iso': {
    title_ua: 'Шрі Ішопанішад',
    title_en: 'Sri Isopanisad',
    has_cantos: false,
    description_ua: 'Передмова до всього ведичного знання',
    description_en: 'The foremost of Vedic knowledge'
  },
  'noi': {
    title_ua: 'Нектар настанов',
    title_en: 'The Nectar of Instruction',
    has_cantos: false,
    description_ua: 'Одинадцять настанов Шріли Рупи Ґосвамі',
    description_en: 'Eleven instructions by Srila Rupa Gosvami'
  },
  'nod': {
    title_ua: 'Нектар відданості',
    title_en: 'The Nectar of Devotion',
    has_cantos: false,
    description_ua: 'Повний посібник з бгакті-йоґи',
    description_en: 'The complete science of bhakti-yoga'
  },
  'tlc': {
    title_ua: 'Вчення Господа Чайтаньї',
    title_en: 'Teachings of Lord Caitanya',
    has_cantos: false
  },
  'kb': {
    title_ua: 'Крішна',
    title_en: 'Krishna',
    has_cantos: false,
    description_ua: 'Книга про Крішну, Верховну Особистість Бога',
    description_en: 'The book about Krishna, the Supreme Personality of Godhead'
  }
};

// Canto titles для SB
export const SB_CANTO_TITLES: Record<number, { ua: string; en: string }> = {
  1: { ua: 'Перша Пісня: Творення', en: 'First Canto: Creation' },
  2: { ua: 'Друга Пісня: Космічний прояв', en: 'Second Canto: The Cosmic Manifestation' },
  3: { ua: 'Третя Пісня: Статус кво', en: 'Third Canto: The Status Quo' },
  4: { ua: 'Четверта Пісня: Творення Четвертого Порядку', en: 'Fourth Canto: The Creation of the Fourth Order' },
  5: { ua: 'П\'ята Пісня: Творчий імпульс', en: 'Fifth Canto: The Creative Impetus' },
  6: { ua: 'Шоста Пісня: Призначене Господом', en: 'Sixth Canto: Prescribed Duties for Mankind' },
  7: { ua: 'Сьома Пісня: Наука про Бога', en: 'Seventh Canto: The Science of God' },
  8: { ua: 'Восьма Пісня: Відхід Патріархів', en: 'Eighth Canto: Withdrawal of the Cosmic Creations' },
  9: { ua: 'Дев\'ята Пісня: Визволення', en: 'Ninth Canto: Liberation' },
  10: { ua: 'Десята Пісня: Підсумок краси', en: 'Tenth Canto: The Summum Bonum' },
  11: { ua: 'Одинадцята Пісня: Загальна історія', en: 'Eleventh Canto: General History' },
  12: { ua: 'Дванадцята Пісня: Епоха деградації', en: 'Twelfth Canto: The Age of Deterioration' }
};

// Canto titles для CC (lilas)
export const CC_LILA_TITLES: Record<number, { ua: string; en: string }> = {
  1: { ua: 'Аді-ліла', en: 'Adi-lila' },
  2: { ua: 'Мадг\'я-ліла', en: 'Madhya-lila' },
  3: { ua: 'Антья-ліла', en: 'Antya-lila' }
};
