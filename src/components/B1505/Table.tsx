import { Analysis, toJcamp, toText } from 'common-spectrum';
import React, { useEffect, useState } from 'react';
import { PlotObjectType } from 'react-plot';
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

function toCsv(plot: PlotObjectType): string {
  // Extracts headers and data from selected series
  const series = plot.series
    .filter(({ hidden }) => !hidden)
    .map(({ data, label, xAxis = 'x', yAxis = 'y' }) => {
      const xName = plot.axes.find(({ id }) => id === xAxis)?.label || xAxis;
      const yName = plot.axes.find(({ id }) => id === yAxis)?.label || yAxis;
      return [
        { header: `${xName} (${label})`, data: data.map(({ x }) => x) },
        { header: `${yName} (${label})`, data: data.map(({ y }) => y) },
      ];
    })
    .reduce((acc, curr) => [...acc, ...curr], []);

  // Transpose data matrix
  const maxLen = series.reduce(
    (acc, { data }) => Math.max(acc, data.length),
    0,
  );
  let rows: string[][] = [];
  for (let i = 0; i < maxLen; i++) {
    rows.push([]);
    for (let j = 0; j < series.length; j++) {
      rows[i].push(
        series[j].data[i] !== undefined ? String(series[j].data[i]) : '',
      );
    }
  }

  // Concatenates to CSV
  return [series.map(({ header }) => header), ...rows]
    .map((row) => row.join(','))
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
    for (let index = 0; index < content.length; index++) {
      const original = content[index];
      const file = files[index] || [];
      for (const analysis of file) {
        const spectrum = data.series[index];
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
    setSeries(series);
  }, [files, content, data]);

  return (
    <div className="p-5 m-2 shadow sm:rounded-lg">
      <div className="flex flex-row">
        <Button className="mx-1" onClick={() => bulkHiddenChange(false)}>
          Select all
        </Button>
        <Button className="mx-1" onClick={() => bulkHiddenChange(true)}>
          Unselect all
        </Button>
        <Button
          className="mx-1"
          onClick={() => {
            setModalContent({ title: 'Selected series', body: toCsv(data) });
          }}
        >
          Export all to CSV
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
        fluid={false}
      >
        <Modal.Header>{modalContent?.title} file</Modal.Header>
        <Modal.Body>
          <div className="inline-block overflow-auto font-mono whitespace-pre h-96">
            {modalContent?.body}
          </div>
        </Modal.Body>
        <Modal.Footer align="right">
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
        <tbody className="inline-block max-w-2xl overflow-auto h-96">
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
