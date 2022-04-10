// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createHash } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';

const generateRandomString = (length: number): string => {
    let result = '';
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
};

const createCodeChallenge = (codeVerifier: string): string => {
    return createHash('sha256').update(codeVerifier).digest('base64');
};

const verifyCode = generateRandomString(64);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const state = generateRandomString(16);

    const url = new URL('https://accounts.spotify.com/authorize');
    url.searchParams.append('client_id', process.env.SPOTIFY_CLIENT_ID || '');
    url.searchParams.append('state', state);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append(
        'redirect_uri',
        'http://localhost:3000/api/callback'
    );

    // url.searchParams.append('code_challenge_method', 'S256');
    // url.searchParams.append('code_challenge', createCodeChallenge(verifyCode));

    res.redirect(url.toString());
}
