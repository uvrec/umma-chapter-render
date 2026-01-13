-- ============================================
-- TD Volume 1, Chapter 10 - Verses
-- ============================================

DO $$
DECLARE
  v_book_id uuid;
  v_canto_id uuid;
  v_chapter_id uuid;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = 'td';
  SELECT id INTO v_canto_id FROM public.cantos WHERE book_id = v_book_id AND canto_number = 1;
  SELECT id INTO v_chapter_id FROM public.chapters WHERE canto_id = v_canto_id AND chapter_number = 10;


  -- March 22nd, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 22nd, 1976', 1,
    '', '', '', '',
    '', '', '', '',
    E'<p>At 5:30 a.m. Śrīla Prabhupāda descended the stairs amid a loud <em>kīrtana</em> and excited shouts from the devotees. He stepped into the back seat of the car, and we sped off for Calcutta, accompanied by an escort of six vans and one of Hansadūta Swami’s buses. Puṣṭa Kṛṣṇa Mahārāja drove our car, Tamal Krishna Mahārāja sat in front, and I sat in the back next to Prabhupāda.</p>

<p>It wasn’t too long before I began to nod off to sleep. Despite Prabhupāda’s objecting several times, and my own best effort, I just could not keep alert. Prabhupāda became so annoyed that he had Puṣṭa Kṛṣṇa stop the car and made me change places with Tamal Krishna, so that I sat in the front. After that embarrassment I stayed awake for the rest of the journey.</p>

<p>All along the route, as we passed through the small villages, young children came running out to see the convoy. They laughed, danced and waved as we went past, attracted by the loud <em>kīrtana</em> being broadcast from atop Gargamuni Swami’s vans.</p>

<p>We stopped off at the <em>āśrama</em> of Śrīla Lalitā Prasāda, the brother of Śrīla Bhaktisiddhānta Sarasvatī Ṭhākura. As the last remaining son of Śrīla Bhaktivinoda Ṭhākura, he is very old. His <em>āśrama</em> consists of a small temple and a few red-brick dwellings, none of which are well maintained. Prabhupāda talked for some time with him and some of his management committee. They discussed the plans he had for development of Śrīla Bhaktivinoda’s birth site. Nothing conclusive was arrived at with regard to their giving some land or even a lease on the property.</p>

<p>We all took <em>prasādam</em> before leaving, Śrīla Prabhupāda with Lalitā Prasāda and we disciples with the local devotees of the <em>āśrama,</em> up on the open roof. Jayapatāka Mahārāja, eager as ever to preach and advertise ISKCON’s worldwide missionary efforts, told a group of our hosts about our preaching in the West. They were all eager to hear, and Mahārāja tried to impress upon them the great need for Kṛṣṇa consciousness in all the countries of the world. He told them of a law recently passed in Sweden, which makes it no longer illegal for members of the same family to have sex with each other. He said they are becoming increasingly degraded, and only Lord Caitanya’s movement can save them. The simple Bengali Vaiṣṇavas were all shocked to hear such things. They were very appreciative of Prabhupāda’s preaching and his Western disciples.</p>

<p>After an hour or so, we departed, with nothing being positively decided.</p>

<p><strong>Śrī Śrī Rādhā-Govinda Mandir</strong></p>

<p><strong>3A Albert Rd., Calcutta 17</strong></p>

<p>Śrīla Prabhupāda gave a short, but very pointed, talk upon his arrival at the packed Calcutta temple. He first congratulated the <em>pūjārīs</em> for looking after the Deities so nicely. Then he went on to explain that these same Personalities, referring to Them by Their names in Māyāpur, Śrī Śrī Rādhā-Mādhava, are combined in the form of Lord Caitanya.</p>

<p>Having just come from the birthplace of Lord Caitanya, Śrīla Prabhupāda told his attentive, and mainly non-Indian, audience that it was Lord Caitanya’s desire that the inhabitants of Bhārata<em>-</em>bhūmi spread Kṛṣṇa consciousness all over the globe. Although it is the duty of the Indians, he said, Bhārata<em>-</em>bhūmi can be understood in a broader sense as well. “In one sense Bhārata-varṣa means this planet. Formerly there was one flag, Bhārata-varṣa<em>,</em> and the capital was Hastināpura. Gradually the control of the Pāṇḍavas declined. Up to Mahārāja Parīkṣit, the whole world was Bhārata-varṣa. Now it has become a tiny land, peninsula. So in that sense anyone who has taken birth on this planet, it is the duty of him to spread Kṛṣṇa consciousness. So by the grace of Kṛṣṇa, you European boys and girls, you have taken very seriously, and Kṛṣṇa will be very much pleased upon you.”</p>

<p>Prabhupāda expressed his regret that the Indian people are not taking the Kṛṣṇa consciousness movement seriously. He noted that even our immediate neighbors show no interest. Although they live in the same building, their only interest is making money, and dealings with them have sometimes been acrimonious.</p>

<p>He said that even the villages of Bengal are in “pitiable” condition. He condemned the attempt of modern leaders to convince the villagers that their conditions will improve by industrialization, causing them to give up their Kṛṣṇa conscious culture; the only result is misfortune.</p>

<p>Of course, being from Bengal, Śrīla Prabhupāda has watched the degradation of their culture over the decades, especially since independence. He ascribes this to their pursuit of Western materialistic ideals, and he made a plea to the room full of young Westerners now before him to help reverse the trend.</p>

<p>“Anyway, Calcutta is my birthplace, so you have kindly come here and are conducting this temple. I am very much obliged to you. I cannot remain here. I have to go here and there. Try to raise the standard of Kṛṣṇa consciousness, even there are so many inconveniences. I know. You are coming from a country where material conveniences are greater. But Caitanya Mahāprabhu has advised, <em>tṛṇād api sunīcena taror api sahiṣṇunā/ amāninā mānadena kīrtanīyaḥ sadā hariḥ</em>.</p>

