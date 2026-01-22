-- ============================================
-- TD Volume 1, Chapter 7 - Verses
-- ============================================

DO $$
DECLARE
  v_book_id uuid;
  v_canto_id uuid;
  v_chapter_id uuid;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = 'td';
  SELECT id INTO v_canto_id FROM public.cantos WHERE book_id = v_book_id AND canto_number = 1;
  SELECT id INTO v_chapter_id FROM public.chapters WHERE canto_id = v_canto_id AND chapter_number = 7;


  -- January 3rd, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'January 3rd, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>In the early morning Śrīla Prabhupāda, Tamal Krishna Mahārāja, Harikeśa, and I boarded a train heading north to Nellore, a small city in the state of Andhra Pradesh. The local Madras devotees saw us off at the station with a rousing <em>kīrtana</em>. The clamor alerted some of the other passengers to Prabhupāda’s presence, and several men hovered around the carriage, peering in with great interest. We shut the door and relaxed in the quiet privacy of the first-class compartment.</p>

<p>“First class” is a misnomer, as the compartment was a bit uncomfortable and dirty, with soot from the steam engine speckled throughout. The only advantage was the privacy of the cabin. Still, Prabhupāda said he preferred to travel by train rather than plane; there is more room and a satisfyingly sedate pace.</p>

<p>We carried with us some fruit and other <em>prasādam</em> for breakfast. After Prabhupāda ate, we enjoyed the remnants while he took a little rest, stretching out along the seat, which devotees had covered with clean white sheets.</p>

<p>Tamal Krishna Mahārāja went out to wash and swiftly shut the door behind him. When he came back he sidled through the half-open entry and again quickly shut it. “There are three men hanging around in the corridor hoping to see Prabhupāda,” he said, answering our quizzical looks. “They’ll just come in and ask some nonsense and disturb him, so don’t let them in.” People in India are often eager to ask for blessings from holy men, but unfortunately they rarely have any serious spiritual intent. There are also many <em>sādhus</em> accustomed to offering such meaningless <em>āśīrvāda</em>, or blessings.</p>

<p>Śrīla Prabhupāda refers to this kind of <em>sādhu</em> as an <em>āśīrvāda-mahārāja</em>. Usually they give a wave of the hand, a nod, and exchange a few polite words. There is no spiritual discussion, no transmission of knowledge, and no transformation. Yet both parties are satisfied with this giving and receiving of they know not what—‘<em>āśīrvādas</em>.’ From our understanding of Prabhupāda’s teachings, such intangible exchanges are of no practical value. Naturally, as Prabhupāda’s servants, we don’t like to see his time wasted with such blessing-seekers.</p>

<p>When Harikeśa and I went out of the compartment, the curious men were still there. On our return, despite our obvious reluctance to let them in, they strained to see past us, knowing that if they caught Prabhupāda’s eye, etiquette would oblige him to let them in. Prabhupāda was awake, eye-contact was made, and he instructed us to let them in. The three filed in and sat opposite, smiling and pleased at having evaded the secretaries of someone they knew was a great spiritual leader and holy man.</p>

<p>Thus we all sat: we three somewhat irritated by this polite infringement on Prabhupāda’s precious time, they three ignoring us, eager to have his <em>darśana</em>, and Śrīla Prabhupāda, as always, a warm and cordial host. Not at all inconvenienced, Prabhupāda received them courteously, asking them a few polite questions: what their names were, where they came from, what they did, and the like. Then he looked directly into their faces and asked, “So, what is it that I can do for you?”</p>

<p>“Swamiji, we just wanted to get your blessings.”</p>

<p>“What is that blessing?”</p>

<p>This answer took them by surprise. No one had ever asked them what <em>kind</em> of blessings.</p>

<p>Caught off guard, one of them replied, “Well Swamiji, I have this pain in my knee... ”</p>

<p>We almost groaned out loud and the man, becoming embarrassed, hastily added, “And for our families also... ”</p>

<p>Strike two.</p>

<p>“Ah, and of course we want to do good to others... ”</p>

<p>As he trailed off into confused silence, Prabhupāda indicated his three disciples with shaved heads, <em>śikhās</em>, <em>kurtās</em>, <em>dhotīs</em>, and <em>tulasī</em> beads. He told them, “This is my blessing. These boys have given up everything for Kṛṣṇa’s service and to chant Hare Kṛṣṇa. Are you prepared to accept such a blessing?”</p>

<p>At first there was no reply. They were stunned; all kinds of wild thoughts seemed to run through their heads and across their faces. Then, before they could become the beneficiaries of this blessing, they hurriedly stood. One stammered, “Well, actually Swamiji, at the moment we have so many duties with the family and all, this kind of life of a <em>sannyāsī</em>, for us it is not possible... ” With profuse apologies and many thanks they beat a hasty retreat. We laughed as Prabhupāda sat smiling and shook his head.</p>

<p>“This is the problem. They simply take a <em>sādhu</em> as some means for avoiding paying the doctor’s bill, that’s all. <em>Āśīrvāda-mahārāja</em>. They are not serious for spiritual life.”</p>

<p>People have no appreciation of a real <em>mahātmā</em>.</p>

<p class="verse">* * *</p>

<p>After a three-and-a-half-hour journey the train pulled into the modest Nellore railway station.</p>

<p>The <em>sannyāsīs</em> and devotees from Madras had all traveled ahead on the road. Together with a very large and eager group of local residents, they gave Śrīla Prabhupāda a tumultuous welcome. The devotees have been preaching in Nellore for several weeks, making many Life Members and preparing for Śrīla Prabhupāda’s visit; thus many people were anxiously awaiting his arrival.</p>

<p>Prabhupāda got down from the carriage first, followed by Tamal Krishna and Harikeśa. The huge crowd on the platform promptly swallowed him up.</p>

