import id from './id';
import type {Convo} from './datatypes';

export default (): Convo => ({
    messages: [],
    id: id(),
    name: 'New Convo'
});
