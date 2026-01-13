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


  -- January 7th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'January 7th, 1976', 5,
    '', '', '', '',
    '', '', '', '',
    E'<p>On the walk this morning Acyutānanda Swami made Prabhupāda laugh when he humorously described his meetings with a few well-known svāmīs and <em>sādhus</em>.</p>

<p>As they walked, the conversation sobered when Śrīla Prabhupāda condemned the mentality of exploiting nature for personal sense gratification. “Prahlāda Mahārāja said <em>tat prayāsaà na kartavyam</em>: ‘This kind of endeavor you should not do, exploitation,’ unnecessarily trying for developing economic condition. The modern civilization is: ‘Exploit nature and materially be opulent.’”</p>

<p>Yaśodānandana said, “It has been seen everywhere we travel that there is plenty of rice, there is plenty of food growing, but the government is advertising that there is scarcity of food. Yet there is plenty growing everywhere.”</p>

<p>“And reduce population, kill it,” Prabhupāda added. “Hiraṇyakaśipu was doing that.”</p>

<p>“Birth control?” Acyutānanda wondered.</p>

<p>“Yes,” Prabhupāda said. “Prajāpati. He stopped Prajāpatis to beget children.”</p>

<p>As the walk progressed the devotees questioned him on a variety of topics. In India the multiplicity of religious thought and ritual sometimes puzzles inexperienced devotees. Having Śrīla Prabhupāda personally present is a good opportunity to clear up any confusion.</p>

<p>One devotee asked Prabhupāda about a particular type of Durgā worship he had come across in South India. He said that a Life Member in Bangalore told him that worship of Śānti Durgā was in the mode of goodness. He wanted some clarification.</p>

<p>Acyutānanda offered his understanding that <em>sattva-guṇa</em> is also <em>māyā</em>.</p>

<p>Prabhupāda said, “From <em>Brahma-saàhitā</em> we understand, <em>sṛṣṭi-sthiti-pralaya</em>. The <em>pralaya</em> [destruction] is <em>amaṅgala</em>, and <em>sṛṣṭi</em> [creation] is <em>maṅgala</em>. <em>Sthiti</em> [maintenance] is also <em>maṅgala</em>. So Gaurī has got three functions, Durgā.”</p>

<p>Ānandamoya, a French devotee stationed in Hyderabad, wanted to clarify what seemed an apparent contradiction concerning the falling down of devotees and the eternal nature of devotional service. He asked, “A devotee who has tasted the nectar of the lotus feet of the Lord can never forget it. Does it mean that his journey in the material world is about to finish?”</p>

<p>Prabhupāda didn’t answer himself. Instead he said, “Answer, somebody.”</p>

<p>Mahāàsa replied, “He falls due to certain offenses, but afterwards, by the mercy of a pure devotee, he comes back. Because he has tasted the nectar of devotional service, he may try to enjoy the material world for some time. But afterwards, he will be fed up again and come back.”</p>

<p>“There’s a statement in the <em>Bhagavad-gītā</em> that if one is engaged in the service of the Lord, even if he falls down, he is to be considered saintly,” Tamal Krishna said.</p>

<p>Prabhupāda agreed. “Yes, if it is accidental. If it is purposefully, then he is not saintly; then he is offender.”</p>

<p>Another devotee wasn’t certain what “accidentally” actually meant. Prabhupāda elaborated. “Accident. He had former habit and unknowingly he has done something wrong. That is accident. That is explained by Bhaktivinoda Ṭhākura. Not purposefully doing wrong. That is <em>aparādha</em>. <em>Nāmnād balād yasya hi pāpa-buddhiḥ</em>.”</p>

<p>Acyutānanda Mahrāja asked about two sets of Deities, one within ISKCON and another elsewhere. At our New Delhi center the Deities are called Śrī Śrī Rādhā-Pārtha-sārathi. Since Pārtha-sārathī means ‘the chariot driver of Arjuna’ he wanted to know how Rādhārāṇī, who is only present in Vṛndāvana-<em>līlā</em>, could be included when Kṛṣṇa is in that role.</p>

