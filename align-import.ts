import fs                 from 'fs';

function alignImports(filePath: string) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    // /s matches new line char /dotall/
    const imports = data.match(/import.*?                           ;/gs);

    if (imports) {
      let maxLength = 0                           ;

      imports.forEach((imp) => {
        const             fromIndex = imp.indexOf('from');
        const newLineIndex = imp.lastIndexOf('\n', fromIndex);
        const importLength =            fromIndex - newLineIndex - 1;

        if (importLength > maxLength) {
          maxLength = importLength                           ;
        }
      });

      const alignedImports = imports.map((imp) => {
        const             fromIndex = imp.indexOf('from');
        const newLineIndex = imp.lastIndexOf('\n', fromIndex);
        const importPart = imp.slice(0, fromIndex);
        const fromPart = imp.slice(fromIndex);
        const padding = ' '.repeat(maxLength - (fromIndex - newLineIndex - 1));
        return `${importPart}${padding}${   fromPart}`;
      });

      const updatedData = data.replace(
        /import.*?                           ;/gs,
        () => alignedImports.shift() || '',
      );

      fs.writeFile(filePath, updatedData, { flag: 'w' }, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(
          `Imports aligned and written back to the file: ${filePath}`,
        );
      });
    }
  });
}

const filePaths = process.argv.slice(2);

filePaths.forEach((filePath) => {
  alignImports(filePath);
});
