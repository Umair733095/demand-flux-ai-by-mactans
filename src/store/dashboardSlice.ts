import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardState {
  hasData: boolean;
  selectedFile: File | null;
  isUploading: boolean;
  accuracy: number | undefined;
  forecastData: any[];
  analysisComplete: boolean;
}

const initialState: DashboardState = {
  hasData: false,
  selectedFile: null,
  isUploading: false,
  accuracy: undefined,
  forecastData: [],
  analysisComplete: false,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setHasData: (state, action: PayloadAction<boolean>) => {
      state.hasData = action.payload;
    },
    setSelectedFile: (state, action: PayloadAction<File | null>) => {
      state.selectedFile = action.payload;
    },
    setIsUploading: (state, action: PayloadAction<boolean>) => {
      state.isUploading = action.payload;
    },
    setAccuracy: (state, action: PayloadAction<number | undefined>) => {
      state.accuracy = action.payload;
    },
    setForecastData: (state, action: PayloadAction<any[]>) => {
      state.forecastData = action.payload;
    },
    setAnalysisComplete: (state, action: PayloadAction<boolean>) => {
      state.analysisComplete = action.payload;
    },
    resetDashboard: (state) => {
      state.hasData = false;
      state.selectedFile = null;
      state.isUploading = false;
      state.accuracy = undefined;
      state.forecastData = [];
      state.analysisComplete = false;
    },
  },
});

export const {
  setHasData,
  setSelectedFile,
  setIsUploading,
  setAccuracy,
  setForecastData,
  setAnalysisComplete,
  resetDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
