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


  -- January 21st, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'January 21st, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>As we walked this morning, Prabhupāda discussed plans for the new temple and the proposed exhibitions it’s to house. It will be a cultural center as well as temple.</p>

<p>His idea is to have displays depicting various levels of material existence. The exhibition is to begin on the lower levels by depicting hellish regions and lower planetary systems. As the visitor ascends the interior of the dome by escalator, various levels of material existence will be revealed, gradually rising to the abodes of the demigods, then Satyaloka, and the Vaikuṇṭha planets. At the very top will be a dazzling display of Kṛṣṇa’s own transcendental planet, Goloka Vṛndāvana.</p>

<p>Tamal Krishna Mahārāja suggested that by charging a rupee per person for the escalator rides alone, most of the maintenance costs could be covered.</p>

<p>Prabhupāda also heard some amusing stories from Tamal Krishna and Sudāmā Mahārājas. They explained that when new devotees joined the Rādhā-Dāmodara TSKP they often donated all their belongings, sometimes to the great chagrin of their friends or relatives.</p>

<p>One young man, a musician, was convinced to join. He returned to his apartment just as the members of his band were departing for an engagement. Since the equipment was his, he took everything, sold it, and donated the proceeds for preaching work. Needless to say, his friends were quite unhappy at the unexpected dissolution of their group. But as Tamal Krishna pointed out, it was the loss of equipment that upset them, not the loss of their friend.</p>

<p>After greeting the Deities and <em>guru-pūjā</em>, Prabhupāda went straight up to his room without giving a class.</p>

<p class="verse">* * *</p>

<p>In mid-morning Jayapatāka Swami brought in a Life Member who had come for the day from Calcutta to visit Māyāpur and meet Prabhupāda. Prabhupāda welcomed him and asked what his business was.</p>

<p>The man told him he owned a glass manufacturing factory. When Prabhupāda asked what the glass was made from, he replied, “From silicon, Swamijī, from sand.”</p>

<p>“And who owns the sand?” Prabhupāda asked.</p>

<p>“Bhagavān, God, owns the sand.”</p>

<p>“Oh, you are stealing from Bhagavān?” Prabhupāda challenged.</p>

<p>The man laughed. He was slightly embarrassed but obviously appreciated Śrīla Prabhupāda’s swift exposê and lesson in proprietorship. He thought for a minute, and then, as if to offset the implied criticism, ventured that he gave a lot in charity.</p>

<p>Prabhupāda got him a second time. “Oh, then you are just a little thief,” he said teasingly.</p>

<p>Everyone laughed and the man was happy to be further enlightened as to his real position as subordinate to God.</p>

<p>Śrīla Prabhupāda’s point was that no one can manufacture anything. We are simply taking ingredients supplied by God and transforming them into another form. Yet we think of ourselves as the owners. This is the mistake of the materialists.</p>

<p>Śrīla Prabhupāda explained that real honesty is to use everything in the service of Kṛṣṇa.</p>

<p class="verse">* * *</p>

<p>Prabhupāda gave Madhudviṣa Mahārāja a signed letter, sending him to New York as the <em>ad hoc</em> temple president until the Māyāpur GBC meeting. After their conversation in Calcutta about the difficulties in New York, the need for a strong leader, and Prabhupāda’s suggestion that Madhudviṣa take it up, Madhudviṣa Mahārāja told Prabhupāda he was willing to go there.</p>

<p>Rūpānuga prabhu, the current GBC for New York, will be offered Madhudviṣa’s present position in Australia, and Madhudviṣa will take over affairs on America’s East Coast. No devotees in Australia have yet been informed that he is going to New York.</p>

<p>There was some discussion about other possible changes of zones for GBC personnel. Śrīla Prabhupāda said that the GBC members themselves should hold discussions about exchanging zones and then propose a formal resolution at the meetings. On the whole he thought it a good idea for GBC men to swap zones every three or four years. He told us that a change will be refreshing and encourage detachment. It would discourage the tendency for the leaders to think of a particular area as their ‘own’ zone.</p>

<p class="verse">* * *</p>

<p>Later in the evening, together with Tamal Krishna Goswami, Śrīla Prabhupāda discussed the position of women in our Society. Recently this has become somewhat of a contentious issue in America, provoking conflict between the <em>gṛhasthas</em> and the celibate <em>sannyāsīs</em> and <em>brahmacārīs</em>.</p>

<p>Tamal Krishna has found himself at the center of the dispute because, along with Viṣṇujana Swami, he is in charge of the Rādhā-Dāmodara TSKP. Their bus parties, composed almost entirely of <em>brahmacārīs</em> and <em>sannyāsīs</em>, regularly visit many temples around America. The temples, in contrast, are generally run by married men.</p>

<p>Tamal Krishna’s idea is to arrange that no women live in the ISKCON temples. He feels their presence creates distractions for those pursuing a renounced way of life, the essence of Lord Caitanya’s movement. He feels that many temples are not serious about sustaining the standards of <em>vairāgya</em>and are becoming mere extensions of household affairs, much to the detriment of the welfare of the <em>brahmacārīs</em>, who are the real backbone of the movement.</p>

