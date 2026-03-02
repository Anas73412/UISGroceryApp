# Set Java 17 for this terminal session only (Eclipse Adoptium)
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.12"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
Write-Host "JAVA_HOME is set to $env:JAVA_HOME for this session."