<p>“So some of you, you have come with your big, big buses and vans to preach in India. You take Caitanya Mahāprabhu’s blessings and try to enlighten these people. The Bhārata-varṣī<em>,</em> the inhabitants of Bhārata-varṣa<em>,</em> naturally they are already inclined. Just like in the villages, when we were passing, the boys and children, they were also dancing. That is natural.</p>

<p>“Some way or other, this India is in a very precarious condition. So you have come, taking so much trouble. And take little trouble—there is no trouble; by the grace of Kṛṣṇa and Caitanya Mahāprabhu there will be no trouble. You’ll be happy. Try to preach this Kṛṣṇa consciousness movement in India at least for some time and help them to rise to their standard of Kṛṣṇa consciousness. Thank you very much.”</p>

<p class="verse">* * *</p>

<p>Calcutta temple is packed with devotees, and there is no running water. This is a continual problem, now exacerbated by the crowd of visiting devotees. In the best of times the water only comes on for a few hours each day.</p>

<p>We have to haul water to Prabhupāda’s bathroom and store it in a small tank. Most devotees are bathing in the lake across the road. So Śrīla Prabhupāda called for the new temple president, Abhirām dāsa, a tall American previously in charge of our Miami center. He told him to immediately install a new holding tank.</p>', '', '1976-03-22', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date,
    updated_at = now();


  -- March 23rd, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 23rd, 1976', 2,
    '', '', '', '',
    '', '', '', '',
    E'<p>Prabhupāda took his walk around the lake opposite the temple and inspected a large house on the corner of it that may be up for sale soon. Although it is run down, Prabhupāda was interested in buying it because of the lakeside location. A price of fourteen <em>lakhs</em> of rupees was mentioned.</p>

<p>He asked Abhirām to make the necessary applications to gain responsibility for beautification of the lake and its gardens and then gradually try to get permission to build a magnificent temple in the center of it. Since it is one of Calcutta’s most prestigious locations, a gorgeous temple on the lake would attract tens of thousands of people, he said. Śrīla Prabhupāda has ever-increasing plans for spreading Kṛṣṇa consciousness. Especially here in India he is keen to do something wonderful with the combination of Western money and Indian culture.</p>

<p class="verse">* * *</p>

<p>There was only one letter to reply to today, from Kīrtanānanda Swami, who reported his reason for not being able to attend the festival. The West Virginia state health authorities had placed a quarantine order on New Vrindaban because some devotees had become sick with jaundice. Kīrtanānanda Mahārāja said that some inimical state authorities overreacted to the situation. Now he thinks their community will be obliged to accept some regulation by the state authorities. His mood has been to keep things as simple as possible, but, as he admitted, “either due to their lack of vision, or our lack of expertise, simplicity has been taken for dirtiness.”</p>

<p>In his reply, Prabhupāda told him if it is necessary to make alterations he may do so. Yet, he clearly stated his opinion of the modern so-called sanitary arrangements in the West. “If the water supply is sufficient, there is no question of insanitation. Disease comes when there are dirty conditions.... Concerning the [existing] outhouses, if they are not approved then you can have a septic tank, or pass stool in the open field. I was doing that. I never liked to go to the nonsense toilet so I was going in the field.”</p>

<p class="verse">* * *</p>

<p>In the early evening Prabhupāda went to the Mullik’s house on Harrison Road, now Jatindra Mohan Avenue, in the area where he lived as a child. He was greeted enthusiastically by Kashinath Mullik, along with other Mullik family members and friends.</p>

<p>Prabhupāda was very, very happy to see Śrī Śrī Rādhā-Govinda, the original Deities Who had provided his spiritual inspiration as a small child. Although the area has changed considerably from his childhood days, and the little courtyard and shrine are quite run-down, the Deities are obviously still well-looked after and offered daily <em>pūjā</em>.</p>

<p>The Mulliks and the other friends were delighted to see him, although Śrīla Prabhupāda told us that most of his contemporary friends were now dead. Only one or two of those present were actually people he had played with in his childhood. He told us the Deities have been worshiped by the Mulliks for over two hundred years. At one time They owned the whole area. Even now the government building across the street is the property of Rādhā-Govinda.</p>

<p>In a short speech Prabhupāda recalled his childhood history. His family had lived just down the street behind a building called Govinda Bhavan, and as a three- or four-year-old he would come every day to see the Deities. “And that is the inspiration of my devotional life. Then I asked my father that ‘Give me Rādhā-Govinda Deity; I shall worship.’ So my father was also Vaiṣṇava. He gave me small Rādhā-Govinda Deity. I was worshiping in my house. Whatever I was eating, I was offering, and I was following the ceremonies of this Rādhā-Govinda with my small Deity. That Deity is still existing. I have given to my sister.</p>

<p>“So then I introduced Ratha-yātrā. My Ratha-yātrā was being performed very gloriously. My father used to spend money. In those days ten rupees, twenty rupees was sufficient. I hired one <em>kīrtana</em> party and all small friends, and there was another De family here, so we performed this Ratha-yātrā ceremony. According to our children’s imagination, it was very gorgeous.</p>

<p>“Gopishvara Mullik was my father’s friend. So he was criticizing my father that ‘You are performing Ratha-yātrā ceremony and you are not inviting us.’ So my father said, ‘That is children’s play. What shall I invite you? You are very big man.’ ‘Oh, so you are avoiding! In the name of children you are avoiding us.’</p>

<p>“On the whole, this Ratha-yātrā festival was very gorgeously performed. Then imitating me, the others, my brother, he also introduced Ratha-yātrā. And all of them introduced Ratha-yātrā, and the destination was this Ṭhākurbari, from there.</p>

