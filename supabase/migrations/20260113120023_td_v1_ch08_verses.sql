-- ============================================
-- TD Volume 1, Chapter 8 - Verses
-- ============================================

DO $$
DECLARE
  v_book_id uuid;
  v_canto_id uuid;
  v_chapter_id uuid;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = 'td';
  SELECT id INTO v_canto_id FROM public.cantos WHERE book_id = v_book_id AND canto_number = 1;
  SELECT id INTO v_chapter_id FROM public.chapters WHERE canto_id = v_canto_id AND chapter_number = 8;


  -- January 9th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'January 9th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p><strong>Hare Krishna Land, Juhu Beach, Bombay</strong></p>

<p>Madhudviṣa Swami phoned early today, and Tamal Krishna Mahārāja informed him that Prabhupāda is not feeling well enough to travel the long distance to Melbourne. Although extremely disappointed, Madhudviṣa withdrew his request for Prabhupāda to attend.</p>

<p>Despite his weak health, Śrīla Prabhupāda is still willing to go if their Ratha-yātrā arrangements are dependent on his personal presence. Only after receiving Madhudviṣa’s assurance that the festival could go on without him did he finally decide not to go. Prabhupāda was more concerned that their preaching carry on unhampered than about his own comfort.</p>

<p>He spent a quiet day, foregoing even his morning walk.</p>

<p class="verse">* * *</p>

<p>In answering his mail, Prabhupāda reiterated to Nitāi in Vṛndāvana that he wants all his students to take <em>Bhakti-śāstrī</em> examinations. He requested Nitāi to prepare a guide to Deity worship called <em>Arcana-paddhati</em> based on the <em>Hari-bhakti-vilāsa</em> by Sanātana Gosvāmī. He asked him to have it ready by the Gaura Pūrṇimā festival.</p>

<p>Nitāi reported that the plans for the new <em>gurukula</em> are being drawn up and will be submitted soon, and that already some highly qualified men have applied for the position of principal. Prabhupāda said that he would consider who to appoint later, when the school is actually built.</p>

<p>There was also a long letter from Tuṣṭa Kṛṣṇa Swami in New Zealand. He and his men are preaching vigorously and have launched several new projects as well as developing their farm. He has opened a vegetarian restaurant with money that a boy inherited from his family’s beef farm. They had good publicity from the press and on television, and he also has plans to start a Vedic University as part of his development of a <em>varṇāśrama</em> community.</p>

<p>In one short paragraph he also affirmed his desire to distribute Prabhupāda’s books, although he mentioned some devotees were “hesitant due to previous pressure put on them to collect certain quotas each day.” (A main point of contention between Tuṣṭa Kṛṣṇa’s faction and the body of devotees is that they dislike the major emphasis that ISKCON leaders and devotees place on the importance of book distribution, and the pressure sometimes applied to encourage devotees to distribute the books.)</p>

<p>Pleased with their preaching efforts, Prabhupāda sent a long letter in reply, dealing with the report point by point. He especially stressed the importance of book distribution. “So far the devotees being hesitant to distribute books on account of pressure, sometimes pressure is required, especially when one is not so advanced. Of course it has to be applied properly, otherwise there may be some bad taste. But spontaneous service can only be expected from advanced devotees. It is vaidhi-bhakti—vaidhi means ‘must.’ Sometimes devotees are promised a plate of maha-prasadam for the biggest distributor. There is no harm. Actually one should try to serve Krsna to his or her full capacity without thought of reward—service is itself the reward. But this takes time to actually realize, and until that platform is achieved some pressure or inducement is required.”</p>

<p>He was pleased about the opening of the restaurant but cautioned him that it should not be seen simply as a place for promoting vegetarianism. “We should not waste time encouraging vegetarianism as opposed to meat eating. We want to encourage prasadam taking, and that is automatically vegetarian.”</p>

<p>Happy about the proposal to start a Vedic University, Prabhupāda outlined to Tuṣṭa his recent plans for instituting examinations within the Society and explained that anyone who wants to become a <em>brāhmaṇa</em> will have to sit for an examination once a year at Māyāpur.</p>

<p>At the same time he also pointed out that, “In our Vedic Universities we will not encourage anyone to become merely a bookworm... . There must be life—rising early in the morning, attending mangala arati, taking prasadam etc. The man who is studying will be brahmana, the farmer will be vaisya. In this way there will be divisions, but they are all one in the service to Krsna.”</p>', '', '1976-01-09', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- January 10th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'January 10th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Prabhupāda felt a little better this morning. He took his walk following the usual route along the beach and enjoyed a long and interesting talk with a local movie director. Bombay is the center of India’s film industry, the third biggest in the world. Many people connected with the movie trade are now becoming interested in the activities of ISKCON. This particular man was polite and receptive but had many philosophical misconceptions about spiritual matters, which he allowed Śrīla Prabhupāda to correct.</p>

<p class="verse">* * *</p>

