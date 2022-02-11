import style from './style.scss';
import icons from '../../icons/icons.scss';

import {Component, createRef} from 'preact';
import {connect} from 'unistore/preact';
import classNames from 'classnames';

import CommandBox from '../CommandBox/CommandBox';
import Message from '../Message/Message';

import setInsertAboveMessageID from '../../actions/set-insert-above-message-id';

class Messages extends Component {
    constructor (props) {
        super(props);

        this.lastMessageElem = createRef();
    }

    componentDidUpdate (prevProps) {
        const messageAddedAtBottom = prevProps.messages && this.props.messages &&
        prevProps.messages.length + 1 === this.props.messages.length &&
        prevProps.messages[prevProps.messages.length - 1] !== this.props.messages[this.props.messages.length - 1];

        // Ideally, this would happen for messages added anywhere, but that would require creating a ref for every
        // message and arrays of refs are really hard to do correctly
        if (messageAddedAtBottom) {
            this.lastMessageElem.current.scrollIntoView();
        }
    }

    render () {
        const {messages, insertAboveMessageID, setInsertAboveMessageID} = this.props;

        const messageElems = [];
        if (messages) {
            for (let i = 0; i < messages.length; i++) {
                const message = messages[i];
                if (insertAboveMessageID === message.id) {
                    messageElems.push(
                        <div className={style['insert-box']}>
                            <div className={style['close-wrapper']}>
                                <div className={style['close-positioner']}>
                                    <div
                                        className={classNames(
                                            icons['icon'],
                                            icons['icon-button'],
                                            icons['delete']
                                        )}
                                        title="Close"
                                        onClick={() => setInsertAboveMessageID(null)}
                                    />
                                </div>
                            </div>
                            <div className={style['command-box-wrapper']}>
                                <CommandBox beforeMessage={i}/>
                            </div>
                        </div>
                    );
                }
                messageElems.push(<Message
                    message={message}
                    key={message.id}
                    index={i}
                    // I could use forwardRef here but don't want to pull in preact/compat
                    elemRef={i === messages.length - 1 ? this.lastMessageElem : null}
                />);
            }
        }

        return (
            <div className={style['messages']}>
                <div className={style['messages-inner']}>
                    {messageElems}
                </div>
            </div>
        );
    }
}

export default connect(['insertAboveMessageID'], {setInsertAboveMessageID})(Messages);
