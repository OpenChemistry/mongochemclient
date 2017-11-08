export const getToken = state => state.girder.token;
export const isAuthenticating = state => state.girder.authenticating;
export const isAuthenticated = state => state.girder.token && !state.girder.authenticating;
export const getOauthProviders = state => state.girder.oauth.providers;
export const getMe = state => state.girder.me;
export const isOauthEnabled = state => state.girder.oauth.enabled;
