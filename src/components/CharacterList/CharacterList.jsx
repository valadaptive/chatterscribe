import style from './style.scss';
import icons from '../../icons/icons.scss';

import {Component} from 'preact';
import {connect} from 'unistore/preact';
import classNames from 'classnames';

import deleteCharacter from '../../actions/delete-character';
import setCurrentCharacterID from '../../actions/set-current-character-id';
import setEditedCharacterID from '../../actions/set-edited-character-id';
import setToBeReplacedCharacterID from '../../actions/set-to-be-replaced-character-id';

import colorToHex from '../../util/color-to-hex';

const Character = ({char, active, onClick, onEdit, onDelete}) => (
    <div
        className={classNames(style['character'], {[style['active']]: active})}
        onClick={onClick && (() => onClick(char))}
    >
        <div
            className={style['character-name']}
            style={`color: ${colorToHex(char.color)}`}
        >{char.name}</div>
        <div
            className={classNames(
                style['edit'],
                icons['icon'],
                icons['icon-button'],
                icons['edit'])}
            onClick={onEdit && (() => onEdit(char))}
        />
        <div
            className={classNames(
                style['delete'],
                icons['icon'],
                icons['icon-button'],
                icons['delete'],
                {[icons['disabled']]: !onDelete})}
            onClick={onDelete ? (() => onDelete(char)) : null}
        />
    </div>
);

class CharacterList extends Component {
    constructor (props) {
        super(props);

        this.onClickCharacter = this.onClickCharacter.bind(this);
        this.onEditCharacter = this.onEditCharacter.bind(this);
        this.onDeleteCharacter = this.onDeleteCharacter.bind(this);
    }

    onClickCharacter (character) {
        this.props.setCurrentCharacterID(character.id);
    }

    onEditCharacter (character) {
        this.props.setEditedCharacterID(character.id);
    }

    onDeleteCharacter (character) {
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

    render () {
        const {chars, currentCharID, convos, currentConvoIndex} = this.props;

        const charIDsInConvo = new Set();

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
            <div className={style['character-list']}>
                {charsInConvo.length > 0 &&
                    <>
                        <div className={style['divider']}>Characters in current convo:</div>
                        <div className={style['character-sublist']}>
                            {charsInConvo.map(char =>
                                <Character
                                    key={char.id}
                                    char={char}
                                    active={char.id === currentCharID}
                                    onClick={this.onClickCharacter}
                                    onEdit={this.onEditCharacter}
                                    onDelete={this.props.chars.length > 1 && this.onDeleteCharacter}
                                />)}
                        </div>
                    </>
                }
                {charsNotInConvo.length > 0 &&
                    <>
                        <div className={style['divider']}>Other characters:</div>
                        <div className={style['character-sublist']}>
                            {charsNotInConvo.map(char =>
                                <Character
                                    key={char.id}
                                    char={char}
                                    active={char.id === currentCharID}
                                    onClick={this.onClickCharacter}
                                    onEdit={this.onEditCharacter}
                                    onDelete={this.props.chars.length > 1 && this.onDeleteCharacter}
                                />)}
                        </div>
                    </>
                }
            </div>
        );
    }
}

export default connect(
    ['chars', 'currentCharID', 'convos', 'currentConvoIndex'],
    {deleteCharacter, setCurrentCharacterID, setEditedCharacterID, setToBeReplacedCharacterID}
)(CharacterList);
