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


  -- February 14th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'February 14th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>The roof is a convenient place for Śrīla Prabhupāda to take his morning walk. Its sizable 45-foot width by 150-foot-long expanse is large enough for him to get sufficient exercise without having to leave the building. It also limits the number of devotees who accompany him to just a few senior men. The panorama from the roof is magnificent. From that single vantage point, Prabhupāda can view what is going on within our entire compound. The perimeter of the roof is profusely decorated with potted plants and <em>tulasī</em> trees, creating a pleasurable, natural ambience.</p>

<p>A peculiar event has been occurring each morning. Just after Prabhupāda arrives on the roof, a very large black bee appears. It flies around Prabhupāda and his party a few times, as if in circumambulation. Then it comes to rest atop a small concrete spire marking the spot where the Deities stand in the temple room, four floors below. Tamal Krishna Mahārāja today remarked that it appears to be just like one of the black bees described in <em>Kṛṣṇa</em> book, which constantly fly around Lord Śrī Kṛṣṇa in glorification of His Supreme Personality. He said that now it seems that this particular bee is also coming to offer his respects to Śrīla Prabhupāda.</p>

<p>Prabhupāda appreciated his sentiments. He even stopped to inspect the bee for a minute before it flew off.</p>

<p class="verse">* * *</p>

<p>Śrīla Prabhupāda called in Hridayānanda Mahārāja to discuss the Māyāpur temple management with him. He is becoming increasingly concerned that things are not being managed properly, especially since Bhavānanda Mahārāja left to join the boat party. Hridayānanda volunteered the services of Mahāvīra dāsa, the Canadian <em>sannyāsa</em> candidate residing in Brazil. He said that Mahāvīra had considerable managerial experience and he does not have any pressing engagement at present.</p>

<p>Mahāvīra was called and after a brief discussion Prabhupāda agreed he could begin helping immediately.</p>

<p class="verse">* * *</p>

<p>Bhagavān sent a very encouraging letter from France. He reported that they are opening a new center in Belgium in order to facilitate book distribution. He also stated that the Dutch <em>Bhagavad-gītā</em> is being composed, and many, many books are being sold throughout his southern European zone.</p>

<p>He related some amazing <em>saṅkīrtana</em> stories from France, where they sell books mainly door-to-door. “One devotee went into a hospital and the nurses dressed him up in a white surgeon’s outfit, and he distributed Gitas to the doctors. One nurse even took some Gitas from him, and while he went to the other floors she sold four big Gitas to the patients.</p>

<p>“Another devotee went to a factory and the foreman took orders from all the workers. Later, when the devotee returned to the factory, the foreman had distributed twelve big Gitas for him!”</p>

<p>Bhagavān also suggested some innovations in the forthcoming French edition of <em>Śrīmad-Bhāgavatam</em> Canto One, which will go into production shortly. He plans to remove the painting depicting the creation from the front cover and put it inside on the end papers. He wants to put a painting of Kṛṣṇa and Balarāma on the cover, which he thinks will help increase the door- to-door sales.</p>

<p>Prabhupāda was all smiles hearing his report. Nothing pleases him more than news of his books being sold or news of how the people of the world are appreciating them. He approved the idea for a new cover and told Bhagavān his ideas were very good. He said that Bhagavān should sell books in huge quantity and then print again.</p>

<p>However, not every GBC man is experiencing such success. Brahmānanda Swami sent yet another disheartening report.</p>

<p>Although he is working hard, fulfilling many roles as GBC, Nairobi temple president, life membership director, correspondence secretary, and so on, he seems increasingly despondent in his preaching attempts in Africa. He has major problems to deal with and few devotees to help him. Nanda Kumāra Swami is there, but he is untrained and cannot cope with more than just the <em>pūjārī</em> work and cooking.</p>

<p>Because of his vast responsibilities in Africa and all the problems he has to face there, he expressed his inability to attend the festival in Māyāpur this year. Out of the seventeen devotees in Africa, only five have missionary visas. The rest will have to leave due to a change in immigration laws. He said most of the local men that had joined have now left, stealing practically everything of value as they went.</p>

<p>“So the question comes to mind,” he wrote, “Why are we here? At least I have little hope that the Africans will ever take seriously to Krsna consciousness.” Brahmānanda said that their primary field for preaching is among the Indian community, but they are also being forced to leave by the government.</p>

