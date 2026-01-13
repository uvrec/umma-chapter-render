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


  -- April 8th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'April 8th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>A couple of interesting questions came up during the walk this morning. Paṣcadraviḍa Mahārāja asked Śrīla Prabhupāda what he was thinking when he first went to the West. What idea for a program did he have?</p>

<p>Prabhupāda replied with a laugh. “This idea: I shall speak to don’t eat meat, and they’ll immediately kick me out!” Everyone laughed.</p>

<p>“That was my program. I was going to say ‘Don’t eat meat. No illicit sex,’ and immediately they will kick me out! ‘All right.’ I never thought that you would accept it. That is the idea of my poetry [written on the boat when he first arrived]. I was asking Kṛṣṇa, ‘I do not know why You have brought me here. As soon as I will say these things, they will kick me out. What is Your program, I do not know.’” Prabhupāda chuckled to himself.</p>

<p>Lokanātha Swami offered, “You are so expert. For one year you did not mention those rules and regulations, I heard.”</p>

<p>“No, I simply said, ‘Come and join and chant.’”</p>

<p>“And when they developed higher taste, then you said, ‘Now no more meat-eating.’”</p>

<p>Lokanātha Mahārāja also had a question about the local people here in Vṛndāvana. “Śrīla Prabhupāda, what is the position of the Brijvāsīs, those who are living in Vṛndāvana now? What happens to them next life?”</p>

<p>“Simply by living, if they do not commit anything sinful, they’ll go back to home. Simply by living, without committing any sinful activities. Always remember Kṛṣṇa, this is Kṛṣṇa’s land; that will deliver them.”</p>

<p>“They don’t need a spiritual master?” Madhudviṣa asked.</p>

<p>“Yes,” Prabhupāda replied. “Spiritual master is always needed. Without abiding by the orders of spiritual master and serving him, nobody can be...Otherwise rascal.”</p>

<p>I began to say, “So all these local Brajavāsīs, they all accept...”</p>

<p>Prabhupāda immediately thought of the farmer the other morning who offered his respects because he’d walked on his land. “No, Brajavāsīs, they are generally, naturally, they are Kṛṣṇa conscious. Otherwise how is this illiterate farmer, he is offering? This is natural.”</p>

<p>Paṣcadraviḍa asked, “But he has no spiritual master?”</p>

<p>“No, no, he has a spiritual master. And even without spiritual master they have already elevated to Kṛṣṇa consciousness.”</p>

<p>“So they will go back home?”</p>

<p>“Oh, yes,” Prabhupāda assured him, “because spiritual master is within, <em>caitya-guru</em>.”</p>

<p>From what he told us about the position of the Brajavāsīs, it may seem that it is an easy way to go back to home, back to Godhead. But, of course, getting a birth in Vṛndāvana is not easy.</p>

<p class="verse">* * *</p>

<p>In class Prabhupāda explained what is required of us if we want to please Kṛṣṇa and get His blessings. “We have to surrender. That will please Kṛṣṇa. And without pleasing Him? You cannot see Kṛṣṇa. You may have your eyes, big, big eyes, but you cannot see Kṛṣṇa. You have to please Him. That pleasing activity is <em>bhakti</em>.</p>

<p>“Without that <em>bhakti,</em> it means sitting down silently... ‘No, no, I am chanting. I do not want to go out. I am busy.’ This means excuse. What you will chant? You will think of money and woman, that’s all. Just work. Go to sell books and work hard. That is wanted. Therefore we do not give that opportunity. My Guru Mahārāja did not give this opportunity, and we are following the same principle. No opportunity of sitting idle. No, you must work. That will rectify. Yes.”</p>

<p class="verse">* * *</p>

<p>I have been learning how to make <em>capātīs</em> from Bhagatjī, who Prabhupāda said makes the best. They are thick but well cooked, and each one puffs up perfectly and tastes sweet. Each day he comes to cook them for Prabhupāda’s lunch, stopping briefly to ask Prabhupāda what he would like to eat, before entering the kitchen at the bottom of the garden. Śrīla Prabhupāda is encouraging me to learn in preparation for the next few months on the road. He said he would personally show me how to use his three-tiered cooker.</p>

