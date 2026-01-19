-- ============================================
-- TD Volume 1, Chapter 9 - Verses
-- ============================================

DO $$
DECLARE
  v_book_id uuid;
  v_canto_id uuid;
  v_chapter_id uuid;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = 'td';
  SELECT id INTO v_canto_id FROM public.cantos WHERE book_id = v_book_id AND canto_number = 1;
  SELECT id INTO v_chapter_id FROM public.chapters WHERE canto_id = v_canto_id AND chapter_number = 9;


  -- February 6th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'February 6th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>The two new swamis left for Calcutta this morning. Harikeśa Mahārāja will go to the USA via London. I gave him my quilted cotton jacket, a <em>bagalbundi</em> from Vṛndāvana, because he had no clothes for colder climates.</p>

<p>Before he left he gave me a three page, handwritten list of instructions on how to cook for Śrīla Prabhupāda:</p>

<p>HOW TO COOK FOR SRILA PRABHUPADA</p>

<p>1. Take bottom section of cooker and put perhaps 3 or 4 heaping tablespoons of yellow split mung or toor-dal which has been well washed and immediately let it boil so that you can regulate the temperature to a small rolling boil. Water level should be 5/8 full. Add turmeric (till nice deep color) and salt.</p>

<p>In 2nd section put 4-6 oz rice (nice basmati) and clean and wash 1 or 2 times (not too much) then add twice as much water or slightly less.</p>

<p>In 3rd section whatever vegetables you want to steam should be placed here and do not cover the holes.</p>

<p>Cover with lid and wait 45 minutes.</p>

<p>——————————————————————————————-</p>

<p>Vegetables (typical steaming schedule):</p>

<p>Cauliflower, potato, zucchini, loki, eggplant, tomato, (beans or peas), portals etc.</p>

<p>———————————————————————————————</p>

<p>Dahl should be completely merged, not solid, not liquid, chaunched with chili, cumin, asafoetida, either methi or dhanya but never at the same time, sometimes ginger in chaunch is nice.</p>

<p>———————————————————————————————</p>

<p>Paneer cheese:</p>

<p>Boil milk, curdle with yogurt, take out and put in cloth. Press under cloth with heavy weight by forcing out all water. Cut cheese into chunks and deep fry brown. Meantime make masala (as you like) put in water and tomato - then cheese and boil till cheese is very soft.</p>

<p>———————————————————————————————</p>

<p>Wet veg:</p>

<p>Masala, add water, turmeric, salt, sometimes yoghurt, then steamed veg - heat and serve.</p>

<p>Dry veg:</p>

<p>Masala, add steamed veg, turmeric, salt, fry for short while.</p>

<p>———————————————————————————————</p>

<p>Some masalas -</p>

<p>Cumin; anise; chilli; (hing)</p>

<p>Coriander powder, turmeric, salt, sweet neem (curry leaves) are also used.</p>

<p>As you change the ratios of one spice to another in the masalas you get an infinite variety of tastes.</p>

<p>———————————————————————————————</p>

<p>Recipe for Sukta:</p>

<p>Wok on very low heat with sufficient ghee to fry the vegetables first. Use whatever you like of the below list but kerala (bitter melon) is absolutely essential:</p>

<p>kerala, radish, potato, green banana (plantain), pepper, green tomato, carrots, beets, beans (string beans), mooli.</p>

<p>When little soft add salt-spice by pushing aside vegetables and in the middle cooking cumin, anise, green chili, methi, not very dark, continue frying. When finished add water and boil down. Add turmeric. Mash poppy seeds (white) to paste - add - dry fry methi, anise, cumin, chili and grind - add to top after putting off the heat, serve liquid.</p>

<p>———————————————————————————————</p>

<p>Sak:</p>

<p>Masala with methi, chili, cumin, anise and add spinach leaves, cover and cook. In the meantime deep fry to brown, badi, and break up into prep with salt - finished (do not add extra water).</p>

<p>———————————————————————————————</p>

<p>Rice cooks automatically in the cooker - just keep it hot.</p>

<p>He went in to take a final leave of Śrīla Prabhupāda and then he was gone.</p>

<p>Dayānanda and Nandarāṇī prabhus, who are both excited at the unexpected turn of events, were familiarized with their new duties. They began immediately.</p>

<p class="verse">* * *</p>

<p>It rained early this morning, delaying the construction work on the new building. But later the thick mist and clouds cleared away as the warm sunshine evaporated the haze. Prabhupāda was out on the balcony just after breakfast. He paused to look out over the rail and smiled as the sun’s rays filtered through. “<em>Nīhāram iva bhāskaraḥ!</em>” he quoted from the Sixth Canto. It is a verse that describes how the appearance of the holy name destroys sinful life just as the sun dissipates fog. Everything he sees reminds him of Kṛṣṇa.</p>

<p class="verse">* * *</p>

<p>Prabhupāda has been invited to do a program in Dacca, Bangladesh, where he will also accept a gift of land and a temple. Jayapatāka Swami has been negotiating with some Gaudiya Math members there. Apparently they are willing to hand over their small preaching center to ISKCON.</p>

