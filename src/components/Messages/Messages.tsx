import style from './style.scss';
import icons from '../../icons/icons.scss';

import type {JSX} from 'preact';
import {useEffect, useMemo, useRef} from 'preact/hooks';
import classNames from 'classnames';

import CommandBox from '../CommandBox/CommandBox';
import Message from '../Message/Message';

import setInsertAboveMessageIDAction from '../../actions/set-insert-above-message-id';

import {useAppState, useAction} from '../../util/store';
import {Convo} from '../../util/datatypes';

const Messages = ({convo}: {convo: Convo | undefined}): JSX.Element => {
    const {insertAboveMessageID} = useAppState();
    const setInsertAboveMessageID = useAction(setInsertAboveMessageIDAction);
    const lastMessageElem = useRef<HTMLDivElement>(null);

    const messages = convo?.messages;
    const prevMessagesRef = useRef(messages);

    useEffect(() => {
        const prevMessages = prevMessagesRef.current;
        const messageAddedAtBottom = prevMessages && messages &&
            prevMessages.length + 1 === messages.length &&
            prevMessages[prevMessages.length - 1] !== messages[messages.length - 1];

        // Ideally, this would happen for messages added anywhere, but that would require creating a ref for every
        // message and arrays of refs are really hard to do correctly
        if (messageAddedAtBottom && lastMessageElem.current) {
            lastMessageElem.current.scrollIntoView();
        }

        prevMessagesRef.current = messages;
    });

    const messageElems = useMemo(() => {
        const messageElems = [];
        if (messages) {
            for (let i = 0; i < messages.length; i++) {
                const message = messages[i];
                if (insertAboveMessageID.value === message.id) {
                    messageElems.push(
                        <div className={style.insertBox}>
                            <div className={style.closeWrapper}>
                                <div className={style.closePositioner}>
                                    <div
                                        className={classNames(
                                            icons['icon'],
                                            icons['icon-button'],
                                            icons['delete']
                                        )}
                                        title="Close"
                                        onClick={(): unknown => setInsertAboveMessageID(null)}
                                    />
                                </div>
                            </div>
                            <div className={style.commandBoxWrapper}>
                                <CommandBox beforeMessage={i}/>
                            </div>
                        </div>
                    );
                }
                messageElems.push(<Message
                    convoID={convo.id}
                    message={message}
                    key={message.id}
                    index={i}
                    // I could use forwardRef here but don't want to pull in preact/compat
                    elemRef={i === messages.length - 1 ? lastMessageElem : undefined}
                />);
            }
        }
        return messageElems;
    }, [messages, convo?.id]);


    return (
        <div className={style.messages}>
            <div className={style.messagesInner}>
                {messageElems}
            </div>
        </div>
    );
};

export default Messages;