<p>During the massage Tamal Krishna Goswami went over the day’s mail. He read out a letter from Yamunā dāsī. She and Dīnatāriṇī dāsī have a small farm in Oregon. On Śrīla Bhaktisiddhānta Sarasvatī’s disappearance day Jayatīrtha installed Deities of Śrī Śrī Rādhā-Vanabihārī there.</p>

<p>They are hoping to start an <em>āśrama</em> for senior women, and they requested financial assistance from the BBT to buy a place. Their idea is to have about twelve women and gradually begin a preaching program. Yamunā, however, did express some apprehension, admitting, “Generally women are mad after sense gratification, to dip and gossip, so thus we feel to proceed with careful attention.”</p>

<p>In a separate letter Jayatīrtha also inquired whether a BBT loan could be given for the ladies’ project. He said the property they are looking at costs $100,000, requiring a down payment of $25,000. He wanted to know what priority Prabhupāda gives to this kind of project, suggesting that he might help oversee managerial and financial matters. He also suggested that Yamunā and other <em>āśrama</em> members could earn some income and help support themselves by sewing Deity clothes for the <em>sannyāsīs’</em> traveling parties.</p>

<p>Prabhupāda’s personal opinion is that women should not live independently. “Why don’t they go to L.A.?” he asked Tamal Krishna. Nevertheless, since they are eager to begin the project, he encouraged them. “You can attract the fair sex community. Most of them are frustrated being without any home or husband. If you can organize all these girls they will get transcendental engagement and may not be allured to the frustration of life. Your engagement should be chanting and worship of the Deity.”</p>

<p>He also tactfully laid down strict guidelines for the ladies to follow, stressing that as single women they should live very humbly and not “dress nicely to attract men” nor attempt to start any large program. “In bhakti there is no grotesque program. A humble program is better. We are doing all these grotesque programs to allure the masses. My Guru Maharaja used to say that no one hears from a person coming from a humble, simple life. You remain always very humble.”</p>

<p>To Jayatīrtha prabhu, however, he spoke more candidly, describing their desire to be independent as a “defect.” He further elaborated on this by saying that according to Vedic culture a woman cannot live independently. He decided that if they wanted this badly enough, he would allow it. But they must function managerially and financially independent of ISKCON, although he conceded that Jayatīrtha could check on them now and then to see if they were chanting and following the rules of the Society. He also made it clear there could be no connection whatsoever with <em>sannyāsīs</em>.</p>

<p>Viśvakarma dāsa, the Toronto president, sent a report detailing the successful purchase of a large church on a main street in the heart of Toronto. Last year Śrīla Prabhupāda told them to try to purchase it, and despite great opposition from the clergy they completed the deal by having some enthusiastic Indian members conduct the negotiations. It cost $400,000 in total, and although the temple only provided $80,000 deposit, they were able to secure the rest as mortgages. Now they plan to reinstall Śrī Śrī Rādhā-Kṣīra-corā Gopīnātha in mid-January.</p>

<p>Śrīla Prabhupāda was delighted, and considered the purchase of the church a great victory, “a topmost triumph.” “Christianity is now declining,” he wrote, “therefore they are having to sell all their churches to us. Because they have no clear idea of God, people are not satisfied with them. But we can explain what God is, so people are appreciating more and more our Movement. Now by Krsna’s grace you have a beautiful temple, use it to preach very vigorously. If you all strictly follow the principles and chant sixteen rounds, your spiritual strength will be insured, and our Movement will become increasingly prominent.”</p>

<p>On hearing that over 200,000 cars per day pass by the church, Prabhupāda recommended that they immediately erect a neon sign with the flashing words of the full <em>mahā-mantra</em> on it. He said it will be a great achievement if they can accomplish this.</p>

<p>Prabhupāda also acknowledged receipt of a five-page report from Viśvakarma describing the activities of Svāmī Bon, Prabhupāda’s Godbrother. Apparently Bon Mahārāja visited some of the universities in North America, openly criticizing Śrīla Prabhupāda and his books. He also advised professors not to use the books. Śrīla Prabhupāda told Viśvakarma that in the future we should completely avoid him and have no further connection with him.</p>

<p>Jaśomatīnandana also sent an update on his attempts to secure a suitable center in Ahmedabad. The building he had taken Śrīla Prabhupāda to see had several defects, and since then he has located a much better place in the city center, but it is only available initially for a three month period.</p>

<p>The owners are thinking of using it for some charitable cause, so Prabhupāda encouraged him to accept it despite the time limit. “Even if you can stay only three months, what is the loss? You can always look for another place. Now people are seeing how genuine our Movement is, they are coming forward to offer us so many places. We simply have to maintain our strict principles, keeping ourselves pure. Otherwise, there are so many bogus institutions doing business in the name of God and simply cheating the people. We have to be careful not to degenerate like these others. Our strength depends upon regular chanting the required sixteen rounds and rigidly adhering to the regulated principles.”</p>

