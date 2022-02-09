import style from './style.scss';
import icons from '../../icons/icons.scss';

import {Component} from 'preact';
import {connect} from 'unistore/preact';
import classNames from 'classnames';

import loadState from '../../actions/load-state';
import setProjectName from '../../actions/set-project-name';

import saveState from '../../serialization/save-state';
import validate from '../../serialization/validate';

import saveToFile from '../../util/save-to-file';

class ProjectBar extends Component {
    constructor (props) {
        super(props);

        this.state = {
            error: null
        };

        this.onInput = this.onInput.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.closeError = this.closeError.bind(this);
    }

    onInput (event) {
        this.props.setProjectName(event.target.value);
    }

    onLoad () {
        const input = document.createElement('input');
        input.type = 'file';
        input.addEventListener('change', event => {
            const files = event.target.files;
            if (files.length > 0) {
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                    try {
                        const result = JSON.parse(reader.result);
                        const errors = validate(result);
                        if (errors.length > 0) throw new Error('Invalid JSON');
                        this.props.loadState(result);
                    } catch (error) {
                        this.setState({error});
                    }
                });
                reader.readAsText(files[0]);
            }
        });
        input.click();
    }

    onSave () {
        const {version, projectName, convos, chars} = this.props;
        saveToFile(`${projectName}.json`, saveState({version, projectName, convos, chars}));
    }

    closeError () {
        this.setState({error: null});
    }

    render () {
        return (
            <div className={style['project-bar']}>
                <input
                    className={style['project-name']}
                    type="text"
                    value={this.props.projectName}
                    onInput={this.onInput}
                />
                <div
                    className={classNames(style['button'], icons['icon'], icons['icon-button'], icons['save'])}
                    title="Save"
                    onClick={this.onSave}
                />
                <div
                    className={classNames(style['button'], icons['icon'], icons['icon-button'], icons['load'])}
                    title="Load"
                    onClick={this.onLoad}
                />
                {this.state.error ?
                    <div className={style['error']}>
                        <span className={style['error-message']}>{this.state.error.message}</span>
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

export default connect(['version', 'projectName', 'convos', 'chars'], {loadState, setProjectName})(ProjectBar);
