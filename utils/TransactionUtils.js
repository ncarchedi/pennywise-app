import uuidv4 from "uuid/v4";

export const createNewTransaction = (attrs = {}) => {
  console.log('lol');
  console.log(attrs);

  const transaction = {
    id: uuidv4(),
    plaid_id: attrs.plaid_id || "",
    name: attrs.name || "New Transaction",
    amount: attrs.amount || "0",
    category: attrs.category || "No Category",
    date: attrs.date || new Date().toISOString().slice(0, 10)
  };

  return transaction;
};

export const convertToISO = date => {
  // if date is an actual date object, convert to string
  if (typeof date == "object") return date.toISOString().slice(0, 10);

  // else, just return the existing string
  return date;
};
