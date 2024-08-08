import { body, param } from 'express-validator';

function validateField(field) {
	return body(field).notEmpty().isString().trim().escape();
}

export function validateNoteTitle() {
	return validateField('title');
}

export function validateNoteBody() {
	return validateField('body');
}

export function validateIdParam() {
	return param('id').toInt().isInt();
}

export function validateUuidParam() {
	return param('uuid').isString().isLength({ min: 15, max: 15 });
}
