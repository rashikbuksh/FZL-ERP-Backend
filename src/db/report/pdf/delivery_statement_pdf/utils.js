import { FZL_LOGO } from '../../../../asset/img/base64.js';
import { format } from 'date-fns';

import { DEFAULT_FONT_SIZE, PRIMARY_COLOR } from '../../../../util/pdf/ui.js';
import { company, getEmptyColumn } from '../../../../util/pdf/utils.js';

const PAGE_HEADER_EMPTY_ROW = [
	{ text: '' },
	{ text: '' },
	{ text: '' },
	{ text: '' },
];

const getDateFormate = (date) => format(new Date(date), 'dd/MM/yyyy');

export const getPageHeader = (from, to) => {
	return {
		heights: ['auto', 2, 'auto', 'auto'],
		widths: [70, '*', 70, '*'],
		body: [
			[
				{
					image: FZL_LOGO.src,
					width: 70,
					height: 40,
					alignment: 'left',
				},
				{
					text: [`${company.address}\n`, `${company.phone}\n`],
					alignment: 'left',
				},
				{
					colSpan: 2,
					text: [
						{
							text: `Production Statement Report\n`,
							fontSize: DEFAULT_FONT_SIZE + 4,
							bold: true,
						},
						{
							text: `From  ${getDateFormate(from)} to ${getDateFormate(to)} \n`,
							fontSize: DEFAULT_FONT_SIZE + 2,
							bold: true,
						},
					],
					alignment: 'right',
				},
				{ text: '' },
			],
			PAGE_HEADER_EMPTY_ROW,

			// * Start of table
		],
	};
};

const EMPTY_COLUMN = getEmptyColumn(4);

export const getPageFooter = ({ currentPage, pageCount }) => ({
	body: [
		[
			{
				colSpan: 4,
				text: `Page ${currentPage} / ${pageCount}`,
				alignment: 'center',
				border: [false, false, false, false],
				// color,
			},
			...EMPTY_COLUMN,
		],
	],
});
