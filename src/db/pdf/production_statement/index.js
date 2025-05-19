import { format } from 'date-fns';

import { DEFAULT_FONT_SIZE, xMargin } from '../ui/index.js';
import { DEFAULT_A4_PAGE, getTable, TableHeader } from '../utils.js';

import pdfMake from '../pdfMake.js';
import { getPageFooter, getPageHeader } from './utils.js';

const getDateFormate = (date) => {
	if (date) {
		return format(new Date(date), 'dd/MM/yyyy');
	} else {
		return '--/--/--';
	}
};
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
export default function Index(data, from, to) {
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
					const totalCloseEnd = packingList.other?.reduce(
						(total, item) => {
							return (
								total +
								(item.running_total_close_end_quantity || 0)
							);
						},
						0
					);
					orderTotal.current.close_end_quantity += totalCloseEnd;
					partyTotal.current.close_end_quantity += totalCloseEnd;
					grandTotal.current.close_end_quantity += totalCloseEnd;

					const totalOpenEnd = packingList.other?.reduce(
						(total, item) => {
							return (
								total +
								(item.running_total_open_end_quantity || 0)
							);
						},
						0
					);

					orderTotal.current.open_end_quantity += totalOpenEnd;
					partyTotal.current.open_end_quantity += totalOpenEnd;
					grandTotal.current.open_end_quantity += totalOpenEnd;
					const totalQuantity = packingList.other?.reduce(
						(total, item) => {
							return total + (item.running_total_quantity || 0);
						},
						0
					);
					orderTotal.current.quantity += totalQuantity;
					partyTotal.current.quantity += totalQuantity;
					grandTotal.current.quantity += totalQuantity;
					const totalOpeningCloseEnd = packingList.other?.reduce(
						(total, item) => {
							return (
								total +
								(item.opening_total_close_end_quantity || 0)
							);
						},
						0
					);
					orderTotal.opening.close_end_quantity +=
						totalOpeningCloseEnd;
					partyTotal.opening.close_end_quantity +=
						totalOpeningCloseEnd;
					grandTotal.opening.close_end_quantity +=
						totalOpeningCloseEnd;
					const totalOpeningOpenEnd = packingList.other?.reduce(
						(total, item) => {
							return (
								total +
								(item.opening_total_open_end_quantity || 0)
							);
						},
						0
					);
					orderTotal.opening.open_end_quantity += totalOpeningOpenEnd;
					partyTotal.opening.open_end_quantity += totalOpeningOpenEnd;
					grandTotal.opening.open_end_quantity += totalOpeningOpenEnd;
					const OpeningTotalQuantity = packingList.other?.reduce(
						(total, item) => {
							return total + (item.opening_total_quantity || 0);
						},
						0
					);
					orderTotal.opening.quantity += OpeningTotalQuantity;
					partyTotal.opening.quantity += OpeningTotalQuantity;
					grandTotal.opening.quantity += OpeningTotalQuantity;
					const totalClosingCloseEnd = packingList.other?.reduce(
						(total, item) => {
							return (
								total +
								(item.closing_total_close_end_quantity || 0)
							);
						},
						0
					);
					orderTotal.closing.close_end_quantity +=
						totalClosingCloseEnd;
					partyTotal.closing.close_end_quantity +=
						totalClosingCloseEnd;
					grandTotal.closing.close_end_quantity +=
						totalClosingCloseEnd;
					const totalClosingOpenEnd = packingList.other?.reduce(
						(total, item) => {
							return (
								total +
								(item.closing_total_open_end_quantity || 0)
							);
						},
						0
					);
					orderTotal.closing.open_end_quantity += totalClosingOpenEnd;
					partyTotal.closing.open_end_quantity += totalClosingOpenEnd;
					grandTotal.closing.open_end_quantity += totalClosingOpenEnd;
					const CloseTotalQuantity = packingList.other?.reduce(
						(total, item) => {
							return total + (item.closing_total_quantity || 0);
						},
						0
					);
					orderTotal.closing.quantity += CloseTotalQuantity;
					partyTotal.closing.quantity += CloseTotalQuantity;
					grandTotal.closing.quantity += CloseTotalQuantity;
					const totalValue = packingList.other?.reduce(
						(total, item) => {
							return total + (item.running_total_value || 0);
						},
						0
					);
					orderTotal.current.value += totalValue;
					partyTotal.current.value += totalValue;
					grandTotal.current.value += totalValue;
					const OpeningTotalValue =
						packingList.other.reduce((total, item) => {
							return total + (item.opening_total_value || 0);
						}, 0) || 0;
					orderTotal.opening.value += OpeningTotalValue;
					partyTotal.opening.value += OpeningTotalValue;
					grandTotal.opening.value += OpeningTotalValue;
					const ClosingTotalValue =
						packingList.other?.reduce((total, item) => {
							return total + (item.closing_total_value || 0);
						}, 0) || 0;

					orderTotal.closing.value += ClosingTotalValue;
					partyTotal.closing.value += ClosingTotalValue;
					grandTotal.closing.value += ClosingTotalValue;
					const totalValueBDT = packingList.other?.reduce(
						(total = 0, item) => {
							return (
								total +
								(item.running_total_value *
									item.conversion_rate || 0)
							);
						},
						0
					);
					orderTotal.current.value_bdt += totalValueBDT;
					partyTotal.current.value_bdt += totalValueBDT;
					grandTotal.current.value_bdt += totalValueBDT;
					const OpeningTotalValueBDT = packingList.other?.reduce(
						(total = 0, item) => {
							return (
								total +
								(item.opening_total_value *
									item.conversion_rate || 0)
							);
						},
						0
					);
					orderTotal.opening.value_bdt += OpeningTotalValueBDT;
					partyTotal.opening.value_bdt += OpeningTotalValueBDT;
					grandTotal.opening.value_bdt += OpeningTotalValueBDT;
					const ClosingTotalValueBDT = packingList.other?.reduce(
						(total = 0, item) => {
							return (
								total +
								(item.closing_total_value *
									item.conversion_rate || 0)
							);
						},
						0
					);
					orderTotal.closing.value_bdt += ClosingTotalValueBDT;
					partyTotal.closing.value_bdt += ClosingTotalValueBDT;
					grandTotal.closing.value_bdt += ClosingTotalValueBDT;
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
								: `${otherItem.size.includes('-') ? `(${otherItem.size})` : otherItem.size} ${otherItem.unit}`,

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
									).toFixed(3)
								: Number(
										otherItem.running_total_value *
											Number(otherItem.conversion_rate)
									).toFixed(3),
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
			table: getPageHeader(from, to),
			layout: 'noBorders',
			margin: [xMargin, 30, xMargin, 0],
		},
		footer: (currentPage, pageCount) => ({
			table: getPageFooter({
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
					widths: [
						65, 40, 80, 50, 70, 55, 60, 40, 40, 45, 45, 45, 45,
					],
					body: [
						TableHeader(node),

						// Body
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
						[
							{
								text: 'Grand Current Total',
								bold: true,
								colSpan: 7,
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
							},
							{
								text: Number(
									grandTotal.current.open_end_quantity
								).toFixed(2),
								bold: true,
							},

							{
								text: Number(
									grandTotal.current.quantity
								).toFixed(2),
								bold: true,
							},
							{},
							{
								text: Number(grandTotal.current.value).toFixed(
									2
								),
								bold: true,
							},
							{
								text: Number(
									grandTotal.current.value_bdt
								).toFixed(2),
								bold: true,
							},
						],
						[
							{
								text: 'Grand Opening Total',
								bold: true,
								colSpan: 7,
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
							},
							{
								text: Number(
									grandTotal.opening.open_end_quantity
								).toFixed(2),
								bold: true,
							},

							{
								text: Number(
									grandTotal.opening.quantity
								).toFixed(2),
								bold: true,
							},
							{},
							{
								text: Number(grandTotal.opening.value).toFixed(
									2
								),
								bold: true,
							},
							{
								text: Number(
									grandTotal.opening.value_bdt
								).toFixed(2),
								bold: true,
							},
						],
						[
							{
								text: 'Grand Closing Total',
								bold: true,
								colSpan: 7,
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
							},
							{
								text: Number(
									grandTotal.closing.open_end_quantity
								).toFixed(2),
								bold: true,
							},

							{
								text: Number(
									grandTotal.closing.quantity
								).toFixed(2),
								bold: true,
							},
							{},
							{
								text: Number(grandTotal.closing.value).toFixed(
									2
								),
								bold: true,
							},
							{
								text: Number(
									grandTotal.closing.value_bdt
								).toFixed(2),
								bold: true,
							},
						],
					],
				},
			},
		],
	});

	return pdfDocGenerator;
}
