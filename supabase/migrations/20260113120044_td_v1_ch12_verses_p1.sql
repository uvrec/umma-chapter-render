-- ============================================
-- TD Volume 1, Chapter 12 - Verses
-- ============================================

DO $$
DECLARE
  v_book_id uuid;
  v_canto_id uuid;
  v_chapter_id uuid;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = 'td';
  SELECT id INTO v_canto_id FROM public.cantos WHERE book_id = v_book_id AND canto_number = 1;
  SELECT id INTO v_chapter_id FROM public.chapters WHERE canto_id = v_canto_id AND chapter_number = 12;


  -- April 11th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'April 11th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>We landed in Bombay at 10:30 a.m. to a big airport reception from the devotees. The ISKCON Bombay devotees honored Śrīla Prabhupāda with a lavish foot-bathing ceremony and <em>guru-pūjā</em> on his arrival at Hare Kṛṣṇa Land. They do this every time he visits.</p>

<p>The landscape is changing rapidly, with construction work steadily progressing. Śrīla Prabhupāda was pleased to see that contractor, E.E.C., has already begun work. They’ve started the actual temple structure and will soon begin work pre-casting the domes.</p>

<p>This evening Prabhupāda gave a long <em>darśana</em> that lasted until 8:30 p.m.</p>', '', '1976-04-11', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- April 12th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'April 12th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Prabhupāda made a careful inspection of the entire building site before taking his walk on the beach. All the ground-floor construction for the temple, the auditorium, and the twin-towered guest house is finished.</p>

<p>As usual, Dr. Patel joined us. Their discussion was lively. Śrīla Prabhupāda told him about our recent application for 350 acres of land in Māyāpur. He also informed him of his plan to build a Vedic Planetarium to exhibit the different planetary systems.</p>

<p>Dr. Patel said he had recently read a news article wherein Russian scientists were prepared to accept that there are other planets in the cosmos that have human life. He thought that the Russian interest in Vedic culture would eventually bring about an end to the purely materialistic philosophy of Marx, replacing it with the idea of spiritual communism. He declared that in another twenty years, Communism would be as watered down in Russia as it presently is in India.</p>

<p>When Gurudāsa Mahārāja said absenteeism from work is the biggest problem in Russia, Prabhupāda joined in with a short story to illustrate the problem of centralization. “There is a story in Bengal. A woman had seven sons. The mother requested her first son, ‘My dear boy, now I am going to die. Take me to the Ganges side.’</p>

<p>“He said, ‘Why? You have got so many other sons, why you are requesting me?’</p>

<p>“And then second son, third... Everyone said like that, and she died without Gaṅgā. So this [Communism is like that]...Everyone has to work. And he thinks that ‘Why I shall work? Let him work. No work today.’”</p>

<p>Dr. Patel conjectured that it is therefore important for individuals to have a sense of possession. Even with all of our philosophical understanding that we are not the body, we still have the sense that we possess a body. This concept is difficult even for aspiring devotees to give up, what to speak of the Russians.</p>

<p>Prabhupāda, however, pointed out that spiritually there is a higher sense of possession. Everything is possessed by God; that is perfection.</p>

<p class="verse">* * *</p>

<p>Class was on the verse <em>brahmacārī gurukule vasan danto guror hitam,</em> from <em>Śrīmad Bhāgavatam</em> 7.12.1.</p>

<p>In the simple setting of Śrī Śrī Rādhā-Rasabihārī’s temporary, open-sided, tin-roofed temple, now looking more inadequate than ever as the very large complex rises by its side, Prabhupāda delivered a strong lecture. He emphasized the need for <em>tapasya,</em> or austerity, in human life.</p>

<p>He said that Vedic culture means to control the senses, especially the sex urge, because sex is the highest material pleasure. One should therefore learn the life of <em>brahmacārya</em>, celibacy, from the guru. However, if one becomes a devotee, his taste for material life automatically diminishes. Therefore there is no need to practice <em>brahmacārya</em> as a discipline separate from devotional service.</p>

<p>Yet even advanced devotees are sometimes victimized by sex desire. Thus he warned us that although mixing between men and women is inevitable, we must be very cautious. “Therefore you should be very, very careful. Very, very careful. Just like in our Society, compulsorily we have to mix with women, not only women, very beautiful young girls. But if one is not agitated even in this association of beautiful women and girls, then he is to be considered <em>paramahaàsa,</em> he is very advanced. <em>Paramahaàsa</em> means he’s above all these material qualities. So we cannot avoid in our Kṛṣṇa consciousness movement.</p>

<p>“That was the problem from the very beginning. In India there is restriction between men and women, free intermingling, but in your country there is no such restriction. Therefore I got my disciples married. They criticize me that I have become a marriage-maker. Anyway, I wanted at least to regulate. That is required.”</p>

<p>Prabhupāda explained that if a man gets married and sticks to one wife, and if he takes permission from his spiritual master before having sex, observing the <em>garbhādhānasaàskāra,</em> or purificatory rites, then he is also considered a <em>brahmacārī</em>.</p>

<p>He said the ability to observe the <em>brahmacārī</em> standards depends on the relationship between the guru and disciple. “This can be possible when one is very thickly related with the guru. Otherwise ordinary relationship will not do. One who is convinced that ‘If I can please my guru, then Kṛṣṇa will be pleased...’ This is called <em>sudṛdha,</em> full faith. ‘And if I displease my guru, then I have no place.’</p>

