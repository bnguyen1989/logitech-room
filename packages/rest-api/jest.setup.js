// eslint-disable-next-line no-undef
expect.extend({
  toMatchSchema: (data, schema) => {
    const result = schema.safeParse(data);
    return {
      pass: result.success,
      message: () =>
        result.success
          ? 'Data matched its validator'
          : result.error.message + '\n\n' + JSON.stringify(data, null, 2)
    };
  }
});