<p>When I finally struggled out of the carriage carrying two suitcases, a shoulder bag, and the bag with the tiffin and cooker, I was amazed to see, through a jam of sweating bodies, Śrīla Prabhupāda just about to disappear under a huge wreath of marigolds. He was patiently standing, hands held together in traditional <em>praṇāma</em>, while fifty or sixty people lined up to place garlands around his neck. I dropped the cases and barged through. By the time I reached him the flowers were just beginning to rise above the top of his ears. Harikeśa and Tamal Krishna Mahārāja stood immobilized to the side, looking somewhat overwhelmed by the whole affair.</p>

<p>Stopping the chain of presentation for a moment, I removed all the garlands but two. They were so heavy that I had difficulty lifting them, but Śrīla Prabhupāda had stood very patiently to allow everyone to come forward and drape their offerings around his neck. He was visibly relieved when I removed the garlands. Then as the rest of the crowd moved up one at a time and offered their garlands I immediately removed them, never allowing more than two or three to accumulate at once.</p>

<p>When everyone had made their offering, Prabhupāda walked out to the waiting car, followed by chanting devotees and mobbed by the enthusiastic residents of Nellore.</p>

<p>Harikeśa came up to me and demanded to know where the suitcases were.</p>

<p>“Oh, no! I left them on the platform!” I had forgotten all about them in my rush to aid Śrīla Prabhupāda, and I earned another acerbic rebuke from Harikeśa for my foolishness. Fortunately, when the crowd cleared, the suitcases were still where I had left them. Harikeśa did admit, however, that I had acted correctly and promptly where he had failed regarding Prabhupāda’s personal situation.</p>

<p>Śrīla Prabhupāda was extremely pleased by the whole reception. However, the arrival at our lodgings was a different story.</p>

<p>Turning off into a side road next to the Tirupati Tirumali Devastānams Kalyānam Maṇḍapam on the southern outskirts just off National Highway 5, we came to the main gates of an enclosed estate. It is owned by our hosts, two sisters, Sujathamma Rebala and Subhaprada Kattamanchi, members of the former royal family of the area. Prabhupāda has been invited to stay with them for the next five days.</p>

<p>The estate is divided into two sections of seven and two acres, all surrounded by a ten foot-high wall. The sisters are donating both parcels of land to ISKCON. We plan to construct a temple on the smaller plot, and it is to inaugurate this work that Śrīla Prabhupāda has come. He is going to install the foundation stone tomorrow.</p>

<p>The two-acre plot is completely undeveloped and rather barren, except for a small house at the back where Acyutānanda and Yaśodānandana Swamis’ party is staying. The seven-acre plot has a large bungalow for its main residence, separate servants’ quarters, a couple of small out-houses, and partially cultivated gardens with some flowers, bottle palm trees, and vegetable patches. This larger acreage will be donated on the demise of the sisters.</p>

<p>Getting out of the car at the main gate Prabhupāda was met by the sisters. Together we all walked the short distance down the drive to the main house. The driveway ended in a small circle with a fountain in the middle at the front of the house. At the side of this, out in the open, we passed a small bust of Kṛṣṇa with a cow. We also noted <em>tulasī</em> plants growing here and there along the garden borders.</p>

<p>Because of our plan to establish a temple here, Mahāàsa Swami said that many people in Nellore have given their support and have become life members. The local newspaper has featured an article describing the activities of ISKCON, showing pictures of the devotees performing street <em>saṅkīrtana</em> and conducting <em>paṇḍāl</em> programs.</p>

<p>A large <em>paṇḍāl</em> has been arranged in the city center for the next few days, with Śrīla Prabhupāda as the center of attraction.</p>

<p>The two sisters’ reception of Prabhupāda was cordial, but there was a distinct coolness in their temperament, which we all noticed. They gave him a small but pleasant room with a grilled-in veranda. We servants were shown to a room directly above him on the roof. Śrīla Prabhupāda immediately got ready for his massage.</p>

<p>As we sat on the veranda and I began to apply the oil to his head, we heard a familiar clucking noise across the pathway. “What is that?” Prabhupāda asked.</p>

<p>I looked out through the grilled window and saw a hen coop. “It’s chickens, Śrīla Prabhupāda.”</p>

<p>“Oh. Then that means?”</p>

<p>“Well, it means that at least they are eating eggs,” I said, trying to be optimistic.</p>

<p>“Call Harikeśa.”</p>

<p>Harikeśa came in, visibly disturbed. “Śrīla Prabhupāda, these people are meat-eaters!”</p>

<p>“Oh. Then you must cook separately. You cannot cook in their kitchen. Do not use any of their pots or utensils.”</p>

<p>“Śrīla Prabhupāda, there’s something wrong here. These people are crazy!” Harikeśa complained.</p>

<p>Prabhupāda bridled, “They are crazy, or you are crazy?”</p>

<p>Being extremely intelligent, on occasion Harikeśa’s reactions to a situation tend to be overly intense. On such occasions, Prabhupāda has to help him properly channel his mental energy. Harikeśa is completely dedicated to following Prabhupāda’s guidance, and a few quick words are usually sufficient to correct him. Yet in this instance he persisted.</p>

<p>“Well, crazy I may be,” he conceded, “but there is definitely something strange going on. It’s almost as if these people don’t want us here. They invited us, but they are almost unfriendly towards us.”</p>

<p>Prabhupāda accepted his observation; our reception by the sisters had been decidedly muted, in contrast to the enthusiasm at the railway station. But he gave them the benefit of the doubt. “We are their guests,” he said, “so we should deal with them politely. They may not yet be familiar with Kṛṣṇa consciousness, but they are offering the land for the temple, and things should improve when they engage in service to Kṛṣṇa.”</p>

