@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion
set "PATH=%USERPROFILE%\nodejs;%PATH%"

echo.
echo ============================
echo  CV-Adapter AI - Inicio
echo ============================
echo.

REM ----------------------------
REM PASO 1 - VERIFICAR NODE
REM ----------------------------
echo [1/9] Verificando Node.js...
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [ERROR paso 1] Node.js no encontrado en %USERPROFILE%\nodejs\
    echo Descargalo en https://nodejs.org
    pause
    exit /b 1
)
node --version
echo [OK] Node.js encontrado

REM ----------------------------
REM PASO 2 - VERIFICAR POSTGRESQL
REM ----------------------------
echo.
echo [2/9] Verificando PostgreSQL...
netstat -aon | findstr ":5432 " | findstr "LISTENING" > nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo PostgreSQL no responde en localhost:5432
    echo.
    set /p "PG_CHOICE=Esta PostgreSQL corriendo? (S para continuar / N para salir): "
    if /i "!PG_CHOICE!"=="N" (
        echo.
        echo [ERROR paso 2] PostgreSQL no esta corriendo.
        echo Arranca PostgreSQL e intenta de nuevo.
        pause
        exit /b 1
    )
    echo Continuando sin confirmar conexion...
) else (
    echo [OK] PostgreSQL activo en localhost:5432
)

REM ----------------------------
REM PASO 3 - CONFIGURAR .env
REM ----------------------------
echo.
echo [3/9] Comprobando .env...
if not exist ".env" (
    echo.
    echo [ERROR paso 3] No se encontro el archivo .env en esta carpeta.
    echo Asegurate de ejecutar start.bat desde la carpeta cv-adapter-ai
    pause
    exit /b 1
)
set "DB_URL_VAL="
for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
    if /i "%%A"=="DATABASE_URL" set "DB_URL_VAL=%%B"
)
echo !DB_URL_VAL! | findstr /i "password" > nul 2>&1
if !errorlevel! equ 0 (
    echo DATABASE_URL tiene valores de plantilla.
    echo.
    set /p "PG_PASS=Introduce tu password de PostgreSQL para el usuario postgres: "
    if "!PG_PASS!"=="" set "PG_PASS=postgres"
    (
        for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
            if /i "%%A"=="DATABASE_URL" (
                echo DATABASE_URL="postgresql://postgres:!PG_PASS!@localhost:5432/cv_adapter_ai"
            ) else (
                if "%%B"=="" (
                    echo %%A
                ) else (
                    echo %%A=%%B
                )
            )
        )
    ) > ".env.tmp"
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR paso 3] No se pudo reescribir el archivo .env
        pause
        exit /b 1
    )
    move /y ".env.tmp" ".env" > nul
    echo [OK] DATABASE_URL actualizada
) else (
    echo [OK] DATABASE_URL configurada
)

REM ----------------------------
REM PASO 4 - SINCRONIZAR BD
REM ----------------------------
echo.
echo [4/9] Sincronizando base de datos...
cmd /c npx prisma db push --accept-data-loss
if %errorlevel% neq 0 (
    echo.
    echo [ERROR paso 4] prisma db push fallo
    echo Verifica que PostgreSQL este corriendo y DATABASE_URL sea correcta
    pause
    exit /b 1
)
echo [OK] Base de datos sincronizada

REM ----------------------------
REM PASO 5 - VERIFICAR API KEY
REM ----------------------------
echo.
echo [5/9] Verificando API key de IA...
set "AI_PROVIDER="
for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
    if /i "%%A"=="AI_PROVIDER" set "AI_PROVIDER=%%~B"
)
if "!AI_PROVIDER!"=="" set "AI_PROVIDER=gemini"
echo Proveedor activo: !AI_PROVIDER!
set "ENV_KEY="
if /i "!AI_PROVIDER!"=="openai"    set "ENV_KEY=OPENAI_API_KEY"
if /i "!AI_PROVIDER!"=="anthropic" set "ENV_KEY=ANTHROPIC_API_KEY"
if /i "!AI_PROVIDER!"=="gemini"    set "ENV_KEY=GOOGLE_API_KEY"
if /i "!AI_PROVIDER!"=="deepseek"  set "ENV_KEY=DEEPSEEK_API_KEY"
if /i "!AI_PROVIDER!"=="qwen"      set "ENV_KEY=DASHSCOPE_API_KEY"
if /i "!AI_PROVIDER!"=="zhipu"     set "ENV_KEY=ZHIPU_API_KEY"
if "!ENV_KEY!"=="" (
    echo Proveedor desconocido: !AI_PROVIDER!, usando gemini por defecto
    set "AI_PROVIDER=gemini"
    set "ENV_KEY=GOOGLE_API_KEY"
)
set "KEY_VAL="
for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
    if /i "%%A"=="!ENV_KEY!" set "KEY_VAL=%%~B"
)
set "KEY_EMPTY=0"
if "!KEY_VAL!"=="" set "KEY_EMPTY=1"
echo !KEY_VAL! | findstr /i "xxxx placeholder your_key" > nul 2>&1
if !errorlevel! equ 0 set "KEY_EMPTY=1"
if "!KEY_EMPTY!"=="0" (
    echo [OK] !ENV_KEY! configurada
    goto :API_KEY_DONE
)
echo.
echo El proveedor activo es [!AI_PROVIDER!]. No hay API key configurada.
echo.
set /p "CHANGE_PROV=Quieres cambiar de proveedor? (S/N): "
if /i "!CHANGE_PROV!"=="S" goto :SHOW_PROVIDER_MENU
goto :ASK_KEY_NOW

