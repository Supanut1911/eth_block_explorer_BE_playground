import express, { Request, Response } from "express";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import "dotenv/config";
import cors from "cors";

const app = express();

app.use(cors());
const port: number = 4000;

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
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error });
  }
});

//search filter
app.get("/address", async (req: Request, res: Response) => {
  try {
    const { query } = req;
    const chain = "0x1";
    const response =
      await Moralis.EvmApi.transaction.getWalletTransactionsVerbose({
        address: `${query.address}`,
        chain,
      });
    return res.status(200).json(response);
  } catch (error) {
    console.log("error =>", error);
    return res.status(400).json();
  }
});

//getBlockinfo
app.get("/getblockinfo", async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const latestBlock = await Moralis.EvmApi.block.getDateToBlock({
      date: now,
      chain: "0x1",
    });

    let blockNrOrParentHash: number | string = latestBlock.toJSON().block;
    let previousBlockInfo = <any>[];

    //loop 5 block
    for (let i = 0; i < 5; i++) {
      const previousBlockNrs = await Moralis.EvmApi.block.getBlock({
        chain: "0x1",
        blockNumberOrHash: blockNrOrParentHash.toString(),
      });
      if (previousBlockNrs) {
        blockNrOrParentHash = previousBlockNrs.toJSON().parent_hash;
      }

      //get latest Tx at index = 0
      if (i == 0) {
        if (previousBlockNrs) {
          previousBlockInfo.push({
            transactions: previousBlockNrs.toJSON().transactions.map((i) => {
              return {
                transactionHash: i.hash,
                time: i.block_timestamp,
                fromAddress: i.from_address,
                toAddress: i.to_address,
                value: i.value,
              };
            }),
          });
        }
      }
      if (previousBlockNrs) {
        previousBlockInfo.push({
          blockNumber: previousBlockNrs.toJSON().number,
          totalTransaction: previousBlockNrs.toJSON().transaction_count,
          gasUsed: previousBlockNrs.toJSON().gas_used,
          miner: previousBlockNrs.toJSON().miner,
          time: previousBlockNrs.toJSON().timestamp,
        });
      }
    }
    const response = {
      latestBlock: latestBlock.toJSON().block,
      previousBlockInfo,
    };
    return res.status(200).json(response);
  } catch (error) {
    console.log("error=>", error);

    return res.status(400).json();
  }
});

app.get("/nft/:address", async (req: Request, res: Response) => {
  const address = req.params.address;
  console.log("🚀 ~ file: index.ts:112 ~ app.get ~ address:", address);
  const chain = EvmChain.SEPOLIA;
  const tokenId = "0";

  try {
    const response = await Moralis.EvmApi.nft.getNFTTokenIdOwners({
      address,
      chain,
      tokenId,
    });

    console.log(response.toJSON());
    return res.json(response);
  } catch (error) {
    console.log("error => ", error);
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
