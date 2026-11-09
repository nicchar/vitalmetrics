# A/B-Test Wechseljahre (30.10.2026): Gewicht-Hook (A) vs. Nährstoff-Hook (B)
# Instagram B = bestehendes Karussell 05_post_wechseljahre-teller (12:00), hier nur A neu.
# Pinterest: A und B mit identischem Foto und Layout, nur der Hook unterscheidet sich.

DISCLAIMER = '*EU-zugelassene gesundheitsbezogene Angabe. WellANNI ist kein Medizinprodukt und ersetzt keine ärztliche Beratung.'
DS = DISCLAIMER.replace('*', '\\*')
LP = 'https://wellanni.de/wechseljahre-gewicht-energie.html'

POSTS = [
dict(id='test-a_post_wechseljahre-gewicht', folder='instagram', fmt='post', day='Fr 30.10.', time='15:00', serie='Wechseljahre Test A',
  title='Karussell Test A: Wechseljahre – warum die alte Diät nicht mehr klappt', link=LP,
  slides=[
    dict(t='cover', kicker='Wechseljahre', title='Wechseljahre:\nWarum die alte\n*Diät nicht\nmehr klappt.*', sub='Gleich viel gegessen, trotzdem mehr auf der Waage? Das hat Gründe.'),
    dict(t='list', kicker='Was sich verändert', title='Das ist keine\n*Einbildung*', items=[
        ('Die Hormone stellen sich um', 'Viele Frauen nehmen in den Wechseljahren etwas zu, oft am Bauch.'),
        ('Die Muskeln werden weniger', 'Ohne Gegenhalten nimmt Muskelmasse mit den Jahren ab.'),
        ('Der Schlaf wird unruhiger', 'Wer schlecht schläft, hat oft mehr Appetit.')],
        foot='Quelle u. a.: gesund.bund.de (Bundesgesundheitsministerium)'),
    dict(t='list', kicker='Statt nur weniger essen', title='Was jetzt\n*mehr bringt*', items=[
        ('Eiweiß in jede Mahlzeit', 'Quark, Skyr, Hülsenfrüchte, Eier, Fisch.'),
        ('Gemüse und Ballaststoffe', 'Sie machen lange satt.'),
        ('Krafttraining 2× pro Woche', 'So empfiehlt es die WHO für Erwachsene.')],
        foot='Eiweiß trägt zur Erhaltung von Muskelmasse bei.\\*'),
    dict(t='big', kicker='Satt bis mittags', big='Skyr mit\nWalnüssen', bigsize=120, title='und Zimt: *24 g Eiweiß* in 3 Minuten. Das Rezept steht auf wellanni.de.', size=62),
    dict(t='end', title='Speichern und\nan die *Freundin*\nschicken.', size=96, sub='Gewicht und Eiweiß im Blick, ohne Diätzwang: WellANNI-App, Link in Bio.', foot=DS),
  ],
  caption="""Wechseljahre: Warum die alte Diät nicht mehr klappt 🌿

Gleich viel gegessen und trotzdem zugenommen? Das liegt nicht an fehlender Disziplin. Viele Frauen nehmen in den Wechseljahren etwas zu, oft am Bauch. Dazu kommt: Ohne Gegenhalten nehmen die Muskeln mit den Jahren ab, und unruhiger Schlaf macht oft mehr Appetit.

Strenges Hungern hilft dann selten, denn dabei gehen auch Muskeln verloren. Was stattdessen mehr bringt:

💪 Eiweiß in jede Mahlzeit: Quark, Skyr, Hülsenfrüchte, Eier, Fisch
🥦 Gemüse und Ballaststoffe, die lange satt machen
🏋️ Krafttraining 2× pro Woche (Empfehlung der WHO)

Eiweiß trägt zur Erhaltung von Muskelmasse bei.*

Was beschäftigt dich in den Wechseljahren am meisten? 👇

📌 Speichern und an die Freundin schicken, mit der du darüber redest.

Mehr dazu: wellanni.de (Link in Bio)

""" + DISCLAIMER + """

#Wechseljahre #Perimenopause #Menopause #Frauengesundheit #WellANNI""",
  alt='5 Folien: Wechseljahre, warum die alte Diät nicht mehr klappt. Hormone, weniger Muskeln, unruhiger Schlaf. Was mehr bringt: Eiweiß in jede Mahlzeit, Gemüse, Krafttraining. Beispiel: Skyr mit Walnüssen.',
  note='Test A. Nicht in die Story teilen, bevor beide Varianten 48 h gelaufen sind (sonst verzerrt).'),

dict(id='test-a_pin_wechseljahre-gewicht', folder='pinterest', fmt='pin', day='30.10. 09:00', time='', serie='Wechseljahre verstehen',
  title='Wechseljahre und Gewicht: Warum die alte Diät nicht mehr klappt',
  caption='Gleich viel gegessen und trotzdem zugenommen? Viele Frauen nehmen in den Wechseljahren etwas zu – mit fehlender Disziplin hat das wenig zu tun. Warum strenge Diäten jetzt oft nicht mehr funktionieren und was stattdessen auf den Teller gehört, steht auf wellanni.de. Gewicht Wechseljahre, abnehmen Wechseljahre, Wechseljahresbauch, Ernährung Wechseljahre.',
  link=LP + '?utm_source=pinterest&utm_medium=pin&utm_campaign=wj_test&utm_content=a_gewicht',
  slides=[dict(t='photo', photo='bowl.jpg', photo_h=0.62, kicker='Wechseljahre', title='Warum die alte\n*Diät nicht mehr klappt*', sub='Gleich viel gegessen, trotzdem mehr auf der Waage?', cta='wellanni.de', size=80)],
  alt='Bunte Bowl mit Quinoa, Kichererbsen, Süßkartoffel, Avocado und Rotkohl. Text: Wechseljahre, warum die alte Diät nicht mehr klappt.',
  note='KI-modifiziert markieren'),

dict(id='test-b_pin_wechseljahre-naehrstoffe', folder='pinterest', fmt='pin', day='30.10. 16:00', time='', serie='Wechseljahre verstehen',
  title='Wechseljahre Ernährung: 4 Nährstoffe, die jetzt zählen',
  caption='In den Wechseljahren verändert sich, was der Körper braucht. Zwei der vier Nährstoffe: Calcium und Eiweiß. Welche zwei noch dazugehören und in welchen Lebensmitteln sie stecken, steht auf wellanni.de. Ernährung Wechseljahre, Nährstoffe Wechseljahre, Perimenopause Ernährung, Menopause.',
  link=LP + '?utm_source=pinterest&utm_medium=pin&utm_campaign=wj_test&utm_content=b_naehrstoffe',
  slides=[dict(t='photo', photo='bowl.jpg', photo_h=0.62, kicker='Wechseljahre', title='Diese *4 Nährstoffe*\nzählen jetzt', sub='Was in dieser Phase auf den Teller gehört.', cta='wellanni.de', size=80)],
  alt='Bunte Bowl mit Quinoa, Kichererbsen, Süßkartoffel, Avocado und Rotkohl. Text: Wechseljahre, diese 4 Nährstoffe zählen jetzt.',
  note='KI-modifiziert markieren'),
]
