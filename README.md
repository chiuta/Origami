# ORIGAMI — Arta plierii hârtiei

Ghid offline de origami într-un singur fișier HTML: simboluri de pliere, tehnici, baze fundamentale și 30 de modele pas cu pas.

**Live:** https://chiuta.github.io/Origami/

**Ultima actualizare:** 11 octombrie 2026

![Captura de ecran](screenshot.png)

## Ce este

ORIGAMI este un ghid interactiv în limba română: o introducere istorică scurtă, simbolurile notației Yoshizawa–Randlett, 5 tehnici compuse, 8 baze și un catalog de 30 de modele cu diagrame schematice SVG și descrieri pe pași. Se deschide dintr-un singur fișier `index.html`, fără server și fără cont.

## Funcții

Verificate în cod și în browser (Chromium, Playwright):
- Catalog de 30 de modele, filtrabil după nivel (începător / intermediar / avansat) și tip (tradițional-popular / acțiune / modular), cu căutare fără diacritice (de exemplu „palarie” găsește „Pălărie”).
- Vizualizator pe pași (diagramă SVG + text), cu butoane Înapoi / Înainte, bară de progres și navigare cu săgețile stânga/dreapta; Esc închide.
- Dialogul reține focusul (Tab / Shift+Tab), blochează restul paginii cât e deschis și readuce focusul pe cardul modelului la închidere.
- „Marchează ca realizat” (salvat local, vezi mai jos).
- Printare: din vizualizator se tipăresc toți pașii modelului, nu doar pasul curent.
- Fiecare model arată atribuirea (tradițional / autor cunoscut / „neverificat”).
- Respectă `prefers-reduced-motion`; layout adaptat la mobil (testat la 390 px, fără scroll orizontal).

## Manual de utilizare

1. Deschide pagina și alege o secțiune din meniul de sus (pe mobil, butonul ☰).
2. Citește „Simbolurile plierii” și „Tehnici compuse” înainte de primul model.
3. La „Baze” derulează orizontal fiecare bandă de pași (cu mouse, deget sau tastatura, după ce îi dai focus).
4. La „Modele” caută după nume sau filtrează după nivel și tip.
5. Apasă pe un model; urmărește diagrama și textul și treci prin pași cu „Înainte →” sau cu săgeata dreapta.
6. La final apasă „Marchează ca realizat”; cardul primește bifa „Realizat ✓”.
7. Pentru o copie pe hârtie, apasă ⎙ din vizualizator.

## Confidențialitate și rețea

- Stocare locală: se folosește `localStorage`, cheia `origami-done`, doar pentru lista modelelor marcate „realizat”. Dacă browserul blochează stocarea, aplicația funcționează fără ea.
- Rețea: nu există niciun apel extern (nu am găsit în cod `fetch`, scripturi, fonturi sau imagini de pe alte gazde). Pagina include și o politică Content-Security-Policy care interzice conexiunile și resursele externe.
- Permisiuni ale browserului: nu cere niciuna. Nu conține telemetrie sau cont.

## Limite și avertismente

- Instrucțiunile sunt reconstituiri didactice, iar diagramele sunt schematice, nu desene la scară. Nu am putut verifica fizic, pe hârtie, fiecare dintre cei 30 de modele; unele pași sunt aproximativi (unghiuri, proporții) și pot diferi de variantele din cărți. Pentru modelele avansate compară cu o carte de origami.
- „Tradițional / popular” înseamnă model de circulație populară. Atribuirea este afișată în vizualizator: unde autorul este cunoscut (de exemplu modulul Sonobe — Mitsunobu Sonobe; „Toshie’s Jewel” — Toshie Takahama) este numit, iar unde proveniența nu a fost verificată, scrie explicit asta.
- Unele modele (evantai, steluță cu 6 colțuri) folosesc hârtie care nu este un pătrat simplu; nu respectă regula clasică „un singur pătrat, fără tăieturi”. „Inel din bancnotă”: exersează pe hârtie și verifică legislația locală înainte de a plia bani reali.
- Diagramele folosesc linia punctată pentru „munte”; în cărți se folosește de obicei linia punct–linie.
- Tema este deschisă la culoare (fără mod întunecat).

## Rulare locală / offline

Descarcă `index.html` și deschide-l în browser; nu necesită internet.

## Istoric / Changelog

### 11 octombrie 2026
- Accesibilitate: titlurile cardurilor (simboluri, tehnici, modele, sfaturi) sunt acum `h3` sub secțiunile `h2` (axe: 0 violări).
- Cocor: pasul 6 (plierea-petală) a fost împărțit în două diagrame (ridicarea cu cutele de referință și rezultatul „petală”), deci modelul are acum 14 pași; Pălăria: plierea borului este detaliată separat pe fața și pe spatele hârtiei (5 pași).
- Diagramele rămân schematice; modelele foarte scurte (de exemplu Peștele, 4 pași) nu au fost extinse.

## Licență

Licența nu este încă declarată.

## Autor

Alexio — Alexandru-Ionuț Chiuță, contact: alexio@trom.tf

## English summary

ORIGAMI is a single-file, offline Romanian-language origami guide: notation symbols, 5 compound techniques, 8 bases and 30 step-by-step models with schematic SVG diagrams. It makes no network requests, has no telemetry, and stores only a "done" checklist in localStorage. The step viewer is keyboard-accessible (focus trap, Esc, arrow keys) and prints all steps of a model. Instructions are didactic reconstructions and have not all been verified on paper; model attribution is shown in-app, with "unverified" where provenance could not be confirmed.
