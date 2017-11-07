export const LOADED = "LOADED";

export interface Loaded {
    type: typeof LOADED;
}

export function Loaded(): Loaded {
    return { type: LOADED };
}

export type Messages = Loaded;
