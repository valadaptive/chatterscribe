import {batch} from '@preact/signals';

import type {AppState} from '../util/store';
import id from '../util/id';

export default (state: AppState, characterName = 'New Character'): void => {
    batch(() => {
        const newCharID = id();
        state.chars.value = [...state.chars.value, {
            id: newCharID,
            name: characterName,
            color: 0xffffff
        }];
        state.currentCharID.value = newCharID;
    });
};