<p>In a discussion this afternoon the subject came up again, for we had all noticed the oddly cool attitude of our hosts, as if we were merely necessary inconveniences.</p>

<p>Prabhupāda asked Mahāàsa Swami for the deed of the gift of land, but it wasn’t available. Mahāàsa thought it was with Gopāla Kṛṣṇa, and Gopāla thought Mahāàsa had it. Prabhupāda was a little annoyed at their incompetence. He instructed them to bring the deed as soon as possible so that he could check it.</p>

<p>Apart from this, Śrīla Prabhupāda maintained his usual congenial mood and schedule. Tamal Krishna Mahārāja had brought some mail from America with him that he had read out when he first arrived but still needed replying to.</p>

<p>Prabhupāda was enlivened to hear a letter Rāmeśvara wrote two weeks before the Christmas marathon. Rāmeśvara reported that three new airports had been legally opened for book distribution and that our lawyers were working on opening several more, thus giving great facility for increasing book sales.</p>

<p>He also had a question about the system of book distribution Prabhupāda recently approved for the Rādhā-Dāmodara party, by which devotees could hand out big books for nominal sums, provided they covered the costs from other donations. Rāmeśvara wanted to know if the temples could also adopt this method, for previously big books had only been given to people who donated at least three or four dollars. The Rādhā-Dāmodara traveling <em>saṅkīrtana</em> party ordered 50,000 books for December alone, and Rāmeśvara thought that distribution would increase tremendously if the temples could also adopt this system.</p>

<p>Finally, he described the enthusiasm for book distribution sweeping the American temples. “This month there is terrific competition between Tamal Krishna Goswami and Jayatirtha Prabhu [GBC for Los Angeles] to be the outstanding zones for the month. Here in New Dvaraka we are breaking all records and out-distributing everyone in BTG distribution. Just this past weekend (two days) we sold thirty thousand BTGs in Los Angeles alone! Everyone at the BBT including myself is going on book distribution two days per week for the competition, and we are planning to sell 100,000 BTGs in L.A. in just six days between December 19th-24th. In this way book distribution is going on nicely in America, and our warehouse is exhausted to ship so many books out to the SKP parties day and night. Anyway, in Los Angeles, never before in history have so many transcendental literatures been distributed in one city in so short a period of time. Our goal for this month is to sell at least 200,000 BTGs and 12,000 big books all in Los Angeles. By your divine blessings, we would like to be able to increase these figures even more, and become absorbed in book distribution day and night without stopping. Everyone agrees that to distribute your books is the highest pleasure and even the demigods may take birth here just to be able to distribute your books and taste this great pleasure.”</p>

<p>He concluded his letter by saying, “I hope you are well and enjoying the book distribution results. I have never seen the devotees in America work so hard to please you as now, by their book selling.”</p>

<p>Prabhupāda was enlivened to hear the enthusiastic report, especially since he already knew of the success of the marathon. In the past he had deliberately promoted a competition between temples in book distribution, and he teased Tamal Krishna Mahārāja as he dictated his reply to Rāmeśvara.</p>

<p>“Regarding the suggestion for book selling, the point is that the temples must pay the cost of printing. Then they may sell for whatever price they like.</p>

<p>“The transcendental competition is nice. If Jayatirtha Prabhu defeats Tamal Krishna Maharaja, then Tamal will have heart failure. Go on selling books. My Guru Maharaja was very much anxious about selling books and preaching, so you are pleasing him by this bombastic flood of books all over the world. Thank you.”</p>

<p>He also added a note of approval and precaution on the new <em>Bhāgavatam</em> printing. “The new Sixth Canto Bhagavatams are very nice. Yes, actually they are worshipable Deities. Be careful that our books do not appear like Bible printing. Sometimes the Christians also put gold gilding on their books, but people are adverse to purchasing Bibles. Neither our books should be given free, there must be some remuneration, otherwise it will be like Bible selling.”</p>

<p>Unlike most authors, Śrīla Prabhupāda’s enthusiasm about the tremendous increase in sales of his books does not derive from personal pride or hope for an increase in his own sense gratification from the income. They are Kṛṣṇa’s books, and he is Kṛṣṇa’s servant; therefore the profits are also Kṛṣṇa’s.</p>

<p>An increase in book distribution means greater numbers of people potentially attracted to Kṛṣṇa consciousness. However, despite the liberality of his mood in contacting as many persons as possible through wide distribution, he wants his books to be properly appreciated, and he knows that something easily obtained is also easily given up.</p>

<p>Along with the mail from America, there were letters from other parts of the world. One man in South India wrote about his interest in God consciousness and his eagerness to read Prabhupāda’s books. He had read an article describing Prabhupāda’s activities. “Recently I read an article about you—how you were a rich industrialist, how you, to fulfil the wishes of your Guru to preach devotion to Kṛṣṇa in the Western countries, renounced worldly life and how you translated Srimad-Bhagavatam into English in waste papers and how you went to America by Scindia ship and how you sat in the New York square and began to sing ‘Hare Krsna’ and lectured the gift of Srimad Bhagavad-gita and how the small gathering around you has grown to the present state with 112 centers throughout the world. It seems that God has chosen you to be an instrument in His Divine hands to bring a change for the good in the millions of hearts thirsting for peace and happiness, love and freedom in the spiritual sphere.” However, he then went on to say he had no money even for postage, so he was requesting the <em>Bhāgavatam</em> as a gift.</p>

<p>Prabhupāda tactfully replied, “Thank you for your kind appreciation of our Society’s activities and of my humble effort on behalf of Lord Kṛṣṇa.</p>

