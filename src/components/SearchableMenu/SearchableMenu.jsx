import style from './style.scss';

import {Component, createRef} from 'preact';

class SearchableMenu extends Component {
    constructor (props) {
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

    onInput (event) {
        this.setState({query: event.target.value});
    }

    onFocusOut (event) {
        if (!event.currentTarget.contains(event.relatedTarget) && this.props.onDismiss) {
            this.props.onDismiss();
        }
    }

    componentDidMount () {
        if (this.searchRef.current) this.searchRef.current.focus();
    }

    render () {
        return (
            <div
                className={style['searchable-menu']}
                style={{
                    top: `${this.props.y}px`,
                    left: `${this.props.x}px`,
                    maxHeight: `calc(100vh - ${this.props.y}px)`
                }}
                onfocusout={this.onFocusOut}
                tabIndex="0"
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
                                onClick={this.props.onClickItem ? this.props.onClickItem.bind(this, item.id) : null}
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
