# Jurnal de modificări

## 2.0.1 — 2026-11-02 (reîmprospătare kit)

- Nou (kit): **Sincronizare între dispozitive** (`FFF.sync`) — în dialogul «Transparență» (clic pe versiune → Copie de siguranță): conectezi două dispozitive direct (WebRTC, cod/QR, fără server și fără cont) și își schimbă datele aplicației; cea mai recentă valoare câștigă, secretele (chei API, parole) nu se trimit, ștergerile nu se propagă. Aplicarea trece prin importul kitului (confirmare, chei permise, rollback).
- Nou (kit): **Istoric local — «mașina timpului»** (`FFF.history`) — instantanee automate ale datelor (IndexedDB, fără secrete), diferență față de starea curentă și restaurare reversibilă; «Șterge datele aplicației» șterge și istoricul.
- Module adăugate: `qr`, `p2p`, `sync`, `history` (+~140 KB). Versiunea aplicației nu se schimbă.

## 2.0.1 — 2026-10-27

Recenzie 2026-10-27. Doar text; codul aplicației nu s-a schimbat funcțional.

### Constatat în cod și documentat
- Diagramele animate cerute în recenzie există deja din 2.0.0: toate cele 30 de modele, toate cele 187 de treceri între pași au formă de start și final și pot fi animate.
- Filtrele de dificultate există deja (Începător / Intermediar / Avansat: 15 / 11 / 4 modele), plus sortare după dificultate sau timp.
- Nu s-a adăugat cod; README (EN, RO) spune acum exact ce acoperă ele și că animația e o interpolare schematică.

### Adăugat
- Linii „Stare” și „Offline” în README și metadate.

### Neschimbat
- Nimic șters; fără dependențe noi. Hash-urile CSP au fost recalculate.

Istoricul anterior (până la 2.0.0, 2026-10-26) este în secțiunea „Istoric / Changelog” din README.md.
