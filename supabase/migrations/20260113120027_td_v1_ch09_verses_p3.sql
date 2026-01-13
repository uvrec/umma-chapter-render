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


  -- January 27th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'January 27th, 1976', 11,
    '', '', '', '',
    '', '', '', '',
    E'<p>This morning Mahāmāyā dāsī, one of the Western ladies serving here in Māyāpur, gave me a polite note requesting me to ask Śrīla Prabhupāda a question for her. She wanted to know whether women could be allowed into the temple room during menstruation. “If so,” she asked, “should they wear silken garments?” The reason she asked was because ladies in India generally do not enter the temple during this time.</p>

<p>I broached the subject with His Divine Grace after his morning nap. He immediately became disturbed, and without replying to my question, sent me to get Tamal Krishna Mahārāja. When Tamal came in, Prabhupāda asked him, “What is this? He is <em>brahmacārī</em>, and he is being approached by this woman?”</p>

<p>I explained to Tamal Krishna what the inquiry was, and showed him the note. He then assured Śrīla Prabhupāda that things were not what they seemed. He described the letter as very discreet and polite, having been signed ‘The Matajis of Mayapur.’ “Apart from that,” Tamal Krishna said, “Hari-śauri is actually a householder.” Although I wear white cloth, because I have never once made any reference to my wife, Śrīla Prabhupāda assumed that I was a <em>brahmacārī</em>.</p>

<p>Prabhupāda gave a diffident smile. “Oh, I thought he was <em>brahmacārī</em>, and he is being approached by some woman for this. Now I can understand it is all right.” So he gave his permission for the ladies to attend the temple functions and approved the wearing of silk. Later they were duly informed.</p>

<p>Prabhupāda’s reaction was all the more endearing not just because of the vigilance he demonstrated in protecting his disciple’s spiritual life, but also because he was completely free from any false ego in the matter. He did not become at all defensive when he saw that things were not quite what he had first thought. Rather, he showed his purity and an absence of false ego by his humble and objective response.</p>

<p class="verse">* * *</p>

<p>Every day I try to give Prabhupāda a really good workout during his massage. For at least one-and-a-half hours I rub, squeeze, and knead his body while he sits meditatively.</p>

<p>Tamal Krishna Mahārāja mentioned to me that on the day he had given Prabhupāda his massage in Calcutta, he had noticed that when no one else was present, his body was very soft and supple, but as soon as a visitor entered Prabhupāda became alert and his body tensed up. It is a fact. Here in Māyāpur, with no visitors to speak of, he sits so relaxed and quiet that he practically seems unaware that I am massaging him at all. Several times he has inquired, when I have completed my work, whether I was finished or not. It is almost like someone taking their car into a garage for a service, going off for an hour or so, and then returning to inquire whether everything is done.</p>', '', '1976-01-27', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- January 28th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'January 28th, 1976', 12,
    '', '', '', '',
    '', '', '', '',
    E'<p>Śrīla Prabhupāda is enjoying his walks in the mornings. He mentioned today that he finds it especially pleasing that he can take his full exercise without leaving our property. Because it is still a little brisk before the sun rises he is wearing a saffron colored cape to prevent catching a chill. And he enjoys the company of the young <em>gurukula</em> students as they join him on the road to enter the temple for the Deity greeting and <em>guru-pūjā</em>. He derives a great deal of satisfaction from their enthusiastic participation in the dancing and chanting. They share a natural rapport and he returns their affection with smiles and words of encouragement.</p>

<p class="verse">* * *</p>

<p>After lunch this afternoon Prabhupāda sat at the end of the veranda, enjoying the view of the Gaṅgā. Suddenly loud shouts and the slam of a door broke his tranquillity. He sent me to investigate.</p>

<p>I found Tamal Krishna Mahārāja sitting in his room before a plate of <em>prasādam</em>, clearly upset. He had just had an argument with Harikeśa over who should get the remnants of Śrīla Prabhupāda’s <em>prasādam</em>. As I stood, Harikeśa came back in and began berating him again.</p>

<p>Several days ago Tamal Krishna had asked Prabhupāda if he could eat the extra that was cooked for him because he found the kind of rice the devotees eat here in Māyāpur too coarse for his digestion. Prabhupāda had approved.</p>

<p>However, Harikeśa had previously received instructions from Śrīla Prabhupāda while we were in Vṛndāvana that all his remnants could not be monopolized by his immediate servants, but should be distributed to other devotees. As cook, Harikeśa resented Tamal Krishna’s acquisition of all the leftovers; while Tamal Krishna argued that he was only taking what was left in the pots and not what was left on Prabhupāda’s plate. Thus the dispute. Tamal Krishna also complained that he should not have been interrupted while he was honoring <em>prasādam</em>.</p>

<p>Prabhupāda called them both onto the veranda. After hearing their arguments, he managed to resolve the issue to everyone’s satisfaction. Prabhupāda said that Harikeśa should not have interrupted Tamal Krishna while he was eating. Respecting <em>prasādam</em> is a very important function, and there should be no disturbance. He said that otherwise one’s appetite is lost and indigestion results.</p>

<p>He gave his permission for Tamal Krishna to eat what was left in the pots, but also confirmed his desire that his <em>prasādam</em> be distributed.</p>

