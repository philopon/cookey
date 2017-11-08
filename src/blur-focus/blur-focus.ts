export default class BlurFocus {
    public blur: () => void = this._blur.bind(this);
    public end: () => void = this._end.bind(this);

    _blur(): void {
        setTimeout(() => {
            const active = document.activeElement as HTMLElement;
            if (active && active.blur) {
                active.blur();
            }
        });
    }

    _end(): void {
        document.removeEventListener("focus", this.blur, true);
        document.removeEventListener("mousedown", this.end);
        document.removeEventListener("keydown", this.end);
    }

    register(): void {
        this.blur();
        document.addEventListener("focus", this.blur, true);
        document.addEventListener("mousedown", this.end);
        document.addEventListener("keydown", this.end);
    }
}
