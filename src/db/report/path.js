import SE, { SED } from '../../util/swagger_example.js';

export const pathReport = {
	'/report/zipper-production-status-report': {
		get: {
			summary: 'Zipper Production Status Report',
			description: 'Zipper Production Status Report',
			tags: ['report'],
			operationId: 'zipperProductionStatusReport',
			parameters: [SE.parameter_query('status', 'status', [])],
			responses: {
				200: {
					description: 'Zipper Production Status Report',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: SED('zipperProductionStatusReport'),
							},
						},
					},
				},
			},
		},
	},
	'/report/zipper-production-status-report-v2': {
		get: {
			summary: 'Zipper Production Status Report V2',
			description: 'Zipper Production Status Report V2',
			tags: ['report'],
			operationId: 'zipperProductionStatusReportV2',
			parameters: [SE.parameter_query('status', 'status', [])],
			responses: {
				200: {
					description: 'Zipper Production Status Report V2',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: SED('zipperProductionStatusReportV2'),
							},
						},
					},
				},
			},
		},
	},
	'/report/daily-challan-report': {
		get: {
			summary: 'Daily Challan Report',
			description: 'Daily Challan Report',
			tags: ['report'],
			operationId: 'dailyChallanReport',
			parameters: [
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
				SE.parameter_query('from_date', 'from_date', '2024-10-01'),
				SE.parameter_query('to_date', 'to_date', '2024-10-31'),
				SE.parameter_query('type', 'type', [
					'pending',
					'gate_pass',
					'delivered',
					'received',
					'all',
				]),
			],
			responses: {
				200: {
					description: 'Daily Challan Report',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: SED('dailyChallanReport'),
							},
						},
					},
				},
			},
		},
	},
	'/report/pi-register-report': {
		get: {
			summary: 'Pi Register Report',
			description: 'Pi Register Report',
			tags: ['report'],
			operationId: 'PiRegister',
			parameters: [
				SE.parameter_query('from', 'from', '2024-10-01'),
				SE.parameter_query('to', 'to', '2024-10-31'),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
			],
			responses: {
				200: {
					description: 'Pi Register Report',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: SED('PiRegister'),
							},
						},
					},
				},
			},
		},
	},
	'/report/pi-to-be-register-report': {
		get: {
			summary: 'Pi To Be Register Report',
			description: 'Pi To Be Register Report',
			tags: ['report'],
			operationId: 'PiToBeRegister',
			parameters: [SE.parameter_query('own_uuid', 'own_uuid', '[]')],
			responses: {
				200: SE.response_schema(200, {
					party_uuid: SE.uuid(),
					party_name: SE.string(),
					total_quantity: SE.number(3950),
					total_pi: SE.number(610),
					total_balance_pi_quantity: SE.number(3340),
					total_balance_pi_value: SE.number(101555),
					total_delivered: SE.number(0),
					total_undelivered_balance_quantity: SE.number(610),
				}),
			},
		},
	},
	'/report/pi-to-be-register-report-marketing-wise': {
		get: {
			summary: 'Pi To Be Register Report Marketing Wise',
			description: 'Pi To Be Register Report Marketing Wise',
			tags: ['report'],
			operationId: 'PiToBeRegisterMarketingWise',
			parameters: [SE.parameter_query('own_uuid', 'own_uuid', SE.uuid())],
			responses: {
				200: SE.response_schema(200, {
					marketing_uuid: SE.uuid(),
					marketing_name: SE.string(),
					total_quantity: SE.number(3950),
					total_pi: SE.number(610),
					total_balance_pi_quantity: SE.number(3340),
					total_balance_pi_value: SE.number(101555),
					total_delivered: SE.number(0),
					total_undelivered_balance_quantity: SE.number(610),
				}),
			},
		},
	},
	'/report/lc-report': {
		get: {
			summary: 'LCReport',
			description: 'LCReport',
			tags: ['report'],
			operationId: 'LCReport',
			parameters: [
				SE.parameter_query('document_receiving', 'document_receiving', [
					true,
					false,
				]),
				SE.parameter_query('acceptance', 'acceptance', [true, false]),
				SE.parameter_query('maturity', 'maturity', [true, false]),
				SE.parameter_query('payment', 'payment', [true, false]),
			],
			responses: {
				200: SE.response_schema(200, {
					file_number: SE.string('LC24-0001'),
					uuid: SE.uuid(),
					lc_number: SE.number(610),
					lc_date: SE.date_time(),
					party_uuid: SE.uuid(),
					party_name: SE.string('Party Name'),
					payment_value: SE.number(101555),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					remarks: SE.string('Remarks'),
					commercial_executive: SE.string('Commercial Executive'),
					handover_date: SE.date_time(),
					document_receive_date: SE.date_time(),
					acceptance_date: SE.date_time(),
					maturity_date: SE.date_time(),
					payment_date: SE.date_time(),
					ldbc_fdbc: SE.string('LDBC/FDBC'),
					shipment_date: SE.date_time(),
					expiry_date: SE.date_time(),
					ud_no: SE.string('UD No'),
					ud_received: SE.string('UD Received'),
					marketing_uuid: SE.uuid(),
					marketing_name: SE.string('Marketing Name'),
					bank_uuid: SE.uuid(),
					bank_name: SE.string('Bank Name'),
					party_bank: SE.string('Party Bank'),
				}),
			},
		},
	},
	'/report/thread-production-batch-wise-report': {
		get: {
			summary: 'Thread Batch Wise Report',
			description: 'Thread Batch Wise Report',
			tags: ['report'],
			operationId: 'threadProductionStatusBatchWise',
			parameters: [
				SE.parameter_query('status', 'status', []),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
				SE.parameter_query('from', 'from', '2024-10-01'),
				SE.parameter_query('to', 'to', '2024-10-31'),
				SE.parameter_query('time_from', 'time_from', '00:00:00'),
				SE.parameter_query('time_to', 'time_to', '23:59:59'),
			],
			responses: {
				200: SE.response_schema(200, {
					batch_number: SE.string('Batch Number'),
					production_date: SE.date_time(),
					production_quantity: SE.number(610),
					production_value: SE.number(101555),
					production_status: SE.string('Production Status'),
					production_type: SE.string('Production Type'),
					production_remarks: SE.string('Production Remarks'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
				}),
			},
		},
	},
	'/report/production-report-director': {
		get: {
			summary: 'Production Report Director',
			description: 'Production Report Director',
			tags: ['report'],
			operationId: 'ProductionReportDirector',
			parameters: [],
			responses: {
				200: SE.response_schema(200, {
					production_date: SE.date_time(),
					production_quantity: SE.number(610),
					production_value: SE.number(101555),
					production_status: SE.string('Production Status'),
					production_type: SE.string('Production Type'),
					production_remarks: SE.string('Production Remarks'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
				}),
			},
		},
	},
	'/report/production-report-thread-director': {
		get: {
			summary: 'Production Report Thread Director',
			description: 'Production Report Thread Director',
			tags: ['report'],
			operationId: 'ProductionReportThreadDirector',
			parameters: [],
			responses: {
				200: SE.response_schema(200, {
					production_date: SE.date_time(),
					production_quantity: SE.number(610),
					production_value: SE.number(101555),
					production_status: SE.string('Production Status'),
					production_type: SE.string('Production Type'),
					production_remarks: SE.string('Production Remarks'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
				}),
			},
		},
	},
	'/report/production-report-sales-marketing': {
		get: {
			summary: 'Production Report Sales & Marketing',
			description: 'Production Report Sales & Marketing',
			tags: ['report'],
			operationId: 'ProductionReportSnm',
			parameters: [
				SE.parameter_query('from', 'from', '2024-10-01'),
				SE.parameter_query('to', 'to', '2024-10-31'),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
			],
			responses: {
				200: SE.response_schema(200, {
					production_date: SE.date_time(),
					production_quantity: SE.number(610),
					production_value: SE.number(101555),
					production_status: SE.string('Production Status'),
					production_type: SE.string('Production Type'),
					production_remarks: SE.string('Production Remarks'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
				}),
			},
		},
	},
	'/report/production-report-thread-sales-marketing': {
		get: {
			summary: 'Production Report Thread Sales & Marketing',
			description: 'Production Report Thread Sales & Marketing',
			tags: ['report'],
			operationId: 'ProductionReportThreadSnm',
			parameters: [
				SE.parameter_query('from', 'from', '2024-10-01'),
				SE.parameter_query('to', 'to', '2024-10-31'),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
			],
			responses: {
				200: SE.response_schema(200, {
					production_date: SE.date_time(),
					production_quantity: SE.number(610),
					production_value: SE.number(101555),
					production_status: SE.string('Production Status'),
					production_type: SE.string('Production Type'),
					production_remarks: SE.string('Production Remarks'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
				}),
			},
		},
	},
	'/report/daily-production-report': {
		get: {
			summary: 'Daily Production Report',
			description: 'Daily Production Report',
			tags: ['report'],
			operationId: 'dailyProductionReport',
			parameters: [
				SE.parameter_query('from_date', 'from_date', '2024-10-01'),
				SE.parameter_query('to_date', 'to_date', '2024-10-31'),
				SE.parameter_query(
					'type',
					'type',
					['all', 'bulk', 'sample'],
					true
				),
			],
			responses: {
				200: SE.response_schema(200, {
					order_info_uuid: SE.uuid(),
					item: SE.uuid(),
					item_name: SE.string('Item Name'),
					order_number: SE.string('Order Number'),
					party_uuid: SE.uuid(),
					party_name: SE.string('Party Name'),
					order_description_uuid: SE.uuid(),
					item_description: SE.string('Item Description'),
					end_type: SE.uuid(),
					end_type_name: SE.string('End Type Name'),
					order_entry_uuid: SE.uuid(),
					size: SE.string('Size'),
					opening_total_close_end_quantity: SE.number(610),
					opening_total_open_end_quantity: SE.number(610),
					opening_total_quantity: SE.number(610),
					opening_total_quantity_dzn: SE.number(610),
					opening_unit_price_dzn: SE.number(610),
					opening_unit_price_pcs: SE.number(610),
					opening_total_close_end_value: SE.number(610),
					opening_total_open_end_value: SE.number(610),
					opening_total_value: SE.number(610),
					challan_numbers: SE.string('Challan Numbers'),
					challan_date: SE.date_time(),
					running_total_close_end_quantity: SE.number(610),
					running_total_open_end_quantity: SE.number(610),
					running_total_quantity: SE.number(610),
					running_total_quantity_dzn: SE.number(610),
					running_unit_price_dzn: SE.number(610),
					running_unit_price_pcs: SE.number(610),
					running_total_close_end_value: SE.number(610),
					running_total_open_end_value: SE.number(610),
					running_total_value: SE.number(610),
				}),
			},
		},
	},
	'/report/delivery-statement-report': {
		get: {
			summary: 'Delivery Statement Report',
			description: 'Delivery Statement Report',
			tags: ['report'],
			operationId: 'deliveryStatementReport',
			parameters: [
				SE.parameter_query('from_date', 'from_date', '2024-10-01'),
				SE.parameter_query('to_date', 'to_date', '2024-10-31'),
				// marketing, party, type, own_uuid
				SE.parameter_query('marketing', 'marketing', SE.uuid()),
				SE.parameter_query('party', 'party', SE.uuid()),
				SE.parameter_query('type', 'type', ['zipper', 'thread']),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
				SE.parameter_query(
					'order_info_uuid',
					'order_info_uuid',
					SE.uuid()
				),
				SE.parameter_query('report_for', 'report_for', ['accounts']),
				SE.parameter_query(
					'price_for',
					'price_for',
					['company', 'party'],
					true
				),
			],
			responses: {
				200: SE.response_schema(200, {
					order_info_uuid: SE.uuid(),
					item: SE.uuid(),
					item_name: SE.string('Item Name'),
					order_number: SE.string('Order Number'),
					party_uuid: SE.uuid(),
					party_name: SE.string('Party Name'),
					order_description_uuid: SE.uuid(),
					item_description: SE.string('Item Description'),
					end_type: SE.uuid(),
					end_type_name: SE.string('End Type Name'),
					order_entry_uuid: SE.uuid(),
					size: SE.string('Size'),
					opening_total_close_end_quantity: SE.number(610),
					opening_total_open_end_quantity: SE.number(610),
					opening_total_quantity: SE.number(610),
					opening_total_quantity_dzn: SE.number(610),
					opening_unit_price_dzn: SE.number(610),
					opening_unit_price_pcs: SE.number(610),
					opening_total_close_end_value: SE.number(610),
					opening_total_open_end_value: SE.number(610),
					opening_total_value: SE.number(610),
					challan_numbers: SE.string('Challan Numbers'),
					challan_date: SE.date_time(),
					running_total_close_end_quantity: SE.number(610),
					running_total_open_end_quantity: SE.number(610),
					running_total_quantity: SE.number(610),
					running_total_quantity_dzn: SE.number(610),
					running_unit_price_dzn: SE.number(610),
					running_unit_price_pcs: SE.number(610),
					running_total_close_end_value: SE.number(610),
					running_total_open_end_value: SE.number(610),
					running_total_value: SE.number(610),
				}),
			},
		},
	},
	'/report/delivery-statement-report/pdf': {
		get: {
			summary: 'Delivery Statement Report PDF',
			description:
				'Generate and download Delivery Statement Report as PDF',
			tags: ['report'],
			operationId: 'deliveryStatementReportPDF',
			parameters: [
				SE.parameter_query('from_date', 'from_date', '2024-10-01'),
				SE.parameter_query('to_date', 'to_date', '2024-10-31'),
				SE.parameter_query('marketing', 'marketing', SE.uuid()),
				SE.parameter_query('party', 'party', SE.uuid()),
				SE.parameter_query('type', 'type', ['zipper', 'thread']),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
				SE.parameter_query(
					'order_info_uuid',
					'order_info_uuid',
					SE.uuid()
				),
				SE.parameter_query('report_for', 'report_for', [
					'packing',
					'accounts',
				]),
				SE.parameter_query(
					'price_for',
					'price_for',
					['company', 'party'],
					true
				),
				SE.parameter_query(
					'file_type',
					'file_type',
					['pdf', 'excel'],
					true
				),
			],
			responses: {
				200: {
					description: 'PDF file download',
					content: {
						'application/pdf': {
							schema: {
								type: 'string',
								format: 'binary',
							},
						},
					},
				},
			},
		},
	},
	'/report/production-report-thread-party-wise': {
		get: {
			summary: 'Party Wise Production Report Thread',
			description: 'Party Wise Production Report Thread',
			tags: ['report'],
			operationId: 'ProductionReportThreadPartyWise',
			parameters: [
				SE.parameter_query('from', 'from', '2024-10-01'),
				SE.parameter_query('to', 'to', '2024-10-31'),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
			],
			responses: {
				200: SE.response_schema(200, {
					party_uuid: SE.uuid(),
					party_name: SE.string('Party Name'),
					count_length_name: SE.string('Count Length Name'),
					total_quantity: SE.number(610),
				}),
			},
		},
	},
	'/report/material-stock-report': {
		get: {
			summary: 'Material Stock Report',
			description: 'Material Stock Report',
			tags: ['report'],
			operationId: 'MaterialStockReport',
			parameters: [
				SE.parameter_query('from_date', 'from_date', '2024-10-01'),
				SE.parameter_query('to_date', 'to_date', '2024-10-31'),
				SE.parameter_query(
					'store_type',
					'store_type',
					['rm', 'accessories'],
					true
				),
			],
			responses: {
				200: SE.response_schema(200, {
					material_uuid: SE.uuid(),
					material_name: SE.string('Material Name'),
					material_section_name: SE.string('Section Name'),
					material_unit: SE.string('Material Unit'),
					opening_quantity: SE.number(610),
					purchase_quantity: SE.number(610),
					consumption_quantity: SE.number(610),
					closing_quantity: SE.number(610),
				}),
			},
		},
	},
	'/report/v2/material-stock-report': {
		get: {
			summary: 'Material Stock Report V2',
			description: 'Material Stock Report V2',
			tags: ['report'],
			operationId: 'MaterialStockReportV2',
			parameters: [
				SE.parameter_query('as_on_date', 'as_on_date', '2024-10-31'),
				SE.parameter_query(
					'store_type',
					'store_type',
					['rm', 'accessories'],
					true
				),
			],
			responses: {
				200: SE.response_schema(200, {
					material_uuid: SE.uuid(),
					material_name: SE.string('Material Name'),
					material_section_name: SE.string('Section Name'),
					material_unit: SE.string('Material Unit'),
					opening_quantity: SE.number(610),
					purchase_quantity: SE.number(610),
					consumption_quantity: SE.number(610),
					closing_quantity: SE.number(610),
				}),
			},
		},
	},
	'/report/individual-material-report/:material_uuid': {
		get: {
			summary: 'Individual Material Report',
			description: 'Individual Material Report',
			tags: ['report'],
			operationId: 'selectIndividualMaterialReport',
			parameters: [
				SE.parameter_params(
					'material_uuid',
					'material_uuid',
					SE.uuid()
				),
			],
			responses: {
				200: SE.response_schema(200, {
					material_uuid: SE.uuid(),
					material_name: SE.string('Material Name'),
					store_type: SE.string('rm/accessories'),
					quantity: SE.number(610),
					price: SE.number(610),
					unit: SE.string('Unit'),
					purchase_description_uuid: SE.uuid(),
					is_local: SE.integer('1/0'),
					lc_number: SE.string('LC Number'),
					challan_number: SE.string('Challan Number'),
					purchase_created_at: SE.date_time(),
					purchase_id: SE.string('SR25-0001 / SRA25-0002'),
					vendor_uuid: SE.uuid(),
					vendor_name: SE.string('Vendor Name'),
					purchase_description_remarks: SE.string(
						'purchase_description_remarks'
					),
				}),
			},
		},
	},
	'/report/sample-report': {
		get: {
			summary: 'Sample Report',
			description: 'Sample Report',
			tags: ['report'],
			operationId: 'selectSampleReport',
			parameters: [],
			responses: {
				200: SE.response_schema(200, {
					sample_order_no: SE.string('Sample Order No'),
					issue_date: SE.date_time(),
					status: SE.string('Status'),
					delivery_last_date: SE.date_time(),
					delivery_quantity: SE.number(610),
					order_quantity: SE.number(610),
					delivery_order_quantity: SE.string(
						'Delivery Order Quantity'
					),
				}),
			},
		},
	},
	'/report/sample-report-by-date': {
		get: {
			summary: 'Sample Report By Date',
			description: 'Sample Report By Date',
			tags: ['report'],
			operationId: 'selectSampleReportByDate',
			parameters: [
				SE.parameter_query('date', 'date', '2024-10-01'),
				SE.parameter_query('to_date', 'to_date', '2024-10-31'),
				SE.parameter_query('is_sample', 'is_sample', [0, 1]),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
				SE.parameter_query('show_zero_balance', 'show_zero_balance', [
					'0',
					'1',
				]),
			],
			responses: {
				200: SE.response_schema(200, {
					sample_order_no: SE.string('Sample Order No'),
					issue_date: SE.date_time(),
					status: SE.string('Status'),
					delivery_last_date: SE.date_time(),
					delivery_quantity: SE.number(610),
					order_quantity: SE.number(610),
					delivery_order_quantity: SE.string(
						'Delivery Order Quantity'
					),
				}),
			},
		},
	},
	'/report/sample-report-by-date-combined': {
		get: {
			summary: 'Sample Report By Date Combined',
			description: 'Sample Report By Date Combined',
			tags: ['report'],
			operationId: 'selectSampleReportByDateCombined',
			parameters: [
				SE.parameter_query('date', 'date', '2024-10-01'),
				SE.parameter_query('to_date', 'to_date', '2024-10-31'),
				SE.parameter_query('is_sample', 'is_sample', [0, 1]),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
			],
			responses: {
				200: SE.response_schema(200, {
					sample_order_no: SE.string('Sample Order No'),
					issue_date: SE.date_time(),
					status: SE.string('Status'),
					delivery_last_date: SE.date_time(),
					delivery_quantity: SE.number(610),
					order_quantity: SE.number(610),
					delivery_order_quantity: SE.string(
						'Delivery Order Quantity'
					),
				}),
			},
		},
	},
	'/report/thread/sample-report-by-date': {
		get: {
			summary: 'Thread Sample Report By Date',
			description: 'Thread Sample Report By Date',
			tags: ['report'],
			operationId: 'selectThreadSampleReportByDate',
			parameters: [
				SE.parameter_query('date', 'date', '2024-10-01'),
				SE.parameter_query('is_sample', 'is_sample', [0, 1]),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
			],
			responses: {
				200: SE.response_schema(200, {
					sample_order_no: SE.string('Sample Order No'),
					issue_date: SE.date_time(),
					status: SE.string('Status'),
					delivery_last_date: SE.date_time(),
					delivery_quantity: SE.number(610),
					order_quantity: SE.number(610),
					delivery_order_quantity: SE.string(
						'Delivery Order Quantity'
					),
				}),
			},
		},
	},
	'/report/cash-invoice-report': {
		get: {
			summary: 'Cash Invoice Report',
			description: 'Cash Invoice Report',
			tags: ['report'],
			operationId: 'selectCashInvoice',
			parameters: [],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					id: SE.string('ID'),
					value: SE.number(610),
					order_number: SE.string('Order Number'),
					receive_amount: SE.number(610),
				}),
			},
		},
	},
	'/report/thread-production-status-order-wise': {
		get: {
			summary: 'Thread Production Status Order Wise',
			description: 'Thread Production Status Order Wise',
			tags: ['report'],
			operationId: 'threadProductionStatusOrderWise',
			parameters: [
				SE.parameter_query('from', 'from', '2024-10-01'),
				SE.parameter_query('to', 'to', '2024-10-31'),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
				SE.parameter_query('status', 'status', [
					'completed',
					'pending',
				]),
			],
			responses: {
				200: SE.response_schema(200, {
					order_entry_uuid: SE.uuid(),
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Order Number'),
					order_created_at: SE.date_time(),
					order_updated_at: SE.date_time(),
					party_uuid: SE.uuid(),
					party_name: SE.string('Party Name'),
					marketing_uuid: SE.uuid(),
					marketing_name: SE.string('Marketing Name'),
					style: SE.string('Style'),
					color: SE.string('Color'),
					swatch_approval_date: SE.date_time(),
					count_length_uuid: SE.uuid(),
					count: SE.string('Count'),
					length: SE.string('Length'),
					total_quantity: SE.number(610),
					total_weight: SE.number(610),
					yarn_quantity: SE.number(610),
					total_coning_production_quantity: SE.number(610),
					warehouse: SE.number(610),
					total_delivery_delivered_quantity: SE.number(610),
					total_delivery_balance_quantity: SE.number(610),
					total_short_quantity: SE.number(610),
					total_reject_quantity: SE.number(610),
				}),
			},
		},
	},
	'/report/lab-dip': {
		get: {
			summary: 'lab dip data',
			description: 'lab dip data',
			tags: ['report'],
			operationId: 'selectLabDip',
			parameters: [],
			responses: {
				200: SE.response_schema(200, {
					info_id: SE.string('Info ID'),
					lab_dip_name: SE.string('Lab Dip Name'),
					lab_status: SE.number(610),
					recipe_id: SE.string('Recipe ID'),
					recipe_name: SE.string('Recipe Name'),
					recipe_status: SE.number(610),
					order_entry_created_at: SE.date_time(),
				}),
			},
		},
	},
	'/report/thread-production-report-by-date': {
		get: {
			summary: 'Thread Production Status By Date',
			description: 'Thread Production Status By Date',
			tags: ['report'],
			operationId: 'threadProductionReportByDate',
			parameters: [
				SE.parameter_query('date', 'date', '2024-10-01'),
				SE.parameter_query('own_uuid', 'own_uuid', '2024-10-01'),
			],
			responses: {
				200: SE.response_schema(200, {
					party_name: SE.string('Party Name'),
					total_quantity: SE.number(610),
					total_weight: SE.number(610),
					yarn_quantity: SE.number(610),
					total_coning_production_quantity: SE.number(610),
				}),
			},
		},
	},

	'/report/thread-production-report-party-wise-by-date': {
		get: {
			summary: 'Thread Production Status Party Wise By Date',
			description: 'Thread Production Status Party Wise By Date',
			tags: ['report'],
			operationId: 'threadProductionReportPartyWiseByDate',
			parameters: [
				SE.parameter_query('date', 'date', '2024-10-01'),
				SE.parameter_query('own_uuid', 'own_uuid', '2024-10-01'),
			],
			responses: {
				200: SE.response_schema(200, {
					party_name: SE.string('Party Name'),
					total_quantity: SE.number(610),
					total_weight: SE.number(610),
					yarn_quantity: SE.number(610),
					total_coning_production_quantity: SE.number(610),
				}),
			},
		},
	},
	'/report/item-zipper-number-end-wise-approved': {
		get: {
			summary: 'Item Zipper Number End Wise Approved',
			description: 'Item Zipper Number End Wise Approved',
			tags: ['report'],
			operationId: 'selectItemZipperEndApprovedQuantity',
			parameters: [],
			responses: {
				200: SE.response_schema(200, {
					item_name: SE.string('Item Name'),
					zipper_number_name: SE.string('Zipper Number Name'),
					end_type_name: SE.string('End Type Name'),
					not_approved: SE.number(610),
					approved: SE.number(610),
				}),
			},
		},
	},
	'/report/item-zipper-number-end-wise-swatch-approved': {
		get: {
			summary: 'Item Zipper Number End Wise Swatch Approved',
			description: 'Item Zipper Number End Wise Swatch Approved',
			tags: ['report'],
			operationId: 'selectItemZipperEndSwatchApprovedQuantity',
			parameters: [],
			responses: {
				200: SE.response_schema(200, {
					item_name: SE.string('Item Name'),
					zipper_number_name: SE.string('Zipper Number Name'),
					end_type_name: SE.string('End Type Name'),
					not_approved: SE.number(610),
					approved: SE.number(610),
				}),
			},
		},
	},
	'/report/order-sheet-pdf-report': {
		get: {
			summary: 'Order Sheet Pdf Report',
			description: 'Order Sheet Pdf Report',
			tags: ['report'],
			operationId: 'selectOrderSheetPdf',
			parameters: [
				SE.parameter_query('from_date', 'from_date', '2024-10-01'),
				SE.parameter_query('to_date', 'to_date', '2024-10-31'),
				SE.parameter_query('type', 'type', ['zipper', 'thread']),
				SE.parameter_query('marketing', 'marketing', SE.uuid()),
				SE.parameter_query('party', 'party', SE.uuid()),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
			],
			responses: {
				200: SE.response_schema(200, {
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Order Number'),
					party_name: SE.string('Party Name'),
					style: SE.string('Style'),
					color: SE.string('Color'),
					count: SE.string('Count'),
					length: SE.string('Length'),
					quantity: SE.number(610),
					weight: SE.number(610),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
					order_entry: SE.sub_response_schema({
						order_entry_uuid: SE.uuid(),
						style: SE.string('Item Name'),
						color: SE.string('End Type Name'),
						size: SE.string('Size'),
						quantity: SE.number(610),
						created_at: SE.date_time(),
						updated_at: SE.date_time(),
						index: SE.number(610),
						remarks: SE.string('Remarks'),
					}),
				}),
			},
		},
	},
	'/report/party-wise-approved-quantity': {
		get: {
			summary: 'Party Wise Approved Quantity',
			description: 'Party Wise Approved Quantity',
			tags: ['report'],
			operationId: 'selectPartyWiseApprovedQuantity',
			parameters: [],
			responses: {
				200: SE.response_schema(200, {
					party_name: SE.string('Party Name'),
					not_approved: SE.number(610),
					approved: SE.number(610),
				}),
			},
		},
	},
	'/report/challan-pdf-report/{order_info_uuid}': {
		get: {
			summary: 'Challan Pdf Report',
			description: 'Challan Pdf Report',
			tags: ['report'],
			operationId: 'selectChallanPdf',
			parameters: [
				SE.parameter_params(
					'order_info_uuid',
					'order_info_uuid',
					SE.uuid()
				),
				SE.parameter_query('from', 'from', '2024-10-01'),
				SE.parameter_query('to', 'to', '2024-10-31'),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
			],
			responses: {
				200: SE.response_schema(200, {
					uuid: SE.uuid(),
					challan_number: SE.string('ZC25-0001'),
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Z25-0001'),
					total_carton_quantity: SE.number(610),
					buyer_uuid: SE.uuid(),
					buyer_name: SE.string('Buyer Name'),
					party_uuid: SE.uuid(),
					party_name: SE.string('Party Name'),
					merchandiser_uuid: SE.uuid(),
					merchandiser_name: SE.string('Merchandiser Name'),
					factory_uuid: SE.uuid(),
					factory_name: SE.string('Factory Name'),
					factory_address: SE.string('Factory Address'),
					vehicle_uuid: SE.uuid(),
					vehicle_name: SE.string('Vehicle Name'),
					vehicle_driver_name: SE.string('Driver Name'),
					carton_quantity: SE.number(610),
					receive_status: SE.string('Receive Status'),
				}),
			},
		},
	},
	'/report/report-for-ed': {
		get: {
			summary: 'Report For ED',
			description: 'Report For ED',
			tags: ['report'],
			operationId: 'selectEDReport',
			parameters: [
				SE.parameter_query('from', 'from', '2024-10-01'),
				SE.parameter_query('to', 'to', '2024-10-31'),
			],
			responses: {
				200: SE.response_schema(200, {
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Order Number'),
					party_name: SE.string('Party Name'),
					style: SE.string('Style'),
					color: SE.string('Color'),
					count: SE.string('Count'),
					length: SE.string('Length'),
					quantity: SE.number(610),
					weight: SE.number(610),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
				}),
			},
		},
	},
	'/report/order-register-report/{order_info_uuid}': {
		get: {
			summary: 'Order Register Report',
			description: 'Order Register Report',
			tags: ['report'],
			operationId: 'selectOrderRegisterReport',
			parameters: [
				SE.parameter_params(
					'order_info_uuid',
					'order_info_uuid',
					SE.uuid()
				),
			],
			responses: {
				200: SE.response_schema(200, {
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Order Number'),
					party_name: SE.string('Party Name'),
					style: SE.string('Style'),
					color: SE.string('Color'),
					count: SE.string('Count'),
					length: SE.string('Length'),
					quantity: SE.number(610),
					weight: SE.number(610),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
				}),
			},
		},
	},
	'/report/order-register-report-for-packing-list/{order_info_uuid}': {
		get: {
			summary: 'Order Register Report for Packing List',
			description: 'Order Register Report for Packing List',
			tags: ['report'],
			operationId: 'selectOrderRegisterReportForPackingList',
			parameters: [
				SE.parameter_params(
					'order_info_uuid',
					'order_info_uuid',
					SE.uuid()
				),
			],
			responses: {
				200: SE.response_schema(200, {
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Order Number'),
					party_name: SE.string('Party Name'),
					style: SE.string('Style'),
					color: SE.string('Color'),
					count: SE.string('Count'),
					length: SE.string('Length'),
					quantity: SE.number(610),
					weight: SE.number(610),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
				}),
			},
		},
	},
	'/report/delivery-report': {
		get: {
			summary: 'Delivery Report',
			description: 'Delivery Report',
			tags: ['report'],
			operationId: 'selectDeliveryReportZipper',
			parameters: [
				SE.parameter_query('from', 'from', '2024-10-01'),
				SE.parameter_query('to', 'to', '2024-10-31'),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
				SE.parameter_query('order_type', 'order_type', [
					'all',
					'sample',
					'bulk',
				]),
			],
			responses: {
				200: SE.response_schema(200, {
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Order Number'),
					party_name: SE.string('Party Name'),
					style: SE.string('Style'),
					color: SE.string('Color'),
					count: SE.string('Count'),
					length: SE.string('Length'),
					quantity: SE.number(610),
					weight: SE.number(610),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
				}),
			},
		},
	},
	'/report/delivery-report-thread': {
		get: {
			summary: 'Delivery Report Thread',
			description: 'Delivery Report Thread',
			tags: ['report'],
			operationId: 'selectDeliveryReportThread',
			parameters: [
				SE.parameter_query('from', 'from', '2024-10-01'),
				SE.parameter_query('to', 'to', '2024-10-31'),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
				SE.parameter_query('order_type', 'order_type', [
					'all',
					'sample',
					'bulk',
				]),
			],
			responses: {
				200: SE.response_schema(200, {
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Order Number'),
					party_name: SE.string('Party Name'),
					style: SE.string('Style'),
					color: SE.string('Color'),
					count: SE.string('Count'),
					length: SE.string('Length'),
					quantity: SE.number(610),
					weight: SE.number(610),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
				}),
			},
		},
	},
	'/report/count-length-wise-delivery-report': {
		get: {
			summary: 'Count Length Wise Delivery Report',
			description: 'Count Length Wise Delivery Report',
			tags: ['report'],
			operationId: 'selectCountLengthWiseDeliveryReport',
			parameters: [
				SE.parameter_query('from', 'from', '2024-10-01'),
				SE.parameter_query('to', 'to', '2024-10-31'),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
			],
			responses: {
				200: SE.response_schema(200, {
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Order Number'),
					party_name: SE.string('Party Name'),
					style: SE.string('Style'),
					color: SE.string('Color'),
					count: SE.string('Count'),
					length: SE.string('Length'),
					quantity: SE.number(610),
					weight: SE.number(610),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
				}),
			},
		},
	},
	'/report/packing-list-report': {
		get: {
			summary: 'Packing List Report',
			description: 'Packing List Report',
			tags: ['report'],
			operationId: 'selectPackingListReport',
			parameters: [
				SE.parameter_query('from_date', 'from_date', '2024-10-01'),
				SE.parameter_query('to_date', 'to_date', '2024-10-31'),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
				SE.parameter_query('order_type', 'order_type', [
					'all',
					'sample',
					'bulk',
				]),
				SE.parameter_query('type', 'type', [
					'pending',
					'challan',
					'gate_pass',
				]),
				SE.parameter_query('item_type', 'item_type', [
					'zipper_sample',
					'zipper_bulk',
					'all',
				]),
			],
			responses: {
				200: SE.response_schema(200, {
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Order Number'),
					party_name: SE.string('Party Name'),
					style: SE.string('Style'),
					color: SE.string('Color'),
					count: SE.string('Count'),
					length: SE.string('Length'),
					quantity: SE.number(610),
					weight: SE.number(610),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
				}),
			},
		},
	},
	'/report/item-wise-production-report': {
		get: {
			summary: 'Item Wise Production Report',
			description: 'Item Wise Production Report',
			tags: ['report'],
			operationId: 'selectItemWiseProductionReport',
			parameters: [
				SE.parameter_query('from', 'from', '2024-10-01'),
				SE.parameter_query('to', 'to', '2024-10-31'),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
			],
			responses: {
				200: SE.response_schema(200, {
					item_name: SE.string('Item Name'),
					total_production: SE.number(610),
				}),
			},
		},
	},
	'/report/item-zipper-end-wise-production-report': {
		get: {
			summary: 'Item Zipper End Wise Production Report',
			description: 'Item Zipper End Wise Production Report',
			tags: ['report'],
			operationId: 'selectItemZipperEndWiseProductionReport',
			parameters: [
				SE.parameter_query('from', 'from', '2024-10-01'),
				SE.parameter_query('to', 'to', '2024-10-31'),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
			],
			responses: {
				200: SE.response_schema(200, {
					item_name: SE.string('Item Name'),
					zipper_number_name: SE.string('Zipper Number Name'),
					end_type_name: SE.string('End Type Name'),
					total_production: SE.number(610),
				}),
			},
		},
	},
	'/report/product-wise-consumption-report': {
		get: {
			summary: 'Product Wise Consumption Report',
			description: 'Product Wise Consumption Report',
			tags: ['report'],
			operationId: 'selectProductWiseConsumptionReport',
			parameters: [
				SE.parameter_query(
					'type',
					'type',
					['nylon_plastic', 'nylon', 'vislon', 'metal', 'all'],
					true
				),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
				SE.parameter_query('from_date', 'from_date', '2024-10-01'),
				SE.parameter_query('to_date', 'to_date', '2024-10-31'),
			],
			responses: {
				200: SE.response_schema(200, {
					product_name: SE.string('Product Name'),
					total_consumption: SE.number(610),
				}),
			},
		},
	},
	'/report/product-wise-consumption-for-order-report': {
		get: {
			summary: 'Product Wise Consumption For Order Report',
			description: 'Product Wise Consumption For Order Report',
			tags: ['report'],
			operationId: 'selectProductWiseConsumptionForOrder',
			parameters: [
				SE.parameter_query(
					'type',
					'type',
					['nylon_plastic', 'nylon', 'vislon', 'metal', 'all'],
					true
				),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
				SE.parameter_query('from_date', 'from_date', '2024-10-01'),
				SE.parameter_query('to_date', 'to_date', '2024-10-31'),
			],
			responses: {
				200: SE.response_schema(200, {
					product_name: SE.string('Product Name'),
					total_consumption: SE.number(610),
				}),
			},
		},
	},
	'/report/thread-batch-report': {
		get: {
			summary: 'Thread Batch Report',
			description: 'Thread Batch Report',
			tags: ['report'],
			operationId: 'selectThreadBatchReport',
			parameters: [
				SE.parameter_query('from', 'from', '2024-10-01'),
				SE.parameter_query('to', 'to', '2024-10-31'),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
			],
			responses: {
				200: SE.response_schema(200, {
					batch_number: SE.string('Batch Number'),
					production_date: SE.date_time(),
					production_quantity: SE.number(610),
					production_value: SE.number(101555),
					production_status: SE.string('Production Status'),
					production_type: SE.string('Production Type'),
					production_remarks: SE.string('Production Remarks'),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
				}),
			},
		},
	},
	'/report/order-sheet-send-receive-report': {
		get: {
			summary: 'Order Sheet Send Receive Report',
			description: 'Order Sheet Send Receive Report',
			tags: ['report'],
			operationId: 'selectOrderSheetSendReceiveReport',
			parameters: [
				SE.parameter_query('from_date', 'from_date', '2024-10-01'),
				SE.parameter_query('to_date', 'to_date', '2024-10-31'),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
				SE.parameter_query('date_type', 'date_type', [
					'sno',
					'factory',
				]),
			],
			responses: {
				200: SE.response_schema(200, {
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Order Number'),
					party_name: SE.string('Party Name'),
					style: SE.string('Style'),
					color: SE.string('Color'),
					count: SE.string('Count'),
					length: SE.string('Length'),
					quantity: SE.number(610),
					weight: SE.number(610),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
				}),
			},
		},
	},
	'/report/order-sheet-send-receive-report-thread': {
		get: {
			summary: 'Order Sheet Send Receive Report Thread',
			description: 'Order Sheet Send Receive Report Thread',
			tags: ['report'],
			operationId: 'selectOrderSheetSendReceiveReportThread',
			parameters: [
				SE.parameter_query('from_date', 'from_date', '2024-10-01'),
				SE.parameter_query('to_date', 'to_date', '2024-10-31'),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
				SE.parameter_query('date_type', 'date_type', [
					'sno',
					'factory',
				]),
			],
			responses: {
				200: SE.response_schema(200, {
					order_info_uuid: SE.uuid(),
					order_number: SE.string('Order Number'),
					party_name: SE.string('Party Name'),
					style: SE.string('Style'),
					color: SE.string('Color'),
					count: SE.string('Count'),
					length: SE.string('Length'),
					quantity: SE.number(610),
					weight: SE.number(610),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
				}),
			},
		},
	},
	'/report/item-marketing-wise-order-quantity': {
		get: {
			summary: 'Item Marketing Wise Order Quantity',
			description: 'Item Marketing Wise Order Quantity',
			tags: ['report'],
			operationId: 'selectItemMarketingWiseOrderQuantity',
			parameters: [
				SE.parameter_query('from_date', 'from_date', '2024-10-01'),
				SE.parameter_query('to_date', 'to_date', '2024-10-31'),
			],
			responses: {
				200: SE.response_schema(200, {
					item_name: SE.string('Item Name'),
					type: SE.string('type'),
					marketing: SE.sub_response_schema({
						marketing_uuid: SE.uuid(),
						marketing_name: SE.string('Marketing Name'),
					}),
				}),
			},
		},
	},
	'/report/zipper-batch-report': {
		get: {
			summary: 'Zipper Batch Report',
			description: 'Zipper Batch Report',
			tags: ['report'],
			operationId: 'selectZipperProductionReport',
			parameters: [
				SE.parameter_query('from', 'from', '2024-10-01'),
				SE.parameter_query('to', 'to', '2024-10-31'),
				SE.parameter_query('order_type', 'order_type', [
					'bulk',
					'sample',
					'all',
				]),
				SE.parameter_query('filter_type', 'filter_type', [
					'dyeing_status_date',
					'received_date',
				]),
			],
			responses: {
				200: SE.response_schema(200, {
					item_name: SE.string('Item Name'),
					total_production: SE.number(610),
				}),
			},
		},
	},
	'/report/order-item-type-wise-status': {
		get: {
			summary: 'Order Item Type Wise Status',
			description: 'Order Item Type Wise Status',
			tags: ['report'],
			operationId: 'selectOrderItemTypeWiseStatus',
			parameters: [
				SE.parameter_query(
					'order_type',
					'order_type',
					['sample', 'bulk', 'all'],
					true
				),
				SE.parameter_query(
					'item_type',
					'item_type',
					['zipper', 'thread', 'all'],
					true
				),
				SE.parameter_query(
					'status',
					'status',
					['pending', 'processing', 'complete', 'all'],
					true
				),
			],
			responses: {
				200: SE.response_schema(200, {
					item_name: SE.string('Item Name'),
					status: SE.string('Status'),
					quantity: SE.number(610),
					created_at: SE.date_time(),
					updated_at: SE.date_time(),
				}),
			},
		},
	},
	'/report/lc-fortnight-report': {
		get: {
			summary: 'LC Fortnight Report',
			description: 'LC Fortnight Report',
			tags: ['report'],
			operationId: 'selectLcFortnightReport',
			parameters: [
				SE.parameter_query('handover', 'handover', ['true', 'false']),
				SE.parameter_query('acceptance', 'acceptance', [
					'true',
					'false',
				]),
				SE.parameter_query('maturity', 'maturity', ['true', 'false']),
			],
			responses: {
				200: SE.response_schema(200, {
					lc_number: SE.string('LC Number'),
					lc_date: SE.string('LC Date'),
					currency: SE.string('Currency'),
					lc_value: SE.number(610),
					opening_balance: SE.number(610),
					import_amount: SE.number(610),
					payment_amount: SE.number(610),
					closing_balance: SE.number(610),
				}),
			},
		},
	},
	'/report/lc-payment-report': {
		get: {
			summary: 'LC Payment Report',
			description: 'LC Payment Report',
			tags: ['report'],
			operationId: 'selectLcPaymentReport',
			parameters: [
				SE.parameter_query('date', 'date', '2024-10-01'),
				SE.parameter_query('report_type', 'report_type', [
					'over_due',
					'current',
					'push',
				]),
			],
			responses: {
				200: SE.response_schema(200, {
					lc_number: SE.string('LC Number'),
					payment_date: SE.string('Payment Date'),
					payment_amount: SE.number(610),
					payment_method: SE.string('Payment Method'),
					bank_name: SE.string('Bank Name'),
					cheque_number: SE.string('Cheque Number'),
					remarks: SE.string('Remarks'),
				}),
			},
		},
	},
	'/report/acc-balance-report': {
		get: {
			summary: 'Account Balance Report',
			description: 'Account Balance Report',
			tags: ['report'],
			operationId: 'selectAccBalanceReport',
			parameters: [
				SE.parameter_query('from', 'from', '2024-10-01'),
				SE.parameter_query('to', 'to', ['2024-10-31']),
				SE.parameter_query('type', 'type', [
					'balance_sheet',
					'profit_and_loss',
				]),
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
			],
			responses: {
				200: SE.response_schema(200, {
					account_name: SE.string('Account Name'),
					balance: SE.number(610),
					account_type: SE.string('Account Type'),
				}),
			},
		},
	},
	'/report/chart-of-accounts': {
		get: {
			summary: 'Chart of Accounts',
			description: 'Chart of Accounts',
			tags: ['report'],
			operationId: 'selectChartOfAccounts',
			parameters: [
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
				SE.parameter_query('type', 'type', ['detail', 'summary']),
			],
			responses: {
				200: SE.response_schema(200, {
					account_name: SE.string('Account Name'),
					account_type: SE.string('Account Type'),
					balance: SE.number(610),
					parent_account: SE.string('Parent Account'),
					purchase_description_remarks: SE.string(
						'Purchase Description Remarks'
					),
					sale_description_remarks: SE.string(
						'Sale Description Remarks'
					),
				}),
			},
		},
	},
	'/report/chart-of-accounts-table-view': {
		get: {
			summary: 'Chart of Accounts Table View',
			description: 'Chart of Accounts Table View',
			tags: ['report'],
			operationId: 'selectChartOfAccountsTableView',
			parameters: [
				SE.parameter_query('own_uuid', 'own_uuid', SE.uuid()),
				SE.parameter_query('type', 'type', ['detail', 'summary']),
			],
			responses: {
				200: SE.response_schema(200, {
					account_name: SE.string('Account Name'),
					account_type: SE.string('Account Type'),
					balance: SE.number(610),
					parent_account: SE.string('Parent Account'),
					purchase_description_remarks: SE.string(
						'Purchase Description Remarks'
					),
					sale_description_remarks: SE.string(
						'Sale Description Remarks'
					),
				}),
			},
		},
	},
	'/report/utility-report': {
		get: {
			summary: 'Utility Report',
			description: 'Utility Report',
			tags: ['report'],
			operationId: 'selectUtilityReport',
			parameters: [
				SE.parameter_query('month', 'month', 'January'),
				SE.parameter_query('year', 'year', '2024'),
			],
			responses: {
				200: SE.response_schema(200, {
					date: SE.date_time(),
					type: SE.string('Utility Type'),
					current_reading: SE.number(610),
					consumption_reading: SE.number(610),
					consumption_cost: SE.number(610),
				}),
			},
		},
	},
	'/report/market-report': {
		get: {
			summary: 'Market Report',
			description: 'Market Report',
			tags: ['report'],
			operationId: 'selectMarketReport',
			parameters: [
				SE.parameter_query('from_date', 'from_date', '2025-10-01'),
				SE.parameter_query('to_date', 'to_date', '2025-10-15'),
			],
			responses: {
				200: SE.response_schema(200, {
					market_name: SE.string('Market Name'),
					price: SE.number(610),
					quantity: SE.number(610),
				}),
			},
		},
	},
	'/market-report-archive': {
		post: {
			summary: 'Generate market report snapshot',
			description:
				'Generate and save a market report snapshot for a specific date range',
			tags: ['report.market_report_archive'],
			body: {
				type: 'object',
				required: ['from_date', 'to_date'],
				properties: {
					from_date: { type: 'string', format: 'date' },
					to_date: { type: 'string', format: 'date' },
					report_name: { type: 'string' },
					remarks: { type: 'string' },
				},
			},
			response: {
				201: SE.response_schema(201, {}),
				400: SE.response_schema(400),
			},
		},
		get: {
			summary: 'List market report snapshots',
			description: 'Get all market report snapshots (excluding deleted)',
			tags: ['report.market_report_archive'],
			querystring: {
				type: 'object',
				properties: {
					status: {
						type: 'string',
						enum: ['pending', 'confirmed'],
					},
				},
			},
			response: {
				200: SE.response_schema(200, {}),
			},
		},
	},
	'/market-report-archive/{uuid}': {
		get: {
			summary: 'Get market report snapshot',
			description: 'Get a specific market report snapshot with full data',
			tags: ['report.market_report_archive'],
			params: {
				type: 'object',
				required: ['uuid'],
				properties: {
					uuid: { type: 'string', format: 'uuid' },
				},
			},
			response: {
				200: SE.response_schema(200, {}),
				404: SE.response_schema(404),
			},
		},
		put: {
			summary: 'Update market report snapshot',
			description: 'Update report name or remarks',
			tags: ['report.market_report_archive'],
			params: {
				type: 'object',
				required: ['uuid'],
				properties: {
					uuid: { type: 'string', format: 'uuid' },
				},
			},
			body: {
				type: 'object',
				properties: {
					report_name: { type: 'string' },
					remarks: { type: 'string' },
				},
			},
			response: {
				200: SE.response_schema(200, {}),
				404: SE.response_schema(404),
			},
		},
		delete: {
			summary: 'Delete market report snapshot',
			description: 'Soft delete a market report snapshot',
			tags: ['report.market_report_archive'],
			params: {
				type: 'object',
				required: ['uuid'],
				properties: {
					uuid: { type: 'string', format: 'uuid' },
				},
			},
			response: {
				200: SE.response_schema(200, {}),
				404: SE.response_schema(404),
			},
		},
	},
	'/market-report-archive/:uuid/confirm': {
		put: {
			summary: 'Confirm market report snapshot',
			description: 'Confirm/keep a market report snapshot',
			tags: ['report.market_report_archive'],
			params: {
				type: 'object',
				required: ['uuid'],
				properties: {
					uuid: { type: 'string', format: 'uuid' },
				},
			},
			body: {
				type: 'object',
				properties: {
					remarks: { type: 'string' },
				},
			},
			response: {
				200: SE.response_schema(200, {}),
				404: SE.response_schema(404),
			},
		},
	},
};
