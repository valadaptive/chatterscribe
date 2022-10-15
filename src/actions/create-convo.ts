import createConvo from '../util/create-convo';
import type {StoreShape} from '../util/store';

export default (state: StoreShape): Partial<StoreShape> => {
    const newConvo = createConvo();
    return {
        convos: {...state.convos, [newConvo.id]: newConvo},
        convoIDs: [...state.convoIDs, newConvo.id],
        currentConvoID: newConvo.id
    };
};
