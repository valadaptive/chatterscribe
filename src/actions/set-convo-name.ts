import type {AppState} from '../util/store';
import type {ID} from '../util/datatypes';

export default (state: AppState, id: ID, name: string): void => {
    state.convos.value = {...state.convos.value, [id]: {...state.convos.value[id], name}};
};
