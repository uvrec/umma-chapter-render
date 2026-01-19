-- ============================================
-- TD Volume 1, Chapter 2 - Verses
-- ============================================

DO $$
DECLARE
  v_book_id uuid;
  v_canto_id uuid;
  v_chapter_id uuid;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = 'td';
  SELECT id INTO v_canto_id FROM public.cantos WHERE book_id = v_book_id AND canto_number = 1;
  SELECT id INTO v_chapter_id FROM public.chapters WHERE canto_id = v_canto_id AND chapter_number = 2;


  -- December 7th, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'December 7th, 1975',
    '', '', '', '',
    '', '', '', '',
    E'<p>One of Śrīla Prabhupāda’s foremost desires is to develop a first-class <em>gurukula</em> system. He was personally involved in the development of the school in Dallas, ISKCON’s first <em>gurukula</em>, and now here.</p>

<p>Recently in Dallas some difficulties have arisen in complying with local Texas laws regarding dormitories. Jagadīśa dāsa, the GBC for that area, was forced to look for another facility that would conform to government standards. In a previous letter Jagadīśa sent Prabhupāda some information regarding a new site for the school in another city. Prabhupāda approved the idea, but today another letter arrived retracting the proposal because of hostile reactions from the local residents. Jagadīśa proposed that the school remain in Dallas and they just build a new dormitory on the existing site. Prabhupāda encouraged him to stay in Dallas, saying that from the beginning he had considered the facilities there to be ample. He is anxious to see the school firmly established and stable, as he doesn’t want the children’s education disrupted.</p>

<p>Here in Vṛndāvana, Bhagatjī, who lives a few houses away from our <em>āśrama</em>, arranged to purchase land for our <em>gurukula</em> and gave one <em>lakh</em> rupees for building the school. Bhagatjī has also come forward to help manage the temple. Pleased by his efforts, Prabhupāda meets with him almost every day.</p>

<p>On Rādhāṣṭamī, during his last Vṛndāvana visit, Śrīla Prabhupāda laid the foundation stone for the<em>gurukula</em>. Construction of the building on the land next to the temple has already begun. Now he is keenly following developments and regularly discussing the plans.</p>

<p>One of Prabhupāda’s favorite quotes is “child is the father of man,” meaning the future of the world lies with its young. Therefore, good training and education are essential for a peaceful population and trouble-free world. He often expresses his conviction and happiness that the movement he has begun for respiritualizing the world will go on because “the young people of your country have taken it up.”</p>

<p>In this respect, the young Prahlāda Mahārāja’s instructions are particularly important for us. This morning’s <em>Śrīmad-Bhāgavatam</em> verse (7.6.5) spoke precisely on this theme of taking full advantage of one’s youth for spiritual attainment. The translation was, “For this reason, a person who is fully competent to distinguish wrong and right while keeping himself in material existence, <em>bhāvam aśritah</em>, must endeavor for achieving the highest goal of life so long the body is stout and strong and is not embarrassed by the dwindling condition of life.” Śrīla Prabhupāda commented, “Nobody wants to become old man, especially in this winter season. It is very difficult for old men. So, you have to accept <em>jarā</em> and <em>vyādhi</em>. Nobody can escape disease. When I am diseased there is a great struggle how to cure myself, go to the doctor, take good medicine, and so on. But we cannot check the diseased condition. Similarly we cannot check our old age, cannot check our birth, death. Therefore here it is said, <em>kuśalah</em>. <em>Kuśalah</em> means if you actually want benefit, because this kind of struggling has not given you any benefit,<em> tato yateta</em>, then you should endeavor for this. What is that? <em>Kṣemāyā</em>, for your ultimate benefit. And how long? <em>Śarīraà</em>. <em>Puruṣaà yāvan na vipadyeta puṣkalam</em>. So long you are stout and strong you should try how to become free from this bondage of birth, death, old age, and disease. Not that you keep this business set aside, ‘When we shall get old then we shall chant Hare Kṛṣṇa and become Kṛṣṇa conscious.’ That is not the meaning. Immediately.</p>

<p>“Prahlāda Mahārāja said that from the very beginning of life, when <em>kaumāra</em>—a small child, boy—from that age one should begin this <em>bhāgavata</em> life, or Kṛṣṇa consciousness. That is called <em>brahmacārī</em>, to teach <em>brahmācārya</em> from the very beginning of life. And when you are young, then you should work with more vigor and intelligence. At that time brain is very nice. Young man has got all the facilities. The machine is strong. This is a machine. So old machine cannot so work. So it is a great fortune for the young boys and girls of Europe and America that in this young life they are cultivating Kṛṣṇa consciousness. It is a very good fortune.”</p>

