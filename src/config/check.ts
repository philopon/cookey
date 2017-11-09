import * as fs from "fs";
import * as toml from "toml";
import * as Ajv from "ajv";
import schema from "./schema";

function main(path?: string) {
    if (!path) {
        console.log(JSON.stringify(schema, null, 2));
        return;
    }

    const ajv = new Ajv();
    const validate = ajv.compile(schema);

    fs.readFile(process.argv[2], (err, data) => {
        if (err) {
            console.warn(err);
            return;
        }

        if (!validate(toml.parse(data.toString()))) {
            console.warn(validate.errors);
        } else {
            console.log("OK");
        }
    });
}

main(process.argv[2]);
