import style from './style.scss';

import type {JSX} from 'preact';
import {useState} from 'preact/hooks';

import deleteCharacter from '../../actions/delete-character';
import replaceCharacter from '../../actions/replace-character';
import setToBeReplacedCharacterID from '../../actions/set-to-be-replaced-character-id';

import {connect, InjectProps} from '../../util/store';

const connectedKeys = ['chars', 'toBeReplacedCharID'] as const;
const connectedActions = {replaceCharacter, setToBeReplacedCharacterID, deleteCharacter};
type Props = InjectProps<{}, typeof connectedKeys, typeof connectedActions>;

const ReplaceCharacterModal = ({
    chars,
    toBeReplacedCharID,
    replaceCharacter,
    setToBeReplacedCharacterID,
    deleteCharacter
}: Props): JSX.Element => {
    const [selectedCharacterID, setSelectedCharacterID] = useState<string | undefined>(undefined);

    const replaceCharacterCallback = (): void => {
        if (!toBeReplacedCharID || !selectedCharacterID) return;
        replaceCharacter(toBeReplacedCharID, selectedCharacterID);
        deleteCharacter(toBeReplacedCharID, selectedCharacterID);
        setToBeReplacedCharacterID(null);
    };

    return (
        <div className={style.replaceCharacter}>
            <div className={style.row}>
                <div className={style.label}>
                    Replace character <span className={style.oldCharacterName}> with:</span>
                </div>
                <select
                    onChange={(event): unknown => setSelectedCharacterID((event.target as HTMLSelectElement).value)}
                    value={selectedCharacterID ?? undefined}>
                    {chars.map(char => char.id === toBeReplacedCharID ?
                        null :
                        <option value={char.id}>{char.name}</option>)}
                </select>
            </div>
            <div>
                <button
                    onClick={replaceCharacterCallback}
                    disabled={typeof selectedCharacterID === 'undefined'}
                >Replace</button>
            </div>
        </div>
    );
};

export default connect(connectedKeys, connectedActions)(ReplaceCharacterModal);
