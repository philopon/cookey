export const LOAD_CONFIG = "LOAD_CONFIG";

export interface LoadConfig {
    type: typeof LOAD_CONFIG;
    force: boolean;
}

export function LoadConfig({ force }: Options<LoadConfig>): LoadConfig {
    return { type: LOAD_CONFIG, force };
}
export const SUBMIT_QUERY = "SUBMIT_QUERY";

export interface SubmitQuery {
    type: typeof SUBMIT_QUERY;
    query: string;
}

export function SubmitQuery(query: string): SubmitQuery {
    return { type: SUBMIT_QUERY, query };
}

export type Messages = LoadConfig | SubmitQuery;
