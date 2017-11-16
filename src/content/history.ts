import { HistoryGo } from "../command/content";

export default function historyGo({ amount }: Options<HistoryGo>): void {
    window.history.go(amount);
}
