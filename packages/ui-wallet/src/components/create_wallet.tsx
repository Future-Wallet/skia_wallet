import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { Utils } from '@skiawallet/repositories';

import { stateUserWallet } from '../state/wallet';
import { routes } from '../utils/routes';
import Button from './atomic/button';

export default function CreateWallet(): JSX.Element | null {
  const navigate = useNavigate();
  const [userWallet, setUserWallet] = useRecoilState(stateUserWallet);
  const [creating, setCreating] = useState(false);

  function handleCreateWallet() {
    setCreating(true);

    setUserWallet(Utils.generateMnemonic());

    setCreating(false);
  }

  return (
    <>
      <p className="mb-3 text-gray-700">
        It creates a new unique private key in format of 12 words
      </p>
      <Button
        loading={creating}
        disabled={userWallet !== null}
        onClick={handleCreateWallet}
        className="mt-6"
      >
        Create a new wallet
      </Button>
      {userWallet !== null ? (
        <>
          <p className="mt-5 text-gray-700">
            Write the new private phrase down on a safe place.
          </p>
          <textarea
            rows={4}
            readOnly={true}
            className="mt-2 mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={userWallet.props.mnemonicPhrase}
          />
          <Button onClick={() => navigate(`/${routes.home}`)}>
            Go to your wallet
          </Button>
        </>
      ) : null}
    </>
  );
}