<p>He gave a very bleak overview of the potential for preaching in the entire continent. “This is really a disturbed part of the world and offers very little opportunity to spread our Movement. Americans cannot travel to the Congo or Uganda. We are already banned in Zambia. Tanzania has refused our attempt to register, and I have been arrested twice there. Ethiopia, from where I have just returned in December, is very tense and going Communist very rapidly. Mozambique just had a revolution, there is open war in Angola. Our men just returned from Sudan which is incredibly poor and destitute, as so is Chad, Central Africa Republic, etc. Only Nigeria seems to offer any opportunity of establishing a center. All the other GBC’s have civilized areas of the world that are developed, to spread this Movement.”</p>

<p>There were two bright spots though. He has paid off $1,860 from his BBT debt of $12,000. And in Mauritius a small band of <em>brahmacārīs</em> are being well received and are preaching enthusiastically all around the island.</p>

<p>Prabhupāda was sympathetic, but purposeful. In his reply he encouraged Brahmānanda to work vigorously and continue with his efforts to preach. He also suggested he base himself in Mauritius, which Prabhupāda described as “a nice place by the sea.” As for whether he should remain in Africa or not, Śrīla Prabhupāda said that will have to be discussed by the GBC.</p>', '', '1976-02-14', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- February 15th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'February 15th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>In this morning’s class Śrīla Prabhupāda described his ambitious plans for showing the higher regions of the universe in the Vedic Planetarium he’s proposed for Māyāpur.</p>

<p>“There is a Siddhaloka. We shall show how this planet works, Siddhaloka. The description of the Siddhaloka is there in the <em>Śrīmad-Bhāgavatam</em>. The Siddhaloka persons, they can go from one planet to another without any machine, or airplane. Like the yogis, those who are perfect yogis, they can go from one place to another without any vehicle. There are many yogis still existing. They take bath in four <em>dhāmas</em>—in Hardwar, in Jagannātha Purī, in Rāmeśvaram. And similarly... yogis can do that. They attain <em>aṣṭa-siddhi</em>, eight kinds of perfection. So the Siddhaloka means they are born <em>siddhas</em>. They haven’t got to practice this mystic yoga system.”</p>

<p>To illustrate this point he gave the simple, effective example of some <em>siddhas</em> that live within our immediate experience. He pointed out how birds and insects can fly automatically, but we cannot; we have to create so many big machines.</p>

<p>Prabhupāda’s idea in having a planetarium is to show that the statements made in the Vedic scriptures are authentic and based on scientific fact, not simply mythology, as commonly misunderstood. “There is no question of disbelieving,” he said. “It is not to be rejected, ‘Ah, there cannot be any... This is unbelievable.’ We have got this information from the <em>śāstra</em>s. We are staunch believer: ‘Yes there are <em>siddhas</em>.’ That is called theism. One who believes in the statements of <em>śāstra</em>.</p>

<p>“Very highly intelligent persons, thoughtful persons, philosophers, scientists, mathematicians—they are called also <em>muni</em>. They came also to satisfy the Lord. Not these ordinary <em>munis</em>, but very exalted munis and <em>siddhas</em> from Siddhaloka.</p>

<p>“There are many <em>lokas</em>, Caraṇaloka, others. They are all described. So if there is chance, we shall present these <em>lokas</em>, how they are situated, where they are situated, how they are moving, how the sun is moving around them. The sun is not fixed up; sun is moving.</p>

<p>“All these things, we have got such dream to show. If there is opportunity, we shall do. The modern scientists or astronomers, they say, ‘Sun is fixed up. The earth is moving.’ So we don’t say that. It has got its orbit. So there are so many things to be known still from Vedic literature, it is not yet unfolded, but we are trying.”</p>

<p class="verse">* * *</p>

<p>During his massage, Śrīla Prabhupāda heard a letter from Jaśomatīnandana in Ahmedabad. He is preaching steadily, has a rented house for the next three months, and is beginning to make life members.</p>

<p>However, his main focus is on publishing transcendental literature. He has plans to print the <em>Bhagavad-gītā</em> in three parts, and he is beginning to collect subscriptions to a monthly Gujarati edition of <em>Bhāgavata Darśana</em>, the Indian equivalent of <em>Back to Godhead</em> magazine. He described a fairly elaborate idea for raising thousands of subscriptions, even before the magazine comes out.</p>

<p>Prabhupāda was extremely pleased to hear about his preaching efforts. “I am very pleased with your monthly Bhagavata Darsana. That is a solid program. Please continue it steadily.</p>

