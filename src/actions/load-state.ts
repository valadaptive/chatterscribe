import type {StoreShape} from '../util/store';
import type {ID, Convo, Character} from '../util/datatypes';

export default (state: StoreShape, json: {
    projectName: string,
    convos: Convo[],
    chars: Character[]
}): Partial<StoreShape> => {
    const convosByID: Record<ID, Convo> = {};
    for (const convo of json.convos) {
        convosByID[convo.id] = convo;
    }
    return {
        projectName: json.projectName,
        convos: convosByID,
        convoIDs: json.convos.map(convo => convo.id),
        chars: json.chars
    };
};
