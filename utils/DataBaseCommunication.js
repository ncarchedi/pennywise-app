export const dbRemoveInstitutionAccount = async (firebase, uid, itemId) => {
  const ref = await firebase
    .firestore()
    .collection("user_data")
    .doc(uid);

  const removeItem = await ref.update({
    ["plaid_items." + itemId]: firebase.firestore.FieldValue.delete()
  });
};