<p>“Yes, I approve your distribution ideas, namely subscriber agents, news agents. The subscription drive is a solid program. And if you regularly publish and get registered, you can get a one or two paisa charges postal concession. Also in the future there are many cities such as Bombay, Surat, and Calcutta with large numbers of Gujaratis, you may arrange for getting subscriptions there.”</p>

<p>A letter from Mike Darby, a high school student in West Virginia, bore ample testimony to the efficacy of reading Śrīla Prabhupāda’s books. He has written a term paper for one of his high school classes based on the teachings contained in <em>Caitanya-caritāmṛta</em>. In order to continue his work, he requested a personal interview with Śrīla Prabhupāda next time he is in America. He warmly expressed his appreciation. “I have read most of your books on transcendental science and have enjoyed them very much. No, I have not just enjoyed, but tried to base my life on their teachings. What you have written is so perfect because this knowledge has been passed down from the Supreme Lord Sri Krsna.”</p>

<p>Śrīla Prabhupāda is always happy to hear from grateful recipients of his books. He works literally day and night, tirelessly, only for this. If someone reads his books and understands that Kṛṣṇa is God and everyone is meant to serve Him, then, as he often says, his mission is a success.</p>

<p>He told Mike to come see him later this year when he next tours America.</p>

<p class="verse">* * *</p>

<p>Hridayānanda Goswami and Subhāga prabhu left for Bangladesh today to examine the property being offered to us there. Prabhupāda doesn’t plan to go there personally, but he said if the offer is suitable to our needs we could send some men there to develop the place.</p>

<p>Sudāmā Mahārāja came back from his travels on the Nitāi Pada Kamala boat. Gurukṛpa Swami, who arrived early in the morning, went to join it for a few days after hearing how successfully they are faring.</p>

<p>The devotees on the boat program have been received enthusiastically wherever they go. After docking at a village, they take Śrī Śrī Gaura-Nitāi ashore and go on a procession through the village, door to door. All the villagers give a rupee and some foodstuffs, and in return they receive a <em>Gītār-gāna</em>. In this way hundreds of books and large amounts of <em>prasādam</em> are being distributed. Everyone traveling on the boat is very enlivened, especially the <em>gurukula</em> boys.</p>

<p>Śrīla Prabhupāda sent Jayapatāka Swami to Calcutta to meet Mr. Chaudhuri. He will help Jayapatāka approach government officials with our request for acquiring land in Māyāpur for our proposed Vedic City.</p>', '', '1976-02-15', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- February 16th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'February 16th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Last night Prabhupāda had <em>rasagullā</em> and <em>nimkins</em>, tasty homemade biscuits, which are offered to the Deities each evening. He spilled some <em>rasagullā</em> juice on the mat; immediately hundreds of ants came to enjoy. This has happened a few times. Each time as I clean up, Prabhupāda stops to watch me and makes some pertinent philosophical remark.</p>

<p>Prabhupāda often likes to use such simple real-life examples to illustrate philosophical points in his classes. I felt honored when this morning he mentioned me and the ant episode to convey a point he was making in his lecture.</p>

<p>In the verse Prahlāda Mahārāja clearly stated that the Lord is not impressed by any of our material qualifications. He can be satisfied only by devotional service, which even Gajendra the elephant could offer.</p>

<p>Śrīla Prabhupāda described how modern men think themselves very intelligent by building atom bombs or by gaining wealth. However real intelligence is going back home, back to Godhead. “To get some money by hook and crook. That is not intelligence. That intelligence I see, I was telling Hari-śauri, I was explaining that, that even a small ant, as soon as there is a drop of sugar juice, immediately, within a second, hundreds of ants will come: ‘Here is a drop of sugar juice.’ This is nature’s study. This kind of <em>buddhi</em>, intelligence—how to eat, how to sleep, how to have sex, and how to defend—even in the ant is there. That is not <em>buddhi-yoga</em>. The real <em>buddhi-yoga</em> is how to be engaged in devotional service of the Lord. How to become first-class devotee of Kṛṣṇa, that is called <em>buddhi-yoga</em>. How to go back to home, back to Godhead. That is <em>buddhi</em>.</p>

<p>“Everyone has got intelligence. Even the ant has got intelligence. We study sometimes. The sparrow, he has got intelligence. But the perfect intelligence is there when one is searching after the Absolute Truth.”</p>

<p>In conclusion, he explained that material achievement and opulence are not needed in order to approach God. Only the favor of guru and Kṛṣṇa is required.</p>

