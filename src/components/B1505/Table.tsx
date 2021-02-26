import React, { useState } from 'react';
import { PlotObjectType } from 'react-plot';
import { Button, Color, Modal } from '../tailwind-ui';

interface TableProps {
  data: PlotObjectType;
  content: string[];
}
export function Table({ data, content }: TableProps) {
  const [modalContent, setModalContent] = useState<string | null>(null);
  const { series } = data;
  return (
    <div className="p-5 m-2 shadow sm:rounded-lg">
      <Modal
        isOpen={!!modalContent}
        onRequestClose={() => setModalContent(null)}
        icon={null}
        iconColor={Color.primary}
      >
        <Modal.Header>Original file</Modal.Header>
        <Modal.Body>
          <div className="inline-block max-w-2xl overflow-auto font-mono whitespace-pre h-96">
            {modalContent}
          </div>
        </Modal.Body>
        <Modal.Footer align="right">
          <Button onClick={() => setModalContent(null)}>Close</Button>
        </Modal.Footer>
      </Modal>
      <div className="text-xl font-semibold border-b text-primary-500">
        Series
      </div>
      <table>
        <tbody className="inline-block max-w-2xl overflow-auto h-96">
          {series.map(({ label = '' }, index) => (
            <tr key={label + index}>
              <td className="p-1 font-medium">{label}</td>
              <td className="p-1">
                <Button onClick={() => setModalContent(content[index])}>
                  Original file
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
