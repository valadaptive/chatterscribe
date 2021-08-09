export default (state, id, replacementID) => {
    const charIndex = state.chars.findIndex(char => char.id === id);
    return {
        chars: state.chars.filter(char => char.id !== id),
        currentCharID: replacementID || (state.chars.length === 1 ?
            null :
            charIndex === state.chars.length - 1 ?
                state.chars[state.chars.length - 2].id :
                state.chars[charIndex + 1].id)
    };
};
