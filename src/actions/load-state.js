export default (state, json) => {
    return {
        projectName: json.projectName,
        convos: json.convos,
        chars: json.chars
    };
};
