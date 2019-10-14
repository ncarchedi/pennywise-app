import { AsyncStorage } from "react-native";

// Used to decide whether we need to run a migration or not
const STORAGE_VERSION = "2";

export const saveItem = async (uid, itemName, itemValue) => {
  try {
    await AsyncStorage.setItem(
      constructSotrageLocation(uid, itemName),
      JSON.stringify(itemValue)
    );
  } catch (error) {
    console.log(error.message);
  }
};

export const loadItem = async (uid, itemName) => {
  return JSON.parse(
    await AsyncStorage.getItem(constructSotrageLocation(uid, itemName))
  );
};

const constructSotrageLocation = (uid, itemName) => {
  return uid + "_" + itemName;
};

export const migrateStorageToLatestVersion = async uid => {
  // Load the storage version of the saved data
  const savedStorageVersion = await AsyncStorage.getItem("storageVersion");

  if (!savedStorageVersion) {
    // Equals 'V1', e.g. before we saved data
    await saveItem(
      uid,
      "transactions",
      JSON.parse(await AsyncStorage.getItem("transactions"))
    );
    await saveItem(
      uid,
      "categories",
      JSON.parse(await AsyncStorage.getItem("categories"))
    );
    await saveItem(
      uid,
      "notificationTime",
      JSON.parse(await AsyncStorage.getItem("notificationTime"))
    );

    await AsyncStorage.setItem("storageVersion", "2");
  }
};
