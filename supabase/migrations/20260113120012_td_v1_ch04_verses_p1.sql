-- ============================================
-- TD Volume 1, Chapter 4 - Verses
-- ============================================

DO $$
DECLARE
  v_book_id uuid;
  v_canto_id uuid;
  v_chapter_id uuid;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = 'td';
  SELECT id INTO v_canto_id FROM public.cantos WHERE book_id = v_book_id AND canto_number = 1;
  SELECT id INTO v_chapter_id FROM public.chapters WHERE canto_id = v_canto_id AND chapter_number = 4;


  -- December 16th, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'December 16th, 1975',
    '', '', '', '',
    '', '', '', '',
    E'<p>Delhi airport was filled with its usual bustle, and while Hansadūta and Harikeśa dealt with the baggage and other formalities, Śrīla Prabhupāda sat calmly in the boarding area. As he waited, a friendly Bengali gentleman, Mr. Chaudhuri, talked with him for some time. It pleased Prabhupāda to discover that the man worked in the West Bengal Department of Development and Planning.</p>

<p>Mr. Chaudhuri spoke enthusiastically and appreciatively about Śrīla Prabhupāda’s worldwide missionary work. He offered to help in any way he could, so Prabhupāda wrote down his name and address.</p>

<p>At 6 a.m. the party, along with the Ph.D. candidate, flew out.</p>

<p>I booked myself on the next flight out at 10:00 a.m. I had a little money saved, just enough for the fare, and by midday I too was in Bombay.</p>

<p><strong>Hare K</strong>ṛ<strong>ṣṇa Land</strong></p>

<p><strong>Juhu Beach, Bombay</strong></p>

<p>Hare Kṛṣṇa Land at Juhu Beach is only about half an hour drive from the airport—six rupees by taxi. The site is very impressive. Situated in the heart of exclusive Juhu, only a minute from the beach, it covers more than four acres, with half a dozen three-storied apartment buildings spaciously dotted among the many swaying palm trees.</p>

<p>It surprised me to find that the “temple,” at the front of the land, is merely a simple shelter—a small brick Deity room and a <em>darśana</em> area barely large enough to hold fifty people. It is completely open on three sides, covered with a flimsy tin roof balanced on thin iron poles.</p>

<p>Nevertheless, the worshipable Deities Śrī Śrī Rādhā-Rāsabihārī are beautifully dressed and meticulously cared for, despite the inadequate facilities.</p>

<p>I am surprised to discover that nondevotees occupy many apartments on our property, several of them even meat-eaters. When Śrīla Prabhupāda obtained the land, six occupied buildings were already there, and according to Indian law their tenancies can’t be terminated. Devotees are gradually using those few flats vacated by former tenants.</p>

<p>Śrīla Prabhupāda has arranged to have the third floor built on the top of each building to provide living quarters for his disciples. That work has just been completed, and the foundation is now being laid for the new temple complex. Some used materials left over from the Vṛndāvana temple construction have being trucked in.</p>

<p>A devotee directed me to Śrīla Prabhupāda’s quarters in a building at the back of the land. After climbing several flights of steep steps to the top floor, I entered the open reception room door at the same moment His Divine Grace entered from the other side. He had just taken his massage.</p>

<p>“Oh, so you are here!” he said in mild surprise as I offered my obeisances. “All right, very good!” he remarked, disappearing into the bathroom.</p>

<p>Nitāi appeared next; he had just given Prabhupāda his massage. “Oh, you’re here! Okay, I don’t mind. I’d rather develop the <em>gurukula</em> in Vṛndāvana anyway.”</p>

<p>Then Harikeśa came in, also surprised to see me. I found out later that when my ticket was handed over to Mr. Singh, everyone had considered my tenure with the party at an end. They assumed that Nitāi would rejoin the party as Prabhupāda’s servant. Apparently I was the only one who had not realized it.</p>

<p>But Prabhupāda was pleased that I came. He sent me to find Girirāja, the temple president, and instructed him to repay me the full cost of my airfare. He advised me that I should keep my own money for emergency uses.</p>

<p class="verse">* * *</p>

<p>Yesterday Prabhupāda gave Hansadūta permission to buy a bus and start a traveling <em>saṅkīrtana</em> party in India. He suggested that they carry Śrī Śrī Gaura-Nitāi in a box. Then wherever they stop, they should take Their Lordships out, sit under a tree, and hold <em>kīrtana</em>. Prabhupāda assured him that many people would come. Afterwards <em>prasādam</em> could be distributed and a discourse held.</p>

<p>“Do it immediately!” Prabhupāda told him enthusiastically. He went on to explain that he had planned to do this, “But somehow I came to the West; it was Kṛṣṇa’s arrangement. Now the Americans are doing.”</p>

