/**
 * Validates a measurement value before saving.
 * Returns { valid: boolean, error: string|null }
 */
export function validateMeasurement(value, biomarker) {
  if (value === '' || value == null) {
    return { valid: false, error: 'Bitte einen Wert eingeben.' };
  }
  const v = parseFloat(value);
  if (isNaN(v)) {
    return { valid: false, error: 'Bitte eine gültige Zahl eingeben.' };
  }
  if (v < 0) {
    return { valid: false, error: 'Der Wert muss größer als 0 sein.' };
  }
  // Plausibility checks per biomarker category
  if (biomarker.id === 'gewicht') {
    if (v < 10 || v > 500) {
      return { valid: false, error: 'Bitte ein plausibles Gewicht eingeben (10–500 kg).' };
    }
  } else if (biomarker.refMax != null && v > biomarker.refMax * 20) {
    return { valid: false, error: `Der Wert scheint sehr hoch. Bitte prüfen (Einheit: ${biomarker.unit}).` };
  }
  return { valid: true, error: null };
}
