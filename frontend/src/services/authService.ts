import {
  createUserWithEmailAndPassword,
  deleteUser,
  updateProfile,
  type UserCredential,
} from 'firebase/auth';
import { logAppError } from '../utils/clientLog';
import { auth } from './firebase';
import { createInitialUserProfile } from './userProfileService';

type AuthError = { code?: string };

const PROFILE_SAVE_ERROR_MESSAGE =
  'Could not save your profile. Check your connection and try again.';

export type SignUpResult =
  | { success: true; user: UserCredential }
  | { success: false; message: string };

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'This email is already registered. Sign in instead.',
  'auth/weak-password':
    'Password is too weak. Use 8+ characters with letters, numbers, and symbols.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/operation-not-allowed': 'Email/password sign-up is not enabled. Contact support.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
  'auth/user-disabled': 'This account has been disabled. Contact support.',
  'auth/internal-error': 'Something went wrong on our end. Please try again.',
  'auth/invalid-credential': 'Invalid credentials. Check your email and password.',
};

const PROFILE_ERROR_MESSAGES: Record<string, string> = {
  'permission-denied': PROFILE_SAVE_ERROR_MESSAGE,
  unavailable: 'Service temporarily unavailable. Try again in a moment.',
  'resource-exhausted': 'Too many requests. Please try again later.',
};

const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';

export const getAuthErrorMessage = (code: string): string =>
  AUTH_ERROR_MESSAGES[code] ?? DEFAULT_ERROR_MESSAGE;

const getProfileErrorMessage = (code: string | undefined): string => {
  if (code != null && PROFILE_ERROR_MESSAGES[code] != null) {
    return PROFILE_ERROR_MESSAGES[code];
  }
  return DEFAULT_ERROR_MESSAGE;
};

export const signUp = async (
  email: string,
  password: string,
  displayName?: string
): Promise<SignUpResult> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;
    const resolvedName = displayName?.trim() || email.trim().split('@')[0] || 'User';

    await updateProfile(user, { displayName: resolvedName });

    try {
      await createInitialUserProfile(user.uid, {
        name: resolvedName,
        email: email.trim(),
      });
    } catch (profileError) {
      logAppError('signUp:profile', profileError);
      const profileCode = (profileError as AuthError)?.code;
      await deleteUser(user).catch(() => {
        /* best-effort rollback */
      });
      return { success: false, message: getProfileErrorMessage(profileCode) };
    }

    return { success: true, user: userCredential };
  } catch (error) {
    logAppError('signUp:auth', error);
    const fbError = error as AuthError;
    const message =
      fbError?.code != null ? getAuthErrorMessage(fbError.code) : DEFAULT_ERROR_MESSAGE;
    return { success: false, message };
  }
};
