import id from '../util/id';

export default (state, characterName = 'New Character') => {
    const newCharID = id();
    return {
        chars: [...state.chars, {
            id: newCharID,
            name: characterName,
            color: 0xffffff
        }],
        currentCharID: newCharID
    };
};
