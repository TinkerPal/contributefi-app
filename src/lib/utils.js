import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const setItemInLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const setItemInSessionStorage = (key, data) => {
  sessionStorage.setItem(key, JSON.stringify(data));
};

export const getItemFromLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

export const getItemFromSessionStorage = (key) => {
  return JSON.parse(sessionStorage.getItem(key));
};

export const removeItemFromLocalStorage = (key) => {
  localStorage.removeItem(key);
};

export const removeItemFromSessionStorage = (key) => {
  sessionStorage.removeItem(key);
};

export const maskEmail = (email) => {
  const visibleStart = 5;
  const visibleEnd = 3;

  const start = email.slice(0, visibleStart);
  const end = email.slice(email.length - visibleEnd);

  const maskedMiddle = "*".repeat(email.length - visibleStart - visibleEnd);

  return `${start}${maskedMiddle}${end}`;
};

export const handleCopy = (value) => {
  navigator.clipboard.writeText(value);
};
