export function getCurrentTimeEpochMilliseconds() : number {
    return Date.now();
}

export function dateToEpochMilliseconds(toConvert: Date): number {
    return Number(toConvert);
}

export function validNonEmptyString(toTest: string | null | undefined) : boolean {
    return toTest !== undefined && toTest !== null && toTest !== '';
}

export function minLengthString(toTest: string | null | undefined, minLength: number) : boolean {
    return toTest !== undefined && toTest !== null && toTest !== '' && toTest.length >= minLength;
}

export function nullValueToUndefined<T>(toChange: T | null): T | undefined {
    return toChange === null ? undefined : toChange;
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

export function range(start: number, stop: number, step: number): number[] {
    if (start >= stop) {
        return [];
    }

    var a = [start], b = start;
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