<p>“Of course, guru cannot be a false guru. False guru has no such thing. If guru is genuine and the disciple is genuine, then both of them are benefited, and they go back to home, back to Godhead. Thank you very much.”</p>

<p class="verse">* * *</p>

<p>Gurudāsa Mahārāja told Prabhupāda that Mr Kanailal Taparia, a Bombay Life Member, has offered the use of some land and buildings near Fogal Āśrama in Vṛndāvana. It’s about a seven-minute walk from our temple, just off the <em>parikrama</em> path. The property has a few buildings on it but is mostly undeveloped. Prabhupāda is eager to get it because we need a place for our householders to live. The women and children currently occupy rooms in the guest house, and Prabhupāda is not happy at the disturbance they cause for our guests.</p>

<p class="verse">* * *</p>

<p>As in Vṛndāvana, Prabhupāda also wants a <em>gurukula</em> here in Bombay. There may be a side benefit from this as well: there is a law that we can rightfully evict any existing tenants if we claim use of the buildings for a school.</p>', '', '1976-04-12', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- April 13th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'April 13th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>On the walk along the sands of Juhu beach, Dr. Patel suggested to Śrīla Prabhupāda that he have a Sanskrit school in the new temple complex. Prabhupāda said that he has no objection, but it is not essential since he has already translated so many Sanskrit texts into English, which any educated person can read.</p>

<p>Dr. Patel still seemed to think that there was an advantage to reading the original language, but Prabhupāda said that even so-called Sanskrit <em>paṇḍitas</em> cannot read it properly. Apart from that, it isn’t just a question of understanding the language, it requires hearing attentively. The message of the <em>Vedas</em> is learned by hearing, not by studying. The message is to become Kṛṣṇa conscious.</p>

<p>He quoted a song by Śrīla Narottama dāsa Ṭhākura that states that if one does not take to Kṛṣṇa consciousness he is knowingly committing suicide. Being absorbed in material affairs is exactly the same as drinking poison.</p>

<p>Kṛṣṇa consciousness means always thinking of Kṛṣṇa, but generally people do some meditation for fifteen minutes and think of something else for twenty-four hours. Prabhupāda described a personal experience he’d had with Mohandas K. Gandhi. “I have seen Gandhi’s prayer meeting; I attended. Utmost, five minutes reading <em>Bhagavad-gītā,</em> then again politics, immediately. Immediately politics. I was in Delhi. I attended the meeting when Noakhali prayers ....This was his prayer. I have seen. And as a result of this, in that prayer meeting he was killed. He could not chant the holy name.”</p>

<p>Regarding Dr. Patel’s suggestion for learning Sanskrit, Prabhupāda concluded that if a student is serious he can learn simply from reading his books, because in them he has given the word meanings. After studying a few sentences one can understand the verb, the subject, object, and so forth. Prabhupāda told Dr. Patel that if he would have had more time he would have made a Sanskrit grammar based on <em>Bhagavad-gītā,</em> but now he is too busy. He suggested Dr. Patel do it, since he knows both Sanskrit and English. “You can do that. People will read it, <em>Bhagavad-gītā</em> grammar. On the <em>Bhagavad-gītā</em> teach them grammar. Just like Jīva Gosvāmī compiled <em>Hari-nāmāmṛta-vyakāraṇa,</em> similarly, you write. You have the knowledge of Sanskrit, and through English, [teach it using] <em>Bhagavad-gītā</em> grammar. People will take it.”</p>

<p class="verse">* * *</p>

<p>In today’s class from the <em>Śrīmad-Bhāgavatam</em> 7.12.2, we continued on with hearing a description of the activities to be performed by the <em>brahmacārī</em> student.</p>

<p>Prabhupāda stressed that development of character is the first stage of training, because without good character everything else is useless. He told the story called <em>punarmūṣikabhava</em>—Again You Become a Mouse.</p>

<p>A mouse was being chased by cats, so by the grace of a great sage, he was transformed into a cat. Then he had trouble with dogs, and again the sage transformed him, this time into a dog. In this way, eventually he was changed into a powerful tiger. But then he looked hungrily at the same sage who had elevated him. Instantly, the sage turned him back into a mouse.</p>

<p>The idea is that by the grace of a higher power one may be elevated to a higher position in life, but if one abuses the privilege, then again the opportunity may be withdrawn. Scorning the material scientists, Prabhupāda told us not to misuse our human form of life. “So our civilization is like that, that in the gradual process of evolution we have come to the platform of human being. This human being is meant for understanding God, but they are forgetting God. Therefore the next stage is <em>punarmūṣikabhava,</em> again become monkey. That is waiting us. The nature’s law is like that, that from monkey we have become human being, and in the human being we are dancing like monkey. So nature will say, ‘All right, again you become monkey.’”</p>

<p>He told us that a devotee also has the potential to return to his origins. Kṛṣṇa says in <em>Bhagavad-gītā</em> that if one prepares himself correctly, one can go to the heavenly planets, to the abode of the demigods, or even beyond, to the spiritual realm.</p>

<p>“This Kṛṣṇa consciousness movement is simply a very scientific movement that will help the human society not to be degraded again; to be elevated....Kṛṣṇa says ‘If you prepare yourself to come to Me, back to home, back to God, you can do that.’ So what should be our aim of life? We shall go to the higher planetary system or back to home, back to Godhead? ‘Back’ we say, because we have come from God.</p>

