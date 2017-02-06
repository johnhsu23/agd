// This file represents the per-environment variables we need to support.
//
// The module indicated by this .d.ts file is synthetic; we use require.js' path mappings to point this to a real
// module in the env/ directory (see src/main.ts and tasks/config/requirejs.js for usage examples).

/**
 * The URL for the NRCDataService API.
 */
export const api: string;

/**
 * Does the API endpoint need CORS?
 */
export const cors: boolean;

/**
 * The URL for the NDE.
 */
export const nde: string;