<p>“So practically what I am doing now, the same thing, Rādhā-Kṛṣṇa worship and introduction of Ratha-yātrā. I am not doing anything else. You know very well. We are now performing Ratha-yātrā ceremony practically in all big cities of the world, in San Francisco, in Philadelphia, London, Melbourne, Paris. . . So the same thing, the same Rādhā-Kṛṣṇa worship and same Ratha-yātrā, in a bigger scale. But the same thing was begun as play from this quarter, this Ṭhākurbari.</p>

<p>“So this Ṭhākurbari, Rādhā-Govindajī, is my life. That is the beginning of my spiritual life. And after so many years, still Rādhā-Govindajī has dragged me. It is His kindness.”</p>

<p>Prabhupāda humbly suggested that his good fortune was due to his previous activities. He quoted <em>Bhagavad-gītā</em> 6.41, which states that the unsuccessful yogi takes birth in the family of the pious and prosperous. The De family, he said, was practically the same as the wealthy Mulliks, and his own father was a pure Vaiṣṇava. With these opportunities provided by birth, he said, he was simply developing them on a wider scale by Kṛṣṇa’s arrangement.</p>

<p>Looking lovingly at Śrī Śrī Rādhā-Govinda he ended his little speech. “So about this movement it may be said this Rādhā-Govinda Deity is the inspiration. You are all fortunate that you have come here. So let us offer our obeisances.” Prabhupāda humbly bowed down, touching his head to the floor. And then, amid much affection from his old friends, he climbed back in the car to return to his own recently established Rādhā-Govinda Mandir.</p>

<p>Driving back in the car we crept through the heavy evening traffic, with cars constantly honking and overcrowded, dilapidated buses blasting black sooty emissions into the atmosphere. Seeing the congested streets teeming with tens of thousands of people made me reflect upon how different it must have been in the first decade of the century when Śrīla Prabhupāda and his young friends roamed these precincts. At that time the transport would have been by horse and buggy or horse-drawn trams, and the population was much smaller. It must have been a vastly different Calcutta from the present.</p>

<p>Prabhupāda pointed out to Abhirām, Puṣṭa Kṛṣṇa and myself some the places of his childhood activities. He showed us his old school, attended before going to Scottish Churches College, and the field where as a boy he used to play soccer.</p>

<p>We came into what was formerly the old Muslim sector, and Prabhupāda told us that in 1911 there was a massive riot there, in which he was almost killed.</p>

<p>It was an exciting evening, made especially sweet by the opportunity to listen as Śrīla Prabhupāda mercifully shared his reminiscences of his younger days.</p>', '', '1976-03-23', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date,
    updated_at = now();


  -- March 24th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 24th, 1976', 3,
    '', '', '', '',
    '', '', '', '',
    E'<p><strong>New Delhi</strong></p>

<p>Prabhupāda took the first flight to Delhi, where he was met by a small band of devotees led by Gurudāsa and Lokanātha Swamis. Among them, surprisingly, was Chayavana, the errant <em>sannyāsī</em> from the African <em>yātrā</em>, now free again after his arrest in Rādhā Kuṇḍa.</p>

<p>Our host for the next few days is Mr. Laxman S. Agarwal, a short, balding man and the owner of one of India’s biggest businesses, Sylvania Light Company. Prabhupāda has stayed with him several times. Previously he helped to arrange for Śrīla Prabhupāda to meet with prominent government officials over the continuing visa problems of our American devotees.</p>

<p>He greeted Prabhupāda with a garland of marigolds and rupee notes, then led us out to his Mercedes, which he is allowing us to use for the next few days until Prabhupāda’s car arrives from Calcutta.</p>

<p>His modern two story semidetached house is located in the prestigious diplomatic enclave of Chanakya Puri, and is similar to what one would expect to find in a well-off Western suburb. Situated in a clean, neat cul-de-sac, it has marble floors throughout and a small high-walled backyard with a lawn. Right outside the front yard, the devotees have erected a small colorful <em>paṇḍāl</em> on the road’s central grassy reserve.</p>

<p>Śrīla Prabhupāda’s room is on the ground floor, about sixteen feet square. It’s quite comfortable, with an attached bathroom, wood paneling throughout, and French windows opening onto the back lawn. It is furnished simply with a small wooden bed, a low desk, and an <em>āsana</em>.</p>

<p>The Agarwals are devotees of Lord Kṛṣṇa and have a beautiful set of thirty-inch marble Rādhā-Kṛṣṇa Deities. They keep the Deities on the first floor of their home, and worship Them daily in a simple fashion.</p>', '', '1976-03-24', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date,
    updated_at = now();


  -- March 25th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 25th, 1976', 4,
    '', '', '', '',
    '', '', '', '',
    E'<p>For his morning exercise Prabhupāda took an easy walk up and down the grass reserve of the front street. He answered questions from his small band of listeners—Gurudāsa Swami, Atreya Ṛṣi, Chayavana, Puṣṭa Kṛṣṇa, Gopāla Kṛṣṇa, Yadubara, and myself.</p>

<p>Yadubara queried why devotees get sick if sickness is a punishment for those who violate God’s laws.</p>

<p>Prabhupāda’s answer was frank. “Devotees—to become a devotee is not so cheap thing. You don’t think that because you have got <em>tilaka</em> you have become devotee. Why do you think like that? “Bhaktivinoda Ṭhākura sang, <em>ei ta eka kalir chelā, nāke tilaka, galayā mālā:</em> ‘Here is another follower of Kali. He has got <em>tilaka</em> and <em>mālā</em>.’ <em>Sahaj bhajan kacen mamu, saṅga laiyā parer wala, ei ta eka kalir chelā:</em> ‘He is worshiping, <em>bhajan,</em> and taking another’s wife. Here is a servant of Kali. Simply he has changed his dress with <em>tilaka</em> and <em>mālā</em>.’ Bhaktivinoda Ṭhākura says.</p>

