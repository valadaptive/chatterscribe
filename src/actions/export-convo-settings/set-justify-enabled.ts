import type {StoreShape} from '../../util/store';

export default (state: StoreShape, enabled: boolean): Partial<StoreShape> => ({
    exportConvoSettings: {...state.exportConvoSettings, justifyEnabled: enabled}
});
