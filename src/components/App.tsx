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
    <div>
      <Dropzone {...dropzoneProps} />
      <DropzoneList
        files={files}
        onRemove={(file) => {
          setText(null);
          onRemove(file);
        }}
      />
      {text && <Plot text={text} />}
    </div>
  );
}
