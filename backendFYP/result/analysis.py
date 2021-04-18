from rake_nltk import Rake
import nltk.data

r=Rake()

tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')


def extract(answer):
    text=tokenizer.tokenize(data)
    r.extract_keywords_from_sentences(text)

    r.get_ranked_phrases()

    r.get_word_frequency_distribution()
    keywords=r.get_ranked_phrases()[0:15]
    return keywords



