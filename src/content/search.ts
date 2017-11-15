import { SearchJumpMsgOptions, StartSearchMsgOptions } from "../message/background-to-content";
import windowFind from "../patch/window-find";
import SearchBox from "./interface/search";

const search = new SearchBox();

export async function startSearch({ query, caseSensitive }: StartSearchMsgOptions) {
    await search.show(query, caseSensitive);
}

export async function searchJump({
    query,
    backward,
    wrapAround,
    caseSensitive,
}: SearchJumpMsgOptions) {
    windowFind(query, caseSensitive, backward, wrapAround);
}
