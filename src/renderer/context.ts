import React from 'react';
import { Draft } from 'immer';

export interface GlobalContextValues {
  family: {
    person01: {
      name: string;
    };
  };
}

export interface Updater<S> {
  (f: (draft: Draft<S>) => void | S): void;
}

export interface GlobalContext {
  context: GlobalContextValues;
  updateContext: Updater<GlobalContextValues>;
}

export const initialValues: GlobalContextValues = {
  family: {
    person01: {
      name: 'su',
    },
  },
};

export const GlobalContext = React.createContext<GlobalContext>({
  context: initialValues,
  updateContext: () => {},
});
