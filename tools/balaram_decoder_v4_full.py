#!/usr/bin/env python3
"""
Balaram Font Decoder v4 - Full Implementation
Converts text encoded in the Balaram Sanskrit font to Unicode (Devanagari or IAST).

The Balaram font is a legacy font used in BBT (Bhaktivedanta Book Trust) publications
for rendering Sanskrit text. This decoder maps the font's character codes to proper
Unicode representations.

Usage:
    from balaram_decoder_v4_full import decode, OutputFormat

    devanagari = decode("saMskRta", OutputFormat.DEVANAGARI)
    iast = decode("saMskRta", OutputFormat.IAST)
"""

from enum import Enum
from typing import Dict, Optional
import re


class OutputFormat(Enum):
    """Output format for the decoder."""
    DEVANAGARI = "devanagari"
    IAST = "iast"
    HARVARD_KYOTO = "hk"  # Harvard-Kyoto transliteration


# === BALARAM TO DEVANAGARI MAPPING ===
# Balaram font uses specific character codes that map to Devanagari

# Vowels (svara)
VOWELS_DEV = {
    'a': '\u0905',    # अ
    'A': '\u0906',    # आ (or ā)
    'i': '\u0907',    # इ
    'I': '\u0908',    # ई (or ī)
    'u': '\u0909',    # उ
    'U': '\u090A',    # ऊ (or ū)
    'R': '\u090B',    # ऋ (ṛ)
    'RR': '\u0960',   # ॠ (ṝ)
    'lR': '\u090C',   # ऌ (ḷ)
    'lRR': '\u0961',  # ॡ (ḹ)
    'e': '\u090F',    # ए
    'ai': '\u0910',   # ऐ
    'o': '\u0913',    # ओ
    'au': '\u0914',   # औ
}

# Vowel matras (for combining with consonants)
MATRAS_DEV = {
    'a': '',          # inherent 'a' - no matra needed
    'A': '\u093E',    # ा
    'i': '\u093F',    # ि
    'I': '\u0940',    # ी
    'u': '\u0941',    # ु
    'U': '\u0942',    # ू
    'R': '\u0943',    # ृ
    'RR': '\u0944',   # ॄ
    'lR': '\u0962',   # ॢ
    'lRR': '\u0963',  # ॣ
    'e': '\u0947',    # े
    'ai': '\u0948',   # ै
    'o': '\u094B',    # ो
    'au': '\u094C',   # ौ
}

# Consonants (vyanjana)
CONSONANTS_DEV = {
    # Velars (kaṇṭhya)
    'k': '\u0915',    # क
    'kh': '\u0916',   # ख
    'g': '\u0917',    # ग
    'gh': '\u0918',   # घ
    'G': '\u0919',    # ङ (ṅ)

    # Palatals (tālavya)
    'c': '\u091A',    # च
    'ch': '\u091B',   # छ
    'j': '\u091C',    # ज
    'jh': '\u091D',   # झ
    'J': '\u091E',    # ञ (ñ)

    # Retroflexes (mūrdhanya)
    'T': '\u091F',    # ट (ṭ)
    'Th': '\u0920',   # ठ (ṭh)
    'D': '\u0921',    # ड (ḍ)
    'Dh': '\u0922',   # ढ (ḍh)
    'N': '\u0923',    # ण (ṇ)

    # Dentals (dantya)
    't': '\u0924',    # त
    'th': '\u0925',   # थ
    'd': '\u0926',    # द
    'dh': '\u0927',   # ध
    'n': '\u0928',    # न

    # Labials (oṣṭhya)
    'p': '\u092A',    # प
    'ph': '\u092B',   # फ
    'b': '\u092C',    # ब
    'bh': '\u092D',   # भ
    'm': '\u092E',    # म

    # Semivowels (antaḥstha)
    'y': '\u092F',    # य
    'r': '\u0930',    # र
    'l': '\u0932',    # ल
    'v': '\u0935',    # व
    'w': '\u0935',    # व (alternate)

    # Sibilants (ūṣman)
    'z': '\u0936',    # श (ś)
    'S': '\u0937',    # ष (ṣ)
    's': '\u0938',    # स

    # Aspirate
    'h': '\u0939',    # ह

    # Special consonants
    'L': '\u0933',    # ळ (retroflex l, used in Marathi/Vedic)
}

# Special characters and symbols
SPECIAL_DEV = {
    'M': '\u0902',    # ं anusvāra
    'H': '\u0903',    # ः visarga
    '.': '\u0964',    # । danda
    '..': '\u0965',   # ॥ double danda
    "'": '\u093D',    # ऽ avagraha
    'O': '\u0950',    # ॐ om
    '~': '\u0901',    # ँ chandrabindu
}

# Virama (halant) - suppresses inherent 'a'
VIRAMA = '\u094D'  # ्

# Nukta for foreign sounds
NUKTA = '\u093C'  # ़


