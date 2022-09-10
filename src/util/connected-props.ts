import {connect} from 'unistore/preact';
import type {ComponentConstructor, AnyComponent} from 'preact';

type StateFunction<StoreShape, StoreFunc> =
    StoreFunc extends (state: StoreShape, ...args: infer P) => Partial<StoreShape> ?
        (...args: P) => Partial<StoreShape> :
        never;

type ConnectedActionTypes<StoreShape, Actions> = {
    [ActionName in keyof Actions]: StateFunction<StoreShape, Actions[ActionName]>;
};

type ConnectedProps<
    StoreShape,
    ConnectedKeys extends keyof StoreShape | readonly (keyof StoreShape)[] | ((state: StoreShape) => unknown),
    connectedActions> =
    (ConnectedKeys extends ((state: StoreShape) => infer T) ?
        T :
        Pick<StoreShape, ConnectedKeys extends readonly (keyof StoreShape)[] ?
            ConnectedKeys[number] :
            (ConnectedKeys extends keyof StoreShape ? ConnectedKeys : never)>) &
    ConnectedActionTypes<StoreShape, connectedActions>;

export type {ConnectedProps};

const betterConnect = (() => connect) as <StoreShape>() => <
    ConnectedKeys extends keyof StoreShape | readonly (keyof StoreShape)[] | ((state: StoreShape) => unknown),
    ConnectedActions = {}>(
    mapStateToProps: ConnectedKeys,
    actions?: ConnectedActions
) => <Props, State>(
    Child: ComponentConstructor<Props & ConnectedProps<StoreShape, ConnectedKeys, ConnectedActions>, State> |
    AnyComponent<Props & ConnectedProps<StoreShape, ConnectedKeys, ConnectedActions>, State>
) => ComponentConstructor<Omit<Props, keyof ConnectedProps<StoreShape, ConnectedKeys, ConnectedActions>>, State>;

export {betterConnect};
