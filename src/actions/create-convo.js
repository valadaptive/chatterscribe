import createConvo from '../util/create-convo';

export default state => ({
    convos: [...state.convos, createConvo()],
    currentConvoIndex: state.convos.length
});
