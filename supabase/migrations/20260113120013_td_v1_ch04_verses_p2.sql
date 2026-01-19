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


  -- December 19th, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'December 19th, 1975',
    '', '', '', '',
    '', '', '', '',
    E'<p>Prabhupāda’s quarters here are simple, clean, and functional with barely any furniture. The floor is a “crazy- paved” style of either white ceramic tiles or marble chips. Only in his <em>darśana</em> room does he have the traditional sheet-covered mattresses to provide seating for guests, and there is a simple <em>āsana</em> and a desk and a bookcase.</p>

<p>This morning at about five o’clock I was sitting on the bare floor of the front reception room, trying to chant my <em>japa</em>. Prabhupāda came out to brush his teeth in the sink, but I failed to notice because I was nodding asleep as I chanted.</p>

<p>He wasn’t angry, but he told me, “Do not sit while you are chanting. Sitting means sleeping.”</p>

<p>Being Śrīla Prabhupāda’s servant, I sometimes find it difficult to chant good rounds, because I am expected to remain on call in the room adjacent to his throughout the day. I have had to learn to chant almost silently so as not to disturb him, and this makes it harder to be attentive. Previous secretaries and servants have also had trouble chanting properly due to the demands of the engagement.</p>

<p class="verse">* * *</p>

<p>Out on the beach in the fresh morning sea air Prabhupāda described how swiftly human beings can descend into animalism when spiritual culture is lost. He recalled that in the concentration camps during World War II people were forced to eat their own stool.</p>

<p>Dr. Patel admitted that as an honorary Colonel for the British he knew that they had a regulation allowing soldiers to drink their urine. “But,” he said, “they were not allowed to eat stool.”</p>

<p>Prabhupāda shook his head in wonder. “Just see, ‘I am making law. You can drink urine.’ Just see!” He turned to us, his eyes wide open, as everyone laughed incredulously.</p>

<p>Dr. Patel offered his medical opinion that urine has many properties essential to the body, and therefore isn’t so bad.</p>

<p>“So you are advising your patients to go and drink?” Prabhupāda asked.</p>

<p>“No, I don’t say. But that is not so bad because it convinced the hormones...”</p>

<p>Prabhupāda broke out laughing, and Dr. Patel became annoyed.</p>

<p>“It <em>does </em>convince the hormones. I mean, it has been analyzed like that, scientifically. It is not to be joked about!”</p>

<p>Prabhupāda proffered some humorous agreement, “<em>Ne</em>. It is analyzed. And stool is full of hydrophosphates.”</p>

<p>The devotees were all laughing by now, and Dr. Patel became a little indignant. “Our Mr. Desai, Morarjī, who lost his premiership of India, he is drinking his own urine.”</p>

<p>“<em>Acchā! </em>Why?” Prabhupāda asked.</p>

<p>Ignoring Prabhupāda’s response, Dr. Patel continued, “And look at him! He’s so, I mean, so absolutely healthy. I mean it is...we should not laugh about it, but there is something right in it.”</p>

<p>“No, no. I don’t laugh; I am surprised!”</p>

<p>Prabhupāda decided to save Dr. Patel from further embarrassment. He moved on, proceeding at a steady pace down the flat sands, changing the subject to speak about the good fortune of taking birth in India.</p>

<p>Dr. Patel, now again at ease, verified the benefits of such a birth by citing the example of his mother who died while gazing at a picture of Lord Kṛṣṇa.</p>

<p>Śrīla Prabhupāda also recalled an incident of an old man in Delhi who requested a picture of Rādhā-Kṛṣṇa a few minutes before his death. He died just as it was placed before him.</p>

<p>Dr. Patel mentioned that his mother had also chanted <em>Bhaja Govinda</em> as she died.</p>

<p>Prabhupāda turned to the devotees and remarked appreciatively, “Oh! Just see. Govinda.”</p>

<p>Unfortunately, nowadays many Indians are leaving behind their spiritual tradition, in pursuit of modern materialistic advancement. Śravaṇānanda said that one well-known “spiritual mission” in Madras had a slogan above a school playing field entrance that read like an epitaph to Vedic education: “The playing of football will bring one closer to heaven than the study of the <em>Gītā</em>.”</p>

<p>He said they had refused to rent the field to ISKCON devotees for a program. They were told that the cricket season was coming up soon, and the school did not want the turf to be ruined. Officials frankly said that they did not have time for spiritual training, only physical.</p>

