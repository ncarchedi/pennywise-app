import uuidv4 from "uuid/v4";
import _ from "lodash";
import hash from "object-hash";

export const createNewTransaction = (attrs = {}) => {
  const transaction = {
    id: uuidv4(),
    hash_id: attrs.hash_id || uuidv4(),
    source: attrs.source || "manual",
    name: attrs.name || "",
    amount: attrs.amount || "",
    category: attrs.category || "No Category",
    date: attrs.date ? new Date(attrs.date) : new Date()
  };

  return transaction;
};

export const toPrettyDate = (date, withDay) => {
  // if date is a string, convert to a date
  if (typeof date == "string") date = new Date(date);

  // should we include the day?
  if (withDay) return date.toString().substr(0, 15);

  // else, just return the existing string
  return date.toISOString().slice(0, 10);
};

export const leftJoin = (left, right, left_id, right_id) => {
  var result = [];
  _.each(left, function(litem) {
    var f = _.filter(right, function(ritem) {
      return ritem[right_id] == litem[left_id];
    });
    if (f.length == 0) {
      f = [{}];
    }
    _.each(f, function(i) {
      var newObj = {};
      _.each(litem, function(v, k) {
        newObj[k] = v;
      });
      _.each(i, function(v, k) {
        newObj[k] = v;
      });
      result.push(newObj);
    });
  });
  return result;
};

export const calculateHashForPlaidTransaction = plaidTransaction => {
  // Only use the following properties of the plaid transaction to calculate the hash.
  // Discard properties like transaction_id and account_id, as they are dependent on the access_token,
  // which is refreshed regularly.
  const hashableProperties = {
    amount: plaidTransaction.amount,
    date: plaidTransaction.date,
    iso_currency_code: plaidTransaction.iso_currency_code,
    location: plaidTransaction.location,
    name: plaidTransaction.name,
    payment_meta: plaidTransaction.payment_meta
  };

  return hash(plaidTransaction);
};

/**
 * When you make the exact same expense twice, the hash_ids for those expenses will be the same. This happens
 * for example when you buy a taco, pay for it, and then buy the exact same taco again on the same day.
 *
 * This function will change the hash of 'duplicates' so they are all retained.
 *
 * @param {*} newTransactions: the new transactions - that were not added to the list of transactions
 *                             yet - that we should check and update the hash of
 */
export const handleDuplicateHashTransactionsFromPlaid = newTransactions => {
  let updatedTransactions = newTransactions;

  // Check if multiple transactions have the same hash
  if (_.uniqBy(newTransactions, "hash_id").length !== newTransactions.length) {
    // For all duplicate hashes, get the number of duplicates
    let duplicateHashes = _(newTransactions)
      .countBy("hash_id")
      .pickBy(hash_count => {
        return hash_count > 1;
      })
      .value();

    // Append a unique number to each hash that has duplicates
    updatedTransactions = _(newTransactions)
      .map(item => {
        const hash_dubplicate_count = duplicateHashes[item.hash_id];

        if (hash_dubplicate_count) {
          const newHashId = item.hash_id + "+" + hash_dubplicate_count;

          if (hash_dubplicate_count <= 2) {
            delete duplicateHashes[item.hash_id];
          } else {
            duplicateHashes[item.hash_id] = hash_dubplicate_count - 1;
          }

          return {
            ...item,
            hash_id: newHashId
          };
        } else {
          return item;
        }
      })
      .value();
  }

  return updatedTransactions;
};
