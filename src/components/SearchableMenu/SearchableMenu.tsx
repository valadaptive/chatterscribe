import style from './style.scss';

import type {JSX} from 'preact';
import {useCallback, useMemo, useEffect, useRef, useState} from 'preact/hooks';

type MenuItem = {
    id: string,
    value: string
};

type Props<T extends readonly MenuItem[]> = {
    items: T
    x: number,
    y: number,
    onDismiss?: () => void,
    onClickItem?: (result: T[number]['id']) => void
};

const SearchableMenu = <T extends readonly MenuItem[]>({
    items,
    x,
    y,
    onDismiss,
    onClickItem
}: Props<T>): JSX.Element => {
    const [query, setQuery] = useState('');
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (searchRef.current) searchRef.current.focus();
    }, []);

    const onInput = useCallback((event: Event): void => {
        setQuery((event.target as HTMLInputElement).value);
    }, [setQuery]);

    const onFocusOut = useCallback((event: FocusEvent): void => {
        if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as HTMLElement) &&
            onDismiss) {
            onDismiss();
        }
    }, [onDismiss]);

    return useMemo(() => (
        <div
            className={style.searchableMenu}
            style={{
                top: `${y}px`,
                left: `${x}px`,
                maxHeight: `calc(100vh - ${y}px)`
            }}
            // eslint-disable-next-line react/no-unknown-property
            onfocusout={onFocusOut}
            tabIndex={0}
        >
            <div className={style.searchBar}>
                <input type="text" onInput={onInput} ref={searchRef}/>
            </div>
            <div className={style.items}>
                {items.map(item => (
                    item.value.toLowerCase().indexOf(query) === -1 ?
                        null :
                        <div
                            className={style.item}
                            key={item.id}
                            onClick={onClickItem ?
                                onClickItem.bind(this, item.id) :
                                undefined}
                        >
                            {item.value}
                        </div>
                ))}
            </div>
        </div>
    ), [items, x, y, query, onInput, onFocusOut]);
};

export default SearchableMenu;
