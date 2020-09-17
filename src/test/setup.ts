import request from 'supertest';

import { db } from '../db';
import { Project, NewProject } from '../models/Project';
import { User } from '../models/User';
import { Task, NewTask } from '../models/Task';
import { Note, NewNote } from '../models/Note';

jest.mock('../util/sendEmail');

beforeAll(async () => {
	await db.migrate.latest();
});

beforeEach(async () => {
	jest.clearAllMocks();
	await db.migrate.latest();
});

afterEach(async () => {
	await db.migrate.rollback();
});

afterAll(async () => {
	await db.destroy();
});

export const createTestUser = async (email: string, password: string) => {
	const { user_id } = await User.create(email, password);
	const token = await User.generateAuthToken(user_id);

	return { email, password, user_id, token };
};

export const createTestProject = async ({
	title,
	description,
	userId,
	pinned
}: NewProject) => {
	const project = await Project.create({
		title,
		description,
		userId,
		pinned
	});

	return project;
};

export const createTestTask = async ({
	title,
	description,
	projectId,
	userId,
	pinned,
	tags
}: NewTask) => {
	const task = await Task.create({
		title,
		description,
		projectId,
		userId,
		pinned,
		tags
	});

	return task;
};

export const createTestNote = async ({
	title,
	description,
	projectId,
	taskId,
	userId,
	pinned,
	hours,
	startTime,
	endTime,
	tags
}: NewNote) => {
	const note = await Note.create({
		title,
		description,
		projectId,
		taskId,
		userId,
		pinned,
		hours,
		startTime,
		endTime,
		tags
	});

	return note;
};

export const testNoteBody = async (userId: string) => {
	const { project_id } = await createTestProject({
		title: 'test',
		description: 'test',
		userId: userId,
		pinned: false
	});

	const { task_id } = await createTestTask({
		title: 'test',
		description: 'test',
		userId: userId,
		projectId: project_id.toString(),
		pinned: false,
		tags: [ '#tag1', '#tag2' ]
	});

	return {
		title: 'test',
		description: 'test',
		projectId: project_id.toString(),
		taskId: task_id.toString(),
		userId: userId,
		pinned: false,
		hours: 1,
		startTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
		endTime: new Date(Date.now()).toISOString(),
		tags: [ '#tag1', '#tag2' ]
	};
};

export const testTaskBody = async (userId: string) => {
	const { project_id } = await createTestProject({
		title: 'test',
		description: 'test',
		userId: userId,
		pinned: false
	});

	return {
		title: 'test',
		description: 'test',
		projectId: project_id.toString(),
		userId: userId,
		pinned: false,
		tags: [ '#tag1', '#tag2' ]
	};
};
