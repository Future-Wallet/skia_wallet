import { ReactNode } from 'react';

type Props = {
  navigationBar: ReactNode;
  children: React.ReactNode;
};

function Layout({ navigationBar, children }: Props): JSX.Element {
  return (
    <>
      {/* <div id={Layout.name} className="flex"> */}
      <div id="Navigation">{navigationBar}</div>
      <div id="Content">{children}</div>
      {/* </div> */}
    </>
  );
}

export { Layout };
