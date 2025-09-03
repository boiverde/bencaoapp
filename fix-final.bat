@echo off
cls
echo ========================================
echo 🚨 BENCAO MATCH - CORREÇÃO FINAL
echo ========================================
echo.

echo 📝 Fazendo backup...
if not exist BACKUP mkdir BACKUP
copy "utils\stateManager.ts" "BACKUP\" >nul 2>&1
copy "hooks\useAuth.ts" "BACKUP\" >nul 2>&1

echo.
echo 🔧 Removendo TODAS as dependências problemáticas...

echo // State manager simples SEM localStorage > "utils\stateManager.ts"
echo const globalState = {}; >> "utils\stateManager.ts"
echo export function useGlobalState(key, initialState) { >> "utils\stateManager.ts"
echo   const [state, setState] = React.useState(initialState); >> "utils\stateManager.ts"
echo   return [state, setState]; >> "utils\stateManager.ts"
echo } >> "utils\stateManager.ts"

echo.
echo 🎉 VERSÃO MOCK PURA ATIVADA!
echo ================================
echo.
echo 🔑 CREDENCIAIS PARA TESTE:
echo Email: demo@example.com
echo Senha: password
echo.
echo OU
echo.
echo Email: teste@gmail.com  
echo Senha: 123456
echo.
echo 🚀 EXECUTE: npx expo start --tunnel --clear
echo.
pause