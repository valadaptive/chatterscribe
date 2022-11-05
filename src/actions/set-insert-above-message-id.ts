import type {AppState} from '../util/store';
import type {ID} from '../util/datatypes';

export default (state: AppState, id: ID | null): void => {
    state.insertAboveMessageID.value = id;
};
