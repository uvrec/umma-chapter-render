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


  -- February 26th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'February 26th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>During the morning walk, Jayapatāka Mahārāja commented that it seemed easier to preach and make devotees in Bengal than other places in India.</p>

<p>Prabhupāda agreed, telling us that Bengali culture is much adored all over India. The guru of Mahātmā Gandhi had even said, “Whatever Bengal does today, other provinces will think tomorrow.” He said that many leading figures in recent Indian history were actually Bengalis, then he named a few: Surendranath Bannerji, who started the Congress party in 1887, Vivekananda, Ravindranath Tagore, and Aurobindo Ghosh.</p>

<p>Prabhupāda said that Aurobindo was actually born in England, but later he turned against the British. At one time Aurobindo seriously practiced yoga. However, later he had some connection with a French woman and became quite fat. Prabhupāda said that meant that from a yogi he became a <em>bhogī</em>, or a sense enjoyer. He said that then the next stage is <em>rogī</em>, diseased. So yogi, <em>bhogī</em>, and <em>rogī</em>.</p>

<p>That reminded me of something amusing I had been told when I first joined the Sydney temple in 1972. I brought it up to see if Prabhupāda would confirm it. “A yogi passes stool once a day, a <em>bhogī</em> twice, and a <em>rogī</em> more.”</p>

<p>Prabhupāda stopped and smiled. He raised his eyebrows quizzically. “Who told you?”</p>

<p>Jayapatāka laughed. He said that some of the devotees deliberately held their stool until the next day in order to be a yogi, even though it gave them stomach ache. Everyone laughed, Śrīla Prabhupāda as well, but with a little surprise. “<em>Acchā?</em>”</p>

<p>As usual, and much to everyone’s delight, he had a phrase and a story to enlighten us further on the foolishness of imitation. “That is called <em>makṣi manda kanāni</em>. A clerk was making a ‘fair book’ [good copy] from the ‘rough book.’ So he went to the toilet room and he was... like this.” At this point he made grabbing motions in the air. “So all of a sudden his boss came. ‘What are you doing here?’</p>

<p>“‘Sir, I am trying to capture one fly.’</p>

<p>“‘And why?’</p>

<p>“‘No, I am making the fair copy of the book. But in the original book, there is a fly smashed. So I have to paste one fly.’”</p>

<p>We all laughed heartily as Prabhupāda chuckled and added, “There are such fools. <em>Makṣi manda kanāni</em>. There is a fly pasted. So in the fair copy there must be a fly, paste.”</p>

<p class="verse">* * *</p>

<p>Śrīla Prabhupāda often quotes the teachings of Prahlāda Mahārāja in his conversations and letters, and he seems to derive great inspiration from his prayers.</p>

<p>In this morning’s <em>Śrīmad-Bhāgavatam</em> verse, Prahlāda Mahārāja declared that only Kṛṣṇa can give us permanent protection. Loving parents cannot save a child, a physician cannot save a patient, and a boat cannot save a drowning man. Śrīla Prabhupāda gave many appropriate analogies to elaborate upon Prahlāda’s statements.</p>

<p>“The human life means if somebody is being killed, so he should be immediately taking warning, ‘Oh, my turn is coming. Let me go away.’ There is one story in this connection. Not story, these are facts. A hunter spread his net. So some little birds, they fell down in the net and they are crying. So the father, mother when they came, they saw that their children are in danger. ‘It is caught by the net of the hunter.’ So mother immediately jumped over it to save the children, and she was also captured. Then the father saw. ‘If I go to save them, I’ll be captured. Let me go away. Let me take <em>sannyāsa</em>. That’s all.’”</p>

<p>We all laughed.</p>

<p>“That is intelligence. You cannot give protection to your family, to your society, to your... No, you cannot give. That is not possible. They must die. They must be captured by the network of <em>māyā</em>. You cannot save them. If you want to save them, then make them Kṛṣṇa conscious. That is the only remedy.”</p>

<p>Śrīla Prabhupāda emphasized his point by describing practical examples from his disciples’ preaching and from his own life. “And <em>udanvati majjato nauḥ</em>. Everyone is drowned, either you take figuratively or really. In the sea, ocean, there are always waves. So your tiny boat or big ship, that is not safe side.</p>

<p>“We have got experience. When I was going to New York on ship, I had no money to go by plane. So in the deep sea ocean, especially in the Atlantic Ocean, it was nothing, like a small ball, tottering like this. At any moment it can be capsized. Although very big ship with very big load, but it is nothing in the sea. So that is not sure. There is no surety that because you are in a big ship you’ll be saved—no.</p>

<p>“In your country, it happened, say, fifty, sixty years, the Titanic. In the first voyage, everyone was drowned, all big, big men. So nature’s freak is so strong, that you cannot say that ‘Because I have got a nice ship, I’ll be saved.’ No, that is not possible. Without Kṛṣṇa’s protection, all these counteracting measures will be all useless. Therefore teach people how to take shelter of Kṛṣṇa.”</p>

