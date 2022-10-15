import style from './style.scss';
import icons from '../../icons/icons.scss';

import type {JSX} from 'preact';
import {useMemo, useCallback} from 'preact/hooks';
import classNames from 'classnames';

import deleteCharacter from '../../actions/delete-character';
import setCurrentCharacterID from '../../actions/set-current-character-id';
import setEditedCharacterID from '../../actions/set-edited-character-id';
import setToBeReplacedCharacterID from '../../actions/set-to-be-replaced-character-id';

import colorToHex from '../../util/color-to-hex';
import {connect, InjectProps} from '../../util/store';
import type {ID, Character} from '../../util/datatypes';

const CharacterListing = ({char, active, onClick, onEdit, onDelete}: {
    char: Character,
    active: boolean,
    onClick?: (char: Character) => void,
    onEdit?: (char: Character) => void,
    onDelete?: (char: Character) => void,
}): JSX.Element => (
    <div
        className={classNames(style.character, {[style.active]: active})}
        onClick={onClick && ((): void => onClick(char))}
    >
        <div
            className={style.characterName}
            style={`color: ${colorToHex(char.color)}`}
        >{char.name}</div>
        <div
            className={classNames(
                style.edit,
                icons['icon'],
                icons['icon-button'],
                icons['edit'])}
            onClick={onEdit && ((): void => onEdit(char))}
        />
        <div
            className={classNames(
                style.delete,
                icons['icon'],
                icons['icon-button'],
                icons['delete'],
                {[icons['disabled']]: !onDelete})}
            onClick={onDelete ? ((): void => onDelete(char)) : undefined}
        />
    </div>
);

const connectedKeys = ['chars', 'currentCharID', 'convos', 'currentConvoID'] as const;
const connectedActions = {deleteCharacter, setCurrentCharacterID, setEditedCharacterID, setToBeReplacedCharacterID};
type Props = InjectProps<{}, typeof connectedKeys, typeof connectedActions>;

const CharacterList = ({
    chars,
    currentCharID,
    convos,
    currentConvoID,
    deleteCharacter,
    setCurrentCharacterID,
    setEditedCharacterID,
    setToBeReplacedCharacterID
}: Props): JSX.Element => {
    const {charsInConvo, charsNotInConvo} = useMemo(() => {
        const charIDsInConvo = new Set<ID>();

        if (currentConvoID !== null) {
            const currentConvo = convos[currentConvoID];
            if (currentConvo) {
                for (const message of currentConvo.messages) {
                    charIDsInConvo.add(message.authorID);
                }
            }
        }

        const charsInConvo = [];
        const charsNotInConvo = [];
        for (const char of chars) {
            if (charIDsInConvo.has(char.id)) {
                charsInConvo.push(char);
            } else {
                charsNotInConvo.push(char);
            }
        }

        return {charsInConvo, charsNotInConvo};
    }, [currentConvoID, convos, chars]);

    const onClickCharacter = useCallback((character: Character) => {
        setCurrentCharacterID(character.id);
    }, [setCurrentCharacterID]);

    const onEditCharacter = useCallback((character: Character) => {
        setEditedCharacterID(character.id);
    }, [setEditedCharacterID]);

    const onDeleteCharacter = useCallback((character: Character) => {
        for (const convo of Object.values(convos)) {
            if (!convo) continue;
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
                                active={char.id === currentCharID}
                                onClick={onClickCharacter}
                                onEdit={onEditCharacter}
                                onDelete={chars.length > 1 ? onDeleteCharacter : undefined}
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
                                active={char.id === currentCharID}
                                onClick={onClickCharacter}
                                onEdit={onEditCharacter}
                                onDelete={chars.length > 1 ? onDeleteCharacter : undefined}
                            />)}
                    </div>
                </>
            }
        </div>
    );
};

export default connect(connectedKeys, connectedActions)(CharacterList);