<p>Hansadūta thus busied himself today investigating prices both here and in Europe for a suitable vehicle.</p>', '', '1975-12-16', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- December 17th, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'December 17th, 1975',
    '', '', '', '',
    '', '', '', '',
    E'<p>It was a little chilly this morning, and while getting ready for the morning walk Prabhupāda noticed that I was shivering. I was wearing only a <em>kurtā</em>. He called me into his room and gave me a lightly embroidered <em>chaddar</em>. It had been given to him in Delhi, and he had worn it a few times. I was surprised. It was indeed a special honor. His Divine Grace’s thoughtfulness and concern are completely endearing.</p>

<p>Harikeśa was also surprised, or perhaps shocked would be more apt, when he saw it draped around my shoulders. He asked me, “Why are you wearing Prabhupāda’s <em>chaddar</em>?”</p>

<p>“I didn’t have anything warm to wear so Prabhupāda gave it to me,” I explained.</p>

<p>In an admonishing tone he said, “There’s a standing rule that the servants should never ask the spiritual master for anything.”</p>

<p>But when I told him that Prabhupāda had just given it to me without my saying anything, he immediately softened, appreciating Śrīla Prabhupāda’s kindness. I value his good advice nonetheless. Harikeśa prabhu is excellent association for me because of his complete dedication to pleasing Śrīla Prabhupāda.</p>

<p class="verse">* * *</p>

<p>Prabhupāda takes his walks along a beach only half a mile from the temple. He leaves at six-thirty and returns an hour later for Deity <em>darśana</em>.</p>

<p>Dr. Patel usually meets him on the beach. He’s short, stocky, and always barefoot. With his raucous laugh Dr. Patel seems terribly full of himself; nevertheless, he has developed an attraction for Prabhupāda’s association.</p>

<p>He obviously holds Prabhupāda in great respect, although it isn’t always the humble and submissive sort that the devotees cultivate. He knows some Sanskrit and has studied Prabhupāda’s <em>Bhāgavatam</em>; this makes for lively conversation on both topical and philosophical matters. Dr. Patel is known among the devotees for expressing strong, and generally tainted, opinions, although he cushions them with good humor, ultimately agreeing with Śrīla Prabhupāda’s pure and unbiased spiritual vision.</p>

<p>This morning they talked briefly about human civilization. Dr. Patel blamed the spoiling of modern civilization on the atheistic communist philosophers: Marx, Hegel, and Engels.</p>

<p>Śrīla Prabhupāda didn’t agree. “Everyone is manufacturing his own ideas,” he said, “including Indian leaders like Mohandas Gandhi and others. But if people take to the movement of Śrī Caitanya Mahāprabhu, the country will change for the better overnight.”</p>

<p>As our small group walked along, the Arabian Sea’s waves mildly lapped at our feet. By seven o’clock hundreds of people were walking and exercising up and down the flat sandy shore. Occasional sounds of jets boomed overhead as planes arrived and departed from the nearby Santa Cruz airport. Various vendors gradually set up along the hotel fronts, selling <em>dabs</em> (green coconuts), tea, <em>bidis, </em>and the like.</p>

<p>Several gentlemen came forward to offer their <em>praṇāmas</em> to Prabhupāda. He responded with, “Hare Kṛṣṇa! <em>Jaya!</em>”</p>

<p>Dr. Patel introduced one such admirer as a renowned poet from Dvārakā. His name was Bethai, meaning “coming from the Dvārakā-<em>bet</em>.” Dr. Patel mentioned that Mr. Bethai only wrote poems about God.</p>

<p>Prabhupāda good-naturedly quoted a Bengali poem that wherever one finds himself he should neither perform religious acts nor sinful ones; he should simply always remember the lotus feet of Kṛṣṇa.</p>

<p>This prompted Dr. Patel to voice a complaint about how our <em>pūjārīs</em> dress the temple Deities. “Sir, lotus feet. These people are actually putting such a long <em>varga</em> [dress]. I am trying to see the lotus feet of God here, <em>arcā-vigraha</em>. Well, I am unable. Instruct them to put up the <em>varga</em> a little, so that we can have <em>darśana</em> of His sacred feet. Please tell them. Too long <em>vargas</em>, you simply can’t see anything.”</p>

<p>Girirāja patiently explained that the Deities’ feet can always be seen throughout the day; but when They wear Their night clothes, Their feet are not visible. Since Dr. Patel only comes early in the morning, while the Deities are in still in Their night outfit, he never gets to see Kṛṣṇa’s feet.</p>

<p>There seems to be a mild acrimony in Dr. Patel’s dealings with the devotees. He behaves as if he ought to be given some special entitlement by us as a learned and elderly person, and he tries to play off his relationship with Śrīla Prabhupāda to extract some special attention.</p>

<p>At any rate, in this instance, Prabhupāda didn’t take the matter too seriously. His mind was working in a different way. Whether the Lord’s feet were visible or not, he was content that after the long hard struggle to establish the temple on Hare Kṛṣṇa Land, Their Lordships were still with us. Prabhupāda’s response to Dr. Patel’s complaint was thus full of gratitude and appreciation. “How He [Kṛṣṇa] sat tight to call everyone to come and see? Hm? The municipality came to drive Him away!”</p>

