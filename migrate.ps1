param(
    [ValidateSet(
        'Start',
        'MigrateAnswersDryRun',
        'MigrateAnswers',
        'MigrateImagesDryRun',
        'MigrateImages',
        'MigrateFamilyImagesDryRun',
        'MigrateFamilyImages',
        'Status',
        'Logs',
        'Down'
    )]
    [string]$Command = 'Start'
)

$ErrorActionPreference = 'Stop'

function Invoke-Compose {
    param([Parameter(Mandatory = $true)][string[]]$Arguments)
    & docker compose @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "docker compose falhou com o código $LASTEXITCODE."
    }
}

function Assert-RequiredFiles {
    if (-not (Test-Path -LiteralPath 'Dados para serem migrados.xlsx' -PathType Leaf)) {
        throw 'Erro: arquivo "Dados para serem migrados.xlsx" não encontrado na raiz do projeto.'
    }
    if (-not (Test-Path -LiteralPath 'athis-drive-migration-dd29e56d2788.json' -PathType Leaf)) {
        throw 'Erro: credencial do Google Drive não encontrada.'
    }
    if (-not (Test-Path -LiteralPath 'minio.license\minio.license' -PathType Leaf)) {
        throw 'Erro: coloque a licença AIStor em minio.license\minio.license.'
    }
    Invoke-Compose @('version')
    Invoke-Compose @('config', '--quiet')
}

function Invoke-BackendNpm {
    param([Parameter(Mandatory = $true)][string]$Script)
    Invoke-Compose @('run', '--rm', '--no-deps', 'backend', 'npm', 'run', $Script)
}

Assert-RequiredFiles

switch ($Command) {
    'Start' {
        Invoke-Compose @('up', '-d', '--build')
        Invoke-Compose @('run', '--rm', '--no-deps', 'minio-init')
    }
    'MigrateAnswersDryRun' {
        Invoke-BackendNpm 'migrate:dry-run'
    }
    'MigrateAnswers' {
        Invoke-BackendNpm 'migrate:execute'
    }
    'MigrateImagesDryRun' {
        Invoke-BackendNpm 'migrate:images:dry-run'
    }
    'MigrateImages' {
        Invoke-Compose @('run', '--rm', '--no-deps', 'minio-init')
        Invoke-BackendNpm 'migrate:images'
    }
    'MigrateFamilyImagesDryRun' {
        Invoke-BackendNpm 'migrate:family-images:dry-run'
    }
    'MigrateFamilyImages' {
        Invoke-Compose @('run', '--rm', '--no-deps', 'minio-init')
        Invoke-BackendNpm 'migrate:family-images'
    }
    'Status' { Invoke-Compose @('ps') }
    'Logs' { Invoke-Compose @('logs', '--tail=100', '-f') }
    'Down' { Invoke-Compose @('down') }
}
