import { SubmitQuery } from "../message/content-to-background";
import { StartSearchMsg, SearchJumpMsg } from "../message/background-to-content";
import { StartSearchOptions, SearchJumpOptions } from "../command/background";

let query: string = "";
let caseSensitive: boolean = false;

export function setQuery({ query: q }: SubmitQuery): void {
    query = q;
}

export function startSearch({ caseSensitive: c }: StartSearchOptions): StartSearchMsg {
    caseSensitive = c || false;
    return StartSearchMsg({ query, caseSensitive });
}

export function searchJump({ backward, wrapAround }: SearchJumpOptions): SearchJumpMsg {
    return SearchJumpMsg({
        query,
        caseSensitive,
        backward: backward === undefined ? false : backward,
        wrapAround: wrapAround === undefined ? true : wrapAround,
    });
}
