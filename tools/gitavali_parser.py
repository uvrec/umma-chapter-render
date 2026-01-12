#!/usr/bin/env python3
"""
Parser for Gitavali book from kksongs.org
Extracts Bengali text, transliteration, translation, and purports.
"""

import json
import re
import time
import requests
from bs4 import BeautifulSoup
from html import unescape
from pathlib import Path

# Song data structure
GITAVALI_SONGS = [
    # Section 1: Arunodaya Kirtana (2 songs)
    {"section": 1, "section_title": "Arunodaya Kirtana", "section_title_en": "Songs of the Early Morning",
     "song": 1, "title": "Udilo Aruna",
     "url": "https://kksongs.org/songs/u/udiloaruna.html",
     "bengali_url": "https://kksongs.org/unicode/u/udiloaruna_beng.html"},
    {"section": 1, "section_title": "Arunodaya Kirtana", "section_title_en": "Songs of the Early Morning",
     "song": 2, "title": "Jiv Jago",
     "url": "https://kksongs.org/songs/j/jivjago.html",
     "bengali_url": "https://kksongs.org/unicode/j/jivjago_beng.html"},

    # Section 2: Arati Kirtana (4 songs)
    {"section": 2, "section_title": "Arati Kirtana", "section_title_en": "Songs for Arati",
     "song": 1, "title": "Bhale Gaura Gadadharer",
     "url": "https://kksongs.org/songs/b/bhalegauragadadharer.html",
     "bengali_url": "https://kksongs.org/unicode/b/bhalegauragadadharer_beng.html"},
    {"section": 2, "section_title": "Arati Kirtana", "section_title_en": "Songs for Arati",
     "song": 2, "title": "Jaya Jaya Gora Cander",
     "url": "https://kksongs.org/songs/j/jayajayagoracander.html",
     "bengali_url": "https://kksongs.org/unicode/j/jayajayagoracander_beng.html"},
    {"section": 2, "section_title": "Arati Kirtana", "section_title_en": "Songs for Arati",
     "song": 3, "title": "Jaya Jaya Radha Krsna",
     "url": "https://kksongs.org/songs/j/jayajayaradhakrsna.html",
     "bengali_url": "https://kksongs.org/unicode/j/jayajayaradhakrsna_beng.html"},
    {"section": 2, "section_title": "Arati Kirtana", "section_title_en": "Songs for Arati",
     "song": 4, "title": "Bhaja Bhakata",
     "url": "https://kksongs.org/songs/b/bhajabhakata.html",
     "bengali_url": "https://kksongs.org/unicode/b/bhajabhakata_beng.html"},

    # Section 3: Prasada Sevaya (6 songs)
    {"section": 3, "section_title": "Prasada Sevaya", "section_title_en": "Songs for Honoring Prasadam",
     "song": 1, "title": "Sarira Avidya Jal",
     "url": "https://kksongs.org/songs/s/sariraavidyajal.html",
     "bengali_url": "https://kksongs.org/unicode/s/sariraavidyajal_beng.html"},
    {"section": 3, "section_title": "Prasada Sevaya", "section_title_en": "Songs for Honoring Prasadam",
     "song": 2, "title": "Ek Din Santi Pure",
     "url": "https://kksongs.org/songs/e/ekdinsantipure.html",
     "bengali_url": "https://kksongs.org/unicode/e/ekdinsantipure_beng.html"},
    {"section": 3, "section_title": "Prasada Sevaya", "section_title_en": "Songs for Honoring Prasadam",
     "song": 3, "title": "Sacira Anga Nekabhu",
     "url": "https://kksongs.org/songs/s/saciraanganekabhu.html",
     "bengali_url": "https://kksongs.org/unicode/s/saciraanganekabhu_beng.html"},
    {"section": 3, "section_title": "Prasada Sevaya", "section_title_en": "Songs for Honoring Prasadam",
     "song": 4, "title": "Sri Caitanya Nityananda Sri",
     "url": "https://kksongs.org/songs/s/sricaitanyanityanandasri.html",
     "bengali_url": "https://kksongs.org/unicode/s/sricaitanyanityanandasri_beng.html"},
    {"section": 3, "section_title": "Prasada Sevaya", "section_title_en": "Songs for Honoring Prasadam",
     "song": 5, "title": "Ek Din Nila Cale",
     "url": "https://kksongs.org/songs/e/ekdinnilacale.html",
     "bengali_url": "https://kksongs.org/unicode/e/ekdinnilacale_beng.html"},
    {"section": 3, "section_title": "Prasada Sevaya", "section_title_en": "Songs for Honoring Prasadam",
     "song": 6, "title": "Rama Krsna Go Carane",
     "url": "https://kksongs.org/songs/r/ramakrsnagocarane.html",
     "bengali_url": "https://kksongs.org/unicode/r/ramakrsnagocarane_beng.html"},

    # Section 4: Sri Nagara Kirtana (8 songs)
    {"section": 4, "section_title": "Sri Nagara Kirtana", "section_title_en": "Songs for Sankirtana in the Towns",
     "song": 1, "title": "Nadiya Godrume",
     "url": "https://kksongs.org/songs/n/nadiyagodrume.html",
     "bengali_url": "https://kksongs.org/unicode/n/nadiyagodrume_beng.html"},
    {"section": 4, "section_title": "Sri Nagara Kirtana", "section_title_en": "Songs for Sankirtana in the Towns",
     "song": 2, "title": "Gay Gora Madhur",
     "url": "https://kksongs.org/songs/g/gaygoramadhur.html",
     "bengali_url": "https://kksongs.org/unicode/g/gaygoramadhur_beng.html"},
    {"section": 4, "section_title": "Sri Nagara Kirtana", "section_title_en": "Songs for Sankirtana in the Towns",
     "song": 3, "title": "Ek Bar Bhavo Mane",
     "url": "https://kksongs.org/songs/e/ekbarbhavomane.html",
     "bengali_url": "https://kksongs.org/unicode/e/ekbarbhavomane_beng.html"},
    {"section": 4, "section_title": "Sri Nagara Kirtana", "section_title_en": "Songs for Sankirtana in the Towns",
     "song": 4, "title": "Radha Krsna Bol",
     "url": "https://kksongs.org/songs/r/radhakrsnabol.html",
     "bengali_url": "https://kksongs.org/unicode/r/radhakrsnabol_beng.html"},
    {"section": 4, "section_title": "Sri Nagara Kirtana", "section_title_en": "Songs for Sankirtana in the Towns",
     "song": 5, "title": "Gay Gora Cand Jiver Tore",
     "url": "https://kksongs.org/songs/g/gaygoracandjivertore.html",
     "bengali_url": "https://kksongs.org/unicode/g/gaygoracandjivertore_beng.html"},
    {"section": 4, "section_title": "Sri Nagara Kirtana", "section_title_en": "Songs for Sankirtana in the Towns",
     "song": 6, "title": "Anga Up Anga Astra Parsada",
     "url": "https://kksongs.org/songs/a/angaupangaastraparsada.html",
     "bengali_url": "https://kksongs.org/unicode/a/angaupangaastraparsada_beng.html"},
    {"section": 4, "section_title": "Sri Nagara Kirtana", "section_title_en": "Songs for Sankirtana in the Towns",
     "song": 7, "title": "Hare Krsna Hare Nitai Iki Namene Che",
     "url": "https://kksongs.org/songs/h/harekrsnaharenitaikinameneche.html",
     "bengali_url": "https://kksongs.org/unicode/h/harekrsnaharenitaikinameneche_beng.html"},
    {"section": 4, "section_title": "Sri Nagara Kirtana", "section_title_en": "Songs for Sankirtana in the Towns",
     "song": 8, "title": "Hari Bolo Modera",
     "url": "https://kksongs.org/songs/h/haribolomodera.html",
     "bengali_url": "https://kksongs.org/unicode/h/haribolomodera_beng.html"},

    # Section 5: Sriman Mahaprabhur Sata Nama (4 songs)
    {"section": 5, "section_title": "Sriman Mahaprabhur Sata Nama", "section_title_en": "The Hundred Names of Sri Caitanya Mahaprabhu",
     "song": 1, "title": "Nadiya Nagare Nitai Nece Nece Gayre",
     "url": "https://kksongs.org/songs/n/nadiyanagarenitainecenecegayre.html",
     "bengali_url": "https://kksongs.org/unicode/n/nadiyanagarenitainecenecegayre_beng.html"},
    {"section": 5, "section_title": "Sriman Mahaprabhur Sata Nama", "section_title_en": "The Hundred Names of Sri Caitanya Mahaprabhu",
     "song": 2, "title": "Jaya Godruma Pati Gora",
     "url": "https://kksongs.org/songs/j/jayagodrumapatigora.html",
     "bengali_url": "https://kksongs.org/unicode/j/jayagodrumapatigora_beng.html"},
    {"section": 5, "section_title": "Sriman Mahaprabhur Sata Nama", "section_title_en": "The Hundred Names of Sri Caitanya Mahaprabhu",
     "song": 3, "title": "Kaliyuga Pavana",
     "url": "https://kksongs.org/songs/k/kaliyugapavana.html",
     "bengali_url": "https://kksongs.org/unicode/k/kaliyugapavana_beng.html"},
    {"section": 5, "section_title": "Sriman Mahaprabhur Sata Nama", "section_title_en": "The Hundred Names of Sri Caitanya Mahaprabhu",
     "song": 4, "title": "Krsna Caitanya Advaita Prabhu",
     "url": "https://kksongs.org/songs/k/krsnacaitanyaadvaitaprabhu.html",
     "bengali_url": "https://kksongs.org/unicode/k/krsnacaitanyaadvaitaprabhu_beng.html"},

    # Section 6: Sri Krsnaer Vimsottara Sata Nama (6 songs)
    {"section": 6, "section_title": "Sri Krsnaer Vimsottara Sata Nama", "section_title_en": "The Hundred-Twenty Names of Sri Krsna",
     "song": 1, "title": "Nagare Nagare Gora Gay",
     "url": "https://kksongs.org/songs/n/nagarenagaregoragay.html",
     "bengali_url": "https://kksongs.org/unicode/n/nagarenagaregoragay_beng.html"},
    {"section": 6, "section_title": "Sri Krsnaer Vimsottara Sata Nama", "section_title_en": "The Hundred-Twenty Names of Sri Krsna",
     "song": 2, "title": "Krsna Govinda Hare",
     "url": "https://kksongs.org/songs/k/krsnagovindahare.html",
     "bengali_url": "https://kksongs.org/unicode/k/krsnagovindahare_beng.html"},
    {"section": 6, "section_title": "Sri Krsnaer Vimsottara Sata Nama", "section_title_en": "The Hundred-Twenty Names of Sri Krsna",
     "song": 3, "title": "Radha Vallabha Madhava",
     "url": "https://kksongs.org/songs/r/radhavallabhamadhava.html",
     "bengali_url": "https://kksongs.org/unicode/r/radhavallabhamadhava_beng.html"},
    {"section": 6, "section_title": "Sri Krsnaer Vimsottara Sata Nama", "section_title_en": "The Hundred-Twenty Names of Sri Krsna",
     "song": 4, "title": "Jaya Radha Madhava",
     "url": "https://kksongs.org/songs/j/jayaradhamadhava.html",
     "bengali_url": "https://kksongs.org/unicode/j/jayaradhamadhava_beng.html"},
    {"section": 6, "section_title": "Sri Krsnaer Vimsottara Sata Nama", "section_title_en": "The Hundred-Twenty Names of Sri Krsna",
     "song": 5, "title": "Jaya Radha Vallabha Jaya",
     "url": "https://kksongs.org/songs/j/jayaradhavallabhajaya.html",
     "bengali_url": "https://kksongs.org/unicode/j/jayaradhavallabhajaya_beng.html"},
    {"section": 6, "section_title": "Sri Krsnaer Vimsottara Sata Nama", "section_title_en": "The Hundred-Twenty Names of Sri Krsna",
     "song": 6, "title": "Jaya Yasoda Nandana",
     "url": "https://kksongs.org/songs/j/jayayasodanandana.html",
     "bengali_url": "https://kksongs.org/unicode/j/jayayasodanandana_beng.html"},

    # Section 7: Sri Nama Kirtana (5 songs)
    {"section": 7, "section_title": "Sri Nama Kirtana", "section_title_en": "Songs Glorifying the Holy Name",
     "song": 1, "title": "Yasomati Nandana",
     "url": "https://kksongs.org/songs/y/yasomatinandana.html",
     "bengali_url": "https://kksongs.org/unicode/y/yasomatinandana_beng.html"},
    {"section": 7, "section_title": "Sri Nama Kirtana", "section_title_en": "Songs Glorifying the Holy Name",
     "song": 2, "title": "Doyal Nitai Caitanya",
     "url": "https://kksongs.org/songs/d/doyalnitaicaitanya.html",
     "bengali_url": "https://kksongs.org/unicode/d/doyalnitaicaitanya_beng.html"},
    {"section": 7, "section_title": "Sri Nama Kirtana", "section_title_en": "Songs Glorifying the Holy Name",
     "song": 3, "title": "Hari Bol Hari Bol Hari Bol Bhaire",
     "url": "https://kksongs.org/songs/h/hb_hb_hb_bhaire.html",
     "bengali_url": "https://kksongs.org/unicode/h/hb_hb_hb_bhaire_beng.html"},
    {"section": 7, "section_title": "Sri Nama Kirtana", "section_title_en": "Songs Glorifying the Holy Name",
     "song": 4, "title": "Bolo Hari Bolo",
     "url": "https://kksongs.org/songs/b/boloharibolo.html",
     "bengali_url": "https://kksongs.org/unicode/b/boloharibolo_beng.html"},
    {"section": 7, "section_title": "Sri Nama Kirtana", "section_title_en": "Songs Glorifying the Holy Name",
     "song": 5, "title": "Hare Hare Ye Nama Maha Krsna",
     "url": "https://kksongs.org/songs/h/hareharayenamahakrsna.html",
     "bengali_url": "https://kksongs.org/unicode/h/hareharayenamahakrsna_beng.html"},

    # Section 8: Sreyo Nirnaya (5 songs)
    {"section": 8, "section_title": "Sreyo Nirnaya", "section_title_en": "Ascertaining the Supreme Goal",
     "song": 1, "title": "Krsna Bhakti Vinak Abhunahi",
     "url": "https://kksongs.org/songs/k/krsnabhaktivinakabhunahi.html",
     "bengali_url": "https://kksongs.org/unicode/k/krsnabhaktivinakabhunahi_beng.html"},
    {"section": 8, "section_title": "Sreyo Nirnaya", "section_title_en": "Ascertaining the Supreme Goal",
     "song": 2, "title": "Arke No Maya Jale",
     "url": "https://kksongs.org/songs/a/arkenomayajale.html",
     "bengali_url": "https://kksongs.org/unicode/a/arkenomayajale_beng.html"},
    {"section": 8, "section_title": "Sreyo Nirnaya", "section_title_en": "Ascertaining the Supreme Goal",
     "song": 3, "title": "Pirati Saccidananda",
     "url": "https://kksongs.org/songs/p/pirtisaccidananda.html",
     "bengali_url": "https://kksongs.org/unicode/p/pirtisaccidananda_beng.html"},
    {"section": 8, "section_title": "Sreyo Nirnaya", "section_title_en": "Ascertaining the Supreme Goal",
     "song": 4, "title": "Nirakar Nirakar",
     "url": "https://kksongs.org/songs/n/nirakarnirakar.html",
     "bengali_url": "https://kksongs.org/unicode/n/nirakarnirakar_beng.html"},
    {"section": 8, "section_title": "Sreyo Nirnaya", "section_title_en": "Ascertaining the Supreme Goal",
     "song": 5, "title": "Keno Arko Rodvesa",
     "url": "https://kksongs.org/songs/k/kenoarkorodvesa.html",
     "bengali_url": "https://kksongs.org/unicode/k/kenoarkorodvesa_beng.html"},

    # Section 9: Bhajana Gita (2 songs)
    {"section": 9, "section_title": "Bhajana Gita", "section_title_en": "Songs of Worship",
     "song": 1, "title": "Bhajare Bhajare",
     "url": "https://kksongs.org/songs/b/bhajarebhajare.html",
     "bengali_url": "https://kksongs.org/unicode/b/bhajarebhajare_beng.html"},
    {"section": 9, "section_title": "Bhajana Gita", "section_title_en": "Songs of Worship",
     "song": 2, "title": "Bhavona Bhavona",
     "url": "https://kksongs.org/songs/b/bhavonabhavona.html",
     "bengali_url": "https://kksongs.org/unicode/b/bhavonabhavona_beng.html"},

    # Section 10: Prema Dhvani (1 song)
    {"section": 10, "section_title": "Prema Dhvani", "section_title_en": "Prayers of Love",
     "song": 1, "title": "Prem Se Kaho Sri Krsna",
     "url": "https://kksongs.org/songs/p/premsekahosrikrsna.html",
     "bengali_url": "https://kksongs.org/unicode/p/premsekahosrikrsna_beng.html"},

    # Section 11: Sri Namastaka (8 songs)
    {"section": 11, "section_title": "Sri Namastaka", "section_title_en": "Eight Prayers to the Holy Name",
     "song": 1, "title": "Sri Rupa Vadane Sri Saci",
     "url": "https://kksongs.org/songs/s/srirupavadanesrisaci.html",
     "bengali_url": "https://kksongs.org/unicode/s/srirupavadanesrisaci_beng.html"},
    {"section": 11, "section_title": "Sri Namastaka", "section_title_en": "Eight Prayers to the Holy Name",
     "song": 2, "title": "Jaya Jaya Hari Nam",
     "url": "https://kksongs.org/songs/j/jayajayaharinam.html",
     "bengali_url": "https://kksongs.org/unicode/j/jayajayaharinam_beng.html"},
    {"section": 11, "section_title": "Sri Namastaka", "section_title_en": "Eight Prayers to the Holy Name",
     "song": 3, "title": "Visva Udita Nama Tapan",
     "url": "https://kksongs.org/songs/v/visvauditanamatapan.html",
     "bengali_url": "https://kksongs.org/unicode/v/visvauditanamatapan_beng.html"},
    {"section": 11, "section_title": "Sri Namastaka", "section_title_en": "Eight Prayers to the Holy Name",
     "song": 4, "title": "Jnani Jnana Joge",
     "url": "https://kksongs.org/songs/j/jnanijnanajoge.html",
     "bengali_url": "https://kksongs.org/unicode/j/jnanijnanajoge_beng.html"},
    {"section": 11, "section_title": "Sri Namastaka", "section_title_en": "Eight Prayers to the Holy Name",
     "song": 5, "title": "Hari Nam Tu Wa Anek",
     "url": "https://kksongs.org/songs/h/harinamtuwaanek.html",
     "bengali_url": "https://kksongs.org/unicode/h/harinamtuwaanek_beng.html"},
    {"section": 11, "section_title": "Sri Namastaka", "section_title_en": "Eight Prayers to the Holy Name",
     "song": 6, "title": "Vacya O Vacaka",
     "url": "https://kksongs.org/songs/v/vacyaovacaka.html",
     "bengali_url": "https://kksongs.org/unicode/v/vacyaovacaka_beng.html"},
    {"section": 11, "section_title": "Sri Namastaka", "section_title_en": "Eight Prayers to the Holy Name",
     "song": 7, "title": "O He Hari Nam",
     "url": "https://kksongs.org/songs/o/oheharinama.html",
     "bengali_url": "https://kksongs.org/unicode/o/oheharinama_beng.html"},
    {"section": 11, "section_title": "Sri Namastaka", "section_title_en": "Eight Prayers to the Holy Name",
     "song": 8, "title": "Narada Muni",
     "url": "https://kksongs.org/songs/n/naradamuni.html",
     "bengali_url": "https://kksongs.org/unicode/n/naradamuni_beng.html"},

    # Section 12: Sri Radhikastaka (8 songs)
    {"section": 12, "section_title": "Sri Radhikastaka", "section_title_en": "Eight Prayers to Srimati Radharani",
     "song": 1, "title": "Radhika Carana Padma",
     "url": "https://kksongs.org/songs/r/radhikacaranapadma.html",
     "bengali_url": "https://kksongs.org/unicode/r/radhikacaranapadma_beng.html"},
    {"section": 12, "section_title": "Sri Radhikastaka", "section_title_en": "Eight Prayers to Srimati Radharani",
     "song": 2, "title": "Viraj Ar Pure Suddha",
     "url": "https://kksongs.org/songs/v/virajarpuresuddha.html",
     "bengali_url": "https://kksongs.org/unicode/v/virajarpuresuddha_beng.html"},
    {"section": 12, "section_title": "Sri Radhikastaka", "section_title_en": "Eight Prayers to Srimati Radharani",
     "song": 3, "title": "Ramani Siro Mani",
     "url": "https://kksongs.org/songs/r/ramanisiromani.html",
     "bengali_url": "https://kksongs.org/unicode/r/ramanisiromani_beng.html"},
    {"section": 12, "section_title": "Sri Radhikastaka", "section_title_en": "Eight Prayers to Srimati Radharani",
     "song": 4, "title": "Rasika Nagari Gana",
     "url": "https://kksongs.org/songs/r/rasikanagarigana.html",
     "bengali_url": "https://kksongs.org/unicode/r/rasikanagarigana_beng.html"},
    {"section": 12, "section_title": "Sri Radhikastaka", "section_title_en": "Eight Prayers to Srimati Radharani",
     "song": 5, "title": "Maha Bhava Cinta Mani",
     "url": "https://kksongs.org/songs/m/mahabhavacintamani.html",
     "bengali_url": "https://kksongs.org/unicode/m/mahabhavacintamani_beng.html"},
    {"section": 12, "section_title": "Sri Radhikastaka", "section_title_en": "Eight Prayers to Srimati Radharani",
     "song": 6, "title": "Baraja Vipine",
     "url": "https://kksongs.org/songs/b/barajavipine.html",
     "bengali_url": "https://kksongs.org/unicode/b/barajavipine_beng.html"},
    {"section": 12, "section_title": "Sri Radhikastaka", "section_title_en": "Eight Prayers to Srimati Radharani",
     "song": 7, "title": "Sata Koti Gopi Madhava",
     "url": "https://kksongs.org/songs/s/satakotigopimadhava.html",
     "bengali_url": "https://kksongs.org/unicode/s/satakotigopimadhava_beng.html"},
    {"section": 12, "section_title": "Sri Radhikastaka", "section_title_en": "Eight Prayers to Srimati Radharani",
     "song": 8, "title": "Radha Bhajane Jadi",
     "url": "https://kksongs.org/songs/r/radhabhajanejadi.html",
     "bengali_url": "https://kksongs.org/unicode/r/radhabhajanejadi_beng.html"},

    # Section 13: Parisista (1 song)
    {"section": 13, "section_title": "Parisista", "section_title_en": "Appendix",
     "song": 1, "title": "Bhojana Lalase",
     "url": "https://kksongs.org/songs/b/bhojanalalase.html",
     "bengali_url": "https://kksongs.org/unicode/b/bhojanalalase_beng.html"},

    # Section 14: Sri Siksastaka (8 songs, some with parts)
    {"section": 14, "section_title": "Sri Siksastaka", "section_title_en": "Eight Instructions",
     "song": 1, "title": "Pita Varna Kali Pavana",
     "url": "https://kksongs.org/songs/p/pitavaranakalipavana.html",
     "bengali_url": "https://kksongs.org/unicode/p/pitavaranakalipavana_beng.html"},
    {"section": 14, "section_title": "Sri Siksastaka", "section_title_en": "Eight Instructions",
     "song": 2, "title": "Tunh Doya Sagara",
     "url": "https://kksongs.org/songs/t/tunhudoyasagara.html",
     "bengali_url": "https://kksongs.org/unicode/t/tunhudoyasagara_beng.html"},
    {"section": 14, "section_title": "Sri Siksastaka", "section_title_en": "Eight Instructions",
     "song": 3, "title": "Sri Krsna Sankirtane",
     "url": "https://kksongs.org/songs/s/srikrsnasankirtane.html",
     "bengali_url": "https://kksongs.org/unicode/s/srikrsnasankirtane_beng.html"},
    {"section": 14, "section_title": "Sri Siksastaka", "section_title_en": "Eight Instructions",
     "song": 4, "title": "Prabhu Tava Padayuge",
     "url": "https://kksongs.org/songs/p/prabhutavapadayuge.html",
     "bengali_url": "https://kksongs.org/unicode/p/prabhutavapadayuge_beng.html"},
    {"section": 14, "section_title": "Sri Siksastaka", "section_title_en": "Eight Instructions",
     "song": 5, "title": "Anadi Karam Aphale",
     "url": "https://kksongs.org/songs/a/anadikaramaphale.html",
     "bengali_url": "https://kksongs.org/unicode/a/anadikaramaphale_beng.html"},
    {"section": 14, "section_title": "Sri Siksastaka", "section_title_en": "Eight Instructions",
     "song": 6, "title": "Aparadha Phale Mama",
     "url": "https://kksongs.org/songs/a/aparadhephalemama.html",
     "bengali_url": "https://kksongs.org/unicode/a/aparadhephalemama_beng.html"},
    {"section": 14, "section_title": "Sri Siksastaka", "section_title_en": "Eight Instructions",
     "song": 7, "title": "Gaite Gaite Nama Ki Dasa",
     "url": "https://kksongs.org/songs/g/gaitegaitenamakidasa.html",
     "bengali_url": "https://kksongs.org/unicode/g/gaitegaitenamakidasa_beng.html"},
    {"section": 14, "section_title": "Sri Siksastaka", "section_title_en": "Eight Instructions",
     "song": 8, "title": "Bandhu Gan Suno Ha",
     "url": "https://kksongs.org/songs/b/bandhugansunoha.html",
     "bengali_url": "https://kksongs.org/unicode/b/bandhugansunoha_beng.html"},

    # Section 15: Concluding Prema Dhvani (1 song)
    {"section": 15, "section_title": "Concluding Prema Dhvani", "section_title_en": "Concluding Prayers of Love",
     "song": 1, "title": "Yoga Pith Opari",
     "url": "https://kksongs.org/songs/y/yogapithopari.html",
     "bengali_url": "https://kksongs.org/unicode/y/yogapithopari_beng.html"},
]

