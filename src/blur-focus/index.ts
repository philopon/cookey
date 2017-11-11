export default class BlurFocus {
    private blur: () => void = this._blur.bind(this);
    private enabled: boolean = false;
    private interacted: boolean = false;

    enable() {
        if (this.enabled) {
            return;
        }
        this.enabled = true;
        this._register();
    }

    private _register() {
        document.addEventListener("focus", this.blur, true);
        const autofocus = document.querySelector<HTMLInputElement>("[autofocus]");
        if (autofocus) {
            autofocus.blur();
        }
    }

    private _unregister() {
        document.removeEventListener("focus", this.blur, true);
    }

    _blur(): void {
        if (this.interacted) {
            this._unregister();
            return;
        }

        setTimeout(() => {
            const active = document.activeElement as HTMLElement;
            if (active && active.blur) {
                active.blur();
            }
        }, 0);
    }

    touch(): void {
        this.interacted = true;
    }
}
