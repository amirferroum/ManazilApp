// MockAsyncStorage.js

const mockStorage = {};

const MockAsyncStorage = {
  getItem: async (key) => {
    return mockStorage[key] || null;
  },
  setItem: async (key, value) => {
    mockStorage[key] = value;
  },
  removeItem: async (key) => {
    delete mockStorage[key];
  },
  clear: async () => {
    mockStorage = {};
  },
  getAllKeys: async () => {
    return Object.keys(mockStorage);
  },
};

export default MockAsyncStorage;
