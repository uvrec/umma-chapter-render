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


  -- December 4th, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'December 4th, 1975',
    '', '', '', '',
    '', '', '', '',
    E'<p>On the walk this morning Akṣayānanda Swami told Śrīla Prabhupāda that people sometimes ask his opinion about a local <em>bābājī</em> who is building a big temple on the Vṛndāvana-Mathurā road. Looking across the fields we could see it in the far distance. An unfinished edifice as yet, it is reported that it will house various deities in its lower chambers and the <em>bābājī</em>’s personal quarters on top. This man is well known for smoking large quantities of cigarettes, thus earning him the nickname “Pagal Baba.” <em>Pagal</em> means “crazy.” Akṣayānanda said that he answers people’s queries by explaining that our Guru Mahārāja does not approve of us smoking cigarettes.</p>

<p>Invariably they say, “But Pagal Baba smokes.”</p>

<p>Akṣayānanda then responds, “Ah, that’s because he is <em>pagal!</em>” And they agree. Prabhupāda also agreed. He said that our four regulative principles will expose so many persons as frauds.</p>

<p>This led into a lively discussion about the sometimes confusing difference between following in the footsteps of great personalities and imitating them. Akṣayānanda Mahārāja said that many people eat meat because they claim that Lord Rāmacandra did.</p>

<p>Prabhupāda quickly fired back, “Lord Rāmacandra can eat you and the whole universe! Can you do that?” We all laughed. A few words from Prabhupāda exposes the rascals.</p>

<p>As we walked along in the early morning sunshine he clearly defined the difference between Lord Rāma and the ordinary living beings. Then as a final thought he pointed out that Lord Rāmacandra is not offered meat in any temple. So why should anyone claim that because the Lord ate meat, therefore he can? He explained that Kṛṣṇa also ate the Khāṇḍava fire, but He doesn’t say to offer Him fire. He says a little fruit, a flower, some water.</p>

<p>Prabhupāda is expert at exposing the faulty logic of the unscrupulous, who try to justify their lust by misconstruing <em>śāstra</em> and the activities of others with whom they cannot compare. He doesn’t take the short and easy route to defeat them. Rather than say simply that Lord Rāmacandra never ate meat, he chose to explain the more difficult to grasp, but ultimately more relevant, point that there is a vast difference between the incarnations of the Lord and ordinary men. Therefore They should not be imitated, but instead Their instructions followed.</p>

<p class="verse">* * *</p>

<p>Class was very interesting, with Prabhupāda continuing with the second verse from Prahlāda’s instructions to his school friends. After chanting the Sanskrit, Harikeśa read out the as yet unedited translation. “In this human form of life there is chance to go back to home, back to Godhead. Therefore every living entity, especially in this human form of life, must be engaged in devotional service. This devotional service is natural because Lord Viṣṇu, the Supreme Personality of Godhead, the master of the soul, the Supersoul, is the most beloved being of all other living beings.”</p>

<p>Prabhupāda explained that the Vedic literature describes three stages of spiritual development: <em>sambandha</em>—to know our relationship with the Lord, <em>abhidheya</em>—to act accordingly, and <em>prayojana</em>—to attain the purpose for which we establish our relationship. <em>Sambandha-jṣāna</em> means that first we must understand our relationship with God. Without knowing our relationship we cannot act, even on the material platform. He gave several pertinent examples to show how a sense of relationship motivates a person to act. Similarly, unless we know our relationship with God why would we want to serve Him?</p>

<p>Śrīla Prabhupāda also emphasized the need for proper <em>gurukula</em> education. Construction of the <em>gurukula</em> is now underway here in Vṛndāvana, and Prabhupāda has high expectations for it. He said every child should be trained in the principles of <em>bhāgavata-dharma</em>.</p>

<p>“This should be taught to the children. Otherwise when he is engaged in so many nonsense service it will be very difficult to drag him from this false engagement and again establish him in Kṛṣṇa’s service. So when we are children we are not polluted; we should be trained up in <em>bhāgavata-dharma</em>. That is Prahlāda Mahārāja’s subject matter. We are serving. The birds are serving. They have got small kiddies, children. They are picking up food and working very hard and bringing it in the mouth. And the small kiddies, they are chanting, ‘Mother, mother, give me, give me,’ and eat food. There is service. Don’t think that anyone is without service. Everyone is serving. A man is working hard day and night. Why? To give service to the family, to the children, to the wife. The service is going on, but he does not know where to give service. Therefore Kṛṣṇa said, ‘Give Me service. You’ll be happy.’ This is this philosophy, <em>bhāgavata-dharma</em>. Thank you very much.”</p>

<p class="verse">* * *</p>

<p>When Prabhupāda returned to his rooms he sat for a few minutes before breakfast, talking about the unfortunate state of the world. Hansadūta and I sat before him. Prabhupāda relaxed, leaning back against the soft bolsters on his seat. He delivered a sharp critique of the leaders of society, the politicians and educators, for misleading people and creating a thoroughly hellish situation for everyone.</p>

<p>He explained how the entire world is becoming increasingly chaotic and demonic, causing suffering to people. He searched for an appropriate word to summarize it. “They have made it a pan...What is that?”</p>

<p>We couldn’t figure out the word he was looking for.</p>

<p>“<em>Pandemonium!</em> Just look it up.”</p>

<p>Prabhupāda’s choice of words seemed a bit quaint to me, but when I read out the definition of pandemonium in the dictionary, I saw that Prabhupāda had used precisely the correct word to convey his point. It said, “Pandemonium: pan-demonic; abode of all demons; any place of lawlessness, violence and uproar; utter confusion.”</p>

