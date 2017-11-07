declare namespace browser {
    interface Event<T> {
        addListener(callback: (msg: T) => void): void;
        removeListener(callback: (msg: T) => void): void;
        hasListener(callback: (msg: T) => void): boolean;
    }

    namespace runtime {
        export function sendMessage<T = {}, R = void>(msg: T): Promise<R>;

        export interface MessageSender {
            tab: tabs.Tab;
            frameId: number;
            id: string;
            url: string;
            tlsChannelId: string;
        }

        type OnMessageCallback<T, R> = (msg: T, sender: MessageSender) => Promise<R>;

        export const onMessage: {
            addListener<T = {}, R = void>(callback: OnMessageCallback<T, R>): void;
            removeListener<T = {}, R = void>(callback: OnMessageCallback<T, R>): void;
            hasListener<T = {}, R = void>(callback: OnMessageCallback<T, R>): boolean;
        };
    }

    namespace tabs {
        interface Tab {
            id: number;
            index: number;
            pinned: boolean;
            url: string;
        }

        interface Query {
            active?: boolean;
        }

        function query(query: Query): Promise<Tab[]>;

        interface Update {
            active?: boolean;
            url?: string;
        }

        function update(id: number, update: Update): Promise<Tab>;

        interface ReloadProperties {
            bypassCache: boolean;
        }
        function reload(id: number, props: ReloadProperties): Promise<undefined>;

        function sendMessage<T>(id: number, message: T): Promise<any>;

        interface CreateProperties {
            active?: boolean;
            index?: number;
            url?: string;
        }

        function create(props: CreateProperties): Promise<Tab>;

        function remove(id: number): Promise<void>;

        export const onCreated: Event<Tab>;

        export interface ExecuteScriptOptions {
            allFrames?: boolean;
            code?: string;
            file?: string;
            frameId?: boolean;
            matchAboutBlank?: boolean;
            runAt?: "document_start" | "document_end" | "document_idle";
        }

        export function executeScript<T>(details: ExecuteScriptOptions): Promise<T>;
        export function executeScript<T>(id: number, details: ExecuteScriptOptions): Promise<T>;
    }

    namespace storage {
        namespace local {
            export function get<T>(key: string): Promise<{ [key: string]: T }>;
            export function set<T extends { [key: string]: any }>(v: T): Promise<null>;
        }
    }

    namespace find {
        interface FindOptions {
            tabId?: number;
            caseSensitive?: boolean;
            entireWord?: boolean;
            includeRangeData?: boolean;
            includeRectData?: boolean;
        }

        interface FindResult {
            count: number;
        }

        interface RangeData {
            framePos: number;
            startTextNodePos: number;
            endTextNodePos: number;
            startOffset: number;
            endOffset: number;
        }

        interface RangeDataResult {
            rangeData: RangeData[];
        }

        interface RectData {
            rectsAndTexts: {
                rectList: Array<{ bottom: number; left: number; right: number; top: number }>;
                textList: string[];
                text: string;
            };
        }

        interface RectDataResult {
            rectData: RectData[];
        }

        function find(
            query: string,
            options: FindOptions & { includeRectData: true; includeRangeData: true }
        ): Promise<FindResult & RectDataResult & RangeDataResult>;
        function find(
            query: string,
            options: FindOptions & { includeRangeData: true }
        ): Promise<FindResult & RangeDataResult>;
        function find(
            query: string,
            options: FindOptions & { includeRectData: true }
        ): Promise<FindResult & RectDataResult>;
        function find(query: string, options: FindOptions): Promise<FindResult>;
    }
}
