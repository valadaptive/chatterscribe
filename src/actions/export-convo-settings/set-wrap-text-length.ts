import type {AppState} from '../../util/store';

export default (state: AppState, length: number): void => {
    state.exportConvoSettings.wrapTextLength.value = length;
};
