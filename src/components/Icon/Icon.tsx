import style from './style.scss';

import type {JSX} from 'preact';
import classNames from 'classnames';

type IconType =
    | 'delete'
    | 'edit'
    | 'export'
    | 'insert-above'
    | 'load'
    | 'save';

const Icon = ({type, title, onClick, disabled}: {
    type: IconType,
    title: string,
    onClick?: (event: Event) => unknown,
    disabled?: boolean
}): JSX.Element => {
    return (
        <div
            className={classNames(
                style['icon'],
                {[style['icon-button']]: onClick},
                style[type])}
            title={title}
            onClick={disabled ? undefined : onClick}
        />
    );
};

export default Icon;
