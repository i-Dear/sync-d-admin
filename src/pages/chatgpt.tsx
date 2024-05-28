import { getDefaultLayout, IPageHeader } from "@/components/layout/default-layout";
import PriceAreaChart from "@/components/PriceAreaChart";
import PriceChangeTable from "@/components/PriceChangeTable";
import { useEffect, useState } from "react";

const pageHeader: IPageHeader = {
  title: "ChatGPT 가격 추이",
};

const ChartPage = () => {
  const [data, setData] = useState<
    Array<{ date: string; price1: number; price2: number; price3: number; price4: number; price5: number }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/prices");
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError("데이터를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Price Chart</h1>
      {data.length > 0 && <PriceAreaChart data={data} />}
      {data.length > 0 && <PriceChangeTable data={data} />}
    </div>
  );
};

ChartPage.getLayout = getDefaultLayout;
ChartPage.pageHeader = pageHeader;

export default ChartPage;
