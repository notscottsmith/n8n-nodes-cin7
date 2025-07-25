import {
    IExecuteFunctions,
    IHookFunctions,
    IWebhookFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    IWebhookResponseData,
    NodeConnectionType,
    NodeOperationError,
    IDataObject,
    IHttpRequestMethods,
    IRequestOptions,
} from 'n8n-workflow';

import { 
    productOperations, 
    productFields,
    customerOperations,
    customerFields,
    saleOperations,
    saleFields,
    triggerOperations,
    triggerFields
} from './descriptions';

export class Cin7 implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Cin7',
        name: 'cin7',
        icon: 'file:cin7.svg',
        group: ['transform', 'trigger'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Consume Cin7 (DEAR Systems) API',
        defaults: {
            name: 'Cin7',
        },
        inputs: [NodeConnectionType.Main],
        outputs: [NodeConnectionType.Main],
        credentials: [
            {
                name: 'cin7Api',
                required: true,
            },
        ],
        webhooks: [
            {
                name: 'default',
                httpMethod: 'POST',
                responseMode: 'onReceived',
                path: 'webhook',
            },
        ],
        requestDefaults: {
            baseURL: 'https://inventory.dearsystems.com/externalapi/v2',
            headers: {
                'Content-Type': 'application/json',
            },
        },
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Trigger',
                        value: 'trigger',
                        description: 'Set up webhooks and triggers',
                    },
                    {
                        name: 'Product',
                        value: 'product',
                        description: 'Operations on products',
                    },
                    {
                        name: 'Customer',
                        value: 'customer',
                        description: 'Operations on customers',
                    },
                    {
                        name: 'Sale',
                        value: 'sale',
                        description: 'Operations on sales',
                    },
                ],
                default: 'product',
            },
            ...triggerOperations,
            ...triggerFields,
            ...productOperations,
            ...productFields,
            ...customerOperations,
            ...customerFields,
            ...saleOperations,
            ...saleFields,
        ],
    };

    // @ts-ignore (because of request)
    webhookMethods = {
        default: {
            async checkExists(this: IHookFunctions): Promise<boolean> {
                const webhookUrl = this.getNodeWebhookUrl('default');
                const event = this.getNodeParameter('event') as string;

                try {
                    const webhooks = await cin7ApiRequest.call(this, 'GET', '/Webhook');
                    
                    for (const webhook of webhooks) {
                        if (webhook.URL === webhookUrl && webhook.Event === event) {
                            return true;
                        }
                    }
                } catch (error) {
                    return false;
                }

                return false;
            },
            async create(this: IHookFunctions): Promise<boolean> {
                const webhookUrl = this.getNodeWebhookUrl('default');
                const event = this.getNodeParameter('event') as string;

                const body = {
                    URL: webhookUrl,
                    Event: event,
                    IsActive: true,
                };

                try {
                    const responseData = await cin7ApiRequest.call(this, 'POST', '/Webhook', body);

                    if (responseData.WebhookID === undefined) {
                        return false;
                    }

                    const webhookData = this.getWorkflowStaticData('node');
                    webhookData.webhookId = responseData.WebhookID;

                    return true;
                } catch (error) {
                    return false;
                }
            },
            async delete(this: IHookFunctions): Promise<boolean> {
                const webhookData = this.getWorkflowStaticData('node');

                if (webhookData.webhookId !== undefined) {
                    try {
                        await cin7ApiRequest.call(this, 'DELETE', `/Webhook/${webhookData.webhookId}`);
                    } catch (error) {
                        return false;
                    }

                    delete webhookData.webhookId;
                }

                return true;
            },
        },
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: IDataObject[] = [];
        const length = items.length;

        const resource = this.getNodeParameter('resource', 0) as string;
        const operation = this.getNodeParameter('operation', 0) as string;

        for (let i = 0; i < length; i++) {
            try {
                let responseData: any;

                if (resource === 'product') {
                    responseData = await executeProductOperation.call(this, operation, i);
                } else if (resource === 'customer') {
                    responseData = await executeCustomerOperation.call(this, operation, i);
                } else if (resource === 'sale') {
                    responseData = await executeSaleOperation.call(this, operation, i);
                }

                if (Array.isArray(responseData)) {
                    returnData.push(...responseData);
                } else {
                    returnData.push(responseData);
                }
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ error: error.message });
                    continue;
                }
                throw error;
            }
        }

        return [this.helpers.returnJsonArray(returnData)];
    }

    async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
        const bodyData = this.getBodyData();
        const headerData = this.getHeaderData();
        const additionalOptions = this.getNodeParameter('additionalOptions', {}) as IDataObject;

        // Validate webhook if option is enabled
        if (additionalOptions.validateWebhook !== false) {
            const signature = headerData['x-cin7-signature'] as string;
            if (!signature) {
                throw new NodeOperationError(this.getNode(), 'Missing webhook signature');
            }

            const isValid = await validateCin7Signature.call(this, bodyData, signature);
            if (!isValid) {
                throw new NodeOperationError(this.getNode(), 'Invalid webhook signature');
            }
        }

        let responseData: IDataObject = {
            body: bodyData,
            timestamp: new Date().toISOString(),
            event: this.getNodeParameter('event'),
        };

        // Include headers if requested
        if (additionalOptions.includeHeaders === true) {
            responseData.headers = headerData;
        }

        return {
            workflowData: [
                this.helpers.returnJsonArray([responseData]),
            ],
        };
    }
}

