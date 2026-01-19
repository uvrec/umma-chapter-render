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


  -- March 15th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 15th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Right before <em>maṅgala-ārati</em> Prabhupāda buzzed me. He called for Tamal Krishna Goswami and Trivikrama Swami, but I could only find Trivikrama, since Tamal Krishna had already entered the temple. Prabhupāda told Trivikrama Mahārāja that he wanted him to go immediately to China with Tamal. He had been meditating on it all night, he said, and decided that we should definitely do something in the Communist countries.</p>

<p>He also called for Gopāla Kṛṣṇa prabhu and told him to leave for Russia as soon as possible. He said that there are opportunities there for book distribution to libraries, and as an Indian businessman, Gopāla Kṛṣṇa would be well received.</p>

<p>Both Trivikrama Mahārāja and Gopāla were excited by the prospect of opening up vast new preaching fields. They both happily agreed.</p>

<p>Word was sent out to Tamal Krishna Mahārāja, but by the time he arrived in Śrīla Prabhupāda’s room, His Divine Grace had gone to the bathroom to freshen up for his morning walk.</p>

<p>Tamal Krishna was visibly shocked at the idea of going to China. As we waited, he began to pace the room, voicing all the reasons why he could not possibly go. Madhudviṣa and Gurukṛpa Swamis accompanied him to give him some support. Prabhupāda had altered a decision many times previously upon further discussion of an issue. They felt that Tamal had good, strong arguments that might change Prabhupāda’s mind upon his hearing them.</p>

<p>After a few minutes Śrīla Prabhupāda returned and sat behind his low desk to apply his <em>tilaka</em>. Tamal Krishna Mahārāja sat before him and presented all the reasonable arguments why he should not go to China.</p>

<p>He hadn’t expected that Prabhupāda would take what he had said last night literally. He explained how, after leaving Prabhupāda’s room, he had met with his entire Rādhā Dāmodara party, and they had discussed their plans for the coming year. They were all enthusiastic and determined to make it the biggest year ever in book distribution. If he were to leave the <em>saṅkīrtana</em> party now everything might collapse; the preaching was only going on by his personal presence. There was no one else who could organize it.</p>

<p>Gurukṛpa Mahārāja spoke up in support, volunteering to go to China instead so that Tamal could stay in America and continue the book distribution. It was a very strong argument. Book distribution is Śrīla Prabhupāda’s greatest joy and not something he will jeopardize.</p>

<p>Nevertheless, Prabhupāda firmly rejected the offer. “No! He must go!” Visibly irritated, Prabhupāda asserted, “The Rādhā Dāmodara party is going on by Kṛṣṇa’s energy, not Tamal Krishna Goswami’s! You said it [China], and I thought about it all night. I wanted to do something there, and I took it as Kṛṣṇa speaking through you.”</p>

<p>It quickly became clear to everyone that Prabhupāda was very serious. Madhudviṣa and Gurukṛpa backed away, their silence leaving Tamal Krishna isolated.</p>

<p>His position rapidly weakening, but still resistant, Tamal Krishna Mahārāja tried again. He said that he had indeed mentioned going to China but he might just as easily have said he wanted to go to the moon and preach. He wasn’t being serious; it was a joke.</p>

<p>Now Prabhupāda became angry. “Vaiṣṇavas do not joke! You said it, and I took it as Kṛṣṇa’s indication. I thought about it all night. We have no men there, and I took it as a good opportunity to do something there.”</p>

<p>Tamal Krishna was sinking fast, but he tried one last argument. He said that he could understand that His Divine Grace wanted something to be done there but any <em>sannyāsī</em> could do it. It shouldn’t be a GBC member, who has so many other important responsibilities.</p>

<p>Prabhupāda’s face was flushed. His back straightened, and his upper lip twitched on the left side. His anger was barely restrained. His hands shook as he held his <em>tilaka</em> mirror and applied the sacred clay to his forehead.</p>

<p>“Why not GBC? All your resolutions are finished. First resolution, then revolution, then dissolution—no solution! I have to manage everything myself! I give you a little power, and you create havoc! GBC is for solving situations, not for creating situations.”</p>

<p>He was fully determined and fixed in his decision. He forced his disciple to surrender, making it quite clear there was no option. “I want it, but you do not want. It is my very strong desire. Now I take everything from you. You can either go to China, or you simply sit here in Māyāpur and chant!”</p>

<p>Tamal Krishna Mahārāja bowed his head and conceded. He finally understood there was no alternative and surrendered, agreeing to do whatever his spiritual master required. Despite the prospect of foregoing everything that he had worked for several years to build up—the most successful preaching party in the Society—Prabhupāda’s desire was paramount. It was a fruitless glory if he didn’t please Śrīla Prabhupāda.</p>

<p>Tamal asked only one concession, that Dhṛṣṭadyumna dāsa, a leading <em>brahmacārī</em> from RDTSKP and a <em>sannyāsa</em> candidate, accompany him, not Trivikrama Swami.</p>

<p>Prabhupāda, now wreathed in smiles, happily agreed. Obviously pleased by the submission of his leading <em>sannyāsī</em> disciple, he strode out to take his morning walk, much of which he spent happily discussing how the new preaching assignment would be fulfilled.</p>

