export function exhaustiveCheck(_a: never): void {}

export function clip(a: number, l: number, u: number): number {
    if (a > u) {
        return u;
    }
    if (a < l) {
        return l;
    }
    return a;
}

export function euclideanMod(n: number, m: number): number {
    return (n % m + m) % m;
}

const sanitizeDict: { [key: string]: string } = {
    "&": "&amp;",
    "'": "&#x27;",
    "`": "&#x60;",
    '"': "&quot;",
    "<": "&lt;",
    ">": "&gt;",
};

export function sanitize(s: string): string {
    return s.replace(/[&'`"<>]/g, match => {
        return sanitizeDict[match];
    });
}
