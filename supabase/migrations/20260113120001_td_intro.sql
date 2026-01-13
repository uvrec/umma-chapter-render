-- ============================================
-- Transcendental Diary - Intro Chapters
-- ============================================

DO $$
DECLARE
  v_book_id uuid;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = 'td';

  IF v_book_id IS NULL THEN
    RAISE EXCEPTION 'Book "td" not found';
  END IF;


  INSERT INTO public.intro_chapters (book_id, slug, title_en, title_ua, content_en, content_ua, display_order)
  VALUES (v_book_id, 'dedication', E'Dedication', '', E'<p class="verse">Celebrating the 100th Anniversary of</p>

<p class="verse"><strong>His Divine Grace A.C. Bhaktivedanta Swami Prabhupāda</strong></p>

<p class="verse">Founder–<em>Ācārya</em> of the International Society for Krishna Consciousness</p>

<p class="verse"><strong>Śrīla Prabhupāda Centennial</strong></p>

<p class="verse">1896–1996</p>

<p class="verse"><strong>“</strong><em><strong>He built a house in which the whole world can live</strong></em><strong>.”</strong></p>

<p><br/>This book is humbly offered at the lotus feet of His Divine Grace Śrīla Prabhupāda, by whose mercy this dog has been made to dance. May he be pleased to be present within each and every page.</p>

<p>“What is not possible to achieve in thousands of lives can be achieved in one moment if there is an opportunity to meet a saintly person. It is therefore enjoined in Vedic literature that one should always try to associate with saintly persons and try to disassociate oneself from the common man, because by one word of a saintly person one can be liberated from material entanglement.” <em>Śrīmad-Bhāgavatam</em> 3:22:5, Purport.</p>', '', 1)
  ON CONFLICT (book_id, slug) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    content_en = EXCLUDED.content_en,
    display_order = EXCLUDED.display_order,
    updated_at = now();


  INSERT INTO public.intro_chapters (book_id, slug, title_en, title_ua, content_en, content_ua, display_order)
  VALUES (v_book_id, 'acknowledgments', E'Acknowledgments', '', E'<p>I wish to sincerely thank Śrīman Kṛṣṇa Candra dāsa and Śrīman Mathureśa dāsa and his wife Gaṅgāgatī dāsī for their selfless support for the reprinting of this volume. May Śrīla Prabhupāda bless them with his eternal devotional service.</p>

<p>I gladly recognize once again all those who supported the original production of this book:</p>

<p>There are so many devotees who have given me encouragement to write this book that it is not possible to mention them all here individually. However, it is with deep gratitude that I acknowledge the well-wishes of each and every one of them.</p>

<p>Many devotees stepped forward with practical help, both financial and service-wise. Some of them donated their hard-earned funds, some their labor and some provided materials and services at cost or at reduced rates. Accordingly, I want to give particular mention and thanks to the following persons and organizations, without whose help this project could not have been possible.</p>

<p>My sincere thanks go to Abhirām dāsa, Balabhadra dāsa, Bhagavat Āśraya dāsa, Bhaktivedanta Book Trust Australia Los Angeles and UK, Bhagavān dāsa, Bhakta Barrie Jennions, Brahma-tīrtha dāsa, Bhāva dāsa, Bhavānanda dāsa, Bṛghupati dāsa, Danavīra dāsa, Indulekhā dāsī, ISKCON North Sydney, Īśvara dāsa, Jaya Gopāla dāsa, Kārṣṇa dāsa, Mādrī dāsī (N.Z.), Madhusevita dāsa, Mahātmā dāsa (Australia), Māṇḍūkīṇī dāsī and Aravinda dāsa, Matsya Avatāra dāsa, Nareśvara dāsa, Param Brahma dāsa, Palace Press, Sākṣi Gopāla dāsa (Australia), Śyāmasundara dāsa, Tamal Krishna Goswami, Tīrtharāj dāsa, Trāṇa Kartā dāsa, and Viśvambhar Swami.</p>

<p>On the editing side, I can honestly say that without the enthusiasm of the following editors this book would not have made it to print. I am deeply indebted to Riktānanda dāsa and Sītā dāsī, who did the bulk of the work. Kuṇḍalī dāsa also provided willing work at short notice.</p>

<p>I am extremely grateful to Śrīkanta dāsa for an excellent job of copy editing and proofreading, and Grahila dāsa for providing a first-rate index. Jaya Balarāma dāsa did the Sanskrit editing and Kuśakratha dāsa the Sanskrit proof reading.</p>

<p>The beautiful design work is to the credit of Yamarāja dāsa, for the photo-pages layout, Sākśi Gopāla dāsa (UK), who very kindly did the front and back cover design, and Locan dāsa, who provided the art work for the end covers.</p>

<p>I also want to acknowledge the hard work of Āditya dāsī, who made the first typed version of my original handwritten diary in 1977, and Gopa-mātā dāsī, who put it all on computer disk.</p>

<p>Special mention and thanks go to the devotees at the Bhaktivedanta Archives—Parama Rūpa dāsa, Ekanātha dāsa, Raṇajit dāsa, and Dulāl Candra dāsa—who were ever willing to provide good advice and many valuable materials that were essential to make this presentation complete. Bhaktivedanta Archives also did the typesetting and layout.</p>

<p>Finally, my wife Śītala dāsī deserves an accolade for providing constant support and encouragement and many hundreds of hours of labor. She edited, typed, corrected, and advised without complaint, and is as much responsible for the successful completion of this book as I am.</p>

<p>I humbly apologize to anyone I have inadvertently omitted from these credits, and I ask them to please be satisfied with the result, which, I think, is worth far more than my few words of thanks.</p>', '', 2)
  ON CONFLICT (book_id, slug) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    content_en = EXCLUDED.content_en,
    display_order = EXCLUDED.display_order,
    updated_at = now();


  INSERT INTO public.intro_chapters (book_id, slug, title_en, title_ua, content_en, content_ua, display_order)
  VALUES (v_book_id, 'introduction', E'Introduction', '', E'<p>For a period of sixteen months, from late November, 1975 to the end of March, 1977, I had the great fortune to travel with His Divine Grace A.C. Bhaktivedanta Swami Prabhupāda as his personal servant.</p>

<p>Although the initial period of my tenure was to be only two or three days, by the grace of Lord Kṛṣṇa I immediately recognized the unique opportunity in my being able to personally associate with Śrīla Prabhupāda. Thus, on the first night, I purchased a blank notebook in which to keep a diary of my experience. I was thinking that ten or twenty years hence I would be able to read those notes and relish the brief time spent in his association. When my position in his entourage was more firmly fixed, I continued to update the diary on a daily basis.</p>

<p>At the same time, I was very aware that Prabhupāda’s words—especially his conversations on the daily morning walks and with his visitors—were being recorded on tape. I considered these to be another kind of diary.</p>

<p>This book, then, represents an expanded form of my personal written diary coupled with snippets and segments of the electronically recorded one. Added to this are selections of His Divine Grace’s correspondence.</p>

<p>This is one small attempt to bring to the attention of the world the greatness of Śrīla Prabhupāda, his person and his message. I have attempted to present an accurate and detailed historical record of the activities and pastimes of Śrīla Prabhupāda—Śrīla Prabhupāda <em>as he is</em>—during the latter part of his stay with us. It is then, a partial biography.</p>

<p>This should not be taken as the personal memoirs of a former servant, although certainly I have expressed some of the feelings and emotions I experienced at the time. Nor is it a retrospective analysis. It is a simple, factual account of times, places, and events, which I, as his personal servant, was in a unique position to observe.</p>

<p>My purpose in presenting this material is two-fold. Firstly, I wanted to glorify Śrīla Prabhupāda in whatever small and humble way I could. Such a brilliant figure has rarely been seen on the stage of human life, and I was keen that, before we are robbed by passing time of the clear memory and appreciation of his pure and transcendental nature, this material be made as widely available as possible. Secondly, I wanted to give the devotees of Lord Kṛṣṇa, in particular, the opportunity to associate with Śrīla Prabhupāda in the same intimate and daily way that I did. All scriptures emphatically declare the incalculable benefit of association with a saintly person, yet that opportunity is normally only available to a limited few. However, through the printed word, it can be expanded unlimitedly.</p>

<p>I readily admit to my limitations in making this presentation. I am neither a writer nor a devotee. The only qualification I can claim is to say that I was there. Somehow or other Kṛṣṇa gave me sufficient presence of mind to record the events, and thus, with whatever little humility I possess, I now present this material for the pleasure and edification of all devotees of Śrīla Prabhupāda, the future followers of His Divine Grace, historians, scholars, and the public at large.</p>

<p>The Bhaktivedanta Archives is gradually making the complete versions of all of Prabhupāda’s conversations, letters, and lectures available in both tape and book form. That being the case, one might question the need for the inclusion of extracts from these sources here. The answer is simple: within these pages the reader will find the circumstances surrounding particular events, and thus the words of Śrīla Prabhupāda will take on fresh and deeper relevance.</p>

<p>One may also question the inclusion of names and incidents that may be less than flattering to the individuals concerned. To this I should state my reasoning in doing so. It is certainly not my intention to cast anyone in an embarrassing light. Nevertheless, things did happen, which, due to our immaturity in devotional service or our lack of comprehension, created problems that only His Divine Grace could resolve. Great profit can be derived from understanding how Śrīla Prabhupāda dealt with difficult situations, how he corrected problems, and how he settled disputes between his spiritual children. For us, this was all part of the process of growing up in our spiritual lives, and to whatever degree we accepted Śrīla Prabhupāda’s advice, and sometimes chastisement, to that extent or more, we profited in our Kṛṣṇa consciousness.</p>

<p>We can take these incidents in the same spirit that Śrīla Prabhupāda himself did; he didn’t condemn anyone because of his or her sometimes negative behavior. Rather he worked to improve both the situation and the person involved, to the benefit of all. He was corrective and supportive in every situation, and these incidents should be viewed from that perspective.</p>

<p>I pray for the blessings of all the devotees and followers of Śrīla Prabhupāda and hope my humble attempt will serve to increase their appreciation and understanding of the personality and teachings of His Divine Grace.</p>

<p>As Śrīla Prabhupāda himself noted as we traveled on the overnight train from Allahabad to Calcutta in January, 1977, “History will mark this period, how the Kṛṣṇa consciousness movement changed the world.” He left a great legacy to the world, and this is one very small attempt to make it known.</p>

<p>Again, referring to the books written by himself, Śrīla Prabhupāda said that if a person reads “one verse, one line, one word,” his life will be changed.</p>

<p>I am confident that the same effect will be had by reading books written about him. And that is the purpose of Śrīla Prabhupāda’s appearance: to change our lives from the dull and mundane to the transcendental realm of spiritual enlightenment and unlimited happiness, where all difficulties and contradictions are automatically resolved in the light of their common relationship to Lord Śrī Kṛṣṇa, the cause of all causes, and the center of all existence.</p>

<p>Hari-śauri dāsa</p>

<p>Completed on the Holy Occasion of Śrī Gaura Pūrṇimā</p>

<p>March 18th, 1992, Vṛndāvana, India</p>', '', 3)
  ON CONFLICT (book_id, slug) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    content_en = EXCLUDED.content_en,
    display_order = EXCLUDED.display_order,
    updated_at = now();


  INSERT INTO public.intro_chapters (book_id, slug, title_en, title_ua, content_en, content_ua, display_order)
  VALUES (v_book_id, 'foreword', E'Foreword', '', E'<p>Dr. E. Burke Rochford, Jr.</p>

<p>Middlebury College, Vermont.</p>

<p>Author of <em>Hare Krishna In America</em> (Rutgers University Press)</p>

<p>In 1965 an elderly man from India came to the United States to fulfill a promise to his Spiritual Master to preach Krishna Consciousness in the West. Unbelievably, in a matter of only a few short years, he and his followers had built a worldwide religious movement of nearly 5000 initiated disciples and tens of thousands of followers and supporters. Moreover, many millions of books and other pieces of spiritual literature had been distributed in every corner of the globe. With success came controversy, however, as a well organized anti-cult movement sought to limit the influence of Hare Krishna. Charges of brainwashing provided the media and the general public with a quasi theory to account for the growth of “menacing cults” like Hare Krishna. Yet in uncritically accepting false claims about “mind control,” many never came to understand the social and cultural significance of new religious groups such as the International Society for Krishna Consciousness (ISKCON), more popularly known as Hare Krishna. Nor did most members of the public understand the legitimate appeals of ISKCON; the richness and authenticity of its spiritual tradition, its lifestyle of “simple living and high thinking”, and, perhaps most importantly, the charisma and spiritual potency of its founding leader, A.C. Bhaktivedanta Swami Śrīla Prabhupāda.</p>

<p>It has been almost fifteen years since the disappearance of Śrīla Prabhupāda in November, 1977. While much has happened to Prabhupāda’s disciples and his movement during this time his memory and inspiration live on forever. Most, of course, immediately think of the legacy represented by Prabhupāda’s translations and commentary on the Vedic literature, or his movement with communities of devotees located throughout the world. Yet there is another part of this legacy that lives on in the individual and collective memory of his disciples. In this first volume of Hari Śauri’s <em>Transcendental Diary</em> the reader comes to understand the man who has touched the hearts and minds of so many people around the world.</p>

<p>Some might point to good luck, others Krishna’s arrangement, but by whatever means, Hari Śauri found himself in the enviable position of serving as Prabhupāda’s personal assistant over a sixteen month period from November, 1975, until March of 1977. By way of Hari Śauri’s diary we gain a personal and detailed understanding of Prabhupāda the man, as well as the spiritual leader. Hari Śauri provides us with a window into the activities, thoughts, and concerns of Prabhupāda. In this volume we travel with Prabhupāda throughout India between November, 1975, and April, 1976. One comes away from this book with a personal connection to Prabhupāda, appreciating his love for Krishna as well as his many disciples. We witness Prabhupāda’s sadness as his young followers faced personal and spiritual problems; his never ending joy and delight as book distribution simply exploded in 1975 and 1976; and, the purpose of his chastisement for the occasional errant disciple, including the author.</p>

<p>Yet we learn more about this remarkable man and his ability to inspire his followers. We join Prabhupāda and his disciples on many morning walks. On these occasions, we see the intellectual as well as the spiritual side of Prabhupāda. He debates with his disciples often challenging the logic and theory of evolutionary science and the “rascal scientists.” We see Prabhupāda’s mastery of argument and his commitment to doing Krishna’s work no matter what the caliber of the opposition. It is clear, as well, that these debates with his disciples help sharpen their own philosophical understanding and preaching skills.</p>

<p>The value of this volume and the ones to follow can not be overstated. To the disciples of Prabhupāda, the accounts contained here are a spark bringing to light endless stories and emotions that only further their connection to the Spiritual Master. To those devotees who had no personal contact or association with Śrīla Prabhupāda, this book serves a particularly important purpose; it becomes the basis for “knowing” Prabhupāda in a more intimate way. It allows new disciples and aspiring disciples to connect with the purity and inspiration of Prabhupāda and the mission of Chaitanya Mahaprabhu. Through Prabhupāda’s example of full surrender to his own guru one also learns how to approach and serve the Spiritual Master. To the average reader with no direct involvement in Prabhu-pāda’s movement this book is also a source of inspiration. It is nothing short of miraculous that one man could inspire so many people throughout the world to become God conscious. We learn here how and why this has happened.</p>

<p>For scholars and students of religion the material presented represents a critically important historical record. Anyone seeking to understand Prabhupāda’s movement specifically, or the centrality of charismatic leadership to the development of religious movements, will want to consider this book. The use of a diary to record and present Prabhupāda’s life has helped assure that the material presented is richly detailed and an accurate reflection of unfolding events. Hari Śauri has given the reader a clear and rather straight forward presentation of events rather than engaging in historical reconstruction meant to serve partisan or theoretical interests. As such, it will be of great interest to historians and sociologists of religion who seek to understand the cultural and social significance of Prabhupāda and the broader Hare Krishna movement.</p>

<p>In 1976, I had the good fortune of seeing Prabhupāda during his final stay at ISKCON’s Los Angeles community. At the time I was new to my research and could only vaguely understand the significance of Prabhupāda as a man and spiritual leader. Over the years it has become clearer to me that Prabhupāda was and is the lifeline of the Hare Krishna movement. While no longer physically present, his example and teachings still inspire those who are touched by him and his movement. Hare Krishna.</p>', '', 4)
  ON CONFLICT (book_id, slug) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    content_en = EXCLUDED.content_en,
    display_order = EXCLUDED.display_order,
    updated_at = now();


  INSERT INTO public.intro_chapters (book_id, slug, title_en, title_ua, content_en, content_ua, display_order)
  VALUES (v_book_id, 'preface', E'Preface', '', E'<p>In late November of 1975 Śrīla Prabhupāda returned to Delhi after completing a tour of South and East Africa and Mauritius. He arrived via Bombay accompanied by only one personal servant, Harikeśa dāsa, and Ambarīṣa dāsa, great grandson of Henry Ford, the founder of Ford Motor Company. He was joined by Hansadūta dāsa, his Governing Body Commissioner (GBC) for northern Europe, who flew in from Germany to be his personal secretary for the month of December.</p>

<p>Prabhupāda’s intention was to spend a day or two at his ISKCON center in Bengali Market, while arrangements could be made to go to Kurukṣetra and then to spend some time at our temple in Vṛndāvana.</p>

<p class="verse">* * *</p>

<p>Location wise our ISKCON center in New Delhi was well placed. Bengali Market is a small commercial area just southeast of Connaught Circus in the heart of New Delhi. Within easy walking distance lay some of the most prestigious landmarks and properties of India’s chief city. Nearby Mandi House traffic roundabout was the distributor for most of the traffic in the area, forming the confluence of seven important arteries.</p>

<p>Many prestigious buildings were dotted about the area. There were the National Research Centre for Social Sciences, the National Museum of Natural History, the Nepali Embassy, the Japan Cultural and Information Center, the Soviet House of Culture, various <em>bhavāns </em>or meeting halls, and <em>kalā-kendras</em> or auditoriums for cultural programs of every description. Wide, tree lined roads with large houses set back in secluded gardens, and the homes of the very wealthy could be found within only a few minutes proximity.</p>

<p>A little farther away lay Curzon Street [now Kasturba Gandhi Marg]. Stretching away toward the famous India Gate, flowers and lush parks formed a wide, green expanse. There was not much evidence of the image popular in much of the West of a poverty-stricken India. It was the show piece area of the capital.</p>

<p>However, the building ISKCON New Delhi was renting didn’t match its surroundings. It was situated at 19 Todar Mal Lane, a short, less busy, residential street cut off at one end by the intersection of a railway line. Number nineteen was a slightly ramshackle building and the odd man out in the otherwise neatly terraced urban street. Single storied and squat, it was a rather uninviting place that looked like an afterthought of the builders to fill in a gap they really hadn’t planned to leave. A few plants heroically fought for life in a small and barren patch of dirt that passed for a front garden. If the word ‘temple’ implies something quite grand, then such an appellation for the tiny house was a misnomer. For any devotees visiting the home of the International Society for Krishna Consciousness in the capital city of India, this place came as a bit of a disappointment.</p>

<p>Nevertheless, it had the same kind of sacrosanctity of any ISKCON center in the world. The small number of devotees were hard at work, visiting and preaching to important men, making Life Members, and establishing a firm basis for the future growth of the Society. Devotional service was the only activity, and the Deities of Śrī Śrī Rādhā Pārtha-sarathī were the most important residents. In this respect it was a typical ISKCON temple, and thus it was a haven for spiritual life in a city rapidly divorcing itself from its traditional spiritual roots.</p>

<p>Opposite our temple, at the end of the road on the corner, there was Nathu’s Sweets and Restaurant; white-tiled, somewhat rundown, a little grubby, but accomodating. Across from this stood the Bengali Sweet Shop, selling <em>rasagullās, gulabjamuns</em> and every other traditional sweet delicacy imaginable. Fifty yards farther was a small traffic roundabout with a colorful variety of modest shops and vendors sweeping round its periphery. This connected to Tansen Marg which in turn led the short distance to Mandi House.</p>

<p>Śrīla Prabhupāda wasn’t actually staying in our temple. Due to the lack of amenities he, Harikeśa, and Hansadūta were occupying a small, four-room, second floor apartment at number 9.</p>

<p class="verse">* * *</p>

<p>On November 25th I had come in to Delhi from Vṛndāvana, only for the day, on some unexpected personal business. I had been a resident at our Krishna-Balarāma temple and guest-house complex since August, serving as the temple commander. Along with several others I was mid-way through a major cleaning of the temple in preparation for Śrīla Prabhupāda’s visit. However, I was pressed by Gopāla Kṛṣṇa dāsa, the local GBC, to stay on in Delhi to help clean Śrīla Prabhupāda’s quarters and to guard his door for the few days he was scheduled to be there.</p>

<p>ISKCON Delhi had a manpower shortage. There was only a handful of devotees: Temple President Tejīyas dāsa and his wife, Madirā, both Americans; Oàkāra dāsa, the French <em>pūjārī,</em> and his wife, Nirmalā, and their young daughter and son; an English <em>brahmacārī,</em> Tribuvanātha dāsa; and one Indian devotee. Gopāla Kṛṣṇa therefore decided that some extra help was needed. Although I was eager to get back to help with the preparations for Śrīla Prabhupāda’s arrival in Vṛndāvana, I was more than happy to take advantage of the sudden and unsought opportunity to do some service for His Divine Grace.</p>

<p class="verse">* * *</p>

<p>At 4:00 p.m. I eagerly reported to Śrīla Prabhupāda’s apartment for his afternoon <em>darśana.</em> I sat at the door and listened attentively as Prabhupāda played host to a small gathering of devotees and guests. With so few present it was a rare opportunity for me to associate with Śrīla Prabhupāda in a setting far more intimate than possible during his visits to larger ISKCON centers. Sitting behind a small, low table in the main room, Śrīla Prabhupāda spoke animatedly on a variety of topics until about 7 p.m. To the visitors as they left, I handed freshly made sweets from the Bengali Sweet Shop.</p>

<p>Next morning, on November 26th, I cleaned Prabhupāda’s apartment while he took his usual walk. And on Gopāla Kṛṣṇa’s request I dutifully sat outside the door in the stairwell during the morning as a guard.</p>

<p>Meantime, Śrīla Prabhupāda and Harikeśa were discussing how to arrange for Prabhupāda’s regular massages. There was apparently noone available, although at least four former personal servants had been present in India when Śrīla Prabhupāda returned from his African tour. When he got back to India he had given <em>sannyāsa</em> to Navayogendra and Nanda Kumāra in Bombay and sent them with Brahmānanda Swami to help rectify some major problems in East Africa. The other two, Upendra and Nitāi dāsa, were also not available: Upendra, although in Delhi, was on his way overseas, and Nitāi had to get his visa renewed in Bombay.</p>

<p>This was all unknown to me. I was happy just to be in Delhi at the same time as Śrīla Prabhupāda. I could not know what Providence had in store for me.</p>', '', 5)
  ON CONFLICT (book_id, slug) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    content_en = EXCLUDED.content_en,
    display_order = EXCLUDED.display_order,
    updated_at = now();


END $$;
