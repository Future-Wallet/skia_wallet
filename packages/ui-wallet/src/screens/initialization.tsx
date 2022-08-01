import Card from '../components/atomic/card';
import CreateWallet from '../components/create_wallet';
import ImportWallet from '../components/import_wallet';

export default function Initialization(): JSX.Element {
  return (
    <main>
      {/* <div className="mt-2 mx-2"> */}
      <div
        id={Initialization.name}
        className="mt-5 mx-2 flex flex-wrap overflow-x-scroll pb-10 justify-center"
      >
        {/* <div className="flex flex-wrap overflow-x-scroll pb-10 justify-center"> */}
        <div className="flex max-w-lg w-full">
          <Card title="If you already have a wallet">
            <ImportWallet />
          </Card>
        </div>
        {/* <div className="flex flex-nowrap max-w-lg"> */}
        <div className="flex max-w-lg w-full">
          <Card title="If you want a new wallet">
            <CreateWallet />
          </Card>
        </div>
      </div>
      {/* </div> */}
    </main>
  );
}
