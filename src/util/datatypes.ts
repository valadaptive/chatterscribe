import type {ID} from './id';

type Convo = {
    messages: Message[],
    id: ID,
    name: string
};

type Character = {
    id: ID,
    name: string,
    color: number
};

type Message = {
    authorID: ID,
    contents: string,
    id: ID
};

export type {Convo, Character, ID, Message};
