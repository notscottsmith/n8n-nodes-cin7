"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productFields = exports.productOperations = void 0;
exports.productOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['product'],
            },
        },
        options: [
            {
                name: 'Get All',
                value: 'getAll',
                description: 'Get all products',
                action: 'Get all products',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a product',
                action: 'Get a product',
            },
        ],
        default: 'getAll',
    },
];
exports.productFields = [
    {
        displayName: 'Product ID',
        name: 'productId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['get'],
            },
        },
        default: '',
        description: 'The ID of the product to retrieve',
    },
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['product'],
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
                resource: ['product'],
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
                resource: ['product'],
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
                description: 'Return products modified since this date',
            },
            {
                displayName: 'Include Discontinued',
                name: 'includeDiscontinued',
                type: 'boolean',
                default: false,
                description: 'Whether to include discontinued products',
            },
        ],
    },
];
//# sourceMappingURL=ProductDescription.js.map