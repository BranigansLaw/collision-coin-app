export function getCurrentTimeEpochMilliseconds() : number {
    return Date.now();
}

export function validNonEmptyString(toTest: string | null | undefined) : boolean {
    return toTest !== undefined && toTest !== null && toTest !== '';
}