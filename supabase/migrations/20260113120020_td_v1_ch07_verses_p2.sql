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


  -- January 5th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'January 5th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>On their preaching tour in the South, Acyutānanda and Yaśodānandana Swamis have met an assortment of spiritual practitioners who have their own interpretations and twists on traditional Vedic <em>siddhānta</em>. Now they are taking full advantage of Prabhupāda’s association to get definitive answers to the challenges they regularly face.</p>

<p>On the walk this morning they played the role of impersonalists and challenged Prabhupāda with a barrage of Māyāvādī arguments. Yet, no matter how hard they tried, they couldn’t defeat the Vaiṣṇava exegesis with which Prabhupāda countered all their arguments.</p>

<p>Śrī G. Gopāla Reddy, the president of the local Rotary Club, also accompanied Śrīla Prabhupāda on the morning walk. He is the secretary of a committee that Mahāàsa Swami has formed for the new temple. The committee has been very active in making new ISKCON life members and obtaining pledges for construction work. Prabhupāda was happy to see him and thanked him for his efforts. Upon noticing a colony of <em>bhaṇgis</em>, or “untouchables,” Mr. Reddy mentioned that the government was distributing land to them. He asked whether ISKCON was engaged in any sort of social welfare work, because many people have asked him what our Society did to benefit others.</p>

<p>Prabhupāda replied by asking him what he considered the best social welfare.</p>

<p>When Mr. Reddy said serving the poor and the natives, Prabhupāda told him, “Everyone is poor. Who is rich? First of all find out: Who is rich?” Śrīla Prabhupāda went on to explain how everyone is poor because each of us must suffer disease, old age, and death. Adjustment of a person’s material condition can be done by anyone, but ISKCON was established for a different purpose. “These things are being done by so many other people, and we are doing something which is ultimate. The hospital gives some medicine when there is some disease, but that does not mean there will be no disease. Can they guarantee that, ‘I give you this medicine—no more disease?’ We are giving that medicine—that no more disease. That is the best social work. As soon as you give up this body—<em>tyaktvā dehaà punar janma naiti</em>—you’ll have no more birth. And if you have no more birth, there will be no more death. And if you have no more birth, then there will be no more disease. This is our prescription. <em>Tyaktvā dehaà punar janma naiti māà eti</em>. Not that he is finished; he goes back to home, back to Godhead. This is our program.”</p>

<p>On the way back to the house a companion of Mr. Reddy asked Śrīla Prabhupāda how to meditate. Although most people in India are familiar with the concept of mediation, or have even practiced some form of it themselves, the actual purpose of meditation is rarely understood. The man’s lack of knowledge became apparent when he explained that he thought the goal of meditation was to make the mind silent.</p>

<p>Prabhupāda immediately corrected him, saying that it is not possible to silence the mind. He recounted a recent <em>Back to Godhead</em> article where a woman disciple had analyzed the fallacy of the idea. Prabhupāda had greatly enjoyed the article in which the girl described how she had read in a book that meditation means “to free the mind of all thoughts.” So she considered, “How can I be without thoughts? I will think of being ‘without thoughts,’ and that is a thought.” Therefore she concluded it was bogus, and she threw away the meditation book.</p>

<p>Prabhupāda said the point is to think of God. This alone is the real goal of meditation—there is nothing higher. If one is a rascal and has nothing beneficial to say, then it is good if he is silent. Otherwise the <em>Bhagavad-gītā</em> never advises silent meditation. Kṛṣṇa says, <em>satataà kīrtayanto māà</em>. He never said that ‘You become silent.’ Where is? Can you show me any verse in the <em>Bhagavad-gītā?</em> Can you show me any verse where Kṛṣṇa has advised that you become silent? Or the mind is vacant? Where are these things?</p>

<p>“<em>Man-manā bhava mad-bhakto</em>: ‘The mind should be absorbed in My thought,’ <em>man-manā</em>. That is recommended. Where does He say that ‘Make your mind vacant and think of nonsense’? He never says. And where does He say that you become silent? He never says. <em>Ya idaà paramaà guhyaà mad-bhakteṣv abhidhāsyati</em>; <em>na ca tasmān manuṣyeṣu kaścin me priya-kṛttamaḥ</em>[Bg. 18.68–69]: ‘Anyone who speaks about this <em>Bhagavad-gītā</em>, he is my dearmost friend,’ He said. So why one should be silent? Our ultimate aim is how to become dearmost to Kṛṣṇa, and He never says that ‘You become silent.’ Rather, He recommends that ‘You always be engaged in glorifying Me.’ Where is the ‘silent’? These are all manufactured by these rascals. Meditation and silence, these are not recommended in the <em>Bhagavad-gītā</em>.”</p>

