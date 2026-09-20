import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../android-app/", import.meta.url);
const read = path => readFile(new URL(path, root), "utf8");

test("Android release targets current Play requirements", async () => {
  const [gradle, manifest] = await Promise.all([
    read("app/build.gradle.kts"),
    read("app/src/main/AndroidManifest.xml"),
  ]);
  assert.match(gradle, /targetSdk = 36/);
  assert.match(gradle, /versionCode = 5/);
  assert.match(gradle, /applicationId = "com\.ame\.balancecare\.basic"/);
  assert.doesNotMatch(gradle, /create\("pro"\)/);
  assert.match(gradle, /isMinifyEnabled = true/);
  assert.match(gradle, /upload-keystore\.properties/);
  assert.match(gradle, /AME_UPLOAD_STORE_PASSWORD/);
  assert.match(manifest, /android:localeConfig="@xml\/locales_config"/);
  assert.match(manifest, /android:usesCleartextTraffic="false"/);
  assert.doesNotMatch(manifest, /POST_NOTIFICATIONS/);
});

test("offline application exposes four complete locale choices", async () => {
  const [html, locales] = await Promise.all([
    read("app/src/main/assets/index.html"),
    read("app/src/main/res/xml/locales_config.xml"),
  ]);
  for (const language of ["es", "en", "pt", "zh"]) {
    assert.match(html, new RegExp(`value="${language}"`));
    assert.match(html, new RegExp(`${language}:\\{`));
  }
  for (const locale of ["es", "en", "pt-BR", "zh-CN"])
    assert.match(locales, new RegExp(`android:name="${locale}"`));
  assert.match(html, /CATEGORIES=\{es:/);
  assert.match(html, /localStorage\.setItem\('ame_lang'/);
  assert.match(html, /AME HEALTH S\.A\.C\./);
  assert.match(html, /alfonso\.rodriguez@amehealth\.pe/);
  assert.match(html, /localStorage\.removeItem\('ame_history'/);
  assert.doesNotMatch(html, /FREE_LIMIT|IS_PRO|historyLock|Pro - Consolidado/);
  assert.match(html, /function histories\(\)/);
  assert.match(html, /function printBalance\(\)/);
  assert.match(html, /function escapeHTML\(value\)/);
});
