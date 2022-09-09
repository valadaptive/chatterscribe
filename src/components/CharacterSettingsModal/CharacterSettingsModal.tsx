import style from './style.scss';

import {Component} from 'preact';
import {connect} from 'unistore/preact';

import updateCharacter from '../../actions/update-character';

import colorToHex from '../../util/color-to-hex';

class CharacterSettingsModal extends Component {
    constructor (props) {
        super(props);

        this.onCharacterNameChange = this.onCharacterNameChange.bind(this);
        this.onCharacterColorChange = this.onCharacterColorChange.bind(this);
    }

    onCharacterNameChange (event) {
        this.props.updateCharacter(this.props.editedCharID, {name: event.target.value});
    }

    onCharacterColorChange (event) {
        this.props.updateCharacter(this.props.editedCharID, {color: parseInt(event.target.value.slice(1), 16)});
    }

    render () {
        const {editedCharID, chars} = this.props;
        const character = chars.find(char => char.id === editedCharID);
        return (
            <div className={style['character-settings']}>
                <div className={style['row']}>
                    <div className={style['label']}>Character name</div>
                    <input
                        type="text"
                        className={style['control']}
                        value={character.name}
                        onChange={this.onCharacterNameChange}
                    />
                </div>
                <div className={style['row']}>
                    <div className={style['label']}>Character color</div>
                    <input
                        type="color"
                        className={style['control']}
                        value={colorToHex(character.color)}
                        onChange={this.onCharacterColorChange}
                    />
                </div>
            </div>
        );
    }
}

export default connect(['chars', 'editedCharID'], {updateCharacter})(CharacterSettingsModal);
