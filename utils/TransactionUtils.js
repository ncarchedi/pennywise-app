import uuidv4 from "uuid/v4";

export const createNewTransaction = (attrs = {}) => {
  const transaction = {
    id: uuidv4(),
    name: attrs.name || "",
    amount: attrs.amount || "",
    category: attrs.category || "No Category",
    date: new Date().toISOString().slice(0, 10)
  };

  return transaction;
};

export const convertToISO = date => {
  // if date is an actual date object, convert to string
  if (typeof date == "object") return date.toISOString().slice(0, 10);

  // else, just return the existing string
  return date;
};