# === BALARAM TO IAST MAPPING ===
VOWELS_IAST = {
    'a': 'a',
    'A': 'ā',
    'i': 'i',
    'I': 'ī',
    'u': 'u',
    'U': 'ū',
    'R': 'ṛ',
    'RR': 'ṝ',
    'lR': 'ḷ',
    'lRR': 'ḹ',
    'e': 'e',
    'ai': 'ai',
    'o': 'o',
    'au': 'au',
}

CONSONANTS_IAST = {
    'k': 'k',
    'kh': 'kh',
    'g': 'g',
    'gh': 'gh',
    'G': 'ṅ',
    'c': 'c',
    'ch': 'ch',
    'j': 'j',
    'jh': 'jh',
    'J': 'ñ',
    'T': 'ṭ',
    'Th': 'ṭh',
    'D': 'ḍ',
    'Dh': 'ḍh',
    'N': 'ṇ',
    't': 't',
    'th': 'th',
    'd': 'd',
    'dh': 'dh',
    'n': 'n',
    'p': 'p',
    'ph': 'ph',
    'b': 'b',
    'bh': 'bh',
    'm': 'm',
    'y': 'y',
    'r': 'r',
    'l': 'l',
    'v': 'v',
    'w': 'v',
    'z': 'ś',
    'S': 'ṣ',
    's': 's',
    'h': 'h',
    'L': 'ḻ',
}

SPECIAL_IAST = {
    'M': 'ṁ',
    'H': 'ḥ',
    '.': '.',
    '..': '॥',
    "'": "'",
    'O': 'oṁ',
    '~': 'm̐',
}


# === EXTENDED BALARAM MAPPINGS ===
# Balaram font uses specific byte values for characters
# These mappings handle the actual font encoding

BALARAM_EXTENDED: Dict[str, str] = {
    # Devanagari numerals
    '0': '०',
    '1': '१',
    '2': '२',
    '3': '३',
    '4': '४',
    '5': '५',
    '6': '६',
    '7': '७',
    '8': '८',
    '9': '९',

    # Common Balaram font specific codes
    '\x80': 'ā',  # a-macron
    '\x81': 'ī',  # i-macron
    '\x82': 'ū',  # u-macron
    '\x83': 'ṛ',  # r-underdot
    '\x84': 'ṝ',  # r-underdot-macron
    '\x85': 'ḷ',  # l-underdot
    '\x86': 'ḹ',  # l-underdot-macron
    '\x87': 'ṅ',  # n-overdot
    '\x88': 'ñ',  # n-tilde
    '\x89': 'ṭ',  # t-underdot
    '\x8a': 'ḍ',  # d-underdot
    '\x8b': 'ṇ',  # n-underdot
    '\x8c': 'ś',  # s-acute
    '\x8d': 'ṣ',  # s-underdot
    '\x8e': 'ṁ',  # m-overdot (anusvara)
    '\x8f': 'ḥ',  # h-underdot (visarga)

    # Additional special characters
    '\x90': 'Ā',
    '\x91': 'Ī',
    '\x92': 'Ū',
    '\x93': 'Ṛ',
    '\x94': 'Ṝ',
    '\x95': 'Ṅ',
    '\x96': 'Ñ',
    '\x97': 'Ṭ',
    '\x98': 'Ḍ',
    '\x99': 'Ṇ',
    '\x9a': 'Ś',
    '\x9b': 'Ṣ',
    '\x9c': 'Ṁ',
    '\x9d': 'Ḥ',
}


def _tokenize_hk(text: str) -> list:
    """
    Tokenize Harvard-Kyoto encoded text into syllables/tokens.
    Returns list of tokens that can be consonants, vowels, or special chars.
    """
    tokens = []
    i = 0
    n = len(text)

    # Define multi-char sequences (longest first)
    multi_chars = ['RR', 'lRR', 'lR', 'ai', 'au', 'kh', 'gh', 'ch', 'jh',
                   'Th', 'Dh', 'th', 'dh', 'ph', 'bh', '..']

    while i < n:
        matched = False

        # Try multi-character matches first
        for mc in multi_chars:
            if text[i:i+len(mc)] == mc:
                tokens.append(mc)
                i += len(mc)
                matched = True
                break

        if not matched:
            tokens.append(text[i])
            i += 1

    return tokens


def _is_vowel(token: str) -> bool:
    """Check if token is a vowel."""
    return token in VOWELS_DEV or token in ['ai', 'au', 'RR', 'lR', 'lRR']


def _is_consonant(token: str) -> bool:
    """Check if token is a consonant."""
    return token in CONSONANTS_DEV


def _is_special(token: str) -> bool:
    """Check if token is a special character."""
    return token in SPECIAL_DEV


