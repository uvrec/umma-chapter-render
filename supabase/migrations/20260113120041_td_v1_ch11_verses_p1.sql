-- ============================================
-- TD Volume 1, Chapter 11 - Verses
-- ============================================

DO $$
DECLARE
  v_book_id uuid;
  v_canto_id uuid;
  v_chapter_id uuid;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = 'td';
  SELECT id INTO v_canto_id FROM public.cantos WHERE book_id = v_book_id AND canto_number = 1;
  SELECT id INTO v_chapter_id FROM public.chapters WHERE canto_id = v_canto_id AND chapter_number = 11;


  -- March 31st, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 31st, 1976', 1,
    '', '', '', '',
    '', '', '', '',
    E'<p>Śrīla Prabhupāda arrived in Vṛndāvana-dhāma to an enthusiastic greeting from the devotees, most of whom have traveled from Māyāpur. We arrived in time to greet the Deities, and Prabhupāda gave a short class on the nine processes of devotional service. Perhaps half the devotees have returned to their home temples, but there was still a large crowd, and the temple was packed to capacity.</p>

<p>He then returned to the quarters he had left just over three months ago. He spent the day relaxing, recuperating from the hectic travels and demands of the last few days.</p>', '', '1976-03-31', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- April 1st, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'April 1st, 1976', 2,
    '', '', '', '',
    '', '', '', '',
    E'<p>For his morning walk, rather than take the usual route along Chattikara road, Prabhupāda drove out to the local municipal park. Another car, filled with <em>sannyāsīs,</em> followed him. He didn’t speak much during the walk, save to comment that the park was very poorly maintained.</p>

<p class="verse">* * *</p>

<p>In class Prabhupāda read from <em>Śrīmad-Bhāgavatam</em> 7.9.46, wherein Prahlāda Mahārāja speaks about <em>mauna,</em> or the vow of silence. In India even today, people sometimes practice <em>mauna,</em> although generally it is not done for spiritual purposes. Neither is it strictly followed, as the practitioner often communicates with a small blackboard and chalk, or a pencil and paper.</p>

<p>Therefore, Prabhupāda said, there is no question of not talking; one must talk. But that talk should only be about Kṛṣṇa. If all we talk about is mundane activities, then we should practice <em>mauna</em>. But for one who is preaching Kṛṣṇa consciousness, there is never enough to be said. “Śrīla Rūpa Gosvāmī says that ‘I have got only one tongue and two ears. So how can I enjoy or serve Hare Kṛṣṇa only with one tongue and two ears? If I had millions of ears and trillions of tongues, then it would have been possible.’ He is feeling like that. So he is expecting so many ears and so many tongues to chant Hare Kṛṣṇa <em>mantra</em>.”</p>

<p>Then he added, with perhaps a touch of irony, a comment relating to our present state of affairs. “So far we are concerned, conditioned soul, even sixteen rounds becomes very, very difficult job for us because we are practiced to talk nonsense. We cannot find out little time, say for two hours, for chanting Hare Kṛṣṇa, but we can find twenty-four hours for talking nonsense. Therefore one who cannot chant Hare Kṛṣṇa <em>mantra,</em> he should stop his talking. That is called <em>mauna</em>. Don’t talk any more. Better remain silent. This is recommendation by Prahlāda Mahārāja.”</p>

<p>He concluded the class by saying that nowadays no one can follow the strict practices mentioned in the scriptures. Therefore, we should simply rely on the mercy of Lord Caitanya and chant the Hare Kṛṣṇa <em>mahā-mantra</em>.</p>

<p class="verse">* * *</p>

<p>Śrīla Prabhupāda went out in mid-morning to inspect some land directly opposite the Kṛṣṇa Balarāma Hasanan Gośālā Bhūmi Trust, on Mathurā road. The property is for sale, and Prabhupāda was thinking of purchasing it to use as a <em>gośālā</em>. He took with him Akṣayānanda Swami, Bhagatjī, and one or two other devotees.</p>

<p>Upon returning, he discussed it with Bhagatjī, who was not in favor of buying it. He said the land was full of stones. When Śrīla Prabhupāda asked him how he knew, Bhagatjī laughed and pointed to Prabhupāda’s books. “You know what is within the verses of these books; and similarly, I am a farmer’s son, and I know what is within the earth!” Prabhupāda laughed and decided not to buy the land.</p>

<p>The rest of the day was quiet and restful. Prabhupāda gave a short <em>darśana</em> in the late afternoon.</p>

<p class="verse">* * *</p>

<p>Gurudāsa Swami is taking the devotees out on <em>parikrama</em> each day. He used to live here in the early days of ISKCON Vṛndāvana, and thus he knows many wonderful stories and histories about the different places of Kṛṣṇa’s pastimes.</p>', '', '1976-04-01', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- April 2nd, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'April 2nd, 1976', 3,
    '', '', '', '',
    '', '', '', '',
    E'<p>During his morning walk Prabhupāda visited one of his Godbrother’s <em>maṭhas</em> on the road out to Mathurā. We found the gates closed when we arrived and no sign of life within, what to speak of any kind of program going on. After loitering around for a minute or two, someone finally came and let us in to see the Deities.</p>

<p>Later, back at our temple, Prabhupāda commented, as he started class, that when we chant the Sanskrit <em>ślokas</em> at the beginning of the discourse over the microphone, it is very attractive and pleasing to outsiders. His mood is clearly different than that of his Godbrothers.</p>

