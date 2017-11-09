import { ScrollByOptions, ScrollToOptions } from "../command/content";
import { HORIZONTAL, TOP } from "../command/direction";

const defaultAmount = 200;

export function scrollBy({ direction, amount }: ScrollByOptions): void {
    if (direction === HORIZONTAL) {
        window.scrollBy(amount || defaultAmount, 0);
    } else {
        window.scrollBy(0, amount || defaultAmount);
    }
}

export function scrollTo({ position }: ScrollToOptions): void {
    if (position === TOP) {
        window.scrollTo(0, 0);
    } else {
        window.scrollTo(0, document.body.scrollHeight);
    }
}
