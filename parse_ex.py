import xml.etree.ElementTree as ET
import json
import re
from collections import defaultdict


def parse_tmx(file_path):
    tree = ET.parse(file_path)
    root = tree.getroot()

    sentence_pairs = []

    # Namespace fix for xml:lang
    ns = {"xml": "http://www.w3.org/XML/1998/namespace"}

    # Find all <tu> elements
    for tu in root.findall(".//tu"):
        de_tuv = None
        en_tuv = None

        for tuv in tu.findall("tuv"):
            lang = tuv.attrib.get("{http://www.w3.org/XML/1998/namespace}lang")  # Correct way to get xml:lang
            if lang == "de":
                de_tuv = tuv
            elif lang == "en":
                en_tuv = tuv

        if de_tuv is not None and en_tuv is not None:
            de_text = de_tuv.find("seg").text.strip()
            en_text = en_tuv.find("seg").text.strip()
            sentence_pairs.append((de_text, en_text))

    return sentence_pairs

def create_word_examples(sentence_pairs):
    word_examples = defaultdict(list)

    for de_sentence, en_sentence in sentence_pairs:
        words = set(re.findall(r"\b\w+\b", de_sentence, re.UNICODE))  # Extract words

        for word in words:
            word = word.lower()  # Normalize to lowercase
            if len(word_examples[word]) < 4:  # Keep only 3-4 sentences per word
                word_examples[word].append((de_sentence, en_sentence))

    return word_examples

# Load TMX
tmx_file = "public/de-en.tmx"
pairs = parse_tmx(tmx_file)
word_to_examples = create_word_examples(pairs)

# Save as JSON
with open("word_examples.json", "w", encoding="utf-8") as f:
    json.dump(word_to_examples, f, ensure_ascii=False, indent=2)

print("✅ JSON file saved!")