<p>We all laughed and Hansadūta and I looked at each other appreciatively. Prabhupāda has a surprising command of the English language. Day by day new aspects of his extraordinary character are revealed, and we are extremely grateful that Kṛṣṇa has sent us such a wonderful spiritual master.</p>

<p class="verse">* * *</p>

<p>After lunch Śrīla Prabhupāda went upstairs to take rest, which is his usual routine. Today he had me put his bed, a simple wood-framed cot crisscrossed with thick, wide, cotton strapping and covered with a thin mattress and sheet, outside on the front terrace of his room. He slept peacefully in the sunshine, with the domes of Krishna-Balaram Mandir towering above, benign and protective.</p>

<p>I remained in the small room on the roof. Feeling a little tired, I sat on the edge of what I thought was a spare wood-base bed in one corner of the room. As one of the guest house beds with a sponge mattress, it did not appear that Śrīla Prabhupāda had ever used it. The next thing I knew, Śrīla Prabhupāda was waking me up. Rising after his nap, he had come through the door to find me sound asleep on the bed. He gave me a gentle shake, and I jumped up quite embarrassed and apologetic.</p>

<p>Prabhupāda wasn’t annoyed, but he did comment very kindly, “If you are fatigued, that is all right. You can rest on a mat on the floor, but whatever is the spiritual master’s should never be used.”</p>

<p>Moving over to sit at his desk he asked, “So, what is your name?” Certainly he must have already heard it many times over the last few days, so perhaps it was his way of making me feel more comfortable. It relieved my embarrassment, making me feel that he is getting to know me on a more personal basis.</p>

<p>“‘Arry Sawry, Śrīla Prabhupāda,” I said in my broad Northern English brogue.</p>

<p>“Haree Showree,” Prabhupāda corrected in his elegant Bengali accent. Giving me a warm smile he asked for some water.</p>', '', '1975-12-04', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- December 5th, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'December 5th, 1975',
    '', '', '', '',
    '', '', '', '',
    E'<p>It is hard to say when Prabhupāda’s day begins and when it ends, because he never seems to conclude his activities in the way we do. He only rests for a few hours each day, and even that is intermittent.</p>

<p>Śrīla Prabhupāda maintains a remarkably regulated daily routine. While here in Vṛndāvana his schedule is:</p>

<p>6:00 a.m.—Wash, brush teeth, and take Āyurvedic medicine.</p>

<p>6:30–7:30 a.m. —Morning walk.</p>

<p>7:30–8:30 a.m. —Greet the Deities, <em>guru-pūjā</em>, then <em>Śrīmad-Bhāgavatam</em> lecture from the Seventh Canto.</p>

<p>9:00–9:30 a.m. —Breakfast of fruits and <em>chīra</em>.</p>

<p>9:45–11:15 a.m.—Rest on roof for an hour and then meet people (usually by appointment).</p>

<p>11:15–1:15 p.m.—Massage with oil.</p>

<p>1:15–1:45 p.m. —Bathe.</p>

<p>1:45–2:30 p.m. —Lunch <em>prasādam</em>.</p>

<p>2:30–3:00 p.m. —Sit in room or chant <em>japa</em>.</p>

<p>3:00–4:00 p.m. —Rest.</p>

<p>4:00–5:00 p.m. —Meet with specific people or devotees, or chant.</p>

<p>5:00–6:30 p.m. —Give public <em>darśana</em>.</p>

<p>6:30–9:30 p.m. —Meet public or senior devotees, GBC business or just chat.</p>

<p>9:30 p.m.—Take hot milk, massage and rest.</p>

<p>12:00–1:00 a.m.—Rise and translate.</p>

<p>5:00 a.m.—Light rest or <em>japa</em>.</p>

<p>Śrīla Prabhupāda’s typical routine goes something like today.</p>

<p>After his all-night translation work he stopped at <em>maṅgala</em>-<em>ārati</em> time and lay back against the bolsters with his feet up. He slept lightly for a short time.</p>

<p>At six o’clock he went into the bathroom to wash, brush his teeth, and freshen up. He came back and sat for a few minutes as he put on <em>tilaka</em>. When that was completed, he took a reddish Āyurvedic medicinal pellet called Yogendra-rasa. After I had crushed it with a large, roasted cardamom seed and then mixed it with honey in a small oval mortar, he added a little water. He drank the mixture straight from the mortar, scraping up the residue with the pestle, which he then deposited on his tongue with an elegant twist of his fingers.</p>

<p>Then Prabhupāda prepared to leave for his morning walk. Getting up from his desk he stood patiently as I helped him on first with his <em>uttarīya</em> (the saffron top-piece traditionally worn by all <em>sannyāsīs</em>) then with his heavy saffron-colored coat and his woollen hat. I finally hung his bead bag around his neck. All the while he conversed with Hansadūta, Akṣayānanda Swami, and Gopāla Kṛṣṇa.</p>

<p>As he walked toward the door, I rushed ahead to place his cane directly into his hand. I then positioned his shoes so that he could step into them and out of his slippers in one easy movement, all while I was holding the door open. It is somewhat of an art to manage all this without delaying or interrupting Prabhupāda’s steady progress out.</p>

<p>The expectant devotees waiting outside enthusiastically shouted, “<em>Jaya</em> Śrīla Prabhupāda!” as he appeared, offering their obeisances and a garland.</p>

<p>Smiling and modest, he returned their greeting with “<em>Jaya! </em>Hare Kṛṣṇa!” The privileged few who went on the day’s walk gathered closely around him as he made his way up the side of the temple and out the front gate onto Chattikara Road.</p>

