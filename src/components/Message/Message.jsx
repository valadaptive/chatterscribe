/* eslint-disable react/prefer-stateless-function */
import style from './style.scss';
import icons from '../../icons/icons.scss';

import {Component, createRef} from 'preact';
import {connect} from 'unistore/preact';
import classNames from 'classnames';

import deleteMessage from '../../actions/delete-message';
import editMessage from '../../actions/edit-message';
import setEditedMessage from '../../actions/set-edited-message-id';

import colorToHex from '../../util/color-to-hex';

class Message extends Component {
    constructor (props) {
        super(props);

        this.contentsRef = createRef();
        this.onMessageEdit = this.onMessageEdit.bind(this);
        this.onMessageDelete = this.onMessageDelete.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    onMessageEdit () {
        this.props.setEditedMessage(this.props.editedMessageID === this.props.message.id ?
            null :
            this.props.message.id);
    }

    onMessageDelete () {
        this.props.deleteMessage(this.props.index);
    }

    onKeyPress (event) {
        if (event.code === 'Enter' && !event.shiftKey) {
            this.props.editMessage(this.props.message.id, this.contentsRef.current.value);
            this.props.setEditedMessage(null);
        }
    }

    onBlur () {
        this.props.editMessage(this.props.message.id, this.contentsRef.current.value);
        this.props.setEditedMessage(null);
    }

    componentDidUpdate (prevProps) {
        if (prevProps.editedMessageID !== prevProps.message.id &&
            this.props.editedMessageID === this.props.message.id &&
            this.contentsRef.current) {
            this.contentsRef.current.focus();
        }
    }

    render () {
        const {message, chars, editedMessageID} = this.props;
        const {id, authorID, contents} = message;
        const editable = id === editedMessageID;
        const char = chars.find(char => char.id === message.authorID);

        return (
            <div className={style['message']}>
                <div className={style['author']} style={`color: ${colorToHex(char.color)}`}>
                    {chars.find(char => char.id === authorID).name}
                </div>
                <div
                    className={classNames(style['contents'], {[style['editable']]: editable})}
                >
                    {editable ?
                        <input
                            type="text"
                            onKeyPress={this.onKeyPress}
                            onBlur={this.onBlur}
                            contentEditable={editable}
                            tabIndex="0"
                            ref={this.contentsRef}
                            value={contents}
                        /> :
                        contents}
                </div>
                <div className={style['buttons']}>
                    <div
                        className={classNames(
                            style['edit'],
                            icons['icon'],
                            icons['icon-button'],
                            icons['edit'])
                        }
                        onClick={this.onMessageEdit}
                    />
                    <div
                        className={classNames(
                            style['delete'],
                            icons['icon'],
                            icons['icon-button'],
                            icons['delete'])
                        }
                        onClick={this.onMessageDelete}
                    />
                </div>
            </div>
        );
    }
}

export default connect(['chars', 'editedMessageID'], {deleteMessage, editMessage, setEditedMessage})(Message);
