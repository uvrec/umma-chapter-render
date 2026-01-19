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


  -- January 17th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'January 17th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>After a walk in a nearby park, Śrīla Prabhupāda set off for Māyāpur at 7:30 a.m. With Prabhupāda, Madhudviṣa Swami, Tamal Krishna Goswami, and Jayapatāka Swami were in the lead car; Śrīdhara Swami, Harikeśa, Caitya-guru, who has come from Bombay to associate with Śrīla Prabhupāda, and I followed in another.</p>

<p>Two hours later and seven kilometers before the town of Ranaghāṭa our party stopped to take breakfast in a large grove of several hundred mango trees. The grove has become a regular resting point for Śrīla Prabhupāda whenever he goes to Māyāpur. Seated on a folded <em>chaddar</em> on the leaf-strewn grass, with the spreading arms of the huge trees forming a pleasant canopy above, Prabhupāda seemed completely at ease in the natural setting. We had brought various fruits, <em>baḍa</em>, fried cashew nuts, and sweets. The <em>sannyāsīs</em> sat in a row alongside His Divine Grace, while Caitya-guru and I served the <em>prasādam</em> out on leaf plates. After a relaxed half an hour, hands and mouths washed, we proceeded on to our destination, the birthplace of Śrī Caitanya Mahāprabhu.</p>

<p>A large gathering of ISKCON Māyāpur devotees, led by Bhavānanda and Sudāmā Mahārājas, were eagerly waiting to greet Śrīla Prabhupāda when we arrived around 11:00 a.m.</p>

<p>As we approached we saw that the construction of a beautiful and impressive gatehouse had been completed at the entrance to our property. The gatehouse is fifteen feet thick, with three archways. The center archway is wide and high enough for a truck to pass under, while the two side ones are for pedestrians. Above the archways sit five domes, the large central one capped with an ornate, brass spire reaching some fifty feet or so into the air. There are several small rooms in the domes on either side. The entire structure is attractively painted, the domes in saffron and maroon with yellow on the facing wall. Large footprints of Lord Caitanya adorned with a <em>tulasī</em> leaf sprig and surrounded by lotus flowers are emblazoned on the front, with the words SRI MAYAPUR CANDRODAYA MANDIR below them.</p>

<p>Prabhupāda got out of the car on the main front road. As everyone looked on in great delight, he stepped forward and cut a large ribbon, officially opening the gateway. The formal ceremony over, the metal gates were opened, and he happily walked through the arch and entered the temple compound, followed by a stream of devotees. He moved steadily along the road, past the original thatched hut where he first stayed when he got the land, past flower beds and crops, toward the main building.</p>

<p>All the while he was surrounded by a dancing, chanting party of about twenty or thirty young Bengali <em>brahmacārīs</em>, all Vaiṣṇavas, heads shaven and decorated with <em>tilaka</em>, loudly chanting Hare Kṛṣṇa. These are all privileged residents of Lord Caitanya’s holy <em>dhāma</em>, whose greatest joy in life is clearly the presence of the Lord’s pure devotee.</p>

<p>Entering the ground-floor temple room Prabhupāda greeted the beautiful brass forms of Śrī Śrī Rādhā-Mādhava. Śrī Śālagrāma-śīlā is also present, Māyāpur being one of the few ISKCON temples in which Śrīla Prabhupāda has so far sanctioned His worship.</p>

<p>After a lively <em>guru-pūjā</em> Prabhupāda gave a short talk, describing the benefits of life in the holy <em>dhāma</em>. “It was Bhaktivinoda Ṭhākura’s aspiration that the Europeans, Americans, and Indians all together dance jubilantly and chant ‘Gaura Hari.’ So this temple, Māyāpur Candrodaya temple, is meant for transcendental United Nations. What the United Nations has failed, that will be achieved here by the process recommended by Śrī Caitanya Mahāprabhu, <em>pṛthivīte āche yata nagarādi grāma/ sarvatra pracāra haibe mora nāma</em>. So you have come from all parts of the world and are living together in this temple.</p>

<p>“So train these small boys. I am very glad especially to see the small children from all other countries, and Indian, Bengalis, all together, forgetting their bodily consciousness. That is the greatest achievement in this movement, that everyone forgets the bodily conception of life. Nobody thinks themselves here as European, American, Indian, Hindu, Muslim, Christian. They forget all these designations, and simply they are ecstatic in chanting the Hare Kṛṣṇa <em>mantra</em>. So kindly what you have begun do not break it. Continue it very jubilantly. And Caitanya Mahāprabhu, the master of Māyāpur, He will be very much pleased upon you. And ultimately you will go back to home, back to Godhead. Thank you very much.”</p>

<p>To the loud cheers of the devotees he went upstairs to his rooms on the second floor.</p>