<p>He told us there is absolutely no difference between what is on the plate and what is in the pot. Whether cooked for guru or Kṛṣṇa it is all <em>prasādam</em> and all just as spiritually potent. When I mentioned that in the <em>Caitanya-caritāmṛta</em> there was a distinction made between <em>mahā-prasādam</em>, the remnants of the Deity offering, and <em>mahā-mahā prasādam</em>, which is the spiritual master’s remnants, Prabhupāda said the distinction was made for reference only. It is all <em>prasādam</em>.</p>

<p>Then he went on to explain that the Vaiṣṇava attitude in dealing with one another is one of humility. He gave the example of the pilgrims that come here to Māyāpur. As one man comes along the road, another tries to touch his feet. The former shies away from being so honored because he is thinking, “I am not a Vaiṣṇava, I am just an ordinary man. I am simply trying my best to become a Vaiṣṇava.” On the other hand the person who is touching his feet is thinking that unless he gets the dust of a Vaiṣṇava on his head he will not be able to advance.</p>

<p>“Actually,” Prabhupāda said, “this is a fact. One has to be blessed by a devotee to become a devotee. And he who is the servant of the servant of the servant—one hundred times removed—is not worse than one who directly serves the guru. If one thinks, ‘Because I am direct servant, I am better than others,’ then he is not a Vaiṣṇava. To offer one’s respects to guru and not to his disciples, this is wrong. This is not Vaiṣṇava. One has to be humble and try to serve all Vaiṣṇavas—not some and not others.”</p>', '', '1976-01-28', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- January 29th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'January 29th, 1976', 13,
    '', '', '', '',
    '', '', '', '',
    E'<p>Prabhupāda is taking his morning walk on the roof every day now and following the same daily routine: massage at 10:00 a.m. on the veranda and answering letters; lunch at 1:30 p.m., a rest and return downstairs by 4:00 p.m.</p>

<p class="verse">* * *</p>

<p>A short report arrived from Hansadūta, who is now back in Germany. He stated that relations with the government are getting worse. They are harassing the devotees and threatening more raids on the temple. Although after months of investigation and persecution the only offense they can attribute to us is a very minor one of collecting money without permission, on this basis they are freezing our bank accounts and withholding DM700,000. The German devotees are becoming discouraged but are still struggling to distribute books.</p>

<p>In the meantime, since he left our party, Hansadūta has been busily purchasing vehicles for the formation of an all-India village-to-village traveling <em>saṅkīrtana</em> party. Two forty-five-seater Mercedes buses and a van will be driven overland to India to arrive by the festival. As well as this, he has decided to introduce the program in Germany, and two other buses have been purchased for touring there.</p>

<p>Hansadūta expressed his devotional sentiments in his concluding paragraph. “I feel helpless in this matter, and pray to Krsna to give me intelligence to combat these rascals. I know that Krsna can reverse the situation in a minute, and if He likes I may go on struggling a whole lifetime to convince them of the value of your message without success; still I am thankful that by your mercy that I have been awakened to devotional service which is the ultimate goal of life. I shall try to spread your teachings under all circumstances to everyone.”</p>

<p>Śrīla Prabhupāda sent a short reply of encouragement comparing their struggle with the fight between Hiraṇyakaśipu and Prahlāda Mahārāja, and to Kaàsa’s fight with Kṛṣṇa. “Prahlada must come out triumphant,” he told him. So similarly, in this case Kṛṣṇa will come out triumphant without a doubt. Prabhupāda also approved his plan for village preaching.</p>

<p class="verse">* * *</p>

<p>For the past few days I have been going down to the kitchen, with Prabhupāda’s approval, to learn how to cook from Harikeśa. We are using Śrīla Prabhupāda’s three-tiered cooker.</p>

<p>Previously Harikeśa timed things so that <em>prasādam</em> was ready for Prabhupāda immediately after he had bathed and dressed. But because he is taking his massage early now, Prabhupāda has agreed to a fixed time of 1:30 p.m. for lunch.</p>

<p>Because of his illness, Harikeśa was late starting today. By the time Prabhupāda was back in his room and <em>prasādam</em> was due, we were still cooking. Foolishly, I did not go up and inform Prabhupāda the reason for the delay, although I thought of doing it. I grew increasingly uneasy as the clock ticked on to 1:35, 1:40 ...Instead I kept thinking, “Another few minutes, another few minutes and he’ll be finished.”</p>

<p>Suddenly Ānakadundubhi, the extremely lanky English devotee who sometimes stands guard at Prabhupāda’s floor, burst into the kitchen. “Hari-śauri! Hari-śauri! Prabhupāda has been ringing the bell for the last ten minutes, and no one is answering. I think you had better go up!”</p>

<p>I zipped up the stairs full of anxiety and opened the door to Śrīla Prabhupāda’s room. I got down to offer my obeisances, but froze halfway as the blast of Prabhupāda’s anger hit me. I have never seen him so furious. He sat with his back stiff and straight. His face was flushed and his top lip quivered as he shouted at me for being negligent. “I’ve been ringing for ten minutes! You didn’t hear? Where have you been? Where is <em>prasādam?</em>”</p>

<p>I tried to explain the reason why we were late, that I was just waiting until his <em>prasādam</em> was ready. But the more I tried to pacify him the more agitated he became as he rammed home his point.</p>

