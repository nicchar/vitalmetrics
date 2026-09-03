import { storage } from '../sqlite.js';

const KEY = 'vm_profile';
const SCHEMA_VERSION = 1;

const defaults = {
  name: '',
  weightGoal: null,   // kg
  sex: '',            // 'm' | 'f' | ''
  birthYear: null,
  // Review 11 (19.08.2026): Körpergröße + Aktivitätslevel für die grobe
  // Grundumsatz-/Protein-Einschätzung (domain/energyNeeds.js). height war
  // vorher nirgends in der App erfasst (auch der BMI wurde bislang manuell
  // eingetragen statt berechnet) - beides bewusst optional, die App rechnet
  // erst, wenn beides vorliegt (siehe calcBMR: gibt sonst null zurück statt
  // zu raten).
  height: null,        // cm
  activityLevel: '',   // '' | 'sitzend' | 'leicht_aktiv' | 'aktiv' | 'sehr_aktiv' (siehe domain/energyNeeds.js ACTIVITY_LEVELS)
  // Block E: feste Auswahlliste (KEIN Freitext-Diagnosefeld) für allgemeine
  // Medikamenten-/Supplement-Wechselwirkungshinweise, siehe medicationInteractions.js
  medications: [],
  // Block D: lokale, tägliche Erinnerung (kein Server, kein Push-Dienst).
  reminderEnabled: false,
  reminderTime: '19:00',
  // Block C: Einwilligung zu Datenschutzerklärung + AGB im Onboarding.
  consentGiven: false,
  consentDate: null,
  // Alltagsreibung-Review Juli 2026: Unverträglichkeiten für den Wochenplan-
  // Filter (siehe domain/mealPlan.js, filterByIntolerances). Feste Auswahlliste,
  // kein Freitext - gleiches Muster wie medications.
  intolerances: [],
  // Feature "Automatischer Wochenrückblick" (03.08.2026): Montag der zuletzt
  // im Dashboard-Banner angezeigten/angeklickten Kalenderwoche (siehe
  // domain/dateUtils.js mondayOf()) - verhindert, dass derselbe Rückblick
  // mehrfach in derselben Woche als "neu" auftaucht. null = noch nie gezeigt.
  lastWeeklyRecapShown: null,
};

export const profileRepo = {
  get() {
    return { ...defaults, ...storage.getVersioned(KEY, SCHEMA_VERSION) };
  },
  save(profile) {
    storage.setVersioned(KEY, { ...this.get(), ...profile }, SCHEMA_VERSION);
  }
};
