#!/usr/bin/env python3
"""
Parser for Kalyana Kalpataru book from kksongs.org
By Bhaktivinoda Thakura (1893) - "Desire Tree of Auspiciousness"
Complex structure with 5 sections and multiple subsections (~63 songs)
"""

import json
import re
import time
import requests
from bs4 import BeautifulSoup
from pathlib import Path

# Complete song structure
KALYANA_KALPATARU_SONGS = [
    # Section 1: Vandanam (1 song)
    {"section": 1, "section_title": "Vandanam", "section_title_en": "Salutation",
     "section_title_ua": "Вандана (Шанування)",
     "song": 1, "title": "Vande Vrndavati",
     "url": "https://kksongs.org/songs/v/vandevrndavati.html",
     "bengali_url": "https://kksongs.org/unicode/v/vandevrndavati_beng.html"},

    # Section 2: Mangalacarana (1 song)
    {"section": 2, "section_title": "Mangalacarana", "section_title_en": "Auspicious Invocation",
     "section_title_ua": "Манґалачарана (Сприятлива молитва)",
     "song": 1, "title": "Jaya Jaya Sri Caitanya Patita",
     "url": "https://kksongs.org/songs/j/jayajayasricaitanyapatita.html",
     "bengali_url": "https://kksongs.org/unicode/j/jayajayasricaitanyapatita_beng.html"},

    # Section 3: Upadesa - First Branch (20 songs)
    {"section": 3, "section_title": "Upadesa", "section_title_en": "Spiritual Advice (First Branch)",
     "section_title_ua": "Упадеша (Духовні настанови)",
     "song": 1, "title": "Diksa Guru Krpa Kori",
     "url": "https://kksongs.org/songs/d/diksagurukrpakori.html",
     "bengali_url": "https://kksongs.org/unicode/d/diksagurukrpakori_beng.html"},
    {"section": 3, "section_title": "Upadesa", "section_title_en": "Spiritual Advice (First Branch)",
     "section_title_ua": "Упадеша (Духовні настанови)",
     "song": 2, "title": "Mana Re Keno Miche Bhajicho",
     "url": "https://kksongs.org/songs/m/manarekenomichebhajicho.html",
     "bengali_url": "https://kksongs.org/unicode/m/manarekenomichebhajicho_beng.html"},
    {"section": 3, "section_title": "Upadesa", "section_title_en": "Spiritual Advice (First Branch)",
     "section_title_ua": "Упадеша (Духовні настанови)",
     "song": 3, "title": "Mana Tumi Bhalo Basa",
     "url": "https://kksongs.org/songs/m/manatumibhalobasa.html",
     "bengali_url": "https://kksongs.org/unicode/m/manatumibhalobasa_beng.html"},
    {"section": 3, "section_title": "Upadesa", "section_title_en": "Spiritual Advice (First Branch)",
     "section_title_ua": "Упадеша (Духовні настанови)",
     "song": 4, "title": "Mana Re Tumi Bara Sandigdha",
     "url": "https://kksongs.org/songs/m/manaretumibarasandigdha.html",
     "bengali_url": "https://kksongs.org/unicode/m/manaretumibarasandigdha_beng.html"},
    {"section": 3, "section_title": "Upadesa", "section_title_en": "Spiritual Advice (First Branch)",
     "section_title_ua": "Упадеша (Духовні настанови)",
     "song": 5, "title": "Mana Tumi Barai Pamara",
     "url": "https://kksongs.org/songs/m/manatumibaraipamara.html",
     "bengali_url": "https://kksongs.org/unicode/m/manatumibaraipamara_beng.html"},
    {"section": 3, "section_title": "Upadesa", "section_title_en": "Spiritual Advice (First Branch)",
     "section_title_ua": "Упадеша (Духовні настанови)",
     "song": 6, "title": "Mana Keno E Samsaya",
     "url": "https://kksongs.org/songs/m/manakenoesamsaya.html",
     "bengali_url": "https://kksongs.org/unicode/m/manakenoesamsaya_beng.html"},
    {"section": 3, "section_title": "Upadesa", "section_title_en": "Spiritual Advice (First Branch)",
     "section_title_ua": "Упадеша (Духовні настанови)",
     "song": 7, "title": "Mana Tumi Parile Ki Char",
     "url": "https://kksongs.org/songs/m/manatumiparilekichar.html",
     "bengali_url": "https://kksongs.org/unicode/m/manatumiparilekichar_beng.html"},
    {"section": 3, "section_title": "Upadesa", "section_title_en": "Spiritual Advice (First Branch)",
     "section_title_ua": "Упадеша (Духовні настанови)",
     "song": 8, "title": "Mana Jogi Hote Tomar",
     "url": "https://kksongs.org/songs/m/manajogihotetomar.html",
     "bengali_url": "https://kksongs.org/unicode/m/manajogihotetomar_beng.html"},
    {"section": 3, "section_title": "Upadesa", "section_title_en": "Spiritual Advice (First Branch)",
     "section_title_ua": "Упадеша (Духовні настанови)",
     "song": 9, "title": "Ohe Bhai Mana Keno Brahma",
     "url": "https://kksongs.org/songs/o/ohebhaimanakenobrahma.html",
     "bengali_url": "https://kksongs.org/unicode/o/ohebhaimanakenobrahma_beng.html"},
    {"section": 3, "section_title": "Upadesa", "section_title_en": "Spiritual Advice (First Branch)",
     "section_title_ua": "Упадеша (Духовні настанови)",
     "song": 10, "title": "Mana Re Keno Ar Barna",
     "url": "https://kksongs.org/songs/m/manarekenoarbarna.html",
     "bengali_url": "https://kksongs.org/unicode/m/manarekenoarbarna_beng.html"},
    {"section": 3, "section_title": "Upadesa", "section_title_en": "Spiritual Advice (First Branch)",
     "section_title_ua": "Упадеша (Духовні настанови)",
     "song": 11, "title": "Mana Re Keno Korobi Dyar",
     "url": "https://kksongs.org/songs/m/manarekenokorobidyar.html",
     "bengali_url": "https://kksongs.org/unicode/m/manarekenokorobidyar_beng.html"},
    {"section": 3, "section_title": "Upadesa", "section_title_en": "Spiritual Advice (First Branch)",
     "section_title_ua": "Упадеша (Духовні настанови)",
     "song": 12, "title": "Ruper Gaurava Keno Bhai",
     "url": "https://kksongs.org/songs/r/rupergauravakenobhai.html",
     "bengali_url": "https://kksongs.org/unicode/r/rupergauravakenobhai_beng.html"},
    {"section": 3, "section_title": "Upadesa", "section_title_en": "Spiritual Advice (First Branch)",
     "section_title_ua": "Упадеша (Духовні настанови)",
     "song": 13, "title": "Mana Re Dhana Mada",
     "url": "https://kksongs.org/songs/m/manaredhanamada.html",
     "bengali_url": "https://kksongs.org/unicode/m/manaredhanamada_beng.html"},
    {"section": 3, "section_title": "Upadesa", "section_title_en": "Spiritual Advice (First Branch)",
     "section_title_ua": "Упадеша (Духовні настанови)",
     "song": 14, "title": "Mana Tumi Sannyasi Sajite",
     "url": "https://kksongs.org/songs/m/manatumisannyasisajite.html",
     "bengali_url": "https://kksongs.org/unicode/m/manatumisannyasisajite_beng.html"},
    {"section": 3, "section_title": "Upadesa", "section_title_en": "Spiritual Advice (First Branch)",
     "section_title_ua": "Упадеша (Духовні настанови)",
     "song": 15, "title": "Mana Tumi Tirthe Sadarata",
     "url": "https://kksongs.org/songs/m/manatumitirthesadarata.html",
     "bengali_url": "https://kksongs.org/unicode/m/manatumitirthesadarata_beng.html"},
    {"section": 3, "section_title": "Upadesa", "section_title_en": "Spiritual Advice (First Branch)",
     "section_title_ua": "Упадеша (Духовні настанови)",
     "song": 16, "title": "Dekho Mana Brate Je Nan Nahao",
     "url": "https://kksongs.org/songs/d/dekhomanabratejenannahao.html",
     "bengali_url": "https://kksongs.org/unicode/d/dekhomanabratejenannahao_beng.html"},
    {"section": 3, "section_title": "Upadesa", "section_title_en": "Spiritual Advice (First Branch)",
     "section_title_ua": "Упадеша (Духовні настанови)",
     "song": 17, "title": "Mana Tumi Barai Cancala",
     "url": "https://kksongs.org/songs/m/manatumibaraicancala.html",
     "bengali_url": "https://kksongs.org/unicode/m/manatumibaraicancala_beng.html"},
    {"section": 3, "section_title": "Upadesa", "section_title_en": "Spiritual Advice (First Branch)",
     "section_title_ua": "Упадеша (Духовні настанови)",
     "song": 18, "title": "Mana Tore Boli E Barata",
     "url": "https://kksongs.org/songs/m/manatoreboliebarata.html",
     "bengali_url": "https://kksongs.org/unicode/m/manatoreboliebarata_beng.html"},
    {"section": 3, "section_title": "Upadesa", "section_title_en": "Spiritual Advice (First Branch)",
     "section_title_ua": "Упадеша (Духовні настанови)",
     "song": 19, "title": "Ki Ar Boli Bo Tore Mana",
     "url": "https://kksongs.org/songs/k/kiarbolibotoremana.html",
     "bengali_url": "https://kksongs.org/unicode/k/kiarbolibotoremana_beng.html"},
    {"section": 3, "section_title": "Upadesa", "section_title_en": "Spiritual Advice (First Branch)",
     "section_title_ua": "Упадеша (Духовні настанови)",
     "song": 20, "title": "Keno Mana Kamere Nacao",
     "url": "https://kksongs.org/songs/k/kenomanakamerenacao.html",
     "bengali_url": "https://kksongs.org/unicode/k/kenomanakamerenacao_beng.html"},

    # Section 4: Upalabdhi - Second Branch
    # Part A: Anatupa Laksana Upalabdhi (5 songs)
    {"section": 4, "section_title": "Upalabdhi - Anatupa Laksana", "section_title_en": "Attainment - Repentance",
     "section_title_ua": "Упалабдгі - Анатупа-лакшана (Досягнення - Каяття)",
     "song": 1, "title": "Ami Ati Pamara Durjana",
     "url": "https://kksongs.org/songs/a/amiatipamaradurjana.html",
     "bengali_url": "https://kksongs.org/unicode/a/amiatipamaradurjana_beng.html"},
    {"section": 4, "section_title": "Upalabdhi - Anatupa Laksana", "section_title_en": "Attainment - Repentance",
     "section_title_ua": "Упалабдгі - Анатупа-лакшана (Досягнення - Каяття)",
     "song": 2, "title": "Sadhu Sanga Na Hoilo",
     "url": "https://kksongs.org/songs/s/sadhusanganahoilo.html",
     "bengali_url": "https://kksongs.org/unicode/s/sadhusanganahoilo_beng.html"},
    {"section": 4, "section_title": "Upalabdhi - Anatupa Laksana", "section_title_en": "Attainment - Repentance",
     "section_title_ua": "Упалабдгі - Анатупа-лакшана (Досягнення - Каяття)",
     "song": 3, "title": "Ore Mana Karmer Kuhare",
     "url": "https://kksongs.org/songs/o/oremanakarmerkuhare.html",
     "bengali_url": "https://kksongs.org/unicode/o/oremanakarmerkuhare_beng.html"},
    {"section": 4, "section_title": "Upalabdhi - Anatupa Laksana", "section_title_en": "Attainment - Repentance",
     "section_title_ua": "Упалабдгі - Анатупа-лакшана (Досягнення - Каяття)",
     "song": 4, "title": "Ore Mana Ki Bipada Hoilo Amar",
     "url": "https://kksongs.org/songs/o/oremanakibipadahoiloamar.html",
     "bengali_url": "https://kksongs.org/unicode/o/oremanakibipadahoiloamar_beng.html"},
    {"section": 4, "section_title": "Upalabdhi - Anatupa Laksana", "section_title_en": "Attainment - Repentance",
     "section_title_ua": "Упалабдгі - Анатупа-лакшана (Досягнення - Каяття)",
     "song": 5, "title": "Ore Mana Klesa Tapa Dekhi Je",
     "url": "https://kksongs.org/songs/o/oremanaklesatapaddekhije.html",
     "bengali_url": "https://kksongs.org/unicode/o/oremanaklesatapaddekhije_beng.html"},

    # Part B: Nirveda Laksana Upalabdhi (5 songs)
    {"section": 5, "section_title": "Upalabdhi - Nirveda Laksana", "section_title_en": "Attainment - Indifference",
     "section_title_ua": "Упалабдгі - Нірведа-лакшана (Досягнення - Відречення)",
     "song": 1, "title": "Ore Mana Bhalo Nahi La Gee",
     "url": "https://kksongs.org/songs/o/oremanabhalonahilagee.html",
     "bengali_url": "https://kksongs.org/unicode/o/oremanabhalonahilagee_beng.html"},
    {"section": 5, "section_title": "Upalabdhi - Nirveda Laksana", "section_title_en": "Attainment - Indifference",
     "section_title_ua": "Упалабдгі - Нірведа-лакшана (Досягнення - Відречення)",
     "song": 2, "title": "Ore Mana Badi Bara Sa Keno",
     "url": "https://kksongs.org/songs/o/oremanabadibarasakeno.html",
     "bengali_url": "https://kksongs.org/unicode/o/oremanabadibarasakeno_beng.html"},
    {"section": 5, "section_title": "Upalabdhi - Nirveda Laksana", "section_title_en": "Attainment - Indifference",
     "section_title_ua": "Упалабдгі - Нірведа-лакшана (Досягнення - Відречення)",
     "song": 3, "title": "Ore Mana Bhukti Mukti",
     "url": "https://kksongs.org/songs/o/oremanabhuktimukti.html",
     "bengali_url": "https://kksongs.org/unicode/o/oremanabhuktimukti_beng.html"},
    {"section": 5, "section_title": "Upalabdhi - Nirveda Laksana", "section_title_en": "Attainment - Indifference",
     "section_title_ua": "Упалабдгі - Нірведа-лакшана (Досягнення - Відречення)",
     "song": 4, "title": "Durlabha Manava Janma",
     "url": "https://kksongs.org/songs/d/durlabhamanavajanma.html",
     "bengali_url": "https://kksongs.org/unicode/d/durlabhamanavajanma_beng.html"},
    {"section": 5, "section_title": "Upalabdhi - Nirveda Laksana", "section_title_en": "Attainment - Indifference",
     "section_title_ua": "Упалабдгі - Нірведа-лакшана (Досягнення - Відречення)",
     "song": 5, "title": "Sarirer Sukhe Mana Deho",
     "url": "https://kksongs.org/songs/s/sarirersukhemanadeho.html",
     "bengali_url": "https://kksongs.org/unicode/s/sarirersukhemanadeho_beng.html"},

    # Part C: Sambandha Abhideya Prayojana Vijnana (4 songs)
    {"section": 6, "section_title": "Upalabdhi - Sambandha Abhideya Prayojana", "section_title_en": "Attainment - Philosophical Knowledge",
     "section_title_ua": "Упалабдгі - Самбандга Абгідея Праджйоджана (Філософське знання)",
     "song": 1, "title": "Ore Mana Boli Suno Tattva",
     "url": "https://kksongs.org/songs/o/oremanabolisunotattva.html",
     "bengali_url": "https://kksongs.org/unicode/o/oremanabolisunotattva_beng.html"},
    {"section": 6, "section_title": "Upalabdhi - Sambandha Abhideya Prayojana", "section_title_en": "Attainment - Philosophical Knowledge",
     "section_title_ua": "Упалабдгі - Самбандга Абгідея Праджйоджана (Філософське знання)",
     "song": 2, "title": "Apurva Vaisnava Tattva Atmar",
     "url": "https://kksongs.org/songs/a/apurvavaisnavatattvaatmar.html",
     "bengali_url": "https://kksongs.org/unicode/a/apurvavaisnavatattvaatmar_beng.html"},
    {"section": 6, "section_title": "Upalabdhi - Sambandha Abhideya Prayojana", "section_title_en": "Attainment - Philosophical Knowledge",
     "section_title_ua": "Упалабдгі - Самбандга Абгідея Праджйоджана (Філософське знання)",
     "song": 3, "title": "Cij Jader Dvaita Jini Korena",
     "url": "https://kksongs.org/songs/c/cijjaderdvaitajinikorena.html",
     "bengali_url": "https://kksongs.org/unicode/c/cijjaderdvaitajinikorena_beng.html"},
    {"section": 6, "section_title": "Upalabdhi - Sambandha Abhideya Prayojana", "section_title_en": "Attainment - Philosophical Knowledge",
     "section_title_ua": "Упалабдгі - Самбандга Абгідея Праджйоджана (Філософське знання)",
     "song": 4, "title": "Jivana Samapt Kale Koribo",
     "url": "https://kksongs.org/songs/j/jivanasamaptkalekoribo.html",
     "bengali_url": "https://kksongs.org/unicode/j/jivanasamaptkalekoribo_beng.html"},

    # Section 5: Ucchvasa - Third Branch
    # Part A: Prarthana Dainyamayi (5 songs)
    {"section": 7, "section_title": "Ucchvasa - Prarthana Dainyamayi", "section_title_en": "Ecstasy - Humble Prayers",
     "section_title_ua": "Уччгваса - Прартгана Даіньямайі (Екстаз - Смиренні молитви)",
     "song": 1, "title": "Kabe Sri Caitanya",
     "url": "https://kksongs.org/songs/k/kabesricaitanya.html",
     "bengali_url": "https://kksongs.org/unicode/k/kabesricaitanya_beng.html"},
    {"section": 7, "section_title": "Ucchvasa - Prarthana Dainyamayi", "section_title_en": "Ecstasy - Humble Prayers",
     "section_title_ua": "Уччгваса - Прартгана Даіньямайі (Екстаз - Смиренні молитви)",
     "song": 2, "title": "Ami To Durjana Ati Sada",
     "url": "https://kksongs.org/songs/a/amitodurjanaatisada.html",
     "bengali_url": "https://kksongs.org/unicode/a/amitodurjanaatisada_beng.html"},
    {"section": 7, "section_title": "Ucchvasa - Prarthana Dainyamayi", "section_title_en": "Ecstasy - Humble Prayers",
     "section_title_ua": "Уччгваса - Прартгана Даіньямайі (Екстаз - Смиренні молитви)",
     "song": 3, "title": "Bhava Arnave Pade",
     "url": "https://kksongs.org/songs/b/bhavarnavepade.html",
     "bengali_url": "https://kksongs.org/unicode/b/bhavarnavepade_beng.html"},
    {"section": 7, "section_title": "Ucchvasa - Prarthana Dainyamayi", "section_title_en": "Ecstasy - Humble Prayers",
     "section_title_ua": "Уччгваса - Прартгана Даіньямайі (Екстаз - Смиренні молитви)",
     "song": 4, "title": "Visaya Basana Rupa Citter",
     "url": "https://kksongs.org/songs/v/visayabasanarupacitter.html",
     "bengali_url": "https://kksongs.org/unicode/v/visayabasanarupacitter_beng.html"},
    {"section": 7, "section_title": "Ucchvasa - Prarthana Dainyamayi", "section_title_en": "Ecstasy - Humble Prayers",
     "section_title_ua": "Уччгваса - Прартгана Даіньямайі (Екстаз - Смиренні молитви)",
     "song": 5, "title": "Amar Samana Hina Nahi E",
     "url": "https://kksongs.org/songs/a/amarsamanhinanahie.html",
     "bengali_url": "https://kksongs.org/unicode/a/amarsamanhinanahie_beng.html"},

    # Part B: Prarthana Lalasamayi (12 songs)
    {"section": 8, "section_title": "Ucchvasa - Prarthana Lalasamayi", "section_title_en": "Ecstasy - Longing Prayers",
     "section_title_ua": "Уччгваса - Прартгана Лаласамайі (Екстаз - Молитви прагнення)",
     "song": 1, "title": "Kabe Mor Subha Dina Hoibe",
     "url": "https://kksongs.org/songs/k/kabemorsubhadinahoibe.html",
     "bengali_url": "https://kksongs.org/unicode/k/kabemorsubhadinahoibe_beng.html"},
    {"section": 8, "section_title": "Ucchvasa - Prarthana Lalasamayi", "section_title_en": "Ecstasy - Longing Prayers",
     "section_title_ua": "Уччгваса - Прартгана Лаласамайі (Екстаз - Молитви прагнення)",
     "song": 2, "title": "Sri Guru Vaisnava Krpa",
     "url": "https://kksongs.org/songs/s/sriguruvaisnavakrpa.html",
     "bengali_url": "https://kksongs.org/unicode/s/sriguruvaisnavakrpa_beng.html"},
    {"section": 8, "section_title": "Ucchvasa - Prarthana Lalasamayi", "section_title_en": "Ecstasy - Longing Prayers",
     "section_title_ua": "Уччгваса - Прартгана Лаласамайі (Екстаз - Молитви прагнення)",
     "song": 3, "title": "Amare Mon Bhagya Kota",
     "url": "https://kksongs.org/songs/a/amaremonabhagyakota.html",
     "bengali_url": "https://kksongs.org/unicode/a/amaremonabhagyakota_beng.html"},
    {"section": 8, "section_title": "Ucchvasa - Prarthana Lalasamayi", "section_title_en": "Ecstasy - Longing Prayers",
     "section_title_ua": "Уччгваса - Прартгана Лаласамайі (Екстаз - Молитви прагнення)",
     "song": 4, "title": "Caitanya Candrer Lila",
     "url": "https://kksongs.org/songs/c/caitanyacandrerlila.html",
     "bengali_url": "https://kksongs.org/unicode/c/caitanyacandrerlila_beng.html"},
    {"section": 8, "section_title": "Ucchvasa - Prarthana Lalasamayi", "section_title_en": "Ecstasy - Longing Prayers",
     "section_title_ua": "Уччгваса - Прартгана Лаласамайі (Екстаз - Молитви прагнення)",
     "song": 5, "title": "Kabe Mor Mudha Mana Chadi",
     "url": "https://kksongs.org/songs/k/kabemormudhamanachadi.html",
     "bengali_url": "https://kksongs.org/unicode/k/kabemormudhamanachadi_beng.html"},
    {"section": 8, "section_title": "Ucchvasa - Prarthana Lalasamayi", "section_title_en": "Ecstasy - Longing Prayers",
     "section_title_ua": "Уччгваса - Прартгана Лаласамайі (Екстаз - Молитви прагнення)",
     "song": 6, "title": "Hari Hari (15)",
     "url": "https://kksongs.org/songs/h/harihari15.html",
     "bengali_url": "https://kksongs.org/unicode/h/harihari15_beng.html"},
    {"section": 8, "section_title": "Ucchvasa - Prarthana Lalasamayi", "section_title_en": "Ecstasy - Longing Prayers",
     "section_title_ua": "Уччгваса - Прартгана Лаласамайі (Екстаз - Молитви прагнення)",
     "song": 7, "title": "Kabe Mui Vaisnava Cinibo",
     "url": "https://kksongs.org/songs/k/kabemuivaisnavacinibo.html",
     "bengali_url": "https://kksongs.org/unicode/k/kabemuivaisnavacinibo_beng.html"},
    {"section": 8, "section_title": "Ucchvasa - Prarthana Lalasamayi", "section_title_en": "Ecstasy - Longing Prayers",
     "section_title_ua": "Уччгваса - Прартгана Лаласамайі (Екстаз - Молитви прагнення)",
     "song": 8, "title": "Krpa Koro Vaisnava Thakura",
     "url": "https://kksongs.org/songs/k/krpakorovaisnavathakura.html",
     "bengali_url": "https://kksongs.org/unicode/k/krpakorovaisnavathakura_beng.html"},
    {"section": 8, "section_title": "Ucchvasa - Prarthana Lalasamayi", "section_title_en": "Ecstasy - Longing Prayers",
     "section_title_ua": "Уччгваса - Прартгана Лаласамайі (Екстаз - Молитви прагнення)",
     "song": 9, "title": "Kabe Habe Heno Dasa Mor",
     "url": "https://kksongs.org/songs/k/kabehabehenodasamor.html",
     "bengali_url": "https://kksongs.org/unicode/k/kabehabehenodasamor_beng.html"},
    {"section": 8, "section_title": "Ucchvasa - Prarthana Lalasamayi", "section_title_en": "Ecstasy - Longing Prayers",
     "section_title_ua": "Уччгваса - Прартгана Лаласамайі (Екстаз - Молитви прагнення)",
     "song": 10, "title": "Ha Ha Mora Gaura Kisora",
     "url": "https://kksongs.org/songs/h/hahmoragaurakisora.html",
     "bengali_url": "https://kksongs.org/unicode/h/hahmoragaurakisora_beng.html"},
    {"section": 8, "section_title": "Ucchvasa - Prarthana Lalasamayi", "section_title_en": "Ecstasy - Longing Prayers",
     "section_title_ua": "Уччгваса - Прартгана Лаласамайі (Екстаз - Молитви прагнення)",
     "song": 11, "title": "Ha Ha Kabe Gaura Nitai",
     "url": "https://kksongs.org/songs/h/hahakabegauranitai.html",
     "bengali_url": "https://kksongs.org/unicode/h/hahakabegauranitai_beng.html"},
    {"section": 8, "section_title": "Ucchvasa - Prarthana Lalasamayi", "section_title_en": "Ecstasy - Longing Prayers",
     "section_title_ua": "Уччгваса - Прартгана Лаласамайі (Екстаз - Молитви прагнення)",
     "song": 12, "title": "Kabe Aha Gauranga Boliya",
     "url": "https://kksongs.org/songs/k/kabeahagaurangaboliya.html",
     "bengali_url": "https://kksongs.org/unicode/k/kabeahagaurangaboliya_beng.html"},

    # Part C: Vijnapti (4 songs)
    {"section": 9, "section_title": "Ucchvasa - Vijnapti", "section_title_en": "Ecstasy - Supplications",
     "section_title_ua": "Уччгваса - Віджн̃апті (Екстаз - Благання)",
     "song": 1, "title": "Gopinatha (1)",
     "url": "https://kksongs.org/songs/g/gopinatha1.html",
     "bengali_url": "https://kksongs.org/unicode/g/gopinatha1_beng.html"},
    {"section": 9, "section_title": "Ucchvasa - Vijnapti", "section_title_en": "Ecstasy - Supplications",
     "section_title_ua": "Уччгваса - Віджн̃апті (Екстаз - Благання)",
     "song": 2, "title": "Gopinatha (2)",
     "url": "https://kksongs.org/songs/g/gopinatha2.html",
     "bengali_url": "https://kksongs.org/unicode/g/gopinatha2_beng.html"},
    {"section": 9, "section_title": "Ucchvasa - Vijnapti", "section_title_en": "Ecstasy - Supplications",
     "section_title_ua": "Уччгваса - Віджн̃апті (Екстаз - Благання)",
     "song": 3, "title": "Gopinatha (3)",
     "url": "https://kksongs.org/songs/g/gopinatha3.html",
     "bengali_url": "https://kksongs.org/unicode/g/gopinatha3_beng.html"},
    {"section": 9, "section_title": "Ucchvasa - Vijnapti", "section_title_en": "Ecstasy - Supplications",
     "section_title_ua": "Уччгваса - Віджн̃апті (Екстаз - Благання)",
     "song": 4, "title": "Sri Radha Krsna Pada Kamale",
     "url": "https://kksongs.org/songs/s/sriradhakrsnapadakamale.html",
     "bengali_url": "https://kksongs.org/unicode/s/sriradhakrsnapadakamale_beng.html"},

    # Part D: Ucchvasa Kirtana (8 songs)
    {"section": 10, "section_title": "Ucchvasa - Nama Kirtana", "section_title_en": "Ecstasy - Glorifying the Name",
     "section_title_ua": "Уччгваса - Нама-кіртана (Екстаз - Оспівування Імені)",
     "song": 1, "title": "Kali Kukkura Kadan",
     "url": "https://kksongs.org/songs/k/kalikukkura.html",
     "bengali_url": "https://kksongs.org/unicode/k/kalikukkura_beng.html"},
    {"section": 10, "section_title": "Ucchvasa - Nama Kirtana", "section_title_en": "Ecstasy - Glorifying the Name",
     "section_title_ua": "Уччгваса - Нама-кіртана (Екстаз - Оспівування Імені)",
     "song": 2, "title": "Vibhavari Sesa",
     "url": "https://kksongs.org/songs/v/vibhavarisesa.html",
     "bengali_url": "https://kksongs.org/unicode/v/vibhavarisesa_beng.html"},

    {"section": 11, "section_title": "Ucchvasa - Rupa Kirtana", "section_title_en": "Ecstasy - Glorifying the Form",
     "section_title_ua": "Уччгваса - Рупа-кіртана (Екстаз - Оспівування форми)",
     "song": 1, "title": "Janama Saphalata Ra Krsna",
     "url": "https://kksongs.org/songs/j/janamasaphalatarakrsna.html",
     "bengali_url": "https://kksongs.org/unicode/j/janamasaphalatarakrsna_beng.html"},

    {"section": 12, "section_title": "Ucchvasa - Guna Kirtana", "section_title_en": "Ecstasy - Glorifying the Qualities",
     "section_title_ua": "Уччгваса - Ґуна-кіртана (Екстаз - Оспівування якостей)",
     "song": 1, "title": "Bahirmukha Hoye Mayare",
     "url": "https://kksongs.org/songs/b/bahirmukhahoyemayare.html",
     "bengali_url": "https://kksongs.org/unicode/b/bahirmukhahoyemayare_beng.html"},
    {"section": 12, "section_title": "Ucchvasa - Guna Kirtana", "section_title_en": "Ecstasy - Glorifying the Qualities",
     "section_title_ua": "Уччгваса - Ґуна-кіртана (Екстаз - Оспівування якостей)",
     "song": 2, "title": "Suno He Rasika Jana Krsna",
     "url": "https://kksongs.org/songs/s/sunoherasikajanakrsna.html",
     "bengali_url": "https://kksongs.org/unicode/s/sunoherasikajanakrsna_beng.html"},

    {"section": 13, "section_title": "Ucchvasa - Lila Kirtana", "section_title_en": "Ecstasy - Glorifying the Pastimes",
     "section_title_ua": "Уччгваса - Ліла-кіртана (Екстаз - Оспівування ігор)",
     "song": 1, "title": "Jive Krpa Kori Goloker",
     "url": "https://kksongs.org/songs/j/jivekrpakorigoloker.html",
     "bengali_url": "https://kksongs.org/unicode/j/jivekrpakorigoloker_beng.html"},
    {"section": 13, "section_title": "Ucchvasa - Lila Kirtana", "section_title_en": "Ecstasy - Glorifying the Pastimes",
     "section_title_ua": "Уччгваса - Ліла-кіртана (Екстаз - Оспівування ігор)",
     "song": 2, "title": "Ami Jamuna Puline",
     "url": "https://kksongs.org/songs/a/amijamunapuline.html",
     "bengali_url": "https://kksongs.org/unicode/a/amijamunapuline_beng.html"},

    {"section": 14, "section_title": "Ucchvasa - Rasa Kirtana", "section_title_en": "Ecstasy - Glorifying the Rasa",
     "section_title_ua": "Уччгваса - Раса-кіртана (Екстаз - Оспівування раси)",
     "song": 1, "title": "Krsna Bamsi Gita Suni",
     "url": "https://kksongs.org/songs/k/krsnabamsigitasuni.html",
     "bengali_url": "https://kksongs.org/unicode/k/krsnabamsigitasuni_beng.html"},
]


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
    for br in soup.find_all('br'):
        br.replace_with('\n')
    for p in soup.find_all('p'):
        p.append('\n')
    return soup


