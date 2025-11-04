import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class FormidableForms implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Formidable Forms',
		name: 'formidableForms',
		icon: 'file:logo.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Start a workflow when a Formidable Forms form action triggered',
		defaults: {
			name: 'Formidable Forms',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'FormidableFormsApi',
				required: true,
			}
		],
		requestDefaults: {
			baseURL: 'https://api.formidableforms.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		},
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
}
