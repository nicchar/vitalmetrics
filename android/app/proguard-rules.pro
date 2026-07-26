# ==============================================================================
# WellANNI – ProGuard/R8 Regeln
# ==============================================================================
# Kommentar-Konvention: Warum die Regel da ist, nicht nur was sie macht.

# ------------------------------------------------------------------------------
# Debugging: Zeilennummern und Quellfile im Stacktrace behalten,
# damit Crash-Reports in der Play Console lesbar bleiben.
# ------------------------------------------------------------------------------
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# ------------------------------------------------------------------------------
# Capacitor Core — JavaScript-Bridge darf nicht verschleiert werden,
# sonst kommen keine Plugin-Calls vom WebView durch.
# ------------------------------------------------------------------------------
-keep class com.getcapacitor.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }
-keep class * extends com.getcapacitor.Plugin { *; }
-keepclassmembers class * {
    @com.getcapacitor.PluginMethod public *;
    @com.getcapacitor.annotation.PermissionCallback public *;
    @com.getcapacitor.annotation.ActivityCallback public *;
}

# Cordova-Plugin-Bridge (wird von Capacitor mit-gebridged).
-keep class org.apache.cordova.** { *; }

# ------------------------------------------------------------------------------
# JavaScript-Interface der WebView — von @JavascriptInterface annotierte
# Methoden muessen public bleiben, sonst sind sie aus JS nicht erreichbar.
# ------------------------------------------------------------------------------
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# ------------------------------------------------------------------------------
# cordova-plugin-purchase (Google Play Billing).
# Die Billing-Library nutzt Reflection auf Response-Klassen.
# ------------------------------------------------------------------------------
-keep class com.android.billingclient.** { *; }
-keep class com.android.vending.billing.** { *; }
-dontwarn com.android.billingclient.**

# ------------------------------------------------------------------------------
# @capacitor/local-notifications greift per Reflection auf Receiver zu.
# ------------------------------------------------------------------------------
-keep class com.capacitorjs.plugins.localnotifications.** { *; }

# ------------------------------------------------------------------------------
# Edge-to-Edge-Support (capawesome).
# ------------------------------------------------------------------------------
-keep class io.capawesome.capacitorjs.plugins.androidedgetoedge.** { *; }

# ------------------------------------------------------------------------------
# AndroidX / Support — generische Safety-Net-Regeln, damit Splashscreen,
# AppCompat und CoordinatorLayout nicht ueber R8 strippen.
# ------------------------------------------------------------------------------
-keep class androidx.core.splashscreen.** { *; }
-dontwarn androidx.core.splashscreen.**

# ------------------------------------------------------------------------------
# Enum-Werte nicht entfernen (werden oft via Reflection/JSON geprueft).
# ------------------------------------------------------------------------------
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}
