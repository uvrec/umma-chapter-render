/**
 * AuthorPage - Page displaying information about the author
 * Based on BBT reference app design, adapted to VedaVOICE amber/craft theme
 */

import { BookReaderHeader } from "@/components/BookReaderHeader";
import { useLanguage } from "@/contexts/LanguageContext";

interface AuthorPageProps {
  bookTitle: string;
  bookSlug: string;
  cantoNumber?: number;
}

// Author content in Ukrainian
const AUTHOR_CONTENT_UK = `Його Божественна Милість А.Ч. Бгактіведанта Свамі Прабгупада зʼявився в цьому світі 1896 року в Калькутті (Індія). Там у 1922 році він уперше зустрів свого духовного вчителя Бгактісіддганту Сарасваті Ґосвамі. Бгактісіддганті Сарасваті, видатному вченому в галузі релігії та засновнику шістдесяти чотирьох Ґаудія матхів (ведичних інститутів) сподобався освічений молодий чоловік, і ґуру одразу ж переконав Шрілу Прабгупаду присвятити своє життя справі поширення ведичного знання. Таким чином він став духовним учителем Шріли Прабгупади, який через одинадцять років отримав від Бгактісіддганти Сарасваті офіційне посвячення в учні.

Під час першої їхньої зустрічі Шріла Бгактісіддганта Сарасваті Тхакура попросив Шрілу Прабгупаду поширювати ведичне знання англійською мовою. У наступні роки Шріла Прабгупада багато допомагав у роботі Ґаудія матхів. Він також написав коментарі до «Бгаґавад-ґіти», а в 1944 році почав видавати англійською мовою часопис під назвою «Назад до Бога», що виходив двічі на місяць. Зараз журнал, яким опікуються його учні, виходить щомісяця більш ніж тридцятьма мовами.

У 1947 році Товариство Ґаудія-вайшнавів надало Шрілі Прабгупаді титул Бгактіведанта, у такий спосіб відзначивши його вченість та відданість Господу. У 1950 році в пʼятдесятичотирирічному віці Шріла Прабгупада відмовився від сімейного життя й обрав спосіб життя ванапрастхи, щоби повністю присвятити себе науковій та літературній праці. Шріла Прабгупада оселився у святому місті Вріндавані, де й жив у невибагливих умовах у знаменитому храмі Радга-Дамодари. Упродовж кількох років він був цілковито заглиблений у наукові та літературні заняття. У 1959 році він прийняв обітницю відречення (санньясу). Там, у храмі Радга-Дамодари, Шріла Прабгупада розпочав працювати над своїм шедевром – багатотомним перекладом «Шрімад-Бгаґаватам» («Бгаґавата Пурани»), що містить вісімнадцять тисяч віршів, а також над коментарями до неї. Там же він написав невеличку книжку «Легка подорож до інших планет».

У 1965 році, опублікувавши перші три томи «Шрімад-Бгаґаватам», Шріла Прабгупада їде до Сполучених Штатів, щоби здійснити місію, яку поклав на нього його духовний учитель. Упродовж наступних років він випустив понад шістдесят томів авторитетних перекладів, коментарів і оглядових нарисів творів індійської класики в галузі філософії та релігії.

У 1965 році, коли Шріла Прабгупада на вантажному судні прибув до Нью-Йорка, він фактично не мав жодних засобів до існування. Майже після року поневірянь, у липні 1966 року, він заснував Міжнародне товариство свідомості Крішни. До того часу як він 14 листопада 1977 року залишив цей світ, Товариство, яке він очолював, виросло до всесвітньої конфедерації, що складається з більш ніж ста храмів, ашрамів, шкіл, інститутів та сільськогосподарських громад.

Саме Шріла Прабгупада заснував у США першу експериментальну ведичну сільськогосподарську громаду. Успіх цієї громади надихнув його учнів на створення багатьох таких же комун у США та за їхніми межами.

У 1972 році заснуванням у Далласі ґурукули він ввів на Заході ведичну систему початкової та середньої освіти. Відтоді учні Шріли Прабгупади під його безпосереднім керівництвом відкрили дитячі школи-ґурукули у всьому світі, а головний центр освітньої системи ІСККОНу розміщено зараз у місті Вріндавані (Індія).

Шріла Прабгупада був також натхненником будівництва декількох великих міжнародних культурних центрів в Індії. Довкола центру в Шрідгамі Маяпурі, що в Західній Бенгалії, заплановано будівництво духовного міста; здійснення цього далекосяжного проекту триватиме десятки років. У Вріндавані збудовано величний храм Крішни-Баларами та готель для гостей з усього світу. ІСККОН також має культурні й освітні центри в Делі, Мумбаї (Бомбеї) та багатьох інших містах Індії.

Однак найбільш видатний здобуток Шріли Прабгупади – його книги. Високо ціновані в академічних колах за авторитетність, глибину й доступність викладу, книги ці стали зразковими загальновизнаними підручниками в численних навчальних закладах. Твори Шріли Прабгупади перекладено більш ніж вісімдесятьма мовами. Видавництво «Бгактіведанта бук траст», що було утворене в 1972 році задля публікації його книг, є найбільшим видавництвом, яке публікує праці з індійської філософії та релігії.

За дванадцять років, незважаючи на свій похилий вік, Шріла Прабгупада чотирнадцять разів обʼїхав навколо світу, читаючи лекції на пʼяти континентах. Така зайнятість не перешкоджала Шрілі Прабгупаді продовжувати свої плідні літературні заняття. Його твори є справжньою енциклопедією з ведичної філософії, релігії, літератури та культури.`;