<p>“Regarding your request for some books, the best thing will be if you ask some able person to buy them for you. Or you may ask for the fare to come to Madras and live with the devotees of our Movement. The address in Madras is 50, Aspiran Gardens, 2nd Street, Kilpauk, Madras 10. If you live with our men following our program then you will also get an opportunity to read all our books.”</p>

<p>Trivikrama Swami wrote from Japan concerning his troubled relationship with Gurukṛpa Swami. He also had a question about the supposed American moon landings.</p>

<p>Prabhupāda replied to Trivikrama Mahārāja in the same mood in which he had spoken to Gurukṛpa Swami. He wants the devotees to learn responsible management and cooperation. He is not at all in favor of making immediate changes whenever a problem arises. He advised to refer such questions to the annual GBC meeting in March at Māyāpur.</p>

<p>Prabhupāda also replied to his confusion about the moon landings. “Regarding the ‘dust’ supposedly brought from the moon, that dust can be gotten anywhere. It has already been openly admitted that the same dust is available on this earth planet. These astronauts and scientists are all bluffing. But Srila Vyasadeva is the correct authority. Just study Srimad-Bhagavatam carefully with full faith in Krsna and Guru and all knowledge will be revealed.”</p>

<p class="verse">* * *</p>

<p>There was no program this evening, so Tamal Krishna Goswami, Harikeśa, and I gathered in Prabhupāda’s room and chatted with him for a short while before having a <em>kīrtana</em> and a reading from his books.</p>

<p>We talked about book distribution. Tamal Krishna complimented Śrīla Prabhupāda: “I don’t think there has ever been a personality who has given such a great gift to the Western world as yourself, Prabhupāda.”</p>

<p>Prabhupāda modestly acknowledged his tribute. “Yes, actually that is the fact. But let them appreciate, that’s all.”</p>

<p>“The thing is,” Tamal said, “it seems to me, that we are flooding so many books that they must become Kṛṣṇa conscious.”</p>

<p>Prabhupāda gave a big grin and chuckled. “Yes, they have no alternative than to read these books!”</p>

<p>Tamal Krishna explained that almost every day when our men go out they meet people who already have our books. “Supposing each man meets in a day one thousand or five hundred people—always, without a doubt, at least one or two of the people he meets already have another book, and they are taking a second or third book. Many of them have two or three volumes of <em>Caitanya-caritāmṛta</em> or<em> Bhāgavatam</em>. And although they may not read it, their children are reading it.”</p>

<p>Prabhupāda agreed, “Somebody is reading.”</p>

<p>“Oh, yes,” Tamal replied. “I made a study. I asked the men in our party when they were all gathered to raise their hand if they had received a book before joining our party. Every single one of them had received a book before joining the movement, without exception. They were attracted through reading a book or a magazine.”</p>

<p>When we chanted, several of the house servants sat by the door. The sisters also came, attracted by the <em>kīrtana</em>. After about half an hour we stopped. Prabhupāda had Tamal Krishna Mahārāja read from <em>Śrī Īśopaniṣad</em>. By the time he had finished reading we were alone again.</p>', '', '1976-01-03', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- January 4th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'January 4th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Early in the morning Śrīla Prabhupāda called us into his room, wanting to know why the other devotees had not risen by four o’clock for <em>maṅgala</em>-<em>ārati</em> and <em>kīrtana</em>. He was annoyed by our indolence and said, “If our habits are not changed then what is the use of spending so much money?”</p>

<p>Outside, cocks crowed in the dawn, and inside Prabhupāda relaxed after a night of intense concentration and writing, his beads clicking in his hand and his mind keen and alert.</p>

<p>When Harikeśa and I entered the room, eager to share the quiet intimacy of the early morning hours with him, Prabhupāda and Tamal Krishna Mahārāja were already absorbed in a discussion about the foolishness of thinking oneself to be independent.</p>

<p>At Prabhupāda’s request Tamal filled us in on the details of their talk. “In no way can anyone say that they’re independent,” Tamal reiterated. “There is no possibility. At every moment one is dependent. And if anyone says they aren’t, they are simply foolish rascals. We have to challenge everyone in the world on this point: ‘You cannot be independent.’” He continued, “Politicians like Indira think that they are independent. Prabhupāda was saying that Mujibul Rehman fought so hard for his country’s independence, Bangladesh. But when the soldiers came, they killed him and every single family member in one hour, not sparing anyone. He thought he was independent, he thought his country had become independent. But in one hour it was all wiped away.”</p>

<p>Prabhupāda entered the discussion in a challenging mood, “So where is your independence? What is the answer? At any moment you have to die. Even Mujibul Rehman or Mussolini or big, big Napoleon. Everyone. He was given horse urine to drink, Napoleon. Such a great hero, but he had to drink horse urine as reaction of his atrocities. Hitler committed suicide and finished himself. Mussolini was forced to be killed, Gandhi was killed. And they are fighting for independence... . So where is your independence? If you are thinking independently and doing things independently, then is it not foolishness?...</p>

<p>“Suppose within the prison walls, if you want to do things independently, is it possible? You’ll be put into further sufferings as soon as you violate the rules and regulation of the jail. Just like they are independently trying to avoid pregnancy, and the same man who has killed his own child, or same mother, he is being killed within the womb. <em>Prakṛteḥ kriyamāṇāni</em>. Nature will not tolerate this. In India still these things are not happening because they are not so advanced to use all these contraceptive method. But in Europe, America, it has become a common affair to kill the child within the womb.”</p>

<p>Tamal Krishna Mahārāja pointed out that it was starting in India also.</p>

<p>Prabhupāda made a wry face. “Yes, gradually. As soon as you kill, then you must be killed. This law is there, life for life. So where is your independence? Independence means you are inviting more sufferings, that’s all. You go on, declare your independence. We are the only sane men. We have accepted that we have no independence. So we have to convince the people. Kṛṣṇa consciousness movement is very scientific. You are foolishly rascal. You are trying to be independent. That is not possible. Kṛṣṇa is asking to surrender. You do that.”</p>