def clean_verse_preserve_lines(text: str) -> str:
    text = text.replace('\x92', "'")
    text = re.sub(r'(UPDATED|UDPATED):?[^\n]*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'www\.kksongs\.org.*$', '', text, flags=re.MULTILINE)
    text = re.sub(r'Krsna Kirtana Songs.*$', '', text, flags=re.MULTILINE)
    text = re.sub(r'(January|February|March|April|May|June|July|August|September|October|November|December)\s*\d{1,2},?\s*\n?\s*\d{4}', '', text, flags=re.IGNORECASE)

    lines = []
    for line in text.split('\n'):
        cleaned = ' '.join(line.split())
        if cleaned:
            lines.append(cleaned)

    return '\n'.join(lines)


def parse_bengali_page(html: str) -> list[str]:
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

        verse_match = re.match(r'^\s*\(?\s*(\d+)\s*\)?\s*$', line.strip())
        if verse_match and current_section:
            if current_verse:
                result[current_section].append('\n'.join(current_verse))
                current_verse = []
            continue

        if current_section and line.strip():
            cleaned = clean_verse_preserve_lines(line.strip())
            if cleaned:
                current_verse.append(cleaned)

    if current_section and current_verse:
        result[current_section].append('\n'.join(current_verse))

    return result


def parse_all_songs():
    print(f"Parsing {len(KALYANA_KALPATARU_SONGS)} songs from Kalyana Kalpataru...")

    sections = {}

    for i, song_info in enumerate(KALYANA_KALPATARU_SONGS):
        print(f"\n[{i+1}/{len(KALYANA_KALPATARU_SONGS)}] {song_info['title']}")

        section_num = song_info['section']
        if section_num not in sections:
            sections[section_num] = {
                "section_number": section_num,
                "title": song_info['section_title'],
                "title_en": song_info['section_title_en'],
                "title_ua": song_info['section_title_ua'],
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

        sections[section_num]['songs'].append(song_data)
        time.sleep(0.3)

    output = {
        "book_slug": "kalyana-kalpataru",
        "book_title_en": "Kalyana Kalpataru",
        "book_title_bn": "কল্যাণ কল্পতরু",
        "book_title_ua": "Кальяна Калпатару",
        "author_en": "Bhaktivinoda Thakura",
        "author_ua": "Бгактівінод Тхакур",
        "year": 1893,
        "source": "https://kksongs.org/authors/literature/kalyanakalpataru.html",
        "sections": [sections[i] for i in sorted(sections.keys())],
        "total_songs": len(KALYANA_KALPATARU_SONGS),
        "metadata": {
            "parsed_date": time.strftime("%Y-%m-%d"),
            "source_website": "kksongs.org"
        }
    }

    return output


def main():
    output_path = Path(__file__).parent.parent / "src" / "data" / "kalyana-kalpataru-parsed.json"

    data = parse_all_songs()

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n✓ Saved to {output_path}")
    print(f"  Total sections: {len(data['sections'])}")
    print(f"  Total songs: {data['total_songs']}")


if __name__ == "__main__":
    main()
