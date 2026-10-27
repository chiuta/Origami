# ORIGAMI — Arta plierii hârtiei

[English](README.md) · **Română** · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

**Versiune:** 2.0.1 · **Ultima actualizare:** 2026-10-27

**Stare:** stabilă (2.0.1). Diagramele de pliere sunt schematice; pentru modelele avansate compară cu o diagramă publicată.

**Offline:** da, complet. Fără cereri externe; ghidul, animațiile și secțiunea de exersare funcționează fără rețea.

Limbile interfeței: **Română, English, Français, Italiano, Español, Português (PT), Deutsch, Magyar**

Ghid offline de origami într-un singur fișier HTML: simboluri de pliere, tehnici, baze fundamentale și 30 de modele pas cu pas.

**Live:** https://chiuta.github.io/Origami/

![Captura de ecran](screenshot.ro.png)

## Ce este

ORIGAMI este un ghid interactiv în limba română: o introducere istorică scurtă, simbolurile notației Yoshizawa–Randlett, 5 tehnici compuse, 8 baze și un catalog de 30 de modele cu diagrame schematice SVG și descrieri pe pași. Se deschide dintr-un singur fișier `index.html`, fără server și fără cont.

## Funcții

Verificate în cod și în browser (Chromium, Playwright):
- **Nou în 2.0.0:** pliuri animate (butoanele „Animează pliul” / „Redă tot” sau opțiunea de a anima trecerea la „Înainte”; respectă reduced-motion), înregistrarea modelelor proprii pas cu pas („＋ Model propriu”: formă, pliuri vale/munte și săgeți prin două clicuri, salvate local în `origami-mine`, incluse în exportul progresului) și fișă tipăribilă (tipar listă sau grilă + descărcare HTML autonom).
- Catalog cu dificultate (stele), sortare după dificultate/timp și mod pentru copii (doar modele pentru începători, text mărit).
- Catalog de 30 de modele, filtrabil după nivel (începător / intermediar / avansat) și tip (tradițional-popular / acțiune / modular), cu căutare fără diacritice (de exemplu „palarie” găsește „Pălărie”).
- Vizualizator pe pași (diagramă SVG + text), cu butoane Înapoi / Înainte, bară de progres și navigare cu săgețile stânga/dreapta; Esc închide.
- Dialogul reține focusul (Tab / Shift+Tab), blochează restul paginii cât e deschis și readuce focusul pe cardul modelului la închidere.
- „Marchează ca realizat” (salvat local, vezi mai jos).
- Printare: din vizualizator se tipăresc toți pașii modelului, nu doar pasul curent.
- Fiecare model arată atribuirea (tradițional / autor cunoscut / „neverificat”).
- Progres: contor „Realizate: N din 30”, filtru Toate / De făcut / Realizate, buton „Alege-mi un model” (alege la întâmplare dintre cele nerealizate din filtrul curent), buton „Resetează filtrele” când nu există rezultate.
- Vizualizatorul își amintește ultimul pas văzut la fiecare model („Reluat de la pasul N”); Home / End sar la primul / ultimul pas; tasta `/` mută focusul pe căutare.
- „Exportă progresul” / „Importă progresul”: copie de siguranță în fișierul `origami-progres.json` (modelele realizate și ultimul pas văzut); la import se acceptă doar fișiere ORIGAMI valide, se ignoră modelele necunoscute și nu se șterge progresul existent.
- La modelele de nivel avansat, vizualizatorul afișează o notă: diagramele sunt schematice, textul pasului are prioritate, se recomandă hârtie de probă și compararea cu o diagramă publicată.
- Respectă `prefers-reduced-motion`; layout adaptat la mobil (testat la 390 px, fără scroll orizontal).

## Funcții noi (v1.1.0, 14 octombrie 2026)

