import style from './style.scss';

import type {JSX} from 'preact';
import {useMemo} from 'preact/hooks';

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

const connectedKeys = ['convos', 'currentConvoID', 'editedCharID', 'toBeReplacedCharID', 'exportedConvoID'] as const;
const connectedActions = {setEditedCharacterID, setToBeReplacedCharacterID, setExportedConvoID};
type Props = InjectProps<{}, typeof connectedKeys, typeof connectedActions>;

const App = ({
    convos,
    currentConvoID,
    editedCharID,
    toBeReplacedCharID,
    exportedConvoID,

    setEditedCharacterID,
    setToBeReplacedCharacterID,
    setExportedConvoID
}: Props): JSX.Element => {
    const projectBarPane = useMemo(() => (
        <div className={style.projectBarPane}>
            <ProjectBar />
        </div>
    ), []);

    const convosPane = useMemo(() => (
        <div className={style.convosPane}>
            <ConvoList />
        </div>
    ), []);

    const commandBoxPane = useMemo(() => (
        <div className={style.commandBoxPane}>
            <CommandBox />
        </div>
    ), []);

    const charactersPane = useMemo(() => (
        <div className={style.charactersPane}>
            <CharacterList />
        </div>
    ), []);

    const modal = useMemo(() => (
        <>
            {editedCharID !== null ?
                <Modal onClose={(): unknown => setEditedCharacterID(null)}>
                    <CharacterSettingsModal />
                </Modal> :
                null}
            {toBeReplacedCharID !== null ?
                <Modal onClose={(): unknown => setToBeReplacedCharacterID(null)}>
                    <ReplaceCharacterModal />
                </Modal> :
                null}
            {exportedConvoID !== null ?
                <Modal onClose={(): unknown => setExportedConvoID(null)}>
                    <ExportConvoModal />
                </Modal> :
                null}
        </>
    ), []);

    return (
        <div className={style.app}>
            {projectBarPane}
            <div className={style.appPane}>
                {convosPane}
                <div className={style.messagesPane}>
                    <Messages convo={currentConvoID !== null ? convos[currentConvoID] : undefined} />
                    {commandBoxPane}
                </div>
                <div className={style.charactersPane}>
                    {charactersPane}
                </div>
            </div>
            {modal}
        </div>
    );
};

export default connect(connectedKeys, connectedActions)(App);
