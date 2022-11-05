import style from './style.scss';

import type {JSX} from 'preact';

import updateCharacterAction from '../../actions/update-character';

import colorToHex from '../../util/color-to-hex';
import {useAppState, useAction} from '../../util/store';

const CharacterSettingsModal = (): JSX.Element | null => {
    const {editedCharID, chars} = useAppState();
    const updateCharacter = useAction(updateCharacterAction);
    const onCharacterNameChange = (event: Event): void => {
        if (!editedCharID.value) return;
        updateCharacter(editedCharID.value, {name: (event.target as HTMLInputElement).value});
    };

    const onCharacterColorChange = (event: Event): void => {
        if (!editedCharID.value) return;
        updateCharacter(editedCharID.value, {
            color: parseInt((event.target as HTMLInputElement).value.slice(1), 16)
        });
    };

    const character = chars.value.find(char => char.id === editedCharID.value);
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

export default CharacterSettingsModal;
