 /**
  * Storage utility for localStorage operations.
  * Handles get/set/remove for typewriter text and settings.
  */
 // PUBLIC_INTERFACE
export function saveToLocalStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (e) {
    return false;
  }
}

export function loadFromLocalStorage(key) {
  try {
    return window.localStorage.getItem(key) || '';
  } catch (e) {
    return '';
  }
}

export function removeFromLocalStorage(key) {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
}
