import type {StoreShape} from '../util/store';
import type {Convo, Character} from '../util/datatypes';

export default (state: StoreShape, json: {
    projectName: string,
    convos: Convo[],
    chars: Character[]
}): Partial<StoreShape> => {
    return {
        projectName: json.projectName,
        convos: json.convos,
        chars: json.chars
    };
};
