# AME Balance Care

Aplicación gratuita de apoyo para registrar ingresos y egresos, calcular el balance hídrico, estimar pérdidas insensibles y mantener un historial local por hospitalización.

## Plataformas

- **Android:** aplicación autónoma y sin conexión, identificador `com.ame.balancecare.basic`.
- **Windows y navegador:** PWA instalable con historial local y funcionamiento sin conexión después de la primera carga.
- **Idiomas:** español, inglés, portugués y chino simplificado.

## Funciones

- Registro ilimitado de ingresos y egresos por categoría.
- Balance medido y balance ajustado estimado.
- Cálculo de diuresis en mL/kg/h.
- Parámetros editables para pérdidas insensibles según protocolo institucional.
- Historial acumulado por hospitalización.
- Exportación a Excel, Word, PDF, CSV y respaldo JSON según la plataforma.
- Datos locales y avisos de seguridad clínica.

AME Balance Care es una herramienta educativa y de apoyo. No diagnostica, prescribe ni sustituye el juicio clínico o los protocolos institucionales.

## Desarrollo web / PWA

Requiere Node.js 22.13 o posterior.

```bash
npm install
npm run dev
npm test
```

La PWA incluye `manifest.webmanifest`, iconos instalables y un service worker para caché sin conexión.

En Windows se instala directamente desde Microsoft Edge o Google Chrome y se abre como una aplicación independiente. Consulta [WINDOWS_RELEASE.md](WINDOWS_RELEASE.md) para las pruebas y la preparación de Microsoft Store.

## Android

El proyecto Android se encuentra en `android-app/` y requiere Android SDK 36.

```powershell
cd android-app
.\gradlew.bat :app:lintRelease :app:assembleDebug :app:bundleRelease
```

La compilación de producción debe firmarse con una clave de carga privada. Los archivos de claves, contraseñas, configuraciones locales y binarios generados están excluidos del repositorio.

La aplicación completa es gratuita: no contiene suscripciones, publicidad ni compras integradas. La preparación de AppGallery está documentada en [android-app/APP_GALLERY_RELEASE.md](android-app/APP_GALLERY_RELEASE.md) y el estado general en [PUBLICATION_CHECKLIST.md](PUBLICATION_CHECKLIST.md).

## Pruebas

`npm test` ejecuta la compilación web, comprobaciones de la edición Android y una prueba de carga. Antes de publicar también debe probarse la APK en un teléfono real y la PWA instalada en Windows.

## Privacidad y soporte

- Operador: AME HEALTH S.A.C.
- Política: https://amehealth.pe/privacidad
- Soporte: alfonso.rodriguez@amehealth.pe
