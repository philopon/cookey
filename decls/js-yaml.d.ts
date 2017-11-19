declare module "js-yaml" {
    namespace jsYaml {
        export function safeLoad<T>(data: string): T;
        export class YAMLException {
            public name: string;
            public reason: string;
            public message: string;
            public stack: string;
            public mark: { buffer: string; column: number; line: number };
        }
    }

    export default jsYaml;
}