<p>Heading west into the countryside beyond the boundary of Vṛndāvana village we walked for exactly half an hour, as far as a solitary house named “Moda Place,” and then back. Prabhupāda’s gait is surprisingly swift and strong, and by the end we were struggling to keep up.</p>

<p>At precisely seven thirty he entered the temple from the side door and waited patiently as the <em>pūjārīs</em> strained to swing back the immense wooden doors on each of the three altars. The conch shells trumpeted their call to the faithful, announcing the imminent appearance of the Deities. The curtains drew back, and the Govindam prayers boomed over the loudspeaker. Śrīla Prabhupāda, followed by all the devotees, offered his prostrate obeisances first to his Guru Mahārāja, Śrīla Bhaktisiddhānta Sarasvatī, and Their Lordships Śrī Śrī Gaura-Nitāi, then to the two moon-like brothers Śrī Śrī Kṛṣṇa-Balarāma, and finally to the brilliant forms of Śrī Śrī Rādhā-Śyāmasundara.</p>

<p>After taking a little <em>caraṇāmṛta</em>, Prabhupāda walked across the black-and-white checkered marble floor and mounted the steps to his carved marble <em>vyāsāsana</em>. As he sat flanked by ornamental lions, the devotees offered <em>guru-pūjā</em>. Chanting the prayers “<em>śrī guru caraṇa padma</em>...,” each devotee came forward to offer a flower to his lotus feet and bow before him. Everyone relished this opportunity to glorify Śrīla Prabhupāda in person. It is a daily act of humble submission, an affirmation of our full commitment to his service and a reminder to our flickering minds that without him we are nothing.</p>

<p>As the <em>kīrtana</em> ended, Harikeśa moved forward to swing the microphone around in front of Prabhupāda’s mouth. Prabhupāda’s voice rang out over the loudspeakers, “<em>Jaya oà viṣṇupāda paramahaàsa parivrājakācārya aṣṭottara-śata śrī śrīmad bhaktisiddhānta sarasvatī gosvāmī mahārāja prabhupāda ki jaya!</em>”</p>

<p>The devotees bowed their heads to the ground in obeisance to the disciplic succession, the Paṣca-tattva, the holy <em>dhāmas</em>, the Vaiṣṇavas, and all the assembled devotees.</p>

<p>Then Harikeśa passed Prabhupāda his <em>karatālas</em>. We sat down to listen and respond to Prabhupāda’s sweet and melodious voice as he glorified Śrī Śrī Rādhā-Mādhava:</p>

<p>“<em>Jaya ra–dha ma–dha–vuhhh, kunjavi ha–ri, </em></p>

<p><em>gopī janabal–la–bhaa girivaradha–ri; </em></p>

<p><em>jasodanandana brajajana ranjana, </em></p>

<p><em>jamuna tii–raaa banacaa–ri.</em>”</p>

<p>His eyes closed in concentration, his face showing the intensity of his meditation on the objects of his love and worship in the groves of Vṛndāvana on the banks of the Yamunā river. He infused new meaning and freshness into the song, though he sings it every day before class. His brass <em>karatālas</em> rang out, quickening the pace, and the devotees’ voices swelled in response. Just as it came to a heart-filling crescendo, the <em>karatālas</em> gave their final three metallic rings, “dung dung dung,” and everyone knelt with their heads to the floor as Prabhupāda recited the <em>prema-dhvāṇī</em>prayers again.</p>

<p>Harikeśa jumped up again, removed Prabhupāda’s <em>karatālas</em>, and quickly hung a small microphone around his neck, the other end of which he connected via a two-way switch to the large reel-to-reel Uher tape recorder that he had carried since the morning walk. He handed Śrīla Prabhupāda the <em>Bhāgavatam</em>, an Indian Sanskrit edition containing the commentaries of different <em>ācāryas</em> that Prabhupāda uses for his evening translation work, already opened to the proper page. He carefully slipped Prabhupāda’s spectacles onto him.</p>

<p>Then Harikeśa sat to lead the devotees in responsive chanting of the Sanskrit verse, loudly reciting the translation before Śrīla Prabhupāda began his lecture. “Prahlāda Mahārāja continued to speak: My dear friends born of demonic families, the happiness which is perceived with reference to the senses can be obtained in any form of life according to one’s past fruitive activities. Such happiness is automatically obtained, as sometimes we obtain distress without any endeavor.”</p>

<p>Harikeśa also wore a neck microphone plugged into the same small box with the two-way switch as Prabhupāda’s. He recorded himself and then threw the switch to record Śrīla Prabhupāda.</p>

<p>Prabhupāda read out the verse: “<em>sukham aindriyakaà daityā deha-yogena dehinām/ sarvatra labhyate daivād yathā duḥkham ayatnataḥ</em>.”</p>

<p>Sometimes speaking with his eyes closed in complete concentration and sometimes opening them, surveying his audience, he propounded the ancient philosophy of the <em>Śrīmad-Bhāgavatam</em> in the modern context. He quoted other Sanskrit verses profusely, cross-referencing each point with other works, such as the <em>Bhagavad-gītā</em> and the <em>Purāṇas</em> or the <em>Upaniṣads</em>. His explanations are always clear and potent. Śrīla Prabhupāda is amazingly skilled at conveying the most profound and complex philosophical concepts in a way that anyone can easily understand and apply. Having grasped the very essence of life, its meaning and purpose, he can present it for the understanding of both ordinary people and intellectuals.</p>

