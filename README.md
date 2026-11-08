# Organorama – anatomické názvosloví

Otevřený slovník anatomických termínů **česky, latinsky a anglicky**. Každý pojem je navázaný na mezinárodní identifikátory ([FMA](https://www.ebi.ac.uk/ols4/ontologies/fma), TA98, TA2, [Wikidata](https://www.wikidata.org/)). Díky tomu jde slovník propojit s 3D modely, ontologiemi i jinými aplikacemi. Později přibudou další evropské jazyky.

Slovník vzniká pro [Organoramu](https://github.com/Organorama), interaktivní 3D atlas lidského těla pro střední školy a lékařské fakulty. Používat ho ale může kdokoli: v aplikacích, kartičkách na učení, výuce nebo výzkumu.

> **Stav: v přípravě.** Zatím obsahuje jen ukázková data. První větší dávka budou automatické návrhy ze zdrojů (TA98, FMA, Wikidata, MeSH-CZ), které pak postupně kontrolují recenzenti. Návrh poznáte podle stavu `draft`.

## Jak pomoct

Našli jste chybu nebo chybějící termín?

- **Bez znalosti gitu:** vyplňte formulář [Oprava termínu](../../issues/new?template=oprava-terminu.yml) nebo [Chybějící termín](../../issues/new?template=chybejici-termin.yml).
- **S gitem:** upravte soubor v [`data/`](data/) a pošlete pull request.

Podrobnosti jsou v [CONTRIBUTING.md](CONTRIBUTING.md). Každý příspěvek potřebuje zdroj.

## Struktura dat

Data jsou v [`data/`](data/), jeden soubor na soustavu (`digestive.json`, `muscular.json`…). Formát popisuje [`schema/concept.schema.json`](schema/concept.schema.json).

```json
{
  "id": "FMA7148",
  "ids": { "fma": "7148", "ta98": "A05.5.01.001", "ta2": "2901", "wikidata": "Q1029907" },
  "levels": ["secondary", "medical"],
  "terms": {
    "la": { "term": "gaster", "synonyms": ["ventriculus"], "gender": "f", "status": "draft", "sources": ["ta98"] },
    "cs": { "term": "žaludek", "gender": "m", "status": "draft", "sources": ["wikidata"] },
    "en": { "term": "stomach", "status": "draft", "sources": ["fma"] }
  }
}
```

**Pole:**

- `id` – identifikátor pojmu (FMA).
- `ids` – vazby na mezinárodní terminologie a databáze.
- `levels` – pro koho je pojem určený: `secondary` (střední škola), `medical` (lékařská fakulta).
- `terms` – termíny podle jazyka (kódy ISO 639-1: `cs`, `la`, `en`…). Každý termín má:
  - `term` – preferovaný termín,
  - `synonyms` – další užívané termíny,
  - `gender` – gramatický rod; podle něj se skládají tvary levý/pravý a dexter/sinister,
  - `status` – stav ověření (viz níže),
  - `sources` – zdroje (seznam v [SOURCES.md](SOURCES.md)),
  - `reviewedBy` – kdo termín ověřil (GitHub účty).

Slovník obsahuje pojmy bez stranového určení (např. „sval pološlašitý“). Levé a pravé varianty se skládají podle rodu: *pravý / pravá / pravé*, *dexter / dextra / dextrum*.

### Stavy

| Stav | Význam |
|---|---|
| `draft` | Návrh převzatý nebo odvozený ze zdrojů, zatím neověřený člověkem. |
| `needs-review` | Sporný termín, potřebuje odborný názor. |
| `verified` | Ověřeno recenzentem (vyplněné `reviewedBy`). |

Data kontroluje skript `node scripts/validate.mjs`. Spouští se automaticky u každé změny.

## Licence

Data jsou pod licencí [CC BY 4.0](LICENSE). Smíte je volně používat, upravovat a šířit, i komerčně, pokud uvedete zdroj, například:

> Anatomické názvosloví: Organorama (https://github.com/Organorama/terminologie), CC BY 4.0

Převzaté zdroje a jejich licence jsou v [SOURCES.md](SOURCES.md).

---

## English

**Organorama Terminology** is an open dataset of anatomical terms in Czech, Latin and English, linked to FMA, TA98, TA2 and Wikidata identifiers. More European languages will follow. It is built for Organorama, an interactive 3D anatomy atlas, but anyone may use it under [CC BY 4.0](LICENSE).

The project is at an early stage: the data are samples for now. Corrections are welcome through the issue forms or pull requests; please always cite a source (see [CONTRIBUTING.md](CONTRIBUTING.md)).