<p>After the morning walk the <em>sannyāsīs</em> have been coming into Prabhupāda’s room for a few minutes, eager for as much association with him as they can get. As he relaxed behind his desk waiting for breakfast he told them our preaching will go on only if we have spiritual strength. “We may have external strength,” he said, “but success will only come if we have spiritual strength. Preaching programs will work only if there is purity.” Citing the example of one of his leading Godbrothers in the Gaudiya Matha, he pointed out that he had all kinds of material facility—money, <em>maṭhas</em>, etc. But what had he done for spreading Kṛṣṇa consciousness? He explained that simply amassing material wealth will not bring spiritual success, nor does it signify success. He gave the example of milk touched by a serpent: It looks like milk, but it is spoiled.</p>

<p>“How do we keep our spiritual strength?” Prabhupāda asked. We can keep our spiritual strength by being very strict Vaiṣṇavas, he told us: by strictly following the principles and not giving any consideration whatsoever to <em>māyā’s</em> allurements. <em>Māyā</em> is always trying to weaken us, he said, but if we think only of Kṛṣṇa we will have spiritual strength; if we think of something else then we will have no transcendental potency. As always, Śrīla Prabhupāda emphasized that we must remain strictly regulated and chant all our rounds every day.</p>

<p class="verse">* * *</p>

<p>All GBC members are required to send in monthly reports to Śrīla Prabhupāda. Satsvarūpa Mahārāja sent his for the month of December from Santa Cruz, California. He is in charge of the Library Party, selling standing orders of Prabhupāda’s books to universities in the U.S. and Europe. He and his group have been remarkably successful. They are now trying to approach public libraries, and he outlined his strategy in his letter. He also reported that many extremely favorable book reviews have been received from professors. He wrote, “They are praising your books in language more exalted than any of us disciples can praise!! The reviews from Oxford are from some of the biggest linguistic authorities in the world. All these amazing reviews are certainly one of the most important services of the Library Party.”</p>

<p>As well as library canvassing, his party has also been preaching in the Santa Cruz area, where many young people reside. In a spirit of cooperation with the West Coast GBC, Jayatīrtha, he had allowed one of his party, Cāru, to become president of the Berkeley temple. He hoped to leave another man in Santa Cruz to help with the preaching there. “I think we GBC should try more to help each other in the different zones and not take a sectarian spirit only for ‘our zone,’ especially when the zones are nearby.”</p>

<p>He has over 100 preaching engagements alone in Texas colleges during January and February and asked if he could carry small Gaura-Nitāi Deities onto the campuses.</p>

<p>He also wrote about his own growing interest in Prabhupāda’s books. “I am becoming more and more drawn to read the many books you have published. Since there are so many books, and since I am, as a sannyasi and a GBC, constantly being called to lecture and answer questions, I take it as a special responsibility. I have therefore, been trying to read at least three hours a day and more whenever possible, although I try not to neglect management duties. In your books and tapes I receive the greatest solace. Is this amount of time spent in reading excessive?”</p>

<p>Finally he said that they are researching the possibility of having favorable scholars make recommendations for Prabhupāda to receive the Nobel prize for literature.</p>

<p>Prabhupāda was happy to hear Satsvarūpa’s lengthy report. He was especially pleased with their success in making standing orders and with the idea of placing his books in public libraries, which he said would be a “great victory.” He also considered the book reviews very important. In fact, his secretary always carries a file with all the latest reviews, which Prabhupāda shows to visitors at every opportunity.</p>

<p>He also appreciated Satsvarūpa’s spirit of cooperation and told him, “Everything should be done cooperatively. ‘Our’ and ‘yours’ are material conceptions and have no place in our Krsna consciousness movement. If the members of our movement are unable to cooperate, it will be very difficult to spread the mission of Lord Caitanya.”</p>

<p>He did not approve of taking Deities into classrooms, lest the students think us fanatics, and instead recommended a large picture of Gaura-Nitāi.</p>

<p>As for Satsvarūpa’s reading schedule, Prabhupāda approved wholeheartedly. “Yes, as a sannyasi and GBC your first duty is to read my books. Otherwise how will you preach? In order to remain steadily fixed in Krsna consciousness there must be a sound philosophical understanding. Otherwise it will become only sentiment. Whenever you find time please read my books. Shortly we shall be introducing the system of examinations for those students who are ready for second initiation as well as sannyasa. According to the degree, devotees will be expected to read and assimilate our different books.</p>

<p>“Our first business is this book distribution. There is no need of any other business. If book distribution is managed properly, pushed on with great enthusiasm and determination and at the same time if our men keep spiritually strong, then the whole world will become Krsna conscious.”</p>

