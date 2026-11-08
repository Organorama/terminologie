#!/usr/bin/env node
// Validates data/*.json against the rules in schema/concept.schema.json (no dependencies)
// and prints coverage per language and status. Exit code 1 on any error.
import { readdirSync, readFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dataDir = join(root, 'data');
const STATUSES = ['draft', 'needs-review', 'verified'];
const SOURCES = ['ta98', 'ta2', 'fma', 'wikidata', 'mesh-cz', 'textbook', 'contributor'];
const LEVELS = ['secondary', 'medical'];
const ID_PATTERNS = {
  fma: /^[0-9]+$/,
  ta98: /^A[0-9]{2}\.[0-9]\.[0-9]{2}\.[0-9]{3}$/,
  ta2: /^[0-9]+$/,
  wikidata: /^Q[0-9]+$/,
  uberon: /^UBERON:[0-9]{7}$/,
};
const CONCEPT_KEYS = ['id', 'ids', 'levels', 'terms', 'note'];
const TERM_KEYS = ['term', 'synonyms', 'gender', 'plural', 'status', 'sources', 'reviewedBy', 'note'];

const errors = [];
const seen = new Map();
const stats = {};
const fail = (where, message) => errors.push(`${where}: ${message}`);
const isStringArray = value => Array.isArray(value) && value.every(item => typeof item === 'string' && item.trim() !== '');
const unknownKeys = (object, allowed) => Object.keys(object).filter(key => !allowed.includes(key));

function checkTerm(where, lang, term) {
  if (!term || typeof term !== 'object' || Array.isArray(term)) return fail(where, 'term must be an object');
  for (const key of unknownKeys(term, TERM_KEYS)) fail(where, `unknown field "${key}"`);
  if (typeof term.term !== 'string' || term.term.trim() === '') fail(where, 'missing "term"');
  else if (term.term !== term.term.trim()) fail(where, 'leading/trailing spaces in "term"');
  if (!STATUSES.includes(term.status)) fail(where, `status must be one of ${STATUSES.join(', ')}`);
  if (!isStringArray(term.sources) || term.sources.length === 0) fail(where, 'at least one source is required');
  else for (const source of term.sources) if (!SOURCES.includes(source)) fail(where, `unknown source "${source}" (see SOURCES.md)`);
  if (term.synonyms !== undefined) {
    if (!isStringArray(term.synonyms)) fail(where, '"synonyms" must be a list of strings');
    else {
      if (new Set(term.synonyms).size !== term.synonyms.length) fail(where, 'duplicate synonyms');
      if (term.synonyms.includes(term.term)) fail(where, 'synonym repeats the preferred term');
    }
  }
  if (term.gender !== undefined && !['m', 'f', 'n'].includes(term.gender)) fail(where, 'gender must be m, f or n');
  if (term.plural !== undefined && typeof term.plural !== 'boolean') fail(where, '"plural" must be true or false');
  if (term.reviewedBy !== undefined && !isStringArray(term.reviewedBy)) fail(where, '"reviewedBy" must be a list of GitHub accounts');
  if (term.status === 'verified' && !(term.reviewedBy?.length > 0)) fail(where, 'status "verified" requires "reviewedBy"');
  stats[lang] ??= Object.fromEntries(STATUSES.map(status => [status, 0]));
  if (STATUSES.includes(term.status)) stats[lang][term.status]++;
}

function checkConcept(file, concept, index) {
  const where = `${file} #${index}${concept?.id ? ` (${concept.id})` : ''}`;
  if (!concept || typeof concept !== 'object' || Array.isArray(concept)) return fail(where, 'concept must be an object');
  for (const key of unknownKeys(concept, CONCEPT_KEYS)) fail(where, `unknown field "${key}"`);
  if (typeof concept.id !== 'string' || !/^FMA[0-9]+$/.test(concept.id)) fail(where, 'id must look like FMA7148');
  const ids = concept.ids;
  if (!ids || typeof ids !== 'object') fail(where, 'missing "ids"');
  else {
    for (const [key, value] of Object.entries(ids)) {
      if (!ID_PATTERNS[key]) fail(where, `unknown identifier "${key}"`);
      else if (typeof value !== 'string' || !ID_PATTERNS[key].test(value)) fail(where, `invalid ${key} identifier "${value}"`);
    }
    if (concept.id !== `FMA${ids.fma}`) fail(where, 'id must equal "FMA" + ids.fma');
  }
  if (concept.levels !== undefined && (!Array.isArray(concept.levels) || concept.levels.some(level => !LEVELS.includes(level)))) fail(where, `levels may only contain ${LEVELS.join(', ')}`);
  if (seen.has(concept.id)) fail(where, `duplicate concept, already in ${seen.get(concept.id)}`);
  else seen.set(concept.id, file);
  const terms = concept.terms;
  if (!terms || typeof terms !== 'object') return fail(where, 'missing "terms"');
  if (!terms.en) fail(where, 'an English term ("en") is required');
  for (const [lang, term] of Object.entries(terms)) {
    if (!/^[a-z]{2}$/.test(lang)) fail(where, `language code "${lang}" must be two lowercase letters (ISO 639-1)`);
    checkTerm(`${where} [${lang}]`, lang, term);
  }
}

const files = readdirSync(dataDir).filter(name => name.endsWith('.json')).sort();
for (const name of files) {
  let data;
  try { data = JSON.parse(readFileSync(join(dataDir, name), 'utf8')); }
  catch (error) { fail(name, `invalid JSON: ${error.message}`); continue; }
  for (const key of unknownKeys(data, ['system', 'concepts'])) fail(name, `unknown top-level field "${key}"`);
  if (data.system !== basename(name, '.json')) fail(name, `"system" must be "${basename(name, '.json')}"`);
  if (!Array.isArray(data.concepts)) { fail(name, '"concepts" must be a list'); continue; }
  data.concepts.forEach((concept, index) => checkConcept(name, concept, index));
  const ids = data.concepts.map(concept => Number(concept?.ids?.fma));
  if (ids.some((id, index) => index > 0 && id < ids[index - 1])) fail(name, 'concepts must be sorted by FMA number');
}

console.log(`${seen.size} concepts in ${files.length} file(s)`);
for (const [lang, counts] of Object.entries(stats).sort()) {
  console.log(`  ${lang}: ${STATUSES.map(status => `${counts[status]} ${status}`).join(', ')}`);
}
if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}
console.log('OK');