<p>The rapid decline of spiritual culture is especially visible here, where Bombayaites seem especially intent on imitating Western culture. Śrīla Prabhupāda commented, “A person born in a <em>brāhmaṇa</em> family, he is claiming ‘I am <em>brāhmaṇa</em>.’ Similarly, even though born in Aryan family, without any culture they are claiming, ‘I am Aryan.’</p>

<p>“Kṛṣṇa observed it in Arjuna, and therefore he chastised him, ‘This kind of proposal is <em>anārya-juṣṭam</em>, from the non-Aryans. You are forgetting your duty.’ That is the beginning of loss of culture. A small beginning, it creates havoc.</p>

<p>“<em>Yuddha</em>—everything must be religious. Why <em>yuddha</em>? Your ordinary living must be also religious. Otherwise, animal. Animal also lives. But if you don’t live religiously, that is animal. If you live like human being, that human being means <em>dharma</em>. We cannot expect any <em>dharma</em> in the animal society. It is meant for the humans. Cāṇakya Paṇḍita says that a flower without smell and a man without education—the same thing. A flower without smell, similarly, a man without education.”</p>

<p>Like an old flower that has lost its fragrance, this city in particular has become a veritable bastion of materialistic consciousness. Evidence of cultural imposition abounds. At the beach, big hotels stand brazenly as crass reminders that modern Indian society is swiftly degenerating, becoming increasingly dedicated to sensuality.</p>

<p>That Śrīla Prabhupāda has had to fight so strenuously with the Bombay municipality simply to build a Kṛṣṇa temple at Juhu is disturbing testimony. Three hundred years of British colonial rule has systematically re-educated the Indian people into thinking that the simple and natural God-conscious way of life they once enjoyed is backward and primitive. Bombay is obviously the one place in India that has achieved graduate status in the school of materialism.</p>

<p>Yet, now Westerners are coming here to study and adopt a culture India is trying so hard to lose. By the strength of Śrīla Prabhupāda’s love for Kṛṣṇa and his profound knowledge, he is reversing this trend.</p>

<p>Dr. Patel is one of the few who truly appreciate Śrīla Prabhupāda’s contribution. Despite his brash exterior he is always keen to inquire.</p>

<p>“Sir, what is the distinction between a culture and an education?”</p>

<p>Prabhupāda answered, “Culture means human being. Just like Cāṇakya Paṇḍita says, <em>mātṛvat para-dāreṣu para-dravyeṣu loṣṭavat ātmavat sarva-bhūteṣu yaḥ paśyati sa paṇḍitaḥ.</em> This is culture. To see every woman as mother. The modern meaning of education is rubbish, to learn ABCDE. This is not education. Without culture, what is the meaning of education?”</p>

<p>“So culture is the background for education?” Dr. Patel asked.</p>

<p>“Yes. Education is required to help culture. Not that you take degrees from the university and remain a dog. That is not education. Here is education.... First of all learn how to see every woman as your mother. There the culture begins. And they are, from the very beginning of the college school life, they are learning how to entice one girl. This is education.”</p>

<p>Dr. Patel said, “They are following the so-called advanced countries.”</p>

<p>But Prabhupāda answered, “Advanced means Freud’s philosophy, sex philosophy. This is their education. So how you can expect them to learn? It is not possible. From the very beginning there is no culture, animal culture. Just like dogs— as soon as he finds another female dog he wants to have sex. This is education.”</p>

<p>“One friend of mine told me that this culture is vulture’s culture,” Dr. Patel said.</p>

<p>“Yes. Not vultures,” Prabhupāda clarified. “It is called hog civilization. The hogs, they eat anything and they have sex with anyone.... Culture means human life; otherwise, dog’s life....<em> Amānitvam</em>, first of all you have to learn how to become humble. And here all the people, they are educated how to become proud. What is education? And this culture cannot be maintained unless one is God conscious. <em>Harāv abhaktasya kuto mahad-guṇā</em>, there cannot be any culture for a godless person, that is not possible. And, <em>yasyāsti bhaktir bhagavaty akiṣcanā</em>. Just like these European and American boys are offering obeisances to the guru; this is culture. Why he has learned this culture? Because he has become Kṛṣṇa conscious. Therefore, <em>yasyāsti bhaktir bhagavaty akiṣcanā sarvair guṇais tatra samāsate surāḥ</em>. If you make one devotee of Kṛṣṇa, then all culture will automatically come. One thing. Hare Kṛṣṇa.”</p>

<p class="verse">* * *</p>

