/**
 * Replace REACT_APP_MOCKAPI_URL in your .env file with your MockAPI.io endpoint.
 * Example: https://67abc123.mockapi.io/api/v1
 *
 * Your MockAPI resource should be named "products" and have these fields:
 *   name (String), price (Number), category (String), image (String),
 *   description (String), sizes (Object/Array), colors (Object/Array),
 *   rating (Number), reviewCount (Number)
 */
export const MOCKAPI_BASE_URL = process.env.REACT_APP_MOCKAPI_URL || "";
