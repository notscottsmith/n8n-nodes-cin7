"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saleFields = exports.saleOperations = void 0;
exports.saleOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['sale'],
            },
        },
        options: [
            {
                name: 'Get All',
                value: 'getAll',
                description: 'Get all sales from SaleList endpoint',
                action: 'Get all sales',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a specific sale',
                action: 'Get a sale',
            },
        ],
        default: 'getAll',
    },
];
exports.saleFields = [
    {
        displayName: 'Sale ID',
        name: 'saleId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['sale'],
                operation: ['get'],
            },
        },
        default: '',
        description: 'The ID of the sale to retrieve',
    },
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['sale'],
                operation: ['getAll'],
            },
        },
        default: false,
        description: 'Whether to return all results or only up to a given limit',
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        displayOptions: {
            show: {
                resource: ['sale'],
                operation: ['getAll'],
                returnAll: [false],
            },
        },
        typeOptions: {
            minValue: 1,
            maxValue: 1000,
        },
        default: 100,
        description: 'Max number of results to return',
    },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['sale'],
                operation: ['getAll'],
            },
        },
        options: [
            {
                displayName: 'Page',
                name: 'page',
                type: 'number',
                default: 1,
                description: 'Page number for pagination',
            },
            {
                displayName: 'Modified Since',
                name: 'modifiedSince',
                type: 'dateTime',
                default: '',
                description: 'Return sales modified since this date',
            },
            {
                displayName: 'Status',
                name: 'status',
                type: 'options',
                options: [
                    {
                        name: 'All',
                        value: '',
                    },
                    {
                        name: 'Draft',
                        value: 'DRAFT',
                    },
                    {
                        name: 'Authorised',
                        value: 'AUTHORISED',
                    },
                    {
                        name: 'Fulfilled',
                        value: 'FULFILLED',
                    },
                    {
                        name: 'Voided',
                        value: 'VOIDED',
                    },
                ],
                default: '',
                description: 'Filter by sale status',
            },
        ],
    },
];
//# sourceMappingURL=SaleDescription.js.map