<p>Punctuating his lecture with analogies and vivid practical examples, he told a story to illustrate that the sense of material enjoyment is the same for all living beings, whether dog, hog, or human being. “There was a prostitute called Lakśahīra, whose charge was one <em>lakh</em> of pieces of diamond. It doesn’t matter, a big diamond or a small diamond; that was her charge. So one man was suffering from leprosy, and he was assisted by his wife, a very faithful wife. So still he was morose. The wife asked the husband, ‘Why you are morose? I am giving you so much service. You are leper, you cannot move. I take you on a basket and carry you. Still you feel unhappy?’</p>

<p>“So he admitted, ‘Yes.’</p>

<p>“‘Oh, what is the cause?’</p>

<p>“‘I want to go to the prostitute Lakśahīra.’</p>

<p>“Just see! He is leper, a poor man, and he is aspiring to have a prostitute who charges one hundred thousand pieces of diamond. So anyway, she was a faithful wife. She wanted to satisfy her husband. Some way or another she arranged. Then when the leper was at the house of the prostitute, the prostitute gave him very nice dishes of food, but everything in two dishes; everything—one in the golden pot and one in the iron pot.</p>

<p>“So while he was eating, he asked the prostitute, ‘Why you have given me in two pots?’</p>

<p>“‘Because I want to know whether you will feel different taste in different pots.’</p>

<p>“So he said, ‘No. I don’t find any difference of taste. The soup in the golden pot, the soup in the iron pot, the taste is the same.’</p>

<p>“‘Then why you have come here?’”</p>

<p>In the same way, Prabhupāda explained about distress. “If a man is a millionaire he still suffers the same distress from typhoid fever as a poor man. Happiness and unhappiness are the same in different pots. This is knowledge.”</p>

<p>From these simple stories he derived a profound conclusion. “This is foolishness. The whole world is going on like that. They are simply trying to taste the same thing in different pot. That’s all. They are not detestful, ‘No sir, I have tasted enough.’ That is called <em>vairāgya-vidyā</em>—no more tasting. ‘It is all the same, either I take in this pot or in that pot.’ Therefore it is said, <em>sukham aindriyakaà</em>, the sense pleasure, whether you enjoy as a dog or a human being or a demigod or as a European or as an American or an Indian—the taste is the same. This is very important. You cannot have a better taste. Better taste is only Kṛṣṇa consciousness. It doesn’t matter in which pot I am in at the present moment. <em>Ahaituky apratihatā</em>. You can taste Kṛṣṇa consciousness without any hesitation, without any check, and without any hindrance.”</p>

<p>After half an hour he brought the class to an end. The devotees shouted, “<em>Jaya</em>, Śrīla Prabhupāda! Śrīla Prabhupāda<em> ki jaya!</em>”</p>

<p>Again Harikeśa sprang into action, deftly removing Śrīla Prabhupāda’s spectacles, the microphone from his neck, the <em>Bhāgavatam</em>, and handing him his cane, all as he stepped down from the <em>vyāsāsana</em> to go out the door.</p>

<p>At the top of the steps leading out onto the path, I waited with his shoes. Slipping into them, Śrīla Prabhupāda walked the hundred yards past the temple, towards the guest house. The devotees followed, dancing and chanting, “<em>Jaya</em> Prabhu-pāda, <em>jaya</em> Prabhu-pāda, <em>jaya</em> Prabhu-pāda, <em>jaya</em>Prabhu-pāda!”</p>

<p>Śrīla Prabhupāda passed through the open veranda into the small secretary’s room and through the door on the right into his sitting room. This is the room that Prabhupāda uses for both giving <em>darśana</em> and working. He propped his cane in the corner next to the door and then slipped out of his outdoor shoes into his slippers. (Prabhupāda never walks barefoot, even inside.) I helped to remove his coat and hat.</p>

<p>Prabhupāda sat for a few minutes looking outside, through the three tall, narrow windows barred with ornamental grill work, into the small <em>tulasī</em> garden with the solitary tree. Surveying his room, he glanced appreciatively at the large shelves displaying copies of his translations of <em>Śrīmad-Bhāgavatam</em> and <em>Caitanya-caritāmṛta</em>. He requested that we hang his flower garlands on the various beautiful original oil paintings or the photos of Deities and devotees adorning the walls. The garlands were to be left hanging until dry and then removed. He has complained that in the past the devotees cleaning his room have unnecessarily removed the garlands while still fresh.</p>

<p>As soon as his breakfast was served he walked through the other door to his <em>prasādam</em> room. He sat on a seat behind one of the two low wooden tables called <em>choṇkis</em>. On his <em>choṇki</em> was a silver water tumbler, a packet of toothpicks, and a small hand bell to summon his servant, should he want anything else. From this seat Prabhupāda can look over the small back veranda into his enclosed garden. The original painting of Kṛṣṇa taking <em>prasādam</em> in the company of His friends, used for the cover of the first <em>Hare Kṛṣṇa Cookbook</em>, smiled down on Prabhupāda as he took his meal.</p>

<p>Kiśorī dāsī and other ladies prepared Prabhupāda’s breakfast. It consisted of various cut fruits: seedless grapes, guava, banana, orange, pomegranate, and whatever else was freshly available at the market. With this he had a small bowl of fried <em>chīra</em> (flattened rice mixed with peas), another of fried cashew nuts, and a small piece of <em>sandeśa</em> milk sweet. One item is vital to Prabhupāda’s breakfast: ginger soaked in lemon juice. He won’t start breakfast without it, as it stimulates his digestion.</p>

<p>Śrīla Prabhupāda ate little and very slowly, as an act of devotion: <em>prasāda-seva</em>, service, rather than indulging the tongue. When he finished, I cleared his plate and wiped the table as he sat and cleaned his teeth. It surprised me to see that his teeth moved apart when he inserted the wooden pick, but Prabhupāda just laughed about it.</p>

