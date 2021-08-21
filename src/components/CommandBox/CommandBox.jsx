import style from './style.scss';

import {Component} from 'preact';
import {connect} from 'unistore/preact';

import createCharacter from '../../actions/create-character';
import createMessage from '../../actions/create-message';
import editMessage from '../../actions/edit-message';
import setCurrentCharacterID from '../../actions/set-current-character-id';

class CommandBox extends Component {
    constructor (props) {
        super(props);

        this.onKeyPress = this.onKeyPress.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    onKeyDown (event) {
        if (event.code === 'Tab') {
            event.preventDefault();
            const contents = event.target.value.toLowerCase();
            if (contents.indexOf(':') === -1) {
                const character = this.props.chars.find(character => character.name.toLowerCase().startsWith(contents));
                if (!character) return;
                event.target.value = `${character.name}: `;
            }
        }
    }

    onKeyPress (event) {
        if (event.code === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            let command = event.target.value;

            // Parse off leading author specifier
            const colonMatch = /([^:]+):(?:\s+)(.+)/g.exec(command);
            if (colonMatch) {
                const authorName = colonMatch[1].toLowerCase();
                const authorNameLower = authorName.toLowerCase();
                const char = this.props.chars.find(
                    character => character.name.toLowerCase() === authorNameLower);
                if (!char) {
                    this.props.createCharacter(authorName);
                } else {
                    this.props.setCurrentCharacterID(char.id);
                }
                command = colonMatch[2];
            }

            const replaceMatch = /^s\/([^/]+)\/([^/]+)\/?$/.exec(command);
            if (replaceMatch) {
                // if we added a new character, get it here
                const {currentCharID, chars, currentConvoIndex, convos} = this.context.store.getState();
                const currentCharacter = chars.find(char => char.id === currentCharID);
                const {messages} = convos[currentConvoIndex];
                for (let i = this.props.beforeMessage || messages.length - 1; i >= 0; i--) {
                    if (messages[i].authorID === currentCharacter.id) {
                        this.props.editMessage(
                            messages[i].id,
                            messages[i].contents.split(replaceMatch[1]).join(replaceMatch[2])
                        );
                        event.target.value = '';
                        return;
                    }
                }
            }

            event.target.value = '';
            this.props.createMessage(command, this.props.beforeMessage);
        }
    }

    render () {
        return <textarea className={style['command-box']} onKeyPress={this.onKeyPress} onKeyDown={this.onKeyDown} />;
    }
}

export default connect(['chars'], {createMessage, editMessage, createCharacter, setCurrentCharacterID})(CommandBox);
