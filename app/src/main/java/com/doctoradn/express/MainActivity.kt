package com.doctoradn.express

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.speech.tts.TextToSpeech
import android.webkit.JavascriptInterface
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import java.util.Locale

class MainActivity : Activity(), TextToSpeech.OnInitListener {
    private var pending: ValueCallback<Array<Uri>>? = null
    private val pickCode = 1204
    private var tts: TextToSpeech? = null
    private var ttsReady = false

    inner class DoctorBridge {
        @JavascriptInterface fun speak(message: String) {
            if (message.length > 600) return
            runOnUiThread { if (ttsReady) tts?.speak(message, TextToSpeech.QUEUE_FLUSH, null, "doctor-adn") }
        }
        @JavascriptInterface fun stop() { runOnUiThread { tts?.stop() } }
        @JavascriptInterface fun share(message: String) {
            if (message.length > 3000) return
            runOnUiThread {
                val send = Intent(Intent.ACTION_SEND).apply {
                    type = "text/plain"
                    putExtra(Intent.EXTRA_TEXT, message)
                }
                startActivity(Intent.createChooser(send, "Compartir resultado de broma"))
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        tts = TextToSpeech(this, this)
        val web = WebView(this)
        web.settings.javaScriptEnabled = true
        web.settings.domStorageEnabled = true
        web.settings.allowFileAccess = true
        web.addJavascriptInterface(DoctorBridge(), "DoctorAndroid")
        web.webViewClient = WebViewClient()
        web.webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(webView: WebView?, filePathCallback: ValueCallback<Array<Uri>>?, fileChooserParams: FileChooserParams?): Boolean {
                pending?.onReceiveValue(null)
                pending = filePathCallback
                return try {
                    val intent = Intent(Intent.ACTION_GET_CONTENT).apply {
                        type = "image/*"
                        addCategory(Intent.CATEGORY_OPENABLE)
                    }
                    startActivityForResult(Intent.createChooser(intent, "Seleccionar fotografía"), pickCode)
                    true
                } catch (e: Exception) {
                    pending = null
                    filePathCallback?.onReceiveValue(null)
                    false
                }
            }
        }
        setContentView(web)
        web.loadUrl("file:///android_asset/index.html")
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            val result = tts?.setLanguage(Locale.forLanguageTag("es-MX"))
            ttsReady = result != TextToSpeech.LANG_MISSING_DATA && result != TextToSpeech.LANG_NOT_SUPPORTED
            tts?.setSpeechRate(0.92f)
            tts?.setPitch(0.85f)
        }
    }

    @Deprecated("Legacy callback for file picker")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == pickCode) {
            pending?.onReceiveValue(if (resultCode == RESULT_OK && data?.data != null) arrayOf(data.data!!) else null)
            pending = null
        }
    }

    override fun onDestroy() {
        pending?.onReceiveValue(null)
        pending = null
        tts?.stop()
        tts?.shutdown()
        super.onDestroy()
    }
}
