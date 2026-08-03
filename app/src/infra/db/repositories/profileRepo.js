import { storage } from '../sqlite.js';

const KEY = 'vm_profile';
const SCHEMA_VERSION = 1;

const defaults = {
  name: '',
  weightGoal: null,   // kg
  sex: '',            // 'm' | 'f' | ''
  birthYear: null,
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
