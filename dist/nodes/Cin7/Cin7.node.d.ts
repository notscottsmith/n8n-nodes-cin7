import { IExecuteFunctions, IHookFunctions, IWebhookFunctions, INodeExecutionData, INodeType, INodeTypeDescription, IWebhookResponseData } from 'n8n-workflow';
export declare class Cin7 implements INodeType {
    description: INodeTypeDescription;
    webhookMethods: {
        default: {
            checkExists(this: IHookFunctions): Promise<boolean>;
            create(this: IHookFunctions): Promise<boolean>;
            delete(this: IHookFunctions): Promise<boolean>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
    webhook(this: IWebhookFunctions): Promise<IWebhookResponseData>;
}
