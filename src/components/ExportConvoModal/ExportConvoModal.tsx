import style from './style.scss';

import {Component, JSX} from 'preact';

import setWrapTextEnabled from '../../actions/export-convo-settings/set-wrap-text-enabled';
import setWrapTextLength from '../../actions/export-convo-settings/set-wrap-text-length';
import setJustifyEnabled from '../../actions/export-convo-settings/set-justify-enabled';
import setJustifySide from '../../actions/export-convo-settings/set-justify-side';

import saveToFile from '../../util/save-to-file';
import {connect, InjectProps, StoreShape} from '../../util/store';
import type {ID} from '../../util/datatypes';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const stateMapper = (state: StoreShape) => {
    const {convos, exportedConvoID, chars} = state;
    const {wrapTextEnabled, wrapTextLength, justifyEnabled, justifySide} = state.exportConvoSettings;
    return {convos, exportedConvoID, chars, wrapTextEnabled, wrapTextLength, justifyEnabled, justifySide};
};

const connectedActions = {setWrapTextEnabled, setWrapTextLength, setJustifyEnabled, setJustifySide};

type Props = InjectProps<{}, typeof stateMapper, typeof connectedActions>;

class ExportConvoModal extends Component<Props> {
    constructor (props: Props) {
        super(props);

        this.onChangeWrapTextEnabled = this.onChangeWrapTextEnabled.bind(this);
        this.onChangeWrapTextLength = this.onChangeWrapTextLength.bind(this);
        this.onChangeJustifyEnabled = this.onChangeJustifyEnabled.bind(this);
        this.onChangeJustifySide = this.onChangeJustifySide.bind(this);
        this.onExport = this.onExport.bind(this);
    }

    onChangeWrapTextEnabled (event: Event): void {
        this.props.setWrapTextEnabled((event.target as HTMLInputElement).checked);
    }

    onChangeWrapTextLength (event: Event): void {
        const length = parseInt((event.target as HTMLInputElement).value);
        if (Number.isFinite(length)) this.props.setWrapTextLength(length);
    }

    onChangeJustifyEnabled (event: Event): void {
        this.props.setJustifyEnabled((event.target as HTMLInputElement).checked);
    }

    onChangeJustifySide (event: Event): void {
        this.props.setJustifySide((event.target as HTMLInputElement).value as 'left' | 'right');
    }

    onExport (): void {
        const {
            convos,
            exportedConvoID,
            chars,
            wrapTextEnabled,
            wrapTextLength,
            justifyEnabled,
            justifySide
        } = this.props;

        if (!exportedConvoID) return;
        const convo = convos[exportedConvoID];

        const charsInConvo = new Set<ID>();
        for (const message of convo.messages) {
            charsInConvo.add(message.authorID);
        }
        const longestCharNameLength = Array.from(charsInConvo)
            .reduce((prev: number, charID: ID): number =>
                Math.max(prev, chars.find(char => char.id === charID)?.name.length ?? 0), 0);

        const lines = [];

        for (const message of convo.messages) {
            const charName = chars.find(char => char.id === message.authorID)?.name ?? 'Unknown character';
            let start = `<${charName}> `;
            if (justifyEnabled) {
                const justification = ' '.repeat(longestCharNameLength - charName.length);
                if (justifySide === 'left') {
                    start += justification;
                } else {
                    start = justification + start;
                }
            }

            let line = start;

            if (wrapTextEnabled) {
                const regex = /([^\s]+)(\s|$)/g;
                regex.lastIndex = 0;
                let match;
                while ((match = regex.exec(message.contents)) !== null) {
                    if (line.length + match[1].length <= wrapTextLength) {
                        line += match[0];
                    } else {
                        lines.push(line.trimEnd());
                        line = ' '.repeat(start.length) + match[0];
                    }
                }
                if (line.trimEnd().length > 0) {
                    lines.push(line.trimEnd());
                }
            } else {
                lines.push(line + message.contents);
            }
        }
        const convoStr = lines.join('\n');

        saveToFile(`${convo.name}.txt`, convoStr);
    }

    render (): JSX.Element | null {
        const {convos, exportedConvoID, wrapTextEnabled, wrapTextLength, justifyEnabled, justifySide} = this.props;
        if (!exportedConvoID) return null;
        const convo = convos[exportedConvoID];

        return (
            <div className={style.exportModal}>
                <div className={style.exportTitle}>Export {`"${convo.name}"`}</div>
                <div className={style.row}>
                    <label><input
                        type="checkbox"
                        checked={wrapTextEnabled}
                        onChange={this.onChangeWrapTextEnabled}
                    />Wrap text at </label>
                    <input
                        type="number"
                        min={0}
                        onChange={this.onChangeWrapTextLength}
                        disabled={!wrapTextEnabled}
                        value={wrapTextLength}
                    /> chars
                </div>
                <div className={style.row}>
                    <label><input
                        type="checkbox"
                        checked={justifyEnabled}
                        onChange={this.onChangeJustifyEnabled}
                    />Justify usernames </label>
                    <label>
                        <input
                            type="radio"
                            onClick={this.onChangeJustifySide}
                            checked={justifySide === 'left'}
                            disabled={!justifyEnabled}
                            value="left"
                        /> Left
                    </label>
                    <label>
                        <input
                            type="radio"
                            onClick={this.onChangeJustifySide}
                            checked={justifySide === 'right'}
                            disabled={!justifyEnabled}
                            value="right"
                        /> Right
                    </label>
                </div>
                <div className={style.row}>
                    <button onClick={this.onExport}>Export</button>
                </div>
            </div>
        );
    }
}

export default connect(stateMapper, connectedActions)(ExportConvoModal);