<p>Rādhāballabha dāsa sent a letter from Los Angeles requesting Śrīla Prabhupāda’s advice about the new printing standard for <em>Śrīmad-Bhāgavatam</em>.</p>

<p>Prabhupāda’s main concern is practicality. He advised him that the first consideration was cost-effectiveness. He doesn’t want the price unnecessarily increased. Scholarly appreciation is important, but more important is Kṛṣṇa consciousness actually being put into practice.</p>

<p>Similarly he sees <em>The Nectar of Instruction</em> as a book of great worth because of its practical value. The devotees have been thinking it primarily a book for distribution within ISKCON, thus the small printing. Prabhupāda, however, sees it as having a far wider audience.</p>

<p>He expressed the same sentiment to Rādhāballabha that he impressed upon Tamal Krishna Mahārāja a few days earlier. “The Nectar of Instruction has come out very nice. It is very important and must be immediately read by all the devotees. In the near future we shall introduce the Bhakti-sastri examination for second initiation, and this shall be one of the required books of study. Anyone who reads it will immediately understand what Krsna consciousness is. Some minister in Bombay recently asked me how to create morality among the students, because the students are all vagabonds. If this book is introduced for study in the schools and colleges it will give a clear idea of what morality actually is. It is a most important book.”</p>

<p>Prabhupāda is also closely supervising revisions of his books and has approved of correcting printing and editorial mistakes in earlier editions. Rādhāballabha mentioned that on Harikeśa’s advice the BBT has postponed reprinting the First Canto of the <em>Bhāgavatam</em> because Prabhupāda was apparently not pleased with the standard of correction.</p>

<p>Prabhupāda confirmed this. “I will have to see personally what are the mistakes in the synonyms and also how you intend to correct them. I was not satisfied with the corrections that were made before. I saw some changes which I did not approve. Nitai may correct whatever mistakes are there, but the corrected material must be sent to me for final approval. So reprinting the volumes will have to wait until the mistakes are corrected and approved by me.”</p>

<p>In another package Jadurāṇī dāsī, chief BBT artist, sent some sketches of proposed paintings for an upcoming <em>Bhāgavatam</em> production. Śrīla Prabhupāda regularly receives sketches from the artists before allowing them to paint any scenes, but during the recent <em>Caitanya-caritāmṛta</em> production marathon he permitted them to paint without his prior approval for the sake of expediency. Now that all seventeen volumes are out, the pressure is off, and he confirmed his desire to revert to the previous arrangement.</p>

<p>Being with Prabhupāda is like being at Action Central. It is exciting and educational to observe how he attentively oversees every aspect of ISKCON’s development and preaching, especially anything connected with book production and distribution.</p>

<p class="verse">* * *</p>

<p>Later in the day Prabhupāda visited the Raṅganātha Temple here in Nellore. This impressive building was founded in A.D. 1070 on the bank of the River Pennar, sometimes called the Penarkini, by the Śrī Vaiṣṇavas, the followers of Rāmānujācārya. It is home to a very large Deity of Raṅganātha, Lord Garbhodakaśāyī Viṣṇu.</p>

<p>We entered the temple compound through a massive 110-year-old <em>gopuram</em>, an edifice similar to a temple dome. It is about ninety-five feet high and covered with dioramas of hundreds of Viṣṇu <em>avatāras</em>. After passing through its high-arched gateway we walked across a small courtyard surrounded by private residences, entering the original walled compound of the temple proper.</p>

<p>Prabhupāda was warmly received by a small crowd of local dignitaries and priests. It was wonderful to see them honor him with pomp and ceremony. After being draped with a newly woven cloth, he was led around the temple precincts preceded by a <em>shenai</em> band. The band included a <em>nadaswaram</em>, which is a six-foot-long <em>shenai</em>. Its exotic wail traditionally announces the presence of an auspicious guest. There was also a <em>thavil</em>, a double-headed drum played atone end with a stick and slapped by the player’s metal-ringed fingers at the other, producing staccato rhythms.</p>

<p>High above Prabhupāda’s head the white silken canopy of an eight-foot-wide ceremonial umbrella offered shade, while simultaneously marking the position to inquisitive bystanders of the most important person present.</p>

<p>Proceeding down the left side of the inner courtyard Prabhupāda was taken first to a small shrine of Raṅga-nāyakī-devi, the four-handed seated Deity form of Lakṣmīdevi.</p>

<p>He was led next into a multi-mirrored room used for various festivals. Built in the 1930s, a gazebo structure stood in the center, its four columns covered in mirrors. The gazebo’s ceiling had a painting of baby Kṛṣṇa sucking His toe. Beneath it, there was a sitting place for the Deity.</p>

