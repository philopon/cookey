declare namespace browser {
    namespace runtime {
        export function sendMessage<T>(msg: T): Promise<undefined>;

        namespace onMessage {
            export function addListener<T>(callback: (msg: T) => void): void;
        }
    }

    namespace tabs {
        interface Tab {
            id: number;
            index: number;
        }

        interface Query {
            active?: boolean;
        }

        function query(query: Query): Promise<Tab[]>;

        interface Update {
            active: boolean;
        }

        function update(id: number, update: Update): Promise<Tab>;

        interface ReloadProperties {
            bypassCache: boolean;
        }
        function reload(id: number, props: ReloadProperties): Promise<undefined>;

        function sendMessage<T>(id: number, message: T): Promise<any>;
    }

    namespace storage {
        namespace local {
            export function get<T>(key: string): Promise<{ [key: string]: T }>;
            export function set<T extends { [key: string]: any }>(v: T): Promise<null>;
        }
    }
}