def decode_to_devanagari(text: str) -> str:
    """
    Convert Harvard-Kyoto / Balaram encoded text to Devanagari Unicode.

    Args:
        text: Input text in HK/Balaram encoding

    Returns:
        Unicode Devanagari string
    """
    if not text:
        return ""

    # First apply extended Balaram mappings for special bytes
    for old, new in BALARAM_EXTENDED.items():
        text = text.replace(old, new)

    tokens = _tokenize_hk(text)
    result = []
    i = 0
    n = len(tokens)

    while i < n:
        token = tokens[i]

        # Handle whitespace and punctuation
        if token.isspace() or token in '.,;:!?()[]{}':
            result.append(token)
            i += 1
            continue

        # Handle special characters
        if _is_special(token):
            result.append(SPECIAL_DEV.get(token, token))
            i += 1
            continue

        # Handle standalone vowel at word start or after space
        if _is_vowel(token):
            result.append(VOWELS_DEV.get(token, token))
            i += 1
            continue

        # Handle consonant
        if _is_consonant(token):
            result.append(CONSONANTS_DEV.get(token, token))
            i += 1

            # Check what follows the consonant
            if i < n:
                next_token = tokens[i]

                # If next is a vowel, add matra
                if _is_vowel(next_token):
                    matra = MATRAS_DEV.get(next_token, '')
                    if matra:
                        result.append(matra)
                    i += 1
                # If next is anusvara or visarga
                elif next_token in ['M', 'H']:
                    result.append(SPECIAL_DEV.get(next_token, next_token))
                    i += 1
                # If next is consonant or end, add virama (unless inherent 'a')
                elif _is_consonant(next_token) or next_token.isspace():
                    result.append(VIRAMA)
            else:
                # End of word - add virama if no vowel follows
                pass  # Keep inherent 'a'

            continue

        # Handle anusvara/visarga separately when not after consonant
        if token == 'M':
            result.append(SPECIAL_DEV['M'])
            i += 1
            continue
        if token == 'H':
            result.append(SPECIAL_DEV['H'])
            i += 1
            continue

        # Pass through unrecognized characters
        result.append(token)
        i += 1

    return ''.join(result)


def decode_to_iast(text: str) -> str:
    """
    Convert Harvard-Kyoto / Balaram encoded text to IAST Unicode.

    Args:
        text: Input text in HK/Balaram encoding

    Returns:
        IAST transliteration string
    """
    if not text:
        return ""

    # First apply extended Balaram mappings for special bytes
    for old, new in BALARAM_EXTENDED.items():
        text = text.replace(old, new)

    tokens = _tokenize_hk(text)
    result = []

    for token in tokens:
        if token in CONSONANTS_IAST:
            result.append(CONSONANTS_IAST[token])
        elif token in VOWELS_IAST:
            result.append(VOWELS_IAST[token])
        elif token in SPECIAL_IAST:
            result.append(SPECIAL_IAST[token])
        else:
            result.append(token)

    return ''.join(result)


def decode(text: str, output_format: OutputFormat = OutputFormat.DEVANAGARI) -> str:
    """
    Main decode function. Convert Balaram/HK encoded text to specified format.

    Args:
        text: Input text in Balaram or Harvard-Kyoto encoding
        output_format: Desired output format (DEVANAGARI, IAST, or HARVARD_KYOTO)

    Returns:
        Decoded string in specified format
    """
    if not text:
        return ""

    if output_format == OutputFormat.DEVANAGARI:
        return decode_to_devanagari(text)
    elif output_format == OutputFormat.IAST:
        return decode_to_iast(text)
    elif output_format == OutputFormat.HARVARD_KYOTO:
        return text  # Already in HK format
    else:
        raise ValueError(f"Unknown output format: {output_format}")


def detect_script(text: str) -> str:
    """
    Detect the script/encoding of the input text.

    Returns:
        'devanagari', 'iast', 'hk', or 'unknown'
    """
    if not text:
        return 'unknown'

    # Check for Devanagari range
    if re.search(r'[\u0900-\u097F]', text):
        return 'devanagari'

    # Check for IAST diacritics
    if re.search(r'[āīūṛṝḷḹṅñṭḍṇśṣṁḥĀĪŪṚṜṄÑṬḌṆŚṢṀḤ]', text):
        return 'iast'

    # Check for HK uppercase markers
    if re.search(r'[AIRTDNGJS](?=[a-z])', text):
        return 'hk'

    return 'unknown'


# === COMMAND LINE INTERFACE ===
if __name__ == '__main__':
    import sys

    if len(sys.argv) < 2:
        print("Balaram Font Decoder v4")
        print("Usage: python balaram_decoder_v4_full.py <text> [format]")
        print("Formats: devanagari (default), iast, hk")
        print()
        print("Examples:")
        print("  python balaram_decoder_v4_full.py 'dharma'")
        print("  python balaram_decoder_v4_full.py 'kRSNa' iast")
        print("  python balaram_decoder_v4_full.py 'bhagavAn' devanagari")
        sys.exit(0)

    input_text = sys.argv[1]
    format_str = sys.argv[2] if len(sys.argv) > 2 else 'devanagari'

    format_map = {
        'devanagari': OutputFormat.DEVANAGARI,
        'dev': OutputFormat.DEVANAGARI,
        'd': OutputFormat.DEVANAGARI,
        'iast': OutputFormat.IAST,
        'i': OutputFormat.IAST,
        'hk': OutputFormat.HARVARD_KYOTO,
    }

    output_format = format_map.get(format_str.lower(), OutputFormat.DEVANAGARI)
    result = decode(input_text, output_format)

    print(f"Input:  {input_text}")
    print(f"Format: {output_format.value}")
    print(f"Output: {result}")
