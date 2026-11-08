# Jak přispět

Díky, že chcete slovník zlepšit. Nejvíc pomůže oprava termínů a doplnění chybějících, ideálně od lidí, kteří anatomii učí nebo studují.

## Dvě cesty

1. **Formulář (bez gitu):** [Oprava termínu](../../issues/new?template=oprava-terminu.yml) nebo [Chybějící termín](../../issues/new?template=chybejici-termin.yml). Správci návrh zapracují.
2. **Pull request:** upravte příslušný soubor v `data/`, spusťte `node scripts/validate.mjs` a pošlete PR. Do popisu napište zdroj.

## Pravidla

- **Každý termín potřebuje zdroj.** Primární zdroje:
  - latina: TA98 (Terminologia Anatomica 1998),
  - čeština: aktuální české anatomické učebnice a názvosloví (uveďte autora, rok a stranu).
  Seznam zkratek zdrojů je v [SOURCES.md](SOURCES.md). Když tam váš zdroj chybí, napište ho do poznámky.
- **Nepřebírejte hromadně celé seznamy z chráněných zdrojů** (učebnice, slovníky, České tělovědné názvosloví, kompletní TA2). Jednotlivý termín ověřený v učebnici je v pořádku. Opisovat celé kapitoly nebo tabulky v pořádku není.
- **Stav `verified`** nastavují jen recenzenti a zapíšou se do `reviewedBy`. Ostatní příspěvky mají stav `draft` nebo `needs-review`.
- **Synonyma** patří do `synonyms`. Zastaralé nebo eponymní názvy (např. Eustachova trubice) uveďte jako synonymum s poznámkou.
- **Nový jazyk:** použijte dvoupísmenný kód ISO 639-1 (`sk`, `pl`, `de`…) a založte issue, abychom domluvili zdroje a recenzenty.

## Licence příspěvků

Odesláním příspěvku souhlasíte, že bude zveřejněn pod licencí [CC BY 4.0](LICENSE), stejně jako zbytek dat. Pokud chcete být uvedeni jako recenzent nebo přispěvatel, zmiňte to v issue nebo PR.