<p>“If you take <em>tilaka</em> and <em>mālā</em> and do all nonsense things, then you are not a devotee. You are<em>kali-chelā</em>. To become a devotee is not so easy thing.”</p>

<p>“Devotee means perfect,” Atreya Ṛṣi added.</p>

<p>“Oh, yes, certainly,” Prabhupāda said. “Devotee means he is above these material laws. That is devotee. <em>Brahma-bhūyāyakalpate</em>. He is in the Brahman stage. That is devotee. That means <em>sahajiyā</em>—‘Because I have got a <em>tilaka</em> and <em>mālā,</em> I have become devotee.’ This kind of cheating will not do.”</p>

<p>Chayavana seemed especially interested in the topic. Prabhupāda directly told him that if you do something that is forbidden, then you suffer; that is the law of <em>karma</em>. He said that a devotee follows Kṛṣṇa’s instructions. Kṛṣṇa is giving the real truth, and if one takes it he is a devotee; if one does not, he is a nondevotee.</p>

<p>Then what is the role of mercy, Puṣṭa Kṛṣṇa Swami asked, for those who take and those who don’t?</p>

<p>Śrīla Prabhupāda replied that mercy means, if either unknowingly or by some bad habit, one does some wrong, that will be excused. But deliberate transgressions, he warned, are not forgiven.</p>

<p>Gurudāsa Mahārāja asked what “unknowingly” means.</p>

<p>Prabhupāda explained. “Unknowingly means..., suppose you are a smoker. So now you have given up everything. But in the association of some smoker you incline, ‘All right, let me smoke.’ Then you regret, ‘Oh, I have done this.’ It can happen. So that is excused. “But if you think, ‘Now I am a devotee of Kṛṣṇa. I can smoke like anything, and everything will be excused,’ then you are a rascal.”</p>

<p>He said that the mercy of Kṛṣṇa is that He wants us to come back to Godhead even though we have no desire. If we take even one step forward, Kṛṣṇa will take ten steps toward us.</p>

<p>Then why is there punishment and suffering, another devotee asked. If God is all-loving, why does He make us suffer?</p>

<p>Prabhupāda told him Kṛṣṇa loves us, but if we don’t do what He says, then we must naturally suffer as the child is burnt by the fire when ignoring the advice of his father. Yet, he said, that suffering is also mercy because through such experience the soul will be purified and give up his enviousness of Kṛṣṇa. “So this question of freedom of <em>jīva</em> and control of Kṛṣṇa,” Atreya asked, “that there is freedom, but at the same time there is no freedom, is a very fine line between the two that sometimes we do not understand.”</p>

<p>“But why don’t you understand?” Prabhupāda rejoined. “Just like you belong to a free nation, America. Does it mean you are free to do anything and everything? When you say, ‘I belong to this free nation,’ then yes, you are free. But that does not mean that you can do anything and everything.”</p>

<p>It was a topic that devotees often debate: just how much independence does the individual soul have? Puṣṭa Kṛṣṇa Mahārāja pursued the point. If a person is habituated to smoking, is he free in that activity or has he surrendered his freedom?</p>

<p>It is like the person who smokes despite the government printing a warning on the box, Prabhupāda said. One is free to do it, but not free from the results. Therefore, the living entity has minute, but not absolute, independence. It is like a child who is free to play, but as soon as he does something wrong, his father is there to correct him.</p>

<p>Puṣṭa Kṛṣṇa Swami again took it further, wanting more clarification. “This idea of freedom and independence. Is it possible for anyone theoretically to surrender to Kṛṣṇa at any time?”</p>

<p>“Yes.”</p>

<p>“So, let’s say someone is in a very degraded condition of life, modes of ignorance and passion: his mind always disturbed. In surrendering to Kṛṣṇa, is it possible that he can be independent even of the mind?”</p>

<p>“You are independent of the mind always. It is <em>your</em> mind. You are not the mind. Then you are independent of the mind always.”</p>

<p>“So even a person merged in the mode of ignorance can by some good fortune surrender to Kṛṣṇa?”</p>

<p>“Not good fortune,” Prabhupāda told us. “God, Kṛṣṇa, says, ‘You do it. Here! Immediately you become fortunate.’ There is no question of waiting for becoming fortunate. You become fortunate immediately. Suppose if I say, ‘Take this bag, $100,000.’ You can take it. Immediately you become rich man. Why don’t you take it?”</p>

<p>Understanding Prabhupāda’s point that even good fortune is dependant on the mercy of the Lord, Gurudāsa Mahārāja asked how <em>kṛpā-siddhi</em> works.</p>

<p>Prabhupāda’s reaction took us all by surprise. “<em>Kṛpā-siddhi</em> means that you are not willing to take this bag of money. I say, ‘Take it! Take it! Take it!’” He suddenly turned and very vigorously pushed Gurudāsa in the stomach, as if he were trying to give him the imaginary bag.</p>

<p>Everyone broke out laughing, and Gurudāsa Mahārāja was simultaneously astonished and delighted at the sudden abrogation of the formal guru-disciple relationship. Śrīla Prabhupāda continued the mimicry and the pushing. He feigned resistance—“No!”—and then began pushing again. “That is <em>kṛpā-siddhi</em>. Even you are unwilling, I give you in your pocket, push it. That is <em>kṛpā-siddhi</em>.”</p>

<p>There is nothing dry in Śrīla Prabhupāda’s expression of philosophy. He makes the philosophy come alive because he lives it himself. In so doing he attracts us to use our little independence to surrender to his lotus feet.</p>