<p>“Just like a man is put in the prison house. He has come from his free home. By his work he is criminal; therefore he is put into the prison house. Similarly, we are all part and parcel of God. Our real home is <em>Vaikuṇṭha</em>. But we have come here. How we have come, that is a very mysterious thing, but we are part and parcel. Bhaktivinoda Ṭhākura has sung, <em>anādi karama phale, pori bhavārṇava jale</em>. Somehow or other we have fallen; therefore the real aim of life, how to get out of this <em>bhavārṇava,</em> nescience, that is the aim of life.”</p>

<p>The verse mentioned the importance of worshiping the guru, and Prabhupāda stressed this as the most important aspect of human life. He also explained who is a real guru. “If you have got real guru, and if you follow him, then your life is successful. There is no doubt. But if you have a so-called, bogus guru without any knowledge of the <em>śāstra,</em> then your life will be spoiled. Especially the Māyāvādī guru, Caitanya Mahāprabhu has warned. Māyāvādī guru means one who thinks that everyone is God—if you approach such guru, then your life is spoiled: <em>māyāvādī bhāṣya śunile haya sarva nāśa</em>. Finished. Your spiritual progress finished.”</p>

<p>He concluded that training should begin at a young age and be centered on character development. Afterward, further academic studies can be introduced. He quoted a Bengali phrase, “When the bamboo is green, you can bend it, but when it is yellow, dried, it will crack.”</p>

<p class="verse">* * *</p>

<p>Pradyumna dāsa, tall, bespectacled, thin, and somewhat eccentric, arrived from South India today. He has a reputation among the devotees as a Sanskrit scholar. Some of them, even Prabhupāda sometimes, call him Paṇḍitjī.</p>

<p>His wife, Arundhatī dāsī, had spoken with Prabhupāda in Māyāpur, and he had requested that Pradyumna come to see him. Prabhupāda wants him to join his party as his Sanskrit editor. Rather than translating all the Sanskrit himself, he wants Pradyumna to do it. This strategy will save a lot of time and effort and speed up the publication of the <em>Bhāgavatam,</em> because it will free Prabhupāda to concentrate on writing his purports.</p>

<p>After some discussion it was decided that Pradyumna prabhu will join us in Hawaii in May.</p>

<p class="verse">* * *</p>

<p>Punjabi Premananda, a local student, sent a letter to Prabhupāda after attending the walk this morning. He asked a number of questions, seeking clarification from Śrīla Prabhupāda on his comments that knowing Sanskrit and studying are not as important as simply hearing the <em>śāstras</em>. He is currently reading a Sanskrit work by Rāmānujācārya, the <em>Vedānta-sāra,</em> with Sanskrit commentary by two other <em>ācāryas</em>. He asked whether he should stop this and simply hear.</p>

<p>He also mentioned that a number of politicians were going village to village on <em>pādayātrā,</em> traveling by foot, and in this way getting many donations of land. He suggested that Śrīla Prabhupāda might do the same.</p>

<p>Typing sometimes in capitals for emphasis, he said, “IF YOU STARTED PADAYATRA or at least if YOU WENT TO VILLAGES IN CAR FOR THE TIME (FOR A FEW MONTHS) then naturally many people will give land which can be used for KRISHNA’S SERVICE. AND SO MANY PEOPLE WILL BE BENEFITTED BY HAVING YOUR DARSHAN (VISION). I am not at all commanding you, just an idea that struck my mind regarding the above said content of the PADAYATRA.”</p>

<p>Finally, on the comment Prabhupāda had made that Gandhi was simply reading the <em>Gītā</em> for five minutes and then discussing politics, he added his agreement that it is very difficult to think of Kṛṣṇa and work in an office. He is studying for his B.A. in philosophy and psychology, and he wanted to know how he could keep his mind fixed on Kṛṣṇa consciousness.</p>

<p>He added a telling comment, a confirmation of Śrīla Prabhupāda’s many remarks about the unfortunate condition of the youth of India. “I find so much opposition, when I just mention about Krishna, or try to tell them about Krishna consciousness to my College friends. They simply criticize and say, ‘Oh, you are a bore, you always bore us, why do you speak about other-worldly?’”</p>

<p>Śrīla Prabhupāda answered all his points, first of all explaining that reading <em>Bhagavad-gītā</em> is all right, but if one does it independently there is a chance of being misled. Therefore one should hear from an authorized source, i.e., a self-realized person, a bona-fide guru.</p>

<p>“Mental speculation will not help. Hearing is the main point. In the Bhagavad-gita it is written, dharmaksetre kuruksetre...when you hear from a realized soul, a person who knows things, he explains that Kuruksetra is a place where religious ritualistic ceremonies are performed from time immemorial....But if you read the books of some cunning politician, he’ll mislead you, and you’ll learn that Kuruksetra means this body, which is not actually the fact.”</p>