<p>“I don’t want your <em>prasādam!</em> Don’t bring it! You rascal! Now you sit in your room and don’t go anywhere unless I call you!”</p>

<p>His anger had the right effect. Due to dullness I had neglected my duty, which was to serve him and keep him informed about what was happening. His sharp words crashed through the cloud of ignorance covering my brain as I realized that my inattentiveness was simply <em>māyā</em>. I hung my head and stopped trying to defend my position. Finally he relented a little. “Now bring whatever is done. It doesn’t matter, just bring whatever is there.” I ran down and brought up whatever was ready. He accepted it without any further comment and with no sign of any agitation whatsoever. As easily as it had arisen, his anger had abated.</p>

<p>After clearing his plate and wiping the desk down, I retired to my room and did not stir from there for the rest of the day.</p>

<p>There was no personal motive in his chastisement. Whether displaying anger or a soft and gentle humor Śrīla Prabhupāda is always on the transcendental platform. The effect of his instructions are always the same, no matter how they are delivered—one always ends up becoming more Kṛṣṇa conscious.</p>

<p>Śrīla Prabhupāda is mercifully showing me the proper service attitude. In the spiritual world everyone is fully and completely aware of their duty to Kṛṣṇa, at all times, without even a moment’s diversion. Śrīla Prabhupāda is trying to train us to the highest standard. My false ego has taken a battering. And I am left humbled and relieved, with a deeper understanding of what real spiritual awareness is all about.</p>', '', '1976-01-29', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- January 30th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'January 30th, 1976', 14,
    '', '', '', '',
    '', '', '', '',
    E'<p>Gopāla Kṛṣṇa arrived today with news from Nellore. It turns out that the two sisters will not change the conditions on their “gift” of land under any circumstance.</p>

<p>Śrīla Prabhupāda decided on a radical solution to the dispute. He told him to remove the foundation stone from the property in Nellore and send it to Madras. He then sent a letter to Śravaṇānanda and Bhāvabhūti instructing them to find some land immediately, buy it, and begin collecting for a temple.</p>

<p>Gopāla Kṛṣṇa also reported that the contracts for the completion of the work in Bombay are now finalized, and the work is set to go ahead without delay.</p>

<p>In discussing the India projects Tamal Krishna Goswami suggested to Prabhupāda that his RDTSKP could send all their profits above cost, possibly $50,000 per month, directly for the projects in Purī, Māyāpur, Bombay, and Kurukṣetra, rather than through the Los Angeles BBT. Tamal thought that his men would be all the more enlivened if they knew specifically where their collections were going.</p>

<p>Prabhupāda was agreeable and he later sent a letter to Rāmeśvara to confirm these arrangements. At the same time he informed Rāmeśvara that the BBT should immediately send $100,000 to India and then seven <em>lakhs</em> of rupees each month thereafter to Bombay as part of the contract fulfillment with E.E.C.</p>

<p>Caitya-guru has been put in charge of organizing the project of building more rooms along the northern side of the property here in Māyāpur. The work is now going on vigorously. The plans have been drawn up, and already 150 men are digging the foundation. The new building will run the full length of the land from east to west. It’ll be some 1,000 feet long, half the width of the existing guest house, and with the same style of arches and eaves.</p>

<p>Looking across to the building site from his balcony, Prabhupāda tried to instil some sense of urgency into Caitya-guru by stressing that he wants this all to be done by the festival. “It can only be done by your mercy, Śrīla Prabhupāda,” Caitya-guru told him.</p>

<p>Prabhupāda laughed and replied, “And if it is not done, that means I have no mercy?”</p>', '', '1976-01-30', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- January 31st, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'January 31st, 1976', 15,
    '', '', '', '',
    '', '', '', '',
    E'<p>For many months a thief named Agarwal has been masquerading as Acyutānanda Swami in several states. He’s been making life members and keeping their fees. Our men only heard about him when the new “members” came to claim their benefits. He was eventually apprehended with stolen life membership forms, rubber stamps, and other paraphernalia. Before being handed over to the police he pleaed for mercy. Thus he was brought here to Māyāpur to see Śrīla Prabhupāda. He admitted to fraudulently using ISKCON’s name to extort funds; but he claimed that he was truly interested in becoming a devotee.</p>

<p>After speaking to him Prabhupāda showed great mercy. Rather than involve the police he decided to give him a chance to reform himself. The man was to stay here in Māyāpur, chant Hare Kṛṣṇa, and render some service.</p>

<p>Agarwal seemed to be serious, even accompanying Śrīla Prabhupāda on some of his walks. Prabhupāda therefore made no further reference to his nefarious activities. However, early this morning he was intercepted at the front gate. He was on his way out with his bags packed.</p>

<p>Jayapatāka Mahārāja asked Śrīla Prabhupāda what should be done with him. Prabhupāda said we should turn him over to the police. Later in the morning Agarwal was taken to the Navadvīpa lockup and formally charged.</p>

<p>It is an excellent example of the term “unfortunate.” Although an outright criminal, Agarwal had somehow or other received the special mercy of a pure devotee of the Lord. But because of his criminal nature he could not take advantage of it. Thus he is now suffering the results of his mischievous deeds.</p>

<p class="verse">* * *</p>

