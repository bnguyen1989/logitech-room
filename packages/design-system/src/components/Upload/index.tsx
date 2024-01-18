import { useRef, useState } from 'react';

import Add from '../../icons/Add.js';
import Delete from '../../icons/Delete.js';
import Spinner from '../../icons/Spinner.js';
import {
  IconWrapper,
  ImageActionArea,
  ImageWrapper,
  UploadWrapper
} from './upload.styles.js';

export interface UploadProps {
  dataId: string;
  value: unknown;
  onChange: (file: File | undefined) => Promise<void>;
}

const UploadingButtonUI = () => {
  return (
    <>
      <IconWrapper>
        <Spinner size="28px" />
      </IconWrapper>
      <div>Uploading...</div>
    </>
  );
};

const UploadButtonUI = () => {
  return (
    <>
      <IconWrapper>
        <Add />
      </IconWrapper>
      <div>Upload</div>
    </>
  );
};

export const Upload = (props: UploadProps) => {
  const { dataId, value, onChange } = props;
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleClick = () => {
    if (isUploading) return;
    if (typeof value === 'string' && value?.length) return;
    inputRef.current?.click();
  };

  const handleUpload = async (file: File | undefined) => {
    setIsUploading(true);
    await onChange(file);
    setIsUploading(false);

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      if (!imgRef.current) return;
      imgRef.current.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  };

  return (
    <UploadWrapper uploaded={!!(!isUploading && (value as string)?.length)}>
      <input
        type="file"
        ref={inputRef}
        data-id={dataId}
        onChange={async (e) => {
          if (!e.target.files?.[0] || !onChange) return;
          handleUpload(e.target.files[0]);
        }}
      />
      <button type="button" onClick={handleClick}>
        {isUploading ? (
          <UploadingButtonUI />
        ) : (value as string)?.length ? (
          <ImageWrapper>
            <div>
              <img ref={imgRef} alt="uploaded" src="#" />
            </div>
            <ImageActionArea>
              <div
                onClick={(e) => {
                  handleUpload(undefined);
                  e.stopPropagation();
                }}
              >
                <Delete />
              </div>
            </ImageActionArea>
          </ImageWrapper>
        ) : (
          <UploadButtonUI />
        )}
      </button>
    </UploadWrapper>
  );
};

export default Upload;