<p>When he finished he held out his open palm for me to tip a little <em>Bhaskar Lavan</em>, an Āyurvedic digestive powder, into. Tilting his head back, he dropped in the powder. Then still maintaining the pose, he poured in some water from the tumbler without touching it to his lips. After washing his mouth and hands in the bathroom he returned to his <em>darśana</em> room.</p>

<p>Sometimes, Prabhupāda sits in his <em>darśana</em> room after breakfast and chats with his servants for a few minutes, usually commenting on the present state of the world. These moments are especially sweet—to be with Prabhupāda as he sits, relaxed and casual, basking in the warmth of his intimate association.</p>

<p>This morning was particularly memorable. The sun was shining brightly through the tall and narrow windows, casting patches of dazzling light on the clean, white sheets on the floor. He sat comfortably in the middle, his legs crossed, right ankle resting on the left knee. His fingers loosely intertwined, he closed his eyes briefly and enjoyed the warmth of the sun as it danced upon his golden form. Seeing the opportunity, Hansadūta, Harikeśa, and I sat on either side of him, just happy to be with him in a quiet moment. He began to reflect on the unfortunate state of the world’s inhabitants. He explained that due to a lack of knowledge about the Supreme Lord people are suffering. Under the false impression of being independent they commit all kinds of sinful acts, not knowing and not caring for the results, foolishly thinking they are free to do as they like. But when the volume of sinful life becomes too great they suffer the consequences in the form of pestilence or war. They think that by politics and meetings they can avoid such things, but that is not possible. They are helpless to prevent them, and therefore they receive their punishment through the three-fold miseries of life. At just the right moment, nature brings the demons together and engages them in war.</p>

<p>To illustrate the point, he gave an amusing but striking example of how <em>māyā</em> works. “In my young days we had one teacher. Whenever there was any misbehavior between the boys, the teacher would stop them and bring them out to the front of the class. He would make them stand face-to-face and each take hold of the ears of the other and on his order make them pull. So the one, he is pulling, and the other is hurting, so he pulls back even harder, and each one is pulling and crying. But they cannot let go because the teacher is ordering, ‘No, you cannot stop. You must go on pulling!’ Similarly, <em>māyā</em> brings together one Churchill and one Hitler. ‘Now, rascal, pull!’ And neither can stop. And the foolish people glorify them.”</p>

<p>The thought of the scene so humored him that even before he finished he began to laugh heartily. His shoulders and belly shook, and his brilliant teeth flashed like pearls in the sun. When Prabhupāda smiles the entire room, even the universe, seems to light up. It’s a Vaikuṇṭha smile that spreads transcendental effulgence everywhere around. Prabhupāda’s mood was so open and congenial it seemed, if just for a moment, that we had joined a picnic with Kṛṣṇa and His cowherd boyfriends, joking and laughing in the forests of Goloka. We laughed with him, glancing at each other in appreciation and wonder as to who this extraordinary personality Śrīla Prabhupāda really is. He is far beyond our comprehension, yet we feel ourselves extremely fortunate to share these intimate moments with him.</p>

<p>It was an entrancing moment, and it occurred to me that Śrīla Prabhupāda must have many friends in the spiritual world with whom he can eternally enjoy happy and carefree days. Yet being extraordinarily merciful he chooses to be here among us. Although the most exalted personality, he appears to like nothing better than to be with his disciples, foolish and neophyte as we are. He gives the impression there is no one in the world he would rather be with and nothing he would rather be doing than sharing whatever he has with us, although we have nothing to give him in return that could possibly be of interest to him. It seems a lopsided relationship, but Prabhupāda doesn’t mind. He is not looking for anything for himself, only to see what he can give us. As a result, we have obtained more than any of us can ever have hoped for.</p>

<p>After chatting with us, Prabhupāda took rest upstairs on a mattress in the sun for about an hour.</p>

<p>He reserved the time from 10:00 a.m. until 11:15 a.m. for special guests and discussed management of the temple with senior devotees. Sometimes he replies his mail during this period also. Today he dealt with a wide range of people and projects. He is negotiating the offer of a <em>gośālā</em> near Mathurā, the opening of a post office in our future <em>gurukula</em> building, and the establishment of a bank branch in the guest house. These arrangements will provide better facilities for the devotees and guests, which will result in the temple becoming a greater focus of local community activity. When more people come, more preaching can go on, the net result being that Kṛṣṇa consciousness will further increase and more souls will be saved from the clutches of material existence.</p>

<p>Prabhupāda confronted a variety of topics in today’s mail, from orchestrating the worldwide production and distribution of his books through the efforts of enthusiastic followers to solving the personal problems of a disciple struggling with māyā to encouraging the newly interested—a university teacher in Copenhagen and a distressed young man in Australia. Everyone received his close personal guidance and attention.</p>

<p>Rāmeśvara, head of the American division of the Book Trust, reported a recent new record in book distribution. In a one-day competition, Los Angeles, Chicago, and Atlanta temples distributed 5,406 hardbound books, with some individual devotees selling over two hundred each. Rāmeśvara’s report was dramatic. “Our men are willing to do anything to please you, and all of them have dedicated their whole lives to distributing these books. Our only desire is that you may kindly bless us with greater and greater desire to distribute these books all over the world until every home has whole libraries of your books. By Your Divine Grace’s blessing we will never stop distributing these books. We are thinking that this is the highest pleasure in all the three worlds.”</p>

