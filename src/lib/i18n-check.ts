/**
 * i18n Translation Validation Utilities
 *
 * This module provides functions to validate translation completeness
 * between different locale files.
 */

type NestedObject = { [key: string]: string | NestedObject };

/**
 * Recursively extracts all keys from a nested object
 * Returns an array of dot-notation paths (e.g., "common.appName")
 */
function getAllKeys(obj: NestedObject, prefix = ''): string[] {
  const keys: string[] = [];

  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...getAllKeys(value as NestedObject, fullKey));
    } else {
      keys.push(fullKey);
    }
  }

  return keys;
}

/**
 * Validates that two translation objects have the same keys
 * Returns an object with missing keys for each locale
 */
export function validateTranslations(
  ko: NestedObject,
  en: NestedObject
): {
  missingInEn: string[];
  missingInKo: string[];
  isValid: boolean;
} {
  const koKeys = new Set(getAllKeys(ko));
  const enKeys = new Set(getAllKeys(en));

  const missingInEn = [...koKeys].filter((key) => !enKeys.has(key));
  const missingInKo = [...enKeys].filter((key) => !koKeys.has(key));

  return {
    missingInEn,
    missingInKo,
    isValid: missingInEn.length === 0 && missingInKo.length === 0,
  };
}

/**
 * Logs validation results to console
 */
export function logValidationResults(results: ReturnType<typeof validateTranslations>): void {
  if (results.isValid) {
    console.log('✅ All translations are complete!');
    return;
  }

  console.log('❌ Translation validation failed:\n');

  if (results.missingInEn.length > 0) {
    console.log('Missing in English (en.json):');
    results.missingInEn.forEach((key) => console.log(`  - ${key}`));
    console.log('');
  }

  if (results.missingInKo.length > 0) {
    console.log('Missing in Korean (ko.json):');
    results.missingInKo.forEach((key) => console.log(`  - ${key}`));
    console.log('');
  }
}

// CLI execution
if (typeof require !== 'undefined' && require.main === module) {
  const ko = require('../messages/ko.json');
  const en = require('../messages/en.json');

  const results = validateTranslations(ko, en);
  logValidationResults(results);

  if (!results.isValid) {
    process.exit(1);
  }
}
