import { useContext, createContext, useEffect, useState } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { ApiOptions } from '@polkadot/api/types';

const parsedQuery = new URLSearchParams(window.location.search);
const connectedSocket = parsedQuery.get('rpc') || 'wss://westmint-rpc.polkadot.io';

interface ApiPromiseContextType {
  api?: ApiPromise;
  chainName?: string;
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
  const [apiPromise, setApiPromise] = useState<ApiPromise>();
  const [chainName, setChainName] = useState<string>();

  useEffect(() => {
    if (apiPromise) return;

    console.log(`Connecting to: ${connectedSocket}`)
    
    const query = new URLSearchParams(window.location.search);
    query.set('rpc', connectedSocket);
    history.replaceState(null, "", "?" + query.toString());
    
    const provider = new WsProvider(connectedSocket);
    const api = new ApiPromise({ provider });

    api.isReady
      .then(async () => {
        setApiPromise(api)

        const chain = await api.rpc.system.chain();
        setChainName(chain.toHuman());
      })
      .catch((e) => console.error(e));
  }, [apiPromise]);

  return (
    <ApiPromiseContext.Provider value={{ api: apiPromise, chainName }}>
      {children}
    </ApiPromiseContext.Provider>
  );
}

export const useApi = () => {
  return useContext(ApiPromiseContext);
};
