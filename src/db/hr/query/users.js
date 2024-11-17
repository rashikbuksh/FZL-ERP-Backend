// import { ComparePass, CreateToken } from "@/middleware/auth.js";
import { desc, eq } from 'drizzle-orm';
import {
	ComparePass,
	CreateToken,
	HashPass,
} from '../../../middleware/auth.js';
import { handleError, validateRequest } from '../../../util/index.js';
import db from '../../index.js';
import { department, designation, users } from '../schema.js';

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const hashPassword = await HashPass(req.body.pass);

	const userPromise = db
		.insert(users)
		.values({
			...req.body,
			pass: hashPassword,
		})
		.returning({ insertedName: users.name });

	try {
		const data = await userPromise;
		const toast = {
			status: 201,
			type: 'insert',
			message: `${data[0].insertedName} inserted`,
		};

		return res.status(201).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const userPromise = db
		.update(users)
		.set(req.body)
		.where(eq(users.uuid, req.params.uuid))
		.returning({ updatedName: users.name });

	try {
		const data = await userPromise;
		const toast = {
			status: 200,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};

		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const userPromise = db
		.delete(users)
		.where(eq(users.uuid, req.params.uuid))
		.returning({ deletedName: users.name });

	try {
		const data = await userPromise;
		const toast = {
			status: 200,
			type: 'delete',
			message: `${data[0].deletedName} deleted`,
		};

		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectAll(req, res, next) {
	const { status } = req.query;

	const resultPromise = db
		.select({
			uuid: users.uuid,
			name: users.name,
			email: users.email,
			designation_uuid: users.designation_uuid,
			designation: designation.designation,
			department_uuid: users.department_uuid,
			department: department.department,
			ext: users.ext,
			phone: users.phone,
			created_at: users.created_at,
			updated_at: users.updated_at,
			status: users.status,
			remarks: users.remarks,
		})
		.from(users)
		.leftJoin(designation, eq(users.designation_uuid, designation.uuid))
		.leftJoin(department, eq(users.department_uuid, department.uuid))
		.orderBy(desc(users.created_at));

	if (status == 'true') {
		resultPromise.where(eq(users.status, 1));
	} else if (status == 'false') {
		resultPromise.where(eq(users.status, 0));
	}

	try {
		const data = await resultPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'users',
		};

		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const userPromise = db
		.select({
			uuid: users.uuid,
			name: users.name,
			email: users.email,
			designation_uuid: users.designation_uuid,
			designation: designation.designation,
			department_uuid: users.department_uuid,
			department: department.department,
			ext: users.ext,
			phone: users.phone,
			created_at: users.created_at,
			updated_at: users.updated_at,
			status: users.status,
			remarks: users.remarks,
		})
		.from(users)
		.leftJoin(designation, eq(users.designation_uuid, designation.uuid))
		.leftJoin(department, eq(users.department_uuid, department.uuid))
		.where(eq(users.uuid, req.params.uuid));

	try {
		const data = await userPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'user',
		};

		return res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function loginUser(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const { email, pass } = req.body;

	const userPromise = db
		.select({
			uuid: users.uuid,
			name: users.name,
			email: users.email,
			pass: users.pass,
			can_access: users.can_access,
			designation_uuid: users.designation_uuid,
			department_uuid: users.department_uuid,
			ext: users.ext,
			phone: users.phone,
			created_at: users.created_at,
			updated_at: users.updated_at,
			status: users.status,
			remarks: users.remarks,
			designation: designation.designation,
			department: department.department,
		})
		.from(users)
		.leftJoin(designation, eq(users.designation_uuid, designation.uuid))
		.leftJoin(department, eq(users.department_uuid, department.uuid))
		.where(eq(users.email, email));

	const USER = await userPromise;

	if (USER[0].length === 0) {
		return next(new CustomError('User not found', 404));
	}

	if (USER[0].status == 0) {
		return res.status(200).json({
			status: 400,
			type: 'delete',
			message: 'User is not active',
		});
	}

	await ComparePass(pass, USER[0].pass).then((result) => {
		if (!result) {
			return res.status(200).json({
				status: 400,
				type: 'delete',
				message: 'Email/Password combination incorrect',
			});
		}

		const token = CreateToken(USER[0]);
		const { uuid, name, department, can_access } = USER[0];
		if (!token.success) {
			return res.status(500).json({ error: 'Error signing token' });
		}

		return res.status(200).json({
			status: 201,
			type: 'create',
			message: 'User logged in',
			token: token.token,
			user: { uuid, name, department },
			can_access,
		});
	});
}

export async function selectUsersAccessPages(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const userPromise = db
		.select({
			can_access: users.can_access,
		})
		.from(users)
		.where(eq(users.uuid, req.params.uuid));

	try {
		const data = await userPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'User access pages',
		};

		return res.status(200).json({ toast, data: data[0] });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function selectCommonUsers(req, res, next) {
	const userPromise = db
		.select({
			uuid: users.uuid,
			name: users.name,
			email: users.email,
			designation_uuid: users.designation_uuid,
			designation: designation.designation,
			ext: users.ext,
			phone: users.phone,
		})
		.from(users)
		.leftJoin(designation, eq(users.designation_uuid, designation.uuid));

	try {
		const data = await userPromise;
		const toast = {
			status: 200,
			type: 'select',
			message: 'Common users',
		};

		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function changeUserAccess(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const userPromise = db
		.update(users)
		.set({ can_access: req.body.can_access })
		.where(eq(users.uuid, req.params.uuid))
		.returning({ updatedName: users.name });

	try {
		const data = await userPromise;
		const toast = {
			status: 200,
			type: 'update',
			message: `${data[0].updatedName} updated`,
		};

		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}

export async function changeUserStatus(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const userPromise = db
		.update(users)
		.set({ status: req.body.status, updated_at: req.body.updated_at })
		.where(eq(users.uuid, req.params.uuid))
		.returning({ updatedName: users.name });

	try {
		const data = await userPromise;
		const toast = {
			status: 200,
			type: 'update',
			message: `${data[0].updatedName} status updated`,
		};

		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
export async function changeUserPassword(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const hashPassword = await HashPass(req.body.pass);

	const userPromise = db
		.update(users)
		.set({ pass: hashPassword, updated_at: req.body.updated_at })
		.where(eq(users.uuid, req.params.uuid))
		.returning({ updatedName: users.name });

	try {
		const data = await userPromise;
		const toast = {
			status: 200,
			type: 'update',
			message: `${data[0].updatedName} password updated`,
		};

		return res.status(200).json({ toast, data });
	} catch (error) {
		await handleError({ error, res });
	}
}
