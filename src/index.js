import './forms.scss';

import createStore from 'unistore';
import {Provider} from 'unistore/preact';
import merge from 'lodash.merge';

import App from './components/App/App.jsx';

const storeVersion = 1;

const loadStore = () => {
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
        }
    };
    const storedStore = localStorage.getItem('store');

    if (!storedStore) return defaultStore;
    const parsedStore = JSON.parse(storedStore);
    if (parsedStore.version !== storeVersion) return defaultStore;
    merge(defaultStore, parsedStore);
    return defaultStore;
};

const store =  createStore(loadStore());

store.subscribe(store => {
    localStorage.setItem('store', JSON.stringify(store));
});

const Main = () => (
    <Provider store={store}>
        <App />
    </Provider>
);

export default Main;
