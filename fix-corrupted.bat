@echo off
echo 🔧 CORRIGINDO ARQUIVOS CORROMPIDOS
echo =================================

echo 📝 1. Removendo linhas corrompidas...
powershell -Command "(Get-Content 'hooks\useAuth.ts') | Where-Object { $_ -notmatch 'ECHO.*desativado' } | Set-Content 'hooks\useAuth.ts'"

echo 📝 2. Criando imagem válida...
cd assets\images
del icon.png >nul 2>&1
echo iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg== | powershell -Command "[System.Convert]::FromBase64String($input) | Set-Content 'icon.png' -Encoding Byte"
copy icon.png splash.png >nul 2>&1
cd ..\..

echo ✅ Arquivos corrigidos!

echo.
echo 🚀 TESTE AGORA:
echo npx expo start --web --clear
echo.
pause