import type {StoreShape} from '../util/store';

export default (state: StoreShape, messageIndex: number): Partial<StoreShape> => {
    const convo = state.convos[state.currentConvoID!];
    const newMessages = convo.messages.slice(0);
    newMessages.splice(messageIndex, 1);
    return {convos: {...state.convos, [convo.id]: {...convo, messages: newMessages}}};
};
