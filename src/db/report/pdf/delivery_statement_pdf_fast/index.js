import { format } from 'date-fns';
import { DEFAULT_FONT_SIZE, xMargin } from '../../../../util/pdf/ui.js';
import {
	DEFAULT_A4_PAGE,
	getTable,
	TableHeader,
	company,
} from '../../../../util/pdf/utils.js';
import { FZL_LOGO } from '../../../../asset/img/base64.js';
import pdfMake from '../index.js';

const getDateFormate = (date) => {
	if (date) {
		return format(new Date(date), 'dd/MM/yyyy');
	} else {
		return '--/--/--';
	}
};

// Simple fast header without logo for performance
// const getFastPageHeader = (from, to) => {
// 	return {
// 		heights: ['auto', 2],
// 		widths: ['*', '*', '*'],
// 		body: [
// 			[
// 				{
// 					text: [
// 						{
// 							text: `Fortune Zipper Ltd.\n`,
// 							fontSize: DEFAULT_FONT_SIZE,
// 						},
// 					],
// 					alignment: 'left',
// 				},
// 				{
// 					text: [
// 						{
// 							text: `${company.address} | ${company.phone}\n`,
// 							fontSize: DEFAULT_FONT_SIZE,
// 						},
// 					],
// 					alignment: 'left',
// 				},
// 				{
// 					text: [
// 						{
// 							text: `Production Statement Report\n`,
// 							fontSize: DEFAULT_FONT_SIZE + 4,
// 							bold: true,
// 						},
// 						{
// 							text: `From ${getDateFormate(from)} to ${getDateFormate(to)}`,
// 							fontSize: DEFAULT_FONT_SIZE + 1,
// 							bold: true,
// 						},
// 					],
// 					alignment: 'right',
// 				},
// 			],
// 			[{ text: '' }, { text: '' }, { text: '' }],
// 		],
// 	};
// };

export const getFastPageHeader = (from, to) => {
	return {
		heights: ['auto', 2],
		widths: [70, '*', 70, '*'],
		body: [
			[
				// {
				// 	text: `Fortune Zipper Ltd.\n`,
				// 	width: 70,
				// 	height: 40,
				// 	alignment: 'left',
				// },
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
			[{ text: '' }, { text: '' }, { text: '' }, { text: '' }],
		],
	};
};

// Full header with logo for normal mode (if needed)
const getDeliveryPageHeader = (from, to) => {
	const PAGE_HEADER_EMPTY_ROW = [
		{ text: '' },
		{ text: '' },
		{ text: '' },
		{ text: '' },
	];

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
							text: `Delivery Statement Report\n`,
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
		],
	};
};

const getDeliveryPageFooter = ({ currentPage, pageCount }) => ({
	body: [
		[
			{
				colSpan: 4,
				text: `Page ${currentPage} / ${pageCount}`,
				alignment: 'center',
				border: [false, false, false, false],
			},
			{ text: '' },
			{ text: '' },
			{ text: '' },
		],
	],
});

// Original table structure maintained for consistent format
const node = [
	getTable('party_name', 'Party'),
	getTable('type', 'Type'),
	getTable('marketing', 'Team'),
	getTable('order_number', 'O/N'),
	getTable('item_description', 'Item'),
	getTable('packing_number', 'P/N'),
	getTable('size', 'Size'),
	getTable('running_total_close_end_quantity', 'C/E', 'right'),
	getTable('running_total_open_end_quantity', 'O/E', 'right'),
	getTable('running_total_quantity', 'Total Qty', 'right'),
	getTable('company_price_dzn', 'Price', 'right'),
	getTable('value', 'Value', 'right'),
	getTable('value_bdt', 'Value (BDT)', 'right'),
];

