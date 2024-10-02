import {
	decimal,
	integer,
	pgSchema,
	serial,
	text,
	timestamp,
	uuid,
} from 'drizzle-orm/pg-core';

export const defaultUUID = (column = 'uuid') =>
	text(column, {
		length: 15,
	});

export const uuid_primary = defaultUUID().primaryKey();

export const DateTime = (column) =>
	timestamp(column, {
		mode: 'string',
		withTimezone: false,
	});

export const PG_DECIMAL = (column) =>
	decimal(column, {
		precision: 20,
		scale: 4,
	}).notNull();

export class ColumnNumericTransformer {
	to(data) {
		return data;
	}
	from(data) {
		return parseFloat(data);
	}
}
