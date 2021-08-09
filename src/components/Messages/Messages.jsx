import style from './style.scss';

import Message from '../Message/Message';

const Messages = ({messages}) => (
    <div className={style['messages']}>
        <div className={style['messages-inner']}>
            {messages && messages.map((message, i) => (
                <Message message={message} key={message.id} index={i} />
            ))}
        </div>
    </div>
);

export default Messages;