<p>For several years Prabhupāda has fought on Śrī Śrī Rādhā-Rāsabihārī’s behalf. The previous owner tried to cheat Prabhupāda of the land, while the municipality had presented severe objections to establishing a temple. At one time they had even half-demolished the Deities’ temporary shelter. They burned the roof support poles with oxyacetylene torches and carried the protesting devotees off in a police truck. They even went so far as to begin ripping off the Deity room’s roof with Śrī Śrī Rādhā-Rāsabihārī still inside! Only a last second intervention by a few favorable people in local government prevented the total destruction.</p>

<p>Returning to the temple we observed the regular program of greeting Their Lordships, <em>guru-pūjā</em>, and class. Then Prabhupāda retired to his quarters for the day.</p>

<p class="verse">* * *</p>

<p>During mail time, as Prabhupāda relaxed up on the roof, he dictated a letter to Jayapatāka Swami in Māyāpur. He enclosed an introductory letter for him to meet Mr. Chaudhuri, the gentleman we met at the airport yesterday. Seeing that meeting as Kṛṣṇa’s arrangement, Prabhupāda requested Jayapatāka to visit him personally with <em>prasādam</em> and flowers and to invite him to Māyāpur. He wants Jayapatākā to try to enlist his help in getting the government to acquire land for our ISKCON Māyāpur development scheme. He also suggested Mr. Chaudhuri might be able to help Jayapatāka Mahārāja, an American, with his application for Indian citizenship.</p>

<p>A letter from Mahāàsa Swami included a progress report on Hyderabad, where another new temple is steadily being built. Work has already begun on raising the dome. The project is costing 75,000 rupees per month, which the devotees are collecting throughout South India. Mahāàsa also reported four small books—<em>Śrī Īśopaniṣad</em>, <em>Rājavidyā</em>, <em>Perfection of Yoga </em>and <em>Matchless Gifts</em>—have been translated into Telegu.</p>

<p>Śrīla Prabhupāda was most happy to hear about a small bullock cart traveling <em>saṅkīrtana</em> party. Mahāàsa wrote, “The bullock cart party (only three devotees) were very successful on their second attempt. They collected lots of rice, distributed prasadam and small literatures, evening programs, and sleeping under a different tree everyday. They are thrilled and so enthusiastic. They love this kind of preaching work. Now I am giving them a portable sound system and more equipment and one more devotee and sending them immediately to a massive voyage on bullock cart all the way to the Mayapur festival!”</p>

<p>Prabhupāda replied enthusiastically, “Naturally the sankirtana men traveling with the bullock carts are blissful. It is Lord Caitanya’s engagement. Lord Caitanya personally traveled all over India for six years. His program was simply kirtana and prasadam distribution. Lord Caitanya never spoke philosophy in public. When He met big scholars like Sarvabhauma Bhattacarya he spoke philosophy, otherwise for the mass of people, kirtana and prasadam distribution. So continue this program, it is very pleasing to Lord Caitanya.”</p>

<p>Prabhupāda also received a long letter from Svarūpa Dāmodara dāsa, who holds a Ph.D. in organic chemistry. Svarūpa Dāmodara listed seven major contradictions between the statements of modern astronomers and the <em>Bhāgavatam</em>. He wants to present a clear and direct challenge to modern scientists, but because the <em>Bhāgavatam</em> statements are so brief, he asked for further information on Vedic astronomy. He especially asked about the distances to the sun and moon.</p>

<p>He also presented a comparative chart about the days of the week. He wrote, “According to Encyclopedia Americana, the system of the days of the week, based on the seven planets and their ruling demigods, originated in Europe near the beginning of the Christian era. However, from the Bhagavatam we know that this cannot be true. It has been since the time of the Vedas.” His chart revealed this clearly.</p>

<p>The seriousness of his disciple’s approach to this problem pleased Prabhupāda. He replied, “This scientific book should be done very carefully, so that people in general may not be misled by the over-intelligent scientists. There are so many contradictory things, but we have our authority and they have their authority. Our knowledge is from Vedic scriptures, which we accept as definite and without any mistake. A modern scientist believes that there was no civilization before three thousand years. Our Bhagavatam was spoken by Sukadeva Gosvami five thousand years ago, and he is explaining as I have heard it from authority. So we have got parampara system for millions of years. If there was no civilization before three thousand years, then how this subject matter of knowledge could be discussed? How could it be received through parampara system? So there is contradiction certainly. But the statement that there was no civilization three thousand years ago can be adjusted by the conviction that there was civilization millions and millions of years ago.”</p>

<p>Prabhupāda advised Svarūpa Dāmodara to consult “any learned astronomer” for astronomical information. In particular he mentioned that Śrīla Bhaktisiddhānta Sarasvatī had been extremely learned in that field.</p>

<p>“The main point,” he stressed, “is to prove that life comes from life and not from matter. If we prove this one principle, so many other issues can be brought forward for serious consideration. The scientists’ knowledge is imperfect and therefore always changing, but Vedic knowledge is perfect and never changeable.”</p>

