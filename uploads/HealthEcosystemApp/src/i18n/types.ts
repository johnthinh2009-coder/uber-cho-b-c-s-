export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends readonly string[] ? T[K] : T[K] extends string ? string : T[K] extends object ? DeepPartial<T[K]> : T[K];
};

type Join<K, P> = K extends string ? (P extends string ? `${K}.${P}` : never) : never;

/** Dotted paths to every string leaf of a dictionary object. */
export type LeafPaths<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : T[K] extends readonly string[]
      ? never
      : T[K] extends object
        ? Join<K, LeafPaths<T[K]>>
        : never;
}[keyof T & string];

/** Dotted paths to every string-array leaf (e.g. suggestion lists). */
export type ListPaths<T> = {
  [K in keyof T & string]: T[K] extends readonly string[] ? K : T[K] extends string ? never : T[K] extends object ? Join<K, ListPaths<T[K]>> : never;
}[keyof T & string];

export type TranslationParams = Record<string, string | number>;
