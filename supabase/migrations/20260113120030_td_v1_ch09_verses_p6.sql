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


  -- February 20th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'February 20th, 1976', 35,
    '', '', '', '',
    '', '', '', '',
    E'<p>Today is the appearance day of Śrīla Bhaktisiddhānta Sarasvatī Gosvāmī Prabhupāda, which we are all observing with a half-day fast.</p>

<p>The Gaudiya Math down the road has invited the Governor of Pondicherri to speak at its function, which is being held at the <em>samādhi-mandira</em> of Śrīla Bhaktisiddhānta. Jayapatāka Swami was supposed to ask the governor to visit our temple later, but somehow he failed to do so. The only way it could be arranged at this late date would be for Jayapatāka Mahārāja to go to the Caitanya Math this morning and ask the governor’s aide-de-camp.</p>

<p>Śrīla Prabhupāda decided against this because, as he jokingly put it, “The hosts are host-ile!” The Gaudiya Math didn’t invite Prabhupāda, and we have not invited them. “Anyway,” he said, “one book distributed in America is more important than the visit of any governor. In America we have never approached any politicians for support.”</p>

<p class="verse">* * *</p>

<p>Prabhupāda kept his usual schedule today with a walk, greeting the Deities, and class, on <em>Śrīmad-Bhāgavatam</em> 7.9.13.</p>

<p>He clearly defined the nature of our movement. “If we want to adjust this chaotic condition, then we require the incarnation of God. That is already there. <em>Nāma-rūpe kali-kāle kṛṣṇa-avatāra</em>. This Hare Kṛṣṇa movement is the incarnation of Kṛṣṇa in the form of name.</p>

<p>“The <em>saṅkīrtana</em> movement which was inaugurated by Śrī Caitanya Mahāprabhu, and Śrī Caitanya Mahāprabhu is Kṛṣṇa Himself. So this Hare Kṛṣṇa movement is not different from Kṛṣṇa or Caitanya Mahāprabhu. So if we take shelter of this holy name of the Lord, Hare Kṛṣṇa, then we shall be saved.”</p>

<p>He revealed also how the name of the temple here is a beautiful metaphor. It’s based on the statements of Śrīla Prabodhānanda Sarasvatī, one of the great devotees of Lord Caitanya, describing the temple’s purpose of saving the fallen souls. In Prabodhānanda’s <em>Śrī Caitanya-candrāmṛta</em> Lord Caitanya is compared to the full moon. He said, “The ultimate benefit of life is compared with the moon. So spreading Kṛṣṇa consciousness means spreading the moonlight. Therefore we have named this temple Śrī Māyāpur Candrodaya [The Rising Moon of Śrī Māyāpur]. Śrī Caitanya Mahāprabhu is Gaura-Hari, and Prabodhānanda Sarasvatī said, <em>sādhavaḥ sakalam eva vihāya dūrāt caitanya-candra-caraṇe kurutānurāgam</em>.”</p>

<p class="verse">* * *</p>

<p>Prabhupāda sent me down to the temple at 9:00 a.m. to see whether many visitors had gathered for the coming program in honor of his Guru Mahārāja. To my surprise, the temple was empty.</p>

<p>Prabhupāda then called for Hridayānanda dāsa Goswami to discuss why there were no visitors yet on such an important day. Hridayānanda Mahārāja said that it was probably due to the fact that the general public are not aware of the occasion. The festival had obviously not been well-advertised, because at Gaura Pūrṇimā tens of thousands of people come here during the festival week. Prabhupāda wasn’t very satisfied. He thought more should have been done to attract the public.</p>

<p>After an early massage Prabhupāda went down to the temple room at 11:10 a.m. He offered his obeisances to the large painting of Śrīla Bhaktisiddhānta Sarasvatī Ṭhākura that had been placed on the <em>vyāsāsana</em>. He seemed very satisfied to see the beautiful decorations. There were long, multicolored drapes hung along the back wall, as well as strands of marigolds draped around the <em>vyāsāsana</em>, and banana trees and leaves were placed all around.</p>

<p>Moving to the front of the <em>vyāsāsana</em> area, he sat comfortably on an <em>āsana</em> on the floor, with his back to the <em>jali-</em>work fence.</p>

<p>Acyutānanda Swami sang songs glorifying Śrīla Bhaktisiddhānta, notably <em>Ohe Vaiṣṇava Ṭhākura</em>.</p>

<p>Afterward Śrīla Prabhupāda gave a wonderful lecture requesting the devotees to do two things: help develop Māyāpur and distribute many books. He said this was his Guru Mahārāja’s desire. His Guru Mahārāja’s father, Śrīla Bhaktivinoda Ṭhākura, had rediscovered the birth site of Lord Caitanya, and it was his attempt to develop it. Then Śrīla Bhaktisiddhānta Sarasvatī Ṭhākura continued the effort. And now he and his Godbrothers were also doing what they could. “We have got great ambition to develop this place nicely and gloriously, and fortunately we are now connected with foreign countries, especially with the Americans. Bhaktivinoda Ṭhākura’s great desire was that the Americans would come here and develop this place and they would chant and dance along with the Indians.</p>

