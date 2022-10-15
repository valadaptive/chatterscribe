import type {StoreShape} from '../util/store';
import type {ID} from '../util/datatypes';

export default (state: StoreShape, id: ID): Partial<StoreShape> => {
    // Use object spread/rest to omit the convo with a given ID from state.convos
    const {[id]: __, ...newConvos} = state.convos;

    const convoIndex = state.convoIDs.findIndex(convoID => convoID === id);

    return {
        convos: newConvos,
        convoIDs: state.convoIDs.filter(existingID => existingID !== id),
        // If the deleted convo is selected and the last one in the list, select the previous one
        currentConvoID: state.convoIDs.length === 1 ?
            null :
            state.convoIDs[convoIndex === state.convoIDs.length - 1 ?
                convoIndex - 1 :
                convoIndex]
    };
};
