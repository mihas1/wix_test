import { FC, useCallback, useMemo } from "react";
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { setSelected, selectSelected, selectElements, selectHead } from '../../redux/schemaSlice';
import { COLUMN_TYPE } from '../../redux/types'

import { Column } from "../column";
import { ImagePlaceholder } from "../image-placeholder";
import { Markdown } from "../markdown";
import { Row } from "../row";
import { Stage } from "../stage";
import { Properties } from "../properties";
import { SchemaHashOpt, SchemaNode, SchemaRowNode } from "../../redux/types";

const columnTypeHelper = (nodeData: SchemaNode) => {
  if ('content' in nodeData) {
    switch (nodeData.content.type) {
      case COLUMN_TYPE.TEXT:
        return <Markdown className={`text-align-${nodeData.options?.align || 'left'}`}>
          {nodeData.content.value}
        </Markdown>

      case COLUMN_TYPE.IMAGE:
        return nodeData.content.value ? <img src={nodeData.content.value} alt="" /> : <ImagePlaceholder />

      default:
        return [];
    }
  }
};

export const Editor: FC = () => {
  const dispatch = useAppDispatch();

  const head = useAppSelector(selectHead);
  const selected = useAppSelector(selectSelected);
  const elements = useAppSelector(selectElements);

  const changeSelected = useCallback((hash: SchemaHashOpt) => {
    dispatch(setSelected(hash));
  }, [dispatch]);

  const renderColumns = useCallback((row: SchemaNode) => {
    if ('children' in row) {
      return row.children.map(childrenHash =>
        <Column
          selected={selected === childrenHash}
          key={childrenHash}
          onSelect={() => changeSelected(childrenHash)}
        >
          {columnTypeHelper(elements[childrenHash])}
        </Column>
      )
    }
  }, [selected, elements, changeSelected]);

  const schemaDom = useMemo(() => {
    if (!head) return [];

    let hash: SchemaHashOpt = head;
    let array = [];

    while (hash) {
      const closureHash = hash;
      const currentItem = elements[closureHash] as SchemaRowNode;
      const columns = renderColumns(elements[closureHash]);

      array.push(
        <Row
          selected={selected === closureHash}
          key={closureHash}
          onSelect={() => changeSelected(closureHash)}
        >
          {columns}
        </Row>
      );

      hash = currentItem.next;
    }

    return array;

  }, [elements, selected, head, changeSelected, renderColumns]);

  return (
    <div className="editor">
      <Stage onSelect={() => changeSelected(null)}>
        {schemaDom}
      </Stage>

      <Properties />
    </div>
  )
};
