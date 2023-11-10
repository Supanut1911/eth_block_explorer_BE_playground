import express, { Request, Response } from "express";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import "dotenv/config";

console.log(process.env.YOYO);

const app = express();
const port: number = 3000;

// Add a variable for the api key, address, and chain
const MORALIS_API_KEY: string = "replace_me";
const address: string = "replace_me";
const chain: EvmChain = EvmChain.ETHEREUM;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// Add this a startServer function that initializes Moralis
const startServer = async (): Promise<void> => {
  await Moralis.start({
    apiKey: "xxx",
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

// Call startServer()
startServer();
