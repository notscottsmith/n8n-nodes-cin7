"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerFields = exports.customerOperations = void 0;
exports.customerOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['customer'],
            },
        },
        options: [
            {
                name: 'Get All',
                value: 'getAll',
                description: 'Get all customers',
                action: 'Get all customers',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a customer',
                action: 'Get a customer',
            },
        ],
        default: 'getAll',
    },
];
exports.customerFields = [
    {
        displayName: 'Customer ID',
        name: 'customerId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['get'],
            },
        },
        default: '',
        description: 'The ID of the customer to retrieve',
    },
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['customer'],
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
                resource: ['customer'],
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
];
//# sourceMappingURL=CustomerDescription.js.map