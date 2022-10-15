import type {StoreShape} from '../util/store';
import type {ID} from '../util/datatypes';

export default (state: StoreShape, id: ID): Partial<StoreShape> => ({currentConvoID: id});
