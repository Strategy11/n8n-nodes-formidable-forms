import {
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
	NodeConnectionTypes,
	NodeOperationError,
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
			throw new NodeOperationError( this.getNode(), 'Bad Request!', {
				description: 'Request body is missing required fields: event, mapping',
			} );
		}

		const nodeToken = this.getNodeParameter( 'code' );
		if ( nodeToken && request.body.token !== nodeToken ) {
			throw new NodeOperationError( this.getNode(), 'Forbidden!', {
				description: 'The token in the request does not match the token configured in the node',
			} );
		}

		// Default: emit parsed JSON items for downstream nodes via helpers.
		const data = this.helpers.returnJsonArray( request.body as IDataObject[] );

		data[0].json.success = true;

		return {
			workflowData: [data],
		};
	}
}
