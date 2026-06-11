// src/data/content.ts
import { en } from "../i18n/en";
import { th } from "../i18n/th";

// Helper to dynamically merge the English and Thai objects
// into the bilingual shape required by the app ({ en: T, th: T } at leaf levels where they differ)
function mergeDicts(enVal: any, thVal: any): any {
  if (enVal === thVal) {
    return enVal;
  }
  if (Array.isArray(enVal)) {
    return enVal.map((v, i) => mergeDicts(v, thVal?.[i]));
  }
  if (typeof enVal === 'object' && enVal !== null && typeof thVal === 'object' && thVal !== null) {
    const res: any = {};
    for (const key of Object.keys(enVal)) {
      res[key] = mergeDicts(enVal[key], thVal[key]);
    }
    return res;
  }
  return { en: enVal, th: thVal };
}

export const contentData = mergeDicts(en, th);
export type ContentDataType = typeof contentData;