<p>On the gazebo’s four corners hung large glass bowls for use as candle holders. The walls of the entire room were mirrored to a height of eight feet, the rest of the walls being decorated with various colorful paintings of Viṣṇu and <em>kṛṣṇa</em>-<em>līlā</em>. The main ceiling was covered with paintings of the <em>Daśāvatāras</em>.</p>

<p>Our guides explained that the mirrored room was built to enable people to see the Deity from anywhere in the room.</p>

<p>From there Prabhupāda was led into the main temple, its interior very majestic and imposing. Uneven floors of black stone and colored ceramic tiles accentuated its antiquity. Beams of solid rock running across the tops of about eighty or ninety equally substantial pillars supported the low, stone-slab ceiling. The pillars were spaced so closely together I got the impression of having ventured into a maze.</p>

<p>There was a squat, claustrophobic feel to the nave, and the lack of natural light in the inner chamber made me feel very insignificant indeed.</p>

<p>After a <em>parikrama</em> of the Deity room, the <em>pūjārīs</em> finally led Prabhupāda into the <em>sanctum</em>-<em>sanctorium</em>. We walked first through an ancient portal flanked by six-feet-high <em>mūrtis</em> of the Vaikuṇṭha guardians Jaya and Vijaya. Then we passed under a small carving of Gaja-Lakṣmī, Lakṣmī flanked by two elephants pouring water on her. We passed thick, heavy doors adorned with at least thirty or forty heavy brass bells hanging from large metal rings. Inside, a final arch of tarnished silver bore the symbols of the Śrī Vaiṣṇava <em>sampradāya:</em> Garuḍa, lotus, <em>tilaka</em>, conch, and Hanuman. Ornamental snakes coiled around either side of the arch’s underside.</p>

<p>Passing through this archway to the innermost recess we finally came upon a ten-feet-long Deity of Garbhodakaśāyī Viṣṇu, lying resplendent on His back on His couch of Ananta Śeṣa. He wore a high-peaked silver helmet, and His long arms and lotus feet were covered with silver. Lakṣmī sat on a lotus flower on His chest. Overall, His appearance was extremely impressive.</p>

<p>On the back wall, rising from the Lord’s navel, Lord Brahmā perched upon his lotus. At Lord Viṣṇu’s lotus feet stood Śrī- and Bhū-devis, His eternal consorts. Standing in front of the main Deities was the <em>utsava mūrti</em> (festival Deity) of Raṅganātha Swami. This was flanked by twenty-six-inch-high, beautifully formed Deities of Śrī and Bhū.</p>

<p>As Prabhupāda stepped inside the Deity room we also pressed in close behind, eager to have the opportunity of the Lord’s intimate <em>darśana</em>. Prabhupāda stood silently as the <em>pūjārī</em> made a simple offering to the Lord by waving a plate of burning camphor and coconut before the Deities. The <em>pūjārī</em> then distributed the blessings of the Supreme Lord by placing a helmet with miniature shoes of Viṣṇu on the top of it, first on Prabhupāda’s head and then on ours.</p>

<p>We left the central temple, crossing to the other side of the compound where Śrīla Prabhupāda was shown yet another small house divided into two chambers. One room housed various palanquins for the use of the <em>utsava</em> Deities. Especially impressive was a golden palanquin built in the shape of Garuḍa. There were others in the shapes of a swan, celestial serpent, an elephant, and a lion. The other, inner chamber, contained a shrine in which reposed Deities of seventeen Alwars (personal forms of the paraphernalia of Viṣṇu) beginning with Rāmānujācārya.</p>

<p>After seeing all the Deities, Prabhupāda was given a seat of honor in a covered section of temple enclosure. We were then invited to perform <em>kīrtana</em>, and all the locals joyfully joined in. A few minutes later our hosts served us an excellent feast. It was done so quickly and efficiently that Prabhupāda afterward commented that their management had been first-class. He said he wanted us to learn how to manage things as nicely. It was an enjoyable visit, and Prabhupāda was highly pleased.</p>

<p>As we returned in the car, however, Tamal Krishna Mahārāja sounded a bleak note. He mentioned that the temple was now in government hands, even though the Rāmanujites were looking after it. Every temple in Andhra Pradesh has been taken over by the government. The takeover scheme was originally meant to usurp the revenue collected by Śrī Bālajī, the famous Deity at Tirupati, Who is said to receive at least one <em>lakh</em> of rupees every day in donations from pious visitors. Mahārāja said that he thought the long-term strategy was to allow the temples to become gradually run down, and then to close them. Prabhupāda seemed to agree.</p>

<p class="verse">* * *</p>

<p>The evening program was very good, and again it was a maximum capacity turnout. Prabhupāda continued his previous night’s topic about atonement, with the next two verses from the Sixth Canto.</p>

