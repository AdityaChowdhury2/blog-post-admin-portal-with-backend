const setLocalStorage = (key: string, value: string | object) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getLocalStorage = (key: string) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

const removeLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};

export { setLocalStorage, getLocalStorage, removeLocalStorage };