<p>Prabhupāda overcame all his arguments. Although sympathetic to Tamal’s concerns, he said that it is neither desirable nor possible to keep women from coming to join us, nor would it be practical to house them separately. His conclusion is that if we simply preach, then all difficulties will be resolved naturally in due course of time.</p>

<p class="verse">* * *</p>

<p>In the evening Saurabha prabhu showed Prabhupāda the preliminary plans for the new temple. He estimates the cost will be at least eighty <em>crores</em> of rupees ($80 million). Saurabha’s drawings revealed magnificent plans for an entire city, centered around a huge temple structure. It will be surrounded by satellite temples, a <em>gurukula</em> campus, a commercial area, bathing <em>ghāṭas</em>, and other facilities. The whole area will be protected from flooding by a latticework of canals. The main feature is to be a gigantic planetarium within the dome of the main temple.</p>

<p>Śrīla Prabhupāda was extremely enthusiastic about the plans. He wants the planetarium to demonstrate the Vedic alternative to modern scientific cosmological propaganda, illustrating the structure of the universe as described in the <em>Śrīmad-Bhāgavatam</em>. Impressed with Saurabha’s work, Prabhupāda suggested that the plans be presented to the state government with an application for official acquisition of the land we require. Prabhupāda always thinks big; he even suggested that we try to get them to relocate Calcutta’s Dum Dum airport nearby. For Prabhupāda no vision is impossible, because it is for Kṛṣṇa.</p>', '', '1976-01-21', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- January 22nd, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'January 22nd, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>This morning’s walk took Śrīla Prabhupāda north up the main road toward the Gaṅgā. He looked over the new building site, which Caitya-guru will supervise. Already some laborers are beginning work on the foundation. Prabhupāda instructed Saurabha to make up the site plans for the new residences.</p>

<p>Reiterating the point he made to the manufacturer of sand yesterday, Prabhupāda explained that it is the sense that everything belongs to God that makes the difference between a <em>karmī</em> and a devotee. Ordinary men are constructing big houses to live in, and so are we. The materials, such as bricks, wood, cement, and iron, are all supplied by God. But those who do it for their own benefit are “simply eating their sinful activities.” Our construction, however, is for Kṛṣṇa’s purpose; it is not for our own use.</p>

<p>As he strode down the road Prabhupāda noted storm clouds forming in the distance. He told us that rain at this time of year is good for the food grains. He quoted a verse from a book called <em>Khanāra Vacana: yadi varṣe māghera śeṣa, daṇḍa-rājā puṇya-deśa</em>. “This is the month of Māgha. So at the end of Māgha if there is a little rain, then it is to be understood that the king of that country is very pious and blessed. This time a little rain is required.”</p>

<p>On the way back to the temple for the morning program, Prabhupāda saw that several men were standing around an almost-mature wheat crop. They were banging empty tins in an effort to drive away the birds, lest they eat the entire crop. Prabhupāda disagreed with their strategy. He said that every living being has a right to eat, so the solution is simply to grow more. Then there will be enough to go around. This is the Vedic conception.</p>

<p>Prabhupāda’s ability to relate even the most seemingly ordinary event to <em>śāstra</em> always amazes everyone. Tamal Krishna expressed his appreciation of the scientific nature of the <em>Vedas</em>, and Prabhupāda agreed. “Therefore, we say, ‘perfect,’ <em>śruti-pramāṇam</em>.”</p>

<p class="verse">* * *</p>

<p>Satsvarūpa Mahārāja sent a lengthy zonal report for December and the early part of this month. His Library Party is doing especially well. Many professors are taking orders for their own personal libraries, and teachers are placing orders for the abridged paperback <em>Bhagavad-gītā</em> for use in their courses. Altogether, the party has sold over 700 standing orders and is still going strong.</p>

<p>As well as this, there are many important book reviews coming in as a result of the party’s efforts. And Satsvarūpa Mahārāja himself is very actively preaching; he has at least one college engagement every day until the end of February, and on some days as many as five.</p>

<p>He reported increased book distribution in several temples under his direction, notably Gainesville, Miami and Houston.</p>

<p>The Denver temple had previously been trying to develop a jewellery business with the hope of making large profits. But Prabhupāda has recently written, telling them that book distribution should be our only business because other types of business will simply create a bad atmosphere. Kuruśreṣṭha, the president, has closed down the business, and is taking his men out on book distribution. Kuruśreṣṭha admitted that doing business was putting him in mundane consciousness, and the promises of huge amounts of profit coming to the temple never actually came about.</p>

<p>Satsvarūpa summed the situation up perfectly. “The business world is such maya that it entangles one with hopes of tremendous profits that are never finally realized.”</p>

<p>Prabhupāda was happy to hear his thorough report, and he replied emphasizing the book distribution. “Even the proposal to open a new temple in Houston is secondary,” he said. “Book distribution is our first business.” Śrīla Prabhupāda feels that the work of the Library Party is most important, as also is the college preaching. So Prabhupāda encouraged him, “Go on vigorously expanding this preaching. You are proceeding in the right way.”</p>