<p class="verse">* * *</p>

<p>In the early afternoon some Gaudiya Math men came and took a big feast. They came again in the evening and, along with the High Commissioner and District Magistrate from Mathurā, attended our program. They spoke on Kṛṣṇa consciousness and gave their recognition of Prabhupāda’s efforts to glorify the holy <em>dhāma</em> all over the world.</p>', '', '1976-04-08', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- April 9th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'April 9th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Today is <em>Rāma-navamī,</em> the appearance day of Lord Rāmacandra, and everyone fasted until 4:00 p.m.</p>

<p>Prabhupāda walked through a nearby forest for his daily exercise. We drove out along Chattikara road a couple of miles and when he saw the wooded area he decided to get out. As we walked, he noticed a newly constructed road and enquired why it was there. I suggested that there might be a village on the other side of the woods. But Prabhupāda said that, no, the government would not build such a nice road simply for villagers. He concluded they were planning some industrial development and criticized them for following the West, leading India away from its spiritual goals.</p>

<p>Prabhupāda laughed about his own approach to Western civilization, which he described as <em>ajagara-vṛtti</em>. The python allows the mouse to dig a hole, then he eats the mouse and moves in. The Americans have worked hard to build their cities, Prabhupāda said, and he is now going there, taking their money, and bringing it back to India.</p>

<p>Another approach, he said, is <em>madhukara-vṛtti,</em> the way of the bee, which flits from flower to flower collecting a little here and a little there. But because the bee stocks its honey, there is the danger of its being taken away. For this reason he said that we should follow this policy: spend all funds on book publication or temple construction, and not keep any money in the bank.</p>

<p class="verse">* * *</p>

<p>In the <em>Śrīmad-Bhāgavatam</em> Lord Nṛsiàhadeva described <em>śreyas-kāma,</em> the person who desires the best possible thing in life, as one who strives to please the Lord, because it is only God who can award the fulfillment of one’s desires.</p>

<p>Śrīla Prabhupāda stressed that we should never think ourselves to be independent, as every aspect of our being is controlled. “Some demigod is controlling. Breathing, there is control. You can breathe for so many years, and live. And when the breathing is finished, then you are not in control. The great scientists, they are giving oxygen gas, injection. Can you increase the period of breathing for a moment? No. Controlled. So the yogis, they try to save the breathing. That is yogic process. They practice breathing control so that they can increase their life. Suppose I shall live for eighty or a hundred years. There is breathing period. If I can save breathing, then I can live more. Just like your bank balance. If you don’t spend it, your balance is all right. But you spend it; then the balance will be zero some day. Similarly, the yogic process is to control the breathing. And the breathing is lost in large quantities when there is sex life.”</p>

<p>At this point he began to breath rapidly and loudly into the microphone, making everyone laugh. “Finished! So to control the breathing, it requires celibacy, no sex life. That is called yoga; not showing some gymnastics and smoking and ‘yoga system.’ This is going on. Your country is cheated by so many rascals, yogis. You know it very well.”</p>

<p>Prabhupāda told us that therefore in order to become advanced, or <em>dhīraḥ,</em> very sober, we require the guidance of a genuine guru.</p>

<p class="verse">* * *</p>

<p>At midday <em>ārati</em> some devotees were singing over the microphone a <em>mantra</em> glorifying Sītā Rāma: “<em>Raghupati rāghava rāja rāma, patita pāvana sītā rāma</em>.” They were also chanting some other <em>mantras</em>.</p>

<p>Śrīla Prabhupāda sent me into the temple with the message that they stop. He wanted them to simply chant the Hare Kṛṣṇa <em>mahā-mantra,</em> since it automatically includes Lord Rāma. He said that other <em>mantras </em>were not necessary.</p>

<p class="verse">* * *</p>