<p>Prabhupāda made it clear that the root cause of all suffering is this mood of independence from God. “Discuss all these things amongst yourselves and preach and inform these rascals, so-called civilized scientists and philosophers. That is preaching. We have to present the truth in such a way that they will be convinced.”</p>

<p>Changing subjects, Śrīla Prabhupāda gave his appraisal of the mentality of our hosts. Having seen the figurine of Kṛṣṇa in the garden and the surrounding <em>tulasī</em> trees, I had thought that perhaps the two sisters did have some genuine interest in Kṛṣṇa, but Prabhupāda saw it differently.</p>

<p>“I have seen in Calcutta one statue of Sir Asutosa Mukherji. So in the morning, on the day of the birth anniversary, the municipal sweepers with their brush, they will rub it to cleanse the solidly stuck up crow’s stool with water. Then in the evening, big, big men will come, gather, and offer him garland one after another, just like they were offering me. In the morning it is brushed with the sweeper’s street brush, and in the evening it is offered garland. I have seen it. Here also I see that she has kept Kṛṣṇa’s <em>mūrti</em> outside. It is <em>aparādha</em>.”</p>

<p>Tamal Krishna said that he didn’t think that the sisters were Kṛṣṇa <em>bhaktas</em> at all.</p>

<p>I mentioned that during a short tour of the property I was pleased to see many <em>tulasī</em> plants in the garden. But then I felt shocked when I came upon a chest-high pedestal holding a <em>tulasī</em> plant cut into the shape of a suspiciously familiar bird. “Even that <em>tulasī</em> tree around the corner. They have clipped to shape it, cut all the branches,” I told him.</p>

<p>“They have no guidance,” Prabhupāda said.</p>

<p>Tamal recalled the previous evening. “Last night when we were reading, they all left. When you mentioned the regulative principles—stressing no meat, crabs, fish, eggs—they all got up and walked out.”</p>

<p>Prabhupāda questioned Harikeśa again about the cooking. “You said that the same cooking place will have to do, where they are cooking meat?”</p>

<p>Harikeśa reassured him, “They’re not cooking it now.”</p>

<p>Living in someone else’s house is difficult when the family members are non-Vaiṣṇava. When preaching in India devotees are often obliged to stay in the homes of Life Members, their bad habits tolerated in order to broadcast the message of Kṛṣṇa consciousness. However, Tamal Krishna told Prabhupāda that when Gargamuni Swami returns to India, he doesn’t want to do that anymore. He said, “He is determined that he will not eat in anyone’s home.”</p>

<p>Prabhupāda approved. “That is very good.”</p>

<p>“Not only that, but he’s not going to sleep in anyone’s home either. They want to camp out by the riversides.”</p>

<p>“Very good idea.”</p>

<p>“He says that from reading your books it is very clear that Caitanya Mahāprabhu was very careful, strict, to only eat <em>prasādam</em> cooked by proper persons.”</p>

<p>“No, purchase from Jagannātha temple. People would come to offer Him <em>prasādam</em>. So what is the cost of the <em>prasādam</em>, that was taken and He purchased. Formerly, the system was there was no hotel, but there were temples. You go and you can purchase very cheap price. I went with my father in my childhood in a place. My father would never take food at anyone’s house or in the hotel. He will find out some temple and pay them and take <em>prasādam</em>. Still there are many temples. So I was about ten years old at that time, say, seventy years ago. So he paid two <em>annas</em> to the <em>pūjārī</em>, and he gave us so much. It can be eaten by five, six men. <em>Kicharī</em>, vegetables, varieties. So much. Two <em>annas</em>.”</p>

<p>Tamal Krishna mentioned his experience visiting a temple in Navadvīpa. “They had an arrangement like this. At least a hundred people were taking, respectable people. That temple’s very big. Of course, I don’t know how bona fide the people who speak at night are, but every night there are speakers with many people coming. I was very impressed by it. Nice rooms for people to stay upstairs, very active, always being cleansed.”</p>

<p>Śrīla Prabhupāda was impressed by Tamal Krishna’s description. “That is temple. So we have so many examples. Introduce this.”</p>

<p class="verse">* * *</p>

<p>Prabhupāda took a longer walk this morning because there was no temple program to attend. He walked around the grounds, and then to a nearby lake.</p>

<p>Mr. Keshavalal Triveri, who had attended his lectures in Madras, joined us. Pleased to see him, Śrīla Prabhupāda immediately engaged him in further discussion on the central theme of his Madras lectures and this early morning’s conversation—the false spirit of independence.</p>

<p>Mr. Triveri was in full agreement and complimented Śrīla Prabhupāda on his lectures. “For the first time,” he said, “I am able to explain to my friends that the true status of the soul is <em>ātmā</em>, not <em>param-ātmā</em>; <em>brāhmaṇa</em> but not <em>para-brāhmaṇa</em>.”</p>

<p>In the course of the discussion Acyutānanda Swami quoted one of the favorite scriptural references from the <em>Īśopaniṣad</em> that the Māyāvādīs use to declare themselves as God. They say that the words from the Sixteenth Verse, <em>so ’ham asmi</em>, “I am that”, mean that the living being is the same as God.</p>

<p>Prabhupāda refuted his argument with a revealing analogy. “<em>Asmi</em> means ‘It is my energy.’ If I say that I am ISKCON, what is the wrong there? Because I have created this; therefore I say ISKCON means I. I am ISKCON. So what is the wrong there? It is like that. By energy of Kṛṣṇa, everything has come out. Therefore it says, ‘I am this, I am this, I am this, I am this.’”</p>