<p>Śrīla Prabhupāda is obviously extremely happy to be in Māyāpur. The entire project is well-managed and progressing wonderfully. Built to Prabhupāda’s own specifications, the central guest house building has good facilities. He especially likes the wide verandas encircling the three upper stories, giving the guest house a spacious, palatial effect. On each of the two upper floors there are eight rooms, each measuring twenty-two by fourteen feet and twelve feet in height, split into groups of four by a central stairway. Most are equipped with two ornate, wood-frame beds, a table, and a chair. At either end of the floor are large bathrooms with four shower stalls, toilets, and sinks.</p>

<p>Prabhupāda’s own quarters have two interconnected rooms, one for working and giving <em>darśana</em>, the other for sleeping. The rooms are very simply furnished. His sitting room has only a raised wooden <em>āsana</em> and a low desk, and the floors are covered with white-sheeted cotton mattresses and bolsters. In the bedroom there is an almirah, a small table with a very beautiful Deity of Lord Caitanya on it, and Śrīla Prabhupāda’s bed, exactly the same type as in the guest rooms. He also has the bathroom at the end of his floor reserved for his exclusive use.</p>

<p>Next door to Prabhupāda, Caitya-guru and me share the servant’s room. The first thing I did after setting up Śrīla Prabhupāda’s dictaphone was install the summoning bell, the lead of which is long enough to reach from his desk right to my bedside. Prabhupāda has only to push a button to instantly alert me when he needs something.</p>

<p>As we unpacked, Śrīla Prabhupāda chatted with the <em>sannyāsīs</em> for a few minutes. He expressed his satisfaction with the enthusiasm of the devotees, the beautiful grounds, and the spiritually vibrant atmosphere.</p>

<p>He glanced around his room. His eyes rested for a moment on an intricately carved, three-dimensional, wooden plaque on the far wall. It depicts Śrī Śrī Rādhā and Kṛṣṇa and was a gift from an admirer in Indonesia. On the wall beside him hung a large canvas oil painting depicting the Māyāpur foundation-stone-laying ceremony. It shows him sitting with some of his Godbrothers while disciples and admirers stand around. Above and behind him, dioramas of the Paṣca-tattva perched on a shelf. In such a perfect setting I was struck by how the simplicity and deep spirituality of his surroundings seem to perfectly compliment Śrīla Prabhupāda’s own transcendental nature.</p>

<p>Later, giving Prabhupāda his massage, I surveyed the beautiful gardens and the wide-open expanse of fields from the veranda’s vantage point. All around I could see rice fields in various stages of development: hues of emerald green maturing to yellow-gold. Clumps of <em>dāl</em>, strips of vegetables, nearly ripened wheat, and small green forests dotted the distant skyline. In the clear sky kingfishers flashed brilliant blue, green parrots flitted here and there in pairs, and cranes stalked the flooded paddies. It was a beautiful vision. Following the line of the road toward the Gaṅgā and Jalāṅgī Rivers were the <em>maṭhas</em>, temples established by the followers of Śrīla Bhaktisiddhānta Sarasvatī. Their spires and domes reach to the sky, sentinels and reminders of real progress in human life. The sweet melodious <em>kīrtana</em> of the Bengali devotees floated out from the temple below us, pervading the entire atmosphere.</p>

<p>In this environment Śrīla Prabhupāda is clearly more relaxed and happy than I have seen him so far, like someone who has returned home from afar. Māyāpur struck me as idyllic, and as I rubbed the mustard oil into his lotus feet, I suggested that it would be a fine place for his retirement. He mused for a moment and then replied, “Either Vṛndāvana or Māyāpur. No other place, that is for sure.”</p>

<p class="verse">* * *</p>

<p>Early in the evening Harikeśa came in to see Śrīla Prabhupāda, looking very glum. He admitted that he had left the almirah in Prabhupāda’s Calcutta room open. Śrīla Prabhupāda was very angry with him. He could not understand how he had been so careless.</p>

<p>Prabhupāda keeps many important items locked up in his rooms—in cupboards or almirahs—especially in main centers where he has permanent rooms like Bombay, Vṛndāvana, Calcutta, or Māyāpur. Because Harikeśa has been traveling with Prabhupāda for quite some time, Prabhupāda entrusts him with keeping records of the banking as well as other transactions, but he said that now this carelessness meant he cannot be trusted.</p>

<p>Harikeśa felt he should immediately ring Calcutta. But Prabhupāda made it clear: the only solution was for Harikeśa immediately to leave for Calcutta to personally lock up the almirah. That was the only way to be certain. Harikeśa immediately made the arrangements and left soon after.</p>

<p>Apart from this incident, the evening was very pleasant. Prabhupāda sat relaxed and happy in his room. Both doors were left open on either side of him, allowing a gentle breeze to flow through, while the sounds of an ecstatic <em>sundara-ārati kīrtana</em> led by Sudāmā Mahārāja reverberated in the night air.</p>

