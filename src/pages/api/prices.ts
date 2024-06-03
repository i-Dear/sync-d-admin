import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await fetch("https://syncd-backend.dev.i-dear.org/admin/chatgpt");
  const data = await response.json();

  const priceData = [
    { date: "2023-04-01", price1: 3.6, price2: 4.9, price3: 10.8, price4: 11.6, price5: 30.9 },
    { date: "2023-05-01", price1: 3.8, price2: 5.0, price3: 11.0, price4: 11.8, price5: 31.6 },
  ];

  res.status(200).json(priceData);
}
