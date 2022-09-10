import type {StoreShape} from '../util/store';

export default (state: StoreShape, projectName: string): Partial<StoreShape> => ({projectName});
