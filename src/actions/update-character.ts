import type {StoreShape} from '../util/store';
import type {ID, Character} from '../util/datatypes';

export default (state: StoreShape, charID: ID, newCharData: Partial<Character>): Partial<StoreShape> => ({
    chars: state.chars.map(char => char.id !== charID ?
        char :
        {...char, ...newCharData})
});
