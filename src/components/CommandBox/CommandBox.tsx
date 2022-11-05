import style from './style.scss';

import type {JSX} from 'preact';
import {useRef, useState} from 'preact/hooks';

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

const CommandBox = ({
    beforeMessage,

    currentCharID,
    chars,
    currentConvoID,
    convos,

    createMessage,
    editMessage,
    createCharacter,
    setCurrentCharacterID
}: Props): JSX.Element => {
    const tabResults = useRef<{
        characters: Character[],
        index: number
    } | null>(null);

    // TODO: use a signal for this
    const [value, setValue] = useState('');

    const onKeyDown = (event: KeyboardEvent): void => {
        if (event.code === 'Tab') {
            event.preventDefault();
            const contents = value.toLowerCase();
            if (contents.indexOf(':') === -1 && tabResults.current === null) {
                tabResults.current = {
                    characters: chars.filter(
                        character => character.name.toLowerCase().startsWith(contents)),
                    index: 0
                };
            }
            if (!tabResults.current || tabResults.current.characters.length === 0) return;
            const character = tabResults.current.characters[tabResults.current.index];
            tabResults.current.index = (tabResults.current.index + 1) % tabResults.current.characters.length;
            setValue(`${character.name}: `);
        } else {
            tabResults.current = null;
        }
    };

    const onKeyPress = (event: KeyboardEvent): void => {
        if (event.code === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            let command = value;

            // Parse off leading author specifier
            const colonMatch = /([^:]+):(?:\s+)(.+)/g.exec(command);
            if (colonMatch) {
                const authorName = colonMatch[1];
                const authorNameLower = authorName.toLowerCase();
                const char = chars.find(
                    character => character.name.toLowerCase() === authorNameLower);
                if (!char) {
                    createCharacter(authorName);
                } else {
                    setCurrentCharacterID(char.id);
                }
                command = colonMatch[2];
            }

            const replaceMatch = /^s\/([^/]+)\/([^/]+)\/?$/.exec(command);
            if (replaceMatch) {
                // if we added a new character, get it here
                const {messages} = convos[currentConvoID!];
                for (let i = beforeMessage || messages.length - 1; i >= 0; i--) {
                    if (messages[i].authorID === currentCharID) {
                        editMessage(
                            currentConvoID!,
                            i,
                            messages[i].contents.split(replaceMatch[1]).join(replaceMatch[2])
                        );
                        setValue('');
                        return;
                    }
                }
            }

            setValue('');
            createMessage(command, beforeMessage);
            return;
        }
    };

    const onInput = (event: Event): void => {
        setValue((event.target as HTMLTextAreaElement).value);
    };

    return <textarea
        className={style.commandBox}
        onKeyPress={onKeyPress}
        onInput={onInput}
        onKeyDown={onKeyDown}
        value={value}
    />;
};

export default connect(connectedKeys, connectedActions)(CommandBox);
