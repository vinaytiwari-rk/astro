import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const cities = require('cities.json');
const admin1 = require('cities.json/admin1.json');

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, '../public/data/world-cities.json');

const admin1Map = {};
for (const a of admin1) {
  admin1Map[a.code] = a.name;
}

const compactCities = cities.map((c) => [
  c.name,
  Math.round(Number(c.lat) * 10000) / 10000,
  Math.round(Number(c.lng) * 10000) / 10000,
  c.country,
  c.admin1 || '',
]);

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify({ admin1: admin1Map, cities: compactCities }), 'utf8');
console.log(`Generated ${compactCities.length} cities -> ${outPath}`);