<p>Prabhupāda’s response was equally enthusiastic. “Your report of book sales is over-encouraging. You are all becoming very, very dear to my Guru Maharaja. I started this movement by book selling. I was never a beggar for money, but I was writing books and selling. My Guru Maharaja very much liked my writing, and he used to show others in my absence, ‘Just see how nicely he has written, how he has appreciated.’ He encouraged me, and my Godbrothers, they also liked my writing. After I wrote that poem for Vyasa-puja of my Guru Maharaja, they used to call me ‘Poet.’</p>

<p>“Anyway, I was working writing books and publishing BTG alone, but I could not give the thing shape, so I decided to go to the U.S.A., and now you all nice boys and girls have helped me so much. It is all the mercy of Krsna. Thank you very much.”</p>

<p>Yaśodānandana Mahārāja and Acyutānanda Swami are touring South India, and Prabhupāda plans to meet them in Nellore in a few weeks. They are arranging programs for him in a large hall in Madras, where their party has met with a good reception. They also sent a favorable report of their book distribution. They are holding <em>paṇḍalas</em>, making Life Members, and distributing <em>The Scientific Basis of Kṛṣṇa Consciousness</em>, written by Svarūpa Dāmodara, one of Prabhupāda’s disciples.</p>

<p>Although each of their men sells only a few copies of one small book and collects 150 rupees per day, Prabhupāda considers this a good beginning and his expectations are high. “There is tremendous field in India for selling books,” he wrote. “If you continue this effort you will soon compete with America. Gopala Krsna is arranging to print Srimad-Bhagavatam in Hindi, First Canto Vol. 1 15,000 copies, also Bhagavad-gita As It Is. So there is a big field, in India 600,000,000 people. In every home there should be at least one BBT publication, so the field is very big.”</p>

<p>Aja dāsa, the president of Boston temple, has begun holding lectures at local universities, where he distributes <em>prasādam</em> and magazines. The devotees have made applications to teach courses on Kṛṣṇa consciousness in several colleges, and they’ve established a new center in Amherst, a big college town.</p>

<p>Prabhupāda was extremely happy to hear this, for one of his greatest ambitions is to see his books studied seriously in the schools and colleges of the world. He replied, “I am very pleased to note that you are attempting to preach seriously in the schools and colleges. Prahlada Maharaja, a great devotee and authority in our line, said Krsna consciousness should be taught from the very beginning of childhood. The defect of modern education is that the children are taught all nonsense things. They do not receive even the first point of knowledge, that ‘I am pure spirit soul, part and parcel of God.’ This simple fact they have yet to learn, so if you can teach them just this one point it will be a great success, because this is the basic platform of advancing in spiritual understanding. If we want to read and write, then it is essential to learn first of all the ABCs.”</p>

<p>A <em>brahmacārī</em> in England asked for guidance in his service and <em>āśrama</em> after a period of difficulty, and Prabhupāda encouraged him to push on. “From your letter it appears that you are a little confused. This means that the consciousness is not clear, brahma-bhutah prasannatma, na socati na kanksati. The clear stage of consciousness is free from hankering and lamentation. As long as we are on the material platform, bodily conception of life, we will hanker after so many things required for material supremacy. Therefore to clear this cloudy consciousness Caitanya Mahaprabhu has recommended that one should simply chant the holy name of God sincerely and hear it with attention. So chant, dance, take prasadam and be happy. Marriage is not recommended. Are you prepared to get a job, live outside the temple in an apartment, provide the wife with bangles, saris and sex? Better you concentrate on this chanting and hearing process, then teach others and give them prasadam.”</p>

<p>Prabhupāda has attracted the attention of people in all walks of life, and his replies to nondevotees are equally to the point. When Mark Phillips, a young Australian married man, sent a faltering cry of distress, Prabhupāda offered the universal panacea. “Yes, we are eternally related to the Lord as servant, so naturally when we forget our eternal relationship as servants of the supreme master, Krsna, we suffer... . Therefore Krsna advises everyone, in Bhagavad-gītā, to simply surrender to Him and He will take care of us. In Australia we have got our temples; consult the Back to Godhead magazine for the temple nearest you. Please visit the temple and take advantage of the pure, spiritual atmosphere. This will immediately extinguish the burning fire of material suffering in your heart. Meanwhile I humbly request you to chant Hare Krsna, Hare Krsna, Krsna Krsna, Hare Hare/ Hare Rama, Hare Rama, Rama Rama, Hare Hare. This chanting will bring you all perfection of life; please try it.”</p>

<p>Dr. Yogi Raj Dev Swarup teaches yoga at the University of Copenhagen and has recently obtained an Indian Government grant to begin a yoga institute in New Delhi. He wrote a letter expressing his appreciation of Prabhupāda’s work and asking how he can help the mission.</p>

<p>Prabhupāda replied, “I thank you very much for your kind appreciation. Because you are a teacher in a respectable university I request you to study some of my books, especially Bhagavad-gītā As It Is. As stated in the Gita, manah samyamya mac-citto, yukta asita mat parah. ‘One should meditate upon Me (Krsna) within the heart and make Me the ultimate goal in life’ (Bg. 6.13-14). Western people are now becoming more and more interested in yoga practice, but unfortunately, because they have no authorized source of information, they are being misled by unauthorized teachers and concocted methods of yoga practice. Actually the astanga-yoga system practiced thousands of years ago is not practical for this age; therefore Lord Caitanya Mahāprabhu introduced the chanting of the holy name of God: Hare Krsna, Hare Krsna, Krsna Krsna, Hare Hare/ Hare Rama, Hare Rama, Rama Rama, Hare Hare.</p>