<p>Good news came this morning from South India. Hansadūta brought a letter from Acyutānanda and Yaśodānandana Swamis who have been visiting prominent Madhvācārya-sampradāya <em>maṭhas</em> throughout Mysore and Mangalore. Their ability to defeat Māyāvādī philosophy so impressed the leaders of the Admar and Pejavara <em>maṭhas</em> that they were given letters of recommendation introducing them as bona fide Vaiṣṇavas and praising Śrīla Prabhupāda and his books. As a result, three schools in that area took full sets of Śrīla Prabhupāda’s books. They have also enlisted twelve Patron Members.</p>

<p>Now in Mangalore, they intend to join Prabhupāda in Nellore, Andra Pradesh, on January 3rd.</p>

<p>Prabhupāda is extremely encouraged and pleased to see his senior disciples preaching so capably and gaining acceptance for ISKCON by their philosophical knowledge. He wrote to them, “Sankirtana will always be appreciated, because it is the special blessings of Lord Caitanya Mahaprabhu on the people of this fallen age of Kali-yuga. Sukadeva Gosvami says this age is an ocean of faults. But there is one boon: in this age one gets the same result as was achieved in former ages through elaborate temple worship, costly sacrifices, or introspective meditation, simply by chanting the Holy Name of the Lord. It is for this reason only that this Hare Krsna Movement has spread so quickly all over the world.”</p>

<p class="verse">* * *</p>

<p>At the end of a full day Prabhupāda likes to relax. Sometimes he is reflective, making pithy observations about society and the condition of the world. That was his mood tonight.</p>

<p>After I set up the mosquito net over his bed, he lay down. I climbed inside also, sitting cross legged at his side, gently massaging his hips, legs, and feet.</p>

<p>Prabhupāda talked briefly about Freud. He said that producing such a complicated philosophy and writing volumes of books just to understand sexual attraction, which is there naturally even in the pigs, is like bringing a cannon to kill a mosquito. “Big philosophy,” he said, “is not required for these things.”</p>', '', '1975-12-19', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- December 20th, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'December 20th, 1975',
    '', '', '', '',
    '', '', '', '',
    E'<p>Prabhupāda is not feeling well; swelling in his legs, feet, and hands trouble him. To see his body puffed with fluid is very disturbing. Nevertheless, he went on his walk, continuing with the education of Dr. Patel and the other devotees.</p>

<p>This morning Prabhupāda stressed that one must hear from a bona fide guru if he desires to become knowledgeable in spiritual life. He condemned charlatan gurus who misrepresent the process of yoga and tell people that one can be one’s own guru simply by “looking within.”</p>

<p>“If there is no need of guru,” Prabhupāda said sharply, “why are they writing books to tell people? As soon as you tell someone something, that is guru.”</p>

<p>As we walked back to greet Śrī Śrī Rādhā-Rāsabihārī, the sound of children’s voices singing traditional Hindi songs loudly rang out from the playground of the junior school across the road. This scene reinforced the point that Śrīla Prabhupāda emphasized during the morning walk—everyone must learn from another qualified authority.</p>

<p>Dr. Patel said, “Guru is necessity right from the birth. The first guru is the mother.”</p>

<p>Prabhupāda answered, “And these rascals, they preach like that: ‘There is no need of guru.’”</p>

<p>“They are rascals, Sir.”</p>

<p>“Yes,” Prabhupāda agreed. “Simply rascals. Rascal means he does not know the thing and he still preaches. That’s a rascal. Guru must be there. There are many, they say like that, ‘There is no need of guru.’”</p>

<p>When one visitor asked if some effort was required to obtain a guru, Prabhupāda gave his confirmation. “Yes. Therefore Kṛṣṇa says, <em>tad viddhi praṇipātena</em>. <em>Praṇipāt</em> means you have to surrender. When you submit somewhere, you must test and then submit. That is <em>sad-guru</em>.”</p>

<p>“They say, sir,” Dr. Patel said, “that if you are very sincere then the <em>sad-guru</em> comes automatically to you...as you have come to us.”</p>

<p>Prabhupāda answered, “Yes. Because Kṛṣṇa is there. If He sees somebody is actually serious to understand Him.... Therefore Dhruva Mahārāja, he did not make any guru, but with fervent desire he went, ‘Yes, I shall find out Kṛṣṇa.’ Mother said, ‘Kṛṣṇa can be found in the forest.’ He went to the forest and began according to his own way. Then Kṛṣṇa sent Nārada Muni: ‘This boy is very serious; go and give him real <em>mantra</em>.’ That is Caitanya Mahāprabhu, <em>guru kṛṣṇa kṛpayā pāya bhakti lātā bīja</em>. Two things required, guru and Kṛṣṇa.”</p>

