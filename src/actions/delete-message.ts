import type {AppState} from '../util/store';

export default (state: AppState, messageIndex: number): void => {
    // TODO: pass in currentConvoID
    const convo = state.convos.value[state.currentConvoID.value!];
    const newMessages = convo.messages.slice(0);
    newMessages.splice(messageIndex, 1);
    state.convos.value = {...state.convos.value, [convo.id]: {...convo, messages: newMessages}};
};
