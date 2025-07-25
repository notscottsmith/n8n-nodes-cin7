import { INodeProperties } from 'n8n-workflow';

export const productOperations: INodeProperties[] = [
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
                description: 'Get a product by ID',
                action: 'Get a product',
            },
            {
                name: 'Get Availability',
                value: 'getAvailability',
                description: 'Get product availability information',
                action: 'Get product availability',
            },
            {
                name: 'Create',
                value: 'create',
                description: 'Create a new product',
                action: 'Create a product',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update an existing product',
                action: 'Update a product',
            },
        ],
        default: 'getAll',
    },
];

export const productFields: INodeProperties[] = [
    // Get operation fields
    {
        displayName: 'Product ID',
        name: 'productId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['get', 'update'],
            },
        },
        default: '',
        description: 'The ID of the product',
    },

    // Get All operation fields
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['getAll', 'getAvailability'],
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
                operation: ['getAll', 'getAvailability'],
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

    // Additional fields for filtering
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['getAll', 'getAvailability'],
            },
        },
        options: [
            {
                displayName: 'Modified Since',
                name: 'modifiedSince',
                type: 'dateTime',
                default: '',
                description: 'Return only products modified since this date',
            },
            {
                displayName: 'Include Discontinued',
                name: 'includeDiscontinued',
                type: 'boolean',
                default: false,
                description: 'Whether to include discontinued products',
            },
            {
                displayName: 'SKU',
                name: 'sku',
                type: 'string',
                default: '',
                description: 'Filter by SKU',
            },
        ],
    },

    // Create/Update operation fields
    {
        displayName: 'Product Data',
        name: 'productData',
        type: 'json',
        required: true,
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['create', 'update'],
            },
        },
        default: '{\n  "Name": "",\n  "SKU": "",\n  "Type": "Stock",\n  "UOM": "Each"\n}',
        description: 'Product data as JSON object',
    },
];