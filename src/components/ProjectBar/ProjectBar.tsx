import style from './style.scss';
import icons from '../../icons/icons.scss';

import {Component, JSX} from 'preact';
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

type State = {
    error: Error | null
};

class ProjectBar extends Component<Props, State> {
    constructor (props: Props) {
        super(props);

        this.state = {
            error: null
        };

        this.onInput = this.onInput.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.closeError = this.closeError.bind(this);
    }

    onInput (event: Event): void {
        this.props.setProjectName((event.target as HTMLInputElement).value);
    }

    onLoad (): void {
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
                        this.props.loadState(result as any);
                    } catch (error) {
                        this.setState({error: error as Error});
                    }
                });
                reader.readAsText(files[0]);
            }
        });
        input.click();
    }

    onSave (): void {
        const {version, projectName, convos, chars} = this.props;
        saveToFile(`${projectName}.json`, saveState({version, projectName, convos, chars}));
    }

    closeError (): void {
        this.setState({error: null});
    }

    render (): JSX.Element {
        return (
            <div className={style.projectBar}>
                <input
                    className={style.projectName}
                    type="text"
                    value={this.props.projectName}
                    onInput={this.onInput}
                />
                <div
                    className={classNames(style.button, icons['icon'], icons['icon-button'], icons['save'])}
                    title="Save"
                    onClick={this.onSave}
                />
                <div
                    className={classNames(style.button, icons['icon'], icons['icon-button'], icons['load'])}
                    title="Load"
                    onClick={this.onLoad}
                />
                {this.state.error ?
                    <div className={style.error}>
                        <span className={style.errorMessage}>{this.state.error.message}</span>
                        <div
                            className={classNames(icons['icon'], icons['icon-button'], icons['delete'])}
                            onClick={this.closeError}
                        />
                    </div> :
                    null
                }
            </div>
        );
    }
}

export default connect(connectedKeys, connectedActions)(ProjectBar);
