#!/usr/bin/env python3
"""
Parser for Gitamala book from kksongs.org
Extracts Bengali text, transliteration, translation.

Structure: 5 sections, 80 songs total
"""

import json
import re
import time
import requests
from bs4 import BeautifulSoup
from pathlib import Path

# Gitamala song data structure
GITAMALA_SONGS = [
    # Section 1: Yamuna Bhavavali (27 songs)
    {"section": 1, "section_title": "Yamuna Bhavavali", "section_title_en": "Yamuna Bhavavali",
     "song": 1, "title": "Ohe Prabhu Doyamoy",
     "url": "https://kksongs.org/songs/o/oheprabhudoyamoy.html",
     "bengali_url": "https://kksongs.org/unicode/o/oheprabhudoyamoy_beng.html"},
    {"section": 1, "section_title": "Yamuna Bhavavali", "section_title_en": "Yamuna Bhavavali",
     "song": 2, "title": "Tomari Ksane Hoy",
     "url": "https://kksongs.org/songs/t/tomariksanehoy.html",
     "bengali_url": "https://kksongs.org/unicode/t/tomariksanehoy_beng.html"},
    {"section": 1, "section_title": "Yamuna Bhavavali", "section_title_en": "Yamuna Bhavavali",
     "song": 3, "title": "Para Tattva Vicaksana",
     "url": "https://kksongs.org/songs/p/paratattvavicaksana.html",
     "bengali_url": "https://kksongs.org/unicode/p/paratattvavicaksana_beng.html"},
    {"section": 1, "section_title": "Yamuna Bhavavali", "section_title_en": "Yamuna Bhavavali",
     "song": 4, "title": "Jagater Bastu Jata",
     "url": "https://kksongs.org/songs/j/jagaterbastujata.html",
     "bengali_url": "https://kksongs.org/unicode/j/jagaterbastujata_beng.html"},
    {"section": 1, "section_title": "Yamuna Bhavavali", "section_title_en": "Yamuna Bhavavali",
     "song": 5, "title": "Tumi Sarva Guna Juta",
     "url": "https://kksongs.org/songs/t/tumisarvagunajuta.html",
     "bengali_url": "https://kksongs.org/unicode/t/tumisarvagunajuta_beng.html"},
    {"section": 1, "section_title": "Yamuna Bhavavali", "section_title_en": "Yamuna Bhavavali",
     "song": 6, "title": "Tomar Gambhir Mana",
     "url": "https://kksongs.org/songs/t/tomargambhirmana.html",
     "bengali_url": "https://kksongs.org/unicode/t/tomargambhirmana_beng.html"},
    {"section": 1, "section_title": "Yamuna Bhavavali", "section_title_en": "Yamuna Bhavavali",
     "song": 7, "title": "Maya Baddha Jata Ksana",
     "url": "https://kksongs.org/songs/m/mayabaddhajataksana.html",
     "bengali_url": "https://kksongs.org/unicode/m/mayabaddhajataksana_beng.html"},
    {"section": 1, "section_title": "Yamuna Bhavavali", "section_title_en": "Yamuna Bhavavali",
     "song": 8, "title": "Dharma Nistha Nahi Mor",
     "url": "https://kksongs.org/songs/d/dharmanistanahimor.html",
     "bengali_url": "https://kksongs.org/unicode/d/dharmanistanahimor_beng.html"},
    {"section": 1, "section_title": "Yamuna Bhavavali", "section_title_en": "Yamuna Bhavavali",
     "song": 9, "title": "Heno Dusta Karma Nai",
     "url": "https://kksongs.org/songs/h/henodustakarmanai.html",
     "bengali_url": "https://kksongs.org/unicode/h/henodustakarmanai_beng.html"},
    {"section": 1, "section_title": "Yamuna Bhavavali", "section_title_en": "Yamuna Bhavavali",
     "song": 10, "title": "Nija Karma Dose Phale",
     "url": "https://kksongs.org/songs/n/nijakarmadosephale.html",
     "bengali_url": "https://kksongs.org/unicode/n/nijakarmadosephale_beng.html"},
    {"section": 1, "section_title": "Yamuna Bhavavali", "section_title_en": "Yamuna Bhavavali",
     "song": 11, "title": "Anya Asana Nahi Jar",
     "url": "https://kksongs.org/songs/a/anyaasanahijar.html",
     "bengali_url": "https://kksongs.org/unicode/a/anyaasanahijar_beng.html"},
    {"section": 1, "section_title": "Yamuna Bhavavali", "section_title_en": "Yamuna Bhavavali",
     "song": 12, "title": "Tava Pada Pankajini",
     "url": "https://kksongs.org/songs/t/tavapadapankajini.html",
     "bengali_url": "https://kksongs.org/unicode/t/tavapadapankajini_beng.html"},
    {"section": 1, "section_title": "Yamuna Bhavavali", "section_title_en": "Yamuna Bhavavali",
     "song": 13, "title": "Bhramita Samsara Bane",
     "url": "https://kksongs.org/songs/b/bhramitasamsarabane.html",
     "bengali_url": "https://kksongs.org/unicode/b/bhramitasamsarabane_beng.html"},
    {"section": 1, "section_title": "Yamuna Bhavavali", "section_title_en": "Yamuna Bhavavali",
     "song": 14, "title": "Tomar Carana Padma",
     "url": "https://kksongs.org/songs/t/tomarcaranapadma.html",
     "bengali_url": "https://kksongs.org/unicode/t/tomarcaranapadma_beng.html"},
    {"section": 1, "section_title": "Yamuna Bhavavali", "section_title_en": "Yamuna Bhavavali",
     "song": 15, "title": "Tab Hanghri Kamala",
     "url": "https://kksongs.org/songs/t/tabhanghrikamala.html",
     "bengali_url": "https://kksongs.org/unicode/t/tabhanghrikamala_beng.html"},
    {"section": 1, "section_title": "Yamuna Bhavavali", "section_title_en": "Yamuna Bhavavali",
     "song": 16, "title": "Ami Sei Dusta Mati",
     "url": "https://kksongs.org/songs/a/amiseidustamati.html",
     "bengali_url": "https://kksongs.org/unicode/a/amiseidustamati_beng.html"},
    {"section": 1, "section_title": "Yamuna Bhavavali", "section_title_en": "Yamuna Bhavavali",
     "song": 17, "title": "Ami Aparadhi Jana",
     "url": "https://kksongs.org/songs/a/amiaparadhijana.html",
     "bengali_url": "https://kksongs.org/unicode/a/amiaparadhijana_beng.html"},
    {"section": 1, "section_title": "Yamuna Bhavavali", "section_title_en": "Yamuna Bhavavali",
     "song": 18, "title": "Aviveka Rupa Ghana",
     "url": "https://kksongs.org/songs/a/avivekarupaghana.html",
     "bengali_url": "https://kksongs.org/unicode/a/avivekarupaghana_beng.html"},
    {"section": 1, "section_title": "Yamuna Bhavavali", "section_title_en": "Yamuna Bhavavali",
     "song": 19, "title": "Agre Ek Nivedana",
     "url": "https://kksongs.org/songs/a/agreeknivedana.html",
     "bengali_url": "https://kksongs.org/unicode/a/agreeknivedana_beng.html"},
    {"section": 1, "section_title": "Yamuna Bhavavali", "section_title_en": "Yamuna Bhavavali",
     "song": 20, "title": "Toma Chadi Ami Kabhu",
     "url": "https://kksongs.org/songs/t/tomachadiamikabhu.html",
     "bengali_url": "https://kksongs.org/unicode/t/tomachadiamikabhu_beng.html"},
    {"section": 1, "section_title": "Yamuna Bhavavali", "section_title_en": "Yamuna Bhavavali",
     "song": 21, "title": "Stri Purusa Deha Geha",
     "url": "https://kksongs.org/songs/s/stripurusadehageha.html",
     "bengali_url": "https://kksongs.org/unicode/s/stripurusadehageha_beng.html"},
    {"section": 1, "section_title": "Yamuna Bhavavali", "section_title_en": "Yamuna Bhavavali",
     "song": 22, "title": "Veda Vidhi Anusare",
     "url": "https://kksongs.org/songs/v/vedavidhianusare.html",
     "bengali_url": "https://kksongs.org/unicode/v/vedavidhianusare_beng.html"},
    {"section": 1, "section_title": "Yamuna Bhavavali", "section_title_en": "Yamuna Bhavavali",
     "song": 23, "title": "Tomar Je Suddha Bhakta",
     "url": "https://kksongs.org/songs/t/tomarjesuddhabhakta.html",
     "bengali_url": "https://kksongs.org/unicode/t/tomarjesuddhabhakta_beng.html"},
    {"section": 1, "section_title": "Yamuna Bhavavali", "section_title_en": "Yamuna Bhavavali",
     "song": 24, "title": "Suno He Madhu Mathana",
     "url": "https://kksongs.org/songs/s/sunohemadhumathana.html",
     "bengali_url": "https://kksongs.org/unicode/s/sunohemadhumathana_beng.html"},
    {"section": 1, "section_title": "Yamuna Bhavavali", "section_title_en": "Yamuna Bhavavali",
     "song": 25, "title": "Ami Nara Pasu Pray",
     "url": "https://kksongs.org/songs/a/aminarapasupray.html",
     "bengali_url": "https://kksongs.org/unicode/a/aminarapasupray_beng.html"},
    {"section": 1, "section_title": "Yamuna Bhavavali", "section_title_en": "Yamuna Bhavavali",
     "song": 26, "title": "Tumi Jagater Pita",
     "url": "https://kksongs.org/songs/t/tumijagaterpita.html",
     "bengali_url": "https://kksongs.org/unicode/t/tumijagaterpita_beng.html"},
    {"section": 1, "section_title": "Yamuna Bhavavali", "section_title_en": "Yamuna Bhavavali",
     "song": 27, "title": "Ami To Cancala Mati",
     "url": "https://kksongs.org/songs/a/amitocancalamati.html",
     "bengali_url": "https://kksongs.org/unicode/a/amitocancalamati_beng.html"},

    # Section 2: Karpanya Panjika (1 prayer with 46 verses)
    {"section": 2, "section_title": "Karpanya Panjika", "section_title_en": "Karpanya Panjika",
     "song": 1, "title": "Ami Ati Dina Mati",
     "url": "https://kksongs.org/songs/a/amiatidinamati.html",
     "bengali_url": "https://kksongs.org/unicode/a/amiatidinamati_beng.html"},

    # Section 3: Soka Satana (13 songs)
    {"section": 3, "section_title": "Soka Satana", "section_title_en": "Soka Satana",
     "song": 1, "title": "Pradosa Samaye",
     "url": "https://kksongs.org/songs/p/pradosasamaye.html",
     "bengali_url": "https://kksongs.org/unicode/p/pradosasamaye_beng.html"},
    {"section": 3, "section_title": "Soka Satana", "section_title_en": "Soka Satana",
     "song": 2, "title": "Pravesiya Antah Pure",
     "url": "https://kksongs.org/songs/p/pravesiyaantahpure.html",
     "bengali_url": "https://kksongs.org/unicode/p/pravesiyaantahpure_beng.html"},
    {"section": 3, "section_title": "Soka Satana", "section_title_en": "Soka Satana",
     "song": 3, "title": "Dhana Jana Deha Geha",
     "url": "https://kksongs.org/songs/d/dhanajanadehageha.html",
     "bengali_url": "https://kksongs.org/unicode/d/dhanajanadehageha_beng.html"},
    {"section": 3, "section_title": "Soka Satana", "section_title_en": "Soka Satana",
     "song": 4, "title": "Sabu Meli Balaka Bhaga",
     "url": "https://kksongs.org/songs/s/sabumelibalakabhaga.html",
     "bengali_url": "https://kksongs.org/unicode/s/sabumelibalakabhaga_beng.html"},
    {"section": 3, "section_title": "Soka Satana", "section_title_en": "Soka Satana",
     "song": 5, "title": "Srivasa Vacana Sravana",
     "url": "https://kksongs.org/songs/s/srivasavacanasravana.html",
     "bengali_url": "https://kksongs.org/unicode/s/srivasavacanasravana_beng.html"},
    {"section": 3, "section_title": "Soka Satana", "section_title_en": "Soka Satana",
     "song": 6, "title": "Prabhur Vacana Takha Suniya",
     "url": "https://kksongs.org/songs/p/prabhurvacanatakhasuniya.html",
     "bengali_url": "https://kksongs.org/unicode/p/prabhurvacanatakhasuniya_beng.html"},
    {"section": 3, "section_title": "Soka Satana", "section_title_en": "Soka Satana",
     "song": 7, "title": "Gora Candera Ajna Peye",
     "url": "https://kksongs.org/songs/g/goracanderajnapeye.html",
     "bengali_url": "https://kksongs.org/unicode/g/goracanderajnapeye_beng.html"},
    {"section": 3, "section_title": "Soka Satana", "section_title_en": "Soka Satana",
     "song": 8, "title": "Purna Cid Ananda Tumi",
     "url": "https://kksongs.org/songs/p/purnacidanandatumi.html",
     "bengali_url": "https://kksongs.org/unicode/p/purnacidanandatumi_beng.html"},
    {"section": 3, "section_title": "Soka Satana", "section_title_en": "Soka Satana",
     "song": 9, "title": "Bandhilo Maya Je Dina",
     "url": "https://kksongs.org/songs/b/bandhilomayajedina.html",
     "bengali_url": "https://kksongs.org/unicode/b/bandhilomayajedina_beng.html"},
    {"section": 3, "section_title": "Soka Satana", "section_title_en": "Soka Satana",
     "song": 10, "title": "Srivase Kohen Prabhu",
     "url": "https://kksongs.org/songs/s/srivasekohenprabhu.html",
     "bengali_url": "https://kksongs.org/unicode/s/srivasekohenprabhu_beng.html"},
    {"section": 3, "section_title": "Soka Satana", "section_title_en": "Soka Satana",
     "song": 11, "title": "Srivaser Prati Caitanya",
     "url": "https://kksongs.org/songs/s/srivaserpraticaitanya.html",
     "bengali_url": "https://kksongs.org/unicode/s/srivaserpraticaitanya_beng.html"},
    {"section": 3, "section_title": "Soka Satana", "section_title_en": "Soka Satana",
     "song": 12, "title": "Mrta Sisu Loye Tabe",
     "url": "https://kksongs.org/songs/m/mrtasisuloyetabe.html",
     "bengali_url": "https://kksongs.org/unicode/m/mrtasisuloyetabe_beng.html"},
    {"section": 3, "section_title": "Soka Satana", "section_title_en": "Soka Satana",
     "song": 13, "title": "Nadiya Nagare Gora",
     "url": "https://kksongs.org/songs/n/nadiyanagaregora.html",
     "bengali_url": "https://kksongs.org/unicode/n/nadiyanagaregora_beng.html"},

    # Section 4: Rupanuga Bhajana Darpana (29 songs)
    {"section": 4, "section_title": "Rupanuga Bhajana Darpana", "section_title_en": "Rupanuga Bhajana Darpana",
     "song": 1, "title": "Bahu Janma Bhagya",
     "url": "https://kksongs.org/songs/b/bahujanmabhagya.html",
     "bengali_url": "https://kksongs.org/unicode/b/bahujanmabhagya_beng.html"},
    {"section": 4, "section_title": "Rupanuga Bhajana Darpana", "section_title_en": "Rupanuga Bhajana Darpana",
     "song": 2, "title": "Bahu Janma Bhagya 2",
     "url": "https://kksongs.org/songs/b/bahujanmabhagya2.html",
     "bengali_url": "https://kksongs.org/unicode/b/bahujanmabhagya2_beng.html"},
    {"section": 4, "section_title": "Rupanuga Bhajana Darpana", "section_title_en": "Rupanuga Bhajana Darpana",
     "song": 3, "title": "Yoga Jaga Saba Char",
     "url": "https://kksongs.org/songs/y/yogajagasabachar.html",
     "bengali_url": "https://kksongs.org/unicode/y/yogajagasabachar_beng.html"},
    {"section": 4, "section_title": "Rupanuga Bhajana Darpana", "section_title_en": "Rupanuga Bhajana Darpana",
     "song": 4, "title": "Chari Anya Abhilasa",
     "url": "https://kksongs.org/songs/c/charianyaabhilasa.html",
     "bengali_url": "https://kksongs.org/unicode/c/charianyaabhilasa_beng.html"},
    {"section": 4, "section_title": "Rupanuga Bhajana Darpana", "section_title_en": "Rupanuga Bhajana Darpana",
     "song": 5, "title": "Sraddha Devi Nama Jar",
     "url": "https://kksongs.org/songs/s/sraddhadevinamajar.html",
     "bengali_url": "https://kksongs.org/unicode/s/sraddhadevinamajar_beng.html"},
    {"section": 4, "section_title": "Rupanuga Bhajana Darpana", "section_title_en": "Rupanuga Bhajana Darpana",
     "song": 6, "title": "Rupanuga Tattva Sara",
     "url": "https://kksongs.org/songs/r/rupanugatattvasara.html",
     "bengali_url": "https://kksongs.org/unicode/r/rupanugatattvasara_beng.html"},
    {"section": 4, "section_title": "Rupanuga Bhajana Darpana", "section_title_en": "Rupanuga Bhajana Darpana",
     "song": 7, "title": "Rasera Harajini Citta",
     "url": "https://kksongs.org/songs/r/raseraharajinicitta.html",
     "bengali_url": "https://kksongs.org/unicode/r/raseraharajinicitta_beng.html"},
    {"section": 4, "section_title": "Rupanuga Bhajana Darpana", "section_title_en": "Rupanuga Bhajana Darpana",
     "song": 8, "title": "Jei Rati Janme Jar",
     "url": "https://kksongs.org/songs/j/jeiratijanmejar.html",
     "bengali_url": "https://kksongs.org/unicode/j/jeiratijanmejar_beng.html"},
    {"section": 4, "section_title": "Rupanuga Bhajana Darpana", "section_title_en": "Rupanuga Bhajana Darpana",
     "song": 9, "title": "Madhurer Sthayi Bhava",
     "url": "https://kksongs.org/songs/m/madhurersthayibhava.html",
     "bengali_url": "https://kksongs.org/unicode/m/madhurersthayibhava_beng.html"},
    {"section": 4, "section_title": "Rupanuga Bhajana Darpana", "section_title_en": "Rupanuga Bhajana Darpana",
     "song": 10, "title": "Rati Prema Sneha Mana",
     "url": "https://kksongs.org/songs/r/ratipremasnehamana.html",
     "bengali_url": "https://kksongs.org/unicode/r/ratipremasnehamana_beng.html"},
    {"section": 4, "section_title": "Rupanuga Bhajana Darpana", "section_title_en": "Rupanuga Bhajana Darpana",
     "song": 11, "title": "Raty Asvada Heta Jata",
     "url": "https://kksongs.org/songs/r/ratyasvadahetajata.html",
     "bengali_url": "https://kksongs.org/unicode/r/ratyasvadahetajata_beng.html"},
    {"section": 4, "section_title": "Rupanuga Bhajana Darpana", "section_title_en": "Rupanuga Bhajana Darpana",
     "song": 12, "title": "Sri Nanda Nandana Dhana",
     "url": "https://kksongs.org/songs/s/srinandanandanadhana.html",
     "bengali_url": "https://kksongs.org/unicode/s/srinandanandanadhana_beng.html"},
    {"section": 4, "section_title": "Rupanuga Bhajana Darpana", "section_title_en": "Rupanuga Bhajana Darpana",
     "song": 13, "title": "Suramya Madhura Smita",
     "url": "https://kksongs.org/songs/s/suramyamadhurasmita.html",
     "bengali_url": "https://kksongs.org/unicode/s/suramyamadhurasmita_beng.html"},
    {"section": 4, "section_title": "Rupanuga Bhajana Darpana", "section_title_en": "Rupanuga Bhajana Darpana",
     "song": 14, "title": "Suramya Di Guna Gana",
     "url": "https://kksongs.org/songs/s/suramyadigunagana.html",
     "bengali_url": "https://kksongs.org/unicode/s/suramyadigunagana_beng.html"},
    {"section": 4, "section_title": "Rupanuga Bhajana Darpana", "section_title_en": "Rupanuga Bhajana Darpana",
     "song": 15, "title": "Sri Krsna Sevi Boboili",
     "url": "https://kksongs.org/songs/s/srikrsnaseviboboili.html",
     "bengali_url": "https://kksongs.org/unicode/s/srikrsnaseviboboili_beng.html"},
    {"section": 4, "section_title": "Rupanuga Bhajana Darpana", "section_title_en": "Rupanuga Bhajana Darpana",
     "song": 16, "title": "Nayikar Siromani Vraje Radha",
     "url": "https://kksongs.org/songs/n/nayikarsiromanivrajeradha.html",
     "bengali_url": "https://kksongs.org/unicode/n/nayikarsiromanivrajeradha_beng.html"},
    {"section": 4, "section_title": "Rupanuga Bhajana Darpana", "section_title_en": "Rupanuga Bhajana Darpana",
     "song": 17, "title": "Radha Krsna Guna Gana Mitha Sakhi",
     "url": "https://kksongs.org/songs/r/radhakrsnagunaganamithasakhi.html",
     "bengali_url": "https://kksongs.org/unicode/r/radhakrsnagunaganamithasakhi_beng.html"},
    {"section": 4, "section_title": "Rupanuga Bhajana Darpana", "section_title_en": "Rupanuga Bhajana Darpana",
     "song": 18, "title": "Panca Sakhi Madhye Cara",
     "url": "https://kksongs.org/songs/p/pancasakhimadhyecara.html",
     "bengali_url": "https://kksongs.org/unicode/p/pancasakhimadhyecara_beng.html"},
    {"section": 4, "section_title": "Rupanuga Bhajana Darpana", "section_title_en": "Rupanuga Bhajana Darpana",
     "song": 19, "title": "Parama Caitanya Hari",
     "url": "https://kksongs.org/songs/p/paramacaitanyahari.html",
     "bengali_url": "https://kksongs.org/unicode/p/paramacaitanyahari_beng.html"},
    {"section": 4, "section_title": "Rupanuga Bhajana Darpana", "section_title_en": "Rupanuga Bhajana Darpana",
     "song": 20, "title": "Krsna Krsna Bhakata Gata",
     "url": "https://kksongs.org/songs/k/krsnakrsnabhakatagata.html",
     "bengali_url": "https://kksongs.org/unicode/k/krsnakrsnabhakatagata_beng.html"},
    {"section": 4, "section_title": "Rupanuga Bhajana Darpana", "section_title_en": "Rupanuga Bhajana Darpana",
     "song": 21, "title": "Vibhavita Rati Jabe",
     "url": "https://kksongs.org/songs/v/vibhavitaratijabe.html",
     "bengali_url": "https://kksongs.org/unicode/v/vibhavitaratijabe_beng.html"},
    {"section": 4, "section_title": "Rupanuga Bhajana Darpana", "section_title_en": "Rupanuga Bhajana Darpana",
     "song": 22, "title": "Sthayi Bhava Vista Citta",
     "url": "https://kksongs.org/songs/s/sthayibhavavistacitta.html",
     "bengali_url": "https://kksongs.org/unicode/s/sthayibhavavistacitta_beng.html"},
    {"section": 4, "section_title": "Rupanuga Bhajana Darpana", "section_title_en": "Rupanuga Bhajana Darpana",
     "song": 23, "title": "Nirbeda Bisada Mada",
     "url": "https://kksongs.org/songs/n/nirbedabisadamada.html",
     "bengali_url": "https://kksongs.org/unicode/n/nirbedabisadamada_beng.html"},
    {"section": 4, "section_title": "Rupanuga Bhajana Darpana", "section_title_en": "Rupanuga Bhajana Darpana",
     "song": 24, "title": "Sadharani Samanjasa",
     "url": "https://kksongs.org/songs/s/sadharanisamanjasa.html",
     "bengali_url": "https://kksongs.org/unicode/s/sadharanisamanjasa_beng.html"},
    {"section": 4, "section_title": "Rupanuga Bhajana Darpana", "section_title_en": "Rupanuga Bhajana Darpana",
     "song": 25, "title": "Sri Ujjvala Rasa Sara",
     "url": "https://kksongs.org/songs/s/sriujjvalarasasar.html",
     "bengali_url": "https://kksongs.org/unicode/s/sriujjvalarasasar_beng.html"},
    {"section": 4, "section_title": "Rupanuga Bhajana Darpana", "section_title_en": "Rupanuga Bhajana Darpana",
     "song": 26, "title": "Darsana Aslesan Vita",
     "url": "https://kksongs.org/songs/d/darsanaaslesanvita.html",
     "bengali_url": "https://kksongs.org/unicode/d/darsanaaslesanvita_beng.html"},
    {"section": 4, "section_title": "Rupanuga Bhajana Darpana", "section_title_en": "Rupanuga Bhajana Darpana",
     "song": 27, "title": "Sandarsana Sa Sparsana",
     "url": "https://kksongs.org/songs/s/sandarsanasasparsana.html",
     "bengali_url": "https://kksongs.org/unicode/s/sandarsanasasparsana_beng.html"},
    {"section": 4, "section_title": "Rupanuga Bhajana Darpana", "section_title_en": "Rupanuga Bhajana Darpana",
     "song": 28, "title": "Rasa Tattva Nitya Jaiche",
     "url": "https://kksongs.org/songs/r/rasatattvanityajaiche.html",
     "bengali_url": "https://kksongs.org/unicode/r/rasatattvanityajaiche_beng.html"},
    {"section": 4, "section_title": "Rupanuga Bhajana Darpana", "section_title_en": "Rupanuga Bhajana Darpana",
     "song": 29, "title": "Krsnera Ja Teka Khela",
     "url": "https://kksongs.org/songs/k/krsnerjatekakhela.html",
     "bengali_url": "https://kksongs.org/unicode/k/krsnerjatekakhela_beng.html"},

    # Section 5: Siddhi Lalasa (10 songs)
    {"section": 5, "section_title": "Siddhi Lalasa", "section_title_en": "Siddhi Lalasa",
     "song": 1, "title": "Kabe Gaura Vane",
     "url": "https://kksongs.org/songs/k/kabegauravane.html",
     "bengali_url": "https://kksongs.org/unicode/k/kabegauravane_beng.html"},
    {"section": 5, "section_title": "Siddhi Lalasa", "section_title_en": "Siddhi Lalasa",
     "song": 2, "title": "Dekhite Dekhite",
     "url": "https://kksongs.org/songs/d/dekhitedekhite.html",
     "bengali_url": "https://kksongs.org/unicode/d/dekhitedekhite_beng.html"},
    {"section": 5, "section_title": "Siddhi Lalasa", "section_title_en": "Siddhi Lalasa",
     "song": 3, "title": "Heno Kale Habe",
     "url": "https://kksongs.org/songs/h/henokalehabe.html",
     "bengali_url": "https://kksongs.org/unicode/h/henokalehabe_beng.html"},
    {"section": 5, "section_title": "Siddhi Lalasa", "section_title_en": "Siddhi Lalasa",
     "song": 4, "title": "Palya Dasi Kori",
     "url": "https://kksongs.org/songs/p/palyadasikori.html",
     "bengali_url": "https://kksongs.org/unicode/p/palyadasikori_beng.html"},
    {"section": 5, "section_title": "Siddhi Lalasa", "section_title_en": "Siddhi Lalasa",
     "song": 5, "title": "Cintamani Moy",
     "url": "https://kksongs.org/songs/c/cintamanimoy.html",
     "bengali_url": "https://kksongs.org/unicode/c/cintamanimoy_beng.html"},
    {"section": 5, "section_title": "Siddhi Lalasa", "section_title_en": "Siddhi Lalasa",
     "song": 6, "title": "Nirjana Kutire",
     "url": "https://kksongs.org/songs/n/nirjanakutire.html",
     "bengali_url": "https://kksongs.org/unicode/n/nirjanakutire_beng.html"},
    {"section": 5, "section_title": "Siddhi Lalasa", "section_title_en": "Siddhi Lalasa",
     "song": 7, "title": "Sri Rupa Manjari Kabe Madhura",
     "url": "https://kksongs.org/songs/s/srirupamanjarikabemadhura.html",
     "bengali_url": "https://kksongs.org/unicode/s/srirupamanjarikabemadhura_beng.html"},
    {"section": 5, "section_title": "Siddhi Lalasa", "section_title_en": "Siddhi Lalasa",
     "song": 8, "title": "Varane Tarit",
     "url": "https://kksongs.org/songs/v/varanetarit.html",
     "bengali_url": "https://kksongs.org/unicode/v/varanetarit_beng.html"},
    {"section": 5, "section_title": "Siddhi Lalasa", "section_title_en": "Siddhi Lalasa",
     "song": 9, "title": "Vrsabhanu Suta Carana",
     "url": "https://kksongs.org/songs/v/vrsabhanusutacarana.html",
     "bengali_url": "https://kksongs.org/unicode/v/vrsabhanusutacarana_beng.html"},
    {"section": 5, "section_title": "Siddhi Lalasa", "section_title_en": "Siddhi Lalasa",
     "song": 10, "title": "Sri Krsna Virohe Radhikar Dasa",
     "url": "https://kksongs.org/songs/s/srikrsnaviroheradhikardasa.html",
     "bengali_url": "https://kksongs.org/unicode/s/srikrsnaviroheradhikardasa_beng.html"},
]

