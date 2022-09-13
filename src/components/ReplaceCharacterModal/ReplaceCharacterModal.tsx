import style from './style.scss';

import {Component, JSX} from 'preact';

import deleteCharacter from '../../actions/delete-character';
import replaceCharacter from '../../actions/replace-character';
import setToBeReplacedCharacterID from '../../actions/set-to-be-replaced-character-id';

import {connect, InjectProps} from '../../util/store';
import {ID} from '../../util/datatypes';

const connectedKeys = ['chars', 'toBeReplacedCharID'] as const;
const connectedActions = {replaceCharacter, setToBeReplacedCharacterID, deleteCharacter};
type Props = InjectProps<{}, typeof connectedKeys, typeof connectedActions>;

type State = {
    selectedCharacterID: ID | null
};

class ReplaceCharacterModal extends Component<Props, State> {
    constructor (props: Props) {
        super(props);

        this.state = {
            selectedCharacterID: null
        };

        this.selectCharacter = this.selectCharacter.bind(this);
        this.replaceCharacter = this.replaceCharacter.bind(this);
    }

    selectCharacter (event: Event): void {
        this.setState({selectedCharacterID: (event.target as HTMLSelectElement).value});
    }

    replaceCharacter (): void {
        if (!this.props.toBeReplacedCharID || !this.state.selectedCharacterID) return;
        this.props.replaceCharacter(this.props.toBeReplacedCharID, this.state.selectedCharacterID);
        this.props.deleteCharacter(this.props.toBeReplacedCharID, this.state.selectedCharacterID);
        this.props.setToBeReplacedCharacterID(null);
    }

    render (): JSX.Element {
        const {chars, toBeReplacedCharID} = this.props;
        return (
            <div className={style.replaceCharacter}>
                <div className={style.row}>
                    <div className={style.label}>
                        Replace character <span className={style.oldCharacterName}> with:</span>
                    </div>
                    <select
                        onChange={this.selectCharacter}
                        value={this.state.selectedCharacterID ?? undefined}>
                        {chars.map(char => char.id === toBeReplacedCharID ?
                            null :
                            <option value={char.id}>{char.name}</option>)}
                    </select>
                </div>
                <div>
                    <button
                        onClick={this.replaceCharacter}
                        disabled={this.state.selectedCharacterID === null}
                    >Replace</button>
                </div>
            </div>
        );
    }
}

export default connect(connectedKeys, connectedActions)(ReplaceCharacterModal);
