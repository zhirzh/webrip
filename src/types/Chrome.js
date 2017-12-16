// @flow

declare type ChromeStorageItems = {
  [key: string]: any,
};

declare type ChromeCallback = () => void;

declare class ChromeStorageArea {
  get(keys: string, callback: (items: ChromeStorageItems) => void): void;
  set(items: ChromeStorageItems, callback?: ChromeCallback): void;
}

declare class ChromeStorage {
  local: ChromeStorageArea;
  sync: ChromeStorageArea;
}

declare class Chrome {
  storage: ChromeStorage;
}

declare var chrome: Chrome;