<p>Hridayānanda Mahārāja will go there next week to prepare for the program.</p>

<p class="verse">* * *</p>

<p>Just after lunch <em>prasādam</em>, Prabhupāda sat on a chair out on the veranda. Tamal Krishna Mahārāja and myself sat at his feet, eager as ever to share some quiet moments with His Divine Grace. Prabhupāda volunteered to us that he had a dream last night in which he saw a planet where pious Muhammadans go.</p>

<p>We smiled. I asked if such a place actually exists.</p>

<p>Prabhupāda tilted his head from side to side. “Oh, yes,” he said smiling.</p>

<p class="verse">* * *</p>

<p>Jagadīśa and Nitāi prabhus have come to Māyāpur to discuss with Prabhupāda their proposals for the formation of the Vṛndāvana <em>gurukula</em>.</p>

<p>Nitāi has been writing regularly with suggestions about curriculum and registration of the school. He feels that our <em>gurukula</em> should be affiliated with other centers of learning, such as Agra University. This will help the students and other devotees to easily get student visas. Thus they will be able to stay in India without difficulty.</p>

<p>Prabhupāda called for the other senior men to discuss their ideas for the school’s curriculum. The two of them gave an elaborate outline of a comprehensive course of study, beginning from first-level grammar school up to Master’s level in graduate studies.</p>

<p>After hearing their proposals Prabhupāda indicated that he considered many of their ideas to be impractical. Nitāi’s scheme seemed too academic and grandiose, and attempted to cram in too much in too short a time.</p>

<p>Prabhupāda emphasized that he wants the children to become devotees, not simply scholars. He is also not keen on the idea of affiliation with other schools, because then we will be required to conform to certain government standards that he doesn’t feel are necessary.</p>

<p>Overall, Prabhupāda’s response to their proposals was not very favorable. So they will reconsider and modify them.</p>', '', '1976-02-06', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- February 7th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'February 7th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Today is Śrī Advaitācārya’s appearance day, a half-day fast, and the day chosen for the launch of the boat.</p>

<p>In the early morning Prabhupāda was driven in a jeep to Hoola Ghat on the Jalāṅgī River, where he inspected the “Nitāi Pada Kamala.” Its renovations are complete, and the Deities have been installed below deck. The small wooden forms of Śrī Śrī Gaura-Nitāi will be taken on procession through villages whenever the boat lands.</p>

<p>It is a good facility, a 12 ton “Jali” class boat, about forty feet long and fifteen feet wide. It has a shallow draft and was previously used to transport hay, although the maritime authorities have licensed it to carry up to 56 passengers. The devotees have added a cabin above deck along most of its length. Brightly painted in green, yellow, and red, the boat was gaily decorated for today’s occasion with strings of orange marigolds. The high mast is painted in yellow and red strips like a barber’s pole. Inside the cabin the main support beams are bright-yellow and red with lotus-flower motifs.</p>

<p>Tamal Krishna Mahārāja helped Śrīla Prabhupāda on board over the rickety bamboo ramp. Prabhupāda carefully inspected every corner of the boat. Then he sat for a few minutes on a straw mat, while the devotees held <em>kīrtana</em>. Prabhupāda likes the idea of preaching on the boat, and he encouraged Sudāmā Mahārāja to make it a success.</p>

<p>Later in the morning Sudāmā Mahārāja sailed away down the Gaṅgā with seventeen men, including four of the older boys from the <em>gurukula</em>, on their maiden voyage. It was a magnificent sight. Many local villagers lined the shore, eager to witness their departure.</p>

<p class="verse">* * *</p>

<p>During his massage Prabhupāda heard a letter from Balavanta dāsa, the temple president in Atlanta, in which he learned that the devotees were making a tea from <em>tulasī</em> leaves. “Immediately stop it!” he exclaimed. He was very disturbed by this news and declared that such “tea” should not be made even for Lord Jagannātha during His yearly convalescence.</p>

<p>Balavanta also questioned whether the devotees on traveling <em>saṅkīrtana</em> could eat bread made by <em>karmīs</em>.</p>

<p>Prabhupāda replied that they may not, unless it is an emergency situation. In any event he said that such food cannot be offered to the Deities. As a substitute he suggested they eat farina fried in a little ghee with sugar added. Or <em>purīs</em> because these would last for three or four days.</p>

<p class="verse">* * *</p>

<p>Recently I have been trying to improve my standard of cleanliness because Prabhupāda frequently refers to me as a <em>mleccha</em>. Still, I continue to make mistakes.</p>

<p>Today, as usual, after <em>prasādam</em> Prabhupāda sat out on the veranda in his chair. As Tamal Krishna Mahārāja and I sat at his feet, he admired the vista of Śrī Māyāpur-dhāma, occasionally making short comments.</p>