### Exersare cu repetiție spațiată
Secțiune nouă „Exersare” (meniu → Exersare): cartonașe cu **față/verso** pentru **simbolurile de pliere, tehnicile compuse, bazele și glosarul** (față = „Simbol de pliere: …”, „Tehnică: …”, „Bază: …”, „Glosar: …”; verso = descrierea din aplicație). Te autoevaluezi cu „Din nou / Greu / Bine / Ușor” (tastele 1–4; Spațiu arată răspunsul); algoritmul este **SM-2** (Woźniak, 1990), maximum 20 de cartonașe noi pe zi, cu statistici (scadente, noi, mature, reținere) și export al pachetului în `.fff.json`. Folosește modulul `srs` din fff-kit; cartonașele sunt create din textele aplicației, nu din surse externe.
- **Stocare:** progresul se păstrează în `localStorage` (cheile `fff.origami.srs.origami` și `fff.origami.srs.__decks`), doar în acest browser; poate fi șters din „Transparență” → „Șterge”.
- **Limite:** cartonașele testează *vocabularul și notația*, nu priceperea de a plia; modelele (cele 30) nu sunt cartonașe. Dacă fișierul este folosit fără kit (după `fff-kit/build.mjs remove`), secțiunea afișează un mesaj și restul ghidului funcționează normal.

### Transparență și copie de siguranță (fff-kit)

Un clic (sau Enter) pe versiunea afișată (`v 1.1.0 · 2026-10-14`) deschide fereastra „Transparență”: gazdele de rețea declarate (0 cereri externe), cheile de stocare locală cu dimensiuni, API-urile folosite, mărimea și SHA-256 al fișierului (cu verificator pentru un fișier descărcat) și **copia de siguranță** a datelor aplicației într-un fișier `.fff.json` (opțional criptat cu parolă, AES-GCM 256 / PBKDF2; parola nu poate fi recuperată), import cu confirmare și ștergerea datelor aplicației. Kitul (`fff-kit`, module: core, label, bundle, srs) este lipit în `index.html`, nu face cereri de rețea și nu schimbă datele existente; fără el aplicația funcționează la fel. Copia de siguranță include și progresul de exersare și cheile existente `origami-done` / `origami-step`. Textele kitului sunt în 8 limbi (ro, en, fr, it, es, pt, hu, de); **traducerile fr/it/es/pt/hu/de sunt automate și neverificate nativ**. Interfața aplicației însăși rămâne în română.

## Diagrame animate și filtre de dificultate (verificat în cod)

- **Diagrame animate:** din 2.0.0 fiecare dintre cele 30 de modele are pliu animat: butonul „▶ Animează pliul” interpolează între forma unui pas și a următorului, iar „Animează trecerea la pasul următor” o face automat la „Înainte”. Toate cele 187 de treceri dintre pași din cele 30 de modele au formă de start și de final, deci toate se pot anima. Respectă `prefers-reduced-motion` (atunci pasul doar se schimbă). Animația este o interpolare schematică a conturului, nu o simulare fizică a hârtiei.
- **Filtre de dificultate:** butoanele Începător / Intermediar / Avansat (15 / 11 / 4 modele), combinabile cu filtrul de tip, căutarea și Toate / De făcut / Făcute; sortare după dificultate sau timp; dificultatea apare pe carduri.
- Pentru aceste două puncte nu era nimic de adăugat; această versiune doar le documentează.

## Manual de utilizare

1. Deschide pagina și alege o secțiune din meniul de sus (pe mobil, butonul ☰).
2. Citește „Simbolurile plierii” și „Tehnici compuse” înainte de primul model.
3. La „Baze” derulează orizontal fiecare bandă de pași (cu mouse, deget sau tastatura, după ce îi dai focus).
4. La „Modele” caută după nume sau filtrează după nivel și tip.
5. Apasă pe un model; urmărește diagrama și textul și treci prin pași cu „Înainte →” sau cu săgeata dreapta.
6. La final apasă „Marchează ca realizat”; cardul primește bifa „Realizat ✓”.
7. Pentru o copie pe hârtie, apasă ⎙ din vizualizator.

## Confidențialitate și rețea

- Stocare locală (adăugire v1.1.0): exersarea cu repetiție spațiată păstrează progresul în cheile `fff.origami.srs.origami` și `fff.origami.srs.__decks`.
- Stocare locală: se folosește `localStorage`, cheile `origami-done` (modelele marcate „realizat”) și `origami-step` (ultimul pas văzut per model). Dacă browserul blochează stocarea, aplicația funcționează fără ea.
- Rețea: nu există niciun apel extern (nu am găsit în cod `fetch`, scripturi, fonturi sau imagini de pe alte gazde). Pagina include și o politică Content-Security-Policy (script pe hash, fără `'unsafe-inline'` pentru scripturi) care interzice conexiunile și resursele externe.
- Permisiuni ale browserului: nu cere niciuna. Nu conține telemetrie sau cont.

## Limite și avertismente

