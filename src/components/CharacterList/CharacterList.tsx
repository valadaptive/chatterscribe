import style from './style.scss';
import icons from '../../icons/icons.scss';

import {Component, JSX} from 'preact';
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

const connectedKeys = ['chars', 'currentCharID', 'convos', 'currentConvoIndex'] as const;
const connectedActions = {deleteCharacter, setCurrentCharacterID, setEditedCharacterID, setToBeReplacedCharacterID};
type Props = InjectProps<{}, typeof connectedKeys, typeof connectedActions>;

class CharacterList extends Component<Props> {
    constructor (props: Props) {
        super(props);

        this.onClickCharacter = this.onClickCharacter.bind(this);
        this.onEditCharacter = this.onEditCharacter.bind(this);
        this.onDeleteCharacter = this.onDeleteCharacter.bind(this);
    }

    onClickCharacter (character: Character): void {
        this.props.setCurrentCharacterID(character.id);
    }

    onEditCharacter (character: Character): void {
        this.props.setEditedCharacterID(character.id);
    }

    onDeleteCharacter (character: Character): void {
        for (const convo of this.props.convos) {
            for (const message of convo.messages) {
                if (message.authorID === character.id) {
                    this.props.setToBeReplacedCharacterID(character.id);
                    return;
                }
            }
        }

        this.props.deleteCharacter(character.id);
    }

    render (): JSX.Element {
        const {chars, currentCharID, convos, currentConvoIndex} = this.props;

        const charIDsInConvo = new Set<ID>();

        if (currentConvoIndex !== -1) {
            const currentConvo = convos[currentConvoIndex];
            for (const message of currentConvo.messages) {
                if (!charIDsInConvo.has(message.authorID)) {
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
                                    onClick={this.onClickCharacter}
                                    onEdit={this.onEditCharacter}
                                    onDelete={this.props.chars.length > 1 ? this.onDeleteCharacter : undefined}
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
                                    onClick={this.onClickCharacter}
                                    onEdit={this.onEditCharacter}
                                    onDelete={this.props.chars.length > 1 ? this.onDeleteCharacter : undefined}
                                />)}
                        </div>
                    </>
                }
            </div>
        );
    }
}

export default connect(connectedKeys, connectedActions)(CharacterList);
