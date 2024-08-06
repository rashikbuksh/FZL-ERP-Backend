import { text } from 'drizzle-orm/pg-core';

export const defaultUUID = (column = 'uuid') =>
	text(column, {
		length: 15,
	});

export const uuid_primary = defaultUUID().primaryKey();