<p>Prabhupāda asked me for a drink of water, and I reached out for his silver cup. In my eagerness to serve him, I moved too quickly, caught the top edge with my palm and almost knocked it over. In the act of recovery I poked the tip of my finger into the water. I was caught in a dilemma. Should I inconvenience Śrīla Prabhupāda by making him wait while I empty the cup and get fresh water? Or should I offer him the cup even though my finger had touched its contents?</p>

<p>I offered him the glass. A wrong decision. Prabhupāda shook his head and gave me a sour look. Then he laughed and quoted from <em>Bhagavad-gītā</em>, “<em>Pravṛttià ca nivṛttià ca janā na vidur āsurāḥ!</em> You are simply <em>mleccha!</em>”</p>

<p>In an attempt to rectify my bad habits I have begun to take three baths daily: one upon rising, one just before massage, and one in the late afternoon. Still, it seems very difficult to know what a fitting standard of cleanliness is, although due to Prabhupāda’s association I am gradually learning.</p>

<p>The other evening I told Prabhupāda that sometimes I wonder if I will ever come up to the correct standards. Brahminical cleanliness just doesn’t seem to come naturally. I explained that at home, before becoming a devotee, I had been practiced to bathe not more than once a week.</p>

<p>Prabhupāda assured me I will learn gradually. But he also laughingly agreed that for a Westerner to be clean is somehow a very artificial condition.</p>

<p class="verse">* * *</p>

<p>Immediately after lunch Prabhupāda went upstairs and took his afternoon nap in one of the rooftop rooms on the roof. He enjoyed the fresh open air. The setting was so peaceful and quiet that he has decided to stay up there every day from 10:00 a.m. until 4:00 p.m., taking his massage, bath, and lunch all there.</p>', '', '1976-02-07', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- February 8th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'February 8th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>For the first time since we arrived, Prabhupāda gave a class after <em>guru-pūjā</em>, speaking in English on the <em>Śrīmad-Bhāgavatam</em> Seventh Canto 9.1. The subject was Prahlāda Mahārāja’s prayers to Lord Nṛsiàhadeva.</p>

<p>After a brief, fifteen-minute discourse, he surprised everyone by requesting a Bengali devotee, Subhāga, to come forward and repeat what he had said in Bengali for the benefit of the local devotees.</p>

<p>Subhāga, a gentle, nervous type of fellow, became a little flustered at the thought of speaking before Śrīla Prabhupāda. He was unable to get out more than a couple of sentences. In his nervousness his mind had gone blank and he couldn’t remember anything Prabhupāda had said. Prabhupāda requested Nitāi-canda dāsa, a young man born here in Māyāpur, to speak instead. He was more successful.</p>

<p>It has put all the bilingual devotees on their toes. They’re all wondering if they will be called upon in future classes.</p>

<p class="verse">* * *</p>

<p>The room on the roof facing east has been cleared out and prepared for Prabhupāda. He went up just after taking his morning nap and stayed there until mid-afternoon.</p>

<p>During massage Dayānanda read the English translation and word-for-word transliteration of the two prayers Prabhupāda wrote while on board the <em>Jaladuta</em> when he first sailed to America. The prayers were sent by Jayaśacīnandana dāsa from Los Angeles, who has translated them into English from Bengali.</p>

<p>Śrīla Prabhupāda was pleased with the translations and suggested they be published in the new printing of the song book for all the devotees to learn and sing. One of them was already named <em>Markine Bhāgavata-dharma</em>. Prabhupāda named the other <em>Prayer to the Lotus Feet of Kṛṣṇa</em>.</p>

<p>Yaśodānandana and Acyutānanda Swamis will be arriving here around February 25th. Since Prabhupāda’s visit to Nellore they have been preaching throughout eastern Andhra Pradesh with good success. They reported that Gurukṛpa Mahārāja has sent money for a new traveling <em>saṅkīrtana</em> bus which they are having specially constructed in Bombay. The bus will be ready in time to take them on a tour of Karnataka in April.</p>

<p class="verse">* * *</p>

<p>Because his digestion is poor and he is suffering from excess mucus, Prabhupāda has been adjusting his diet. His liver is not functioning properly, and his digestion is not good. He has stopped taking evening <em>prasādam</em>. For breakfast he is eating only fruits, and for lunch he has a variety of vegetable preparations, but no <em>dāl</em> or rice.</p>

<p>Today he decided to take his evening milk in the form of milk sweets like <em>rasagullās</em> or <em>sandeśa</em> made with <em>gur</em>, a local form of brown sugar made from boiled-down cane juice. He reasoned that the sugar would be good for his liver and the solid milk would give him strength to work on his books throughout the night. (As a liquid, milk is too difficult for him to digest.)</p>

<p>He called in his new cook, Nandarāṇī, and explained how to make <em>rasagullās</em>. The curd has to be thoroughly kneaded. Then when rolled, a small piece of rock candy can be placed in the middle. The whole thing has to be cooked until sticky.</p>', '', '1976-02-08', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- February 9th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'February 9th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>On his morning walk Prabhupāda explained that the <em>varṇāśrama</em> system is not necessary for our ISKCON society; it is a material arrangement. When one chants the holy name and performs devotional service one immediately rises above that platform, like using a lift instead of stairs. However, as long as some bodily concept is present, <em>varṇāśrama</em> is useful and it can be utilized.</p>

