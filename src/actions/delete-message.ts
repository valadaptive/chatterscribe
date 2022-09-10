import type {StoreShape} from '../util/store';

export default (state: StoreShape, messageIndex: number): Partial<StoreShape> => ({
    convos: state.convos.map((convo, i) => i !== state.currentConvoIndex ?
        convo :
        {...convo, messages: convo.messages.filter((_, i) => i !== messageIndex)})
});
