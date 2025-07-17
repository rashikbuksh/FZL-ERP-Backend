// import { FZL_LOGO } from '@/assets/img/base64';

import {
	DEFAULT_FONT_SIZE,
	defaultStyle,
	PRIMARY_COLOR,
	styles,
} from './ui.js';

// * PDF DEFAULTS
export const DEFAULT_A4_PAGE = ({ xMargin, headerHeight, footerHeight }) => ({
	pageSize: 'A4',
	pageOrientation: 'portrait',
	pageMargins: [xMargin, headerHeight, xMargin, footerHeight],
	defaultStyle,
	styles,
});
export const DEFAULT_LETTER_PAGE = ({
	xMargin,
	headerHeight,
	footerHeight,
}) => ({
	pageSize: 'LETTER',
	pageOrientation: 'portrait',
	pageMargins: [xMargin, headerHeight, xMargin, footerHeight],
	defaultStyle,
	styles,
});

export const CUSTOM_PAGE = ({
	pageOrientation = 'landscape',
	xMargin,
	width = 290, // Inch: 4.02778
	height = 141, // Inch: 2.04167
	headerHeight,
	footerHeight,
	leftMargin,
	rightMargin,
}) => {
	let left, right;
	if (leftMargin && rightMargin) {
		left = leftMargin;
		right = rightMargin;
	} else {
		left = xMargin;
		right = xMargin;
	}

	return {
		pageSize: { width, height },
		pageOrientation,
		pageMargins: [left, headerHeight, right, footerHeight],
		defaultStyle,
		styles,
	};
};
export const CUSTOM_PAGE_STICKER = ({
	pageOrientation = 'landscape',
	xMargin,
	headerHeight,
	footerHeight,
}) => {
	let width = 283;
	let height = 425;

	return {
		pageSize: { width, height },
		pageOrientation,
		pageMargins: [xMargin, headerHeight, xMargin, footerHeight],
		defaultStyle,
		styles,
	};
};
export const CUSTOM_PAGE_THREAD_STICKER = ({
	pageOrientation = 'portrait',
	xMargin,
	headerHeight,
	footerHeight,
}) => {
	let width = 210;
	let height = 281;

	return {
		pageSize: { width, height },
		pageOrientation,
		pageMargins: [xMargin, headerHeight, xMargin, footerHeight],
		defaultStyle,
		styles,
	};
};
export const CUSTOM_PAGE_CONE_STICKER = ({
	pageOrientation = 'landscape',
	xMargin,
	headerHeight,
	footerHeight,
}) => {
	let width = 71;
	let height = 227;

	return {
		pageSize: { width, height },
		pageOrientation,
		pageMargins: [xMargin, headerHeight, xMargin, footerHeight],
		defaultStyle,
		styles,
	};
};

export const company = {
	// logo: FZL_LOGO.src,
	name: 'Fortune Zipper Limited.',
	address: 'Aukpara, Ashulia, Savar, DHK-1340',
	email: 'Email: info@fortunezip.com',
	phone: 'Phone: 01810001301',
	challan_phone: 'Phone: 01810001301',
	bin: 'BIN: 000537296-0403',
	tax: 'VAT: 17141000815',
};

export const getTable = (
	field,
	name,
	alignment = 'left',
	headerStyle = 'tableHeader',
	cellStyle = 'tableCell'
) => ({
	field,
	name,
	alignment,
	headerStyle,
	cellStyle,
});

export const TableHeader = (
	node,
	fontSize = DEFAULT_FONT_SIZE,
	color = PRIMARY_COLOR,
	colSpan = 1
) => {
	return [
		...node.map((nodeItem) => ({
			text: nodeItem.name,
			// style: nodeItem.headerStyle,
			alignment: nodeItem.alignment,
			color,
			bold: true,
			fontSize,
			colSpan,
		})),
	];
};

// * HELPER: GET EMPTY COLUMN
export const getEmptyColumn = (colSpan) => {
	const EMPTY_COLUMN = [];
	for (let i = 0; i < colSpan - 1; i++) {
		EMPTY_COLUMN.push('');
	}
	return EMPTY_COLUMN;
};
