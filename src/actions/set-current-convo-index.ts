import type {StoreShape} from '../util/store';

export default (state: StoreShape, index: number): Partial<StoreShape> => ({currentConvoIndex: index});