<p>And with Śrīla Prabhupāda as our guru, clearly we are well favored.</p>

<p>“So don’t be disappointed,” Prabhupāda said, “that ‘Because I am poor, I cannot become devotee.’ Everyone can become devotee, even the children. Just see how the children are dancing. They are chanting. They are offering obeisances. That is <em>bhakti-yoga</em>. Everyone can become a devotee, provided he is properly guided. That is required.</p>

<p>“Kṛṣṇa says, ‘I’ll give you intelligence.’ If one is working under the direction of the spiritual master with love and faith, then Kṛṣṇa, from within as <em>caitya-guru</em>, the guru within the heart, He’ll help you. And He’ll send you bona fide guru to help you externally. So both ways, you’ll be helped, and you’ll become like Prahlāda Mahārāja. Thank you very much. Hare Kṛṣṇa.”</p>

<p class="verse">* * *</p>

<p>Śrīla Prabhupāda strongly reprimanded the temple managers this morning. There was no running water in the building again for the third consecutive morning.</p>

<p>The bathroom water system is gravity fed from holding tanks on the roof. The pumps that fill the tanks have to be turned on by hand. As the festival approaches, more and more devotees are arriving, putting a greater demand on the system. But no one seems to be paying attention.</p>

<p>Prabhupāda also corrected Mahāvīra for telling everyone that he is now the temple president and manager of Māyāpur. Mahāvīra has set himself up in an office. Several devotees already are complaining that he is asserting himself as the supervisor of the entire project, demanding that they follow his instructions, although he knows very little about how the Māyāpur management operates.</p>

<p>“First become expert in all departments before becoming manager,” Prabhupāda told him. “You have to be servant of everyone before you can manage. One cannot demand respect.”</p>

<p class="verse">* * *</p>

<p>More and more visitors are coming for <em>darśana</em> in the evening, and Prabhupāda has worked out a new system to facilitate them. Most of the guests are simple villagers. They come and sit in his room and simply stare.</p>

<p>So Prabhupāda told us to stand at the door and give out sweets. The guests should not be asked directly to come in, but they also should not be refused entry. If they wish to enter his room they can be escorted to the balcony. There they will be given a seat and <em>prasādam</em>, and then asked to fill in a form giving their name and business. Then Prabhupāda will call them. This, he said, is “screening without a screen.”</p>

<p>Those who simply wish to look can come to the door, offer their <em>praṇāmas</em> and receive some <em>prasādam</em>. They will then go away happy. Those who have something specific to discuss will gladly wait.</p>

<p>It is actually a botheration for Prabhupāda to give <em>darśana</em> to so many people, but he cannot refuse them. So he has decided on this procedure. It will satisfy the people and save him from criticism.</p>

<p>Prabhupāda mentioned one well known yogi who, for the same reason, used to see the public only once a year. Prabhupāda said that he could not do that, but this new system would suffice as a good compromise.</p>

<p class="verse">* * *</p>

<p>Hansadūta has really taken Prabhupāda’s desire for village-to-village preaching seriously, and not just in India. A letter from him arrived today telling Prabhupāda that he has managed to purchase four Mercedes buses. Two of them are for use in India. The other two will be used in Germany, despite the current governmental difficulties in preaching there. Hansadūta expects the buses, which are carrying thirty devotees each, to arrive in Vṛndāvana by April 1st.</p>

<p>With his letter Hansadūta enclosed a flier advertising the impending traveling <em>saṅkīrtana</em> program. The flier is intended to persuade devotees to join their party. It has a picture of the four buses across the top and begins with the following heading.</p>

<p>PRABHUPADA’S WORLD SANKIRTANA PARTY</p>

<p>“Entangled in temple life? Burned out on sankirtana?</p>

<p>Then this new program is for you. Simply chanting and dancing and distributing Krishna prasadam.”</p>

<p>To further entice the devotees, it mentions that Śrīla Prabhupāda has promised to travel with the party. An attractive description of the recent tour of Gujarat is also given. His intention is to establish a regular overland bus route between Germany and India so that at all times of the year devotees will have the opportunity to participate in village-to-village preaching. The flier also mentions that a separate party under Gargamuni Swami is also now on its way to India with six Mercedes vans and thousands of dollars of preaching equipment.</p>