<p>“From this place Śrī Caitanya Mahāprabhu started this movement, and He desired that ‘As many towns and villages are there, this Kṛṣṇa consciousness movement should be spread.’ So this Kṛṣṇa consciousness movement is now in your hand. Bhaktisiddhānta Sarasvatī Ṭhākura, he wanted me to do something in this connection. He wanted from all his disciples. Especially he stressed many times that ‘You do this. Whatever you have learned, you try to expand in English language.’”</p>

<p>Prabhupāda told us how in 1935 he had gone to visit his Guru Mahārāja in Rādhā-kuṇḍa. At that time he had received some frank and revealing advice from his spiritual master which formed the basis of all his future endeavors.</p>

<p>“When he was in Rādhā-kuṇḍa, I was at that time in Bombay in connection with my business life. So I came to see him, and one friend wanted to give some land in Bombay for starting Bombay Gaudiya Math. He’s my friend. So that’s a long story. But I wish to narrate this, the Bhaktisiddhānta Sarasvatī Gosvāmī’s mission.</p>

<p>“Śrīla Bhaktisiddhānta Sarasvatī Ṭhākura Prabhupāda immediately took up the land. He continued that ‘There is no need of establishing many temples. Better we publish some books.’ He said like that.</p>

<p>“He said that ‘We started our this Gaudiya Math in Ultadanga. The rent was very small, and if we could gather two to two-hundred-fifty rupees, it was very nice, going on. But since this J. V. Datta has given us this stone, marble stone <em>ṭhākurbari</em>, our competition between the disciples has increased. So I don’t like any more. Rather, I would prefer to take out the marble stone and sell it and publish some books.’</p>

<p>“So I took that point, and he also especially advised me, ‘If you get money, you try to publish books.’ So by his blessing it has become very successful by your cooperation. Now our books are being sold all over the world, and it is very satisfactory sale. So on this particular day of Bhaktisiddhānta Sarasvatī Ṭhākura’s advent, try to remember his words. That he wanted many books should be published about our philosophy, and it should be given to the English-knowing public especially, because English language is now world language. We are touring all over the world. Anywhere we speak English, it is understood, except in some places.</p>

<p>“So on this day, particularly on the advent of Bhaktisiddhānta Sarasvatī Ṭhākura, I especially request my disciples who are cooperating with me that you try to publish books as many as possible and distribute throughout the whole world. That will satisfy Śrī Caitanya Mahāprabhu as well as Bhaktisiddhānta Sarasvatī Ṭhākura. Thank you very much.”</p>

<p>After his speech we gathered in front of the <em>vyāsāsana</em> and performed the <em>puṣpaṣjali-pūjā</em>, an offering of flowers. Prabhupāda had Acyutānanda Swami chant the four <em>praṇāma</em> prayers to Śrīla Bhaktisiddhānta Sarasvatī. Then, following Śrīla Prabhupāda’s lead, we offered a flower to Śrīla Bhaktisiddhānta Sarasvatī’s picture on the <em>vyāsāsana</em>. This procedure was repeated three times.</p>

<p>Prabhupāda then called for Bhānu dāsa, a Japanese-Canadian <em>brahmacārī</em> from the Nāma Haṭṭa party, to offer the <em>ārati</em>. The special feast cooked in Śrīla Bhaktisiddhānta’s honor was brought in and set out on low tables directly in front of the <em>vyāsāsana</em>. Śrīla Prabhupāda stood in front and played his <em>karatālas</em>, while Acyutānanda Mahārāja lead an ecstatic <em>kīrtana</em>, which had us all jumping high in the air.</p>

<p>During the <em>kīrtana</em> Prabhupāda asked me to gather a sample of every preparation onto his plate and take it up to his room. He wanted to check what the devotees had cooked to glorify his Guru Mahārāja. He also wanted to offer his own respects by taking Śrīla Bhaktisiddhānta’s remnants.</p>

<p>After the program finished, Prabhupāda returned upstairs and ate the feast. He was happy with all the arrangements, but he again appeared disappointed that only about 100 guests had come. In fact, during his massage, he had criticized the management for erecting such a large building and not inviting anyone to come—only local people, no one from Calcutta.</p>

<p>“Only the Deity program is going nicely,” he remarked. Referring to the two English identical-twin brothers who are the head <em>pūjārīs</em>, Prabhupāda declared, “The two brothers Paṅkajāṅghri and Jananivāsa—there is no comparison. Everyone should know, there is no complaint.”</p>

<p class="verse">* * *</p>