<p>He talked about various aspects of the Vedic social system and told us that his mother was married at age eight. He gave a few examples of others who were married while as young as five years. In such child marriages the couples would live separately until the girl reached puberty. Then they lived together at the boy’s parents’ house. Prabhupāda’s own wife was eleven at the time of their marriage. At the age of thirteen she moved in with his family, and at fourteen she gave birth.</p>

<p>He said the social system for getting girls married was so strict that in one <em>śāstra</em> it says if a girl is not married by the first menstrual period then the father has to eat the menstrual liquid! Everyone winced at the thought. Prabhupāda explained that of course that is not to be taken literally. But it was meant to stress the importance of properly protecting the girls. By marrying the girls before puberty they would naturally become attached to their husbands and remain faithful throughout their lives. Thus their chastity was preserved, and there was no disturbance in society.</p>

<p>Prabhupāda said that in our ISKCON Society, however, getting married is not so important. That’s because life becomes perfect by serving Kṛṣṇa. He is the real husband.</p>

<p class="verse">* * *</p>

<p>It is very pleasant to give Prabhupāda his massage out on the roof. He has me place his sitting mat on a large, wooden table about the size and height of a bed. This provides me just enough room to manoeuvre around, while Prabhupāda sits contentedly in the warm rays of the sun.</p>

<p>On completion of the massage, he bathes outside in his <em>gamchā</em>, sitting on a <em>choṅki</em>, washing off the oil with warm water from a brass bucket. Then he retires inside the room to dress, eat lunch, and rest.</p>

<p class="verse">* * *</p>

<p>Dayānanda came up with the day’s mail. A letter from Brahmānanda Swami was included. It was a long, rather depressing missive.</p>

<p>In it Brahmānanda described the struggles that he, Navayogendra, and Nanda Kumāra Swamis are having in trying to restore good relationships with our members. He wrote how collections have become so bad in Nairobi that they could not even buy any fruit or milk, nor post letters, during one five-day period. Furthermore, he explained how some Mombasa devotees had previously visited local prostitutes, later leaving the temple. However, he reported that relations with the local Hindu community are gradually improving. And despite all the problems, he still managed to send $800 to the BBT.</p>

<p>Chayavana Swami, who had been placed in charge of the African <em>yātrā</em> in Brahmānanda’s absence, had left and gone to live with his father in Florida. From there he sent a letter to the White House telling them how our movement could stop the spread of Communism in Africa if they gave us backing.</p>

<p>Prabhupāda didn’t comment at length, but he did compliment Brahmānanda for paying his debts to the BBT.</p>

<p>As far as Chayavana’s letter was concerned, he wasn’t impressed. “That was a foolish letter sent by Chayavana,” he wrote. “He was crazy. These things should not be done without first asking.”</p>

<p>We have heard that Chayavana is now in India and on his way here to see Prabhupāda. So Prabhupāda is hoping that he can be rectified by spending some time in Māyāpur with himself and in the company of other <em>sannyāsīs</em>.</p>

<p class="verse">* * *</p>

<p>In the afternoon Śrī Tarun Kanti Ghosh, a West Bengal cabinet Minister, paid a visit. A tall, good-humored man, with an impressive mien and an aura of extravagance, he seemed surprisingly young to have such a high-ranking political position. He is from a Vaiṣṇava family who worships a Deity of Lord Caitanya in their home. And he deeply admires Śrīla Prabhupāda and his disciples.</p>

<p>Although he has been here before, he was taken on a tour. He greatly appreciated the transcendental atmosphere of Māyāpur. Afterward he relished <em>prasādam</em>, then Śrīla Prabhupāda entertained him very graciously in his room for an hour, conversing on various topics. He left paying high tribute to Śrīla Prabhupāda for the great work he is doing in spreading the movement of Lord Caitanya far and wide.</p>', '', '1976-02-09', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- February 10th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'February 10th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Śrīla Prabhupāda is constantly meditating on the development of ISKCON. He regularly discusses managerial concerns as well as spiritual standards in order to assure that everything in the Society is running efficiently. He is constantly on the watch for signs of mismanagement. It is common for him to call in his GBC men at all hours to garner information and give direction. We are all untrained, both materially and spiritually, and Prabhupāda has to educate us in both realms in order to create a Society with a solid framework for advancement.</p>

<p>Early this morning, before his walk, he sent me to get Tamal Krishna Mahārāja. After some discussion he authorized him to send out the following letter to all the temples and GBCs: “This morning Srila Prabhupada called me into his room. He was concerned over the appropriation of money for use in traveling and communicating between centers by the devotees. More and more His Divine Grace is noticing the frequency of plane flights and trunk calls, both of which are very costly. He has therefore ordered that henceforward no one should take plane flights. If anyone has to go to another temple, he should book a train reservation, but he can not take a plane. With regards to trunk calls, His Divine Grace does not want any more trunk calls booked, except in case of dire emergency. Everything should be done by mail. Telegrams should be utilized only when absolutely necessary. If you consider this desire of Srila Prabhupada carefully, I think you will see that the result will be a huge savings of money and much more cool headed management.”</p>

