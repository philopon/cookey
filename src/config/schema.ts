import * as CC from "../command/content";
import * as BC from "../command/background";
import * as Dir from "../command/direction";

type SchemaValue = Schema | string | boolean;

interface Schema {
    [key: string]: SchemaValue | SchemaValue[];
}

function jenum(...cand: string[]): Schema {
    return {
        type: ["string"],
        enum: cand,
    };
}

function jobject(properties: Schema, required?: string[]): Schema {
    const obj: Schema = {
        type: "object",
        additionalProperties: false,
        properties,
    };
    if (required !== undefined) {
        obj["required"] = required;
    }
    return obj;
}

function jboolean(value: boolean | undefined = undefined) {
    if (value === undefined) {
        return { type: "boolean" };
    }
    return { type: "boolean", enum: [value] };
}

function jarray(items?: Schema): Schema {
    if (items) {
        return { type: "array", items };
    }
    return { type: "array" };
}

function jnumber(): Schema {
    return { type: "number" };
}

function jstring(): Schema {
    return { type: "string" };
}

const switchTab = jobject(
    {
        type: jenum(BC.SWITCH_TAB),
        direction: jenum(Dir.LEFT, Dir.RIGHT),
        cycle: jboolean(),
    },
    ["direction"]
);

const reload = jobject({
    type: jenum(BC.RELOAD),
    bypassCache: jboolean(),
});

const scrollBy = jobject({
    type: jenum(CC.SCROLL_BY),
    amount: jnumber(),
    direction: jenum(Dir.HORIZONTAL, Dir.VERTICAL),
});

const newTab = jobject({
    type: jenum(BC.NEW_TAB),
    url: jstring(),
    background: jboolean(),
    position: jenum(Dir.FIRST, Dir.LAST, Dir.RIGHT, Dir.LEFT),
});

const closeTab = jobject({
    type: jenum(BC.CLOSE_TAB),
    dontCloseLastTab: jboolean(),
    dontClosePinnedTab: jboolean(),
});

const scrollTo = jobject(
    {
        type: jenum(CC.SCROLL_TO),
        position: jenum(Dir.TOP, Dir.BOTTOM),
    },
    ["position"]
);

const yank = jobject({
    type: jenum(BC.YANK),
});

const pasteCur = jobject({
    type: jenum(BC.PASTE),
    newTab: jboolean(false),
});

const pasteNew = jobject(
    {
        type: jenum(BC.PASTE),
        newTab: jboolean(true),
        background: jboolean(),
        position: jenum(Dir.FIRST, Dir.LAST, Dir.RIGHT, Dir.LEFT),
    },
    ["newTab"]
);

const goUp = jobject({
    type: jenum(BC.GO_UP),
    top: jboolean(),
});

const historyGo = jobject(
    {
        type: jenum(CC.HISTORY_GO),
        amount: jnumber(),
    },
    ["amount"]
);

const restoreTab = jobject({ type: jenum(BC.RESTORE_TAB) });

const startSearch = jobject({
    type: jenum(BC.START_SEARCH),
    caseSensitive: jboolean(),
});

const searchJump = jobject({
    type: jenum(BC.SEARCH_JUMP),
    backward: jboolean(),
    wrapAround: jboolean(),
});

const schema: Schema = {
    $schema: "http://json-schema.org/draft-06/schema#",
    type: "object",
    additionalProperties: false,
    properties: {
        blurFocus: jboolean(),
        ignore: {
            type: "object",
            additionalProperties: false,
            patternProperties: {
                ".*": jarray(jstring()),
            },
        },
        key: {
            type: "object",
            additionalProperties: false,
            patternProperties: {
                ".*": {
                    required: ["type"],
                    anyOf: [
                        switchTab,
                        reload,
                        scrollBy,
                        newTab,
                        closeTab,
                        scrollTo,
                        yank,
                        pasteCur,
                        pasteNew,
                        goUp,
                        historyGo,
                        restoreTab,
                        startSearch,
                        searchJump,
                    ],
                },
            },
        },
    },
};

export default schema;