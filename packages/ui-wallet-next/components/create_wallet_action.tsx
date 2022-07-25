import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';

import { stateFormMnenomic, stateUserWallet } from '../state/wallet';
import { UserWallet } from '../utils/wallet_entity';
import Button from './button';

export enum TypeOfWalletAction {
  import,
  create,
}

export default function CreateWalletAction({
  type,
}: {
  type: TypeOfWalletAction;
}) {
  const router = useRouter();
  const [mnemonicInput, setMemonicInput] = useRecoilState(stateFormMnenomic);
  const [walletOfUser, setWalletOfUser] = useRecoilState(
    stateUserWallet(localStorage)
  );

  // const [isPendingForm, startTransitionForm] = useTransition();
  // const [isPendingHandlingWallet, startTransitionHandlingWallet] = useTransition();

  const onChangeTextArea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMemonicInput({ value: event.target.value, error: '' });
  };

  const handleUserWallet = () => {
    let importedUserWallet;
    try {
      importedUserWallet = new UserWallet({
        mnemonic: mnemonicInput.value,
      });

      setWalletOfUser(importedUserWallet);

      // Redirect to the home screen
      router.push('/');
    } catch (err) {
      setMemonicInput({ ...mnemonicInput, ...{ error: err.toString() } });
    }
  };

  return (
    <div className="p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
        {type === TypeOfWalletAction.import
          ? 'You already have a wallet'
          : 'Create a new wallet'}
      </h5>
      <p className="mb-3 font-normal text-gray-700">
        {type === TypeOfWalletAction.import
          ? 'You need to write your private key that consists of 24 words'
          : 'It creates a new unique private key consisting of a phrase of 24 words'}
      </p>
      {type === TypeOfWalletAction.import ? (
        // Import wallet section
        <form>
          <textarea
            rows={3}
            className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Ex: above banana elevator camp..."
            value={mnemonicInput.value}
            onChange={onChangeTextArea}
          />

          {mnemonicInput.error !== undefined ? (
            <p className="mb-3 text-sm text-red-600">{mnemonicInput.error}</p>
          ) : (
            <></>
          )}
        </form>
      ) : (
        // Create wallet section
        <></>
      )}

      <Button onClick={handleUserWallet} className="mt-6">
        {type === TypeOfWalletAction.import ? 'Import' : 'Create'}
      </Button>
    </div>
  );
}