<p class="verse">* * *</p>

<p>There was a very amusing incident in mid-morning, when Prabhupāda had a visit from a <em>yogīnī</em>, Yogashakti Ma. She came smiling into Prabhupāda’s room, her long hair streaming over saffron clothing, accompanied by three male followers. She wanted to invite Prabhupāda to a World Yoga and Peace Conference they plan to hold. The address they gave was an apartment in Calcutta.</p>

<p>She expressed her hope that leaders of various yoga and peace groups could get together and exchange their different experiences to everyone’s benefit, so that the world could be a better place to live, where everyone could become happy. Of course, she would be at the center of it, as the organizer.</p>

<p>To this end she had issued a leaflet. One of her men read it out. It proclaimed “Health, Harmony, Happiness” through <em>jṣāna</em>, <em>dhyāna</em>, <em>bhakti</em>, <em>karma</em>, and so on. In other words, it was a hodgepodge of ideas with no real focus. She finished by saying that their goal was to serve God and humanity.</p>

<p>Hearing the bit about serving God, Prabhupāda called her bluff. “Who is God?” he asked her.</p>

<p>But neither she nor any of her followers could answer. One of them mumbled, “Hari Oà.” Another said something about the Creator and “love of us all.”</p>

<p>Prabhupāda continued in his matter-of-fact, simple, and direct manner. “If there is a toilet,” he said, “and you go there and throw some scent, does that make it a nice place? Trying to make the toilet a nice place is less intelligent. Kṛṣṇa says <em>duḥkhālayam aśāśvatam</em>. This material world is temporary and full of suffering, so trying to be happy here is simply a waste of time.”</p>

<p>He was going to continue but couldn’t. His analogy visibly shocked them. Yogashakti Ma had conjured up an image of attaining bliss on earth, and Prabhupāda frankly and abruptly shattered her sentimental vision.</p>

<p>They all took it like a slap in the face. One of the men became visibly disturbed. Speechless, he began to shake. Agitated and disturbed in mind, he wouldn’t stay a moment longer. He simply offered his respects, uttered “Hari Oà,” and got up and left. Yogashakti Ma and the others followed.</p>

<p>Śrīla Prabhupāda continued to sit at his desk, a smile gracing his face. He wasn’t concerned that his words had disturbed their idealistic notions. They were typical Māyāvādīs—in <em>māyā</em>. He had spoken the truth as revealed by God Himself, Lord Śrī Kṛṣṇa. If they couldn’t take it, it was no fault of his. He laughed. “By their <em>yoga-śakti</em>,” he told me, “they have one flat in Calcutta. We have no such <em>śakti</em>, and we have a hundred centers like this [Māyāpur]!”</p>

<p>Prabhupāda is simply wonderful. Others may or may not appreciate, but he cannot compromise the truth for anyone. His only interest is in serving Kṛṣṇa and Kṛṣṇa’s mission—nothing else. By Kṛṣṇa’s grace he is enjoying world-wide success. He has neither the need nor desire to have his name associated with anything that deviates from the strict principles of <em>bhāgavata-dharma</em>.</p>

<p class="verse">* * *</p>

<p>Kīrtirāja just arrived from Europe. He had traveled overland in the convoy of Mercedes vans with Gargamuni Swami. He has been preaching in Poland. A few people there have shown genuine interest in our movement. He said that the Polish people live very austere lives, as no luxury items are available. But they are avid readers. Therefore Kīrtirāja planned to print and distribute as many books as possible.</p>

<p>Prabhupāda was so eager to see this program started that he offered to give him a loan to begin printing books in Polish and Russian.</p>

<p>As for preaching in Europe, a letter from Mukunda and Bhaja Hari in London conveyed some interesting news. They confirmed that Harikeśa Swami has gone to Hungary on a two-week tour of yoga schools and clubs. Hansadūta spoke to him shortly after his arrival in London, and the next day he was off. The British devotees want him to remain in England and Europe to preach in the universities and colleges.</p>

<p>Prabhupāda approved. He expressed confidence in Harikeśa’s speaking and said that he could stay there. He also said that Harikeśa could read more books and preach now that he is a <em>sannyāsī</em>.</p>

<p>Their letter also mentioned several recent meetings with ex-Beatle George Harrison, who has allowed us the use of his large country estate, Bhaktivedanta Manor, at Letchmore Heath. Mukunda was one of the first devotees to meet with him, in the late sixties. The devotees are eager to arrange a more permanent arrangement with him.</p>

<p>George’s business manager advised him not to donate the property for tax reasons. So our men proposed he give us a ninety-nine year lease at £1 per year. George was agreeable to the idea but perhaps favored a shorter period.</p>

<p>Prabhupāda requested that they send him the lease agreement for approval.</p>

<p class="verse">* * *</p>

<p>As Prabhupāda relaxed on the balcony, Hridayānanda Mahārāja came out to see him. This is his first extended visit to India. He’s beginning to understand the significance and magnitude of the projects Prabhupāda has begun here.</p>