<p>Gurudāsa mentioned that since we see everyone in the world as potential devotees, we should also serve them so they can become devotees.</p>

<p>But Prabhupāda clarified the distinction between showing mercy and serving others. “That is not service. That is mercy.” He explained that although a devotee has a mood of service, Vaiṣṇava philosophy is that we serve the higher devotees and show mercy to the lower ones. He said the popular Māyāvādī idea that one should serve everyone is wrong.</p>

<p>This puzzled me because it says in the <em>śāstras</em> that the most advanced devotee sees himself as the lowest of all. So I asked that if that is so, then where is the question of the advanced devotee showing mercy to someone whom he sees as “lower”?</p>

<p>Prabhupāda replied that the advanced devotee does not see anyone as lower than himself, but his mood is one of sympathy, “Oh, here is a person, he can be a devotee. Let me raise him to the standard.” He concluded, “It is duty. It does not mean he is thinking ‘I am higher.’ No.”</p>

<p>“In other words,” Puṣṭa Kṛṣṇa Mahārāja added, “He doesn’t consider that he is advanced and that therefore he is showing mercy to lower.”</p>

<p>“Yes,” Prabhupāda affirmed. “He is always thinking, I am lower than the worm, but Lord Kṛṣṇa wants it, so let me do some service. That’s all.”</p>

<p>His comments made it clear it is simply a question of offering assistance to help another advance.</p>

<p>Prabhupāda illustrated his point through another comical exchange with Gurudāsa. “Therefore we say <em>prabhu</em>. <em>Prabhu</em> means ‘You are my master. Please order me. What can I do for you?’ That should be the attitude. Not, ‘Gurudāsa prabhu,’ [Prabhupāda said <em>prabhu</em> in an exaggerated fashion, with a bite of sarcasm in it] please come here and brush my shoes!’”</p>

<p>We all laughed again, perhaps recognizing something of ourselves in the parody, as he continued. “What kind of <em>prabhu!</em>? He should say, ‘Gurudāsa prabhu, can I brush your shoes?’ That is real Vaiṣṇava.”</p>

<p class="verse">* * *</p>

<p>There was no <em>Śrīmad-Bhāgavatam</em> class, since most of the devotees are staying across town, either at the temple or in hotels.</p>

<p class="verse">* * *</p>

<p>An unexpected visitor turned up in the afternoon: Mr. Alan Kallman from New York. He produced Prabhupāda’s first Hare Kṛṣṇa record in 1966. He arrived with a lady friend, and at long last gave Prabhupāda his royalties from the record’s sales. They amounted to about 170,000 rupees, to which he added a personal donation of $2,000. Although not a devotee, it was obvious that he has great admiration and respect for Śrīla Prabhupāda.</p>

<p>And Śrīla Prabhupāda, in turn, was very happy to see him, greeting him as an old friend. He had his guests sit while we fed them sumptuous <em>prasādam</em>. As they ate, Prabhupāda chatted very amicably with them and would not let them go until they had eaten everything. He smiled brightly all the while, clearly delighting his guests. He is expert at entertaining and encouraging people to increase their devotional service to the Supreme Lord.</p>

<p class="verse">* * *</p>

<p>In the evening Prabhupāda was invited to speak to the New Delhi Rotary Club at the Imperial Hotel. The meeting was held in a large, stately room where devotees had set up a small stage covered with a white cloth for Prabhupāda to sit on. Many important people from New Delhi’s social elite, as well as a half-dozen GBC members, gathered to hear his powerful lecture from <em>Bhagavad-gītā</em> 2.11.</p>

<p>First he explained the difference between Darwin’s idea of evolution and the Vedic concept. He then extensively described the difference between the body, the soul, and Kṛṣṇa. His presentation was well received, and a couple of thoughtful questions were raised at the end. “Swamijī, in our ancient books Kṛṣṇa has also been projected as a person who has lived for a certain period of history and who was associated with number of friends and relatives for a temporary time. Our books of literature also projected the Supreme Being as the Perfect One. How do you reconcile the two things? Your teachings are based on the assumption that that person who lived for that period of time is the Perfect Person. But how do you fundamentally assure that what He has said is correct? How do you reconcile the two points?”</p>

<p>Prabhupāda’s reply was lucid and thorough. “That I have already explained, that one has to understand Kṛṣṇa. I have already explained that if that person, Kṛṣṇa, whom you think that He lived for a certain period with friends and relatives just like ordinary man, if you simply study what is this person, then you’ll be confident. <em>Janmakarmacamedivyamyojānātitattvataḥ</em>.</p>

<p>“To understand Him in fact, it is not so easy. That is also explained in the <em>Bhagavad-gītā</em>. Out of many millions of persons, one becomes <em>siddha,</em> perfect. So that perfection is not complete perfection. That perfection means <em>ahaàbrahmāsmi</em>. ‘I am not this material body; I am spirit soul.’</p>

<p>“So one who understands this position of oneself is calculated as perfect, but in that perfect stage if one endeavors to understand Kṛṣṇa, out of many such millions of persons who are trying to understand Kṛṣṇa in perfection, one may understand. So it is not so easy.</p>

<p>“That factual understanding is possible. How it is possible? <em>Bhaktyā mām abhijānāti yāvān yaś cāsmi tattvataḥ;</em> only through devotion you can understand. So these problems will be solved when you become a devotee. Then Kṛṣṇa will reveal. You cannot understand Kṛṣṇa or His name, His form, His pastimes, His activities by your imperfect senses. But when you are engaged in His service, then He reveals Himself, ‘Here I am.’ So this is the process. If you want to understand that person, Kṛṣṇa, Who is accepted as the Supreme Personality of Godhead, then you have to take shelter of <em>bhakti-yoga</em> and associate with <em>bhaktas</em>. Then it is possible. Otherwise not.”</p>