<p>Jayatīrtha’s November report for the West Coast zone also arrived. His was the top zone for book distribution for that month, remitting $116,000 to the BBT, a new record. However, he admitted that Tamal Krishna Mahārāja’s RDTSKP topped them by $4,000. Yet he expressed his confidence that December would be a different story. They planned to hand in $200,000 and were aiming for a yearly total of $750,000 to the Book Fund.</p>

<p>His letter also included a section describing some newly-formed devotee businesses; but he had a different angle of vision than Kuruśreṣṭha. He pointed out that all business affairs are conducted outside the temple precincts so as not to affect the spiritual atmosphere, and that no temple president is allowed to become directly involved. He felt it important that the temple presidents concentrate solely on spreading Kṛṣṇa consciousness.</p>

<p>Jayatīrtha enumerated various reasons why he thought the devotees should be allowed to continue doing business. “I understand from several recent letters from Your Divine Grace to Satsvarupa Maharaja that you are not very anxious to see businesses going on in the Society, except for book distribution business. I understand your objections, but I would like to make a few points in relation to the businesses currently going on in the zone... . The businesses are handled by grhasthas who would generally not be engaged in sankirtana activities otherwise. If they make a request to stop doing business and engage in direct preaching work, we move to facilitate this. The businesses make substantial contributions to the temples, and in this way allow the temples to distribute more books. I have seen that in temples that are depending completely on sankirtana for all expenditures there are usually debts, and at the same time, the preachers are forced to concentrate on collecting money rather than distributing books... . Another advantage is that it provides opportunity to engage grhasthas in activities that are beneficial to the Movement, rather than simply living off the temples. At the same time they are able to associate with other devotees, making it easier for them to maintain their Krsna consciousness than it would be if they had to work at karmi jobs.”</p>

<p>Finally he ended his report with another suggestion for relocation of the Dallas <em>gurukula</em>, this time to a large property in Santa Cruz. It will cost a large amount of money to continue to maintain the Dallas operation and start the new <em>gurukula</em>, and a BBT loan would be required to cover the costs. So he wanted to know what Śrīla Prabhupāda desired in this respect.</p>

<p>Śrīla Prabhupāda had already sent a lengthy outline to him about the <em>gurukula</em> a few days ago, which Jayatīrtha obviously hadn’t received when he wrote this letter. Nevertheless, Prabhupāda answered his questions, presenting a perfect solution to several dilemmas.</p>

<p>He cleverly linked up the business aspirations of the <em>gṛhasthas</em> with their proclivity to have children, who then require education. “You have suggested that some men are best engaged in doing business. I agree. All grhasthas who are interested in doing business should do so in full swing. Yat karosi yad asnasi yaj juhosi dadasi yat/ yat tapasyasi kaunteya tat kurusva mad arpanam. Let this be the guiding principle. So let all the grhasthas who wish to, execute business full fledgedly in the USA, and in this way support gurukula. Business must be done by the grhasthas, not by the sannyasis or brahmacaris. Neither the sannyasis or brahmacaris can be expected to support gurukula. The parents must take responsibility for their children, otherwise they should not have children. It is the duty of the individual parents. I am not in favor of taxing the temples. The parents must pay for the maintenance of their children. Neither can the BBT be expected to give any loans. Now the BBT 50% for construction is pledged to the projects in India—Bombay, Kuruksetra, Mayapur. The profits from businesses should first go to support gurukula and balance may be given for the local temple’s maintenance. Grhasthas can do business. It is best if the Temple Presidents are either sannyasis or brahmacaris. If the grhasthas want to do book distribution, they should be given a commission of 5 to 10%, of which part must go to the gurukula.”</p>

<p>Prabhupāda told him that important temple personnel can be maintained by the temple. He also suggested that by farming and selling the produce, <em>gṛhasthas</em> can make a living. “I can give good suggestions,” he said, “but it is up to the GBC to practically execute them.”</p>

<p>A third report also arrived, from Jagadīśa, who dwelt mainly on the situation of the <em>gurukula</em> in Dallas. They are drawing up plans for extensive renovation and expansion of the present facilities to bring it in line with government requirements. They are expecting their funds to increase through the new tax imposed on the North American temples. Apparently the school has suffered due to great inadequacies in the previous administration, but Jagadīśa just spent the last four months in Dallas trying to bring things to a higher standard. His letter was optimistic about the future developments. “I am convinced we are making good progress. And what is that progress? That you will be pleased with what we are doing. That is more important by millions of times than any other measure of success.”</p>

<p>Since he had just written a long letter to Jayatīrtha covering these same topics, Prabhupāda did not reiterate his feelings, but referred Jagadīśa to Jayatīrtha’s letter.</p>

<p>However, he did pick up again on the theme of finance, particularly the proposed taxing of the temples, as well as a previous request for a BBT loan. “Actually it is the responsibility of the parents to maintain gurukula. By taxing the temples or taking loan from the BBT the parents are being allowed to avoid their responsibility. Before having a child the parents should see whether they shall be able to pay for their child’s education. The GBC should make an injunction that if they beget children, then whatever the expenses are for supporting gurukula they must pay it.”</p>

