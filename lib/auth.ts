import { z } from 'zod';
import { supabase } from './supabase';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

const signupSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  fullName: z.string().min(2, 'Nome muito curto'),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  denomination: z.string().min(2, 'Denominação inválida'),
});

export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = z.infer<typeof signupSchema>;

export async function login(data: LoginData) {
  try {
    const validated = loginSchema.parse(data);
    const { data: authData, error } = await supabase.auth.signInWithPassword(validated);
    
    if (error) throw error;
    return { data: authData, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function signup(data: SignupData) {
  try {
    const validated = signupSchema.parse(data);
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: validated.email,
      password: validated.password,
    });
    
    if (signUpError) throw signUpError;

    // Create profile after successful signup
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user?.id,
        email: validated.email,
        full_name: validated.fullName,
        birth_date: validated.birthDate,
        denomination: validated.denomination,
      });

    if (profileError) throw profileError;
    
    return { data: authData, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
}