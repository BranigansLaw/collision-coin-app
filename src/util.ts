export function validNonEmptyString(toTest: string | null | undefined) : boolean {
    return toTest !== undefined && toTest !== null && toTest !== '';
}

export function minLengthString(toTest: string | null | undefined, minLength: number) : boolean {
    return toTest !== undefined && toTest !== null && toTest !== '' && toTest.length >= minLength;
}

export function nullStringToEmpty(toChange: string | null): string {
    return toChange === null ? '' : toChange;
}

export function ab2str(buf: ArrayBuffer): string {
    const bytes = new Uint8Array(buf);
    const dv = new DataView(bytes.buffer);
    return dv.getUint16(0, true).toString();
}

export interface IMergeableObject {
    id: string;
    deleted?: boolean;
}

export function mergeLists<T extends IMergeableObject>(
    existingList: T[],
    toMerge: T[],
): T[] {
    const newItems: Map<string, T> = new Map();
    toMerge.forEach(a => newItems.set(a.id.toString(), a));
    existingList.forEach(a => {
        if (!newItems.has(a.id.toString()) && !a.deleted) {
            newItems.set(a.id.toString(), a);
        }
    });

    return Array.from(newItems.values());
}

export function mergeListsWithSelector<T extends IMergeableObject>(
    existingList: T[],
    toMerge: T[],
    selector: (c1: T) => string,
): T[] {
    const newItems: Map<string, T> = new Map();
    const modSelector: (c1: T) => string = (c1: T) => selector(c1).toLowerCase();
    toMerge.forEach(a => newItems.set(modSelector(a), a));
    existingList.forEach(a => {
        if (!newItems.has(modSelector(a)) && !a.deleted) {
            newItems.set(modSelector(a), a);
        }
    });

    return Array.from(newItems.values());
}

export function range(start: number, stop: number, step: number): number[] {
    if (start >= stop) {
        return [];
    }

    const a = [start];
    let b = start;
    while (b < stop) {
        a.push(b += step || 1);
    }
    return a;
}

export function getTimeString(date: Date) {
    const hourStr: string = date.getHours() + "";
    let minStr: string = date.getMinutes() + "";

    while (minStr.length < 2) {
        minStr = "0" + minStr;
    }

    return `${hourStr}:${minStr}`;
}

export function wait(timeoutMilliseconds: number) {
    return new Promise(resolve => {
        setTimeout(resolve, timeoutMilliseconds);
    });
}

export function timeDifference(d1: Date, d2: Date): string {
    const seconds = Math.floor((Number(d2) - Number(d1)) / 1000);

    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }

    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }

    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }

    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }

    return Math.floor(seconds) + " seconds";
}

export function stringNullEmptyOrUndefined(s: string | null | undefined): boolean {
    return s === '' || s === null || s === undefined;
}