import style from './style.scss';

import type {JSX} from 'preact';
import {useComputed} from '@preact/signals';
import {useMemo, useCallback} from 'preact/hooks';
import classNames from 'classnames';

import Icon from '../Icon/Icon';

import deleteCharacterAction from '../../actions/delete-character';
import setCurrentCharacterIDAction from '../../actions/set-current-character-id';
import setEditedCharacterIDAction from '../../actions/set-edited-character-id';
import setToBeReplacedCharacterIDAction from '../../actions/set-to-be-replaced-character-id';

import colorToHex from '../../util/color-to-hex';
import {useAppState, useAction} from '../../util/store';
import type {ID, Character} from '../../util/datatypes';

const CharacterListing = ({char, active, onClick, onEdit, onDelete}: {
    char: Character,
    active: boolean,
    onClick?: (char: Character) => void,
    onEdit?: (char: Character) => void,
    onDelete?: (char: Character) => void,
}): JSX.Element => useMemo(() => {
    const handleClick = useCallback(() => onClick && onClick(char), [onClick, char]);
    const handleEdit = useCallback(() => onEdit && onEdit(char), [onEdit, char]);
    const handleDelete = useCallback(() => onDelete && onDelete(char), [onDelete, char]);
    return (
        <div className={classNames(style.character, {[style.active]: active})} onClick={handleClick}>
            <div
                className={style.characterName}
                style={`color: ${colorToHex(char.color)}`}
            >{char.name}</div>
            <Icon type='edit' title='Edit' onClick={handleEdit} />
            <Icon type='delete' title='Delete' onClick={handleDelete} />
        </div>
    );
}, [char, active, onClick, onEdit, onDelete]);

const CharacterList = (): JSX.Element => {
    const {chars, currentCharID, convos, currentConvoID} = useAppState();
    const deleteCharacter = useAction(deleteCharacterAction);
    const setCurrentCharacterID = useAction(setCurrentCharacterIDAction);
    const setEditedCharacterID = useAction(setEditedCharacterIDAction);
    const setToBeReplacedCharacterID = useAction(setToBeReplacedCharacterIDAction);
    const {charsInConvo, charsNotInConvo} = useComputed(() => {
        const charIDsInConvo = new Set<ID>();

        if (currentConvoID.value !== null) {
            const currentConvo = convos.value[currentConvoID.value];
            for (const message of currentConvo.messages) {
                charIDsInConvo.add(message.authorID);
            }
        }

        const charsInConvo = [];
        const charsNotInConvo = [];
        for (const char of chars.value) {
            if (charIDsInConvo.has(char.id)) {
                charsInConvo.push(char);
            } else {
                charsNotInConvo.push(char);
            }
        }

        return {charsInConvo, charsNotInConvo};
    }).value;

    const onClickCharacter = useCallback((character: Character) => {
        setCurrentCharacterID(character.id);
    }, [setCurrentCharacterID]);

    const onEditCharacter = useCallback((character: Character) => {
        setEditedCharacterID(character.id);
    }, [setEditedCharacterID]);

    const onDeleteCharacter = useCallback((character: Character) => {
        for (const convo of Object.values(convos.value)) {
            for (const message of convo.messages) {
                if (message.authorID === character.id) {
                    setToBeReplacedCharacterID(character.id);
                    return;
                }
            }
        }

        deleteCharacter(character.id);
    }, [setToBeReplacedCharacterID, deleteCharacter, convos]);

    return (
        <div className={style.characterList}>
            {charsInConvo.length > 0 &&
                <>
                    <div className={style.divider}>Characters in current convo:</div>
                    <div className={style.characterSublist}>
                        {charsInConvo.map(char =>
                            <CharacterListing
                                key={char.id}
                                char={char}
                                active={char.id === currentCharID.value}
                                onClick={onClickCharacter}
                                onEdit={onEditCharacter}
                                onDelete={chars.value.length > 1 ? onDeleteCharacter : undefined}
                            />)}
                    </div>
                </>
            }
            {charsNotInConvo.length > 0 &&
                <>
                    <div className={style.divider}>Other characters:</div>
                    <div className={style.characterSublist}>
                        {charsNotInConvo.map(char =>
                            <CharacterListing
                                key={char.id}
                                char={char}
                                active={char.id === currentCharID.value}
                                onClick={onClickCharacter}
                                onEdit={onEditCharacter}
                                onDelete={chars.value.length > 1 ? onDeleteCharacter : undefined}
                            />)}
                    </div>
                </>
            }
        </div>
    );
};

export default CharacterList;
