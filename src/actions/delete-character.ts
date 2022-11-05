import {batch} from '@preact/signals';

import type {ID} from  '../util/datatypes';
import type {AppState} from  '../util/store';

export default (state: AppState, id: ID, replacementID?: ID): void => {
    return batch(() => {
        const chars = state.chars.value;
        const charIndex = chars.findIndex(char => char.id === id);
        state.chars.value = chars.filter(char => char.id !== id);
        state.currentCharID.value = replacementID || (chars.length === 1 ?
            null :
            charIndex === chars.length - 1 ?
                chars[chars.length - 2].id :
                chars[charIndex + 1].id);
    });
};
