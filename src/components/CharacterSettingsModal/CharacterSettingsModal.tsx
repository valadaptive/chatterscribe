import style from './style.scss';

import type {JSX} from 'preact';

import updateCharacter from '../../actions/update-character';

import colorToHex from '../../util/color-to-hex';
import {connect, InjectProps} from '../../util/store';

const connectedKeys = ['chars', 'editedCharID'] as const;
const connectedActions = {updateCharacter};
type Props = InjectProps<{}, typeof connectedKeys, typeof connectedActions>;

const CharacterSettingsModal = ({chars, editedCharID, updateCharacter}: Props): JSX.Element | null => {
    const onCharacterNameChange = (event: Event): void => {
        if (!editedCharID) return;
        updateCharacter(editedCharID, {name: (event.target as HTMLInputElement).value});
    };

    const onCharacterColorChange = (event: Event): void => {
        if (!editedCharID) return;
        updateCharacter(editedCharID, {
            color: parseInt((event.target as HTMLInputElement).value.slice(1), 16)
        });
    };

    const character = chars.find(char => char.id === editedCharID);
    if (!character) return null;
    return (
        <div className={style.characterSettings}>
            <div className={style.row}>
                <div className={style.label}>Character name</div>
                <input
                    type="text"
                    className={style.control}
                    value={character.name}
                    onChange={onCharacterNameChange}
                />
            </div>
            <div className={style.row}>
                <div className={style.label}>Character color</div>
                <input
                    type="color"
                    className={style.control}
                    value={colorToHex(character.color)}
                    onChange={onCharacterColorChange}
                />
            </div>
        </div>
    );
};

export default connect(connectedKeys, connectedActions)(CharacterSettingsModal);
