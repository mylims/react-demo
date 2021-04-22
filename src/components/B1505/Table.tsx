import { Analysis, toJcamp, toText } from 'common-spectrum';
import React, { useEffect, useState } from 'react';
import type { PlotObjectType } from 'react-plot';
import {
  Button,
  Checkbox,
  Color,
  Modal,
  SvgOutlineInformationCircle,
} from '../tailwind-ui';

interface SeriesType {
  hidden: boolean;
  original: string;
  label: string;
  csv: string;
  jcamp: string;
}

interface TableProps {
  files: Analysis[][];
  data: PlotObjectType;
  content: string[];
  onLabelChange: (label: string, index: number) => void;
  onHiddenChange: (hidden: boolean, index: number) => void;
  bulkHiddenChange: (hidden: boolean) => void;
}

function toCsv(plot: PlotObjectType, separator = ','): string {
  // Extracts headers and data from selected content
  const content = plot.content
    .filter((element) => element.type !== 'annotation' && !element.hidden)
    .map((element) => {
      if (element.type === 'annotation') return [];
      const xName =
        plot.axes.find(({ id }) => id === element.xAxis)?.label ||
        element.xAxis ||
        'x';
      const yName =
        plot.axes.find(({ id }) => id === element.yAxis)?.label ||
        element.yAxis ||
        'y';
      return [
        {
          header: `${xName} (${element.label})`,
          data: element.data.map(({ x }) => x),
        },
        {
          header: `${yName} (${element.label})`,
          data: element.data.map(({ y }) => y),
        },
      ];
    })
    .reduce((acc, curr) => [...acc, ...curr], []);

  // Transpose data matrix
  const maxLen = content.reduce(
    (acc, { data }) => Math.max(acc, data.length),
    0,
  );
  let rows: string[][] = [];
  for (let i = 0; i < maxLen; i++) {
    rows.push([]);
    for (let j = 0; j < content.length; j++) {
      rows[i].push(
        content[j].data[i] !== undefined ? String(content[j].data[i]) : '',
      );
    }
  }

  // Concatenates to CSV
  return [content.map(({ header }) => header), ...rows]
    .map((row) => row.join(separator))
    .join('\n');
}

export function Table({
  files,
  data,
  content,
  onLabelChange,
  onHiddenChange,
  bulkHiddenChange,
}: TableProps) {
  const [modalContent, setModalContent] = useState<{
    body: string;
    title: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [series, setSeries] = useState<SeriesType[]>([]);

  useEffect(() => {
    let series: SeriesType[] = [];
    let titles: string[] = [];
    const len = Math.min(content.length, data.content.length);
    for (let index = 0; index < len; index++) {
      const original = content[index];
      const file = files[index] || [];
      for (const analysis of file) {
        const spectrum = data.content[index];
        if (spectrum.type !== 'annotation') {
          let { label = `spectrum ${index}`, hidden = false } = spectrum || {};
          while (titles.includes(label)) {
            label = label + index;
          }
          titles.push(label);
          series.push({
            hidden,
            original,
            label,
            csv: toText(analysis).join('\n'),
            jcamp: toJcamp(analysis),
          });
        }
      }
    }
    setSeries(series);
  }, [files, content, data]);

  return (
    <div className="p-5 m-2 shadow sm:rounded-lg">
      <div className="flex flex-row">
        <Button
          className="mx-1"
          onClick={() => bulkHiddenChange(false)}
          color={Color.success}
        >
          Select all
        </Button>
        <Button
          className="mx-1"
          onClick={() => bulkHiddenChange(true)}
          color={Color.danger}
        >
          Unselect all
        </Button>
        <Button
          className="mx-1"
          onClick={() => {
            setModalContent({
              title: 'Selected series',
              body: toCsv(data, ','),
            });
          }}
        >
          Export selected to CSV
        </Button>
        <Button
          className="mx-1"
          onClick={() => {
            setModalContent({
              title: 'Selected series',
              body: toCsv(data, '\t'),
            });
          }}
        >
          Export selected to TSV
        </Button>
      </div>
      <Modal
        isOpen={!!modalContent}
        onRequestClose={() => {
          setCopied(false);
          setModalContent(null);
        }}
        icon={<SvgOutlineInformationCircle />}
        iconColor={Color.primary}
        fluid={true}
      >
        <Modal.Header>{modalContent?.title} file</Modal.Header>
        <Modal.Body>
          <div className="inline-block overflow-visible font-mono whitespace-pre h-96">
            {modalContent?.body}
          </div>
        </Modal.Body>
        <Modal.Footer align="right">
          <Button
            onClick={() => {
              if (modalContent) {
                const element = document.createElement('a');
                const file = new Blob([modalContent.body], {
                  type: 'text/plain',
                });
                element.href = URL.createObjectURL(file);
                element.download = `${modalContent.title}.txt`;
                document.body.appendChild(element); // Required for this to work in FireFox
                element.click();
              }
            }}
          >
            Download file
          </Button>
          <Button
            color={copied ? Color.success : Color.neutral}
            onClick={() => {
              if (modalContent?.body) {
                navigator.clipboard
                  .writeText(modalContent?.body)
                  .then(() => setCopied(true));
              }
            }}
          >
            Copy text
          </Button>
          <Button
            color={Color.danger}
            onClick={() => {
              setCopied(false);
              setModalContent(null);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="text-xl font-semibold border-b text-primary-500">
        Series
      </div>
      <table>
        <tbody className="inline-block overflow-auto h-96">
          {series.map(({ label, original, csv, jcamp, hidden }, index) => (
            <tr key={index}>
              <td className="p-1 font-medium">
                <Checkbox
                  checked={!hidden}
                  onChange={() => onHiddenChange(!hidden, index)}
                  name={`checkbox-index${label}-units`}
                />
              </td>
              <td className="p-1 font-medium">
                <div className="flex mt-1 rounded-md shadow-sm">
                  <label
                    htmlFor={`label-index${label}-units`}
                    className="relative flex flex-row items-center flex-1 px-3 py-2 text-base placeholder-opacity-100 bg-white border rounded-md shadow-sm focus-within:ring-1 placeholder-neutral-500 sm:text-sm focus-within:ring-primary-500 focus-within:border-primary-500 border-neutral-300 disabled:bg-neutral-50 disabled:text-neutral-500"
                  >
                    <input
                      id={`label-index${label}-units`}
                      name={`label-index${label}-units`}
                      placeholder="Label"
                      className="flex-1 p-0 border-none focus:outline-none focus:ring-0 sm:text-sm"
                      type="text"
                      value={label}
                      onChange={(e) =>
                        onLabelChange(e.currentTarget.value, index)
                      }
                    />
                    <div className="inline-flex flex-row items-center space-x-1 cursor-default"></div>
                  </label>
                </div>
              </td>
              <td className="p-1">
                <Button
                  onClick={() =>
                    setModalContent({ title: 'Original', body: original })
                  }
                >
                  Original file
                </Button>
              </td>
              <td className="p-1">
                <Button
                  onClick={() => setModalContent({ title: 'CSV', body: csv })}
                >
                  CSV file
                </Button>
              </td>
              <td className="p-1">
                <Button
                  onClick={() =>
                    setModalContent({ title: 'JCAMP', body: jcamp })
                  }
                >
                  JCAMP file
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
