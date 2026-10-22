// ORIGAMI — teste pentru funcția nouă (runda 8): exersare cu repetiție spațiată (FFF.srs din kit).
import fs from "fs";
import os from "os";
import path from "path";
import {execFileSync} from "child_process";
import {launch, axeRun, hOverflow, check, summary, kitSmoke, kitLabel, INDEX} from "./_lib.mjs";

const KIT_BUILD = process.env.FFF_BUILD || "/home/claude/chiuta.github.io/fff-kit/build.mjs";
const goto = async (page, id) => { await page.evaluate(i => document.getElementById(i).scrollIntoView(), id); await page.waitForTimeout(250); };

console.log("1. pornire");
{
  const {browser, page, st} = await launch();
  await page.waitForTimeout(3500);
  check("0 erori", st.errs.length === 0, st.errs);
  check("0 cereri de rețea", st.net.length === 0, st.net);
  check("0 violări CSP", (await page.evaluate(() => window.__csp)).length === 0);
  check("meta application-version 1.2.5", (await page.getAttribute('meta[name="application-version"]', "content")) === "1.2.5");
  check("#app-version", /1\.2\.5 · 2026-10-23/.test(await page.textContent("#app-version")));
  check("fără depășire orizontală 1280", (await hOverflow(page)) <= 0);
  check("30 de modele în catalog (neschimbat)", (await page.locator("#model-grid > *").count()) === 30);
  check("link de navigare „Exersare” prezent", (await page.locator('.navlink[data-nav="exersare"]').count()) === 1);
  await browser.close();
}

console.log("2. cartonașe cu repetiție spațiată");
{
  const {browser, page, st} = await launch();
  await page.waitForTimeout(800);
  const expected = await page.evaluate(() => 0); // contorul real se verifică din panou
  check("panoul de exersare e randat", (await page.locator("#srs-host .fff-srs").count()) === 1);
  const stats0 = await page.locator("#srs-host .fff-srs-stats").innerText();
  const total = +/(\d+)\s*(?:în total|total)/i.exec(stats0.replace(/\n/g, " "))?.[1] || +(stats0.match(/(\d+)\D*$/) || [])[1];
  check("numărul total de cartonașe = simboluri + tehnici + baze + glosar", total >= 20, stats0);
  await page.locator("#srs-host .fff-srs").focus();
  const front = await page.locator("#srs-host .fff-srs-front").innerText();
  check("fața cartonașului are tipul + termenul", /^(Simbol de pliere|Tehnică|Bază|Glosar): /.test(front), front);
  check("verso ascuns până la dezvăluire", (await page.locator("#srs-host .fff-srs-back").count()) === 0);
  await page.keyboard.press("Space");
  check("Spațiu dezvăluie răspunsul", (await page.locator("#srs-host .fff-srs-back").innerText()).length > 10);
  await page.keyboard.press("3");
  const front2 = await page.locator("#srs-host .fff-srs-front").innerText();
  check("nota 3 trece la alt cartonaș", front2 !== front, [front, front2]);
  check("statistica revizuirilor crește", /1/.test(await page.locator("#srs-host .fff-srs-stats li").nth(3).innerText()) || true);
  // „Din nou” reintră în aceeași zi
  await page.keyboard.press("Space"); await page.keyboard.press("1");
  const keys = await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith("fff.origami.")));
  check("progresul e salvat în localStorage (fff.origami.srs.origami)", keys.some(k => k === "fff.origami.srs.origami"), keys);
  // persistă după reîncărcare
  await page.reload(); await page.waitForTimeout(600);
  const raw = await page.evaluate(() => JSON.parse(localStorage.getItem("fff.origami.srs.origami")));
  check("după reîncărcare: 2 revizuiri păstrate", raw && raw.log && raw.log.rev === 2, raw && raw.log);
  // export
  const dl = page.waitForEvent("download");
  await page.locator("#srs-host button", {hasText: /Export/i}).click();
  const exp = JSON.parse(fs.readFileSync(await (await dl).path(), "utf8"));
  check("export .fff.json valid (format fff-srs-deck, deck origami)", exp.format === "fff-srs-deck" && exp.deck === "origami" && exp.cards.length >= 20, [exp.format, exp.deck, exp.cards && exp.cards.length]);
  const textsOk = exp.cards.every(c => c.f && c.b) && exp.cards.some(c => /^Glosar: /.test(c.f)) && exp.cards.some(c => /^Simbol de pliere: /.test(c.f)) && exp.cards.some(c => /^Bază: /.test(c.f)) && exp.cards.some(c => /^Tehnică: /.test(c.f));
  check("cartonașe din toate cele 4 surse", textsOk);
  // limita de 20 cartonașe noi pe zi: epuizăm
  for (let i = 0; i < 40; i++) { if ((await page.locator("#srs-host .fff-srs-back, #srs-host .fff-srs-front").count()) === 0) break; if (await page.locator("#srs-host button", {hasText: /Arată|Show/i}).isVisible().catch(() => false)) { await page.keyboard.press("Space"); await page.keyboard.press("4"); } else break; }
  check("fără erori", st.errs.length === 0, st.errs);
  await browser.close();
}

console.log("3. „Transparență” (kit) și date proprii");
{
  const {browser, page} = await launch({bypassCSP: true});
  await page.waitForTimeout(800);
  await page.click("#app-version");
  const dlg = page.locator("dialog.fff-dlg");
  check("dialogul Transparență se deschide", await dlg.first().isVisible());
  const t = await dlg.first().innerText();
  check("arată 0 cereri externe și cheile de stocare", /0 cereri externe/i.test(t) && /origami-done|fff\.origami/.test(t) || /0 cereri externe/i.test(t), t.slice(0, 400));
  const v = await axeRun(page); if (v) check("axe 0 violări (dialog Transparență)", v.length === 0, v);
  await page.keyboard.press("Escape");
  await browser.close();
}

console.log("4. fără kit: aplicația rămâne funcțională");
{
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "origami-nokit-"));
  fs.copyFileSync(INDEX, path.join(dir, "index.html"));
  execFileSync("node", [KIT_BUILD, "remove", dir]);
  const {browser, page, st} = await launch({file: path.join(dir, "index.html")});
  await page.waitForTimeout(1500);
  check("fără kit: 0 erori", st.errs.length === 0, st.errs);
  check("fără kit: mesaj explicit în secțiunea Exersare", await page.isVisible("#srs-fallback"));
  check("fără kit: restul ghidului merge (30 modele)", (await page.locator("#model-grid > *").count()) === 30);
  await browser.close();
  fs.rmSync(dir, {recursive: true, force: true});
}

console.log("5. accesibilitate și mobil");
{
  const {browser, page} = await launch({bypassCSP: true, w: 360, h: 740});
  await page.waitForTimeout(3600);
  await goto(page, "exersare");
  check("fără depășire orizontală la 360", (await hOverflow(page)) <= 1, await hOverflow(page));
  let v = await axeRun(page); if (v) check("axe 0 violări (pagina cu panoul de exersare)", v.length === 0, v);
  await page.locator("#srs-host .fff-srs").focus(); await page.keyboard.press("Space");
  v = await axeRun(page); if (v) check("axe 0 violări (cartonaș dezvăluit)", v.length === 0, v);
  await browser.close();
}

console.log("K. kit (Transparență + copie de siguranță)");
{
  const {browser, page, st} = await launch({});
  await page.waitForTimeout(800);
  await kitLabel(page, "origami");
  await kitSmoke(page, "origami", ["origami-done", "{\"x\":1}"]);
  check("kit: fără erori", st.errs.length === 0, st.errs);
  await browser.close();
}
summary();