// Author content in English
const AUTHOR_CONTENT_EN = `His Divine Grace A.C. Bhaktivedanta Swami Prabhupāda appeared in this world in 1896 in Calcutta, India. He first met his spiritual master, Śrīla Bhaktisiddhānta Sarasvatī Gosvāmī, in Calcutta in 1922. Bhaktisiddhānta Sarasvatī, a prominent religious scholar and the founder of sixty-four Gauḍīya Maṭhas (Vedic institutes), liked this educated young man and convinced him to dedicate his life to teaching Vedic knowledge. Śrīla Prabhupāda became his student, and eleven years later he became his formally initiated disciple.

At their first meeting, Śrīla Bhaktisiddhānta Sarasvatī Ṭhākura requested Śrīla Prabhupāda to broadcast Vedic knowledge through the English language. In the years that followed, Śrīla Prabhupāda wrote a commentary on the Bhagavad-gītā, assisted the Gauḍīya Maṭha in its work and, in 1944, started Back to Godhead, an English fortnightly magazine. Singlehandedly, Śrīla Prabhupāda edited it, typed the manuscripts, checked the galley proofs, and even distributed the individual copies. The magazine is now being continued by his disciples.

In 1950 Śrīla Prabhupāda retired from married life, adopting the vānaprastha (retired) order to devote more time to his studies and writing. He traveled to the holy city of Vṛndāvana, where he lived in humble circumstances in the historic temple of Rādhā-Dāmodara. There he engaged for several years in deep study and writing. He accepted the renounced order of life (sannyāsa) in 1959. At Rādhā-Dāmodara, Śrīla Prabhupāda began work on his life's masterpiece: a multivolume commentated translation of the eighteen-thousand-verse Śrīmad-Bhāgavatam (Bhāgavata Purāṇa). He also wrote Easy Journey to Other Planets.

After publishing three volumes of the Bhāgavatam, Śrīla Prabhupāda came to the United States, in September 1965, to fulfill the mission of his spiritual master. Subsequently, His Divine Grace wrote more than sixty volumes of authoritative commentated translations and summary studies of the philosophical and religious classics of India.

When he first arrived by freighter in New York City, Śrīla Prabhupāda was practically penniless. Only after almost a year of great difficulty did he establish the International Society for Krishna Consciousness, in July of 1966. Before he passed away on November 14, 1977, he had guided the Society and seen it grow to a worldwide confederation of more than one hundred āśramas, schools, temples, institutes, and farm communities.

In 1972, His Divine Grace introduced the Vedic system of primary and secondary education in the West by founding the gurukula school in Dallas, Texas. Since then his disciples have established similar schools throughout the world, with the main educational center now located in Vṛndāvana, India.

Śrīla Prabhupāda also inspired the construction of several large international cultural centers in India. The center at Śrīdhāma Māyāpura is the site for a planned spiritual city, an ambitious project for which construction will extend over many years to come. In Vṛndāvana are the magnificent Kṛṣṇa-Balarāma Temple and International Guesthouse, gurukula school, and Śrīla Prabhupāda Memorial and Museum.

Śrīla Prabhupāda's most significant contribution, however, is his books. Highly respected by scholars for their authority, depth, and clarity, they are used as textbooks in numerous college courses. His writings have been translated into over eighty languages. The Bhaktivedanta Book Trust, established in 1972 to publish the works of His Divine Grace, has thus become the world's largest publisher of books in the field of Indian religion and philosophy.

In just twelve years, despite his advanced age, Śrīla Prabhupāda circled the globe fourteen times on lecture tours that took him to six continents. Yet this vigorous schedule did not slow his prolific literary output. His writings constitute a veritable library of Vedic philosophy, religion, literature, and culture.`;

export const AuthorPage = ({
  bookTitle,
  bookSlug,
  cantoNumber,
}: AuthorPageProps) => {
  const { language, t } = useLanguage();

  const content = language === "uk" ? AUTHOR_CONTENT_UK : AUTHOR_CONTENT_EN;
  const paragraphs = content.split("\n\n").filter((p) => p.trim());

  return (
    <div className="min-h-screen bg-background">
      <BookReaderHeader
        bookTitle={bookTitle}
        bookSlug={bookSlug}
        cantoNumber={cantoNumber}
        introTitle={t("Про автора", "The Author")}
      />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1
          className="text-3xl font-bold text-center mb-8 text-foreground"
          style={{ fontFamily: "var(--font-primary)" }}
        >
          {t("Про автора", "The Author")}
        </h1>

        <article className="prose prose-lg max-w-none">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-foreground leading-relaxed mb-6 text-justify"
              style={{
                fontFamily: "var(--font-primary)",
                fontSize: "var(--vv-reader-font-size)",
                lineHeight: "var(--vv-reader-line-height)",
              }}
            >
              {paragraph}
            </p>
          ))}
        </article>
      </main>
    </div>
  );
};

export default AuthorPage;
