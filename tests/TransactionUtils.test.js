import { handleDuplicateHashTransactionsFromPlaid } from "../utils/TransactionUtils";
import _ from "lodash";

const transactions_noduplicates = [
  {
    amount: 107.79,
    date: "2019-08-23",
    hash_id: "f9cee90d0e9691754e4325777ef8ee8c537367c7",
    name: "Transaction 1",
    source: "plaid"
  },
  {
    amount: -505.83,
    date: "2019-08-23",
    hash_id: "4c4f5c178b8f22bf1e0a4c4f7b752092ad25aba6",
    name: "Transaction 2",
    source: "plaid"
  },
  {
    amount: 14.13,
    date: "2019-08-22",
    hash_id: "fddd3e8c104a38b314da8c00da262f812cdf901d",
    name: "Transaction 3",
    source: "plaid"
  }
];

const transactions_one_duplicate = [
  {
    amount: 107.79,
    date: "2019-08-23",
    hash_id: "f9cee90d0e9691754e4325777ef8ee8c537367c7",
    name: "Transaction 1",
    source: "plaid"
  },
  {
    amount: 107.79,
    date: "2019-08-23",
    hash_id: "f9cee90d0e9691754e4325777ef8ee8c537367c7",
    name: "Transaction 1",
    source: "plaid"
  },
  {
    amount: 14.13,
    date: "2019-08-22",
    hash_id: "fddd3e8c104a38b314da8c00da262f812cdf901d",
    name: "Transaction 3",
    source: "plaid"
  }
];

const transactions_two_duplicates = [
  {
    amount: 107.79,
    date: "2019-08-23",
    hash_id: "f9cee90d0e9691754e4325777ef8ee8c537367c7",
    name: "Transaction 1",
    source: "plaid"
  },
  {
    amount: 107.79,
    date: "2019-08-23",
    hash_id: "f9cee90d0e9691754e4325777ef8ee8c537367c7",
    name: "Transaction 1",
    source: "plaid"
  },
  {
    amount: 14.13,
    date: "2019-08-22",
    hash_id: "fddd3e8c104a38b314da8c00da262f812cdf901d",
    name: "Transaction 3",
    source: "plaid"
  },
  {
    amount: 107.79,
    date: "2019-08-23",
    hash_id: "f9cee90d0e9691754e4325777ef8ee8c537367c7",
    name: "Transaction 1",
    source: "plaid"
  }
];

describe("handleDuplicateHashTransactionsFromPlaid", () => {
  it("Doesn't change the transactions when no duplicates are present", () => {
    const result = handleDuplicateHashTransactionsFromPlaid(
      transactions_noduplicates
    );

    expect(_.isEqual(result, transactions_noduplicates)).toBeTruthy();
  });

  it("Changes the transactions when a duplicate is present", () => {
    const result = handleDuplicateHashTransactionsFromPlaid(
      transactions_one_duplicate
    );

    expect(_.isEqual(result, transactions_one_duplicate)).toBeFalsy();
  });

  it("When duplicates hash_ids are present before, they are not present after (2 same hashes", () => {
    const result = handleDuplicateHashTransactionsFromPlaid(
      transactions_one_duplicate
    );

    expect(_.uniqBy(result, "hash_id").length === result.length).toBeTruthy();
  });

  it("When duplicates hash_ids are present before, they are not present after (3 same hashes", () => {
    const result = handleDuplicateHashTransactionsFromPlaid(
      transactions_two_duplicates
    );

    expect(_.uniqBy(result, "hash_id").length === result.length).toBeTruthy();
  });

  it("The result is idempotent (3 same hashes)", () => {
    const result1 = handleDuplicateHashTransactionsFromPlaid(
      transactions_two_duplicates
    );
    const result2 = handleDuplicateHashTransactionsFromPlaid(
      transactions_two_duplicates
    );

    expect(_.isEqual(result1, result2)).toBeTruthy();
  });
});