<p class="verse">* * *</p>

<p>Whether Śrīla Prabhupāda was thinking specifically of the morning’s incident or not during class is hard to say. But what he said must have given considerable encouragement and reassurance to his newly eastbound disciples. “If you want to remain in <em>sattva-guṇa</em>, in purity, then Kṛṣṇa will help. Just like here, as soon as Brahmā was disturbed by the demons full of <em>rajo-guṇa</em> and <em>tamo-guṇa</em>, immediately the Lord came in Hayagrīva-<em>mūrti</em> incarnation. Kṛṣṇa is also very much anxious to give us protection. If you remain a pure devotee, always surrendered to Kṛṣṇa, you should know it very well that Kṛṣṇa will give you protection in any calamity. Don’t be worried. Simply we must have the faith. That is surrender.</p>

<p>“Surrender means <em>avaśya rakṣibe kṛṣṇa, viśvāsa-pālana</em>. You must be faithful that ‘I am engaged in Kṛṣṇa’s service. I may go to hell or heaven. It doesn’t matter. I am going to serve Him. It is sure that Kṛṣṇa will give me protection.’ So There should be no hesitation. If somebody is ordered, ‘Go to hell and preach Kṛṣṇa consciousness,’ he should remain faithful to Kṛṣṇa, and Kṛṣṇa will give all protection. This is the principle.”</p>

<p class="verse">* * *</p>

<p>Śrīla Prabhupāda’s Godbrother B. R. Śrīdhara Swami, came in Prabhupāda’s car from his <em>maṭha</em> in Navadvīpa. He stayed for most of the afternoon. He and Prabhupāda took <em>prasādam</em> together on the veranda. Śrīla Prabhupāda had him stay in the room right next to his own, and after a light rest, they talked for most of the afternoon.</p>

<p>During their conversations they exchanged reports on each other’s preaching activities. Śrīla Prabhupāda told me afterward that Śrīdhara Mahārāja had said that he regarded him as the real <em>ācārya</em>. Śrīdhara Mahārāja told him that Lord Caitanya had given His prediction that the chanting of the holy name would go to <em>every</em> town and village, but he and his Godbrothers had not taken this statement literally. Now by Śrīla Prabhupāda’s efforts he said he could understand its real meaning.</p>

<p class="verse">* * *</p>

<p>The GBC met later in the day to redefine zones and to strike out the ‘revolutionary’ resolutions.</p>

<p>Madhudviṣa Swami was placed in charge of the Rādhā Dāmodara TSKP, as well as New York, Montreal, Toronto, and Ottawa. Rūpānuga prabhu got himself reassigned the southern part of America’s East Coast; Gurukṛpa Swami will now manage Australia, New Zealand, Hawaii, Japan, and Fiji; and Jagadīśa prabhu will go to the U.S. Northwest.</p>

<p>By evening they reported that the temple presidents were all now satisfied. Prabhupāda approved a new system for the annual meetings, whereby an initial GBC meeting will be followed by an official temple presidents meeting, which will consider the resolutions of the GBC and make recommendations as they feel necessary. The GBC will then meet a final time to respond and make any adjustments they feel warranted. In this way the presidents are to be given a voice and the opportunity for controversy possibly avoided.</p>

<p>Śrīla Prabhupāda made it clear however, that the GBC decision must be accepted as final. The presidents’ meeting will be advisory only.</p>

<p class="verse">* * *</p>

<p>Tamal Krishna Mahārāja gave a report on his project for China. He has fully accepted his new assignment and has begun to apply himself to the task. Dhṛṣṭadyumna’s father is the chairman of Seagram’s international division, with links in Hong Kong. They intend to consult with him to see how to enter China as businessmen.</p>

<p>Prabhupāda said that he wants something permanent done there—slowly but surely. Tamal Krishna is taking the task very seriously, and Prabhupāda is clearly pleased.</p>

<p class="verse">* * *</p>

<p>In a casual moment, while he and I were alone in his room, Śrīla Prabhupāda suddenly, without any prompting, volunteered some interesting information about himself. He told me that once an astrologer informed him that in his previous life he had not committed a single sin. He had been a physician, and just one time, in the course of his work, he had killed a poisonous snake in order to extract the venom for medicine. But this was not considered sinful.</p>

<p>My mind immediately raced with speculation as to who he might have been. I thought of Murāri Gupta, the great devotee and physician in <em>Caitanya-līlā</em>, but I was hesitant to ask. If the spiritual master reveals something about himself out of his own accord, all well and good, but I didn’t feel it my place to intrude directly into his persona. Still, it seemed an opportunity too good to miss, so I discreetly tried to draw Śrīla Prabhupāda into revealing more. “Um, when would that birth have been, Śrīla Prabhupāda?”</p>

<p>His reply was very nonchalant and noncommittal, “Oh, one birth is, say, utmost one hundred years. So you simply calculate from 1896 previously.”</p>

<p>And then he changed the subject.</p>

