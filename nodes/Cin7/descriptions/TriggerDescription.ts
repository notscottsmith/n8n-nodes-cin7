import { INodeProperties } from 'n8n-workflow';

export const triggerOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['trigger'],
            },
        },
        options: [
            {
                name: 'Webhook',
                value: 'webhook',
                description: 'Set up webhook to receive real-time events',
                action: 'Set up webhook',
            },
        ],
        default: 'webhook',
    },
];

export const triggerFields: INodeProperties[] = [
    {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        displayOptions: {
            show: {
                resource: ['trigger'],
                operation: ['webhook'],
            },
        },
        options: [
            {
                name: 'Product Created',
                value: 'product.created',
                description: 'Triggers when a new product is created',
            },
            {
                name: 'Product Updated',
                value: 'product.updated',
                description: 'Triggers when a product is updated',
            },
            {
                name: 'Customer Created',
                value: 'customer.created',
                description: 'Triggers when a new customer is created',
            },
            {
                name: 'Customer Updated',
                value: 'customer.updated',
                description: 'Triggers when a customer is updated',
            },
            {
                name: 'Sale Order Created',
                value: 'sale.order.created',
                description: 'Triggers when a new sale order is created',
            },
            {
                name: 'Sale Order Updated',
                value: 'sale.order.updated',
                description: 'Triggers when a sale order is updated',
            },
        ],
        default: 'product.created',
        required: true,
    },
    {
        displayName: 'Additional Options',
        name: 'additionalOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
            show: {
                resource: ['trigger'],
                operation: ['webhook'],
            },
        },
        options: [
            {
                displayName: 'Include Headers',
                name: 'includeHeaders',
                type: 'boolean',
                default: false,
                description: 'Whether to include the webhook headers in the response',
            },
            {
                displayName: 'Validate Webhook',
                name: 'validateWebhook',
                type: 'boolean',
                default: true,
                description: 'Whether to validate the webhook signature',
            },
        ],
    },
];