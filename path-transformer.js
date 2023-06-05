#!/usr/bin/env node

const path = require('node:path');
const fs = require('fs');

const directoryPath = path.join(process.cwd(), 'apps/root/src/');

function readDir(directoryPath) {
  return new Promise((res) => {
    let arrFiles = [];
    fs.readdir(directoryPath, { withFileTypes: true }, (err, files) => {
      const processFile = (idx) => {
        if (idx >= files.length) {
          return res(arrFiles);
        }

        if (files[idx].isDirectory()) {
          readDir(path.resolve(directoryPath, files[idx].name)).then(
            (subFiles) => {
              arrFiles.push(...subFiles);
              processFile(idx + 1);
            },
          );
        } else {
          arrFiles.push(path.resolve(directoryPath, files[idx].name));
          processFile(idx + 1);
        }
      };
      processFile(0);
    });
  });
}

(async () => {
  await readDir(directoryPath)
    .then((files) => {
      const { exec } = require('child_process');

      for (const file of files) {
        const sedCommand = `sed -i 's#^apps/root/apps/root#apps/root#g' ${file}`;

        exec(sedCommand, (error, stdout, stderr) => {
          if (error) {
            console.error(
              `Error executing sed command for ${file}: ${error.message}`,
            );
            return;
          }

          console.log(`Sed command output for ${file}: ${stdout}`);

          if (stderr) {
            console.error(`Sed command error for ${file}: ${stderr}`);
          }
        });
      }
    })
    .then()
    .catch((err) => {
      console.error('Error reading directory:', err);
    });
})();