<p>Opportunity lost.</p>', '', '1976-03-15', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- March 16th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 16th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>GAURA PÜRṆIMĀ. The appearance day of Śrī Caitanya Mahāprabhu. Everyone fasted until moonrise and then took an Ekādaśī feast, although Prabhupāda said this was not compulsory.</p>

<p class="verse">* * *</p>

<p>Prabhupāda kept to his regular schedule, walking first up on the roof and then coming down to walk around the grounds.</p>

<p>Prabhupāda’s attentiveness to every detail is nothing short of amazing. As soon as he came out into the cool morning air on the rooftop, he noted a <em>loṭā</em> that was standing next to the freshly watered <em>tulasī </em>plants. None of us thought anything of it, but vexation immediately crossed Prabhupāda’s face. He asked one of the devotees to check if there was a <em>loṭā</em> in the toilet room.</p>

<p>“No, Śrīla Prabhupāda,” was the reply.</p>

<p>Prabhupāda shook his head. He recognized it as one he has been using. “See how <em>aparādhī</em>, offender. They have used that <em>loṭā</em> for watering. Great offender. This is going on, <em>mlecchas</em> and <em>yavanas</em>.” The thought of using a contaminated receptacle to water Śrīmatī Tulasī Devī was abominable to him, and he warned us to see that it does not happen again in the future. “One who has used that, he has no sense how to water the <em>tulasī </em>plant. He should be instructed, ‘You never use that toilet <em>loṭā</em>.’”</p>

<p>It was yet another indication of our lack of Kṛṣṇa consciousness. Obviously some of us still think of Tulasī Devī as a mere plant, but Prabhupāda is fully conscious of her exalted position.</p>

<p>During the walk Śrīla Prabhupāda spoke continuously, engaging everyone in debate, challenging and exposing the defects in the philosophy of the Communists and scientists, and training his men how to present Kṛṣṇa consciousness as the topmost system.</p>

<p>He seemed more enlivened than usual, obviously invigorated by the presence of his leading preachers. He talked the whole walk, particularly on the point of leadership in human society. If change is required, or continuous revolution, as the Communists say, then that means imperfection in the leaders. But we have had the same leader, Kṛṣṇa, for millions of years without any need of change.</p>

<p>Then in another incident he demonstrated his ever-watchful concern for our spiritual lives. Surrounded by his <em>sannyāsīs</em> and GBCs, he descended the central staircase to the first floor. He caught sight of a woman waiting to go up to the second floor. He stopped and asked what she was doing.</p>

<p>She said she had to go to see Hridayānanda Goswami.</p>

<p>Prabhupāda became very concerned, and sent for Hridayānanda Mahārāja.</p>

<p>When he came, Prabhupāda demanded to know why he was having a woman visit him in his room. As everyone stood around, Prabhupāda chastised him, saying a <em>sannyāsī</em> should not even talk to a woman. Hridayānanda explained that it was a misunderstanding. She was actually coming with her husband to discuss her initiation.</p>

<p>“That may be,” Śrīla Prabhupāda said, “but I have to respond as I understand it.”</p>

<p>It was a salutary lesson in how careful one must be to protect one’s spiritual life.</p>

<p class="verse">* * *</p>

<p>Somehow, as if by divine arrangement, the verse from <em>Śrīmad</em>-<em>Bhāgavatam</em> 7.9.38 was an exact reference to the appearance of Lord Caitanya. It wasn’t planned, as Śrīla Prabhupāda has been lecturing on the verses in order since mid-February. Yet it was exactly appropriate. Puṣṭa Kṛṣṇa loudly read out the translation to the packed assembly. “In this way, my Lord, You have appeared in different incarnations, as human beings, as animals, as a great saintly person, as demigods and as a fish and a tortoise. In this way You maintain the whole creation in different planetary systems and kill the demoniac principles in every age. My Lord, You therefore protect the principles of religion. In the age of Kali You do not assert Yourself as the Supreme Personality of Godhead. Therefore You are known as Tri-yuga, or the Lord who appears in three <em>yugas</em>.”</p>

<p>Śrīla Prabhupāda gave a long lecture, revealing the purpose of Lord Caitanya’s descent here in Śrī Māyāpur Dhāma, 490 years ago. He explained that the Lord’s mysterious advent can be understood only by the mercy of great devotees like Śrīla Rūpa Gosvāmī. “Caitanya Mahāprabhu is described here as <em>channaḥ kalau</em>. In the Kali-yuga He’s not appearing as other incarnations, not like Nṛsiàhadeva or Vāmanadeva, or Lord Rāmacandra. He is appearing as a devotee. Why?</p>

<p>“Now, this is the most magnanimous <em>avatāra</em>. People are so foolish, they could not understand Kṛṣṇa. When Kṛṣṇa said, <em>sarva-dharmān parityajya māà ekaà śaraṇaà</em> [give up everything and surrender to Me], they took it: ‘Who is this person ordering like that, <em>sarva-dharmān parityajya?</em> What right?’</p>

<p>“That is our material disease. If somebody is ordered to do something, he protests, ‘Who are you to order me?’ This is the position. God Himself, Kṛṣṇa, what can He say? He orders, the Supreme Person, Supreme Being. He must order. He’s the Supreme Controller. That is God. But we are so foolish that when God orders that ‘You do this,’ we take it otherwise: ‘Oh, who is this man? He’s ordering like that. Why shall I give Him? I have created so many <em>dharmas</em>, <em>isms</em>. I shall give it up? Why shall I give it up?’ Therefore the same Lord came again as Caitanya Mahāprabhu.</p>