<p>Prabhupāda has invited Gaura Govinda Mahārāja, at present in Orissa, to come to Māyāpur and translate his books. Since there are some delays in occupying the newly donated land in Bhuvanesvar, Mahārāja is living there alone without men or money. So Prabhupāda felt it best that Gaura Govinda come here, at least until the festival.</p>

<p class="verse">* * *</p>

<p>Prabhupāda continues to follow his usual daily routine. The days are quiet, with no visitors to speak of. It is satisfying to see him getting the well-deserved rest and replenishment he needs.</p>

<p>Harikeśa however, is getting sicker each day. This morning as I massaged Prabhupāda on the veranda, he watched Harikeśa slowly emerge from his room. Harikeśa was pale. He hunched over as he shuffled along the veranda to the bathroom before going downstairs to begin cooking. Though it was 11:00 a.m. he had just got out of bed. Śrīla Prabhupāda asked me what he plans to do.</p>

<p>I told Prabhupāda that Harikeśa thinks his condition is colitis. And he feels that if he stays in India, it will only get worse. He feels that only a return to the West will enable him to get well. But while he feels this way, Harikeśa just doesn’t want to leave Prabhupāda’s service. But Prabhupāda told me that one’s health is primary.</p>', '', '1976-01-31', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- February 1st, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'February 1st, 1976', 16,
    '', '', '', '',
    '', '', '', '',
    E'<p>As I laid out the straw mat on the sunlit veranda to prepare for his massage, Śrīla Prabhupāda drew my attention to some sparrows making a nest. They had chosen a hole in the wall behind the electrical circuit box just outside Prabhupāda’s sitting-room window. He said their chirping disturbed him at night while translating his books. So before they could build a complete nest and settle in, I removed the bits of straw they had gathered.</p>

<p>But as I began the massage one of the birds returned and started to rebuild the nest, flying back and forth with small pieces of straw. I crumpled some paper and stuffed it into the hole to block it.</p>

<p>So when the sparrow came back and found its access barred, it pecked, undaunted, at the paper for almost half an hour, trying to open up the hole to continue its home-making. When the bird found this too difficult, it flew off and returned with its mate. Together they worked hard to remove the paper, eventually succeeding. By pecking and tugging in unison, they removed the paper and began to build again. All the while Śrīla Prabhupāda watched them without comment.</p>

<p>When the birds flew away to get more straw, I again filled the hole with the paper, this time forcing it in so tight that the sparrows couldn’t possibly remove it. The sparrows returned and spent a long time trying to regain access, but this time were unsuccessful. Eventually they accepted defeat, gave up, and left.</p>

<p>Prabhupāda then drew an interesting parallel. He told me that even though the birds had eyes, they could not see. Although they were trying so hard to build their house, they couldn’t see that the person who had prevented them stood nearby watching. So they continued on in ignorance, trying to make adjustments and struggling against the superior arrangement.</p>

<p>He explained how, in the same way, the materialistic persons, though having eyes, are unable to see how <em>māyā</em>, the material energy, is supervising all their efforts. They simply struggle on, making adjustments, hoping to improve their lives and secure their place in the material world, not understanding that <em>māyā</em> is watching their every move and defeating them at every step.</p>

<p class="verse">* * *</p>

<p>As promised, Mr. Chaudhuri and family arrived. Śrīla Prabhupāda happily received him, like a father receiving his son. Prabhupāda showed him the plans for the Vedic city and the land which he wants the government to acquire for the project. Then with Jayapatāka Swami he looked over the entire compound.</p>

<p>Mr. Chaudhuri promised to help Jayapatāka Mahārāja in every way possible to get the application approved. He clearly has the highest regard for Śrīla Prabhupāda and was impressed with the Māyāpur project. His wife was even more enthusiastic and challenged her husband that if he is truly a Hindu then he must help Śrīla Prabhupāda.</p>

<p>Mr. and Mrs. Chaudhuri took lunch on the balcony. As we served them sumptuous <em>prasādam</em>, Prabhupāda sat to the side in his chair, hosting them graciously. While they ate, he kept the conversation light and jolly, thus allowing them to eat without distraction.</p>

<p class="verse">* * *</p>

<p>Harikeśa spent considerable time in Śrīla Prabhupāda’s room this evening trying to persuade Prabhupāda to give him <em>sannyāsa</em>. His chief rationale was that unless one is a <em>sannyāsī</em> it is difficult to get the facility to preach in our Society. He said he has visited many temples but is rarely asked to give a class. Yet he feels that if he was a <em>sannyāsī</em> he would always be offered the opportunity to preach.</p>

<p>Prabhupāda, however, not only did not agree with his viewpoint, he also brought up other practical considerations such as, who would do his service of transcribing his nightly dictations, the cooking, and so forth? After Śrīla Prabhupāda thoroughly defeated all Harikeśa’s arguments he then sent him out.</p>

<p>I was out on the veranda as Harikeśa emerged into the night air, his ego somewhat shattered, but in a quite blissful state. He was satisfied to have been put in his place by the mercy of Śrīla Prabhupāda.</p>', '', '1976-02-01', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- February 2nd, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'February 2nd, 1976', 17,
    '', '', '', '',
    '', '', '', '',
    E'<p>In the early morning before <em>maṅgala</em>-<em>ārati</em> Prabhupāda sent me to get Tamal Krishna Goswami. He told him that after serious consideration, he had decided that Harikeśa may take <em>sannyāsa</em>. He suggested that Harikeśa travel and preach with the Rādhā-Dāmodara party. He should be trained to eventually take charge of one of the buses.</p>