<p>Concerning his suggestion for <em>pādayātrā,</em> Prabhupāda welcomed it. With the same enthusiasm he has recently injected into Hansadūta Mahārāja, Prabhupāda encouraged the boy to participate. “If Indian young men join me, I am immediately ready for this traveling touring from village to village, town to town. However, my foreign disciples have the language defect, they can’t speak the village language, otherwise I would have started this program long ago. If some young men like you would join me then along with some foreign disciples I can immediately take up this program. If you are very eager, please get hold of at least half a dozen young men like you then with another half dozen foreign disciples, I can immediately take up this program and tour village to village and town to town. It will be very, very effective, I know that.”</p>

<p>On the boy’s last point Prabhupāda gave him the simple straightforward method for remembering Kṛṣṇa: simply chant. “Your associates are harassing you for your interest in spiritual culture; yes, that is due to India’s great misfortune. They’re impressed with so-called politicians and scholars of the modern age. The example is given in this connection that when a man is ghostly haunted, he speaks all nonsense. At the present moment they’re all ghostly haunted and in this delirious condition, the only cure is chanting the Hare Krsna maha-mantra.”</p>

<p class="verse">* * *</p>

<p>Prabhupāda showed us how to prepare lunch with his three- tiered cooker today. Before his massage was finished, he got up and we went to the kitchen. He loaded the cooker, putting <em>dāl</em> in the bottom tier, rice in the middle, and vegetables on top. He set the cooker on a low flame and had Pradyumna make some <em>capātī</em> dough. Thirty-five minutes later he came back to the kitchen and chaunched the <em>dāl,</em> spiced the vegetables, made <em>capātīs,</em> and then ate. It was a simple, wholesome meal, expertly prepared with a minimum of fuss.</p>

<p>We were fortunate to share his remnants, which to me tasted far better than usual, having been cooked with his own hands.</p>

<p class="verse">* * *</p>

<p>Prabhupāda has had me collect the bitter leaves of the neem tree and dry them in the sun on the roof. Today, after crushing the dried leaves, I filled a bag with the fine powder, to take with us on the coming tour for use in cooking, to stimulate and improve his appetite.</p>

<p>A few other items which have also been left on the roof to be exposed to the sun’s powerful rays are some of the many books Prabhupāda uses for translation work. These books have been stored in his <em>almirah,</em> and when Pradyumna sorted through them he discovered that many had become infested with book worms. Thus Prabhupāda prescribed a prolonged dose of sunshine to remedy the problem.</p>', '', '1976-04-13', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- April 14th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'April 14th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Today is Hanumān Jayantī and Balarāma Rāsayātrā. The devotees celebrated with a big festival.</p>

<p class="verse">* * *</p>

<p>Prabhupāda talked a lot on his walk, especially focusing on the topic of the <em>gurukula</em>. He told Girirāja, the temple president, that a large <em>gurukula</em> should be constructed on our land here in Bombay. He said that twice a day the boys can come to the beach and sport and swim. In this way they will grow healthy, get a good education, and become men of good character. They will learn to control their senses, and this will save them from becoming “nonsense.”</p>

<p>Prabhupāda said there are many wealthy persons in Bombay who would want to put their children in such a school, because they are not concerned whether their children become expert technologists or not. When you have wealth, you can hire others to do such work.</p>

<p>He told of a man he knew in Allahabad who was a Ph.D., yet he could not get a job. The man was manufacturing soap bars at home and going by cycle every day to sell them in the market. Although he had a Ph.D., he was living like a coolie.</p>

<p>Prabhupāda emphasized that therefore one should not make much endeavor for economic advancement, because whatever one is due, either success or failure, is already decided. Getting a Ph.D. will not change that. One should simply try to become Kṛṣṇa conscious. He mentioned that Mr. Modi, the founder of Modinagar, where we recently had our program, was not an educated man, but he had fifty thousand people working for him.</p>

<p>Girirāja told a similar story about Henry Ford. He had been criticized by a newspaper that he was an ignorant man. He brought a case against the paper, and in court the defense lawyer began asking him questions on science and history. At one point Henry Ford turned to the judge and said, “In my office I have a panel of buttons, and I can press any button and someone will come running to answer any of these questions. So am I ignorant?”</p>

<p>In the course of the walk, Prabhupāda also told us a couple of amusing stories. “When I was a child my father gave me one red gun; I was not more than eight years. Then, after getting one, I said, ‘I must have another one.’</p>

<p>“Then father said, ‘Why another one? You have got already one.’</p>

<p>“So I said, ‘No, I have got two hands. I must have two guns.’ Then my father, ‘No, you are not...I am not going...’ Then I made so much agitation, he was obliged to give me two guns.”</p>

<p>We all laughed at his description as he went on to tell us that he was the “very pet child of my father and very pet son-in-law also.” Then he added that he was the pet disciple of his guru also.</p>

<p>The other story he told illustrated how intelligence is superior to strength. “There was a lion in the forest, and he was disturbing all the animals. So there was a peace conference: ‘Sir, you don’t disturb every one of us. We shall come automatically.’</p>

<p>“So one day it was the turn of a rabbit. So he was a little late, so the lion said, ‘Why you are late? My time is over.’</p>

<p>“‘Yes sir, another lion on the way, he wanted to eat me. So I said, ‘No, you cannot eat me. I will be eaten by such and such Mr. Lion.’</p>

<p>“So he became very angry. ‘Who is that?’</p>

<p>“‘Yes, come on. I will show you.’ So he got him near a well, and he said that ‘Here is the lion.’</p>

<p>“So immediately, ‘<em>Graww!</em>’</p>