<p>Prabhupāda recently received some material, via Bhagatjī in Vṛndāvana, translated into Hindi by Nṛsiàha Vallabha Gosvāmī. Bhagatjī also reported that negotiations for establishing a bank branch in our temple are now in the last stage. The head office has agreed, and they are only waiting for approval from the Reserve Bank.</p>

<p>Satisfied with the progress on the bank, Prabhupāda wrote Bhagatjī to settle terms with the Gosvāmī regarding his books.</p>

<p class="verse">* * *</p>

<p>Harikeśa prabhu has completed his article “Spiritual Dialecticism.” Prabhupāda is so pleased with it that he had it sent to Rāmeśvara in Los Angeles today, with a request that it be printed in <em>Back To Godhead</em> magazine. He also suggested that if they receive a good response from the article, it can be released as a small book.</p>

<p class="verse">* * *</p>

<p>In the early evening Prabhupāda called me to give him a dry, full-body massage. He is not feeling well, and took rest at 8:00 p.m. I felt frustrated that I was unable to help him in any way. Then, amazingly, at 9:30 p.m. he got up and continued his translation work throughout the entire night!</p>', '', '1976-01-10', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- January 11th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'January 11th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Prabhupāda obviously felt better this morning. The movie producer came down to the beach again and engaged Prabhupāda in a lively debate. He wasn’t shy to express his thoughts and opinions, but he listened with great respect and attention to Prabhupāda’s responses. Prabhupāda was so enlivened by the man’s questions and challenges that the walk took much longer than usual. We recorded two full sides of tape on the reel-to-reel Uher recorder. Prabhupāda showed no signs of illness and at the end of the walk he seemed stronger than ever.</p>

<p class="verse">* * *</p>

<p>A letter arrived today from Bahūdaka, Vancouver temple president, giving a positive report of university preaching and increased <em>saṅkīrtana</em> activity. Despite some initial reluctance from the school faculty to have them, they have given many classes to the students and were received so favorably that many teachers invited them back.</p>

<p>For the last year Bahūdaka has been overseeing the development of a new farm, but he recently returned to the city center in order to encourage book distribution, which has seriously dwindled. He is personally going out on book distribution two days a week and expressed the sentiment that all ISKCON leaders should do this, both as an example to others and for their own enlivenment.</p>

<p>Prabhupāda liked his report. He recalled the struggles of his other Canadian center in Toronto in getting the church property. Then he pinpointed the reason for the opposition. “Our Movement is authorized. Our books are based on the statements of the most exalted devotees. And if we follow strictly the guidelines for devotional service as they are given in The Nectar of Devotion and Nectar of Instruction, then no one can touch us... . All the groups are declining, including the Christians. We are being harassed by the authorities and they are all Christians. Because they are losing ground, and we are increasing, they are trying to stop us. There is always a battle between the demons and the devotees; but the devotees always win because they are protected by Krsna.”</p>

<p>Prabhupāda also accepted some new candidates for initiation. As he has been repeatedly doing in many letters recently, he stressed the importance of becoming fixed up in the philosophy by regular study. He also mentioned the upcoming <em>śāstra</em> examinations.</p>

<p>In response to Bahūdaka’s question regarding the use of the harmonium, he asserted that the harmonium is only to be used for chanting in <em>bhajana</em> provided it is played melodiously. He said it is not to be played for <em>kīrtana</em> or <em>ārati</em>.</p>

<p class="verse">* * *</p>

<p>During the day he relaxed, taking advantage of the absence of visitors to read, chant and conserve his energy. In the evening he gave the Sunday feast lecture in Hindi.</p>', '', '1976-01-11', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- January 12th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'January 12th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Dr. Patel joined us on the walk this morning. In his usual boisterous manner he often interrupted Prabhupāda before Prabhupāda could finish what he was saying. Sometimes he was so eager to speak that he couldn’t get his words out at all. His overly-familiar manner with Śrīla Prabhupāda sometimes annoys us disciples and leads to a little friction between him and us. But Prabhupāda has infinite tolerance, born from his eagerness to help others advance in their spiritual lives. He sees only the good in others, and this morning his liberal and friendly dealing was clearly manifest.</p>

<p>Dr. Patel had been energetically defending the position of medical science and its practitioners against Śrīla Prabhupāda’s criticisms. He insisted that they do not claim to be able to save life, nor is that even their goal. His opinion was that they are simply trying to help people live the limited life they have in a better way. He felt that Prabhupāda’s impression of atheistic scientists was a thing of the past. He compared them favorably to previous impersonalist Vedic philosophers, declaring that nowadays most scientists accept there is a God or some superior force.</p>

<p>Śrīla Prabhupāda countered that impersonalism is also atheism.</p>

<p>One of the doctor’s companions objected. The man held the typical impersonalist view that <em>jṣāna</em>, the cultivation of knowledge, is superior to <em>bhakti</em>, devotion to the Supreme Personality of Godhead.</p>

