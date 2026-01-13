-- ============================================
-- TD Volume 1, Chapter 6 - Verses
-- ============================================

DO $$
DECLARE
  v_book_id uuid;
  v_canto_id uuid;
  v_chapter_id uuid;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = 'td';
  SELECT id INTO v_canto_id FROM public.cantos WHERE book_id = v_book_id AND canto_number = 1;
  SELECT id INTO v_chapter_id FROM public.chapters WHERE canto_id = v_canto_id AND chapter_number = 6;


  -- January 1st, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'January 1st, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Tamal Krishna Goswami arrived from America at 5:00 a.m. this morning to serve as Prabhupāda’s secretary for the month of January. Prabhupāda was very happy to see him. He brought with him the newly printed volumes 1 and 2 of the <em>Śrīmad-Bhāgavatam</em>, Sixth Canto. The books look beautiful with gilt-edged pages and a new full-color painting for the end covers. The painting is of Śukadeva Gosvāmī, surrounded by all the great sages, speaking the <em>Bhāgavatam</em> to Mahārāja Parīkṣit on the banks of the Ganges. The front cover and spine are gold stamped, giving an attractive, high-quality appearance. Prabhupāda is delighted with them.</p>

<p>Śrīla Prabhupāda also received the first copies of a new pocket-sized book he translated: <em>Śrī Upadeśāmṛta—The Nectar of Instruction</em>, by Śrīla Rūpa Gosvāmī. Prabhupāda appeared very satisfied with it and he immediately asked how many copies had been printed. When he heard there were only ten thousand, he wanted to know why.</p>

<p>Tamal Krishna Mahārāja explained that the BBT staff thought that the book is meant primarily for devotees, thus the small print run.</p>

<p>But Prabhupāda made it clear that he wants the book for mass distribution as well. He told Tamal to inform Rāmeśvara to print at least 100,000 immediately.</p>

<p>Tamal Krishna Mahārāja then gave him the final book distribution figures for the six-day Christmas period. The figures were astounding, and Prabhupāda laughed in clear enjoyment—over 600,000 books distributed! In New York alone they had sold 18,000 <em>Kṛṣṇa Book</em> trilogies in just one day! The figures are utterly unprecedented, and Śrīla Prabhupāda beamed as he heard the scores and some of the stories of how it was done.</p>

<p class="verse">* * *</p>

<p>At 8:55 a.m. Śrīla Prabhupāda, Tamal Krishna Mahārāja, Harikeśa, and I flew to Madras. Acyutānanda, Yaśodānandana, Gurukṛpa, and Mahāàsa Mahārājas; Śravaṇānanda and Bhāvabhūti prabhus, the co-temple presidents of ISKCON Madras; members of the Nāma Haṭṭa <em>saṅkīrtana</em> party; and a small but very enthusiastic group of life members all greeted us at the Madras airport. They held a rousing <em>kīrtana</em> in the small airport building, bringing everything to a standstill. The life members were swept up by the enthusiasm of the devotees, and at least 30–40 garlands were draped around Śrīla Prabhupāda’s neck. Śrīla Prabhupāda was beaming with pleasure at the reception, and after a few minutes we were led out to a waiting Mercedes sedan, loaned for the week by a well-wisher, and driven to a life member’s home.</p>

<p>We are staying at the house of Mr. Manical Bhai, an extremely pleasant and respectful Maḍwari businessman. A member of the Vallabha-sampradāya, he is a strict vegetarian. It is a large, quiet house, and Prabhupāda has been given a section of the top floor with a porch.</p>

<p>The steep climb was a bit daunting for Prabhupāda, as he is still very weak from uremia. Thus we carried him up in a chair. For us, of course, it was a welcome burden, a pleasure to relieve Śrīla Prabhupāda of any strain, but it was definitely not a good sign.</p>

<p>Later in the morning he conducted a well attended press conference. He explained to the reporters that the propagation of the Kṛṣṇa consciousness movement is aimed at educating the foolish modern civilization that indeed there is God, as described in the <em>Bhagavad-gītā</em>.</p>

<p class="verse">* * *</p>

<p>It was a quiet day with few visitors, and Prabhupāda relaxed. In the evening Mr. Bhai drove him to the Rājeśvari Kalyāna Maṇḍapam, for the first of two programs arranged by Śravaṇānanda and Bhāvabhūti Prabhus.</p>

<p>The venue is a popular marriage hall on Cathedral Road, with a seating capacity for about 2,000. The devotees had managed to get a life member to pay for the hire.</p>

