import React, { useState } from 'react';
import Plot from './Info';
import { Dropzone } from './tailwind-ui/forms/basic/Dropzone';
import { DropzoneList } from './tailwind-ui/forms/basic/DropzoneList';
import { useSingleFileDrozone } from './tailwind-ui/hooks/useDropzone';

export default function App() {
  const [text, setText] = useState<string | null>(null);
  const {
    dropzoneProps,
    dropzoneListProps: { files, onRemove },
  } = useSingleFileDrozone({
    accept: '.csv',
    maxSize: 10000000,
  });

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
      {text && <Plot text={text} />}
    </div>
  );
}
