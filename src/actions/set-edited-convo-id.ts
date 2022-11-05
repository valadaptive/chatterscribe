import type {AppState} from '../util/store';
import type {ID} from '../util/datatypes';

export default (state: AppState, id?: ID | null): void => {
    state.editedConvoID.value = id === undefined ? state.convos.value[state.currentConvoID.value!].id : id;
};
