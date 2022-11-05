import type {AppState} from '../../util/store';

export default (state: AppState, enabled: boolean): void => {
    state.exportConvoSettings.wrapTextEnabled.value = enabled;
};