<p>The hall is light and airy with two open sides and a recessed ceiling about thirty feet high. At the center back there is a raised platform with a heavily sculpted gazebo-like structure over it, where the weddings are performed.</p>

<p>Opposite this is a modest stage, recessed into the wall. On this the devotees have made simple, but attractive, arrangements for the two days of programs. In the center of the stage they have placed a beautiful <em>vyāsāsana</em> for Prabhupāda, a gift from the owner of the Globe Mirror company, another enthusiastic supporter. A large banner across the back wall, prominently featuring the ISKCON lotus flower logo and name of the Society and that of Śrīla Prabhupāda, completes the decorations.</p>

<p>When Śrīla Prabhupāda arrived the hall was packed, the mood relaxed and expectant. He mounted the stage and took his place on the <em>vyāsāsana</em>. Co-temple presidents Bhāvabhūti and Śravaṇānanda offered garlands and the devotees danced exuberantly to the <em>kīrtana</em> led by Acyutānanda Swami.</p>

<p>The devotees had invited the Governor of Tamil Nadu to attend. During the state of emergency he apparently has more authority in the state than the Chief Minister. He gave a short opening speech, praising the work Śrīla Prabhupāda is doing to spread Kṛṣṇa consciousness all over the world. He presented Prabhupāda with a garland, and Prabhupāda in turn gave him one of his personal copies of the new Sixth Canto <em>Śrīmad-Bhāgavatam</em>.</p>

<p>Unfortunately the Governor couldn’t remain for the entire program because of prior commitments. Prabhupāda didn’t seem to mind, though. He was satisfied to have a leading dignitary give support to his mission, especially here in Madras, a city noted for its efforts to smash traditional religious systems.</p>

<p>Śrīla Prabhupāda chanted <em>jaya rādhā mādhava</em> and then launched into an excellent fifty-minute lecture on <em>Bhagavad-gītā</em> (3.27). He emphasized the same theme from the morning’s press conference, that the purpose of the Kṛṣṇa consciousness movement is to educate the <em>mūḍhas</em>, the fools and rascals who refuse to accept the supremacy of God.</p>

<p>Prabhupāda explained that God is canvassing, ‘Here I am,’ yet people continue to search for God. The verse itself explained the reason why:<em> ahaṅkāra-vimūḍhātmā</em>, simply due to false egotism.</p>

<p>“Somehow or other we have now this human form of life,” he said. “Kṛṣṇa said that utilize it very nicely so that the problems of life are finished. And that knowledge is very easy. Simply try to understand Kṛṣṇa. That’s all. That will solve. And Kṛṣṇa is explaining Himself, what He is. Where is the difficulty? Unless you make some interpretation foolishly, everything is very clear. So you can understand Kṛṣṇa.</p>

<p>“And if you understand Kṛṣṇa, then result is <em>janma karma ca me divyam evaà yo vetti tattvataḥ/ tyaktvā dehaà punar janma naiti mām eti kaunteya</em>. Where is the difficulty? There is no difficulty.</p>

<p>“Therefore our request is, take to this Kṛṣṇa consciousness. If the foreigners can take to it very seriously, so why not Indians? It is Indians’ knowledge. <em>Bhagavad-gītā</em> was spoken in India. Why you are neglecting it? Why you are not taking advantage? Why you are falsely proud that you are independent? These are our questions.”</p>

<p>Prabhupāda’s straightforward approach appealed to his receptive audience who reciprocated by asking some thoughtful questions. The first was about “isms.” Someone asked, “Is Kṛṣṇa consciousness Hinduism?”</p>

<p>“It is Kṛṣṇaism,” Prabhupāda explained. “Hinduism means a type of faith, or Muslimism is type of faith. But, as it is described in the English dictionary, religion means a kind of faith. It is not that type of religion. It is a compulsory fact. Just like sugar is, compulsorily, must become sweet. If sugar is not sweet, that is not real sugar. Chili is not hot? That is not real chili.</p>

<p>“Similarly, we are part and parcel of Kṛṣṇa. Our duty is to become Kṛṣṇa conscious. There is no question of faith. You may have faith in Hinduism, tomorrow you may have faith in Christianism. Or you may have faith in Christianism, tomorrow in Mohammedan. This kind of faith is not Kṛṣṇa consciousness. Just like laws of the state. It is not that it is meant for the Hindus, or for the Muslims, for the Christian. It is meant for everyone. Similarly, <em>mamaivāàśo jīva bhūtaḥ</em>. We are part and parcel of Kṛṣṇa, so it is compulsory to revive our consciousness that we are part and parcel of Kṛṣṇa. It is not a question of faith. Faith you may accept or do not accept, but here it is a question of ‘must.’ You must revive your Kṛṣṇa consciousness, otherwise you will suffer.”</p>

