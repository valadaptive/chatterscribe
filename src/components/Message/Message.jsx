/* eslint-disable react/prefer-stateless-function */
import style from './style.scss';
import icons from '../../icons/icons.scss';

import {Component, createRef} from 'preact';
import {connect} from 'unistore/preact';
import classNames from 'classnames';

import SearchableMenu from '../SearchableMenu/SearchableMenu';

import deleteMessage from '../../actions/delete-message';
import editMessage from '../../actions/edit-message';
import replaceMessageAuthor from '../../actions/replace-message-author';
import setEditedMessage from '../../actions/set-edited-message-id';
import setInsertAboveMessageID from '../../actions/set-insert-above-message-id';

import colorToHex from '../../util/color-to-hex';

class Message extends Component {
    constructor (props) {
        super(props);

        this.state = {
            authorMenuOpen: false,
            authorMenuX: 0,
            authorMenuY: 0
        };

        this.contentsRef = createRef();
        this.onInsertAbove = this.onInsertAbove.bind(this);
        this.onMessageEdit = this.onMessageEdit.bind(this);
        this.onMessageDelete = this.onMessageDelete.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onClickAuthor = this.onClickAuthor.bind(this);
        this.onDismissAuthorMenu = this.onDismissAuthorMenu.bind(this);
        this.onReplaceAuthor = this.onReplaceAuthor.bind(this);
    }

    onInsertAbove () {
        this.props.setInsertAboveMessageID(this.props.insertAboveMessageID === this.props.message.id ?
            null :
            this.props.message.id);
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

    onClickAuthor (event) {
        const {x, y, height} = event.target.getBoundingClientRect();
        this.setState(prevState => ({
            authorMenuOpen: !prevState.authorMenuOpen,
            authorMenuX: x,
            authorMenuY: y + height
        }));
    }

    onReplaceAuthor (newAuthorID) {
        this.props.replaceMessageAuthor(this.props.message.id, newAuthorID);
        this.setState({authorMenuOpen: false});
    }

    onDismissAuthorMenu () {
        this.setState({authorMenuOpen: false});
    }

    componentDidUpdate (prevProps) {
        if (prevProps.editedMessageID !== prevProps.message.id &&
            this.props.editedMessageID === this.props.message.id &&
            this.contentsRef.current) {
            this.contentsRef.current.focus();
        }
    }

    render () {
        const {message, chars, editedMessageID, elemRef} = this.props;
        const {id, authorID, contents} = message;
        const editable = id === editedMessageID;
        const char = chars.find(char => char.id === authorID) || {color: 0xffffff, name: 'Unknown Character'};

        return (
            <div className={style['message']} ref={elemRef}>
                <div
                    className={style['author']}
                    style={`color: ${colorToHex(char.color)}`}
                    onClick={this.onClickAuthor}
                >
                    {char.name}
                </div>
                <div
                    className={classNames(style['contents'], {[style['editable']]: editable})}
                >
                    {editable ?
                        <div className={style['message-edit-wrapper']}>
                            <textarea
                                className={style['message-edit-area']}
                                onKeyPress={this.onKeyPress}
                                onBlur={this.onBlur}
                                tabIndex="0"
                                ref={this.contentsRef}
                                value={contents}
                            />
                        </div> :
                        contents}
                </div>
                <div className={style['buttons']}>
                    <div
                        className={classNames(
                            icons['icon'],
                            icons['icon-button'],
                            icons['insert-above']
                        )}
                        title="Insert above"
                        onClick={this.onInsertAbove}
                    />
                    <div
                        className={classNames(
                            icons['icon'],
                            icons['icon-button'],
                            icons['edit'])
                        }
                        title="Edit"
                        onClick={this.onMessageEdit}
                    />
                    <div
                        className={classNames(
                            icons['icon'],
                            icons['icon-button'],
                            icons['delete'])
                        }
                        title="Delete"
                        onClick={this.onMessageDelete}
                    />
                </div>
                {this.state.authorMenuOpen ?
                    <SearchableMenu
                        items={this.props.chars.map(({id, name}) => ({id, value: name}))}
                        x={this.state.authorMenuX}
                        y={this.state.authorMenuY}
                        onDismiss={this.onDismissAuthorMenu}
                        onClickItem={this.onReplaceAuthor}
                    /> :
                    null}
            </div>
        );
    }
}

export default connect(
    ['chars', 'editedMessageID', 'insertAboveMessageID'],
    {deleteMessage, editMessage, replaceMessageAuthor, setEditedMessage, setInsertAboveMessageID}
)(Message);