<p>Anantarām Śāstrī led the chanting of the Sanskrit, Puṣṭa Kṛṣṇa Swami read out the English translation, and then Śrīla Prabhupāda delivered his lecture.</p>

<p>In commenting on verse forty-seven, Śrīla Prabhupāda gave his disciples, many of whom are engaged distributing books in the West, extra impetus to execute their service with renewed vigor and enthusiasm. He explained to them purpose of the Kṛṣṇa consciousness movement. “It is not active like a sword. But it is <em>astra</em>. It is killing the demons, but in a different way. The demonic habits are being killed by this Hare Kṛṣṇa movement. This is <em>astra,</em> but it is being used in a different way, because in this age people are so fallen, this real <em>astra</em> weapon cannot be used upon them. They are already dead.</p>

<p>“So therefore another type of <em>astra—</em>to awaken them to life. That is Hare Kṛṣṇa, <em>mahā-mantraastra</em>. Otherwise they are already dead. ‘Beating the dead horse.’ A horse is dead; what you will get by beating with whips?</p>

<p>“So there are big, big demons. Hiraṇyakaśipu, he was required to be killed by the nails of the Lord, Who appeared as a ferocious lion. But here, the tiny demons, there is no need of nails or any sword. They are to be awakened simply by Kṛṣṇa consciousness, chanting Hare Kṛṣṇa.”</p>

<p>Since it is so difficult to comprehend spiritual topics in this age, he stressed that as neophyte devotees we must be actively engaged in Kṛṣṇa conscious activities. Recalling his recent meetings with Sharma dāsa in Māyāpur, he told us that to imitate Haridāsa Ṭhākura by trying to chant in a secluded place is simply cheating. For those whose minds are still disturbed, he said, they should be actively engaged, especially in book distribution. “Suppose you are going to distribute books,” he said, “but what is the idea? ‘It is Kṛṣṇa’s books; it must be distributed.’ So Kṛṣṇa is remembered there. At the same time, because it is Kṛṣṇa’s book, if somebody purchases, if he pays something, he’ll look at it—something—that ‘What this nonsense has written? Let me see.’ Then he will get some idea. And if he reads one line, he comes hundred times forward to Kṛṣṇa consciousness. This is the idea.”</p>

<p class="verse">* * *</p>

<p>Quite a bit of mail had piled up and needed to be answered. Puṣṭa Kṛṣṇa Mahārāja brought it to Prabhupāda’s attention during his massage, which he took in the back bedroom today. It is too hot now to sit for a full session in the sun.</p>

<p>It seems Upendra prabhu has finally made it to Fiji. He and Deoji Punja sent telegrams seeking confirmation of Prabhupāda’s participation in a foundation-stone-laying ceremony in Lautoka in late April. They’re building a new Kāliya Mardana temple.</p>

<p>Prabhupāda replied that he intends to arrive in Fiji around the 24th of this month. But that will depend upon whether a proposed meeting with the Chief Minister of Punjab, concerning a donation of land in Kurukṣetra, happens or not. If it does, Śrīla Prabhupāda may have to attend a conference in Kurukṣetra on April 29th.</p>

<p>A man from London wrote suggesting we open a new center in Ceylon, so Prabhupāda sent his letter on to Pradyumna, who is staying in South India at the Śrī Pejavāra Math in Uḍupi. He advised Pradyumna to help the man start something in Colombo.</p>

<p>Citsukhānanda, the American we saw in Delhi, wrote requesting approval to start a new farm project in northern California.</p>

<p>Prabhupāda gladly gave his sanction, telling him that “constructing temples, protecting cows, gathering milk, making ghee, and then opening Hare Krsna restaurants are all good programs for <em>gṛhasthas</em>.”</p>

<p>Niraṣjana dāsa, an Indian student living in Glasgow, Scotland, sent a long letter informing Prabhupāda, among other things, that he has completed the Hindi translation of the first section of <em>Bhakti-rasāmṛtasindhu</em>. This was welcome news, as Prabhupāda has put a great amount of time and effort into seeing that his books get translated into the local languages. He told Niraṣjana to send whatever translations he has completed thus far and encouraged him to continue with other small books, then send them to Bombay as they are completed.</p>

<p>Yaśodānandana Swami is back in South India, where they held some successful programs from March 25th-28th in Kakinada. In a letter to Puṣṭa Kṛṣṇa Swami, he requested confirmation of Prabhupāda’s attendance at a program in Bangalore at the end of May. He also related an interesting story about Prahlāda Mahārāja and a Deity of Varāha Narasiàha that he saw in Siàhāchalam, a place about 250 miles south of Jagannātha Purī. “The story of this temple is related in the Vishnu Purana. Briefly it is as follows: After Hiranya Kasipu attempted many times to kill his son, he finally devised a very sinister plan.</p>

<p>“He sent his servants to throw Prahlada off a hill into the ocean and instructed them to throw a hill on top of him so that he would die. The servants carried Prahlada on top of Simha Giri and threw him into the ocean. As soon as they were ready to throw the hill over the devotee Prahlada, Narasimha came and rescued Prahlada out of the ocean.</p>

<p>“Prahlada, out of devotion for his Lord, requested the Lord to kindly manifest Himself on top of the Simha Giri (the hill where Narasimha saved Prahlada) and asked Him to please show Himself in the form of Varaha. He also requested to show him the form in which he would later kill Hiranya Kasipu.</p>

