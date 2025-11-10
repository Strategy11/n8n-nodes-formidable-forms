import {
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData
} from 'n8n-workflow';

export class FormidableFormsTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Formidable Forms Trigger',
		name: 'formidableForms',
		icon: 'file:logo.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Start a workflow when a Formidable Forms form action triggered',
		defaults: {
			name: 'Formidable Forms',
		},
		inputs: [],
		outputs: ['main'],
		/*credentials: [
			{
				name: 'FormidableFormsApi',
				required: true,
			}
		],*/
		webhooks: [
			{
				name: 'default',
				isWebhook: true,
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			}
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Submitted values',
						value: 'values'
					},
					{
						name: 'Form',
						value: 'form'
					}
				],
				default: 'values'
			}
		]
	}

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		// Access the raw HTTP request from n8n's webhook context.
		const request = this.getRequestObject();
		const response = this.getResponseObject();
		if ( ! request.body ) {
			response.status( 403 ).send( 'Permission denied!' );
			return {
				noWebhookResponse: true,
				workflowData: [
					[
						{
							json: {
								success: false,
								message: 'Permission denied!'
							}
						}
					]
				]
			}
		}

		// Default: emit parsed JSON items for downstream nodes via helpers.
		const data = this.helpers.returnJsonArray(request.body as IDataObject[]);

		data[0].json.success = true;

		return {
			workflowData: [data],
		};
	}
}
