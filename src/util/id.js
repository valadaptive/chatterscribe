const randomArr = new Uint32Array(1);

export default () => {
    crypto.getRandomValues(randomArr);
    return ('00000000' + randomArr[0].toString(16)).slice(-8);
};
