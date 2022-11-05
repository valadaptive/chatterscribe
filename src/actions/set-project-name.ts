import type {AppState} from '../util/store';

export default (state: AppState, projectName: string): void => {
    state.projectName.value = projectName;
};
