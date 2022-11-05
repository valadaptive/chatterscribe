import style from './style.scss';

import type {JSX} from 'preact';
import {useState} from 'preact/hooks';

import deleteCharacterAction from '../../actions/delete-character';
import replaceCharacterAction from '../../actions/replace-character';
import setToBeReplacedCharacterIDAction from '../../actions/set-to-be-replaced-character-id';

import {useAppState, useAction} from '../../util/store';

const ReplaceCharacterModal = (): JSX.Element => {
    const {chars, toBeReplacedCharID} = useAppState();

    const deleteCharacter = useAction(deleteCharacterAction);
    const replaceCharacter = useAction(replaceCharacterAction);
    const setToBeReplacedCharacterID = useAction(setToBeReplacedCharacterIDAction);

    const [selectedCharacterID, setSelectedCharacterID] = useState<string | undefined>(undefined);

    const replaceCharacterCallback = (): void => {
        if (!toBeReplacedCharID.value || !selectedCharacterID) return;
        replaceCharacter(toBeReplacedCharID.value, selectedCharacterID);
        deleteCharacter(toBeReplacedCharID.value, selectedCharacterID);
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
                    {chars.value.map(char => char.id === toBeReplacedCharID.value ?
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

export default ReplaceCharacterModal;
