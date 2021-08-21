import id from '../util/id';
import createConvo from './create-convo';
import createCharacter from './create-character';

export default (state, messageContents, beforeMessageIndex) => {
    if (state.currentConvoIndex === -1) {
        state = {...state, ...createConvo(state)};
    }

    if (state.currentCharID === null) {
        state = {...state, ...createCharacter(state)};
    }

    return {
        ...state,
        convos: state.convos.map((convo, i) => {
            if (i !== state.currentConvoIndex) return convo;
            const newMessages = convo.messages.slice(0);
            const newMessage = {
                authorID: state.currentCharID,
                contents: messageContents,
                id: id()
            };
            if (beforeMessageIndex) {
                newMessages.splice(beforeMessageIndex, 0, newMessage);
            } else {
                newMessages.push(newMessage);
            }
            return {
                ...convo,
                messages: newMessages
            };
        })
    };
};