<p>There is a quality about Śrīla Prabhupāda that makes him utterly appealing to everyone. He relates perfectly to his youthful disciples although, materially speaking, we are two or three generations apart. Despite the vast difference between our cultural background and spiritual understanding, there are no barriers between us. He is sympathetic and has a seemingly perfect empathy with us. How he is able to relate to us in such a wonderful way was revealed soon after class.</p>

<p>We were talking in his sitting room about growing old, and at one moment Prabhupāda got up from his desk. His eyes shone brightly and he said simply and convincingly, “I am not an old man! I will never grow old!” We all laughed. Prabhupāda is a self-realized soul. He does not identify with his body, and he doesn’t see us as material entities either. He relates to us as one spirit soul relates to another. We are all meant to serve the Supreme. In that sense he does not perceive himself as superior to us, yet he always keeps the formal guru and disciple relationship intact. Prabhupāda’s humble service is to bring us back to Kṛṣṇa, and our humble service to Kṛṣṇa is to serve Śrīla Prabhupāda.</p>

<p class="verse">* * *</p>

<p>Prabhupāda derives great inspiration from the life of Prahlāda Mahārāja and often refers to his exemplary behavior when preaching. A recent letter from Yogeścandra dāsa requested Prabhupāda’s blessings for a party of eight men who are to collect funds for the Māyāpur temple. “You always have my blessings,” Prabhupāda replied. “The father always wishes that the son may be more successful than himself. This is the spiritual conception. If one is doing well, then the materialistic persons become envious and try to check his progress. This was actually so with Prahlada Maharaja. He was only five years old, he was preaching Krsna consciousness to his school friends, and the father Hiranyakasipu became so envious that he attempted to kill his five-year-old son in so many ways. Krsna consciousness is just the opposite. If someone is doing well then the attitude of the devotee is to give him all facility to go on and improve more and more.”</p>', '', '1975-12-07', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- December 8th, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'December 8th, 1975',
    '', '', '', '',
    '', '', '', '',
    E'<p>Prabhupāda is always concerned about our welfare—not just philosophically, but in many practical ways as well. For example, this morning was very cold; winter is really setting in. He remarked about it on his walk and then asked if the devotees are getting ghee on their <em>capātīs</em>. Akṣayānanda Swami replied that only the guests are given some because it’s expensive and not necessary for the devotees.</p>

<p>But Prabhupāda disagreed. He said that it is necessary in this season. In the cold weather the devotees must have a little extra ghee and grains. He recommended a mix of <em>channa</em> and <em>urad dāls</em> as being both palatable and beneficial—not too little and not too much. “Unnecessary <em>vairāgya</em>,” he said, “there is no need. We don’t approve that. <em>Yuktāhāra-vihārasya</em>. What you require for keeping health—but not to eat too much. But what is absolutely required must be done.”</p>

<p>Śrīla Prabhupāda is quite pleased with Harikeśa’s article, “Experimental Knowledge.” Last night he had him read it aloud. Then this morning as we walked, he asked him to reiterate some points for the other devotees to hear.</p>

<p>He injected some very amusing observations himself. Recalling his trip to South Africa he said there were many factories for chicken killing. “So I suggested that the egg, you can analyze. Find out the chemicals and create one egg. That was my proposal. “Motioning to Harikeśa, he said, “So he is going to create!” We all laughed as Śrīla Prabhupāda continued, “He’ll explain how to create egg from...”</p>

<p>“From chemicals,” Akṣayānanda Swami suggested.</p>

<p>And Jṣāna dāsa added, “And make chicken.”</p>

<p>Then Harikeśa described, “Calcium phosphate and a little sulphur for the yellow. Make some color and cover it in plastic and put it in an incubator, and let a chicken grow.”</p>

<p>“And you eat!” Prabhupāda concluded.</p>

<p>Akṣayānanda Mahārāja thought that would be a great article.</p>

<p>Prabhupāda stopped and said seriously, “My only regret is that these rascals are going as scientists and big men. Simply talk. They cannot create. It is very simple thing. Put some chemicals together, and if you know the chemicals, then why don’t you put it? And incubator put, then you don’t require to kill so many chicken.”</p>

