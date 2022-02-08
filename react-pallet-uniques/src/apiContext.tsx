
import { useContext, createContext, useEffect, useState } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { ApiOptions } from '@polkadot/api/types';
// import { useChain } from './chainContext'

const parsedQuery = new URLSearchParams(window.location.search);
const connectedSocket = parsedQuery.get('rpc') || 'ws://127.0.0.1:9944';

interface ApiPromiseContextType {
  api?: ApiPromise;
}

interface ApiRxContextProviderProps {
  children?: React.ReactElement;
}

interface ApiContextProviderProps
  extends ApiRxContextProviderProps {
  types?: ApiOptions["types"];
}

const ApiPromiseContext: React.Context<ApiPromiseContextType> =
  createContext({} as ApiPromiseContextType);

export function ApiContextProvider(
  { children }: ApiContextProviderProps
): React.ReactElement {
  // TODO: use context to switch between networks
  // const { selectedChain } = useChain();
  // wss://westmint-rpc.polkadot.io westmint
  // ws://127.0.0.1:9944 local
  const [apiPromise, setApiPromise] = useState<ApiPromise>();

  useEffect(() => {
    if (apiPromise) return;

    console.log(`Connecting to: ${connectedSocket}`)

    const provider = new WsProvider(connectedSocket);
    const api = new ApiPromise({ provider });

    api.isReady
      .then(() => setApiPromise(api))
      .catch((e) => console.error(e));
  }, [apiPromise]);

  return (
    <ApiPromiseContext.Provider
      value={{ api: apiPromise }}
    >
      {children}
    </ApiPromiseContext.Provider>
  );
}

export const useApi = () => {
  return useContext(ApiPromiseContext);
};
