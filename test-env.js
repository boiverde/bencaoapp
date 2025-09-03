require('dotenv/config');

console.log('🔍 TESTE DE VARIÁVEIS DE AMBIENTE:');
console.log('================================');
console.log('EXPO_PUBLIC_SUPABASE_URL:', process.env.EXPO_PUBLIC_SUPABASE_URL ? '✅ CARREGADA' : '❌ NÃO ENCONTRADA');
console.log('EXPO_PUBLIC_SUPABASE_ANON_KEY:', process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? '✅ CARREGADA' : '❌ NÃO ENCONTRADA');
console.log('================================');

if (process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
  console.log('🎉 SUCESSO! Todas as variáveis carregadas!');
  console.log('🚀 O app deve funcionar agora!');
} else {
  console.log('❌ ERRO: Variáveis não carregadas');
  console.log('📝 Verifique se o arquivo .env existe na raiz do projeto');
}