# Ukrainian section titles
SECTION_TITLES_UA = {
    1: "Арунодая-кіртана (Ранкові пісні)",
    2: "Араті-кіртана (Пісні для Араті)",
    3: "Прасада-севайа (Пісні для прасаду)",
    4: "Шрі Наґара-кіртана (Пісні для санкіртани)",
    5: "Шріман Махапрабгур Шата Нама (Сто імен Шрі Чайтан'ї)",
    6: "Шрі Крішнаер Вімшоттара Шата Нама (Сто двадцять імен Шрі Крішни)",
    7: "Шрі Нама-кіртана (Пісні про Святе Ім'я)",
    8: "Шрейо Нірная (Визначення найвищої мети)",
    9: "Бгаджана-ґіта (Пісні поклоніння)",
    10: "Према-дгвані (Молитви любові)",
    11: "Шрі Намаштака (Вісім молитов до Святого Імені)",
    12: "Шрі Радгікаштака (Вісім молитов до Шріматі Радгарані)",
    13: "Парішішта (Додаток)",
    14: "Шрі Шікшаштака (Вісім настанов)",
    15: "Завершальні Према-дгвані (Завершальні молитви)"
}


def fetch_page(url: str) -> str | None:
    """Fetch page content."""
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (compatible; BookParser/1.0)'}
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        return response.text
    except Exception as e:
        print(f"  Error fetching {url}: {e}")
        return None


