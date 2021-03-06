import request from 'supertest';
import { app } from '../../../app';
import {
	createMessage,
	genericMessage
} from '../../../responses/responseStrings';
import { createTestProject, createTestUser } from '../../../test/setup';
import { Task } from '../../../models/Task';

describe('Create Task Controller', () => {
	it('creates new task in db', async () => {
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const { projectId } = await createTestProject({
			title: 'test',
			description: 'description',
			pinned: false,
			userId: userId
		});

		const task = {
			title: 'test title',
			description: 'test description',
			projectId: projectId,
			tags: [ '#tag1', '#tag2' ]
		};

		const response = await request(app)
			.post(`/api/tasks/${userId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(task)
			.expect(201);

		expect(response.body.success).toBe(true);
		expect(response.body.message).toEqual(createMessage.success.task);

		const taskTest = await Task.find({ title: task.title });
		expect(taskTest.title).toEqual(task.title);
		expect(taskTest.description).toEqual(task.description);
		expect(taskTest.projectId).toEqual(task.projectId);
	});

	it('throws error if no title', async () => {
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const { projectId } = await createTestProject({
			title: 'test',
			description: 'description',
			pinned: false,
			userId: userId
		});

		const task = {
			title: '',
			description: 'test description',
			projectId: projectId,
			tags: [ '#tag1', '#tag2' ]
		};

		const response = await request(app)
			.post(`/api/tasks/${userId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(task)
			.expect(400);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			createMessage.error.title
		);

		const taskTest = await Task.find({ title: task.title });
		expect(taskTest).toBe(undefined);
	});

	it('throws error if no projectId', async () => {
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const task = {
			title: 'test',
			description: 'test',
			projectId: null,
			tags: [ '#tag1', '#tag2' ]
		};

		const response = await request(app)
			.post(`/api/tasks/${userId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(task)
			.expect(400);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			createMessage.error.project
		);

		const taskTest = await Task.find({ title: task.title });
		expect(taskTest).toBe(undefined);
	});

	it('throws error if not logged in', async () => {
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const { projectId } = await createTestProject({
			title: 'test',
			description: 'description',
			pinned: false,
			userId: userId
		});

		const task = {
			title: 'test',
			description: 'test',
			projectId: projectId,
			tags: [ '#tag1', '#tag2' ]
		};

		const response = await request(app)
			.post(`/api/tasks/${userId}`)
			.send(task)
			.expect(401);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notAuthenticated
		);

		const taskTest = await Task.find({ title: task.title });
		expect(taskTest).toBe(undefined);
	});

	it('throws error if not authorized', async () => {
		const { userId } = await createTestUser('test@gmail.com', '111111');
		const { token: token2 } = await createTestUser(
			'test2@gmail.com',
			'111111'
		);
		const { projectId } = await createTestProject({
			title: 'test',
			description: 'description',
			pinned: false,
			userId: userId
		});

		const task = {
			title: 'test',
			description: 'test',
			projectId: projectId,
			tags: [ '#tag1', '#tag2' ]
		};

		const response = await request(app)
			.post(`/api/tasks/${userId}`)
			.set('Authorization', `Bearer ${token2}`)
			.send(task)
			.expect(403);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notAuthorized
		);

		const taskTest = await Task.find({ title: task.title });
		expect(taskTest).toBe(undefined);
	});
});