:SHOW_PROVIDER_MENU
echo.
echo 1. openai    - https://platform.openai.com/api-keys
echo 2. anthropic - https://console.anthropic.com/settings/keys
echo 3. gemini    - https://aistudio.google.com/app/apikey (GRATIS)
echo 4. deepseek  - https://platform.deepseek.com/api_keys
echo 5. qwen      - https://dashscope.console.aliyun.com/apiKey
echo 6. zhipu     - https://open.bigmodel.cn/usercenter/apikeys
echo.

:PROV_LOOP
set "PROV_NUM="
set /p "PROV_NUM=Elige proveedor (1-6): "
if "!PROV_NUM!"=="1" ( set "AI_PROVIDER=openai"    & set "ENV_KEY=OPENAI_API_KEY"    & goto :PROV_SELECTED )
if "!PROV_NUM!"=="2" ( set "AI_PROVIDER=anthropic" & set "ENV_KEY=ANTHROPIC_API_KEY" & goto :PROV_SELECTED )
if "!PROV_NUM!"=="3" ( set "AI_PROVIDER=gemini"    & set "ENV_KEY=GOOGLE_API_KEY"    & goto :PROV_SELECTED )
if "!PROV_NUM!"=="4" ( set "AI_PROVIDER=deepseek"  & set "ENV_KEY=DEEPSEEK_API_KEY"  & goto :PROV_SELECTED )
if "!PROV_NUM!"=="5" ( set "AI_PROVIDER=qwen"      & set "ENV_KEY=DASHSCOPE_API_KEY" & goto :PROV_SELECTED )
if "!PROV_NUM!"=="6" ( set "AI_PROVIDER=zhipu"     & set "ENV_KEY=ZHIPU_API_KEY"     & goto :PROV_SELECTED )
echo Opcion invalida. Escribe un numero del 1 al 6.
goto :PROV_LOOP

:PROV_SELECTED
(
    for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
        if /i "%%A"=="AI_PROVIDER" (
            echo AI_PROVIDER="!AI_PROVIDER!"
        ) else (
            if "%%B"=="" (
                echo %%A
            ) else (
                echo %%A=%%B
            )
        )
    )
) > ".env.tmp"
move /y ".env.tmp" ".env" > nul
echo [OK] AI_PROVIDER actualizado a: !AI_PROVIDER!

:ASK_KEY_NOW
echo.
set /p "NEW_API_KEY=Introduce tu !ENV_KEY!: "
if "!NEW_API_KEY!"=="" (
    echo.
    echo [ERROR paso 5] No introdujiste ninguna clave.
    pause
    exit /b 1
)
(
    for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
        if /i "%%A"=="!ENV_KEY!" (
            echo !ENV_KEY!="!NEW_API_KEY!"
        ) else (
            if "%%B"=="" (
                echo %%A
            ) else (
                echo %%A=%%B
            )
        )
    )
) > ".env.tmp"
if %errorlevel% neq 0 (
    echo.
    echo [ERROR paso 5] No se pudo guardar la API key en .env
    pause
    exit /b 1
)
move /y ".env.tmp" ".env" > nul
echo [OK] !ENV_KEY! guardada en .env

:API_KEY_DONE

REM ----------------------------
REM PASO 6 - INSTALAR DEPS
REM ----------------------------
echo.
echo [6/9] Comprobando dependencias npm...
if exist "node_modules" (
    echo [OK] node_modules ya existe, omitiendo npm install
) else (
    echo Instalando dependencias, puede tardar varios minutos...
    cmd /c npm install
    if !errorlevel! neq 0 (
        echo.
        echo [ERROR paso 6] npm install fallo
        pause
        exit /b 1
    )
    echo [OK] Dependencias instaladas
)

REM ----------------------------
REM PASO 7 - BUILD
REM ----------------------------
echo.
echo [7/9] Comprobando build...
if exist ".next\prerender-manifest.json" (
    echo [OK] Build existente encontrado, omitiendo npm run build
) else (
    echo Construyendo la aplicacion, puede tardar 1-2 minutos...
    cmd /c npm run build
    if !errorlevel! neq 0 (
        echo.
        echo [ERROR paso 7] npm run build fallo
        pause
        exit /b 1
    )
    echo [OK] Build completado
)

REM ----------------------------
REM PASO 8 - CREAR CARPETAS
REM ----------------------------
echo.
echo [8/9] Preparando carpetas...
if not exist "public\generated" (
    mkdir "public\generated"
    if !errorlevel! neq 0 (
        echo.
        echo [ERROR paso 8] No se pudo crear public\generated
        pause
        exit /b 1
    )
    echo [OK] Carpeta public\generated creada
) else (
    echo [OK] Carpeta public\generated ya existe
)

REM ----------------------------
REM PASO 9 - ARRANCAR SERVIDOR
REM ----------------------------
echo.
echo [9/9] Arrancando servidor...
echo Liberando puerto 3000...
for /f "tokens=5" %%P in ('netstat -aon ^| findstr ":3000 " ^| findstr "LISTENING"') do taskkill /PID %%P /F > nul 2>&1
echo [OK] Puerto 3000 libre
start "CV-Adapter-Server" /b cmd /c "set PATH=%USERPROFILE%\nodejs;%PATH% && npm run start"
timeout /t 4 /nobreak > nul
start http://localhost:3000
echo.
echo Servidor corriendo en http://localhost:3000
echo Cierra esta ventana para detener el servidor.
echo.
pause

endlocal
