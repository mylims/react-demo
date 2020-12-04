import React from 'react';

interface MetaTableProps {
  meta: Record<string, string>;
}

export default function MetaTable({ meta }: MetaTableProps) {
  return (
    <div className="p-5 m-2 shadow sm:rounded-lg">
      <div className="text-xl font-semibold border-b text-primary-500">
        Metadata
      </div>
      <table>
        <tbody className="inline-block max-w-2xl overflow-auto h-96">
          {Object.keys(meta).map((key) => (
            <tr key={key}>
              <td className="font-medium">{key}</td>
              <td>{meta[key]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
