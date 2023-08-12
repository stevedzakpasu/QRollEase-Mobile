import AsyncStorage from "@react-native-async-storage/async-storage";

const saveLocally = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    alert("Something may have gone wrong, please restart the app.");
  }
};

const getLocalValueFor = async (key) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    alert("Something may have gone wrong, please restart the app.");
  }
};
const removeLocalValueFor = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (exception) {
    return false;
  }
};

export { saveLocally, getLocalValueFor, removeLocalValueFor };
