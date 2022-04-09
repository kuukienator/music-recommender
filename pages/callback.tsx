import type { NextPage } from 'next';
import Router from 'next/router';
import { useEffect } from 'react';
import { processLogin } from '../lib/spotify-auth';

const Callback: NextPage = () => {
    useEffect(() => {
        processLogin(new URLSearchParams(location.search)).then(() =>
            Router.push('/')
        );
    }, []);

    return <div>Logging in...</div>;
};

export default Callback;
