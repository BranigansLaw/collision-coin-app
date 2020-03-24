import axios, { AxiosResponse } from 'axios';
import { Guid } from 'guid-typescript';
import { wait } from '../util';
import { IAppState } from '.';

export async function handleApiCall(
    url: string,
    getState: () => IAppState,
    data: any | undefined,
    acceptableResponseCode: number,
    successCallback: (data: any) => void,
    errorCallback?: (error: any | undefined) => void,
): Promise<void> {
    const token: string | undefined = getState().authState.authToken;
    if (token === undefined) {
        throw new Error('Token is not valid');
    }

    let res: AxiosResponse<any> | undefined;
    const transactionId: string = Guid.create().toString();
    let errorOccurred: boolean = true;

    while (errorOccurred) {
        errorOccurred = false;
        try {
            res = await axios.post(
                url,
                data,
                {
                    headers: { 
                        'Access-Control-Allow-Origin': '*',
                        authorization: `Bearer ${token}`,
                        'TransactionId': transactionId,
                    }
                });
        }
        catch (e) {
            if (e.isAxiosError) {
                res = e.response;
            }
            errorOccurred = true;
            await wait(5000);
        }
    }

    if (res !== undefined && res.status === acceptableResponseCode) {
        successCallback(res.data);
    }
    else if (errorCallback !== undefined) {
        errorCallback(res !== undefined ? res.data : undefined);
    }
}