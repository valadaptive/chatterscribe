import type {StoreShape} from '../util/store';
import type {ID, Convo} from '../util/datatypes';

export default (state: StoreShape, oldID: ID, newID: ID): Partial<StoreShape> => {
    const newConvos: Record<ID, Convo> = {};
    for (const convo of Object.values(state.convos)) {
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
    return {convos: newConvos};
};
