export type User = {
    name: string;
    image: string;
    id: string;
};

const randomBytes = (size: number): Uint8Array => {
    return window.crypto.getRandomValues(new Uint8Array(size));
};

const base64url = (bytes: any): string => {
    return window
        .btoa(String.fromCharCode(...bytes))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
};

const generateCodeChallenge = async (
    code_verifier: string
): Promise<string> => {
    const codeVerifierBytes = new TextEncoder().encode(code_verifier);
    const hashBuffer = await crypto.subtle.digest('SHA-256', codeVerifierBytes);
    return base64url(new Uint8Array(hashBuffer));
};

const createAccessToken = async (params: any): Promise<string> => {
    console.log('createAccessToken:req', params);
    const rawResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body: new URLSearchParams({
            client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
            ...params,
        }),
    });

    const response = await rawResponse.json();

    if (response.error) {
        console.error('createAccessToken:err', response);
        return '';
    }

    const accessToken = response.access_token;
    const expires_at = Date.now() + 1000 * response.expires_in;

    console.log('createAccessToken:res', response);
    localStorage.setItem(
        'tokenSet',
        JSON.stringify({ ...response, expires_at })
    );

    return accessToken;
};

export const login = async () => {
    const code_verifier = base64url(randomBytes(96));
    const state = base64url(randomBytes(96));
    const codeChallenge = await generateCodeChallenge(code_verifier);

    const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || '',
        response_type: 'code',
        redirect_uri: `${location.origin}/callback`,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        scope: 'user-top-read streaming user-read-email user-read-private playlist-modify-private playlist-modify-public',
        state: state,
    });

    sessionStorage.setItem('code_verifier', code_verifier);
    sessionStorage.setItem('state', state);

    location.href = `https://accounts.spotify.com/authorize?${params}`;
};

export const processLogin = async (
    params: URLSearchParams
): Promise<string> => {
    console.log('processLogin');
    const code_verifier = sessionStorage.getItem('code_verifier');
    const state = sessionStorage.getItem('state');

    if (params.has('error')) {
        throw new Error(params.get('error') || 'Unknown error');
    } else if (!params.has('state')) {
        throw new Error('State missing from response');
    } else if (params.get('state') !== state) {
        throw new Error('State mismatch');
    } else if (!params.has('code')) {
        throw new Error('Code missing from response');
    }

    return await createAccessToken({
        grant_type: 'authorization_code',
        code: params.get('code'),
        redirect_uri: `${location.origin}/callback`,
        code_verifier,
    });
};

export const getAccessToken = async (): Promise<string | undefined> => {
    const localToken = localStorage.getItem('tokenSet');
    if (!localToken) {
        return;
    }
    let tokenSet = JSON.parse(localToken);
    console.log('getAccessToken', tokenSet);

    if (!tokenSet) {
        return;
    }

    if (tokenSet.expires_at < Date.now()) {
        console.log('expired, getting new token');
        tokenSet = await createAccessToken({
            grant_type: 'refresh_token',
            refresh_token: tokenSet.refresh_token,
        });
    }

    return tokenSet.access_token;
};

export const fetchWithToken = async (
    input: RequestInfo,
    init?: RequestInit | undefined
): Promise<Response> => {
    const accessToken = await getAccessToken();

    return await fetch(input, {
        ...init,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            ...(init?.headers || {}),
        },
    });
};

export const getCurrentUser = async (): Promise<User | undefined> => {
    const response = await fetchWithToken('https://api.spotify.com/v1/me');
    if (!response.ok) {
        return;
    }
    const json = await response.json();

    return {
        name: json.display_name,
        image: json.images[0].url,
        id: json.id,
    } as User;
};