<p>Prabhupāda mentioned the example in the <em>Vedas </em>of the <em>agni-pok</em> germ. It lives within fire, even though scientists say life cannot exist there. He said, “There are so many contradictions, but we have our own defense. Why should we blindly accept imperfect scientists? The word ‘progress’ is used when there is imperfection in the beginning. So this regular changing of standard of knowledge in the name of progress proves that they are always imperfect. It is a fact they are imperfect because they gather knowledge with imperfect senses. At any rate, we cannot deviate from Vedic knowledge.”</p>

<p>Prabhupāda ended his letter requesting him to come to the Māyāpur festival because afterwards he hopes to visit Manipur, Svarūpa Dāmodara’s birthplace.</p>

<p>There was also news from a Gujarati devotee, Jaśomatīnandana, who has been in Ahmedabad for the past few days organizing a new ISKCON center. He has arranged for Śrīla Prabhupāda to lecture at programs in several nearby villages and towns. The King of Sanand has even invited Prabhupāda to stay in the palace. The Yuvrāj, the king’s son who recently became a Life Patron, plans to host Prabhupāda and up to twelve devotees with a big parade when he arrives.</p>

<p>Prabhupāda approved, and is scheduled to fly to Ahmedabad on the morning of December 25th.</p>

<p class="verse">* * *</p>

<p>In the evening Prabhupāda had an engagement at the home of Mrs. Gopi Kumara Birla and her son, Ashoka. She had invited friends from many of the leading business families in Bombay. The Birlas are possibly the richest, and one of the most influential, families in India. Girirāja had previously suggested to her several possible topics for the evening’s discussion, and she has chosen “How to Become Successful in Life.”</p>

<p>The Birlas had set up an <em>āsana</em> on a side lawn of their large, opulent estate. Next to it, on a table, the devotees placed a shrine with small brass Rādhā-Kṛṣṇa Deities.</p>

<p>Śrīla Prabhupāda arrived in the Birla’s white Mercedes. He immediately noticed that his seat was placed higher than that of the Deities. So he had the devotees remove the base of the <em>āsana</em>, making his seat lower.</p>

<p>Then, above the muted clamor of Bombay’s evening traffic, Prabhupāda addressed his attentive audience on the evening’s topic. “Rādhārāṇī and Durgā, both of them are the <em>prakṛtis</em> of the Supreme Personality of Godhead, but one <em>prakṛti</em> is meant for controlling this material world and the other <em>prakṛti</em> is meant for blessing the spiritual world.</p>

<p>“Rādhārāṇī, the name has come from the word <em>ārādhyate</em>. <em>Arādha</em> means worshiping, beginning from Rādhārāṇī and her expansion Lakṣmī in Vaikuṇṭha. Here we worship Mother Lakṣmījī, the goddess of fortune, to receive some favor, but in the Vaikuṇṭha world there are many hundreds of thousands of Lakṣmīs, and with great respect they are engaged in serving the Supreme Lord.</p>

<p>“So, we being expansions of the spiritual Lakṣmī, or Rādhārāṇī, our duty is to serve Rādhārāṇī, and through Rādhārāṇī serve Kṛṣṇa. This is Kṛṣṇa consciousness movement. We are missing this point. That instead of learning from Rādhārāṇī how to serve Kṛṣṇa, we are being controlled by the other <em>prakṛti</em>, material energy, Durgā, with weapons in her ten hands. This is our position.”</p>

<p>Prabhupāda possesses a unique ability to link anyone from any walk of life to the common goal of spiritual attainment. His preaching is always perfectly suitable for the time, place and circumstance. To the leaders of this wealthy business community he thus offered a pertinent example.</p>

<p>“In this material world they do not know what is the aim of life. Everyone is very much expert to see his interest. Two businessmen, they are agreeing; but everyone is trying to see his personal interest first. This is called <em>svārtha-gatià</em>. That is natural. But Prahlāda Mahārāja says, <em>na te viduḥ svārtha-gatià hi viṣṇuà</em>. Unfortunately, these materialistic persons they do not know what is real interest. The real interest is Viṣṇu, how to serve Viṣṇu.”</p>

<p>Prabhupāda came directly to the keynote of his address. “The subject matter was how to become successful in life. Kṛṣṇa comes to instruct this simple truth—that you are being controlled by the material energy. You give up this business, you be controlled by the spiritual energy, and your life is successful. Śrī Caitanya Mahāprabhu has said <em>jīvera ‘svarūpa’ haya—kṛṣṇera ‘nitya-dāsa’</em>. But our disease is, instead of becoming <em>dāsa</em> we are trying to become the master of the <em>prakṛti</em>. This is called the materialistic way of life. So that will not make us happy at any stage of our life. The success of the human form of life is to understand this: our relationship with God. And we should act in relationship with God. Then our success of life will be achieved. This is the main purpose of Kṛṣṇa consciousness movement.”</p>

