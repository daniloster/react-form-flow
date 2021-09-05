import React from 'react';
import FormFlowDataType from './FormFlowDataType';
import { ObservableState } from './react-state';

const context = React.createContext<ObservableState<FormFlowDataType>>((ObservableState.create({} as any as FormFlowDataType)));
export default context;
