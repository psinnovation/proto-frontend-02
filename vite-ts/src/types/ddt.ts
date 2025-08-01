import type { IDateValue, IAddressItem, IDatePickerControl } from './common'; 

/*export interface DdtItemInfo {
  code: string;
  description: string;
}

export interface DdtShipment {
  id: number;
  batches: string;
  pallets: number;
}

export interface DdtLoad {
  amount: number;
  pieces: number;
  netWeight: number;
  grossWeight: number;
}

export interface DdtOrder {
  number: number;
  lineNumber: number;
}

export interface DdtRow {
  id: number;
  creationTimestamp: string;
  customerCode: string;
  movementType: string;
  order: DdtOrder;
  item: DdtItemInfo;
  shipment: DdtShipment;
  load: DdtLoad;
  serialNumbers: string;
  notes: string;
}

export interface DdtTableData {
  page: number;
  pageSize: number;
  totalItems: number;
  data: DdtRow[];
}

export interface IDdtItem {
  id: number;
  data: string;
  tipo: string;
  spedizione: number;
  prgOrdine: number;
  prgRiga: number;
  codice: string;
  descrizione: string;
}

export interface IImportResult extends IDdtItem {
  status: 'success' | 'error';
  messaggio: string;
}

// --- STATO DELLO SLICE ---
// Questo è lo stato che verrà gestito da Redux.
export interface IImportDdtState {
  ddtsToImport: IDdtItem[];
  importResults: IImportResult[];
  lastImportTimestamp: string | null;
  // Lo stato del processo: idle (in attesa), loading (scaricando i DDT),
  // ready (pronto per l'import), importing (importazione in corso), completed (concluso)
  status: 'idle' | 'loading' | 'ready' | 'importing' | 'completed';
  error: string | null;
} */

// ---------------------------------------------------------------------------------------------------------------------
export type IDdtTableFilters = {
  name: string;
  status: string;
  shipments: string[];
  orders: string[];
};

export type IDdtItem = {
  id: string;
  title: string;
  price: number;
  total: number;
  service: string;
  quantity: number;
  description: string;
};

export type IDdt = {
  id: string;
  sent?: number;
  taxes?: number;
  status: string;
  subtotal?: number;
  discount?: number;
  shipping?: number;
  totalAmount: number;
  dueDate?: IDateValue;
  items: IDdtItem[];
  createDate: IDateValue;
  invoiceTo: IAddressItem;
  invoiceFrom?: IAddressItem;
  movementType?: string; // Optional, as not all DDTs may have this
  order?: {
    number?: number; // Optional, as not all DDTs may have this
    lineNumber?: number; // Optional, as not all DDTs may have this
  },
  item?: {
    code?: string; // Optional, as not all DDTs may have this
    description?: string; // Optional, as not all DDTs may have this
  },
  shipment?: {
    id?: number; // Optional, as not all DDTs may have this
    batches?: string; // Optional, as not all DDTs may have this
    pallets?: number; // Optional, as not all DDTs may have this
  },
  load?: {
    amount?: number; // Optional, as not all DDTs may have this
    pieces?: number; // Optional, as not all DDTs may have this
    netWeight?: number; // Optional, as not all DDTs may have this
    grossWeight?: number; // Optional, as not all DDTs may have this
  }
}