<p>He expressed his new-found enthusiasm and realization to Prabhupāda. “Your American disciples are beginning to appreciate the importance of India, Śrīla Prabhupāda. When we first arrived we could not understand why you were so busy here, but now we can see that it is the most important place on the planet!”</p>

<p>Prabhupāda looked at him gravely, raised his eyebrows, and replied decisively, “It is the most important place in the universe!”</p>

<p>Śrīla Prabhupāda has also instructed Hridayānanda Mahārāja to begin plans for the planetarium, based on the descriptions given in the Fifth Canto of <em>Śrīmad-Bhāgavatam</em>.</p>

<p>Although the title “Temple of Understanding” has been bandied about as a name for the new temple, Śrīla Prabhupāda rejected it as soon as Saurabha first delivered the plans. This morning, on his walk, he gave a proper title, revealing as well a little of his vision of its importance. He said it will be called the “Temple of the Vedic Planetarium.”</p>

<p>“We shall show the Vedic conception of the planetary systems within this material world and above the material world,” he said. “We are going to exhibit the Vedic culture throughout the whole world, and they will come here.”</p>

<p>In Bombay he had discussed with Dr. Patel the importance of combining culture and education. This is clearly why he has decided to establish the Vedic planetarium along with the temple here in Māyāpur, the world headquarters of his Kṛṣṇa consciousness movement. The temple and surrounding city will show people the Vedic culture, and the planetarium will educate them as to the scientific basis of the culture.</p>

<p>He explained, “Just like they come to see the Taj Mahal. They’ll come to see the civilization and the culture—the philosophical culture, the religious culture—by practical demonstration with dolls and other things.”</p>

<p>Jayapatāka Mahārāja suggested that every temple in the world could have a model of the proposed city to advertise the project.</p>

<p>Prabhupāda was enthusiastic. “Yes, actually, it will be a unique thing in the world. There is no such thing all over the world. That we shall do. And not only simply showing museum, but educating people to that idea. With factual knowledge, books; not fictitious.”</p>

<p class="verse">* * *</p>

<p>Tatpur dāsa, an Indian devotee stationed in Hyderabad, arrived to take <em>sannyāsa</em>. Previously he had written, requesting it, and Prabhupāda had sent an enthusiastic reply, inviting him to come to Māyāpur for the festival. He said he could then take <em>sannyāsa</em> and preach in Bengal. Prabhupāda is always eager to see his Indian disciples step forward and take up the responsibility of preaching here.</p>

<p>Meanwhile, Mahāvīra prabhu has had second thoughts, both on taking <em>sannyāsa</em> and staying in Māyāpur. He came to the roof during massage to ask Prabhupāda’s permission to return to Brazil. He obviously felt a little awkward, or perhaps embarrassed, that he now wants to leave Māyāpur after having caused so much agitation as a manager.</p>

<p>Timidly he approached Prabhupāda and began, “Prabhupāda, I know that it is the duty of the disciple to satisfy the desire of the spiritual master... ”</p>

<p>Prabhupāda immediately enjoined, “Yes, and it is my desire that you help manage Māyāpur.”</p>

<p>Mahāvīra’s discontent with his new assignment troubled his mind enough that he continued. “But Śrīla Prabhupāda, I think they need me in Brazil. I want to satisfy your desire, but I think I am better suited to Brazil.”</p>

<p>Prabhupāda still indicated that he wanted him here in Māyāpur. But finally, seeing Mahāvīra’s anxiety, he kindly consented to his return to South America. “All right, whether a <em>gopī</em> or a cow, both are serving Kṛṣṇa. Go to Brazil. You may serve there.”</p>', '', '1976-02-26', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- February 27th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'February 27th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Prabhupāda is not feeling well, yet he continues to receive visitors and take his walks. On top of a bad cold, he now has uremia again, so he is not taking rice.</p>

<p>His sister, who is still staying here, insists on cooking for him. But he complains that she uses too much chili and ghee, or sometimes heavy doses of mustard oil, which cause some digestive problems.</p>

<p class="verse">* * *</p>

<p>He didn’t talk much on his walk, but he nonetheless delivered a straight-to-the-point class. The verse described how every living being is acting under the influence of the modes of nature, which comprise Kṛṣṇa’s material energy, called <em>durgā</em>.</p>

<p>“<em>Durgā</em> means “fort.” We are packed up within this fort. You see the round sky. It is just like a football, and within, we are packed up. <em>Duḥ</em> means “difficult,” and <em>gā</em> means “going.” <em>Dur-gā</em>. So just like in the fort, in the jail, if you are put, it is <em>dur-gā</em>, very difficult to come out; very, very difficult. <em>Duḥ</em> means it is not so easy. You cannot enter in the fort or in the jail. Big, big walls, you cannot enter there without permission, and you cannot come out without permission.</p>

