import {validate, ValidationError} from 'jtd';

const schema = {
    properties: {
        version: {type: 'uint32'},
        projectName: {type: 'string'},
        convos: {elements: {properties: {
            messages: {elements: {properties: {
                authorID: {type: 'string'},
                contents: {type: 'string'},
                id: {type: 'string'}
            }}},
            id: {type: 'string'},
            name: {type: 'string'}
        }}},
        chars: {elements: {properties: {
            id: {type: 'string'},
            name: {type: 'string'},
            color: {type: 'uint32'}
        }}}
    }
} as const;

export default (json: unknown): ValidationError[] => validate(schema, json);