<p>Prabhupāda was very happy to see the eagerness and enthusiasm with which Hansadūta has applied himself to establish this preaching program. In his reply Prabhupāda confirmed his intention to participate. “Yes, with great pleasure I will accompany and we shall go village to village. I have seen the pictures, and the buses look very nice. They appear costly.”</p>

<p>Śatadhanya dāsa is in Tokyo. He sent a report explaining how he is working along with Trivikrama Swami to rectify the problems that have arisen there due to Gurukṛpa Mahārāja’s traveling party. Although the Nāma Haṭṭa <em>saṅkīrtana</em> party is enthusiastically collecting funds for the development of Māyāpur, their questionable collecting techniques have caused a barrage of bad publicity. Śatadhanya expressed his feelings that some professional public relations efforts will be required in order to restore our good standing with the Japanese immigration department.</p>

<p>Śatadhanya also mentioned that he and Trivikrama would like to open a temple in the city center. Until now, no real attempt has been made to establish a permanent center and recruit Japanese devotees. At present we have only one Japanese <em>brahmacārī;</em> but meanwhile Christian groups report very good results in recruiting local people.</p>

<p>Śrīla Prabhupāda wrote back encouraging him to try to rectify our position. He said that Trivikrama Swami is “well expert” in Japanese dealings, and if Gurukṛpa Swami is not needed there, he may be sent to Bangladesh.</p>', '', '1976-02-16', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- February 17th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'February 17th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Instead of going to the roof for his morning walk, Prabhupāda decided to inspect the construction site of the new building.</p>

<p>The work is going on at full speed, with hundreds of men digging, carting, shoring, and stacking. It is an impressive sight. The foundation stretches about 1,000 feet—the entire length of the northern boundary of our property. It will be an extremely long building, two stories high, and built in the same style as the main guest house with a wide veranda and decorative arches. They are building the two floors upon a high plinth, so if the Ganges floods, the rooms will not be affected.</p>

<p>When Prabhupāda asked what would be done with the plinth, Jayapatāka Mahārāja said it will be filled with dirt. Prabhupāda considered this a waste of valuable space; he instructed them to make it into a basement instead. That way there will be extra rooms for storage.</p>

<p>Śrīla Prabhupāda appeared satisfied with the progress of the work, and is hopeful that it will be habitable in time for the festival.</p>

<p class="verse">* * *</p>

<p>For class each morning Dayānanda is reading aloud from the unedited transcripts of the prayers of Prahlāda Mahārāja. While not grammatically correct, the Indian-English style of Prabhupāda’s translations have a unique charm and flavor of their own.</p>

<p>Today he read text ten of Chapter Nine: “Prahlāda Mahārāja continued to think that a <em>brāhmaṇa</em> who has qualified himself with all the brahminical qualities, twelve in number, as they are stated in the book known as <em>sanat-sujāta</em>, such a <em>brāhmaṇa</em>, if he is not a devotee and to the lotus feet of the Lord, he is especially lower than a devotee who is a dog-eater even. But his mind, words, activities, wealth, and life—everything—is dedicated to the Supreme Lord. Such a low person is better than a <em>brāhmaṇa</em> as above mentioned because such lowborn person can purify his whole family; whereas a so-called <em>brāhmaṇa</em> falsely in prestigious position cannot purify himself.”</p>

<p>Prabhupāda gave a long talk. At one stage he pointed out that in the Vedic civilization one’s position in human society is determined by what he eats. Generally the meat-eaters, especially pig- and dog-eaters, are considered the lowest, untouchable. But worst of all are those who feast on the cow.</p>

<p>“In India still, generally those who are meat-eaters, they take meat of such animals like goats, lambs, like that. And they never take cows’ flesh, because the cow is protected, <em>go-rakṣya</em>. So in the <em>Bhagavad-gītā</em>, even if you are meat-eater, don’t eat the cow. You can eat other animals: pigs, goats. But don’t eat cows’ flesh. That is very sinful.</p>

<p>“Why it is sinful? Because it’s a very, very important animal in the human society, very important animal. You get milk and milk products. Then your brain becomes very nice, memory sharpened. That is therefore important. Don’t eat.” But Prabhupāda said that in Kṛṣṇa consciousness it doesn’t matter what one’s background is, provided one has adopted the process of Kṛṣṇa consciousness.</p>

<p>“So here it is proof that dog-eaters, or pig-eaters, or any low-grade man is not prohibited to become a devotee. That is our Kṛṣṇa consciousness movement.</p>