<p>Having the opportunity to closely observe Śrīla Prabhupāda’s daily involvement in the affairs of ISKCON has helped me to understand just how <em>apropos</em> this analogy is. He has created ISKCON, he is sustaining it, and, when difficulties arise due to the ineptness of his disciples, he fully supports it.</p>

<p>Mr. Triveri told him about a recent negative incident he had experienced with one svāmī. The svāmī had publicly condemned ISKCON and Śrīla Prabhupāda’s preaching activities. The svāmī had read aloud to the public on Janmāṣṭamī day an adverse newspaper article concerning the devotees in Japan. He declared that ISKCON was not a bona-fide <em>sampradāya</em> and should be avoided.</p>

<p>Śrīla Prabhupāda strongly defended his ISKCON’s worldwide efforts to spread Kṛṣṇa consciousness. He advised Mr. Triveri how to deal with such criticism, “<em>Doṣam icchanti pāmarāḥ</em>. <em>Makṣikā bhramarā icchanti</em>... <em>Makṣikā</em>, these ordinary flies, they find out where is sore, and the <em>bhramarā</em>[bee], he finds out where is honey. Similarly, <em>doṣam icchanti pāmarāḥ</em>. And the Bhaktivedanta Swami is doing preaching all over the world. That has not come to his eyes. He has come to the Japanese incident.”</p>

<p>Mr. Triveri said that he had told the man that in a big organization there might be some such incidents.</p>

<p>But Prabhupāda said, “No. Why did you not say, ‘You are such a <em>pāmara</em> [low minded or sinful] that this thing has come to your notice and not other thing’?... Just try to understand what is the mentality of these rascals that ‘The good things do not come to your notice.’ If something is bad, ‘Oh, here is... ’ You see. <em>Pāmarāḥ doṣam icchanti guṇam icchanti paṇḍitāḥ. Saj-janā guṇam icchanti doṣam icchanti pāmarāḥ</em>. That means they are not even a Vaiṣṇava. You see? Vaiṣṇava means <em>paramo nirmatsarāṇāà</em>. Even one has got some fault; a Vaiṣṇava does not see that. He takes the good qualities. But they are not even Vaiṣṇava. The mission of Caitanya Mahāprabhu is being preached all over the world—that does not come to their attention. Some Japanese newspaper has written something—it has come immediately. He’s a lowest of the mankind. You can say that ‘Why this thing has come prominent to your eyes and not the other thing?’”</p>

<p>Mr. Triveri said, “No, I did say in my own way, though I did not quote this, that ‘You are a <em>pāmara</em>.’”</p>

<p>And Prabhupāda confidently said, “Yes, you can say now that, ‘That day I forgot to say that you are a <em>pāmara</em>. So I have come to say that you are a <em>pāmara</em>. I forgot it. Excuse me, I forgot it. So you are <em>pāmara</em>.’”</p>

<p>Mr. Triveri agreed. “As a matter of fact, it is so.” And then he added, speaking as the svāmī in question might respond, “And for that, the apology is, ‘No, no, I do realize that lot of work is being done about that... ’”</p>

<p>Prabhupāda completed the apology: “‘But because I am <em>pāmara</em>, I am finding out this fault.’”</p>

<p>Mr. Triveri added another anecdote to illustrate the kind of negative response our Society is getting. “One gosvāmī, when I said, ‘Well, this is a movement which I very much like and like also to join,’ then he said that—because I am conducting Gītā Bhavān founded by him—he said, ‘No, no, no, no. We as a matter of fact we champion that cause. But afterwards, when we realized that it is not sampradāyic, we have given it up... After all, we are qualified. Those <em>mlecchas</em> [meat-eaters]... ’”</p>

<p>Prabhupāda interjected abruptly. “Nobody cares for you. You are so qualified that nobody cares for you... If they are <em>mlecchas</em>, then you are <em>nārakī</em> [resident of hell]. It is said, <em>vaiṣṇave jāti-buddhir.... nārakī</em>. Anyone who considers in terms of caste a Vaiṣṇava, he’s a <em>nārakī</em>. Everyone knows that he is European, he is American, but because he is Vaiṣṇava, one should not see like that, ‘<em>mleccha</em>.’ If he sees, then he’s <em>nārakī</em>.”</p>

<p>Yaśodānandana Swami said it proved that they have no faith in the holy names, because the <em>hari-nāma</em> purifies everything.</p>

<p>Prabhupāda readily agreed. “This rascal says the <em>Nāma</em> has no... See. We have to meet simply rascals all over. The so-called religionists, so-called svāmīs, so-called yogis, so-called politicians. You see? Simply we have to meet with all rascals.”</p>

<p>“This Mahārāja showing that article on Kṛṣṇa-<em>jayantī</em> day,” Mr. Triveri continued, “reading out to the entire audience. That was a rubbish.”</p>

<p>“So what is the wrong there?” Prabhupāda asked. “What was the wrong?”</p>

<p>“He said that, ‘This movement has got these black sheep and they have been banned in Japan. Everywhere they will be banned.’”</p>

<p>“But there is something in Japan which is banned,” Prabhupāda explained. “But what you have got in Japan?”</p>

<p>“Nothing.”</p>

<p>Yaśodānandana added, “First of all, we are not even banned in Japan. The center is still there.”</p>

<p>Prabhupāda said, “No, no, that’s all right. Banned means we had something. But what proof you have got that you have done something in Japan? So it is better. Just like one man said that ‘I have lost fifty thousand this year.’ His friend said, ‘You are still fortunate because you had fifty thousand. But I have no fifty <em>paisā</em> even!’”</p>

<p>Mr. Triveri was encouraged. “So there is something. Here nothing.”</p>

