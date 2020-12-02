import React, { useState } from 'react';

import ExtractedInfo from '../components/ExtractedInfo';
import {
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
      <div className="max-w-lg mx-auto my-5">
        <Dropzone {...dropzoneProps} />
        <DropzoneList
          files={files}
          onRemove={(file) => {
            setText(null);
            onRemove(file);
          }}
        />
      </div>
      {text && <ExtractedInfo text={text} />}
    </div>
  );
}