<p>Prabhupāda answered, “When Kṛṣṇa is Pārtha-sārathi, Rādhā is out of Him? Does it mean? <em>Rādhā kṛṣṇa-praṇaya-vikṛtir hlādinī śaktir</em>. When He is fighting, the <em>hlādinī śakti</em> is there. It is not manifest.”</p>

<p>The other set of Deities Acyutānanda Swami had seen were of Rādhā, Rukmiṇī, and Kṛṣṇa together. “So won’t Kṛṣṇa feel embarrassed to stand between Rādhā and Rukmiṇī at the same time?”</p>

<p>Prabhupāda laughed. “Why? Why embarrassed? Two sides? One side, Rādhā... ”</p>

<p>“Yes. One side Rādhā, one side Rukmiṇī.” Acyutānanda said.</p>

<p>Tamal Krishna asked, “Is that bona fide, Prabhupāda?”</p>

<p>“Yes,” Prabhupāda said. “I don’t find any fault.”</p>

<p>Acyutānanda, however, wanted to be certain. “It’s not <em>rasābhāsa</em>?”</p>

<p>So Prabhupāda went on to say, “Not <em>rasābhāsa</em>. But it is not mentioned in anywhere. This is mental concoction... they should not have done like that.”</p>

<p>Acyutānanda also asked about the clay which devotees use to anoint themselves with <em>tilaka</em>. “The <em>gopī-candana</em> comes from the lake where they say the <em>gopīs</em> drowned themselves, and that it is near Dvārakā. Is that a true story?”</p>

<p>Prabhupāda was noncommittal. “Maybe they might have gone.”</p>

<p>In his room after the walk Prabhupāda continued talking about the Māyāvādīs, especially one in South India who has attracted many followers by displaying magic.</p>

<p>At one point Acyutānanda Swami said he heard one of his followers criticize us, saying that we were bookworms.</p>

<p>Prabhupāda immediately responded, making us all laugh, “And he is stool worm! He will become this in his next life for cheating so many people!”</p>

<p class="verse">* * *</p>

<p>Just after breakfast some reporters from the local press came for an interview. The conversation soon came to the subject of Gandhi’s nonviolent movement, which he tried to establish on the basis of the <em>Bhagavad-gītā</em>.</p>

<p>Again, there were surprised looks and new-found realizations when Prabhupāda deftly revealed how Gandhi had spoiled the <em>Gītā</em> by trying to derive the philosophy of non-violence from it. He explained how in practical terms Gandhi could not establish non-violence because he himself was shot dead. Therefore his whole movement was a failure. He went on to argue that apart from that, how could a politician be nonviolent? In the <em>Bhagavad-gītā</em> Arjuna was explicitly instructed by Kṛṣṇa to be violent. He told him to fight and to arm himself with the weapon of knowledge. So how could Gandhi construe a message of non-violence from the <em>Gītā?</em> Prabhupāda concluded that Gandhi unfortunately had no knowledge.</p>

<p>The pressmen, won over by Śrīla Prabhupāda’s charming demeanor and brilliant responses, left well satisfied and impressed by their meeting.</p>

<p class="verse">* * *</p>

<p>Even in remote Nellore the mail is being delivered, and Prabhupāda continues to provide resolutions to problems, general and personal, great and small, throughout ISKCON.</p>

<p>One letter came from Brahmānanda Swami in Nairobi. He was formerly Prabhupāda’s permanent secretary, but since he was also the GBC for Africa, Prabhupāda sent him back there in November to deal with some disturbances.</p>

<p>Brahmānanda reported that some irresponsible devotees had caused difficulties, damaging our reputation among the Indians, especially in Mombasa. This caused a great strain because we depend on the Indians for financial support. As such, the temple has fallen into debt.</p>

<p>Although Śrīla Prabhupāda had inquired when Brahmānanda would be able to take up his secretarial duties again, Brahmānanda asked to remain in Africa. “I think that we should return to our decision at Mayapur last year, that every month a different GBC secretary remains with Your Divine Grace to handle the correspondence and to be in your association. Syamasundara was your secretary and out of his zone for so long, and his zone deteriorated. So I do not think that any GBC, including myself, can remain away from his zone for any lengthy period and expect things to just go on, especially in regards to the spiritual standards. So I request that I will remain here until the Mayapur festival time.”</p>

