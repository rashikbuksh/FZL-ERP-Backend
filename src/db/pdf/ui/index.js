export const DEFAULT_FONT_SIZE = 9;
export const xMargin = 30;
export const yMargin = 40;
export const A4_PAGE_WIDTH = 565;

export const PRIMARY_COLOR = '#27374D';

// default style for all headers
export const defaultStyle = {
	fontSize: DEFAULT_FONT_SIZE,
};

// Styles
export const styles = {
	tableHeader: {
		fillColor: '#ced4da',
		color: '#000',
	},
	tableFooter: {
		margin: [0, 2],
		fillColor: '#c5c3c6',
		color: '#000',
	},
};

export const TitleAndValue = (title, value) => [
	{
		text: `${title}: `,
		bold: true,
	},
	{
		text: `${value || '-'}\n`,
	},
];

export const tableLayoutStyle = {
	fillColor: (rowIndex, node, columnIndex) => {
		if (rowIndex === 0) return null;

		return rowIndex % 2 === 0 ? '#d1d5db' : null;
	},
	fillOpacity: 0.5,
	hLineWidth: (i) => (i === 0 ? 0 : 1),
	vLineWidth: () => 0,
	hLineColor: (i) => (i === 1 ? PRIMARY_COLOR : '#d1d5db'),
};
