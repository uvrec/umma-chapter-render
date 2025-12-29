#!/usr/bin/env python3
"""
Ukrainian PUA (Private Use Area) to Unicode mapping.
Maps BBT custom font PUA characters to proper Ukrainian Cyrillic with diacritics.
"""

UKRAINIAN_PUA_MAP = {
    '\uf101': 'а̄',   # ā
    '\uf121': 'ı̄',   # ī
    '\uf123': 'ӯ',   # ū
    '\uf115': 'р̣',   # ṛ
    '\uf125': 'р̣̄',  # ṝ
    '\uf127': 'л̣',   # ḷ
    '\uf129': 'л̣̄',  # ḹ
    '\uf10f': 'н̇',   # ṅ
    '\uf113': 'н̃',   # ñ
    '\uf111': 'н̣',   # ṇ
    '\uf109': 'м̇',   # ṁ
    '\uf119': 'т̣',   # ṭ
    '\uf103': 'д̣',   # ḍ
    '\uf11d': 'ш́',   # ś
    '\uf11f': 'ш̣',   # ṣ
    '\uf11b': 'х̣',   # ḥ
}


def decode_ukrainian_pua(text: str) -> str:
    """Convert PUA characters to proper Unicode."""
    for pua, repl in UKRAINIAN_PUA_MAP.items():
        text = text.replace(pua, repl)
    return text


if __name__ == '__main__':
    # Print mapping table
    print("Ukrainian PUA Mapping:")
    print("-" * 40)
    for pua, char in sorted(UKRAINIAN_PUA_MAP.items()):
        print(f"  {hex(ord(pua))} → '{char}'")