<p>We laughed as Prabhupāda imitated the lion growling.</p>

<p>“And there was sound, ‘<em>Graww!</em>’ Then he saw the reflection and immediately jumped over. <em>Buddhir yasya balaà tasya nirbuddhes tu kuto balaà paśya siàha madonmataḥ śaśaḥ kena nipatata</em>: A <em>śaśa,</em> rabbit, killed a big lion by intelligence.”</p>

<p>This story is from the <em>Hitopadesha</em>. Śrīla Prabhupāda mentioned that Aesop’s Fables, popular in the West, were actually derived from the <em>Hitopadesha</em>.</p>

<p>On the way back into the temple grounds, Prabhupāda noticed a new minibus. It is for Acyutānanda Swami to tour South India in. When he heard that they are planning to have Rādhā and Kṛṣṇa installed in the bus, he suggested Gaura-Nitāi would be better. But on being informed that the people in South India like Rādhā-Kṛṣṇa and are not so familiar with Gaura-Nitāi, he conceded.</p>

<p>As we walked on past the building site, Saurabha said that work on the temple structure is going on smoothly and quickly. Only three stories remain to be built on the twin towers that will be the guest house.</p>

<p class="verse">* * *</p>

<p>This morning’s verse for class emphasized the necessity of studying the <em>Vedas</em> under the guidance of the guru. Prabhupāda explained that this does not mean everyone has to know Sanskrit. One simply has to hear and chant nicely; it isn’t required that one be an erudite scholar. So the program he advised for the <em>gurukula</em> is for the students to attend <em>maṅgala</em>-<em>ārati</em> and <em>guru-pūjā,</em> and then <em>Śrīmad-Bhāgavatam</em> class. “So one should read or hear: <em>candāàsyadhīyitaguroḥ</em>. It is guru’s duty. Transcendental knowledge, one should approach guru. So <em>gurukula</em> means ‘guru’s place.’ So he keeps the disciples to learn the Vedic literature. This is <em>gurukula</em>.</p>

<p>“We are constructing such big, big houses. Why? We are inviting people to come here and live in this <em>gurukula</em> and learn Vedic literature. This is our purpose. Bombay is a very big city, people are rich, so we can give you nice room, nice <em>prasādam</em>. Come here, live here at least once in a week and learn Vedic literature, Vedic civilization. The essence of Vedic literature is <em>Śrīmad-Bhāgavatam</em>.</p>

<p>“Our mission is to invite people to take advantage of learning Vedic literature. And what is the ultimate goal of studying Vedic literature? To understand Kṛṣṇa. Therefore our Movement is known as Kṛṣṇa consciousness movement.”</p>

<p>He also gave a practical example to show the nature of the exchange between guru and disciple. This is something that we on his personal party experience daily. “The son may be offender, but when he comes and offers his respect to the father, he [the father] forgets.</p>

<p>“So that should be done regularly, <em>suyantritaḥ,</em> just like machine. As soon as one sees guru, immediately he must offer obeisances. Beginning, end also. When he comes to see guru he must offer obeisances, and when he leaves that place he must offer obeisances. And in the in-between, coming and going, he should learn from the guru Vedic understanding. This is the principle of living in <em>gurukula</em>. So our students, they are very obedient. And if our students see the guru hundred times, he practices this process, offering obeisances while meeting and while going. These things are to be practiced. Then he’ll be self-controlled.</p>

<p>“Obedience is the first law of discipline. If there is no obedience there cannot be any discipline. And if there is no discipline you cannot manage anything. That is not possible. Therefore this is very essential, that the students should be very disciplined.”</p>

<p>He told us how this idea of <em>gurukula</em> training had long been on his agenda, complaining again about the unfortunate mentality that has overtaken the people of India. “This is essential. To make the human life really civilized, the children should be sent to the <em>gurukula</em>. But there is no <em>gurukula</em> at the present moment. So we are starting. We have some <em>gurukula</em> in the United States, Texas. We are starting another <em>gurukula</em> in Vṛndāvana, and we can start another <em>gurukula</em> here in Bombay to train the students.</p>

<p>“I wanted to start this <em>gurukula</em> long, long, ago before going to the USA, in 1960. Say ’62, ’61. But I approached so many gentlemen friends; they never agreed to give their sons to <em>gurukula</em>. They never agreed. Everyone said, ‘Swamijī, what benefit there will be by training our students in the <em>gurukula</em> way? They have to earn their bread.’ So that is India’s position now. They do not care for their original culture. They are after money.”</p>

<p>Prabhupāda emphasized that without proper training one is living a very risky life. There is danger of gliding down to become a cat or dog in one’s next life. Therefore, this Kṛṣṇa consciousness movement is meant to remove that risk.</p>

<p class="verse">* * *</p>

<p>Jayapatāka Swami, Gopāla Kṛṣṇa, and Abhirām prabhus have come to Bombay to obtain Saurabha’s plans for the development of the Māyāpur and Calcutta projects.</p>

<p>Our chances of actually getting the lake across the street from the temple in Calcutta are apparently growing. Now we must show our plans for development.</p>

<p class="verse">* * *</p>

<p>In his room in the afternoon Prabhupāda discussed the visa problems faced by our foreign devotees. Viśāla and his wife, Viśālinī, who were formerly living in Vṛndāvana, have just returned to India after having been forced by the government to go back to the West to renew their visas.</p>

