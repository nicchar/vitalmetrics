/**
 * notifications.js
 *
 * Wrapper um @capacitor/local-notifications (Block D). Rein lokale Planung,
 * kein Server, keine Push-Infrastruktur - daher DSGVO-seitig unkritisch
 * (siehe Runde-2/3-Review). Bewusst NEUTRALE Texte ohne Gesundheitsbezug im
 * Sperrbildschirm (z. B. nicht "Vitamin-D-Mangel!", sondern "Kurzer Check-in?").
 *
 * WICHTIG: Der Zweck dieser Erinnerungen muss im Consent-Screen/der
 * Datenschutzerklärung dokumentiert sein (siehe Aktionsplan Phase 2/Block C -
 * das steht zum Zeitpunkt dieser Implementierung noch aus, siehe Hinweis
 * in der Chat-Antwort).
 */

const REMINDER_ID = 1001;

function getPlugin() {
  return typeof window !== 'undefined' ? window.Capacitor?.Plugins?.LocalNotifications : null;
}

function isAvailable() {
  return !!getPlugin();
}

async function requestPermission() {
  const plugin = getPlugin();
  if (!plugin) return false;
  const result = await plugin.requestPermissions();
  return result?.display === 'granted';
}

async function checkPermission() {
  const plugin = getPlugin();
  if (!plugin) return false;
  const result = await plugin.checkPermissions();
  return result?.display === 'granted';
}

/**
 * Plant eine tägliche Erinnerung zur angegebenen Uhrzeit. Neutraler Text,
 * kein Gesundheitsbezug (Lock-Screen-Datenschutz, siehe DSGVO-Review).
 * @param {number} hour   0-23
 * @param {number} minute 0-59
 */
async function scheduleDailyReminder(hour, minute) {
  const plugin = getPlugin();
  if (!plugin) return { ok: false, reason: 'unavailable' };

  let granted = await checkPermission();
  if (!granted) granted = await requestPermission();
  if (!granted) return { ok: false, reason: 'permission-denied' };

  await plugin.cancel({ notifications: [{ id: REMINDER_ID }] });
  await plugin.schedule({
    notifications: [{
      id: REMINDER_ID,
      title: 'WellANNI',
      body: 'Kurzer Check-in gefällig? Trag deine heutigen Werte ein.',
      schedule: { on: { hour, minute }, repeats: true, allowWhileIdle: true },
    }],
  });
  return { ok: true };
}

async function cancelReminder() {
  const plugin = getPlugin();
  if (!plugin) return;
  await plugin.cancel({ notifications: [{ id: REMINDER_ID }] });
}

export const notifications = {
  isAvailable,
  requestPermission,
  checkPermission,
  scheduleDailyReminder,
  cancelReminder,
};
