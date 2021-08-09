export default (state, oldID, newID) => ({
    convos: state.convos.map(convo => ({
        ...convo,
        messages: convo.messages.map(message => {
            if (message.authorID !== oldID) return message;
            return {...message, authorID: newID};
        })
    }))
});
