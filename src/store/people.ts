import { Action, ActionCreator, Dispatch, Reducer } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { neverReached } from '.';

// Store
export interface IPerson {
    id: number,
    name: string;
    age: number;
}

export interface IPeopleState {
    readonly people: IPerson[];
    readonly loading: boolean;
    readonly posting: boolean;
}

const initialPeopleState: IPeopleState = {
    people: [],
    loading: false,
    posting: false,
};

// Actions
interface IPostPersonResult {
    success: boolean;
    person: IPerson
}

export interface IGettingPeopleAction extends Action<'GettingPeople'> {}

export interface IGotPeopleAction extends Action<'GotPeople'> {
  people: IPerson[];
}

export interface IPostingPersonAction extends Action<'PostingPerson'> {
  type: 'PostingPerson';
}

export interface IPostedPersonAction extends Action<'PostedPerson'> {
  result: IPostPersonResult;
}

export type PeopleActions =
  | IGettingPeopleAction
  | IGotPeopleAction
  | IPostingPersonAction
  | IPostedPersonAction;

// Action Creators
const getPeopleFromApi = (): Promise<IPerson[]> => {
    const promise: Promise<IPerson[]> = new Promise((resolve, reject) => {
        resolve([
            { id: 1, name: 'Tyler', age: 34 },
            { id: 2, name: 'Kate', age: 26 }
        ]);
    });

    return promise;
}

export const getPeopleActionCreator: ActionCreator<
  ThunkAction<
    Promise<IGotPeopleAction>,  // The type of the last action to be dispatched - will always be promise<T> for async actions
    IPerson[],                  // The type for the data within the last action
    null,                       // The type of the parameter for the nested function 
    IGotPeopleAction            // The type of the last action to be dispatched
  >
> = () => {
  return async (dispatch: Dispatch) => {
    const gettingPeopleAction: IGettingPeopleAction = {
      type: 'GettingPeople',
    };
    dispatch(gettingPeopleAction);
    const people: IPerson[] = await getPeopleFromApi();
    const gotPeopleAction: IGotPeopleAction = {
      people,
      type: 'GotPeople',
    };
    return dispatch(gotPeopleAction);
  };
};

export interface IPostPerson {
    toPost: IPerson;
}

const postPersonFromApi = (toPost: IPostPerson): Promise<IPostPersonResult> => {
    const promise: Promise<IPostPersonResult> = new Promise((resolve, reject) => {
        resolve({
            success: true,
            person: {
                id: 3,
                name: 'Scott',
                age: 63
            }
        });
    });

    return promise;
}

export const postPersonActionCreator: ActionCreator<
  ThunkAction<
    Promise<IPostedPersonAction>, // The type of the last action to be dispatched - will always be promise<T> for async actions
    IPostPersonResult,            // The type for the data within the last action
    IPostPerson,                  // The type of the parameter for the nested function 
    IPostedPersonAction           // The type of the last action to be dispatched
  >
> = (person: IPostPerson) => {
  return async (dispatch: Dispatch) => {
    const postingPersonAction: IPostingPersonAction = {
      type: 'PostingPerson',
    };
    dispatch(postingPersonAction);
    const result = await postPersonFromApi(person);
    const postPersonAction: IPostedPersonAction = {
      type: 'PostedPerson',
      result,
    };
    return dispatch(postPersonAction);
  };
};

// Reducers
export const peopleReducer: Reducer<IPeopleState, PeopleActions> = (
    state = initialPeopleState,
    action,
) => {
    switch (action.type) {
        case 'GettingPeople': {   
            return {
                ...state,
                loading: true,
            };
        }
        case 'GotPeople': {
            return {
                ...state,
                people: action.people,
                loading: false,
            };
        }
        case 'PostingPerson': {
            return {
                ...state,
                posting: true,
            };
        }
        case 'PostedPerson': {
            return {
                ...state,
                posting: false,
                people: state.people.concat(action.result.person),
            };
        }
        default:
        neverReached(action); // when a new action is created, this helps us remember to handle it in the reducer
    }
    return state;
};