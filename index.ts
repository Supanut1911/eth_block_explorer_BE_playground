import express, { Request, Response } from "express";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import "dotenv/config";
import { log } from "console";
// import * as cors from "cors";
const cors = require("cors");
const app = express();

// app.use(cors);
const port: number = 3001;

// Add a variable for the api key, address, and chain
const MORALIS_API_KEY: string = `${process.env.MORALIS_API_KEY}`;
const address: string = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const chain: EvmChain = EvmChain.ETHEREUM;

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "yoyo" });
});

app.get("/getETHprice", async (req: Request, res: Response) => {
  try {
    const response = await Moralis.EvmApi.token.getTokenPrice({
      address,
      chain,
    });
    res.status(200).json({ response });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Add this a startServer function that initializes Moralis
const startServer = async (): Promise<void> => {
  const x = await Moralis.start({
    apiKey: MORALIS_API_KEY,
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

// Call startServer()
startServer();