<p>There were no visitors. After a hot cup of milk from our own cows, Prabhupāda took rest at ten o’clock before starting his night’s translation work.</p>', '', '1976-01-17', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- January 18th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'January 18th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>First thing this morning Śrīla Prabhupāda went on a tour of all the buildings on our property. He inspected the entire grounds, beginning at the new <em>pukkur</em>, a small reservoir near the main gate dug out over the last year and now partially landscaped. He said fruit trees should be planted on the high banks surrounding it and a path made all around.</p>

<p>While walking Prabhupāda discussed accommodations for the devotees who would be visiting during the festival. Jayapatāka Mahārāja suggested building temporary grass cottages on the open land, but Prabhupāda objected. He said it was better to spend money on something permanent. He told Jayapatāka instead to build rooms along the entire length of the northern boundary wall and to have them ready for the festival—a whole new guest house building.</p>

<p>With the festival only six weeks away, Jayapatāka expressed doubts how it could be completed in time. Prabhupāda told him if they engage at least one hundred men it could be done. Then Bhavānanda Mahārāja raised the objection that there was no money. Prabhupāda told him that if that was the only problem, he would give him the money. But he said they must start immediately. Jayapatāka, however, was still apprehensive. He said there was a shortage of bricks. Nevertheless Prabhupāda pushed him to begin construction. He told them that they should do whatever they can, but the work must begin immediately.</p>

<p>Leaving the <em>pukkur </em>we hesitated to go down the steep incline of the embankment. Jayapatāka, however, had no problem running down, even in his wooden shoes. Śrīla Prabhupāda laughed. “Victorious flag—Jaya-patākā,” he called out, appreciating his disciple’s dexterity.</p>

<p>Walking south along the inner road Śrīla Prabhupāda inspected the boundary-wall rooms. Some were being used for living quarters, and some were being used for storage.</p>

<p>At the dispensary Prabhupāda said that he would give some herbal formulas for minor ailments. He also suggested that the devotees keep a stock of general medicines for curing common complaints without the need for a doctor.</p>

<p>At least five or six rooms were being used for weaving. Looking in at the looms, Prabhupāda revealed a little of his vision of a spiritual society in Māyāpur. He said, “Some envious persons might criticize, ‘Oh, this is temple and they are weaving. They are not worshiping?’ And yet others may accuse us as religionists—parasites. But in the <em>Bhagavad-gītā</em> Kṛṣṇa says <em>sva-karmaṇā tam abhyarcya siddhià vindati mānavaḥ</em>. Whatever a person knows, he can work in that way and get perfection, provided he is Kṛṣṇa conscious. Because they are preparing the cloth for the devotees and not for business, they are therefore serving Kṛṣṇa.”</p>

<p>Prabhupāda suggested that some of the rooms be turned into shops where cloth, books, <em>prasādam</em>, <em>mṛdaṅga</em> drums, and <em>karatālas</em> could be sold.</p>

<p>Then he turned back to inspect the <em>gurukula</em> on the northern side of the main gate. Prabhupāda was disturbed to see clay dioramas from last year’s festival now lying broken and neglected in some of the rooms. He wanted to know why other temples could keep their dolls for years, but ours have been destroyed within one year. When Jayapatāka Mahārāja offered “vandalism” as the excuse, Prabhupāda strongly criticized him for allowing vandals to come in. “You are so careful—that is the defect!” Prabhupāda told him sarcastically. “We have so many enemies, and you do not take care of it.” He repeated this several times as he continued his tour. With mild sarcasm he called his disciple “the most foolish person in the whole world” for not securing them properly.</p>

<p>Walking out the main gate and down to the far south-westerly corner of our property, Prabhupāda inspected the outside of the boundary wall. Its surface is being plastered and sculpted into a series of decorative panels. They will then be painted by our artists with advertisements for Prabhupāda’s books.</p>

<p>At the end of the wall we arrived at the new <em>prasādam</em> hall where our free-food program regularly serves free meals to many thousands of local people. At its side a large, metal turnstile has been specially installed. This is an invention borrowed from the New York subways, but new in these parts. Its purpose is to prevent the villagers from crushing in all at once when coming to take <em>prasādam</em>. The hall itself is big enough to hold 1,200 people at once. Prabhupāda was impressed. Looking at its cavernous interior and high, corrugated-iron ceiling, he laughingly said it resembled the Bombay railway station.</p>

<p>Nothing escaped his sharp eyes. Outside, he saw a broken-down three-wheeled vehicle. He wanted to know why it was occupying valuable space. Told that it was a donation from someone who had joined our <em>āśrama</em>, he quoted an old Bengali saying. “‘A blind cow given in charity to a <em>brāhmaṇa</em>.’ When something is useless—all right, charity!” He ordered it to be removed, right then and there, from our land. “We do not require such charity,” he said.</p>

<p>From there he inspected the kitchen area, a separate building with accommodations for householders on the upper floor. He was not pleased to see dirt on the steps. He said they looked as if they had not been cleaned “for three hundred years,” and he demanded to know why. When told the place was cleaned every night, he retorted, “What is the use of such cleaning, if it is dirty the next morning?”</p>