<p class="verse">* * *</p>

<p>During his massage I pressed gently on Prabhupāda’s foot with my thumb to show him the swelling. It left an indentation for several minutes. Prabhupāda said this is due to uremia, a toxic condition caused by waste products in the blood normally eliminated in the urine. It makes it very difficult for him to climb the steps to his apartment when returning from the temple. Yet, he tolerates the inconvenience without complaint and dismissed the sight of the dent with a smile and a shake of his head.</p>

<p class="verse">* * *</p>

<p>Despite not feeling well, Śrīla Prabhupāda went to an outside engagement in the evening. It was held on the twenty-first floor of a block of flats, the home of a wealthy and influential Life Member.</p>

<p>Although it was not well attended and Prabhupāda’s lecture was constantly interrupted by noisy children, he spoke strongly for forty-five minutes on <em>Bhagavad-gītā</em> (7.1). He emphasized the need to hear from the right source—Kṛṣṇa. As usual in preaching to a mainly Indian audience, Śrīla Prabhupāda kept to the central theme of <em>dharma</em>—real religion, what it constitutes, and the duty of those who have the good fortune to understand it.</p>

<p>It was late when we left, and after a long drive home, Prabhupāda revealed that he felt too ill to continue going out on so many programs. He said that he wants at least one week of complete rest. He will not even take morning walks. And he wants to eat only fruits, milk, and <em>kicchari</em>. He looks exhausted and frail, but we are unable to help in any useful way.</p>

<p>Arrangements are being made to go to Australia for the Ratha-yātrā on January 10th, but our plans might have to change due to Prabhupāda’s ill health. Moreover, some difficulty has arisen regarding Prabhupāda’s visa.</p>', '', '1975-12-20', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- December 21st, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'December 21st, 1975',
    '', '', '', '',
    '', '', '', '',
    E'<p>There was no morning walk today. Missing Prabhupāda on the beach, Dr. Patel arrived at his apartment with his son. He took a cardiograph reading and gave Prabhupāda some pills. His diagnosis is high blood pressure.</p>

<p>Prabhupāda rested. He didn’t take breakfast, and then ate only a morsel at lunch, complaining of dizziness from the medicine. He remarked that modern drugs are medicines for the demons. Prabhupāda rarely goes to a doctor, although if by some arrangement one comes to him, he doesn’t refuse their help. Disease has to be treated, of course, but as far as he is concerned, chanting Hare Kṛṣṇa is the best cure.</p>

<p>In the evening he felt better and ate some guava, three <em>paraṭhās</em>, and a <em>sabjī</em> Harikeśa cooked for him.</p>

<p>As part of his cure Prabhupāda told us that for at least one week he wants to be free of appointments and visitors. Harikeśa is doubtful that we will be able to enforce this rule. Prabhupāda is too enthusiastic to stop preaching and too kind to turn away unexpected visitors.</p>', '', '1975-12-21', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- December 22nd, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'December 22nd, 1975',
    '', '', '', '',
    '', '', '', '',
    E'<p>Today is Śrīla Bhaktisiddhānta Sarasvatī Ṭhākura’s disappearance day. Śrīla Prabhupāda is feeling a little stronger, but the morning walk was again canceled.</p>

<p>He fasted until noon, when there was a huge feast for the devotees. They made many, many preparations, and samples of everything were brought to Prabhupāda. He was pleased and took small tastings of each preparation.</p>

<p class="verse">* * *</p>

<p>Shortly after Prabhupāda retired for his morning nap, Dr. Patel came unannounced up to the apartment with two friends. Having heard that Prabhupāda was still not well, he had brought some medicine.</p>

<p>However, I had to refuse him entry to Prabhupāda’s bedroom. It is a standing rule that no one may wake Prabhupāda for any reason. Nor is there ever a need, as Prabhupāda never misses any appointments; and he rises at almost exactly the same times every day, as if by his own built-in alarm clock. Unfortunately, the doctor became rather upset and embarrassed in front of his friends at being made to wait. He didn’t like being stopped by Prabhupāda’s young servant. He even refused my request to wait in the sitting room. When the tactic of raising his voice in protest failed to rouse Śrīla Prabhupāda in the next room, he left the medicine, departing in a huff.</p>

<p>His show of anger doesn’t disturb me. I feel secure in the knowledge that I have done the right thing and acted according to Śrīla Prabhupāda’s desire.</p>

<p class="verse">* * *</p>

<p>As Harikeśa predicted, in the afternoon Prabhupāda decided to receive some visitors, despite his statement yesterday that he wanted a week’s complete rest.</p>

