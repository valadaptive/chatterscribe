import type {StoreShape} from '../util/store';

export default (state: StoreShape, index: number): Partial<StoreShape> => ({
    convos: state.convos.filter((_, i) => i !== index),
    currentConvoIndex: state.convos.length === 1 ?
        -1 :
        state.currentConvoIndex === state.convos.length - 1 ?
            state.currentConvoIndex - 1 :
            state.currentConvoIndex
});