<p>One of the managers said it was difficult to get the devotees to clean in the early morning because they all wanted to complete their <em>japa</em>. Prabhupāda, however, said cleaning must come first, and the chanting of <em>japa</em> another time. He stressed that unless they are prepared to work, no one should be allowed to join us. “<em>Śrī-vigrahārādhana-nitya-nānā-śṛṅgāra-tan-mandira-mārjanādau</em>. This is all temple. This is not ordinary hotel, free hotel. If they cannot take care as temple, they must go away. Simply eating, sleeping, that’s all, not working. See that they do not make it a free hotel for eating and sleeping. Don’t allow this. It should be clean. Why in the evening? Every morning it should be cleaned and washed and mopped. They must give up <em>japa;</em> first of all clean. In the name of <em>japa</em> they are dozing, and everything is unclean. This nonsense should not be allowed. Ask them, ‘Stop <em>jap</em>-ing. First of all clean. Then make <em>japa</em>.’</p>

<p>“Under a plea of <em>japa</em> they are simply dozing,” he said. “You should not give shelter to persons who, in the name of so-called <em>japa</em>, take advantage of free board and lodging. You should be very careful. Everyone should be, according to his capacity, engaged to some work. Do not allow this stupidity.”</p>

<p>His inspection was thorough and penetrating, delving into every aspect of management, from the buildings to the crops. He was pleased to hear that the devotees are growing sugarcane and making <em>gur</em> from it. With good humor and practical intelligence he encouraged the devotees to continue working hard for Kṛṣṇa, for the development of both Māyāpur and their own spiritual lives.</p>

<p>On his return to the temple he greeted the Deities, received <em>guru-pūjā</em>, and circumambulated Śrī Śrī Rādhā-Mādhava three times before returning to his room.</p>

<p>Morning <em>prasādam</em> for the devotees was date juice and puffed rice, the main meal being served at 11:00 a.m. For his breakfast Prabhupāda took only a small amount of fruit and <em>baḍa</em>. Jayapatāka Mahārāja brought him the season’s first jug of date <em>rasa</em>, the clear sweet sap of the date palm. He drank a small amount from his cup, appearing to enjoy it.</p>

<p>Prabhupāda called for me at 9:30 a.m. to begin his massage. He wanted to have it early because the sun was shining on the veranda outside his room. Whenever possible and if not too hot, he enjoys having his massage while exposed to the health-giving rays of the sun. It was finished by 11:00 a.m., and after bathing, he sat on his <em>āsana</em> in his room. With his eyes closed he remained in an upright position for about forty-five minutes. Occasionally his lips moved as he silently chanted or said something. He appeared to be completely absorbed—I wondered, perhaps, in Goloka Vṛndāvana?</p>

<p>Māyāpur is definitely not the material world. There is a transcendental aspect, tangible even to a neophyte like me. After months of arduous travel on behalf of Lord Caitanya, Prabhupāda has come here to recuperate and relax. Always completely immersed in thoughts of Kṛṣṇa, who knows what he actually sees and hears?</p>

<p class="verse">* * *</p>

<p>A letter came from Sweden written by Dwarakeśa dāsa. In it he explained that he was a Hungarian who had escaped from Hungary several years ago, later becoming a devotee. Now the Hungarian government was allowing illegal emigrants back, although once returning, it would be difficult to get out again. He felt he should go back and attempt to deliver Kṛṣṇa consciousness to his countrymen. The devotees in Sweden already had contacts with a yoga club there, and he was enthusiastic to preach.</p>

<p>Prabhupāda encouraged him. After so many recent conversations and discussions on Communism it seemed like Kṛṣṇa responding to Śrīla Prabhupāda’s desire to spread Kṛṣṇa consciousness in the Communist countries. “If there is possibility to preach amongst the Communists,” he wrote, “you must do it immediately. The intelligent Communist people will very easily understand our philosophy. We can convince them on the basis of samah sarvesu bhutesu, a Krsna conscious person is equally disposed to every living entity. (Bg. 18.54)”</p>

<p>Prabhupāda explained that communism is no better than capitalism because both exploit the animals and other living beings. He told Dwarakeśa he should make the present imperfect idea of communism perfect by following the description of perfect communism given in the <em>Śrīmad-Bhāgavatam</em>. “It is stated that you feel for the poor animals as well as the human beings. Srimad-Bhagavatam instructs that even if there is a snake or a lizard in the house, it is the duty of the householder to see that they are also eating, not starving. So you have to begin your preaching with such broader idea of communism... .</p>

<p>“So far as coming out of Hungary once you enter, if you can preach, what is the need of coming out?”</p>

<p>Mahāàsa Swami wrote. He is having difficulty persuading the two sisters in Nellore to relax the conditions on the deed of gift of land.</p>

<p>Prabhupāda responded, “We are not at all interested to be dictated by them.” He told him that because we have already installed the foundation stone, “We do not wish to go back.” To this end he stated his willingness even to purchase the land and still allow the two ladies to carry on living in one portion of the building, as devotees. He was adamant, though, that we shall not concede to any special conditions.</p>

