import type {StoreShape} from '../../util/store';

export default (state: StoreShape, length: number): Partial<StoreShape> => ({
    exportConvoSettings: {...state.exportConvoSettings, wrapTextLength: length}
});