<p>At 6:30 p.m. Prabhupāda drove to Mathurā to speak at a <em>paṇḍāl</em> held at Kṛṣṇa-janma-bhūmi<em>,</em> the birthplace of Lord Śrī Kṛṣṇa. Prabhupāda spoke in Hindi to a very noisy crowd of about five thousand people. Although it is Kṛṣṇa’s own <em>dhāma,</em> we were disappointed to see some of the younger people being unruly and downright disrespectful to the devotees. But apart from that, it was a well-attended and successful program.</p>

<p>On the way back to Vṛndāvana some other residents of the <em>dhāma</em> created a minor stir. As we drove by some small roadside shops, a large hog suddenly shot out from between a couple of rickshas, frantically running from a snarling dog. There was a loud clang. It had run headfirst into the rear wheel of our car. Then it disappeared into the night, the dog in hot pursuit.</p>

<p class="verse">* * *</p>

<p>Prabhupāda’s itinerary has been finalized for the next few weeks. He’ll be leaving here for Bombay on April 11th, Melbourne on April 18th, New Zealand on the 26th, Fiji on the 29th, and then to Hawaii on May 5th for about a month.</p>

<p>He is translating more these days, being increasingly encouraged because the BBT in Los Angeles has at last caught up with the backlog. When Rāmeśvara was here he had assured him that as soon as he finishes a section it can be immediately put into production. Thus he had pleaded with Prabhupāda that he should stay a while in Hawaii, where it is hoped he will be able to rest and translate more.</p>

<p>He has an invitation to go to Bangalore on May 11th, but it is very doubtful whether he will go. Mahāàsa Swami has also invited him to Hyderabad on Janmāṣṭamī for the new temple opening. But at the moment the building is still under construction.</p>

<p class="verse">* * *</p>

<p>Prabhupāda was telling me some of the psychology of family life as I gave him his evening massage. He explained that a child usually puts food directly into its own mouth, but when older, he may distribute it among his family. It’s the same selfishness, only extended. On the other hand, he also told me that the reason why Westerners squander money so much is because they have no family affection, so therefore they are not careful how they spend it.</p>', '', '1976-04-09', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- April 10th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'April 10th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>As we walked in the same forest again this morning, Yaśodānandana Swami, who returned from South India yesterday, asked Prabhupāda to confirm Ahobalam in the South as the actual place of Lord Nṛsiàhadeva’s pastimes. He had taken photos that he wanted to publish in <em>Back To Godhead</em>magazine. However, Jayādvaita and other editors doubted the claim.</p>

<p>Prabhupāda said if there is some controversy, it should be avoided. “You know the <em>taka-taliya-nyāya?</em> There was a tree, <em>tal</em> tree. So one crow was there, and the <em>tal</em> fruit fell down. Two <em>paṇḍitas</em>, they began to argue, ‘Because the crow sat down on it, therefore the <em>tal</em> fruit fell down.’</p>

<p>“The other said, ‘No, the <em>tal</em> fruit was falling down, and the crow could not sit on it.’ And they began to fight: ‘No, this.’ ‘No this.’ ‘No this,’ and so on.”</p>

<p>He said that the main point is that Lord Nṛsiàha is our worshipful Deity, no matter where He is. Then he quoted from the <em>Brahma-saàhitā</em>. He is situated everywhere, why just this place or that place?</p>

<p>He then noted that Yaśodānandana Mahārāja was barefoot in the forest. Yaśodānandana shrugged it off, saying it was all right. But Prabhupāda got a little annoyed with him. He said it was not all right. It was a risk in the forest. Then he told him to go sit down. Then, out of consideration for his disciple, he said we should walk on the road.</p>

<p class="verse">* * *</p>

<p>For his last class this morning (tomorrow we go to Bombay), the verse was the last one in the chapter, “Prahlāda Pacifies the Lord with Prayers.”</p>

<p>The narrator of the story, Nārada Muni, said: “Prahlāda Mahārāja was the best person in the family of demons. Demons always aspire for material happiness, yet even though Prahlāda was somewhat allured when the Supreme Personality of Godhead offered him benedictions for material happiness, because of his unalloyed Kṛṣṇa consciousness he did not want to take any material benefit for sense enjoyment.”</p>

