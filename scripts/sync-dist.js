import { log } from 'console';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';

const rootPath = path.join(
  path.dirname(import.meta.url.replace('file:/', '')),
  '..'
);

// remove subdirectories that don't exist.
const projectPathsToClean = ['apps', 'examples', 'packages'].filter(
  (projectPath) => {
    return fs.existsSync(path.join(rootPath, projectPath));
  }
);

const getSubDirectories = async (directory) => {
  // get the subdirectories of the packages directory
  const subDirectoryPath = path.join(rootPath, directory);
  const dirNames = await fsPromises.readdir(subDirectoryPath);
  return dirNames.map((dirName) => path.join(directory, dirName));
};

const allowedExtensions = ['.ts', '.tsx'];

projectPathsToClean.forEach(async (directory) => {
  const projectDirectories = await getSubDirectories(directory);
  projectDirectories.forEach((projectDirectory) => {
    // Define the path to your dist directory
    const distPath = path.join(projectDirectory, 'dist');

    // Clean the dist directory
    fsPromises
      .readdir(distPath, {
        recursive: true
      })
      .then((files) => {
        files.forEach((file) => {
          if (file.endsWith('.js')) {
            const tsFile = path.join(
              projectDirectory,
              'src',
              file.replace('.js', '.ts')
            );
            fsPromises
              .lstat(tsFile)
              .then(() => {
                //log(`Keeping ${file}`);
              })
              .catch(() => {
                const tsxFile = path.join(
                  projectDirectory,
                  'src',
                  file.replace('.js', '.tsx')
                );
                fsPromises
                  .lstat(tsxFile)
                  .then(() => {
                    //log(`Keeping ${file}`);
                  })
                  .catch(() => {
                    log(`Removing ${file}`);
                    fs.unlinkSync(path.join(distPath, file));
                  });
              });
          }
        });
        return true;
      });
  });
});
