import uuidv4 from "uuid/v4";
import _ from "lodash";

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
