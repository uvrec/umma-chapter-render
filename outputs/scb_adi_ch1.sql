-- Chapter 1.1: Chapter 1 - Summary of Lord Gaura’s Pastimes
-- 181 verses

DO $$
DECLARE
    v_chapter_id UUID;
BEGIN
    -- Insert chapter
    INSERT INTO chapters (book_id, canto_id, chapter_number, title_en, title_uk, content_en, is_published)
    VALUES ('9d86c0da-d4b3-4fb6-bc39-bdb82e4098ec', '72f11deb-573b-4bc1-9974-2fa9ee669d07', 1, 'Chapter 1 - Summary of Lord Gaura’s Pastimes', '', '', true)
    ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
        title_en = EXCLUDED.title_en,
        content_en = EXCLUDED.content_en
    RETURNING id INTO v_chapter_id;
    
    -- Insert verses
    INSERT INTO verses (chapter_id, verse_number, sanskrit, transliteration_en, translation_en, commentary_en, sort_key, is_published)
    VALUES (v_chapter_id, '1', 'আজানু-লম্বিত-ভুজৌ কনকাবদাতৌ সঙ্কীর্তনৈক-পিতরৌ কমলাযতাক্ষৌ বিশ্বম্ভরৌ দ্বিজ-বরৌ যুগ-ধর্ম-পালৌ বন্দে জগত্ প্রিয-করৌ করুণাবতারৌ
॥ ১ ॥', 'ājānu-lambita-bhujau kanakāvadātau saṅkīrtanaika-pitarau kamalāyatākṣau viśvambharau dvija-varau yuga-dharma-pālau vande jagat priya-karau karuṇāvatārau', '(1) I offer my respectful obeisances unto Śrī Caitanya Mahāprabhu and Śrī Nityānanda Prabhu, whose arms extend down to Their knees, who have golden yellow complexions, and who inaugurated the congregational chanting of the holy names of the Lord. Their eyes resemble the petals of a lotus flower; They are the maintainers of the living entities, the best of the brāhmaṇas, the protectors of religious principles for this age, the benefactors of the universe, and the most merciful of all incarnations.', 'In this first verse of the maṅgalācaraṇa the forms of Śrī Gaura and Śrī Nityānanda are described. They have long arms that stretch to Their knees, Their complexions are like gold, and Their eyes are like the petals of the lotus flower. These two brothers have been described and adored as the inaugurators of the saṅkīrtana movement, the protectors of religious principles for this age, the maintainers of the living entities, the benefactors of the universe, the best of the brāhmaṇas, and the most merciful of all incarnations. Śrī Gaurahari and Śrī Nityānanda are the bestowers of the mahā-mantra, the spiritual masters of the universe, and the fathers of the pure chanting of the holy names. They are both benefactors of the universe, because They preach the principles of jīve dayā, compassion for all living entities. They are addressed as karuṇa and viśvambhara, merciful and the maintainers of the universe, because They have preached the religious principles for the age of Kali, in the form of serving Viṣṇu and the Vaiṣṇavas through the process of saṅkīrtana, which is the only means of deliverance for the people of this age. Everyone should follow the principles of such prayers by nāme ruci, having a taste for chanting the holy names, jīve dayā, showing compassion for other living entities, and vaiṣṇava-seva, serving the Vaiṣṇavas. By using dvi-

vacana [the verb form for two] rather than bahu-vacana [plural verb form] it is established that Their preaching, mercy, and protection of yuga-dharma is different from that found in seminal succession.

The arms of great personalities stretch to their knees, as indicated by the words ājānu-lambita-bhujau, whereas ordinary people’s arms are not like that. Śrī Gaura and Śrī Nityānanda are both viṣṇu-tattva who have appeared in this world. All the symptoms of great personalities were found in Their transcendental bodies. It is stated in the Caitanya- caritāmṛta (Ādi 3.42-44): “One who measures four cubits in height and in breadth by his own hand is celebrated as a great personality. Such a person is called nyagrodha-parimaṇḍala. Śrī Caitanya Mahāprabhu, who personifies all good qualities, has the body of a nyagrodha-parimaṇḍala. His arms are long enough to reach His knees, His eyes are just like lotus flowers, His nose is like a sesame flower, and His face is as beautiful as the moon.”

The phrase kanakāvadātau is explained as follows: Since They both perform pastimes in the mood of devotees, Their complexions are golden. They are the viṣaya-vigraha, or shelter of all devotees, They are the source of all spiritual beauty, and They attract all living entities. Lord Caitanya is the Supreme Personality of Godhead, and Lord Nityānanda is His personal manifestation. As stated in the Mahābhārata (Dāna-dharma,

Viṣṇu-sahasra-nāma-stotra, 149.92, 75 11: suvarṇa-varṇo hemāṅgo varāṅgaś candanāṅgadī—“In His early pastimes He appears as a householder with a golden complexion. His limbs are beautiful, and His body, smeared with the pulp of sandalwood, seems like molten gold.” The words saṅkīrtanaika-pitarau indicate that Śrī Gaura-Nityānanda are the inaugurators of the śrī-kṛṣṇa-saṅkīrtana movement. Śrīla Kavirāja Gosvāmī has written in the Caitanya-caritāmṛta (Ādi 3.76) as follows:

saṅkīrtana-pravartaka śrī-kṛṣṇa-caitanya saṅkīrtana-yajñe tāṅre bhaje, sei dhanya

“Lord Śrī Kṛṣṇa Caitanya is the initiator of saṅkīrtana [congregational

chanting of the holy name of the Lord]. One who worships Him through

saṅkīrtana is fortunate indeed.”

By using the dvi-vacana form of the word viśvambhara, both Viśvarūpa and Viśvambhara are indicated. Śrī Gaura and Śrī Nityānanda are both viṣṇu-tattva, and since They have distributed love of God to the world through the chanting of the holy names, They are known as Viśvambhara. Śrī Nityānanda and Śrī Viśvarūpa are one. Please refer to the Ādi-khaṇḍa (4.47-49) of this book. Śrīla Kavirāja Gosvāmī has written in the Caitanya-caritāmṛta (Ādi 3.32-33) as follows: “In His early pastimes He is known as Viśvambhara because He floods the world with the nectar of devotion and thus saves the living beings. The verbal root ḍubhṛñ [which is the root of the word “viśvambhara”] indicates nourishing and maintaining. He [Lord Caitanya] nourishes and maintains the three worlds by distributing love of God.”

A reference to the word viśvambhara is given in the Vedas (Atharva Veda, second khāṇḍa, third prapāṭhaka, fourth anuvāk, fifth mantra) as follows: viśvambhara viśvena mā bharasā pāhi svāhā—“Please preserve me by sustaining the universe, O Viśvambhara, upholder of the universe.” The word dvija generally refers to brāhmaṇas, kṣatriyas, and vaiśyas who have undergone the purificatory processes, but here the word dvija-varau refers to Lord Caitanya and Lord Nityānanda, who are dressed as brāhmaṇas and who have taken the role of ācāryas. Only brāhmaṇas are meant to take sannyāsa, because kṣatriyas and vaiśyas are not qualified.

So according to āśrama consideration, only brāhmaṇas are addressed as dvija-vara. Both Śrī Gaura and Śrī Nityānanda took the role of jagad- guru ācāryas and taught devotional service of the Lord to the people of this world, therefore They are the crest jewels amongst the brāhmaṇas. In this incarnation They did not consider Themselves cowherd boys and perform pastimes like rāsa-līlā with any cowherd damsels either in Gauḍa-deśa or in Orissa. If one wants to destroy the distinction between the mādhurya pastimes of Vṛndāvana and the audārya pastimes of Navadvīpa, then he will commit rasābhāsa and fall into hell due to the

offense of opposing the conclusions of the author [Vṛndāvana dāsa Ṭhākura] and Rāmānanda Rāya.

The word dvija-varau may alternatively refer to dvija-rajau, or two full moons that have simultaneously arisen.

The word yuga is explained as follows: A mahā-yuga consists of 4,320,000 earthly years. A kalpa, or day of Brahmā, consists of 1,000 mahā-yugas. In this day of Brahmā there are 14 Manus, each of whom rule for 71 such yugas. A 1/10th portion of a mahā-yuga is the duration of Kali-yuga, a 2/10ths portion of a mahā-yuga is the duration of Dvāpara- yuga, a 3/10ths portion of a mahā-yuga is the duration of Tretā-yuga, and a 4/10ths portion of a mahā-yuga is the duration of Satya-yuga.

Regarding yuga-dharma: The process of self-realization for Satya-yuga is meditation, for Tretā-yuga is sacrifice, for Dvāpara-yuga is Deity worship, and for Kali-yuga is congregational chanting of the holy names of the Lord. As stated in the Śrīmad Bhāgavatam (12.3.52):

kṛte yad dhyāyato viṣṇuṃ tretāyāṃ yajato makhaiḥ dvāpare paricaryāyāṃ kalau tad dhari-kīrtanāt

“Whatever result was obtained in Satya-yuga by meditating on Viṣṇu, in Tretā-yuga by performing sacrifices, and in Dvāpara-yuga by serving the Lord’s lotus feet can be obtained in Kali-yuga simply by chanting the Hare Kṛṣṇa mahā-mantra.” Elsewhere in the Śrīmad Bhāgavatam (12.3.51) it is stated:

kaler doṣa-nidhe rājann asti hy eko mahān guṇaḥ kīrtanād eva kṛṣṇasya mukta-saṅgaḥ paraṃ vrajet

“My dear King, although Kali-yuga is an ocean of faults, there is still one good quality about this age: Simply by chanting the Hare Kṛṣṇa mahā- mantra, one can become free from material bondage and be promoted to the transcendental kingdom.” The Śrīmad Bhāgavatam (11.5.36) further states:

kaliṃ sabhājayanty āryā guṇa jñāḥ sāra-bhāginaḥ

yatra saṅkīrtanenaiva sarva-svārtho ‘bhilabhyate

“Those who are actually advanced in knowledge are able to appreciate the essential value of this age of Kali. Such enlightened persons worship

Kali-yuga because in this fallen age all perfection of life can easily be achieved by the performance of saṅkīrtana.” And in the Viṣṇu Purāṇa (6.2.17) it is stated:

dhyāyan kṛte yajan yajñais tretāyāṃ dvāpare ‘rcayan yad āpnoti tad āpnoti kalau saṅkīrtya keśavam

“Whatever is achieved by meditation in Satya-yuga, by the performance of sacrifice in Tretā-yuga, and by the worship of Lord Kṛṣṇa’s lotus feet in Dvāpara-yuga is obtained in the age of Kali simply by glorifying the name of Lord Keśava.”

The phrase yuga-dharma-pālau is described as follows: According to the scriptures dealing with karma-kāṇḍa, or fruitive activities, the religious principle for the age of Kali is charity. But as the maintainers of yuga- dharma, the two most magnanimous Lords, Śrī Gaura and Śrī Nityānanda, have inaugurated the congregational chanting of the holy names of Kṛṣṇa. The Śrīmad Bhāgavatam (11.5.32 and 10.8.9) says:

kṛṣṇa-varṇaṃ tviṣākṛṣṇaṃ sāṅgopāṅgāstra-pārṣadam yajñaiḥ saṅkīrtana-prāyair yajanti hi su-medhasaḥ

“In the age of Kali, intelligent persons perform congregational chanting to worship the incarnation of Godhead who constantly sings the names of Kṛṣṇa. Although His complexion is not blackish, He is Kṛṣṇa Himself. He is accompanied by His associates, servants, weapons and confidential companions.”

āsan varṇās trayo hy asya gṛhṇato ‘nuyugaṃ tanūḥ śuklo raktas tathā pīta idānīṃ kṛṣ्णatāṃ gataḥ

“Your son Kṛṣṇa appears as an incarnation in every millennium. In the past, He assumed three different colors—white, red, and yellow—and

now He has appeared in a blackish color. [In another Dvāpara-yuga, He appeared (as Lord Rāmacandra) in the color of śuka, a parrot.] All such incarnations have now assembled in Kṛṣṇa.]”

Śrīla Rūpa Gosvāmī has offered his obeisances unto Śrī Kṛṣṇa Caitanyadeva as follows:

namo mahā-vadānyāya kṛṣṇa-prema-pradāya te kṛṣṇāya kṛṣṇa-caitanya- nāmne gaura-tviṣe namaḥ

“I offer my respectful obeisances unto the Supreme Lord Śrī Kṛṣṇa Caitanya, who is more magnanimous than any other avatāra, even Kṛṣṇa Himself, because He is bestowing freely what no one else has ever given

—pure love of Kṛṣṇa.” In other words, magnanimity is Śrī Caitanya Mahāprabhu’s characteristic and distributing love of Kṛṣṇa is His pastime. Śrīla Kavirāja Gosvāmī has stated in the Caitanya-caritāmṛta (Ādi 8.15): “śrī-kṛṣṇa-caitanya-dayā karaha vicāra vicāra karite citte pābe camatkāra

“If you are indeed interested in logic and argument, kindly apply it to the mercy of Śrī Caitanya Mahāprabhu. If you do so, you will find it to be strikingly wonderful.”

Śrīla Bhaktivinoda Ṭhākura has written about this mercy as follows: (dayāla) nitāi-caitanya bale’ ḍākre āmāra mana—“My dear mind, please chant the names of the most merciful Nitāi-Caitanya.” Actually the charity given by Śrī Gaura-Nityānanda is matchless, supreme, and unique. They are both maintainers of yuga-dharma, performers of śrī- kṛṣṇa-saṅkīrtana, and bestowers of unalloyed mercy.

The words jagat priya-karau indicate that Śrī Gaura-Nityānanda are the benefactors of the universe. Śrīla Kṛṣ्णadāsa Kavirāja Gosvāmī has written in the Caitanya-caritāmṛta (Ādi 1.86, 102) as follows:

sei dui jagatere haiyā sadaya gauḍa-deśe pūrva-śaile karilā udaya

ei candra sūrya dui parama sadaya jagatera bhāgye gauḍe karilā udaya

“These two have arisen over the eastern horizon of Gauḍa-deśa [West Bengal], being compassionate for the fallen state of the world. These two, the sun and moon, are very kind to the people of the world. Thus for the good fortune of all, They have appeared on the horizon of Bengal.” The Caitanya-carитāmrta (Ādi 1.2) further states:

vande śrī-kṛṣṇa-caitanya- nityānandau sahoditau gauḍodaye puṣpavantau citrau śan-dau tamo-nudau

“I offer my respectful obeisances unto Śrī Kṛṣṇa Caitanya and Lord Nityānanda, who are like the sun and moon. They have arisen simultaneously on the horizon of Gauḍa to dissipate the darkness of ignorance and thus wonderfully bestow benediction upon all.” Regarding karuṇāvatārau, the two merciful incarnations, Śrīla Rūpa

Gosvāmī has written about Lord Caitanya Mahāprabhu in the introduction to his Vidagdha-mādhava as follows: anarpita-carīṃ cirāt karuṇayāvatīrṇaḥ kalau—“He has appeared in the age of Kali by His causeless mercy to bestow what no incarnation ever offered before.” Śrīla Kavirāja Gosvāmī has written in the Caitanya-caritāmṛta (Ādi 5.207-208, 216): “Who in this world but Nityānanda could show His mercy to such an abominable person as me? Because He is intoxicated by ecstatic love and is an incarnation of mercy, He does not distinguish between the good and the bad. The mercy of Lord Nityānanda showed me Śrī Madana- mohana and gave me Śrī Madana-mohana as my Lord and master.”

Last Updated: 28 March, 2022
