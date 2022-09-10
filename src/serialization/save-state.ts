import type {Convo, Character} from '../util/datatypes';

export default ({projectName, version, convos, chars}: {
    projectName: string,
    version: number,
    convos: Convo[],
    chars: Character[]
}): string => {
    return JSON.stringify({projectName, version, convos, chars});
};
