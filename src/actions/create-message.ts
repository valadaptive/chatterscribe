import {batch} from '@preact/signals';

import id from '../util/id';
import createConvo from './create-convo';
import createCharacter from './create-character';
import type {AppState} from '../util/store';

export default (state: AppState, messageContents: string, beforeMessageIndex?: number): void => {
    batch(() => {
        if (state.currentConvoID.value === null) {
            createConvo(state);
        }

        if (state.currentCharID.value === null) {
            createCharacter(state);
        }

        // TODO: pass in currentConvoID or convo
        const convo = state.convos.value[state.currentConvoID.value!];
        const newMessages = convo.messages.slice(0);
        const newMessage = {
            authorID: state.currentCharID.value!,
            contents: messageContents,
            id: id()
        };
        if (typeof beforeMessageIndex === 'number') {
            newMessages.splice(beforeMessageIndex, 0, newMessage);
        } else {
            newMessages.push(newMessage);
        }

        state.convos.value = {
            ...state.convos.value,
            [state.currentConvoID.value!]: {
                ...convo, messages: newMessages
            }
        };
    });
};
