import { FC } from "react";
import styled from "styled-components";

interface PriceChangeTableProps {
  data: Array<{ date: string; price1: number; price2: number; price3: number; price4: number; price5: number }>;
}

const calculateChange = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 14px;
  text-align: left;
`;

const Th = styled.th`
  padding: 8px 10px;
  background-color: #f4f4f4;
  border-bottom: 1px solid #ddd;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 8px 10px;
  border-bottom: 1px solid #ddd;
  white-space: nowrap;
`;

const Tr = styled.tr`
  &:nth-of-type(even) {
    background-color: #f9f9f9;
  }

  &:hover {
    background-color: #f1f1f1;
  }
`;

const TdChangePositive = styled(Td)`
  color: green;
`;

const TdChangeNegative = styled(Td)`
  color: red;
`;

const PriceChangeTable: FC<PriceChangeTableProps> = ({ data }) => {
  const headers = [
    "일자",
    "Price1",
    "Price2",
    "Price3",
    "Price4",
    "Price5",
    "1월 전월 대비 (%)",
    "2월 전월 대비 (%)",
    "3월 전월 대비 (%)",
    "4월 전월 대비 (%)",
    "5월 전월 대비 (%)",
  ];

  const formatChange = (change: string): string => {
    const value = parseFloat(change);
    return value > 0 ? `+${change}` : change;
  };

  return (
    <Table>
      <thead>
        <tr>
          {headers.map((header) => (
            <Th key={header}>{header}</Th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => {
          const prevItem = index > 0 ? data[index - 1] : item;
          const change1 = index > 0 ? calculateChange(item.price1, prevItem.price1).toFixed(2) : "N/A";
          const change2 = index > 0 ? calculateChange(item.price2, prevItem.price2).toFixed(2) : "N/A";
          const change3 = index > 0 ? calculateChange(item.price3, prevItem.price3).toFixed(2) : "N/A";
          const change4 = index > 0 ? calculateChange(item.price4, prevItem.price4).toFixed(2) : "N/A";
          const change5 = index > 0 ? calculateChange(item.price5, prevItem.price5).toFixed(2) : "N/A";

          return (
            <Tr key={item.date}>
              <Td>{item.date}</Td>
              <Td>{item.price1}</Td>
              <Td>{item.price2}</Td>
              <Td>{item.price3}</Td>
              <Td>{item.price4}</Td>
              <Td>{item.price5}</Td>
              <Td>
                {change1 !== "N/A" ? (
                  parseFloat(change1) > 0 ? (
                    <TdChangeNegative>{formatChange(change1)}</TdChangeNegative>
                  ) : (
                    <TdChangePositive>{change1}</TdChangePositive>
                  )
                ) : (
                  "N/A"
                )}
              </Td>
              <Td>
                {change2 !== "N/A" ? (
                  parseFloat(change2) > 0 ? (
                    <TdChangeNegative>{formatChange(change2)}</TdChangeNegative>
                  ) : (
                    <TdChangePositive>{change2}</TdChangePositive>
                  )
                ) : (
                  "N/A"
                )}
              </Td>
              <Td>
                {change3 !== "N/A" ? (
                  parseFloat(change3) > 0 ? (
                    <TdChangeNegative>{formatChange(change3)}</TdChangeNegative>
                  ) : (
                    <TdChangePositive>{change3}</TdChangePositive>
                  )
                ) : (
                  "N/A"
                )}
              </Td>
              <Td>
                {change4 !== "N/A" ? (
                  parseFloat(change4) > 0 ? (
                    <TdChangeNegative>{formatChange(change4)}</TdChangeNegative>
                  ) : (
                    <TdChangePositive>{change4}</TdChangePositive>
                  )
                ) : (
                  "N/A"
                )}
              </Td>
              <Td>
                {change5 !== "N/A" ? (
                  parseFloat(change5) > 0 ? (
                    <TdChangeNegative>{formatChange(change5)}</TdChangeNegative>
                  ) : (
                    <TdChangePositive>{change5}</TdChangePositive>
                  )
                ) : (
                  "N/A"
                )}
              </Td>
            </Tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default PriceChangeTable;
