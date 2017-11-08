import { HistoryGoOptions } from "../command/content";

export default function historyGo({ amount }: HistoryGoOptions) {
    window.history.go(amount);
}
