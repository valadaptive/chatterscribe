import style from './style.scss';

import type {Ref, JSX} from 'preact';
import {useCallback, useEffect, useMemo, useRef, useState} from 'preact/hooks';
import classNames from 'classnames';

import Icon from '../Icon/Icon';
import SearchableMenu from '../SearchableMenu/SearchableMenu';

import deleteMessageAction from '../../actions/delete-message';
import editMessageAction from '../../actions/edit-message';
import replaceMessageAuthorAction from '../../actions/replace-message-author';
import setEditedMessageAction from '../../actions/set-edited-message-id';
import setInsertAboveMessageIDAction from '../../actions/set-insert-above-message-id';

import colorToHex from '../../util/color-to-hex';
import {useAppState, useAction} from '../../util/store';
import type {ID, Message as MessageType} from '../../util/datatypes';

type Props = {
    message: MessageType,
    convoID: ID,
    index: number,
    elemRef?: Ref<HTMLDivElement>
};

const Message = ({
    message,
    convoID,
    index,
    elemRef
}: Props): JSX.Element => {
    const {chars, editedMessageID, insertAboveMessageID} = useAppState();

    const deleteMessage = useAction(deleteMessageAction);
    const editMessage = useAction(editMessageAction);
    const replaceMessageAuthor = useAction(replaceMessageAuthorAction);
    const setEditedMessage = useAction(setEditedMessageAction);
    const setInsertAboveMessageID = useAction(setInsertAboveMessageIDAction);

    const {id, authorID, contents} = message;
    const editable = id === editedMessageID.value;
    const prevEditable = useRef(editable);

    const char = useMemo(
        () => chars.value.find(char => char.id === authorID) || {color: 0xffffff, name: 'Unknown Character'},
        [chars.value, authorID]
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
            items={chars.value.map(({id, name}) => ({id, value: name}))}
            x={authorMenu.x}
            y={authorMenu.y}
            onDismiss={onDismissAuthorMenu}
            onClickItem={onReplaceAuthor}
        /> : null,
        [chars.value, authorMenu]
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
                    <Icon
                        type='insert-above'
                        title='Insert above'
                        onClick={(): unknown => setInsertAboveMessageID(insertAboveMessageID.value === id ? null : id)}
                    />
                    <Icon
                        type='edit'
                        title='Edit'
                        onClick={(): unknown => setEditedMessage(editedMessageID.value === id ? null : id)}
                    />
                    <Icon
                        type='delete'
                        title='Delete'
                        onClick={(): unknown => deleteMessage(index)}
                    />
                </div>
                {authorMenuElement}
            </div>
        );
    }, [char, onReplaceAuthor, onDismissAuthorMenu, authorMenuElement, editable]);
};

export default Message;
