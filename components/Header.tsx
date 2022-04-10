import React, { VFC } from 'react';
import { User } from '../lib/spotify-auth';
import InformationIcon from '../icons/mono/circle-information.svg';

type Props = {
    user?: User;
    toggleShowInformation: (v: boolean) => void;
};

const Header: VFC<Props> = ({ user, toggleShowInformation }) => (
    <header className="flex w-full justify-between items-center px-2 max-w-screen-2xl">
        <div className="text-xl font-bold flex space-x-4">
            <span>Track Recommender</span>
            <InformationIcon
                className="cursor-pointer"
                onClick={() => toggleShowInformation(true)}
            />
        </div>
        <div>
            {user && (
                <div className="flex justify-center flex-row items-center py-2 space-x-2">
                    <img
                        src={user.image}
                        alt={user.name}
                        className="w-8 h-8 object-cover"
                    />
                    <p className="text-center text-lg font-bold">{user.name}</p>
                </div>
            )}
        </div>
    </header>
);

export default Header;
