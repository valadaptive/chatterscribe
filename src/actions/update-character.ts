import type {AppState} from '../util/store';
import type {ID, Character} from '../util/datatypes';

export default (state: AppState, charID: ID, newCharData: Partial<Character>): void => {
    state.chars.value = state.chars.value.map(char => char.id !== charID ?
        char :
        {...char, ...newCharData});
};
