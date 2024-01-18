import Koa from 'koa';
import { type koaBody } from 'koa-body';
import z from 'zod';

// workaround to force koaBody to be imported as a type, otherwise ctx.request.files will be undefined
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _ImportKoaBody = typeof koaBody;

// Define a schema using Zod
const DataSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional()
  // Add other fields as required
});

// Infer the type from the schema
type DataType = z.infer<typeof DataSchema>;

export const postUploadFile = async (ctx: Koa.Context) => {
  // Files are available in ctx.request.files
  const files = ctx.request.files ? ctx.request.files['files'] : [];

  // Handle both single and multiple file uploads
  const fileList = Array.isArray(files) ? files : [files];

  // For demonstration, we'll just create a response with file info
  const fileInfo = fileList.map((file) => ({
    path: file.filepath,
    name: file.originalFilename,
    type: file.mimetype,
    size: file.size
  }));

  // parse body parameters using Zod
  const data: DataType = DataSchema.parse(ctx.request.body ?? {});

  /*console.log(
    `Title: ${data.title ?? '<no title>'}, Description: ${
      data.description ?? '<no description>'
    }`
  );*/

  ctx.body = {
    message: 'Files uploaded successfully',
    files: fileInfo,
    title: data.title ?? '<no title>',
    description: data.description ?? '<no description>'
  };
  ctx.response.status = 200 + fileInfo.length;
};
