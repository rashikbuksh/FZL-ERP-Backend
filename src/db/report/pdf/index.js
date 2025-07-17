import pdfMake from 'pdfmake/build/pdfmake.js';

import { vfs } from './vfs_fonts.js';

pdfMake.vfs = vfs;

pdfMake.fonts = {
	Roboto: {
		normal: 'Roboto-Regular.ttf',
		bold: 'Roboto-Bold.ttf',
		italics: 'Roboto-Italic.ttf',
		bolditalics: 'Roboto-BoldItalic.ttf',
	},
};

export default pdfMake;