<p>After taking Prabhupāda’s permission, it was Dr. Patel who explained to the man that the Vaiṣṇava concept that God is ultimately realized as the Supreme Person is correct. He described the progression of realization from Brahman and Paramātmā to Bhagavān. Then he declared that as little as two years ago he had been inclined to the impersonal school of thought. But by very carefully studying various Vaiṣṇava works, and especially Śrīla Prabhupāda’s books, he was now convinced that devotion to the Supreme Lord, Kṛṣṇa, is the highest understanding.</p>

<p>The devotees all cheered at his pronouncement, and Prabhupāda was also very pleased. It is clear that despite Dr. Patel’s habit of challenging, albeit good-naturedly, and his tendency to carry his own opinion, he has actually become Śrīla Prabhupāda’s follower. Prabhupāda recalled that his teacher at school used to say that if a boy is slow to understand he will also be slow to forget; and a boy who is quick to understand, will be quick to forget. He declared that Dr. Patel had been slow in learning but now he will not forget.</p>

<p>They also talked briefly about the present Government of India and Prime Minister Mrs. Gandhi’s declaration of a state of emergency. People are unhappy with her, but with thousands of her political opponents jailed, everyone is afraid to speak.</p>

<p>Dr. Patel criticized her dictatorial attitude, but Śrīla Prabhupāda, who often refers to democracy as “demon-crazy,” said that if sinful people vote in a sinful government, why complain?</p>

<p>Apart from that, he explained that having a dictator is not bad if the dictator is actually religious. Then there is no need of elections.</p>

<p>Dr. Patel sarcastically noted that Mrs. Gandhi went to the temples.</p>

<p>But liberal-minded Prabhupāda chose to see the good in her, as he did with Dr. Patel. “No, no. She has got the tendency of spiritual life, and she requires improvement, that’s all. She has spoken in Chandigarh that ‘Now we require spiritualism.’”</p>

<p class="verse">* * *</p>

<p>Since we were due to leave for Calcutta on the early afternoon flight, Prabhupāda took his massage at 9:30 a.m. and his lunch at 11:45 a.m.</p>

<p>Tamal Krishna came in with the mail, holding two letters from Rāmeśvara. One was a BBT report and the other a letter written on behalf of the Los Angeles community.</p>

<p>Written on December 18th, the BBT report included details of the previous day’s book distribution from the Atlanta airport—astounding figures establishing a new one day record. Tripurāri Swami and his party sold 2,900 hardbound books, with Cārudeṣṇa topping the list with 303 books sold. Fifteen other men sold over 100 each.</p>

<p>Rāmeśvara also enclosed copies of a new publication, <em>The Kṛṣṇa Consciousness Movement is Authorized</em>. The pamphlet explains the basic concepts of the Movement, quoting favorable statements from many prominent scholars and book reviews garnered by the Library Party.</p>

<p>The Los Angeles report dated December 25th gave a detailed description of their Christmas marathon activities and the results, which were truly amazing. Devotees worked day and night with virtually no rest for the entire six days, staying out until one or two o’clock in the morning and going back out again a few hours later at six or seven. Over 100 men and women participated in the marathon, which Tulasī dāsa and Hāsyapriya dāsa expertly organized. They sold 6,523 big books (<em>Bhagavad-gītā</em> and <em>Śrīmad-Bhāgavatam</em>, etc.) 419 <em>Kṛṣṇa</em> trilogies and 93,031 copies of <em>Back to Godhead</em> magazine. Collections totaled over $60,000. Gopavṛndāpāla sold 529 big books, and four women—Jadurāṇī, Mulaprakṛti, Dīkṣāvatī, and Gaurī—all sold over 300 each. Mahātmā sold over 2,000 BTGs.</p>

<p>Needless to say, Śrīla Prabhupāda deeply appreciates the efforts of his disciples to sell his books. He said there is nothing mundane about the great efforts his disciples are making to spread Kṛṣṇa consciousness on his behalf. He replied with enthusiasm:</p>

<p>“The book distribution in Los Angeles during the six day period is transcendental samadhi. They are working in trance, not on the material platform. No common man can work so hard, it is not possible. Working without sleep means no death. Sleeping is dead condition. Your book distribution is really intoxication.”</p>

<p>Prabhupāda welcomed the printing of the pamphlet <em>The Kṛṣṇa Consciousness Movement is Authorized</em>. He said it is very important for establishing the authenticity of his Movement, especially among the educated and influential classes of man.</p>

<p>Prabhupāda is eager to see our Kṛṣṇa consciousness movement accepted by every sector of society, and the best way to start is from the top. He wrote back with some suggestions how to distribute the pamphlet. “You can send it to important members of the Government, businessmen, entertainers, sportsmen, etc. Another device is that you can address it to ‘Any Respectable Gentleman, Post Office.... , City... ., State... . ’ The postman will then deliver it to some respectable gentleman. Everyone who gets it will think, ‘I am a most respectable gentleman because he has given it to me.’ The best thing is to find out the customers list to some big magazine like Time or Life, and post it to them.”</p>

