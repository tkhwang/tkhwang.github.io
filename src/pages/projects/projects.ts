import { getRepositoryDetails } from '../../utils';

export interface Project {
	name: string;
	demoLink: string;
	tags?: string[];
	description?: string;
	postLink?: string;
	demoLinkRel?: string;
	[key: string]: any;
}

export const projects: Project[] = [
	{
		name: 'tkCaptureBook',
		description: '(ING) A mobile app for capturing and sharing moments with your friends',
		demoLink: 'https://github.com/tkhwang/tkCapture',
		tags: ['Mobile app']
	}
];