<p>One of the visitors was a disciple of a well-known impersonalist. The lady unabashedly glorified her guru and began spouting his philosophy. Perhaps the disappearance day of Śrīla Prabhupāda’s own Guru Mahārāja was not the best time for her to have come. Prabhupāda immediately countered nearly every comment she made. Using sharp logic and common sense he did not hesitate to point out the defects of her Svāmī’s philosophy. He especially attacked the Svāmī’s commentary on the <em>Gītā</em>. A typical Māyāvādī, this guru is well-known for having said that the word <em>kṛṣṇa</em>means “dark.” According to him, <em>dark</em> means “unknown,” and therefore the Absolute is unknowable, that is to say, impersonal.</p>

<p>“If dark is unknown,” Prabhupāda said, “or if Kṛṣṇa is unknown, then why does he [her guru] bother to comment on Kṛṣṇa’s words in the <em>Gītā</em>? Why does he comment on that which he does not know? Therefore only the <em>bhakta</em>, only the devotee, can comment on the <em>Bhagavad-gītā</em>, not others. Because Kṛṣṇa says <em>bhaktyā mām abhijānāti yāvān yaś cāsmi tattvataḥ</em>, ‘to the devotees I am known.’”</p>

<p>After the lady left Prabhupāda told us that her Svāmī is also well-known for having affairs with his secretaries and wealthy widow followers.</p>

<p class="verse">* * *</p>

<p>Despite his health, Prabhupāda still received his mail. A very encouraging letter arrived from Hridayānanda Goswami. He reported that the devotees in Sao Paulo, Brazil have purchased a bus for $40,000 and are fitting it as a traveling temple. With Śrī Śrī Gaura-Nitāi installed they plan to tour the country.</p>

<p>He also submitted three poems for Prabhupāda’s approval. The first two described painful entanglement in material life. The third was a plea for release, and some of its stanzas went:</p>

<p>“Oh, Your Lordship Krsna, please hear me!</p>

<p>Your devotee’s calling, so sadly.</p>

<p>He forgot Your Lotus feet.</p>

<p>Now he’s lost he’s met defeat.</p>

<p>O Greatest of Persons, please see me!</p>

<p>Your devotee’s falling, so badly.</p>

<p>To enjoy this world, he tried,</p>

<p>Now let it be rectified!</p>

<p>O please, Radharani, take pity!</p>

<p>A devotee’s trapped in the city!</p>

<p>The nine gates are robbing him,</p>

<p>Take pity! He’s near the end.”</p>

<p>Prabhupāda heard them appreciatively and replied, “The poem is very nice. However, one should not think of himself as a devotee. Poem three should read:</p>

<p>“Your servant’s calling so sadly”</p>

<p>“Your servant’s falling so badly”</p>

<p>“A servant’s trapped in the city”</p>

<p>“One cannot call himself a devotee, but servant he can call himself always. Your bus program sounds nice, it is approved by me.”</p>

<p>After signing the typed letter, he added in his own hand at the bottom, “Sri Caitanya Mahaprabhu presented Himself as patitam kinkaram mam visame bhavambudhau. Kinkaram means servant.”</p>

<p>Gurudāsa Swami, one of the first devotees in San Francisco and one of the original householders to begin preaching in London, sent an enthusiastic letter from America about his preaching activities and his new-found freedom since recently taking <em>sannyāsa</em>.</p>

<p>Prabhupāda was very satisfied to hear that he is whole-heartedly engaged in Kṛṣṇa’s service, free from distraction. He wrote back encouraging him to go on and added what he described to us as his new slogan, “I always say, ‘Man is good, and woman is also good. But when they combine, then they become bad.’ Before there was so much difficulty. But now you are doing well, and Yamuna dasi is also doing well, and I am very pleased with your work. Please continue like this and keep me informed.”</p>

<p class="verse">* * *</p>

<p>In the evening Prabhupāda went down to the temple for a special program including <em>puṣpāṣjali</em>, the offering of flowers to his Guru Mahārāja. The audience was not large; a small core of active life members, friends and well-wishers of ISKCON who have become attracted by Śrīla Prabhupāda and his pure and direct preaching, impressed by the results of Kṛṣṇa consciousness.</p>

<p>Śrīla Prabhupāda sat on a cushion on the floor in front of the Deities and next to the <em>vyāsāsana</em>, which bore a small picture of his Guru Mahārāja. He lectured enthusiastically, showing no sign of discomfort from his illness. It was an especially good talk. He humbly presented the eternal message of devotional service as he has received it from his spiritual master.</p>

