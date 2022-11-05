import type {AppState} from '../util/store';
import type {ID, Convo} from '../util/datatypes';

export default (state: AppState, oldID: ID, newID: ID): void => {
    const newConvos: Record<ID, Convo> = {};
    for (const convo of Object.values(state.convos.value)) {
        let changed = false;
        let {messages} = convo;
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            if (message.authorID !== oldID) continue;

            // Don't clone convo.messages until we know we need to modify it
            if (!changed) {
                changed = true;
                messages = messages.slice(0);
            }

            messages[i] = {...message, authorID: newID};
        }

        newConvos[convo.id] = changed ? {...convo, messages} : convo;
    }
    state.convos.value = newConvos;
};