<p>In the afternoon two <em>sannyāsīs</em> from the neighboring Gosvāmī Math came to invite Prabhupāda to visit their temple tomorrow.</p>

<p>Earlier in the day, toward the end of the massage, a <em>brahmacārī</em> from his Godbrother Śrīdhar Swami’s <em>maṭha</em> had also visited. He had a short discussion with Prabhupāda about Śrīdhar Swami’s coming here to visit. The <em>brahmacārī</em> returned with a few others in the afternoon and held further discussions.</p>', '', '1976-02-20', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- February 21st, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'February 21st, 1976', 36,
    '', '', '', '',
    '', '', '', '',
    E'<p>Early in the morning Śrīla Prabhupāda called for Acyutānanda and Hridayānanda Swamis and requested them to go to the Gosvāmī Math to speak on his behalf. He told them to invite their devotees to come with us and preach from village to village. Since we have the finances and they know the language, it could be a very successful combination. Such a united preaching effort would benefit everyone—ISKCON, the Gaudiya Math, and the general public. He said to tell them that if there is a problem with the management of their temple, we shall provide all the finance necessary. They have only to come preach with us.</p>

<p>He observed that none of them are preaching, rather they are simply begging for money to support their temples. They have no preaching potency, and their forces are dwindling, so why should they not join us?</p>

<p>On his walk he discussed the idea further, stressing that money is no problem. They simply have to come and preach with us. Hridayānanda Mahārāja mentioned that before Prabhupāda went to the West, Indians were not interested in his message. But now that he has money, they are willing to listen. Prabhupāda agreed. “Money is the strength all over the world. America is prestigious. Why? They have got money. So I have got American disciples. Why shall I not have money? If a guru of the Americans remains poor, it is contradictory.”</p>

<p>His emissaries returned later in the day without any immediate response from the Gaudiya Math members. But in the evening a few men from the <em>maṭha</em> came to discuss his offer. Lately, Prabhupāda has been sitting out on the large lawn at the side of the temple in the early evening, and he received them there. Several of them were favorable, provided something could be worked out about looking after their <em>maṭha</em>. It would be a wonderful step toward a unified preaching effort if they agree to do it. It may indicate the beginning of a full merger with all the <em>maṭhas</em> over the next few years.</p>

<p class="verse">* * *</p>

<p>The verse for today’s class described how Prahlāda Mahārāja was not disturbed by Lord Nṛsiàhadeva’s killing of his father, just as a saintly person is not disturbed by the killing of a snake or a scorpion. Śrīla Prabhupāda retold an incident from his early involvement with the Gaudiya Math, which directly related to this verse. “A <em>sādhu</em> does not want to kill even an ant. But in the case of <em>vṛścika-sarpa-hatyā</em>, they are happy. <em>Vṛścika</em>, scorpion, and <em>sarpa</em>...</p>

<p>“So long, long ago, sometime in the year 1933 in this Caitanya Math, there was a big snake came out in my front. I was taking bath. Everyone was looking what to do. So Guru Mahārāja was on the upstairs. He immediately ordered, ‘Kill him.’ So it was killed.</p>

<p>“At that time, 1933, I was newcomer. So I thought, ‘How is that? Guru Mahārāja ordered this snake to be killed.’ I was little surprised. But later on when I saw this verse, I was very glad. <em>Modeta sādhur api vṛścika-sarpa-hatyā</em>. It remained a doubt, ‘How Guru Mahārāja ordered a snake to be killed?’ But when I read this verse I was very much pleased, that these creatures, or creatures like the snake, they should not be shown any mercy, no.”</p>

<p>Naturally one might question why saintly persons become glad to see a snake killed, and he explained that snakes are so envious that they will bite an innocent victim, even without provocation; they are so cruel.</p>

<p>Similarly, Cāṇakya Paṇḍita compared an envious man to a snake. “Cāṇakya Paṇḍita says, <em>sarpaḥ krūraḥ khalaḥ krūraḥ sarpāt krūrataraḥ khalaḥ</em>. Such person is called <em>khala</em>, envious, jealous. So there are two living creatures. One is snake, and one is jealous or envious person.</p>

<p>“This man, envious man, is more dangerous than the snake. Why? He’s a human being. Yes, because he’s human being and he has got developed consciousness and he has practiced to use the developed consciousness for becoming jealous, he’s more dangerous than the snake. So therefore Cāṇakya Paṇḍita concludes, <em>mantrauṣādhi-vaśaḥ sarpaḥ khalaḥ kena nivāryate</em>. The snake, although by nature he is so... , still, he can be controlled by <em>mantra</em> and some herbs. In India they still do that. But this <em>khala</em>, the jealous person, he cannot be pacified, any means. Therefore he’s more dangerous than the snake. He cannot be controlled either by <em>mantra</em> or by bribe or this or that, no.</p>

