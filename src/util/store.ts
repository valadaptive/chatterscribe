import {createContext} from 'preact';
import {useContext, useMemo} from 'preact/hooks';
import {signal, effect, Signal, batch} from '@preact/signals';

import type {ID, Convo, Character} from './datatypes';
import saveState from '../serialization/save-state';
import validate from '../serialization/validate';

import loadState from '../actions/load-state';

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

type SignalState<S, SignalKeys extends string> = {
    [K in keyof S]: K extends SignalKeys ? SignalState<S[K], SignalKeys> : Signal<S[K]>
};

type AppState = SignalState<StoreShape, 'exportConvoSettings'>;

const loadLegacyState = (store: AppState): void => {
    const storedStore = localStorage.getItem('store');
    if (!storedStore) return;
    const parsedStore = JSON.parse(storedStore) as StoreShape;
    // Import v1 autosaves.
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
    if (parsedStore.version !== storeVersion) return;

    batch(() => {
        store.convos.value = parsedStore.convos;
        store.convoIDs.value = parsedStore.convoIDs;
        store.chars.value = parsedStore.chars;
        store.projectName.value = parsedStore.projectName;
    });

    localStorage.removeItem('store');
};

const loadStore = (): AppState => {
    const defaultStore: AppState = {
        version: signal(storeVersion),
        projectName: signal('New Project'),
        convos: signal({}),
        convoIDs: signal([]),
        chars: signal([]),
        currentConvoID: signal(null),
        currentCharID: signal(null),
        editedMessageID: signal(null),
        editedConvoID: signal(null),
        editedCharID: signal(null),
        exportedConvoID: signal(null),
        toBeReplacedCharID: signal(null),
        insertAboveMessageID: signal(null),
        exportConvoSettings: {
            wrapTextEnabled: signal(false),
            wrapTextLength: signal(80),
            justifyEnabled: signal(true),
            justifySide: signal('left' as const)
        }
    };

    loadLegacyState(defaultStore);

    const autosave = localStorage.getItem('autosave');
    if (autosave) {
        const parsedAutosave: unknown = JSON.parse(autosave);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        if (validate(parsedAutosave).length === 0) loadState(defaultStore, parsedAutosave as any);
    }

    return defaultStore;
};

const store = loadStore();

effect(() => {
    const {projectName, convos, convoIDs, chars} = store;
    const savedState = saveState({
        projectName: projectName.value,
        version: 1,
        convos: convoIDs.value.map(id => convos.value[id]),
        chars: chars.value
    });
    localStorage.setItem('autosave', savedState);
});

const AppContext = createContext(store);

const useAppState = (): AppState => useContext(AppContext);
const useAction = <T extends unknown[]>(func: (store: AppState, ...args: T) => void): ((...args: T) => void) => {
    const context = useContext(AppContext);
    return useMemo(() => func.bind(null, context), [context]);
};

export {useAppState, useAction, AppState, AppContext, store};