<p>“Today is Caitanya Mahāprabhu’s appearance day, so we must discuss this very thoroughly, [the way] that Rūpa Gosvāmī understood it. Therefore we have to go through guru. Rūpa Gosvāmī is our guru. Narottama dāsa Ṭhākura said, <em>rūpa-raghunātha-pade, hoibe ākuti, kabe hāma bujhabo, se yugala-pīriti</em>. If we want to understand the transcendental position of the Supreme Personality of Godhead, then we have to go through <em>guru-paramparā</em> system. Otherwise it is not possible.</p>

<p>“So this is <em>channaḥ-avatāra</em>. He’s Kṛṣṇa, He has come to give you <em>kṛṣṇa</em>-<em>prema</em> [love of God] but He’s acting like a Kṛṣṇa devotee. This is covered. He is not commanding now, ‘You do this’—yes, He’s commanding, ‘Do this,’ but in a different way.</p>

<p>“Because people misunderstood, ‘Oh, who is this person commanding?’ Even some so-called rascal scholar, he has said, ‘It’s too much to demand.’ They have remarked like that. Yes, sophisticated persons, they are thinking like that. But our process is to submit. Unless we submit, there is no hope of advancing in Kṛṣṇa consciousness. That is Caitanya Mahāprabhu’s teaching: <em>tṛṇād api sunīcena taror api sahiṣṇunā/ amāninā mānadena kīrtanīyaḥ sadā hariḥ. </em>“If you want to chant Hare Kṛṣṇa <em>mantra</em>, then you have to take this principle, <em>tṛṇād api sunīcena</em>. You have to become humbler than the grass. Grass, it is lying on the street. Everyone is trampling down. Never protests.</p>

<p>“<em>Taror api sahiṣṇunā</em>. And more tolerant than the tree. The tree is giving us so much help. It is giving us fruit, flower, leaves, and when there is scorching heat, shelter also. Sit down underneath. So beneficial—still, we cut. As soon as I like, I cut it down. But there is no protest. The tree does not say, ‘I have given you so much help, and you are cutting me?’ No. Tolerant, yes. Therefore Caitanya Mahāprabhu has selected.</p>

<p>“And <em>amāninā mānadena</em>. For oneself one should not expect any respectful position, but he, the devotee, should offer all respect to anyone. <em>Amāninā mānadena kīrtanīyaḥ sadā hariḥ</em>. If we acquire this qualification, then we can chant Hare Kṛṣṇa <em>mahā-mantra</em> without any disturbance. This is the qualification. So Caitanya Mahāprabhu came to teach these principles.”</p>

<p class="verse">* * *</p>

<p>In mid-morning Prabhupāda spoke again, this time at a grand initiation ceremony and fire <em>yajṣa</em>. He awarded <em>sannyāsa</em> to seven men, <em>brāhmaṇa</em> to fifteen devotees, and <em>hari-nāma</em> initiation to twenty-five.</p>

<p>The devotees had beautifully decorated the entire temple room with flags, festoons, and banana trees. Prabhupāda’s <em>vyāsāsana</em> had an abundant array of flowers hanging from its umbrella.</p>

<p>A central aisle was left clear, from Prabhupāda to the Deity room at the other end of the temple. On either side the new initiates sat before him, each behind a leaf plate containing some grains and a banana for offering into the fire. Behind them, over five hundred devotees crammed in, eager to watch the ceremony.</p>

<p>Śrīla Prabhupāda described <em>brāhmaṇa</em> initiation as the means of elevating one to the highest position in society. It is not dependant on birth, but on qualification, and it culminates in <em>sannyāsa</em>. “Caitanya Mahāprabhu also wanted to introduce this system. <em>Kibā śūdra, kibā vipra, nyāsī kene naya, yei kṛṣṇa-tattva-vettā sei ‘guru’ haya</em>. He never accepted this, that by birth... no. Either he is a <em>brāhmaṇa</em> or he is a <em>śūdra</em>, by caste or by birth; either he’s a <em>gṛhastha</em> or a <em>sannyāsī</em>, it doesn’t matter. He can become a guru. How? <em>Yei kṛṣṇa tattva vettā</em>. One who knows the principles of Kṛṣṇa consciousness, one who understands Kṛṣṇa, he can become a guru.</p>

<p>“So guru is the post given to the <em>sannyāsīs</em>, to the <em>brāhmaṇas</em>. Without becoming a <em>brāhmaṇa</em>, nobody can become a <em>sannyāsī</em>, and <em>sannyāsī</em> is supposed to be the guru of both all the <em>āśramas</em> and all the <em>varṇas</em>.</p>

<p>“So the preaching work... We require so many <em>sannyāsīs</em>. People are suffering all over the world for want of Kṛṣṇa consciousness. My Guru Mahārāja used to say that there is no scarcity, this is false propaganda. The only scarcity is that there is no Kṛṣṇa consciousness. That is the difficulty. Actually that is the fact... .</p>

