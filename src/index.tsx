import './forms.scss';

import {render, JSX} from 'preact';
import {Provider} from 'unistore/preact';

import App from './components/App/App';

import {store} from './util/store';


const Main = (): JSX.Element => (
    <Provider store={store}>
        <App />
    </Provider>
);

render(<Main />, document.body);