<p>“In all our temples we are doing that and we have more than forty big volumes of authorized books: Srimad-Bhagavatam, Bhagavad-gītā, etc. Intelligent people are accepting this Movement all over the world, so if you are serious about joining this mission then why not study these books, understand the philosophy and teach.”</p>

<p class="verse">* * *</p>

<p>Despite his workload, Prabhupāda always adheres to his schedule. At 11:30 a.m. he took his massage, followed by a bath and lunch and then an hour’s rest. I’ve never seen anyone sleep as little as Śrīla Prabhupāda, about three to four hours total, yet he never shows any sign of fatigue.</p>

<p>When he woke around 4:00 p.m. Kiśorī dāsī placed a freshly made garland around his neck, dabbed some freshly ground sandalwood paste on his forehead and temples, and offered him some fresh fruit juice. He then sat at his desk to receive visitors.</p>

<p>At 5:00 p.m. his doors opened for <em>darśana</em>. A steady flow of curious and respectful people, fifty or sixty at a time, continuously packed his room either to sit and watch or to ask questions. He sometimes talked specifically with a particular visitor, not minding if the other fifty listened in, and at other times he spoke generally to all.</p>

<p>I was posted at the door to give out <em>pera</em>, a milk sweet that is a Vṛndāvana specialty. Prabhupāda is particularly insistent that all visitors receive some Kṛṣṇa <em>prasādam</em>, a tangible offering for their spiritual advancement. A discussion of philosophy may be easily forgotten, but <em>prasādam</em> will always act to purify. <em>Prasādam</em> distribution is also in accordance with Vedic etiquette that a guest must always be offered a place to sit and a little refreshment, no matter who he may be. Thus, as always, Śrīla Prabhupāda was the perfect host.</p>

<p>At 6:30 p.m. the temple conch and bells announced evening <em>ārati</em>. <em>Darśana</em> concluded, and Śrīla Prabhupāda sent the devotees and guests over to the temple to chant and see the Deities. Relaxing for a while, he spent the rest of the evening discussing philosophy and matters of practical management, giving advice to his managers and sometimes sitting quietly chanting.</p>

<p>A local devotee, Śrī Viśvambhara Dayal, popularly known as Bhagatjī, arrived at 9:00 p.m. to prepare Śrīla Prabhupāda’s hot milk and hold light discussion on the temple management, <em>gurukula</em>, and other matters.</p>

<p>Śrīla Prabhupāda drinks a glass of hot milk every evening just before taking rest, sometimes supplementing it with a savory like <em>kachori</em>, <em>paraṭhā</em> or fried <em>chīra</em>. He gave the cooks clear instructions how to make each preparation. His milk has to be exactly the right temperature—very hot, so that it can be easily digested, but not so hot that it burns.</p>

<p>One previous evening he demonstrated to me how to bring boiling milk to the right temperature for drinking. Calling for another bowl, he poured the milk from his silver cup from a height of about six inches into the bowl and then back again a few times to aerate the milk and reduce the temperature. When it was just right, he drank it.</p>

<p>The evening massage took more than half an hour. Lately the weather has been cold throughout the night until sunrise. Thus Prabhupāda’s circulation and joints need more attention. I took rest about eleven o’clock.</p>

<p>As we disciples slept, Prabhupāda arose around 11:30 or midnight to begin his most important work of the day, the translation of the <em>Śrīmad-Bhāgavatam</em> and the writing of his transcendental purports. Harikeśa is a light sleeper, and he often awakens as Prabhupāda comes through the servant’s room on his way into the <em>darśana</em> room. Rolling over in his sleeping bag, he offers his obeisances as Śrīla Prabhupāda passes.</p>

<p>Sitting at his desk Prabhupāda chanted <em>japa</em> for an hour or so in complete concentration on the holy names. He prayed to Kṛṣṇa for the ability to serve Him nicely and to present the eternal words of the <em>Śrīmad-Bhāgavatam</em> in a manner just suitable for the understanding of the entire world, conscious that his work will form the basis for law and order in the next ten thousand years.</p>

<p>Putting aside his <em>japa-mālā</em> he donned his spectacles and clicked on the desk light. He opened the <em>Bhāgavatams</em> at the bookmarks—the large green Varanasi edition with the Sanskrit commentaries of previous <em>ācāryas</em> and the red Bengali one with commentaries by Śrīla Bhaktisiddhānta Sarasvatī Ṭhākura—leaned forward, and studied them intently. The microphone close to his mouth, he flicked on the tape and began his dictation: “<em>Śrīmad-Bhāgavatam</em>, Seventh Canto, Seventh Chapter, verse twenty-five, purport continued....”</p>', '', '1975-12-05', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- December 6th, 1975
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'December 6th, 1975',
    '', '', '', '',
    '', '', '', '',
    E'<p>Early this morning Prabhupāda sent for the temple managers and angrily chastised them because we have spent fifty <em>lakhs</em> of rupees to build such a big temple and guest house, yet he cannot get hot water in the cold season. The past few mornings the water has been so cold that he couldn’t even brush his teeth. One after another, Gopāla Kṛṣṇa, Akṣayānanda Swami, Guṇārṇava and Dhanaṣjaya were called. No one seemed to want to take responsibility. Śrīla Prabhupāda demanded to know why. Whenever they offered a feeble excuse or explanation, he abruptly cut them off. It was clear he wanted to hear a plan for rectifying the mistakes, not excuses.</p>

<p>Prabhupāda called for Saurabha dāsa, the Dutch devotee and architect who was responsible for supervising the construction and design of the project, but he could not be found. This only increased Prabhupāda’s exasperation. Holding Saurabha responsible for the mistake, he sharply rebuked him in his absence.</p>