<p class="verse">* * *</p>

<p>We left on time, flying out to Calcutta at 2 p.m. At the outset of the journey Prabhupāda entrusted his soft red attachê case to my care. The case holds all his important documents, and either he or his secretary generally carries it. Since the secretary is now changing every month and I am a regular member of the traveling party, Prabhupāda added its guardianship to my duties. I felt privileged to be entrusted with this responsibility, and I sat next to him on the plane with the case carefully tucked under the seat in front of me.</p>

<p>After some time Śrīla Prabhupāda got up to go to the bathroom. I rose to escort him down the aisle and picked up the case, not wanting to leave it unattended. Prabhupāda shook his head with slightly amused disbelief. Obviously no thief could make off with the bag while we were flying 30,000 feet in the air. Apart from that, Tamal Krishna Mahārāja was in the opposite aisle seat. Prabhupāda chuckled, while I blushed and replaced the bag under the seat.</p>

<p>In mid-flight the captain came back to visit Prabhupāda and sat next to him while they talked. He was very polite and respectful, expressing his admiration for Prabhupāda’s preaching work. He invited Prabhupāda into the cockpit, offering him a seat behind his own. Somehow Tamal Krishna and Harikeśa also managed to squeeze in, and all three of them remained in the cabin as the plane landed at Dum Dum airport. They came out smiling.</p>

<p>Prabhupāda enjoyed the experience. He said that in principle flying a plane is like typing—a mechanical skill. Once you know the procedures and which dials to look at, it becomes easy to master.</p>

<p>Sudāmā, Jayapatāka, and Śrīdhara Swamis and other devotees met us at the airport.</p>

<p>Rather than going straight to the temple, Prabhupāda first went to inspect a flat he is thinking of purchasing for his former family members. Then he traveled to the temple in our own bus.</p>

<p><strong>ISKCON Śrī Śrī Rādhā-Govinda Mandir</strong></p>

<p><strong>3A Albert Road, Calcutta 17</strong></p>

<p>ISKCON Calcutta is situated in a large, old, two-story semidetached building built during the time of the British Raj in what was once the European quarter. Although at one time it was rather impressive architecturally, with an arched entrance and an upper veranda adorned with large, capped columns, it has become quite dilapidated over the years. ISKCON occupies only the top floor on one side.</p>

<p>The temple overlooks some public gardens and a lake bordering Albert Road. At times the devotees have to bathe in the lake because there often is no water.</p>

<p>Prabhupāda climbed the wide interior stairway and, removing his shoes, entered the only large room in the place, now converted into a temple room. He offered his obeisances to the presiding Deities Śrī Śrī Rādhā-Govinda and Their Lordships Jagannātha, Balarāma and Subhadrā.</p>

<p>Then, without giving an arrival speech, he went out along the wide front veranda to his room at the end. This room is kept exclusively for his use, but the devotees use the small adjoining bathroom when he is away.</p>

<p>Overall, the building is not impressive, but Prabhupāda wants to keep it because its location is close to the central business district.</p>

<p>I looked through the back rooms for somewhere to stay, without success. There are only a few cramped rooms, allocated for Deity paraphernalia, the <em>brahmacārī āśrama</em>, some storage facilities for books, and an access to the roof.</p>

<p>I noticed that the cooking is done on coal-fired buckets on a small porch in the rear, which accounts for the soot and grime covering everything in the area. There is so little extra space that Tamal Krishna Mahārāja decided to set up an office right outside Prabhupāda’s door on the veranda, while I moved into the life membership room at the opposite end.</p>

<p>Prabhupāda is not at all pleased with the current state of affairs, for the standard of the temple management has deteriorated. Reports have been submitted that many Life Members are upset with the state of things and in their dealings with the temple president, Bhagavat dāsa. He only recently replaced the long standing president, Gargamuni Swami, but is unable to cope very well with the service. Śrīdhara Swami from Bombay is here now and has been requested to take over the responsibility; but he also is not keen on management.</p>

<p>Prabhupāda settled in quickly, immediately engaging Jayapatāka and Sudāmā Swamis in conversation about our Māyāpur center. It sounds as if everything is developing nicely there. Plans are being drawn up for a temple some 350 feet in height, and Prabhupāda instructed Jayapatāka to buy more land. The devotees have purchased an ocean-going boat capable of sailing to Orissa and intend to install Gaura-Nitāi Deities on board.</p>

<p>Jayapatāka reported that a small Bengali book titled <em>Gītār-gāna</em>, which Śrīla Prabhupāda wrote before going to the West in 1965, is now in print and selling many copies. Containing all the <em>Gītā</em> verses in Bengali prose, it was written in such a way that no one could misinterpret the meaning. Prabhupāda was very pleased to hear that all the Māyāpur <em>gurukula</em> children are studying it and learning to chant the verses. Smiling, he recalled how his Godbrothers used to call him <em>kavi</em>, “poet,” and that even at school he would write English verse.</p>