<p>He requested Jagadīśa to discuss everything with Jayatīrtha. He is clearly attempting a major restructuring of the <em>gurukula</em>, and wants his GBC to take the burden as much as possible.</p>

<p class="verse">* * *</p>

<p>In the early afternoon, immediately after lunch, Tamal Krishna Mahārāja and I sat with Prabhupāda on the sunlit veranda. He sat on a chair and we at his feet, simply relishing his divine presence and the transcendental atmosphere of the holy <em>dhāma</em>.</p>

<p>Prabhupāda looked out through the arched porticos, over his ISKCON compound, and beyond the front gate. In the distance glistening slivers of light danced on the tranquil surface of Mother Ganges as she flowed down to Navadvīpa town and then beyond, on her long pilgrimage from the Himalayas to the Bay of Bengal. It was wonderfully gratifying to see him so perfectly and naturally situated—in his own environment so to speak—and hear him talk about various aspects of the movement as he shared his philosophical insights into the world and life in general.</p>

<p>He seems very much at ease in Māyāpur. He loves to sit and look out over the flat and fertile land, its open fields stretching into the distance, the verdant landscape dotted with small, green trees and occasional temple spires.</p>

<p>A seemingly limitless expanse of rice paddies in every stage of development shows the results of the simple, honest labor of local villagers. Other fields yield carefully cultivated bounties of <em>dāl</em>, sugarcane, vegetables, and other necessities of life. Men and beasts amble slowly up and down the road and along the rutted tracks. It seems the perfect place to meet one’s basic requirements of maintaining body and soul together. And in the midst of this natural opulence we are here; the grateful recipients of the generosity of His Divine Grace, who is so expertly revealing the true spiritual nature of ourselves, the <em>dhāma</em>, and the all-merciful Lord, Śrī Caitanya Mahāprabhu.</p>

<p class="verse">* * *</p>

<p>In the evening a devotee brought the prototype of a new <em>mṛdaṅga</em> to show Śrīla Prabhupāda. Instead of a clay shell it had one of fibreglass, but was still fitted with leather straps and heads. Devotees in the West are working to produce a completely synthetic drum to replace the clay ones, which break easily. Prabhupāda felt the shell was a little too thick and heavy, otherwise he liked it. He even played a little on it himself, although he said he was out of practice.</p>', '', '1976-01-22', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- January 23rd, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'January 23rd, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Śrīla Prabhupāda took his walk across the fields to the proposed temple site. He discussed with Jayapatāka Swami the possibility of convincing the government to give us the land we need for building the temple.</p>

<p>In pursuance of this idea, he later dictated a letter for Jayapatāka Swami to hand-deliver to his New Delhi airport acquaintance, Mr. Chaudhuri, who works at the Department of Development and Planning in Calcutta. Prabhupāda viewed that meeting as Kṛṣṇa’s arrangement. He wants that the government acquire the land for us, and fortuitously this man works in the department that decides such matters.</p>

<p>After briefly describing to Mr. Chaudhuri the Māyāpur project and his hopes of building an international city based on the Vedic culture, he requested him to visit Māyāpur for further discussion.</p>

<p class="verse">* * *</p>

<p>Every day Śrīla Prabhupāda gives an abundance of practical guidance, ranging from advice on purchasing land, setting a daily monetary rate for the painting of the front wall, advising on what goods to sell from the rooms near the front gate, to deciding the conditions of employment for the building construction workers.</p>

<p>Jayapatāka Mahārāja has employed a huge number of men for the new building work, but today Prabhupāda told him that if he can’t get it finished by the festival (which is in six weeks), then he should reduce the number of men to only fifty.</p>

<p>Jayapatāka Mahārāja said he thought everything but the plumbing could be done. Śrīla Prabhupāda said the plumbing and electricity are not important, as long as the place is habitable. He told Jayapatāka to get a guarantee from the contractor that the basic construction would definitely be finished on time.</p>

<p>As he walked, he turned his attention to the situation in Nellore. He confirmed to Gopāla Kṛṣṇa prabhu that the foundation stone should be taken to Madras, which, he said, was a better place for a temple anyway. He also cautioned him that if we accept charity from such fallen women then we will have to share in their sinful activity.</p>

<p>“But our Kṛṣṇa can eat even fire,” he added. “If there is forest fire, Kṛṣṇa can eat. Unless He is able to eat other’s sinful reactions how can He say <em>ahaà tvāà sarva-pāpebhyo mokṣayiṣyāmi;</em> He is capable, otherwise how can He say like that?”</p>

<p class="verse">* * *</p>

<p>The rest of the day Prabhupāda spent quietly in his room. He isn’t lecturing in the mornings here, although he enjoys discussing a wide range of topics with his disciples and a few visitors in his room.</p>

<p class="verse">* * *</p>

<p>At lunch Prabhupāda requested that I learn how to cook from Harikeśa.</p>', '', '1976-01-23', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- January 24th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'January 24th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Each morning at <em>guru-pūjā</em> Prabhupāda is personally giving out sweets to all the children. He sits on the <em>vyāsāsana</em> as each child comes forward to receive his <em>prasādam</em>.</p>

