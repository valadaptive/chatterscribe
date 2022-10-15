import type {StoreShape} from '../util/store';
import type {ID} from '../util/datatypes';

export default (state: StoreShape, convoID: ID, index: number, authorID: ID): Partial<StoreShape> => {
    const convo = state.convos[convoID];
    if (!convo) return {};
    const newMessages = convo.messages.slice(0);
    newMessages[index] = {...newMessages[index], authorID};

    return {convos: {...state.convos, [convoID]: {...convo, messages: newMessages}}};
};