<p>Prabhupāda gave an excellent discourse, thoroughly explaining the mood of selfless service in the devotee and the reciprocal feelings of the Lord. He told us how the Lord once approached one of His devotees, Īśāna, desiring to give him a benediction. Īśāna’s roof was full of holes, allowing the rain in, and Lord Caitanya offered to repair it. Īśāna rejected the offer, though. He said the birds were simply living in the trees with no roof at all. So why should he bother the Lord simply for this?</p>

<p>Similarly, there was also an exchange between Rūpa and Sanātana Gosvāmīs, with which Prabhupāda further beautifully illustrated real devotional sentiment. “They were living in this forest of Vṛndāvana. Sanātana was elder brother, and Rūpa was younger brother. So they were living underneath a tree. So they had no means. Rūpa Gosvāmī thought that ‘If I could get some articles, I could prepare something and invite my guru, Sanātana Gosvāmī.’</p>

<p>“So just after a few minutes one very nice young girl came with so much presentation of rice, <em>dāl,</em> ghee, and so many other things. So she came and offered to the Gosvāmī. ‘Baba, please take this presentation. We have got some ceremony at our home, so my mother has sent. You take it.’</p>

<p>“So he was very glad: ‘Oh, I was thinking if I could get some nice things, I could prepare and invite Sanātana Gosvāmī.’ So he was very glad to receive those articles and invited Sanātana Gosvāmī and prepared so many nice foodstuffs and offered them to the Deity, and Sanātana Gosvāmī was given the <em>prasādam</em>. Sanātana Gosvāmī was very pleased, and he inquired, ‘Rūpa Gosvāmī, where you got these nice things? You are living in this...How you could receive all these things?’</p>

<p>“‘Yes, dear brother, I was just thinking in the morning. In the meantime a very nice young girl came and offered so many things, so I could—’</p>

<p>“‘What is that? Who is that young girl in this forest? How was she looking?’</p>

<p>“‘Oh, she was very, very beautiful.’</p>

<p>“‘Oh, Rādhārāṇī. Oh.’ So he was very sorry. ‘You have taken service from Rādhārāṇī? Oh, you have done very wrong. We are trying to serve Rādhārāṇī, and you have taken service from Rādhārāṇī?’ He rebuked him.</p>

<p>“This is pure service. They are avoiding to take service from Kṛṣṇa or Rādhārāṇī. And Kṛṣṇa and Rādhārāṇī was finding out the opportunity how to serve the devotee. This is the competition between Kṛṣṇa and His devotee.”</p>

<p>Then a bit later in the lecture he told an amusing anecdote to express the principle of being prepared to do and use anything in Kṛṣṇa’s service. “A <em>sannyāsī</em> is supposed to walk. But if somebody criticizes, ‘Sir, why you are flying on airplane?’ no, that is our not principle. The Jain <em>sannyāsīs,</em>they never use cars. Now they have begun. Because I am traveling all over the world, now the Jains, they are also.” Everyone laughed at that comment.</p>

<p>“But our philosophy is different. We are preaching Kṛṣṇa consciousness. Suppose I have to preach Kṛṣṇa consciousness in Europe or America. So because a <em>sannyāsī</em> has to walk, therefore I shall walk throughout the whole life to go to America? This is foolishness. If I can go to America within fifteen hours for preaching facility, why shall I not use the airplane? It is called <em>niyamāgraha,</em> to follow the regulative principles without any profit.</p>

<p>“No. If we get the opportunity, preaching facilities for going on car, on airplane, using typewriter, dictaphone, microphone, we must use it. Because it is Kṛṣṇa’s property, it must be used for Kṛṣṇa. This is our philosophy.”</p>

<p class="verse">* * *</p>

<p>All the devotees are visibly surcharged from their association with Śrīla Prabhupāda during the last few weeks. Now they will all be returning to their respective temples to push on the <em>saṅkīrtana</em> movement. As Śrīla Prabhupāda has stated many times, his idea is to bring as many devotees as possible to the Māyāpur/Vṛndāvana Gaura Pūrṇimā festival. He knows that they will become purified by contact with the <em>dhāmas</em> and thus return fully enthused with spiritual potency to preach for another year.</p>