<p>There is a small, two-year-old boy from Australia called Dāmodara, who persistently remains right in front of the <em>vyāsāsana</em> each morning with his pudgy hand held out. Śrīla Prabhupāda gives him half a sweet, which Dāmodara pushes into his mouth. Then he moves his hand over the back of his head, wipes his open palm on his <em>śikhā</em>, and again holds it out.</p>

<p>Again Prabhupāda gives him another piece of sweet, and again Dāmodara repeats the ritual. There are no words exchanged, simply the boy’s chubby palm goes out for the sweet, up to his mouth, over his head, and back again for more. This exchange with Dāmodara has gone on for several mornings now, and Śrīla Prabhupāda laughs to see him wipe his hand in such a fashion. “Who has taught him this?” he asked.</p>

<p>While this is going on the other children leap and dance and chant. Adoration for Prabhupāda and excitement to be in his presence shine in their eyes. It is obvious the young children are spontaneously attracted to Śrīla Prabhupāda because they instinctively understand that he is their best friend.</p>

<p>As he does each morning, at the end of the program Prabhupāda circumambulated the Deities, accompanied by all the devotees and a <em>saṅkīrtana</em> party. He stopped to vigorously ring the bells hanging from the ceiling on either side of the small temple room, causing everyone to loudly chant and jump in ecstasy.</p>

<p class="verse">* * *</p>

<p>Mail continues to flow in steadily from around the world. One letter came from Puṣṭa Kṛṣṇa Swami in South Africa about the Mercedes car that he had promised to purchase for Prabhupāda. He said that although he intends to pay for it himself, for now he has taken the money from Śrīla Prabhupāda’s book fund to finance the purchase. He intends to repay it later.</p>

<p>Hearing this, Prabhupāda shook his head. Smiling, he told us the story of the disciple who invited his guru to his home and gave him a grand reception with nice decorations, elaborate <em>prasādam</em>, and all. The guru was delighted and amazed at such expenditure.</p>

<p>“Oh, it is all coming from you, O Spiritual Master. It is all your mercy,” said the disciple.</p>

<p>The guru was pleased at this, until he returned home to discover that it really <em>was </em>coming from him. For when he looked in his bank book his balance was now zero!</p>', '', '1976-01-24', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- January 25th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'January 25th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Prabhupāda decided to take his walk on the roof of the temple building. On the way up he inspected the top floor, where all the <em>brahmacārīs</em> stay. He did not like what he saw—everything was dirty and poorly maintained. Walking around the end of the veranda he saw thick wire strung to the wall as a crude washing line, gouging grooves in the plaster. He was very displeased.</p>

<p>He soon got everyone into action, cleaning and re-arranging everything. He ordered the <em>brahmacārīs</em> to move immediately to the front-wall dwellings, saying that the rooms in the temple building were to be used only for guests. He commented that <em>brahmacārīs means</em> it will be dirty.</p>

<p>Jayapatāka Swami has decorated the rooftop area with potted <em>tulasī</em> plants and various flowers and shrubs. There are two rooms, one on either side of the central stairwell, where he and Bhavānanda Mahārāja stay. The flat roof offers ample space for walking, in addition to a panoramic view. From it one can observe not only our whole compound, but miles of open country.</p>

<p>As we walked around, Anantarāma Śāstri joined us. Śrīla Prabhupāda expressed his satisfaction that such an educated man has joined our movement, and he instructed Bhavānanda Mahārāja to make sure he is well looked after so that he may not go away.</p>

<p>Although a somewhat self-conscious individual, Śāstrijī was eager to recite a poem he had composed for Śrīla Prabhupāda’s pleasure. As we walked, and without asking first, he broke out into melodious verse, singing the praises of Bhagavān Śrī Gopāla—or at least it seemed so. His chanting was impressive to my untrained ear; but Śrīla Prabhupāda was alert. When Śāstri sang <em>nāciye nāciye aile gopāla</em>, “My dear Gopāla, please come to me dancing,” Prabhupāda stopped him. “Don’t manufacture knowledge. Take knowledge from Bhagavān. Don’t order Bhagavān. Just follow Bhagavān. That is not wanted. Do not write concocted poetries. That is not beneficial. Simply follow.”</p>

<p>Śrīla Prabhupāda told him that his singing was sense gratification because he was giving instruction to Gopāla, “please come to me, <em>nāciye</em>, dancing.” He stressed that our process is to take instruction. “It is all nonsense. Why should you ask Gopāla to come to you? You cannot order. You must follow. We are to carry out the order of God, not to order God to carry out my order. That is mistake.”</p>

<p>Prabhupāda went on for some time, condemning the attitude with which people generally approach God. He explained that in India they sing a traditional <em>ārati</em> song which repeats the words <em>sab ko sampatti de bhagavān</em>. <em>De bhagavān</em> means “give me.” And in the West, he explained, the Christians also have the same idea. “The whole world,” Prabhupāda observed, “they have accepted God as order supplier: I order, You supply. The Christian church also, ‘God, give us our daily bread.’”</p>

<p>“And if God doesn’t give, then God is dead,” Tamal Krishna Mahārāja added.</p>

<p>“Dead. This is going on. And our prayer is, ‘I don’t want anything. Simply engage me in Your service.’ This is the real prayer, which is taught by Caitanya Mahāprabhu.”</p>

