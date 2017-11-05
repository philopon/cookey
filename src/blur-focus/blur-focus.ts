export default class BlurFocus {
    public blur = this._blur.bind(this);
    public end = this._end.bind(this);

    _blur() {
        setTimeout(() => {
            (document.activeElement as HTMLElement).blur();
        });
    }

    _end() {
        document.removeEventListener("focus", this.blur, true);
        document.removeEventListener("mousedown", this.end);
        document.removeEventListener("keydown", this.end);
    }

    register() {
        this.blur();
        document.addEventListener("focus", this.blur, true);
        document.addEventListener("mousedown", this.end);
        document.addEventListener("keydown", this.end);
    }
}
