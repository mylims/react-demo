import React, { useState } from 'react';

import ExtractedInfo from '../components/ExtractedInfo';
import {
  Button,
  Dropzone,
  DropzoneList,
  useSingleFileDrozone,
} from '../components/tailwind-ui';

export default function IVCurve() {
  const [text, setText] = useState<string | null>(null);
  const {
    dropzoneProps,
    dropzoneListProps: { files, onRemove },
  } = useSingleFileDrozone({ accept: ['.csv', '.txt'], maxSize: 10000000 });

  if (files[0]) {
    const file = files[0];
    file.text().then((text) => setText(text));
  }

  return (
    <div className="bg-gray-100">
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