<p>“Mahārāja Parīkṣit said, ‘One may know that sinful activity is injurious for him because he actually sees that a criminal is punished by the government and rebuked by the people in general and because he hears from the scriptures and learned scholars that one is thrown into a hellish condition in the next life for committing sinful acts. Nevertheless, in spite of such knowledge one is forced to commit sins again and again, even after performing acts of atonement. Therefore what is the value of such atonement?</p>

<p>“‘Sometimes one who is very alert so as not to commit sinful acts is victimized by sinful life again. I therefore consider this process of repeated sinning and atoning to be useless. It is like bathing of an elephant, for an elephant cleanses itself by taking a full bath, but then throws dust over its head and body as soon as it returns to the land.’”</p>

<p>The second <em>śloka</em> describing the bathing of the elephant is a favorite of Śrīla Prabhupāda’s. He gave a wonderfully fluent lecture to his spellbound audience explaining how only the process of devotional service can fully eradicate the desires that lead a person to commit sinful acts. To illustrate this point he told the story of Mṛgāri the hunter who had formerly taken great pleasure in half-killing animals but, after meeting the great saint Nārada Muni and becoming a Vaiṣṇava, was reluctant to even step on an ant.</p>

<p>Although he stressed the performance of <em>tapasya</em> as a necessity for spiritual advancement he also acknowledged that in this age concessions were required, and given. “<em>Tapasya</em> means beginning with <em>brahmācārya</em>, celibacy. We have given the meaning of <em>tapasya:</em> austerity or voluntary rejection of material enjoyment. ‘I do not like to do something because it is not pleasing to me, but for the sake of advancement in spiritual life I must have it.’ Now one may say that ‘If I give up all these things which I am habituated to, there will be some painful condition.’ So therefore <em>Bhagavad-gītā</em>has recommended to tolerate, even though it is painful. It is not at all painful, but for those who are trying to practice, in the beginning it may be painful. Bhagavān, Kṛṣṇa, is advising that even it is painful, you must do it and tolerate it. Sometimes to cure our disease, for example a fever, we have to swallow very bitter quinine pills. But Śrī Caitanya Mahāprabhu, considering the people of this age, Kali-yuga, He knew that people will not be able to tolerate even such little pain for advancing in spiritual life, so He therefore recommended <em>harer nāma harer nāma harer nāmaiva kevalam/ kalau nāsty eva nāsty eva nāsty eva gatir anyathā</em>.”</p>

<p>The evening ended with another presentation of books to new life members. As the devotees showed a film and chanted, Prabhupāda returned by car to the house.</p>', '', '1976-01-05', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- January 6th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'January 6th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>On the morning walk there was some discussion about the Tirupati temple, which houses Bālajī, the richest Deity in India. Prabhupāda suggested that Mahāàsa Swami approach the managers of the temple for a grant to build our temple here in Nellore. Mahāàsa explained that in recent years the management of Tirupati, along with that of all the temples in the state, had been taken over by the government.</p>

<p>This led to a long discussion whether our ISKCON temples could also be taken over. If they could, it would be on the basis of their being “Hindu” temples. So Śrīla Prabhupāda, in order to avoid any government interference, suggested that we register the temples as American property. Apart from that, he said we are not Hindu. The word Hindu isn’t in the <em>Bhagavad-gītā</em>, and the teachings of <em>Bhagavad-gītā</em> are for everyone, not just Hindus. Śrīla Prabhupāda strongly emphasized this point and even said that we could go to court to prove we are not Hindus.</p>

<p>After the morning walk the <em>sannyāsīs</em> gathered in Śrīla Prabhupāda’s room. Yaśodānandana Mahārāja showed him what he said was a Dvārakā-śīlā, a brown-and-white-freckled stone, and asked if it was all right to worship.</p>

<p>“It can be used as paper weight,” Prabhupāda said, unimpressed.</p>

<p>When Yaśodānandana Swami mentioned that some temples worshipped the Dvārakā-śīlā along with the Śālagrāma-śīlā, Prabhupāda was dismissive. “That’s all right, but we have no such instruction.”</p>

<p>Prabhupāda called in Harikeśa, and had everyone sit while Harikeśa read some of his <em>Dialectic Spiritualism</em>. Last night he had read to Prabhupāda for forty-five minutes, and Prabhupāda was very pleased. Prabhupāda said that the article should immediately be printed in BTG, as well as be sent to Hansadūta for printing in German and Russian.</p>

<p>Harikeśa used many relevant examples to disprove the theories of Lenin and Engels, most of them given by Śrīla Prabhupāda over the last few weeks, along with some of his own. He completely disproved their theory of idealistic materialism, showing it to be an illogical, nonsensical notion.</p>

