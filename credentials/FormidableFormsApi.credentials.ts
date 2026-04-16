import {
	Icon,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class FormidableFormsApi implements ICredentialType {
	name = 'formidableFormsApi';
	displayName = 'Formidable Forms API';
	documentationUrl = 'https://formidableforms.com/knowledgebase/n8n/';
	icon: Icon = 'file:../nodes/FormidableForms/logo.svg';
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
