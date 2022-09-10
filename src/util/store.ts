import createStore from 'unistore';
import merge from 'lodash.merge';

import {betterConnect, ConnectedProps} from './connected-props';
import type {ID, Convo, Character} from './datatypes';

const storeVersion = 1;

type StoreShape = {
    version: number,
    projectName: string,
    convos: Convo[],
    chars: Character[],
    currentConvoIndex: number,
    currentCharID: ID | null,
    editedMessageID: ID | null,
    editedConvoID: ID | null,
    editedCharID: ID | null,
    exportedConvoID: ID | null,
    toBeReplacedCharID: ID | null,
    insertAboveMessageID: ID | null,
    exportConvoSettings: {
        wrapTextEnabled: boolean,
        wrapTextLength: number,
        justifyEnabled: boolean,
        justifySide: 'left' | 'right'
    }
};

const loadStore = (): StoreShape => {
    const defaultStore = {
        version: storeVersion,
        projectName: 'New Project',
        convos: [],
        chars: [],
        currentConvoIndex: -1,
        currentCharID: null,
        editedMessageID: null,
        editedConvoID: null,
        editedCharID: null,
        exportedConvoID: null,
        toBeReplacedCharID: null,
        insertAboveMessageID: null,
        exportConvoSettings: {
            wrapTextEnabled: false,
            wrapTextLength: 80,
            justifyEnabled: true,
            justifySide: 'left'
        } as const
    };
    const storedStore = localStorage.getItem('store');

    if (!storedStore) return defaultStore;
    const parsedStore = JSON.parse(storedStore) as StoreShape;
    if (parsedStore.version !== storeVersion) return defaultStore;
    merge(defaultStore, parsedStore);
    return defaultStore;
};

const store = createStore(loadStore());

store.subscribe(store => {
    localStorage.setItem('store', JSON.stringify(store));
});


const connect = betterConnect<StoreShape>();

export type InjectProps<
    Props,
    ConnectedKeys extends keyof StoreShape | readonly (keyof StoreShape)[] | ((state: StoreShape) => unknown),
    ConnectedActions = {}> =
Props & ConnectedProps<StoreShape, ConnectedKeys, ConnectedActions>;
export type {StoreShape};

export {connect, store};
