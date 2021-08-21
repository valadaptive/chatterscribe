const randomArr = new Uint32Array(2);

export default () => {
    crypto.getRandomValues(randomArr);
    return ('0000000' + randomArr[0].toString(32)).slice(-7) + ('0000000' + randomArr[1].toString(32)).slice(-7);
};
