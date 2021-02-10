import React, { useState } from 'react';
import ThermalResistanceDisplayer from '../../components/ThermalResistanceDisplayer';

import {
  Button,
  Color,
  Dropzone,
  DropzoneList,
  useDropzone,
} from '../../components/tailwind-ui';

export default function ThermalResistance() {
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
              const promises = [300, 700, 900];
              const results = await Promise.all(
                promises.map((name: number) =>
                  fetch(
                    `${process.env.PUBLIC_URL}/testFiles/thermal_resistance/multiple_pressure/Rt_${name}mbar.csv`,
                  ),
                ),
              );
              const texts = await Promise.all(results.map((res) => res.text()));
              console.log(texts);

              let state: Record<string, string> = {};
              for (let index = 0; index < results.length; index++) {
                state[results[index].url] = texts[index];
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
        <ThermalResistanceDisplayer textList={Object.values(content)} />
      )}
    </div>
  );
}
