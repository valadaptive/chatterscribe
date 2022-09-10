import style from './style.scss';
import icons from '../../icons/icons.scss';

import {Component, createRef, RefObject, JSX} from 'preact';
import classNames from 'classnames';

import createConvo from '../../actions/create-convo';
import deleteConvo from '../../actions/delete-convo';
import setConvoName from '../../actions/set-convo-name';
import setCurrentConvoIndex from '../../actions/set-current-convo-index';
import setEditedConvo from '../../actions/set-edited-convo-id';
import setExportedConvoID from '../../actions/set-exported-convo-id';

import {connect, InjectProps} from '../../util/store';
import type {ID} from '../../util/datatypes';

const connectedKeys = ['convos', 'currentConvoIndex', 'editedConvoID'] as const;
const connectedActions = {
    createConvo,
    setCurrentConvoIndex,
    setEditedConvo,
    setConvoName,
    deleteConvo,
    setExportedConvoID
};

type Props = InjectProps<{
    beforeMessage?: number
}, typeof connectedKeys, typeof connectedActions>;

class ConvoList extends Component<Props> {
    editedConvoRef: RefObject<HTMLInputElement>;

    constructor (props: Props) {
        super(props);

        this.onAddConvo = this.onAddConvo.bind(this);
        this.onEditConvo = this.onEditConvo.bind(this);
        this.onExportConvo = this.onExportConvo.bind(this);
        this.onConvoEditKeyPress = this.onConvoEditKeyPress.bind(this);
        this.onConvoEditBlur = this.onConvoEditBlur.bind(this);

        this.editedConvoRef = createRef();
    }

    onAddConvo (): void {
        this.props.createConvo();
        this.props.setEditedConvo();
    }

    onClickConvo (index: number): void {
        this.props.setCurrentConvoIndex(index);
    }

    onExportConvo (id: ID, event: Event): void {
        event.stopPropagation();
        this.props.setExportedConvoID(id);
    }

    onEditConvo (id: ID, event: Event): void {
        event.stopPropagation();
        this.props.setEditedConvo(id);
    }

    onDeleteConvo (index: number, event: Event): void {
        event.stopPropagation();
        this.props.deleteConvo(index);
    }

    onConvoEditKeyPress (event: KeyboardEvent): void {
        if (event.code === 'Enter') {
            this.props.setEditedConvo(null);
        }
    }

    onConvoEditBlur (): void {
        this.props.setEditedConvo(null);
    }

    updateConvoName (id: ID, event: Event): void {
        this.props.setConvoName(id, (event.target as HTMLInputElement).value);
    }

    componentDidUpdate (prevProps: Props): void {
        if (this.props.editedConvoID &&
            prevProps.editedConvoID !== this.props.editedConvoID &&
            this.editedConvoRef.current) {
            this.editedConvoRef.current.focus();
            this.editedConvoRef.current.select();
        }
    }

    render (): JSX.Element {
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

export default connect(connectedKeys, connectedActions)(ConvoList);
