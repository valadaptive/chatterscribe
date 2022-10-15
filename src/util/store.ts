import createStore from 'unistore';
import merge from 'lodash.merge';

import {betterConnect, ConnectedProps} from './connected-props';
import type {ID, Convo, Character} from './datatypes';

const storeVersion = 2;

type StoreShape = {
    version: number,
    projectName: string,
    convos: Record<ID, Convo>,
    convoIDs: ID[],
    chars: Character[],
    currentConvoID: ID | null,
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
        convos: {},
        convoIDs: [],
        chars: [],
        currentConvoID: null,
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
    // Import v1 autosaves.
    // TODO: save "session" separately from other state (using serialization code) to avoid losing work
    if (parsedStore.version === 1) {
        const oldConvos = parsedStore.convos as unknown as Convo[];
        parsedStore.convos = {};
        parsedStore.convoIDs = [];
        for (const convo of oldConvos) {
            parsedStore.convos[convo.id] = convo;
            parsedStore.convoIDs.push(convo.id);
        }
        parsedStore.version = 2;
    }
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