<p>The second questioner wanted some clarification on the distinction between form and formlessness.</p>

<p>“The personal form and impersonal form, there are two conceptions,” Śrīla Prabhupāda replied. “But Kṛṣṇa explains this, that<em> mayā tatam idaà sarvam jagat avyakta-mūrtinā</em>. <em>Avyaktam</em>, impersonal, that is another form of Kṛṣṇa. So the whole creation is Kṛṣṇa’s expansion of energy, just like the sunshine. Sunshine is also the same quality, heat and light, as the sun-globe or the sun-god. But the sunshine is impersonal, and the sun-globe is localized. And within the sun-globe there is sun-god. So that is the main source of everything. <em>Īśvaraḥ paramaḥ kṛṣṇaḥ sac-cid-ānanda vigrahaḥ</em>.<em>Brahmaṇo aham pratiṣṭhā</em>. Kṛṣṇa is the source of <em>brahmajyoti</em>. So impersonal or personal, whatever you take, that is Brahman. <em>Brahmeti paramātmeti bhagavān iti śabdyate</em>... whatever you take, that is emanation from Kṛṣṇa. But Kṛṣṇa has said, if you want to approach the Absolute Truth through the impersonal form, then it will be little difficult. Perhaps you may not reach the ultimate goal. You may fall down. There are so many instances.</p>

<p>“We have seen in India so many big, big <em>sannyāsīs</em>. They give up this world—<em>brahma satyaà jagan mithyā</em>—but after some days they come down to the <em>jagat</em> and engage themselves in politics. Why? They could not stay in the Brahman stage. That is stated in the <em>Śrīmad-Bhāgavatam</em>. By concentrating on the impersonal form they think that they have become liberated, but actually <em>aviśuddha-buddhayaḥ</em>, the impersonal conception is not purified intelligence. <em>Ye ’nye </em>’<em>ravindākṣa vimukta-māninas</em>. You may think that ‘I have become liberated.’ But it is not. Why? <em>āruhya kṛcchreṇa paraà padaà tataḥ patanty adhah</em>. After so much trouble and austerity, penances, you may acquire a position in impersonal Brahman, but there is chance of falling down from there. <em>Patanty adhah</em>. Why? <em>Anādṛta yuṣmad aṅghrayaḥ</em>. ‘Because they could not find out how to worship Your lotus feet.’ So unless you come to the personal form of the Absolute Truth, there is difficulty and there is chance of falling down.”</p>

<p>A third man said that he considered Christianity and Kṛṣṇa consciousness to be the same. He wanted to know what Prabhupāda had to say about that.</p>

<p>Prabhupāda answered, “Everything is Kṛṣṇa consciousness. It is question of degrees. Suppose Kṛṣṇa is there on the top, and it is one hundred steps. So somebody has covered five steps, somebody has covered ten steps, somebody has covered one hundred steps. Like that. So everyone is searching after Kṛṣṇa, but there are degrees of realization of Kṛṣṇa. Either Christian, Mohammedan, or any, they are searching after Kṛṣṇa. That is all right, but it is a question of degrees, how far they have gone forward. The last stage is <em>sarva-dharmān parityajya mām ekaà śaraṇaà vraja</em>. That is the final stage.”</p>

<p>Another man asked if the Kṛṣṇa consciousness movement was a development of the Gaudiya Matha.</p>

<p>Prabhupāda answered noncommittally. “No, Kṛṣṇa consciousness is there in the <em>Bhagavad-gītā</em>. It is nobody’s property. It is Kṛṣṇa’s instruction.”</p>

<p>The next question caused a stir in the audience. Without being outright offensive, a man clearly tried to challenge Śrīla Prabhupāda’s own qualifications. “Swamijī, what is the color of Kṛṣṇa? It is blue or black? Not according to <em>śāstra</em>, but your experience.”</p>

<p>Prabhupāda delighted everyone with his reply. “So, if you kindly advance in Kṛṣṇa consciousness, then you will understand.”</p>

<p>Amidst loud applause and laughter he took the next couple of enquiries and then another challenge. A man wanted to know why the Kṛṣṇa consciousness movement was popular in the Western countries, but not in India where Kṛṣṇa appeared.</p>

<p>Challenging the accuracy of his statement, Prabhupāda retorted, “It is very popular here also. Otherwise why you have come here?”</p>