<p>Tamal Krishna also confirmed to Prabhupāda that the situation in Africa is not at all good. The devotees are living on donations of rice because no money is coming in from the Life Membership Program. Prabhupāda declared that the feckless men who have caused the difficulty should not be given responsible positions again. He described them as “simply loafer class.”</p>

<p>He also blamed Brahmānanda Swami for not keeping a check on his zone. “This is the business of GBC,” he said, “to see that things go on nicely and to check bad influences.” But he gladly noted Brahmānanda’s sense of responsibility, and he shared a little news of his current preaching. “As you report that things have deteriorated in Africa, you can stay there if necessary... . The first business is that the GBC must see to the management of their zones. Still, I require a permanent secretary. In addition, one GBC man may come and go.</p>

<p>“Here we have been given a nice piece of land measuring nine acres. The local people are very enthusiastic, and the plan is to construct a Radha-Krsna Temple complex.”</p>

<p>Several letters came in from the South Seas area. Upendra wrote from Hawaii explaining that after having left us in New Delhi filled with enthusiasm to preach, he was refused entry into Fiji because of insufficient funds. He then was put back on board the very same aircraft and immediately flown back to Hawaii. Now he wanted to know how and where to proceed.</p>

<p>Apart from this, he also posed some philosophical questions that clearly illustrate what Śrīla Prabhupāda commented on yesterday: the need to elevate the standard of the devotees’ knowledge by systematic study of his publications. “There are times when I take all my relationships within ISKCON and the pleasures and difficulties as something like a dream only. I am reminded of the time you explained to me that there is no reality in this world save and except the Divine Name and service to Him. In the Srimad-Bhagavatam I have also read that all this having to do with past, present and future is a dream only. I am understanding ‘Yes, even these relations as my wife, my children or my friends or close Godbrothers in Krsna consciousness, ISKCON, are as like sticks meeting in a stream, to be separated in time but with the same end of Krsna bhakti, back to Home or the Ocean.’ That they are still part of these past, present and future of the measuring temperament, though the devotional service and sentiments therein are eternally developing or lasting. It was raised that ‘No, our relationships formed here in ISKCON with one another are eternal in themselves in addition to the service. That ISKCON and we members as we are known now shall be known there... . All this I was unable to support scripturally and lest I make an offense and direct error I place this before you.</p>

<p>“This previous question is no doubt the result of my unexercised mind in Krsna consciousness, which brings me to: So long these years as your weak disciple I kept the anchor of sense gratification not pulled up and so my ‘rowing’ was strenuous and appears to have gotten me nowhere with little result. Now again preaching I find myself heavily unstudied in your books and feel incompetent. After so long with bad habits and many fall-downs I know that the renewed attempt will be more difficult. Kindly advise me specifically in this connection... . After having committed so many offenses and spending years not studying your books what is my position and what is the hope for me?”</p>

<p>Prabhupāda replied clearly to dispel his confusion, and as always was full of encouragement for pushing forward the preaching mission. “As to your question concerning whether relationships between devotees are eternal, the answer is ‘yes.’ This is confirmed by Sri Narottama dasa Thakura: ‘cakhudana dilo yei, janme janme prabhu sei’, he is my lord birth after birth. In this way you have to understand, by studying carefully the philosophy. We have got so many books now and I want all of my disciples to read them carefully. Soon we shall be instituting Bhaktisastri examinations and all brahmanas will have to pass. So utilize whatever time you find to make a thorough study of my books. Then all your questions will be answered.”</p>

<p>Madhudviṣa Swami also wrote from Fiji, explaining some managerial problems confronting him. The Society in Fiji is being organized mainly by Mr. Deoji Punja and his family, and gradually others are becoming involved. In legally registering ISKCON Madhudviṣa wants to make sure that all trustees are conforming to Prabhupāda’s standards, following the regulative principles and chanting sixteen rounds daily. Mr. Punja is adhering to the principles, but one or two of the other present trustees are not, although they are very favorable and have given large donations. He requested Prabhupāda to ask them personally to stand down in favor of Deoji’s brother, Karsanji.</p>

