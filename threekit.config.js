export default {
  credentials: {
    preview: {
      orgId: process.env.THREEKIT_PREVIEW_ORG_ID,
      publicToken: process.env.THREEKIT_PREVIEW_PUBLIC_TOKEN,
    },
    'admin-fts': {
      orgId: process.env.THREEKIT_ADMIN_FTS_ORG_ID,
      publicToken: process.env.THREEKIT_ADMIN_FTS_PUBLIC_TOKEN,
    },
  },
 
  products: {
    preview: {
      assetId: '32ba8c20-d54a-46d2-a0bb-0339c71e7dc6',
      configurationId: undefined,
      stageId: undefined,
    },
    'admin-fts': {
      assetId: undefined,
      configurationId: undefined,
      stageId: undefined,
    },
  },
};
