# =============================================================
#  cv-adapter-ai — Setup y arranque local completo
#  Ejecutar: powershell -ExecutionPolicy Bypass -File setup-local.ps1
# =============================================================

$ErrorActionPreference = "Continue"
$projectDir = $PSScriptRoot

function Write-Step($msg) { Write-Host "`n$msg" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "  [OK] $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "  [!]  $msg" -ForegroundColor Yellow }
function Write-Fail($msg) { Write-Host "  [X]  $msg" -ForegroundColor Red }

$providerUrls = @{
    openai    = @{ name = "OpenAI (GPT-4o)";       envKey = "OPENAI_API_KEY";    url = "https://platform.openai.com/api-keys";                prefix = "sk-" }
    anthropic = @{ name = "Anthropic (Claude)";     envKey = "ANTHROPIC_API_KEY"; url = "https://console.anthropic.com/settings/keys";          prefix = "sk-ant-" }
    gemini    = @{ name = "Google (Gemini)";        envKey = "GOOGLE_API_KEY";    url = "https://aistudio.google.com/app/apikey";               prefix = "AIza" }
    deepseek  = @{ name = "DeepSeek";               envKey = "DEEPSEEK_API_KEY";  url = "https://platform.deepseek.com/api_keys";               prefix = "sk-" }
    qwen      = @{ name = "Alibaba Qwen";           envKey = "DASHSCOPE_API_KEY"; url = "https://dashscope.console.aliyun.com/apiKey";          prefix = "sk-" }
    zhipu     = @{ name = "Zhipu GLM";              envKey = "ZHIPU_API_KEY";     url = "https://open.bigmodel.cn/usercenter/apikeys";          prefix = "" }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  CV Adapter AI — Setup local (Windows)" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# ── 1. Node.js en PATH ──────────────────────────────────────
Write-Step "[ 1/7 ] Localizando Node.js..."

$nodePath = $null
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodePath = Split-Path (Get-Command node).Source
} elseif (Test-Path "$env:USERPROFILE\nodejs\node.exe") {
    $nodePath = "$env:USERPROFILE\nodejs"
}

if (-not $nodePath) {
    Write-Warn "Node.js no encontrado. Instalando con winget..."
    winget install OpenJS.NodeJS.LTS --silent --accept-source-agreements --accept-package-agreements
    $env:PATH = "C:\Program Files\nodejs;" + $env:PATH
    $nodePath = "C:\Program Files\nodejs"
}

$env:PATH = "$nodePath;" + $env:PATH
Write-Ok "Node.js $(node --version)  |  npm $(npm --version)"

# ── 2. PostgreSQL ───────────────────────────────────────────
Write-Step "[ 2/7 ] Verificando PostgreSQL..."

$pgService  = Get-Service -Name postgresql* -ErrorAction SilentlyContinue | Where-Object { $_.Status -eq "Running" }
$pgInstalled = Get-Command psql -ErrorAction SilentlyContinue

if (-not $pgInstalled -and -not $pgService) {
    Write-Warn "PostgreSQL no detectado. Instalando con winget (2-3 min)..."
    winget install PostgreSQL.PostgreSQL --silent --accept-source-agreements --accept-package-agreements --override "--superpassword postgres --servicename postgresql --serviceaccount NetworkService"
    $env:PATH = "C:\Program Files\PostgreSQL\17\bin;" + $env:PATH
    Start-Sleep -Seconds 5
    Get-Service -Name postgresql* -ErrorAction SilentlyContinue | Start-Service
    Start-Sleep -Seconds 3
    Write-Ok "PostgreSQL instalado"
} else {
    $pgBin = "C:\Program Files\PostgreSQL\17\bin"
    if (Test-Path $pgBin) { $env:PATH = "$pgBin;" + $env:PATH }
    Write-Ok "PostgreSQL ya instalado"
}

# ── 3. Crear base de datos ──────────────────────────────────
Write-Step "[ 3/7 ] Preparando base de datos..."

$dbName = "cv_adapter_ai"
$pgPassword = "postgres"
$env:PGPASSWORD = $pgPassword

$dbExists = & psql -U postgres -h localhost -tAc "SELECT 1 FROM pg_database WHERE datname='$dbName'" 2>$null
if ($dbExists -ne "1") {
    Write-Warn "Creando base de datos '$dbName'..."
    & psql -U postgres -h localhost -c "CREATE DATABASE $dbName;" 2>$null
    if ($LASTEXITCODE -eq 0) { Write-Ok "Base de datos '$dbName' creada" }
    else { Write-Fail "No se pudo crear la BD. Verifica que PostgreSQL esté corriendo." }
} else {
    Write-Ok "Base de datos '$dbName' ya existe"
}

# ── 4. Configurar .env ──────────────────────────────────────
Write-Step "[ 4/7 ] Configurando .env..."

$envFile = Join-Path $projectDir ".env"
$envContent = Get-Content $envFile -Raw

# Configurar DATABASE_URL si es plantilla
$dbUrlOk = $envContent -match 'DATABASE_URL="postgresql://(?!USER:PASSWORD)'
if (-not $dbUrlOk) {
    Write-Warn "DATABASE_URL es la plantilla. Configurando con PostgreSQL local..."
    $newDbUrl = "DATABASE_URL=`"postgresql://postgres:$pgPassword@localhost:5432/$dbName`""
    $envContent = $envContent -replace 'DATABASE_URL="[^"]+"', $newDbUrl
    Set-Content $envFile $envContent
    Write-Ok "DATABASE_URL configurada: postgresql://postgres:***@localhost:5432/$dbName"
} else {
    Write-Ok "DATABASE_URL ya configurada"
}

# ── Seleccionar proveedor de IA ─────────────────────────────
Write-Host ""
Write-Host "  ┌─────────────────────────────────────────────┐" -ForegroundColor Cyan
Write-Host "  │         SELECCIONA EL PROVEEDOR DE IA       │" -ForegroundColor Cyan
Write-Host "  ├─────────────────────────────────────────────┤" -ForegroundColor Cyan
Write-Host "  │  [1] 🇺🇸 OpenAI      — GPT-4o               │" -ForegroundColor White
Write-Host "  │  [2] 🇺🇸 Anthropic   — Claude Sonnet 4      │" -ForegroundColor White
Write-Host "  │  [3] 🇺🇸 Google      — Gemini 2.0 Flash     │" -ForegroundColor White
Write-Host "  │  [4] 🇨🇳 DeepSeek    — DeepSeek-V3          │" -ForegroundColor White
Write-Host "  │  [5] 🇨🇳 Alibaba     — Qwen-Plus            │" -ForegroundColor White
Write-Host "  │  [6] 🇨🇳 Zhipu       — GLM-4-Flash          │" -ForegroundColor White
Write-Host "  └─────────────────────────────────────────────┘" -ForegroundColor Cyan
Write-Host ""

$menuMap = @{
    "1" = "openai"
    "2" = "anthropic"
    "3" = "gemini"
    "4" = "deepseek"
    "5" = "qwen"
    "6" = "zhipu"
}

do {
    $choice = Read-Host "  Elige una opcion (1-6)"
} while (-not $menuMap.ContainsKey($choice))

$selectedProvider = $menuMap[$choice]
$prov = $providerUrls[$selectedProvider]

Write-Ok "Proveedor seleccionado: $($prov.name)"

# Actualizar AI_PROVIDER en .env
$envContent = Get-Content $envFile -Raw
$envContent = $envContent -replace 'AI_PROVIDER="[^"]*"', "AI_PROVIDER=`"$selectedProvider`""
Set-Content $envFile $envContent
Write-Ok "AI_PROVIDER=$selectedProvider guardado en .env"

# Leer la key actual para este proveedor
$envContent = Get-Content $envFile -Raw
$keyMatch = [regex]::Match($envContent, [regex]::Escape($prov.envKey) + '="([^"]*)"')
$currentKey = if ($keyMatch.Success) { $keyMatch.Groups[1].Value.Trim() } else { "" }

if ($currentKey.Length -gt 10) {
    Write-Ok "$($prov.envKey) ya configurada"
} else {
    Write-Host ""
    Write-Host "  Necesitas una API key de $($prov.name)." -ForegroundColor Yellow
    Write-Host "  Obtenla gratis/de pago en:" -ForegroundColor Yellow
    Write-Host "  $($prov.url)" -ForegroundColor White
    Write-Host ""
    $apiKey = Read-Host "  Pega tu $($prov.envKey) y pulsa ENTER"

    if ($apiKey.Length -gt 10) {
        $envContent = Get-Content $envFile -Raw
        $envContent = $envContent -replace "$([regex]::Escape($prov.envKey))=`"[^`"]*`"", "$($prov.envKey)=`"$apiKey`""
        Set-Content $envFile $envContent
        Write-Ok "$($prov.envKey) guardada en .env"
    } else {
        Write-Warn "Clave demasiado corta — no guardada. Editala manualmente en .env antes de usar la app."
    }
}