<p>Prabhupāda told us that one of our Western diseases is that we are so wasteful, especially in regard to spending money. He himself is mindful of every single rupee spent, not out of miserliness, but because he understands perfectly how everything belongs to Kṛṣṇa and how to utilize it in His service.</p>

<p class="verse">* * *</p>

<p>While walking on the roof Prabhupāda told us about “ten hands and two hands.” Because Kṛṣṇa is everywhere, in all the ten directions, He is therefore said to have ten hands. In comparison, we limited beings have only two hands. “So my father used to say, ‘When Kṛṣṇa takes your money or possessions in ten hands, how you can protect it with two hands? And when He gives you in ten hands, how much can you take in two hands?’”</p>

<p>He laughed. “So in my case it has become practical. Everything He has taken in ten hands, and now He is giving in ten hands. I am practically experiencing. My Guru Mahārāja ordered me, ‘You do this.’ I was trying to save my business, my family, with two hands, and Kṛṣṇa took it in ten hands. And now, after making me a beggar, He is giving me, ten hands: ‘You take as much as you like.’”</p>

<p>He paused for a moment and reflected aloud on the sagacious advice he had received. Affectionately remembering his father, Prabhupāda recalled how he used to invite saintly persons to his home to solicit their blessings. But his only prayer was that his pet son, Abhay, would be blessed to become a devotee of Rādhārāṇī. Now we can appreciate that his father’s desire was gloriously fulfilled.</p>

<p>Prabhupāda’s readiness to share the intimacies of his past made us eager to solicit more details. We took advantage of the opportunity to find out more about his early days and relationships.</p>

<p>Hridayānanda Mahārāja recalled Prabhupāda saying that he was not much impressed with the saintly persons who came to his house.</p>

<p>Prabhupāda agreed. “Yes. Not all of them were real Vaiṣṇavas. That was my discrimination from the very beginning of my life. I never liked these bogus svāmīs and yogis.” But he said that his father did not discriminate too much about the standards of behavior of his visitors. He even sometimes gave <em>gaṣjā</em> to a <em>sādhu</em> he was friendly with.</p>

<p>When Tamal Krishna questioned his reasoning, Prabhupāda explained that the general Indian public didn’t make too many judgements about those who appeared to be <em>sādhus</em>. <em>Gaṣjā</em> smoking was not considered by them to be such a bad thing for a <em>sādhu</em>. Although it was not done by the higher-class spiritualist, it was for the “bogus svāmīs and yogis.”</p>

<p>Prabhupāda said that the Western hippies had picked up the habit of smoking <em>gaṣjā</em> from people like Allen Ginsberg, who had learned it from these so-called <em>sādhus</em> in India. Prabhupāda said that it was Śrīla Bhaktisiddhānta Sarasvatī who had taught him that any kind of intoxication was bad. “Śrīla Bhaktisiddhānta was very strict,” he said with a chuckle. He stopped for a moment and with a reserved laugh he revealed that as a lifelong celibate, Bhaktisiddhānta Sarasvatī was so strict that sometimes he would criticize his father, Śrīla Bhaktivinoda Ṭhākura, for having married twice. If there was some fight between them, he would tell Bhaktivinoda, “<em>Strī-sangī!</em> You are attached to women!”</p>

<p>Of course this was a transcendental relationship, and Prabhupāda explained it in such a way that we could not misinterpret it. He told us that they had a special relationship, so we should not take it as an ordinary thing. Nor should we advertise it, but he mentioned this to illustrate how strict a <em>brahmacārī</em> Bhaktisiddhānta was.</p>

<p>Bhaktisiddhānta Sarasvatī Ṭhākura was very outspoken against so-called <em>sādhus</em>—so much so that everyone in the Navadvīpa area feared him. At one point, the Navadvīpa gosvāmīs conspired against him and devised a wicked scheme. They raised a 25,000-rupee bribe, a huge sum of money in those days, and requested the police to kill him. But the police refused to cooperate, informing Śrīla Bhaktisiddhānta Sarasvatī instead. The police admitted that they did that kind of thing, but not to a <em>sādhu</em>.</p>

<p>Śrīla Prabhupāda then told us a little about his own relationship with his Guru Mahārāja. He explained that he had gone to Mathurā in 1933 to see Śrīla Bhaktisiddhānta Sarasvatī during the Gaudiya Math’s annual <em>parikrama</em> tour of the Vṛndāvana area.</p>

<p>At that time, Prabhupāda had taken a seat on the same couch as Śrīla Bhaktisiddhānta Sarasvatī. He was thinking that “he is a respectable gentleman, and I am also a respectable gentleman.” So Prabhupāda could not understand that there would be anything wrong if he sat on the same seat. When he noticed everyone else was sitting on the ground, however, he understood and got down.</p>

