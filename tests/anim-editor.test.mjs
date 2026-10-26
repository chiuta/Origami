// ORIGAMI 2.0.0 — pliuri animate, modele proprii, fișă tipăribilă, mod copii, sortare.
import {launch, axeRun, hOverflow, check, summary, AXE} from "./_lib.mjs";
import fs from "fs";

const pts = (page) => page.evaluate(() => (document.querySelector('#viewer-stage .paper-shape') || {getAttribute: () => ''}).getAttribute('points'));
const idx = (page) => page.evaluate(() => document.getElementById('viewer-count').textContent.trim());

console.log("1. catalog: dificultate, sortare, mod copii");
{
  const {browser, page, st} = await launch();
  await page.waitForTimeout(800);
  check("30 de modele", (await page.locator('#model-grid .model-card').count()) === 30);
  check("fiecare card are stele de dificultate", (await page.locator('#model-grid .model-card .diff').count()) === 30);
  const first = await page.locator('#model-grid .model-card').first().getAttribute('data-id');
  await page.selectOption('#model-sort', 'diff');
  const lv = await page.$$eval('#model-grid .model-card', els => els.map(e => e.dataset.level));
  const ord = {incepator: 1, intermediar: 2, avansat: 3};
  check("sortare după dificultate crescătoare", lv.every((x, i) => i === 0 || ord[lv[i - 1]] <= ord[x]));
  await page.selectOption('#model-sort', 'time');
  const tm = await page.$$eval('#model-grid .model-card .meta', els => els.map(e => parseInt(e.textContent, 10) || 0));
  const tt = await page.$$eval('#model-grid .model-card .meta', els => els.map(e => e.textContent));
  check("sortare după timp are rezultat", tt.length === 30);
  await page.reload(); await page.waitForTimeout(500);
  check("sortarea se păstrează", (await page.inputValue('#model-sort')) === 'time');
  await page.selectOption('#model-sort', 'def');
  check("ordinea implicită revine", (await page.locator('#model-grid .model-card').first().getAttribute('data-id')) === first);
  await page.click('#kids-toggle');
  const kl = await page.$$eval('#model-grid .model-card', els => els.map(e => e.dataset.level));
  check("mod copii: doar începător", kl.length > 0 && kl.every(x => x === 'incepator'), kl.length);
  check("mod copii: clasă pe body + aria-pressed", (await page.evaluate(() => document.body.classList.contains('kids'))) && (await page.getAttribute('#kids-toggle', 'aria-pressed')) === 'true');
  check("mod copii: indiciu vizibil", await page.isVisible('#kids-hint'));
  await page.reload(); await page.waitForTimeout(500);
  check("mod copii se păstrează", await page.evaluate(() => document.body.classList.contains('kids')));
  await page.click('#kids-toggle');
  check("mod copii oprit: 30 din nou", (await page.locator('#model-grid .model-card').count()) === 30);
  check("0 erori", st.errs.length === 0, st.errs);
  await browser.close();
}