<p>Halfway through the conversation Śrīla Prabhupāda sent Sudāmā Swami to the kitchen to cook some <em>samosās</em>. He also told him how to make a quick chutney from chopped tomatoes, green chili, and lemon juice. Sudāmā did it all very expertly.</p>

<p>Sudāmā Mahārāja has only recently returned after falling away from his spiritual practices for some time. When he left the room, Prabhupāda, obviously pleased with his eagerness to serve, said that he was “a nice boy” who had been misled. He was exceedingly happy to see him back and enthusiastically engaging in devotional service.</p>', '', '1976-01-12', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- January 13th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'January 13th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Today was Ekādaśī, and Śrīla Prabhupāda took his morning walk along the Gaṅgā. Hundreds of pilgrims were taking a dawn bath there, having come for the Gaṅgā-Sāgara-melā. Prabhupāda explained that <em>sāgara</em> is the sea, so the <em>melā</em> is a spiritual gathering on an island in the Gaṅgā’s estuary.</p>

<p>Evidently eager pilgrims had traveled from as far away as Rajasthan in the northwest. They camped along the banks of Mother Gaṅgā, washing their few possessions, as well as themselves, in the holy waters, unmindful of the boats and other river traffic passing by. They sat contentedly on the pathways cooking breakfast and drying out their clothing.</p>

<p>Noting the shining <em>loṭā</em> one man carried, Prabhupāda remarked that if even the <em>loṭā</em> is so clean, we can understand how clean he must personally be.</p>

<p>Prabhupāda also recalled how he and his mother had bathed in the same spot when he was a child.</p>

<p class="verse">* * *</p>

<p>Because it was Ekādaśī we skipped breakfast and fasted until noon. But at lunchtime the devotees inadvertently broke the Ekādaśī vow because the cook accidentally put peas into the vegetables. No one noticed until too late. Fortunately I arrived late for lunch because I had been massaging Śrīla Prabhupāda. Just as I was about to eat, Jayapatāka Mahārāja shouted for me to stop. Although initially annoyed at being told not to eat, I was relieved when he pointed out the peas.</p>

<p>Shamefaced, Tamal Krishna Mahārāja went to Prabhupāda to report what had happened and to find out what should be done.</p>

<p>Śrīla Prabhupāda told us we were all nonsense. He angrily rebuked us, “Now you have to fast for three days!” This shocked everyone. “Yes, that is the procedure,” he confirmed. Seeing the stunned look on our faces he relented but said that we should observe Ekādaśī for the rest of the day and then again tomorrow on Dvādaśī.</p>

<p class="verse">* * *</p>

<p>During the morning Śrīla Prabhupāda noticed I was limping because of a boil forming on my leg. Later, while talking with Jayapatāka Mahārāja, he called me in and told me to show him the boil. Prabhupāda was so thoughtful that he asked Jayapatāka to go out and buy some medicine to heal the boil. I was somewhat embarrassed that a <em>sannyāsī</em> should be running an errand on my behalf, but Prabhupāda was more concerned to see that it was cured. Like a loving father, he always takes time to see that we are properly looked after, especially concerning our health.</p>

<p class="verse">* * *</p>

<p>In the evening Prabhupāda spoke in Hindi and Bengali to the large crowd that packed the temple room. The <em>darśana</em> seemed especially sweet and enjoyable because Śrīla Prabhupāda is the local Calcutta success story. Although Prabhupāda always remains wholly transcendental in consciousness, he is fully familiar with the surroundings and cultural idiosyncrasies of Bengal. There thus seemed a special rapport between him and the audience as he preached on the necessity of becoming Kṛṣṇa conscious.</p>', '', '1976-01-13', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- January 14th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'January 14th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Prabhupāda took his walk along the Gaṅgā again. Although it was early morning, hundreds of people lined the river bank bathing, doing <em>pūjā</em>, and washing clothes.</p>

<p>Śrīla Prabhupāda commented on the simplicity of village life and the importance of the Ganges. Many people have come to the <em>melā</em> for spiritual purification, carrying only a few simple possessions. Everywhere <em>dhotīs</em> and <em>sārīs</em> hung on fences or were spread out on the ground to dry, their owners sitting or squatting nearby, patiently waiting.</p>

<p>Prabhupāda remarked that even if they only have one piece of cloth, they will not fail to wash it every day. That is Vedic culture.</p>

<p class="verse">* * *</p>

<p>After breakfast <em>prasādam</em> Prabhupāda and I went to see an apartment at Park Circus. He is thinking of purchasing it for his son and daughter, who met us there. Prabhupāda didn’t say very much to them, and after a few minutes we returned to the temple.</p>

<p class="verse">* * *</p>

