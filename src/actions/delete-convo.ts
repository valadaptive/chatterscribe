import {batch} from '@preact/signals';

import type {AppState} from '../util/store';
import type {ID} from '../util/datatypes';

export default (state: AppState, id: ID): void => {
    batch(() => {
    // Use object spread/rest to omit the convo with a given ID from state.convos
        const {[id]: __, ...newConvos} = state.convos.value;

        const convoIndex = state.convoIDs.value.findIndex(convoID => convoID === id);

        state.convos.value = newConvos;
        state.convoIDs.value = state.convoIDs.value.filter(existingID => existingID !== id);
        if (state.convoIDs.value.length === 0) {
            state.currentConvoID.value = null;
        } else if (convoIndex === state.convoIDs.value.length) {
            // If the deleted convo is selected and the last one in the list, select the previous one
            state.currentConvoID.value = state.convoIDs.value[convoIndex - 1];
        } else {
            // TODO: revisit
            state.currentConvoID.value = state.convoIDs.value[convoIndex];
        }
    });
};