<p>“So Prahlāda Mahārāja said, ‘My Lord, nobody is unhappy, even the saintly person. We common man, we may be unhappy, “Oh, my father is killed.” Or my mother may be unhappy that “My husband is killed.” But be sure, my father was a <em>khala</em>.’”</p>

<p class="verse">* * *</p>

<p>During his massage Prabhupāda heard two reports sent by Rūpānuga. Rūpānuga had enclosed a newspaper article describing a major victory in our attempts to preach in the universities. Gabhīra dāsa, in Washington, D.C., after a battle with the university authorities, has now been accepted as an authorized chaplain. He has now been given an office on campus for counseling the students.</p>

<p>Śrīla Prabhupāda was very, very happy to read the article, and he sent a letter to Gabhīra to congratulate him for his efforts. Prabhupāda sees this as an important breakthrough in our preaching work. He asked Rūpānuga to continue to do the same in other universities.</p>

<p>Rūpānuga also informed Prabhupāda that Ravīndra Svarūpa from Philadelphia had just successfully completed his oral examination for a Ph.D. in religion. Prabhupāda was pleased to hear this, and told him that we need many Ph.D.s for the new Bhaktivedānta Institute.</p>

<p>As far as the temples in Rūpānuga prabhu’s zone are concerned, they all seem to be going well, with significant increases in book distribution.</p>

<p>Even within the courts in Atlanta, the devotees have won respect for their preaching activities. He told Prabhupāda that a federal court judge there had remarked that he had never, during his history on the bench, seen such religious fervor. The judge said that it was a new phenomenon in America, and he did not know exactly how to deal with it. “We have had preachers,” the judge said, “but these people are at it twelve hours per day, 365 days a year. I’ve never seen anything like it.”</p>

<p>At one point in the court proceedings the judge asked the city attorney whether he was willing to argue that Kṛṣṇa consciousness was not a genuine religion. “Oh no,” came the reply, “I am not at all willing to argue that point.”</p>

<p>The Atlanta temple has a new farm project in Tennessee, which provides them with milk. Prabhupāda was pleased to hear this. He commented that all our temples should have an auxiliary farm to provide them with milk, vegetables, flowers, and fruits.</p>

<p>And in the northeast USA, a new preaching center has been established in an important college town called Amherst. One of five main universities there now provides sufficient funding for them to hold four programs a week. There is great interest in cooking courses, with up to half the students in one dormitory being vegetarian.</p>

<p>In Washington the temple president recently received an inheritance. Apparently his idea is to use it to provide security for his wife and family, freeing himself for preaching. Prabhupāda didn’t think much of the idea. “I think Brsakapi should follow the example of Rupa Gosvami. Rupa Gosvami took sannyasa and gave 50% in charity, 25% for family use, and he kept 25% for emergency. Krsna wants to see that the life is sacrificed. But also accumulation, money, should be given to Krsna. Life to Krsna, and money to wife, is not a good decision.”</p>

<p>The only problem Rūpānuga reported was with the New York temple. He said that the new twelve-story building is practically a zone in itself, and requires full-time attention from a qualified man. Rūpānuga was hoping to be freed of that responsibility now that now Madhudviṣa Swami is there. Since Prabhupāda has already decided that Madhudviṣa Mahārāja should take charge of New York he was happy to hear that Rūpānuga was in agreement.</p>

<p>Another letter arrived from Yamunā dāsī, indicating that she would like to develop a cow-protection program. The impression given was that they wanted to run their women’s <em>āśrama</em> along the lines of a big temple.</p>

<p>Prabhupāda said in his reply that it is too difficult for women to engage in large-scale cow protection. He recommended that they keep the program small and manageable, with just a few cows for offering milk and sweets to the Deities. He explained that expansion means they will have to take help from men. Therefore he reiterated instructions he had given them previously, “Simply keep yourself aloof from men—chanting, many more times as possible, read books, worship the Deity... . A widow is forbidden to use ornaments, nice sari, decoration, combing the hair nicely. These are forbidden for a woman who is not with husband.”</p>

<p class="verse">* * *</p>

<p>Because Prabhupāda has been stressing the great importance of book distribution in India, Acyutānanda and Yaśodānandana Swamis are eager to get some books printed in South India for mass distribution. It seems that book distribution is the next major project for ISKCON India.</p>

<p>Prabhupāda said that once his books have been sold extensively throughout India, we will be able to defeat all the bogus yogis and impersonalists. As well as this, the books will greatly boost the life membership program. “It is not that we are beggars,” he said, “but we must give the public some return. Therefore I have started up this Life Membership program so that people will feel some gain for their contribution and will be encouraged when they see us spread and increase.”</p>', '', '1976-02-21', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- February 22nd, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'February 22nd, 1976', 37,
    '', '', '', '',
    '', '', '', '',
    E'<p>Before his walk Prabhupāda suggested that Dayānanda and I write to the devotees in London and New Zealand to find out whether we can sell Indian clothes and brassware there. He said that he has some capital in Lloyds Bank, and if we start exporting Indian cloth and other items, the government will think well of us. At the same time we shall make a useful profit. Actually from Māyāpur the devotees are already supplying many ISKCON temples with cloth that has been made on our own hand-looms.</p>

