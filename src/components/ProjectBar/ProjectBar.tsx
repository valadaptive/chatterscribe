import style from './style.scss';

import type {JSX} from 'preact';
import {useState} from 'preact/hooks';

import Icon from '../Icon/Icon';

import loadStateAction from '../../actions/load-state';
import setProjectNameAction from '../../actions/set-project-name';

import saveState from '../../serialization/save-state';
import validate from '../../serialization/validate';

import saveToFile from '../../util/save-to-file';
import {useAppState, useAction} from '../../util/store';

const ProjectBar = (): JSX.Element => {
    const {version, projectName, convos, chars} = useAppState();

    const loadState = useAction(loadStateAction);
    const setProjectName = useAction(setProjectNameAction);

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
        saveToFile(
            `${projectName.value}.json`,
            saveState({
                version: version.value,
                projectName: projectName.value,
                convos: Array.from(Object.values(convos.value)),
                chars: chars.value
            }));

    return (
        <div className={style.projectBar}>
            <input
                className={style.projectName}
                type="text"
                value={projectName}
                onInput={onInput}
            />
            <Icon type='save' title='Save' onClick={onSave} />
            <Icon type='load' title='Load' onClick={onLoad} />
            {error ?
                <div className={style.error}>
                    <span className={style.errorMessage}>{error.message}</span>
                    <Icon type='delete' title='Close' onClick={(): void => setError(null)} />
                </div> :
                null
            }
        </div>
    );
};

export default ProjectBar;