<p>“Anyone who knows the science of Kṛṣṇa, he can spread this Kṛṣṇa consciousness movement. And there is great necessity, great necessity. And the preaching work is meant for the <em>sannyāsīs</em>. So we have got some <em>sannyāsīs</em> who are doing very nicely, so today we shall make a number of <em>sannyāsīs</em> more to spread Kṛṣṇa consciousness all over the world. And those who are going to take <em>sannyāsa</em>, they should remember how much responsibility they have got. Live like a very strict <em>sannyāsī</em>.”</p>

<p>Noting the youthfulness of the <em>sannyāsa</em> candidates (all except Hansadūta are in their mid-twenties) and the fact that all are from the West (Prabhupāda decided not to award it to Tatpur dāsa this year after several doubts were raised by others on his maturity), Prabhupāda encouraged them to push on the movement. “Caitanya Mahāprabhu took Himself <em>sannyāsa</em> at the age of twenty-four years. So it is not that in old age one has to take <em>sannyāsa</em>. That is not in the <em>śāstra</em>. From <em>brahmacārī āśrama</em> one can enter into the <em>gṛhastha āśrama</em> or <em>vānaprastha āśrama</em> or <em>sannyāsa āśrama</em>, as he thinks fit. There are no such rules and regulations that only the old man without any energy, he’ll take <em>sannyāsa</em>. No. Rather, the young men... Just like Caitanya Mahāprabhu did personally. He had beautiful wife, young wife, sixteen years old. At home, very, very affectionate mother, and His position was very great. As a young man He could collect hundreds of thousands of men by His order only, to make civil disobedience movement upon the Kazi, in this land. So the civil disobedience movement was started by Caitanya Mahāprabhu for a good cause.</p>

<p>“So there are so many things. I especially appeal to the natives of this land to take part in this movement of Caitanya Mahāprabhu for the benefit of the world. And we are trying to construct a very attractive temple here. Let them co-operate. It doesn’t matter whether he is Hindu, Muslim. Caitanya Mahāprabhu is for everyone.”</p>

<p>Hansadūta, Rāmeśvara, Ādi Keśava, Dhṛṣṭadyumna, Pramāṇa, Śatadhanya, and Jagat Guru were effulgent in their new saffron <em>lungi</em> and <em>uttarīyah</em>. One by one they prostrated themselves before Śrīla Prabhupāda and received from the hand of His Divine Grace the <em>tridaṇḍa</em> that will now symbolize their total commitment to a life of renunciation. Then each of the first-initiates came forward to receive a new spiritual name and a set of beads. Finally, the sacred fire was lit and <em>mantra</em>s chanted, bringing the ceremony to a highly successful completion.</p>

<p class="verse">* * *</p>

<p>Attendance at our temple for the Gaura Pūrṇimā day was phenomenal. Estimates of the number of pilgrims entering the front gate ranged between 9,000–25,000 per hour, depending on the time of day. The flow continued for well over seven hours.</p>

<p>Most of the visitors saw the picture exhibit as well as the temple. The road from the front gate to the temple was so packed it became nearly impossible to walk. The local police reported that people were coming from all over Bengal simply to see our ISKCON temple.</p>

<p>Many devotees sold copies of the <em>Gītār-gāna</em>, and mass distribution of <em>halavā prasādam</em> went on throughout the day.</p>

<p>Prabhupāda was extremely pleased with the turnout. Before our ISKCON temple was established here, only a few hundred people would venture to this side of the river from Navadvīpa on Gaura Pūrṇimā day. None would come after dark. Now, within a mere three years, the Śrī Māyāpur Candrodaya Mandir has become the chief attraction, not just in the local district but in the whole of Bengal. This has drawn the attention of hundreds of thousands to the sacred birth site and activities of Lord Caitanya.</p>

<p class="verse">* * *</p>

<p>In the early afternoon Tamal Krishna Mahārāja brought the Rādhā Dāmodara party for a special <em>darśana</em> with Śrīla Prabhupāda. Rādhā Dāmodara TSKP has over one hundred men working out of six Greyhound-style buses, twenty-five men under Tripurāri Swami working in six airports, and another ten men presently converting two more buses.</p>

<p>Over seventy eager young men, most of them in their early twenties, packed the room and crowded the doorways. They gave Prabhupāda a large donation of travelers checks, and he encouraged them to continue their work of book distribution and fund-raising.</p>

<p>He complimented their efforts, and showed them the plans for future Māyāpur development. Encouraging them to collect more and more funds for Māyāpur’s construction, he told them, “So you are the pillars of this construction work. We are doing all our construction work on your contribution. So go on preaching and distributing books.”</p>

<p>Śrīla Prabhupāda was in the best of humor, and deeply appreciative of the work his disciples are doing to establish Kṛṣṇa consciousness in the world. Typically, he wanted to know whether they were all comfortably situated. Tamal Krishna informed him they were occupying an entire wing of the building on the floor above.</p>

