import type {StoreShape} from '../../util/store';

export default (state: StoreShape, side: 'left' | 'right'): Partial<StoreShape> => ({
    exportConvoSettings: {...state.exportConvoSettings, justifySide: side}
});
