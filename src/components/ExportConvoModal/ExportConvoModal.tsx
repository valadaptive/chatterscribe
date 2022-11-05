import style from './style.scss';

import type {JSX} from 'preact';

import setWrapTextEnabledAction from '../../actions/export-convo-settings/set-wrap-text-enabled';
import setWrapTextLengthAction from '../../actions/export-convo-settings/set-wrap-text-length';
import setJustifyEnabledAction from '../../actions/export-convo-settings/set-justify-enabled';
import setJustifySideAction from '../../actions/export-convo-settings/set-justify-side';

import saveToFile from '../../util/save-to-file';
import {useAppState, useAction} from '../../util/store';
import type {ID} from '../../util/datatypes';

const ExportConvoModal = (): JSX.Element | null => {
    const {
        convos,
        exportedConvoID,
        chars,
        exportConvoSettings
    } = useAppState();

    const {
        wrapTextEnabled,
        wrapTextLength,
        justifyEnabled,
        justifySide
    } = exportConvoSettings;

    const setWrapTextEnabled = useAction(setWrapTextEnabledAction);
    const setWrapTextLength = useAction(setWrapTextLengthAction);
    const setJustifyEnabled = useAction(setJustifyEnabledAction);
    const setJustifySide = useAction(setJustifySideAction);

    const onChangeWrapTextEnabled = (event: Event): void => {
        setWrapTextEnabled((event.target as HTMLInputElement).checked);
    };

    const onChangeWrapTextLength = (event: Event): void => {
        const length = parseInt((event.target as HTMLInputElement).value);
        if (Number.isFinite(length)) setWrapTextLength(length);
    };

    const onChangeJustifyEnabled = (event: Event): void => {
        setJustifyEnabled((event.target as HTMLInputElement).checked);
    };

    const onChangeJustifySide = (event: Event): void => {
        setJustifySide((event.target as HTMLInputElement).value as 'left' | 'right');
    };

    const onExport = (): void => {
        if (!exportedConvoID.value) return;
        const convo = convos.value[exportedConvoID.value];

        const charsInConvo = new Set<ID>();
        for (const message of convo.messages) {
            charsInConvo.add(message.authorID);
        }
        const longestCharNameLength = Array.from(charsInConvo)
            .reduce((prev: number, charID: ID): number =>
                Math.max(prev, chars.value.find(char => char.id === charID)?.name.length ?? 0), 0);

        const lines = [];

        for (const message of convo.messages) {
            const charName = chars.value.find(char => char.id === message.authorID)?.name ?? 'Unknown character';
            let start = `<${charName}> `;
            if (justifyEnabled.value) {
                const justification = ' '.repeat(longestCharNameLength - charName.length);
                if (justifySide.value === 'left') {
                    start += justification;
                } else {
                    start = justification + start;
                }
            }

            let line = start;

            if (wrapTextEnabled.value) {
                const regex = /([^\s]+)(\s|$)/g;
                regex.lastIndex = 0;
                let match;
                while ((match = regex.exec(message.contents)) !== null) {
                    if (line.length + match[1].length <= wrapTextLength.value) {
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
    };

    if (!exportedConvoID.value) return null;
    const convo = convos.value[exportedConvoID.value];

    return (
        <div className={style.exportModal}>
            <div className={style.exportTitle}>Export {`"${convo.name}"`}</div>
            <div className={style.row}>
                <label><input
                    type="checkbox"
                    checked={wrapTextEnabled}
                    onChange={onChangeWrapTextEnabled}
                />Wrap text at </label>
                <input
                    type="number"
                    min={0}
                    onChange={onChangeWrapTextLength}
                    disabled={!wrapTextEnabled}
                    value={wrapTextLength}
                /> chars
            </div>
            <div className={style.row}>
                <label><input
                    type="checkbox"
                    checked={justifyEnabled}
                    onChange={onChangeJustifyEnabled}
                />Justify usernames </label>
                <label>
                    <input
                        type="radio"
                        onClick={onChangeJustifySide}
                        checked={justifySide.value === 'left'}
                        disabled={!justifyEnabled}
                        value="left"
                    /> Left
                </label>
                <label>
                    <input
                        type="radio"
                        onClick={onChangeJustifySide}
                        checked={justifySide.value === 'right'}
                        disabled={!justifyEnabled}
                        value="right"
                    /> Right
                </label>
            </div>
            <div className={style.row}>
                <button onClick={onExport}>Export</button>
            </div>
        </div>
    );
};

export default ExportConvoModal;
