import type React from 'react';
import { useEffect, useRef, useState } from 'react';

import NumberIcon from '../../icons/attributes/Number.js';
import StringIcon from '../../icons/attributes/String.js';
import DeleteIcon from '../../icons/Delete.js';
import DragIcon from '../../icons/Drag.js';
import ReorderableList from '../ReorderableList/index.js';
// import { AttributeIcon } from 'icons/attributeTypes';
import { DeleteButton, Input, Wrapper } from './metadataList.styles.js';

export enum MetadataTypes {
  STRING = 'String',
  NUMBER = 'Number'
}

interface MetadataProperty {
  type: MetadataTypes;
  name: string;
  value: string | number;
}

export interface MetadataPropertyProps extends MetadataProperty {
  deleteMetadataProperty: () => void;
  setMetadataProperty: (data: Partial<MetadataProperty>) => void;

  selected?: null | boolean;
  onPointerDown?: () => void;
  onPointerEnter?: () => void;
  onPointerMove?: (e: React.PointerEvent) => void;
  onPointerUp?: () => void;
}

export interface IMetadataProps {
  metadata: Array<MetadataProperty>;
  setMetadata: (metadata: MetadataProperty[]) => void;
}

const icons = {
  [MetadataTypes.STRING]: StringIcon,
  [MetadataTypes.NUMBER]: NumberIcon
};

const MetadataProperty = (props: MetadataPropertyProps) => {
  const {
    type = MetadataTypes.STRING,
    name,
    value,
    deleteMetadataProperty: deleteMetadata,
    setMetadataProperty: setMetadata,

    selected,
    onPointerDown,
    onPointerEnter,
    onPointerMove,
    onPointerUp
  } = props;

  const [localName, setLocalName] = useState(name);
  const [localValue, setLocalValue] = useState(value);
  const [inEditMode, setInEditMode] = useState(false);

  const ref = useRef<null | HTMLLIElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (!inEditMode) return;
      if (e && !ref.current?.contains(e.target as Node)) setInEditMode(false);
      else return;

      if (localName !== name || localValue !== value)
        setMetadata({ name: localName, value: localValue });
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [inEditMode, name, value]);

  const Icon = icons[type];

  return (
    <Wrapper
      ref={ref}
      selected={selected}
      onClick={() => setInEditMode(true)}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div onPointerDown={onPointerDown}>
        <DragIcon />
      </div>
      <div>
        <Icon />
      </div>
      <div>
        <Input
          type="text"
          editable={inEditMode}
          value={localName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setLocalName(e.target.value)
          }
        />
      </div>
      <div>
        <Input
          type="text"
          editable={inEditMode}
          value={localValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setLocalValue(e.target.value)
          }
        />
      </div>
      <div>
        <DeleteButton type="button" onClick={deleteMetadata}>
          <DeleteIcon />
        </DeleteButton>
      </div>
    </Wrapper>
  );
};

const MetadataList = (props: IMetadataProps) => {
  const { metadata, setMetadata } = props;

  const updateMetadataProperty = (
    index: number,
    data: Partial<MetadataProperty>
  ) => {
    const updatedMetadata = [...metadata];
    Object.assign(updatedMetadata[index], data);
    setMetadata(updatedMetadata);
  };

  const deleteMetadata = (index: number) => {
    const updatedMetadata = metadata.reduce(
      (output: MetadataProperty[], data, i) => {
        if (i === index) return output;
        return [...output, data];
      },
      []
    );
    setMetadata(updatedMetadata);
  };

  return (
    <ReorderableList>
      {metadata.map((el, i) => (
        <MetadataProperty
          {...el}
          setMetadataProperty={(data: Partial<MetadataProperty>) =>
            updateMetadataProperty(i, data)
          }
          deleteMetadataProperty={() => deleteMetadata(i)}
        />
      ))}
    </ReorderableList>
  );
};

export default MetadataList;