<p>“They say that without becoming a Hindu or born in India, nobody can become <em>brāhmaṇa</em>, nobody can become <em>sannyāsī</em>. But here is the proof. In the <em>śāstra</em> the dog-eater is also highly praised. When? When he sacrifices everything, his body, his mind, his words, only for Kṛṣṇa. This is called <em>tridaṇḍa-sannyāsa</em>.”</p>

<p class="verse">* * *</p>

<p>Gurukṛpa and Hridayānanda Swamis arrived back from Calcutta. Hridayānanda Mahārāja has to wait for his visa to go to Bangladesh. Gurukṛpa Mahārāja paid only a quick visit to the boat before deciding to return to Māyāpur to take advantage of Śrīla Prabhupāda’s association.</p>

<p class="verse">* * *</p>

<p>During the massage today, Prabhupāda heard a letter and article entitled “Matter Comes from Life,” written by Mādhava dāsa, another of our Ph.D. scientists. The article, which will be published in <em>Back to Godhead</em> magazine, establishes scientifically that matter comes from life. Mādhava is confident that this point can be proven to the scientists by utilizing new-found experimental evidence, documentation, and many logical arguments.</p>

<p>He also submitted a list of four questions that he hoped Prabhupāda would answer because, as he put it, “You are sat, cit, ananda and are thus full of transcendental knowledge.”</p>

<p>The first question was, “Jung has said that matter is just a symbol (or name) that we apply to Reality, but we may as well call it spirit or consciousness or any other name. Is this view consistent with our philosophy?”</p>

<p>Śrīla Prabhupāda replied, “Matter originally is spirit. And when spirit is not distinctly understood, that is matter. Just like a tree is also a manifestation of spirit soul, but the consciousness is covered. When the tree is cut, it does not protest. But the moving entity has stronger consciousness than the tree. There is consciousness in the tree though. Also consciousness in a dormant state is matter; consciousness in a completely developed state is spirit. Matter is the symbol of undeveloped consciousness.”</p>

<p>His second question was in regard to the function of the mind. “Does thinking occur in words, pictures, or what?”</p>

<p>“Thinking is a subtle form of matter,” Prabhupāda answered. “Just like it says in Bhagavad-gita: bhumir apo ’nalo vayuh... Like the ether is subtle, the mind is more subtle—subtle form of matter.”</p>

<p>The third question concerned the external world, which we perceive only through our senses, and thus the mind, and, ultimately, the consciousness. “What does this say about where things are actually happening? Is it in the mind, out there in the world, or in the spiritual world?”</p>

<p>Śrīla Prabhupāda wrote, “Everything is in the spiritual world. Kṛṣṇa is the sum total of spirit, and everything is coming from Him. Matter, spirit, everything comes from Him. He is the Supreme Life, the origin of spirit and life. Therefore matter emanates from life. Nityo nityanam... He is the Supreme Consciousness of all other consciousnesses.”</p>

<p>Finally Mādhava asked for direction on how to prove that the moon is farther away than the sun.</p>

<p>“The moon is situated 1,600,000 miles above the sun,” Prabhupāda replied. “You may refer to the Fifth Canto and read carefully.”</p>

<p>Prabhupāda is extremely eager for this scientific preaching to be developed. He told Mādhava that it must be recognized that we are not just a religious sect.</p>

<p>Recently, Mādhava taught a course at the prestigious MIT, in Boston, entitled “Truth Beyond Relativity.” The course was based on understanding the three aspects of the Absolute, and it was so well received that eight scientists took copies of <em>Bhagavad-gītā</em>. This kind of news delights Prabhupāda, and he ended his reply by telling him, “I am very much pleased with your program. Thank you very much.”</p>

<p>Prabhupāda also stated to Madhava that he wants our ISKCON scientists to publish their research articles in <em>karmī</em> science magazines as well. “If they don’t accept what we say, we will go on explaining. If they do accept, then that is their benefit and our victory.”</p>

<p>Regarding his answer to Mādhava’s question about how to distinguish between spirit and matter, I questioned Śrīla Prabhupāda further on it in mid-afternoon.</p>

<p>He told me, “Yes, everything is Kṛṣṇa’s energy. Kṛṣṇa is the Supreme Spirit, and everything is coming from Him. Kṛṣṇa is everything, <em>sarva-bhūta-stham ātmānam</em>. Just like skin and fingernail—both grow from the same source. Yet in one there is feeling and in the other there is none. One can be cut and the other cannot. But it is the same energy, coming from the same source. Matter comes from light, and that light is the <em>brahmajyoti</em>, which is Kṛṣṇa’s bodily effulgence.”</p>

