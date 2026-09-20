import java.util.Properties

plugins { id("com.android.application") }

val signingProperties = Properties()
val signingFile = rootProject.file("upload-keystore.properties")
if (signingFile.exists()) signingFile.inputStream().use(signingProperties::load)
val envStoreFile = providers.environmentVariable("AME_UPLOAD_STORE_FILE").orNull
val envStorePassword = providers.environmentVariable("AME_UPLOAD_STORE_PASSWORD").orNull
val envKeyAlias = providers.environmentVariable("AME_UPLOAD_KEY_ALIAS").orNull
val envKeyPassword = providers.environmentVariable("AME_UPLOAD_KEY_PASSWORD").orNull
val hasEnvironmentSigning = listOf(envStoreFile, envStorePassword, envKeyAlias, envKeyPassword).all { !it.isNullOrBlank() }
val hasReleaseSigning = signingFile.exists() || hasEnvironmentSigning
providers.environmentVariable("AME_ANDROID_BUILD_DIR").orNull?.let { layout.buildDirectory.set(file(it)) }

android {
    namespace = "com.ame.balancecare.basic"
    compileSdk = 36
    defaultConfig {
        applicationId = "com.ame.balancecare.basic"
        minSdk = 26
        targetSdk = 36
        versionCode = 5
        versionName = "1.4.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }
    androidResources { localeFilters += listOf("es", "en", "pt", "zh-rCN") }
    signingConfigs {
        if (hasReleaseSigning) create("release") {
            storeFile = file(if (signingFile.exists()) signingProperties.getProperty("storeFile") else envStoreFile!!)
            storePassword = if (signingFile.exists()) signingProperties.getProperty("storePassword") else envStorePassword
            keyAlias = if (signingFile.exists()) signingProperties.getProperty("keyAlias") else envKeyAlias
            keyPassword = if (signingFile.exists()) signingProperties.getProperty("keyPassword") else envKeyPassword
        }
    }
    buildTypes {
        getByName("release") {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            if (hasReleaseSigning) signingConfig = signingConfigs.getByName("release")
        }
    }
    lint { checkReleaseBuilds = true; abortOnError = true }
}
