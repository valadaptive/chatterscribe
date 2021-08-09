import style from './style.scss';

const Modal = ({onClose, children}) => (
    <>
        <div className={style['modal-bg']} onClick={onClose} />
        <div className={style['modal-positioner']}>
            <div className={style['modal']}>{children}</div>
        </div>
    </>
);

export default Modal;
