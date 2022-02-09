import style from './style.scss';

import {Component} from 'preact';
import {connect} from 'unistore/preact';

import setWrapTextEnabled from '../../actions/export-convo-settings/set-wrap-text-enabled';
import setWrapTextLength from '../../actions/export-convo-settings/set-wrap-text-length';
import setJustifyEnabled from '../../actions/export-convo-settings/set-justify-enabled';
import setJustifySide from '../../actions/export-convo-settings/set-justify-side';

import saveToFile from '../../util/save-to-file';

class ExportConvoModal extends Component {
    constructor (props) {
        super(props);

        this.onChangeWrapTextEnabled = this.onChangeWrapTextEnabled.bind(this);
        this.onChangeWrapTextLength = this.onChangeWrapTextLength.bind(this);
        this.onChangeJustifyEnabled = this.onChangeJustifyEnabled.bind(this);
        this.onChangeJustifySide = this.onChangeJustifySide.bind(this);
        this.onExport = this.onExport.bind(this);
    }

    onChangeWrapTextEnabled (event) {
        this.props.setWrapTextEnabled(event.target.checked);
    }

    onChangeWrapTextLength (event) {
        const length = parseInt(event.target.value);
        if (Number.isFinite(length)) this.props.setWrapTextLength(length);
    }

    onChangeJustifyEnabled (event) {
        this.props.setJustifyEnabled(event.target.checked);
    }

    onChangeJustifySide (event) {
        this.props.setJustifySide(event.target.value);
    }

    onExport () {
        const {
            convos,
            exportedConvoID,
            chars,
            wrapTextEnabled,
            wrapTextLength,
            justifyEnabled,
            justifySide
        } = this.props;

        const convo = convos.find(convo => convo.id === exportedConvoID);
        if (!convo) return;

        const charsInConvo = new Set();
        for (const message of convo.messages) {
            charsInConvo.add(message.authorID);
        }
        const longestCharNameLength = Array.from(charsInConvo)
            .reduce((prev, charID) => Math.max(prev, chars.find(char => char.id === charID).name.length), 0);

        const lines = [];

        for (const message of convo.messages) {
            const charName = chars.find(char => char.id === message.authorID).name;
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

    render () {
        const {convos, exportedConvoID, wrapTextEnabled, wrapTextLength, justifyEnabled, justifySide} = this.props;
        const convo = convos.find(convo => convo.id === exportedConvoID);
        if (!convo) return null;

        return (
            <div className={style['export-modal']}>
                <div className={style['export-title']}>Export {`"${convo.name}"`}</div>
                <div className={style['row']}>
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
                <div className={style['row']}>
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
                <div className={style['row']}>
                    <button onClick={this.onExport}>Export</button>
                </div>
            </div>
        );
    }
}

export default connect(state => {
    const {convos, exportedConvoID, chars} = state;
    const {wrapTextEnabled, wrapTextLength, justifyEnabled, justifySide} = state.exportConvoSettings;
    return {convos, exportedConvoID, chars, wrapTextEnabled, wrapTextLength, justifyEnabled, justifySide};
}, {setWrapTextEnabled, setWrapTextLength, setJustifyEnabled, setJustifySide})(ExportConvoModal);
