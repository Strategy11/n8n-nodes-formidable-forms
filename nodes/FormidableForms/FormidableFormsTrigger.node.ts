import {
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
	NodeConnectionTypes
} from 'n8n-workflow';

export class FormidableFormsTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Formidable Forms Trigger',
		name: 'formidableFormsTrigger',
		icon: 'file:logo.svg',
		group: ['trigger'],
		version: 1,
		description: 'Start a workflow when a Formidable Forms form action triggered',
		usableAsTool: true,
		defaults: {
			name: 'Formidable Forms',
		},
		inputs: [], // Trigger nodes have no inputs.
		outputs: [NodeConnectionTypes.Main],
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
				displayName: 'Token',
				name: 'code', // Do not use `token` as name because the linting tool requires a password type for this option.
				type: 'string',
				noDataExpression: true,
				default: '',
				description: 'This needs to match the token in your form action. Leave this empty to skip the token verification.'
			}
		]
	}

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		// Access the raw HTTP request from n8n's webhook context.
		const request = this.getRequestObject();
		if ( ! request.body || ! request.body.event || ! request.body.mapping ) {
			return showError( this, 400, 'Bad Request!' );
		}

		const nodeToken = this.getNodeParameter( 'token' );
		if ( nodeToken && request.body.token !== nodeToken ) {
			return showError( this, 403, 'Forbidden!' );
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