<p>About 12:30 p.m. during his massage, which he took sitting on a mat in a little patch of sunlight on the bathroom floor, Tamal Krishna Goswami came to report on a visit he and Jayapatāka Swami had just made to the Śrī Caitanya Matha.</p>

<p>They had talked with Mādhava Mahārāja, Prabhupāda’s Godbrother, showing him Prabhupāda’s translation of <em>Śrī Caitanya-caritāmṛta</em>. They asked if Prabhupāda’s books could be displayed there during a current five-day festival the Matha was holding. But Mādhava Mahārāja only gave them excuses why it was not possible. As they were leaving the Matha, Tamal Krishna and Jayapatāka stopped to talk with the secretary. He appeared interested and friendly, and he inquired about the books. The secretary said that he felt they should follow our example in preaching but were tied up too much in routine temple maintenance work.</p>

<p>Looking over their advertising brochure, Prabhupāda noted that the invited speakers included no <em>sannyāsīs</em> or spiritual personalities. They were simply government ministers and the like.</p>

<p>Whereas for us, Śrīla Prabhupāda’s books are the main feature of our preaching work, he noted that after forty years the Gaudiya Matha is still selling Śrīla Bhaktisiddhānta Sarasvatī’s books. He was critical that they have not been able to produce any literature of their own. He said that many of his Godbrothers were envious of his success. He specifically named three of them.</p>

<p>Prabhupāda’s comments show that he has learned not to expect anything from them. He told us we should avoid dealing with them. He said that rather than help, they will simply attempt to spoil our own work.</p>

<p class="verse">* * *</p>

<p>Madhudviṣa Swami arrived from Australia in the afternoon. He is taking a break from management and intends to stay with Prabhupāda for a few weeks to bathe in the nectar of his association. He reported that the Ratha-yātrā in Melbourne was very successfully executed, although the devotees were disappointed that Śrīla Prabhupāda could not attend. He showed Prabhupāda some favorable press reports, and told him that the Australian devotees are enthusiastically pushing forward the Movement there. He also gave him a large donation of $10,000 for <em>guru-dakṣiṇā.</em></p>

<p class="verse">* * *</p>

<p>Mrs. Lalita Bose, an influential woman and good friend to Prime Minister Indira Gandhi, visited Prabhupāda in mid-evening. She is the niece of “Netajī” Subhas Chandra Bose, an old school friend of Śrīla Prabhupāda’s who became a national hero (especially in Bengal) during the agitation for Indian independence in the 1930–40s. He had advocated the use of force as a means to drive out the British, and organized an independent Indian army based in Singapore during the Second World War with the intent of marching to India to liberate her. Mysteriously, he was killed in an air crash at the end of the war.</p>

<p>Prabhupāda said the real reason the British decided to quit India was because of increasingly violent opposition; it was not because of Gandhi’s non-violence movement. When they understood that the police and army were no longer cooperative, they knew they could no longer rule.</p>

<p>Mrs. Bose was talkative and loud, but respectful and willing to help where she could. She laughingly told Prabhupāda that Netajī had organized an army to conquer India, and now Prabhupāda had organized an army of Vaiṣṇavas to conquer the world.</p>

<p>Prabhupāda requested her to assist with the ongoing visa problems his American disciples are having preventing them from staying in India for extended periods.</p>

<p>During their conversation she also remarked that Mrs. Gandhi had said that she thought Śrīla Prabhupāda was a very pure saint.</p>

<p>After she left, Prabhupāda called in Madhudviṣa and Tamal Krishna Mahārājas. He asked them to organize a bus program throughout India for <em>saṅkīrtana</em> propagation and <em>prasādam</em> distribution. Mrs. Bose’s comment about Mrs. Gandhi had encouraged him. He told them that if this is her true sentiment, then we should take advantage of the favorable climate immediately.</p>

<p>Despite the current state of national emergency and paranoia that ISKCON is a front for the CIA, Prabhupāda is certain that the Kṛṣṇa consciousness movement can change the face of the country if ISKCON’s leading devotees can establish large-scale programs in India for at least one year. He is intent on beginning this program and talked animatedly about how it should be organized.</p>

<p>Tamal Krishna expressed some doubt about his own involvement because of his responsibilities in America. Madhudviṣa Swami, however, was excited about the scheme and promised to research the cost of vehicles.</p>

<p>As the conversation became more relaxed and moved into other topics, Tamal Krishna Mahārāja recalled how Prabhupāda had personally obtained the London Deities, Śrī Śrī Rādhā-Londonīśvara. Prabhupāda had been invited to London to officially open the temple, but the Deities that had been ordered had not arrived on time. Only a few days before the proposed installation date the devotees spotted some Rādhā-Kṛṣṇa <em>mūrtis</em> in a shop window. Prabhupāda immediately went to the shop and personally persuaded the owner, an Indian man, to let him have Them. Even as he and the man spoke, Prabhupāda ordered the devotees to carry Their Lordships into a waiting van, despite the man’s hesitation. Later Prabhupāda settled everything very amicably with him.</p>

