import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store/index';

// Define loan application status types
export type LoanApplicationStatus =
  | '' // Empty/initial state
  | 'PR' // Rejected
  | 'PP' // Pending Pre-Approval
  | 'PC' // Approved
  | 'UP' // ADCB Unapproved Property
  | 'NO' // Valuation Draft In-Progress
  | 'CP' // Pending Customer Consent and Payment
  | 'DU' // Pending Customer Consent and Payment
  | 'OI' // Valuation Order In-Progress
  | 'VC' // Valuation Report Generated
  | 'IN_PROGRESS'
  | ''; // Empty string for initialization

// Define customer types
export type CustomerType = 'ETB' | 'NTB' | 'RM' | null; // Existing To Bank / New To Bank

// Define the type for the auth state
export interface AuthState {
  isAuthenticated: boolean;
  applicationRefNumber: string | null;
  displayMessage: string | null;
  addinfoReqFlag: string | null;
  lapsRefNumber: number | null;
  customerName: string | null;
  customerMobileNumber: string | null;
  emiratesId: string | null;
  loanApplicationNo: string | null;
  loanApplicationStatus: LoanApplicationStatus | null;
  rmCode: string | null;
  rmEmailId: string | null;
  rmMobile: string | null;
  orderId: string | null;
  orderStatus: string | null;
  rmName: string | null;
  approvalDate: string | null;
  customerType: CustomerType;
  lastLoginDatetime: string | null;
  loading: boolean;
  error: string | null;
  lapsApplicationNo: string | null;
  paymentDescription: string | null;
  feeAmount: string | null;
}

// Define the initial state
const initialState: AuthState = {
  isAuthenticated: false,
  applicationRefNumber: null,
  displayMessage: null,
  addinfoReqFlag: null,
  lapsRefNumber: null,
  customerName: null,
  customerMobileNumber: null,
  loanApplicationNo: null,
  loanApplicationStatus: null,
  rmCode: '',
  rmEmailId: '',
  rmMobile: '',
  orderId: null,
  orderStatus: null,
  rmName: null,
  approvalDate: null,
  customerType: null,
  lastLoginDatetime: null,
  loading: false,
  error: null,
  emiratesId: null,
  lapsApplicationNo: '',
  feeAmount: '',
  paymentDescription: '',
};

// Create the auth slice
export const customerAuthSlice = createSlice({
  name: 'customerAuth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Login success
    loginSuccess: (state, action: PayloadAction<Omit<AuthState, 'isAuthenticated' | 'loading' | 'error'>>) => {
      return {
        ...state,
        // ...action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    },

    // Update user profile
    updateProfile: (state, action: PayloadAction<Partial<AuthState>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },

    // Logout - FIXED VERSION
    logout: (state) => {
      // Simply return to initial state
      return initialState;
    },

    // Update application status
    updateApplicationStatus: (
      state,
      action: PayloadAction<{
        loanApplicationStatus?: LoanApplicationStatus;
        orderStatus?: string;
        displayMessage?: string;
      }>
    ) => {
      // console.log('updateApplicationStatus', action.payload.loanApplicationStatus);

      if (action.payload.loanApplicationStatus) {
        state.loanApplicationStatus = action.payload.loanApplicationStatus;
      }
      if (action.payload.orderStatus) {
        state.orderStatus = action.payload.orderStatus;
      }
      if (action.payload.displayMessage) {
        state.displayMessage = action.payload.displayMessage;
      }
    },

    // Update RM details
    updateRMDetails: (
      state,
      action: PayloadAction<{
        rmName?: string;
        rmCode?: string;
        rmEmailId?: string;
        rmMobile?: string;
      }>
    ) => {
      return {
        ...state,
        ...action.payload,
      };
    },

    updateCustomerMobileNumberAndNameAndEmiratedId: (
      state,
      action: PayloadAction<{ mobileNumber: string; customerName?: string; emiratesId?: string }>
    ) => {
      state.customerMobileNumber = action.payload.mobileNumber;

      if (action.payload.customerName) {
        state.customerName = action.payload.customerName;
      }

      if (action.payload.emiratesId) {
        state.emiratesId = action.payload.emiratesId;
      }
    },

    updateLapsApplicationNo: (
      state,
      action: PayloadAction<{
        lapsApplicationNo?: string;
      }>
    ) => {
      if (action.payload.lapsApplicationNo) {
        state.lapsApplicationNo = action.payload.lapsApplicationNo;
      }
    },

    // New reducer for updating application details after payment
    updateApplicationDetailsAfterPayment: (
      state,
      action: PayloadAction<{
        transactionId?: string | null;
        paymentId?: string | null;
        feeAmount?: string | null;
        paymentDescription?: string | null;
        loanApplicationStatus?: LoanApplicationStatus;
      }>
    ) => {
      state.orderId = state.lapsApplicationNo;

      if (action.payload.feeAmount) {
        state.feeAmount = action.payload.feeAmount;
      }
      if (action.payload.paymentDescription) {
        state.paymentDescription = action.payload.paymentDescription;
      }
      if (action.payload.loanApplicationStatus) {
        state.loanApplicationStatus = action.payload.loanApplicationStatus;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  loginSuccess,
  updateProfile,
  logout,
  updateApplicationStatus,
  updateRMDetails,
  updateCustomerMobileNumberAndNameAndEmiratedId,
  updateLapsApplicationNo,
  updateApplicationDetailsAfterPayment,
} = customerAuthSlice.actions;

// Export selectors
export const selectAuth = (state: RootState) => state.customerAuth;
export const selectIsAuthenticated = (state: RootState) => state.customerAuth.isAuthenticated;
export const selectApplicationDetails = (state: RootState) => ({
  applicationRefNumber: state.customerAuth.applicationRefNumber,
  loanApplicationNo: state.customerAuth.loanApplicationNo,
  loanApplicationStatus: state.customerAuth.loanApplicationStatus,
  lapsRefNumber: state.customerAuth.lapsRefNumber,
  lapsApplicationNo: state.customerAuth.lapsApplicationNo,
  feeAmount: state.customerAuth.feeAmount,
  paymentDescription: state.customerAuth.paymentDescription,
  orderId: state.customerAuth.orderId,
});
export const selectRMDetails = (state: RootState) => ({
  rmName: state.customerAuth.rmName,
  rmCode: state.customerAuth.rmCode,
  rmEmailId: state.customerAuth.rmEmailId,
  rmMobile: state.customerAuth.rmMobile,
});
export const selectCustomerDetails = (state: RootState) => ({
  customerName: state.customerAuth.customerName,
  customerType: state.customerAuth.customerType,
  lastLoginDatetime: state.customerAuth.lastLoginDatetime,
});

export const isLoading = (state: RootState) => state.customerAuth.loading;

// Helper function to get human-readable status

export default customerAuthSlice.reducer;
