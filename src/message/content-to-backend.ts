export const PULL_CONFIG = "PULL_CONFIG";

export interface PullConfig {
    type: typeof PULL_CONFIG;
}

export function PullConfig(): PullConfig {
    return { type: PULL_CONFIG };
}

export type Messages = PullConfig;
