// lib/lightspeed/types.ts

/**
 * Lightspeed API Types
 * These interfaces define the structure of data returned from the Lightspeed Retail API
 */

// Price structure for items
export interface ItemPrice {
  amount: string;
  useTypeID: string;
  useType: string;
}

export interface ItemPrices {
  ItemPrice: ItemPrice[];
}

// Main item structure from Lightspeed API
export interface LightspeedItem {
  itemID: string;
  systemSku: string;
  defaultCost: string;
  avgCost: string;
  discountable: string; // API returns "true"/"false" as strings
  tax: string; // API returns "true"/"false" as strings
  archived: string; // API returns "true"/"false" as strings
  itemType: string;
  laborDurationMinutes: string;
  serialized: string;
  description: string;
  modelYear: string;
  upc: string;
  ean: string;
  customSku: string;
  manufacturerSku: string;
  createTime: string;
  timeStamp: string;
  publishToEcom: string;
  categoryID: string;
  taxClassID: string;
  departmentID: string;
  itemMatrixID: string;
  manufacturerID: string;
  seasonID: string;
  defaultVendorID: string;
  Prices: ItemPrices;
  // Allow for additional properties from API
  [key: string]: unknown;
}

// Item with image URL added (for our enhanced responses)
export interface ItemWithImage extends LightspeedItem {
  imageUrl: string | null;
}

// Image structure from Lightspeed API
export interface LightspeedImage {
  baseImageURL?: string;
  publicID?: string;
  // Add other image properties as needed
  [key: string]: unknown;
}

export interface LightspeedImageResponse {
  Image?: LightspeedImage;
}

// API response structures
export interface LightspeedItemsResponse {
  Item?: LightspeedItem[];
}

// Utility type helpers
export type LightspeedBoolean = 'true' | 'false';

// Helper functions for type conversion
export const lightspeedBooleanToBoolean = (value: string): boolean => {
  return value === 'true';
};

export const booleanToLightspeedBoolean = (value: boolean): LightspeedBoolean => {
  return value ? 'true' : 'false';
};

// Common query parameters for Lightspeed API
export interface LightspeedQueryParams {
  limit?: number;
  offset?: number;
  archived?: LightspeedBoolean;
  load_relations?: string[];
  // Add more as needed
}