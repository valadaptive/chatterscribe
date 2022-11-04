import style from './style.scss';
import icons from '../../icons/icons.scss';

import type {JSX} from 'preact';
import {useState} from 'preact/hooks';
import classNames from 'classnames';

import loadState from '../../actions/load-state';
import setProjectName from '../../actions/set-project-name';

import saveState from '../../serialization/save-state';
import validate from '../../serialization/validate';

import saveToFile from '../../util/save-to-file';
import {connect, InjectProps} from '../../util/store';

const connectedKeys = ['version', 'projectName', 'convos', 'chars'] as const;
const connectedActions = {loadState, setProjectName};
type Props = InjectProps<{}, typeof connectedKeys, typeof connectedActions>;

const ProjectBar = ({version, projectName, convos, chars, loadState, setProjectName}: Props): JSX.Element => {
    const [error, setError] = useState<Error | null>(null);

    const onInput = (event: Event): unknown => setProjectName((event.target as HTMLInputElement).value);

    const onLoad = (): void => {
        const input = document.createElement('input');
        input.type = 'file';
        input.addEventListener('change', event => {
            const files = (event.target as HTMLInputElement).files;
            if (files?.length) {
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                    try {
                        const result = JSON.parse(reader.result as string) as unknown;
                        const errors = validate(result);
                        if (errors.length > 0) throw new Error('Invalid JSON');
                        // eslint-disable-next-line max-len
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
                        loadState(result as any);
                    } catch (error) {
                        setError(error as Error);
                    }
                });
                reader.readAsText(files[0]);
            }
        });
        input.click();
    };

    const onSave = (): void =>
        saveToFile(`${projectName}.json`, saveState({version, projectName, convos: Array.from(Object.values(convos)), chars}));

    return (
        <div className={style.projectBar}>
            <input
                className={style.projectName}
                type="text"
                value={projectName}
                onInput={onInput}
            />
            <div
                className={classNames(style.button, icons['icon'], icons['icon-button'], icons['save'])}
                title="Save"
                onClick={onSave}
            />
            <div
                className={classNames(style.button, icons['icon'], icons['icon-button'], icons['load'])}
                title="Load"
                onClick={onLoad}
            />
            {error ?
                <div className={style.error}>
                    <span className={style.errorMessage}>{error.message}</span>
                    <div
                        className={classNames(icons['icon'], icons['icon-button'], icons['delete'])}
                        onClick={(): void => setError(null)}
                    />
                </div> :
                null
            }
        </div>
    );
};

export default connect(connectedKeys, connectedActions)(ProjectBar);
