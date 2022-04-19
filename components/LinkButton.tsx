import clsx from 'clsx';
import React, { FC, HTMLProps } from 'react';

type Props = HTMLProps<HTMLAnchorElement>;

const LinkButton: FC<Props> = ({ children, className, ...rest }) => (
    <a
        {...rest}
        className={clsx(
            'bg-fuchsia-600 hover:bg-fuchsia-900 active:bg-fuchsia-800 disabled:bg-gray-600 text-white rounded-md p-2 text-center inline-block w-full',
            className
        )}
    >
        {children}
    </a>
);

export default LinkButton;