<p class="verse">* * *</p>

<p>Sudāmā Vipra Swami arrived from the Philippines in the early morning. He is another <em>sannyāsī</em> who has joined forces with Siddha-svarūpānanda Goswami, although the reports are that he does not follow the principles very strictly any more. Yet Śrīla Prabhupāda was happy to see him and greeted him very warmly.</p>

<p class="verse">* * *</p>

<p>Śrīla Prabhupāda is developing a heavy cold. Sometimes the mornings are damp and foggy. Such weather has caused his chest to become full of mucus, making his voice sound thick and muzzled. Still, he is walking in the morning and giving class, although today he didn’t say much.</p>

<p>In this morning’s verse, Dayānanda read out Śrīla Prabhupāda’s translation of a beautiful detailed description by Prahlāda Mahārāja of the fierce appearance of Lord Nṛsiàhadeva. “My Lord who is never conquered by anyone, certainly I am not at all afraid of Your very ferocious mouth, tongue, bright eyes like the sunshine, movement of Your eyebrows, very pinching sharp set of teeth, garland of intestines, hands soaked with blood, fixed up high ears, Your tumultuous sound which causes the elephants to go away to a distant place and Your nails which are meant for killing Your enemies. Undoubtedly I am not afraid of them.”</p>

<p>For a devotee like Prahlāda, the Lord is never to be feared, even when He is in an angry mood. Yet, Prabhupāda said, devotees are afraid of living in the material world. This is the essential difference between the devotees and demons.</p>

<p>“Prahlāda Mahārāja will say that ‘This fierceful attitude of Your Lordship is not at all fearful to me, as it is fearful to me, this material existence.’ This material world is very, very fierceful to the devotees. They are very, very much afraid of.</p>

<p>“This is the difference. Materialistic persons, they are thinking, ‘This world is very pleasing. We are enjoying. Eat, drink, be merry, and enjoy.’ But the devotees, they think, ‘It is very, very fierceful. How soon we shall get out of it?’ My Guru Mahārāja used to say that ‘This material world is not fit for living for any gentlemen.’ He used to say, ‘No gentleman can live here.’ So these things are not understood by the non-devotees, how much pinching this material world is. Unless one becomes detestful of this material world, it is to be understood that he has not yet entered in the spiritual understanding.</p>

<p>“This is the test of <em>bhakti</em>. If one has entered the domain of devotional service, this material world will be not at all tasteful for him. Jagāi and Mādhāi were too much materialistic, woman-hunters, drunkards, meat-eaters... So these things have become now common affairs. But it is very, very fearful for the devotees.</p>

<p>“Therefore we say, ‘No intoxication. No illicit sex. No meat-eating.’ It is very, very fearful. But they do not know it. They indulge in. The whole world is going on on this platform. He does not know that he is creating a very, very fierceful situation by indulging in these sinful activities.”</p>

<p class="verse">* * *</p>

<p>During his massage a newly arrived <em>brahmacārī</em> named Ṛkṣarāja asked Prabhupāda if he could take <em>sannyāsa</em>. He mentioned he had worked with Chayavana Swami in Africa.</p>

<p>Śrīla Prabhupāda abruptly retorted, “You know he has gone to hell? That is not recommendation; that is disqualification!” But still he told him that if he was recommended by a GBC member, he could take the vow, although Śrīla Prabhupāda added that for preaching in the West <em>sannyāsa</em> is not recommended, because people there have no respect for a <em>sādhu</em>. But he added that here in India, it is effective for preaching.</p>

<p>On hearing this, Ṛkṣarāja said he would be willing to remain in India to preach if he was given <em>sannyāsa</em>.</p>

<p class="verse">* * *</p>

<p>Relaxing in his room in the early evening, Prabhupāda enjoyed hearing Yaśodānandana Swami narrate some stories of his party’s travels in the south. Mahārāja described one place where they saw <em>mūrtis</em> of Lord Nṛsiàhadeva high up in the hillsides. One of them had eight arms and a garland of intestines, with the demon Hiraṇyakaśipu lying ripped open across His lap. Nearby, there was another Deity with a large mouth full of fearsome teeth.</p>

<p>Prabhupāda listened with interest. He enjoyed Yaśodānandana Swami’s descriptions of their successes in the south.</p>

<p class="verse">* * *</p>

<p>Jayapatāka Mahārāja reported that the boat program was going well. One day they sold 250 <em>Gītār-gānas</em>, and many people are requesting them to do programs in their villages. They also have three new devotees shaved up and chanting. Upon hearing of their success, Prabhupāda’s eyes grew big and bright. A smile of innocent surprise lit up his face, as if it were something very great and unexpected. His genuine response, almost a childlike wonder, was completely endearing.</p>