<p>Śrīla Prabhupāda suggested that ISKCON devotees should now lobby in Parliament for recognition of our true Vaiṣṇava status. We should state that we are coming here on pilgrimage. Why should we need visas, or even passports, he asked? Other religious pilgrims do not require to have visas in visiting Mecca or Jerusalem, etc. Why should we be put into difficulty? If this tactic fails, he suggested that we approach the United Nations as well.</p>

<p class="verse">* * *</p>

<p>Since there were only a few visitors today, before taking his massage, Śrīla Prabhupāda replied a small amount of mail as he sat in his sitting room. He sent Akṣayānanda Mahārāja a letter informing him of Mr. Taparia’s offer to let us use his house in Vṛndāvana. There are a dozen rooms there altogether, and he instructed that the householders could all move there and occupy the ten smaller ones. He suggested that the two large rooms may be used as a temporary <em>gurukula</em>. Śrīla Prabhupda is so keen to end the regular commotion in the guest house caused by having families living there as permanent residents that he told Akṣayānanda Mahārāja they can move onto the property even though the land is not ours. He said that later on we can negotiate to purchase it, or Mr. Taparia may even be willing to donate it.</p>

<p>Śruta Kīrti, who Prabhupāda wrote while we were in Māyāpur, is now in Boston with Ambarīṣa prabhu. Śruta Kīrti telephoned Puṣṭa Kṛṣṇa Swami the other day and reported that there is a good opportunity to begin a restaurant there. Ambarīṣa is prepared to invest a substantial amount, but there is a lack of manpower.</p>

<p>Therefore Śrīla Prabhupāda wrote to Hāsyapriya dāsa, the Los Angeles temple president, to suggest that perhaps eight devotees could go from there to work on the project. He said that it would also be a good opportunity for Hāsyapriya to learn how to run a restaurant, because Ambarīṣa and Śruta Kīrti have already successfully opened one in Hawaii.</p>

<p>Śrīla Prabhupāda also read an advertising pamphlet distributed by one of his Vṛndāvana-based Godbrothers, Bon Mahārāja. It mentioned his life history and his preaching expeditions to the West: “following the tradition of Vivekananda, Ram Tirtha and Ramakrishna <em>sannyāsīs</em>.” Prabhupāda shook his head disapprovingly, saying, “I had a little respect for him before, but now I can understand him. This means he is a Māyāvādī. He is giving advertisement to Vivekananda.”</p>

<p>The tract also described how Bon had spent four years undergoing penance in an underground cell. When he came out he was inspired to start his college. It seemed it was meant to sound as if he had undergone great austerity and emerged at the end of it with a divinely inspired revelation.</p>

<p>Śrīla Prabhupāda explained that Śrīla Bhaktisiddhānta had actually never liked this man. After His Divine Grace’s departure one astrologer told Bon that he was an offender to his spiritual master. He was conscious of this, so the atonement was given that he should offer leaves of the <em>Bael</em> tree to Lord Śiva. Thus he went into his cell.</p>

<p>Prabhupāda told us that this was a mundane attempt to rectify himself. He had planned to create a Vaiṣṇava University and worked very hard on the project, but it was never successful.</p>

<p class="verse">* * *</p>

<p>In the evenings Śrīla Prabhupāda is enjoying the warm atmosphere by sitting out on the roof. We take up an <em>āsana</em> for him and pillows and mats for any guests that come. Generally there are only a few guests, so Prabhupāda has a chance to relax, although he is always keen to preach.</p>

<p>During tonight’s session, Prabhupāda told a visitor that the potency of chanting done in the temple is increased a thousand times compared to that done elsewhere. Therefore so many people go to places like Vṛndāvana to chant.</p>', '', '1976-04-14', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- April 15th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'April 15th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>One of the memorable features of being in Bombay is waking up in the morning to the all-pervasive stench of an open sewer channel that runs right past our back boundary. It is enough to make you gag, and it seems all the worse to me because our quarters are at the back of the land. The smell only disappears once the sun comes up, so it is something of a relief to go down to the beach every day and breath some fresh air. It is an unfortunate blemish in an otherwise idyllic setting.</p>

<p class="verse">* * *</p>

<p>This morning’s beach walk gave rise to a long, interesting conversation between Prabhupāda and the barefoot Dr. Patel. Śrīla Prabhupāda explained everything to him—from the uselessness of vegetarianism, to the perfection of Communism.</p>

<p>As far as being vegetarian goes, Prabhupāda told us about a Jain monk who came to meet him in Berkeley, America. When Prabhupāda had asked him what the results of his preaching were, the man replied that he had converted one million people to vegetarianism. But Prabhupāda didn’t give him much credit for that. Although the Jains advocate nonviolence, Prabhupāda pointed out that being vegetarian is violence, since one has to kill the vegetables. Nor does being vegetarian or nonviolent mean one is on the spiritual platform. Garuḍa is the personal carrier of Lord Viṣṇu, yet he eats snakes; and Kṛṣṇa ordered Arjuna to kill his enemies. He said that the real point is to follow the order of Kṛṣṇa.</p>

<p>Dr. Patel interpreted the meaning of this as “feeling that one is doing every thing for Kṛṣṇa.”</p>

