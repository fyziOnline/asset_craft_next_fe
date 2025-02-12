import Cookies from 'js-cookie';
import { nkey } from '@/data/keyStore';

export const CookieManager = {
  // Auth related cookies
  getAuthToken: () => Cookies.get(nkey.auth_token),
  getRefreshToken: () => Cookies.get(nkey.refresh_token),
  getRefreshTokenExpiry: () => Cookies.get(nkey.refresh_token_expiry),
  
  // User related cookies
  getUserEmail: () => Cookies.get(nkey.email_login),
  getUserId: () => Cookies.get(nkey.userID),
  getUserRole: () => Cookies.get(nkey.userRole),
  getClientId: () => Cookies.get(nkey.client_ID),

  // Set methods with default expiry of 180 days
  setAuthToken: (token: string) => Cookies.set(nkey.auth_token, token, { expires: 180 }),
  setRefreshToken: (token: string) => Cookies.set(nkey.refresh_token, token, { expires: 180 }),
  setRefreshTokenExpiry: (expiry: string) => Cookies.set(nkey.refresh_token_expiry, expiry, { expires: 180 }),
  setUserEmail: (email: string) => Cookies.set(nkey.email_login, email, { expires: 180 }),
  setUserId: (id: string) => Cookies.set(nkey.userID, id, { expires: 180 }),
  setUserRole: (role: string) => Cookies.set(nkey.userRole, role, { expires: 180 }),
  setClientId: (id: string) => Cookies.set(nkey.client_ID, id, { expires: 180 }),

  // Clear methods
  clearAuthCookies: (preserveEmail: boolean = true) => {
    Cookies.remove(nkey.auth_token);
    Cookies.remove(nkey.refresh_token);
    Cookies.remove(nkey.refresh_token_expiry);
    Cookies.remove(nkey.client_ID);
    Cookies.remove(nkey.userID);
    Cookies.remove(nkey.userRole);
    
    if (!preserveEmail) {
      Cookies.remove(nkey.email_login);
    }
  }
}; 