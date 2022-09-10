import type {StoreShape} from '../util/store';
import type {ID} from '../util/datatypes';

export default (state: StoreShape, oldID: ID, newID: ID): Partial<StoreShape> => ({
    convos: state.convos.map(convo => ({
        ...convo,
        messages: convo.messages.map(message => {
            if (message.authorID !== oldID) return message;
            return {...message, authorID: newID};
        })
    }))
});