<p class="verse">* * *</p>

<p>In the early evening, just on dusk, a few of the senior devotees and myself were sitting with Prabhupāda in his room, conversing. From a distance and gradually drawing nearer, we heard the loud trumpeting of a conch shell accompanied by bell ringing and the chanting of <em>mantra</em>s. Bhavānanda Mahārāja laughed and told Prabhupāda it was Anantarāma Śāstri, an Indian devotee in his mid-twenties who joined us last year with three other <em>śāstrīs</em>. Unfortunately the others left, but he has stayed on. As his name implies, he is very knowledgeable in the scriptures and well-versed in the performance of various types of <em>pūjā</em>. He can also quote practically any Sanskrit verse from memory.</p>

<p>Bhavānanda explained that each evening as the sun goes down, he tours the building, floor by floor, with a bell, conch, and a large, clay incense burner, chanting various <em>mantra</em>s to keep away ghosts and other subtle beings.</p>

<p>The sound grew louder and Prabhupāda smiled in welcome as Śāstri entered his room in a cloud of frankincense, the reverberations of the conch temporarily drowning out our conversation. It was an impressive ritual, made more so by Śāstri’s ability to both blow air through his mouth and suck it in through his nose at the same time, thus keeping the conch blowing uninterruptedly for several minutes. He walked around both rooms, waving a bamboo fan over his clay bowl to disperse the fragrant smoke. It also acts as an effective mosquito repellent. After a couple of minutes he respectfully backed out the door and continued his nightly round.</p>

<p>The <em>pūjā</em> triggered Prabhupāda’s remembrance of his time in Allahabad in 1945. He told us he was paying only two hundred rupees for a whole house then. But the place was famous as a ghostly haunted house. Nobody would rent it, but Prabhupāda took it. “I don’t care for ghosts,” he said, smiling. “Actually there was a ghost, and all the servants, they were met. But I was chanting.”</p>

<p>Later Madhudviṣa Swami and I sat with Prabhupāda as he talked about how the British knew the art of ruling. By giving Indians control as supervisors they were able to rule a large, populous continent with only a few thousand men. In general the Indians appreciated them. But after innocent people were shot at an anti-British rally in Amritsar, Gandhi’s movement was able to gain momentum, and the British lost their respectability.</p>

<p>Speaking about governments in general, Prabhupāda said that even bad or demonic governments are allowed by Kṛṣṇa in order to punish people for sinful activity. He explained that Kṛṣṇa is behind everything. He emphasized this point by playing back to us on his dictaphone some of his latest translation work from the Seventh Canto, in which he was making the same point.</p>

<p>Madhudviṣa also asked a few managerial questions regarding ISKCON Fiji. Deoji Punja, who was instrumental in establishing ISKCON there, is chanting the <em>mahā-mantra</em> and following the regulative principles. He is channeling money from his supermarket and other shops into building a Kṛṣṇa temple, but meanwhile he is still selling meat and liquor in the stores. Madhudviṣa expressed uncertainty about whether to tell him to cease such sales or not.</p>

<p>Śrīla Prabhupāda said that he should be allowed to continue, and not forced to give it up. He quoted <em>Bhagavad-gītā</em> (18.48): “Every endeavor is covered by some sort of fault, just as fire is covered by smoke. Therefore one should not give up the work which is born of his nature, O son of Kuntī, even if such work is full of fault.” Prabhupāda expressed confidence that if he is chanting Hare Kṛṣṇa, these things will soon be properly adjusted.</p>', '', '1976-01-18', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- January 19th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'January 19th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Jayapatāka Mahārāja has been busy initiating the work on the new building for the northern boundary. As Prabhupāda walked down the road to nearby Hoola Ghat Jayapatāka reported that they could get up to 250,000 bricks within a month. So the work on the new building is to begin immediately.</p>

<p>Arriving at the <em>ghāṭa </em>Śrīla Prabhupāda made a quick inspection of our newly acquired boat. He went on board and carefully inspected the interior, as Sudāmā Mahārāja explained the setup. Prabhupāda was pleased and agreed to install the Deities of Śrī Śrī Gaura-Nitāi in a few days’ time when preparations are complete.</p>

<p>From there he visited the <em>gośālā</em>, where he inspected the cows and calves. Pippalai, a devotee from Mexico, is nicely managing everything.</p>

<p>Crossing the fields to return to the temple, Prabhupāda questioned Jayapatāka Mahārāja how each field is being utilized, stressing that every bit of land must be used. They discussed purchasing new land. Prabhupāda told him that about seventeen-hundred rupees per <em>bigha</em> (one third acre) is a reasonable price, not the four or five thousand that some farmers are demanding.</p>

<p class="verse">* * *</p>

