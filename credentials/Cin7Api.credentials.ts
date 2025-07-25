import {
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class Cin7Api implements ICredentialType {
    name = 'cin7Api';
    displayName = 'Cin7 API';
    documentationUrl = 'https://dearinventory.docs.apiary.io/';
    properties: INodeProperties[] = [
        {
            displayName: 'Account ID',
            name: 'accountId',
            type: 'string',
            default: '',
            required: true,
            description: 'Your Cin7 Account ID',
        },
        {
            displayName: 'Application Key',
            name: 'applicationKey',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            required: true,
            description: 'Your Cin7 Application Key',
        },
    ];
}