<p>As the massage continued, Prabhupāda listened to a compilation of the best reviews of his books, including ones from Oxford and Harvard Universities.</p>

<p>Hearing these reviews, he became very enlivened. He enthusiastically told Dayānanda and Hridayānanda Mahārāja that he is eager to publicize his books here in India. He wants a special office set up exclusively for this purpose. He said that he will give personal direction if a good man would take up the engagement. Dayānanda was so inspired, he immediately volunteered himself. And Prabhupāda accepted.</p>

<p class="verse">* * *</p>

<p>Acyutānanda and Yaśodānandana Swamis arrived in the evening from South India. They gave Śrīla Prabhupāda an encouraging account of their successful preaching activities in many cities. The leaders of the Rāmānuja- and Mādhva-sampradāyas received them well. They even got letters of appreciation from them commending the work that Śrīla Prabhupāda is doing and clearly stating their acceptance of his disciples as genuine Vaiṣṇavas.</p>

<p class="verse">* * *</p>

<p>Prabhupāda told us today that everyone should shave up every <em>pūrṇimā</em>, or full moon.</p>', '', '1976-02-17', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- February 18th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'February 18th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>With so many <em>sannyāsīs</em> around I am constantly being asked to run here and there on errands. This distracts me from my service to Śrīla Prabhupāda, but it is difficult to refuse their requests. Therefore I asked Śrīla Prabhupāda during his walk what I should do. His simple quote made things very clear. “Everybody’s servant is no one’s servant.” That settled my mind. I decided to tend to him alone, and the <em>sannyāsīs</em> will have to make their own arrangements.</p>

<p>There is concern among the <em>sannyāsīs</em> that some of the new <em>sannyāsa</em> candidates are not actually qualified for the renounced order. One candidate in particular, Mahāvīra prabhu, is under question.</p>

<p>Without naming any names, Jayapatāka Mahārāja brought up his doubt to Śrīla Prabhupāda. “<em>Brahmacārīs</em> don’t like to take instructions from the elder devotees. And then they want to take <em>sannyāsa</em>, so they think they can be independent and give orders themself and not listen.”</p>

<p>Prabhupāda replied that therefore <em>sannyāsa</em> should not be given all of a sudden. The problem is that they want to become <em>sevya</em> instead of <em>sevaka</em>—served instead of servant.</p>

<p>With a few brief words he exposed the fundamental problem. With a mixture of humor and irony Prabhupāda said, “Yes. And, ultimately, God. When everything failure, then to become God. Everyone, if he wants to become a master, that is materialism.”</p>

<p class="verse">* * *</p>

<p>A striking analogy was given in the <em>Śrīmad-Bhāgavatam</em> verse this morning explaining the relationship between Kṛṣṇa and His devotee. If a face is nicely decorated, so its reflection in a mirror will also be. Prabhupāda explained that if Kṛṣṇa is satisfied, the devotee, as His reflection or reliant part and parcel, is also automatically satisfied. Since Kṛṣṇa is complete in Himself, whatever service we do to please Him is actually for our own benefit.</p>

<p>Śrīla Prabhupāda used our attempts to build a big temple here in Māyāpur as a practical example to illustrate his point, giving us deeper realizations of the nature of our work. “Everything belongs to Kṛṣṇa. Just like we are constructing this temple. We are feeling that ‘I am constructing. We are constructing.’ But actually it is Kṛṣṇa’s.</p>

<p>“The bricks, the iron, or the cement, or anything that we are collecting, that is Kṛṣṇa’s property. The brick is not your property. The earth is not your property. You are taking Kṛṣṇa’s earth, and you are making it a brick. Still, it is Kṛṣṇa’s property. But the endeavor, the energy, which you are giving to Kṛṣṇa, that is taken into account. ‘Oh, he is working for Me. He wants to give Me something.’ That Kṛṣṇa consciousness is important.</p>

<p>“Otherwise by His will He can construct 16,000 palaces for His queens. What this tiny temple will satisfy Him? But still, He’s satisfied. ‘Oh, you have done so much? Very good.’ Recognized. Kṛṣṇa has created the whole universe. He doesn’t require any endeavor. Simply by His breathing, many millions of Brahmās are coming out. And each Brahmā is creating a universe.</p>

