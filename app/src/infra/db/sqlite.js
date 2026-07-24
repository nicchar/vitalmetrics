/**
 * Storage Adapter – wraps localStorage for web/Capacitor WebView.
 * Can be swapped for @capacitor-community/sqlite on native later.
 */
export const storage = {
  get(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(key);
  },

  /**
   * Versionierter Zugriff für Repositories mit einem Datenschema, das sich
   * künftig ändern könnte (eingeführt Juli 2026, "technische Grundlagen" –
   * vorher gab es keinen Migrationspfad für bestehende Nutzerdaten).
   *
   * Daten werden als Umschlag { v, data } gespeichert statt roh. Beim Lesen:
   * - kein Umschlag vorhanden (Altbestand vor Einführung der Versionierung
   *   ODER komplett neue Installation) → oldVersion = 0, data = der rohe
   *   Altwert (bzw. null bei Neuinstallation).
   * - oldVersion < version → migrate(data, oldVersion) wird aufgerufen und
   *   das Ergebnis sofort mit der neuen Version zurückgeschrieben (einmalige
   *   Migration beim ersten Zugriff, kein Overhead bei jedem weiteren Lesen).
   *
   * migrate() muss mit null/leeren Werten umgehen können (Fall: komplett
   * neue Installation ohne Altbestand) und ist standardmäßig die Identität,
   * d.h. reine Formatumstellung ohne Datenänderung.
   *
   * @param {string} key
   * @param {number} version aktuelle SCHEMA_VERSION des aufrufenden Repos
   * @param {(oldData: any, oldVersion: number) => any} [migrate]
   */
  getVersioned(key, version, migrate = (data) => data) {
    const raw = this.get(key);
    const isEnvelope = !!raw && typeof raw === 'object' && !Array.isArray(raw) && 'v' in raw && 'data' in raw;
    const oldVersion = isEnvelope ? raw.v : 0;
    let data = isEnvelope ? raw.data : raw;

    if (oldVersion < version) {
      data = migrate(data, oldVersion);
      this.setVersioned(key, data, version);
    }
    return data;
  },

  setVersioned(key, data, version) {
    this.set(key, { v: version, data });
  }
};
