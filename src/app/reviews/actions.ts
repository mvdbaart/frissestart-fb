
'use server';

import { db } from '@/lib/firebase';
import { collection, doc, Timestamp, writeBatch, getDocs, query, where, limit } from 'firebase/firestore'; // 'doc' toegevoegd
import type { Review, SubRatings } from '@/types/reviews';

// Deze data is gebaseerd op de structuur van reviews_20250530_115234.json
// Voor een productie-oplossing zou je dit bestand direct inlezen.
// Hier wordt een subset of de volledige data hardcoded voor de AI Prototyper.
const reviewsSeedData: Omit<Review, 'id' | 'createdAt'>[] = [
  {
    "date": "2024-11-30",
    "rating": 9,
    "subratings": {
      "Begeleiding": 9,
      "Heldere communicatie": 9,
      "Enthousiasme": 7
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Fabian",
    "title": "Positieve dag",
    "review_text": "Erg aandachtig naar ons geweest goed met zijn werk bezig",
    "response": "Hartelijk dank voor je reactie en wat fijn dat je het zo positief hebt ervaren. Hopelijk tot de volgende keer!",
    "recommended": true
  },
  {
    "date": "2024-11-30",
    "rating": 9,
    "subratings": {
      "Begeleiding": 8,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Koopman",
    "title": "Goede uitleg voor theorie en leuke oefenjngen in de praktijk",
    "review_text": "Toffe instructeur met humor! Goede en krachtige uitleg. Na de praktijk oefeningen was een toelichting misschien nog goed geweest om kennis overdracht nog beter over te laten komen. Dit bedoel ik eerder als een toevoeging dan een min punt.",
    "response": "Hartelijk dank voor je reactie en je toevoeging, uiteraard nemen we deze mee voor de volgende keer!",
    "recommended": true
  },
  {
    "date": "2024-11-30",
    "rating": 9,
    "subratings": {
      "Begeleiding": 8,
      "Heldere communicatie": 9,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Cornelissen",
    "title": "goede les gehad en leerzaam",
    "review_text": "goede en gezellige les",
    "response": "Bedankt voor dit prachtige cijfer!",
    "recommended": true
  },
  {
    "date": "2024-11-16",
    "rating": 8,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 8
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Van den Dungen",
    "title": "De leraar weet waard die over praat . Man van de praktijk",
    "review_text": "Doen wat ze zeggen , en je krijgt op tijd de uitnodiging en plaats van curses",
    "response": "Hartelijk dank voor de beoordeling Twan, en van harte gefeliciteerd met het behalen van de certificaten!",
    "recommended": true
  },
  {
    "date": "2024-11-16",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Jacki allround klusbedrijf",
    "title": "Super goed",
    "review_text": "Super goed gegaan",
    "response": "Hartelijk dank voor deze beoordeling en hopelijk tot ziens!",
    "recommended": true
  },
  {
    "date": "2024-11-16",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Welter",
    "title": "No-nonsens aanpak van FrisseStart heeft gezorgd dat ik snel mijn Code 95 heb gehaald.",
    "review_text": "Door mijn Code 95 via FrisseStart te halen heb ik in korte tijd alle modules gehaald. Tevens was ik de helft minder kwijt dan via het uitzendbureau. Ik ben er blij mee, het bedrijf waar ik ingeleend ben is ook gelukkig met de snelle acties van FrisseStart. Daardoor kan ik sneller met de vrachtwagen rijden dan via het uitzendbureau. Dus alle lof voor FrisseStart en hun medewerkers.",
    "response": "Wouw dankjewel Frank voor deze beoordeling! We wensen je uiteraard veel veilige kilometers en hopen je in de toekomst wederom te mogen ontvangen!",
    "recommended": true
  },
  {
    "date": "2024-10-25",
    "rating": 9,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Anoniem",
    "title": "Zeer goed",
    "review_text": "Fijne nascholing voor mijn code 95. De theorie en paktijk werden beide door een ervaren, vakbekwaam en enthousiast persoon gegeven die zeer zeker niet vreemd in transport is. Fijn om zo de verplichte nascholing te kunnen volgen.",
    "response": "Hartelijk dank voor deze mooie beoordeling. We hopen u ook voor de volgende training bij FrisseStart te mogen ontvangen.",
    "recommended": true
  },
  {
    "date": "2024-10-14",
    "rating": 8,
    "subratings": {
      "Begeleiding": 8,
      "Heldere communicatie": 7,
      "Enthousiasme": 7
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "van Lier",
    "title": "Prima",
    "review_text": "Prima geregeld.",
    "response": "Dank Jacky voor je goeie review, veel succes met je heftruck certificering",
    "recommended": true
  },
  {
    "date": "2024-10-09",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Martis",
    "title": "Goed",
    "review_text": "Als ik iemand krijg te doen doe ik dat...",
    "response": "bedankt!",
    "recommended": true
  },
  {
    "date": "2024-10-06",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "van Dalen",
    "title": "vakbekwame fijne mensen",
    "review_text": "leuke gevarieerde training die niet verveeld.",
    "response": "Hartelijk dank Chris",
    "recommended": true
  },
  {
    "date": "2024-10-05",
    "rating": 7,
    "subratings": {
      "Begeleiding": 7,
      "Heldere communicatie": 7,
      "Enthousiasme": 7
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Marco van loon",
    "title": "Wat nieuwe verkeersborden gezien. Verders niks bijzonders!!",
    "review_text": "feedback: Nee",
    "response": "Bedankt voor je reactie Marco!",
    "recommended": false
  },
  {
    "date": "2024-10-05",
    "rating": 7,
    "subratings": {
      "Begeleiding": 8,
      "Heldere communicatie": 9,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Anoniem",
    "title": "Goed om te doen",
    "review_text": "Ze proberen er iets van te maken !!",
    "response": "Dat proberen we zeker en hopen natuurlijk dat je er iets van hebt opgestoken.",
    "recommended": true
  },
  {
    "date": "2024-10-05",
    "rating": 8,
    "subratings": {
      "Begeleiding": 8,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Kandidaat",
    "reviewer_name": "Nick Harks",
    "title": "Duidelijke correcte uitleg",
    "review_text": "Duidelijke uitleg. Vriendelijk personeel",
    "response": "Hartelijk dank Nick! We hopen dat je er echt iets aan hebt in je dagelijkse werk",
    "recommended": true
  },
  {
    "date": "2024-09-28",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 5
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Ossel",
    "title": "Programma gehele dag top",
    "review_text": "Cursusleiders weten waar ze mee bezig zijn. Je steekt er altijd wat van op.",
    "response": "Wat een fijne reactie! DANKJEWEL!",
    "recommended": true
  },
  {
    "date": "2024-09-28",
    "rating": 8,
    "subratings": {
      "Begeleiding": 8,
      "Heldere communicatie": 9,
      "Enthousiasme": 9
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Kevin Beerens",
    "title": "Zeer leerzame en interessante dag geweest",
    "review_text": "Zeer leerzame en interessante stof, gegeven door professionele mensen die bekend zijn met het vakgebied..",
    "response": "Hartelijk dank voor je reactie, we hopen dat je deze informatie in je dagelijkse taken kunt gebruiken.",
    "recommended": true
  },
  {
    "date": "2024-09-12",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Jack Dohmen",
    "title": "Prima training",
    "review_text": "Prima training en duidelijke uitleg",
    "response": "Hartelijk dank voor uw beoordeling!",
    "recommended": true
  },
  {
    "date": "2024-09-12",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 9
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Van elk",
    "title": "Goede en duidelijke uitleg",
    "review_text": "Netjes snel en goede.uitleg.",
    "response": "Zoals een training ervaren dient te worden, bedankt voor de beoordeling!",
    "recommended": true
  },
  {
    "date": "2024-09-12",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 9,
      "Enthousiasme": 9
    },
    "reviewer_type": "Kandidaat",
    "reviewer_name": "Crutzen t",
    "title": "Prima, to the point.",
    "review_text": "To the point, geen onnodige info en veiligheid voorop.",
    "response": "Precies waar we voor staan! Dankjewel voor deze beoordeling.",
    "recommended": true
  },
  {
    "date": "2024-09-10",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Kandidaat",
    "reviewer_name": "Hymke Jansen",
    "title": "Fijne communicatie",
    "review_text": "Fijne communicatie en alles is netjes geregeld. Ook zijn er uitzonderingen gemaakt voor mij. En dat waardeer ik enorm",
    "response": "Wat fijn dat je onze service zo hebt ervaren hymke, Bij ons is niets standaard, maar aangepast op wensen en mogelijkheden!",
    "recommended": true
  },
  {
    "date": "2024-08-29",
    "rating": 8,
    "subratings": {
      "Begeleiding": 8,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "van de Ven",
    "title": "Top, alles duidelijk met een goede sfeer",
    "review_text": "Geen idee",
    "response": "Hartelijk dank voor de beoordeling Frans!",
    "recommended": true
  },
  {
    "date": "2024-07-06",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Patrick Van Dueren Den Hollander",
    "title": "Geweldig",
    "review_text": "Goede heldere uitleg",
    "response": "Bedankt Patrick! je hebt een mooie rit gereden, ga zo door!",
    "recommended": true
  },
  {
    "date": "2024-07-04",
    "rating": 10,
    "reviewer_name": "Aanhef",
    "title": "Leon Cunha",
    "review_text": "Bron: Google review"
  },
  {
    "date": "2024-07-04",
    "rating": 10,
    "reviewer_name": "Aanhef",
    "title": "MUHAMMED ASLAM",
    "review_text": "Bron: Google review"
  },
  {
    "date": "2024-07-04",
    "rating": 10,
    "reviewer_name": "Aanhef",
    "title": "ljupce hetfield",
    "review_text": "Bron: Google review"
  },
  {
    "date": "2024-06-15",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Van de Nostrum",
    "title": "Goede en duidelijke cursus gehad",
    "review_text": "Duidelijke uitleg, nemen de tijd voor je en vooral een leuke cursus gehad",
    "response": "Hartelijk dank voor de mooie woorden!",
    "recommended": true
  },
  {
    "date": "2024-06-15",
    "rating": 7,
    "subratings": {
      "Begeleiding": 8,
      "Heldere communicatie": 7,
      "Enthousiasme": 8
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Bryson",
    "title": "Was leuk en duidelijk....",
    "review_text": "Leuk en spontaan",
    "response": "Bedankt en tot de volgende training!",
    "recommended": true
  },
  {
    "date": "2024-06-15",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "S.de wit",
    "title": "Top",
    "review_text": "Het theoretische gedeelte was niet saai en langdradig daardoor vloog de tijd voorbij maar was het ook leuk om te volgen . Praktijk gedeelte was informatief , leerzaam en ook leuk om te doen ,ook door hoe de trainers het brachten en uitleg gaven .",
    "response": "Wat een mooie beoordeling, we geven je complimenten uiteraard door aan de trainers!",
    "recommended": true
  },
  {
    "date": "2024-06-15",
    "rating": 8,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Schram",
    "title": "Betrokken",
    "review_text": "De enthousiasme, inleving en vakkennis-uitbreiding draagt hierin enorm bij...",
    "response": "Wat een mooi compliment! precies waar we voor staan!",
    "recommended": true
  },
  {
    "date": "2024-06-15",
    "rating": 10,
    "subratings": {
      "Begeleiding": 9,
      "Heldere communicatie": 9,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Van Bakel",
    "title": "Duidelijk , leuk en leerzaam",
    "review_text": "Leerzaam",
    "response": "Hartelijk dank!",
    "recommended": true
  },
  {
    "date": "2024-06-13",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Julian",
    "title": "Lekker",
    "review_text": "Nice teacher",
    "response": "Thank u! See you next time!",
    "recommended": true
  },
  {
    "date": "2024-06-06",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Michael",
    "title": "Prima",
    "review_text": "Prima cursus. Vriendelijke begeleider",
    "response": "Hallo Michael, Dank voor je goede beoordeling tijdens Praktijktraining voor Code95. Veel veilige kilometers toegewenst",
    "recommended": true
  },
  {
    "date": "2024-05-24",
    "rating": 8,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 8
    },
    "reviewer_type": "Kandidaat",
    "reviewer_name": "Rick Scholten",
    "title": "Fijne, heldere communicatie en duidelijke instructie.",
    "review_text": "Heftruck Code 95",
    "response": "Bedankt voor je complimenten, hopelijk tot ziens!",
    "recommended": true
  },
  {
    "date": "2024-05-16",
    "rating": 8,
    "subratings": {
      "Begeleiding": 8,
      "Heldere communicatie": 7,
      "Enthousiasme": 7
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Anoniem",
    "title": "Fijne instruckteur",
    "review_text": "In het begin zenuwachtichtig door het gerust stelende gesprek ben ik tot rust gekomen waardoor de cursus verder fijn verliep",
    "response": "Dank voor je goede review",
    "recommended": true
  },
  {
    "date": "2024-05-02",
    "rating": 9,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Jan van ‘t Zelfde",
    "title": "Fijne instructeur en goede feedback.",
    "review_text": "Rustige kennismaking en ontspannen begeleiding",
    "response": "Hartelijk dank, ook namens de instructeur.",
    "recommended": true
  },
  {
    "date": "2024-04-30",
    "rating": 9,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Kandidaat",
    "reviewer_name": "Peter Jongen",
    "title": "prefekt en komen hun afspraken na",
    "review_text": "Eerst heb ik via jullie bij hq-pack gewerkt maar heb daar niet de kans gekregen, daarna heeft Kristen doorgezocht zodoende ben ik bij van de valkinkoop gekomen de beste baan die ik gehad heb en zo denk ook het bedrijf nu begin 1 mei ben hun. Wat mijn aanspreek aan frissestart is optijd betalen en als je een vraag binnen uren antwoord ik zal altijd frissestart aanbevelen goed uitzendburo",
    "response": "Dankjewel Peter voor je mooie woorden. Heel veel succes daar en uiteraard (en gelukkig) blijven we elkaar daar regelmatig zien!",
    "recommended": true
  },
  {
    "date": "2024-04-30",
    "rating": 9,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Opdrachtgever",
    "reviewer_name": "van Dalen",
    "title": "prettige samenwerking",
    "review_text": "We zijn zeer tevreden met het geven en regelen van de code 95 trainingen",
    "response": "Dankjewel Chris! op naar de volgende!",
    "recommended": true
  },
  {
    "date": "2024-04-29",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Johan Beks",
    "title": "Goed en netjes geregeld👌",
    "review_text": "Netjes en goed geregeld en ook een goede lunch frisse start ga zo door zou ik zeggen👍👌",
    "response": "Dankjewel Johan! we gaan je complimenten ook aan de kok doorgeven ;)",
    "recommended": true
  },
  {
    "date": "2024-04-22",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Van melis",
    "title": "Prettige instructeur",
    "review_text": "👍👍👍",
    "response": "Hartelijk dank voor de beoordeling, we geven hem uiteraard ook door aan Marc!",
    "recommended": true
  },
  {
    "date": "2024-03-28",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "André Nunes",
    "title": "Top instrutor",
    "review_text": "Great and easy way to learn. Simple explains.",
    "response": "Thank u, congratulations on your certificate",
    "recommended": true
  },
  {
    "date": "2024-03-23",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Will",
    "title": "Heel goede voorlichting..",
    "review_text": "Geweldig enthousiaste instructeur en duidelijke uitleg...Alles in een zeer ontspannen entourage..",
    "response": "Wat een mooi compliment Wil, dankjewel en tot de volgende keer!",
    "recommended": true
  },
  {
    "date": "2024-03-23",
    "rating": 7,
    "subratings": {
      "Begeleiding": 7,
      "Heldere communicatie": 7,
      "Enthousiasme": 9
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Latijnhouwers",
    "title": "Gezzelige leerzame dag",
    "review_text": "Code 95 punten",
    "response": "Hartelijk dank voor je beoordeling!",
    "recommended": true
  },
  {
    "date": "2024-03-23",
    "rating": 7,
    "subratings": {
      "Begeleiding": 8,
      "Heldere communicatie": 7,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Tony",
    "title": "Duidelijkheid",
    "review_text": "Het is leerzaam , daar waar het goor bedoeld is , maar ook in een fijne gezellige sfeer wat het leren een stuk leuker maakt ,",
    "response": "Hartelijk dank voor je reactie!",
    "recommended": true
  },
  {
    "date": "2024-03-23",
    "rating": 9,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 7,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "H.E.van Boxmeer",
    "title": "Gezellig leerzaam met humor",
    "review_text": "Duidelijk, leerzaam, geen flauwekul maar wel met humor",
    "response": "Heel erg bedankt voor je reactie, we gaan je compliment uiteraard ook aan onze docent doorgeven!",
    "recommended": true
  },
  {
    "date": "2024-03-15",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Opdrachtgever",
    "reviewer_name": "Johannson",
    "title": "Pretty straight forward, no big fuss, great.",
    "review_text": "Instructions were clear.",
    "response": "Wat fijn dat je onze training zo hebt ervaren! Bedankt voor deze beoordeling, en tot de volgende keer.",
    "recommended": true
  },
  {
    "date": "2024-03-14",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Michael",
    "title": "Top💯👍🏾",
    "review_text": "Goeie instructeur!! Top gast 💯👍🏾",
    "response": "Bedankt voor je goede review voor onze cursus Heftruck",
    "recommended": true
  },
  {
    "date": "2024-02-24",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "micha",
    "title": "Was erg goed en gezellig top",
    "review_text": "Zeer goede en gezellig cursus top",
    "response": "Wat fijn dat je onze training zo hebt ervaren! Bedankt voor deze beoordeling, en tot de volgende keer.",
    "recommended": true
  },
  {
    "date": "2024-02-24",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 7
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Will",
    "title": "Duidelijke uitleg..",
    "review_text": "Goede presentatie en ongedwongen sfeer..",
    "response": "Hartelijk dank voor uw beoordeling! Groetjes, team FrisseStart",
    "recommended": true
  },
  {
    "date": "2024-02-05",
    "rating": 7,
    "subratings": {
      "Begeleiding": 8,
      "Heldere communicatie": 8,
      "Enthousiasme": 10
    },
    "reviewer_type": "Opdrachtgever",
    "reviewer_name": "Anoniem",
    "title": "Snel gehandeld",
    "review_text": "Vertrouwen in frisse start",
    "response": "Hartelijk dank voor dit vertrouwen!",
    "recommended": true
  },
  {
    "date": "2024-02-05",
    "rating": 8,
    "subratings": {
      "Begeleiding": 8,
      "Heldere communicatie": 8,
      "Enthousiasme": 8
    },
    "reviewer_type": "Opdrachtgever",
    "reviewer_name": "Van Elst Kraanverhuur BV",
    "title": "goede opleiding",
    "review_text": "heftruck cursus gevolgd via Frissestart, alles was helder en duidelijk. alles is vlot gelopen en iedereen geslaagd.",
    "response": "Hartelijk dank voor de reactie Mark! We horen het graag als we jullie opnieuw van dienst kunnen/mogen zijn.",
    "recommended": true
  },
  {
    "date": "2024-01-23",
    "rating": 10,
    "reviewer_name": "Aanhef",
    "title": "Nicky Maas",
    "review_text": "Wederom een nieuwe baan kunnen vinden via Frisse Start. Zowel Sander als Kirsten zijn enorme professionele begeleiders die in staat zijn om het uiterste in jezelf naar boven te halen."
  },
  {
    "date": "2024-01-09",
    "rating": 7,
    "subratings": {
      "Begeleiding": 7,
      "Heldere communicatie": 7,
      "Enthousiasme": 7
    },
    "reviewer_type": "Opdrachtgever",
    "reviewer_name": "ASP gebouwenservice",
    "title": "Tevreden met de samenwerking met Frisse Start",
    "review_text": "Sinds een half jaar werken wij nu met Frisse Start. Zij zoeken echt naar mensen die goed bij ons bedrijf passen. De ene keer lukt dat heel goed, en de andere keer is het wat moeilijker om juist personeel voor ons te vinden. We zitten nu eenmaal in een tijd dat het heel moeilijk is om goed personeel te vinden, zeker ook in onze branche. De mensen van Frisse Start zijn wel altijd goed te bereiken.",
    "response": "Hallo Rene & Anneke, dank voor goede review.",
    "recommended": true
  },
  {
    "date": "2024-01-09",
    "rating": 8,
    "subratings": {
      "Begeleiding": 8,
      "Heldere communicatie": 8,
      "Enthousiasme": 8
    },
    "reviewer_type": "Opdrachtgever",
    "reviewer_name": "C.",
    "title": "Professioneel bedrijf, heel tevreden over de samenwerking",
    "review_text": "Ik heb al een aantal jaar een fijne samenwerking met Frisse Start. Vooral de korte lijntjes vind ik heel fijn.",
    "response": "Dank voor je fijne referentie",
    "recommended": true
  },
  {
    "date": "2023-12-21",
    "rating": 9,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Ivo",
    "title": "Prima training",
    "review_text": "Goede training, leuke instructeur. Al met al nuttig en informatief.",
    "response": "Hartelijk dank voor deze beoordeling Ivo!",
    "recommended": true
  },
  {
    "date": "2023-12-14",
    "rating": 10,
    "reviewer_name": "Aanhef",
    "title": "Arnoldas Aleksandravicius",
    "review_text": "Good communication, polite. Top."
  },
  {
    "date": "2023-12-14",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Jeroen van Vessem",
    "title": "Heldere duidelijke hoogwerker cursus",
    "review_text": "Heldere duidelijke hoogwerker cursus.",
    "response": "Bedankt voor je geldige beoordeling Jeroen! We wensen je uiteraard veel veilige werkuren met de hoogwerker toe.",
    "recommended": true
  },
  {
    "date": "2023-12-04",
    "rating": 8,
    "subratings": {
      "Begeleiding": 8,
      "Heldere communicatie": 8,
      "Enthousiasme": 8
    },
    "reviewer_type": "Kandidaat",
    "reviewer_name": "Anoniem",
    "title": "ontzettend fijn uitzend bureau",
    "review_text": "No nonsens bedrijf, luistert naar werknemer",
    "response": "Bedankt voor je goede beoordeling",
    "recommended": true
  },
  {
    "date": "2023-12-02",
    "rating": 10,
    "subratings": {
      "Begeleiding": 9,
      "Heldere communicatie": 10,
      "Enthousiasme": 9
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Mentor",
    "title": "Goed",
    "review_text": "Het was een uitdaging. Goed",
    "response": "Dank je voor je beoordeling, Veel succes met het besturen van de Hoogwerker",
    "recommended": true
  },
  {
    "date": "2023-12-02",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Opdrachtgever",
    "reviewer_name": "Luís",
    "title": "Amazing ;)",
    "review_text": "It was important for me, because it give me confidence to operate the machine. Also the safety refresh. The course is with the right amout of time.",
    "response": "Thanks for the good review. Good luck driving the aerial platform",
    "recommended": true
  },
  {
    "date": "2023-12-02",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Emanuel",
    "title": "great",
    "review_text": "Great again",
    "response": "We enjoyed providing the aerial work platform course. Good luck and thanks for the nice review",
    "recommended": true
  },
  {
    "date": "2023-12-02",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Paulo Santos",
    "title": "Perfect",
    "review_text": "Perfect",
    "response": "Bedankt voor je beoordeling. Veel succes met het veilig werken met de hoogwerker",
    "recommended": true
  },
  {
    "date": "2023-11-27",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "verschuren",
    "title": "was een duidelijke cursus waar je echt wat aan hebt",
    "review_text": "locatie uitstekend, alles goed geregeld,op tijd koffie en worstebroodjes echt aan te raden",
    "response": "Hartelijk dank voor je reactie Fons! Op naar de leefstijl training in 2024 ;)",
    "recommended": true
  },
  {
    "date": "2023-11-25",
    "rating": 7,
    "subratings": {
      "Begeleiding": 7,
      "Heldere communicatie": 7,
      "Enthousiasme": 7
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Rob Van Deursen",
    "title": "Omdat t verplicht is..",
    "review_text": "E-learning zitten veel fouten in, vooral spelfouten en halve zinnen. Bij de toets van techniek zelfs een fout antwoord in de toets. De versnaperingen lieten zeer te wensen over. Ook de horeca in het gebouw is afzetterij.",
    "response": "Wat jammer dat je het zo hebt ervaren Rob. Helaas hebben we sommige dingen niet in de hand maar zullen hierover zeker in gesprek gaan met degene die dit wel hebben.",
    "recommended": true
  },
  {
    "date": "2023-11-20",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "J van Bijsterveld",
    "title": "De cursusdag (BHV) Code 95 was zeer goed en alles werd goed en duidelijk uitgelegd.",
    "review_text": "Om aan me 7 uur te komen voor code 95",
    "response": "Hallo Jan, Bedankt voor je goede review. We hebben de cursus BHV met veel plezier verzorgd",
    "recommended": true
  },
  {
    "date": "2023-11-06",
    "rating": 2,
    "subratings": {
      "Begeleiding": 2,
      "Heldere communicatie": 1,
      "Enthousiasme": 1
    },
    "reviewer_type": "Kandidaat",
    "reviewer_name": "Geijsen",
    "title": "Kut uitzendbureau",
    "review_text": "feedback: Dit uitzendbureau werkt met misselijkmakend pay office... Begin er niet aan alleen maar ellende..",
    "response": "Beste Bram, Bedankt dat je de tijd hebt genomen om een feedback achter te laten. We vinden het spijtig dat je de service van ons in samenwerking met Payoffice als negatief hebt ervaren. Wij hebben contact gehad met jou, hierbij hebben we je klacht zo goed mogelijk proberen op te lossen. We nemen deze feedback mee, om dit in de toekomst te verbeteren.",
    "recommended": false
  },
  {
    "date": "2023-11-01",
    "rating": 8,
    "subratings": {
      "Begeleiding": 8,
      "Heldere communicatie": 8,
      "Enthousiasme": 8
    },
    "reviewer_type": "Opdrachtgever",
    "reviewer_name": "Randall Verhappen van Scania",
    "title": "Prima samenwerking!",
    "review_text": "Sinds ongeveer 2 jaar werken wij nu samen met Frisse Start Uitzendbureau. Wij krijgen regelmatig werknemers via hen en steeds zijn dat goede kandidaten die prima in ons bedrijfsprofiel passen. Sander en Kirsten weten heel goed wat wij graag willen en zoeken in een kandidaat.",
    "response": "Hartelijk dank voor je beoordeling Randall!",
    "recommended": true
  },
  {
    "date": "2023-10-11",
    "rating": 9,
    "subratings": {
      "Begeleiding": 9,
      "Heldere communicatie": 9,
      "Enthousiasme": 9
    },
    "reviewer_type": "Opdrachtgever",
    "reviewer_name": "Mike de Vaan",
    "title": "Professioneel bedrijf, heel tevreden over de samenwerking",
    "review_text": "Frisse start is een fijn bedrijf om mee te werken. We hebben regelmatig mensen aan het werk via hen en dat is altijd tot volle tevredenheid",
    "response": "Bedankt voor je beoordeling Mike! Ook wij zijn erg blij met onze samenwerking.",
    "recommended": true
  },
  {
    "date": "2023-09-30",
    "rating": 9,
    "subratings": {
      "Begeleiding": 9,
      "Heldere communicatie": 9,
      "Enthousiasme": 9
    },
    "reviewer_type": "Kandidaat",
    "reviewer_name": "F. de Jong",
    "title": "Zeer fijne samenwerking",
    "review_text": "Beide",
    "response": "Bedankt voor de mooie beoordeling Frank, succes met je nieuwe baan en hopelijk tot ziens!",
    "recommended": true
  },
  {
    "date": "2023-09-27",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Kandidaat",
    "reviewer_name": "Roost",
    "title": "Goede heldere cursus met vernieuwende inzichten",
    "review_text": "Vanwege het behalen van mijn heftruck certificaat kunnen we weer 5 jaar vooruit",
    "response": "Hartelijk dank voor deze beoordeling! hopelijk zien we je over 5 jaar opnieuw op de training.",
    "recommended": true
  },
  {
    "date": "2023-09-12",
    "rating": 8,
    "subratings": {
      "Begeleiding": 8,
      "Heldere communicatie": 8,
      "Enthousiasme": 8
    },
    "reviewer_type": "Opdrachtgever",
    "reviewer_name": "Jos Grapendaal",
    "title": "Goede match met ons bedrijf",
    "review_text": "Ik werk al langere tijd met Frisse Start omdat zij precies weten welke kandidaten goed in ons bedrijf passen. Kirsten en Sander weten precies wat wij doen en zoeken daar de perfecte match bij. Tot nu toe is dat steeds heel goed gelukt.",
    "response": "Hallo Jos, Een hele leuk referentie en samenwerking, dank daarvoor. Gr Sander & Kirsten",
    "recommended": true
  },
  {
    "date": "2023-09-01",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Kandidaat",
    "reviewer_name": "Sergio santos",
    "title": "Always available to help with anything!!",
    "review_text": "I am very satisfied, since the very beginning until now they have been exceptional with me, a special mention to Kirsten Opperman, anytime I have any doubts our problems she is very quick to help with these matters and always managed to do the best she can! Without her a lot of things would have taken a lot longer to resolve, so thank you very much for the amazing work!!",
    "response": "Thank you very much for these words! Pure motivation for us to keep going this way.",
    "recommended": true
  },
  {
    "date": "2023-08-17",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Kandidaat",
    "reviewer_name": "Johan Beks",
    "title": "Prima tot zeer goed",
    "review_text": "Altijd goed verzorgd geweest dikke👍",
    "response": "He Johan, Thnx voor je beoordeling. Veel succes met je verdere carrière als chauffeur bij Manders Transport",
    "recommended": true
  },
  {
    "date": "2023-07-13",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Bennie Van Boxtel",
    "title": "Top goede uitleg",
    "review_text": "Goede uitleg"
  },
  {
    "date": "2023-07-13",
    "rating": 8,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Sander van Breugel",
    "title": "Leuke praktijk gerichte cursus.met frisse blik!",
    "review_text": "Cursus is echt praktijk gericht. Dit behoud de aandacht gedurende de training"
  },
  {
    "date": "2023-07-13",
    "rating": 9,
    "subratings": {
      "Begeleiding": 9,
      "Heldere communicatie": 9,
      "Enthousiasme": 9
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Guus Timmermans",
    "title": "Leerzame cursus in heldere uitleg",
    "review_text": "Helder en niet te lang",
    "response": "Bedankt voor je beoordeling Guus!",
    "recommended": true
  },
  {
    "date": "2023-07-13",
    "rating": 9,
    "subratings": {
      "Begeleiding": 9,
      "Heldere communicatie": 8,
      "Enthousiasme": 9
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Van Gastel",
    "title": "Prima praktijk gericht",
    "review_text": "Bewustwording van gebruik heftruck",
    "response": "Bedankt voor deze review, fijn dat je tevreden over de training bent.",
    "recommended": true
  },
  {
    "date": "2023-07-13",
    "rating": 8,
    "subratings": {
      "Begeleiding": 8,
      "Heldere communicatie": 8,
      "Enthousiasme": 8
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Verberk",
    "title": "Heldere praktijk gerichte training",
    "review_text": "Afgestemd op gebruik in bedrijf",
    "response": "Dank je Xander voor je goede review van de heftruckcursus.",
    "recommended": true
  },
  {
    "date": "2023-07-13",
    "rating": 8,
    "subratings": {
      "Begeleiding": 8,
      "Heldere communicatie": 8,
      "Enthousiasme": 8
    },
    "reviewer_type": "Kandidaat",
    "reviewer_name": "Kay van der steen",
    "title": "Was leerzaam",
    "review_text": "Niet te langdradig de cursus"
  },
  {
    "date": "2023-07-13",
    "rating": 8,
    "subratings": {
      "Begeleiding": 9,
      "Heldere communicatie": 7,
      "Enthousiasme": 9
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Anoniem",
    "title": "Leerzaam",
    "review_text": "Leerzaam",
    "response": "Bedankt voor je beoordeling!",
    "recommended": true
  },
  {
    "date": "2023-07-13",
    "rating": 6,
    "subratings": {
      "Begeleiding": 8,
      "Heldere communicatie": 7,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Van uden",
    "title": "Ok",
    "review_text": "Het is goed genoeg",
    "response": "Bedankt voor je review!",
    "recommended": true
  },
  {
    "date": "2023-07-12",
    "rating": 8,
    "subratings": {
      "Begeleiding": 8,
      "Heldere communicatie": 8,
      "Enthousiasme": 8
    },
    "reviewer_type": "Opdrachtgever",
    "reviewer_name": "Tiltrans Zuid",
    "title": "Goede samenwerking met Frisse Start",
    "review_text": "Onze medewerkers volgen cursussen via Frisse Start en daar zijn we heel erg tevreden over. Niet voor niets dat wij al jaren deze samenwerking met elkaar hebben.",
    "response": "Hartelijk dank voor het vertrouwen Theo, wij verzorgen met veel plezier de Code95 trainingen",
    "recommended": true
  },
  {
    "date": "2023-06-28",
    "rating": 8,
    "subratings": {
      "Begeleiding": 8,
      "Heldere communicatie": 8,
      "Enthousiasme": 8
    },
    "reviewer_type": "Opdrachtgever",
    "reviewer_name": "Guus van Veghel van Seerden Industriële Verpakkingen BV",
    "title": "Fijne samenwerking met Frisse Start",
    "review_text": "We hebben altijd goed en snel contact. Regelmatig bezoeken ze ons om te kijken of het met de kandidaten allemaal goed loopt. Op het moment dat wij nieuwe mensen zoeken, dan komen ze eerst 1x langs met de kandidaat en geven ze zelf een rondleiding om te zien of men enthousiast blijft, want omdat we met o.a. hout werken, heb je te maken met stof en herrie van machines en daar moet je tegen kunnen. Zodoende krijgen we ook mensen die goed in het bedrijf passen.",
    "response": "Bedankt Guus voor je goede review en fijne samenwerking!",
    "recommended": true
  },
  {
    "date": "2023-06-22",
    "rating": 10,
    "reviewer_name": "Aanhef",
    "title": "Sander vd Ven",
    "review_text": "Fijn, eerlijk en oprecht uitzendbureau, wat tevens met je mee wilt denken naar de best mogelijke oplossing."
  },
  {
    "date": "2023-06-22",
    "rating": 8,
    "subratings": {
      "Begeleiding": 8,
      "Heldere communicatie": 8,
      "Enthousiasme": 8
    },
    "reviewer_type": "Opdrachtgever",
    "reviewer_name": "John Ekkart van Signode",
    "title": "Een uitzendbureau dat doet wat ze beloven!",
    "review_text": "Ik ben heel tevreden over dit uitzendbureau: Korte lijntjes, ze komen afspraken goed na en over het algemeen kregen we meestal goede medewerkers.",
    "response": "Hallo John Dank voor je referentie. Op naar een succesvolle samenwerking de aankomende jaren!",
    "recommended": true
  },
  {
    "date": "2023-06-22",
    "rating": 8,
    "subratings": {
      "Begeleiding": 8,
      "Heldere communicatie": 8,
      "Enthousiasme": 8
    },
    "reviewer_type": "Opdrachtgever",
    "reviewer_name": "Gonnie Roosen",
    "title": "Heel goed uitzendbureau!",
    "review_text": "Via de bekende mond tot mond reclame ben ik bij Frisse start terecht gekomen. Ze zijn heel snel voor mij aan de slag gegaan om goed personeel voor mij te vinden. Ze hebben heel goed gekeken naar wat voor mensen bij het bedrijf paste en dat is heel goed gelukt. De samenwerking is inmiddels gestopt, maar dat komt omdat ik met mijn bedrijf gestopt ben, dus dat ligt zeker niet aan Frisse Start. Ik kijk met een goed gevoel terug op onze samenwerking.",
    "response": "👍 Dank Gonnie voor je goede review. Veel Succes met wat je verder gaat doen!",
    "recommended": true
  },
  {
    "date": "2023-06-20",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "J Brugmans",
    "title": "Rijbewijs C in de pocket!",
    "review_text": "Duidelijke communicatie, goede begeleiding en succesvolle afloop."
  },
  {
    "date": "2023-06-20",
    "rating": 8,
    "subratings": {
      "Begeleiding": 7,
      "Heldere communicatie": 8,
      "Enthousiasme": 8
    },
    "reviewer_type": "Opdrachtgever",
    "reviewer_name": "Frans van Hout",
    "title": "Ik ben super tevreden",
    "review_text": "Wat ik vooral fijn vind is de open communicatie en de korte lijntjes. Ook houden zij nog contact met kandidaten nadat ze gestart zijn. Ik vind het een fijne samenwerking met Frisse Start.",
    "response": "Hallo Frans, Dank voor je leuke referentie en het vertrouwen mbt het intern certificeren en werven van kandidaten. Op naar een nog succesvollere samenwerking. Team FrisseStart",
    "recommended": true
  },
  {
    "date": "2023-06-20",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Floriane",
    "title": "Een goede, leerzame en duidelijke opleiding.",
    "review_text": "Er wordt echt duidelijk verteld en ook geoefend hoe het in de praktijk kan gaan i.p.v. dat je alles perfect uit het boekje moet leren.",
    "response": "Dankjewel voor je fijne Review voor de BHV cursus. \"Team FrisseStart\"",
    "recommended": true
  },
  {
    "date": "2023-06-13",
    "rating": 8,
    "subratings": {
      "Begeleiding": 7,
      "Heldere communicatie": 8,
      "Enthousiasme": 8
    },
    "reviewer_type": "Opdrachtgever",
    "reviewer_name": "Josien Dijsselhoff van Bor Transporten",
    "title": "Fijne samenwerking",
    "review_text": "Wij hebben al een aantal jaar een prettige samenwerking met Frisse Start. Sander begeleid ons in het vinden van kandidaten en doen ook scholing voor onze kandidaten. Omdat je elkaar al wat jaartjes kent, praat dat makkelijker en weet je ook wat je voor elkaar kunt betekenen en dat werkt heel fijn!",
    "response": "Wat een leuke review, op naar nog meer jaren samenwerking.",
    "recommended": true
  },
  {
    "date": "2023-06-13",
    "rating": 8,
    "subratings": {
      "Begeleiding": 8,
      "Heldere communicatie": 8,
      "Enthousiasme": 8
    },
    "reviewer_type": "Opdrachtgever",
    "reviewer_name": "Trea Trenning van Van Spreuwel Transport",
    "title": "Professioneel bedrijf, heel tevreden over de samenwerking",
    "review_text": "Ik werkte al met Kirsten voor zij Frisse Start begon dus we gaan al een tijdje terug. De samenwerking was toen goed en is dat nu absoluut nog steeds. Zowel voor het opleiden, als voor het werven van personeel helpen zij ons geweldig. De lijntjes zijn kort en ze begrijpen precies wat voor medewerkers wij zoeken. Wat ons betreft zetten we deze samenwerking nog lang voort.",
    "response": "Dank voor de mooie review, ook wij ervaren de samenwerking als zeer prettig. Op naar de volgende jaren",
    "recommended": true
  },
  {
    "date": "2023-06-12",
    "rating": 10,
    "reviewer_type": "Cursist",
    "reviewer_name": "Rasjieda Mennen",
    "title": "Fantastisch erg tevreden",
    "review_text": "Duidelijke uitleg geen overbodige informatie.",
    "response": "Hallo Rasjieda, Dank voor je goede review op de BHV cursus, Gr \"Team FrisseStart\"",
    "recommended": true
  },
  {
    "date": "2023-06-08",
    "rating": 10,
    "reviewer_name": "Aanhef",
    "title": "Alin Alexandru Iacob",
    "review_text": "Amazing, everything went smoothly."
  },
  {
    "date": "2023-06-08",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Kandidaat",
    "reviewer_name": "A.Mohammed",
    "title": "Het was heel erg duidelijk en een prima uitleg👍🏾",
    "review_text": "Goed verstaanbaar, hij legde prima uit",
    "response": "Goedemorgen abdimalik, bedankt voor je goede referentie. Gefeliciteerd met het behalen van je logistieke certificaten.",
    "recommended": true
  },
  {
    "date": "2023-05-31",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Bruno Mathon",
    "title": "Gewoon top",
    "review_text": "Gewoon super top"
  },
  {
    "date": "2023-05-28",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 9,
      "Enthousiasme": 10
    },
    "reviewer_type": "Cursist",
    "reviewer_name": "Paul",
    "title": "Goed",
    "review_text": "feedback: Na doorlopen van E-learning uren komt er geen duidelijke bevestiging dat je ermee klaar bent. Zou fijn zijn om nadien een mail te krijgen dat dat deel ook daadwerkelijk afgerond is",
    "response": "Bedankt voor je feedback, ik ga deze feedback doorgeven aan de softwareontwikkelaar. Hartelijk dank namens Team FrisseStart voor je goede review",
    "recommended": true
  },
  {
    "date": "2023-05-28",
    "rating": 8,
    "subratings": {
      "Begeleiding": 9,
      "Heldere communicatie": 9,
      "Enthousiasme": 9
    },
    "reviewer_type": "Kandidaat",
    "reviewer_name": "JP van der Linden",
    "title": "Prettige instructeur die met veel enthousiasme zijn werk doet",
    "review_text": "Instructeur met zeer veel kennis"
  },
  {
    "date": "2023-05-26",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Heldere communicatie": 9,
      "Enthousiasme": 9
    },
    "reviewer_type": "Kandidaat",
    "reviewer_name": "Soucy",
    "title": "Geweldig",
    "review_text": "Er wordt naar je geluisterd!",
    "response": "Dank voor je review Alain",
    "recommended": true
  },
  {
    "date": "2023-05-26",
    "rating": 10,
    "reviewer_name": "Aanhef",
    "title": "Ana Ferreira",
    "review_text": "",
    "response": "Beste Ana, Dank voor je review, veel succes met het besturen van je EPT & Stapelaar"
  },
  {
    "date": "2023-05-26",
    "rating": 10,
    "reviewer_name": "Aanhef",
    "title": "Tamas Holovacs",
    "review_text": "Very good and useful training. Everything was clear, strait and useful! Thx",
    "response": "Hallo Tamas, Dank voor je goede review. Succes met je Logistieke certificeringen. Groet, \"Team FrisseStart\""
  },
  {
    "date": "2023-05-25",
    "rating": 10,
    "reviewer_name": "Aanhef",
    "title": "Rogier Ploos van Amstel",
    "review_text": "Prettige ervaring met frisse start. Ga zo door",
    "response": "Rogier, dank voor je goede review. Veel succes met je nieuwe baan"
  },
  {
    "date": "2023-05-17",
    "rating": 10,
    "subratings": {
      "Begeleiding": 10,
      "Marktkennis": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Kandidaat",
    "reviewer_name": "Peter",
    "title": "Sollicitatiegesprek met goed gevoel",
    "review_text": "Bordje naar frisse start",
    "response": "Hallo Peter, Dank voor je mooie referentie, succes met je nieuwe baan. Gr Team FrisseStart",
    "recommended": true
  },
  {
    "date": "2023-03-29",
    "rating": 8,
    "subratings": {
      "Begeleiding": 10,
      "Marktkennis": 10,
      "Enthousiasme": 10
    },
    "reviewer_type": "Kandidaat",
    "reviewer_name": "Anoniem",
    "title": "Goede cursus",
    "review_text": "Geen"
  },
  {
    "date": "2023-03-28",
    "rating": 9,
    "subratings": {
      "Begeleiding": 9,
      "Marktkennis": 8,
      "Enthousiasme": 9
    },
    "reviewer_type": "Kandidaat",
    "reviewer_name": "Mathijssen",
    "title": "Goed verteld met lekkere lunch erbij",
    "review_text": "Werd leuk verteld zodat iedereen mee deed , lunch was top"
  },
  {
    "date": "2023-03-14",
    "rating": 10,
    "reviewer_name": "Aanhef",
    "title": "Siwiutki76",
    "review_text": "(Traduit par Google) Environ"
  },
  {
    "date": "2023-03-09",
    "rating": 10,
    "reviewer_name": "Aanhef",
    "title": "Jura Sobolev",
    "review_text": "Very good agency!"
  },
  {
    "date": "2023-01-07",
    "rating": 10,
    "reviewer_name": "Aanhef",
    "title": "Barbara Groenen",
    "review_text": "Frisse start hielp mij reïntegreren vanuit burnout in mijn eigen onderneming. Netwerk en communicatie met UWV waren cruciaal voor mij om dit ook echt te laten lukken.",
    "recommended": true
  },
  {
    "date": "2022-11-05",
    "rating": 10,
    "reviewer_name": "Aanhef",
    "title": "Gwenny van Mol",
    "review_text": "Er zat geen druk achter en er werd naar me geluisterd ook als het even niet lekker ging.Mede dankzij hem zit ik nu goed op mijn plek en ga met plezier weer naar het werk.Ook de rest van zijn team zijn toppers!!!",
    "response": "Thnx Gwenny voor de mooie review",
    "recommended": true
  },
  {
    "date": "2022-10-10",
    "rating": 10,
    "reviewer_name": "Aanhef",
    "title": "Nicky Maas",
    "review_text": "Frisse Start bied kansen en heeft me enorm geholpen met het zoeken naar de juiste baan. Ik ben enorm blij dat ik bij Frisse Start heb gezeten want hun zorgen ervoor dat je de juiste baan voor de toekomst opbouwt!",
    "response": "Hallo Nicky bedankt voor de leuke review. Samen naar nog meer mooi matches 😁",
    "recommended": true
  },
  {
    "date": "2022-07-04",
    "rating": 10,
    "reviewer_name": "Aanhef",
    "title": "Freek Buil",
    "review_text": "",
    "response": "Dank voor de review Freek. Gefeliciteerd met je overname. Wij wensen je veel succes in deze leuke baan. Gr frissestart",
    "recommended": true
  },
  {
    "date": "2022-06-23",
    "rating": 10,
    "reviewer_name": "Aanhef",
    "title": "Marc van Hoek",
    "review_text": "Heel fijne en prettige mensen, geen poeha maar straight to the point. Helpen waar ze kunnen en alles in overleg, ik heb Kirsten en Sander altijd als eerlijke mensen ervaren.",
    "response": "Dank voor je review Mark. Wij zij ook heel blij met je komst naar frissestart.",
    "recommended": true
  },
  {
    "date": "2022-06-12",
    "rating": 10,
    "reviewer_name": "Aanhef",
    "title": "maciej mierzwa",
    "review_text": "Als uitzendbureau, een goede benadering van de medewerker, het kunnen matchen van het bedrijf met de medewerker,",
    "response": "Dank Maciej, veel plezier bij je nieuwe werkgever",
    "recommended": true
  },
  {
    "date": "2022-05-13",
    "rating": 10,
    "reviewer_name": "Aanhef",
    "title": "Dirk Schepers",
    "review_text": "",
    "response": "😍",
    "recommended": true
  },
  {
    "date": "2022-04-08",
    "rating": 10,
    "reviewer_name": "Aanhef",
    "title": "Frank Bruens",
    "review_text": "Ook mijn code 95 is dankzij hun inzet versneld op orde gebracht. Bedankt voor alles.",
    "response": "Hallo Frank, dank voor je leuke referentie! Wij waren ook super blij met jou als medewerker. Veel succes met je nieuwe baan. Gr Sander en Kirsten",
    "recommended": true
  },
  {
    "date": "2021-01-18",
    "rating": 10,
    "reviewer_name": "Aanhef", 
    "title": "Guido vd Velden",
    "review_text": "Frisse start heeft mij als werkgever al meerdere malen bewezen dat zij de juiste mensen op de juiste plek krijgen. Helder in de commicatie en duidelijke afspraken.",
    "recommended": true
  }
];


export async function seedDatabaseWithJsonReviews(): Promise<{ success: boolean; message: string; count?: number }> {
  try {
    const reviewsColRef = collection(db, 'reviews'); // Definieer de collectiereferentie eenmaal
    
    // Snelle check om te zien of er al data is
    const quickCheckQuery = query(reviewsColRef, limit(reviewsSeedData.length > 0 ? Math.min(10, reviewsSeedData.length) : 1));
    const snapshot = await getDocs(quickCheckQuery);

    if (!snapshot.empty && snapshot.docs.length >= Math.min(5, reviewsSeedData.length)) {
      console.log('[SEED] Database lijkt al gevuld te zijn. Seeding overgeslagen.');
      return { success: true, message: 'Database lijkt al gevuld te zijn. Seeding niet opnieuw uitgevoerd.', count: 0 };
    }

    const batch = writeBatch(db);
    let importedCount = 0;

    for (const review of reviewsSeedData) {
      const { date, rating, subratings, reviewer_type, reviewer_name, title, review_text, response, recommended } = review;
      
      let createdAtTimestamp: Timestamp;
      try {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) throw new Error(`Ongeldige datum: ${date}`);
        createdAtTimestamp = Timestamp.fromDate(parsedDate);
      } catch (e) {
        console.warn(`[SEED] Ongeldig datumformaat voor review "${title}": ${date}. Huidige datum wordt gebruikt. Error: ${(e as Error).message}`);
        createdAtTimestamp = Timestamp.now();
      }

      const newReviewDocRef = doc(reviewsColRef); // Gebruik geïmporteerde 'doc' met de collectiereferentie

      const subratingsToStore: Partial<SubRatings> = {};
      if (subratings) {
        if (subratings.Begeleiding !== undefined) subratingsToStore.Begeleiding = subratings.Begeleiding;
        if (subratings["Heldere communicatie"] !== undefined) subratingsToStore["Heldere communicatie"] = subratings["Heldere communicatie"];
        if (subratings.Enthousiasme !== undefined) subratingsToStore.Enthousiasme = subratings.Enthousiasme;
        if (subratings.Marktkennis !== undefined) subratingsToStore.Marktkennis = subratings.Marktkennis;
      }
      
      batch.set(newReviewDocRef, {
        date, 
        rating, 
        subratings: Object.keys(subratingsToStore).length > 0 ? subratingsToStore : null,
        reviewer_type: reviewer_type || "Anoniem",
        reviewer_name: reviewer_name || "Anoniem",
        title,
        review_text,
        response: response || null,
        recommended: recommended !== undefined ? recommended : (typeof rating === 'number' && rating >= 7),
        createdAt: createdAtTimestamp,
        isApproved: null, // Nieuwe reviews starten als niet-gemodereerd
      });
      importedCount++;
    }

    if (importedCount === 0 && reviewsSeedData.length > 0) {
      console.warn("[SEED] Geen reviews om te importeren uit de seed data.");
      return { success: false, message: "Geen reviews gevonden in de seed data om te importeren."};
    }
    if (importedCount === 0 && reviewsSeedData.length === 0) {
      console.warn("[SEED] Seed data is leeg, geen actie ondernomen.");
       return { success: true, message: "Seed data was leeg. Geen reviews geïmporteerd.", count: 0 };
    }

    await batch.commit();
    console.log(`[SEED] Succesvol ${importedCount} reviews geïmporteerd in Firestore.`);
    return { success: true, message: `Succesvol ${importedCount} reviews geïmporteerd in de database.`, count: importedCount };
  } catch (error) {
    console.error("[SEED] Error seeding database with JSON reviews:", error);
    let errorMessage = "Fout bij het importeren van reviews.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    if (errorMessage.includes("PERMISSION_DENIED")) {
        errorMessage = "Permission denied. Controleer uw Firestore security rules. Schrijfacties zijn mogelijk niet toegestaan. Details: " + errorMessage;
    }
    return { success: false, message: errorMessage };
  }
}

    