<p>Of course, it is Śrīla Prabhupāda’s association that is the chief motivating principle. We may not know Kṛṣṇa, but Śrīla Prabhupāda is in our midst, and it is due to the strong reciprocal loving relationship with him that all the devotees are working so hard year after year.</p>

<p class="verse">* * *</p>

<p>We have completed packing for the upcoming tour. We will be traveling overseas until mid-August, apart from a brief stay in Bombay.</p>

<p>Śrīla Prabhupāda instructed Śāstrījī to remain in Vṛndāvana. He wants him to work with the <em>gurukula,</em> rather than add to the travel expenses by coming along. So the party will be just Puṣṭa Kṛṣṇa Swami and myself.</p>', '', '1976-04-10', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- April 11th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'April 11th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p><em>Ekādaśī-brata</em>. Śrīla Prabhupāda, Puṣṭa Kṛṣṇa Swami, Caitya-guru dāsa and I left the Krishna Balaram Mandir at exactly 4:30 a.m., bound for Delhi—and near disaster.</p>

<p>After an hour and a half of uneventful motoring we entered the divided road in Faridabad district, an industrial complex on the outskirts of Delhi. Puṣṭa Kṛṣṇa Swami was at the wheel. He was explaining to Caitya-guru the finer points of driving the Mercedes, showing him the various switches and dials, because the car will be garaged here in Delhi while we are traveling overseas. Caitya-guru has been charged with its upkeep.</p>

<p>His attention diverted, Puṣṭa Kṛṣṇa failed to notice up ahead an oxcart overtaking a camel cart, moving into the center of the road. By the time he looked up it was too late. He was traveling too fast to stop.</p>

<p>Trying desperately to brake, he locked the wheels. The car began to skid; we were right on top of the oxcart. He tried to squeeze between the oxcart and the high curb of the central divider. The axle of the cart gouged into the rear passenger door next to Śrīla Prabhupāda. The impact ripped the entire wheel off the cart and sent the occupants tumbling down into a heap of straw. Our car cannoned through the gap and kept going.</p>

<p>Puṣṭa Kṛṣṇa, badly shaken, put his foot down and kept going, not daring to stop. In India riots can quickly flare over such incidents, and drivers have been killed by angry onlookers.</p>

<p>The car door was slightly sprung, and you could see daylight through the top edge; but miraculously, no glass was broken and no one was hurt. I was shocked and looked to Śrīla Prabhupāda to make sure he was all right. He was unharmed. But he was so angry, he said to Puṣṭa Kṛṣṇa, “You are going so fast...!” and then bit his lip. He maintained a formidable, stony silence for the rest of the trip.</p>

<p>On arrival in Delhi Śrīla Prabhupāda had to climb out of the opposite door, the one on his side being so badly damaged it could not be opened. It had a huge rip in it. Prabhupāda said very little.</p>

<p>Puṣṭa Kṛṣṇa was acutely embarrassed and apologized.</p>

<p>This was a feature of Śrīla Prabhupāda’s anger that I have not seen before. For a minor mistake or offense he can respond with either a mild or sharp rebuke or sarcasm, and that is sufficient correction. A major act of stupidity and carelessness, however, invokes demonstrative ire. His back straightens, his top lip quivers on the left side, and the blast of his anger can knock all the nonsense out of you. Only full surrender and rectification in these cases will ease his anger.</p>

<p>But his silence is the strongest response, reserved for a <em>mahā-aparādha,</em> an offense so great it is beyond comment. In this case I had the feeling that Puṣṭa Kṛṣṇa’s apology was not enough.</p>

<p class="verse">* * *</p>

<p>Before we flew to Bombay Śrīla Prabhupāda inspected another house that was still under construction. He was considering it as a possible new temple for ISKCON New Delhi but rejected it as too expensive.</p>

<p>Then he went to see the Deities, Śrī Śrī Rādhā-Pārtha-sarathī. They are now in the flat where he previously stayed at 9 Todar Mal Lane, because the lease on number 19 has run out. The situation is difficult, but They are being well looked after.</p>', '', '1976-04-11', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


END $$;
