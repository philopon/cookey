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