def preserve_line_breaks(soup):
    """Add newlines after block elements."""
    for br in soup.find_all('br'):
        br.replace_with('\n')
    for p in soup.find_all('p'):
        p.append('\n')
    return soup


def clean_verse_preserve_lines(text: str) -> str:
    """Clean whitespace while preserving line breaks."""
    # Remove Windows-1252 special chars
    text = text.replace('\x92', "'")
    # Remove UPDATED/UDPATED markers
    text = re.sub(r'(UPDATED|UDPATED):?[^\n]*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'www\.kksongs\.org.*$', '', text, flags=re.MULTILINE)
    text = re.sub(r'Krsna Kirtana Songs.*$', '', text, flags=re.MULTILINE)
    # Remove standalone dates
    text = re.sub(r'(January|February|March|April|May|June|July|August|September|October|November|December)\s*\d{1,2},?\s*\n?\s*\d{4}', '', text, flags=re.IGNORECASE)

    # Clean each line separately
    lines = []
    for line in text.split('\n'):
        cleaned = ' '.join(line.split())
        if cleaned:
            lines.append(cleaned)

    return '\n'.join(lines)


def parse_bengali_page(html: str) -> list[str]:
    """Extract Bengali verses from unicode page."""
    soup = BeautifulSoup(html, 'html.parser')
    preserve_line_breaks(soup)
    text = soup.get_text()

    # Split by verse numbers
    verse_pattern = re.compile(r'\(([১২৩৪৫৬৭৮৯০\d]+)\)')
    matches = list(verse_pattern.finditer(text))

    verses = []
    for i, match in enumerate(matches):
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        verse_text = text[start:end].strip()
        verse_text = clean_verse_preserve_lines(verse_text)

        if verse_text and any('\u0980' <= c <= '\u09FF' for c in verse_text):
            verses.append(verse_text)

    return verses


def parse_main_page(html: str) -> dict:
    """Extract transliteration and translation from main page."""
    soup = BeautifulSoup(html, 'html.parser')
    preserve_line_breaks(soup)

    result = {
        'transliteration': [],
        'translation': []
    }

    text = soup.get_text()
    lines = text.split('\n')

    current_section = None
    current_verse = []
    verse_num = 0

    transliteration_markers = ['LYRICS', 'TRANSLITERATION']
    translation_markers = ['TRANSLATION', 'MEANING']

    for line in lines:
        line_upper = line.strip().upper()

        if any(marker in line_upper for marker in transliteration_markers):
            current_section = 'transliteration'
            continue
        elif any(marker in line_upper for marker in translation_markers):
            if current_section == 'transliteration' and current_verse:
                result['transliteration'].append('\n'.join(current_verse))
                current_verse = []
            current_section = 'translation'
            continue
        elif 'WORD FOR WORD' in line_upper or 'SYNONYMS' in line_upper:
            if current_section and current_verse:
                result[current_section].append('\n'.join(current_verse))
                current_verse = []
            current_section = None
            continue

        # Check for verse number
        verse_match = re.match(r'^\s*\(?\s*(\d+)\s*\)?\s*$', line.strip())
        if verse_match and current_section:
            if current_verse:
                result[current_section].append('\n'.join(current_verse))
                current_verse = []
            verse_num = int(verse_match.group(1))
            continue

        # Add content
        if current_section and line.strip():
            cleaned = clean_verse_preserve_lines(line.strip())
            if cleaned:
                current_verse.append(cleaned)

    # Save last verse
    if current_section and current_verse:
        result[current_section].append('\n'.join(current_verse))

    return result


def parse_purport_page(html: str) -> str:
    """Extract purport from Prabhupada's commentary page."""
    soup = BeautifulSoup(html, 'html.parser')
    preserve_line_breaks(soup)

    # Find the main content
    content = soup.find('body')
    if not content:
        return ""

    text = content.get_text()
    lines = text.split('\n')

    purport_lines = []
    in_purport = False

    for line in lines:
        line_stripped = line.strip()
        if not line_stripped:
            continue

        # Skip navigation and header lines
        if any(skip in line_stripped.lower() for skip in ['home', 'encyclopedi', 'song encyclopedi', 'purport']):
            in_purport = True
            continue

        if in_purport and line_stripped:
            cleaned = clean_verse_preserve_lines(line_stripped)
            if cleaned:
                purport_lines.append(cleaned)

    if purport_lines:
        purport = '\n'.join(purport_lines)
        purport = clean_verse_preserve_lines(purport)
        return purport

    return ""


def parse_all_songs():
    """Parse all songs and create JSON."""
    print(f"Parsing {len(GITAVALI_SONGS)} songs from Gitavali...")

    sections = {}

    for i, song_info in enumerate(GITAVALI_SONGS):
        print(f"\n[{i+1}/{len(GITAVALI_SONGS)}] {song_info['title']}")

        section_num = song_info['section']
        if section_num not in sections:
            sections[section_num] = {
                "section_number": section_num,
                "title": song_info['section_title'],
                "title_en": song_info['section_title_en'],
                "title_ua": SECTION_TITLES_UA.get(section_num, ""),
                "songs": []
            }

        song_data = {
            "song_number": song_info['song'],
            "title_en": song_info['title'],
            "title_ua": "",
        }

        # Fetch Bengali text
        print(f"  Fetching Bengali...")
        bengali_html = fetch_page(song_info['bengali_url'])
        if bengali_html:
            bengali_verses = parse_bengali_page(bengali_html)
            song_data['bengali'] = bengali_verses
            print(f"    Found {len(bengali_verses)} Bengali verses")

        # Fetch main page
        print(f"  Fetching main page...")
        main_html = fetch_page(song_info['url'])
        if main_html:
            main_data = parse_main_page(main_html)
            song_data['transliteration'] = main_data['transliteration']
            song_data['translation'] = main_data['translation']
            print(f"    Found {len(main_data['transliteration'])} transliteration, {len(main_data['translation'])} translation")

        # Fetch purport if available
        if 'purport_url' in song_info:
            print(f"  Fetching purport...")
            purport_html = fetch_page(song_info['purport_url'])
            if purport_html:
                purport = parse_purport_page(purport_html)
                if purport:
                    song_data['purport_en'] = purport
                    print(f"    Found purport ({len(purport)} chars)")

        sections[section_num]['songs'].append(song_data)
        time.sleep(0.3)

    # Build final structure
    output = {
        "book_slug": "gitavali",
        "book_title_en": "Gitavali",
        "book_title_bn": "গীতাবলী",
        "book_title_ua": "Ґітавалі",
        "author_en": "Bhaktivinoda Thakura",
        "author_ua": "Бгактівінод Тхакур",
        "source": "https://kksongs.org/authors/literature/gitavali.html",
        "sections": [sections[i] for i in sorted(sections.keys())],
        "total_songs": len(GITAVALI_SONGS),
        "metadata": {
            "parsed_date": time.strftime("%Y-%m-%d"),
            "source_website": "kksongs.org"
        }
    }

    return output


def main():
    output_path = Path(__file__).parent.parent / "src" / "data" / "gitavali-parsed.json"

    data = parse_all_songs()

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n✓ Saved to {output_path}")
    print(f"  Total sections: {len(data['sections'])}")
    print(f"  Total songs: {data['total_songs']}")


if __name__ == "__main__":
    main()