// Helper functions for each resource
async function executeProductOperation(this: IExecuteFunctions, operation: string, index: number): Promise<any> {
    if (operation === 'getAll') {
        const returnAll = this.getNodeParameter('returnAll', index) as boolean;
        const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

        if (returnAll) {
            return await cin7ApiRequestAllItems.call(this, 'GET', '/Product', {}, additionalFields);
        } else {
            const limit = this.getNodeParameter('limit', index) as number;
            const qs: IDataObject = { limit, ...additionalFields };
            const responseData = await cin7ApiRequest.call(this, 'GET', '/Product', {}, qs);
            return responseData.Products || [];
        }
    }

    if (operation === 'get') {
        const productId = this.getNodeParameter('productId', index) as string;
        return await cin7ApiRequest.call(this, 'GET', `/Product/${productId}`);
    }

    throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
}

async function executeCustomerOperation(this: IExecuteFunctions, operation: string, index: number): Promise<any> {
    if (operation === 'getAll') {
        const returnAll = this.getNodeParameter('returnAll', index) as boolean;

        if (returnAll) {
            return await cin7ApiRequestAllItems.call(this, 'GET', '/Customer');
        } else {
            const limit = this.getNodeParameter('limit', index) as number;
            const qs: IDataObject = { limit };
            const responseData = await cin7ApiRequest.call(this, 'GET', '/Customer', {}, qs);
            return responseData.Customers || [];
        }
    }

    if (operation === 'get') {
        const customerId = this.getNodeParameter('customerId', index) as string;
        return await cin7ApiRequest.call(this, 'GET', `/Customer/${customerId}`);
    }

    throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
}

async function executeSaleOperation(this: IExecuteFunctions, operation: string, index: number): Promise<any> {
    if (operation === 'getAll') {
        const returnAll = this.getNodeParameter('returnAll', index) as boolean;
        const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

        if (returnAll) {
            return await cin7ApiRequestAllItems.call(this, 'GET', '/SaleList', {}, additionalFields);
        } else {
            const limit = this.getNodeParameter('limit', index) as number;
            const qs: IDataObject = { limit, ...additionalFields };
            const responseData = await cin7ApiRequest.call(this, 'GET', '/SaleList', {}, qs);
            return responseData.SaleList || [];
        }
    }

    if (operation === 'get') {
        const saleId = this.getNodeParameter('saleId', index) as string;
        return await cin7ApiRequest.call(this, 'GET', `/Sale/${saleId}`);
    }

    throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
}

// API request functions
async function cin7ApiRequest(
    this: IExecuteFunctions | IHookFunctions | IWebhookFunctions,
    method: IHttpRequestMethods,
    endpoint: string,
    body: any = {},
    qs: IDataObject = {},
): Promise<any> {
    const credentials = await this.getCredentials('cin7Api');

    const options: IRequestOptions = {
        headers: {
            'api-auth-accountid': credentials.accountId as string,
            'api-auth-applicationkey': credentials.applicationKey as string,
            'Content-Type': 'application/json',
        },
        method,
        body,
        qs,
        uri: `https://inventory.dearsystems.com/externalapi/v2${endpoint}`,
        json: true,
    };

    try {
        return await this.helpers.request!(options);
    } catch (error) {
        throw new NodeOperationError(this.getNode(), `Cin7 API request failed: ${error.message}`);
    }
}

async function cin7ApiRequestAllItems(
    this: IExecuteFunctions,
    method: IHttpRequestMethods,
    endpoint: string,
    body: any = {},
    additionalFields: IDataObject = {},
): Promise<any> {
    const returnData: IDataObject[] = [];
    let page = (additionalFields.page as number) || 1;
    const limit = 1000;

    do {
        const qs = { ...additionalFields, page, limit };
        const responseData = await cin7ApiRequest.call(this, method, endpoint, body, qs);
        
        const items = responseData.Products || responseData.Customers || responseData.SaleList || [];
        returnData.push(...items);
        
        if (items.length < limit) break;
        page++;
    } while (true);

    return returnData;
}

async function validateCin7Signature(
    this: IWebhookFunctions,
    body: any,
    signature: string,
): Promise<boolean> {
    // Placeholder for signature validation
    return true;
}
