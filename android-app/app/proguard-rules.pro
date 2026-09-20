# Javascript bridge methods are invoked by WebView, not by Java references.
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
