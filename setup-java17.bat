@echo off
REM Set Java 17 for this terminal session only (Eclipse Adoptium)
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.12"
set "PATH=%JAVA_HOME%\bin;%PATH%"
echo JAVA_HOME is set to %JAVA_HOME% for this session.
