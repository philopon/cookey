import { ScrollByOptions, ScrollToOptions } from "../command";
import { HORIZONTAL, TOP } from "../command/direction";

export function scrollBy({ direction, amount }: ScrollByOptions) {
    if (direction === HORIZONTAL) {
        window.scrollBy(amount, 0);
    } else {
        window.scrollBy(0, amount);
    }
}

export function scrollTo({ position }: ScrollToOptions) {
    if (position === TOP) {
        window.scrollTo(0, 0);
    } else {
        window.scrollTo(0, document.body.scrollHeight);
    }
}