<p>The Birla family have become equally famous for both their religious interests and business ventures, with Birla temples prominent in most Indian major cities. Śrīla Prabhupāda took the evening’s opportunity to invite the family to expand from the merely religious to practicing a full transcendental life. “That is Śrī Caitanya Mahāprabhu’s mission,” he said. “He wished especially Indians to take this job of preaching the teachings of <em>Bhagavad-gītā</em> all over the world. The mission is they must be very, very merciful to all outsiders. That is India’s mission. They are in darkness, <em>tamasi</em>, bring them in the light: <em>tamasī mā jyotir gamaḥ</em>. This attempt has been done by us individually with teeny effort but it is becoming successful. But every one of us should become completely aware of this Movement and take this mission.”</p>

<p>Śrīla Prabhupāda’s speech was direct and frank. “Kṛṣṇa said, ‘You just offer a little flower and water to Me.’ If you think that, ‘We have got money, the money is for my enjoyment, and Kṛṣṇa may be offered a little water and flower,’ that is cheating. That is not good. According to your position you must worship. This is wanted. To become very big businessman is not ordinary thing; it requires <em>tapasya</em>, very great labor, brain, <em>yat tapasyasi</em>. But the result, Kṛṣṇa says, <em>kuruṣva mad-arpaṇam</em>. He’s asking, ‘Give it to Me.’ So there is no harm to become very big businessman, earning money. That is all right. But you give it to Kṛṣṇa. Then in any position you can remain Kṛṣṇa conscious. And if you remain Kṛṣṇa conscious, then you will understand Kṛṣṇa.”</p>

<p>Winding up his lecture, Prabhupāda asked for questions several times, but got no response.</p>

<p>Girirāja, whose lawyer father had once offered him a million dollars to give up Kṛṣṇa Consciousness, spoke up. “The process of hearing and then asking questions is the way to clarify our understanding, just like Kṛṣṇa and Arjuna. So actually we must have some questions in our minds, otherwise we would all immediately surrender to Kṛṣṇa.”</p>

<p>Prabhupāda agreed, “Yes, either you surrender to Kṛṣṇa, or clear it by question.”</p>

<p>Still, there was no response. So the lecture ended, and while other devotees showed a film on the lawn, Śrīla Prabhupāda and a small group of us were invited inside to take <em>prasādam</em>.</p>

<p>Ashoka Birla, who had donated three <em>lakhs </em>of rupees for construction of the ISKCON Vṛndāvana center, expressed his happiness at the evening’s program. Then Mrs. Birla and her brother-in-law, Brijratan Mohta, led us upstairs in the lift to a large and beautifully furnished dining room.</p>

<p>Sitting at the head of a long and highly polished mahogany table, Śrīla Prabhupāda chatted congenially with his hosts, complimenting them on the delicious meal and answering a variety of questions.</p>

<p>After a cordial departure, we finally arrived back at the temple by eleven o’clock. It was a successful preaching engagement, but on the way back Prabhupāda mentioned to Girirāja, “That no questions were asked after the lecture indicated a lack of interest on the part of the guests.”</p>', '', '1975-12-17', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- December 18th, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'December 18th, 1975',
    '', '', '', '',
    '', '', '', '',
    E'<p>Kīrtanānanda Swami, one of Śrīla Prabhupāda’s first disciples and a GBC member, arrived very early this morning from America. He gave a brief report on New Vrindaban, our ISKCON farm community in West Virginia. He distributed some delicious <em>mahā-prasādam</em> from Śrī Śrī Rādhā-Vṛndāvanacandra.</p>

<p>Prabhupāda asked about Kīrtanānanda’s health, and Mahārāja explained that he has been suffering due to some paralysis in his left arm. Prabhupāda didn’t register much concern, telling him not to worry. He said we should expect the body to give us trouble. We must simply take shelter of the holy names of the Lord.</p>

<p>Kīrtanānanda Mahārāja inquired with some concern how he can improve his ability to remember Sanskrit verses. Prabhupāda almost chided him for asking. He said that because he is a devotee, as long as he speaks the philosophy and chants Hare Kṛṣṇa, these other things are not of such great concern.</p>

<p>Kīrtanānanda Mahārāja has come via New York, and his report on the management of the new temple building there was not encouraging. He said that the project lacked a strong leader and that the financial situation was difficult. Prabhupāda immediately suggested that Madhudviṣa Swami, the GBC for Australia, could go and take charge. Coincidentally, this morning Prabhupāda received a telegram from Madhudviṣa inviting him to the Melbourne Ratha-yātrā on January 10th, 1976.</p>

<p class="verse">* * *</p>

<p>During this morning’s walk, with Dr. Patel accompanying us, Śrīla Prabhupāda considerably broadened our perspectives by explaining the real standard of education and its relationship to culture. To describe an educated man he quoted Cāṇakya Paṇḍita, “<em>Mātṛvat para-dāreṣu:</em> he sees every woman as mother, except his own wife. And <em>para-dravyeṣu loṣṭavat:</em> and other’s property, possessions, just like garbage. And <em>ātmavat sarva-bhūteṣu:</em> and feeling for everyone as he himself is feeling the pains and pleasures. If one has attained this stage, then he is considered educated.”</p>

