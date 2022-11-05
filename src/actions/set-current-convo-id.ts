import type {AppState} from '../util/store';
import type {ID} from '../util/datatypes';

export default (state: AppState, id: ID): void => {
    state.currentConvoID.value = id;
};
