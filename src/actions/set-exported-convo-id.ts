import type {StoreShape} from '../util/store';
import type {ID} from '../util/datatypes';

export default (state: Partial<StoreShape>, id: ID | null): Partial<StoreShape> => ({exportedConvoID: id});
