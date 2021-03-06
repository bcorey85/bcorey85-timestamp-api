import request from 'supertest';
import { app } from '../../../app';
import { createTestUser } from '../../../test/setup';
import { User } from '../../../models/User';
import {
	userMessage,
	requestValidationMessage
} from '../../../responses/responseStrings';

describe('Update User Controller', () => {
	it('updates user email', async () => {
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const response = await request(app)
			.put(`/api/users/${userId}`)
			.send({ email: 'test1@gmail.com' })
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(response.body.success).toBe(true);
		expect(response.body.message).toBe(userMessage.success.updateUser);
		expect(response.body.data).toStrictEqual({});

		const user = await User.find({ user_id: userId });

		expect(user.email).toBe('test1@gmail.com');
	});

	it('updates user password', async () => {
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const response = await request(app)
			.put(`/api/users/${userId}`)
			.send({ password: '222222', passwordConfirm: '222222' })
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(response.body.success).toBe(true);
		expect(response.body.message).toBe(userMessage.success.updateUser);
		expect(response.body.data).toStrictEqual({});

		const user = await User.find({ user_id: userId });

		const passwordMatch = await User.comparePassword(user, '222222');
		expect(passwordMatch).toBe(true);
	});

	it('throws error if password invalid ', async () => {
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const response = await request(app)
			.put(`/api/users/${userId}`)
			.send({ password: '', passwordConfirm: '' })
			.set('Authorization', `Bearer ${token}`)
			.expect(400);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toBe(
			requestValidationMessage.error.password
		);

		const user = await User.find({ user_id: userId });

		const passwordMatch = await User.comparePassword(user, '');
		expect(passwordMatch).toBe(false);
	});

	it('throws error if password not match', async () => {
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const response = await request(app)
			.put(`/api/users/${userId}`)
			.send({ password: '222222', passwordConfirm: '333333' })
			.set('Authorization', `Bearer ${token}`)
			.expect(400);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toBe(
			requestValidationMessage.error.passwordNotMatch
		);

		const user = await User.find({ user_id: userId });

		const passwordMatch = await User.comparePassword(user, '222222');
		expect(passwordMatch).toBe(false);
	});

	it('throws error if email invalid', async () => {
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const response = await request(app)
			.put(`/api/users/${userId}`)
			.send({ email: '' })
			.set('Authorization', `Bearer ${token}`)
			.expect(400);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toBe(
			requestValidationMessage.error.email
		);

		const user = await User.find({ user_id: userId });

		expect(user.email).toBe('test@gmail.com');
	});
});