<p class="verse">* * *</p>

<p>Jayapatāka Swami returned later in the day from Calcutta with a favorable report. Mr. Chaudhuri and his family will come to visit Prabhupāda on Sunday, February 1st. The man was very happy to see Jayapatāka Mahārāja and enthusiastic to help.</p>

<p class="verse">* * *</p>

<p>Harikeśa is becoming increasingly ill. He looks weak and emaciated and has no strength. It is all he can do just to cook Śrīla Prabhupāda’s lunch.</p>

<p>Prabhupāda observed him going to the toilet just after eating breakfast. He shook his head and quoted a Bengali proverb, “He who cannot sleep immediately upon resting and he who passes stool immediately after eating will very soon be called by Yamarāja. On the other hand, he who passes stool before eating and urine after, the physician cannot make a living from!”</p>

<p class="verse">* * *</p>

<p>In the evening I came into Prabhupāda’s room just in time to catch the tail end of an hour-long conversation between Harikeśa and Śrīla Prabhupāda.</p>

<p>Harikeśa was posing questions about the description of Vedic cosmology in the newly published Fifth Canto of <em>Śrīmad-Bhāgavatam</em>. Many confusing diagrams and captions have been included by the editors, and Prabhupāda said it will have to be revised because they have made mistakes.</p>

<p>Harikeśa was trying to clarify his own understanding of the position of the sun and moon, the general structure of the universe, and the exact length of one <em>yojana</em>.</p>

<p>I listened intently as Prabhupāda described how the planets move within the universal shell. He pointed to the chandelier hanging from the ceiling and compared the situation of the lights with that of the planets. He explained that all the planets move in unison around the Pole Star, and within that structure the sun has its own orbit.</p>

<p>Harikeśa asked many questions, until our ability to understand his explanations was stretched to the limit, and Prabhupāda finally called a halt. His knowledge appears fathomless.</p>

<p>I sat and watched as he got up from his seat and moved toward the door, smiling all the while. He seemed to have a deep serenity, to be carrying within himself a vast, limitless wellspring of knowledge and understanding and to possess a beautiful sobriety of the soul that attracted my mind more than ever before. I became absorbed in the natural flow of his movements, the gentility of his demeanour, and the soft expressiveness of his features.</p>

<p>Everything within the periphery of my vision, except Śrīla Prabhupāda, began to recede and fade as he seemed to emanate an increasingly bright effulgence, filling the whole room and beyond. It wasn’t an ordinary light, nothing that could be <em>seen</em> like the beams from a torch or bulb. But it was there, more subtle than sunlight, expanding and shining through my mind and intelligence, pervading my consciousness, touching my soul. I became overwhelmed with appreciation of Prabhupāda’s purity and grace. The feeling of wanting absolutely nothing whatever in life, other than to simply serve his lotus feet without any other concern, welled up in my heart.</p>

<p>I have never experienced a satisfaction greater than this. I felt it intensely. For perhaps the first time, I experienced what I can only describe as feelings of unconditional surrender, an unequivocal love, fully devoid of any material distraction or selfish interest. His very being shone and radiated, pervading everything. And I was his eternal servant.</p>

<p>It’s hard to describe. It didn’t seem that Prabhupāda was doing anything more than he ever does. He is himself. But somehow, for once, my own consciousness suddenly opened and became receptive enough to perceive him more clearly than ever before.</p>

<p>And then he disappeared through the door and down the corridor—leaving me once again wondering just who he really is.</p>', '', '1976-01-25', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- January 26th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'January 26th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Before Prabhupāda took his walk he sat in his room and listened while Bhavānanda Mahārāja read aloud a newly released pamphlet. It was from the neighboring Caitanya Gaudiya Math that is led by one of his prominent God-brothers, Tīrtha Mahārāja. This propaganda piece, written in somewhat convoluted prose, declared the glories of Tīrtha Mahārāja, making several outrageous claims. The tract described him as Śrīla Bhaktisiddhānta Sarasvatī’s most confidential disciple, “almost a counterpart.” It also stated that his preaching had attracted people from all over the world, that his <em>maṭha</em> stretched for over a mile (which would include ISKCON’s temple), and that twenty-four hour <em>kīrtana</em> is going on there (only our men are doing this). Obviously he was trying to claim a status for himself that he does not deserve.</p>

<p>Śrīla Prabhupāda’s reaction was very cool. He queried that if he is such a great personality, why does he have to advertise it. “Why is he trying to explain?,” he said. “What is the use of explanation? If a great personality is unknown, and he has to be known by explanatory notes, then how is he a great personality?” Displeased with the false propaganda, Prabhupāda told us, “If he is reciting such false things how he can be a Vaiṣṇava? He is simply a pounds and shillings man. He was never very dear to Guru Mahārāja, who feared that if he sent him away he would cause much trouble. Therefore he let him stay as manager, even though so many complaints were there against him.” He shook his head with distaste.</p>

