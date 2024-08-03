// import { ComparePass, CreateToken } from "@/middleware/auth.js";
import { eq } from "drizzle-orm";
import { ComparePass, CreateToken } from "../../../middleware/auth.js";
import { handleResponse, validateRequest } from "../../../util/index.js";
import db from "../../index.js";
import { department, designation, users } from "../schema.js";

export async function insert(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const userPromise = db.insert(users).values(req.body).returning();
	handleResponse(userPromise, res, next, 201);
}

export async function update(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const userPromise = db
		.update(users)
		.set(req.body)
		.where(eq(users.uuid, req.params.uuid))
		.returning();

	handleResponse(userPromise, res, next, 201);
}

export async function remove(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const userPromise = db
		.delete(users)
		.where(eq(users.uuid, req.params.uuid))
		.returning();
	handleResponse(userPromise, res, next);
}

export async function selectAll(req, res, next) {
	const resultPromise = db.select().from(users);
	handleResponse(resultPromise, res, next);
}

export async function select(req, res, next) {
	if (!(await validateRequest(req, next))) return;

	const userPromise = db
		.select()
		.from(users)
		.where(eq(users.uuid, req.params.uuid));
	handleResponse(userPromise, res, next);
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
		.leftJoin(department, eq(designation.department_uuid, department.uuid))
		.where(eq(users.email, email));

	const USER = await userPromise;

	console.log(USER[0], "USER");

	if (USER[0].length === 0) {
		return next(new CustomError("User not found", 404));
	}

	if (USER[0].status == 0) {
		return res.status(200).json({
			status: 400,
			type: "delete",
			message: "User is not active",
		});
	}

	await ComparePass(pass, USER[0].pass).then((result) => {
		if (!result) {
			return res.status(200).json({
				status: 400,
				type: "delete",
				message: "Email/Password combination incorrect",
			});
		}

		const token = CreateToken(USER[0]);
		const { uuid, name, department, can_access } = USER[0];
		if (!token.success) {
			return res.status(500).json({ error: "Error signing token" });
		}

		return res.status(200).json({
			status: 201,
			type: "create",
			message: "User logged in",
			token: token.token,
			user: { uuid, name, department },
			can_access,
		});

		// handleResponse(userPromise, res, next);
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

	handleResponse(userPromise, res, next);
}