<p>A second man had a question about Hitler and Gandhi’s philosophy of nonviolence. He said that at the time of the Second World War, Gandhi, who was also a great admirer of the <em>Gītā,</em> a great scholar and a great commentator on it, wanted not to fight Hitler, but to try to bring about a change of heart in him. He asked if that wouldn’t have been more effective than punishment? In other words, he implied that Gandhi felt punishment was a fault. It seemed the man had detected what he thought was a paradox because Kṛṣṇa instructs Arjuna to fight his enemies in the <em>Gītā</em> and Gandhi was for nonviolence.</p>

<p>Śrīla Prabhupāda explained that Lord Kṛṣṇa does not directly punish anyone, but everyone in the material world is subject to the punishment of <em>māyā,</em> the material energy. This is insurmountable; no one is excused. In other words, whether Gandhi wanted to fight or not, Hitler would still receive the karmic reactions for his activities. However, if one surrenders to Kṛṣṇa then one may avoid this punishment. Otherwise there is no other solution.</p>

<p>That concluded the evening’s proceedings, and after the Rotarians expressed their appreciation, Prabhupāda returned to Mr. Agarwal’s house.</p>

<p class="verse">* * *</p>

<p>Due to the hot weather, Prabhupāda had his bed and net set up in the backyard, where he took his rest in the cool night air. Mr. Agarwal took the opportunity to get his association and also had a bed and net set up alongside him. They chatted for a while before going to sleep.</p>', '', '1976-03-25', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date,
    updated_at = now();


  -- March 26th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 26th, 1976', 5,
    '', '', '', '',
    '', '', '', '',
    E'<p>Today is Ekādaśī.</p>

<p>During his walk out on the front road, Puṣṭa Kṛṣṇa Swami asked Śrīla Prabhupāda what would bring him the greatest pleasure. Without any hesitation, Śrīla Prabhupāda replied, “You all become fully Kṛṣṇa conscious, cent percent Kṛṣṇa conscious. People are suffering for want of Kṛṣṇa consciousness. Let them have this Kṛṣṇa consciousness and become happy. That’s all.”</p>

<p>Puṣṭa Kṛṣṇa Mahārāja also asked about Lord Caitanya’s prediction that the holy name will be spread to every town and village. He wondered to what extent that will come true. Does it mean a temple will be established in every town or just that preachers will travel there and tick it off as another place visited?</p>

<p>Prabhupāda told him that travel is essential, and if possible there should be centers. He asked, why just village to village? We should go door to door.</p>

<p>Then Prabhupāda gave a short class to the few devotees present. In the verse Prahlāda Mahārāja expressed the mood that Śrīla Prabhupāda himself epitomizes. “My dear Lord Nṛsiàhadeva, I see there are many saintly persons indeed, but they are simply interested for their own deliverance, and thus, without caring for big, big cities and towns, they go to the Himalayan forest for meditating, taking <em>anuvrata,</em> the vow of silence. They are not interested to deliver others. So far I am concerned, I do not wish to be liberated alone and leave aside all these poor fools and rascals. I know that without Kṛṣṇa consciousness, without taking shelter of Your lotus feet, nobody can be happy, and therefore I wish to bring them to You, to the shelter of Your lotus feet.”</p>

<p>Śrīla Prabhupāda said this is the mood of one who is perfectly convinced of the efficacy of the Kṛṣṇa consciousness movement. Those who preach must be convinced that without accepting Kṛṣṇa consciousness no one can be released from the stringent laws of material nature. Unfortunately the ordinary man is a <em>kṛpaṇa,</em> a miser, because he fails to use his human form for anything but sex indulgence, eating, and sleeping. So a preacher has to be merciful.</p>

<p>“By the grace of Kṛṣṇa you have to adopt such means that they may be interested a little about Kṛṣṇa consciousness. Otherwise they are so dull and miserly, they do not understand that the Kṛṣṇa consciousness movement is very, very important for them. They have no sense even to understand.</p>

<p>“But the preacher who is Kṛṣṇa conscious, he knows that without Kṛṣṇa consciousness these people are condemned. They cannot be happy. They cannot be liberated. They will simply remain within this material world, accepting one body after another. And whichever material body we accept, it is meant for suffering. It is not meant for any happiness.”</p>

<p>Śrīla Prabhupāda stressed the need for preaching and distributing Lord Caitanya’s mercy to everyone. “So only the Kṛṣṇa conscious devotee, he can deliver them. He goes from town to town, village to village, house to house, to bring this message of Kṛṣṇa and deliver him.</p>

<p>“Prahlāda Mahārāja is promising, ‘I do not wish to go alone. Give me some strength so that I can deliver some of them. It is not possible to deliver all of them.’ This is a very important engagement for a Vaiṣṇava. Bhaktivinoda Ṭhākura has written in his <em>Caitanya-śikṣāmṛta</em> that we can understand a Vaiṣṇava very nicely when we see that he has converted so many conditioned souls into Vaiṣṇava life. That is the estimation of a Vaiṣṇava. If I simply try for myself—I may be very advanced devotee—that is not very much appreciated by Kṛṣṇa.”</p>

<p>Śrīla Prabhupāda recalled that Śrīla Bhaktisiddhānta Sarasvatī Ṭhākura would become very pleased if one of his <em>brahmacārīs</em> went into Navadvīpa and sold a few copies of his daily newspaper. “Therefore we become very much engladdened when we see that some of our books and literatures are sold. They will read and be benefitted. So this is the mission of the high-class Vaiṣṇava, how to preach Kṛṣṇa consciousness among the suffering humanity, and this is the purport of this verse said by Prahlāda Mahārāja, and we are following the footprints of Prahlāda Mahārāja.</p>

