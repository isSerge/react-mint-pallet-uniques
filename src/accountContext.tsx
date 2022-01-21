import React, { useContext, createContext, useEffect, useState } from 'react';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

const AccountContext: React.Context<any> =
  createContext({
    accounts: [],
    selectedAccount: ''
  });

export function AccountContextProvider({ children }: any): React.ReactElement {
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
