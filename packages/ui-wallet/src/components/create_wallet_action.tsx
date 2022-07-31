import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { stateFormMnenomic, stateUserWallet } from '../state/wallet';
import { routes } from '../utils/routes';
import { UserWallet } from '../utils/wallet_entity';
import Button from './atomic/button';
import SectionTitle from './atomic/section_title';

export enum TypeOfWalletAction {
  import,
  create,
}

export default function CreateWalletAction({
  type,
}: {
  type: TypeOfWalletAction;
}): JSX.Element | null {
  const navigate = useNavigate();
  const [mnemonicInput, setMemonicInput] = useRecoilState(stateFormMnenomic);
  const setWalletOfUser = useRecoilState(stateUserWallet);

  const onChangeTextArea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMemonicInput({ value: event.target.value, error: '' });
  };

  const handleUserWallet = () => {
    let importedUserWallet;
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
  };

  return (
    <div className="p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md">
      <SectionTitle>
        {type === TypeOfWalletAction.import
          ? 'If you already have a wallet'
          : 'If you want a new wallet'}
      </SectionTitle>
      <p className="mb-3 font-normal text-gray-700">
        {type === TypeOfWalletAction.import
          ? 'You need to write your private key'
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
          ) : null}
        </form>
      ) : // Create wallet section
      null}

      <Button onClick={handleUserWallet} className="mt-6">
        {type === TypeOfWalletAction.import
          ? 'Import your wallet'
          : 'Create a new wallet'}
      </Button>
    </div>
  );
}