<p>Prabhupāda responded that the orders are factual, not feelings. He also showed the vital role the spiritual master plays. “Not feel, but actually it’s an order. Arjuna did not feel; he took order to kill. Not that you manufacture your idea. No. You take order directly and then do it—otherwise you’ll be responsible. Therefore the guru is required to act as representative of Kṛṣṇa. If he says, ‘Yes, it is all right,’ then it is all right. Otherwise not. <em>Yasya prasādād bhagavat-prasādaḥ</em>. Otherwise why guru is required? We must take every moment order from him.”</p>

<p>Prabhupāda told the doctor that simply by becoming Kṛṣṇa conscious one develops all good qualities, so there is no need for a separate endeavor to be vegetarian.</p>

<p>The discussion moved on to the topic of scientists, and Śrīla Prabhupāda highly praised his disciple Svarūpa Dāmodara, for writing the book <em>The Scientific Basis of Kṛṣṇa Consciousness</em>. “Dr. Svarūpa Dāmodara, Ph.D.; you have read that book? It is first class. The scientist, so-called scientist, unless he is insane, he cannot say that there is no God. He has written so nice.”</p>

<p>Dr. Patel interjected. “But the real scientists are also God conscious.”</p>

<p>“That is all right. He is real scientist.”</p>

<p>“You have been unfortunately against them,” Dr. Patel argued, “but think of Albert Einstein. He was totally God conscious throughout his life.”</p>

<p>“Yes,” Prabhupāda agreed. “He is all right, but mostly they say, ‘What is the use of God? Now science, everything science.’ They say like that.”</p>

<p>Dr. Patel protested. “You have been very harsh to the scientists.”</p>

<p>“They are misleading,” Prabhupāda said. “These rascals are misleading. That is the way.”</p>

<p>“He was very God conscious when he made the atomic bomb,” Puṣṭa Kṛṣṇa added sarcastically.</p>

<p>Dr. Patel found it disagreeable and bridled a bit at his junior’s disrespect. “How many of us are scientists here? He might help you also!”</p>

<p>Prabhupāda gave the ultimate perspective to settle the issue. “We know a real scientist because we know the biggest scientist, Kṛṣṇa. Therefore we are scientists. Without Him we don’t claim to be scientists—fools, rascals. He is everything. If you simply understand Kṛṣṇa, then you become scientist, philosopher. And I was never a scientist, so we challenge the scientists, and I have produced this scientist [Svarūpa Dāmodara] to challenge them. But I was never a scientist. That book is actually revolutionary amongst the scientists. <em>ScientificBasis,</em> you have read that? Very nicely he has written, very, very nicely, from all scientific...He has challenged the scientists. He has clearly declared, ‘Darwin is wrong, and scientists, they do not know.’”</p>

<p>The conversation moved on to one of their favorite topics, Communism. But this time Prabhupāda offered a different perspective. He disagreed when Dr. Patel said that Communism is finished. He said that it simply needs the addition of Kṛṣṇa, then it has value. Like a zero with a one placed in front.</p>

<p>The Communists say that religion is the opiate of the people, but Prabhupāda pointed out that opium also has its proper medical use. It is poison undoubtedly, but if it is in the hand of a physician, it is nectarine. Dr. Patel agreed that opium is the first thing they use in heart-attack cases. Therefore, Prabhupāda said, whatever God has created has some use; one must simply know how to utilize everything properly. Thus Communism will become perfect, as soon as it is connected with Kṛṣṇa.</p>

<p class="verse">* * *</p>

<p>During <em>Śrīmad-Bhāgavatam</em> class, which continued with the description of <em>brahmacārī</em> life, Prabhupāda explained the essential difference in attitude between the people of the East and West.</p>

<p>He said that human beings are thoughtful. We have developed consciousness, but when this is not applied to higher thoughts, or when there is no spiritual idea, it is misused to artificially increase the necessities of life. Nowadays even a simple action like shaving requires a machine. In the East, however, the mentality is to minimize everything.</p>

<p>“This is the distinction between East and West. Eastern civilization is, ‘If I can lie down on the floor, where is the necessity of a bedstead or a cot? If I can lie down, resting my head on the arms, why there is necessity of pillow? If I can, say, drink water with my palms like this, what is the use of any water pot?’ Minimize. Minimize. Spiritual life does not mean artificially increasing the necessities of life.”</p>

<p>Once again he expressed his strong disapproval of India’s unfortunate plight and his sympathy for the young. “So the whole thing is topsy-turvied. We have given up our own culture and imitating the foreigners and the Western countries. That also we cannot do very properly because we are meant for a different purpose in India.</p>

<p>“One who has taken birth in India, it is understood that in his previous birth he tried to cultivate spiritual culture; therefore he has been given the opportunity to take birth in India. India is so fortunate. But as soon as he takes birth, the rascal leader spoils him. The rascal father spoils him. The rascal teacher spoils him.</p>

<p>“So what can they do, the poor younger generation? They are being taught that ‘The spiritual culture is useless. Because we are so much spiritually inclined, the foreigners came and they ruled over us. Now give up all this nonsense. Become technologist.’ This is going on. So this will not make us happy.”</p>

<p class="verse">* * *</p>

<p>Prabhupāda has been taking his noon massage sitting on the tiny balcony between his bedroom and the kitchen. When we began today, I slipped the Hare Kṛṣṇa ring from his finger. He has been wearing it continuously since it was given to him in Māyāpur, but because it is a little loose I usually take it off to massage his hand.</p>