- Instrucțiunile sunt reconstituiri didactice, iar diagramele sunt schematice, nu desene la scară. Nu am putut verifica fizic, pe hârtie, fiecare dintre cei 30 de modele; unele pași sunt aproximativi (unghiuri, proporții) și pot diferi de variantele din cărți. Pentru modelele avansate compară cu o carte de origami.
- „Tradițional / popular” înseamnă model de circulație populară. Atribuirea este afișată în vizualizator: unde autorul este cunoscut (de exemplu modulul Sonobe — Mitsunobu Sonobe; „Toshie’s Jewel” — Toshie Takahama) este numit, iar unde proveniența nu a fost verificată, scrie explicit asta.
- Unele modele (evantai, steluță cu 6 colțuri) folosesc hârtie care nu este un pătrat simplu; nu respectă regula clasică „un singur pătrat, fără tăieturi”. „Inel din bancnotă”: exersează pe hârtie și verifică legislația locală înainte de a plia bani reali.
- Diagramele folosesc linia punctată pentru „munte”; în cărți se folosește de obicei linia punct–linie.
- Tema urmează `prefers-color-scheme` (mod întunecat automat).

## Rulare locală / offline

Descarcă `index.html` și deschide-l în browser; nu necesită internet.

## Istoric / Changelog


### 2.0.1 — 2026-10-27

Doar text: README spune exact ce acoperă diagramele animate și filtrele de dificultate (verificat în cod), linii Stare / Offline. Vezi CHANGELOG.md.
### 1.2.4 — 2026-10-22

fff-kit 1.1.4: ținte tactile și text minim.

### 1.2.3 — 2026-10-22
- fff-kit 1.1.2: PBKDF2 600 000 iterații, protecție anti-clickjacking

### 14 octombrie 2026 (v1.1.0)
- Secțiunea „Exersare” cu repetiție spațiată (fff-kit `srs`); kit fff-kit (Transparență + copie de siguranță). Catalogul de modele și diagramele nu s-au schimbat.

### 12 octombrie 2026 (v1.0.0)
- 1.2.2 — 2026-10-22: Pe mobil pagina nu mai sare la panoul de exersare la deschidere (focusul și poziția de derulare sunt restabilite); text ≥ 12 px; diagramele se scalează deja (banda de pași derulează orizontal).

- 1.0.0 — 2026-10-12: versiunea și data ultimei actualizări sunt afișate în aplicație

### 11 octombrie 2026 (a treia intrare)
- Export/import al progresului (JSON), testat: export, ștergere locală, import, fișier invalid.
- Notă în vizualizator pentru modelele avansate, despre caracterul schematic al diagramelor.

### 11 octombrie 2026
- Nou: contor de progres, filtru de stare, „Alege-mi un model”, reluare de la ultimul pas, Home/End, scurtătura `/`, resetare filtre; CSP cu hash pentru script. README: corectat că există mod întunecat. Captura de ecran actualizată.
- Accesibilitate: titlurile cardurilor (simboluri, tehnici, modele, sfaturi) sunt acum `h3` sub secțiunile `h2` (axe: 0 violări).
- Cocor: pasul 6 (plierea-petală) a fost împărțit în două diagrame (ridicarea cu cutele de referință și rezultatul „petală”), deci modelul are acum 14 pași; Pălăria: plierea borului este detaliată separat pe fața și pe spatele hârtiei (5 pași).
- Diagramele rămân schematice; modelele foarte scurte (de exemplu Peștele, 4 pași) nu au fost extinse.

## Licență

MIT — vezi fișierul LICENSE.

## Autor

Alexio — Alexandru-Ionuț Chiuță, contact: alexio@trom.tf

## Rezumat

ORIGAMI este un ghid de origami offline într-un singur fișier, în limba română: simboluri de notație, 5 tehnici compuse, 8 baze și 30 de modele pas cu pas cu diagrame schematice SVG. Nu face cereri de rețea, nu are telemetrie și stochează în localStorage doar o listă de verificare „făcut”. Vizualizatorul de pași este accesibil cu tastatura (capcană de focus, Esc, taste săgeți) și tipărește toți pașii unui model. Instrucțiunile sunt reconstrucții didactice și nu toate au fost verificate pe hârtie; atribuirea modelelor este afișată în aplicație, cu mențiunea „neverificat” acolo unde proveniența nu a putut fi confirmată.
