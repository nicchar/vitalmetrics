import { getRefRange } from './ranges.js';

/**
 * Returns 'low' | 'ok' | 'high' | 'unknown'
 * profile = { sex: 'm'|'f'|'', ... } for gender-aware ranges.
 */
export function getStatus(value, biomarker, profile) {
  if (value == null || value === '') return 'unknown';
  const v = parseFloat(value);
  if (isNaN(v)) return 'unknown';

  const { min, max } = getRefRange(biomarker, profile || {});
  if (min == null && max == null) return 'unknown';

  if (min != null && v < min) return 'low';
  if (max != null && v > max) return 'high';
  return 'ok';
}

export function getStatusLabel(status) {
  return { low: 'Zu niedrig', ok: 'Im Normbereich', high: 'Zu hoch', unknown: 'Kein Wert' }[status] ?? 'Unbekannt';
}

export function getStatusColor(status) {
  return { low: '#E53935', ok: '#43A047', high: '#FB8C00', unknown: '#BDBDBD' }[status] ?? '#BDBDBD';
}

export function getStatusEmoji(status) {
  return { low: '🔴', ok: '🟢', high: '🟡', unknown: '⚪' }[status] ?? '⚪';
}
