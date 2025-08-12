import { Buffer } from 'node:buffer';
import * as fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import nanoid from '../lib/nanoid.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function insertFile(file, folderName) {
	const buffer = file.buffer;

	const targetYear = new Date().getFullYear();

	// Use file.originalname instead of file.name
	const upload_path = `/uploads/${targetYear}/${folderName}/${nanoid()}.${file.originalname.split('.').pop()}`;
	const fullUploadPath = path.join(__dirname, '../../', upload_path);

	// Ensure the directory exists
	fs.mkdirSync(path.dirname(fullUploadPath), { recursive: true });

	fs.writeFileSync(fullUploadPath, buffer);

	return upload_path;
}

export async function deleteFile(filePath) {
	// delete the file
	const fullFilePath = path.join(__dirname, '../../', filePath);
	fs.unlinkSync(fullFilePath);
}

export async function updateFile(file, oldFilePath, folderName) {
	// delete the old file
	deleteFile(oldFilePath);

	// upload the new file
	return insertFile(file, folderName);
}
