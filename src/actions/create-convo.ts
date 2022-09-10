import createConvo from '../util/create-convo';
import type {StoreShape} from '../util/store';

export default (state: StoreShape): Partial<StoreShape> => ({
    convos: [...state.convos, createConvo()],
    currentConvoIndex: state.convos.length
});