<p>“Actually it’s a wonderful challenge,” Harikeśa agreed. “This big, big scientist, big, big brain...”</p>

<p>But Prabhupāda interrupted, “‘Big, big monkey, big, big belly. Ceylon jumping—melancholy!’ You do not know this? <em>Baro baro bandolel, baro baro peṭ, laṅkā dingate, matakare het!</em>”</p>

<p>We were all laughing as Prabhupāda went on, “This translation was done by one big professor of President’s College, Professor Rowe. So these professors required to learn Bengali, so he translated, ‘Big, big monkey, big, big belly. Ceylon jumping—melancholy!’”</p>

<p>Prabhupāda was extremely humorous, and his descriptive analogies perfectly fit. Scientists are always full of big talk, saying that life comes from matter and that it is just a combination of chemicals. Yet life is occurring everywhere at every moment, and still they can neither say what the combination is, nor can they reproduce it. Similarly, the big monkey companions of Hanumān were full of bravado and boasts, but when it came to jumping across the ocean from India to Lanka they were “melancholy.” Only Hanumān by the grace of Lord Rāma could do it.</p>

<p>Nevertheless, despite his often humorous critiques and sometimes general condemnations of the modern materialistic scientists, Prabhupāda cautioned us that any attempt to preach on a scientific basis must be done expertly. When Alanātha, a European devotee, told him of plans to publish a magazine in Sweden with articles challenging the material scientists, Śrīla Prabhupāda warned him. “Don’t write anything nonsense. It must be very solid. Otherwise you’ll be laughing stock. One must be confident before challenging others. In all stages he must be able to defend himself from the opposing elements. Then such challenge is all right. We are confident that this soul cannot be manufactured by any material combination. Therefore we can challenge. And we can defend ourselves in any stage.”</p>

<p>In class Prabhupāda continued to speak on the same topic. He said that modern civilization means to increase the killing. By scientific advancement modern man has become expert in killing the less fortunate—chickens, cows, babies—and even their own souls. The government is advertising “One, two, three—<em>bas!</em>” advising people to restrict the size of their families to a maximum of three by contraception or abortion. But those who have no control of their senses misuse their lives and everyone else’s. Prabhupāda explained how such people cannot imagine a life without sense gratification, wanting to eat, sleep, and have sex almost unlimitedly.</p>

<p>He recalled how in the early days of ISKCON in New York his neighbors would protest at the morning chanting. “In the beginning, in that Second Avenue 26, when our morning prayer was going on at seven, not very early. And so many other tenants, half-naked, would complain to the landlord. ‘Mr. Judah, what is this going on? What is going on? Stop it! Stop it! Stop!’ So Mr. Judah used to say, ‘No, no, they’ll not stop. I cannot say. You go to the police.’</p>

<p>“So sometimes police were coming to stop us, but we did not stop.”</p>

<p>This brought a laugh to the assembled devotees.</p>

<p>Śrīla Prabhupāda went on, “So <em>ajitātmānah</em>. The human life is meant for gaining victory over the senses. ‘No, better be victimized by the senses.’ This is modern civilization.”</p>

<p>He warned of the danger of becoming too attached to family life, which the <em>Vedas</em> compare to a dark well. He told us that in Vedic civilization it was compulsory that at age fifty one must give it up. Otherwise, one becomes an <em>ātmā-ghāṭam</em>, a killer of the soul.</p>

<p>There are an increasing number of householders and women with children staying in our <em>āśrama</em> now, and many seem to have come here to settle. Living in Vṛndāvana and raising one’s children here is certainly very appealing for any devotee, but Prabhupāda warned us that we must be very careful how we conduct our activities in the holy <em>dhāma</em>. “So those who do not observe these rules and regulations, they are called <em>ajitātmānah</em>, victimized by the senses. Their business is to sleep as much as possible. They are passing their days without any benefit—<em>niṣphalaà</em>, without any result. If one is not serious about the value of this human form of life, he may waste his time by sleeping. But no. If we follow our predecessors, our Gosvāmīs, who were all ministers, they came to Vṛndāvana to practice—what? <em>Nidrāhāra vihārakādi vijitau</em>, to conquer over sleeping, eating, and mating. And coming to Vṛndāvana, if we indulge in that way, then what is the use of coming to Vṛndāvana? Go to hell and live there.”</p>

<p class="verse">* * *</p>

