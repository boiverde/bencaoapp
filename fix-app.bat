@echo off
echo 🔧 CORRIGINDO BENCAO MATCH - APLICANDO TODAS AS CORREÇÕES
echo ============================================================

echo.
echo 📁 1. Corrigindo assets...
cd assets\images
if not exist splash.png (
    copy icon.png splash.png
    echo ✅ splash.png criado
) else (
    echo ✅ splash.png já existe
)
cd ..\..

echo.
echo ⚙️ 2. Instalando dependências...
call npm install @react-native-async-storage/async-storage
echo ✅ Dependências instaladas

echo.
echo 🔄 3. Criando backup dos arquivos originais...
if not exist BACKUP mkdir BACKUP
copy utils\supabase.ts BACKUP\supabase-original.ts >nul 2>&1
copy app\index.tsx BACKUP\index-original.tsx >nul 2>&1
echo ✅ Backup criado

echo.
echo 🛠️ 4. Aplicando correção no supabase.ts...
powershell -Command "(Get-Content utils\supabase.ts) -replace 'storage: Platform\.OS === ''web'' \? localStorage : undefined,', 'storage: (typeof window !== ''undefined'' ^&^& window.localStorage) ? window.localStorage : undefined,' | Set-Content utils\supabase.ts"
echo ✅ localStorage corrigido

echo.
echo 📱 5. Aplicando correção no index.tsx...
powershell -Command "(Get-Content app\index.tsx) -replace 'router\.replace\(''\/\(tabs\)''', 'router.push(''/(auth)/login''' | Set-Content app\index.tsx"
powershell -Command "(Get-Content app\index.tsx) -replace '3000', '2000' | Set-Content app\index.tsx"
echo ✅ Navegação corrigida

echo.
echo 🎉 TODAS AS CORREÇÕES APLICADAS COM SUCESSO!
echo ============================================================
echo.
echo 🚀 PRÓXIMOS PASSOS:
echo 1. npx expo start --tunnel
echo 2. Escaneie QR Code no celular
echo 3. Teste o app!
echo.
echo 📱 O app deve ir direto para tela de login
echo 📱 Abas devem aparecer após fazer login
echo.
pause