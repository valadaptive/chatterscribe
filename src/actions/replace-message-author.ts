import type {AppState} from '../util/store';
import type {ID} from '../util/datatypes';

export default (state: AppState, convoID: ID, index: number, authorID: ID): void => {
    const convo = state.convos.value[convoID];
    const newMessages = convo.messages.slice(0);
    newMessages[index] = {...newMessages[index], authorID};

    state.convos.value = {...state.convos.value, [convoID]: {...convo, messages: newMessages}};
};
