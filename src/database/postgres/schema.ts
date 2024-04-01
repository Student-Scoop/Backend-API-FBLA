import {
	pgTable,
	serial,
	timestamp,
	varchar,
	boolean
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	userId: varchar('userId').unique().notNull(),
	email: varchar('email', { length: 64 }).unique().notNull(),
	name: varchar('name', { length: 256 }).notNull(),
	username: varchar('username', { length: 256 }).unique().notNull(),
	password: varchar('password').notNull(),
	verified: boolean('verified').default(false),
	emailIsVerified: boolean('emailIsVerified').default(false),
	avatar: varchar('avatar', { length: 128 }),
	followers: varchar('followers').array().notNull(),
	following: varchar('following').array().notNull(),
	schoolName: varchar('schoolName'),
	schoolLocation: varchar('schoolLocation'),
	graduationYear: varchar('graduationYear'),
	degree: varchar('degree', { length: 64 }),
	major: varchar('major', { length: 64 }),
	sports: varchar('sports'),
	clubs: varchar('clubs'),
	notificationId: varchar('notificationId'),
	createdAt: timestamp('createdAt').defaultNow(),
	updatedAt: timestamp('updatedAt').defaultNow()
});
