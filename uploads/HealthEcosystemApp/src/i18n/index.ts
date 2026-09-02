import { useMemo } from 'react';
import { create } from 'zustand';

import { en } from './en';
import type { LeafPaths, ListPaths, TranslationParams } from './types';
import { vi, type Dictionary } from './vi';

export type Locale = 'vi' | 'en';
export type TranslationKey = LeafPaths<Dictionary>;
export type TranslationListKey = ListPaths<Dictionary>;

/** Locale identifiers used by formatting helpers. */
export const localeTags: Record<Locale, string> = { vi: 'vi-VN', en: 'en-US' };

const dictionaries: Record<Locale, unknown> = { vi, en };

type LocaleState = { locale: Locale; setLocale: (locale: Locale) => void };

/** Vietnamese is the default; switching re-renders subscribers via the hook. */
export const useLocaleStore = create<LocaleState>((set) => ({
  locale: 'vi',
  setLocale: (locale) => set({ locale }),
}));

function lookup(dictionary: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((node, segment) => {
    if (node && typeof node === 'object' && segment in (node as Record<string, unknown>)) {
      return (node as Record<string, unknown>)[segment];
    }
    return undefined;
  }, dictionary);
}

function interpolate(template: string, params?: TranslationParams): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = params[name];
    return value === undefined ? match : String(value);
  });
}

function resolve(locale: Locale, key: string): unknown {
  const primary = lookup(dictionaries[locale], key);
  if (primary !== undefined) return primary;
  return lookup(dictionaries.vi, key);
}

/**
 * Translate a key for the active locale, e.g. `t('nav.patient.home')`.
 * Safe to call outside React (stores, services); components should prefer
 * `useI18n()` so they re-render when the locale changes.
 */
export function t(key: TranslationKey, params?: TranslationParams): string {
  const value = resolve(useLocaleStore.getState().locale, key);
  return typeof value === 'string' ? interpolate(value, params) : key;
}

/** Returns a string list, e.g. search suggestions. */
export function tList(key: TranslationListKey): readonly string[] {
  const value = resolve(useLocaleStore.getState().locale, key);
  return Array.isArray(value) ? (value as readonly string[]) : [];
}

/**
 * Translate an enum-like value through a label map, e.g.
 * `tLabel('labels.relationship', member.relationship)`.
 */
export function tLabel(group: string, value: string): string {
  const resolved = resolve(useLocaleStore.getState().locale, `${group}.${value}`);
  return typeof resolved === 'string' ? resolved : value;
}

/** Locale-aware translators. The returned object is stable per locale, so it is safe in dependency arrays. */
export function useI18n() {
  const locale = useLocaleStore((s) => s.locale);
  return useMemo(() => ({
    locale,
    localeTag: localeTags[locale],
    t: (key: TranslationKey, params?: TranslationParams) => {
      const value = resolve(locale, key);
      return typeof value === 'string' ? interpolate(value, params) : key;
    },
    tList: (key: TranslationListKey) => {
      const value = resolve(locale, key);
      return Array.isArray(value) ? (value as readonly string[]) : [];
    },
    tLabel: (group: string, value: string) => {
      const resolved = resolve(locale, `${group}.${value}`);
      return typeof resolved === 'string' ? resolved : value;
    },
  }), [locale]);
}
