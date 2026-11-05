import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchGoodsByNumber, fetchAnalogues } from './api';

export const loadBrands = createAsyncThunk('parts/loadBrands', async (number) => {
  const goods = await fetchGoodsByNumber(number);

  return [...new Set(goods.map((g) => g.brand))];
});

export const loadOffers = createAsyncThunk('parts/loadOffers', async ({ number, brand }) => {
  const goods = await fetchAnalogues(number, brand);
  const items = [];

  goods
    .filter((g) => g.brand === brand)
    .forEach((g) => {
      items.push({ ...g, isOriginal: true });
      (g.analogues || []).forEach((a) => items.push(a));
    });

  return items;
});

const initialState = {
  number: '',
  brands: { status: 'idle', items: [], error: null },
  selectedBrand: null,
  offers: { status: 'idle', items: [], error: null },
};

const partsSlice = createSlice({
  name: 'parts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadBrands.pending, (state, action) => {
        state.number = action.meta.arg;
        state.brands = { status: 'loading', items: [], error: null };
        state.selectedBrand = null;
        state.offers = initialState.offers;
      })
      .addCase(loadBrands.fulfilled, (state, action) => {
        if (state.number !== action.meta.arg) return;
        state.brands = { status: 'succeeded', items: action.payload, error: null };
      })
      .addCase(loadBrands.rejected, (state, action) => {
        if (state.number !== action.meta.arg) return;
        state.brands = { status: 'failed', items: [], error: action.error.message };
      })
      .addCase(loadOffers.pending, (state, action) => {
        state.selectedBrand = action.meta.arg.brand;
        state.offers = { status: 'loading', items: [], error: null };
      })
      .addCase(loadOffers.fulfilled, (state, action) => {
        if (state.selectedBrand !== action.meta.arg.brand) return;
        state.offers = { status: 'succeeded', items: action.payload, error: null };
      })
      .addCase(loadOffers.rejected, (state, action) => {
        if (state.selectedBrand !== action.meta.arg.brand) return;
        state.offers = { status: 'failed', items: [], error: action.error.message };
      });
  },
});

export default partsSlice.reducer;
