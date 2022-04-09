import clsx from 'clsx';
import React, { FC, HTMLProps } from 'react';

type Props = HTMLProps<HTMLButtonElement> & {};

const Button: FC<Props> = ({ children, className, ...rest }) => (
    <button
        {...rest}
        type="button"
        className={clsx(
            'bg-lime-700 hover:bg-lime-900 active:bg-lime-800 disabled:bg-gray-600 text-white rounded-md p-2 font-bold',
            className
        )}
    >
        {children}
    </button>
);

export default Button;