<p>Prabhupāda is very eager to begin <em>go-rakṣa</em>, or cow protection. This morning he told Akṣayānanda Swami to construct a shed on our spare land and immediately buy some cows. He sees this program as an essential aspect of our preaching work and is encouraging us to establish it on a worldwide basis.</p>

<p>Then, while hearing this morning’s mail, the topic of cow protection came up again in Rūpānuga’s October monthly GBC report. (All GBC men have to send detailed monthly reports, which His Divine Grace listens to with careful attention.) Rūpānuga mentioned that the cows on our Pennsylvania farm are giving forty-eight pounds of milk a day per cow and have even won some awards.</p>

<p>Pleased with this report, Prabhupāda wrote an encouraging response. “Our cows are happy, therefore they give plenty of milk. Vedic civilization gives protection to all living creatures, especially the cows, because they render such valuable service to the human society in the shape of milk, without which no one can become healthy and strong. In your country the dog is protected and the cow is killed. The dog is passing stool and urine in the street, he is considered best friend of man. And the cow is all pure—stool, urine and milk—but they are taken to the slaughterhouse and killed for food. What kind of civilization is this? Therefore we have to preach against all this nonsense.”</p>

<p>Prabhupāda also asked him for a report on the newly acquired eleven-story building in New York. He is concerned that this large building be correctly managed, as several recent reports have suggested difficulties.</p>

<p>A BBT and zonal report, full of devotional enthusiasm, also arrived from Hridayānanda Goswami, the GBC for South America. He is supervising the production of Prabhupāda’s books in Spanish and Portuguese. He enclosed two new publications: <em>Easy Journey to Other Planets</em> (Portuguese, 50,000 copies) and <em>Elevation to Kṛṣṇa Consciousness</em> (Spanish, 125,000). <em>Bhagavad-gītā Tal Como Es</em> has just gone to the printer. They have assembled a team of translators with the aim of publishing at least one hardbound book per month.</p>

<p>Hridayānanda Mahārāja requested help from the English language BBT in Los Angeles for manpower and loans. He also presented a proposal to produce Prabhupāda’s books as both a standard publication and a “super cheap” version. This will enable them to distribute books profusely even in the poorest South American countries.</p>

<p>Another idea he proposed was for each GBC man to spend at least three months a year in a zone other than his own. He felt that this arrangement would give Prabhupāda relief from the burden of managerial concerns. It also would enable each man to analyze his zone objectively and, by consultation with another GBC member, solve any problems.</p>

<p>Prabhupāda heard the report with great satisfaction and carefully inspected the new books and a photo of Śrī Śrī Rādhā-Madana-gopāla from Mexico. Then he dictated his reply. “Yes, you print all of my books; if you can sell then, why not print? Print as much as possible and store them if necessary. But you must pay regularly the BBT loans; that is not to be neglected.</p>

<p>“Your idea of printing a deluxe edition and an ordinary edition is all right. Everyone should get a book, that is the idea. So do it.</p>

<p>“The idea of GBC changing zones for two-three months of the year is also good. Bring up this point at the Māyāpur meeting and vote on it.”</p>

<p class="verse">* * *</p>

<p>Each moment in Śrīla Prabhupāda’s association is instructive. Even in the simplest of dealings his every action is exact and proper. He notices the smallest detail.</p>

<p>In mid-morning, when I entered his room, Prabhupāda noted I was wearing a new cotton <em>dhotī</em> I had purchased several days ago. He commended the thick quality and asked the price. I told him it was only fourteen rupees. He also asked how I purchased it, and I explained that I had a little money saved. He said he thought it was a good bargain and told me to call in Akṣayānanda Swami. When he came in, Prabhupāda told him about my new <em>dhotī</em> and asked him to reimburse me for the money spent. He said that my small savings should be kept for emergency use, and the temple should cover my expenses.</p>

<p class="verse">* * *</p>

<p>Over the past few days Prabhupāda has given many small but significant instructions on a variety of issues. For example, a devotee who lost his original beads gave me a new set for Prabhupāda to sanctify by chanting on them. Prabhupāda agreed, but mentioned that this was not really necessary because it is the chanting of the devotee that is sanctified at initiation, not the beads.</p>

<p>During a walk Akṣayānanda Swami told Prabhupāda about a retired gentleman who wants to live in the <em>āśrama</em>. The man is very respectful and even offers his obeisances to the <em>sannyāsīs</em>. Prabhupāda replied, “If a <em>sannyāsī</em> is not offered respect, the punishment is that he must fast for the day. That it is śāstric injunction.” Bhagavat Āśraya asked what the punishment was if one doesn’t fast. Prabhupāda said simply, “You must go to hell!”</p>

