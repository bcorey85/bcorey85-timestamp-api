import { db } from '../db';

export interface ProjectModel {
	projectId: number;
	userId: number;
	title: string;
	description: string;
	pinned: boolean;
	notes: number;
	tasks: number;
	hours: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface NewProject {
	title: string;
	description: string;
	pinned: boolean;
	userId: string;
}

interface SearchCriteria {
	[key: string]: any;
}

interface Update {
	[key: string]: any;
}

const projectAliases = {
	projectId: 'project_id',
	userId: 'user_id',
	title: 'title',
	description: 'description',
	pinned: 'pinned',
	hours: 'hours',
	tasks: 'tasks',
	notes: 'notes',
	createdAt: 'created_at',
	updatedAt: 'updated_at'
};

class Project {
	static create = async ({
		title,
		description,
		pinned,
		userId
	}: NewProject): Promise<ProjectModel> => {
		const project = await db('projects')
			.insert({ title, description, pinned, user_id: userId })
			.returning('*');

		return {
			projectId: project[0].project_id,
			userId: project[0].user_id,
			title: project[0].title,
			description: project[0].description,
			pinned: project[0].pinned,
			hours: project[0].hours,
			tasks: project[0].tasks,
			notes: project[0].notes,
			createdAt: project[0].created_at,
			updatedAt: project[0].updated_at
		};
	};

	static find = async (
		searchCriteria: SearchCriteria
	): Promise<ProjectModel> => {
		const project = await db
			.select(projectAliases)
			.from('projects')
			.where(searchCriteria);

		return project[0];
	};

	static findAll = async (userId: string): Promise<ProjectModel[]> => {
		const projects = await db
			.select(projectAliases)
			.from('projects')
			.where({ user_id: userId });

		return projects;
	};

	static update = async (
		projectId: string | number,
		update: Update
	): Promise<ProjectModel> => {
		const project = await db('projects')
			.update(update)
			.where({ project_id: projectId })
			.returning('*');

		return {
			projectId: project[0].project_id,
			userId: project[0].user_id,
			title: project[0].title,
			description: project[0].description,
			pinned: project[0].pinned,
			hours: project[0].hours,
			tasks: project[0].tasks,
			notes: project[0].notes,
			createdAt: project[0].created_at,
			updatedAt: project[0].updated_at
		};
	};

	static delete = async (projectId: string) => {
		await db('projects').del().where({ project_id: projectId });
	};
}

export { Project };
