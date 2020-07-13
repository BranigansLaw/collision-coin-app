import axios, { AxiosResponse } from 'axios';
import { Guid } from 'guid-typescript';
import { wait } from '../util';
import { IAppState } from '.';

const MAX_TRIES: number = 3;

export async function handleApiCall(
    url: string,
    getState: () => IAppState,
    data: any | undefined,
    acceptableResponseCode: number,
    requireAuth: boolean,
    successCallback: (data: any) => void,
    errorCallback?: (error: any | undefined) => void,
): Promise<void> {
    const headers: { [key: string]: string } = { 
        'Access-Control-Allow-Origin': '*',
    };

    if (requireAuth) {
        const token: string | undefined = getState().authState.authToken;
        if (token === undefined) {
            throw new Error('Token is not valid');
        }

        headers["authorization"] = `Bearer ${token}`;
    }

    let res: AxiosResponse<any> | undefined;
    const transactionId: string = Guid.create().toString();
    let numTries: number = 0;
    let errorResponseCode = 0;

    headers["TransactionId"] = transactionId;

    while ((errorResponseCode < 200 || errorResponseCode >= 500) && numTries < MAX_TRIES) {
        numTries++;
        try {
            res = await axios.post(
                url,
                data,
                {
                    headers: headers
                });
        }
        catch (e) {
            if (e.isAxiosError) {
                res = e.response;
            }
            await wait(5000);
        }

        if (res !== undefined) {
            errorResponseCode = res.status;
        }
        else {
            errorResponseCode = 500;
        }
    }

    if (res !== undefined && res.status === acceptableResponseCode) {
        successCallback(res.data);
    }
    else if (errorCallback !== undefined) {
        errorCallback(res !== undefined ? res.data : undefined);
    }
}