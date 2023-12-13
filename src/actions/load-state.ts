import {batch} from '@preact/signals';

import type {AppState} from '../util/store';
import type {ID, Convo, Character} from '../util/datatypes';

export default (state: AppState, json: {
    projectName: string,
    convos: Convo[],
    chars: Character[]
}): void => {
    batch(() => {
        const convosByID: Record<ID, Convo> = {};
        for (const convo of json.convos) {
            convosByID[convo.id] = convo;
        }
        state.projectName.value = json.projectName;
        state.convos.value = convosByID;
        state.convoIDs.value = json.convos.map(convo => convo.id);
        state.chars.value = json.chars;
        state.currentConvoID.value = null;
    });
};
