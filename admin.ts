// Interface for user data
export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'client';
  plan: 'essencial' | 'agenda' | 'conversao';
  created_at: string;
  last_sign_in_at: string | null;
}

// Placeholder functions for admin operations
// These will be implemented with proper API calls to the server

export const listAllUsers = async (): Promise<AdminUser[]> => {
  try {
    const response = await fetch('/api/admin/users');
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to list users:', error);
    return [];
  }
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Failed to delete user:', error);
    return false;
  }
};

export const resetUserPassword = async (userId: string, newPassword: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/admin/users/${userId}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newPassword }),
    });
    return response.ok;
  } catch (error) {
    console.error('Failed to reset password:', error);
    return false;
  }
};

export const updateUserRole = async (userId: string, newRole: 'admin' | 'client'): Promise<boolean> => {
  try {
    const response = await fetch(`/api/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role: newRole }),
    });
    return response.ok;
  } catch (error) {
    console.error('Failed to update user role:', error);
    return false;
  }
};

export const configureEmailConfirmation = async (enable: boolean): Promise<boolean> => {
  try {
    const response = await fetch('/api/admin/email-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ enabled: enable }),
    });
    return response.ok;
  } catch (error) {
    console.error('Failed to configure email confirmation:', error);
    return false;
  }
};

export const getEmailConfirmationSetting = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/admin/email-confirmation');
    if (!response.ok) {
      return true; // Default to enabled
    }
    const data = await response.json();
    return data.enabled;
  } catch (error) {
    console.error('Failed to get email confirmation setting:', error);
    return true; // Default to enabled
  }
};

export const isCurrentUserAdmin = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/auth/me');
    if (!response.ok) {
      return false;
    }
    const user = await response.json();
    return user.role === 'admin';
  } catch (error) {
    console.error('Failed to check admin status:', error);
    return false;
  }
};

export const withAdminCheck = async <T>(
  operation: () => Promise<T>
): Promise<T> => {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    throw new Error('Unauthorized: Admin access required');
  }
  return operation();
};