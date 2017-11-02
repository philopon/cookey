import { AllCommands } from "./command";

export interface KeyConfig {
    [key: string]: AllCommands;
}

export interface Config {
    key: KeyConfig;
    blurFocus: boolean;
}
