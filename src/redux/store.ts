import { Middleware, combineReducers, configureStore } from '@reduxjs/toolkit';
import schemaReducer, { STORAGE_KEY } from './schemaSlice';

export const localStorageMiddleware: Middleware<{}, RootState> = storeApi => next => action => {
  const state = storeApi.getState();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.schema));

  return next(action);
}

const rootReducer = combineReducers({ schema: schemaReducer });

const store = configureStore({
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(localStorageMiddleware),
  reducer: rootReducer
});


export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

export default store;