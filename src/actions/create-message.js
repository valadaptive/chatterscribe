import id from '../util/id';
import createConvo from './create-convo';
import createCharacter from './create-character';

export default (state, messageContents) => {
    if (state.currentConvoIndex === -1) {
        state = {...state, ...createConvo(state)};
    }

    if (state.currentCharID === null) {
        state = {...state, ...createCharacter(state)};
    }

    return {
        ...state,
        convos: state.convos.map((convo, i) =>
            i === state.currentConvoIndex ?
                {
                    ...convo,
                    messages: [...convo.messages, {
                        authorID: state.currentCharID,
                        contents: messageContents,
                        id: id()
                    }]
                } :
                convo
        )
    };
};
