export default (state, messageIndex) => ({
    convos: state.convos.map((convo, i) => i !== state.currentConvoIndex ?
        convo :
        {...convo, messages: convo.messages.filter((_, i) => i !== messageIndex)})
});
