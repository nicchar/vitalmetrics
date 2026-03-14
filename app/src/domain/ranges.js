/**
 * Returns the correct reference range { min, max } for a biomarker
 * based on the user's profile (sex, ageGroup).
 *
 * @param {object} biomarker   – entry from biomarkerCatalog
 * @param {object} profile     – { sex: 'm'|'f'|'', birthYear, weightGoal }
 * @returns {{ min: number|null, max: number|null }}
 */
export function getRefRange(biomarker, profile) {
  // Weight / body metrics without fixed range
  if (biomarker.refMin == null && biomarker.refMax == null) {
    return { min: null, max: null };
  }

  // Gender-specific range if profile has sex set
  const sex = profile?.sex;
  if (sex && biomarker.refByGender?.[sex]) {
    return { min: biomarker.refByGender[sex].min, max: biomarker.refByGender[sex].max };
  }

  // Fallback: unisex default
  return { min: biomarker.refMin, max: biomarker.refMax };
}

/**
 * Returns a human-readable range string, e.g. "11–14 mg"
 */
export function getRefRangeLabel(biomarker, profile) {
  const { min, max } = getRefRange(biomarker, profile);
  if (min == null) return '–';
  return `${min}–${max} ${biomarker.unit}`;
}
