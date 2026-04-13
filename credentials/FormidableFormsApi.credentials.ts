import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class FormidableFormsApi implements ICredentialType {
	name = 'formidableFormsApi';
	displayName = 'Formidable Forms API';
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
