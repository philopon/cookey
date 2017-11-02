import { ScrollOptions, UP, DOWN, LEFT, RIGHT } from "../command";
import { exhaustiveCheck } from "../utils";

export default function scroll({ direction, amount }: ScrollOptions) {
    const activeNode = document.activeElement;
    if (activeNode.nodeName === "INPUT" || activeNode.nodeName === "TEXTAREA") {
        return;
    }
    let x = 0;
    let y = 0;
    switch (direction) {
        case UP:
            y = -amount;
            break;
        case DOWN:
            y = amount;
            break;
        case LEFT:
            x = -amount;
            break;
        case RIGHT:
            x = amount;
            break;
        default:
            exhaustiveCheck(direction);
    }
    window.scrollBy(x, y);
}
