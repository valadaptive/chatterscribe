import id from '../util/id';
import createConvo from './create-convo';
import createCharacter from './create-character';
import type {StoreShape} from '../util/store';

export default (state: StoreShape, messageContents: string, beforeMessageIndex?: number): Partial<StoreShape> => {
    if (state.currentConvoID === null) {
        state = {...state, ...createConvo(state)};
    }

    if (state.currentCharID === null) {
        state = {...state, ...createCharacter(state)};
    }

    // TODO: pass in currentConvoID or convo
    const convo = state.convos[state.currentConvoID!];
    const newMessages = convo.messages.slice(0);
    const newMessage = {
        authorID: state.currentCharID!,
        contents: messageContents,
        id: id()
    };
    if (typeof beforeMessageIndex === 'number') {
        newMessages.splice(beforeMessageIndex, 0, newMessage);
    } else {
        newMessages.push(newMessage);
    }

    return {
        ...state,
        convos: {
            ...state.convos,
            [state.currentConvoID!]: {
                ...convo, messages: newMessages
            }
        }
    };
};
