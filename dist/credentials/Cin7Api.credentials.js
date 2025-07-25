"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cin7Api = void 0;
class Cin7Api {
    constructor() {
        this.name = 'cin7Api';
        this.displayName = 'Cin7 API';
        this.documentationUrl = 'https://dearinventory.docs.apiary.io/';
        this.properties = [
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
}
exports.Cin7Api = Cin7Api;
//# sourceMappingURL=Cin7Api.credentials.js.map