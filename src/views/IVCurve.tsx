import React, { useState } from 'react';

import Info from '../components/Info';
import { Dropzone } from '../components/tailwind-ui/forms/basic/Dropzone';
import { DropzoneList } from '../components/tailwind-ui/forms/basic/DropzoneList';
import { useSingleFileDrozone } from '../components/tailwind-ui/hooks/useDropzone';

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
      {text && <Info text={text} />}
    </div>
  );
}
