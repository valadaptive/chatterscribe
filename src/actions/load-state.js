export default (state, json) => {
    return {
        convos: json.convos,
        chars: json.chars,
        currentConvoIndex: -1,
        currentCharID: null,
        editedMessageID: null,
        editedConvoID: null,
        editedCharID: null,
        toBeReplacedCharID: null
    };
};
