import { FC, HTMLProps, ReactNode } from 'react';
import SectionTitle from './section_title';

// type CardProps= {
//   title: string;
// }

interface CardProps extends HTMLProps<HTMLDivElement> {
  title: string;
  children: ReactNode;
  actions?: ReactNode[];
}

const Card: FC<CardProps> = ({ title, actions, children, ...props }) => {
  // <div name="card" className="m-2 w-full" {...props}>
  return (
    <div
      name="card"
      className="m-2 w-full flex justify-center bg-blue-50 rounded-3xl"
      {...props}
    >
      {/* <div className="flex overflow-x-scroll"> */}
      {/* <div className="flex flex-nowrap "> */}
      {/* <div className="flex justify-center bg-blue-50 rounded-2xl"> */}
      {/* <div className="inline-block"> */}
      <div className="max-w-sm p-6 rounded-3xl">
        <div className="flex place-content-between">
          <SectionTitle color="text-blue-800">{title}</SectionTitle>
          <div>{actions}</div>
        </div>
        <div>{children}</div>
      </div>
      {/* </div> */}
    </div>
  );
  /* </div> */
  // </div>
};
export default Card;
