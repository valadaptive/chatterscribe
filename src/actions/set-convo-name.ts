import type {StoreShape} from '../util/store';
import type {ID} from '../util/datatypes';

export default (state: StoreShape, id: ID, name: string): Partial<StoreShape> => ({
    convos: state.convos.map(convo => convo.id !== id ?
        convo :
        {...convo, name})
});
