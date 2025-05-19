import pdfMake from 'pdfmake/build/pdfmake';

const BASE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts';
const ROBOTO = BASE_URL + '/Roboto/Roboto-';

pdfMake.fonts = {
	Roboto: {
		normal: ROBOTO + 'Regular.ttf',
		bold: ROBOTO + 'Medium.ttf',
		italics: ROBOTO + 'Italic.ttf',
		bolditalics: ROBOTO + 'MediumItalic.ttf',
	},
};

export default pdfMake;