<p>But Śrīla Bhaktisiddhānta Sarasvatī never cautioned him for sitting on the couch, and he simply preached to him about Kṛṣṇa consciousness. It was during that tour that Śrīla Bhaktisiddhānta noted Prabhupāda’s eagerness to hear. A short time later Prabhupāda was formally initiated, in Allahabad.</p>

<p>The conversation was fascinating and, at least for me, a privileged insight into Śrīla Prabhupāda’s past. It was one of those especially relishable opportunities that comes along with being in his personal service.</p>

<p class="verse">* * *</p>

<p>In class, speaking from <em>Śrīmad-Bhāgavatam</em> 7.9.3, Prabhupāda explained that although Prahlāda Mahārāja was an inexperienced young boy, nevertheless the demigods, being unable to pacify Lord Nṛsiàhadeva, asked him to go forward to speak. Even Śrī Lakṣmī-devī, the Lord’s eternal consort, could not approach Him, what to speak of pacify Him. Prabhupāda explained that it was something like putting a small boy in the cage of a lion. But Prahlāda felt no difficulty. He sat at the feet of the Lord, feeling himself completely protected.</p>

<p>Śrīla Prabhupāda stressed the necessity of becoming humble if we want to make advancement in Kṛṣṇa consciousness. If a person is proud, then Kṛṣṇa consciousness is not possible. “Those who are very much proud, they do not take Kṛṣṇa consciousness very seriously. They think, ‘These poor fellows, who had no money, no foodstuff, they have come in the name of Kṛṣṇa for begging. So it is for them. It is not for us. I am very rich. I am very opulent. I am very educated. I am very aristocratic. So for me there is no need of.’</p>

<p>“The Indians say like that in your country. ‘Now we have known this Kṛṣṇa, Hare Kṛṣṇa. Now it is not needed. Now it is technology.’ So these puffed-up persons cannot understand Kṛṣṇa. One has to become very humble.”</p>

<p>He cautioned us that a devotee must always feel insignificant before guru and Kṛṣṇa. “If somebody thinks that ‘I have become more than my guru, more than Kṛṣṇa,’ then he is finished. Never should we think that ‘I have become very big personality.’ That was the instruction of my Guru Mahārāja, that <em>baḍa Vaiṣṇava</em>: ‘I am very big Vaiṣṇava. Everyone should come and obey my orders.’ This is condemned position. Real position is one should be very humble and meek.”</p>

<p>He also commented about the constant requests he has been receiving for <em>sannyāsa</em>. “It doesn’t require to change. There are so many questions sometimes: Whether it is necessary to take <em>sannyāsa?</em> By the routine work, it is necessary. But if one is serious, so for him it is not necessary —<em>ahaituky apratihatā</em>—because for a serious student of devotion, Kṛṣṇa is in his hand.”</p>

<p>Class was short. Afterward the devotees accompanied him with a lively <em>kīrtana</em> as he circumambulated the Deities in what has now become a regular feature of his morning program. Walking around the Deity room three times Prabhupāda vigorously rang the bells hanging on either side of the temple room. The more he rang them, the more energetic the chanting became. As he came before the Deities he spun clockwise on the spot before moving on around. The <em>kīrtana</em> party accompanied him, in front and behind, and by the end, every one was jumping up and down and singing ecstatically, as Prabhupāda’s face beamed with satisfaction.</p>

<p class="verse">* * *</p>

<p>Bhavānanda Mahārāja came in to see Prabhupāda later this morning, requesting permission to join the boat party. He said he was feeling strained from the burden of constant management and felt it would enliven him to go out and preach in the villages.</p>

<p>Śrīla Prabhupāda pointed out that he could not speak Bengali, so how would he preach? Bhavānanda Mahārāja said he had a white body, so if he danced and chanted that would attract many people.</p>

<p>Prabhupāda raised his eyebrows. “Yes!” He agreed it was a good idea. Bhavānanda left immediately.</p>', '', '1976-02-10', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- February 11th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'February 11th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>The observance of Ekādaśī today is coupled with a half-day fast for Lord Varāhadeva’s appearance, although the Lord’s appearance is actually tomorrow.</p>

<p>As Prabhupāda took his morning walk, he had Jayapatāka Mahārāja confirm the observance procedure by reading out from the <em>Gauḍīya Paṣjikā</em>, a yearly Vaiṣṇava almanac the Gaudiya Math produces. Since the auspicious appearance of Lord Varāha falls on Dvādaśī, which is the day for breaking the Ekādaśī fast, the two are combined.</p>

<p>Prabhupāda said that it would suffice to celebrate Lord Varāhadeva’s appearance by singing the appropriate verse describing him from the song of the ten <em>avatāras</em>.</p>

<p>Śrīla Prabhupāda also verbally listed the proper fasting periods to observe for other auspicious days: Lord Nityānanda’s, Śrī Advaita’s, Lord Balarāma’s, and Śrīmatī Rādhārāṇī’s appearances are all half-day fasts. Lord Nṛsiàha and Lord Rāmacandra’s appearances are full-day fasts until sunset, while Gaura Pūrṇimā is a fast until moonrise.</p>

