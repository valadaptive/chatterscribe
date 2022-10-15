import type {StoreShape} from '../util/store';
import type {ID} from '../util/datatypes';

export default (state: StoreShape, id: ID, name: string): Partial<StoreShape> => ({
    convos: {...state.convos, [id]: {...state.convos[id], name}}
});