<p>This was clearly a surprise to Tamal Krishna Mahārāja, who has successfully headed up the RDTSKP for the last three years. During this time he has expanded the party’s operation from one bus doing small festivals in colleges to more than a dozen vehicles with nearly 100 men selling tens of thousands of books each month all over America.</p>

<p>He was a little wary because he and Harikeśa do not always enjoy a smooth relationship; they are a somewhat volatile mix. Nevertheless, Tamal agreed to the proposal because Prabhupāda wants it. He admitted that Harikeśa certainly has the intelligence and qualification to do the job.</p>

<p>As for his own personal services, Prabhupāda thought of a good solution: Dayānanda and his wife, Nandarāṇī. Dayānanda is here in Māyāpur hoping to learn Sanskrit. So Prabhupāda said that if he became his secretary, he could personally teach him Sanskrit. Dayānanda could then assist him with his translation work. Nandarāṇī could transcribe his nightly work as well as cook.</p>

<p>I was sent to inform Harikeśa of Śrīla Prabhupāda’s decision. The unexpected news immediately sent Harikeśa in a mental spin, simultaneously elated and distressed. He had happily accepted his defeat last night and was looking forward to staying with Śrīla Prabhupāda as his menial <em>brahmacārī</em> servant indefinitely. Now, although he is happy about being awarded <em>sannyāsa</em>, it means he will have to leave the party. He lamented to me, “Once you leave Śrīla Prabhupāda’s personal party, everyone knows, you never come back!” The <em>yajṣa</em> is to be held in three days.</p>

<p class="verse">* * *</p>

<p>In another discussion later in the day with Bhavānanda Mahārāja, Śrīla Prabhupāda decided that the Deities for the proposed new temple in Māyāpur should be life-size, like the Hyderabad Deities. He wants to install Paṣca-tattva, Lord Caitanya, and His personal associates, with at least five predecessor gurus, Rādhā-Kṛṣṇa, and the eight principal <em>gopīs</em>.</p>', '', '1976-02-02', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- February 3rd, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'February 3rd, 1976', 18,
    '', '', '', '',
    '', '', '', '',
    E'<p>Prabhupāda walked on the roof this morning. Sudāmā Mahārāja told him that many students in the West are now beginning to appreciate his extraordinary feat of spreading Kṛṣṇa consciousness all around the world. He said even some yogis and svāmīs hold him in high esteem for what he has done.</p>

<p>Bhavānanda Mahārāja complimented Prabhupāda as the only true resident of Bhāratavarṣa. He explained that is because Prabhupāda is the only one to actually fulfill Lord Caitanya’s instructions. Prabhupāda gracefully conceded. He acknowledged that it is now a matter of history. Then Śrīla Prabhupāda mused for a moment, thinking of the difficulties he has had with some of his Godbrothers. He explained they are unable to recognize his achievements because of envy. But he said that this was not a new thing. Even during the time of his Guru Mahārāja, although they knew Śrīla Bhaktisiddhānta liked him very much, they would refer to him as <em>kaca-gṛhastha</em>, “a rotten <em>gṛhastha</em>.” And he said that even now they are thinking, “What is this? This <em>gṛhastha</em> has come out more than us?”</p>

<p>Yet, Prabhupāda said that not all the Gaudiya Math men felt like that. Previously his Godbrother Śrīdhar Swami had rented rooms from him in Calcutta when he was still a family man. He recalled how Govinda, Śrīdhar Mahārāja’s chief disciple, had appreciated him even then. “He always used to say to Śrīdhar Mahārāja that ‘Mahārāja, you are seeing Abhay Babu as <em>gṛhastha</em>, but he is more than many yogis.’”</p>

<p>Continuing his walk down on the ground he went to the front of our land. He wanted to inspect the progress on the new building.</p>

<p>There he questioned Jayapatāka Swami about the Śrī Caitanya Gaudiya Math. They have erected a new building at the gateway to their property, meant to house a Deity of Śrīla Bhaktivinoda Ṭhākura, the father of Śrīla Prabhupāda’s spiritual master. Prabhupāda wasn’t at all happy about it. He felt that they were going over the head of Śrīla Bhaktisiddhānta Sarasvatī Ṭhākura. Śrīla Bhaktisiddhānta had lived there for many years but had never contemplated such a thing.</p>

<p>Prabhupāda told Jayapatāka he should have challenged them that, “He [Bhaktisiddhānta] could not understand where Bhaktivinoda Ṭhākura should be placed. You have understood. You are so intelligent. Over-intelligent! That means rascals. Over-intelligent means rascal. Bhaktisiddhānta Sarasvatī Ṭhākura, he remained so many years, and he could not understand. You have understood to make Bhaktivinoda Ṭhākura a gatekeeper. You tell him next time when you go that ‘You are over intelligent.’”</p>

<p class="verse">* * *</p>

<p>Hridayānanda Mahārāja arrived from South America to be Prabhupāda’s secretary for the month. Tamal Krishna Mahārāja will return to America and then come back to Māyāpur with his men for the Gaura Pūrṇimā festival.</p>

