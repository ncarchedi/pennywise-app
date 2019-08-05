import uuidv4 from "uuid/v4";

export const createNewTransaction = (attrs = {}) => {
  const Transaction = {
    id: uuidv4(),
    name: attrs.name || "New Transaction",
    amount: attrs.amount || "0",
    category: attrs.category || "No Category",
    date: new Date().toISOString().slice(0, 10)
  };

  return Transaction;
};