<p>For breakfast Prabhupāda again had some of the season’s first produce, some sugarcane juice from our own fields. He is very happy to see our men using the land to grow foodstuff. The <em>dāl</em> we drink daily is home-grown, and the <em>capātīs</em> are made from our own wheat.</p>

<p class="verse">* * *</p>

<p>During the day Bhavānanda Mahārāja came in to ask for advice about how to deal with the married couples and children in the <em>āśrama</em>. The girls especially have become a problem because in the villages they are generally married by the time they reach puberty, but in our <em>āśrama</em> there are not enough young devotee men available. Prabhupāda said that the young girls in Māyāpur can be married to local men, and that we will give a dowry of five hundred rupees. These men can then be invited to live with us, but our <em>brahmacārīs</em> should be kept single.</p>

<p>Prabhupāda agreed with Bhavānanda that finding out suitable husbands for the single women is a problem throughout our ISKCON society. We are training boys to remain celibate <em>brahmacārīs</em>. Since women in Kali-yuga form the majority of the population, who, then, will marry them? Prabhupāda suggested that a man could have more than one wife. He laughed, “The idea is he is already spoiled, so he may as well take more!” However, he feels that public reaction would not be good, so it is doubtful whether this idea can ever be implemented.</p>

<p class="verse">* * *</p>

<p>As evening <em>ārati</em> went on downstairs Prabhupāda talked in his room with his Godbrother Dāmodara Mahārāja, Harikeśa, and a few other visitors about the difficulties of preaching. Dāmodara Mahārāja is a rather simple person, younger than Prabhupāda’s eighty years. He is reported to spend his time flitting from one Gaudiya Math to another without any particular preaching goal. He has a reputation for indulging in gossip and is apparently not taken very seriously by his Godbrothers. But Śrīla Prabhupāda treats him with respect.</p>

<p>Speaking sometimes in Bengali and sometimes English, they discussed how there are so many envious men who want to impede the spread of Kṛṣṇa consciousness. It is a fact that even Prabhupāda’s own Godbrothers display jealousy at his apparent sudden success. Especially here in Māyāpur, there have been many instances of obstacles being created to deliberately hinder the development of Śrī Māyāpur Candrodaya Mandir.</p>

<p>Prabhupāda showed no surprise, only perhaps some disappointment. Taking a philosophical perspective, he told us that the whole material world is full of jealousy, even in the higher planetary systems. For that reason Lord Caitanya has said one must be very humble. Jealousy will always be present, so one should learn to tolerate. He said that is the best way to deal with it.</p>

<p>Dāmodara Mahārāja recalled that even their spiritual master, Śrīla Bhaktisiddhānta Sarasvatī Prabhupāda, was also criticized.</p>

<p>“So if they can talk against Prabhupāda, then what to speak of me,” Prabhupāda told him. “I am nothing to Prabhupāda.”</p>

<p>Dāmodara Mahārāja tried to see the bright side. “That will happen to a preacher. Those who are really preaching, there will be something negative, something positive. There should be light and darkness, both things should be there. Otherwise how we can differentiate good from bad? There should be anti-party, otherwise how we can realize your glories? Maybe one day they will realize it.”</p>

<p>Śrīla Prabhupāda was humble, but frank. “Whether they realize it or not does not matter to me. Whatever my mission, I will continue. I am not going to wait for their realization. I shall continue service to my Gurudeva.”</p>

<p>“I mean to say, many of them have already realized it,” Dāmodara Mahārāja hastened to add. “Those who have realized, they have admitted that it is a noble service; it is a pleasure to us.”</p>

<p>“It is written clearly in <em>Caitanya-caritāmṛta</em>: <em>kṛṣṇa-śakti vinā nahe tāra pravartana</em>. Even if they have no common sense, what can be done?” Prabhupāda said.</p>

<p>Dāmodara Mahārāja agreed. “We have to admit this. That <em>kṛṣṇa-śakti</em> is there.”</p>

<p>Prabhupāda shrugged. “This is something new in the history of the world, and still they are jealous. What can you do? They are just finding faults. In Vṛndāvana Nṛsiàha-vallabha Gosvāmī came to me. He said, ‘So many people are jealous about you.’ I said, ‘First of all you create something like this, then you become jealous.’ They do not have that power.”</p>

<p>Dāmodara Mahārāja said that he had inquired from his Godbrothers, and their feelings were changing. They were becoming more favorable.</p>

<p>Prabhupāda responded evenly. “Whether they change their feelings or not does not matter to me. Sometimes I was amazed at their feelings.”</p>

<p>Prabhupāda felt the problems were due to a lack of understanding of proper Vaiṣṇava dealings. “What bothers me is their dictating mood. Why they should dictate? First of all let them become like me. Equality brings friendship. Whoever is older, he will dictate; and whoever is younger, he will respect the superior. This is the rule. Neither they are equal nor senior, then why they should dictate? Who is superior, he will dictate; and who is equal, he should live like friend; and who is junior, they should follow and obey. This is the Vaiṣṇava rule. Those who are neither equal nor higher, now they can dictate? That is a mistake. Either, first of all become higher then him, then dictate; or become equal with him, then you suggest. You are lower, and you want to dictate. What is this nonsense?”</p>

