import style from './style.scss';

import {Component, JSX} from 'preact';

import createCharacter from '../../actions/create-character';
import createMessage from '../../actions/create-message';
import editMessage from '../../actions/edit-message';
import setCurrentCharacterID from '../../actions/set-current-character-id';

import {connect, InjectProps} from '../../util/store';
import type {Character} from '../../util/datatypes';

const connectedKeys = ['currentCharID', 'chars', 'currentConvoID', 'convos'] as const;
const connectedActions = {createMessage, editMessage, createCharacter, setCurrentCharacterID};
type Props = InjectProps<{
    beforeMessage?: number
}, typeof connectedKeys, typeof connectedActions>;

class CommandBox extends Component<Props> {
    // TODO: store as state and re-render
    tabResults: Character[] | null;
    tabIndex: number;

    constructor (props: Props) {
        super(props);

        this.tabResults = null;
        this.tabIndex = -1;

        this.onKeyPress = this.onKeyPress.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    onKeyDown (event: KeyboardEvent): void {
        if (event.code === 'Tab') {
            event.preventDefault();
            const target = event.target as HTMLTextAreaElement;
            const contents = target.value.toLowerCase();
            if (contents.indexOf(':') === -1 && this.tabResults === null) {
                this.tabResults = this.props.chars.filter(
                    character => character.name.toLowerCase().startsWith(contents));
                this.tabIndex = 0;
            }
            if (!this.tabResults?.length) return;
            const character = this.tabResults[this.tabIndex];
            this.tabIndex = (this.tabIndex + 1) % this.tabResults.length;
            target.value = `${character.name}: `;
        } else {
            this.tabResults = null;
        }
    }

    onKeyPress (event: KeyboardEvent): void {
        if (event.code === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            const target = event.target as HTMLTextAreaElement;
            let command = target.value;

            // Parse off leading author specifier
            const colonMatch = /([^:]+):(?:\s+)(.+)/g.exec(command);
            if (colonMatch) {
                const authorName = colonMatch[1];
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
                const {currentCharID, currentConvoID, convos} = this.props;
                const {messages} = convos[currentConvoID!];
                for (let i = this.props.beforeMessage || messages.length - 1; i >= 0; i--) {
                    if (messages[i].authorID === currentCharID) {
                        this.props.editMessage(
                            currentConvoID!,
                            i,
                            messages[i].contents.split(replaceMatch[1]).join(replaceMatch[2])
                        );
                        target.value = '';
                        return;
                    }
                }
            }

            target.value = '';
            this.props.createMessage(command, this.props.beforeMessage);
        }
    }

    render (): JSX.Element {
        return <textarea className={style.commandBox} onKeyPress={this.onKeyPress} onKeyDown={this.onKeyDown} />;
    }
}

export default connect(connectedKeys, connectedActions)(CommandBox);
