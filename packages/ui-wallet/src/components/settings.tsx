import { useRecoilState } from 'recoil';
import { stateUserWallet } from '../state/wallet';
import Button from './atomic/button';

export default function Settings(): JSX.Element {
  const [userWallet] = useRecoilState(stateUserWallet);
  return (
    <>
      <p>Your private phrase</p>
      <textarea
        rows={3}
        readOnly={true}
        className="mt-2 mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        value={userWallet?.props.mnemonicPhrase}
      />
      <Button>Delete all your data from this browser</Button>
    </>
  );
}