<p>Having spent the afternoon discussing the svāmī to whom the <em>Bhagavad-gītā</em> and Kṛṣṇa was “unknown”, and speaking as the representative of one to whom the Lord most surely is known, he lectured on a verse that gave Kṛṣṇa Himself the final say: <em>Bhagavad-gītā</em> Chapter Sixteen, verse seven. “There are two kinds of men,” Prabhupāda said, “<em>asura</em> and <em>daiva</em>. All throughout the whole universe, there are two classes of men. One who knows his relationship with God, he is called <em>daiva</em>. And one who does not know, just like animal, they are called <em>asura</em>. There is no particular caste or creed, that here is a caste of <em>asura</em>, caste of <em>daiva</em>. No. Anyone who knows what is God and his relationship with God, <em>sambandha</em>, and then works according to that relation and achieves the goal of life, he is called <em>daiva</em>, or <em>devatā</em>. And one who does not know this, what is the goal of life, what is God, what is my relationship with God, he is <em>asura</em>.”</p>

<p>Prabhupāda explained that one is understood to be <em>asura</em> or <em>devatā</em> according to which path they are following—<em>pravṛtti</em> or <em>nivṛtti</em>. “<em>Loke vyavāyāmiṣa-madya-sevā nityā hi jantor</em>. Every living entity has got this tendency. <em>Vyavāya</em>, means sex life; <em>āmiṣa</em>, meat eating, and <em>madya</em>, liquor. Natural tendency. Therefore the country where these things are indulged in without any restriction, that is <em>asura</em>. This is especially in the Western countries, and now we have also learned in India. Either Hindus or Musselman, drinking was a sin; now we have got very easily available liquor. Every door there is a shop, and every door there is a meat shop. So India, there was a time that they were all <em>devatās</em>; now we are imitating the <em>asuras</em>. On the other hand, the boys and girls from the āsuric countries, they are becoming devotees, <em>devatā</em>. So there is no exclusive right for a country to become a <em>devatā</em> or a demon. A demon can be turned into the <em>devatā</em> and <em>devatā</em> can be turned into demon provided he follows this <em>pravṛtti</em> and <em>nivṛtti</em>....</p>

<p>“So Kṛṣṇa has described everything in the <em>Bhagavad-gītā</em>. And today, this night, we are trying to explain the mission of Kṛṣṇa, because the same mission is being carried out by us beginning from Brahmā. And today is a special day, the disappearance day of my Guru Mahārāja, Bhaktisiddhānta Sarasvatī Gosvāmī. This Kṛṣṇa consciousness movement is so beneficial that He wants to benefit the whole human society, how to stop this process of repetition of birth, death, old age, and disease. My Guru Mahārāja also came for this purpose, and we are also trying to follow his footsteps. And we are teaching our disciples to do the same thing. This is not a new movement, or some invented ‘ism.’ It is old, at least four or five thousand years, what Kṛṣṇa spoke. The other followers also spoke the same thing, and we are also speaking the same thing. It is up to you to take advantage of it or not. Thank you very much.”</p>

<p>After Prabhupāda’s lecture, we all stood around the <em>vyāsāsana</em>, before the picture of Śrīla Bhaktisiddhānta Sarasvatī. We responsively recited the <em>praṇāma-mantras</em> following the lead of Lokanātha Swami and offered flowers. Afterwards we had a lively <em>kīrtana</em> and <em>guru-pūjā</em> before Prabhupāda returned upstairs.</p>

<p>With great satisfaction he took some <em>mahā-prasādam</em> that had been offered this evening to his Guru Mahārāja. He also had Harikeśa make some <em>kachoris</em>. To see him eat heartily is a good sign that his health is improving.</p>', '', '1975-12-22', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- December 23rd, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'December 23rd, 1975',
    '', '', '', '',
    '', '', '', '',
    E'<p>Śrīla Prabhupāda is feeling stronger, and the swelling in his body has gone down because of the diuretic pills Dr. Patel supplied yesterday. But Prabhupāda didn’t take all the pills prescribed. After taking a half tablet, as soon as he got the desired effect, he stopped taking the medication.</p>

<p>He resumed his morning exercise, walking down to Juhu Beach as usual.</p>

<p>Prabhupāda asked Saurabha about a dentist interested in opening a clinic in the new temple compound. Saurabha explained that the man had seen the floor plan, which includes a room for medical use, and immediately proposed that he use it to give free treatment to the devotees.</p>

<p>Prabhupāda did not approve. “No, there will be no medical service in the building.”</p>