<p>One of the visitors explained that he had met a local political official who was suspicious and critical of our Society. The guest explained how he had tried to defend ISKCON. “Those who are born in luxury and comforts have left everything for the holy name. And Prabhupāda is the person who had preached this holy name in the Western world and convinced them about spiritual life. It is really a wonderful service. There is something to know and something to realize from this wonderful service... . Unfortunately,” he said, “the politician did not listen.”</p>

<p>In truth, there are many who ascribe Prabhupāda’s success in bringing so many Westerners to India as nothing more than a CIA plot.</p>

<p>The man’s observation pleased Prabhupāda. It is a fact. “All these boys and girls have come all the way from America. I did not bribe them to take up Kṛṣṇa consciousness and to come here. They have come on their own. People call us CIA. Being a devotee by giving up all intoxication, giving up all kinds of desires and smoking, by dancing and chanting in the street, yet they will have the investigation on CIA. What a less common sense these people have! They have not got any common sense.”</p>

<p>When the guests left, Prabhupāda relaxed in his room, reminiscing with Madhudviṣa Mahārāja and me about the years before he came to the West, telling us something of the sequence of the major events of his preaching life.</p>

<p>1950 — Left home</p>

<p>1952 — Lived in Jhansi</p>

<p>1955 — Went to Mathurā. Gave his Deity of Lord Caitanya to Keśava Mahārāja’s temple in Mathurā</p>

<p>1956 — Moved to Vṛndāvana</p>

<p>1958 — Wrote <em>Easy Journey to Other Planets</em></p>

<p>1959 — Took <em>sannyāsa</em></p>

<p>1960 — Started <em>Śrīmad-Bhāgavatam</em> translation</p>

<p>1962 — Finished and published Part I, <em>Bhāgavatam</em> First Canto</p>

<p>1963 — Finished and published Part II, <em>Bhāgavatam</em> First Canto</p>

<p>1964 — Finished and published Part III, <em>Bhāgavatam</em> First Canto</p>

<p>1965 — Left Calcutta for U.S.A.</p>

<p>These evening conversations are always sublime. Just being able to sit with Śrīla Prabhupāda and hear him speak is so remarkably satisfying, especially when he recalls his young childhood experiences, the British rule in India, and his efforts to spread Kṛṣṇa consciousness.</p>

