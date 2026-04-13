import {
	ICredentialTestFunctions,
	ICredentialsDecrypted,
	IDataObject,
	INodeCredentialTestResult,
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
		credentials: [
			{
				name: 'formidableFormsApi',
				required: false,
				displayOptions: {
					show: {},
				},
			},
		],
		webhooks: [
			{
				name: 'default',
				isWebhook: true,
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			}
		],
		properties: []
	}

	methods = {
		credentialTest: {
			async formidableFormsApiTest(
				this: ICredentialTestFunctions,
				credential: ICredentialsDecrypted,
			): Promise<INodeCredentialTestResult> {
				const token = ( credential.data as IDataObject ).token as string;
				if ( ! token ) {
					return {
						status: 'Error',
						message: 'Token is required',
					};
				}
				return {
					status: 'OK',
					message: 'Token is set. It will be verified when a webhook request is received.',
				};
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		// Access the raw HTTP request from n8n's webhook context.
		const request = this.getRequestObject();
		if ( ! request.body || ! request.body.event || ! request.body.mapping ) {
			throw new NodeOperationError( this.getNode(), 'Bad Request!', {
				description: 'Request body is missing required fields: event, mapping',
			} );
		}

		const credentials = await this.getCredentials( 'formidableFormsApi' );
		const nodeToken = credentials.token as string;
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
