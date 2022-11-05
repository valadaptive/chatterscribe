import type {AppState} from '../../util/store';

export default (state: AppState, side: 'left' | 'right'): void => {
    state.exportConvoSettings.justifySide.value = side;
};
