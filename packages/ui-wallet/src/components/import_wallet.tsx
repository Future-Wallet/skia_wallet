import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { stateFormMnenomic, stateUserWallet } from '../state/wallet';
import { routes } from '../utils/routes';
import { UserWallet } from '@skiawallet/entities';
import Button from './atomic/button';

export default function ImportWallet(): JSX.Element {
  const navigate = useNavigate();
  const [mnemonicInput, setMemonicInput] = useRecoilState(stateFormMnenomic);
  const setWalletOfUser = useRecoilState(stateUserWallet);
  const [importing, setImporting] = useState(false);

  const onChangeTextArea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMemonicInput({ value: event.target.value, error: '' });
  };

  const handleUserWallet = () => {
    let importedUserWallet;

    setImporting(true);

    try {
      importedUserWallet = new UserWallet(mnemonicInput.value);

      setWalletOfUser[1](importedUserWallet);

      // Redirect to the home screen
      navigate(`/${routes.home}`, { replace: true });
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setMemonicInput({
          ...mnemonicInput,
          ...{ error: err.toString() },
        });
      }
    }
    setImporting(false);
  };

  return (
    <>
      <p className="mb-3 font-normal text-gray-700">
        Write here your private phrase to allow access to your data
      </p>
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
        ) : null}
      </form>

      <Button loading={importing} onClick={handleUserWallet} className="mt-6">
        Import your wallet
      </Button>
    </>
  );
}