<p>“Whereas others trained their sons to be <em>brahmacārīs</em> and <em>sannyāsīs</em>,” Prabhupāda continued, “he trained his to be a lawyer. They sent their sons to the temple and <em>gurukula</em>, but he sent his to the office because he always intended to go to court to take over the Gaudiya Math proprietorship. His past is very black. I do not wish to discuss it!”</p>

<p>Prabhupāda told Tamal Krishna Mahārāja to keep the paper, “because these rascals they may create some trouble.”</p>

<p>Bhavānanda Mahārāja told a story indicating that they were already creating “trouble” for us. Recently, Bhavānanda was detained and brought to court on kidnaping charges after a Bengali village woman and her son had joined our <em>āśrama</em> against the wishes of her husband. In court, our lawyer, reputedly the best in Nadia, asked Bhavānanda who was behind it all. The lawyer said the husband was a simple village laborer who would not have had the intelligence nor the money to bring such a case. The lawyer was convinced that the man had been put up to it by one of the Gaudiya Math members attempting to harass us.</p>

<p>Recently members from the Caitanya Gaudiya Math proposed that we link with them. But despite Śrīla Prabhupāda having gone there several times, Tīrtha Mahārāja will not visit Māyāpur Candrodaya Mandir. Śrīla Prabhupāda reasoned that he only wants the connection in order to capitalize on Prabhupāda’s preaching success, to claim it for himself. If Western devotees go to his Math, it will increase his prestige.</p>

<p>Obviously disagreeing with the idea that Tīrtha Mahārāja is a senior preacher to himself, Prabhupāda named two other prominent Godbrothers in Navadvīpa, Madhava and Śrīdhara Mahārājas, who have a similar frame of mind. Prabhupāda told us, “That was the policy... That, ‘Although Bhaktivedanta Swami is propagating throughout, he is subordinate to us, under our instruction.’”</p>

<p>He rose and went up onto the roof for his walk. As we walked around the perimeter he talked extensively about Vedic culture, giving fascinating insights into its psychology.</p>

<p>Prabhupāda recalled that formerly, at least before Indian independence, people were still very honorable. He remembered one lawyer whose father had died insolvent, owing many <em>lakhs</em> of rupees. When he became a wealthy barrister he then called all his father’s creditors and repaid them.</p>

<p>He said that this is the law of Manu. If a son inherits all the assets of his father, must also inherit all his debts. However, a father leaving his son large debts means he is an enemy. One would never expect to find an enemy within his own family, but according to Cāṇakya Paṇḍita there are four enemies in the family: a father who dies a debtor, a son who is a rascal, a mother who marries again, and a beautiful wife.</p>

<p>“Now everyone is hankering after very beautiful wife. And Cāṇakya Pandit said, ‘Then you are bringing one enemy.’ Just see what is the type of civilization. Because if you become too much attached to wife, then you’ll never be able to go out of home and take <em>sannyāsa</em>. Of course,” he added laughing, “everyone’s wife is very attractive.”</p>

<p>“Even if ugly!” Tamal Krishna Mahārāja chimed in.</p>

<p>“Yes. It is in one’s eye that she is very beautiful. It does not require others’ recommendation. It doesn’t matter whether she is low caste or high caste; if she is attractive, then it is all right. Therefore, <em>rūpavatī bhāryā śatrur</em>. Cāṇakya Paṇḍita’s instructions are very, very nice.”</p>

<p>Prabhupāda laughed as he recounted how his father had saved him from this material entanglement. “You know my story? My father’s instruction?” he asked us. We smiled eagerly and crowded in a little more to hear. “Yes. My wife was never beautiful to my sight, so I wanted to marry again, and my father advised, ‘Don’t do it. She is your friend, that you don’t like her.’ Just see.”</p>

<p>“But still, Prabhupāda, you said that your schoolwork was a little impeded,” Tamal Krishna said.</p>

<p>“Hmm? No, that is natural. In young time, when there is young girl. That is also said, <em>yauvane kukkarī sundarī</em>. When a woman is in full youth, even she is like dog, she is beautiful.”</p>

<p>Everyone laughed loudly, and Tamal Krishna asked whose statement that was.</p>

<p>“I do not know, but this is going on,” Prabhupāda grinned. As usual, he gave the philosophical underpinning, “It is by nature’s arrangement the woman is given one chance at the time of youthfulness. Otherwise how she will be given protection by a man? They require protection. If somebody is not attracted, then how she gets protection? This is natural.”</p>

<p>He revealed the psychology of arranged marriages, still prevalent in India. In the West this practice is considered objectionable, and no one understands its true purpose. But a spiritually based society is different. “The social system in India is that a boy, say twenty or twenty-five years, and a girl, twelve to sixteen years, they must be married. They must be married. And before marriage the girl should not see any boy, and the boy should not see any woman. Then life is all right. Nowadays it has been practice that the boy goes to see the girl, but formerly it was not so. He should see the girl when the marriage actually takes place, not before that. The psychology is that when they require a man or girl, so whatever she is or he is, they accept and remain chaste. So there is no separation.”</p>

<p>He strongly denounced the defective, cultureless modern civilization, comparing it to a society of pigs, because the pig has no discrimination in the matter of eating and having sex. They eat anything and have sex even with their immediate relatives.</p>