# Ukrainian section titles
SECTION_TITLES_UA = {
    1: "Ямуна-бгава̄валі",
    2: "Карпан̣йа-пан̃джіка̄",
    3: "Ш́ока-ш́а̄тана",
    4: "Рӯпа̄нуґа-бгаджана-дарпан̣а",
    5: "Сіддгі-лаласа̄"
}

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Accept': 'text/html,application/xhtml+xml',
}


def fetch_page(url: str, retries: int = 3) -> str | None:
    """Fetch a page with retries."""
    for attempt in range(retries):
        try:
            response = requests.get(url, headers=HEADERS, timeout=30)
            response.raise_for_status()
            return response.text
        except Exception as e:
            print(f"  Attempt {attempt + 1} failed for {url}: {e}")
            if attempt < retries - 1:
                time.sleep(2)
    return None


def preserve_line_breaks(soup):
    """Convert <br> and <p> tags to newlines before getting text."""
    for br in soup.find_all('br'):
        br.replace_with('\n')
    for p in soup.find_all('p'):
        p.append('\n')
    return soup


def clean_verse_preserve_lines(text: str) -> str:
    """Clean whitespace while preserving line breaks."""
    text = re.sub(r'U[DP]DATED:.*$', '', text, flags=re.MULTILINE | re.IGNORECASE)
    text = re.sub(r'www\.kksongs\.org.*$', '', text, flags=re.MULTILINE)
    text = re.sub(r'Krsna Kirtana Songs.*$', '', text, flags=re.MULTILINE)
    text = re.sub(r'(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s*\n?\s*\d{4}', '', text, flags=re.IGNORECASE)

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
    """Extract transliteration and translation from main song page."""
    soup = BeautifulSoup(html, 'html.parser')
    preserve_line_breaks(soup)
    text = soup.get_text()

    result = {"transliteration": [], "translation": []}

    lyrics_match = re.search(r'LYRICS:?\s*(.*?)(?=TRANSLATION|REMARKS|PURPORT|$)', text, re.DOTALL | re.IGNORECASE)
    trans_match = re.search(r'TRANSLATION\s*(.*?)(?=REMARKS|PURPORT|UPDATED|$)', text, re.DOTALL | re.IGNORECASE)

    if lyrics_match:
        lyrics_text = lyrics_match.group(1)
        verse_pattern = re.compile(r'\((\d+)\)')
        matches = list(verse_pattern.finditer(lyrics_text))

        for i, match in enumerate(matches):
            start = match.end()
            end = matches[i + 1].start() if i + 1 < len(matches) else len(lyrics_text)
            verse = lyrics_text[start:end].strip()
            verse = clean_verse_preserve_lines(verse)
            if verse:
                result["transliteration"].append(verse)

    if trans_match:
        trans_text = trans_match.group(1)
        verse_pattern = re.compile(r'(\d+)\)')
        matches = list(verse_pattern.finditer(trans_text))

        for i, match in enumerate(matches):
            start = match.end()
            end = matches[i + 1].start() if i + 1 < len(matches) else len(trans_text)
            verse = trans_text[start:end].strip()
            verse = re.sub(r'Remarks.*$', '', verse, flags=re.MULTILINE | re.IGNORECASE)
            verse = re.sub(r'Extra Information.*$', '', verse, flags=re.MULTILINE | re.IGNORECASE)
            verse = re.sub(r'No Extra.*$', '', verse, flags=re.MULTILINE | re.IGNORECASE)
            verse = clean_verse_preserve_lines(verse)
            if verse and len(verse) > 10:
                result["translation"].append(verse)

    return result