<p>“Never mind, even if it is imperfectly done, we must execute the orders of Caitanya Mahāprabhu. I may not be so very expert in delivering the message of Kṛṣṇa, but my duty is to try to my best capacity how to distribute this knowledge to the suffering humanity.”</p>

<p>It is a fact that Śrīla Prabhupāda is absorbed twenty-four hours a day simply in this mood of trying to liberate as many conditioned souls as possible. His mind never deviates from it. Because of his determination, we are now here, engaged in the practice of Kṛṣṇa consciousness. And he constantly urges us to pursue this mood of being merciful to others, as our means to perfection.</p>

<p class="verse">* * *</p>

<p>Dhanaṣjaya prabhu, formerly the president of ISKCON Vṛndāvana, came to report on a new business he has set up in Vṛndāvana. With Prabhupāda’s financial backing and encouragement he is now overseeing the making of crowns and dresses for the Deities. He said the business is going well. Prabhupāda was happy with his efforts and asked him to repay the 20,000 rupees loan he gave him.</p>

<p class="verse">* * *</p>

<p>This was the first day of our <em>paṇḍāl</em> at the Ram Lila festival grounds. It was very well attended by nearly 4,000 people, a receptive crowd that asked many questions after Prabhupāda’s lecture. Prabhupāda stayed to see a play by the devotees, and he was much pleased by the whole affair.</p>', '', '1976-03-26', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date,
    updated_at = now();


  -- March 27th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 27th, 1976', 6,
    '', '', '', '',
    '', '', '', '',
    E'<p>Prabhupāda was driven to the Buddha Jayanti commemorative Park for his walk this morning. It is a spacious park with some natural rocky outcrops cleverly integrated with carefully cultivated patches of bright purple shrubs and groves of frangipani, neem, and banyan trees. Spacious lawns are divided by manmade waterways and connected by small bridges and dams.</p>

<p>Walking down the red, sandstone pathways that wind in and out of clumps of bamboo, bougainvillaea groves, and various types of shrubs, Śrīla Prabhupāda discussed an idea with Mr. Agarwal to transform an adjoining 100 acres of undeveloped land into a ‘Kṛṣṇa Jayanti Park.’ Mr. Agarwal reasoned that Lord Kṛṣṇa was a far more important and enduring figure in the history of India than Lord Buddha, so why not a park in His honor? Prabhupāda liked his idea and encouraged him to do it.</p>

<p class="verse">* * *</p>

<p>After breakfast Śrīla Prabhupāda held an excellent press conference wherein he spoke strongly to the reporters about the necessity of accepting the <em>Bhagavad-gītā</em>. He emphasized how unfortunate the people of India have become. Although they have access to a wonderful spiritual culture, they are avoiding Śrī Kṛṣṇa’s instructions, seeking material enjoyment instead. This, he said, is due to the influence of bad leaders, which they themselves have selected.</p>

<p>One reporter asked if Prabhupāda had been to see some other “spiritual leaders.”</p>

<p>Prabhupāda demanded to know why he should. When Kṛṣṇa’s words are there in the <em>Gītā,</em> why should he pander to rascals and cheaters?</p>

<p>It was a lively interview, with Prabhupāda pointing to the lack of interest in the <em>Bhagavad-gītā</em> as the primary cause of India’s difficulties.</p>

<p>The reporters asked intelligent, philosophical questions and appreciated his forthright answers and analysis. One of them asked if a disciple had ever disagreed with him on a spiritual matter. Laughing, Prabhupāda replied, “Not unless he is a fool, a damn fool!”</p>

<p class="verse">* * *</p>

<p>During his massage he answered an interesting inquiry from Prāṇada dāsa, a devotee in St. Louis. He wanted to know what the Vaiṣṇava perspective was on the Tantra <em>śāstras</em>. “Sometimes you cite these sastras as reference in your books, yet the conclusion of Tantric philosophy and its practices appear to be quite different than Vaisnava philosophy and practices. Are they in any sense correct or authoritative, and if so, what is the explanation of worshiping God as Mother (Divine) and their engaging in disciplinary activities which promote realization through sexual interplay and other prohibitions which we observe in our Krsna Society? Are these sastras considered ‘in pursuance of the Vedic version (ref. Nectar of Devotion).’ What is their status?”</p>

<p>Prabhupāda replied simply but conclusively. “The Vaisnava tantras are bona fide sastras, just like the Narada-pancaratra. But not the atheistic tantra which have nothing to do with the Vedic literature.... The point is that Krsna is the Supreme Personality of Godhead, and He is always purusa (male) not female (prakrti). Worship of the Mother as prakrti, is not recommended by Krsna for the intelligent class of men.”</p>

<p class="verse">* * *</p>

<p>In the afternoon, Mr. Surendra Kumar Saigal, the owner of the Tiger Lock Company, paid a visit. He requested Śrīla Prabhupāda to come to Aligarh to do a program. Prabhupāda quickly agreed, setting the date for March 30th. From there he will drive to Vṛndāvana.</p>

<p>Puṣṭa Kṛṣṇa Swami has also made arrangements with Balarāma Dāsa in Melbourne for Prabhupāda to go to Australia on April 18th. From Australia he will visit Fiji, Hawaii, Los Angeles, Detroit, Toronto, New Vrindaban, Washington, D.C., New York, and then London, Paris, Tehran, and then return to India. Thus, most of Śrīla Prabhupāda’s summer itinerary is now finalized.</p>

<p class="verse">* * *</p>

<p>Ṛddha Dāsa, from South Africa, finally arrived with Prabhupāda’s car after driving it cross-country from Calcutta. This evening he reported that his passport and some money was missing. Chayavana Swami has been seen hanging about in the front yard acting rather mysteriously. It is known he has no money, and circumstantially it seemed he might be the culprit.</p>

