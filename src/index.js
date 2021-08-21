import './forms.scss';

import createStore from 'unistore';
import {Provider} from 'unistore/preact';

import App from './components/App/App.jsx';

const storeVersion = 1;

const loadStore = () => {
    const storedStore = localStorage.getItem('store');

    if (!storedStore) return null;
    const parsedStore = JSON.parse(storedStore);
    if (parsedStore.version !== storeVersion) return null;
    return parsedStore;
};

const store =  createStore(loadStore() || {
    version: storeVersion,
    projectName: 'New Project',
    convos: [],
    chars: [],
    currentConvoIndex: -1,
    currentCharID: null,
    editedMessageID: null,
    editedConvoID: null,
    editedCharID: null,
    toBeReplacedCharID: null,
    insertAboveMessageID: null
});

store.subscribe(store => {
    localStorage.setItem('store', JSON.stringify(store));
});

const Main = () => (
    <Provider store={store}>
        <App />
    </Provider>
);

export default Main;