def parse_all_songs():
    """Parse all songs and create JSON."""
    print(f"Parsing {len(GITAMALA_SONGS)} songs from Gitamala...")

    sections = {}

    for i, song_info in enumerate(GITAMALA_SONGS):
        print(f"\n[{i+1}/{len(GITAMALA_SONGS)}] {song_info['title']}")

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

        # Fetch main page for transliteration/translation
        print(f"  Fetching main page...")
        main_html = fetch_page(song_info['url'])
        if main_html:
            main_data = parse_main_page(main_html)
            song_data['transliteration'] = main_data['transliteration']
            song_data['translation'] = main_data['translation']
            print(f"    Found {len(main_data['transliteration'])} transliteration, {len(main_data['translation'])} translation")

        sections[section_num]['songs'].append(song_data)

        # Rate limiting
        time.sleep(0.3)

    # Build final structure
    output = {
        "book_slug": "gitamala",
        "book_title_en": "Gitamala",
        "book_title_bn": "গীতমালা",
        "book_title_ua": "Ґіта-мала̄",
        "author_en": "Bhaktivinoda Thakura",
        "author_ua": "Бгактівінод Тхакур",
        "source": "https://kksongs.org/authors/literature/gitamala.html",
        "sections": [sections[i] for i in sorted(sections.keys())],
        "total_songs": len(GITAMALA_SONGS),
        "metadata": {
            "parsed_date": time.strftime("%Y-%m-%d"),
            "source_website": "kksongs.org"
        }
    }

    return output


def main():
    output_path = Path(__file__).parent.parent / "src" / "data" / "gitamala-parsed.json"

    data = parse_all_songs()

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n✓ Saved to {output_path}")
    print(f"  Total sections: {len(data['sections'])}")
    print(f"  Total songs: {data['total_songs']}")


if __name__ == "__main__":
    main()
