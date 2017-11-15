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

export const RELOAD_CONFIG = "RELOAD_CONFIG";

export interface ReloadConfig {
    type: typeof RELOAD_CONFIG;
}

export function ReloadConfig(): ReloadConfig {
    return { type: RELOAD_CONFIG };
}

export type Messages = PullConfig | SubmitQuery | ReloadConfig;
