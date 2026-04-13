import {
	Icon,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

// eslint-disable-next-line @n8n/community-nodes/credential-test-required -- Webhook secret has no testable outbound API endpoint; token is verified at runtime when webhook is received
export class FormidableFormsApi implements ICredentialType {
	name = 'formidableFormsApi';
	displayName = 'Formidable Forms API';
	documentationUrl = 'https://formidableforms.com/knowledgebase/n8n/';
	icon: Icon = 'file:../nodes/FormidableForms/logo.svg';
	testedBy = 'formidableFormsTrigger';
	properties: INodeProperties[] = [
		{
			displayName: 'Token',
			name: 'token',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Token to verify incoming webhook requests from Formidable Forms. Must match the token configured in your form action.',
		},
	];
}
