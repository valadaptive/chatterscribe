import './forms.scss';

import {render, JSX} from 'preact';

import 'preact/debug';

import App from './components/App/App';

import {AppContext, store} from './util/store';


const Main = (): JSX.Element => (
    <AppContext.Provider value={store}>
        <App />
    </AppContext.Provider>
);

render(<Main />, document.body);