<p>Prabhupāda knows it is a sensitive issue. The impetus for the establishment of ISKCON Fiji arose originally from Deoji’s and his brother’s enthusiasm to invite Prabhupāda there. Prabhupāda does not want to act in a way that might strike people as arbitrary. Thus he advised Madhudviṣa to arrange everything locally, with a consensus of agreement. “If any of the trustees are to be dropped, this has to be discussed between the trustees themselves. These are all important men and we should be careful lest they become offended. If I say something it will not look well. If some of the trustees are not abiding by the principles or not chanting sixteen rounds, then they should be induced by the other trustees who are following, to step down. I think you can follow what I mean.”</p>

<p>From New Zealand a new devotee named Ralph asked Prabhupāda to clarify whether it is proper to attend lectures and <em>kīrtanas</em> held by the two renegade <em>sannyāsīs</em> Siddha Svarūpānanda Goswami and Tuṣṭa Kṛṣṇa Swami. He has heard conflicting reports but is personally attached to their association, while at the same time regularly attending the ISKCON temple’s morning program. Since the possibility of initiation is approaching for him and several devotees in New Zealand, he wanted Prabhupāda to clarify finally what the proper attitude should be.</p>

<p>Śrīla Prabhupāda obliged. “There is no reason why you cannot associate with any of my disciples, providing that they adhere to our principles. As long as Siddha Svarupa Maharaja and Tusta Krsna Maharaja act as sannyasis, i.e., dress in dhoti, keep shave headed with sikha, follow strictly the rules and regulations, and preach from my books, I have no objection. Sometimes there will be a little misunderstanding between Godbrothers, that is even going on amongst liberated souls. What is important is that everyone must engage in Krsna’s service under the direction of the spiritual master.”</p>

<p>Happily, not every letter reported problems. Bṛṣākapi, the president of ISKCON Washington, D.C., sent a cheerful narrative, along with photos, about a fifteen acre property they’ve purchased, “in the wealthiest county in America, in the wealthiest city in the county, Potomac, Maryland. It seems to be Krsna’s desire that we have this property, for without His special mercy we would have never been able to afford it.</p>

<p>“The total purchase price is $657,000, financed $30,000 down and 30 years to pay at 9% interest. Payments for the first ten years with no interest at $3,000 per month. At ten years we will owe $297,000. This balance will be financed over 20 years at 9% interest for $2,300 per month.”</p>

<p>Smiling, Prabhupāda raised his eyebrows at the figures mentioned. Such news indicates ISKCON’s increasing prosperity, and the bestowal of Lord Śrī Kṛṣṇa’s special mercy.</p>

<p>Bṛṣākapi made two specific requests. “We are located only forty minutes by airplane flight from New York City, and because this is the capital of America, we pray you will bless this city with your presence. When you come we will try to make arrangements for you to meet with the President of America, senators, congressmen and other important people.</p>

<p>“As you know, we have installed here already 40" Gaura-Nitai Deities and 25" Radha-Krsna. We have not yet installed Lord Jagannatha, Lady Subhadra and Lord Balarama Deities. I was reading in the newsletter that you would be installing Sita Rama, Laksman and Hanumanji Deities at the new temple in Bombay, and we were wondering if we should install Sita Rama, Laksman and Hanuman in Washington D.C. the capital of America, since Lord Ramacandra is the perfect king.”</p>

<p>Moreover, he reported a boom in book distribution, the D.C. temple selling over 300 big books and 2,000 BTGs daily on the streets and in the airports. He also enclosed a list of devotees for initiation and a declaration of their love and commitment.</p>

<p>Prabhupāda was very happy to hear such news and pleased to oblige his requests. “I am very pleased that we have now got such a wonderful property in the nation’s capital, Washington D.C. The photos show that there is good opportunity to develop it into a very important center. And since you say that it is in a most aristocratic location, it is certainly Krsna’s mercy. If you can make arrangements for me to meet the President, I shall surely go.</p>