<p>“So to create a temple, He doesn’t require our help. He can create millions of temples by His will. There are already. So we should always remember this, that Kṛṣṇa does not require our service. But if we give some service to Kṛṣṇa, that is our benefit. This is the formula.”</p>

<p class="verse">* * *</p>

<p>Gopāla Kṛṣṇa sent a letter enclosing samples of the new <em>Śrīmad-Bhāgavatam</em> printed in India on government concessional paper. Prabhupāda was extremely pleased with him for finally getting his books into print here in India. Many other Hindi and English books are to be printed in Delhi at a cost of only ten rupees each for the best quality paper. Bhārgava is production manager, and Amogha will help with university sales.</p>

<p>In response to Gopāla Kṛṣṇa’s requests, Prabhupāda asked Dayānanda to contact Rāmeśvara in Los Angeles. He wants Rāmeśvara to send to India, via the devotees coming for the festival, numerous color separations, the booklet <em>The Krishna Consciousness Movement is Authorized</em>, reviews by professors, and a complete list of universities and colleges that have standing orders for his books.</p>

<p>Śrīla Prabhupāda countersigned Dayānanda’s letter, thus clearly declaring his strong desire for this new phase of preaching in India. “Śrīla Prabhupāda’s scheme is to push these books on a gigantic scale here in India. He is personally organizing and motivating the project. We have especially experienced here that His Divine Grace smiles and is very pleased to hear the comments by the professors. These books are especially Prabhupāda’s glory, and those comments prove that Prabhupāda’s glory and the philosophy of Kṛṣṇa consciousness is being appreciated by the intelligent men of the West.</p>

<p>“Prabhupāda recently said, ‘I know those that are sane, they will accept. No one is distributing so much quantity of religious books. Therefore I challenge all these fools and rascals. After eighty years no one can expect to live long. My life is almost ended... it is ended. So you have to carry on. And these books will do everything.... Simply by bluffing words, these bogus gurus and yogis are nothing. But when the people read our books, then they will get good opinion. Everywhere (India esp.) the book demonstrations and opinions (Professor’s comments) must be widely spread.’</p>

<p>Devotee: ‘Now we are going to flood India with your books just like they have done in America!”</p>

<p>Prabhupāda: ‘Thank you, that I want, then you will be first-class. Organize book distribution here, and I shall be very much obliged.’”</p>

<p class="verse">* * *</p>

<p>Jayapatāka Mahārāja returned from Calcutta and reported that his meeting with the government ministers, arranged through Mr. Chaudhuri, was very successful. The land acquisition should be no problem and can be done quickly.</p>

<p>He explained that land acquisition works in this way: if the government is convinced that a major project is important or beneficial enough for the district, then an average price for a parcel of land for the last ten years is calculated. The land owners of the plots required must sell at that price. This prevents artificial inflation of land values, which is to no one’s benefit. Initially, we are asking for only twenty-three acres, and we will ask for more later.</p>', '', '1976-02-18', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- February 19th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'February 19th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>The morning walk was on the roof again, but it has become too hot for Prabhupāda to have his massage in the sun, even when a breeze is blowing. It is, however, still very pleasant to be on the roof during the morning hours, and Prabhupāda seems to enjoy the simple facilities. Because of the heat, he sits in the shade atop the wide, wooden bench in the lee of the room to receive his massage. But for bathing he sits in his <em>gamchā</em> on a <em>choṅki</em> in the sunshine and washes off the oils from a bucket of solar-heated water.</p>

<p>He still takes his meals in the sparsely furnished room. He has a couple of hours entirely to himself, while I stay close by in the adjoining room. Then he goes back down to his quarters at about four o’clock to greet guests and meet with devotees.</p>

<p class="verse">* * *</p>

<p>Because the weather has become quite hot, some visiting devotees are buying flavored ice on sticks from the stalls in front of the temple. Jayapatāka Swami asked Prabhupāda if we can make our own iced sherbet drink for the Gaura Pūrṇimā festival. He’s afraid that the devotees will become ill because the local confection is generally made from bad water.</p>

<p>Prabhupāda was disturbed to hear that devotees are eating outside. He quite emphatically said, “No one may buy anything from the market. If they eat these things they will fall down! No one should eat anything not offered to the Deity.”</p>

<p class="verse">* * *</p>

<p>Prabhupāda’s son, Vrindavana Chandra, and also his sister, known affectionately to the devotees as Pisimā, Bengali for ‘Aunty,’ arrived in the afternoon. She plans to stay for the whole festival.</p>', '', '1976-02-19', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


END $$;