<p>Although he is the transcendental overseer of a large international movement, operating with thousands of men, millions of dollars, and selling tens of millions of books every year, he is still so humble and unassuming; the perfect <em>ācārya</em> and pure devotee.</p>', '', '1976-02-22', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- February 23rd, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'February 23rd, 1976', 38,
    '', '', '', '',
    '', '', '', '',
    E'<p>During class this morning Prabhupāda described the important role the temple plays in helping people to advance in spiritual life by <em>ajṣāta-sukṛti</em>, unknown pious activity. “<em>Sukṛti</em> means the way by which one can approach the Supreme Personality of Godhead. That is called <em>sukṛti</em>. <em>Ajṣāta-sukṛti</em>. This temple means to give chance to the people in general, <em>ajṣāta-sukṛti</em>. Anyone who will come to this temple where the Deity is there, and even by imitating others, if one offers obeisances to the Lord, that is taken into account. That is not useless, because this is Kṛṣṇa’s desire. He gives the four principles, that ‘Always think of Me,’ and ‘become My devotee,’ ‘worship Me,’ and ‘just offer little obeisances.’ These four principles will deliver you from this bondage of material existence, and ‘without any doubt, you’ll come back to Me.’</p>

<p>“So, so simple thing. It is not at all difficult. This child, he can do this. Old man can do this. Learned man can do this, without any knowledge. Even an animal can do it. Very simple. <em>Bhakti-yoga</em> is very simple.”</p>

<p>He stressed that any person can advance, even unknowingly, simply by gaining the association of devotees, and our temples offer that opportunity. “Therefore, somehow or other, if somebody comes into the temple, and even by imitating one offers obeisances... We have seen so many people. Our devotees are offering obeisances. They also think that ‘It is the etiquette. Let me do that,’ by association.</p>

<p>“Therefore it is recommended, <em>sādhu-saṅga</em>. Simply by association, one can be delivered. It is so nice thing. Unfortunately they’ll not associate with <em>sādhu</em>.”</p>

<p class="verse">* * *</p>

<p>A telegram came from Los Angeles, saying that <em>Śrīmad-Bhāgavatam</em>, Sixth Canto, Volume Three has been completed and would be offered to Śrīla Bhaktisiddhānta on his appearance day. Prabhupāda was extremely pleased. “Yes, keep this on file,” he told Dayānanda. “It is a very important telegram!”</p>

<p class="verse">* * *</p>

<p>From Vṛndāvana, the manager of the Punjab National Bank informed Prabhupāda that the final approval for our new subbranch has been made. The bank is eager to open straight away. He requested Śrīla Prabhupāda to open the branch with an initial deposit of five <em>lakhs</em> of rupees.</p>

<p>Prabhupāda approved, although his suggestion to the manager was that he could have an opening ceremony and personally make the deposit when he goes there in late March, if they so desired.</p>

<p class="verse">* * *</p>

<p>Yaśodānandana, Gurukṛpa, Acyutānanda and Sudāmā Swamis all left for Calcutta to visit the Nitāi Pada Kamala.</p>

<p>Gopāla Kṛṣṇa arrived. He informed Prabhupāda that all the planned book printing is now underway. Gopāla Kṛṣṇa has ambitions to distribute books to almost 10,000 libraries throughout India. One book agency that supplies every library has agreed to take the books on a six-months trial basis. Gopāla, however, prefers that our own men visit all the Indian universities. He wants to establish an Indian Library Party along the same lines as the existing Library Party, which has met with so much success in the West.</p>

<p>Śrīla Prabhupāda was very enlivened by his efforts and encouraged him to continue. He said that Gopāla Kṛṣṇa was now fulfilling his strong desire to see all his books printed in Hindi and then widely distributed.</p>

<p class="verse">* * *</p>

<p>The construction of the new building here is moving along quite quickly. The foundation and basement level work has been completed, and shuttering work has begun on the first floor. But it is apparent that the building will not be ready for use by the beginning of the festival.</p>

<p class="verse">* * *</p>

<p>A government man named Mr. Ganguli arrived in the evening to stay overnight. He is a senior officer from the same department as Mr. Chaudhuri and came to personally see the Māyāpur project and discuss the land acquisition proposal. Prabhupāda talked with him for a few hours, discussing in detail all the plans and requirements for the land.</p>', '', '1976-02-23', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- February 24th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'February 24th, 1976', 39,
    '', '', '', '',
    '', '', '', '',
    E'<p>Because of his cold, Prabhupāda didn’t talk much this morning on his walk.</p>