<p>Two <em>brahmacārīs</em>, Mahāvīra and Viraha, also came with Hridayānanda. Both of them are hoping to take <em>sannyāsa</em> initiation. Boyish and eager, Mahāvīra is from North America but has been successfully preaching in Brazil. Viraha is a somber Venezuelan with little knowledge of English. Both are in their mid-twenties, and Hridayānanda highly recommends them for <em>sannyāsa</em>. He has a huge zone, the whole of Latin America, and is in dire need of <em>sannyāsī</em> assistants to help guide the booming projects.</p>

<p>After settling in, Hridayānanda Mahārāja came to Prabhupāda’s room to give an update on his preaching activities. He read him a book review written by an Indian professor in Mexico, Dr. Vajpeye. The review stated that Prabhupāda’s books are important because “they expose the terrible cheating of bogus svāmīs.”</p>

<p>Prabhupāda was so pleased to hear this assertion he started in his seat. He was excited and happy that such a learned man was able to perceive how true Vedic knowledge is being spoiled by misrepresentation. “This is required,” he said. He requested that 100,000 copies of the review should be made. He wants them distributed throughout India, especially Bombay and Madras where there is so much propaganda from these bogus gurus and yogis. “This is my intention,” he said, “to stop the so-called svāmīs and yogis from cheating the public.”</p>

<p>He feels this can be done by distributing his books. Such charlatans are ruining India’s culture by concocting their own methods of spiritual practice. But now, by reading his books, important men are beginning to realize what is going on.</p>

<p class="verse">* * *</p>

<p>During mail time Śrīla Prabhupāda heard from Svarūpa and Raṇadhīr prabhus, who manage the BBT Mail Order Department in Los Angeles. They reported a successful year, with collections of $20,000 for 1975.</p>

<p>In response Prabhupāda requested them to send the pamphlet <em>The Krishna Consciousness Movement is Authorized</em> out to their members along with a book catalog so that they may purchase our books. He also told them that we are going to print many copies of Dr. Vajpeye’s book review and distribute it widely throughout India. “He has got practical experience of how they are cheating the innocent people in foreign countries, and he has written, ‘The authorized edition of Bhagavad-gita will help to stop the terrible cheating of “gurus” and “yogis” who are false and unauthorized.’”</p>

<p>They also reported that the BBT is preparing some blow-ups of the book reviews to be displayed here in Māyāpur during the upcoming festival. Prabhupāda added a postscript to his letter, emphasizing that these blow-ups are “most important.”</p>

<p>Prabhupāda considers these favorable book reviews to be very important. He keeps the most recent ones on file and regularly shows them to his visitors. He is also pleased with the new booklet <em>The Krishna Consciousness Movement is Authorized</em> because it presents the favorable endorsements of many respected professors.</p>

<p>A letter arrived today from Madras that confirmed Prabhupāda’s feelings. It stated that after Prabhupāda’s visit, Svāmī Chinmayananda had gone there and given a ten-day discourse on the <em>Bhagavad-gītā</em>. Afterward one man told our devotees, “What Prabhupāda achieved in two days, Svāmī Chinmayananda failed to do in ten!” Needless to say, Śrīla Prabhupāda is delighted when he hears such accounts.</p>

<p>Prabhupāda is acutely aware of the power of the printed word. Our entire movement is based on his books, and he carefully supervises every aspect of their production and distribution. In a reply to Rādhāballabha in Los Angeles, he approved a new kind of water-resistant cloth cover and gold stamping on the bindings, “if it will increase the appeal.”</p>

<p>He even personally checks and approves the paintings for the books. Before proceeding with their paintings the artists regularly send him their preliminary sketches for him to review. Thus he answered Rādhāballabha’s questions on illustrations for <em>Śrīmad-Bhāgavatam</em>, Seventh Canto, dealing with Prahlāda Mahārāja. Śrīla Prabhupāda gave the kind of insightful instruction that was possible from only him.</p>

<p>“There should be no effulgence around Prahlada. Hiranyakasipu should not be shown with a pipe. He was a non-smoker.”</p>

<p>“Krsna killing Sisupala took place inside, not outside.”</p>

<p>“Yes, you can show dead bones, skulls, and snakes in the dungeon. Prahlada was not actually attacked with the tridents, just threatened.”</p>

<p>It seems that Śrīla Prabhupāda’s idea of instituting examinations on <em>śāstra</em> has drawn an enthusiastic response from the GBC men, but also some consternation.</p>

<p>Satsvarūpa Mahārāja wrote to ask whether the devotees should be allotted more time to study. He said this would mean less time on <em>saṅkīrtana</em> and other engagements, like cooking, building, managing, and so forth.</p>

<p>Satsvarūpa Mahārāja suggested that we could establish a more structured, college-curriculum style approach to the morning and evening classes which are held in the temples. “My question,” he asked, “is whether the one-verse per class format which you have established could be changed in order to cover more material in a regular outlined way, in preparation for the examinations. I would like to try such an outlined presentation myself, and even suggest it to the GBC for introduction to the whole society, but I am in doubt whether it is your desire and whether I may have the wrong idea on this.”</p>