<p>Encouraging further debate on the subject, Prabhupāda said that there could be no question of a “dialectic” in discussions between materialists, because all parties involved were imperfect. He challenged us that if they are indeed imperfect, what is the value of their discussion? He gave an example to illustrate the point. “If children discuss some serious subject matter, what is the value? They are all children in the cradle of nature, that’s all. Therefore <em>prakṛteḥ kriyamāṇāni</em>. Just like children, ‘Ha! Sit down here.’ He has to sit down. Then where is his freedom to discuss? <em>Prakṛti</em>says that ‘You sit down here. Don’t go there!’ He has to accept. Then what is the value of discussion?”</p>

<p>Harikeśa continued to read aloud, explaining how food production is dependent on God. Acyutānanda Swami pointed out that in Russia they don’t have enough grains, yet the Communists like to accuse the religionists of withholding food to control the population.</p>

<p>Prabhupāda asked why they are having grain shortages, and I recalled that in the newspapers they had reported insufficient rainfall in the Eastern-bloc countries, forcing them to buy elsewhere.</p>

<p>“Then?” he inquired, and promptly answered his own question. “Then you have to depend on rain, and when we say, <em>parjanyād anna-sambhavaḥ</em>. And <em>yajṣād bhavati parjanyah</em>. That means, rascal, you take one side, <em>ardha-kukkuti-nyāya</em>. Cut the chicken in half, and separate the mouth—it is expensive—and keep the rear side. You get eggs.” He laughed heartily at the foolishness of trying to grow grains without making the necessary sacrifice. “So this is <em>ardha-kukkuti-nyāya</em>. The rascal does not know that if you separate the mouth, there will be no egg.”</p>

<p class="verse">* * *</p>

<p>Later in the morning Prabhupāda called in Tamal Krishna Goswami to formulate a plan he has been discussing over the last couple of days to raise the standards of the <em>brāhmaṇas</em> in ISKCON. He expressed concern that many of our men are not familiar with our books. Especially here in India the <em>smārta-brāhmaṇas</em> sometimes criticize us for our lack of scriptural understanding. He wants the level of ISKCON education improved and then tested by a system of examinations, recognition being given to those who pass the different exams by the awarding of titles. Prabhupāda said that if a man can’t pass at least the <em>Bhakti-śāstrī</em> exam, the first level, he must be understood to be low class. The other morning he said that all potential second initiates should be tested to this standard, otherwise they couldn’t be awarded the sacred thread.</p>

<p>He is very serious about implementing this system. He instructed Tamal Krishna Mahārāja to immediately send out a letter to all the GBCs so they can discuss how to start this program at the upcoming meeting in Māyāpur.</p>

<p>Later Tamal Krishna read the letter he’d composed out for Prabhupāda’s approval.</p>

<p>“To all Governing Body Commissioners</p>

<p>Re: Examinations for awarding titles of Bhaktisastri, Bhaktibaibhava, Bhaktivedanta and Bhaktisarvabhouma. Your response is requested immediately by Śrīla Prabhupāda.</p>

<p>Dear Prabhus,</p>

<p>Please accept my most humble obeisances. Śrīla Prabhupāda has requested me to write you in regard to the above examinations which he wishes to institute. Here in India many persons often criticize our sannyasis and brahmanas as being unqualified due to insufficient knowledge of the scriptures. Factually, there are numerous instances when our sannyasis and brahmanas have fallen down often due to insufficient understanding of the philosophy. This should not be a point of criticism nor a reason for fall down, since Śrīla Prabhupāda has mercifully made the most essential scriptures available to us in his books. The problem is that not all the devotees are carefully studying the books, the result being a fall down or at least unsteadiness.</p>

<p>“His Divine Grace therefore wishes to institute examinations to be given to all prospective candidates for sannyasa and brahmana initiation. In addition he wishes that all present sannyasis and brahmanas also pass the examination. Awarding of these titles will be based upon the following books:</p>

<p>Bhaktisastri—Bhagavad-gita, Nectar of Devotion, Nectar of Instruction, Isopanisad, Easy Journey to Other Planets, and all other small paper backs, as well as Arcana-paddhati (a book to be compiled by Nitai prabhu based on Hari-bhakti-vilasa on Deity worship)</p>

<p>Bhaktibaibhava —All the above plus the first six cantos of Srimad-Bhagavatam</p>

<p>Bhaktivedanta—All the above plus cantos 7 through 12 of Srimad-Bhagavatam</p>

<p>Bhaktisarvabhouma—All the above plus the entire Caitanya- caritamrta.</p>