<p>“So the Lord manifested Himself as Varaha Narasimha. And Prahlada worshiped that Deity there on top of the hill. It’s fabulous. It’s unique.”</p>

<p>Śrīla Prabhupāda replied to the letter informing Yaśodānandana Mahārāja that if he is required to attend the proposed Kurukṣetra conference, he will stay in India. Otherwise, he will go to the West. He also said that if the story of Prahlāda is in the <em>Purāṇas</em> then it is all right.</p>

<p>Hansadūta Mahārāja wrote two letters from Calcutta. Although during the GBC meetings he was appointed co-GBC with Gopāla Kṛṣṇa for Vṛndāvana, he and his men have remained in Calcutta rather than come for this part of the festival because they want to get properly organized for their upcoming village-to-village <em>saṅkīrtana</em> programs.</p>

<p>He has twenty-five men, but all of them are new to India, and none of them speak the local languages. Therefore he asked Śrīla Prabhupāda if Lokanātha Mahārāja from Bombay could join them. Another reason he is reluctant to come to Vṛndāvana is because his former wife, Himāvatī dāsī, is here.</p>

<p>His second letter informed Śrīla Prabhupāda that Bhavānanda Goswami is on his way to Vṛndāvana to speak with Prabhupāda about a manpower shortage in Māyāpur. Apparently they have only ten men there now. Hansadūta feels that men should be sent to the Indian Yātrā from the Western temples, to strengthen the preaching here. He has personally brought men from Germany and England, so he wondered why other GBC men couldn’t do the same.</p>

<p>Prabhupāda told him that Lokanātha Mahārāja may join his traveling party and that he has arranged for some devotees to return to Māyāpur to help out there rather than return to the West.</p>

<p>As far as Himāvatī is concerned, Prabhupāda told him not to worry about coming here just yet. He may manage Vṛndāvana conjointly by correspondence. He informed him that Himāvatī is now engaged in organizing a nursery for young children here in Vṛndāvana.</p>', '', '1976-04-02', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- April 3rd, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'April 3rd, 1976', 4,
    '', '', '', '',
    '', '', '', '',
    E'<p>This morning Gurudāsa Mahārāja once again located another nice garden for Prabhupāda to take his morning walk. This one was in a big <em>āśrama,</em> behind high, stone walls. A casual visitor would never suspect that such a place of serenity and beauty existed.</p>

<p>A few <em>sannyāsīs</em> accompanied Prabhupāda. He seems to be enjoying the outings. On the whole, he is relaxed and very much at home here in Vṛndāvana.</p>

<p class="verse">* * *</p>

<p>Each morning Śrīla Prabhupāda displays great devotion and love, affectionately looking upon the Deities’ divine forms at <em>darśana</em> time. He stands, surrounded by his devotees, as the Govindam prayers boom over the sound system. The curtains open and he looks intently for a few seconds. Then he gets down and fully prostrates himself in obeisance to Their Lordships Gaura-Nitāi. Then he pushes himself back up to his knees, again touches his head to the floor, and then stands erect. He then repeats this procedure at the altar of Kṛṣṇa-Balarāma. Then finally, again before Rādhā-Śyāmasundara, Who must be the most beautiful Deities in all of Vṛndāvana. After sipping a little <em>caraṇāmṛta</em> he turns to walk back across the temple-room floor to the <em>vyāsāsana</em>. As he crosses in front of each altar, he does a clockwise, 360-degree pirouette.</p>

<p>In today’s <em>Śrīmad-Bhāgavatam</em> verse Prahlāda Mahārāja explained that Kṛṣṇa is everything: the air, fire, sky, earth, water, everything subtle or gross including the mind, consciousness, and false ego, as well as whatever is expressed by words or the mind.</p>

<p>Prabhupāda vividly explained why we worship Deities and how the same mood of devotion should be applied to everything we do. He recalled a recent challenge by a man in Delhi. The man had asked that if God is everywhere, what is the use of going to the temple? Prabhupāda reversed the logic. If God is everywhere, why <em>not</em> go to the temple? He is certainly there also.</p>

<p>He told us that it is like electricity. Electrical energy is everywhere, but wiring and the switch enable us to utilize it. “Similarly,” he said, “Kṛṣṇa is everywhere, and you can worship Kṛṣṇa from anything. Everyone knows that this Deity is made of stone. The floor, the marble stone, is black and white, and the Deity is also black and white. Everyone knows. But why you see the black-and-white Deity in this temple and gather together and offer prayer? Is it the same marble of the ground, black and white? That means you are seeing in a different position. That is love, love of Kṛṣṇa.</p>

<p>“Those who haven’t got the love, they are seeing that ‘The same stone on the floor and same stone in the Deity. What these foolish men are worshiping?’ They say that ‘I can worship this stone also.’ ‘No. No.’ Kṛṣṇa says, ‘Yes, the stone on the floor, that I am, but I am not present there.’ This is called <em>acintya-bhedābheda</em>. They think that ‘If Kṛṣṇa has spread Himself in everything, then He has lost Himself. So He has no more form.’ This is material calculation. These foolish persons, they do not know.</p>

<p>“I have several times given you the example. You take a big piece of paper and make it small pieces and you throw it in the air. The big sheet of paper is no longer existing. It is finished. So their calculation is like that, that ‘If Kṛṣṇa is all-pervasive, then where is His form? His form is finished.’ But that is nonsense.</p>