<p>Lokanātha Swami asked if medical facilities should be set up on another part of the land.</p>

<p>Prabhupāda replied, “That we shall do at our convenience. It is not very urgent. When there is spare room, then. Medical service is to cure the material disease, this temporary headache and stomachache. There are so many medical services for these things, but where is the medical service for curing <em>bhava-roga</em>, material disease? That is wanted. Medical service does not give any guarantee that there will be no more disease. Our service is to guarantee that there will be no more birth, death, old age, and disease. That is the difference.”</p>

<p>Pausing for a moment, he recalled his recent trip to Africa. “In Mauritius I was suffering so much from dental pain. I never went to the dentist; I invented my medicine and it cured.”</p>

<p>Everyone smiled in admiration. Prabhupāda seems to know nearly everything. He was referring to his own toothpaste recipe: a combination of ground mustard seed, salt, calcium carbonate, eucalyptus oil, camphor, menthol, and oil of wintergreen. Many devotees are now eagerly making it for themselves, and Prabhupāda asked if they like it.</p>

<p>He grinned when Harikeśa assured him, “Oh yes! The best!” Lokanātha Swami voiced what we all felt, “You are perfect in all respects. You are your own doctor.”</p>

<p>Prabhupāda humbly responded, “I am not doctor, but I created many doctors.”</p>

<p>We then met up with Dr. Patel, walking in the opposite direction. He stopped to offer his <em>praṇāmas</em>, but he said he wouldn’t walk on with us. He was still miffed about being turned away yesterday morning. He obviously decided to register his complaint with a boycott. He told Prabhupāda how offended he was at being refused admittance.</p>

<p>Although I had given Prabhupāda the medicine, I hadn’t informed him about the fuss Dr. Patel made at not being able to see him. Prabhupāda heard his grievance, and without jumping to any conclusions, gently inquired what the reason might be that he was denied admittance. I explained that Dr. Patel had arrived when he was taking his morning rest, so I did not want to disturb him. Prabhupāda indicated his approval of my action. Yet he also discreetly pacified the doctor.</p>

<p>When Lokanātha invited him to join us, the doctor declined, preferring to continue with his friends. Although we missed the usual lively debate, without Dr. Patel to monopolize the conversation the devotees had more opportunity to ask questions.</p>

<p>We had a long discussion about the relationship between Lord Viṣṇu and Lord Śiva. At one point the famous battle between Bāṇāsura and Kṛṣṇa was mentioned, where the ultimate weapons of Lord Śiva and Lord Viṣṇu were pitched against each other. The <em>śiva-jvāra</em> produced intense heat, but the <em>viṣṇu-jvāra</em>, which generated intense cold, was the victor.</p>

<p>An Indian devotee said that when Prabhupāda was very ill in Vṛndāvana with a high fever he had prayed that the <em>viṣṇu-jvāra</em> might reduce his fever. “So we were just reading the <em>Bhāgavatam</em> when you were sick. Anybody suffering from fever means you read such and such a portion. So it should come down.”</p>

<p>It seemed like a nice sentiment, but from Prabhupāda’s pure devotional viewpoint it wasn’t acceptable. “No, Viṣṇu should not be utilized for curing your fever. That is not <em>bhakti</em>. That is business.”</p>

<p>Kīrtanānanda Swami asked, “Can a disciple invoke Lord Viṣṇu’s help for serving his spiritual master?”</p>

<p>Śrīla Prabhupāda replied more enthusiastically. He also revealed something of his internal mood in his struggle to establish the Bombay temple. “Hm! That is nice. That is for curing Viṣṇu’s representative. When we were in danger, there was so much obstruction for constructing the temple, and we prayed to Kṛṣṇa that it should be stopped. We prayed to Kṛṣṇa, ‘Please give your protection.’ That is for Viṣṇu’s purpose.”</p>

<p>As we walked along the firm sand near the water’s edge we suddenly found ourselves caught in a small cul-de-sac formed by the incoming tide. The flux of the waves revealed a shining object imbedded in the sand, glinting in the sunlight like a valuable gem. Lokanātha ran over to see. It was a piece of broken glass.</p>

<p>Everyone laughed as Prabhupāda declared, “That is called <em>māyā!</em> The light is here, but it appears light is there. This is called <em>māyā</em>. The real world is the spiritual world and here it is simply reflection, but we are taking this is real world.”</p>

<p class="verse">* * *</p>

<p>After greeting Their Lordships Śrī Śrī Rādhā-Rāsabihārī and receiving <em>guru-pūjā</em>, Śrīla Prabhupāda took a tour of the building site. The foundation work has begun and some of it is already completed. He made a thorough inspection—questioning, advising, and discussing the overall plans with Saurabha.</p>