<p>Tamal Krishna Mahārāja inquired about observing the appearance and disappearance days of great Vaiṣṇavas. He described how we observe a half-day fast for our immediate predecessor <em>ācāryas</em>. He wanted to know if we should also do the same for personalities like Śrīla Narottama dāsa and others like him. Prabhupāda said yes, if it is possible. But he added that if devotees are engaged in preaching work, they may not. He said that the main thing is to sing some songs of praise and perform <em>kīrtana</em>.</p>

<p>Tamal Krishna also asked about chanting while observing Ekādaśī. “We should always chant twenty-five rounds on Ekādaśī if initiated?”</p>

<p>“Initiated? Everyone. Why initiated?”</p>

<p>“So that should be standard for our movement on Ekādaśī day?” Tamal asked.</p>

<p>“Standard is sixteen. But if one can chant more, then he is welcome,” Prabhupāda replied.</p>

<p>Tamal Krishna pressed to know if twenty-five was mandatory or not. When Jayapatāka Mahārāja suggested it was “recommended,” Prabhupāda seemed to disagree. “No. Ekādaśī means that, fasting and chanting.”</p>

<p>However, when Tamal Krishna Mahārāja referred to his men going out on book distribution, Śrīla Prabhupāda was quick to clarify. “No, no. That is also preaching work. For that purpose you can stop this. But generally, one who has no preaching work, he can chant extra.”</p>

<p class="verse">* * *</p>

<p>Vrindavana Chandra De, Prabhupāda’s second son, arrived today. Prabhupāda is trying to engage him in Kṛṣṇa’s service. Prabhupāda is purchasing a flat in Calcutta for his former family, where they will live as guests. In return, Prabhupāda wants Vrindavana Chandra to sell his books. Vrindavana owns a company called Vrinda Books and has already sold a complete set of the <em>Śrī Caitanya-caritāmṛta</em> to Calcutta University. Śrīla Prabhupāda encouraged him to distribute them throughout West Bengal.</p>

<p>Vrindavana Chandra wanted Prabhupāda to get them a bigger flat. But Prabhupāda refused. As a <em>sannyāsī</em> he is not obligated in any way; it is simply out of his mercy that he has arranged adequate accommodation for them.</p>

<p class="verse">* * *</p>

<p>Chayavana Mahārāja has finally written. He has gone to Vṛndāvana “to rest,” he said. “I have been very ill and traveling too much. So now I am helping to take care of the Deities here.”</p>

<p>Śrīla Prabhupāda was pleased to hear his message. But being aware of Chayavana’s disturbed state of mind, he mercifully offered him a chance for rectification. “I think it will be good if you will live with me and assist me in so many ways. Here there are other GBC and sannyasis like Jayapataka Maharaja, Bhavananda Maharaja, Tamal Krishna Goswami, etc. It will be nice if you stay with experienced men. I hope you will be benefitted this way.”</p>

<p>Svarūpa Dāmodara also sent a letter from America. He is unable to leave for at least six months due to a pending immigrant visa application. So he will not be able to attend the programs planned for early April in Manipur, his home state. He is busy setting up the Bhaktivedānta Institute for preaching in the scientific field in colleges and universities. He, Rūpānuga, Mādhava, Sadāpūta, Ravīndra Svarūpa, and Śubhānanda prabhus are the core members. He wanted to know if he could start up a <em>saṅkīrtana</em> party to fund a proposed college lecture program in the fall.</p>

<p>Prabhupāda discussed the idea with Tamal Krishna Mahārāja, who suggested that since his Rādhā-Dāmodara TSKP is already collecting and has a very solid university program, the Institute members could travel on their buses. This would solve their funding problems and guarantee many opportunities for the type of preaching they want to do.</p>

<p>Prabhupāda liked the idea. He wrote back suggesting Svarūpa Dāmodara accept the offer.</p>

<p>Svarūpa Dāmodara also suggested that the candidates for the titles of “Bhaktivedānta” and “Bhaktisārvabhauma” could submit a thesis on a Vaiṣṇava topic. Some of these scholarly essays could then be published into small books.</p>

<p>Prabhupāda liked the idea and told him, “Regarding publishing books, these books can be published by you and men in your rank. Ordinary men cannot write such books. So therefore if a book is written by one man with ‘Bhaktivedanta’ or ‘Bhaktisarvabhauma’ and it is of high quality, then it may be considered by me for publishing.”</p>', '', '1976-02-11', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- February 12th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'February 12th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Today is the appearance day of Lord Varāha. There is no fast.</p>

<p>During his massage Prabhupāda talked about his Godbrothers. He is of the opinion that one day the Caitanya Math and others will want to amalgamate with us because they are not able to maintain their buildings and programs properly. He suggested that either we could jointly manage or we would manage and they would run the <em>maṭha</em>. Or we could simply supply their financial necessities and jointly preach. Prabhupāda said it would be ideal if their Indian devotees and our Western devotees went village to village to preach together.</p>