<p>An astrological researcher wrote from London asking for Śrīla Prabhupāda’s time and date of birth. Prabhupāda obliged him. “Regarding your question about my birth. I was born September 1, 1896, Tuesday at about 4:00 in the afternoon. My rasi is Mithuna.”</p>

<p>Prabhupāda is always anxious to establish new centers in India and build up those that are already existing. He wrote to Mahāàsa Swami to say that he intends to spend at least one <em>crore</em> rupees in Hyderabad. And he authorized Gaura Govinda Swami to open a center in Orissa. The Vṛndāvana devotees are to check the offer of a temple in Kanpur.</p>

<p>Śrīla Prabhupāda is always flexible. Gargamuni Swami is to come to India with five Mercedes vans and twenty men to begin traveling <em>saṅkīrtana</em> and standing-order distribution to libraries. Although Prabhupāda had requested him to manage the Calcutta temple again, when he heard his new program of selling books he wrote, “Yes! Your present engagement is more important. Managing Calcutta temple is not so important. I am pleased that you are selling my books; this is superior engagement, so please increase it more and more.”</p>', '', '1975-12-08', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- December 9th, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'December 9th, 1975',
    '', '', '', '',
    '', '', '', '',
    E'<p>There are problems with the drainage from our guest house. The septic tanks are inadequate, and there is no room to build larger ones. Neither is the local municipality providing sewage lines to this area. Overflow is polluting the back alley, and there have been complaints from local residents. Prabhupāda has had many discussions with Saurabha, Guṇārṇava, and the other managers aimed at finding a solution.</p>

<p>This morning, instead of his regular walk, he went down the side alley and along the Vṛndāvana <em>parikrama</em> path. He came out into an open space of about two acres, said to be the actual Rāman Reti area where Kṛṣṇa and Balarāma played with Their cowherd friends. Walking across the soft sands, he looked around at the barren land. A few of Vṛndāvana’s many peacocks strutted here and there, and a group of green parrots, like a gang of noisy adolescents, squawked and squabbled overhead. A crow cawed loudly from the top of a high tree, and varieties of birds flitted among the surrounding foliage.</p>

<p>Prabhupāda is thinking of purchasing the land to use as drainage for the guest house. He also suggested we turn it into a park. As he walked around he said we should “colonize” the area, similar to our Los Angeles community. He didn’t stay very long, and after a short walk on the road, he returned to the temple.</p>

<p class="verse">* * *</p>

<p>Class this morning was longer than usual. Prabhupāda contrasted the genuine renunciation of Śrīla Rūpa Gosvāmī, the founder of present-day Vṛndāvana village, with that of some of his modern imitators. Such imposter renunciates simply come to beg <em>capātīs</em> just to sell them in the market in order to buy <em>bidis</em>, a cheap variety of cigarette. Prabhupāda explained that following the rules and regulations of devotional service, <em>vidhi-bhakti</em>, is essential. First there is <em>vidhi-bhakti</em>, then <em>rāga-bhakti</em>, spontaneous service, and at last <em>prema-bhakti</em>, pure love of Godhead. In the beginning stage we have not awakened our natural love for Kṛṣṇa, and therefore we should be careful not to act whimsically. He reminded us that by birth we may be at a disadvantage, but not disqualified.</p>

<p>He explained that progress depends on proper guidance. Then he described the vital role that he was playing as the representative of the Six Gosvāmīs. “So in the beginning, neophyte stage, not that because we have come to Vṛndāvana, immediately we have become advanced. No. <em>Vidhi-bhakti</em>must be followed—regulative principle—by the injunction of the <em>śāstra</em> and the order of the spiritual master. One who is inquisitive to understand <em>Brahman</em>, he should be given chance. Just like there is a little fire. Fan it. Fanning, fanning, fanning, and it becomes a big fire. So our process is that. We pick up anyone... Caitanya Mahāprabhu has given open declaration--<em>kṛṣṇa-bhajanete nāhi jāti-kulādi-vicāra</em>. Anyone who is desirous of becoming Kṛṣṇa conscious, it is open. Anyone can come.”</p>