<p>“This is Kṛṣṇa—<em>māyātatamidaàsarvam:</em> ‘I am spread everywhere, all-pervasive. But in My person I am not there.’ But a devotee should understand that Kṛṣṇa is on the throne and Kṛṣṇa is on the floor. Therefore we should be very careful to take care of the floor, to take care of the throne, to take care of the flower, to take care of the dishes. Everything you should worship like Kṛṣṇa. You cannot neglect anything. <em>Śrī-vigrahārādhana-nitya-nānā-śṛṅgāra-tan-mandira-mārjanādau.</em> Everything is one. You cannot say, ‘Kṛṣṇa is here, sitting. I can neglect this floor.’ That is foolishness. You should take as much care to worship the Deity, to decorate the Deity, as to keep the temple very, very clean. That is Kṛṣṇa conscious. You cannot say that ‘He is working on the garden; therefore he is inferior. I am working directly on the Kṛṣṇa altar.’ No. The person who is working in the garden, Kṛṣṇa’s garden, he should be as careful as the man who is worshiping the Deity in the temple. That is wanted.”</p>

<p>He concluded by saying that we should be very careful to keep this understanding. Just like the devotee who takes the dust of Vṛndāvana on his head. This is the proper mood, because Vṛndāvana dust <em>is</em> Kṛṣṇa. If we remember that every atom is Kṛṣṇa, then our Kṛṣṇa consciousness will be very, very strong and firmly established. Likewise the great sky is also Kṛṣṇa. So Kṛṣṇa can be everywhere in His all-pervasive form, or He can appear in the small form of the Deity just to accept our service. Of course, this is the vision of the very advanced devotee, he told us, and we should not imitate, but this is the ideal platform to aim for.</p>', '', '1976-04-03', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- April 4th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'April 4th, 1976', 5,
    '', '', '', '',
    '', '', '', '',
    E'<p>This morning’s walk took us past a small temple of Kātyāyanī, the goddess Durgā. Prabhupāda explained that one can worship her in order to gain admittance to Kṛṣṇa. It’s for this reason that her deity is prevalent in Vṛndāvana. He offered her his respects by quoting out loud <em>Brahma-saàhitā</em>verse 5.44, describing Durgā as the shadow potency of Rādhārāṇī.</p>

<p class="verse">* * *</p>

<p>Śrīla Prabhupāda presided over the second big <em>yajṣa</em> of the festival today. Wearing fragrant rose garlands, he sat serenely in the temple courtyard on the semicircular side steps, seated on one of the <em>āsanas</em> from his <em>prasādam</em> room. Puṣṭa Kṛṣṇa Swami sat next to him, holding an armful of new <em>japa</em> beads. I stood on the other side holding a decorative ceremonial umbrella, to shield him from the direct rays of the hot sun.</p>

<p>He initiated thirty-five candidates into <em>hari-nāma</em> and created another thirty-three <em>brāhmaṇas</em>. Among them was a boy from Iran, and Prabhupāda particularly noted him in his talk. “We manufacture devotees from any part of the world. Just immediately we initiated a devotee, Bhṛgu Muni dāsa. He is from Iran. So Caitanya Mahāprabhu’s mission is this, that <em>pṛthivīte āche yata nagarādi grāma, sarvatra pracāra haibe mora nāma</em>. Caitanya Mahāprabhu wanted that in every village and every town on the surface of the globe they should at least hear Hare Kṛṣṇa <em>mahā-mantra</em>.”</p>

<p>After handing out the <em>japa</em> beads he gave a short talk explaining the meaning of initiation, which he summarized as “the beginning of receiving transcendental knowledge.”</p>

<p class="verse">* * *</p>

<p>Puṣṭa Kṛṣṇa Swami, who was officially appointed Prabhupāda’s permanent secretary at the GBC meeting, was also made the new GBC for South Africa. He arranged a special <em>darśana</em> with Prabhupāda for Jagat Guru Swami and several other men who are about to leave for Africa. Two are from South Africa, and the others are Canadian, British, and American.</p>

<p>Śrīla Prabhupāda told them about the enthusiastic reception he had received in South Africa last year. He particularly recalled that the whites eagerly purchased his books, despite the fact that Indians are not well liked there.</p>

<p>Jagat Guru Mahārāja told him they intend to travel on a bus and go to other countries as well, like Rhodesia, Malawi, and Mozambique.</p>

<p>As they talked, Prabhupāda began to consider going to Australia via Africa because the trip to Australia is very long. He thought that a direct flight from South Africa to Australia might be quicker than going straight from India. But after Puṣṭa Kṛṣṇa said going via South Africa would be just as long, he dropped the idea.</p>

<p>He also encouraged the men to preach in Mauritius and to hold Ratha-yātrā in Durban, where there are many Indians.</p>

<p>As they left, Puṣṭa Kṛṣṇa noted how enthusiastic they all were to preach. Prabhupāda smiled. “Yes. That is life. One who is enthusiastic to preach, he is living. Others are dead.”</p>', '', '1976-04-04', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- April 5th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'April 5th, 1976', 6,
    '', '', '', '',
    '', '', '', '',
    E'<p>For his walk Prabhupāda went to look at some vacant land in Rāman Reṭi that he wants to purchase. He suggested that our householders build their own houses there and “colonize it” like our Los Angeles community.</p>

