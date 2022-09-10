// TODO: this is n-squared, idiot
export default (state, id, contents) => {
    for (let i = 0; i < state.convos.length; i++) {
        const convo = state.convos[i];
        for (let j = 0; j < convo.messages.length; j++) {
            const message = convo.messages[j];
            if (message.id === id) {
                const newConvos = state.convos.slice(0);
                const newMessages = convo.messages.slice(0);
                newMessages[j] = {...message, contents};
                newConvos[i] = {...convo, messages: newMessages};
                return {convos: newConvos};
            }
        }
    }

    return {};
};
