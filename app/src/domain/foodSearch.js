/**
 * foodSearch.js
 *
 * Relevanz-Ranking für die lokale BLS-Lebensmittelsuche.
 *
 * Tester-Fund (31.07.2026): Die Suche nach "Milch" zeigte nur "Ananasringe im
 * Milchbackteig gebraten" & Co., aber keine reine Milch. Ursache: die BLS 4.0
 * ist alphabetisch sortiert, "Milch" hat 261 Treffer, und die alte Suche hat
 * einfach die ersten 12 (in DB-Reihenfolge) genommen - die reinen Milch-
 * Einträge lagen erst ab Position ~103. Zusätzliche Schwierigkeit: die BLS
 * nennt reine Milch nie schlicht "Milch", sondern immer mit Fettstufe
 * ("Milch entrahmt, ...", "Milch fettarm, ..."). Ein reiner startsWith-Vorrang
 * würde daher weiterhin kurze Wortzusammensetzungen wie "Milchschokolade"
 * bevorzugen. Deshalb: Suchwort-als-eigenes-Wort schlägt Suchwort-als-Präfix-
 * eines-Kompositums, unabhängig von der Namenslänge.
 */

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Rankt `items` (Objekte mit .name) nach Relevanz für `query` und gibt die
 * besten `limit` Treffer zurück. Reine Filterfunktion, keine Seiteneffekte -
 * einfach mit echten Daten testbar.
 *
 * Rangfolge (jeweils kürzeste Treffer zuerst):
 *   0 exakter Treffer
 *   1 Suchwort steht als eigenes Wort am Namensanfang ("Milch entrahmt…")
 *   2 Suchwort steht als eigenes Wort irgendwo im Namen ("… mit Milch …")
 *   3 Name beginnt mit dem Suchwort, aber als Teil eines Kompositums
 *     ("Milchschokolade")
 *   4 sonstiger Teiltreffer (z. B. "Buttermilch", Suchwort am Wortende)
 */
export function rankFoodMatches(query, items, limit = 12) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const esc = escapeRegExp(q);
  const wordAtStart  = new RegExp(`^${esc}([^a-zäöüß]|$)`, 'i');
  const wordAnywhere = new RegExp(`(^|[^a-zäöüß])${esc}([^a-zäöüß]|$)`, 'i');

  return items
    .filter(f => (f.name || '').toLowerCase().includes(q) || (f.id || '').includes(q))
    .map(f => {
      const name = f.name.toLowerCase();
      let score = 4;
      if (name === q) score = 0;
      else if (wordAtStart.test(f.name)) score = 1;
      else if (wordAnywhere.test(f.name)) score = 2;
      else if (name.startsWith(q)) score = 3;
      return { f, score };
    })
    .sort((a, b) => a.score - b.score || a.f.name.length - b.f.name.length)
    .slice(0, limit)
    .map(({ f }) => f);
}