<p>Everyone clapped and laughed at his sharp reply, but the man was insistent. “But it is not <em>so</em> popular.”</p>

<p>“Kṛṣṇa is popular in India very much. Every house, they observe Kṛṣṇa Janmāṣṭamī.”</p>

<p>At the mention of Kṛṣṇa’s birthday the crowd clapped loudly, laughing and applauding as Prabhupāda added a punch line and reversed the implied criticism. “Unfortunately, you are forgetting this. That is the misfortune.”</p>

<p>Another query came from a man who wanted to know how to meditate on Brahman. “But how do we just meditate and get in touch with that Brahman? Is a thing there, a crucial point? Every one of you knows from... ”</p>

<p>Prabhupāda cut in. “Kṛṣṇa does not say that you go everywhere... ”</p>

<p>“But how do we just meditate and get in touch with that Brahman? They say that you just have to meditate, transcendental meditation.”</p>

<p>“No, what <em>they</em> say, I do not know. I know what Kṛṣṇa says, that’s all.”</p>

<p>“Problem is to know... ”</p>

<p>The man’s confusion typically illustrated exactly what Śrīla Prabhupāda was always complaining about, that people hear about Lord Kṛṣṇa from any source other than Kṛṣṇa Himself and His bona fide representatives. They therefore simply become confused.</p>

<p>“Our mission is to present before you what Kṛṣṇa says, that’s all,” Prabhupāda said. “We are not concerned what other says. We are not concerned.”</p>

<p>Prabhupāda’s strong reply stirred the crowd’s appreciation of his fixed position and his refusal to be drawn off on a tangent. Many smiled and nodded at his no-nonsense, authoritative approach. It was exactly what they had come to hear.</p>

<p>“All right, we have taken enough. Now no more. Chant Hare Kṛṣṇa. You join with us.”</p>

<p>Leaving the devotees to finish with a film show and <em>kīrtana</em>, Prabhupāda left via a long arch-covered walkway.</p>

<p>After a short drive back to the house and a chair lift upstairs, he settled comfortably in his room, thoroughly enlivened by the night’s preaching. He called in Harikeśa and had him set up the tape recorder so that he could listen to the playback of his talk.</p>

<p>He grinned and then laughed when it came to the point where he had referred to everyone as <em>mūḍhas</em>. “I have spoken very strongly,” he said, “but still they did not protest. Rather they appreciated, ‘Yes, it is fact.’”</p>

<p>We also appreciated the beauty of Śrīla Prabhupāda’s character. He is so pure and free from malice or envy of others that he can speak with utter candor about people’s faults and call them fools and rascals without anyone taking the least offense. Moreover, his own innocent wonder at how he is able to do this simply increases his charm many times over.</p>', '', '1976-01-01', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- January 2nd, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'January 2nd, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Madras appears a pleasant city, not congested and generally clean and well-managed. On the way to Marina Beach for his morning walk Śrīla Prabhupāda commended the well-kept, attractive buildings and wide beachfront road. The shore itself is a clean, wide, long stretch of sand. Along the shoreline fishing boats, catamarans, and nets were beached in clusters. The sea breeze was refreshing, and the lack of commercialization—coconut sellers, <em>pān</em> merchants, hotels and the like, and even people—made it a pleasant contrast to Bombay’s Juhu Beach. In his usual fashion, Prabhupāda walked up and down the beach for half an hour both ways, engaging us in conversation. He’d stop occasionally to emphasize his points, enjoying the exercise and freshness of sand, sea, and sky.</p>

<p>The <em>sannyāsīs</em> were all present, as were the local devotees and some Life Members. Prabhupāda continued his exposī of modern science, prompting Harikeśa to repeat some of the arguments they have discussed during the past month. Prabhupāda drew the newly arrived Tamal Krishna Mahārāja and other <em>sannyāsīs</em> into the debate.</p>

<p>The sun had risen, its light glinting across the water. Fishermen were repairing their light craft, readying them for another day’s work on the unpredictable Bay of Bengal, while our little group discussed the structure of the universe and the eternal soul’s ability to live in any condition, even within the fiery globe which now so brightly illuminated the entire sky.</p>

<p>After a while Prabhupāda let the subject drop. He walked past a group of mounted police exercising their horses and then back to the pavement. Various statues of well known personalities and some very handsome buildings line the beachfront. A house with Bengali writing on it came into view, attracting Prabhupāda’s attention. It was the former residence of a well known <em>sādhu</em>.</p>