<p>As we walked about, a local farmer passed, carrying a large basket of green beans on his head. Śrīla Prabhupāda spotted him and immediately began to bargain with him. After a lengthy exchange, he purchased the whole basket. The man left happily, having done his whole day’s business within a few minutes.</p>

<p>Gurudāsa Mahārāja complimented Prabhupāda on getting a good bargain. Prabhupāda laughed, telling us it was something he had learned in his childhood. “My father used to do that. He’d go to a vegetable vendor. He has got a big basket, and he’ll say, ‘What do you want for all, the whole basket.’ So he is ready because he’ll sit down so long [in the market], so at very cheap rate he’ll give it. And it was not required in the family so much. My mother became very angry, that ‘You are bringing so much vegetable, it is being spoiled.’ But he would purchase like that. If you give him in those days fifty rupees to go to the market, he will spend all the money and bring at home. Hare Kṛṣṇa.”</p>

<p class="verse">* * *</p>

<p>In mid-morning he attended the opening of a new branch of the Punjab National Bank here in our guest house. Prabhupāda was in a jovial mood, and he and the bank manager amused the devotees by exchanging jokes and telling a few humorous stories. As the devotees eagerly crowded into the room to listen, Prabhupāda explained how Kuvera, the treasurer of the demigods, had offered Dhruva Mahārāja any benediction he wanted. Dhruva simply asked Kuvera to bless him with continual devotion to Lord Kṛṣṇa. To the cheers of the devotees, he explained that in the same way he now has a bank that can give him any amount, but he simply requested the bank’s blessings that he remain Kṛṣṇa’s servant.</p>

<p>The bank manager also told a similar story, but requesting Prabhupāda’s blessings. He then told a joke about a man who was due for a heart transplant. He could choose to use a general’s heart, a businessman’s, or a banker’s. When he chose the banker’s he was asked why. “Oh, because I am quite sure it has never been used!”</p>

<p>Prabhupāda laughed heartily and ended the meeting with a joke of his own. “The story is that one poor man was informed by his friend that ‘money draws money.’ That’s a fact. If you have got money, you can draw [attract] money. So he went to the bank, and the cashier was counting a huge amount of money and he threw his coin on the cash.” Prabhupāda started laughing even before he finished. “And he was waiting, ‘When the whole money will come to me?’</p>

<p>“Then the cashier saw this man is standing, ‘What is that? Why you are standing?’</p>

<p>“‘Sir, I heard that money draws money, so I had one coin. I have dropped with your money. I am waiting when it will come to me.’</p>

<p>“So he said, ‘No, no. The fact is that—money draws money. Now my money has drawn your money!’”</p>

<p>Prabhupāda laughed so much his belly and shoulders shook. All the devotees, who rarely see him so relaxed and open, laughed and cheered along with his jubilation.</p>

<p class="verse">* * *</p>

<p>Anantarām Śāstrī is staying with me in the servant’s room. He is doing some Sanskrit work on Śrīla Prabhupāda’s translations. He chants the Sanskrit verse at the beginning of class, and sometimes, when Śrīla Prabhupāda can’t immediately quote a particular verse, he is able to supply the necessary <em>śloka</em>.</p>

<p>Today he showed me several verses he has written in Sanskrit, glorifying Śrīla Prabhupāda. In them he poetically describes Prabhupāda’s achievements in preaching and lauds his pure, devotional qualities.</p>

<p><em>bhaktisiddhānta-śiṣyaya</em></p>

<p><em>bhaktivedānta-nāmine</em></p>

<p><em>prasannāya praśāntāya</em></p>

<p><em>tasmai śrī-gurave namaḥ</em></p>

<p>“Let me offer my obeisances to my Guru Mahārāja, who is a disciple of Śrīla Bhaktisiddhānta, who is always calm and joyful, and bears the name of Bhaktivedānta.”</p>

<p><em>kṛṣṇaika-cetā mada-moha-vināśa-kārin</em></p>

<p><em>mad-dṛṣṭi-gocara prabho prabhupāda-svāmin</em></p>

<p><em>doṣābhivṛtti-paradūṣita-manda-buddheḥ</em></p>

<p><em>saṣcintayāmi caraṇau tava bhakti-hetoḥ</em></p>

<p>“O Lord, O Prabhupāda. May you always be the object of my vision. Only the name of Kṛṣṇa can destroy my pride and illusion. Although my mind and intelligence are contaminated by wicked inclinations, I meditate upon your lotus feet in causeless devotion.”</p>

<p><em>vṛndāvane ramaṇa-reṭi-prasiddha-bhūmau</em></p>

<p><em>tatrāpi kṛṣṇa-balarāma-supāda-mūle</em></p>

<p><em>jṣānam paraà parama-kṛṣṇa-sudharmīty uktam</em></p>

<p><em>dantas tu deva prabhupāda namo namas te</em></p>

<p>“In the most holy land of Vṛndāvana, in Rāman Reṭi, at the lotus feet of Śrī Kṛṣṇa Balarāma, you are preaching the topmost knowledge of the Supreme Personality, Lord Kṛṣṇa, Who is the fountainhead of religion. O master of the senses, O my lord Śrīla Prabhupāda, let me offer my humble obeisances to you.”</p>

