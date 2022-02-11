import { AddressOrPair, SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult, AnyTuple, Codec } from "@polkadot/types/types";
import { CodecHash } from "@polkadot/types/interfaces";
import { ApiPromise } from "@polkadot/api";
import type { Signer } from '@polkadot/api/types';
import type { StorageKey } from '@polkadot/types';

export const sendAndFinalize = async (
  tx: SubmittableExtrinsic<"promise", ISubmittableResult>,
  account: AddressOrPair,
  api: ApiPromise,
  signer: Signer,
): Promise<{
  block: number;
  success: boolean;
  hash: CodecHash;
  included: any[];
  finalized: any[];
}> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    let success = false;
    let included: any[] = [];
    let finalized = [];
    let block = 0;
    const unsubscribe = await tx.signAndSend(
      account,
      { nonce: -1, signer },
      async ({ events = [], status, dispatchError }) => {
        if (status.isInBlock) {
          success = dispatchError ? false : true;
          console.log(
            `📀 Transaction ${tx.meta.name} included at blockHash ${status.asInBlock} [success = ${success}]`
          );
          const signedBlock = await api.rpc.chain.getBlock(status.asInBlock);
          block = signedBlock.block.header.number.toNumber();
          included = [...events];
        } else if (status.isBroadcast) {
          console.log(`🚀 Transaction broadcasted.`);
        } else if (status.isFinalized) {
          console.log(
            `💯 Transaction ${tx.meta.name}(..) Finalized at blockHash ${status.asFinalized}`
          );
          finalized = [...events];
          const hash = status.hash;
          unsubscribe();
          resolve({ success, hash, included, finalized, block });
        } else if (status.isReady) {
          // let's not be too noisy..
        } else {
          console.log(`🤷 Other status ${status}`);
        }
      }
    );
  });
};

export function normalizeClass([key, value]: [StorageKey<AnyTuple>, Codec]) {
  const id = parseInt((key.toHuman() as Array<string>)[0].replace(/,/g, ''), 10);
  return { id, value: value.toJSON() }
}

export function normalizeAsset([key, value]: [StorageKey<AnyTuple>, Codec]) {
  const id = parseInt((key.toHuman() as Array<string>)[1], 10);
  return { id, value: value.toJSON() }
}