<p>Prabhupāda shook his head in mild wonder. He said that when this first building was completed, he was thinking, “Such a big building! How will it be filled?” Now it is packed and overflowing. He likened it to the appearance of <em>Matsya-avatāra</em>, the fish incarnation. When He first appeared He was tiny, and a <em>muni</em> kept Him within his water pot. Yet He continued to grow and grow, and each time He was put into a bigger container. Finally He was put into the ocean, and still that was not big enough.</p>

<p>Glancing affectionately at the bright youthful faces, Prabhupāda declared, “Caitanya Mahāprabhu’s soldiers to fight with <em>māyā!</em>”</p>

<p>They cheered back, “<em>Jaya</em>, Prabhupāda!”</p>

<p>Prabhupāda went on to explain that cooperation is the essence of the movement. Quoting a line from <em>Ohe Vaiṣṇava Ṭhākura</em> he told them, “The purport of the verse is that even Lord Caitanya Mahāprabhu—He is God himself, Kṛṣṇa Himself—He felt, alone, unable to do this task. So this is the position. You are cooperating; therefore I am getting the credit. Otherwise alone what could I do?</p>

<p>“<em>Ekakī āmāra nāhi pāya bol</em>. Caitanya Mahāprabhu Himself wanted our cooperation. He is God, Kṛṣṇa. Therefore cooperation is very important thing. Nobody should think that ‘I have got so great ability. I can do.’ No. It is simply by cooperation we can do very big thing. ‘United we stand; divided we fall.’ So be strong in pushing on Kṛṣṇa consciousness, and Kṛṣṇa will help. He is the strongest.</p>

<p>“Still, we must be combined together. <em>Saṅkīrtana</em> means many men combined together chanting. That is <em>saṅkīrtana</em>. Otherwise <em>kīrtana</em>. <em>Bahubhir militvā kīrtayeti saṅkīrtana</em>. <em>Bahu</em> means many; many combined together. That is Caitanya Mahāprabhu’s mission—combined together. All nations, all persons, they should combine together. There is hope in our society, combination. There are Hindus; there are Muslims; there are Christians; there are black, white. Combine them. That looks very beautiful, just like combination of many flowers.”</p>

<p>Bringing the <em>darśana</em> to a close, Prabhupāda glorified them with a final few words of praise. “Hare Kṛṣṇa. All glories to the <em>saṅkīrtana</em> party, Rādhā Dāmodara!”</p>

<p class="verse">* * *</p>

<p>Nanda Kumāra Swami arrived from Africa. He gave a depressing report on ISKCON’s Africa mission. He said Brahmānanda Swami is struggling very hard but meeting with little success.</p>

<p class="verse">* * *</p>

<p>Hansadūta Swami’s two Mercedes buses finally came in from Germany, via Vṛndāvana, to considerable fanfare and interest from the devotees. Akṣayānanda Swami also accompanied them.</p>

<p>The bullock cart party sent out from Hyderabad has also arrived, successfully completing a journey of some fifteen hundred kilometers.</p>

<p class="verse">* * *</p>

<p>The beautiful moon rose at 6:20 p.m. Brilliant and full in the sky, it bathed the countryside in its cooling luminescent rays, symbolizing the transcendental appearance of the Lord and the fulfillment of His mission.</p>

<p>Prabhupāda broke his fast, taking <em>prasādam</em> at 7:45 p.m.</p>

<p>The grounds and temple were mobbed with pilgrims. It was virtually impossible to go down into the temple room, and the narrow road to the front gate was jammed with tens of thousands of Vaiṣṇavas.</p>

<p>At one point Prabhupāda sent me out to see how many visitors had come, and he was very, very happy to hear of the large crowds. Typically, he wanted assurance that <em>prasādam</em> was being distributed to all.</p>', '', '1976-03-16', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- March 17th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 17th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>During his morning walk on the roof, Prabhupāda heard a brief report of yesterday’s festival. He was extremely pleased. Crowd estimates ranged up to 200,000 visitors. Prabhupāda said that’s why he had originally planned four buildings as well as a temple.</p>

<p>Turning to Jayapatāka Mahārāja he told his entourage of GBCs and new <em>sannyāsīs</em>, “All this credit goes to Jayapatāka Mahārāja. Yes. He is struggling from the very beginning. Others who were in the beginning, they have all gone away.”</p>

<p>He also heartened Tamal Krishna by declaring, “Next year the Chinese men must come!”</p>

<p>As he strolled around the perimeter of the roof, Prabhupāda switched to his favorite topic, science and the theory of chance. He said that the scientists cling to their various theories, even though they lack proofs and are constantly defeated by the superior power of God.</p>

<p>Yaśodānandana Swami offered the French philosopher Voltaire as a prime example of stubbornness. He was an atheist. When a Catholic priest came to him and asked, “Why don’t you accept God?,” he refused. But at the end of his life he became crazy, driven to consuming his own stool and urine.</p>

<p>Prabhupāda laughingly depicted the intransigence of the scientists with a funny story about “scissor philosophy.” One man declared that a piece of paper had been cut with a knife. A second said no, it was done with scissors. An argument ensued, and the first man, being stronger, took the other to a river. There he told him, “Now, if you don’t agree that it was a knife I shall throw you into this water!”</p>

<p>The other continued to insist, “It was scissors!”</p>

