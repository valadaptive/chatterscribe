import style from './style.scss';

import {Component, JSX} from 'preact';

import updateCharacter from '../../actions/update-character';

import colorToHex from '../../util/color-to-hex';
import {connect, InjectProps} from '../../util/store';

const connectedKeys = ['chars', 'editedCharID'] as const;
const connectedActions = {updateCharacter};
type Props = InjectProps<{}, typeof connectedKeys, typeof connectedActions>;

class CharacterSettingsModal extends Component<Props> {
    constructor (props: Props) {
        super(props);

        this.onCharacterNameChange = this.onCharacterNameChange.bind(this);
        this.onCharacterColorChange = this.onCharacterColorChange.bind(this);
    }

    onCharacterNameChange (event: Event): void {
        if (!this.props.editedCharID) return;
        this.props.updateCharacter(this.props.editedCharID, {name: (event.target as HTMLInputElement).value});
    }

    onCharacterColorChange (event: Event): void {
        if (!this.props.editedCharID) return;
        this.props.updateCharacter(this.props.editedCharID, {
            color: parseInt((event.target as HTMLInputElement).value.slice(1), 16)
        });
    }

    render (): JSX.Element | null {
        const {editedCharID, chars} = this.props;
        const character = chars.find(char => char.id === editedCharID);
        if (!character) return null;
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

export default connect(connectedKeys, connectedActions)(CharacterSettingsModal);
