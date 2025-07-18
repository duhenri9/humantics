// Authentication utilities for HumanTic platform
// Handles password reset and other auth-related API calls

/**
 * Request a password reset email
 * @param email - User's email address
 * @returns Promise that resolves when email is sent
 */
export const resetPassword = async (email: string): Promise<void> => {
  const response = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erro ao enviar email de recuperação');
  }

  // Always return success to avoid revealing if email exists
  return;
};

/**
 * Reset password with token
 * @param token - Reset token from email
 * @param newPassword - New password
 * @returns Promise that resolves when password is reset
 */
export const confirmPasswordReset = async (token: string, newPassword: string): Promise<void> => {
  const response = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, newPassword }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erro ao redefinir senha');
  }

  return;
};

/**
 * Validate reset token
 * @param token - Reset token from URL
 * @returns Promise that resolves if token is valid
 */
export const validateResetToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/auth/validate-reset-token?token=${token}`, {
      method: 'GET',
    });
    
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Send email confirmation
 * @param email - User's email address
 * @returns Promise that resolves when confirmation email is sent
 */
export const sendEmailConfirmation = async (email: string): Promise<void> => {
  const response = await fetch('/api/auth/send-confirmation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erro ao enviar email de confirmação');
  }

  return;
};