<p>Acyutānanda asked if it had belonged to Swami Vivekananda. Prabhupāda confirmed that after coming back from foreign countries Vivekananda had made his position here in Madras.</p>

<p>Acyutānanda said that a Life Member from Calcutta called Veni Sankara Sharma had written a book titled <em>An Unknown Chapter of the Life of Swami Vivekananda</em>. The book claimed that Vivekānanda smoked a <em>hookah</em> and ate meat.</p>

<p>To this information, Prabhupāda replied, “Yes, that is known to everyone.”</p>

<p>Yaśodānandana knew someone in Hyderabad who used to cook for the Ramakrishna Mission. He told Prabhupāda, “He said they used to cook any kind of meat.”</p>

<p>Acyutānanda said that he had once asked that cook, “Did you ever cook human meat?” The cook had told him, “If they told me, I would have done that also.” Acyutānanda added, “There was nothing beyond their diet.”</p>

<p>The party went on to decipher the Bengali title over the house, identifying it as ‘The House of Vivekananda.’</p>

<p>“They say Swami Vivekananda walked barefoot all over India at some stage of his life. This statue here is his life as a wandering <em>sādhu</em>,” Acyutānanda offered.</p>

<p>But Prabhupāda asked, “Who is a <em>sādhu?</em> Then the question is, who is a <em>sādhu?</em> You cannot say?”</p>

<p>Acyutānanda said, “One who is Kṛṣṇa conscious.”</p>

<p>“Unless one is cent-per-cent Kṛṣṇa conscious, he is not a <em>sādhu</em>,” Prabhupāda said. “<em>Sādhu-bhūṣaṇāḥ</em>. <em>Titikṣavaḥ kāruṇikāḥ suhṛdaḥ sarva-dehinām/ ajāta-śatravaḥ śāntāḥ sādhavaḥ sādhu-bhūṣaṇāḥ</em>. This is <em>sādhu</em>.”</p>

<p>As we approached our vehicles Prabhupāda made a wry comment about the monuments erected along the beachfront. “All statues are crying here!”</p>

<p>Amongst them Acyutānanda Swami picked out another figure of recent prominence. This one was not an Indian but a Western woman, Annie Besant, who converted from Christianity to Hinduism. In the days of the British Raj such a conversion to Hinduism would almost deify the person in the eyes of the ordinary Indians.</p>

<p>Śrīla Prabhupāda remarked sardonically, “They come to be <em>avatāra</em> here. And she also came from Ireland to become <em>avatāra</em> here.”</p>

<p>Acyutānanda Swami explained how she had become interested in the <em>Gītā</em>. “She was Christian, and her infant died. So she asked the priests whether the child’s soul would go to heaven or hell. And why? She felt that the child hadn’t done anything. But she was dissatisfied with their answers. Eventually she heard about transmigration of the soul. Then she became interested in the <em>Gītā</em> and India.”</p>

<p>Prabhupāda asked, “So did she understand?”</p>

<p>Acyutānanda said, “Well, only up to transmigration of the soul.”</p>

<p>“She admits,” Prabhupāda said.</p>

<p>Acyutānanda said, “Yes.”</p>

<p>As we were about to return to our residence, a few gentlemen accompanying us on the walk told Prabhupāda how much they appreciated his practical explanations of spiritual life, although they admitted that sometimes they were difficult to accept. One of them commented candidly, “Two and two will always be four. But we people don’t agree so far.”</p>

<p>Prabhupāda smiled. “Yes. You want five.”</p>

<p>They burst out laughing. “We want five, correct!”</p>

<p>He told them a short story about a grocer’s son who was doing business on his father’s behalf. He was giving change of four rupees instead of the correct amount, five.</p>

<p>So the customer said, “Why you are giving me four rupees?”</p>

<p>The boy pleaded innocence. “No, I do not know what is the exchange.”</p>

<p>So the customer then said, “No, it is six rupees.”</p>

<p>To which the anxious boy replied, “No, my father will be angry!”</p>

<p>Amidst loud laughing Prabhupāda explained, “It means he knows perfectly well what is five rupees, but he is innocent when he was giving four rupees. And when the customer wanted six rupees, ‘No, my father will be angry!’”</p>

<p>He used the anecdote to illustrate the mentality of men who want to comment on the <em>Gītā</em> and other works without accepting the real meaning, adding distortions to suit their own purpose.</p>