<p>“As far as your desire to have Sita Rama Deities, it is a good idea, but you should wait for some time. First see that you have sufficient brahmanas who are very well trained and qualified, then you can consider to install Sita, Rama, Laksman and Hanuman. They are the ideal King and it will be very suitable that They reign over the capital of America. Now you have got Gaura-Nitai Deities, so you can go ahead and get Prabhupāda and Bhaktisiddhanta Deities immediately. Guru and Gauranga worship is standard for all our temples.”</p>

<p>In accepting his new disciples, especially the <em>brāhmaṇas</em>, his concern over raising the standards again showed. “Enclosed are the sacred threads for the brahmanas. They should be allowed to hear the Gayatri mantra through the right ear from the tape recording. Brahmana means to be very clean—inside by chanting the Lord’s glories and outside by regular bathing. Teach everyone by your personal example. Also you must see that the brahmanas are given sufficient time to read the books. Soon we shall be introducing the Bhaktisastri examination, which all brahmanas will be expected to pass. It will be based on Bhagavad-gita, N.O.D., Nectar of Instruction, Isopanisad, and the small paperback books like Easy Journey. A brahmana should be a pandita.”</p>

<p class="verse">* * *</p>

<p>After much delay and frequent requests, now nearly at the end of Prabhupāda’s stay in Nellore, the deed of gift for the two parcels of land has finally been produced. But it is a “gift” with many conditions. Scrutiny of the fine print revealed several dubious clauses. Prabhupāda sat at his desk as Gopāla Kṛṣṇa and Mahāàsa read out the details. One clause insisted that on the two-acre plot, a temple, a comparative religious studies library, and a meditation hall be built.</p>

<p>Prabhupāda shook his head. He said that as far as we are concerned, we have no use for such things. A temple with the Deities of Rādhā-Kṛṣṇa is sufficient because They are the only objects of our meditation. Moreover, the Vedic knowledge is complete, so what is the need for comparison?</p>

<p>Other conditions were more explicit. They declared that if the project is not completed within three years, then the land and whatever stands on it will be turned over to another charitable organization, such as a certain mission based in Calcutta.</p>

<p>As for the seven-acre plot of land on which the house and gardens stand, the document stated that if ISKCON did not take possession and utilize it fully within one year of the death of the sisters, then it will also be turned over to “some suitable charitable organization.” The same mission in Calcutta was named.</p>

<p>Everyone agreed. It seemed clear there was some kind of plan to have ISKCON begin development of the land. Then by some ploy its timely completion will be prevented, thus giving reason to have it seized and handed over to this Calcutta mission. It would not be difficult to thwart any building project by somehow or another cutting off the supply of cement, which the government controls and rations.</p>

<p>With this information many pieces of the puzzle now fell into place. This Calcutta mission is also well known as the <em>murgi</em> (chicken) mission because its members keep large chicken farms and are known meat-eaters. These two sisters raise chickens and eat meat. This mission also has a consistent formula for the layout of their <em>āśramas</em>—a temple, a comparative studies library, and a meditation hall.</p>

<p>Even the planting of the <em>tulasī</em> bushes, which we had taken as a sign of devotion to Kṛṣṇa, took on new meaning considering these revelations. There are two kinds of <em>tulasī</em> trees, one with green leaves, and one with blue leaves; the green being named after Lord Rāma, and the blue after Lord Kṛṣṇa. Inspecting the garden on our first day here, I had noticed many <em>tulasī</em> bushes planted in an alternating sequence—green, blue, green, blue—Rāma Kṛṣṇa, Rāma Kṛṣṇa. I also recalled the <em>tulasī</em> bush in the pot that had been trimmed into the shape of a large bird—no doubt now that it is a chicken.</p>

<p>There was the <em>mūrti</em> of Gopāla Kṛṣṇa placed outside, exposed to the elements. And the strange, withdrawn reception we received upon arrival. Now it was obvious to us all that our hosts were definitely not devotees of Kṛṣṇa.</p>

