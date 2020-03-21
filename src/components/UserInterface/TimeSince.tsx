import React from 'react';
import { timeDifference } from '../../util';

const intervalSeconds: number = 15;

interface IProps {
    sinceEpochMilliseconds: number;
}

const TimeSince: React.FC<IProps> = ({
    sinceEpochMilliseconds,
}) => {
    const [time, setTime] = React.useState<number>(Date.now());

    React.useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), intervalSeconds * 1000);
        return () => {
            clearInterval(interval);
        };
    }, [setTime]);

    return <>
        {timeDifference(new Date(sinceEpochMilliseconds), new Date(time))}
    </>;
}

export default (TimeSince);