<p>As he explained their meanings to me, tears began to stream down his face. Although I didn’t say anything, it put me off. I appreciated his devotional sentiments, but his display of emotion made me uncomfortable. It seemed more an attempt to impress me with his own level of devotion than actual loving feelings for Śrīla Prabhupāda.</p>', '', '1976-04-05', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- April 6th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'April 6th, 1976', 7,
    '', '', '', '',
    '', '', '', '',
    E'<p>During his walk at the Ranga Gardens today Śrīla Prabhupāda answered questions about the tendency of devotees to wear extra paraphernalia like Rādhā Kuṇḍa clay beads, <em>tulasī</em> beads interspaced with silver or gold beads, and items like the used sacred threads from the Deities, which they wrap around their wrists.</p>

<p>Śrīla Prabhupāda said that the Deity threads should not be worn. It is becoming a fad throughout the Society, and the practice should be stopped. He quoted another of his very apt Bengali sayings: “A crow eats stool; but young crows eat more stool!” He said there is always a tendency, at the slightest opportunity, to revert back to being like “hippies.” We should not allow it, he said. If that happens, whatever prestige we have so far will all be finished.</p>

<p class="verse">* * *</p>

<p>There was a bit of mail today. One long letter came from Puru dāsa in Los Angeles. It had actually been sent to Hridayānanda Mahārāja in early February, when he was still the visiting secretary, but somehow wasn’t acknowledged until now.</p>

<p>Puru was concerned about the temple purchasing sour cream that was known to have rennet, an extract from the stomach lining of a calf, in it and another batch, that had gelatin in it. The rationale used was that almost everything in <em>Kali-yuga</em> is contaminated. And Śrīla Prabhupāda had previously allowed the use of white sugar, which is bleached over animal bones. He had also allowed the purchase of milk that had fish-liver oil added.</p>

<p>A further motivation was the very cheap purchase price of five cents per pound. Therefore the GBC, Jayatīrtha, had consented to the purchase of the sour cream because the amount of rennet was very small—about 1 cc per 150 gallons or 1/50,000 of an ounce per pint.</p>

<p>Still, despite the seemingly insignificant quantity, some devotees were disturbed by its use, and thus Puru requested a direct statement from Prabhupāda to settle the matter. “It seems to me, though I am a fallen, fault-finding rascal, that only Srila Prabhupada can say whether or not this sour cream is offerable to the Deity, and can be used. I certainly do not know. There are valid arguments on both sides, but the only real point is whether or not Krsna is pleased with such offerings, and only His pure devotee can tell us that.”</p>

<p>He added as a postscript that the temple has over 400 pounds of it in the refrigerator, and some had reasoned that Prabhupāda would not want to see the sour cream wasted. Puru wanted to know if they should use it up, never buy it again, dump it, or continue to use it and not be agitated over its contents.</p>

<p>Prabhupāda’s reply was short and clear. “Concerning the use of sour cream in the temple, it should be stopped immediately. Nothing should be offered to the Deities which is purchased in the stores. Things produced by the karmis should not be offered to Radha Krsna. Ice-cream, if you can prepare it, is OK, but not otherwise. Now, you have such a big stock of this sour cream, so sell the stock at any cost. Who is the rascal who has purchased without permission?”</p>

<p>Another letter from Los Angeles by Kṛṣṇa Kānti dāsa informed His Divine Grace about a professional recording studio called “Golden Avatar” he has just established. His aim is to produce first-class Kṛṣṇa conscious recordings. He enclosed a stereo cassette with the first record album to be recorded entirely within the studio in its first ten days of operation.</p>

<p>He also offered to record Śrīla Prabhupāda when he visits Los Angeles this summer. He especially wants to make a recording of Prabhupāda chanting the Hare Kṛṣṇa <em>mantra</em>, since the only other record of him doing this is still owned by Alan Kallman.</p>

<p>Prabhupāda listened with great satisfaction to the tape, called “Hare Kṛṣṇa Festival,” which has a new marching-band version of the <em>mahā-mantra</em>.</p>

<p>He wrote back encouraging Kṛṣṇa Kānti in his work. “I very much liked the chanting on this tape. It is very excellent and should be popularized and it will be a great success. Introduce this into every home and that will help them, and if they read our books, then finished—no more material life. Yes, when I come also I can make a tape of chanting Hare Kṛṣṇa but the chanting of Hare Kṛṣṇa by the other boys on this tape is very nice. Thank you.”</p>

<p class="verse">* * *</p>

<p>Rāmeśvara Swami came in about 11:00 a.m. to discuss some BBT business. He told Śrīla Prabhupāda of their desire to print a large full 20" x 24" poster-size picture of him for people to frame. He asked if there was a particular picture that he preferred. Without any hesitation, Prabhupāda told him to look on the outside cover of <em>Caitanya-caritāmṛtaĀdi-līlā</em> Volume 3. Rāmeśvara eagerly took down the book from the wall shelf and held up a picture of a radiant Prabhupāda sitting on a cushion on the lawn at Bhaktivedānta Manor in England. He had a mild smile on his lips and a light, silk <em>chaddar </em>draped over his shoulders.</p>

<p>Śrīla Prabhupāda nodded his approval, and then again reaffirmed it, even though Rāmeśvara pointed out that he wasn’t wearing a flower garland in the photo.</p>

<p class="verse">* * *</p>