<p>Prabhupāda looked at it when it came off. Then he looked at me and said, “It is loose? So, now you try it.”</p>

<p>Surprised, but very eager, I put it on the little finger of my left hand, but it was a bit slack.</p>

<p>He said, “Oh, too big?”</p>

<p>Not wanting to lose the opportunity, I didn’t reply but quickly tried it on the little finger of my right hand, and it fit nicely.</p>

<p>“All right,” he smiled, “you can have it!”</p>

<p>I immediately offered him my obeisances and very gratefully tucked it into the fold of my <em>gamchā</em>.</p>

<p>Prabhupāda doesn’t give away such items often, so I was in ecstasy to get this special gift from him without any prompting and for no apparent reason.</p>', '', '1976-04-15', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- April 16th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'April 16th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>On today’s walk along the beach, Śrīla Prabhupāda continued his discussions with Dr. Patel, focusing again on the topic of scientists.</p>

<p>Dr. Patel predictably took a contrary view but, as always, submitted to Śrīla Prabhupāda’s superior reasoning. Being a doctor, he often gives credit to the scientists’ progress, yet he also accepts the limitedness of material science, and his conviction ultimately lies in spiritual knowledge.</p>

<p>Prabhupāda had him laughing today when he called the scientists “double <em>mūḍhas</em>.”</p>

<p class="verse">* * *</p>

<p>Today’s <em>Bhāgavatam</em> verse continued to elaborate on the life of <em>brahmacārya</em>. One responsibility is to go out each morning and evening collecting alms on behalf of the spiritual master. Whatever a <em>brahmacārī</em> does must be for the benefit of the guru.</p>

<p>Prabhupāda told us that this is the standard he has in mind for the new <em>gurukula</em> here. “A small collection, it is going to the temple for offering <em>prasādam</em> to the Lord and <em>prasādam</em> to the Vaiṣṇavas, <em>brāhmaṇas</em>. Therefore something must be given. If we open this <em>gurukula</em> as we are contemplating, the students should be trained up to go house to house and take little alms. It doesn’t matter one has to give one kilogram, no. Whatever you can, you must give. This is the system all over India still.</p>

<p>“So here it is said that <em>sāyaà prātaś cared bhaikṣyam</em>. Twice in a day the <em>brahmacārīs</em> should be trained to collect alms, in the morning, and evening. And whatever collection is there, it should be offered to the guru. Not that something kept for my own purpose. No. Everything should be offered, whatever you collect. You cannot keep, because everything in the <em>gurukula</em> or in the temple, is for the interest of guru.”</p>

<p>He did, however, recognize that in this age of Kali-yuga many of the standards mentioned in these verses are extremely difficult to follow.</p>

<p>He therefore quoted from the Twelfth Canto of <em>Śrīmad- Bhāgavatam,</em> explaining that the essence of everything is the holy names.</p>

<p>“So these things as far as possible we shall introduce, but our main principle is chant. If the <em>brahmacārīs</em> are trained up to rise early in the morning and chant Hare Kṛṣṇa, attend <em>maṅgala-ārati,</em> then go to the sea for taking bath and again come and again attend <em>vaidhika </em>school. And <em>veda-vyāsa</em>...<em>Veda-vyāsa</em> means to study Kṛṣṇa literature. Because nowadays it is not possible that the students, especially foreign students, they will be very much inclined to read from <em>Sāma-Veda,Yajur-Veda,Ṛg-Veda,Atharva-Veda,</em> or pronounce the <em>Upaniṣad,Brahma-sūtra</em>. The time is changed. As far as possible...But there is essence of all these Vedic literature. <em>Bhāṣyayam brahma-sūtrānāà vedārtha-paribṛàhitam</em>. This <em>Bhāgavata,</em> this is the essence of <em>Brahma-sūtra</em>.</p>

<p>“We are contemplating to start this <em>brahmacārīāśrama,</em> so these things should be followed, that a <em>brahmacārī</em> should always remain dedicated to the guru. Whatever collection he makes, he should offer to the spiritual master, and spiritual master will ask him, ‘My dear such and such, my dear son, please come and take your <em>prasādam</em>.’ If he forgets, then we should not go personally. And we should wait, or we shall fast. These are the some of the rules and regulations as far as possible.”</p>

<p class="verse">* * *</p>

<p>Kiśorī dāsī arrived from Vṛndāvana today. She was in quite a disturbed state. She has come to see Prabhupāda to complain that her son was mistreated at the <em>gurukula</em>. She said that he had been hit, and therefore she had taken him out of school.</p>

<p>Prabhupāda was very upset to hear that a young boy was hit by a teacher. He emphasized very strongly that this should not be done for any reason. “If a teacher hits a child he should not just be sent away, he should be hanged! He should be hanged! He should be hanged!” he declared, stabbing his right index finger in the air for emphasis.</p>

<p>Later, Gopāla Kṛṣṇa discounted Kiśorī’s claim and said that her son is quite incorrigible and has caused considerable disturbance at the school. Contrary to Kiśorī’s assertion that she is keeping him away, he said the teachers are not allowing him to attend.</p>

<p>Despite this, Prabhupāda continued to stress the point that teachers must be very kind and loving with the children, as well as strict.</p>', '', '1976-04-16', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


END $$;