<p>Progressing along the soft sands in the pleasant cool of the new dawn, Prabhupāda strongly emphasized that real education is to become <em>upādhi</em>-less (free from material designations). With his razor-sharp intelligence, so finely honed on the strap of Vedic knowledge and insight, Prabhupāda exposed the leaders of the world as devoid of true education. He quickly chopped down to size two popular Indian politicians often held in high regard by the masses.</p>

<p>“What is education?” he challenged. “<em>Bhagavad-gītā</em> says you are not this body. That is the beginning of education. Now education means be nationalist, and drive away and bark. Even in our country, Mahātmā Gandhi was also infected, ‘Quit India! Quit India!’”</p>

<p>“He did not mean quit India,” Dr. Patel offered. “He meant you quit your matter of ruling. I mean actually...”</p>

<p>But Prabhupāda insisted, “It was his exact word, ‘Quit India!’ As soon as you think ‘You are my enemy, he is my friend,’ then there is no education, that’s all. This is standard of education: <em>Sama-darśinaḥ</em>. Kṛṣṇa says, ‘Arjuna, you are rascal. It is not the business of the <em>paṇḍita</em> to think like that!’ He never thought that the Kauravas were the enemy, no. That is not the fact. It is duty to fight the just cause. That was His instruction.”</p>

<p>“Mr. Nehru said Kṛṣṇa was the greatest warmonger,” Dr. Patel said.</p>

<p>“And he is a rascal,” Prabhupāda retorted.</p>

<p>Dr. Patel laughed. “He was saying so. He thought himself to be a very big man.”</p>

<p>“That is āsuric position,” Prabhupāda said. “‘Who is like me?’ And <em>bhakta</em>, Caitanya Mahāprabhu is teaching: <em>tṛṇād api sunīcena taror api sahiṣṇunā</em>—this is education. Therefore Kṛṣṇa has spoken of these people as <em>mūḍha</em>. ‘No, they have credit, they have passed so many examination.’ <em>Māyayāpahṛta-jṣānā</em>. This kind of education has no value because they are forgetting the real point of education.”</p>

<p>The conversation went on with Śrīla Prabhupāda criticizing the <em>sāṅkhya</em> philosophers who believe that creation comes about by chance.</p>

<p>Dr. Patel questioned, “But sir, this <em>sāṅkhya</em> philosophy also believes in <em>Vedas</em>.”</p>

<p>“No, no,” Prabhupāda corrected. “<em>Sāṅkhya</em> philosophy by the original Kapila. And this later <em>sāṅkhya</em> philosophy...”</p>

<p>“...is from another rascal!” Dr. Patel completed.</p>

<p>“Yes! Now you have learned!” Prabhupāda exclaimed.</p>

<p>Everyone laughed loudly, enjoying the education of Dr. Patel. Through Śrīla Prabhupāda’s association he is learning the art of good discrimination and giving up his pseudo liberalism. By Śrīla Prabhupāda’s grace he is beginning to understand that not everyone has something worthy to say or hear. A large part of Śrīla Prabhupāda’s appeal is his impartiality. His objective statements are irrefutably sensible and logical.</p>

<p>“The real problem,” Śrīla Prabhupāda went on to explain, “is that people are not interested in hearing from the <em>Gītā</em> and <em>Bhāgavatam</em>, although these literatures explain the essence of all knowledge. This subject matter becomes palatable by association, but without the association of devotees no one becomes interested in them. Even though we are giving daily lectures, still it is not palatable for the ordinary man.”</p>

<p>Dr. Patel jokingly attributed this to Śrīla Prabhupāda’s strong preaching tactics. “You fire them!” he said, laughing his loud, discordant laugh.</p>

<p>Prabhupāda again showed his personal neutrality. If he speaks critically it is not due to passion or prejudice. “How can I say anything which is not spoken by Kṛṣṇa? We have got this test: if anyone has no interest in Kṛṣṇa, he must be with these groups, that’s all—<em>duṣkṛtina</em>, <em>mūḍha</em>, or <em>narādhama</em>. And Caitanya Mahāprabhu says <em>yāre dekha tāre kaha kṛṣṇa upadeśa</em>. So how can I violate? Both ways, I cannot violate. Caitanya Mahāprabhu said that you simply speak what Kṛṣṇa has said. And Kṛṣṇa said that anyone who is not Kṛṣṇa consciousness, he is a rascal, he is a most sinful man, he is the lowest of mankind. So why shall I not say? It is not firing, it is telling the truth.”</p>

<p>Then he laughed with Dr. Patel. “But I am not loser. I do not make any compromise. All these, my students, ask. I never made any compromise. But still they understand, and they are with me.... In Los Angeles so many scientists used to come. So after talking with them I used to say, ‘You are demon! You are rascal!’ And they tolerated.”</p>

<p>Smiling, Prabhupāda recalled how they had remained afterwards for two hours talking and taking <em>prasādam</em>. “They were happy that I found them demons and rascals!”</p>

