/* eslint-disable react/prefer-stateless-function */
import style from './style.scss';
import icons from '../../icons/icons.scss';

import type {Ref, JSX} from 'preact';
import {useCallback, useEffect, useMemo, useRef, useState} from 'preact/hooks';
import classNames from 'classnames';

import SearchableMenu from '../SearchableMenu/SearchableMenu';

import deleteMessage from '../../actions/delete-message';
import editMessage from '../../actions/edit-message';
import replaceMessageAuthor from '../../actions/replace-message-author';
import setEditedMessage from '../../actions/set-edited-message-id';
import setInsertAboveMessageID from '../../actions/set-insert-above-message-id';

import colorToHex from '../../util/color-to-hex';
import {connect, InjectProps} from '../../util/store';
import type {ID, Message as MessageType} from '../../util/datatypes';

const connectedKeys = ['chars', 'editedMessageID', 'insertAboveMessageID'] as const;
const connectedActions = {deleteMessage, editMessage, replaceMessageAuthor, setEditedMessage, setInsertAboveMessageID};

type Props = InjectProps<{
    message: MessageType,
    convoID: ID,
    index: number,
    elemRef?: Ref<HTMLDivElement>
}, typeof connectedKeys, typeof connectedActions>;

const Message = ({
    message,
    convoID,
    index,
    elemRef,

    chars,
    editedMessageID,
    insertAboveMessageID,

    deleteMessage,
    editMessage,
    replaceMessageAuthor,
    setEditedMessage,
    setInsertAboveMessageID
}: Props): JSX.Element => {
    const {id, authorID, contents} = message;
    const editable = id === editedMessageID;
    const prevEditable = useRef(editable);

    const char = useMemo(
        () => chars.find(char => char.id === authorID) || {color: 0xffffff, name: 'Unknown Character'},
        [chars, authorID]
    );

    const contentsRef = useRef<HTMLTextAreaElement>(null);
    const [authorMenu, setAuthorMenu] = useState<{
        x: number,
        y: number
    } | null>(null);

    // When we click the edit button, focus the message contents box
    useEffect(() => {
        if (!prevEditable.current && editable && contentsRef.current) {
            contentsRef.current.focus();
        }
        prevEditable.current = editable;
    });

    const onReplaceAuthor = useCallback((newAuthorID: ID): void => {
        replaceMessageAuthor(convoID, index, newAuthorID);
        setAuthorMenu(null);
    }, [replaceMessageAuthor, setAuthorMenu, convoID, index]);

    const onDismissAuthorMenu = useCallback((): void => {
        setAuthorMenu(null);
    }, [setAuthorMenu]);

    const authorMenuElement = useMemo(
        () => authorMenu ? <SearchableMenu
            items={chars.map(({id, name}) => ({id, value: name}))}
            x={authorMenu.x}
            y={authorMenu.y}
            onDismiss={onDismissAuthorMenu}
            onClickItem={onReplaceAuthor}
        /> : null,
        [chars, authorMenu]
    );

    return useMemo(() => {
        const onKeyPress = (event: KeyboardEvent): void => {
            if (event.code === 'Enter' && !event.shiftKey && contentsRef.current) {
                editMessage(convoID, index, contentsRef.current.value);
                setEditedMessage(null);
            }
        };

        const onBlur = (): void => {
            if (!contentsRef.current) return;
            editMessage(convoID, index, contentsRef.current.value);
            setEditedMessage(null);
        };

        const onClickAuthor = (event: Event): void => {
            const {x, y, height} = (event.target as Element).getBoundingClientRect();
            setAuthorMenu(prevValue => prevValue === null ? {x, y: y + height} : null);
        };

        return (
            <div className={style.message} ref={elemRef}>
                <div
                    className={style.author}
                    style={`color: ${colorToHex(char.color)}`}
                    onClick={onClickAuthor}
                >
                    {char.name}
                </div>
                <div
                    className={classNames(style.contents, {[style.editable]: editable})}
                >
                    {editable ?
                        <div className={style.messageEditWrapper}>
                            <textarea
                                className={style.messageEditArea}
                                onKeyPress={onKeyPress}
                                onBlur={onBlur}
                                tabIndex={0}
                                ref={contentsRef}
                                value={contents}
                            />
                        </div> :
                        contents}
                </div>
                <div className={style.buttons}>
                    <div
                        className={classNames(
                            icons['icon'],
                            icons['icon-button'],
                            icons['insert-above']
                        )}
                        title="Insert above"
                        onClick={(): unknown => setInsertAboveMessageID(insertAboveMessageID === id ? null : id)}
                    />
                    <div
                        className={classNames(
                            icons['icon'],
                            icons['icon-button'],
                            icons['edit'])
                        }
                        title="Edit"
                        onClick={(): unknown => setEditedMessage(editedMessageID === id ? null : id)}
                    />
                    <div
                        className={classNames(
                            icons['icon'],
                            icons['icon-button'],
                            icons['delete'])
                        }
                        title="Delete"
                        onClick={(): unknown => deleteMessage(index)}
                    />
                </div>
                {authorMenuElement}
            </div>
        );
    }, [char, onReplaceAuthor, onDismissAuthorMenu, authorMenuElement, editable]);
};

export default connect(connectedKeys, connectedActions)(Message);
