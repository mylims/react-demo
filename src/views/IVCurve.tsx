import React, { useEffect, useState } from 'react';

import ExtractedInfo from '../components/ExtractedInfo';
import {
  Button,
  Dropzone,
  DropzoneList,
  useSingleFileDropzone,
} from '../components/tailwind-ui';

export default function IVCurve() {
  const [text, setText] = useState<string | null>(null);
  const {
    dropzoneProps,
    dropzoneListProps: { files, onRemove },
  } = useSingleFileDropzone({ accept: ['.csv', '.txt'], maxSize: 10000000 });

  useEffect(() => {
    if (files[0]) {
      const file = files[0];
      file.text().then((text) => setText(text));
    }
  });

  return (
    <div>
      <div className="flex flex-wrap justify-around my-5">
        <div className="block m-4">
          <div>List of test files</div>
          <Button
            onClick={() => {
              fetch(`${process.env.PUBLIC_URL}/testFiles/Cdg-V.csv`)
                .then((res) => res.text())
                .then((text) => setText(text));
            }}
          >
            Capacitance test file
          </Button>
        </div>
        <div className="max-w-lg">
          <Dropzone {...dropzoneProps} />
          <DropzoneList
            files={files}
            onRemove={(file) => {
              setText(null);
              onRemove(file);
            }}
          />
        </div>
      </div>
      {text && <ExtractedInfo text={text} />}
    </div>
  );
}
