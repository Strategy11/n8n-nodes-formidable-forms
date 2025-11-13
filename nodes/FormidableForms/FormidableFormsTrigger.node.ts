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
		name: 'formidableFormsTrigger',
		icon: 'file:logo.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Start a workflow when a Formidable Forms form action triggered',
		usableAsTool: true,
		defaults: {
			name: 'Formidable Forms',
		},
		inputs: [],
		outputs: ['main'],
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
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Token',
						value: 'token'
					},
					{
						name: 'None',
						value: 'none'
					}
				],
				default: 'none'
			},
			{
				displayName: 'Token',
				name: 'token',
				type: 'string',
				typeOptions: {
					password: true,
				},
				noDataExpression: true,
				default: '',
				displayOptions: {
					show: {
						authentication: ['token'],
					}
				}
			}
		]
	}

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		// Access the raw HTTP request from n8n's webhook context.
		const request = this.getRequestObject();
		if ( ! request.body || ! request.body.token || request.body.token !== ( this.getNodeParameter( 'token' ) as string ) ) {
			return showError( this, 403, 'Forbidden!' );
		}

		if ( ! request.body.event || ! request.body.mapping ) {
			return showError( this, 400, 'Bad Request!' );
		}

		// Default: emit parsed JSON items for downstream nodes via helpers.
		const data = this.helpers.returnJsonArray( request.body as IDataObject[] );

		data[0].json.success = true;

		return {
			workflowData: [data],
		};
	}
}

const showError = ( node: IWebhookFunctions, code: number, message: string ) => {
	const response = node.getResponseObject();
	response.status( code ).send( message );
	return {
		noWebhookResponse: true,
		workflowData: [
			[
				{
					json: {
						success: false,
						message
					}
				}
			]
		]
	};
}
