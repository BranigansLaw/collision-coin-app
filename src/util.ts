export function getCurrentTimeEpochMilliseconds() : number {
    return Date.now();
}

export function dateToEpochMilliseconds(toConvert: Date): number {
    return Number(toConvert);
}

export function validNonEmptyString(toTest: string | null | undefined) : boolean {
    return toTest !== undefined && toTest !== null && toTest !== '';
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