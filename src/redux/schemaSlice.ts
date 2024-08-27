import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import { SchemaHash, SchemaState, SchemaHashOpt, COLUMN_TYPE, HEAD, TAIL, SchemaColumnNode, NODE_TYPE, SchemaRowNode, SchemaTextNodeAlign } from './types';

const createHash = (type: NODE_TYPE): SchemaHash => {
  return `${type}${Date.now()}`
}

const newRowSchema = (): SchemaRowNode => ({
  type: NODE_TYPE.ROW,
  next: null,
  children: []
});

const newColumnSchema = (type: COLUMN_TYPE, parent: SchemaHash): SchemaColumnNode => {
  switch (type) {
    case COLUMN_TYPE.IMAGE:
      return {
        type: NODE_TYPE.COLUMN,
        parent,
        content: {
          type,
          value: ''
        }
      }

    case COLUMN_TYPE.TEXT:
      return {
        type: NODE_TYPE.COLUMN,
        parent,
        content: {
          type,
          value: ''
        },
        options: {
          align: 'left'
        }
      }

    default:
      return {
        type: NODE_TYPE.COLUMN,
        parent,
        content: {
          type: COLUMN_TYPE.EMPTY,
          value: ''
        }
      }
  }
};

let initialState: SchemaState = {
  [HEAD]: null,
  [TAIL]: null,
  selected: null,
  elements: {}
};

export const STORAGE_KEY = 'khabarov_editor';
const storageData = localStorage.getItem(STORAGE_KEY);

if (storageData) {
  try {
    initialState = JSON.parse(storageData);
  } catch { }
}

const schemaSlice = createSlice({
  name: 'schema',
  initialState,
  reducers: {
    setSelected: (state, action: PayloadAction<SchemaHashOpt>) => {
      state.selected = action.payload;
    },
    addRow: (state) => {
      const newHash = createHash(NODE_TYPE.ROW);
      const newRow = newRowSchema();

      if (state[HEAD] === null) {
        state[HEAD] = newHash;
        state[TAIL] = newHash;
        state.elements[newHash] = newRow;
        state.selected = newHash;
      } else {
        const tailHash = state[TAIL];

        if (tailHash) {
          let current = state.elements[tailHash] as SchemaRowNode;

          current.next = newHash;
          state.elements[newHash] = newRow;
          state[TAIL] = newHash;
          state.selected = newHash;
        }
      }
    },
    addColumn: (state) => {
      let parentHash = state.selected;
      const selected = parentHash && state.elements[parentHash];
      const newColHash = createHash(NODE_TYPE.COLUMN);
      let target;

      if (selected) {
        if (selected.type === NODE_TYPE.ROW) {
          target = selected;
        } else if (selected.type === NODE_TYPE.COLUMN) {
          target = state.elements[selected.parent] as SchemaRowNode;
          parentHash = selected.parent;
        }
      }

      if (target) {
        target.children.push(newColHash);
        state.elements[newColHash] = newColumnSchema(COLUMN_TYPE.EMPTY, parentHash!);
        state.selected = newColHash;
      }
    },
    changeColumnValue: (state, action: PayloadAction<string>) => {
      const { elements, selected } = state;

      if (selected) {
        const current = elements[selected];
        if (current && current.type === NODE_TYPE.COLUMN) {
          current.content.value = action.payload;

        }
      }
    },
    changeColumnType: (state, action: PayloadAction<COLUMN_TYPE>) => {
      const { elements, selected } = state;

      if (selected) {
        if (elements[selected] && elements[selected].type === NODE_TYPE.COLUMN) {
          elements[selected] = newColumnSchema(action.payload, (elements[selected] as SchemaColumnNode).parent);
        }
      }
    },
    changeColumnTextAlign: (state, action: PayloadAction<SchemaTextNodeAlign>) => {
      const { elements, selected } = state;

      if (selected) {
        const current = elements[selected];

        if (current && current.type === NODE_TYPE.COLUMN) {
          current.options = {
            ...current.options,
            align: action.payload
          };
        }
      }
    }
  }
});

export const { addRow, addColumn, changeColumnValue, changeColumnType, changeColumnTextAlign, setSelected } = schemaSlice.actions;
export const selectSelected = (state: RootState) => state.schema.selected;
export const selectElements = (state: RootState) => state.schema.elements;
export const selectHead = (state: RootState) => state.schema.head;

export default schemaSlice.reducer;