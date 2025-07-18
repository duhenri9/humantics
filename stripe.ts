import { Product } from '../payment-config';
import { showError } from '../utils/toast';

/**
 * Create a Stripe checkout session
 * @param product The product to checkout
 * @param mode The checkout mode ('payment' or 'subscription')
 * @returns The checkout URL
 */
export const createCheckoutSession = async (
  product: Product,
  mode: 'payment' | 'subscription' = 'payment'
): Promise<string | null> => {
  try {
    // Check authentication status
    const authResponse = await fetch('/api/auth/me');
    if (!authResponse.ok) {
      throw new Error('You must be logged in to make a purchase');
    }
    
    const user = await authResponse.json();
    if (!user) {
      throw new Error('You must be logged in to make a purchase');
    }
    
    // Call our Stripe checkout API
    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        price_id: product.id,
        success_url: `${window.location.origin}/billing?success=true`,
        cancel_url: `${window.location.origin}/billing?canceled=true`,
        mode,
        user_id: user.id
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }
    
    const { url } = await response.json();
    
    if (!url) {
      throw new Error('No checkout URL returned');
    }
    
    return url;
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    showError(error.message || 'Failed to create checkout session');
    return null;
  }
};

/**
 * Create a Stripe customer portal session
 * @param returnUrl The URL to return to after the portal session
 * @returns The portal URL
 */
export const createCustomerPortalSession = async (
  returnUrl: string = `${window.location.origin}/billing`
): Promise<string | null> => {
  try {
    // Check authentication status
    const authResponse = await fetch('/api/auth/me');
    if (!authResponse.ok) {
      throw new Error('You must be logged in to access the customer portal');
    }
    
    const user = await authResponse.json();
    if (!user) {
      throw new Error('You must be logged in to access the customer portal');
    }
    
    // Call our customer portal API
    const response = await fetch('/api/stripe/customer-portal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        return_url: returnUrl,
        user_id: user.id
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create customer portal session');
    }
    
    const { url } = await response.json();
    
    if (!url) {
      throw new Error('No portal URL returned');
    }
    
    return url;
  } catch (error: any) {
    console.error('Error creating customer portal session:', error);
    showError(error.message || 'Failed to create customer portal session');
    return null;
  }
};

/**
 * Manage a subscription (update or cancel)
 * @param action The action to perform ('update' or 'cancel')
 * @param newPriceId The new price ID (for update action)
 * @returns Whether the operation was successful
 */
export const manageSubscription = async (
  action: 'update' | 'cancel',
  newPriceId?: string
): Promise<boolean> => {
  try {
    // Check authentication status
    const authResponse = await fetch('/api/auth/me');
    if (!authResponse.ok) {
      throw new Error('You must be logged in to manage your subscription');
    }
    
    const user = await authResponse.json();
    if (!user) {
      throw new Error('You must be logged in to manage your subscription');
    }
    
    // Call our subscription management API
    const response = await fetch('/api/stripe/manage-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action,
        new_price_id: newPriceId,
        user_id: user.id
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to ${action} subscription`);
    }
    
    return true;
  } catch (error: any) {
    console.error(`Error ${action}ing subscription:`, error);
    showError(error.message || `Failed to ${action} subscription`);
    return false;
  }
};