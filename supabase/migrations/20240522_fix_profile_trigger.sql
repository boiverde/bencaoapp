-- [CORREÇÃO] Recria a função para que ela aponte para a tabela `users` em vez de `profiles`.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- Insere o novo utilizador na tabela public.users, que é a tabela de perfis correta.
  insert into public.users (id, name, email)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', -- Pega o nome dos metadados passados no signUp
    new.email -- Pega o email do registo de autenticação
  );
  return new;
end;
$$;

-- [CORREÇÃO] Recria o trigger para garantir que ele usa a função corrigida.
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
