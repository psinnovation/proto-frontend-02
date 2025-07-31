import { fSub, fAdd } from 'src/utils/format-time';

import { _mock } from './_mock';
import { _tags } from './assets';
import { _addressBooks } from './_others';

// ----------------------------------------------------------------------

const ddtMockData = [
    {
        "id": 14,
        "creationTimestamp": "2017-07-11T15:17:37.68Z",
        "customerCode": "",
        "movementType": "SC",
        "order": {
            "number": 965,
            "lineNumber": 1
        },
        "item": {
            "code": "PL0058SG",
            "description": "KL-7400"
        },
        "shipment": {
            "id": 10044,
            "batches": "PL17000376 PL17050316 ",
            "pallets": 4
        },
        "load": {
            "amount": 4800,
            "pieces": 4,
            "netWeight": 4800,
            "grossWeight": 6000
        },
        "serialNumbers": "",
        "notes": ""
    },
    {
        "id": 16,
        "creationTimestamp": "2017-07-11T15:22:28.243Z",
        "customerCode": "",
        "movementType": "SC",
        "order": {
            "number": 644,
            "lineNumber": 269
        },
        "item": {
            "code": "PS0018M90",
            "description": "LUX BIANCA   90X40X500"
        },
        "shipment": {
            "id": 10040,
            "batches": "PS17000465 PS17000466 ",
            "pallets": 7
        },
        "load": {
            "amount": 492,
            "pieces": 18,
            "netWeight": 2805,
            "grossWeight": 3358
        },
        "serialNumbers": "",
        "notes": ""
    },
    {
        "id": 17,
        "creationTimestamp": "2017-07-11T15:22:28.243Z",
        "customerCode": "",
        "movementType": "SC",
        "order": {
            "number": 644,
            "lineNumber": 275
        },
        "item": {
            "code": "PS0052M60",
            "description": "L5 60X40X500"
        },
        "shipment": {
            "id": 10040,
            "batches": "PS17000470 ",
            "pallets": 7
        },
        "load": {
            "amount": 264,
            "pieces": 11,
            "netWeight": 2805,
            "grossWeight": 3358
        },
        "serialNumbers": "",
        "notes": ""
    },
    {
        "id": 18,
        "creationTimestamp": "2017-07-11T15:22:28.243Z",
        "customerCode": "",
        "movementType": "SC",
        "order": {
            "number": 644,
            "lineNumber": 280
        },
        "item": {
            "code": "PS0044M50",
            "description": "UKS-1190 50X40X500"
        },
        "shipment": {
            "id": 10040,
            "batches": "PS17000469 ",
            "pallets": 7
        },
        "load": {
            "amount": 550,
            "pieces": 22,
            "netWeight": 2805,
            "grossWeight": 3358
        },
        "serialNumbers": "",
        "notes": ""
    },
    {
        "id": 19,
        "creationTimestamp": "2017-07-11T15:22:28.243Z",
        "customerCode": "",
        "movementType": "SC",
        "order": {
            "number": 644,
            "lineNumber": 281
        },
        "item": {
            "code": "PS0060M50",
            "description": "L1 50X40X500"
        },
        "shipment": {
            "id": 10040,
            "batches": "PS17000471 ",
            "pallets": 7
        },
        "load": {
            "amount": 299,
            "pieces": 13,
            "netWeight": 2805,
            "grossWeight": 3358
        },
        "serialNumbers": "",
        "notes": ""
    },
    {
        "id": 20,
        "creationTimestamp": "2017-07-11T15:22:28.243Z",
        "customerCode": "",
        "movementType": "SC",
        "order": {
            "number": 644,
            "lineNumber": 282
        },
        "item": {
            "code": "PL0020",
            "description": "PR-22"
        },
        "shipment": {
            "id": 10040,
            "batches": "PL17060332 ",
            "pallets": 7
        },
        "load": {
            "amount": 1200,
            "pieces": 24,
            "netWeight": 2805,
            "grossWeight": 3358
        },
        "serialNumbers": "",
        "notes": ""
    },
    {
        "id": 21,
        "creationTimestamp": "2017-07-11T16:12:40.46Z",
        "customerCode": "",
        "movementType": "SC",
        "order": {
            "number": 981,
            "lineNumber": 1
        },
        "item": {
            "code": "PL0030",
            "description": "PL0030"
        },
        "shipment": {
            "id": 10045,
            "batches": "PL17050292 ",
            "pallets": 1
        },
        "load": {
            "amount": 450,
            "pieces": 18,
            "netWeight": 474,
            "grossWeight": 997
        },
        "serialNumbers": "",
        "notes": ""
    },
    {
        "id": 22,
        "creationTimestamp": "2017-07-11T16:12:40.46Z",
        "customerCode": "",
        "movementType": "SC",
        "order": {
            "number": 981,
            "lineNumber": 2
        },
        "item": {
            "code": "PL0007",
            "description": "EUROPOWER 8300"
        },
        "shipment": {
            "id": 10045,
            "batches": "",
            "pallets": 1
        },
        "load": {
            "amount": 24,
            "pieces": 0,
            "netWeight": 474,
            "grossWeight": 997
        },
        "serialNumbers": "",
        "notes": ""
    },
    {
        "id": 23,
        "creationTimestamp": "2017-07-11T16:25:26.883Z",
        "customerCode": "",
        "movementType": "SC",
        "order": {
            "number": 982,
            "lineNumber": 1
        },
        "item": {
            "code": "PL0002SG",
            "description": "MV-R"
        },
        "shipment": {
            "id": 10046,
            "batches": "PL17050302 ",
            "pallets": 1
        },
        "load": {
            "amount": 1200,
            "pieces": 1,
            "netWeight": 1200,
            "grossWeight": 2400
        },
        "serialNumbers": "",
        "notes": ""
    },
    {
        "id": 24,
        "creationTimestamp": "2017-07-11T16:30:12.48Z",
        "customerCode": "",
        "movementType": "SC",
        "order": {
            "number": 979,
            "lineNumber": 1
        },
        "item": {
            "code": "PL0054",
            "description": "PL0054"
        },
        "shipment": {
            "id": 10042,
            "batches": "PL17000349 ",
            "pallets": 1
        },
        "load": {
            "amount": 105,
            "pieces": 7,
            "netWeight": 105,
            "grossWeight": 210
        },
        "serialNumbers": "",
        "notes": ""
    }
];

// ----------------------------------------------------------------------

export const DDT_STATUS_OPTIONS = [
    { value: 'success', label: 'Success' },
    { value: 'error', label: 'Error' }
];

export const DDT_SERVICE_OPTIONS = Array.from({ length: 8 }, (_, index) => ({
    id: `${index}`,
    name: `Service ${index}`,
    price: 0
}));

// ----------------------------------------------------------------------

// Build IInvoice-compatible array from static DDT data, preserving applyFilter behavior
export const _ddt = ddtMockData.map((ddt, index) => {
    const status =
        (index % 2 && 'success') || (index % 3 && 'success') || (index % 4 && 'error') || 'error';

    return {
        id: ddt.id.toString(),
        status,
        totalAmount: ddt.load.amount,    // use load.amount as amount
        items: [],                       // service-filter-safe empty array
        invoiceTo: {                     // dummy fields for name-filter
            name: '',
            company: '',
            phoneNumber: '',
            fullAddress: '',
        },
        createDate: ddt.creationTimestamp, // for date-filter
        movementType: ddt.movementType, // for service-filter
        shipment: ddt.shipment,
        order: ddt.order,
        item: ddt.item,
    }
});