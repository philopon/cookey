import { SubmitQuery } from "../message/content-to-background";
import * as B2C from "../message/background-to-content";
import * as BC from "../command/background";

let query: string = "";
let caseSensitive: boolean = false;

export function setQuery({ query: q }: SubmitQuery): void {
    query = q;
}

export function startSearch({ caseSensitive: c }: Options<BC.StartSearch>): B2C.StartSearch {
    caseSensitive = c || false;
    return B2C.StartSearch({ query, caseSensitive });
}

export function searchJump({ backward, wrapAround }: Options<BC.SearchJump>): B2C.SearchJump {
    return B2C.SearchJump({
        query,
        caseSensitive,
        backward: backward === undefined ? false : backward,
        wrapAround: wrapAround === undefined ? true : wrapAround,
    });
}
