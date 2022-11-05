import {batch} from '@preact/signals';

import createConvo from '../util/create-convo';
import type {AppState} from '../util/store';

export default (state: AppState): void => {
    batch(() => {
        const newConvo = createConvo();
        state.convos.value = {...state.convos.value, [newConvo.id]: newConvo};
        state.convoIDs.value = [...state.convoIDs.value, newConvo.id];
        state.currentConvoID.value = newConvo.id;
    });
};
