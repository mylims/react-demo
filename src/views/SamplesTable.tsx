import React, { useEffect, useState } from 'react';
import { Wafer } from 'react-wafer';
import { Table, Td, Th, useTable } from '../components/tailwind-ui';

interface DataType {
  id: number;
  date: string;
  owner: string;
  heterostructure: string;
  substrate: string;
  suplier: string;
  taken: number[];
}

interface WaferType {
  id: string;
  taken: number[];
}

function Header(): JSX.Element {
  return (
    <tr>
      <Th>wafer</Th>
      <Th>date</Th>
      <Th>owner</Th>
      <Th>heterostructure</Th>
      <Th>substrate</Th>
      <Th>suplier</Th>
    </tr>
  );
}

export default function SamplesTable() {
  const [data, setData] = useState<DataType[]>([]);
  const [selected, setSelected] = useState<WaferType | null>(null);
  useEffect(() => {
    const data: DataType[] = [];
    const owners = ['Remco', 'Katya', 'Luca'];
    const structures = ['InAlN MC', 'AlGaN/GaN x5', 'AlGaN/GaN'];
    const substrates = ['Si', 'Ga-polar GaN', 'Sapphire'];
    for (let i = 0; i < 20; i++) {
      const random = Math.floor(Math.random() * owners.length);
      data.push({
        id: i,
        date: '03/12/2020',
        owner: owners[random],
        heterostructure: structures[random],
        substrate: substrates[random],
        suplier: 'Enkris',
        taken: [Math.ceil(Math.random() * 16), Math.ceil(Math.random() * 16)],
      });
    }
    setData(data);
  }, []);

  const { pagination, data: sliceData } = useTable<DataType>(data, {
    itemsPerPage: 10,
    withText: true,
  });

  const Row = ({ value }: { value: DataType }) => {
    const id = `#0${value.id + 270}`;
    return (
      <tr onClick={() => setSelected({ id, taken: value.taken })}>
        <Td>{id}</Td>
        <Td>{value.date}</Td>
        <Td>{value.owner}</Td>
        <Td>{value.heterostructure}</Td>
        <Td>{value.substrate}</Td>
        <Td>{value.suplier}</Td>
      </tr>
    );
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between">
        <div className="m-5">
          <Table
            pagination={pagination}
            Header={Header}
            data={sliceData}
            Tr={Row}
          />
        </div>
        {selected && (
          <div className="m-5">
            <h2 className="text-xl font-semibold">Wafer {selected.id}</h2>
            <Wafer
              pickedItems={selected.taken.map((val) => ({
                index: String(val),
              }))}
              size={400}
              rows={6}
              columns={7}
            />
          </div>
        )}
      </div>
    </div>
  );
}