<p>Analyzing their ulterior motives, Prabhupāda pointed out that ISKCON is one of the only organizations in India with the manpower and money to initiate large projects like the one proposed here. People are steadily losing interest in other missions, and this particular Calcutta mission is reportedly experiencing considerable difficulty with dwindling membership and income. It seems clear, therefore, that ISKCON is being set up to give a strong start to the project, only to be removed later by what now has shown itself to be a deceptive legal manoeuvre. Who the villains of this piece of trickery are is not clear, but Śrīla Prabhupāda did say that, being widows, the sisters would have been easy targets for unscrupulous so-called spiritualists with no interest in regulated spiritual practice. Still, he wasn’t blaming anyone, but some action must be taken to protect our interest.</p>

<p>Prabhupāda decided our course of action. Mahāàsa Swami is to meet with the sisters and explain to them that a gift is something given unconditionally; that the donation of land should be in the spirit of <em>Bhagavad-gītā</em> 17.20: “That gift which is given out of duty, at the proper time and place, to a worthy person, and without expectation of return, is considered to be charity in the mode of goodness.”</p>

<p>He said that if they refuse to give it unconditionally, then we should politely back out and withdraw from the project.</p>

<p class="verse">* * *</p>

<p>Late in the afternoon Śrīla Prabhupāda went to the local Rotary Club, where a special meeting was convened in his honor. Mr. G. Gopāla Reddy, the gentleman who accompanied Śrīla Prabhupāda on his morning walks, and the current president of the club, received him warmly, lauding his worldwide preaching efforts.</p>

<p>Then, to a small but attentive audience he delivered a well-rounded lecture on the general philosophy of Kṛṣṇa consciousness. Describing his Kṛṣṇa consciousness movement as “a tiny little attempt” to convince people about God, he asked them all to heed the advice of Śrī Caitanya Mahāprabhu. “Therefore Caitanya Mahāprabhu says that His mission is especially to the Indians, those who are born in India. <em>Āmāra ājṣāya guru haṣā tāra ei deśa</em>. This instruction was given when Caitanya Mahāprabhu was traveling in South India. ‘If you want to help Me, then you become a guru under My instruction. You become a guru.’</p>

<p>“‘Sir, I have no education. I am not a <em>brāhmaṇa</em>. I am this, I am that. How can I become guru?’</p>

<p>“So Caitanya Mahāprabhu says, <em>āmāra ajṣāya guru haṣā tāra ei deśa</em>. ‘Where you are living, you just try to deliver them. But you become a guru.’</p>

<p>“‘How I shall become?’</p>

<p>“<em>Yāre dekha tāre kaha kṛṣṇa-upadeśa: </em>‘Simply you instruct what Kṛṣṇa has said, that’s all. Then you become guru. You don’t require any other qualification.’”</p>

<p>Alluding to the spread of the British Empire, he contrasted the motives of its representatives with that of Śrī Caitanya’s. “India’s mission is not that we colonize in another country and exploit them and bring money and become a ‘Lord.’ No. India’s mission is how to revive Kṛṣṇa consciousness throughout the whole world. That is India’s mission. Revive your Kṛṣṇa consciousness, be fixed up in Kṛṣṇa, and then distribute this knowledge. This is Indian mission.”</p>

<p>He finished to polite applause. He was invited afterward to pose for a photograph, the leading members of the Rotary club lining up in back, and Prabhupāda, the <em>sannyāsīs</em> from our camp and myself all sitting in front. It felt somehow special and historic to be part of an official photo with Śrīla Prabhupāda.</p>

<p class="verse">* * *</p>

<p>This evening’s <em>paṇḍāl</em> lecture was the last. Tomorrow Prabhupāda returns to Madras and then goes on to Bombay.</p>

<p>The open courtyard was once again filled to capacity with thousands of attentive men and women sitting quiet and absorbed, as Prabhupāda concluded his series on the Sixth Canto of the <em>Śrīmad-Bhāgavatam</em>. He then made his presentations to the new Life Members in what has become a nightly ritual.</p>