<p>So he was tossed into the river and began to drown. Still he would not concede. As he disappeared, his hand emerged from beneath the surface with two fingers moving together like a pair of scissors. “No, it is scissor! It is scissor!”</p>

<p>To loud laughter, Prabhupāda thrust his hand into the air and wiggled his fingers in imitation, both charming and entertaining us as he told us this was the definition of a rascal—even thought he is losing his life, still he obstinately refuses to accept the superior force of God. This is the typical materialistic scientific mentality.</p>

<p class="verse">* * *</p>

<p>In the late afternoon, two letters from Siddha Svarūpa and Sudāmā Vipra Swamis were delivered to Prabhupāda’s room. They both departed abruptly on the eve of Gaura Pūrṇimā after a violent, unprovoked incident in which Sudāmā Vipra punched Caru dāsa in the stomach as he descended the stairs, knocking him to the floor.</p>

<p>Sudāmā Vipra’s letter claimed that Caru is involved in a plot, led by Madhudviṣa and Gargamuni Swamis, to kill Siddha Svarūpa. If anything were to happen to Siddha Svarūpa, Sudāmā Vipra threatened, there would be what he called a “fratricidal war,” and Madhudviṣa would be killed.</p>

<p>Śrīla Prabhupāda shook his head in disgust. He didn’t believe the accusation, and he said Sudāmā Vipra was crazy. Calling him a first-class <em>guṇḍā</em>, or thug, he instructed Puṣṭa Kṛṣṇa Mahārāja to keep the letter on file as a precaution.</p>

<p>Siddha Svarūpa’s letter was apologetic, but agreed in principle with Sudāmā Vipra’s. Under the circumstances he wrote, he found it impossible to remain in Māyāpur.</p>', '', '1976-03-17', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- March 18th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 18th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Prabhupāda followed his usual program.</p>

<p>He had us discuss the position of the sun and moon during his walk, contrasting what the scientists say with the statements of the <em>Śrīmad-Bhāgavatam</em>.</p>

<p>As a simple example of how planets move in relationship to each other, he pointed to a tree. He explained that all the planets are like the branches in relation to the trunk. Their positions are fixed and the whole structure is moving, rotating around the Pole star. And the sun is moving on its own course around the whole thing. He confirmed that the <em>Bhāgavatam</em> describes the moon as a self-luminous planet covered with a cooling atmosphere, not a reflective one. Because it is further away than the sun, it is not as bright.</p>

<p>Śrīla Prabhupāda presents himself as a layman, and of course, we are not experts in science either, but still, it is clear that the modern theories cannot match up to Śrīla Prabhupāda’s exegesis of the Vedic literatures. It is apparent that most things taught in the schools and colleges on these subjects are bogus.</p>

<p>Tamal Krishna had a sudden realization of the revolutionary nature and importance of Śrīla Prabhupāda’s future plans for Māyāpur. “The scientists are getting smashed to bits by your statements, Śrīla Prabhupāda. This destroys their whole theory... I think that this Māyāpur building, we must build a big planetarium in it.”</p>

<p>“Yes. That I am going to do, Vedic planetarium.”</p>

<p>“Oh, boy. You’re going to bring a lot of... A lot of scientists will come here just to dispute this.”</p>

<p>“Yes,” Prabhupāda agreed. “World people will come to see the way the planetary systems... .”</p>

<p>“We should advertise it very widely that this is the actual, factual explanation of the universe.”</p>

<p>“This will be automatically advertised,” Prabhupāda told us. “As soon as the temple is finished, people will come like anything.” Then he started laughing. He summed up his approach to the scientists. “The thing is, on principle, we shall only go against them. On principle. Whatever they say ‘Yes,’ we say ‘No.’”</p>

<p>We all laughed in appreciation. Śrīla Prabhupāda is a genuine revolutionary. He has a clarity of vision that is unlimited in scope. He is challenging the whole of the world’s scientific community without any fear or doubt.</p>

<p>And there are no doubts in our minds about him. Prabhupāda is out to change the world, and there is nowhere we’d rather be than right here with him.</p>

<p class="verse">* * *</p>

<p>The day was peaceful, and the devotees were happily content to see Prabhupāda during class and for <em>darśana</em>.</p>

<p>Immediately after class all the devotees gathered on the lawn at the side of the temple for a group photo, forming a huge U, with Śrīla Prabhupāda in the center.</p>

<p class="verse">* * *</p>

<p>Some devotees are now beginning to leave for Vṛndāvana for the second leg of the festival.</p>', '', '1976-03-18', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- March 19th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 19th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Prabhupāda had a lot to say this morning on his walk about the poor standards of today’s education and civilization. One of the devotees began to object, “But they will say...”</p>

<p>Prabhupāda quickly replied, “They say anything because they are rascals. <em>Pagale ki na bale chagale kiba na khaya:</em> ‘A madman, what he does not say? And a goat, what he does not eat?’”</p>

<p>He went out onto the front road to inspect the new paintings being done on the wall. On the whole, he liked the style, but he said Pāṇḍu should use brighter colors. The present ones are too dark. “It is India,” he said, smiling. “It is not London, always foggy!”</p>

