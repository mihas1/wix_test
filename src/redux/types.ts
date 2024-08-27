export type SchemaHash = string; // `row${id}`, `column${id}`
export type SchemaHashOpt = SchemaHash | null;

export const HEAD = 'head';
export const TAIL = 'tail';

export enum NODE_TYPE {
  ROW = 'row',
  COLUMN = 'column'
}

export enum COLUMN_TYPE {
  EMPTY = 'empty',
  TEXT = 'text',
  IMAGE = 'image',
}

export type SchemaTextNodeAlign = 'left' | 'right' | 'center';

export type SchemaRowNode = {
  type: NODE_TYPE.ROW,
  next: SchemaHashOpt,
  children: SchemaHash[]
} 

export type SchemaColumnNode = {
  type: NODE_TYPE.COLUMN,
  parent: SchemaHash,
  content: {
    type: COLUMN_TYPE,
    value: string
  },
  options?: {
    align: SchemaTextNodeAlign
  }
}

export type SchemaNode = SchemaRowNode | SchemaColumnNode;

export interface SchemaState {
  [HEAD]: SchemaHashOpt;
  [TAIL]: SchemaHashOpt;
  selected: SchemaHashOpt;
  elements: {
    [key: SchemaHash]: SchemaNode;
  };
}