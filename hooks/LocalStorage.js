import AsyncStorage from "@react-native-async-storage/async-storage";

const accessToken = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    alert("Something may have gone wrong, please restart the app.");
  }
};

const getAccessToken = async (key) => {
  try {
    let token = await AsyncStorage.getItem(key);
    return token;
  } catch (error) {
    alert("Something may have gone wrong, please restart the app.");
  }
};
export { accessToken, getAccessToken };