<p>One devotee suggested that the lack of questions at last night’s program was due to the completeness of Prabhupāda’s lecture.</p>

<p>“Yes,” Dr. Patel said, “it is very difficult to put question to you. You mow the opposition down very badly!”</p>

<p>Everyone laughed in agreement.</p>

<p>When we returned to the temple after the morning walk Prabhupāda looked around the building site. He immediately noticed that a heap of timber brought by lorry from Vṛndāvana was lying unused. Prabhupāda is expert in using everything for Kṛṣṇa; and because he sees everything as Kṛṣṇa’s possession he hates to see anything wasted. He questioned Saurabha closely about it, making sure he understood that it must be utilized.</p>

<p>Dr. Patel expressed his satisfaction at how quickly the construction of the temple is progressing, but Prabhupāda thinks it is going too slowly. He personally questions every aspect of the design, labor arrangements, quality, and so on. He is continually advising how everything should be done.</p>

<p class="verse">* * *</p>

<p>Another report on book distribution in America arrived today. Mid-morning Hansadūta read out a letter from Tamal Krishna Goswami. Tamal Krishna wrote that the Rādhā-Dāmodara Traveling Saṅkīrtana bus parties (RDTSKP) are now distributing 50,000 hardbound books per month. The book-distribution figures from RDTSKP and the airport distributors amazed Śrīla Prabhupāda.</p>

<p>Tamal Krishna Mahārāja reported that November’s sales were 25,000 <em>Caitanya-caritāmṛta</em>s and 112,000 <em>Back to Godhead</em>s, with collections totaling some $120,000. This month they were ordering 50,000 big books, an amount they hope to maintain regularly. One distributor, Paṣca-tattva, sold 311 books in one day, a new world’s record.</p>

<p>Tamal Krishna Goswami said that the party was donating $5,000 per month to the Dallas <em>gurukula</em> and another $12,000 per year to the ISKCON Food Relief program. He has also bought two large diesel powered trailers and plans to tour the country, holding Ratha-yātrā festivals. At the end, he requested permission to be Śrīla Prabhupāda’s personal secretary for January.</p>

<p>Prabhupāda’s response was one of complete satisfaction. He has a high regard for the activities of the all-<em>brahmacārī</em> RDTSKP and sent an enthusiastic reply, “Your letter is very, very encouraging to me. I do not know how you are selling so many books. There is no instance in history where religious books were sold with such enthusiasm and success. Is there any such history? The Christians have spread their teachings all over the world, and they have got only one book, so we have got already forty big books published in English. Therefore if we distribute as you are distributing, we cannot even imagine the result. Your program is very nice; please continue more and more....Your idea for holding Jagannatha festivals in the big cities is approved by me, do it. Yes, you come in January.”</p>

<p>When Kīrtanānanda Swami had first arrived he reported that sometimes books distributed in America were being ripped up by antagonists.</p>

<p>Prabhupāda took the bright side and compared the distribution to hot sugarcane juice: too hot to take and too sweet to resist. Whether one admires them or not, his books are potent, which makes them irresistible. Prabhupāda’s optimism about the effect of massive book distribution is not unfounded. Almost daily he receives positive evidence of how people’s lives are being changed by reading his books.</p>

<p>Stephen Knapp, a <em>bhakta </em>from Colorado, sent a long letter thanking Prabhupāda for having saved him from material life. “This letter could be, and no doubt is, the most important that I could ever write to anyone. I have associated with you, Srila Prabhupada, through your books for so long now that you have knocked my material motivation from under me. My mind may still have the desires, but by associating with you I no longer see any sense to struggle with material nature to try to satisfy my mind. I read your Bhagavad-gita, the small edition, four years ago, and since then I’ve continued to get more and more of your books...</p>

<p>“I have associated with you for so long through your books that you have already answered my questions and now I am indebted to you by service for giving me this spiritual knowledge. But even though I have no talents or value I pray that you will accept my service to you.”</p>

<p>He also enclosed a well-written philosophic poem of a dozen verses, glorifying Śrīla Prabhupāda. Prabhupāda listened to a few of them:</p>

<p>“Into this world of darkness where everyone is so confused</p>

<p>with its society of cheaters and the cheated who end up so abused,</p>

<p>in this huge slaughterhouse where everyone is unwillingly forced to die,</p>

<p>and living entities, in all bodies, in their distress do cry,</p>

<p>the spiritual master arrives to give the solution to all our problems</p>

<p>and miseries, this spiritual knowledge is the only way to solve them.</p>

<p>And seeing this, I simply pray,</p>

<p>“My dear Lord, please just give me the company of Your devotees.</p>

<p>“In this age when atheists in society become so prominent,</p>

<p>sitting in their temporary and false prestige the fools remain obstinate,</p>

<p>only to be defeated by the laws of nature and suffer the pains of death,</p>

<p>they’re engaged in so many activities but are simply dying with each breath.</p>

<p>The spiritual master takes it upon himself to show the fools for what they are,</p>

<p>and teaches us to attain eternal life while still situated right where we are.</p>

<p>And seeing this, I simply pray,</p>

