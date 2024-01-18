// .storybook/test-runner.js
const { toMatchImageSnapshot } = require('jest-image-snapshot');

const customSnapshotsDir = `${process.cwd()}/__snapshots__`;

export const setup = () => expect.extend({ toMatchImageSnapshot });

export const postRender = async (page, context) => {
  // If you want to take screenshot of multiple browsers, use
  // page.context().browser().browserType().name() to get the browser name to prefix the file name
  const image = await page.screenshot();
  expect(image).toMatchImageSnapshot({
    customSnapshotsDir,
    customSnapshotIdentifier: context.id
  });
};
