import React from 'react';

// interface ButtonProps {
//   children: React.ReactNode;
//   // onClick?: ((event: React.MouseEvent<HTMLButtonElement>) => void) | undefined;
//   // onPressed: () => void;
// }

export interface ButtonProps
  extends React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    React.AriaAttributes {}

// export interface ButtonProps
//   extends React.DetailedHTMLProps<
//       React.ButtonHTMLAttributes<HTMLButtonElement>,
//       HTMLButtonElement
//     >,
//     React.AriaAttributes,
//     ButProps {}

// interface Props {
//   onPressed: () => void;
// }

// export const Butt: React.FC<Props> = ({
//   children,
//   onPressed,
//   ...props
// }) => {};

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      type="button"
      {...props}
      className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
    >
      {children}
    </button>
  );
};

export default Button;
