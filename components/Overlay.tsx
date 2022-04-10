import React, { FC } from 'react';
import Button from './Button';

type Props = {
    onClose: () => void;
    title: string;
    closeButtonText: string;
};

const Overlay: FC<Props> = ({ onClose, children, closeButtonText, title }) => (
    <div
        onClick={() => onClose()}
        className="bg-black fixed inset-0 bg-opacity-60 flex items-center justify-center backdrop-blur z-20"
    >
        <div
            onClick={(e) => {
                if ((e.target as HTMLElement).tagName !== 'A') {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }}
            className="max-h-[80%] min-w-fit background-gradient flex flex-col m-2 shadow-md rounded-md"
        >
            <div className="text-center text-lg font-bold p-2">{title}</div>
            {children}
            <div className="flex justify-center p-2">
                <Button onClick={() => onClose()}>{closeButtonText}</Button>
            </div>
        </div>
    </div>
);

export default Overlay;
