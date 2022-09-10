import type {JSX, ComponentChildren} from 'preact';

import style from './style.scss';

const Modal = ({onClose, children}: {
    onClose: (event: Event) => void,
    children: ComponentChildren
}): JSX.Element => (
    <>
        <div className={style['modal-bg']} onClick={onClose} />
        <div className={style['modal-positioner']}>
            <div className={style['modal']}>{children}</div>
        </div>
    </>
);

export default Modal;
