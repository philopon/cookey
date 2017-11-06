type DiffKey<T extends string, U extends string> = ({ [P in T]: P } &
    { [P in U]: never } & { [x: string]: never })[T];

type Omit<T, K extends keyof T> = Pick<T, DiffKey<keyof T, K>>;

type Diff<T, U> = Omit<T, keyof U & keyof T>;

type WeakDiff<T, U> = Diff<T, U> & { [K in (keyof U & keyof T)]?: T[K] };
