import React, { VFC } from 'react';
import { User } from '../lib/spotify-auth';
import InformationIcon from '../icons/mono/circle-information.svg';

type Props = {
    user?: User;
    toggleShowInformation: (v: boolean) => void;
};

const Header: VFC<Props> = ({ user, toggleShowInformation }) => (
    <header className="flex w-full justify-between items-center px-2 max-w-screen-2xl py-2">
        <div className="text-xl font-bold flex space-x-2 items-center">
            <span className="">Track Recommender</span>
            <InformationIcon
                className="cursor-pointer"
                onClick={() => toggleShowInformation(true)}
            />
        </div>
        <div>
            {user && (
                <div className="flex justify-center flex-row items-center space-x-2">
                    <img
                        src={user.image}
                        alt={user.name}
                        className="w-6 h-6 object-cover"
                    />
                    <p className="text-center text-lg font-bold">{user.name}</p>
                </div>
            )}
        </div>
    </header>
);

export default Header;