<p>Prabhupāda recalled that when he visited his Guru Mahārāja at Rādhā-kuṇḍa in 1935, Śrīla Bhaktisiddhānta told him of a “blazing fire” that would occur in the Gaudiya Math and how he wanted to rip up the marble in the Bhag Bazaar temple and use it to sell books. Prabhupāda said that this was when he understood how his Guru Mahārāja could be pleased. He explained that the fight for control of the <em>maṭhas</em> that occurred immediately after Śrīla Bhaktisiddhānta’s disappearance was the first <em>aparādha</em>. It was <em>guror-avajṣā</em>, disobeying the orders of the spiritual master. Since then many more offenses have been committed.</p>

<p>He remarked that his Godbrothers are now useless, because instead of combining together to preach vigorously and defeat Tīrtha Mahārāja’s cunning, they were all simply scheming how to become the next <em>ācārya</em>. Thus they could not unite successfully. They all had the same disease that infected Tīrtha Mahārāja. Śrīla Bhaktisiddhānta never said that one man would be the next <em>ācārya</em>. Otherwise, why did he not directly nominate one? Śrīla Prabhupāda said that some Godbrothers claimed that Bhaktisiddhānta Sarasvatī indirectly indicated Tīrtha should be the next guru. But Prabhupāda said this was just like the impersonalists, who cull indirect meanings from straightforward instructions. What Bhaktisiddhānta Sarasvatī did order was that a twelve-man Governing Body Commission be formed in his absence. But they ignored him.</p>

<p>Prabhupāda’s comments were candid and revealing. It is apparent that among his Godbrothers, Prabhupāda stands out as the one who truly desired to please his Guru Mahārāja by vigorously spreading Lord Caitanya’s movement all over the world. As Śrīla Prabhupāda himself often says, <em>phalena paricīyate</em>, the value of something is judged by the fruit it produces.</p>

<p class="verse">* * *</p>

<p>Gaura Govinda Swami sent a letter from Bhubaneswar requesting to be excused from coming to Māyāpur as Prabhupāda suggested in his last letter. He has managed to construct a small brick-and-thatched cottage on our land there and is getting some help to establish ISKCON from some of the local people. Now he has to submit plans to the municipality before he can begin temple construction.</p>

<p>Prabhupāda excused him from attending the festival and offered his full blessings for his project. He told him if he works sincerely, he will certainly be successful. He suggested that he support himself by translating and publishing our books into Oriyan, the local language.</p>

<p>Prabhupāda also sent a letter to Saurabha in Bombay, requesting him to provide Gaura Govinda with suitable plans for the proposed temple complex.</p>', '', '1976-02-12', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- February 13th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'February 13th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Today is Lord Nityānanda’s appearance, a half-day fast. Nityānanda Prabhu liked <em>urad dāl</em>, so this was one obvious preparation that was made for His feast.</p>

<p class="verse">* * *</p>

<p>Pṛthu Putra Swami reported by mail from Kanpur that he is having good success in his preaching work. He is regularly holding programs in the homes of prominent citizens.</p>

<p>He suggested that Prabhupāda attend the upcoming Kumbha Melā festival to be held at Allahabad in February 1977. He mentioned that many people still remember Prabhupāda’s attendance at the Māgh Melā five years ago. He also offered some mellifluous prayers to Prabhupāda, comparing him to Śrī Kṛṣṇa’s flute because it is through him that we receive the words of Lord Kṛṣṇa.</p>

<p>Prabhupāda appreciated his sentiments. He asked Pṛthu Putra to go ahead and book a suitable berth at the Kumbha Melā.</p>

<p class="verse">* * *</p>

<p>This evening we were very happy to hear Prabhupāda say that he has been feeling well for the last two days.</p>

<p>Nandarāṇī regularly makes fresh batches of <em>rasagullās</em>, which Śrīla Prabhupāda keeps in a jar next to his desk. He has been taking a little milk with rock candy along with a half, or sometimes a whole, <em>rasagullā</em> and also a little <em>sandeśa</em>. His strategy of taking his milk in solid form seems to be working, as his strength is increasing.</p>

<p>In the evening, I came in with a cloth to wipe his desk top after he had eaten some <em>rasagullā</em>. There was a small pool of sugar water on the glass top, and many tiny ants had surrounded it.</p>

<p>As I carefully flicked the ants away with the cloth in order to wipe up without harming them, Śrīla Prabhupāda sat and watched. He looked first at me, then at the ants, then back again at me. “Formerly you would have killed them,” he said, smiling. His comment was as revealing as it was true. My mind flashed back to the days as a young boy when I had delighted in pouring scalding hot water down the nests of ants. I blushed with embarrassment as his observation reminded me of this dark episode in my past. Prabhupāda saw my flushed face, and his smile broadened.</p>

<p>Seeing his pleasure at my reformed character, I reflected how it must be the same as the happiness that Nārada Muni must have felt when transforming the hunter Mṛgāri. A sense of deep gratitude surged through me as I contemplated my good fortune at having also met such a wonderful spiritual master.</p>', '', '1976-02-13', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


END $$;
