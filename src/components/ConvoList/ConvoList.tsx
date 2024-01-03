import style from './style.scss';

import type {JSX} from 'preact';
import {useComputed} from '@preact/signals';
import {useMemo, useRef, useEffect} from 'preact/hooks';
import classNames from 'classnames';

import Icon from '../Icon/Icon';

import createConvoAction from '../../actions/create-convo';
import deleteConvoAction from '../../actions/delete-convo';
import setConvoNameAction from '../../actions/set-convo-name';
import setCurrentConvoIDAction from '../../actions/set-current-convo-id';
import setEditedConvoIDAction from '../../actions/set-edited-convo-id';
import setExportedConvoIDAction from '../../actions/set-exported-convo-id';

import {useAppState, useAction} from '../../util/store';
import type {Convo} from '../../util/datatypes';

const ConvoListing = ({convo: {id, name}}: {convo: Convo}): JSX.Element => {
    const {currentConvoID, editedConvoID} = useAppState();
    const setConvoName = useAction(setConvoNameAction);
    const setCurrentConvoID = useAction(setCurrentConvoIDAction);
    const setEditedConvoID = useAction(setEditedConvoIDAction);
    const setExportedConvoID = useAction(setExportedConvoIDAction);
    const deleteConvo = useAction(deleteConvoAction);

    const active = currentConvoID.value === id;
    const edited = editedConvoID.value === id;

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
        <Icon
            type='export'
            title='Export'
            onClick={(event): void => {
                event.stopPropagation();
                setExportedConvoID(id);
            }}
        />
        <Icon
            type='edit'
            title='Edit'
            onClick={(event): void => {
                event.stopPropagation();
                setEditedConvoID(id);
            }}
        />
        <Icon
            type='delete'
            title='Delete'
            onClick={(event): void => {
                event.stopPropagation();
                deleteConvo(id);
            }}
        />
    </div>, [
        id, name, active, edited, editedConvoRef,
        setConvoName, setCurrentConvoID, setEditedConvoID, setExportedConvoID, deleteConvo
    ]);
};

const ConvoList = (): JSX.Element => {
    const {convos, convoIDs} = useAppState();
    const createConvo = useAction(createConvoAction);

    const convoListings = useComputed(() => convoIDs.value.map(convoID => {
        const convo = convos.value[convoID];
        return <ConvoListing key={convoID} convo={convo} />;
    })).value;

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
};

export default ConvoList;