<p>Prabhupāda went on to say that although a devotee is naturally enthusiastic to offer this process of purification to everyone, we should not be disappointed if only a few take it up. Nor should we be complacent, now that we have achieved what many consider to be the goal of Kṛṣṇa consciousness itself—residence in the holy <em>dhāma</em>. “Caitanya Mahāprabhu never sat down tightly in Vṛndāvana. He traveled all over India and took so much trouble. So preaching is very important, and you should engage. That will help you. Every one of you should be pure in your activities and try to preach Kṛṣṇa consciousness as far as possible. If you remain pure, then your preaching will be successful and you’ll get encouragement. That is the instruction of all Vaiṣṇavas. Thank you very much.”</p>

<p class="verse">* * *</p>

<p>Back in Prabhupāda’s room after breakfast, Hansadūta read out some particularly ecstatic letters from America describing the book distribution. Prabhupāda’s enthusiastic response to them was clear evidence that, as he said in class, he is fanning, fanning, fanning to bring back the fire of spiritual consciousness in the hearts of the conditioned souls. He has declared the entire world an open house for the introduction of Kṛṣṇa consciousness. The letters show just how seriously his disciples are applying themselves to the task.</p>

<p>In a BBT report Rāmeśvara informed Śrīla Prabhupāda that this month they’d printed 350,000 English <em>Bhagavad-gītā</em>s, with 500,000 more planned in hardbound. <em>Śrīmad-Bhāgavatam</em> Sixth Canto, Part Two was at the printers, and Part Three was in production. A record number of <em>Back to Godhead</em>s are also going out.</p>

<p>Rāmeśvara concluded enthusiastically, “Our only desire is to surrender our lives to help publish and distribute millions of Your Divine Grace’s wonderful books. Here in LA they are selling over 200,000 BTGs this month of December, more than even the entire Radha-Damodara party combined. Of course Radha-Damodara is selling more big books than anyone else. Devotees are more enlivened in the USA than I have ever seen for distributing your books. This will be the biggest month ever. Already one million BTGs is not enough for this month.”</p>

<p>Nothing pleases Śrīla Prabhupāda more than hearing how his books are being printed and sold. He wrote back, “You keep your enlivened position. I was just talking to Hansaduta about the good fortune of America that Krsna consciousness is there; and if you can cover the whole America with Krsna consciousness that will be good for the whole world.”</p>

<p>Then Hansadūta prabhu read out an ecstatic report by Uttamaśloka dāsa, the president of the Chicago temple, although it was not directly addressed to Śrīla Prabhupāda. It described the efforts of the devotees in the recent record-breaking, Thanksgiving-day book-distribution competition. Out of 5,000 books sold by the three temples, Chicago, assisted by nine Rādhā-Dāmodara traveling <em>saṅkīrtana</em> party <em>brahmacārīs</em>, sold over 2,000. The letter was written to Rāmeśvara prabhu and sent on. Hansadūta read it out loud as Prabhupāda listened, eyes sometimes wide with amazement and appreciation at the incredible effort and risk his disciples are taking to distribute his books throughout this world of darkness:</p>

<p>“We took the challenge seriously—not that we were puffed up and over confident of victory—for we knew that anything could happen by Lord Caitanya’s mercy. Then the first crew left—16 men and women—they were distributing by about 6:30 a.m. Later a small party went out by about 10:00 a.m. with more books and prasadam, and later on in the day several others came out. Altogether there were about 25 devotees at the airport throughout the day. Sripati and I sort of floated about helping in different ways, like you did. There were the 17 regular distributors plus Tripurari Swami and a couple of weekend regulars and a few more new comers.</p>

<p>“In the first hour and half most of the distributors had done 15 to 25 books, so by the time we got out (about 11:00 a.m.) they had already done about 300–400 books! The mornings are always good. Things were quiet; not too many announcements and no break ups or hassles. We all met together for lunch at 1:00 p.m. and took a preliminary count: over 750 books—we were close to breaking the world’s record half way through the day. By 1:00 p.m. Manusuta dasa had already done 100!!!!!! Praghosa dāsa 80!!!! and Tripurari Swami 70!!!!! Our hairs began to stand on end a little as we speculated about the potential results and everyone was back distributing by 1:30 p.m.</p>

<p>“Basically we distribute two terminals...there is a corridor about 25ft. wide that the people funnel through after coming from the ‘fingers’...All of the passengers come through there on their way to the baggage claim and also on their way to a flight.... We found out from the paper next morning that over 220,000 people came through the airport that day!!!!</p>

