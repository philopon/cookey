import { HistoryGoOptions } from "../command/content";

export default function historyGo({ amount }: HistoryGoOptions): void {
    window.history.go(amount);
}