<p>Prabhupāda informed him that the exams are for those who want some academic qualification. “Just like a brahmana with sastric knowledge and a brahmana without. It is optional; one who wants may take. The real purpose is that our men should not be neglectful of the philosophy.”</p>

<p>Since the exams are not to be held until next year on Gaura Pūrṇimā, Prabhupāda sees no need for the devotees to give up their normal engagements to do more study. And as far as his idea for teaching classes, he wrote, “This should be discussed at the GBC meeting. If it does not hamper our normal procedure then it is welcome.”</p>', '', '1976-02-03', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- February 4th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'February 4th, 1976', 19,
    '', '', '', '',
    '', '', '', '',
    E'<p>In the early morning Prabhupāda took up the topic of cheating gurus again. He told us about some of the nefarious activities of a few so-called gurus. One well know svāmī had been found in bed with his secretary. So his disciples sued him.</p>

<p>He also told us about a Sikh guru in America who enjoys his disciples’ wives. And they consider this a “blessing.”</p>

<p>In Bombay there is a deviant line of Vaiṣṇavas who follow a similar procedure. When a couple gets married the girl spends her wedding night with the guru, so that she becomes “guru <em>prasādam</em>”!</p>

<p>In the course of the conversation, Hridayānanda Mahārāja revealed that he had himself drafted the review from Mexico. Dr. Vajpeye only signed it. But Prabhupāda was not disappointed. The fact that the Dr. signed it showed that he agreed with the statements. Again, Prabhupāda stressed that exposing bogus gurus is an important part of our preaching work. But he said that it can only be done if we are spiritually strong ourselves.</p>

<p>Prabhupāda regretted that sometimes his own men, though knowing the proper standards, don’t always live up to them. In that connection, Hridayānanda also had news of Paramahaàsa Swami, Prabhupāda’s former secretary, who hasn’t been heard of for several months. He has left ISKCON and is now a gas station attendant in Oregon.</p>

<p>Apparently he and another <em>sannyāsī</em> spent a month in Bangkok where they broke all the regulative principles. Paramahaàsa returned to the USA., and the other <em>sannyāsī</em> came to South India where he spent a few days with Śrīla Prabhupāda before going back to Bangkok. This devotee is also reported to have been going to see movies in Japan.</p>

<p>On hearing this Prabhupāda simply commented, “Yes, I could understand it from seeing his face.”</p>

<p>Prabhupāda also mentioned another wayward disciple named Audalomi who had been told by doctors that he would die within a few months. He asked to be given <em>bābājī</em> initiation. Prabhupāda had reluctantly agreed and thus Audalomi Mahārāja came to spend his last days in Māyāpur chanting Hare Kṛṣṇa. But when another doctor informed him he would not die so soon, he returned to his wife in the U.S.A., gave up devotional service, and became like a <em>karmī</em> again. He was last seen surfing on the West Coast.</p>

<p>Added to this, another disturbing report was related about one of our <em>sannyāsīs</em> who is currently preaching here in India.</p>

<p>Prabhupāda shook his head regretfully. He said that he is doing his best to push forward this movement with whatever men Kṛṣṇa sends him, although he is aware that some of his men are deviating from the principles he has laid down. Despite this, as long as a person is willing to keep trying, he is willing to engage them in Kṛṣṇa’s service, with the hope that they will eventually become purified and attain success on the spiritual path. In the meantime, they can do something useful for pushing on the movement.</p>

<p class="verse">* * *</p>

<p>The acceptance of <em>sannyāsa</em> has become so popular recently that even some of the ladies are asking about it. Āditya dāsī sent an enquiry from Bombay. “I am writing this letter on behalf of myself, as well as the other women in our Society. Sometimes the question has come up, but no one seems to know the real answer, about sannyasinis. I know that sannyasa is the highest order of spiritual life, therefore is it not possible that we can be eligible? Myself, I do not feel like a woman, although I am in this body.”</p>

<p>Prabhupāda’s reply was concise and clear. Quoting from <em>Bhagavad-gītā</em>, he told her the soul is neither man nor woman, and for those engaged in Kṛṣṇa’s service, there is no distinction between man and woman. “Anyone acting for Kṛṣṇa, he is a sannyasi or sannyasini. Spiritually everyone is equal. But materially a woman cannot be given sannyasa. But you should not be bothered because you are serving on the spiritual platform.”</p>

<p>Prabhupāda complained to his secretaries that he is constantly being bombarded by requests for <em>sannyāsa</em> from devotees who are not fit to accept such an exalted position. It has become such a problem that he has approved a suggestion made by Tamal Krishna: from now on any request for <em>sannyāsa</em> must be accompanied by a recommendation from another <em>sannyāsī</em> or GBC. The request will then be considered at the annual GBC meeting here in Māyāpur. If accepted, the man will be put on a one-year waiting list and then initiated the following year. Hopefully this will shield Śrīla Prabhupāda from being unnecessarily disturbed and help to further qualify the candidates.</p>

<p>Prabhupāda also told us that he wants the number of GBCs increased to twenty. More and more he is referring new plans for preaching, managerial arrangements, and so forth, to the GBC for discussion, taking a less active part himself. He wants them to become fully responsible for the management of the Society.</p>

<p class="verse">* * *</p>

<p>There was a big storm in the evening. The lights went out as huge gusts of wind blew sudden and furious. We had to run to bolt down all the windows and doors.</p>

