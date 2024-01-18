export type Attachment = File; // Ben Dec 18, 2023: It seems that our REST API only takes files and never blobs, so I will keep this type simple.
export const Attachment = File;

export type FormDataValue =
  | undefined
  | null
  | string
  | number
  | boolean
  | object
  | Attachment
  | Attachment[];
export type FormProps = Record<string, FormDataValue>;

const appendKeyValue = (
  formData: FormData,
  key: string,
  value: FormDataValue
) => {
  if (value === undefined || value === null) return;
  if (value instanceof File) {
    //console.log('key has a file value', key, value);
    formData.append(key, value);
    return;
  }

  if (Array.isArray(value) && value.length > 1 && value[0] instanceof File) {
    //console.log('key has an array value', key, value);
    value.forEach((value) => {
      if (!(value instanceof File)) {
        throw new Error(
          `Array value for key '${key}' contains a non-attachment value: ${JSON.stringify(
            value
          )}`
        );
      }
      formData.append(key, value);
    });
    return;
  }
  //console.log('key has a simple value', key, value);
  const stringifiedValue =
    typeof value === 'string' ? value : JSON.stringify(value); // this is absolutely required
  formData.append(key, stringifiedValue);
};

export const appendAll = (formData: FormData, obj: FormProps) => {
  Object.entries(obj).forEach(([key, value]) =>
    appendKeyValue(formData, key, value)
  );
};