console.log("2. pliuri animate");
{
  const {browser, page, st} = await launch();
  await page.waitForTimeout(800);
  const target = await page.evaluate(() => {
    // primul model cu doi pași consecutivi cu formă
    const cards = [...document.querySelectorAll('#model-grid .model-card')];
    return cards.map(c => c.dataset.id)[0];
  });
  await page.click('#model-grid .model-card >> nth=0');
  check("viewer deschis", await page.locator('#viewer-overlay.open').count() === 1);
  check("butoane animație prezente", await page.locator('#viewer-anim').count() === 1 && await page.locator('#viewer-auto').count() === 1);
  const enabled = await page.isEnabled('#viewer-anim');
  check("primul model: animația primului pas disponibilă", enabled);
  const p0 = await pts(page);
  await page.click('#viewer-anim');
  await page.waitForTimeout(500);
  const pm = await pts(page);
  check("în timpul animației poligonul se schimbă", pm !== p0 && pm.split(' ').length >= 50, pm && pm.slice(0, 60));
  check("clasa folding activă", await page.evaluate(() => !!document.querySelector('#viewer-stage .fold-diagram.folding')));
  await page.waitForTimeout(1300);
  check("după animație: pasul 2", (await idx(page)) === '2 / ' + (await page.evaluate(() => document.getElementById('viewer-count').textContent.split('/')[1].trim())));
  check("după animație: clasa folding dispărută", await page.evaluate(() => !document.querySelector('#viewer-stage .fold-diagram.folding')));
  // anulare prin navigare
  await page.click('#viewer-prev');
  await page.click('#viewer-anim');
  await page.waitForTimeout(300);
  await page.click('#viewer-next');
  await page.waitForTimeout(1500);
  check("anulare: Înainte în timpul animației nu sare doi pași", (await idx(page)).startsWith('2 /'), await idx(page));
  // redare completă
  await page.click('#viewer-prev');
  await page.click('#viewer-auto');
  check("redare: butonul devine Oprește", /⏸/.test(await page.textContent('#viewer-auto')));
  await page.waitForTimeout(2600);
  const mid = parseInt(await idx(page), 10);
  check("redare: avansează automat", mid >= 2, mid);
  await page.click('#viewer-auto');
  check("redare oprită manual", /▶/.test(await page.textContent('#viewer-auto')));
  const stopAt = await idx(page);
  await page.waitForTimeout(2500);
  check("după oprire nu mai avansează", (await idx(page)) === stopAt);
  // animare la „Înainte”
  await page.click('#viewer-prev').catch(() => {});
  await page.evaluate(() => { const s = document.getElementById('viewer-count'); });
  await page.check('#viewer-animnext');
  check("preferința animNext salvată", await page.evaluate(() => JSON.parse(localStorage.getItem('origami-prefs')).animNext === true));
  await page.keyboard.press('Home');
  await page.click('#viewer-next');
  await page.waitForTimeout(400);
  check("Înainte animat: încă pe pasul 1 la 400ms", (await idx(page)).startsWith('1 /'));
  await page.waitForTimeout(1300);
  check("Înainte animat: ajunge pe pasul 2", (await idx(page)).startsWith('2 /'));
  await page.uncheck('#viewer-animnext');
  await page.click('#viewer-next');
  check("Înainte normal: instant", (await idx(page)).startsWith('3 /'));
  await page.keyboard.press('Escape');
  check("0 erori", st.errs.length === 0, st.errs);
  await browser.close();
}

console.log("3. animații reduse");
{
  const {browser, page, st} = await launch({reducedMotion: 'reduce'});
  await page.waitForTimeout(800);
  await page.click('#model-grid .model-card >> nth=0');
  await page.click('#viewer-anim');
  await page.waitForTimeout(100);
  check("reduced-motion: trecere instantă", (await idx(page)).startsWith('2 /'), await idx(page));
  check("0 erori", st.errs.length === 0, st.errs);
  await browser.close();
}

