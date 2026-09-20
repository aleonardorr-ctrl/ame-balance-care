# Preparación de Google Play

La aplicación usa el identificador permanente `com.ame.balancecare.basic`, API objetivo 36 y entrega mediante Android App Bundle (`.aab`). No cambies el identificador después de crear la ficha en Play Console.

## Firma de carga

1. Genera una clave de carga y consérvala fuera del repositorio.
2. Copia `upload-keystore.properties.example` como `upload-keystore.properties`.
3. Completa la ruta y las credenciales. El archivo real y los almacenes de claves están ignorados por Git.
4. Ejecuta `gradlew.bat :app:bundleRelease`. Sin ese archivo se genera un bundle sin firmar, útil solo para validación local.

Si OneDrive bloquea la carpeta `app/build`, define temporalmente `AME_ANDROID_BUILD_DIR` con una ruta local no sincronizada antes de ejecutar Gradle.

## Antes de publicar

- Ejecuta `gradlew.bat :app:lintRelease :app:bundleRelease` y `npm run android:check`.
- Sube el `.aab` de `app/build/outputs/bundle/release/` y activa Play App Signing.
- Completa la política de privacidad, seguridad de datos, clasificación de contenido, público objetivo y acceso a la aplicación.
- La aplicación procesa y conserva datos clínicos localmente; documenta con exactitud ese comportamiento en la ficha y evita datos reales durante las pruebas.
- Verifica los cuatro idiomas: español, inglés, portugués y chino simplificado.
- En cuentas personales nuevas, planifica la prueba cerrada exigida por Google Play antes de solicitar acceso a producción.