<p>Prabhupāda is very happy and satisfied with the trip—apart from the peculiarities of the land offer.</p>', '', '1976-01-07', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- January 8th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'January 8th, 1976', 6,
    '', '', '', '',
    '', '', '', '',
    E'<p>Before leaving to catch the train to Madras, the two sisters came to see Prabhupāda in his room. He thanked them for their hospitality. Without directly bringing up the strange conditions put upon the deed of gift, he preached to them very positively that they should try to become real devotees of Kṛṣṇa.</p>

<p>He had me read out to them the <em>Gītā</em> verse concerning charity in the mode of goodness. He emphasized that one should not expect any reward or gain; this was the criterion for activity in Kṛṣṇa consciousness. He encouraged them to try to rise to this standard. Even though the sisters appeared to be involved in a surreptitious scheme to take advantage of him, Prabhupāda still tried to uplift them and give them his mercy. They had invited him to their home, and therefore he wanted to do some good for them. They listened, but what he said drew very little response from them, apart from obligatory acceptance of his thanks for the stay. Everyone in our party was glad to leave. It was unpleasant living in such close proximity with people who made us feel unwelcome and who ate meat.</p>

<p class="verse">* * *</p>

<p>The train ride to Madras was pleasant. This Nellore trip has given me my first opportunity to journey with Śrīla Prabhupāda on a train, and we were all happy to see him enjoy the trip. It was without strain and much more comfortable than flying, which he tends to dislike.</p>

<p>Śravaṇānanda and Bhāvabhūti prabhus were waiting at the station to pick us up. They arranged a <em>shenai</em> band to greet Prabhupāda at the station and with great fanfare escorted him to a waiting car. This time they arranged for Prabhupāda to stay in our own center in Aspiran Gardens, a nice house in a pleasant suburb.</p>

<p>Prabhupāda liked it. He had a quick tour, and when Śravaṇānanda and Bhāvabhūti mentioned that they were thinking of getting another place, he told them to stay where they are. He noted some small bushes with curry leaves growing, as well as some drumsticks, a long, thin beanlike vegetable that he likes very much. He requested Harikeśa to use them in making his lunch.</p>

<p class="verse">* * *</p>

<p>I shaved Śrīla Prabhupāda’s head for him as we sat out on the small ground-floor front veranda, and then he heard his mail. Tamal Krishna Mahārāja informed him that the telegram sent to Australia from Bombay stating that Prabhupāda was unable to attend Ratha-yātrā had been returned undelivered. Prabhupāda considered what to do. He said that he would go to Australia if Madhudviṣa Mahārāja had already made arrangements. Since they may have advertised that Prabhupāda would be present, he didn’t want to spoil the event. Yet, this will certainly pose a big difficulty, because Prabhupāda is still not well enough to endure such a long plane ride.</p>

<p>Another travel quandary arose when Tamal Krishna Mahārāja discovered that our plane to Bombay was to depart in mid-evening. Prabhupāda never travels on Thursday afternoons, especially between 4:30 p.m. and 7:30 p.m., for he considers these hours inauspicious for travel. On a previous visit to Australia to open the new Melbourne temple in May 1975, Śrīla Prabhupāda delayed his departure from Perth to Melbourne for one day to avoid traveling on a Thursday afternoon. He was prepared to do the same today. But after some discussion he finally decided to take the late flight, thus avoiding the most inauspicious hours while still keeping his schedule.</p>

<p>We left in the Mercedes in mid-evening, Prabhupāda observing all the little roadside shacks selling bananas and varieties of fruits and vegetables. He told us that in South India people are still pious, still mainly vegetarian. He also recalled Śrī Caitanya Mahāprabhu’s preaching in the South and indicated that he was well pleased with the programs the devotees had arranged for him and the reception he received.</p>

<p>As a final touch, Śravaṇānanda had arranged through a Life Member to have the car drive right onto the airport tarmac, right up to the plane. Thus at about nine o’clock we flew out, arriving in Bombay late at night.</p>', '', '1976-01-08', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


END $$;
