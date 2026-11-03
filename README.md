# Prueba de Paternidad Express — Android MVP 0.2

Proyecto Android nativo (Kotlin) con WebView local y una interfaz HTML/CSS/JavaScript sin servicios externos.

## Incluye
- Interfaz de laboratorio futurista, personaje Doctor ADN y humor mexicano.
- Selección de dos imágenes del dispositivo y vista previa.
- Test de cinco preguntas y alertas humorísticas.
- **Comparación rudimentaria de colores de las dos imágenes completas**. NO es detección facial, reconocimiento de personas ni prueba genética. Los fondos e iluminación afectan enormemente el resultado.
- Pantalla de resultado y compartir texto cuando el dispositivo lo permita.
- No usa servidor, ni guarda fotos, ni solicita acceso general a la galería.

## Abrir y compilar
1. Instalar Android Studio reciente con JDK 17 y Android SDK 35.
2. Abrir la carpeta `paternidad-express` como proyecto Gradle.
3. Esperar sincronización; Android Studio puede requerir descargar Gradle y el plugin Android.
4. Seleccionar un emulador/dispositivo Android y pulsar Run.
5. Para distribución: Build > Generate Signed Bundle / APK. La publicación exige revisión de políticas y pruebas adicionales.

## Mejoras de la versión 0.2
- Voz opcional mediante TextToSpeech de Android, con botón para activarla y detenerla.
- Compartir resultados mediante ACTION_SEND nativo.
- Respeto a la preferencia de movimiento reducido del sistema.
- No requiere permisos de micrófono ni de acceso general a archivos.

## Limitaciones conocidas
- Este prototipo **no** realiza análisis de rasgos faciales. Su porcentaje es un índice de diferencia de color global entre imágenes, no una probabilidad de paternidad.
- Compartir texto utiliza el menú nativo de Android; falta exportación de video e imagen.
- Incluye narración opcional con TextToSpeech de Android (es-MX si está disponible), no una voz norteña personalizada ni animación 3D.
- No se ha compilado ni probado en dispositivo Android en este entorno.
- Para un producto público: sustituir el cálculo por una medición de similitud facial validada y explicada (si es apropiado), añadir controles de privacidad, accesibilidad, pruebas, seguridad y una política de privacidad.

## Próximas tareas para Codex
1. Migrar WebView a UI nativa o Flutter si se justifica.
2. Implementar exportación de tarjetas PNG y video vertical.
3. Añadir narración opcional y controles de accesibilidad/reducción de animaciones.
4. Mejorar test, contenido y localización.
5. Integrar pruebas automatizadas y preparar AAB firmado.
