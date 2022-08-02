import { ReactNode } from 'react';

type ModalProps = {
  title: string;
  children: ReactNode;
  onClose: VoidFunction;
};

const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => {
  return (
    <div
      tabIndex={-1}
      className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 md:inset-0 h-modal md:h-full bg-transparent"
    >
      <div className="relative p-4 w-full max-w-md h-full md:h-auto mx-auto">
        <div className="relative bg-blue-100 rounded-3xl shadow">
          <div className="flex justify-between items-start py-4 pr-4 pl-6 rounded-3xl ">
            <h3 className="text-xl font-semibold text-gray-900 ">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-purple-600 bg-transparent hover:bg-gradient-to-br from-blue-500 to-purple-600 hover:text-white rounded-full text-sm p-1.5 ml-auto inline-flex items-center "
              data-modal-toggle="defaultModal"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close</span>
            </button>
          </div>
          <div className="px-6 pb-6 rounded-3xl">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