<p>There was one interesting bit of information. Gopāla Kṛṣṇa, who is trying to develop contacts in Eastern Europe, especially in the Soviet Union, told Prabhupāda he had heard that Harikeśa Swami is trying to go to Hungary, but Gopāla couldn’t elaborate.</p>

<p class="verse">* * *</p>

<p>Class was short. It continued with Prahlāda Mahārāja’s theme that the material world is simply a place of suffering. Śrīla Prabhupāda explained why the soul continues to try to enjoy it, even after having come to Kṛṣṇa consciousness. “The illusory energy is so strong, even one gets the body of a pig, he thinks, ‘It is very nice.’ This is called <em>prakṣepātmikā-śakti</em>. <em>Māyā</em> has got especially two energies: <em>āvaraṇātmika</em> and <em>prakṣepātmikā</em>. Generally <em>māyā</em> keeps us covered with illusion, and if one is little enlightened, wants to get out of the clutches of <em>māyā</em>, there is another potency of <em>māyā</em>, <em>prakṣepātmikā</em>.</p>

<p>“Suppose one thinks, ‘Now I shall become Kṛṣṇa conscious. This ordinary material consciousness is so disturbing. Let me become Kṛṣṇa conscious.’ So <em>māyā</em> will say, ‘What you will do with this? Better remain in material consciousness.’ This is called <em>prakṣepātmikā-śakti</em>. Therefore sometimes some man comes in our Society. After staying for a few days, he goes away. This is <em>prakṣepāta</em>, thrown away. Unless he’s very sincere, he cannot stay with us; he’ll be thrown away.”</p>

<p class="verse">* * *</p>

<p>Mr. Ganguli left in the morning after seeing the general plans for the development of the land, and he seemed very favorable. He told Prabhupāda that we should ask for all the land we need at one time rather than a few acres at a time. So they finally decided to ask for 270 acres.</p>

<p>This is the entire area from the back road in the east up to the Gaṅgā and from the Jalāṅgī in the south to the present temple-boundary wall. The city will cover over one hundred acres. The rest will be used for agriculture and cow protection.</p>

<p class="verse">* * *</p>

<p>Tonight Prabhupāda told Dayānanda that he wants the latest reviews of his books published in a new section of BTG, as well as in the Hyderabad-based newspaper <em>Hare Kṛṣṇa Explosion</em>. He is very enlivened by the work of the Library Party and the response of the scholars. He wants to take full advantage of the favorable reviews in order to increase the distribution of his books.</p>

<p class="verse">* * *</p>

<p>Gopāla Kṛṣṇa gave the finalized dates for the second half of the festival after Gaura Pūrṇimā. There will be a <em>paṇḍāl</em> in New Delhi from 26–31 March, one day in Modinagar, and then on to Vṛndāvana.</p>', '', '1976-02-24', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- February 25th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'February 25th, 1976', 40,
    '', '', '', '',
    '', '', '', '',
    E'<p>Today is Ekādaśī. More and more devotees are arriving for the festival.</p>

<p class="verse">* * *</p>

<p>This morning, before going out for his walk, Śrīla Prabhupāda called Sudāmā Vipra Swami into his room. Sudāmā Vipra, a gangly, loud, and capricious fellow, has a questionable reputation among the devotees. Prabhupāda is aware of this. But Sudāmā Vipra professes to have faith in Śrīla Prabhupāda. So Prabhupāda did not directly reprove him; he merely tactfully hinted at Sudāmā Vipra’s shaky position while encouraging him to do better.</p>

<p>As Śrīla Prabhupāda sat at his desk applying <em>tilaka</em>, he quoted one of his favorite sayings: “Big, big monkey, big, big belly; Ceylon jumping—melancholy!” With a smile he told Sudāmā Vipra, “So don’t become like big, big monkey. In the beginning you were so enthusiastic for <em>sannyāsa</em>, now you must do something.”</p>

<p>Sudāmā Vipra promised he would try.</p>

<p>When Prabhupāda walked out of his room, he was joined by other senior devotees. As they all climbed the stairs and emerged onto the roof, Śrīla Prabhupāda continued to emphasize the actual qualification for a <em>sannyāsa</em>. He said that if one has any thought that a woman is beautiful, that material wealth and comfort are desirable, or if he has any desire to enjoy material life, he cannot take <em>sannyāsa</em>. If one takes <em>sannyāsa</em> simply as a means to beg and fill his belly, he will only cheat himself; others will not be fooled.</p>

<p>Hridayānanda Mahārāja said that outside India such a <em>sannyāsī</em> would starve.</p>

<p>Prabhupāda laughed. He inquired from us, “So I do not know why our disciples are so anxious to take <em>sannyāsa</em>. Everyone comes, ‘Give me <em>sannyāsa</em>.’ What is the idea?”</p>

<p>Although he was in a good humor, it was clearly a complaint, one he has voiced quite frequently over the last couple of months. Nearly every week he receives requests for <em>sannyāsa</em>.</p>

