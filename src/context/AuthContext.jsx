import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

/**
 * AuthProvider — wraps the app to provide authentication state & helpers.
 *
 * SECURITY NOTE:  Passwords are "hashed" with btoa() which is NOT cryptographic
 * hashing.  This is a demo/academic project only.  In production you would use
 * bcrypt on a server and never store passwords client-side.
 */
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ── helpers ─────────────────────────────────────────────────────────── */

  const getUsers = () => {
    try {
      return JSON.parse(localStorage.getItem('skybook_users')) || [];
    } catch {
      return [];
    }
  };

  const saveUsers = (users) => {
    localStorage.setItem('skybook_users', JSON.stringify(users));
  };

  /* ── on mount, rehydrate session ─────────────────────────────────────── */

  useEffect(() => {
    try {
      const stored = localStorage.getItem('skybook_current_user');
      if (stored) {
        const user = JSON.parse(stored);
        setCurrentUser(user);
        setIsAuthenticated(true);
      }
    } catch {
      localStorage.removeItem('skybook_current_user');
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── login ───────────────────────────────────────────────────────────── */

  const login = useCallback((email, password) => {
    const users = getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      return { success: false, message: 'No account found with that email address.' };
    }

    // Demo-only "hash" comparison — NOT secure
    const hashedInput = btoa(password);
    if (user.password !== hashedInput) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    // Strip password before storing in session
    const sessionUser = { ...user };
    delete sessionUser.password;

    localStorage.setItem('skybook_current_user', JSON.stringify(sessionUser));
    setCurrentUser(sessionUser);
    setIsAuthenticated(true);

    return { success: true, message: 'Login successful!', user: sessionUser };
  }, []);

  /* ── signup ──────────────────────────────────────────────────────────── */

  const signup = useCallback((userData) => {
    const { firstName, lastName, email, password, phone } = userData;

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      return { success: false, message: 'Please fill in all required fields.' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    const users = getUsers();

    // Check duplicate email
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone: phone || '',
      // Demo-only "hash" — NOT secure
      password: btoa(password),
      avatar: null,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    // Auto-login (strip password)
    const sessionUser = { ...newUser };
    delete sessionUser.password;

    localStorage.setItem('skybook_current_user', JSON.stringify(sessionUser));
    setCurrentUser(sessionUser);
    setIsAuthenticated(true);

    return { success: true, message: 'Account created successfully!', user: sessionUser };
  }, []);

  /* ── logout ──────────────────────────────────────────────────────────── */

  const logout = useCallback(() => {
    localStorage.removeItem('skybook_current_user');
    setCurrentUser(null);
    setIsAuthenticated(false);
  }, []);

  /* ── update profile ──────────────────────────────────────────────────── */

  const updateProfile = useCallback((data) => {
    const users = getUsers();
    const idx = users.findIndex(
      (u) => u.id === currentUser?.id
    );

    if (idx === -1) {
      return { success: false, message: 'User not found.' };
    }

    // Merge updates (password change handled separately)
    const updatedUser = { ...users[idx], ...data };

    // If a new password is provided, re-hash it
    if (data.newPassword) {
      updatedUser.password = btoa(data.newPassword);
      delete updatedUser.newPassword;
    }

    users[idx] = updatedUser;
    saveUsers(users);

    // Update session (strip password)
    const sessionUser = { ...updatedUser };
    delete sessionUser.password;

    localStorage.setItem('skybook_current_user', JSON.stringify(sessionUser));
    setCurrentUser(sessionUser);

    return { success: true, message: 'Profile updated successfully!', user: sessionUser };
  }, [currentUser]);

  /* ── context value ───────────────────────────────────────────────────── */

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to access auth context.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

export default AuthContext;