export default function FastPdfGenerator(data, from, to) {
	const headerHeight = 80;
	let footerHeight = 50;
	const PdfData = data || [];
	const title = [
		'Current Total',
		'Opening Bal.',
		'Closing Bal.',
		'P.Current Total',
		'P.Opening Bal.',
		'P.Closing Bal.',
	];

	// Pre-calculate grand totals to avoid calculations during PDF generation
	const grandTotal = {
		current: {
			close_end_quantity: 0,
			open_end_quantity: 0,
			quantity: 0,
			value: 0,
			value_bdt: 0,
		},
		closing: {
			close_end_quantity: 0,
			open_end_quantity: 0,
			quantity: 0,
			value: 0,
			value_bdt: 0,
		},
		opening: {
			close_end_quantity: 0,
			open_end_quantity: 0,
			quantity: 0,
			value: 0,
			value_bdt: 0,
		},
	};

	// Use pre-calculated totals from the optimized data structure and add totals rows
	PdfData?.forEach((item) => {
		const partyTotal = {
			current: {
				close_end_quantity: 0,
				open_end_quantity: 0,
				quantity: 0,
				value: 0,
				value_bdt: 0,
			},
			closing: {
				close_end_quantity: 0,
				open_end_quantity: 0,
				quantity: 0,
				value: 0,
				value_bdt: 0,
			},
			opening: {
				close_end_quantity: 0,
				open_end_quantity: 0,
				quantity: 0,
				value: 0,
				value_bdt: 0,
			},
		};

		item.orders?.forEach((orderItem, orderIndex) => {
			const orderTotal = {
				current: {
					close_end_quantity: 0,
					open_end_quantity: 0,
					quantity: 0,
					value: 0,
					value_bdt: 0,
				},
				closing: {
					close_end_quantity: 0,
					open_end_quantity: 0,
					quantity: 0,
					value: 0,
					value_bdt: 0,
				},
				opening: {
					close_end_quantity: 0,
					open_end_quantity: 0,
					quantity: 0,
					value: 0,
					value_bdt: 0,
				},
			};

			orderItem.items?.forEach((itemItem, itemIndex) => {
				itemItem.packing_lists?.forEach((packingList, packingIndex) => {
					if (packingList.preCalculatedTotals) {
						// Use pre-calculated totals for performance
						const current = packingList.preCalculatedTotals.current;
						const opening = packingList.preCalculatedTotals.opening;
						const closing = packingList.preCalculatedTotals.closing;

						// Add to order totals
						orderTotal.current.close_end_quantity +=
							current.close_end_quantity;
						orderTotal.current.open_end_quantity +=
							current.open_end_quantity;
						orderTotal.current.quantity += current.quantity;
						orderTotal.current.value += current.value;
						orderTotal.current.value_bdt += current.value_bdt;

						orderTotal.opening.close_end_quantity +=
							opening.close_end_quantity;
						orderTotal.opening.open_end_quantity +=
							opening.open_end_quantity;
						orderTotal.opening.quantity += opening.quantity;
						orderTotal.opening.value += opening.value;
						orderTotal.opening.value_bdt += opening.value_bdt;

						orderTotal.closing.close_end_quantity +=
							closing.close_end_quantity;
						orderTotal.closing.open_end_quantity +=
							closing.open_end_quantity;
						orderTotal.closing.quantity += closing.quantity;
						orderTotal.closing.value += closing.value;
						orderTotal.closing.value_bdt += closing.value_bdt;

						// Add to party totals
						partyTotal.current.close_end_quantity +=
							current.close_end_quantity;
						partyTotal.current.open_end_quantity +=
							current.open_end_quantity;
						partyTotal.current.quantity += current.quantity;
						partyTotal.current.value += current.value;
						partyTotal.current.value_bdt += current.value_bdt;

						partyTotal.opening.close_end_quantity +=
							opening.close_end_quantity;
						partyTotal.opening.open_end_quantity +=
							opening.open_end_quantity;
						partyTotal.opening.quantity += opening.quantity;
						partyTotal.opening.value += opening.value;
						partyTotal.opening.value_bdt += opening.value_bdt;

						partyTotal.closing.close_end_quantity +=
							closing.close_end_quantity;
						partyTotal.closing.open_end_quantity +=
							closing.open_end_quantity;
						partyTotal.closing.quantity += closing.quantity;
						partyTotal.closing.value += closing.value;
						partyTotal.closing.value_bdt += closing.value_bdt;

						// Add to grand totals
						grandTotal.current.close_end_quantity +=
							current.close_end_quantity;
						grandTotal.current.open_end_quantity +=
							current.open_end_quantity;
						grandTotal.current.quantity += current.quantity;
						grandTotal.current.value += current.value;
						grandTotal.current.value_bdt += current.value_bdt;

						grandTotal.opening.close_end_quantity +=
							opening.close_end_quantity;
						grandTotal.opening.open_end_quantity +=
							opening.open_end_quantity;
						grandTotal.opening.quantity += opening.quantity;
						grandTotal.opening.value += opening.value;
						grandTotal.opening.value_bdt += opening.value_bdt;

						grandTotal.closing.close_end_quantity +=
							closing.close_end_quantity;
						grandTotal.closing.open_end_quantity +=
							closing.open_end_quantity;
						grandTotal.closing.quantity += closing.quantity;
						grandTotal.closing.value += closing.value;
						grandTotal.closing.value_bdt += closing.value_bdt;
					}

					// Add order totals at the end of each order (like the original)
					if (
						itemIndex + 1 === orderItem.items.length &&
						itemItem.packing_lists.length === packingIndex + 1
					) {
						packingList.other.push({
							size: 'Current Total',
							running_total_close_end_quantity:
								orderTotal.current.close_end_quantity,
							running_total_open_end_quantity:
								orderTotal.current.open_end_quantity,
							running_total_quantity: orderTotal.current.quantity,
							company_price_pcs: 1,
							running_total_value: orderTotal.current.value,
							running_total_value_bdt:
								orderTotal.current.value_bdt,
						});
						packingList.other.push({
							size: 'Opening Bal.',
							running_total_close_end_quantity:
								orderTotal.opening.close_end_quantity,
							running_total_open_end_quantity:
								orderTotal.opening.open_end_quantity,
							running_total_quantity: orderTotal.opening.quantity,
							company_price_pcs: 1,
							running_total_value: orderTotal.opening.value,
							running_total_value_bdt:
								orderTotal.opening.value_bdt,
						});
						packingList.other.push({
							size: 'Closing Bal.',
							running_total_close_end_quantity:
								orderTotal.closing.close_end_quantity,
							running_total_open_end_quantity:
								orderTotal.closing.open_end_quantity,
							running_total_quantity: orderTotal.closing.quantity,
							company_price_pcs: 1,
							running_total_value: orderTotal.closing.value,
							running_total_value_bdt:
								orderTotal.closing.value_bdt,
						});
					}

					// Add party totals at the end of each party (like the original)
					if (
						item.orders.length === orderIndex + 1 &&
						itemIndex + 1 === orderItem.items.length &&
						itemItem.packing_lists.length === packingIndex + 1
					) {
						packingList.other.push({
							size: 'P.Current Total',
							running_total_close_end_quantity:
								partyTotal.current.close_end_quantity,
							running_total_open_end_quantity:
								partyTotal.current.open_end_quantity,
							running_total_quantity: partyTotal.current.quantity,
							company_price_pcs: 1,
							running_total_value: partyTotal.current.value,
							running_total_value_bdt:
								partyTotal.current.value_bdt,
						});
						packingList.other.push({
							size: 'P.Opening Bal.',
							running_total_close_end_quantity:
								partyTotal.opening.close_end_quantity,
							running_total_open_end_quantity:
								partyTotal.opening.open_end_quantity,
							running_total_quantity: partyTotal.opening.quantity,
							company_price_pcs: 1,
							running_total_value: partyTotal.opening.value,
							running_total_value_bdt:
								partyTotal.opening.value_bdt,
						});
						packingList.other.push({
							size: 'P.Closing Bal.',
							running_total_close_end_quantity:
								partyTotal.closing.close_end_quantity,
							running_total_open_end_quantity:
								partyTotal.closing.open_end_quantity,
							running_total_quantity: partyTotal.closing.quantity,
							company_price_pcs: 1,
							running_total_value: partyTotal.closing.value,
							running_total_value_bdt:
								partyTotal.closing.value_bdt,
						});
					}
				});
			});
		});
	});

	// Generate table data using the same approach as the original PDF generator
	const tableData = PdfData.flatMap((item) => {
		const typeRowSpan =
			item?.orders?.reduce((total, orders) => {
				return (
					total +
						orders.items?.reduce((itemTotal, item) => {
							return (
								itemTotal +
									item.packing_lists?.reduce(
										(packingListTotal, packingList) => {
											return (
												packingListTotal +
												(packingList.other?.length || 1)
											);
										},
										0
									) || 0
							);
						}, 0) || 0
				);
			}, 0) || 0;

		return item?.orders?.flatMap((orderItem, orderIndex) => {
			const orderRowSpan =
				orderItem.items?.reduce((total, item) => {
					return (
						total +
							item.packing_lists.reduce(
								(packingListTotal, packingList) => {
									return (
										packingListTotal +
										(packingList.other?.length || 1)
									);
								},
								0
							) || 0
					);
				}, 0) || 0;

			return orderItem.items?.flatMap((itemItem, itemIndex) => {
				const itemRowSpan =
					itemItem.packing_lists.reduce(
						(packingListTotal, packingList) => {
							return (
								packingListTotal +
								(packingList.other?.length || 1)
							);
						},
						0
					) || 0;
				return itemItem.packing_lists.flatMap((packingList) => {
					const packingListRowSpan = packingList.other?.length || 1;
					return packingList.other?.map((otherItem) => ({
						party_name: {
							text: item.party_name,
							rowSpan: typeRowSpan,
						},
						type: {
							text: item.type,
							rowSpan: typeRowSpan,
						},
						marketing: {
							text: item.marketing_name,
							rowSpan: typeRowSpan,
						},
						order_number: {
							text:
								orderItem.order_number_with_cash +
								' (' +
								orderItem.total_quantity +
								')',
							rowSpan: orderRowSpan,
						},
						item_description: {
							text: itemItem.item_description,
							rowSpan: itemRowSpan,
						},
						packing_number: {
							text: `${packingList.packing_number} (${getDateFormate(packingList.packing_list_created_at)})`,
							rowSpan: packingListRowSpan,
						},
						size: {
							text: title.includes(otherItem.size)
								? otherItem.size
									? otherItem.size
									: '---'
								: `${otherItem.size?.includes('-') ? `(${otherItem.size})` : otherItem.size} ${otherItem.unit}`,
							bold: title.includes(otherItem.size) ? true : false,
						},
						running_total_close_end_quantity: {
							text: otherItem.running_total_close_end_quantity,
							bold: title.includes(otherItem.size) ? true : false,
						},
						running_total_open_end_quantity: {
							text: otherItem.running_total_open_end_quantity,
							bold: title.includes(otherItem.size) ? true : false,
						},
						running_total_quantity: {
							text: otherItem.running_total_quantity,
							bold: title.includes(otherItem.size) ? true : false,
						},
						company_price_dzn: {
							text: otherItem.company_price_dzn
								? otherItem.company_price_dzn +
									'/' +
									otherItem.price_unit
								: '---',
							bold: title.includes(otherItem.size) ? true : false,
						},
						value: {
							text: Number(otherItem.running_total_value).toFixed(
								3
							),
							bold: title.includes(otherItem.size) ? true : false,
						},
						value_bdt: {
							text: title.includes(otherItem.size)
								? Number(
										otherItem.running_total_value_bdt
									).toFixed(2)
								: Number(
										otherItem.running_total_value *
											otherItem.conversion_rate
									).toFixed(2),
							bold: title.includes(otherItem.size) ? true : false,
						},
					}));
				});
			});
		});
	});

	const pdfDocGenerator = pdfMake.createPdf({
		...DEFAULT_A4_PAGE({
			xMargin,
			headerHeight,
			footerHeight,
		}),
		pageOrientation: 'landscape',
		header: {
			table: getFastPageHeader(from, to),
			layout: 'noBorders',
			margin: [xMargin, 20, xMargin, 0],
		},
		footer: (currentPage, pageCount) => ({
			table: getDeliveryPageFooter({
				currentPage,
				pageCount,
			}),
			margin: [xMargin, 2],
			fontSize: DEFAULT_FONT_SIZE - 2,
		}),
		content: [
			{
				table: {
					headerRows: 1,
					// Original column widths for proper formatting
					widths: [
						65, 40, 80, 50, 70, 55, 60, 40, 40, 45, 45, 45, 45,
					],
					body: [
						TableHeader(node),

						// Generate data rows using the same approach as original
						...tableData?.map((item) =>
							node?.map((nodeItem) => {
								const cellData = nodeItem.field
									? item[nodeItem.field]
									: '---';
								return {
									text: cellData?.text || cellData,
									style: nodeItem.cellStyle,
									alignment: nodeItem.alignment,
									rowSpan: cellData?.rowSpan,
									colSpan: cellData?.colSpan,
									bold: cellData?.bold,
								};
							})
						),

						// Grand totals section
						[
							{
								text: 'Grand Current Total',
								bold: true,
								colSpan: 7,
								fontSize: 9,
							},
							{},
							{},
							{},
							{},
							{},
							{},
							{
								text: Number(
									grandTotal.current.close_end_quantity
								).toFixed(2),
								bold: true,
								fontSize: 9,
							},
							{
								text: Number(
									grandTotal.current.open_end_quantity
								).toFixed(2),
								bold: true,
								fontSize: 9,
							},
							{
								text: Number(
									grandTotal.current.quantity
								).toFixed(2),
								bold: true,
								fontSize: 9,
							},
							{},
							{
								text: Number(grandTotal.current.value).toFixed(
									2
								),
								bold: true,
								fontSize: 9,
							},
							{
								text: Number(
									grandTotal.current.value_bdt
								).toFixed(2),
								bold: true,
								fontSize: 9,
							},
						],
						[
							{
								text: 'Grand Opening Total',
								bold: true,
								colSpan: 7,
								fontSize: 9,
							},
							{},
							{},
							{},
							{},
							{},
							{},
							{
								text: Number(
									grandTotal.opening.close_end_quantity
								).toFixed(2),
								bold: true,
								fontSize: 9,
							},
							{
								text: Number(
									grandTotal.opening.open_end_quantity
								).toFixed(2),
								bold: true,
								fontSize: 9,
							},
							{
								text: Number(
									grandTotal.opening.quantity
								).toFixed(2),
								bold: true,
								fontSize: 9,
							},
							{},
							{
								text: Number(grandTotal.opening.value).toFixed(
									2
								),
								bold: true,
								fontSize: 9,
							},
							{
								text: Number(
									grandTotal.opening.value_bdt
								).toFixed(2),
								bold: true,
								fontSize: 9,
							},
						],
						[
							{
								text: 'Grand Closing Total',
								bold: true,
								colSpan: 7,
								fontSize: 9,
							},
							{},
							{},
							{},
							{},
							{},
							{},
							{
								text: Number(
									grandTotal.closing.close_end_quantity
								).toFixed(2),
								bold: true,
								fontSize: 9,
							},
							{
								text: Number(
									grandTotal.closing.open_end_quantity
								).toFixed(2),
								bold: true,
								fontSize: 9,
							},
							{
								text: Number(
									grandTotal.closing.quantity
								).toFixed(2),
								bold: true,
								fontSize: 9,
							},
							{},
							{
								text: Number(grandTotal.closing.value).toFixed(
									2
								),
								bold: true,
								fontSize: 9,
							},
							{
								text: Number(
									grandTotal.closing.value_bdt
								).toFixed(2),
								bold: true,
								fontSize: 9,
							},
						],
					],
				},
				layout: {
					fillColor: function (rowIndex, node, columnIndex) {
						return rowIndex === 0 ? '#CCCCCC' : null;
					},
					hLineWidth: function (i, node) {
						return i === 0 ||
							i === 1 ||
							i === node.table.body.length
							? 1
							: 0.5;
					},
					vLineWidth: function (i, node) {
						return i === 0 || i === node.table.widths.length
							? 1
							: 0.5;
					},
				},
			},
		],
		styles: {
			header: {
				fontSize: 14,
				bold: true,
				alignment: 'center',
			},
			tableHeader: {
				fontSize: 9,
				bold: true,
				fillColor: '#CCCCCC',
			},
		},
		defaultStyle: {
			fontSize: 8,
		},
	});

	return pdfDocGenerator;
}