<p>He declared that overall people are acting on the level of animals. He quoted the <em>Śrīmad-Bhāgavatam</em>’s description of democracy—people who are like hogs, dogs, camels, and asses glorify and vote in as their leaders other big animals. “Just study whether it is not the civilization of asses and pigs. You have to understand first of all. Is it not?” He gave a succinct one sentence appraisal of modern life: “They are working hard like an ass just to become an ideal pig! Is it not this civilization? Yes. How <em>śāstra</em> has picked up the example, just see. <em>Nāyaà deho deha-bhājāà nṛloke kaṣṭān kāmān arhate vid-bhujāà ye</em>. This is not civilization.</p>

<p>“<em>This</em> is civilization, <em>tapasya:</em> no meat-eating, no this, no this, no that, and become perfect. Ideal <em>brāhmaṇa</em> life. This is civilization. <em>Athāto brahma-jijṣāsā</em>. Unless you become civilized like this, there is no opportunity of <em>brahma-jijṣāsa</em>. And so long you do not inquire about Brahman, that you remain, that pigs and hogs and asses. Whole day and night eat stool, and as soon as you get another opposite party, have sex. Doesn’t matter whether it is daughter or mother or sister. That’s all.</p>

<p>“Take Freud’s philosophy and become highly advanced in civilization! Now Freud’s philosophy is being translated in Hindi and so many other languages. We are advancing in civilization, Indians. They are translating this Freud’s philosophy, pig civilization.” He laughed. “People therefore do not come to us. They avoid us because ‘They [devotees] are not pigs.’”</p>

<p class="verse">* * *</p>

<p>A telegram arrived from Mahāàsa Swami in the South: “NELLORE LADY REFUSED RELAXING CONDITIONS. PLEASE ADVISE.”</p>

<p>It seems Mahāàsa hadn’t yet received Prabhupāda’s letter written on the 18th, so Prabhupāda reiterated his clear and simple instructions. There should be no relaxing of conditions on our part. We can either purchase or accept charity, but we cannot accept any of their conditions. When he signed the letter later in the day he added in his own handwriting, “If they decline, then try to acquire the land through Government because we have already installed the Foundation Stone.”</p>

<p class="verse">* * *</p>

<p>Sometimes during his evening massage Prabhupāda chats a little before sleeping. This evening as he lay on his bed in the quiet semi-darkness, with me perched cross-legged alongside him, he asked if there were any mosquitoes inside his net. “It is such a cruel animal,” he said.</p>

<p>I asked if the living entity obtained that sort of body because it desired to harm others.</p>

<p>Prabhupāda said, “Yes, it wants to drink the blood of others, so it is given facility. But only a very small body so it can only take less than a drop. It has one pipe, and in less than a second it can immediately penetrate the skin, so wonderful is its creation.” But he added that still, nature has an arrangement whereby before biting, the mosquito buzzes in the ear just to warn its victim: ‘I am here.’ “The scientists cannot make even one such mosquito, yet they claim God does not exist,” he said.</p>

<p>Every night when Śrīla Prabhupāda takes his rest, Ānakadundubhi comes into Prabhupāda’s work room to set up a very large, square net over his desk and <em>āsana</em> so that he can translate in the night without botheration. The net is almost like a small tent, and sometimes mosquitoes get trapped inside it during its erection. Therefore I have developed the habit of checking it after finishing Śrīla Prabhupāda’s massage in the bedroom. I sit inside it for a minute or so and capture and remove any that may have been trapped.</p>

<p>Last evening I was attempting to remove a couple of the unfriendly insects when, to my surprise, Prabhupāda also entered under the protective canopy to begin his night’s work. He was sitting behind his desk unperturbed as I, on my hands and knees on the other side, tracked down one last mosquito. I had his woollen cap in my hand, using it as a swatter. Seeing my prey settled high up in one corner of the net, I swung. “<em>Whap!</em>” The tiny body fell to the ground, apparently dead. I wasn’t too happy at having killed it, but what could be done? If it wasn’t removed, it would bite Śrīla Prabhupāda all night, disturb his translation work, and maybe even give him malaria. I picked up the corpse and tossed it out from under the net. It landed a few inches away on the clean white sheets. Prabhupāda silently watched the whole procedure.</p>

<p>Suddenly, as we both looked on, it stirred, shook its wings and flew off. It wasn’t dead after all. Śrīla Prabhupāda gave a happy exclaim, “Ah! Hare Kṛṣṇa!” He was very pleased to see that I had only stunned my quarry.</p>

<p>I too was happy and became more so when he narrated a similar history of his own. “I also did this. One insect was buzzing; it was very annoying, and I gave it a slap and it fell down.” His face softened with compassion and regret. “Then I was very sorry, ‘Oh! I have killed this poor creature.’ But suddenly it got up and flew off. Oh! Then I was very glad!”</p>

<p>His remembrance gave me another revealing glimpse of Śrīla Prabhupāda’s kindness and concern for every living being, even those that might be aggressors. I felt happy to have escaped an offense to the mosquito and privileged to have shared a moment of intimate confession with Śrīla Prabhupāda.</p>', '', '1976-01-26', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


END $$;
