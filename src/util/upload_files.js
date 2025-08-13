import {
	insertFile as originalInsertFile,
	deleteFile as originalDeleteFile,
	updateFile as originalUpdateFile,
} from 'local-file-upload';

export async function insertFile(file, folderName) {
	return originalInsertFile(file, folderName);
}

export async function deleteFile(filePath) {
	return originalDeleteFile(filePath);
}

export async function updateFile(file, oldFilePath, folderName) {
	return originalUpdateFile(file, oldFilePath, folderName);
}