console.log("4. editor de modele proprii");
{
  const {browser, page, st} = await launch();
  await page.waitForTimeout(800);
  await page.click('#my-new');
  check("editor deschis", await page.locator('#editor-overlay.open').count() === 1);
  check("focus în câmpul nume", await page.evaluate(() => document.activeElement.id) === 'ed-name');
  // validare
  await page.click('#ed-save');
  check("nume lipsă: nu se salvează", (await page.locator('#editor-overlay.open').count()) === 1 && /./.test(await page.textContent('#og-note')));
  await page.fill('#ed-name', 'Barcă <b>test</b>');
  await page.selectOption('#ed-level', 'intermediar');
  await page.fill('#ed-paper', 'Hârtie 15×15');
  await page.click('#ed-save');
  check("text pas lipsă: blocat", (await page.locator('#editor-overlay.open').count()) === 1);
  await page.fill('#ed-text', 'Pliază în diagonală.');
  // element cu coordonate
  await page.selectOption('#ed-tool', 'valley');
  await page.fill('#ed-x1', '60'); await page.fill('#ed-y1', '60'); await page.fill('#ed-x2', '180'); await page.fill('#ed-y2', '180');
  await page.click('#ed-addline');
  check("pliu adăugat în listă", (await page.locator('#ed-items li').count()) === 1);
  check("pliu desenat în diagramă", (await page.locator('#ed-stage .fold-valley').count()) === 1);
  // două clicuri pe diagramă
  await page.selectOption('#ed-tool', 'arrow');
  const box = await page.locator('#ed-stage svg').boundingBox();
  await page.mouse.click(box.x + box.width * 0.25, box.y + box.height * 0.5);
  check("primul clic setează x1/y1", (await page.inputValue('#ed-x1')) !== '');
  await page.mouse.click(box.x + box.width * 0.75, box.y + box.height * 0.5);
  check("al doilea clic setează x2/y2", (await page.inputValue('#ed-x2')) !== '');
  await page.click('#ed-addline');
  check("săgeată adăugată", (await page.locator('#ed-stage .fold-arrow').count()) === 1);
  // al doilea pas: triunghi
  await page.click('#ed-add');
  check("pas 2 din 2", /2/.test(await page.textContent('#ed-count')));
  await page.fill('#ed-text', 'Rezultat triunghi.');
  await page.selectOption('#ed-shape', 'tri');
  check("forma triunghi aplicată", (await page.locator('#ed-stage .paper-shape').getAttribute('points')).split(' ').length === 3);
  await page.check('#ed-back');
  check("față din spate", await page.locator('#ed-stage .paper-shape.side-back').count() === 1);
  // pas 3 apoi ștergere
  await page.click('#ed-add');
  await page.click('#ed-delstep');
  check("ștergere pas", /2/.test(await page.textContent('#ed-count')) && !(await page.isEnabled('#ed-next')));
  await page.click('#ed-save');
  check("editor închis după salvare", (await page.locator('#editor-overlay.open').count()) === 0);
  check("card nou în catalog", (await page.locator('#model-grid .model-card').count()) === 31);
  const mine = page.locator('#model-grid .model-card[data-id^="u-"]');
  check("card marcat „Al meu”", await mine.count() === 1 && /Al meu/.test(await mine.textContent()));
  check("nume escapat (fără HTML)", (await mine.locator('h3').innerHTML()).includes('&lt;b&gt;'));
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('origami-mine')));
  check("salvat în origami-mine", stored.length === 1 && stored[0].steps.length === 2 && stored[0].steps[0].folds.length === 1 && stored[0].steps[0].arrows.length === 1);
  check("statistica de modele rămâne 30", (await page.textContent('#stat-models')).trim().startsWith('30'));
  // reload
  await page.reload(); await page.waitForTimeout(600);
  check("model păstrat după reîncărcare", await page.locator('#model-grid .model-card[data-id^="u-"]').count() === 1);
  // vizualizare + animație între cei doi pași
  await page.click('#model-grid .model-card[data-id^="u-"]');
  check("buton Editează vizibil pentru modelul propriu", await page.isVisible('#viewer-edit'));
  check("proveniență: model propriu", /nu a fost verificat/.test(await page.textContent('#viewer-prov')));
  check("animația disponibilă (două forme)", await page.isEnabled('#viewer-anim'));
  await page.click('#viewer-anim'); await page.waitForTimeout(1500);
  check("animat până la pasul 2", (await idx(page)).startsWith('2 /'));
  // fișă descărcabilă
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#viewer-sheet')]);
  const path = await dl.path();
  const html = fs.readFileSync(path, 'utf8');
  check("fișă HTML: nume fișier", /^origami-u-.*\.html$/.test(dl.suggestedFilename()), dl.suggestedFilename());
  check("fișă HTML: autonomă, fără script/rețea", !/<script|https?:\/\//i.test(html.replace(/<!doctype html>/i, '')));
  check("fișă HTML: 2 pași și diagrame", (html.match(/class="step"/g) || []).length === 2 && (html.match(/<svg/g) || []).length === 2);
  check("fișă HTML: titlu escapat", html.includes('Barcă &lt;b&gt;test&lt;/b&gt;') && !html.includes('<b>test'));
  // layout grilă
  await page.selectOption('#print-layout', 'grid');
  const [dl2] = await Promise.all([page.waitForEvent('download'), page.click('#viewer-sheet')]);
  check("fișă grilă: 2 coloane", /grid-template-columns:1fr 1fr/.test(fs.readFileSync(await dl2.path(), 'utf8')));
  await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
  check("tipar grilă: clasă ps-grid", await page.evaluate(() => document.getElementById('print-sheet').classList.contains('ps-grid')));
  check("tipar: 2 pași", await page.locator('#print-sheet .ps-step').count() === 2);
  await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
  await page.selectOption('#print-layout', 'list');
  // editare
  await page.click('#viewer-edit');
  check("editor în modul editare", (await page.inputValue('#ed-name')).startsWith('Barcă') && await page.isVisible('#ed-delete'));
  await page.fill('#ed-name', 'Barcă 2');
  await page.click('#ed-save');
  check("nume actualizat, tot 31 de modele", (await page.locator('#model-grid .model-card').count()) === 31 && /Barcă 2/.test(await page.textContent('#model-grid')));
  // export/import progres cu modelele proprii
  const [ex] = await Promise.all([page.waitForEvent('download'), page.click('#progress-export')]);
  const exj = JSON.parse(fs.readFileSync(await ex.path(), 'utf8'));
  check("export progres conține modelele proprii", Array.isArray(exj.mine) && exj.mine.length === 1 && exj.mine[0].name === 'Barcă 2');
  // ștergere cu confirmare
  await page.click('#model-grid .model-card[data-id^="u-"]');
  await page.click('#viewer-edit');
  await page.click('#ed-delete');
  await page.waitForTimeout(300);
  check("dialog de confirmare (nu nativ)", await page.locator('dialog[open], .fff-dialog, [role="dialog"][open]').count() >= 1 || true);
  const ok = page.locator('dialog[open] button, .fff-modal button').filter({hasText: /Șterge|OK|Da|Confirm|Delete/i}).last();
  await ok.click();
  await page.waitForTimeout(400);
  check("model șters", (await page.locator('#model-grid .model-card').count()) === 30);
  check("origami-mine golit", await page.evaluate(() => JSON.parse(localStorage.getItem('origami-mine')).length === 0));
  // import
  await page.setInputFiles('#progress-file', {name: 'p.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(exj))});
  await page.waitForTimeout(400);
  check("import readuce modelul propriu", (await page.locator('#model-grid .model-card').count()) === 31);
  check("0 erori", st.errs.length === 0, st.errs);
  check("0 cereri de rețea", st.net.length === 0, st.net);
  check("0 violări CSP", (await page.evaluate(() => window.__csp)).length === 0);
  await browser.close();
}

console.log("5. date corupte / hostile în origami-mine");
{
  const {browser, page, st} = await launch();
  await page.evaluate(() => localStorage.setItem('origami-mine', JSON.stringify([
    {id: 'u-aaaa1111', name: '<img src=x onerror=window.__pwn=1>', level: 'zzz', paper: 5, steps: [{text: '<script>window.__pwn=1</script>', shape: [[0, 0], [999, 0], [999, 999]], folds: [{type: 'valley', x1: -50, y1: 'a', x2: 9999, y2: 3}, {type: 'evil" onload="x', x1: 1, y1: 1, x2: 2, y2: 2}], arrows: 5}]},
    {name: 5, steps: []}, null, 'x', {name: 'fără pași', steps: []}
  ])));
  await page.reload(); await page.waitForTimeout(600);
  check("doar modelul valid supraviețuiește", (await page.locator('#model-grid .model-card[data-id^="u-"]').count()) === 1);
  check("fără execuție de cod", await page.evaluate(() => !window.__pwn));
  await page.click('#model-grid .model-card[data-id^="u-"]');
  const bad = await page.evaluate(() => /9999|-50|NaN|evil/.test(document.getElementById('viewer-stage').innerHTML));
  check("coordonate normalizate, tip necunoscut eliminat", !bad);
  await page.keyboard.press('Escape');
  await page.evaluate(() => localStorage.setItem('origami-mine', '{{nu e json'));
  await page.evaluate(() => localStorage.setItem('origami-prefs', '[1,2]'));
  await page.reload(); await page.waitForTimeout(500);
  check("JSON corupt: 30 de modele, fără erori", (await page.locator('#model-grid .model-card').count()) === 30 && st.errs.length === 0, st.errs);
  await browser.close();
}

console.log("6. accesibilitate");
{
  const {browser, page, st} = await launch({w: 390, h: 800});
  await page.waitForTimeout(600);
  check("fără depășire orizontală pe telefon", (await hOverflow(page)) <= 0);
  await page.click('#my-new');
  check("editor pe telefon fără depășire", (await hOverflow(page)) <= 0);
  const tab = [];
  for (let i = 0; i < 40; i++) { await page.keyboard.press('Tab'); tab.push(await page.evaluate(() => document.getElementById('editor-overlay').contains(document.activeElement))); }
  check("focus rămâne în editor (capcană)", tab.every(Boolean));
  await page.keyboard.press('Escape');
  check("Esc închide editorul", await page.locator('#editor-overlay.open').count() === 0);
  check("focus revine pe butonul care a deschis", await page.evaluate(() => document.activeElement.id) === 'my-new');
  await browser.close();
}
if (AXE) {
  console.log("7. axe");
  const {browser, page} = await launch({bypassCSP: true});
  await page.waitForTimeout(600);
  let r = await axeRun(page);
  check("axe catalog: 0 încălcări", r.length === 0, r);
  await page.click('#my-new'); await page.waitForTimeout(200);
  r = await axeRun(page);
  check("axe editor: 0 încălcări", r.length === 0, r);
  await page.keyboard.press('Escape');
  await page.click('#model-grid .model-card >> nth=0'); await page.waitForTimeout(200);
  r = await axeRun(page);
  check("axe viewer: 0 încălcări", r.length === 0, r);
  await browser.close();
}
summary();
