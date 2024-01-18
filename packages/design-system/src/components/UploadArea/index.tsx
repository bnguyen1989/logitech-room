import { useRef, useState } from 'react';

import ImageIcon from '../../icons/Image.js';
import Spinner from '../../icons/Spinner.js';
import { UploadingWrapper, UploadWrapper } from './uploadArea.styles.js';

export interface UploadAreaProps {
  dataId: string;
  value: unknown;
  onChange: (file: File | undefined) => Promise<void>;
}

export const UploadArea = (props: UploadAreaProps) => {
  const { dataId, value, onChange } = props;
  const [isUploading, setIsUploading] = useState(false);
  const [filename, setFilename] = useState<string | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleClick = () => {
    if (isUploading) return;
    inputRef.current?.click();
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    await onChange(file);
    setIsUploading(false);
    setFilename(file.name);

    const reader = new FileReader();

    reader.onload = () => {
      if (!imgRef.current) return;
      // @ts-ignore
      imgRef.current.src = reader.result;
    };

    reader.readAsDataURL(file);
  };

  return (
    <UploadWrapper>
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
          <UploadingWrapper>
            <div>
              <Spinner size="28px" />
            </div>
            <div>Uploading...</div>
          </UploadingWrapper>
        ) : (value as string)?.length ? (
          <UploadingWrapper>
            <div>
              <img ref={imgRef} alt="uploaded" src="#" />
            </div>
            <div>
              <div>{filename}</div>
              <div>Upload another file.</div>
            </div>
          </UploadingWrapper>
        ) : (
          <div>
            <div>
              <ImageIcon />
            </div>
            <div>Click to upload</div>
            <div>Supported file types: PNG, JPEG, SVG</div>
          </div>
        )}
      </button>
    </UploadWrapper>
  );
};

export default UploadArea;
