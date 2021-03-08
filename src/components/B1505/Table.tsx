import { Analysis, toJcamp, toText } from 'common-spectrum';
import React, { useMemo, useState } from 'react';
import {
  Button,
  Color,
  Modal,
  SvgOutlineInformationCircle,
} from '../tailwind-ui';

interface QueryType {
  xLabel: string;
  xUnits: string;
  yLabel: string;
  yUnits: string;
}
interface TableProps {
  query: QueryType;
  files: Analysis[][];
  content: string[];
}

export function Table({ files, query, content }: TableProps) {
  const [modalContent, setModalContent] = useState<{
    body: string;
    title: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const series = useMemo(() => {
    let series = [];
    let titles: string[] = [];
    for (let index = 0; index < content.length; index++) {
      const original = content[index];
      for (const analysis of files[index]) {
        const spectrum = analysis.getXYSpectrum(query);
        let { title = `spectrum ${index}` } = spectrum || {};
        while (titles.includes(title)) {
          title = title + index;
        }
        titles.push(title);
        series.push({
          original,
          label: title,
          csv: toText(analysis).join('\n'),
          jcamp: toJcamp(analysis),
        });
      }
    }
    return series;
  }, [files, content, query]);

  return (
    <div className="p-5 m-2 shadow sm:rounded-lg">
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
          {series.map(({ label, original, csv, jcamp }) => (
            <tr key={label}>
              <td className="p-1 font-medium">{label}</td>
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
