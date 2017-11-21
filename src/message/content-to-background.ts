export const LOAD_CONFIG = "LOAD_CONFIG";

export interface LoadConfig {
    type: typeof LOAD_CONFIG;
    reload: boolean;
    mode: "allTabs" | "return";
}

export function LoadConfig(args: Options<LoadConfig>): LoadConfig {
    return { type: LOAD_CONFIG, ...args };
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
