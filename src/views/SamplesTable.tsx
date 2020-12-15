import React, { useEffect, useState } from 'react';
import { Wafer } from 'react-wafer';
import {
  Button,
  Card,
  Table,
  Td,
  Th,
  useTable,
} from '../components/tailwind-ui';

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
  owner: string;
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

function getTaken(owner: string) {
  const top = owner === 'Remco' ? 26 : 16;
  return [Math.ceil(Math.random() * top), Math.ceil(Math.random() * top)];
}

export default function SamplesTable() {
  const [data, setData] = useState<DataType[]>([]);
  const [wafer, setWafer] = useState<WaferType | null>(null);
  const [sample, setSample] = useState<string | null>(null);
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
        taken: getTaken(owners[random]),
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
      <tr
        onClick={() => {
          setWafer({ id, taken: value.taken, owner: value.owner });
          setSample(null);
        }}
      >
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
        {wafer && (
          <div className="flex flex-wrap">
            <div className="m-5">
              <h2 className="text-xl font-semibold">Wafer {wafer.id}</h2>
              <Wafer
                pickedItems={wafer.taken.map((val) => ({ index: String(val) }))}
                size={400}
                rows={wafer.owner === 'Remco' ? 7 : 6}
                columns={wafer.owner === 'Remco' ? 8 : 7}
                onSelect={(_, val) => setSample(val)}
              />
            </div>

            {sample && (
              <div>
                <Card mobileEdgeToEdge>
                  <Card.Header>Selected sample</Card.Header>
                  <Card.Body grayBackground>
                    <ul className="px-2">
                      <li>
                        Sample: {wafer.id}_A{sample}
                      </li>
                      <li>
                        Owner:{' '}
                        {wafer.taken.includes(Number(sample))
                          ? wafer.owner
                          : 'None'}
                      </li>
                    </ul>
                  </Card.Body>
                  <Card.Footer>
                    <Button>Notebook &#x2192;</Button>
                  </Card.Footer>
                </Card>
              </div>
            )}
          </div>
        )}
        <div className="m-5">
          <Table
            pagination={pagination}
            Header={Header}
            data={sliceData}
            Tr={Row}
          />
        </div>
      </div>
    </div>
  );
}
