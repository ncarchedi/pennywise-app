import uuidv4 from "uuid/v4";

export const createNewTransaction = (attrs = {}) => {
  const transaction = {
    id: uuidv4(),
    plaid_id: attrs.plaid_id || "",
    name: attrs.name || "",
    amount: attrs.amount || "",
    category: attrs.category || "No Category",
    date: new Date()
  };

  return transaction;
};

export const toPrettyDate = date => {
  // if date is a string, convert to a date
  if (typeof date == "string") date = new Date(date);

  // else, just return the existing string
  return date.toISOString().slice(0, 10);
};
