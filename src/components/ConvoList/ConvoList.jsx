import style from './style.scss';
import icons from '../../icons/icons.scss';

import {Component, createRef} from 'preact';
import {connect} from 'unistore/preact';
import classNames from 'classnames';

import createConvo from '../../actions/create-convo';
import deleteConvo from '../../actions/delete-convo';
import setConvoName from '../../actions/set-convo-name';
import setCurrentConvoIndex from '../../actions/set-current-convo-index';
import setEditedConvo from '../../actions/set-edited-convo-id';
import setExportedConvoID from '../../actions/set-exported-convo-id';

class ConvoList extends Component {
    constructor (props) {
        super(props);

        this.onAddConvo = this.onAddConvo.bind(this);
        this.onEditConvo = this.onEditConvo.bind(this);
        this.onExportConvo = this.onExportConvo.bind(this);
        this.onConvoEditKeyPress = this.onConvoEditKeyPress.bind(this);
        this.onConvoEditBlur = this.onConvoEditBlur.bind(this);

        this.editedConvoRef = createRef();
    }

    onAddConvo () {
        this.props.createConvo();
        this.props.setEditedConvo();
    }

    onClickConvo (index) {
        this.props.setCurrentConvoIndex(index);
    }

    onExportConvo (id, event) {
        event.stopPropagation();
        this.props.setExportedConvoID(id);
    }

    onEditConvo (id, event) {
        event.stopPropagation();
        this.props.setEditedConvo(id);
    }

    onDeleteConvo (index, event) {
        event.stopPropagation();
        this.props.deleteConvo(index);
    }

    onConvoEditKeyPress (event) {
        if (event.code === 'Enter') {
            this.props.setEditedConvo(null);
        }
    }

    onConvoEditBlur () {
        this.props.setEditedConvo(null);
    }

    updateConvoName (id, event) {
        this.props.setConvoName(id, event.target.value);
    }

    componentDidUpdate (prevProps) {
        if (this.props.editedConvoID &&
            prevProps.editedConvoID !== this.props.editedConvoID &&
            this.editedConvoRef.current) {
            this.editedConvoRef.current.focus();
            this.editedConvoRef.current.select();
        }
    }

    render () {
        const {convos, currentConvoIndex} = this.props;
        return (
            <div className={style['convo-list']}>
                <div className={style['convos']}>
                    {convos.map((convo, i) => (
                        <div
                            className={classNames(style['convo'], {[style['active']]: currentConvoIndex === i})}
                            key={convo.id}
                            onClick={this.onClickConvo.bind(this, i)}
                        >
                            <div className={style['convo-name']}>{this.props.editedConvoID === convo.id ?
                                <input
                                    type="text"
                                    value={convo.name}
                                    onInput={this.updateConvoName.bind(this, convo.id)}
                                    onKeyPress={this.onConvoEditKeyPress}
                                    onBlur={this.onConvoEditBlur}
                                    ref={this.editedConvoRef}
                                /> :
                                convo.name}</div>
                            <div
                                className={classNames(
                                    icons['icon'],
                                    icons['icon-button'],
                                    icons['export'])
                                }
                                onClick={this.onExportConvo.bind(this, convo.id)}
                            />
                            <div
                                className={classNames(
                                    icons['icon'],
                                    icons['icon-button'],
                                    icons['edit'])
                                }
                                onClick={this.onEditConvo.bind(this, convo.id)}
                            />
                            <div
                                className={classNames(
                                    icons['icon'],
                                    icons['icon-button'],
                                    icons['delete'])
                                }
                                onClick={this.onDeleteConvo.bind(this, i)}
                            />
                        </div>
                    ))}
                </div>
                <div className={style['add-convo-wrapper']}>
                    <button onClick={this.onAddConvo}>Add Convo</button>
                </div>
            </div>
        );
    }
}

export default connect(
    ['convos', 'currentConvoIndex', 'editedConvoID'],
    {createConvo, setCurrentConvoIndex, setEditedConvo, setConvoName, deleteConvo, setExportedConvoID}
)(ConvoList);
