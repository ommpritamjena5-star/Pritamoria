export interface StoredUser {
  name: string;
  email: string;
  phoneNumber: string;
  id: string;
}

const API_BASE_URL = '/api/auth';

// Register a new user
export async function registerUser(name: string, email: string, phoneNumber: string, password: string): Promise<{ success: boolean; message: string; user?: StoredUser }> {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, phoneNumber, password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error registering user:', error);
    return {
      success: false,
      message: 'Failed to connect to the authentication server.'
    };
  }
}

// Authenticate user (sign in)
export async function authenticateUser(email: string, password: string): Promise<{ success: boolean; message: string; user?: StoredUser }> {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    return {
      success: false,
      message: 'Failed to connect to the authentication server.'
    };
  }
}

// Request OTP for password reset
export async function requestPasswordResetOtp(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/forgot-password-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error requesting OTP:', error);
    return {
      success: false,
      message: 'Failed to connect to the authentication server.'
    };
  }
}

// Reset user password
export async function resetUserPassword(email: string, otp: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp, newPassword }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error resetting password:', error);
    return {
      success: false,
      message: 'Failed to connect to the authentication server.'
    };
  }
}
