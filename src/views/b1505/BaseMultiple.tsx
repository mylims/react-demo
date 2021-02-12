import React, { useState } from 'react';

import {
  Button,
  Color,
  Dropzone,
  DropzoneList,
  useDropzone,
} from '../../components/tailwind-ui';
import B1505 from '../../components/B1505';

interface BaseMultipleProps {
  dirName: string;
  maxIndex: number;
}

export default function BaseMultiple({ dirName, maxIndex }: BaseMultipleProps) {
  const {
    dropzoneProps: { onDrop, ...dropzoneProps },
    dropzoneListProps: { files, onRemove },
  } = useDropzone({ accept: ['.csv', '.txt'], maxSize: 10000000 });
  const [content, setContent] = useState<Record<string, string>>({});

  return (
    <div>
      <div className="flex flex-wrap justify-around my-5">
        <div className="block m-4">
          <div>List of test files</div>
          <Button
            onClick={async () => {
              let promises = [];
              for (let index = 1; index <= maxIndex; index++) {
                promises.push(
                  fetch(
                    `${process.env.PUBLIC_URL}/testFiles/b1505/${dirName}/${index}.csv`,
                  ),
                );
              }
              const results = await Promise.all(promises);
              const texts = await Promise.all(results.map((res) => res.text()));
              let state: Record<string, string> = {};
              for (let index = 0; index < results.length; index++) {
                if (!texts[index].includes('<!DOCTYPE html>')) {
                  state[results[index].url] = texts[index];
                }
              }
              setContent(state);
            }}
          >
            Multiple files
          </Button>
          <Button
            className="m-2"
            color={Color.danger}
            onClick={() => setContent({})}
          >
            Clear tests
          </Button>
        </div>

        <div className="max-w-lg">
          <Dropzone
            {...dropzoneProps}
            onDrop={async (newFiles) => {
              let state: Record<string, string> = {};
              for (const file of newFiles) {
                state[file.name] = await file.text();
              }
              setContent({ ...content, ...state });
              onDrop(newFiles);
            }}
          />
          <DropzoneList
            files={files}
            onRemove={(file) => {
              const { [file.name]: deleted, ...state } = content;
              setContent(state);
              onRemove(file);
            }}
          />
        </div>
      </div>
      {!!Object.keys(content).length && (
        <B1505 content={Object.values(content)} />
      )}
    </div>
  );
}