<p>Jayapatāka Swami replied that a <em>brahmacārī</em> who gets tired of taking instructions asks for <em>sannyāsa</em> so he can be independent. Prabhupāda said that this is not good. <em>Sannyāsa</em> is designed for rendering service to everyone. It is not, “I am <em>sannyāsa</em>, you are my servants!”</p>

<p>Jayapatāka Swami asked Prabhupāda if one must be fixed up to take <em>sannyāsa</em>, or does one take <em>sannyāsa</em> to become fixed up?</p>

<p>Prabhupāda replied that the four <em>āśramas</em> are meant to fix one up gradually so that ultimately he becomes free of material desires and actually becomes <em>sannyāsa</em>. If one has material desires he must become a <em>gṛhastha</em> and accept <em>sannyāsa</em> later in life.</p>

<p>The conversation turned to Sharma dāsa, an American devotee who came here after serving in Africa. Disturbed by the misbehavior and poor standards there, he came to Vṛndāvana to see Śrīla Prabhupāda late last year, saying he only wanted to chant Hare Kṛṣṇa. Prabhupāda allowed him to come here to Māyāpur.</p>

<p>At present he is living at the <em>gośālā</em>, chanting 150 rounds a day and eating only the remnants of foodstuffs left by the devotees.</p>

<p>Recently he came to see Prabhupāda to get permission to build a tree hut to live in, so that he could avoid seeing anyone. He complained that he was being disturbed because devotees coming to see him interrupted his chanting. But Prabhupāda condemned his idea, which he said was “living like a monkey.” He said that Sharma’s so-called renunciation was actually only another form of sense gratification. It was also based on selfish interest, even if it was only a small display of it.</p>

<p>Prabhupāda gave the example of two thieves, one who stole a diamond and the other who stole a cucumber. Prabhupāda explained that simply because one steals in a small way, it does not mean that he is not a thief.</p>

<p>Jayapatāka Swami asked if <em>gṛhastha</em> life was meant for the one who steals cucumbers. Prabhupāda laughed. “Yes. Kṛṣṇa is giving allowance for stealing cucumber.”</p>

<p>Prabhupāda conceded that Sharma at least wasn’t doing anything bad. But he said that active service is better. Prabhupāda was not displeased with him, as something is better than nothing. He allowed him to stay here because if he leaves he may end up going elsewhere to practice something other than Kṛṣṇa consciousness.</p>

<p>Some of the senior men also felt that Mahāvīra was not mature enough to take <em>sannyāsa</em>. As Prabhupāda circumambulated on the roof, he turned and smiled at Mahāvīra, whose name is another name for Hanumān. “So, Mahāvīra prabhu,” he asked, “do you still want to take <em>sannyāsa?</em> But don’t be like this big, big monkey!”</p>

<p>“I will try to jump, Śrīla Prabhupāda.”</p>

<p>“Don’t try. Do it! <em>Sannyāsa</em> means one <em>must</em> turn out successful.”</p>

<p>Later, just before entering the temple for the morning program, Śrīla Prabhupāda saw some light cane-work construction lying at the side of the road. He asked what it was. Sudāmā Vipra explained that he was building a hut from split bamboo. He has arranged to rent some land on our banana plantation for $2,000 per year. He wants to stay in Māyāpur, yet in a little seclusion, apart from the main body of devotees. Prabhupāda didn’t comment much, he was simply pleased that Sudāmā Vipra Mahārāja is here in the <em>dhāma</em>.</p>

<p class="verse">* * *</p>

<p>In the mail today was an update from Dīna Dayal on his preaching in Greece. He has acquired an apartment in a good area of Athens, just near the British embassy. Bhaktijana and Rohiṇī Kumāra have joined him. They held a grand opening in an auditorium. They obtained police permission to hang a poster with Prabhupāda’s picture on it all around the city to advertise the opening. Over 150 people attended. Dīna Dayal has begun translating prayers and articles from <em>Back to Godhead</em> into Greek. He asked which book Prabhupāda wanted translated first.</p>

<p>Prabhupāda was satisfied with his attempts to preach. He advised him to maintain his efforts, increasing gradually. He asked him to translate <em>Bhagavad-gītā As It Is</em> first.</p>

<p>Nitāi prabhu also wrote to inform Śrīla Prabhupāda about his attempts to gain affiliation for our <em>gurukula</em> with two Sanskrit colleges, one in Delhi and one in Benares. His idea was to adapt their curriculums to our needs.</p>

<p>Prabhupāda wasn’t too concerned from the academic standpoint, but he wrote back approving his idea because it may help our students get visas.</p>

<p class="verse">* * *</p>

<p>Bilvamaṅgala dāsa brought the finished plans for the Māyāpur temple from Saurabha in Bombay. The total area required has again been revised; now we will apply for 320 acres.</p>', '', '1976-02-25', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


END $$;
