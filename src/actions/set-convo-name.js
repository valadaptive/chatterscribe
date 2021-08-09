export default (state, id, name) => ({
    convos: state.convos.map(convo => convo.id !== id ?
        convo :
        {...convo, name})
});
