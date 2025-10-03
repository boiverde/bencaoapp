/*
  # Habilitar RLS e criar tabela de notificações

  1. Habilitar RLS
    - Ativar RLS na tabela `connections`

  2. Novas Tabelas
    - `notifications` - Sistema de notificações

  3. Segurança
    - Políticas para connections
    - Políticas para notifications
    - Trigger para notificar matches
*/

-- Habilitar RLS na tabela connections
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

-- Políticas para connections
CREATE POLICY "Users can view connections they are part of"
  ON connections FOR SELECT
  TO authenticated
  USING (auth.uid() = follower_id OR auth.uid() = followed_id);

CREATE POLICY "Users can create connections"
  ON connections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete their own connections"
  ON connections FOR DELETE
  TO authenticated
  USING (auth.uid() = follower_id);

-- Criar tabela para notificações
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('like', 'match', 'message', 'event', 'prayer', 'comment')),
  title text NOT NULL,
  body text NOT NULL,
  data jsonb,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Função para enviar notificação de novo match
CREATE OR REPLACE FUNCTION notify_new_match()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'accepted' AND NEW.matched_at IS NOT NULL THEN
    -- Notificar user1
    INSERT INTO notifications (user_id, type, title, body, data)
    VALUES (
      NEW.user1_id,
      'match',
      'Novo Match!',
      'Você tem um novo match!',
      jsonb_build_object('match_id', NEW.id, 'other_user_id', NEW.user2_id)
    );
    
    -- Notificar user2
    INSERT INTO notifications (user_id, type, title, body, data)
    VALUES (
      NEW.user2_id,
      'match',
      'Novo Match!',
      'Você tem um novo match!',
      jsonb_build_object('match_id', NEW.id, 'other_user_id', NEW.user1_id)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_match_notify ON matches;
CREATE TRIGGER on_match_notify
  AFTER INSERT OR UPDATE ON matches
  FOR EACH ROW
  WHEN (NEW.status = 'accepted')
  EXECUTE FUNCTION notify_new_match();