<p>“So this <em>durgā-śakti</em>, material energy, is very, very powerful. You cannot come out from this fort of material existence without superior permission. That is Kṛṣṇa’s permission.”</p>

<p>Prabhupāda explained that knowing everything to be Kṛṣṇa’s means we should offer it for His use. It is just like the devotees who bathe in the Gaṅgā; they scoop some water up and offer it back to the Gaṅgā. Similarly, Kṛṣṇa doesn’t need our offering, it is already His. But by our doing so, He becomes pleased with us, and thus we are released. If we don’t do this then we are “fool number one.”</p>

<p class="verse">* * *</p>

<p>Jagat Guru dāsa, another candidate for <em>sannyāsa</em> at the upcoming festival, arrived today from Africa via the Middle East. He came to the roof during massage to tell Prabhupāda about his recent preaching activities.</p>

<p>While in Dubai he met two brothers who are followers of the Vallabhācārya-sampradāya. They were impressed with Prabhupāda’s work, especially his books. As a result they had donated $12,000. But they requested their donation be given personally to Śrīla Prabhupāda.</p>

<p>Handing the money to Śrīla Prabhupāda, Jagat Guru questioned whether he should inform the Los Angeles BBT to credit the $12,000 to the African book bill. Brahmānanda Mahārāja had sent Jagat Guru through the Middle East specifically to collect money to pay off the BBT debts of the African <em>yātrā</em>, so Jagat Guru assumed the donation would be used for that purpose. Prabhupāda, however, said no. The money was a donation, and therefore separate from other collections. It could not be used to pay off book debts.</p>

<p>Jagat Guru was a little surprised. Because of Śrīla Prabhupāda’s quick response, he could hardly believe that Śrīla Prabhupāda had fully comprehended his statement and request. Shortly after, Jagat Guru repeated himself. But Prabhupāda remained firm. The money was a donation to his book fund, and Śrīla Prabhupāda had accepted it.</p>

<p>As far as the debt in Africa was concerned, he good humoredly said of Brahmānanda Swami, “We will not hang him, but he will have to work to pay off his debt.”</p>

<p>Prabhupāda said that his Guru Mahārāja had continually started big projects and kept the whole Gaudiya Math in debt in order to keep his men active and busy. And the disciple is always indebted to the spiritual master. He said that, anyway, to be in debt is not such a bad thing, because then the men will not become lazy.</p>

<p class="verse">* * *</p>

<p>Devotees in Hyderabad have been publishing an English newspaper called the <em>Hare Kṛṣṇa Explosion</em>. Generally a few advance copies of each issue are sent to Prabhupāda.</p>

<p>Some <em>sannyāsīs</em> have complained about a small article that appeared in the latest edition, Volume 21. The article was titled, “Hindus Converted to Muslims.” It explained how Muslims would sometimes convert Hindus simply by sprinkling them with water. Being bound by a very strict caste system, such persons were immediately ostracized from the Hindu community and forced to become Muslims. The article, which was simply a quote from the <em>Caitanya-caritāmṛta</em>, had no explanation, nor was it related to anything else in the paper. Acyutānanda Swami felt it inflammatory, especially in view of the community tensions in Hyderabad.</p>

<p>Prabhupāda agreed. The article was pointless, and he was upset about it. He immediately wrote a letter to Mahāàsa Swami ordering him to stop production. “You must stop circulation of this paper immediately. It is not being properly managed. Who is this rascal who is writing such articles? See to this immediately.”</p>

<p>He also criticized a children’s quiz that was included in the magazine, which offered prizes for participants. Prabhupāda said it was gambling.</p>', '', '1976-02-27', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- February 28th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'February 28th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Prabhupāda sat at his desk as he put on his <em>tilaka</em> this morning. He told us he was the very same man now as he was before. Previously he had been unable to do anything in India because he had no money. But now with his intelligence and our cooperation, he said that he could do something.</p>

<p>Moving from his room, Prabhupāda climbed up the stairs out onto the roof, picking up a small entourage on the way. As he walked around, glancing over to the new building site, he explained that our concern about money was not ordinary. He expanded his point with a very nice metaphor. He explained that his mission was to reunite Lakṣmī, the Goddess of Fortune, with Nārāyaṇa. In other words, the demoniac want to enjoy the property of God without God, or Sītā without Rāma. Just as Hanumān had worked to release Sītā from Rāvaṇa’s hands, Prabhupāda said that he was also working for the same purpose.</p>

<p>“We are not satisfied that Rāma should remain alone and Sītā should be under the custody of Rāvaṇa. I don’t want,” he said. “Sītā must be released from the custody of Rāvaṇa. With opulence it means we are bringing Sītā nearer, nearer, nearer... . That is wanted. Otherwise, for a <em>sannyāsī</em>, what is the use of these big buildings? No. We want these big buildings for service of Rāma.”</p>

