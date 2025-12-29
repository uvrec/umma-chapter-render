#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
BALARAM MULTI-FORMAT DECODER v4.5

Конвертує BBT Balaram-кодований санскрит у:
1. Devanāgarī (देवनागरी)
2. IAST (латинська транслітерація)
3. Українська кирилична транслітерація з діакритикою

На основі аналізу Бгаґавад-ґīти:
- Глава 2 (72 вірші)
- Глава 4 (42 вірші)
- Глава 13 (35 віршів)
- Глава 14 (27 віршів)
- Глава 18 (78 віршів)

Загалом: 120+ мепінгів
"""

import re
import sys
from enum import Enum


class OutputFormat(Enum):
    DEVANAGARI = "devanagari"
    IAST = "iast"
    UKRAINIAN = "ukrainian"


# =============================================================================
# UNICODE CONSTANTS
# =============================================================================

class Dev:
    """Devanāgarī Unicode."""
    A = 'अ'; AA = 'आ'; I = 'इ'; II = 'ई'; U = 'उ'; UU = 'ऊ'
    RI = 'ऋ'; E = 'ए'; AI = 'ऐ'; O = 'ओ'; AU = 'औ'

    m_AA = 'ा'; m_I = 'ि'; m_II = 'ी'; m_U = 'ु'; m_UU = 'ू'
    m_RI = 'ृ'; m_E = 'े'; m_AI = 'ै'; m_O = 'ो'; m_AU = 'ौ'

    KA = 'क'; KHA = 'ख'; GA = 'ग'; GHA = 'घ'; NGA = 'ङ'
    CA = 'च'; CHA = 'छ'; JA = 'ज'; JHA = 'झ'; NYA = 'ञ'
    TTA = 'ट'; TTHA = 'ठ'; DDA = 'ड'; DDHA = 'ढ'; NNA = 'ण'
    TA = 'त'; THA = 'थ'; DA = 'द'; DHA = 'ध'; NA = 'न'
    PA = 'प'; PHA = 'फ'; BA = 'ब'; BHA = 'भ'; MA = 'म'
    YA = 'य'; RA = 'र'; LA = 'ल'; VA = 'व'
    SHA = 'श'; SSA = 'ष'; SA = 'स'; HA = 'ह'

    H = '्'; AN = 'ं'; VI = 'ः'; AV = 'ऽ'
    DD = '॥'; SD = '।'


class IAST:
    """IAST transliteration."""
    # Vowels
    A = 'a'; AA = 'ā'; I = 'i'; II = 'ī'; U = 'u'; UU = 'ū'
    RI = 'ṛ'; RII = 'ṝ'; E = 'e'; AI = 'ai'; O = 'o'; AU = 'au'

    # Consonants
    KA = 'k'; KHA = 'kh'; GA = 'g'; GHA = 'gh'; NGA = 'ṅ'
    CA = 'c'; CHA = 'ch'; JA = 'j'; JHA = 'jh'; NYA = 'ñ'
    TTA = 'ṭ'; TTHA = 'ṭh'; DDA = 'ḍ'; DDHA = 'ḍh'; NNA = 'ṇ'
    TA = 't'; THA = 'th'; DA = 'd'; DHA = 'dh'; NA = 'n'
    PA = 'p'; PHA = 'ph'; BA = 'b'; BHA = 'bh'; MA = 'm'
    YA = 'y'; RA = 'r'; LA = 'l'; VA = 'v'
    SHA = 'ś'; SSA = 'ṣ'; SA = 's'; HA = 'h'

    # Signs
    AN = 'ṁ'; VI = 'ḥ'; AV = "'"


class Ukr:
    """
    Українська транслітерація з діакритикою.
    Узгоджено з src/utils/text/transliteration.ts
    """
    # Голосні
    A = 'а'
    AA = 'а̄'  # а + combining macron (U+0304)
    I = 'і'
    II = '\u0131\u0304'  # ı̄ = Latin dotless i (U+0131) + macron (U+0304)
    U = 'у'
    UU = 'ӯ'  # Cyrillic у with macron (U+04EF)
    RI = 'р̣'  # р + combining dot below (U+0323)
    RII = 'р̣̄'  # р + dot below + macron
    E = 'е'
    AI = 'аі'
    O = 'о'
    AU = 'ау'

    # Приголосні
    KA = 'к'; KHA = 'кх'; GA = 'ґ'; GHA = 'ґг'; NGA = 'н̇'
    CA = 'ч'; CHA = 'чх'; JA = 'дж'; JHA = 'джх'; NYA = 'н̃'
    TTA = 'т̣'; TTHA = 'т̣х'; DDA = 'д̣'; DDHA = 'д̣г'; NNA = 'н̣'
    TA = 'т'; THA = 'тх'; DA = 'д'; DHA = 'дг'; NA = 'н'
    PA = 'п'; PHA = 'пх'; BA = 'б'; BHA = 'бг'; MA = 'м'
    YA = 'й'; RA = 'р'; LA = 'л'; VA = 'в'
    SHA = 'ш́'  # ш + combining acute (U+0301) - ш́ (палатальна)
    SSA = 'ш'  # ш (ретрофлексна)
    SA = 'с'; HA = 'х'

    # Знаки
    AN = 'м\u0307'  # м + combining dot above (U+0307) = м̇
    VI = 'х̣'  # х + combining dot below = х̣
    AV = "'"


# =============================================================================
# MAPPINGS: Balaram → Internal representation
# =============================================================================

# Ligatures (Balaram symbol → tuple of consonant codes)
LIGATURES = {
    # R-ligatures
    "'": ('P', 'R'),      # pr
    '˜': ('V', 'R'),      # vr
    '™': ('SHA', 'R'),    # śr
    '‡': ('T', 'R'),      # tr
    'ñ': ('S', 'T', 'R'),  # str (liṅgais trīn)
    '‚': ('K', 'R'),      # kr
    '‰': ('D', 'R'),      # dr
    '‹': ('DH', 'R'),     # dhr
    '•': ('M', 'R'),      # mr
    '„': ('GH', 'R'),     # ghr
    'ƒ': ('G', 'R'),      # gr

    # Retroflex
    'í': ('SS', 'TT'),    # ṣṭ
    'î': ('SS', 'TT'),    # ṣṭ
    'ï': ('SS', 'TTH'),   # ṣṭh
    'º': ('K', 'SS'),     # kṣ

    # Geminated
    '»': ('C', 'C'),      # cc
    'Ô': ('T', 'T'),      # tt
    'Ú': ('D', 'D'),      # dd
    'Ü': ('D', 'DH'),     # ddh
    'ª': ('N', 'N'),      # nn

    # Nasals
    'Ã': ('NY', 'J'),     # ñj
    'Â': ('NY', 'C'),     # ñc
    'Ëÿ': ('NG', 'G'),    # ṅg
    'Ëeÿ': ('NG', 'G', 'mE'),  # ṅge — ṅg + e mātrā (saṅgena)
    'ËEÿ': ('NG', 'G', 'mAI'),  # ṅgai — ṅg + ai mātrā (liṅgais)
    'Æÿ': ('NG', 'K'),    # ṅk
    'Éÿ': ('NG', 'K', 'SS'),  # ṅkṣ (3-consonant cluster)
    'Îÿ': ('NG', 'GH'),   # ṅgh (saṅghāta)
    'Èeÿ': ('NG', 'K', 'T'),  # ṅkt (bhuṅkte) - with e vowel
    'Êÿ': ('NG', 'KH'),   # ṅkh (sāṅkhyena)
    'µ': ('S', 'N'),      # sn
    '¢': ('G', 'N'),      # gn
    '´': ('SHA', 'N'),    # śn
    '©': ('DH', 'N'),     # dhn

    # H-ligatures
    '÷': ('H', 'Y'),      # hy
    'ë': ('H', 'Y'),      # hy
    'ö': ('H', 'M'),      # hm
    'ù': ('H', 'V'),      # hv

    # P/G/K + R ligatures
    '\u2018': ('P', 'R'),  # pr प्र (U+2018 left single quote)
    'ƒ': ('G', 'R'),       # gra ग्र (vinigrahaḥ)
    '‚': ('K', 'R'),       # kr क्र (kriyamāṇāni)

    # D-ligatures
    'à': ('D', 'BH'),     # dbh
    'â': ('D', 'Y'),      # dy
    'ã': ('D', 'V'),      # dv
    'á': ('D', 'M'),      # dm

    # Ś-ligatures
    'ê': ('SHA', 'C'),    # śc
    'ì': ('SHA', 'V'),    # śv

    # Special
    'Á': ('J', 'NY'),     # jñ
    '·': ('K', 'T'),      # kt
    'æ': ('P', 'T'),      # pt
    'œ': ('H', 'R'),      # hr
    '"': ('BH', 'R'),     # bhr (U+201D right double quote)
    '«': ('P', 'N'),      # pn
    'Ø': ('D', 'G'),      # dg (asad-grāhān)
    '›': ('S', 'R'),      # sr (ajasram) U+203A
}

# Special vowel forms
VOWEL_FORMS = {
    'ô': ('H', 'mRI'),    # hṛ
    'ò': ('H', 'mU'),     # hu
    'ó': ('H', 'mUU'),    # hū
    # Note: ç and è are handled with & in preprocessing
}

# Single consonants
CONSONANTS = {
    'k': 'K', 'K': 'KH', 'g': 'G', 'G': 'GH',
    'c': 'C', 'C': 'CH', 'j': 'J', 'J': 'JH',
    't': 'T', 'T': 'TH', 'd': 'D', 'D': 'DH', 'n': 'N',
    'p': 'P', 'P': 'PH', 'b': 'B', 'B': 'BH', 'm': 'M',
    'y': 'Y', 'Y': 'Y', 'r': 'R', 'l': 'L', 'v': 'V',
    's': 'S', 'h': 'H', 'H': 'NY',  # H = ञ् before ch
    'z': 'SHA', 'Z': 'SHA',  # ś
    'N': 'NN', 'S': 'SS', '%': 'SS',    # ṇ, ṣ
    'x': 'DD', 'X': 'DDH',   # ḍ, ḍh
    'Q': 'TTH',              # ṭh
    'q': 'TT',               # ṭ
    'f': 'K', 'ä': 'D',      # contextual
    ')': 'R',                # r in cluster (yacchraddha)
}

# Output mappings for each format
OUTPUT_MAPS = {
    OutputFormat.DEVANAGARI: {
        'K': Dev.KA, 'KH': Dev.KHA, 'G': Dev.GA, 'GH': Dev.GHA, 'NG': Dev.NGA,
        'C': Dev.CA, 'CH': Dev.CHA, 'J': Dev.JA, 'JH': Dev.JHA, 'NY': Dev.NYA,
        'TT': Dev.TTA, 'TTH': Dev.TTHA, 'DD': Dev.DDA, 'DDH': Dev.DDHA, 'NN': Dev.NNA,
        'T': Dev.TA, 'TH': Dev.THA, 'D': Dev.DA, 'DH': Dev.DHA, 'N': Dev.NA,
        'P': Dev.PA, 'PH': Dev.PHA, 'B': Dev.BA, 'BH': Dev.BHA, 'M': Dev.MA,
        'Y': Dev.YA, 'R': Dev.RA, 'L': Dev.LA, 'V': Dev.VA,
        'SHA': Dev.SHA, 'SS': Dev.SSA, 'S': Dev.SA, 'H': Dev.HA,
        'HALANT': Dev.H,
        'A': '', 'AA': Dev.m_AA, 'I': Dev.m_I, 'II': Dev.m_II,
        'U': Dev.m_U, 'UU': Dev.m_UU, 'RI': Dev.m_RI,
        'E': Dev.m_E, 'AI': Dev.m_AI, 'O': Dev.m_O, 'AU': Dev.m_AU,
        'AN': Dev.AN, 'VI': Dev.VI, 'AV': Dev.AV,
        'vA': Dev.A, 'vAA': Dev.AA, 'vI': Dev.I, 'vII': Dev.II,
        'vU': Dev.U, 'vUU': Dev.UU, 'vRI': Dev.RI,
        'vE': Dev.E, 'vAI': Dev.AI, 'vO': Dev.O, 'vAU': Dev.AU,
    },
    OutputFormat.IAST: {
        'K': 'k', 'KH': 'kh', 'G': 'g', 'GH': 'gh', 'NG': 'ṅ',
        'C': 'c', 'CH': 'ch', 'J': 'j', 'JH': 'jh', 'NY': 'ñ',
        'TT': 'ṭ', 'TTH': 'ṭh', 'DD': 'ḍ', 'DDH': 'ḍh', 'NN': 'ṇ',
        'T': 't', 'TH': 'th', 'D': 'd', 'DH': 'dh', 'N': 'n',
        'P': 'p', 'PH': 'ph', 'B': 'b', 'BH': 'bh', 'M': 'm',
        'Y': 'y', 'R': 'r', 'L': 'l', 'V': 'v',
        'SHA': 'ś', 'SS': 'ṣ', 'S': 's', 'H': 'h',
        'HALANT': '',
        'A': 'a', 'AA': 'ā', 'I': 'i', 'II': 'ī',
        'U': 'u', 'UU': 'ū', 'RI': 'ṛ',
        'E': 'e', 'AI': 'ai', 'O': 'o', 'AU': 'au',
        'AN': 'ṁ', 'VI': 'ḥ', 'AV': "'",
        'vA': 'a', 'vAA': 'ā', 'vI': 'i', 'vII': 'ī',
        'vU': 'u', 'vUU': 'ū', 'vRI': 'ṛ',
        'vE': 'e', 'vAI': 'ai', 'vO': 'o', 'vAU': 'au',
    },
    OutputFormat.UKRAINIAN: {
        # Узгоджено з src/utils/text/transliteration.ts
        # Приголосні
        'K': 'к', 'KH': 'кх', 'G': 'ґ', 'GH': 'ґг', 'NG': 'н̇',
        'C': 'ч', 'CH': 'чх', 'J': 'дж', 'JH': 'джх', 'NY': 'н̃',
        'TT': 'т̣', 'TTH': 'т̣х', 'DD': 'д̣', 'DDH': 'д̣г', 'NN': 'н̣',
        'T': 'т', 'TH': 'тх', 'D': 'д', 'DH': 'дг', 'N': 'н',
        'P': 'п', 'PH': 'пх', 'B': 'б', 'BH': 'бг', 'M': 'м',
        'Y': 'й', 'R': 'р', 'L': 'л', 'V': 'в',
        'SHA': 'ш́', 'SS': 'ш', 'S': 'с', 'H': 'х',  # ш́ = ш + акут (U+0301)
        'HALANT': '',
        # Голосні (матри)
        'A': 'а', 'AA': 'а̄', 'I': 'і', 'II': '\u0131\u0304',  # ı̄ = dotless i + macron
        'U': 'у', 'UU': 'ӯ', 'RI': 'р̣',
        'E': 'е', 'AI': 'аі', 'O': 'о', 'AU': 'ау',
        'AN': 'м\u0307', 'VI': 'х̣', 'AV': "'",  # м̇ = м + combining dot above
        # Незалежні голосні
        'vA': 'а', 'vAA': 'а̄', 'vI': 'і', 'vII': '\u0131\u0304',  # ı̄
        'vU': 'у', 'vUU': 'ӯ', 'vRI': 'р̣',
        'vE': 'е', 'vAI': 'аі', 'vO': 'о', 'vAU': 'ау',
    },
}


def decode(text: str, fmt: OutputFormat = OutputFormat.DEVANAGARI) -> str:
    """
    Декодує Balaram-текст у вибраний формат.

    Args:
        text: Balaram-кодований текст
        fmt: OutputFormat.DEVANAGARI | IAST | UKRAINIAN

    Returns:
        Декодований текст
    """
    out_map = OUTPUT_MAPS[fmt]
    result = []

    # Preprocessing
    # File corruption fixes - must come before generic <u003C> replacement
    text = text.replace('ATa<u003C>', 'ARTaM')  # artha + anusvara
    text = text.replace('<u003C>', 'M')

    # Special word patterns (must be before $ removal)
    # s$av → sarv only when NOT followed by (vowels + R) where R is repha marker
    # If pattern is s$avaR, s$avAR, s$avaAR, etc., the repha already provides the 'r'
    text = re.sub(r's\$av(?![aAeEiIuU]*R)', 'sarv', text)  # sarva/sarvai - common Sanskrit word

    # Special patterns BEFORE $ removal
    text = text.replace('$a{', '{')    # $a before vocalic ṛ = just ṛ
    text = text.replace('A{', '{')     # A before vocalic ṛ = just ṛ (A is redundant marker)
    # $ handling: if $ is between two consonants, it represents inherent 'a'
    # Otherwise, just remove it
    # $ handling is complex:
    # - s$C where C is a stop (p,t,k,etc.) = cluster (sp, st, sk) - no 'a'
    # - C$C where first C is not 's' = inherent 'a' needed

    # Special pattern: q% = ṭa (retroflex ṭ with inherent 'a')
    # The % after q is NOT ṣ, it's an 'a' marker
    text = text.replace('q%', 'q(')

    # Handle s$ clusters first (sp, st, sk, sT, sm, sn, sv, sy)
    text = re.sub(r's\$([ptkTmnsvy])', r's\1', text)
    # For other consonant + $ + consonant/ligature, add 'a'
    # Include ) as consonant and handle ligatures like Ü
    cons_pattern = r'[kKgGcCjJtTdDnpPbBmyrlvzZNSxXQfh)]'
    lig_pattern = r'[˜™‡‚‰‹•„ƒíîïºÁ·ãêìàâáæ÷ëöôòó»ÔªÀÜÚŸÃÂËÆµ¢œ\u201D›Øñ]'
    text = re.sub(rf'({cons_pattern})(\$)({cons_pattern}|{lig_pattern})', r'\1a\3', text)
    text = text.replace('$', '')  # Remove remaining $ (before vowels, etc.)
    # ) is used as 'r' in cluster position (e.g., C) = chr) - don't remove it
    # Special case: {( → { (( after vocalic ṛ is syllable boundary, not inherent 'a')
    text = text.replace('{(', '{')
    # Handle M( BEFORE ( → a conversion (anusvara with inherent 'a')
    text = text.replace('M(', 'aM')  # inherent 'a' goes BEFORE anusvara
    # ( after vowel at word boundary = ignore (boundary marker)
    text = re.sub(r'([EIOUAeioua])(\()(?=[\s\|/]|$)', r'\1', text)  # Remove ( only at word boundary
    # Handle (' as avagraha BEFORE converting ( to 'a'
    text = text.replace(''', "'")  # Normalize curly quote to straight
    text = re.sub(r"\('", "§AVA§", text)  # (' → just avagraha (( is sandhi boundary)
    # ( after consonant = inherent 'a' for that consonant (syllable separator)
    # Pattern: C( → Ca (the ( marks the preceding consonant as having inherent 'a')
    text = re.sub(r'([kKgGcCjJtTdDnpPbBmyrlvszZNSxXQfäqh])\(', r'\1a', text)

    text = text.replace('(', 'a')  # Replace any remaining ( with 'a'
    text = text.replace('=', '')  # syllable separator (like ")
    text = text.replace('M"', 'aM')  # anusvara with inherent 'a' marker
    text = text.replace('x.~', '§NG§')  # x.~ = NG (ṅ) velar nasal
    text = text.replace('iBayauR', 'iBaRyau')  # yauR pattern: repha before yu (specific)
    # yaR pattern: R after ya means repha on previous syllable, then ya
    for v in 'aeiouAEIOUäâå':
        text = text.replace(v + 'yaR', v + 'Rya')

    text = text.replace('*é', '§LL§')  # l with candrabindu (ḻ / l̐)

    # Handle "a = bra (brahma) BEFORE removing "
    # Note: Uses Unicode LEFT DOUBLE QUOTATION MARK (U+201C)
    text = text.replace('"a', '§BXA§')  # Unicode left double quote + a = bra
    # Also handle ASCII " followed by aö (brahma pattern)
    text = text.replace('"aö', '§BXA§ö')  # ASCII " + a + ö = bra + hm = brahm

    # Handle wR (independent ī) BEFORE repha - wR is NOT repha!
    text = text.replace('wR', '§vII§')  # ī independent

    # Handle repha
    # Fix yauR pattern: R after yau means repha on previous syllable
    text = text.replace('ayauR', 'aRyau')  # specific: a + yauR -> a + Ryau

    # Fix ATaR pattern: ATaR = artha (not athar)
    text = text.replace('ATaR', 'ARTa')  # ā + R + tha = artha

    # Fix aAjaR pattern: ārjava (not ājrva)
    text = text.replace('aAjaR', 'aARja')  # ā + R + ja = ārja

    text = _handle_repha(text)

    # Handle iC reversal
    text = _handle_ic_reversal(text)

    # Remove Unicode left double quote (the ASCII " is handled in main loop)
    text = text.replace('"', '')

    # Additional avagraha patterns (curly quote and (' already handled earlier)
    text = re.sub(r"(e)'", r"\1§AVA§", text)  # e' → e + avagraha
    text = re.sub(r"(Ae)'", r"\1§AVA§", text)  # Ae' → Ae + avagraha

    # Multi-char sequences
    text = text.replace('cC', '§CC§')  # cch marker
    text = text.replace('sT', '§ST§')  # sth marker
    text = text.replace('tT', '§TT§')  # tth marker
    text = text.replace('tT', '§TT§')  # tth marker
    text = text.replace('è&', '§RUU§') # rū (r with long ū)
    text = text.replace('ç&', '§RU§')  # ru (r with short u)

    i = 0
    n = len(text)
    in_ligature_cluster = False  # Flag for clusters starting with ligature (marked by ‖)

    while i < n:
        ch = text[i]

        # Handle ligature cluster marker (from i-reversal)
        if ch == '‖':
            in_ligature_cluster = True
            i += 1
            continue

        # Handle repha marker (र् / r)
        if ch == '®':
            if fmt == OutputFormat.DEVANAGARI:
                result.append(Dev.RA + Dev.H)  # र्
            elif fmt == OutputFormat.UKRAINIAN:
                result.append('р')  # Ukrainian р
            else:
                result.append('r')
            i += 1
            continue

        # Check for markers (§...§ pattern)
        if ch == '§':
            # First check if this is a valid §...§ marker
            end = text.find('§', i + 1)
            if end > i:
                marker = text[i+1:end]
                # Check if it's a known marker
                known_markers = ('CC', 'ST', 'TT', 'vII', 'RUU', 'RU', 'LL', 'BXA', 'AVA', 'NG')
                if marker in known_markers:
                    if marker == 'CC':
                        result.append(_render_cons('C', out_map, fmt))
                        if fmt == OutputFormat.DEVANAGARI:
                            result.append(out_map.get('HALANT', ''))
                        result.append(_render_cons('CH', out_map, fmt))
                        # Add halant if followed by consonant
                        if fmt == OutputFormat.DEVANAGARI:
                            pos = end + 1
                            if pos < n and (text[pos] in 'kKgGcCjJtTdDnpPbBmyrlvszZNSxXQfäh)' or text[pos] in LIGATURES):
                                result.append(out_map.get('HALANT', ''))
                    elif marker == 'ST':
                        result.append(_render_cons('S', out_map, fmt))
                        if fmt == OutputFormat.DEVANAGARI:
                            result.append(out_map.get('HALANT', ''))
                        result.append(_render_cons('TH', out_map, fmt))
                    elif marker == 'TT':
                        result.append(_render_cons('T', out_map, fmt))
                        if fmt == OutputFormat.DEVANAGARI:
                            result.append(out_map.get('HALANT', ''))
                        result.append(_render_cons('TH', out_map, fmt))
                    elif marker == 'NG':
                        # NG = ṅ (velar nasal) - add halant for cluster
                        result.append(_render_cons('NG', out_map, fmt))
                        if fmt == OutputFormat.DEVANAGARI:
                            result.append(out_map.get('HALANT', ''))
                    elif marker == 'vII':
                        result.append(out_map.get('vII', 'ī'))
                    elif marker == 'RUU':
                        # rū (r with long ū)
                        result.append(_render_cons('R', out_map, fmt))
                        result.append(out_map.get('UU', 'ū'))
                    elif marker == 'RU':
                        # ru (r with short u)
                        result.append(_render_cons('R', out_map, fmt))
                        result.append(out_map.get('U', 'u'))
                    elif marker == 'LL':
                        # l with candrabindu
                        if fmt == OutputFormat.DEVANAGARI:
                            result.append('ल्ँ')
                        else:
                            result.append('l̐')
                    elif marker == 'AVA':
                        # Avagraha (elision marker)
                        if fmt == OutputFormat.DEVANAGARI:
                            result.append('ऽ')  # Devanagari avagraha
                        else:
                            result.append("'")  # IAST/Ukrainian use apostrophe
                    elif marker == 'BXA':
                        # br ligature (brahma)
                        result.append(_render_ligature(('B', 'R'), out_map, fmt))
                        # Add inherent 'a' for IAST/Ukrainian
                        if fmt != OutputFormat.DEVANAGARI:
                            next_idx = end + 1
                            if next_idx >= n:
                                # Word end
                                result.append(out_map.get('A', 'a'))
                            else:
                                next_ch = text[next_idx]
                                if next_ch in LIGATURES:
                                    # Followed by another ligature
                                    result.append(out_map.get('A', 'a'))
                                elif next_ch in 'kKgGcCjJtTdDnpPbBmyrlvszZNSxXQfäh)':
                                    if next_idx + 1 < n and text[next_idx+1] in 'AEIOU§':
                                        result.append(out_map.get('A', 'a'))
                    i = end + 1
                    continue
            # Not a known §...§ marker, treat as i-mātrā marker from iC reversal
            result.append(out_map.get('I', 'i'))
            i += 1
            # Reset ligature cluster flag - § marks end of cluster
            in_ligature_cluster = False
            # Skip following 'a' or 'A' - it's the replaced inherent vowel
            if i < n and text[i] in 'aA':
                i += 1
            continue

        # Check for ligatures (3-char first)
        if i + 2 < n and text[i:i+3] in LIGATURES:
            lig = LIGATURES[text[i:i+3]]
            result.append(_render_ligature(lig, out_map, fmt))
            i += 3
            # Add inherent 'a' for IAST/Ukrainian
            if fmt != OutputFormat.DEVANAGARI and not lig[-1].startswith('m'):
                if i >= n:
                    # Word end
                    result.append(out_map.get('A', 'a'))
                elif text[i] in LIGATURES:
                    # Followed by another ligature
                    result.append(out_map.get('A', 'a'))
                elif text[i] in 'kKgGcCjJtTdDnpPbBmyrlvszZNSxXQfäh)':
                    # Only add 'a' if next consonant has a REAL mātrā (not 'a')
                    if i + 1 < n and text[i+1] in 'AEIOU§':
                        result.append(out_map.get('A', 'a'))
            continue

        # Check for ligatures (2-char)
        if i + 1 < n and text[i:i+2] in LIGATURES:
            lig = LIGATURES[text[i:i+2]]
            result.append(_render_ligature(lig, out_map, fmt))
            i += 2
            # Add inherent 'a' for IAST/Ukrainian
            if fmt != OutputFormat.DEVANAGARI and not lig[-1].startswith('m'):
                if i >= n:
                    # Word end
                    result.append(out_map.get('A', 'a'))
                elif text[i] in LIGATURES:
                    # Followed by another ligature
                    result.append(out_map.get('A', 'a'))
                elif text[i] in 'kKgGcCjJtTdDnpPbBmyrlvszZNSxXQfäh)':
                    if i + 1 < n and text[i+1] in 'AEIOU§':
                        result.append(out_map.get('A', 'a'))
            continue

        # Check for ligatures (1-char)
        if ch in LIGATURES:
            lig = LIGATURES[ch]
            result.append(_render_ligature(lig, out_map, fmt))
            i += 1
            # For Devanagari: decide whether to add halant after ligature
            # - If in_ligature_cluster mode (‖ marker), always add halant (cluster)
            # - If NOT in cluster mode and next consonant has §, don't add halant
            #   (ligature was OUTSIDE i-reversal, has inherent 'a')
            # - If next consonant is followed by a MĀTRĀ vowel (AIUELO), ligature has inherent 'a'
            # - For NON-GEMINATED ligatures + C + 'a': ligature has inherent 'a' (brahma pattern)
            # - Otherwise, add halant for normal cluster formation
            if fmt == OutputFormat.DEVANAGARI:
                if i < n:
                    next_ch = text[i]
                    if next_ch in 'kKgGcCjJtTdDnpPbBmyrlvszZNSxXQfäh)' or next_ch in LIGATURES:
                        should_add_halant = True
                        # Check if next consonant has § (i-mātrā from reversal)
                        if not in_ligature_cluster and i + 1 < n and text[i+1] == '§':
                            # Ligature was outside i-reversal, has inherent 'a'
                            should_add_halant = False
                        # Check if next consonant is followed by MĀTRĀ vowel (separate syllable)
                        # Note: lowercase 'a' is inherent 'a' marker, not separate syllable indicator
                        elif not in_ligature_cluster and i + 1 < n:
                            after_next = text[i+1]
                            if after_next in 'AIUELO{&':  # Capital mātrā vowels only
                                # Next consonant has mātrā, so ligature has inherent 'a' too
                                should_add_halant = False
                            # For NON-GEMINATED ligatures: if next is C + 'a', ligature has inherent 'a'
                            # Geminated = first two consonants are the same (like T,T for Ô)
                            elif after_next == 'a' and len(lig) >= 2:
                                is_geminated = (lig[0] == lig[1])
                                if not is_geminated:
                                    # Non-geminated ligature + C + a = separate syllables
                                    should_add_halant = False
                        if should_add_halant:
                            result.append(out_map.get('HALANT', ''))
            # Add inherent 'a' for IAST/Ukrainian if needed
            elif not lig[-1].startswith('m'):
                next_ch = text[i] if i < n else ''
                next2 = text[i:i+2] if i + 1 < n else ''
                # If in ligature cluster mode, don't add 'a' - ligature is part of cluster
                if in_ligature_cluster:
                    pass  # No inherent 'a' for cluster ligatures
                # " (soft sign) after ligature - check if followed by mātrā
                elif next_ch == '"':
                    # "A = ā mātrā, don't add inherent 'a' (mātrā replaces it)
                    if next2 != '"A':
                        result.append(out_map.get('A', 'a'))
                # Check if § is i-mātrā (single) or compound marker (§XX§)
                elif next_ch == '§':
                    # Look ahead to see if this is a compound marker
                    end = text.find('§', i + 1)
                    if end > i:
                        marker = text[i+1:end]
                        if marker in ('CC', 'ST', 'TT', 'vII', 'RUU', 'RU', 'LL', 'BXA', 'NG'):
                            # It's a compound marker, add inherent 'a'
                            result.append(out_map.get('A', 'a'))
                        # else it's i-mātrā, don't add 'a'
                    # else single § = i-mātrā, don't add 'a'
                elif next_ch in 'kKgGcCjJtTdDnpPbBmyrlvszZNSxXQfäh)' or next_ch in LIGATURES:
                    # Check what follows the next consonant
                    # If it's a consonant or inherent 'a' marker, we're in a cluster - no 'a'
                    # If it's a mātrā (AEIOU), add 'a' because syllable ends here
                    if i + 1 < n:
                        after_next = text[i + 1]
                        # Only add 'a' if next consonant has a real mātrā (NOT §, which is from i-reversal)
                        if after_next in 'AEIOU':
                            result.append(out_map.get('A', 'a'))
                        # § after consonant = i-mātrā from reversal, no inherent 'a' for ligature
                        # else: cluster continues, no inherent 'a'
                    # else: end of text after consonant, no 'a' needed
                elif next_ch == ' ' or next_ch == '':
                    # Word boundary or end of text - add inherent 'a'
                    result.append(out_map.get('A', 'a'))
            continue

        # Check for vowel forms
        if ch in VOWEL_FORMS:
            vf = VOWEL_FORMS[ch]
            result.append(_render_vowel_form(vf, out_map, fmt))
            i += 1
            continue

        # Check for consonants
        if ch in CONSONANTS:
            cons = CONSONANTS[ch]
            result.append(_render_cons(cons, out_map, fmt))
            i += 1
            # For Devanagari, add halant if next char is also a consonant
            # But NOT if current consonant is followed by " (soft sign = inherent 'a' present)
            if fmt == OutputFormat.DEVANAGARI:
                next_ch = text[i] if i < n else ''
                # Skip " (soft sign) when checking next consonant
                if next_ch == '"':
                    # Consonant has inherent 'a', don't add halant
                    pass
                elif next_ch in CONSONANTS or next_ch in LIGATURES:
                    result.append(out_map.get('HALANT', ''))
            continue

        # Check for independent vowels
        if ch == '@':
            if i + 1 < n and text[i+1] == 'A':
                result.append(out_map.get('vAA', 'ā'))
                i += 2
            else:
                result.append(out_map.get('vA', 'a'))
                i += 1
            continue
        if ch == 'W':
            result.append(out_map.get('vE', 'e'))
            i += 1
            continue
        if ch == 'w':
            result.append(out_map.get('vI', 'i'))
            i += 1
            continue
        if ch == '[':
            result.append(out_map.get('vRI', 'ṛ'))
            i += 1
            continue
        if ch == 'o':
            result.append(out_map.get('vU', 'u'))
            i += 1
            continue
        if ch == 'O':
            result.append(out_map.get('vUU', 'ū'))
            i += 1
            continue

        # Check for mātrās (3-char first)
        if i + 2 < n:
            three = text[i:i+3]
            if three == 'aAe' or three == 'AAe' or three == '"Ae' or three == '#Ae':
                result.append(out_map.get('O', 'o'))
                i += 3
                continue
            if three == 'aAE' or three == '"AE' or three == '#AE' or three == 'AAE':
                result.append(out_map.get('AU', 'au'))
                i += 3
                continue

        # Check for mātrās (2-char)
        if i + 1 < n:
            two = text[i:i+2]
            if two in ('AA', 'aA', '"A', '#A'):
                result.append(out_map.get('AA', 'ā'))
                i += 2
                continue
            if two in ('aI', 'AI'):
                result.append(out_map.get('II', 'ī'))
                i += 2
                continue
            if two in ('aU',):
                result.append(out_map.get('UU', 'ū'))  # long ū
                i += 2
                continue
            if two in ('Au',):
                result.append(out_map.get('U', 'u'))   # short u
                i += 2
                continue
            if two == 'AE':
                result.append(out_map.get('AU', 'au'))
                i += 2
                continue
            if two == 'aE':
                result.append(out_map.get('AI', 'ai'))
                i += 2
                continue
            if two == 'ae':
                result.append(out_map.get('E', 'e'))
                i += 2
                continue
            if two == 'Ae':
                # Ae after consonant = e mātrā (not o mātrā!)
                # o mātrā is from 3-char pattern 'aAe' (e.g., BaAe → भो)
                result.append(out_map.get('E', 'e'))
                i += 2
                continue
            if two == 'ai':
                result.append(out_map.get('I', 'i'))
                i += 2
                continue
            if two == 'au':
                result.append(out_map.get('U', 'u'))
                i += 2
                continue

        # Single 'A' handling:
        # - A at start of word = आ (independent ā)
        # - A followed by consonant = inherent 'a' marker (skip in Devanagari)
        # - A followed by repha (®), vowel, end, or space = ā mātrā
        if ch == 'A':
            next_ch = text[i+1] if i + 1 < n else ''
            cons_chars = 'kKgGcCjJtTdDnpPbBmyrlvszZNSxXQfäh)'
            # Check if this is initial position (word start)
            is_initial = (i == 0 or (i > 0 and text[i-1] in ' /|@'))
            if is_initial:
                # Initial A = independent आ
                result.append(out_map.get('vAA', 'ā'))
                i += 1
                continue
            if next_ch == 'A':
                # Part of AA pattern
                result.append(out_map.get('AA', 'ā'))
            elif next_ch == '®':
                # A before repha = ā mātrā (e.g., jA®T = जार्थ)
                result.append(out_map.get('AA', 'ā'))
            elif next_ch and (next_ch in cons_chars or next_ch in LIGATURES):
                # A followed by consonant = inherent 'a' marker
                prev_ch = text[i-1] if i > 0 else ''
                prev_two = text[i-2:i] if i >= 2 else ''
                # Exception: if preceded by ligature, A is always ā mātrā
                if prev_ch in LIGATURES or prev_two in LIGATURES:
                    result.append(out_map.get('AA', 'ā'))
                else:
                    # Inherent 'a' marker - skip for Devanagari
                    if fmt != OutputFormat.DEVANAGARI:
                        result.append(out_map.get('A', 'a'))
            else:
                # A followed by nothing, space, or vowel modifier = ā mātrā
                result.append(out_map.get('AA', 'ā'))
            i += 1
            continue
        if ch == 'I':
            result.append(out_map.get('II', 'ī'))
            i += 1
            continue
        if ch == 'L':
            result.append(out_map.get('II', 'ī'))
            i += 1
            continue
        if ch == 'U':
            result.append(out_map.get('UU', 'ū'))
            i += 1
            continue
        if ch == '&':
            result.append(out_map.get('UU', 'ū'))
            i += 1
            continue
        if ch == 'E':
            result.append(out_map.get('AI', 'ai'))
            i += 1
            continue
        if ch == 'e':  # e mātrā
            result.append(out_map.get('E', 'e'))
            i += 1
            continue
        if ch == '{':
            result.append(out_map.get('RI', 'ṛ'))
            i += 1
            continue
        if ch == 'i':  # short i mātrā
            result.append(out_map.get('I', 'i'))
            i += 1
            continue
        if ch == 'u':  # short u mātrā
            result.append(out_map.get('U', 'u'))
            i += 1
            continue

        # Punctuation
        if ch == 'M':
            result.append(out_map.get('AN', 'ṁ'))
            i += 1
            continue
        if ch == ':':
            result.append(out_map.get('VI', 'ḥ'))
            i += 1
            continue
        if ch == ',':
            result.append(out_map.get('HALANT', ''))
            i += 1
            continue
        if ch == '/':
            if i + 1 < n and text[i+1] == '/':
                result.append('॥' if fmt == OutputFormat.DEVANAGARI else '||')
                i += 2
            else:
                result.append('।' if fmt == OutputFormat.DEVANAGARI else '|')
                i += 1
            continue

        # Inherent 'a' handling
        if ch == 'a':
            # Skip 'a' before halant marker (final consonant has no vowel)
            if i + 1 < n and text[i+1] == ',':
                i += 1
                continue
            # Skip 'a' before vocalic ṛ (the ṛ replaces the inherent 'a')
            if i + 1 < n and text[i+1] == '{':
                i += 1
                continue
            # Check if this is initial 'a' (word start)
            is_initial = (i == 0 or (i > 0 and text[i-1] in ' /|'))
            if is_initial:
                # Render as full vowel अ for Devanagari, 'a' for others
                result.append(out_map.get('vA', 'a'))
            elif fmt == OutputFormat.DEVANAGARI:
                # Skip inherent 'a' for Devanagari (it's implied)
                pass
            else:
                # Keep 'a' for IAST and Ukrainian
                result.append(out_map.get('A', 'a'))
            i += 1
            continue

        # Handle " (soft sign marker - indicates inherent 'a' is present on preceding consonant)
        if ch == '"':
            # For IAST/Ukrainian, add inherent 'a' if:
            # 1. Previous character was a consonant (not a vowel form - those already have vowels)
            # 2. Either next character is a consonant, OR we're at word end
            if fmt != OutputFormat.DEVANAGARI:
                prev_ch = text[i-1] if i > 0 else ''
                next_ch = text[i+1] if i + 1 < n else ''
                is_word_end = (next_ch == '' or next_ch in ' /|,')
                is_punctuation = next_ch in ':M'  # visarga or anusvāra
                is_repha = next_ch == '®'  # repha marker
                # Only add 'a' after plain consonants, not after vowel forms
                if prev_ch in CONSONANTS:
                    if is_word_end or is_punctuation or is_repha or next_ch in CONSONANTS or next_ch in LIGATURES:
                        result.append(out_map.get('A', 'a'))
            i += 1
            continue

        # Pass through other chars
        result.append(ch)
        i += 1

    output = ''.join(result)

    # Cleanup
    output = output.replace('#', '')

    return output


def _render_cons(cons: str, out_map: dict, fmt: OutputFormat) -> str:
    """Render single consonant."""
    return out_map.get(cons, cons.lower())


def _render_ligature(lig: tuple, out_map: dict, fmt: OutputFormat) -> str:
    """Render consonant ligature."""
    result = []
    for i, cons in enumerate(lig):
        if cons.startswith('m'):  # mātrā
            result.append(out_map.get(cons[1:], ''))
        else:
            result.append(out_map.get(cons, cons.lower()))
            # Add halant only if next element is also a consonant (not mātrā)
            if i < len(lig) - 1 and not lig[i+1].startswith('m'):
                result.append(out_map.get('HALANT', ''))
    return ''.join(result)


def _render_vowel_form(vf: tuple, out_map: dict, fmt: OutputFormat) -> str:
    """Render special vowel form like hṛ, hu."""
    cons, vowel = vf
    result = out_map.get(cons, cons.lower())
    if vowel.startswith('m'):
        result += out_map.get(vowel[1:], '')
    return result


def _handle_repha(text: str) -> str:
    """Handle repha (R) positioning.

    Rules:
    1. If R comes after a vowel (aAeEiIuUoL{&), it marks repha on the NEXT consonant
       Don't move backward - leave R in place for forward attachment
    2. If R comes immediately after consonants only, move to front of cluster
    """
    cons = 'kKgGcCjJtTdDnpPbBmyrlvszZNSxXQfäh)'
    ligature_chars = "'" + '˜™‡‚‰‹•„ƒíîïºÁ·ãêìàâáæ÷ëöôòó»ÔªÀÜÚŸÃÂËÆµ¢œ"›Øñ'
    cons_all = cons + ligature_chars
    vowels = 'aAIUEL{&eou'

    chars = list(text)
    result = []

    i = 0
    while i < len(chars):
        if chars[i] == 'R':
            # Check what immediately precedes R
            if result and result[-1] in vowels:
                # R follows a vowel - it marks repha on the NEXT consonant
                # Don't move backward; just append R in place
                result.append('R')
            elif result and result[-1] in cons_all:
                # R follows consonant(s) - move to front of consonant cluster
                j = len(result) - 1
                while j > 0 and result[j-1] in cons_all:
                    j -= 1
                cluster = result[j:]
                result = result[:j]
                result.append('R')
                result.extend(cluster)
            else:
                # No preceding context - just append R
                result.append('R')
            i += 1
        else:
            result.append(chars[i])
            i += 1

    # Convert R to repha marker
    return ''.join(result).replace('R', '®')


def _handle_ic_reversal(text: str) -> str:
    """Handle iC reversal pattern."""
    cons = 'kKgGcCjJtTdDnpPbBmyrlvszZNSxXQfäh)'
    ligatures = "'" + '˜™‡‚‰‹•„ƒíîïºÁ·ãêìàâáæ÷ëöôòó»ÔªÀÜÚŸÃÂËÆµ¢œ"›Øñ' + 'ÉËÆÎÈÊÿ'
    special_markers = '®'  # Include repha marker
    cluster_chars = cons + ligatures + special_markers
    vowels = 'aAeEoOuUIL{&'

    result = []
    i = 0
    n = len(text)

    while i < n:
        if text[i] == 'i' and i + 1 < n and text[i+1] in cluster_chars:
            j = i + 1
            # Check if cluster starts with a ligature
            first_is_ligature = text[j] in ligatures
            while j < n and text[j] in cluster_chars and text[j] not in vowels:
                j += 1
            cluster = text[i+1:j]
            # If cluster starts with ligature AND has more than 1 char,
            # mark with ‖ (needs halant between components)
            if first_is_ligature and len(cluster) > 1:
                result.append('‖')
            result.append(cluster)
            result.append('§')  # i-mātrā marker
            i = j
        else:
            result.append(text[i])
            i += 1

    return ''.join(result)


# =============================================================================
# TEST & CLI
# =============================================================================

TESTS = [
    ('k(maR', 'कर्म', 'karma', 'карма'),
    ('yaÁa', 'यज्ञ', 'yajña', 'йаджн̃а'),
    ('DamaR', 'धर्म', 'dharma', 'дгарма'),
    ('k{SNa', 'कृष्ण', 'kṛṣṇa', 'кр̣шн̣а'),
    ('gAu÷M', 'गुह्यं', 'guhyaṁ', 'ґухйам̇'),
    ('˜aja', 'व्रज', 'vraja', 'враджа'),
    ('s$aÃaya', 'सञ्जय', 'sañjaya', 'сан̃джайа'),
    ('wita', 'इति', 'iti', 'іті'),
    ('ovaAca', 'उवाच', 'uvāca', 'увāча'),
    ('gItA', 'गीता', 'gītā', 'ґīтā'),
]


def run_tests():
    print("=" * 70)
    print("BALARAM MULTI-FORMAT DECODER v4.0 TESTS")
    print("=" * 70)

    for bal, exp_dev, exp_iast, exp_ukr in TESTS:
        dev = decode(bal, OutputFormat.DEVANAGARI)
        iast = decode(bal, OutputFormat.IAST)
        ukr = decode(bal, OutputFormat.UKRAINIAN)

        dev_ok = '✓' if dev == exp_dev else '✗'
        iast_ok = '✓' if iast == exp_iast else '✗'
        ukr_ok = '✓' if ukr == exp_ukr else '✗'

        print(f"\n'{bal}':")
        print(f"  {dev_ok} Dev: {dev} (exp: {exp_dev})")
        print(f"  {iast_ok} IAST: {iast} (exp: {exp_iast})")
        print(f"  {ukr_ok} Ukr: {ukr} (exp: {exp_ukr})")

    print("\n" + "=" * 70)


def main():
    if len(sys.argv) < 2:
        print("BALARAM MULTI-FORMAT DECODER v4.0")
        print("-" * 40)
        print("Вихідні формати: devanagari, iast, ukrainian")
        print()
        print("Використання:")
        print("  python decoder.py --test")
        print("  python decoder.py --dev 'text'")
        print("  python decoder.py --iast 'text'")
        print("  python decoder.py --ukr 'text'")
        print("  python decoder.py --all 'text'")
        sys.exit(0)

    if sys.argv[1] == '--test':
        run_tests()
    elif sys.argv[1] == '--dev' and len(sys.argv) > 2:
        print(decode(sys.argv[2], OutputFormat.DEVANAGARI))
    elif sys.argv[1] == '--iast' and len(sys.argv) > 2:
        print(decode(sys.argv[2], OutputFormat.IAST))
    elif sys.argv[1] == '--ukr' and len(sys.argv) > 2:
        print(decode(sys.argv[2], OutputFormat.UKRAINIAN))
    elif sys.argv[1] == '--all' and len(sys.argv) > 2:
        text = sys.argv[2]
        print(f"Input:      {text}")
        print(f"Devanāgarī: {decode(text, OutputFormat.DEVANAGARI)}")
        print(f"IAST:       {decode(text, OutputFormat.IAST)}")
        print(f"Українська: {decode(text, OutputFormat.UKRAINIAN)}")
    else:
        print(f"Unknown command: {sys.argv[1]}")


if __name__ == '__main__':
    main()