<p>“Prabhupāda,” Bhāvabhūti said, “they said that if Caitanya Mahāprabhu wanted Kṛṣṇa consciousness in the Western countries, why didn’t He go there Himself? That’s what they told us.”</p>

<p>Prabhupāda answered, “So he left the credit for me!”</p>

<p>The devotees all cheered. “<em>Jaya! Haribol!</em>”</p>

<p>“He loves His devotee more than Himself,” Śrīla Prabhupāda said.</p>

<p>Then Harikeśa asked, “Why didn’t Kṛṣṇa kill everybody at the Battle of Kurukṣetra?”</p>

<p>“Yes!” Prabhupāda enthusiastically replied, “Kṛṣṇa, by His simple desire He could kill. He said therefore, <em>bhaviṣyatvān</em>. <em>Pṛthivīte āche yata nagarādi grāma sarvatra pracāra haibe</em>. He [Śrī Caitanya Mahāprabhu] is leaving the task for somebody else.”</p>

<p class="verse">* * *</p>

<p>When preparing Śrīla Prabhupāda’s lunch yesterday, I discovered that the only salt available came in large crystalline lumps that had to be broken and crushed. Because this was somewhat troublesome, I spent half an hour making enough for the following few days, and put the small stone bowl containing the salt on Prabhupāda’s <em>choṇki</em>. I assumed that Prabhupāda would take as much as he wanted from the stock and leave the rest for future use.</p>

<p>During breakfast, however, Prabhupāda dipped pieces of fruit directly into the bowl rather than taking some salt from it onto his plate and leaving the rest. When I cleaned up afterwards I left the salt bowl on the table, thinking it would be all right to use it for other meals.</p>

<p>Though conversing with the other devotees, Śrīla Prabhupāda, as observant as ever, noticed what I did and immediately rebuked me. Calling me a <em>yavana</em> he complained about our Western eating habit of saving remnants of food. “There is no taste, no vitamin, and still they eat.”</p>

<p>Harikeśa asked if it would be all right if I kept the salt in the pot, and then put some on the plate when Prabhupāda took his <em>prasādam</em>.</p>

<p>“I do not know whether it is all right, but it is not all right that you eat and keep it. This is not all right.”</p>

<p>Yaśodānandana explained, “He keeps the salt in a separate bowl. When you require it, he will give you only as much as you require.”</p>

<p>Prabhupāda said, “Yes, that is nice.”</p>

<p>“That’s why the bowl is there,” I explained. “That’s what I intended to do, but I have to keep it away from the table.”</p>

<p>Prabhupāda said, “The principle should be that you should not leave remnants of food. As soon as it is used, it should not be used more. Otherwise it is not possible to give up. <em>Paraà dṛṣṭvā nivartate</em>. ‘I am eating something not very superior, but if I get the chance of eating something superior then I give up this inferior.’”</p>

<p class="verse">* * *</p>

<p>At 10:30 a.m. Prabhupāda went to the two-acre plot, where a simple <em>paṇḍāl</em> had been erected in the center. His <em>vyāsāsana</em> had been brought from Madras and was nicely decorated with flowers. In front of a small but enthusiastic crowd he performed the foundation-stone ceremony for the new temple.</p>

<p>The guest of honor, Śrī B. Gopāla Reddy, a former governor of Uttar Pradesh and, historically, the second chief minister of Andra Pradesh, presented Prabhupāda with a very large and colorful garland. Mr. Reddy gave a short speech, followed by Mahāàsa Swami and then Acyutānanda Swami. At last Śrīla Prabhupāda spoke.</p>

<p>After these preliminaries Prabhupāda got off the <em>vyāsāsana</em> and climbed down into a big hole in the ground with Acyutānanda. A water pot with a coconut on top was placed at the bottom of the hole along with auspicious items such as <em>amṛta</em> and flowers, as well as gold, silver, and copper coins. Then Prabhupāda broke a coconut and poured the water over it all, with the <em>sannyāsīs</em> following suit. Prabhupāda climbed back out and with a short speech unveiled a carved marble commemoration plaque. Finally he went back in the hole and laid a few bricks with cement.</p>

<p>With the foundation proceedings over, he happily initiated eleven new Indian disciples from Mahāàsa Swami’s party, distributing chanting beads and new names before returning to the house, leaving the <em>sannyāsīs</em> to complete the ceremony with a fire sacrifice.</p>

<p class="verse">* * *</p>

<p>Encouraging news of book distribution continues to pour in, to the great pleasure of His Divine Grace.</p>

<p>Hridayānanda Goswami reported progress in the Spanish and Portuguese language translations. “Everything is going on nicely in my zone. In Caracas some men are now selling one hundred Srimad Bhagavatams daily, and in one week-end the Caracas temple has sold sixteen hundred Bhagavatams and four thousand BTGs. We are now composing the Bhagavad-gita Como Ele E (Portuguese) for distribution in Brazil and Portugal, and it will go to the printer in about two or three months. I think that I am supposed to be your secretary for February, so I hope you will not mind my foolish presence. Actually, I just want to surrender unto You completely; everything is simply causing me pain except surrendering unto You. You are so great that I cannot conceive the extent of your glories. Please let me remain as a dog outside your door... ”</p>

<p>Prabhupāda listened carefully smiling at the news, humbly appreciative of his disciple’s glorification. He replied, “I am glad to learn that everything is going nicely in your zone. In South America the people are not so rich nor so enlightened as their North American neighbors, but they are very nice people and somewhat pious and that is their credit. Now just try to deliver Śrī Caitanya Mahaprabhu’s message to them. As you are doing, go on publishing books, more and more, in Spanish and Portuguese.</p>