<p>Kīrtirāja’s presence stimulated Prabhupāda’s thoughts about Communism once again. Prabhupāda analyzed the Communists’ attempts to wrest money from the capitalists. Although they claim they want to redistribute the world’s wealth to the poor class, in fact it is simply one Rāvaṇa taking from another Rāvaṇa. He said that there can be no benefit. He added that Communism has already failed. Kīrtirāja agreed. The poor were no better off. In Poland fresh food was scarce and expensive.</p>

<p>Prabhupāda also recalled that on his trip to Moscow in 1971 the only fruit available was strawberries. He concluded that they were being punished by nature, but because they are rascals they cannot see it.</p>

<p class="verse">* * *</p>

<p>Down in the temple room, sitting before an increasing number of Western devotees, Prabhupāda described the futility of trying to create unity in the world by mundane methods. Citing the United Nations as an example, he asked, “Where is the unity?”</p>

<p>He explained how previously there had been the League of Nations, then there was war. They made big plans again, but every twenty years or so there is another conflagration, especially in Europe. He said that they are simply demons, and our mission is to save them. “They have to give up the demonic activities. They have to take to Kṛṣṇa consciousness. Then they will be saved. So we are just trying to introduce the real civilization.</p>

<p>“Actually there is no civilization at the present moment. They are simply cats and dogs fighting one another. There is no civilization. Atheists, demons, they are predominating.</p>

<p>“And because they have got big, big skyscraper building and many motor cars, India has become victimized. ‘Oh, without this motor car and without this skyscraper building, we are condemned.’ They are trying to imitate. They have forgotten their own culture, the best culture, Vedic culture. This is the first time that we are trying to conquer over the demonic culture with this Vedic culture. This is the first time. So it is very pleasing that you have joined this movement.</p>

<p>“If you want to make the human society happy, give them this culture of Kṛṣṇa consciousness. That is being described by Prahlāda Mahārāja, that <em>saàsāra-cakra</em>. If you become involved in this demonic culture, then the <em>saàsāra-cakra</em>, the wheel of repetition of birth and death, will go on. You cannot stop it. It is not possible. But if you take to Kṛṣṇa consciousness, then there is possibility. This is the purport of this verse. Thank you very much. Hare Kṛṣṇa.”</p>

<p class="verse">* * *</p>

<p>More news on Chayavana Mahārāja arrived today. It appears that he left Krishna-Balaram Mandir to reside in Rādhā-kuṇḍa. There he was behaving very erratically, smoking <em>bidis</em>, clearly not in control of his senses. Finally, due to some immigration problems, he has now been arrested by the police.</p>

<p>During his massage Prabhupāda heard a letter sent by Chayavana from Rādhā-kuṇḍa, written just before he was arrested. He is clearly a very troubled soul. Commenting on his arrest, Prabhupāda said that he <em>should</em> be punished because he has committed so many sins. He said that this punishment would correct him. If he is not punished in this lifetime he will have to suffer in the future, so it is better that it happens now.</p>

<p>He explained how it is like a surgeon having to cut out a boil: it may be painful, but if dealt with immediately then one becomes cleansed. If left untreated, it will only give more trouble.</p>

<p>He said that for a devotee if there is an accidental fall-down Kṛṣṇa will excuse. But if the devotee persistently sins, then Kṛṣṇa will allow some punishment for his correction.</p>

<p class="verse">* * *</p>

<p>Around midday Śrīla Prabhupāda was sitting quietly in his room. A large, heavily built young man ran screaming along the veranda right past his window. A half-dozen other devotees, led by Gurukṛpa Swami, followed him.</p>

<p>Prabhupāda’s eyebrows raised in surprise. “What is that?”</p>

<p>I looked out the door and recognized the fugitive as a young American devotee who has been the subject of criticism over the last few days. Over six feet tall and about 250 pounds, he seems a little mentally slow, with a heavy overhanging brow and deep-set eyes that move evasively when he speaks. Although shaven headed and dressed as a <em>brahmacārī</em>, he claims to be a paid-up life member. Therefore, he considers himself exempt from doing any service in the <em>āśrama</em>. He has a room in the guest house, and his persistent refusal to do anything other than read Śrīla Prabhupāda’s books has created some resentment among the other devotees.</p>

<p>Prabhupāda sent me out to find out what was going on. It was quite a scene. The men had him hemmed into one corner of the balcony. He was fending them off and yelling at the top of his lungs, “He-e-elllp!” I saw Gurukṛpa kick him and several others tussling with him.</p>

<p>My presence made them aware that Prabhupāda was being disturbed by the commotion. So things quieted down, and Gurukṛpa came before His Divine Grace to explain what was going on.</p>

<p>The boy had gotten into a violent argument after refusing to do any service. The devotees were trying to forcibly remove him from the building. To avoid them, he tried to take refuge on Prabhupāda’s floor.</p>

<p>Prabhupāda considered the situation and presented his conclusion. He said that if visiting devotees wanted to read and chant exclusively, there was nothing wrong in it, at least here in Māyāpur. That is provided they were actually reading and not just using this as an excuse to sleep. However, he condemned the notion of giving money to the temple and then asking for life membership status. He remarked that this was simply business and not a proper devotional attitude.</p>

