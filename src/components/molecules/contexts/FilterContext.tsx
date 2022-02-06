import React, { PropsWithChildren, useState } from 'react';

type ContextProps = {
  filter?: string;
  setFilter: (text: string) => void;
};

const defaultValue: ContextProps = {
  setFilter: () => {},
};

const Context = React.createContext<ContextProps>(defaultValue);

export function FilterContext({ children }: PropsWithChildren<{}>) {
  const [filter, setFilter] = useState<string>('');

  return (
    <Context.Provider
      value={{
        filter: filter,
        setFilter: (filter) => setFilter(filter),
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useFilter(): ContextProps {
  return React.useContext(Context);
}
