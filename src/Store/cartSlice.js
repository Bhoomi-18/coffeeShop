import { createSlice } from '@reduxjs/toolkit';
import ProfileService from '../services/profileService';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalAmount: 0,
    itemCount: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      
      // Recalculate totals
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      // Trigger profile update for real-time sync
      ProfileService.cartUpdated({
        items: state.items,
        totalAmount: state.totalAmount,
        itemCount: state.itemCount
      });
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      
      // Recalculate totals
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      // Trigger profile update
      ProfileService.cartUpdated({
        items: state.items,
        totalAmount: state.totalAmount,
        itemCount: state.itemCount
      });
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.id === productId);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== productId);
        } else {
          item.quantity = quantity;
        }
      }
      
      // Recalculate totals
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      // Trigger profile update
      ProfileService.cartUpdated({
        items: state.items,
        totalAmount: state.totalAmount,
        itemCount: state.itemCount
      });
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.itemCount = 0;
      
      // Trigger profile update
      ProfileService.cartUpdated({
        items: [],
        totalAmount: 0,
        itemCount: 0
      });
    },
    completeOrder: (state, action) => {
      const orderData = {
        id: action.payload.orderId || Date.now(),
        items: state.items,
        totalAmount: state.totalAmount,
        status: 'pending',
        createdAt: new Date().toISOString(),
        storeLocation: action.payload.storeLocation || 'Main Store'
      };
      
      // Clear cart after order
      state.items = [];
      state.totalAmount = 0;
      state.itemCount = 0;
      
      // Notify about order completion for loyalty points and profile updates
      ProfileService.orderCompleted(orderData);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, completeOrder } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.totalAmount;
export const selectCartItemCount = (state) => state.cart.itemCount;

export default cartSlice.reducer;