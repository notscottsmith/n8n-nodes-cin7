import { INodeProperties } from 'n8n-workflow';

export const saleOperations: INodeProperties[] = [
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
                description: 'Get all sales',
                action: 'Get all sales',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a sale by ID',
                action: 'Get a sale',
            },
            {
                name: 'Create',
                value: 'create',
                description: 'Create a new sale',
                action: 'Create a sale',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update an existing sale',
                action: 'Update a sale',
            },
            {
                name: 'Authorise',
                value: 'authorise',
                description: 'Authorise a sale',
                action: 'Authorise a sale',
            },
            {
                name: 'Void',
                value: 'void',
                description: 'Void a sale',
                action: 'Void a sale',
            },
        ],
        default: 'getAll',
    },
];

export const saleFields: INodeProperties[] = [
    {
        displayName: 'Sale ID',
        name: 'saleId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['sale'],
                operation: ['get', 'update', 'authorise', 'void'],
            },
        },
        default: '',
        description: 'The ID of the sale',
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
        default: 50,
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
                displayName: 'Modified Since',
                name: 'modifiedSince',
                type: 'dateTime',
                default: '',
                description: 'Return only sales modified since this date',
            },
            {
                displayName: 'Status',
                name: 'status',
                type: 'options',
                options: [
                    { name: 'Draft', value: 'Draft' },
                    { name: 'Authorised', value: 'Authorised' },
                    { name: 'Picked', value: 'Picked' },
                    { name: 'Packed', value: 'Packed' },
                    { name: 'Shipped', value: 'Shipped' },
                    { name: 'Invoiced', value: 'Invoiced' },
                    { name: 'Voided', value: 'Voided' },
                ],
                default: '',
                description: 'Filter by sale status',
            },
        ],
    },
    {
        displayName: 'Sale Data',
        name: 'saleData',
        type: 'json',
        required: true,
        displayOptions: {
            show: {
                resource: ['sale'],
                operation: ['create', 'update'],
            },
        },
        default: '{\n  "Customer": "",\n  "SaleOrderNumber": "",\n  "Status": "Draft"\n}',
        description: 'Sale data as JSON object',
    },
];