import clsx from 'clsx';
import React, { FC, HTMLProps } from 'react';

type Props = HTMLProps<HTMLButtonElement>;

const Button: FC<Props> = ({ children, className, ...rest }) => (
    <button
        {...rest}
        type="button"
        className={clsx(
            'bg-fuchsia-600 hover:bg-fuchsia-900 active:bg-fuchsia-800 disabled:bg-gray-600 text-white rounded-md p-2',
            className
        )}
    >
        {children}
    </button>
);

export default Button;
