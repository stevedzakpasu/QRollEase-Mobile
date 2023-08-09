import * as SecureStore from "expo-secure-store";

export async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

export async function getValueFor(key) {
  try {
    let result = await SecureStore.getItemAsync(key);
    return result;
  } catch (error) {
    return null;
  }
}
export async function removeItem(key) {
  try {
    await SecureStore.deleteItemAsync(key);
    return true;
  } catch (error) {
    return false;
  }
}
