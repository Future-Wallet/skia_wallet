import { FC, HTMLProps, ReactNode } from 'react';
import SectionTitle from './section_title';

// type CardProps= {
//   title: string;
// }

interface CardProps extends HTMLProps<HTMLDivElement> {
  title: string;
  children?: ReactNode;
}

const Card: FC<CardProps> = ({ title, children, ...props }) => {
  return (
    <div className="mt-2 mx-2" {...props}>
      <div className="flex overflow-x-scroll pb-10">
        <div className="flex flex-nowrap ">
          <div className="inline-block px-2">
            <div className="p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md">
              <div>
                <SectionTitle>{title}</SectionTitle>
              </div>
              <div>{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Card;