<p>Today was the first of a three-day program in the back area of the temple, just inside the main entrance. It was held from 5:00–7:30 p.m. Many distinguished guests in the area came to offer their appreciation of Prabhupāda’s work.</p>', '', '1976-04-06', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- April 7th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'April 7th, 1976', 8,
    '', '', '', '',
    '', '', '', '',
    E'<p>This morning we drove out well beyond the outskirts of Vṛndāvana village. At one point Prabhupāda stopped the car and climbed out and began walking across the fields.</p>

<p>As we meandered across the uneven fields, a local farmer, the owner of the land, came over to see us. Very respectfully he offered his <em>praṇāmas</em> and told Śrīla Prabhupāda in Hindi that he considered it a great honor for him and his family to have Prabhupāda walk on his land.</p>

<p>Prabhupāda was very touched by the man’s sentiment and mentioned the incident several times later on. He noted that in the West if you tread without permission on someone else’s land, they become angry and may even shoot you. How nice, he said, is a culture where the owner approaches and thanks you, considering himself to be blessed.</p>

<p class="verse">* * *</p>

<p>Today’s <em>Śrīmad-Bhāgavatam</em> class was on 7.9.52. Prahlāda Mahārāja’s prayers are now completed, and Lord Nṛsiàhadeva addressed him. The Lord called him <em>bhadra,</em> which Śrīla Prabhupāda translated as “perfect gentleman” and also <em>asurottama,</em> best of the <em>asuras,</em> or demons. Because of His great satisfaction with his behavior, the Lord offered Prahlāda any benediction he wanted.</p>

<p>Prabhupāda said that therefore if we require anything at all, we simply have to please Kṛṣṇa. It is not necessary to work hard for money and other material gains, because Kṛṣṇa is <em>bhagavān,</em> the possessor of every opulence. Just by pleasing Him, whatever we need will be supplied. We simply have to become perfect gentlemen. That, he said, is only possible if one becomes a devotee. He gave good examples to establish that only a genuine devotee is actually a perfect gentleman; others are not. “A devotee is perfect gentleman. Why? Now, because he has developed all good qualities. That is <em>bhadra</em>. A devotee cannot be <em>abhadra</em>. Therefore a devotee is never rude to anyone.</p>

<p>“When Rūpa Gosvāmī was here, some very learned scholar came to talk with him on <em>śāstra</em>. So when he approached Rūpa Gosvāmī, he asked, ‘I want to talk with you about <em>śāstra</em>.’</p>

<p>“And he said, ‘I am not a very learned man. How can I talk with you? You are so learned man.’</p>

<p>“So the man said, ‘If you think that you are not learned, then you give me in writing that: “I am not learned.”</p>

<p>“So he immediately gave him: ‘All right, take it. I am not learned.’”</p>

<p>Prabhupāda laughed. “So when he was going away, that cheat, he was thinking, ‘I am the most learned scholar, and Rūpa Gosvāmī’s defeated.’</p>

<p>“Then Jīva Gosvāmī was standing outside. He said, ‘What is that paper?’</p>

<p>“‘No, your uncle has written frankly that he is not learned. I am learned.’</p>

<p>“‘All right, talk with me.’ Then Jīva defeated him.</p>

<p>“So sometimes devotees are so gentle. If such foolish person comes to talk, unnecessarily waste of time, ‘All right, you take in writing that I am not a learned. Go away.’ You see? This is <em>bhadra</em>. Instead of wasting time with a rascal, better give him a paper: ‘Go away, sir.’”</p>

<p>Then as a contrast he described the <em>abhadra</em> from his own practical experience. “I have seen with my own eyes in Calcutta. One hotel man was cutting the throat of a chicken, and it was half-cut, and the half-dead chicken was jumping like this, and the man was laughing. His little son, he was crying. I have seen it. He was crying. Because he’s innocent child, he could not tolerate. And the father was saying, ‘Why you are crying? It is very nice.’ Just see! So without being devotee a man will become cruel, cruel, cruel, cruel, cruel. In this way go to hell. And a devotee cannot tolerate.</p>

<p>“We have studied in the life of Lord Jesus Christ. When he saw that in the Jewish synagogue the birds were being killed, he became shocked. He therefore left. He inaugurated the Christian religion. Perhaps you know. He was shocked by this animal-killing. Therefore his first commandment is ‘Thou shall not kill.’ But the foolish Christians, instead of following his instruction, they are opening daily slaughterhouse. So unless one becomes a perfect devotee, he cannot become <em>bhadra,</em> a gentleman. That is not possible.”</p>

<p>He concluded with an apt and encouraging parallel between Prahlāda, the <em>asurottama,</em> best of the demons, and ourselves, also sons and daughters of the demons. “Prahlāda was born of a father, Hiraṇyakaśipu, and the most ferocious <em>asura,</em> so he cannot escape the relationship with his father. ‘How can I say that I am not son of <em>asura</em>?’ But he is <em>uttama</em>. He surpassed that platform. How it is possible? Now, because Kṛṣṇa is pleased upon him. <em>Prīto</em>’<em>ham</em>. Although he is born in an <em>asura</em> family, low-grade family, but because Kṛṣṇa is pleased upon him, he becomes immediately <em>bhadra</em>. This is the facility.</p>

<p>“So those who speak that these Europeans and Americans cannot become Vaiṣṇava, they are mistaken. If Kṛṣṇa is pleased upon them, immediately they become the best of the <em>brāhmaṇas</em>. Here it is said, ‘Never mind you are born in the family of <em>asura,</em> but because I am pleased, you are all-purified. You don’t be disappointed.’ It is only that we require to please Kṛṣṇa. Then everything is all right.”</p>

