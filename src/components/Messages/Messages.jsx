import style from './style.scss';
import icons from '../../icons/icons.scss';

import {connect} from 'unistore/preact';
import classNames from 'classnames';

import CommandBox from '../CommandBox/CommandBox';
import Message from '../Message/Message';

import setInsertAboveMessageID from '../../actions/set-insert-above-message-id';

const Messages = ({messages, insertAboveMessageID, setInsertAboveMessageID}) => {
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
            messageElems.push(<Message message={message} key={message.id} index={i} />);
        }
    }

    return (
        <div className={style['messages']}>
            <div className={style['messages-inner']}>
                {messageElems}
            </div>
        </div>
    );
};

export default connect(['insertAboveMessageID'], {setInsertAboveMessageID})(Messages);