<p>Life membership is for uninitiated devotees, he said. If someone actually joins the movement, then he should surrender everything—his money, his intelligence, his life. That is real life membership. The business of the devotee is to give everything to the spiritual master and thus become his menial servant.</p>

<p>He said the boy should be allowed to stay and not be disturbed. Everyone filed out of his room. With a wry smile Śrīla Prabhupāda shook his head. “These boys are too sophisticated,” he concluded, referring to the “life member” <em>brahmacārī</em>.</p>

<p class="verse">* * *</p>

<p>A letter from an organizer of the Manipur Gītā Mandal came via Calcutta. They were requesting the names of all those planning to accompany Prabhupāda on his forthcoming trip to Imphal. Any foreigner requires a special “inner line permit” in order to enter Manipur.</p>

<p>After discussing with Śrīla Prabhupāda, Dayānanda sent our names and that of his wife, along with a suggested date of departure from Delhi of April 10th, 1976.</p>

<p class="verse">* * *</p>

<p>When he spoke with Kīrtirāja the other day, Śrīla Prabhupāda had approved certain plans for preaching in Poland. But upon hearing that Hansadūta had already formulated another strategy, he canceled his own suggestions. He told Kīrtirāja simply to follow the GBC’s instructions.</p>

<p>This policy of referring things for GBC approval, both individually and collectively, is something he is doing more and more. His Divine Grace often says that he wants to be relieved from management as soon as possible, not when he leaves the planet but long before, so that he can retire and write his books.</p>

<p class="verse">* * *</p>

<p>An increasing number of devotees are discovering the sweetness of evening <em>darśanas</em> in Prabhupāda’s room. The devotees rarely have an opportunity to associate with Śrīla Prabhupāda in such an informal and intimate setting.</p>

<p>Prabhupāda has been responding to their eagerness with some blissful recollections of his early days in America in 1965–66, including the difficulties he went through. This evening he told us that when he came to America he had not expected to remain long, as his original visa was valid for only two months. But for a year he continued to extend his stay: two months, two months, two months, each time thinking to remain a little longer and give things a try. He would go to the shipping agency and inquire when the next ship back to India was, but he would never go.</p>

<p>Eventually the clerk, a friendly Indian man, inquired, “Swamijī, you are asking, but actually, when you will go?”</p>

<p>Prabhupāda would laugh and tell him, “No. Actually I don’t want. But sometimes when I am a little disappointed, I think about it.”</p>

<p>Then as preaching opportunities started to unfold, he began paying a lawyer $150 a month to get his visa extended. Eventually he took a man’s advice and went to Montreal to apply for residence. Three months later he re-entered the country with his Green Card via SantaFe, New Mexico, where Subala had begun a center.</p>

<p>He went on to tell about his life on New York’s Second Avenue. He would stroll along the riverbank, unaware that the area was notoriously dangerous. Eventually someone informed him that sometimes snipers shot pedestrians there at random. “I was innocent,” he said. “I didn’t know they were killing people there.”</p>

<p>It was fascinating to listen to him reminisce about the early days of his mission.</p>

<p>Never self-laudatory, and always humble about his success, Śrīla Prabhupāda captivates his audience with his unique and remarkable character. He has a combination of youthful simplicity coupled with an astonishingly deep perceptiveness of human nature and life in general. He attributes everything to Lord Kṛṣṇa’s special mercy rather than to any expertise of his own. This selfless quality makes him irresistibly attractive, an ideal teacher, and our most trustworthy friend.</p>', '', '1976-02-28', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- February 29th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'February 29th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>In his lecture this morning Prabhupāda vividly described how the covering power of <em>māyā</em> influences a person’s sense of enjoyment. He explained that in Burma they have a drink called <em>naphi</em>. People keep special pots into which they place dead bodies of animals, which are then left to decompose. Later, after some years, the fluids are drained and bottled to be drunk at festivals.</p>

<p>When Śrīla Bhaktisiddhānta’s men opened a center in Rangoon, they cooked <em>purīs</em> in ghee. The neighboring people actually complained about the “horrible smell.”</p>

<p class="verse">* * *</p>

<p>After having spent some time in America and Europe gathering funds, men, and equipment, Gargamuni Swami arrived with his TSKP in a grand style. Their large, blue-and-white Mercedes vans came driving slowly down Bhaktisiddhānta road one after another, with mounted loudspeakers blaring out the <em>mahā-mantra</em>.</p>

<p>When they entered the front gate, Śrīla Prabhupāda came out on the veranda to see the spectacle, and all the devotees eagerly gathered around to greet them.</p>

<p>Gargamuni Swami rushed up to Prabhupāda’s rooms, where he enthusiastically described his future preaching plans. He showed Śrīla Prabhupāda a wonderful new aid for preaching he had bought in America—a portable eight-millimeter film display. It resembled a briefcase but it had a screen inside the lid, which was slotted for cassette films. The machine cost $250 and each cassette the same amount.</p>

