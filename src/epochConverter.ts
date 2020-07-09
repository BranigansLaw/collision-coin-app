import moment, { Moment } from 'moment';

export function getCurrentTimeEpochMilliseconds() : number {
    return Date.now();
}

export function dateToEpochMilliseconds(toConvert: Date): number {
    return Number(toConvert);
}

export const nowBetweenEpochs = (startEpoch: number, endEpoch: number): boolean  => {
    const start: Moment = moment(startEpoch);
    const end: Moment = moment(endEpoch);
    const now: Moment = moment();

    return now >= start && now <= end;
}