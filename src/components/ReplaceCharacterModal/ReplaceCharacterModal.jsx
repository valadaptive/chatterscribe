import style from './style.scss';

import {Component, createRef} from 'preact';
import {connect} from 'unistore/preact';

import deleteCharacter from '../../actions/delete-character';
import replaceCharacter from '../../actions/replace-character';
import setToBeReplacedCharacterID from '../../actions/set-to-be-replaced-character-id';

class ReplaceCharacterModal extends Component {
    constructor (props) {
        super(props);

        this.state = {
            selectedCharacterID: null
        };

        this.selectBox = createRef();

        this.selectCharacter = this.selectCharacter.bind(this);
        this.replaceCharacter = this.replaceCharacter.bind(this);
    }

    selectCharacter (event) {
        this.setState({selectedCharacterID: event.target.value});
    }

    replaceCharacter () {
        this.props.replaceCharacter(this.props.toBeReplacedCharID, this.state.selectedCharacterID);
        this.props.deleteCharacter(this.props.toBeReplacedCharID, this.state.selectedCharacterID);
        this.props.setToBeReplacedCharacterID(null);
    }

    render () {
        const {chars, toBeReplacedCharID} = this.props;
        return (
            <div className={style['replace-character']}>
                <div className={style['row']}>
                    <div className={style['label']}>
                        Replace character <span className={style['old-character-name']}> with:</span>
                    </div>
                    <select onChange={this.selectCharacter} value={this.state.selectedCharacterID} ref={this.selectBox}>
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

export default connect(
    ['chars', 'toBeReplacedCharID'],
    {replaceCharacter, setToBeReplacedCharacterID, deleteCharacter}
)(ReplaceCharacterModal);