<p>As it often does, the electricity went off and we lit the oil lamps, adding to the intimacy of the atmosphere. Sitting in the soft glow of the lanterns, his mood was gentle and at ease, as if he was with the best of friends. At such times, in such an air of informality, we try not to become so familiar lest we forget our position. Nevertheless Prabhupāda makes himself completely accessible, a genuine helper and guide in our struggle for transcendental life. I am realizing more and more that association with a pure devotee is really the essence of spiritual life.</p>', '', '1976-01-19', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


  -- January 20th, 1976
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_uk, transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk, translation_en, translation_uk,
    commentary_en, commentary_uk, event_date, is_published
  ) VALUES (
    v_chapter_id, E'January 20th, 1976',
    '', '', '', '',
    '', '', '', '',
    E'<p>Prabhupāda took his morning walk in the fields to the east of the building, examining the proposed site of the big future temple. Saurabha, our ISKCON architect, is drawing up plans for a structure at least 350 feet high.</p>

<p class="verse">* * *</p>

<p>Prabhupāda’s concern for the future development of his <em>gurukula</em> system is growing as more correspondence comes in from the West. The latest arrived from Jayatīrtha, explaining the difficulties they are facing in complying with government regulations in Dallas. Several proposals for the relocation of the school have been touted, but no definite decision has been made.</p>

<p>Śrīla Prabhupāda wrote him a long letter thoroughly outlining his desires for educating the Society’s children. He condemned modern educational systems, saying they meted the greatest violence upon the young by training them as sense gratifiers. He said that the <em>karmī</em> system was producing “cats and dog who feel quite at home in a society of sense gratification.” Therefore they could not appreciate the <em>gurukula</em> system based on <em>vairāgya vidyā</em>, knowledge based on renunciation.</p>

<p>He told him, “They will never accept that one must undergo austerities to break the influence of the modes of material nature upon the living entity in order that he may experience the transcendental bliss on the platform of pure goodness. Therefore they see our school as a threat and a cruel punishment to the children. Complying with the authorities’ requests would mean a gradual watering down of our standards,” he said, “until it becomes unrecognizable and useless.”</p>

<p>His solution was to send the young boys to the newly developing Vṛndāvana <em>gurukula</em>. “To live in Vrindavana and to grow up there is the greatest fortune. To spend even one fortnight in Mathura-mandala guarantees liberation.” He described Krishna-Balaram Mandir as “the finest in the world.” He said that by living there the boys will be able to follow all the practices of <em>brahmacārī</em> life and become very blissful. There are many other advantages also. That fact that living in India is much cheaper would ease the burden on the parents. “Therefore in all ways it is obvious that the best place to have this gurukula is in Vrindavana. This should be done before the US Government starts to cause a disturbance which will harm us, and before we have to waste large sums of money on a risky endeavor, which may turn out to be a complete failure.”</p>

<p class="verse">* * *</p>

<p>In the evening His Divine Grace told us more about his life before establishing ISKCON. He explained that when he began publishing <em>Back to Godhead</em> many people appreciated it, including his Godbrother Bon Mahārāja and others. One librarian friend asked him, “Why not write books? Paper is thrown away, but a book is kept.”</p>

<p>So in 1958 he wrote <em>Easy Journey to Other Planets</em>. Then In 1960 he began the First Canto of the <em>Śrīmad-Bhāgavatam</em>, publishing the first part in 1962. In 1963 came Part Two, and by the end of 1964 Part Three. Each printing was 1,100 copies, the cost donated by a wealthy business magnate.</p>

<p>In 1965 he came to Māyāpur to pay respects to his departed Guru Mahārāja. The next day he returned to Calcutta and sailed for the U.S.A. It took twenty seven days via the Suez Canal and the Straits of Gibraltar. For two days at sea Prabhupāda had severe chest pains and thought he might die at any time. Later in New York he became ill with the same complaint, and doctors told him that it was a heart attack. He understood this was the same as the trouble aboard ship, but at that time he did not know what it was. He said that in New York the chanting of the devotees had saved him.</p>

<p>Before leaving India, the American embassy in Delhi had bought nineteen copies of each volume of his <em>Śrīmad-Bhāgavatam</em> and given a standing order for all the future volumes. They then sent them to different universities and libraries in America. After Prabhupāda arrived in America he went to a library and offered his books, but they already had them. Then he went to a university in Philadelphia and it also had obtained them.</p>

<p>One teacher paid Prabhupāda’s fare from Butler, Pennsylvania to the main bus terminal in Philadelphia. Prabhupāda went from there to New York, where he rented a small room. At that time he had an idea to get a small temple, so he wrote to a rich man in Bombay asking him for money. The man agreed, but the government disallowed it, although Prabhupāda got special permission to collect funds from resident Indians. Then he went to the Salvation Army asking for help, but they refused.</p>

<p>He wrote to his Godbrother Tīrtha Mahārāja asking for men and <em>mṛdaṅga</em> drums, but he also refused to help. Prabhupāda had originally asked him for funds for going to the West and publishing his books, but Tīrtha refused. Instead, he had indirectly hinted that Prabhupāda should go as his representative. In this way Tīrtha Mahārāja would get the credit if the mission was successful. “I understood his mind,” Prabhupāda told us, “and carefully avoided him after that.”</p>

<p>While on board the ship the captain’s wife, who was a palmist, told Prabhupāda that if he survived his seventieth year he would live to be one hundred years old. Seeing us smile at this he added, “So, somehow or other the heart attacks were not fatal, so now let us see.”</p>

<p>Madhudviṣa Swami said that he had told Mr. Punja in Fiji that Prabhupāda was getting old and couldn’t travel there. Mr. Punja, who hadn’t heard about the prediction, replied, “Oh, don’t worry, Prabhupāda will live to be one hundred!” Madhudviṣa asked him how he knew. He said that he had given Prabhupāda’s birth details and signature, as well as a recording of his voice, to a fortune teller in Fiji who predicted Prabhupāda would live to be one hundred.</p>

<p>“So let us see,” Śrīla Prabhupāda repeated with a noncommittal grin.</p>

<p>He recalled going to a very prominent astrologer in Calcutta when he was a <em>gṛhastha</em> and asked what his future would be. The man laughed and said only, “Oh, this will be your last birth here!”</p>

<p>Prabhupāda also talked about the position of women in Indian society. Formerly a respectable woman would not be seen in public, but remained secluded, traveling only in sedan-chairs and closed carriages. Kṛṣṇa’s wives played tennis on the roofs of the palaces; and Advaitācārya’s wife, Sītā-devī, traveled in a veiled chair. Prabhupāda said that his own mother and his wife did the same. Only prostitutes would be seen publicly.</p>

<p>Formerly a woman’s status could be understood simply by her dress: a married woman kept her head covered, an unmarried woman under her father’s protection had an uncovered head, a widow wore a white <em>sārī</em> with no border, and a prostitute parted her hair on the side, not in the middle. In this way Vedic society was so nicely arranged that one could easily understand another’s status.</p>

<p>Śrīla Prabhupāda seems to know practically everything. No matter how seemingly ordinary the subject matter, he can always offer a completely spiritual perspective. He is like a cornucopia of knowledge, overflowing with truth and wisdom. The warmth and friendliness of his personality make each exchange a completely fulfilling experience. We are indeed extremely fortunate to have his association.</p>', '', '1976-01-20', true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;


END $$;
