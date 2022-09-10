import type {StoreShape} from '../util/store';
import type {ID} from '../util/datatypes';

export default (state: StoreShape, id?: ID | null): Partial<StoreShape> => ({
    editedConvoID: id === undefined ? state.convos[state.currentConvoIndex].id : id
});
