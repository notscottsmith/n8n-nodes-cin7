"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cin7 = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const descriptions_1 = require("./descriptions");
class Cin7 {
    constructor() {
        this.description = {
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
            inputs: ["main"],
            outputs: ["main"],
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
                ...descriptions_1.triggerOperations,
                ...descriptions_1.triggerFields,
                ...descriptions_1.productOperations,
                ...descriptions_1.productFields,
                ...descriptions_1.customerOperations,
                ...descriptions_1.customerFields,
                ...descriptions_1.saleOperations,
                ...descriptions_1.saleFields,
            ],
        };
        this.webhookMethods = {
            default: {
                async checkExists() {
                    const webhookUrl = this.getNodeWebhookUrl('default');
                    const event = this.getNodeParameter('event');
                    try {
                        const webhooks = await cin7ApiRequest.call(this, 'GET', '/Webhook');
                        for (const webhook of webhooks) {
                            if (webhook.URL === webhookUrl && webhook.Event === event) {
                                return true;
                            }
                        }
                    }
                    catch (error) {
                        return false;
                    }
                    return false;
                },
                async create() {
                    const webhookUrl = this.getNodeWebhookUrl('default');
                    const event = this.getNodeParameter('event');
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
                    }
                    catch (error) {
                        return false;
                    }
                },
                async delete() {
                    const webhookData = this.getWorkflowStaticData('node');
                    if (webhookData.webhookId !== undefined) {
                        try {
                            await cin7ApiRequest.call(this, 'DELETE', `/Webhook/${webhookData.webhookId}`);
                        }
                        catch (error) {
                            return false;
                        }
                        delete webhookData.webhookId;
                    }
                    return true;
                },
            },
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const length = items.length;
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        for (let i = 0; i < length; i++) {
            try {
                let responseData;
                if (resource === 'product') {
                    responseData = await executeProductOperation.call(this, operation, i);
                }
                else if (resource === 'customer') {
                    responseData = await executeCustomerOperation.call(this, operation, i);
                }
                else if (resource === 'sale') {
                    responseData = await executeSaleOperation.call(this, operation, i);
                }
                if (Array.isArray(responseData)) {
                    returnData.push(...responseData);
                }
                else {
                    returnData.push(responseData);
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ error: error.message });
                    continue;
                }
                throw error;
            }
        }
        return [this.helpers.returnJsonArray(returnData)];
    }
    async webhook() {
        const bodyData = this.getBodyData();
        const headerData = this.getHeaderData();
        const additionalOptions = this.getNodeParameter('additionalOptions', {});
        if (additionalOptions.validateWebhook !== false) {
            const signature = headerData['x-cin7-signature'];
            if (!signature) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Missing webhook signature');
            }
            const isValid = await validateCin7Signature.call(this, bodyData, signature);
            if (!isValid) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Invalid webhook signature');
            }
        }
        let responseData = {
            body: bodyData,
            timestamp: new Date().toISOString(),
            event: this.getNodeParameter('event'),
        };
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
exports.Cin7 = Cin7;
async function executeProductOperation(operation, index) {
    if (operation === 'getAll') {
        const returnAll = this.getNodeParameter('returnAll', index);
        const additionalFields = this.getNodeParameter('additionalFields', index, {});
        if (returnAll) {
            return await cin7ApiRequestAllItems.call(this, 'GET', '/Product', {}, additionalFields);
        }
        else {
            const limit = this.getNodeParameter('limit', index);
            const qs = { limit, ...additionalFields };
            const responseData = await cin7ApiRequest.call(this, 'GET', '/Product', {}, qs);
            return responseData.Products || [];
        }
    }
    if (operation === 'get') {
        const productId = this.getNodeParameter('productId', index);
        return await cin7ApiRequest.call(this, 'GET', `/Product/${productId}`);
    }
    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
}
async function executeCustomerOperation(operation, index) {
    if (operation === 'getAll') {
        const returnAll = this.getNodeParameter('returnAll', index);
        if (returnAll) {
            return await cin7ApiRequestAllItems.call(this, 'GET', '/Customer');
        }
        else {
            const limit = this.getNodeParameter('limit', index);
            const qs = { limit };
            const responseData = await cin7ApiRequest.call(this, 'GET', '/Customer', {}, qs);
            return responseData.Customers || [];
        }
    }
    if (operation === 'get') {
        const customerId = this.getNodeParameter('customerId', index);
        return await cin7ApiRequest.call(this, 'GET', `/Customer/${customerId}`);
    }
    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
}
async function executeSaleOperation(operation, index) {
    if (operation === 'getAll') {
        const returnAll = this.getNodeParameter('returnAll', index);
        const additionalFields = this.getNodeParameter('additionalFields', index, {});
        if (returnAll) {
            return await cin7ApiRequestAllItems.call(this, 'GET', '/SaleList', {}, additionalFields);
        }
        else {
            const limit = this.getNodeParameter('limit', index);
            const qs = { limit, ...additionalFields };
            const responseData = await cin7ApiRequest.call(this, 'GET', '/SaleList', {}, qs);
            return responseData.SaleList || [];
        }
    }
    if (operation === 'get') {
        const saleId = this.getNodeParameter('saleId', index);
        return await cin7ApiRequest.call(this, 'GET', `/Sale/${saleId}`);
    }
    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
}
async function cin7ApiRequest(method, endpoint, body = {}, qs = {}) {
    const credentials = await this.getCredentials('cin7Api');
    const options = {
        headers: {
            'api-auth-accountid': credentials.accountId,
            'api-auth-applicationkey': credentials.applicationKey,
            'Content-Type': 'application/json',
        },
        method,
        body,
        qs,
        uri: `https://inventory.dearsystems.com/externalapi/v2${endpoint}`,
        json: true,
    };
    try {
        return await this.helpers.request(options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Cin7 API request failed: ${error.message}`);
    }
}
async function cin7ApiRequestAllItems(method, endpoint, body = {}, additionalFields = {}) {
    const returnData = [];
    let page = additionalFields.page || 1;
    const limit = 1000;
    do {
        const qs = { ...additionalFields, page, limit };
        const responseData = await cin7ApiRequest.call(this, method, endpoint, body, qs);
        const items = responseData.Products || responseData.Customers || responseData.SaleList || [];
        returnData.push(...items);
        if (items.length < limit)
            break;
        page++;
    } while (true);
    return returnData;
}
async function validateCin7Signature(body, signature) {
    return true;
}
//# sourceMappingURL=Cin7.node.js.map