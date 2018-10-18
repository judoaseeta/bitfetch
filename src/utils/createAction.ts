import { Action } from 'redux';
export interface ActionWithPayload<T extends string, P> extends Action<T> {
    payload: P
}
export function createAction<T extends string>(type: T): Action<T>;
export function createAction<T extends string, P>(type: T, payload: P): ActionWithPayload<T, P>;
export function createAction<T extends string, P>(type:T, payload?: P) {
    // Without this statement, it always evaluates 0 as 'undefined'
    if(typeof payload ===  'number' && payload === 0) {
        return { type, payload }
    } else if (typeof payload === 'boolean') {
        return { type, payload }
    }
    return payload ? { type, payload } : {type}
}
type FunctionType = (...args: any[]) => any;
export type ActionCreatorObject = { [actionCreator: string]: FunctionType};
export type ActionsUnion<A extends ActionCreatorObject> = ReturnType<A [keyof A]>