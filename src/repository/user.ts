import database from '@/database/postgres';
import { users } from '@/database/postgres/schema';
import { InferInsertModel, InferSelectModel, eq, like, or } from 'drizzle-orm';

type InsertUser = InferInsertModel<typeof users>;

export default class UserRepo {
	static async createUser(
		userId: string,
		name: string,
		email: string,
		username: string,
		password: string
	) {
		const createdUser = await database
			.insert(users)
			.values({
				userId: userId,
				name: name,
				email: email,
				username: username,
				password: password,
				followers: [],
				following: []
			})
			.returning();

		if (!createdUser.length) return null;

		return createdUser[0];
	}

	static async searchUsers(query: string, amount: number) {
		const searchUsers = await database.select({
			userId: users.userId,
			username: users.username,
			avatar: users.avatar,
			name: users.name
		}).from(users).where(or(
			like(users.username, "%"+query+"%"),
			like(users.name, "%"+query+"%")
		)).limit(amount);

		if (!searchUsers) return null;

		return searchUsers;
	}

	static async updateUser(userId: string, data: Partial<InsertUser>) {
		const updatedUser = await database
			.update(users)
			.set(data)
			.where(eq(users.userId, userId))
			.returning();

		if (!updatedUser) return null;

		return updatedUser[0];
	}

	static async findUnqiueUser(key: string, value: string) {
		if (key !== 'username' && key !== 'email' && key !== 'userId')
			throw new Error(
				'findUniqueUser only uses username, email, and userId fields'
			);

		const user = await database
			.select()
			.from(users)
			.where(eq(users[key], value))
			.limit(1);

		console.log("User:", user)

		if (!user.length) return null;

		return user[0];
	}
}
