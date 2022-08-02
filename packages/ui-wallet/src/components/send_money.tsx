import { ethers, utils } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from 'recoil';

import {
  stateSelectorBalanceOfAccount,
  stateUserWallet,
} from '../state/wallet';
import Api from '../utils/api';
import { AccountOfWallet, Utils } from '../utils/wallet_entity';
import Button from './atomic/button';
import Card from './atomic/card';

type formElementValueProps = {
  value: string;
  error: string | undefined;
};
type formProps = {
  toPublicAddress: formElementValueProps;
  amount: formElementValueProps;
  transactionStatus:
    | {
        status: 'success' | 'error';
        response: ethers.providers.TransactionResponse | undefined;
      }
    | undefined;
  isSubmitting: boolean;
};

export default function SendMoney(): JSX.Element {
  const userWallet = useRecoilValue(stateUserWallet);
  const [gasPrice, setGasPrice] = useState<string | null>(null);
  const [form, setForm] = useState<formProps>({
    toPublicAddress: { value: '', error: undefined },
    amount: { value: '', error: undefined },
    transactionStatus: undefined,
    isSubmitting: false,
  });
  const refresh = useRecoilRefresher_UNSTABLE(stateSelectorBalanceOfAccount);

  const getGasPrice = useCallback(async function () {
    const gasInEther = await Api.getGasPrice();
    setGasPrice(gasInEther);
  }, []);

  useEffect(() => {
    getGasPrice();

    const interval = setInterval(async () => {
      getGasPrice();
    }, 30000);

    return () => clearInterval(interval);
  });

  const onChangeDestinationAddressInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Delete blank spaces.
    const cleanedValue = event.target.value.replace(/\s{1,}/g, '');

    setForm({
      ...form,
      toPublicAddress: {
        value: cleanedValue,
        error: utils.isAddress(cleanedValue)
          ? undefined
          : "Address needs 42 characters and starts with '0x'",
      },
      isSubmitting: false,
    });
  };

  const onChangeAmountInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    let error: string | undefined = undefined;

    // Validate amount format.
    try {
      Utils.convertEtherToWei(value);
    } catch (err) {
      error = 'Not a valid format';
    }

    setForm({
      ...form,
      amount: { value: event.target.value, error: error },
      isSubmitting: false,
    });
  };

  async function submit() {
    const firstAccount = userWallet!.props.accounts[0];

    // Stop the submitting if some data is missing.
    if (
      form.toPublicAddress.error !== undefined ||
      form.amount.error !== undefined ||
      firstAccount === null ||
      gasPrice === null
    ) {
      setForm({
        ...form,
        transactionStatus: { status: 'error', response: undefined },
      });
      return;
    }

    try {
      setForm({ ...form, isSubmitting: true });

      const response = await Api.getInstance(userWallet!).sendMoney({
        fromAccount: userWallet?.props.accounts[0] as AccountOfWallet,
        toPublicAddress: form.toPublicAddress.value as string,
        amountInEther: form.amount.value as string,
        gasPriceInWei: gasPrice as string,
      });

      setForm({
        ...form,
        transactionStatus: { status: 'success', response },
        isSubmitting: false,
      });

      // Update account balance after sending the money.
      refresh();
    } catch (err) {
      console.error(err);
      setForm({
        ...form,
        transactionStatus: { status: 'error', response: undefined },
      });
      return;
    }

    // Reset the form
    setForm({
      toPublicAddress: {
        value: '',
        error: undefined,
      },
      amount: {
        value: '',
        error: undefined,
      },
      transactionStatus: undefined,
      // errorOnSending: undefined,
      isSubmitting: false,
    });
  }

  // function showError(): ReactNode | null {
  //   if (
  //     form.toPublicAddress.error !== undefined &&
  //     form.amount.error !== undefined
  //   ) {
  //     return null;
  //   }

  //   const listOfErrors = [form.toPublicAddress.error, form.amount.error].filter(
  //     (el) => el !== undefined
  //   );

  //   return (
  //     <ul>
  //       {listOfErrors.map((el) => (
  //         <li>{el}</li>
  //       ))}
  //     </ul>
  //   );
  // }

  return (
    <Card title="Send Money">
      <div>
        {/* <div className="relative mb-6"> */}
        <label className="block mb-2 text-gray-900">
          Destination address where you send the money
        </label>
        <div className="mt-1 flex rounded-md">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            Public address
          </span>
          <input
            type="text"
            className="focus:ring-purple-600 focus:border-purple-600 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
            placeholder="Example: 0x8ba1f109551bD432803012645Ac136ddd64DBA72"
            autoComplete="on"
            minLength={42}
            maxLength={42}
            inputMode="text"
            required
            value={form.toPublicAddress.value}
            onChange={onChangeDestinationAddressInput}
          />
        </div>
        {
          // Hide error on the input is empty
          form.toPublicAddress.value.length > 0 ? (
            <p className="mt-1 ml-3 text-sm text-red-600">
              {form.toPublicAddress.error}
            </p>
          ) : null
        }
      </div>
      <div className="mt-5">
        <label className="block mb-2 text-gray-900">
          Amount of AVAX you want to send
        </label>
        <div className="mt-1 flex rounded-md">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            AVAX
          </span>
          <input
            type="text"
            className="focus:ring-purple-600 focus:border-purple-600 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
            placeholder="Example: 3.2145"
            required
            inputMode="numeric"
            value={form.amount.value}
            onChange={onChangeAmountInput}
          />
        </div>
        <p className="mt-2 ml-3 text-sm">Included fee of {gasPrice} AVAX</p>
        {
          // Hide error on the input is empty
          form.toPublicAddress.value.length > 0 ? (
            <p className="ml-3 text-sm text-red-600">{form.amount.error}</p>
          ) : null
        }
      </div>
      <div className="mt-2">
        <Button
          loading={form.isSubmitting}
          onClick={submit}
          disabled={gasPrice === null && userWallet !== null}
        >
          {gasPrice !== null ? 'Send now' : 'Loading data...'}
        </Button>
      </div>
      {/* <div>
        {form.errorOnSending === undefined ? (
          <>
            <p>Transacion succeeded</p>
            <ul>
              <li>
                Sender's public address:{' '}
                {userWallet?.props.accounts[0].props.publicAddress}
              </li>
              <li>Sender's public address: {userWallet?.props}</li>
            </ul>
          </>
        ) : (
          <p>{form.errorOnSending}</p>
        )}
      </div> */}
    </Card>
  );
}