<p class="verse">* * *</p>

<p>Prabhupāda reminded his new initiates, and all of us, in class about the good opportunity he has given us through initiation to cross over to the other side of the river of death.</p>

<p>Prabhupāda especially stressed that we should not fall back. “We finish all the resultant action of contamination of this material life, provided we remain without being fallen again. Therefore there is <em>dāsa-vidha-nāmāparādha</em>. You know the ten kinds of offenses.</p>

<p>“So if you chant Hare Kṛṣṇa <em>mantra</em>, being careful not to commit the ten kinds of offenses, then you are immediately liberated. The most dangerous offense is if we think that ‘I am so fortunate. I have got this <em>hari-nāma</em> and it can vanquish all kinds of sinful reaction, so very good instrument. So I go on committing all kinds of sinful activities and chant Hare Kṛṣṇa. Then it will be neutralized.’ This is the most dangerous offense.<em> Nāmnād balād yasya hi pāpa-buddhiḥ</em>. Because I know that by chanting Hare Kṛṣṇa I shall be free from all resultant action of sinful life, let me go on, and throughout whole day I shall commit all kinds of sinful activities and in the evening I shall chant Hare Kṛṣṇa. Then everything will be finished. This rascaldom is very, very dangerous.</p>

<p>“We must be very careful. Don’t take the Hare Kṛṣṇa <em>mantra</em> as an instrument to neutralize your sinful activities. It is a fact that as soon as you are initiated with the Hare Kṛṣṇa <em>mantra</em>, you become free, but don’t commit it again.”</p>

<p class="verse">* * *</p>

<p>Māyāpur is again peaceful. Most of the pilgrims have returned home, many of our devotees have left, and work has recommenced on the new building.</p>

<p>Prabhupāda was sitting quietly in his room, relishing the blissful atmosphere created by the melodic Bengali <em>kīrtana</em> floating out from the temple room below. He told us the chanting is the only solace; it is nothing material. He even suggested that five hundred men at a time could come here to Māyāpur simply to chant.</p>', '', '1976-03-19', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- March 20th 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 20th 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Before the festival a man named Prabhu Svarūpa came to Māyāpur to see Prabhupāda. He requested ISKCON’s involvement at a place called Haridāspur, just on the border with Bangladesh. Śrīla Prabhupāda agreed to visit there with his foreign disciples, and so today he left by car in the early morning, a drive which took three hours.</p>

<p>Haridāspur is named after Haridāsa Ṭhākura, the great <em>ācārya</em> of the holy name, to commemorate his stay there.</p>

<p>The man’s <em>āśrama</em> turned out to be a small cottage situated on six <em>bighas</em> (two acres) of land, on the outskirts of the village, with a small, run-down shrine to Ṭhākura Haridāsa.</p>

<p>Prabhupāda spent four hours in a derelict, single-room, brick building with only gaping holes for a roof, door, and windows and an uneven, overgrown, earthen floor. We had to hang our <em>chaddars</em> over the openings to give him some privacy while he took his breakfast, massage, bath, and lunch, all in the same place.</p>

<p>Other devotees also came in several buses and were entertained by Gurudāsa Mahārāja, who told them stories of Haridāsa Ṭhākura and Lord Caitanya.</p>

<p>After his lunch, Prabhupāda gave a brief, fifteen-minute speech to the small crowd, comprised mainly of our own devotees. Then he left.</p>

<p>After Prabhupāda’s speech, <em>prasādam</em> was served. It was cooked locally in mustard oil, and later in the day many devotees were reported to be suffering diarrhoea from it.</p>

<p>Despite the inconvenience, the poor reception, and the long drive, Śrīla Prabhupāda had no complaints. He was merciful and kind to Prabhu Svarūpa and asked him to work with Jayapatāka Swami to let us gradually help to develop the place.</p>

<p class="verse">* * *</p>

<p>Prabhupāda decided when he got back that he will not go on TSKP with Hansadūta Swami because the strain of traveling by road is too much for him. But he encouraged Hansadūta to continue on with his plans to tour and preach throughout India.</p>

<p>We were back in Māyāpur by late afternoon. Śrīla Prabhupāda had a brief rest and then allowed the devotees to come for <em>darśana</em>. He was relaxed and peaceful, appreciative that so many young Westerners have come so far and done so much for spreading Kṛṣṇa consciousness. Yet he hardly acknowledged his own great sacrifices.</p>

<p>His presence alone generates a pleasing atmosphere of transparence and sobriety. The devotees crowd his room just to be there with him, regardless of what he says. But he always has something valuable to say, a lesson to teach, another insight to offer. A year’s hard work is fulfilled simply by being with him for a few minutes. And to be with him here in Māyāpur, the spiritual world, is an added bonus.</p>

<p>Today he talked about the present generation and why so many have become hippies, rejecting all the so-called comforts offered by their parents. He said that the fact that young people are adopting lower standards is an indication that such a so-called civilization actually stems from irreligion. Lacking guidance, women have become uncontrolled and have fallen prey to lusty men, with <em>varṇa</em>-<em>saṅkara</em>, or unwanted, irresponsible children the direct result.</p>', '', '1976-03-20', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


END $$;
