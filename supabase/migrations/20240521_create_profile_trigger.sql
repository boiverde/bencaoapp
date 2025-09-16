-- Cria a função que será acionada no registo de um novo utilizador.
-- Esta função insere uma nova linha na tabela public.users.
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

-- Cria o trigger que chama a função handle_new_user sempre que um novo utilizador é adicionado à tabela auth.users.
-- (Esta parte não precisa de alteração)
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
