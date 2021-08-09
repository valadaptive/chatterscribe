export default (state, charID, newCharData) => ({
    chars: state.chars.map(char => char.id !== charID ?
        char :
        {...char, ...newCharData})
});
