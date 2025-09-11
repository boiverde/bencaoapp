
import "react-native-url-polyfill/auto";

// --- MOCK SUPABASE CLIENT ---

// This is a mock Supabase client that simulates the API without making network requests.
// It helps in running the app offline or without real Supabase credentials.

const createMockSupabaseClient = () => {
  const mock = {
    from: () => mock, // Chainable
    select: () => mock,
    insert: () => mock,
    update: () => mock,
    delete: () => mock,
    eq: () => mock,
    single: () => Promise.resolve({ data: {}, error: null }),
    auth: {
      onAuthStateChange: () => {
        // Simulate a subscription object with an unsubscribe method
        return {
          data: {
            subscription: {
              unsubscribe: () => {},
            },
          },
        };
      },
      signInWithPassword: () => Promise.resolve({ data: {}, error: null }),
      signUp: () => Promise.resolve({ data: {}, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
  };

  return mock;
};

export const supabase = createMockSupabaseClient();
