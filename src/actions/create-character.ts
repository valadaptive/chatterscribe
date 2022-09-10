import type {StoreShape} from '../util/store';
import id from '../util/id';

export default (state: StoreShape, characterName = 'New Character'): Partial<StoreShape> => {
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