<p>“At about 4:00 p.m.... a demon worker of the airlines came up to one devotee and punched him in the face; the men were stunned. Then he went up to another devotee and punched him in the face! The men and karmis began to congregate. Tripurari Swami came running to see what was happening; the demon punched him in the face!!! All of the devotees immediately jumped on the demon and began beating the stool out of him!!!!!!! There was a huge crowd all around and the devotees were shouting for the police to stop this man. There was blood on his face and on the ground. Praghosa’s punch had drawn blood and there were drops of blood on Praghosa’s clothes and drops of perspiration on his face: he was feeling very blissful!!”</p>

<p>Prabhupāda’s eyes opened wide at the description of the fight. “<em>Acchā!</em>” he said in surprise, shaking his head in wonder at the risks his men were taking on his and Kṛṣṇa’s behalf. Hansadūta was laughing and shaking his head in awe and he read on.</p>

<p>“Half the crowd was in our favor and the other half against. The police came in and the demon said that we had given him a book and then taken it back and started a fight. The police arrested the devotees! This is typical of all the incidents—they attack us and we get arrested! Anyway somehow or another, by Krsna’s grace, the devotees were released and back distributing in 20 minutes.</p>

<p>“Around 6:00 p.m. I took a preliminary count...I sat in the phone booth and added the score. As I added my eyebrows began to raise higher and higher! My eyes began to bulge from their sockets!! My mouth dropped open! I was speechless! Tears actually began to flow from my eyes! We had broken 1400 books! I couldn’t believe it; I was stunned and took another count to be sure, and sure enough, it was right. I began to shout in ecstasy ‘Hari Bol, Hari Bol, Hari Bol!’ All the karmis were looking at me through the phone booth with screwed up faces of bewilderment....</p>

<p>“When I got back there had been another incident... A couple of plainclothers (cops) had tried to set up one of the women for an arrest and she tried to get one of the men to help her. One of the men tried to intervene and they arrested him and took him downstairs. Another mother went down to find the girl whom they tried to arrest and when the cops saw her they said “Where’s the other girl?” “I don’t know” she said. “OK, then we’ll arrest you instead!” “Hey, let me go! I didn’t do anything!” Two small scuffles broke out with the two devotees and the police. Another devotee came in to stop it...and the police turned on him and the three of them mercilessly beat him up on the floor in front of many bystanders! One of the policemen’s guns fell out during the scuffle and books were scattered every where. The devotees were then taken to jail downtown (the two men devotees). Of course this knocked at least 100 books off our score.”</p>

<p>Prabhupāda was listening with rapt attention to the whole description, occasionally raising his eyebrows in surprise and shaking his head and smiling in appreciation. He was aglow with obvious pride at the determination of his disciples to sell his books despite all obstacles, and he listened to the entire report, blow by blow.</p>

<p>“While we listened to this incident and took prasadam, a demon who had found three books ripped them up and threw them in our midst. Unaffected, a little tired, but undaunted in their determination, the devotees went back to distribute. Meanwhile a huge blizzard began and traffic started jamming both on the roads and in the air.. At 10:30 p.m. I got a report from Sripati: over 1700 books—we might break 2,000!!!! This is incredible!! Who can imagine the mercy of Lord Caitanya Mahāprabhu? All but four of the men were coming back at 11:30 p.m.—Manusuta w/191; Praghosa w/153; Tripurari Swami w/135 and Ranganatha w/120.... The first crew returned in the blizzard by 2:00 a.m. and the four others left about 1:30 or 2:00 a.m. Everyone struggled to get up for mangala arati (the four latecomers didn’t even go to sleep) and after an ecstatic kirtana I ran around to get the final scores...On Thursday we fasted from breakfast and chanted and slept till noon arati when we had a big arati kirtana and after a nice feast!!!!</p>

<p>“Thank you for inspiring us to compete for the mercy of the Spiritual Master. If it weren’t for you we wouldn’t know what to do. All glories to Śrīla Prabhupāda!</p>

<p>Your servant, Uttamasloka dasa.”</p>

<p>Another page carried the totals for each distributor. Two men did over 400 between them: Manusuta set a new individual world’s record with 210 books, Praghoṣa was just behind with 200. Another seven, Tripurāri Swami, Raṅganātha, Romapāda, Buddhimanta, and Preraka prabhus, including two women, Ṣaḍbhuja and Jagaddhatri dāsīs, broke the one-hundred-book mark. The grand total was 2,042 hardbound books.</p>