<p>“It is very good that you have concentrated all the production of Spanish and Portuguese literature to Los Angeles. Please thank all of the devotees of the Spanish BBT for the beautiful edition of Bhagavad-gita As It Is. This book publishing was the most important work of my Guru Maharaja and he ordered me to continue in the Western world. So I am very much indebted to all of you who are helping me to carry out the order of Srila Bhaktisiddhanta Sarasvati Gosvami. Please see that all of our books are translated as nicely as this edition of Bhagavad-gita As It Is.</p>

<p>“Jagadisa prabhu also is thinking to come as my GBC secretary for the month of February. If you come in February I have no objection, I can have three dozen secretaries. If your business will not suffer, you are welcome anytime. I wish to remain with all my disciples together, but we have to do preaching work and therefore have to remain separate. But actually there is no question of separation for one engaged in Lord Kṛṣṇa’s service... . ”</p>

<p>Prabhupāda’s comment about his desire to be with his disciples was neither flattery nor hyperbole. It has become quite apparent to me that Śrīla Prabhupāda truly enjoys associating with his disciples. He seems to thrive on it. Indeed, he never seems happier than when he is sitting or walking with his disciples and discussing the philosophy and activities of the Kṛṣṇa consciousness movement. He is such a wonderful and remarkably merciful person that although we are helpless fools, he actually <em>wants</em> to be with us. His transcendental nature constantly amazes me.</p>

<p class="verse">* * *</p>

<p>For the next few evenings Śrīla Prabhupāda is to lecture at a <em>paṇḍāl</em> held on the grounds of the Śrī Rebala Lakshminarasa Reddy Public Hall, on Nellore’s main street. The hall was a gift to the town by the same family that we are staying with.</p>

<p>At the rear the hall has an open area of about an acre, with a large, brick, stage-like platform built onto a back wall. It is over this that the colorful <em>paṇḍāl</em> has been erected.</p>

<p>The devotees have made adequate preparations with fresh flower garlands, an effective sound system, and a giant painting hanging above the back of the <em>vyāsāsana</em> depicting Lord Caitanya dancing and chanting with the animals in the forest of Jhārikhaṇḍa. A large <em>aśvattha</em> (ragi) tree overshadows the whole setup with its auspicious presence.</p>

<p>This evening a large crowd of about 6,000 people were gathered, eager to see and hear the <em>sādhu</em> who has been converting Westerners into followers of Vedic culture. Over the past few weeks they have seen the devotees perform <em>kīrtana</em> on the main streets of their town. Tonight they listened quietly and with full attention as Śrīla Prabhupāda lectured from the newly received Sixth Canto, Volume One, of the <em>Śrīmad-Bhāgavatam</em>. Śrī Kalaprapūrna Marupuru Kodandarami Reddy, a local poet and author, sitting respectfully at Śrīla Prabhupāda’s feet, translated his English speech into Telegu.</p>

<p>The topic of the lecture was <em>prāyaścitta</em>, or atonement for sinful acts. Śrīla Prabhupāda prescribed the chanting of the Hare Kṛṣṇa <em>mantra</em> as the best means to counteract and remove sinful desires.</p>

<p>He related the story of a devotee of Lord Caitanya who after being sprinkled with water by the Nawab Hussein Shah was considered to have been converted into a Muslim. When the devotee asked a local <em>brāhmaṇa</em> what atonement he should perform, he was told to drink a kilogram of molten lead, while another <em>brāhmaṇa</em> recommended the same amount of hot ghee. Finally the devotee went to Lord Caitanya, who advised him to retire from family life, go to Vṛndāvana and chant Hare Kṛṣṇa.</p>

<p>In his summary Prabhupāda once again indicated his Western disciples as practical evidence of the holy name’s efficacy. “So this Kṛṣṇa consciousness movement is the thoroughly wholesale process of cleansing the mind. If we perform this Kṛṣṇa <em>saṅkīrtana</em> then immediately the core of the heart, which is filled up with all dirty things, will be cleansed.</p>

<p>“For example, you can see practically all my disciples present here. They are coming from Western countries: Europe, America, or even in India—Parsis and other, Mohammedans, they are coming. But they are now pure, cleansed of the dirty things. In this Movement throughout the whole world there are at least ten to twelve thousand devotees like that, and before this life they were all addicted to all kinds of sinful life. Now they are not committing the four pillars of sinful life. Therefore our request is that you take up this chanting method. It is very easy: Hare Kṛṣṇa, Hare Kṛṣṇa, Kṛṣṇa Kṛṣṇa, Hare Hare/ Hare Rāma, Hare Rāma, Rāma Rāma, Hare Hare.”</p>

<p>He also added a caution. “But one thing we must be very careful of, that we should not commit again sinful life. If you chant Hare Kṛṣṇa <em>mantra</em> you become free immediately from all sinful reaction, but if you commit again sinful life, that is your responsibility. Among the ten kinds of offenses one is very grievous. <em>Nāmnād balād yasya hi pāpa-buddhiḥ</em>—if one thinks that ‘I am chanting Hare Kṛṣṇa, therefore whatever sinful acts I am doing, it is becoming counteracted.’ Don’t commit the mistake of the elephant that takes bath thoroughly and again throw dust on your body.”</p>

<p>The audience appeared greatly satisfied with the lecture. Afterward the devotees requested Śrīla Prabhupāda to remain on stage to make a presentation of gifts to various gentlemen who had become Life Members during the day’s preaching. As they came forward one-by-one, Acyutānanda Swami announced their names to the crowd, and everyone clapped as each man received a set of books from Śrīla Prabhupāda’s own hand.</p>

<p>On the way back to the house Śrīla Prabhupāda told us that it is very good to tell a story in the middle of a talk. He explained that in Kali-yuga people are less intelligent, so the <em>Bhāgavatam</em> is ideal for this age because it gives instruction by way of stories.</p>', '', '1976-01-04', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


END $$;