<p>When the devotees assured him that the problem would be fixed immediately Prabhupāda’s mood changed. As quickly as it had arisen, his anger disappeared.</p>

<p>As our spiritual master, Śrīla Prabhupāda is training us in every aspect of devotional service. His praise and criticism are never unreasonable or excessive, but always intended to push us forward in our spiritual progress. He expects us to be conscientious, as attention to the details of our service is the practical manifestation of our seriousness and sincerity. He doesn’t like to hear excuses for tasks undone, and he loathes the bureaucratic mentality that in the West we call “passing the buck.”</p>

<p>He said the British Raj had introduced this mentality, and it has crippled India. He is determined to see that it not get a footing in ISKCON. “I ask you to do something. You ask him. He asks another. And you go away and forget. Business finished. Simply bureaucracy! If I ask you to do something, it is your responsibility, not his. Even if you give it to someone else, you have to see it is properly completed.”</p>

<p>Despite his criticism of the management over the hot water incident, Prabhupāda is very pleased with the service of Saurabha and the other devotees. More than once he has asked me during massage what I thought of the guest house and temple. When I responded with appreciation, he looked over the buildings and said, “Yes, I think he has done very nicely. There is no such building anywhere.” But he is determined not to allow us to become complacent. Now the facility has to be maintained and managed efficiently, and Śrīla Prabhupāda is personally showing us how to do it. As the representative of Kṛṣṇa, he wants to make sure that whatever resources Lord Kṛṣṇa has provided are used correctly without waste. And he is constantly urging us to develop the same sense of responsibility.</p>

<p class="verse">* * *</p>

<p>Prabhupāda is especially fond of Prahlāda Mahārāja’s instructions because they are so pertinent to modern society. This morning’s verse in particular emphasized the point that economic development is a waste of time. Śrīla Prabhupāda delivered a crushingly negative appraisal of contemporary society that considers progress only in economic terms. He said that no one can obtain more happiness than they are due by their <em>karma</em>. Just as distress comes without working for it, so happiness also comes. Therefore, we should work only for spiritual advancement.</p>

<p>He told us, “The human life is meant for understanding Kṛṣṇa. Instead of using the energy for understanding Kṛṣṇa, they are spoiling the energy unnecessarily to earn money. This is the modern civilization. The whole Western world, how they are spoiling their life unnecessarily! Prahlāda Mahārāja has begun with the words <em>durlābhaà mānuṣaà janma</em>. This life is very, very important, and after many, many births you have got it.</p>

<p>“Cāṇakya Paṇḍita said, <em>āyuṣaḥ kṣaṇa eko ’pi na labhya svarṇa-koṭibhiḥ</em>. <em>Svarṇa</em> means gold coins, and <em>koṭi</em> means ten millions. So suppose today is sixth December. Now it is seven o’clock in the morning; now passed. Can you bring it back again by paying one <em>crore</em> of gold coins? Hm? ‘Let me get back seven o’clock, sixth December 1975, again?’ No—it is gone forever. So just see the value, that you cannot get back even a moment of your life by paying millions and millions of dollars. How time is valuable! Just calculate.”</p>

<p>As he surveyed the eighty or ninety young men and women who have come here to get the special blessings of serving in the holy <em>dhāma</em>, he warned us to be attentive to our purpose. “There is no guarantee that I am going to take again a human form of life. But there is a little guarantee for the devotee. Guaranteed in this way, that if he unknowingly commits some mistake, then it is guaranteed. And if he knowingly commits mistake, then he is going to be cat or dog. This is the facility. If one purposefully commits mistake and sinful life, ‘Now I am chanting Hare Kṛṣṇa, I can do all sinful life. It will become counteracted,’ that rascal will be punished very, very much. <em>Nāmnād balād yasya hi pāpa buddhiḥ</em>. ‘I am living in Vṛndāvana. Oh, it is <em>dhāma</em>. So let me do all nonsense. It will be counteracted.’ They’ll be these cats and dogs and monkeys in Vṛndāvana. <em>Dhāma-aparādha</em>. Of course, Vṛndāvana’s influence will be there, but at least one life he has to become the hog and dog in Vṛndāvana. As you see, there are many dogs, hogs. But still, Vṛndāvana-dhāma is so powerful that next life he will get salvation, even if he has become a dog or hog. But that is not good. Why should we act in such a way that in Vṛndāvana-dhāma we shall commit sinful life and become a cat or dog? We should be careful. You simply dedicate your life to serve Mukunda. Kṛṣṇa’s another name is Mukunda. <em>Muka</em> means liberation. <em>Mukti</em>. So <em>ānanda</em>, the <em>mukty-ānanda</em>, that is real <em>ānanda</em>, liberation. So our business is how to surrender fully unto the lotus feet of Mukunda, <em>mukunda-caraṇambujam</em>, and fully engage in His service. Therefore Prahlāda Mahārāja says, ‘Don’t try for anything else.’”</p>

<p class="verse">* * *</p>

<p>Prabhupāda has given Harikeśa a new service. He wants him to write an essay titled “Experimental Knowledge,” explaining the defects of modern science and presenting the scientific basis of Kṛṣṇa consciousness. Prabhupāda has been personally coaching him, calling him in regularly to discuss points of logic. He told Harikeśa not to criticize modern science as such but the misuse of it. Science should not be used as a tool to propagate atheistic theories, and false claims must be exposed. Modern scientists are challenging God, and now Prabhupāda as God’s servant and representative is challenging them. “Inventions you can take credit for, but why claim to be God?”</p>', '', '1975-12-06', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


END $$;
