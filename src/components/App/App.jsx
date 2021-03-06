import style from './style.scss';

import {Component} from 'preact';
import {connect} from 'unistore/preact';

import CommandBox from '../CommandBox/CommandBox';
import CharacterList from '../CharacterList/CharacterList';
import CharacterSettingsModal from '../CharacterSettingsModal/CharacterSettingsModal';
import ConvoList from '../ConvoList/ConvoList';
import ExportConvoModal from '../ExportConvoModal/ExportConvoModal';
import Messages from '../Messages/Messages';
import Modal from '../Modal/Modal';
import ProjectBar from '../ProjectBar/ProjectBar';
import ReplaceCharacterModal from '../ReplaceCharacterModal/ReplaceCharacterModal';

import setEditedCharacterID from '../../actions/set-edited-character-id';
import setToBeReplacedCharacterID from '../../actions/set-to-be-replaced-character-id';
import setExportedConvoID from '../../actions/set-exported-convo-id';

class App extends Component {
    constructor (props) {
        super(props);

        this.closeCharacterSettings = this.closeCharacterSettings.bind(this);
        this.closeCharacterReplaceDialog = this.closeCharacterReplaceDialog.bind(this);
        this.closeExportConvoDialog = this.closeExportConvoDialog.bind(this);
    }

    closeCharacterSettings () {
        this.props.setEditedCharacterID(null);
    }

    closeCharacterReplaceDialog () {
        this.props.setToBeReplacedCharacterID(null);
    }

    closeExportConvoDialog () {
        this.props.setExportedConvoID(null);
    }

    render () {
        const {convos, currentConvoIndex, editedCharID, toBeReplacedCharID, exportedConvoID} = this.props;
        return (
            <div className={style['app']}>
                <div className={style['project-bar-pane']}>
                    <ProjectBar />
                </div>
                <div className={style['app-pane']}>
                    <div className={style['convos-pane']}>
                        <ConvoList />
                    </div>
                    <div className={style['messages-pane']}>
                        <Messages messages={currentConvoIndex !== -1 ? convos[currentConvoIndex].messages : null} />
                        <div className={style['command-box-pane']}>
                            <CommandBox />
                        </div>
                    </div>
                    <div className={style['characters-pane']}>
                        <CharacterList />
                    </div>
                </div>
                {editedCharID !== null ?
                    <Modal onClose={this.closeCharacterSettings}>
                        <CharacterSettingsModal />
                    </Modal> :
                    null}
                {toBeReplacedCharID !== null ?
                    <Modal onClose={this.closeCharacterReplaceDialog}>
                        <ReplaceCharacterModal />
                    </Modal> :
                    null}
                {exportedConvoID !== null ?
                    <Modal onClose={this.closeExportConvoDialog}>
                        <ExportConvoModal />
                    </Modal> :
                    null}
            </div>
        );
    }
}

export default connect(
    ['convos', 'currentConvoIndex', 'editedCharID', 'toBeReplacedCharID', 'exportedConvoID'],
    {setEditedCharacterID, setToBeReplacedCharacterID, setExportedConvoID}
)(App);
