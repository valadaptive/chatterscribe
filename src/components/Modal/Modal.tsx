import type {JSX, ComponentChildren} from 'preact';

import style from './style.scss';

const Modal = ({onClose, children}: {
    onClose: (event: Event) => void,
    children: ComponentChildren
}): JSX.Element => (
    <>
        <div className={style.modalBg} onClick={onClose} />
        <div className={style.modalPositioner}>
            <div className={style.modal}>{children}</div>
        </div>
    </>
);

export default Modal;
