export default (color: number): string => '#' + ('000000' + color.toString(16)).slice(-6);