<p>‘My dear Lord, please just give me the company of Your devotees.’”</p>

<p>“The materialists who are so engaged in their temporary pleasure</p>

<p>work so hard to enjoy wasting away in their time of leisure.</p>

<p>To work so hard for that which lasts so short of a time,</p>

<p>working under the perishable conceptions of ‘I’, ‘Me’ and ‘Mine.’</p>

<p>To learn technology so they can more perfectly eat, sleep, and have sex,</p>

<p>like dull-headed animals, they have no concern for any spiritual progress.</p>

<p>And seeing this, I simply pray,</p>

<p>‘My dear Lord, please just give me the company of Your devotees.’”</p>

<p>Even with such glorification Prabhupāda doesn’t take any personal credit, neither does he take these accomplishments for granted. Letters like these only increase his desire to promote Kṛṣṇa consciousness throughout the world. He is the life and soul of the devotees, always unerringly directing our attention to Kṛṣṇa.</p>

<p>He replied to Steven Knapp, “So to develop attraction for Krsna is not difficult. You simply have to hear about Krsna, His activities, His name, His form, and His teaching in Bhagavad-gita. Naturally you will develop love for Krsna, because we are all part and parcel of Krsna. The beginning process is to chant Hare Krsna, follow the four regulative principles, and associate with devotees, and eat prasadam of Krsna. I think you are now living in the temple of Krsna, so these things will be very easy for you to practice.”</p>

<p>Prabhupāda’s books are not only attracting people from non-Vedic cultures; they are also reclaiming those misled by false presentations of it. From Germany an Indian devotee, Tulasī, wrote to thank him for giving real understanding of the <em>Bhagavad-gītā</em>. Originally brought up to worship Kṛṣṇa in the Guruvayor temple in Kerala, he later drifted away from spiritual practices. Then he met the devotees in Berlin and read Prabhupāda’s books. Now he is living in the Schloss-Rettershof temple near Frankfurt.</p>

<p>He wrote, “As a youngster when I read Bhagavad-gita first time, I was always feeling that Sri Krsna’s instructions of devotional service had been purposely covered up by the so-called philosophers and yogis. I felt in those days that probably I am not competent enough to understand Bhagavad-gita. Today I realize Krsna’s eternal servant (Your Divine Grace) alone has the right to translate and give a purport to that great Upanisad. My humble obeisances at your lotus feet....</p>

<p>“Guide me so that I can preach the message to the other Indians who go abroad for the sake of foreign qualifications and degrees. How shameful? There is no equivalent knowledge anywhere in the world [other than] what our Acaryas gave us. And you are the only devotee of Kṛṣṇa who can imbibe this feeling to our millions of people.</p>

<p>“Meanwhile I heard your assessment on Mahatma Gandhi’s life and policy. I must definitely fall at your feet the moment when I see you because you have shown us how dependence on Krsna, than surrendering to countrymen and nation, would have made India a Rama Rajya.”</p>

<p>Prabhupāda stressed that Kṛṣṇa Consciousness, the gift of Caitanya Mahāprabhu, is particularly the natural birth-right of those born in India. The lack of committed response from the intelligent class of men here disappoints Śrīla Prabhupāda. India has become diverted from its real business by what Prabhupāda often calls its “mis-leaders.” In pursuit of material advancement they are swiftly leading the populace away from the Vedic culture.</p>

<p>Yet, Prabhupāda hopes to reawaken the natural spiritual yearning of the Indian people. Then, by their example, the course of the world can be changed. Therefore, it always pleases Śrīla Prabhupāda when an educated Indian takes up the <em>saṅkīrtana-yajṣa</em> of Śrī Caitanya Mahāprabhu.</p>

<p>He gave the boy all encouragement. “I can understand from your letter that you are very intelligent. Generally Indian people are not taking up this Movement, although it is their original culture. They are now in favor of economic and technological advancement, which can never do any good to the people in general. After all, a living being lives by the grace of God. We cannot eat nuts and bolts, however nicely they may be manufactured....</p>

<p>“So if we want to be happy in this life and the next we have to worship Visnu. What Gandhi did to satisfy Visnu? He was trying to satisfy his country, and his country killed him. He manufactured so many things which were never found in Bhagavad-gita.... Krsna was personally instructing Arjuna to fight, and Gandhi took Bhagavad-gita and preached non-violence. So what was his understanding? At the end of his life he frankly said, ‘I don’t believe there was ever such a historical person as Krsna.’ So what did Gandhi know about Bhagavad-gita?</p>

<p>“My only credit is that I have presented Bhagavad-gita as it is, without any speculation or interpretation. Therefore for the first time in the history of the world people are accepting it and living practically according to the principles of Bhagavad-gita.</p>

<p>“I understand that you are translating Bhagavad-gita As It Is into Malayalam language. Hansaduta has spoken to me about you. Please send me a sample, and we will see about its publication and distribution in India. Maybe in the future you will like to come to India and help preach this message to your countrymen.”</p>', '', '1975-12-18', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


END $$;