<p>Each of his preaching parties is equipped with one. In this way they will be able to walk into any businessman’s office, show him a film about Kṛṣṇa consciousness, and then sign him as a Life Member. Gargamuni’s plan is to launch a bold new membership drive.</p>

<p>Needless to say, Śrīla Prabhupāda was enthusiastic. Fully enlivened, he called all the <em>sannyāsīs</em> to his room and told them to plan a tour route from village to village between the 15th and 26th of March. He said he would also participate.</p>

<p class="verse">* * *</p>

<p>Prabhupāda refused to allow Pisimā to cook for him any more—after eating her lunch yesterday he became ill and had to take rest at 8:00 p.m.</p>

<p>He called her in and told her to return to Calcutta. She argued with him. Then Prabhupāda shouted at her in Bengali and she became upset and started to cry. He was telling her to go, and she refused. Finally she got up in tears and left the room.</p>

<p>They have a very special, transcendental relationship. Apart from being Śrīla Prabhupāda’s sister (she even looks like him), Pisimā is also an initiated disciple of Śrīla Bhaktisiddhānta Sarasvatī and a great devotee of Lord Kṛṣṇa.</p>

<p>As he relaxed on his <em>āsana</em> afterward, he told me she should stay in Calcutta and look after their childhood Deities. He shook his head and laughed. “She has some idea of traveling with me. She thinks I am her brother. This is the problem. Therefore Caitanya Mahāprabhu took <em>sannyāsa</em>. Not because it changed Him as a person, but to get away from the family. Generally family members don’t take instruction. I was the same person before taking <em>sannyāsa</em> as after. I took <em>sannyāsa</em> for this reason. Otherwise, I could have done the same things without it.”</p>', '', '1976-02-29', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- March 1st, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'March 1st, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>There was lively discussion on the walk this morning about modern scientific theories.</p>

<p>Prabhupāda enjoys instigating debates. This way he not only exposes the flaws of the prevalent world view that everything is simply a chance combination of matter, but he also convinces us of the superior nature of Kṛṣṇa consciousness.</p>

<p>This morning Hridayānanda Mahārāja brought up a popular concept, commonly referred to as the atomic theory. He explained that this theory states that everything is constituted of different atoms; the ultimate truth is the atomic particle. By different combinations of these particles, different material manifestations are produced. According to this, there is no other cause except this endless combining of atomic particles.</p>

<p>Śrīla Prabhupāda questioned, “Where from the atom comes?” Then he went on to explain that the atomic theory is there in Vedic conception. It is called <em>paramāṇuvāda</em>. “This material, matter, everything, is a combination of atomic particles. Either you take earth or take water or air or fire, everything is a combination of atoms. That’s a fact. But we know that these atoms are coming out as the energy of Kṛṣṇa. <em>Bhinnā</em>. <em>Bhinnā</em> means the quality of different—not the same quality. <em>Apareyam</em>. ‘This is inferior quality, but there is another, superior quality, <em>jīva bhūta</em>, and that is the living entity.’</p>

<p>“So two kinds of atoms are coming from Kṛṣṇa: one is the spiritual atom, and the other is the material atom. So spiritual atoms, they are many, many times greater than the material atoms. And these material atoms are this universal, innumerable universes. Some of the spiritual atoms, when they want to enjoy independently, they are given the chance of enjoying this material atom. So in the material world it is combination of material and spiritual atoms. In the spiritual world, there is no material atom—everything is spirit.”</p>

<p>Prabhupāda said that the physicists have not been able to find out the spiritual atom. They are therefore puzzled, and their scientific research is incomplete. Although <em>Bhagavad-gītā</em> gives them information, unfortunately they will not take it.</p>

<p>Acyutānanda Swami said that because they are so sinful, they cannot see. He compared them to Duryodhana, in that Duryodhana was so sinful that even Kṛṣṇa personally could not convince him. He had no reservoir of pious activities to draw on.</p>

<p>Prabhupāda liked his comparison. He agreed, “The Duryodhana party, and we are Pāṇḍu’s party. So there must be war always, fighting. And they’ll be smashed.” He quoted <em>Bhagavad-gītā</em> (1.19). “<em>Hṛdayāni vyadārayat</em>. You know that? ‘Breaking the heart of Dhṛtarāṣṭra.’ So we have to make preaching in such a way to break the heart of this Dhṛtarāṣṭra company. Then it will be preaching.”</p>

<p>Prabhupāda mentioned that a description of the atom is given in the <em>Śrīmad-Bhāgavatam</em>. There it describes that six <em>aṇus</em> make one <em>paramāṇu</em>. It is this <em>paramāṇu</em> that the scientists are detecting. Prabhupāda concluded, therefore, that no scientist has a proper understanding of the atom.</p>

<p>Acyutānanda Mahārāja asked how they were able to make an atomic bomb if they didn’t know what the atom is.</p>