<p>“They have created havoc by misinterpreting <em>Bhagavad-gītā</em>, all people,” he said. “According to their wish, ‘Five rupees note means four rupees.’ By imagination. They have created havoc all over the world. Otherwise everything is there. If we take Kṛṣṇa’s instruction, then the whole world becomes immediately happy. But they will not take it. They will manufacture their own: two plus two equal to five or three, not exactly four.”</p>

<p>He advised the men to read his books, especially the new <em>The Nectar of Instruction</em>. When they complained that no books were available at his lecture last night, Prabhupāda was extremely concerned.</p>

<p>Mahāàsa Swami reassured him there had indeed been a book table present and many books were sold.</p>

<p>The men hadn’t seen it, so Śrīla Prabhupāda told the <em>sannyāsīs</em>, “Keep the book table in a prominent place so that others can see. And any book which is not in stock, you can note down his order so that you can send him later on. Recently we have published a very important book, <em>The Nectar of Instruction</em>. For the common man it is very nice.”</p>

<p class="verse">* * *</p>

<p>This morning Mr. Bhai and his wife came upstairs to see Śrīla Prabhupāda after breakfast and requested him to narrate some stories about Kṛṣṇa’s pastimes in Vṛndāvana. They especially wanted to hear about the <em>rasa-līlā</em>, Kṛṣṇa’s intimate activities with the <em>gopīs</em>.</p>

<p>Śrīla Prabhupāda has, of course, often told us that confidential topics may be discussed only with those qualified to hear. For his hosts he made no exception. He excused himself by saying that personally he wasn’t qualified to speak of such things. Despite their persistence, he would not discuss the topic.</p>

<p class="verse">* * *</p>

<p>During Śrīla Prabhupāda’s massage Gurukṛpa Mahārāja talked with Prabhupāda about some problems he was having in Japan. Gurukṛpa and Yaśodānandana Swamis are in charge of the Nāma Haṭṭa <em>saṅkīrtana</em> party, which has been collecting funds in Japan for the development of the Māyāpur project. Trivikrama Swami is also in Japan trying to preach to the local people and establish a permanent temple. Recently the two parties have been engaged in bitter arguments. Although the Nāma Haṭṭa party has raised large amounts of funds for Māyāpur, there has also been some bad publicity, and Trivikrama Swami felt that some of the men were not behaving properly.</p>

<p>Gurukṛpa Mahārāja didn’t appreciate Trivikrama’s criticism, and he asked Prabhupāda if Trivikrama could be transferred to another preaching field. Prabhupāda will not allow it. He told him he wanted them to work cooperatively and not fight.</p>

<p>Although Śrīla Prabhupāda was clearly reserved in his attitude, Gurukṛpa Swami stuck to his position, and tried to minimize his own mistakes. Śrīla Prabhupāda dealt with him with care and respect, but held firm to his decision that they must work cooperatively. He wants them to put aside personal differences to advance the cause of Caitanya Mahāprabhu’s <em>saṅkīrtana</em> movement.</p>

<p>Gurukṛpa Mahārāja left later in the day for Calcutta. He and a few men will return to Japan shortly, to resume collecting for Māyāpur.</p>

<p class="verse">* * *</p>

<p>This evening’s program was again an extremely successful one. The guest of honor was the Chief Justice of Madras. The Justice gave an introductory speech in which he described how modern materialistic life results in ultimate suffering. He made some good points, but his talk was also riddled with philosophical misunderstanding. Nevertheless, he was polite and respectful.</p>

<p>Prabhupāda didn’t correct him directly, but in the course of his lecture redressed his mistaken ideas.</p>

<p>The full house listened attentively as Śrīla Prabhupāda delivered another lengthy and erudite discourse, from one of his favorite sections of <em>Śrīmad-Bhāgavatam</em>, the <em>bhāgavata-dharma</em> instructions of Prahlāda Mahārāja to his school friends.</p>

<p>Again he repeatedly stressed the necessity of hearing from authorized sources in order to properly understand what is real <em>dharma</em>. He firmly established that <em>dharma</em> means three things—to know Kṛṣṇa, to act in relationship to Kṛṣṇa, and finally to achieve the goal of going back to Kṛṣṇa, back to Godhead.</p>

<p>To loud applause Prabhupāda asked for questions, and there was no shortage of enquiries. With Acyutānanda Swami acting as the moderator, he answered them all to everyone’s full satisfaction.</p>

<p>Acyutānanda Mahārāja repeated the first question. “This is a world of <em>śakti</em>, or energy. There is a worldwide rise in the prices of energy resources, like oil, coal, gas, and electricity. This means there is a depletion of these energy resources. Naturally, there will be worldwide destruction of mankind and other living beings and materials in the near future. What are your views?”</p>

