import { FC, useEffect, useMemo, useState } from "react";
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { COLUMN_TYPE, NODE_TYPE, SchemaTextNodeAlign } from '../../redux/types'
import {
  addRow,
  addColumn,
  changeColumnType,
  changeColumnTextAlign,
  selectSelected,
  selectElements,
  changeColumnValue
} from '../../redux/schemaSlice';

import { Icons } from "../icons";

export const Properties: FC = () => {
  const dispatch = useAppDispatch();

  const selected = useAppSelector(selectSelected);
  const elements = useAppSelector(selectElements);

  const current = useMemo(() =>
    selected ? elements[selected] : null, [selected, elements]);

  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
    console.log(event.target.value);
  };

  useEffect(() => {
    if (current?.type === NODE_TYPE.COLUMN) {
      setInputValue(current.content.value);
    }
  }, [current]);

  useEffect(() => {
    dispatch(changeColumnValue(inputValue));
  }, [inputValue, dispatch]);

  const clickAddRow = () => {
    dispatch(addRow());
  };

  const clickAddColumn = () => {
    dispatch(addColumn());
  };

  const setColumnType = (type: COLUMN_TYPE) => {
    dispatch(changeColumnType(type))
  };

  const setColumnTextAlign = (align: SchemaTextNodeAlign) => {
    dispatch(changeColumnTextAlign(align));
  };

  if (!current) {
    return (
      <div className="properties">
        <div className="section">
          <div className="section-header">Page</div>
          <div className="actions">
            <button className="action" onClick={clickAddRow}>Add row</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="properties">
      <div className="section">
        <div className="section-header">Page</div>
        <div className="actions">
          <button className="action" onClick={clickAddRow}>Add row</button>
        </div>
      </div>

      <div className="section">
        <div className="section-header">Row</div>
        <div className="actions">
          <button className="action" onClick={clickAddColumn}>Add column</button>
        </div>
      </div>

      {current.type === NODE_TYPE.COLUMN && (
        <div className="section">
          <div className="section-header">Column</div>
          <div className="button-group-field">
            <label>Contents</label>
            <div className="button-group">
              <button
                className={current.content.type === COLUMN_TYPE.TEXT ? 'selected' : ''}
                onClick={() => setColumnType(COLUMN_TYPE.TEXT)}
              >
                <Icons.Text />
              </button>
              <button
                className={current.content.type === COLUMN_TYPE.IMAGE ? 'selected' : ''}
                onClick={() => setColumnType(COLUMN_TYPE.IMAGE)}
              >
                <Icons.Image />
              </button>
            </div>
          </div>
        </div>
      )}

      {'content' in current ? (
        <>
          {current.content.type === COLUMN_TYPE.TEXT && (
            <div className="section">
              <div className="section-header">Text</div>
              <div className="button-group-field">
                <label>Alignment</label>
                <div className="button-group">
                  <button
                    className={current.options?.align === 'left' ? 'selected' : ''}
                    onClick={() => setColumnTextAlign('left')}
                  >
                    <Icons.TextAlignLeft />
                  </button>
                  <button
                    className={current.options?.align === 'center' ? 'selected' : ''}
                    onClick={() => setColumnTextAlign('center')}
                  >
                    <Icons.TextAlignCenter />
                  </button>
                  <button
                    className={current.options?.align === 'right' ? 'selected' : ''}
                    onClick={() => setColumnTextAlign('right')}
                  >
                    <Icons.TextAlignRight />
                  </button>
                </div>
              </div>
              <div className="textarea-field">
                <textarea
                  rows={8}
                  placeholder="Enter text"
                  onChange={handleInputChange}
                  value={inputValue}
                />
              </div>
            </div>
          )}

          {current.content.type === COLUMN_TYPE.IMAGE && (
            <div className="section">
              <div className="section-header">Image</div>
              <div className="text-field">
                <label htmlFor="image-url">URL</label>
                <input
                  id="image-url"
                  type="text"
                  onChange={handleInputChange}
                  value={inputValue}
                />
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  )
};
