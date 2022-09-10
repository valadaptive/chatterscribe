import style from './style.scss';

import {Component, createRef, RefObject, JSX} from 'preact';

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

type State = {
    query: string,
    maxHeight: number | null,
    y: number | null
};

class SearchableMenu<T extends readonly MenuItem[]> extends Component<Props<T>, State> {
    searchRef: RefObject<HTMLInputElement>;

    constructor (props: Props<T>) {
        super(props);

        this.state = {
            query: '',
            maxHeight: null,
            y: null
        };

        this.onInput = this.onInput.bind(this);
        this.onFocusOut = this.onFocusOut.bind(this);
        this.searchRef = createRef();
    }

    onInput (event: Event): void {
        this.setState({query: (event.target as HTMLInputElement).value});
    }

    onFocusOut (event: FocusEvent): void {
        if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as HTMLElement) &&
            this.props.onDismiss) {
            this.props.onDismiss();
        }
    }

    componentDidMount (): void {
        if (this.searchRef.current) this.searchRef.current.focus();
    }

    render (): JSX.Element {
        return (
            <div
                className={style['searchable-menu']}
                style={{
                    top: `${this.props.y}px`,
                    left: `${this.props.x}px`,
                    maxHeight: `calc(100vh - ${this.props.y}px)`
                }}
                // eslint-disable-next-line react/no-unknown-property
                onfocusout={this.onFocusOut}
                tabIndex={0}
            >
                <div className={style['search-bar']}>
                    <input type="text" onInput={this.onInput} ref={this.searchRef}/>
                </div>
                <div className={style['items']}>
                    {this.props.items.map(item => (
                        item.value.toLowerCase().indexOf(this.state.query) === -1 ?
                            null :
                            <div
                                className={style['item']}
                                key={item.id}
                                onClick={this.props.onClickItem ?
                                    this.props.onClickItem.bind(this, item.id) :
                                    undefined}
                            >
                                {item.value}
                            </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default SearchableMenu;
