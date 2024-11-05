import { asc, desc, eq, like, or, sql } from 'drizzle-orm';
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
	return sql`coalesce(${column},0)::float8`;
};

export function constructSelectAllQuery(
	baseQuery,
	params,
	defaultSortField = 'created_at',
	additionalSearchFields = []
) {
	let { q, page, limit, sort, orderby } = params;

	// Get search fields from table
	const searchFields = Object.keys(baseQuery.config.table).filter(
		(field) =>
			field !== 'uuid' &&
			field !== 'id' &&
			field !== 'created_at' &&
			field !== 'updated_at'
	);

	// Include additional search fields from joined tables
	const allSearchFields = [...searchFields, ...additionalSearchFields];

	// Apply search filter
	if (q) {
		const searchConditions = allSearchFields.map((field) =>
			like(sql`${field}`, `%${q}%`)
		);
		baseQuery = baseQuery.where(or(...searchConditions));
	}

	// Apply sorting
	if (sort) {
		const order = orderby === 'asc' ? asc : desc;
		baseQuery = baseQuery.orderBy(
			order(baseQuery.config.table[Symbol.for('drizzle:Columns')][sort])
		);
	} else {
		baseQuery = baseQuery.orderBy(
			desc(
				baseQuery.config.table[Symbol.for('drizzle:Columns')][
					defaultSortField
				]
			)
		); // Default sorting
	}

	// Apply pagination
	if (page) {
		const limitValue = limit || 10; // Set your desired limit per page
		const offset = (page - 1) * limitValue;
		baseQuery = baseQuery.limit(limitValue).offset(offset);
	}

	return baseQuery;
}