<p>He seems satisfied with the progress and proud that the building will be unique in this area of Bombay. It was a long, hard struggle to get the land, hold onto it, and finally obtain the permission to build.</p>

<p>Now, with the same determination and strong desire, Śrīla Prabhupāda is pushing on the building effort. This will be the biggest temple and <em>āśrama</em> complex in ISKCON to date, and he wants to offer it to Their Lordships Śrī Śrī Rādhā-Rāsabihārī.</p>', '', '1975-12-23', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- December 24th, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'December 24th, 1975',
    '', '', '', '',
    '', '', '', '',
    E'<p>This is Śrīla Prabhupāda’s final day in Bombay. He is scheduled to go to Gujarat tomorrow.</p>

<p>Dr. Patel joined us again on the beach, his good humor restored. The doctor had previously extolled the value of experimentation in the search for truth, so Prabhupāda took it up as today’s theme. He challenged Dr. Patel why the truth should be the subject of experimentation. “If one knows the truth,” he said, “there is no question of experiment.” As usual, after some debate, Dr. Patel concurred.</p>

<p>Prabhupāda emphasized the principle that although the method of searching for the truth may be experimented with, the truth itself is not subject to experimentation.</p>

<p>As we headed back toward the temple, we observed men and women on Juhu Beach going through their daily routines, vigorously swinging their arms and legs, bending and stretching in imitation of the Western mania for exercise. In Bombay especially, Indians are obviously becoming more and more interested in their bodies and less and less interested in their souls.</p>

<p>Lokanātha Swami asked what it is that creates the attraction between men and women, since all bodies are made of the same ingredients.</p>

<p>Prabhupāda gave an elaborate reply. “You want to be attracted. God has made in such a way that both of them are attractive to one another. That’s all. You want to be attracted; therefore woman is made attractive. And the woman wants to be attracted; man is attractive. This is nature’s arrangement so that you may be bound up by this attraction. You are already bound up, and by this attraction you will be more tightly bound up.<em> Puàsaḥ striyā mithunī-bhāvam etaà</em>. The whole material attraction means a man’s attraction for woman and a woman’s attraction for man. But when they are seeking, where is woman? Where is woman? Where is woman? And the woman is seeking. They come here to make this business. And when they are actually attracted or united, then this bondage will become more tight.</p>

<p>“Therefore, the Vedic civilization is how to slacken it, and ultimately by force, separation, <em>sannyāsa</em>. Because unless they are separated, there cannot be any spiritual advancement. That is the whole process. Their unity is bondage. I have written a letter, that man is good, woman is good, and when they are united, they are bad!”</p>

<p>Prabhupāda laughed. “Both of them are bad. And the material world is taking this is the best thing. But actually that is not. Man is good, because he is part and parcel of God. And woman is good, part and parcel of God. But when they unite, they become bad.”</p>

<p>Lokanātha Mahārāja asked whether <em>gṛhasthas</em> could make spiritual advancement.</p>

<p>Prabhupāda replied candidly, “That advancement is not very solid. But there is advancement, but it is not very solid.”</p>

<p>“They say we want to come together to serve the Lord, is that excuse or is that...?”</p>

<p>Prabhupāda broke into a smile. “Together they go to hell!” He explained that ultimately the spirit of detachment must be there, no matter what the external dress. If a householder is working only for Kṛṣṇa, then he is also a <em>sannyāsī</em>.</p>

<p class="verse">* * *</p>

<p>Later in the day a telegram arrived from Rādhāballabha, the Los Angeles BBT book production manager. He informed Śrīla Prabhupāda that on the disappearance of Śrīla Bhaktisiddhānta Sarasvatī Ṭhākura they had offered the latest volume of <em>Śrīmad-Bhāgavatam</em>.</p>

<p>Prabhupāda telegraphed a reply, “Thank you. Be blessed. My Guru Maharaja will be very much pleased upon you and all other workers on the holy occasion of his disappearance day.”</p>

<p class="verse">* * *</p>

<p>I spent the day packing and preparing for tomorrow’s trip. Several village programs have been arranged, and Śrīla Prabhupāda is very enthusiastic. He stressed the importance of preaching in the villages, telling Hansadūta, Harikeśa and me that he had a long cherished desire to preach from village to village in India. Prior to coming to the West he was unable to do it, but now he is getting the opportunity to fulfill his desire.</p>', '', '1975-12-24', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


END $$;
