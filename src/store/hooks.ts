import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import type { RootState, AppDispatch } from './index';

// Properly typed dispatch hook
export const useAppDispatch: () => AppDispatch = useDispatch;
// Properly typed selector hook
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
