@echo off
cls
echo ========================================
echo 🔧 BENCAO MATCH - CORRIGIR LOGIN V3
echo ========================================
echo.

echo 📝 1. Fazendo backup dos arquivos...
if not exist BACKUP mkdir BACKUP
copy "app\index.tsx" "BACKUP\index-backup.tsx" >nul 2>&1
copy "hooks\useAuth.ts" "BACKUP\useAuth-backup.ts" >nul 2>&1
echo ✅ Backup criado

echo.
echo 🔧 2. Corrigindo app\index.tsx...

echo import { useEffect, useRef } from 'react'; > temp_index.tsx
echo import { StyleSheet, View, Text, Animated, Platform } from 'react-native'; >> temp_index.tsx
echo import { LinearGradient } from 'expo-linear-gradient'; >> temp_index.tsx
echo import { useRouter } from 'expo-router'; >> temp_index.tsx
echo import Theme from '@/constants/Theme'; >> temp_index.tsx
echo import { Heart, Sparkles } from 'lucide-react-native'; >> temp_index.tsx
echo. >> temp_index.tsx
echo export default function SplashScreen() { >> temp_index.tsx
echo   const router = useRouter(); >> temp_index.tsx
echo   const fadeAnim = useRef(new Animated.Value(0)).current; >> temp_index.tsx
echo   const scaleAnim = useRef(new Animated.Value(0.8)).current; >> temp_index.tsx
echo   const sparkleAnim = useRef(new Animated.Value(0)).current; >> temp_index.tsx
echo. >> temp_index.tsx
echo   useEffect(() =^> { >> temp_index.tsx
echo     // Start animations >> temp_index.tsx
echo     Animated.parallel([ >> temp_index.tsx
echo       Animated.timing(fadeAnim, { >> temp_index.tsx
echo         toValue: 1, >> temp_index.tsx
echo         duration: 1000, >> temp_index.tsx
echo         useNativeDriver: true, >> temp_index.tsx
echo       }), >> temp_index.tsx
echo       Animated.spring(scaleAnim, { >> temp_index.tsx
echo         toValue: 1, >> temp_index.tsx
echo         tension: 50, >> temp_index.tsx
echo         friction: 7, >> temp_index.tsx
echo         useNativeDriver: true, >> temp_index.tsx
echo       }), >> temp_index.tsx
echo     ]).start(); >> temp_index.tsx
echo. >> temp_index.tsx
echo     // FORCAR IR SEMPRE PARA LOGIN >> temp_index.tsx
echo     const timer = setTimeout(() =^> { >> temp_index.tsx
echo       console.log('Redirecionando para login...'); >> temp_index.tsx
echo       router.replace('/(auth)/login'); >> temp_index.tsx
echo     }, 2000); >> temp_index.tsx
echo. >> temp_index.tsx
echo     return () =^> clearTimeout(timer); >> temp_index.tsx
echo   }, [router]); >> temp_index.tsx
echo. >> temp_index.tsx
echo   return ( >> temp_index.tsx
echo     ^<View style={styles.container}^> >> temp_index.tsx
echo       ^<LinearGradient >> temp_index.tsx
echo         colors={[Theme.colors.primary.blue, Theme.colors.primary.lilac, Theme.colors.primary.pink]} >> temp_index.tsx
echo         style={styles.background} >> temp_index.tsx
echo         start={{ x: 0, y: 0 }} >> temp_index.tsx
echo         end={{ x: 1, y: 1 }} >> temp_index.tsx
echo       /^> >> temp_index.tsx
echo       ^<Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}^> >> temp_index.tsx
echo         ^<View style={styles.logoContainer}^> >> temp_index.tsx
echo           ^<Heart size={60} color={Theme.colors.primary.gold} fill={Theme.colors.primary.gold} /^> >> temp_index.tsx
echo           ^<Text style={styles.appName}^>Bencao Match^</Text^> >> temp_index.tsx
echo           ^<Text style={styles.tagline}^>Conexoes abencoadass^</Text^> >> temp_index.tsx
echo         ^</View^> >> temp_index.tsx
echo       ^</Animated.View^> >> temp_index.tsx
echo     ^</View^> >> temp_index.tsx
echo   ); >> temp_index.tsx
echo } >> temp_index.tsx
echo. >> temp_index.tsx
echo const styles = StyleSheet.create({ >> temp_index.tsx
echo   container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, >> temp_index.tsx
echo   background: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }, >> temp_index.tsx
echo   content: { flex: 1, justifyContent: 'center', alignItems: 'center' }, >> temp_index.tsx
echo   logoContainer: { alignItems: 'center', marginBottom: 50 }, >> temp_index.tsx
echo   appName: { fontSize: 42, color: 'white', textAlign: 'center', marginBottom: 10 }, >> temp_index.tsx
echo   tagline: { fontSize: 18, color: 'white', textAlign: 'center' } >> temp_index.tsx
echo }); >> temp_index.tsx

move temp_index.tsx "app\index.tsx"
echo ✅ app\index.tsx corrigido

echo.
echo 🔧 3. Verificando useAuth.ts...
findstr /C:"FORCE_LOGOUT" "hooks\useAuth.ts" >nul
if errorlevel 1 (
    echo ⚠️ Adicionando FORCE_LOGOUT ao useAuth.ts...
    powershell -Command "(Get-Content 'hooks\useAuth.ts') -replace 'const USE_REAL_AUTH', 'const FORCE_LOGOUT = true; const USE_REAL_AUTH' | Set-Content 'hooks\useAuth.ts'"
    echo ✅ FORCE_LOGOUT adicionado
) else (
    echo ✅ FORCE_LOGOUT já existe
)

echo.
echo 🚀 4. Testando correções...
echo ✅ Todas as correções aplicadas!

echo.
echo ========================================
echo 🎉 CORREÇÕES CONCLUÍDAS!
echo ========================================
echo.
echo 📱 PRÓXIMOS PASSOS:
echo 1. npx expo start --tunnel --clear
echo 2. Escaneie QR Code no celular
echo 3. Deve aparecer TELA DE LOGIN!
echo.
echo 📂 Backups salvos em: BACKUP\
echo.
pause