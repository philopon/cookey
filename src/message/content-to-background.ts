export const PULL_CONFIG = "PULL_CONFIG";

export interface PullConfig {
    type: typeof PULL_CONFIG;
}

export function PullConfig(): PullConfig {
    return { type: PULL_CONFIG };
}
export const SUBMIT_QUERY = "SUBMIT_QUERY";

export interface SubmitQuery {
    type: typeof SUBMIT_QUERY;
    query: string;
}

export function SubmitQuery(query: string): SubmitQuery {
    return { type: SUBMIT_QUERY, query };
}

export type Messages = PullConfig | SubmitQuery;
