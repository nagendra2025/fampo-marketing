export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      waitlist: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          status: 'pending' | 'invited' | 'active';
          early_bird: boolean;
          invited_at: string | null;
          created_account_at: string | null;
          early_bird_cutoff_date: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
          status?: 'pending' | 'invited' | 'active';
          early_bird?: boolean;
          invited_at?: string | null;
          created_account_at?: string | null;
          early_bird_cutoff_date?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          status?: 'pending' | 'invited' | 'active';
          early_bird?: boolean;
          invited_at?: string | null;
          created_account_at?: string | null;
          early_bird_cutoff_date?: string | null;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_subscription_id: string;
          stripe_customer_id: string;
          status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' | 'incomplete_expired' | 'paused';
          plan_type: 'family';
          price_amount: number;
          currency: 'CAD';
          trial_start: string | null;
          trial_end: string | null;
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end: boolean;
          canceled_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_subscription_id: string;
          stripe_customer_id: string;
          status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' | 'incomplete_expired' | 'paused';
          plan_type?: 'family';
          price_amount: number;
          currency?: 'CAD';
          trial_start?: string | null;
          trial_end?: string | null;
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end?: boolean;
          canceled_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_subscription_id?: string;
          stripe_customer_id?: string;
          status?: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' | 'incomplete_expired' | 'paused';
          plan_type?: 'family';
          price_amount?: number;
          currency?: 'CAD';
          trial_start?: string | null;
          trial_end?: string | null;
          current_period_start?: string;
          current_period_end?: string;
          cancel_at_period_end?: boolean;
          canceled_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          subscription_id: string;
          stripe_payment_intent_id: string;
          amount: number;
          currency: 'CAD';
          status: 'succeeded' | 'failed' | 'pending' | 'canceled' | 'refunded';
          paid_at: string | null;
          refunded_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          subscription_id: string;
          stripe_payment_intent_id: string;
          amount: number;
          currency?: 'CAD';
          status: 'succeeded' | 'failed' | 'pending' | 'canceled' | 'refunded';
          paid_at?: string | null;
          refunded_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          subscription_id?: string;
          stripe_payment_intent_id?: string;
          amount?: number;
          currency?: 'CAD';
          status?: 'succeeded' | 'failed' | 'pending' | 'canceled' | 'refunded';
          paid_at?: string | null;
          refunded_at?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

