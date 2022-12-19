import { useRecoilState } from 'recoil';

import { stateUserWallet } from '../state/wallet/wallet';
import { copyValueToClipboard } from '../utils/miscellaneous';
import Button from './atomic/button';

export default function Settings(): JSX.Element {
  const [userWallet, setUserWallet] = useRecoilState(stateUserWallet);

  return (
    <div>
      <p>Your private phrase</p>
      <textarea
        rows={3}
        readOnly={true}
        className="my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        value={userWallet?.mnemonicPhrase.value}
      />
      <Button
        onClick={() => {
          if (userWallet !== null) {
            copyValueToClipboard(userWallet.mnemonicPhrase.value);
          }
        }}
      >
        Copy address
      </Button>
      <p className="mt-8 mb-2">
        Delete all your data from this browser (it won't delete any data on the
        blockchain)
      </p>
      <Button
        onClick={() => {
          // Delete data of the `localStorage`
          setUserWallet(null);
        }}
      >
        Delete data
      </Button>
    </div>
  );
}
