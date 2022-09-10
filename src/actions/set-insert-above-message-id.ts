import type {StoreShape} from '../util/store';
import type {ID} from '../util/datatypes';

export default (state: StoreShape, insertAboveMessageID: ID | null): Partial<StoreShape> => ({insertAboveMessageID});
