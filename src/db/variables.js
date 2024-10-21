import { asc, desc, eq, like, sql } from 'drizzle-orm';
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

export const decimalToNumber = (column) => {
	return sql`${column}::float8`;
};

export function constructSelectAllQuery(
	baseQuery,
	params,
	defaultSortField = 'created_at'
) {
	let { q, _page, _sort, _order } = params;

	const tableName = baseQuery.config.table[Symbol.for('drizzle:Name')];

	console.log(tableName);

	// Apply search filter
	if (q) {
		baseQuery = baseQuery.where(
			like(baseQuery.config.table.name, `%${q}%`)
		);
	}

	// Apply sorting
	if (_sort) {
		const order = _order === 'asc' ? asc : desc;
		baseQuery = baseQuery.orderBy(order(baseQuery.config.table[_sort]));
	} else {
		baseQuery = baseQuery.orderBy(
			desc(baseQuery.config.table[defaultSortField])
		); // Default sorting
	}

	// Apply pagination
	if (_page) {
		const limit = 10; // Set your desired limit per page
		const offset = (_page - 1) * limit;
		baseQuery = baseQuery.limit(limit).offset(offset);
	}

	return baseQuery;
}