<p>** *</p>

<p>During the evening program, the leading visitors all spoke in Hindi. Śrīla Prabhupāda reciprocated by having some of his <em>sannyāsīs</em> speak. Acyutānanda Swami made all the visitors laugh by his witty remarks and his combination of Hindi, Bengali, and English. Akṣayānanda Mahārāja has been learning Hindi, so he spoke as well.</p>

<p>Then Śrīla Prabhupāda spoke, especially emphasizing the remarks made by our God-cousin, Bhakti-dīpa Mahārāja, who is the disciple of one of Śrīla Prabhupāda’s senior Godbrothers. He used to live with Prabhupāda before His Divine Grace came to the West.</p>

<p>For our benefit, Prabhupāda spoke in English, but he addressed much of his remarks to his visitors, as a way of urging them to accept his foreign disciples as genuine Vaiṣṇavas.</p>

<p>He told them about the successful acceptance of Lord Caitanya’s Movement, even in the most remote parts of the globe. He specifically mentioned Australia, where last year he established a temple of Lord Caitanya in Melbourne. He told them that for the first time in the history of the world, the Vedic culture is being spread in its true form. All this, he said, is in fulfillment of Lord Caitanya’s prediction. And, in initiating so many foreigners into the chanting of the holy name, he is simply acting as Kṛṣṇa’s and Lord Caitanya’s representative.</p>

<p>“Kṛṣṇa consciousness means to follow what Kṛṣṇa says. That is Caitanya Mahāprabhu’s mission. Caitanya Mahāprabhu has said, <em>āmāra ajṣāya guru haṣa tāra ei deśa</em>. Wherever you are, it doesn’t matter. Either you are in India or in America or in France or anywhere, any <em>deśa,</em> or any country, just try to deliver them. Because guru’s business is to deliver the fallen souls. Guru’s business is not to exploit the <em>śiṣya</em>. It is his business how to deliver them.</p>

<p>“So who can deliver? He who is actually guru in the <em>paramparā</em> system. We have to take the authority of becoming guru from Śrī Caitanya Mahāprabhu. Within 500 years His order is that <em>āmāra ajṣāya guru haṣa</em>...‘You cannot become guru all of a sudden. You must take order from Me.’ He is <em>jagad-guru</em>. So Caitanya Mahāprabhu says you, all of you, to become guru and deliver. Because there are so many innumerable fallen souls in this age we require hundreds and thousands of gurus. But not cheaters. This is the time when it requires hundreds and thousands of gurus.”</p>

<p>Certainly it would be hard for anyone to find fault in Śrīla Prabhupāda’s personal qualifications, and in fact, he mentioned that many people have complimented him as having performed a miracle. But he strove to impress upon his guests the qualifications of his disciples also.</p>

<p>“They give me so much credit that ‘You have done wonderful, miracle.’ I do not know how to play any miracle. Our Dīpa Mahārāja knows me from the very beginning. I do not know how to play magic. But only magic is that I don’t adulterate. That’s all. Kṛṣṇa says, ‘Always think of Me.’ So I am teaching them, ‘Chant Hare Kṛṣṇa. You’ll think of Him.’</p>

<p>“So who can chant Hare Kṛṣṇa unless he is a devotee? Ordinary man cannot chant. He has no taste. But these boys, they are taking my word very seriously. I have asked them to refrain from four kinds of sinful activities: illicit sex, intoxication, meat-eating, and gambling. They are seriously following. They have no illicit sex. Caitanya Mahāprabhu was questioned by a <em>gṛhastha</em> devotee, ‘How we can understand a Vaiṣṇava?’ He summarily replied <em>asat saṅga tyāga ei vaiṣṇava ācāra.</em> This is the first principle—don’t associate with <em>asat</em>. So next line He described who is <em>asat</em>. <em>Asat eka strī saṅgi, kṛṣṇa abhakta āra</em>—finished. In these two lines we can understand who is a Vaiṣṇava.</p>

<p>“These people, Europeans and Americans, they are ordinarily very much accustomed to these habits: illicit sex, gambling, meat-eating. But upon my word they have given up everything. And other things? They are reading the Vaiṣṇava literature very nicely, and they are pushing Vaiṣṇava literature all over the world. By their personal efforts they are giving service. We have about 65 volumes, books, each book 400 pages. And they are introducing in the universities, colleges, libraries. Even sometimes they are beaten. In this way, these boys, they are helping this movement. So this movement has captured the spiritual ideas of the Western people, by the grace of Śrī Caitanya Mahāprabhu.”</p>

<p>Finally he expressed his main point of frustration. “Unfortunately in India they are not received very well. The government is thinking they are CIA. A CIA has become Vaiṣṇava dancing in Vṛndāvana!?” The audience laughed.</p>

<p>“Just see their intelligence!” He continued, “And Purī also, they are not allowed to enter in the Jagannātha temple. These things are going on. So this is very regrettable, and our Śrīman Bhakti-dīpa Mahārāja has strongly protested against this idea. Therefore I thank him very much. Hare Kṛṣṇa.”</p>

<p>His speech was well received, and his guests seemed impressed with the devotees, the majestic ISKCON temple, and most of all the vibrant spiritual atmosphere created by Śrīla Prabhupāda. It was a very successful program.</p>', '', '1976-04-07', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


END $$;