<p>At the bottom of the list Uttamaśloka added a note to Rāmeśvara: “My humble suggestion and request is that you read this letter and all of its contents to the assembled devotees of New Dvaraka Dhama. Even though it is irregularly composed and full of mistakes and errors, it is still very transcendentally pleasing and will be relished by all.”</p>

<p>At the top of the letter Rāmeśvara had written in large clear capital letters, “THE MOST ECSTATIC SKP NEWSLETTER OF ALL TIME! SHOULD BE READ ALOUD TO ALL OF THE ASSEMBLED DEVOTEES!”</p>

<p>When Hansadūta finished, Śrīla Prabhupāda had a huge smile on his face, clearly pleased and obviously enjoying transcendental ecstasy. He dictated his reply, not to Rāmeśvara but to Uttamaśloka. “Please accept my blessings. I read your sankirtana newsletter with great relish. Europe and America are in great danger, this Hare Krsna movement is enveloping them. The sankirtana devotees are very, very dear to Krsna. Because they are doing the field work of book distribution, Krsna has immediately recognized them as true servants. Just like during the war time, a farm boy or ordinary clerk who goes out to fight for his country on the front, immediately becomes a national hero for his sincere effort. So Krsna immediately recognizes a preacher of Krsna consciousness who takes all risks to deliver his message.</p>

<p>“It is called dhira bratta—determination. These boys and girls are mahatmas—mahatmanas tu mam partha, daivim prakrtim asritah, bhajanty ananya manaso, jnatva bhutadim avyayam:—‘O son of Prtha, those who are not deluded, the great souls, are under the protection of the divine nature. They are fully engaged in devotional service because they know Me as the Supreme Personality of Godhead, original and inexhaustible.’ This verse is applicable here. If these boys were under the material nature they would not take so much risk. They are mahatma, they are real mahatma, not that long beard and saffron cloth mahatma. They are unswerving in their determination, dhira bratta. All glories to the American devotees!</p>

<p>“I hope this letter finds you and all the sankirtana devotees well,</p>

<p>Your ever well-wisher, A.C. Bhaktivedanta Swami.”</p>

<p>Book distribution is going on enthusiastically all over Europe as well; and devotees there are also taking risks. Yesterday Alanātha told Śrīla Prabhupāda that in some places in Western Europe the devotees are being arrested simply for selling his books. He wanted to know if they should make some secret arrangement for selling. Śrīla Prabhupāda replied, “Why secret? Take permission from the courts.”</p>

<p>Alanātha said that wasn’t possible. Prabhupāda, however, said that if arrested we should use the opportunity to present our case in court. “This is very important book. The government should allow us to sell. Present in court the professors’ opinions, how they are giving standing orders. Why the state should restrain distributing knowledge? Do they want to keep their men in darkness? You have to preach like that.”</p>

<p>Adversity never daunts Prabhupāda. He has firm conviction in his mission, and is prepared to fight to establish Kṛṣṇa consciousness in this God-forsaken world.</p>

<p>Prahlāda Mahārāja’s instructions give daily affirmation that Kṛṣṇa consciousness is the prime necessity of life. Therefore Śrīla Prabhupāda wants to give Kṛṣṇa consciousness freely to as many people in as many places in the world as possible, and distributing transcendental literature is the most effective means. Kṛṣṇa is empowering Śrīla Prabhupāda to write the books. He, in turn, is now investing his energy in inspiring his disciples to distribute them.</p>

<p class="verse">* * *</p>

<p>This afternoon I spoke with Harikeśa and Hansadūta Prabhus about my service. Prabhupāda is due to leave in a couple of days for Delhi and Bombay, and Gopāla Kṛṣṇa is constantly reminding me that he wants me to go to Calcutta. I confessed to them that I have become extremely attached to serving Śrīla Prabhupāda, and I am not particularly enthusiastic about going to Calcutta.</p>

<p>Harikeśa has changed his opinion about my being on the party, even to the point of telling Gopāla Kṛṣṇa directly to back off from his idea. He told him that Prabhupāda’s personal party is transcendental to zonal and GBC considerations. Harikeśa advised me, “You should ask Prabhupāda if you can stay with him.”</p>

<p>I told him I was reluctant to bother Śrīla Prabhupāda with personal requests, but he urged me to go ahead. “After all,” he said, “it is directly connected to Śrīla Prabhupāda, so it affects him too. You have nothing to lose. At worst he can only say no.”</p>

<p>I accepted his words as good advice, and tomorrow I will ask Śrīla Prabhupāda personally.</p>', '', '1975-12-09', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


END $$;