<p>Prabhupāda’s simple reply effectively removed his doubt. “Suppose if you can make a nice vegetable preparation, that does not mean you know everything of the vegetable. You are still rascal.” He pointed to the new building gradually being made manifest by the hired workers. “Just like this mason worker. They know how to set up the bricks and do nice work. But that does not mean they know where from the brick has come.”</p>

<p class="verse">* * *</p>

<p>In the verse for <em>Śrīmad-Bhāgavatam</em> class this morning, Prahlāda Mahārāja explained the futility of striving for a better material situation. People in general aspire for heavenly life, to live longer and enjoy greater standards of material happiness. But even the demigods became afraid merely by the movement of Hiraṇyakaśipu’s eyebrow. Yet Hiraṇyakaśipu was destroyed within a moment by Lord Nṛsiàha.</p>

<p>Prabhupāda told us therefore that we should avoid getting entangled in the pursuit of material enjoyment. Sex life is its pinnacle, but its result is simply troublesome.</p>

<p>There is an ever-increasing number of devotees attending class, many of them <em>brahmacārīs</em>. So when Prabhupāda told us it is better to avoid sex life altogether and remain <em>brahmacārī</em>, there was a collective response of “<em>Jaya! Jaya</em> Prabhupāda!”</p>

<p>“Either illicit sex or legal sex,” he said, “there are many, many sufferings. But those who are miser—miser means one who cannot use the benefit he has got, this human form of life—they know there are so many after-effects; they are not satisfied. “So the whole Kṛṣṇa consciousness movement is how to become <em>dhīraḥ</em>, selfless. Then life is successful. And anyway, don’t be involved, entangled, with these material things.</p>

<p>“This morning we were calculating that there are... as many atoms, so many living entities are also there, and there is struggle here. So in this human life the chance is how to get out of this material atomic combination and go back to home, back to Godhead. This is the chance.”</p>

<p class="verse">* * *</p>

<p>Hansadūta prabhu arrived in Māyāpur today with Pṛthu Putra Swami. He had stopped off in Vṛndāvana for a few days on his way from Europe by air. Meanwhile his <em>saṅkīrtana</em> buses are being driven overland through Turkey, Iran and Pakistan.</p>

<p>Now that the village-to-village <em>saṅkīrtana</em> program is about to commence, Prabhupāda is becoming more and more enthusiastic. Very keen “to do something wonderful in India,” he again called a meeting of all the senior men to make plans for traveling <em>saṅkīrtana</em>.</p>

<p class="verse">* * *</p>

<p>Jayapatāka Mahārāja purchased a concrete mixer for 17,000 rupees to help speed up construction of the new building. The work is now so far behind that Prabhupāda has ordered a double shift to begin immediately. He wants it to be ready for the festival, at least as far as sleeping accommodation goes, but it doesn’t appear possible at the present rate of progress.</p>

<p class="verse">* * *</p>

<p>I have contracted a heavy cold, the skin on my heels is deeply cracked, and I have a cut on my hand. Moreover, my left thumb joint is bruised, and my knees have become swollen and sore, with sacks of fluid on them, making it painful to kneel. I therefore have to use a pillow to cushion my knees when I massage Prabhupāda’s head. The physical discomfort is making it hard for me to focus my mind on my service. I must be more attentive to avoid offenses at Prabhupāda’s lotus feet.</p>

<p>Evening massage is also becoming difficult to perform. It has been getting increasingly longer each night. Every evening after the <em>pūjārīs</em> fumigate Prabhupāda’s bedroom with incense to drive out the mosquitos, Ānakadundubhi dāsa and I drape a large net around the bed. When Prabhupāda lies down to take rest at about 10:00 p.m., the lights go out. I slip under the net and perch cross-legged at his side to massage up and down his legs and feet as he softly slumbers.</p>

<p>Previously the massage lasted between a half an hour and forty-five minutes. But here in Māyāpur the sessions have been going on for an hour, or longer. Tonight it went on for over two hours, the longest ever. I left Prabhupāda’s room just after midnight.</p>

<p>I find it very difficult to sit in the dark, sweating under the mosquito net, breathing air thick with incense smoke with no breeze for relief, and with not a sound save Śrīla Prabhupāda’s soft snoring. It is difficult to stay awake on the job. Occasionally I do drift off, only to snap suddenly back to consciousness without knowing how long I have been out.</p>

<p>But tonight, by Kṛṣṇa’s grace, I was able stay awake by chanting <em>ślokas</em> within my mind. I remembered that in the <em>Gītā</em>, Kṛṣṇa called Arjuna Guḍākeśa, the “conqueror of sleep.” My little experience is giving me a glimpse of what a high degree of sense control is required to earn the title of Guḍākeśa.</p>

<p>Serving Śrīla Prabhupāda personally is sometimes very demanding; but it is extremely rewarding and always fully satisfying to the heart.</p>', '', '1976-03-01', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


END $$;