# ── 5. Instalar dependencias npm ────────────────────────────
Write-Step "[ 5/7 ] Instalando dependencias npm..."
Set-Location $projectDir
npm install --silent
Write-Ok "Dependencias instaladas"

# ── 6. Prisma ───────────────────────────────────────────────
Write-Step "[ 6/7 ] Generando cliente Prisma y sincronizando BD..."
npx prisma generate 2>&1 | Out-Null
Write-Ok "Cliente Prisma generado"

npx prisma db push --accept-data-loss 2>&1 | Tee-Object -Variable dbPushOut | Out-Null
if ($LASTEXITCODE -eq 0) { Write-Ok "Schema sincronizado con la BD" }
else {
    Write-Fail "Error sincronizando el schema."
    Write-Host ($dbPushOut | Out-String) -ForegroundColor Red
}

# ── 7. Carpeta generated ────────────────────────────────────
$genDir = Join-Path $projectDir "public\generated"
if (-not (Test-Path $genDir)) { New-Item -ItemType Directory -Path $genDir | Out-Null }
Write-Ok "Carpeta public/generated lista"

# ── Arrancar ────────────────────────────────────────────────
Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  Listo!  Proveedor: $($prov.name)" -ForegroundColor Green
Write-Host "  http://localhost:3000" -ForegroundColor White
Write-Host "  Ctrl+C para detener" -ForegroundColor Gray
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

Start-Sleep -Seconds 1
Start-Process "http://localhost:3000"
npm run dev
