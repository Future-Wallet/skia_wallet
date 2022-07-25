import dynamic from 'next/dynamic';

export const localStorageRecoil =
  (key: string, storage: Storage) =>
  ({ setSelf, onSet }: any) => {
    const savedValue = storage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue: object, _: any, isReset: boolean) => {
      isReset
        ? storage.removeItem(key)
        : storage.setItem(key, JSON.stringify(newValue));
    });
  };

// export localStorageRecoil = dynamic(()=>storage,{ssr:false})