<p>Puṣṭa Kṛṣṇa Swami confronted him straight away with his suspicions, but he calmly denied any knowledge of it.</p>

<p>Chayavana has spoken already to Prabhupāda about his engagement. Prabhupāda told him to simply to chant and associate with devotees. Chayavana appears to be very disturbed.</p>

<p class="verse">* * *</p>

<p>Gopāla Kṛṣṇa took Prabhupāda out to see a property he is considering purchasing for a new temple. The present facility at Bengali Market, which in any event is woefully inadequate, has run out of lease and has to be vacated. Gopāla took him to a big house in a prestigious location. Some men showed him around and made various proposals, but later they turned out to be mere schemers trying to make some money as unofficial intermediaries. The site is actually owned by the American Embassy, and purchase of it can be negotiated only by a written bid directly to the State Department. Prabhupāda told Gopāla to go ahead and try for it.</p>

<p class="verse">* * *</p>

<p>The program at Ram Lila grounds had to be canceled today after a huge wind blew the <em>paṇḍāl</em> down. It was so badly flattened that it could not be erected again in time. It was a great disappointment, but nothing could be done.</p>

<p class="verse">* * *</p>

<p>In the evening there was another calamity. Because there was no program, Prabhupāda stayed back in his room. He gave <em>darśana</em> to a few visitors. Then at about 9:00 p.m., after everyone had left, he rose from behind his low desk to go to the bathroom. As he stepped down the few inches from the <em>āsana,</em> the carpet suddenly slipped out from under him. He fell with a crash on the wooden edge of the seat, ending up in a sitting position on the floor. It happened in a second and although I was seated directly in front of the desk, there was nothing that I could do. Helpless and shocked, I simply looked on as Śrīla Prabhupāda sat where he had fallen and rubbed his hip.</p>

<p>Amazingly, he uttered not a sound, neither when the carpet slipped, nor after the fall. He simply sat with his eyes closed for about ten or twenty seconds tolerating the pain he surely felt. Then with my help he rose to his feet. His foot was also injured, but without comment he walked to the bathroom. When he came out, he advised me that the carpet should be properly adjusted. But apart from this he made no reference to the incident again.</p>', '', '1976-03-27', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date,
    updated_at = now();


  -- March 28th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 28th, 1976', 7,
    '', '', '', '',
    '', '', '', '',
    E'<p>Mr. Agarwal hosted a program in the <em>paṇḍāl</em> in front of his house, which was well attended by his neighbors because it was Sunday morning. Prabhupāda enjoyed it, and so did the devotees. We were able to perform <em>guru-pūjā</em> and offer flowers personally to Śrīla Prabhupāda as he sat regally on the small stage upon a nicely carved and opulently upholstered wooden seat, provided for the occasion by Mr. Agarwal.</p>

<p class="verse">* * *</p>

<p>Ṛddha’s passport was found discarded under a car in the driveway, but 500 rupees was missing. Citsukhānanda revealed that he had lost 500 dollars at about the same time.</p>

<p>Circumstances seemed to indicate Chayavana as the possible culprit. So Puṣṭa Kṛṣṇa searched his belongings. He found a savings book from a Seattle bank with a deposit entry of $23,000 in it. He showed it to Prabhupāda, who said that the matter should be handled discreetly.</p>

<p>Considering the delicacy of the situation, Prabhupāda called Chayavana in. Not wanting to directly accuse him of any wrongdoing without proof, he began by preaching to him about helping to spread the Kṛṣṇa consciousness movement. He then suggested that if he had any money, he might like to help with the purchase of a house here in Delhi. Chayavana said he would be glad to help, but he had no funds.</p>

<p>Prabhupāda then called for the passbook and showed it to him. When Chayavana saw it he laughed and explained that it was all false. He faked it in order to show customs officials in Africa that he had sufficient means to support himself while in their country. Prabhupāda turned to Puṣṭa Kṛṣṇa Swami, who agreed that it could very well be. So Prabhupāda laughed and said, “You made it to cheat the <em>karmīs</em>, and now you are cheating us.” He therefore let the matter drop, and Chayavana left.</p>

<p>Because of economic hardship everywhere in India, the incidence of thievery by low-class persons is fairly common, and even in our temples it is fairly frequent. Even though condemnable, it is somehow understandable. But later, Prabhupāda made a telling comment. “I thought it was just the Indians, but now the Westerners are stealing as well.”</p>

<p>He is disgusted with the behavior of his wayward disciple, Chayavana. He told me very frankly, “This is why my Godbrothers criticize. These men come and insist, ‘Give me <em>sannyāsa,</em> give me <em>sannyāsa</em>.’ Why? What is the attraction? Then when they have it, they again fall down. One becomes a first-class thief and woman hunter, another goes back to his wife. What is the use of such <em>sannyāsa?</em> Chayavana is intelligent and was doing nicely in Africa, now he is a third-class thief. Ṛṣi Kumāra was such a nice <em>brahmacārī</em> and <em>sannyāsī</em>. I was expecting him to do something wonderful—now he is a demon.”</p>

<p class="verse">* * *</p>

<p>The Ram Lila grounds <em>paṇḍāl</em> resumed this evening and was a big success. After an excellent lecture by Śrīla Prabhupāda, over 8,000 rupees worth of books were sold. The audience sat entranced as the devotees staged a drama called “The Entrance of Kali.” Prabhupāda stayed to watch the play and truly enjoyed it.</p>

<p class="verse">* * *</p>

<p>A newspaper printed an excellent article today, the result of yesterday’s interview. Prabhupāda was happy with it because the reporter had accurately noted his main theme. The headline read, “Kṛṣṇa Forgotten in Land of His Birth.”</p>', '', '1976-03-28', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date,
    updated_at = now();


END $$;
