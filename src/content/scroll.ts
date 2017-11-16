import { ScrollBy, ScrollTo } from "../command/content";
import { HORIZONTAL, TOP } from "../command/direction";

const defaultAmount: number = 200;

function isScrollable(e: Element): boolean {
    return e.scrollWidth !== e.clientWidth || e.scrollHeight !== e.clientHeight;
}

function windowIsScrollable(): boolean {
    const x0 = window.scrollX;
    const y0 = window.scrollY;
    window.scrollBy(1, 1);
    const x1 = window.scrollX;
    const y1 = window.scrollY;
    if (y0 !== y1 || x0 !== x1) {
        window.scrollTo(x0, y0);
        return true;
    }
    window.scrollBy(-1, -1);
    const x2 = window.scrollX;
    const y2 = window.scrollY;
    if (y0 !== y2 || x0 !== x2) {
        window.scrollTo(x0, y0);
        return true;
    }
    return false;
}

export class Scroller {
    private target?: Element | "window";

    _search(e: Element): Element | undefined {
        if (isScrollable(e)) {
            return e;
        }
        for (const child of Array.from(e.children)) {
            const searched = this._search(child);
            if (searched !== undefined) {
                return searched;
            }
        }
        return undefined;
    }

    search(): Element | "window" {
        if (windowIsScrollable()) {
            return "window";
        }

        return this._search(document.scrollingElement || document.body) || "window";
    }

    scrollBy({ direction, amount }: Options<ScrollBy>): void {
        if (this.target === undefined) {
            this.target = this.search();
        }

        const x = direction === HORIZONTAL ? amount || defaultAmount : 0;
        const y = direction !== HORIZONTAL ? amount || defaultAmount : 0;

        if (this.target === "window") {
            window.scrollBy(x, y);
        } else {
            this.target.scrollLeft += x;
            this.target.scrollTop += y;
        }
    }

    scrollTo({ position }: Options<ScrollTo>): void {
        if (!this.target) {
            this.target = this.search();
        }

        let y = 0;
        if (position !== TOP) {
            y = (this.target === "window" ? document.body : this.target).scrollHeight;
        }

        if (this.target === "window") {
            window.scrollTo(0, y);
        } else {
            this.target.scrollTo(0, y);
        }
    }
}
