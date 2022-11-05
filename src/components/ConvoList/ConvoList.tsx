import style from './style.scss';
import icons from '../../icons/icons.scss';

import type {JSX} from 'preact';
import {useMemo, useRef, useEffect} from 'preact/hooks';
import classNames from 'classnames';

import createConvo from '../../actions/create-convo';
import deleteConvo from '../../actions/delete-convo';
import setConvoName from '../../actions/set-convo-name';
import setCurrentConvoID from '../../actions/set-current-convo-id';
import setEditedConvoID from '../../actions/set-edited-convo-id';
import setExportedConvoID from '../../actions/set-exported-convo-id';

import {connect, InjectProps} from '../../util/store';
import type {Convo} from '../../util/datatypes';

const convoListingConnectedKeys = ['currentConvoID', 'editedConvoID'] as const;
const convoListingConnectedActions = {
    setConvoName,
    setCurrentConvoID,
    setEditedConvoID,
    setExportedConvoID,
    deleteConvo
};

type ConvoListingProps = InjectProps<{
    convo: Convo
}, typeof convoListingConnectedKeys, typeof convoListingConnectedActions>;

const ConvoListing = connect(convoListingConnectedKeys, convoListingConnectedActions)(({
    convo: {id, name},

    currentConvoID,
    editedConvoID,

    setConvoName,
    setCurrentConvoID,
    setEditedConvoID,
    setExportedConvoID,
    deleteConvo
}: ConvoListingProps): JSX.Element => {
    const active = currentConvoID === id;
    const edited = editedConvoID === id;

    const prevEdited = useRef(edited);
    const editedConvoRef = useRef<HTMLInputElement>(null);

    // Focus the textbox when we click the edit button
    useEffect(() => {
        if (!prevEdited.current && edited && editedConvoRef.current !== null) {
            editedConvoRef.current.focus();
        }
        prevEdited.current = edited;
    });

    return useMemo(() => <div
        className={classNames(style.convo, {[style.active]: active})}
        onClick={setCurrentConvoID.bind(null, id)}
    >
        <div className={style.convoName}>{edited ?
            <input
                type="text"
                value={name}
                onInput={(event): unknown => setConvoName(id, (event.target as HTMLInputElement).value)}
                onKeyPress={(event): void => {
                    if (event.code === 'Enter') setEditedConvoID(null);
                }}
                onBlur={(): unknown => setEditedConvoID(null)}
                ref={editedConvoRef}
            /> :
            name}</div>
        <div
            className={classNames(
                icons['icon'],
                icons['icon-button'],
                icons['export'])
            }
            onClick={setExportedConvoID.bind(null, id)}
        />
        <div
            className={classNames(
                icons['icon'],
                icons['icon-button'],
                icons['edit'])
            }
            onClick={setEditedConvoID.bind(null, id)}
        />
        <div
            className={classNames(
                icons['icon'],
                icons['icon-button'],
                icons['delete'])
            }
            onClick={deleteConvo.bind(null, id)}
        />
    </div>, [
        id, name, active, edited, editedConvoRef,
        setConvoName, setCurrentConvoID, setEditedConvoID, setExportedConvoID, deleteConvo
    ]);
});

const connectedKeys = ['convos', 'convoIDs'] as const;
const connectedActions = {createConvo};

type Props = InjectProps<{}, typeof connectedKeys, typeof connectedActions>;

const ConvoList = connect(connectedKeys, connectedActions)(({convos, convoIDs, createConvo}: Props): JSX.Element => {
    const convoListings = useMemo(() => convoIDs.map(convoID => {
        const convo = convos[convoID];
        return <ConvoListing key={convoID} convo={convo} />;
    }), [convos, convoIDs]);

    const createConvoCallback = useMemo(() => createConvo.bind(null), [createConvo]);

    return useMemo(() => (
        <div className={style.convoList}>
            <div className={style.convos}>
                {convoListings}
            </div>
            <div className={style.addConvoWrapper}>
                <button onClick={createConvoCallback}>Add Convo</button>
            </div>
        </div>
    ), [convoListings, createConvoCallback]);
});

export default ConvoList;
