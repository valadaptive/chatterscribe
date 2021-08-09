export default (state, id) => ({editedConvoID: id === undefined ? state.convos[state.currentConvoIndex].id : id});
