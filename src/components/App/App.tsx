import style from './style.scss';

import type {JSX} from 'preact';
import {useComputed} from '@preact/signals';
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

import setEditedCharacterIDAction from '../../actions/set-edited-character-id';
import setToBeReplacedCharacterIDAction from '../../actions/set-to-be-replaced-character-id';
import setExportedConvoIDAction from '../../actions/set-exported-convo-id';

import {useAppState, useAction} from '../../util/store';

const App = (): JSX.Element => {
    const {convos, currentConvoID, editedCharID, toBeReplacedCharID, exportedConvoID} = useAppState();
    const setEditedCharacterID = useAction(setEditedCharacterIDAction);
    const setToBeReplacedCharacterID = useAction(setToBeReplacedCharacterIDAction);
    const setExportedConvoID = useAction(setExportedConvoIDAction);
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

    const modal = useComputed(() => (
        <>
            {editedCharID.value !== null ?
                <Modal onClose={(): unknown => setEditedCharacterID(null)}>
                    <CharacterSettingsModal />
                </Modal> :
                null}
            {toBeReplacedCharID.value !== null ?
                <Modal onClose={(): unknown => setToBeReplacedCharacterID(null)}>
                    <ReplaceCharacterModal />
                </Modal> :
                null}
            {exportedConvoID.value !== null ?
                <Modal onClose={(): unknown => setExportedConvoID(null)}>
                    <ExportConvoModal />
                </Modal> :
                null}
        </>
    )).value;

    return (
        <div className={style.app}>
            {projectBarPane}
            <div className={style.appPane}>
                {convosPane}
                <div className={style.messagesPane}>
                    <Messages convo={currentConvoID.value !== null ? convos.value[currentConvoID.value] : undefined} />
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

export default App;
