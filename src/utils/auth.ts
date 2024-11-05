export const saveSession = (token: string) => {
    localStorage.setItem('authTokens', token);
};

export const getSession = (): string | null => {
    return localStorage.getItem('authTokens');
};

export const clearSession = () => {
    localStorage.removeItem('authTokens');
    localStorage.removeItem('user');
};