<p>“Anyone wishing to be initiated as a brahmana will have to pass the Bhaktisastri exam, and anyone wishing to take sannyasa will have to pass the Bhaktibaibhava examination as well. This will prevent our Society from degrading to the level of so many other institutions where, in order to maintain the temple, they have accepted all third class men as brahmanas. Any sannyasis or brahmanas already initiated who fail to pass the exams will be considered low class or less qualified. Anyone wishing to be second initiated will sit for examination once a year at Mayapur. Answers will be in essay form and authoritative quotations will be given a bigger score. During the exams books may not be consulted.</p>

<p>“Śrīla Prabhupāda wishes to begin this program at this year’s Mayapur meeting. He requests that you all send your opinions and comments here immediately so that everything may be prepared in time.”</p>

<p>Śrīla Prabhupāda endorsed it with his signature at the bottom and it was duly sent out.</p>

<p>An interesting letter arrived today from Dīna-dayal dāsa, a <em>brahmacārī</em> who has just opened a new center in Pireaus, the port of Athens, Greece. He related how Kṛṣṇa helped him as soon as he arrived in Athens. “The first day I arrived in Athens I went to a small guest house. The owner of the house, an elderly woman of about sixty, happily invited me in and gave me a room without question. Later she said that Lord Kṛṣṇa had sent me to her. I put some tilaka on her head and she brought a murti of Lord Visnu out and we offered some incense to Lord Visnu. A few days later I told her I was leaving and she said I could stay without charge if I wanted, and she invited me to come with her to her metaphysics group of about forty people. The teacher of the group asked me to speak and I told them about you, Lord Caitanya, and Lord Krnsa. Everyone chanted Hare Krnsa, Hare Krsna, Krsna Krsna, Hare Hare/ Hare Rama, Hare Rama, Rama Rama, Hare Hare, and they were interested in your books and Back to Godhead.”</p>

<p>Dīna-dayal also enclosed a Greek newspaper article describing his activities. He pointed out that it included Kṛṣṇa’s name four times, as well as Śrīla Prabhupāda’s. He was attracting guests by offering free English lessons, which he conducted using <em>Kṛṣṇa </em>book as the basic text. The article also mentioned a program of free food distribution for the poor.</p>

<p>Śrīla Prabhupāda was pleased to hear of Dīna-dayal’s pioneering activities and sent him letter, commending him and encouraging him further. “Lord Caitanya Mahaprabhu desires that in every city, town and village Krsna consciousness should be preached. Therefore I left Vrindavana to come to your country. And now you have left your country also on behalf of Sri Caitanya Mahaprabhu, therefore your life is glorious. May Krsna bless you that your preaching attempt becomes successful. As soon as a devotee endeavors to serve Krsna, Krsna immediately wants to help that devotee. Krsna will certainly protect and maintain you. You are an intelligent, sincere boy, so try to introduce this Movement to the people of Greece. Everyone in the world is suffering. Despite so many attempts on the part of the Governments and planning commissions of the world, still the suffering continues. People are thinking that by more education, hospitals, food and so many other things they will become happy. But we actually have the ingredient which alone can make them satisfied—Krsna consciousness. So please deliver Krsna to everyone you meet; instruct them in the philosophy of Bhagavad-gita As It Is. If it is possible to get our books translated into Greek that will be very helpful for your preaching. In the meantime as you are preaching to intelligent persons such as the lawyer you met, they will be able to read English, so you can give them our English books.”</p>

<p>Prabhupāda approved of his idea to introduce Kṛṣṇa consciousness through the medium of teaching English based on the <em>Kṛṣṇa</em> book, coupled with chanting and <em>prasādam</em> distribution. At the end of the letter Prabhupāda emphasized the actual requirement for successful preaching. “The important thing is that you behave nicely, chant all your rounds and follow strictly the regulative principles. Example is better than precept. These spiritual practices are our actual strength.”</p>

<p>Akṣayānanda Swami sent some information about his recent preaching in Kanpur, where the Vṛndāvana devotees held a series of <em>paṇḍāl</em> programs. He reported good attendance and publicity. Their presence had also inspired some local men to help us acquire land for a center. “I beg to inform you,” he wrote, “that Sri R.N. Bhargava, of Nath Opticians, 18/53, The Mall, Kanpur, our Life Patron Member, is offering us fifteen acres of land in Kanpur at a place called Katri Corner.”</p>

<p>He gave a detailed description of the land and its location. Although the site is a little remote and undeveloped, it was offered for ISKCON’s unconditional usage. He also described another piece of land that might be available for lease near the Kailash Temple in Kanpur. However, the conditions on this property are not clear because of litigation between the brothers that own it. Finally, he reported that several devotees have arrived in Vṛndāvana from the West to help with the Deity cooking and <em>pūjārī</em> work at Krishna-Balaram Mandir.</p>