<p>Prabhupāda offered a new angle on the subject, and everyone clapped as they appreciated his ability to link everything sensibly and practically to the central purpose of life.</p>

<p>“Yes,” he said, “these material things, they are energies. That is described in the <em>Bhagavad-gītā: bhūmir āpo ’nalo vāyuḥ khaà mano buddhir eva ca</em>; <em>bhinnā prakṛtir aṣṭadhā</em>. The petrol is also another form of Kṛṣṇa’s energy. <em>Parasya śaktir vividhaiva śrūyate</em>. There are many millions of energies. <em>Na tasya kāryaà karaṇaà ca vidyate</em>. Kṛṣṇa has nothing to do because everything is being done by His energy. Although He is the ultimate source of everything, He is doing everything by His energy, and it appears that it is being automatically done. It is not automatically done. It is done by Kṛṣṇa’s energy. So this material energy is also Kṛṣṇa’s energy. It is not a different energy. Petrol is liquid thing, so <em>āpa</em>. So it is Kṛṣṇa’s energies. Our Vaiṣṇava philosophy is that Kṛṣṇa’s energies should be utilized for Kṛṣṇa. This is Kṛṣṇa consciousness. So everything can be utilized for service of Kṛṣṇa. When you use this petrol for spreading Kṛṣṇa consciousness, if we can use 1,000 or 100,000 motor cars using petrol for spreading Kṛṣṇa consciousness, that is the proper utilization of petrol.”</p>

<p>Acyutānanda repeated a lady’s question. “Kṛṣṇa says to perform your <em>svadharma</em>. So how does one know what is his <em>svadharma?</em>”</p>

<p>“That is <em>svadharma</em> when Kṛṣṇa says, ‘You surrender unto Me.’ That is your <em>svadharma</em>. Because you are part and parcel of Kṛṣṇa, your business is to serve Kṛṣṇa. Just like this finger is part and parcel of my body. So I say, ‘Finger, please come here,’ he immediately comes. This is the normal condition of the finger. Similarly, if you are really healthy, in normal condition, then you must be ready to serve Kṛṣṇa. That is your <em>svadharma</em>.” Prabhupāda’s example was simple but lucid, and again the alert audience clapped to show that they understood.</p>

<p>A man, obviously a pantheist, was next. “There are many incarnations, including Kṛṣṇa. So Kṛṣṇa gave <em>Bhagavad-gītā</em>. That doesn’t mean that the author has not given all the gods, whether including Kṛṣṇa... ”</p>

<p>Prabhupāda cut in. “So that I have already explained, that incarnation—whose incarnation? The question will be, <em>whose</em> incarnation?”</p>

<p>“God. God.”</p>

<p>“God’s. So that God is Kṛṣṇa. You do not know that. Now learn it.”</p>

<p>“Is not Rāma a God?”</p>

<p>“Yes. Incarnation means <em>somebody’s</em> incarnation. So who is that somebody? That is Kṛṣṇa. That’s all. If you do not know it, you understand now.”</p>

<p>Acyutānanda Mahārāja took one last question. “Is it necessary that a person should pass through the three <em>āśramas</em>—<em>brahmacārī</em>, <em>gṛhastha</em>, <em>vānaprastha</em>—before coming to <em>sannyāsa</em>?”</p>

<p>Prabhupāda answered, “That is the normal rules and regulation, that especially <em>brāhmaṇa</em>, he must go through the four <em>āśramas</em>. First of all become <em>brahmacārī</em>, then <em>gṛhastha</em>, then <em>vānaprastha</em>, then take <em>sannyāsa</em>. This is for the <em>brāhmaṇas</em>. And for the <em>kṣatriyas</em>: <em>brahmacārī</em>, <em>gṛhastha</em>, and <em>vānaprastha</em>. And for the <em>vaiśyas</em>: <em>brahmacārī</em>, <em>gṛhastha</em>. And for the <em>śūdras</em>: only <em>gṛhastha</em>. This is the process. This is normal process. But either one is <em>brāhmaṇa</em> or <em>kṣatriya</em> or <em>vaiśya</em> or <em>śūdra</em>, if he takes to Kṛṣṇa consciousness he becomes above these rules and regulations.”</p>

<p>Śrīla Prabhupāda’s comments were deeply appreciated by his audience, because here in Madras, possibly more so than any place in India, the government is making a systematic attempt to dismantle the old caste system. However, their efforts to establish a more equitable society have often resulted in reverse discrimination against the caste <em>brāhmaṇas</em>.</p>

