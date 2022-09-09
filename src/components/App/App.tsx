import style from './style.scss';

import {Component, JSX} from 'preact';

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

import {connect, InjectProps} from '../../util/store';

const connectedKeys = ['convos', 'currentConvoIndex', 'editedCharID', 'toBeReplacedCharID', 'exportedConvoID'] as const;
const connectedActions = {setEditedCharacterID, setToBeReplacedCharacterID, setExportedConvoID};
type Props = InjectProps<{}, typeof connectedKeys, typeof connectedActions>;

class App extends Component<Props> {
    constructor (props: Props) {
        super(props);

        this.closeCharacterSettings = this.closeCharacterSettings.bind(this);
        this.closeCharacterReplaceDialog = this.closeCharacterReplaceDialog.bind(this);
        this.closeExportConvoDialog = this.closeExportConvoDialog.bind(this);
    }

    closeCharacterSettings (): void {
        this.props.setEditedCharacterID(null);
    }

    closeCharacterReplaceDialog (): void {
        this.props.setToBeReplacedCharacterID(null);
    }

    closeExportConvoDialog (): void {
        this.props.setExportedConvoID(null);
    }

    render (): JSX.Element {
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

export default connect(connectedKeys, connectedActions)(App);
