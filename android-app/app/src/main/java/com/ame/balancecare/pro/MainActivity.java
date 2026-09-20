package com.ame.balancecare.basic;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.DownloadManager;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.print.PrintAttributes;
import android.print.PrintManager;
import android.content.ContentValues;
import android.webkit.JavascriptInterface;
import android.webkit.CookieManager;
import android.webkit.DownloadListener;
import android.webkit.ValueCallback;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import android.window.OnBackInvokedDispatcher;

public class MainActivity extends Activity {
    private WebView webView;
    private ValueCallback<Uri[]> fileCallback;
    private static final int FILE_PICKER_REQUEST = 41;

    @Override protected void onCreate(Bundle state) {
        super.onCreate(state);
        webView = new WebView(this);
        setContentView(webView);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setSafeBrowsingEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(true);
        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);
        webView.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if ("file".equals(uri.getScheme())) return false;
                if ("https".equals(uri.getScheme())) startActivity(new Intent(Intent.ACTION_VIEW, uri));
                return true;
            }
        });
        webView.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
                Toast.makeText(MainActivity.this, message, Toast.LENGTH_LONG).show();
                result.confirm();
                return true;
            }

            @Override public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = callback;
                startActivityForResult(params.createIntent(), FILE_PICKER_REQUEST);
                return true;
            }
        });
        webView.setDownloadListener((url, userAgent, contentDisposition, mimeType, contentLength) -> {
            DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
            request.addRequestHeader("Cookie", CookieManager.getInstance().getCookie(url));
            request.addRequestHeader("User-Agent", userAgent);
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                    request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, android.webkit.URLUtil.guessFileName(url, contentDisposition, mimeType));
            ((DownloadManager)getSystemService(Context.DOWNLOAD_SERVICE)).enqueue(request);
        });
        webView.addJavascriptInterface(new AndroidBridge(), "Android");
        webView.loadUrl("file:///android_asset/index.html");
        if (Build.VERSION.SDK_INT >= 33) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                OnBackInvokedDispatcher.PRIORITY_DEFAULT, this::handleBack);
        }
    }

    @Override protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != FILE_PICKER_REQUEST || fileCallback == null) return;
        fileCallback.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(resultCode, data));
        fileCallback = null;
    }

    private void handleBack() {
        if (webView != null && webView.canGoBack()) webView.goBack(); else finish();
    }

    @SuppressLint("GestureBackNavigation")
    @Override public void onBackPressed() {
        handleBack();
    }

    public class AndroidBridge {
        @JavascriptInterface public void printPage() {
            runOnUiThread(() -> {
                PrintManager manager = (PrintManager) getSystemService(Context.PRINT_SERVICE);
                manager.print("AME Balance Care", webView.createPrintDocumentAdapter("Balance hídrico"), new PrintAttributes.Builder().build());
            });
        }
        @JavascriptInterface public void saveFile(String name, String mime, String base64) {
            try {
                byte[] bytes = android.util.Base64.decode(base64, android.util.Base64.DEFAULT);
                if (android.os.Build.VERSION.SDK_INT >= 29) {
                    ContentValues values = new ContentValues();
                    values.put(MediaStore.Downloads.DISPLAY_NAME, name);
                    values.put(MediaStore.Downloads.MIME_TYPE, mime);
                    values.put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/AME Balance Care/Balance Hidrico");
                    Uri uri = getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
                    if (uri != null) try (java.io.OutputStream out = getContentResolver().openOutputStream(uri)) { if (out != null) out.write(bytes); }
                } else {
                    java.io.File dir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
                    try (java.io.FileOutputStream out = new java.io.FileOutputStream(new java.io.File(dir, name))) { out.write(bytes); }
                }
                runOnUiThread(() -> Toast.makeText(MainActivity.this, R.string.file_saved, Toast.LENGTH_LONG).show());
            } catch (Exception error) {
                runOnUiThread(() -> Toast.makeText(MainActivity.this, R.string.file_save_error, Toast.LENGTH_LONG).show());
            }
        }
    }

    @Override protected void onDestroy() {
        if (webView != null) {
            webView.removeJavascriptInterface("Android");
            webView.stopLoading();
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
