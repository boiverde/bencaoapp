@echo off
echo 🔧 CORRIGINDO LOOP DE AUTENTICAÇÃO
echo ================================

echo 📝 Desabilitando FORCE_LOGOUT...
powershell -Command "(Get-Content 'hooks\useAuth.ts') -replace 'const FORCE_LOGOUT = true', 'const FORCE_LOGOUT = false' | Set-Content 'hooks\useAuth.ts'"
echo ✅ FORCE_LOGOUT desabilitado

echo.
echo 📱 Corrigindo lógica de redirecionamento no _layout.tsx das tabs...
powershell -Command "(Get-Content 'app\(tabs)\_layout.tsx') -replace 'if \(!isAuthenticated\)', '// Remover redirect automático - if (!isAuthenticated)' | Set-Content 'app\(tabs)\_layout.tsx'"
echo ✅ Redirect automático removido

echo.
echo 🎉 CORREÇÕES APLICADAS!
echo ================================
echo.
echo 🚀 TESTE AGORA:
echo 1. npx expo start --tunnel --clear
echo 2. Faça login
echo 3. Deve ir para as TABS!
echo.
pause