<p>Prabhupāda is probably the first person to show them a true platform of equal dealings for all without disturbing the social balance.</p>

<p>As they clapped he continued. “Yes; <em>māà ca yo ’vyabhicāreṇa bhakti-yogena sevate/ sa guṇān samatītyaitān brahma-bhūyāya kalpate</em>. So this Kṛṣṇa consciousness movement is that it is giving immediate lift to everyone to come to the transcendental platform, <em>brahma-bhūyāya kalpate</em>. But general state is <em>varṇāśrama-dharma</em>.</p>

<p>“Therefore Śrī Caitanya Mahāprabhu, when He was discussing with Rāmānanda Rāya, He first of all said, ‘What is the aim of life?’</p>

<p>“So Rāmānanda Rāya replied that ‘First of all to begin this <em>varṇāśrama-dharma</em>.’</p>

<p>“So Caitanya Mahāprabhu said, ‘Yes, this is all right. But this is external. If you know something better, please tell me.’</p>

<p>“So in this way, step by step everything was described by Rāmānanda Rāya, and Caitanya Mahāprabhu did not reject it. He said, ‘It is all right, but if you know something better...’ Then at last, when Rāmānanda said, quoting one verse from <em>Śrīmad-Bhāgavatam</em>, <em>sthāne sthitāḥ śruti-gatāà tanu-vāṅ-manobhir</em>, that it doesn’t matter what you are, you remain in your post. <em>Sthāne sthitāḥ śruti-gatāà</em>. Through aural reception if you hear about Kṛṣṇa, then you become perfect. That is the statement.</p>

<p>“So this is required at the present moment, that you remain whatever you are, either <em>brāhmaṇa</em>, <em>kṣatriya</em>, <em>vaiśya</em>, <em>śūdra</em>, Englishman, Indian—it doesn’t matter. You try to understand Kṛṣṇa, that’s all. If you do that, then everything will be perfect.</p>

<p>“That can be very easily done by chanting the Hare Kṛṣṇa <em>mantra</em>. Therefore Caitanya Mahāprabhu has given this <em>mantra</em>—it is from <em>śāstra</em>-<em>-harer nāma harer nāma harer nāmaiva kevalam, kalau nāsty eva nāsty eva</em>. In this age, in Kali-yuga, it is very difficult to bring back the fallen population again to the standard of <em>brāhmaṇa</em>, <em>kṣatriya</em>, <em>vaiśya</em>. It is practically lost now. The best thing is that all of them combined together, <em>brāhmaṇa</em>, <em>kṣatriya</em>, <em>vaiśya</em>, <em>śūdra</em>, or even less than <em>śūdra</em>, <em>kirāta-hūṇāndhra-pulinda-pulkaśā</em>, take to this process of chanting and hearing of the Lord’s name. Everything will be all right.</p>

<p>“It is confirmed by Caitanya Mahāprabhu when he was discussing with Rāmānanda Rāya. He was a governor of this Madras province under the regime of Mahārāja Pratāparudra of Orissa. And he was politician, but he was a very learned scholar in Kṛṣṇa science. Therefore Caitanya Mahāprabhu was talking with him. He was a <em>śūdra</em> by birth, and Caitanya Mahāprabhu was not only very exalted position, <em>brāhmaṇa</em> and <em>sannyāsī; </em>so Caitanya Mahāprabhu was questioning and he was answering. He felt little hesitation, that ‘Sir, You are so exalted. I am a <em>gṛhastha</em> and a politician, and how can I?... ’</p>

<p>“Immediately Caitanya Mahāprabhu encouraged him, ‘No, no, no, don’t hesitate! <em>Kibā śūdra kibā vipra nyāsī kene naya, yei kṛṣṇa-tattva-vettā sei ‘guru’ haya</em>.’ He said, ‘Don’t hesitate!’</p>

<p>“It doesn’t matter whether he is a <em>gṛhastha</em> or <em>sannyāsī</em>, <em>brāhmaṇa</em> or <em>śūdra</em>. If he knows Kṛṣṇa, he is guru. He is guru. That is wanted. We are teaching that Kṛṣṇa consciousness.”</p>

<p>Śrīla Prabhupāda brought his part of the program to a successful close. It was the final day, and everyone stood out of respect and appreciation as he made his way to the car.</p>

<p>On the way back to Mr. Bhai’s house Prabhupāda said he was happy to find the people of Madras eager to hear spiritual instruction. Both the arrangements and the response have pleased him.</p>', '', '1976-01-02', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


END $$;
