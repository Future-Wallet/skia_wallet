import CreateWalletAction, {
  TypeOfWalletAction,
} from '../components/create_wallet_action';

export default function Initialization(): JSX.Element {
  return (
    <main>
      <div className="mt-2 mx-2">
        <div className="flex overflow-x-scroll pb-10">
          <div className="flex flex-nowrap ">
            <div className="inline-block px-2">
              <CreateWalletAction type={TypeOfWalletAction.import} />
            </div>
          </div>
          <div className="flex flex-nowrap ">
            <div className="inline-block px-3">
              <CreateWalletAction type={TypeOfWalletAction.create} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
