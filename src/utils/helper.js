import moment from "moment";

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const getInitials = (name) => {
  if (!name) return "";

  const words = name.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }

  return initials.toUpperCase();
};

export const addThousandsSeparator = (num) => {
  if (num == null || isNaN(num)) return "";

  const [integerPart, fractionalPart] = num.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
};

export const prepareExpenseBarChartData = (data = []) => {
  const chartData = data.map((item) => ({
    category: item?.category,
    amount: item?.amount,
  }));

  return chartData;
};

// utils/helper.js

export const prepareIncomeBarChartData = (data = []) => {
  if (!Array.isArray(data) || data.length === 0) return [];

  const getDateValue = (item) =>
    item?.date ?? item?.createdAt ?? item?.timestamp ?? item?.time ?? null;

  const getAmountValue = (item) =>
    Number(item?.amount ?? item?.value ?? item?.total ?? item?.totalAmount ?? 0) || 0;

  const getSourceValue = (item) =>
    item?.source ?? item?.category ?? item?.name ?? item?.title ?? "";

  // sort by parsed date (fallback to 0)
  const sorted = [...data].sort((a, b) => {
    const da = new Date(getDateValue(a) ?? 0).getTime();
    const db = new Date(getDateValue(b) ?? 0).getTime();
    return da - db;
  });

  const chartData = sorted.map((item) => {
    const rawDate = getDateValue(item);
    const d = rawDate ? new Date(rawDate) : new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const label = `${day} ${month}`; // "DD MM" like "05 08"

    const source = getSourceValue(item);
    const amount = getAmountValue(item);

    return {
      // chart expects category + amount
      category: source || label, // prefer source (like "Salary"), fallback to date label
      amount,
      // helpers for debugging / future use
      date: d.toISOString(),
      raw: item,
    };
  });

  return chartData;
};

 
export const prepareExpenseLineChartData = (data = []) => {
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartData = sortedData.map((item) => ({
    month: moment(item?.date).format('Do MMM'),
    amount: item?.amount,
    category: item?.category,
  }));

  return chartData;
}