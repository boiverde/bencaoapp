import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  User,
  UserCredential
} from 'firebase/auth';
import { auth } from '@/utils/firebaseConfig';

// Register a new user
export const registerUser = async (
  email: string, 
  password: string, 
  displayName: string
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name
    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName
      });
    }
    
    return userCredential;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Sign in existing user
export const signIn = async (
  email: string, 
  password: string
): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Sign out current user
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (
  user: User,
  displayName?: string,
  photoURL?: string
): Promise<void> => {
  try {
    const updates: {
      displayName?: string;
      photoURL?: string;
    } = {};
    
    if (displayName) updates.displayName = displayName;
    if (photoURL) updates.photoURL = photoURL;
    
    await updateProfile(user, updates);
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Update user email
export const updateUserEmail = async (
  user: User,
  newEmail: string
): Promise<void> => {
  try {
    await updateEmail(user, newEmail);
  } catch (error) {
    console.error('Error updating email:', error);
    throw error;
  }
};

// Update user password
export const updateUserPassword = async (
  user: User,
  newPassword: string
): Promise<void> => {
  try {
    await updatePassword(user, newPassword);
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

// Reauthenticate user (required for sensitive operations)
export const reauthenticateUser = async (
  user: User,
  password: string
): Promise<void> => {
  try {
    const credential = EmailAuthProvider.credential(user.email!, password);
    await reauthenticateWithCredential(user, credential);
  } catch (error) {
    console.error('Error reauthenticating user:', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!auth.currentUser;
};