import React from 'react';

export interface SectionTitleProps
  extends React.DetailedHTMLProps<
      React.HtmlHTMLAttributes<HTMLHeadingElement>,
      HTMLHeadingElement
    >,
    React.AriaAttributes {}

// const SectionTitle: React.FC<HTMLTitleElement> = ({ title, ...props }) => {
const SectionTitle: React.FC<SectionTitleProps> = ({ children, ...props }) => {
  return (
    <h5 {...props} className="mb-5 text-2xl font-bold tracking-tight">
      {children}
    </h5>
  );
};

export default SectionTitle;
