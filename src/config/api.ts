// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

// Default values for forms
export const DEFAULT_VALUES = {
  LANGUAGE: "en",
  DATA_TYPE: "string",
  EHR_SYSTEMS: ["Athena", "Allscripts", "Epic", "Cerner"],
  SUPPORTED_LANGUAGES: [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
  ],
  DATA_TYPES: [
    { value: "string", label: "String" },
    { value: "number", label: "Number" },
    { value: "boolean", label: "Boolean" },
    { value: "date", label: "Date" },
    { value: "array", label: "Array" },
    { value: "object", label: "Object" },
  ],
};