<p>Prabhupāda sat happily undisturbed in the darkness of his room. The distant heavens meanwhile were lit up by multiple forks of bluish-yellow lightning streaking across the sky, making an awesome display of the power of material nature. Prabhupāda repeated that rainfall at this time of year is considered auspicious and very welcome.</p>', '', '1976-02-04', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- February 5th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'February 5th, 1976', 20,
    '', '', '', '',
    '', '', '', '',
    E'<p>The discussions of the morning walks are getting very lively now with Hridayānanda, Tamal Krishna, and Harikeśa all debating with Śrīla Prabhupāda on the latest scientific theories. They, of course, get soundly defeated.</p>

<p>Hridayānanda presented the theory that although God originally created everything, once things were set in motion, there was nothing else for Him to do. Therefore He is now inactive; God has become dormant.</p>

<p>Prabhupāda replied that being dormant doesn’t mean being out of the picture. Prabhupāda demonstrated this by using himself as an example. “I am walking now, but if I choose not to walk for half an hour, that doesn’t mean I am not active. The capacity to act remains. One simply has to understand how God is acting.”</p>

<p>Prabhupāda explained that when he was a child he wondered how the gramophone was working. He thought there must be a man inside the box, otherwise, how could it work? Although his perception was childish, still he knew there must be some person behind it. Similarly, nature is working, and this indicates an active God behind it. “Just like there was cloud and rain. Now it is not raining,” he pointed out. “So there is activity already. It is being managed. So you cannot say God is dormant. He is acting because his creation is acting. And God says, ‘Under My direction the nature is working.’ How can you say He is dormant?”</p>

<p>Hridayānanda threw in another point of contention. “The main argument among the atheistic philosophers is that, ‘God could not exist, because if He existed, if God were good, then why would we be suffering? God would stop our suffering.’”</p>

<p>Śrīla Prabhupāda’s swift retort exposed the faulty logic. “Because you are criminal. There are so many persons in the state. Not all of them are suffering in the prison-house. Only the criminals. So that is the proof you are criminal.” He concluded by saying that whether we enjoy or suffer is simply a question of the use of our God-given free will.</p>

<p class="verse">* * *</p>

<p>After <em>guru-pūjā</em>, Prabhupāda presided over a combined Deity installation and <em>sannyāsa</em> initiation ceremony.</p>

<p>The head <em>pūjārī</em>, Jananivāsa, assisted by newly arrived GBC Jagadīśa dāsa, performed the <em>abhiṣekha</em> of Śrī Śrī Gaura-Nitāi. The beautiful twenty-inch high neem-wood Deities were installed as the proprietors of the oceangoing boat “Nitāi Pada Kamala.” Sudāmā Mahārāja plans to sail up and down the Ganges with Their Lordships and other Māyāpur devotees, preaching from village to village.</p>

<p>After the Deities were installed, Harikeśa and Viraha were awarded <em>sannyāsa</em>. Mahāvīra will wait until Gaura Pūrṇimā.</p>

<p>Śrīla Prabhupāda had the <em>mantra</em> and purport from <em>Śrī Caitanya-caritāmṛta, Madhya-līlā </em>3.6 read aloud: “[As a <em>brāhmaṇa</em> from <em>Avanti-deśa</em> said] I shall cross over the insurmountable ocean of nescience by being firmly fixed in the service of the lotus feet of Kṛṣṇa. This was approved by the previous <em>ācāryas</em>, who were fixed in firm devotion to the Lord, Paramātmā, the Supreme Personality of Godhead.”</p>

<p>Prabhupāda gave a short talk explaining that <em>sannyāsa</em> is simply a facility to preach and spread Kṛṣṇa consciousness. He awarded the two men their new cloth and <em>tridaṇḍas</em>, the traditional monk’s staffs. Then he told Harikeśa to “simply add Swami” to his name. He renamed Viraha as Viraha Prakaśā Swami. Then he returned to his room while the devotees conducted the fire ceremony.</p>

<p>As soon as he settled in his room Prabhupāda asked Hridayānanda Mahārāja how the two new <em>sannyāsīs</em> would be engaged. He was informed that Viraha Prakaśā Swami plans to stay in Māyāpur for a few weeks to get Prabhupāda’s association before returning to South America. But Śrīla Prabhupāda said that was not good. He should immediately go out and preach.</p>

<p>Hridayānanda Mahārāja explained that Viraha Prakaśā only speaks Spanish, so it would be difficult for him to preach in India. But Prabhupāda promptly called for the two new <em>sannyāsīs</em> and told them, “Leave immediately for somewhere—anywhere—and preach. When there is a fire, if you don’t know the language, somehow you communicate and the message gets through. Even if you cannot speak the language properly it doesn’t matter. Preaching must be done.” He said that the best use of intelligence is to accept <em>sannyāsa</em> and go preach. It is also the best way to associate with the guru. Personal association is not so important, but to associate with the teachings of the guru is essential. Prabhupāda said that he had not seen his Guru Mahārāja for more than ten or fifteen days in fourteen years. Thus his words were of personal encouragement and comfort to Harikeśa Swami as well, since he is now leaving Śrīla Prabhupāda’s personal service.</p>', '', '1976-02-05', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


END $$;