<p>In India it is not uncommon to receive gifts of land, but the intentions behind such offerings are not always completely genuine. Śrīla Prabhupāda appreciated Mr. Bhargava’s offer because there were no strings attached. “Regarding the land of Sri R. N. Bhargava,” he wrote, “since he is offering it to us for our unconditional use, why not take it? If there is possibility of developing the land, then we can take it.” Nevertheless he showed more interest in the centrally located property, even though it could only be leased. He wrote, “That land would be the most ideal for establishing our center in Kanpur.”</p>

<p>And as always, he expressed his concern about the land we already had. “I am glad to know that new men are coming to help with the activities in Vrndavana temple. The kitchen department should be very clean and things should not be wasted. This is the first consideration. Yesterday we have visited a very old and famous Ranganatha Temple here in Nellore. Everything is being managed very nicely, and there are very nice arrangements for those who come for darsana. Sosimilarly our temple in Vrndavana must be managed expertly that everyone who comes is given caranamrita and prasadam of the Deity.”</p>

<p class="verse">* * *</p>

<p>In the early evening Prabhupāda held <em>darśana</em> about half an hour for some guests. They wanted to know why no intelligent, well-educated Indians are coming forward to join ISKCON and why only the Westerners are taking it up when it isn’t even their culture.</p>

<p>Prabhupāda told them the Indians are too attached to family life, and he cited the example of M.K. Gandhi. This greatly surprised the guests, as Gandhi is generally revered throughout India as a great renunciate. How could he be an example of an attached person?</p>

<p>Prabhupāda skillfully broadened their perspective by explaining that Gandhi had been so attached to the concept of being Indian that he had to die before giving it up. He explained that this is the <em>gṛhamedhī</em> concept—identification with, and attachment to, one’s own body, the immediate expansions of the body, and the greater expansion, one’s nation. Whether the attachment is immediate or extended, the mentality of bodily identification is the same.</p>

<p>The guests nodded appreciatively as they began to perceive that only Kṛṣṇa consciousness can give real detachment. They could understand that it is not the property of India, but a universal principle that has nothing to do with nationality.</p>

<p>Prabhupāda went on to say that the one advantage Westerners have is that they are generally not as attached to their families as Indians. But lacking a positive alternative, they end up as hippies. “Now,” he said, “I am offering something positive, and so many men are coming.”</p>

<p class="verse">* * *</p>

<p>Prabhupāda continued his evening <em>paṇḍāl</em> lecture series from the Sixth Canto:</p>

<p><em>kecit kevalayā bhaktyā vasudeva-parāyaṇāḥ</em></p>

<p><em> aghaà dhunvanti kārtsnyena nīhāram iva bhāskaraḥ. </em>[SB 6.1.15]</p>

<p>“Only a rare person who has adopted complete, unalloyed devotional service to Kṛṣṇa can uproot the weeds of sinful actions with no possibility that they will revive. He can do this simply by discharging devotional service, just as the sun can immediately dissipate fog by its rays.”</p>

<p>He stressed that <em>kecit</em> means “somebody,” not just anybody. It does not refer to the <em>karmīs</em>, <em>jṣānis</em>, and yogis but to those situated on the platform of <em>anyābhilāṣitā-śūnyaà</em>, the mood of pure devotional service to Kṛṣṇa. He told the packed audience that they should begin devotional service in the recommended way, by hearing from an authorized source. This in turn will enable them to perform <em>kīrtana</em> and preach. And by hearing and speaking about the Supreme, Lord Kṛṣṇa can be conquered.</p>

<p>He ended his long lecture with the same message of encouragement that seems to characterize his Indian preaching tours. “Our miserable condition of life is due to our material attraction or <em>pāpa</em>, impious activities. Here it is confirmed <em>kevalayā bhaktyā, aghaà dhunvanti kārtsnyena</em>: totally you can kill all reaction of sinful activities. And a very good example is given here—<em>nīhāram iva bhāskaraḥ</em>. <em>Nīhāra</em> means fog. In the fog you cannot see what is there in your front. But as soon as there is sunrise, immediately fog is dissipated. If you come to Kṛṣṇa consciousness, the light is there. Therefore the darkness of life is dissipated.</p>

<p>“So this Movement is giving the chance to everyone. It doesn’t mean for any particular nation, particular country, or particular person. For everyone. Caitanya Mahāprabhu said, ‘All over the world, in every village and every town, this message will be spread,’ and that is being done now. So it is a great Movement. I request you all to join wholeheartedly. Thank you very much. Hare Kṛṣṇa.”</p>

<p>Each night there is an increasing number of gentlemen coming on stage to receive books from Prabhupāda. The devotees go out preaching during the day, and Prabhupāda’s presence has greatly enhanced the life membership enrollments. There is a great deal of enthusiasm on the part of the local people, so the future looks promising for preaching in Nellore.</p>', '', '1976-01-06', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


END $$;
