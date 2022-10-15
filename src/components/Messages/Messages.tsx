import style from './style.scss';
import icons from '../../icons/icons.scss';

import {Component, createRef, RefObject, JSX} from 'preact';
import classNames from 'classnames';

import CommandBox from '../CommandBox/CommandBox';
import Message from '../Message/Message';

import setInsertAboveMessageID from '../../actions/set-insert-above-message-id';

import {connect, InjectProps} from '../../util/store';
import {Convo} from '../../util/datatypes';

const connectedKeys = 'insertAboveMessageID';
const connectedActions = {setInsertAboveMessageID};
type Props = InjectProps<{
    convo: Convo | undefined,
}, typeof connectedKeys, typeof connectedActions>;

class Messages extends Component<Props> {
    lastMessageElem: RefObject<HTMLDivElement>;

    constructor (props: Props) {
        super(props);

        this.lastMessageElem = createRef();
    }

    componentDidUpdate (prevProps: Props): void {
        const prevMessages = prevProps.convo?.messages;
        const currMessages = this.props.convo?.messages;
        const messageAddedAtBottom = prevMessages && currMessages &&
        prevMessages.length + 1 === currMessages.length &&
        prevMessages[prevMessages.length - 1] !== currMessages[currMessages.length - 1];

        // Ideally, this would happen for messages added anywhere, but that would require creating a ref for every
        // message and arrays of refs are really hard to do correctly
        if (messageAddedAtBottom && this.lastMessageElem.current) {
            this.lastMessageElem.current.scrollIntoView();
        }
    }

    render (): JSX.Element {
        const {convo, insertAboveMessageID, setInsertAboveMessageID} = this.props;
        const messages = convo?.messages;

        const messageElems = [];
        if (messages) {
            for (let i = 0; i < messages.length; i++) {
                const message = messages[i];
                if (insertAboveMessageID === message.id) {
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
                    elemRef={i === messages.length - 1 ? this.lastMessageElem : undefined}
                />);
            }
        }

        return (
            <div className={style.messages}>
                <div className={style.messagesInner}>
                    {messageElems}
                </div>
            </div>
        );
    }
}

export default connect(connectedKeys, connectedActions)(Messages);