<p>These reflections on his past struggles to establish ISKCON revealed just a hint of his inner, intimate—and to us, hidden—relationship with Their Lordships. Śrīla Prabhupāda’s smiles and laughter at Tamal Krishna Mahārāja’s recollections made me wonder what kind of special <em>līlā</em> he has with Śrī Śrī Rādhā-Londonīśvara. Prabhupāda said that They are the best in the Society; the first large Deities to be installed.</p>', '', '1976-01-14', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- January 15th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'January 15th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>For a change Śrīla Prabhupāda took his walk around the grounds of Calcutta’s famous Victoria Memorial. Many people were out exercising and walking. Rather than speak, Prabhupāda had us perform a gentle <em>kīrtana</em> the entire time.</p>

<p class="verse">* * *</p>

<p>Later in the morning Prabhupāda went to see another flat. And then just before massage time he sent me to show two friends of his the place we saw yesterday.</p>

<p>Tamal Krishna Mahārāja gave Prabhupāda his massage. It was a surprise to me that it was the first time for him. When I returned he was still massaging Śrīla Prabhupāda. Prabhupāda told Tamal to stop, insisting that I complete the massage, even though only his right leg remained to be done. Tamal had a luncheon appointment, and Prabhupāda didn’t want him to miss it.</p>

<p>Madhudviṣa Swami, keen about Śrīla Prabhupāda’s suggestion last night to preach in India, spent a good part of the day finding out about obtaining a bus. Prabhupāda also spoke with Madhudviṣa about the new building in New York. He asked him if he wanted to manage it. Madhudviṣa Swami liked the idea. He has been the GBC in charge of Australia and New Zealand since mid-1972, and he seems ready for a change.</p>

<p class="verse">* * *</p>

<p>Later in the day I came before Prabhupāda wearing a new raw silk <em>dhotī</em>, which he immediately noticed. He asked me whether it was silk and how much it cost. Remembering that in Vṛndāvana he had complimented me for getting a good <em>dhotī</em> for only fourteen rupees, I thought he might not be happy that I had spent 175 on this one. However, he was quite pleased and remarked that silk is very nice.</p>', '', '1976-01-15', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- January 16th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'January 16th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>We walked in Victoria Gardens again, but without an accompanying <em>kīrtana</em>. Prabhupāda said little, and we all chanted <em>japa</em> as we walked around the huge, empty, marble edifice.</p>

<p>On the way out to the memorial grounds, we passed the police barracks just as an officer cantered out riding a magnificent thoroughbred. It must have been fully seventeen hands high and beautifully groomed. As we admired the elegant creature Śrīla Prabhupāda commented, “The horse is the most beautiful animal.”</p>

<p>In surprise Tamal Krishna Mahārāja asked, “Not the cow, Śrīla Prabhupāda?”</p>

<p>“Cow is not beautiful,” Prabhupāda replied, matter-of-factly, as if we should have known.</p>

<p>Harikeśa laughed. For him it was <em>dejavu</em>. He told us that last year Prabhupāda went out for his walk, saw a horse, and made the same comment. His secretary had asked the same question about the cow and received the same reply—except it was Brahmānanda Swami and not Tamal.</p>

<p class="verse">* * *</p>

<p>This morning’s newspaper carried a feature story on our Māyāpur Candrodaya Mandir. After breakfast <em>prasādam</em> Jayapatāka Swami read the whole article to Prabhupāda, noting a certain amount of cynicism on the part of the writer. The man had noticed the <em>pūjārī</em> offering <em>bhoga</em> to Śrī Śrī Rādhā-Mādhava in a Deity room warmed by a heater. The author questioned who the heater was for, since he had been told that everything we did was for God’s pleasure and not our own. What would God want with a heater? He concluded that it must have been for the devotee’s comfort.</p>

<p>Prabhupāda said that this is the atheistic mentality. He is compelled to question who it is for; whereas a devotee knows that it is for the Lord. If the Deities can enjoy <em>bhoga</em>, why not heat? This inability to understand that God has senses is impersonalism. In their experience personality means “having limited senses.” Therefore God must be impersonal in order to be unlimited.</p>

<p>“Actually,” he said, “unlimited means you can eat six <em>rasagullās</em>, but Kṛṣṇa can eat unlimited coconuts. Kṛṣṇa has senses, and He appreciates the heater.”</p>

<p class="verse">* * *</p>

<p>Prabhupāda told us today how to make <em>baḍa</em> by grinding up rice and <em>urad dāl</em> after first soaking them, making a paste, spicing it with chopped green chili, salt, and pepper, and then deep-frying small balls of it in hot ghee. An accompanying chutney can be made from the soft, white flesh of a young coconut mixed with green chili, salt, and lemon juice. He took a few <em>baḍas</em> made by Harikeśa in the evening to gain strength for his night’s translation work.</p>', '', '1976-01-16', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


END $$;
