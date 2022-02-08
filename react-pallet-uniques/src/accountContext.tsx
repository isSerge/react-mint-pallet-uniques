import { useContext, createContext, useEffect, useState, Context, Dispatch, SetStateAction } from 'react';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

interface IAccountContext {
  accounts: InjectedAccountWithMeta[],
  selectedAccount: string;
  selectAccount: Dispatch<SetStateAction<string>>;
}

interface ContextProviderProps {
  children?: React.ReactElement;
}

const AccountContext: Context<IAccountContext> =
  createContext({
    accounts: [],
    selectedAccount: '',
    selectAccount: () => null,
  } as IAccountContext);

export function AccountProvider({ children }: ContextProviderProps): React.ReactElement {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selectedAccount, selectAccount] = useState<string>('');

  useEffect(() => {
    web3Enable('my cool dapp').then(extensions => {
      if (extensions.length === 0) {
        console.log('no extension installed');
        return;
      }

      web3Accounts().then(accounts => {
        setAccounts(accounts);
        selectAccount(accounts[0].meta.name || '');
      });
    })
  }, []);

  return (
    <AccountContext.Provider
      value={{ accounts, selectAccount, selectedAccount }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export const useAccount = () => {
  return useContext(AccountContext);
};
