package com.couchbrew.leespraat.ui.luister

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.annotation.RequiresApi
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.webkit.WebViewAssetLoader
import com.couchbrew.leespraat.R


class LuisterFragment : Fragment() {

    private lateinit var luisterViewModel: LuisterViewModel

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {
        luisterViewModel = ViewModelProvider(this).get(LuisterViewModel::class.java);
        val root = inflater.inflate(R.layout.fragment_luister, container, false);
        val webView: WebView = root.findViewById(R.id.webview);

        // Configure related browser settings
        webView.getSettings().setLoadsImagesAutomatically(true);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setMediaPlaybackRequiresUserGesture(false);
        webView.setScrollBarStyle(View.SCROLLBARS_INSIDE_OVERLAY);
        WebView.setWebContentsDebuggingEnabled(true);

        //Make sure we can use ES6 modules
        //by intercepting the resource requests and set the the right mime type for js resources.
        val assetLoader = WebViewAssetLoader.Builder().addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(requireContext())).build();

        webView.webViewClient = object : WebViewClient() {
            @RequiresApi(21)
            override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? {
                val interceptedWebRequest = assetLoader.shouldInterceptRequest(request.url)
                interceptedWebRequest?.let {
                    if (request.url.toString().endsWith("js", true)) {
                        it.mimeType = "text/javascript"
                    }
                }
                return interceptedWebRequest
            }
        }

        val webViewSettings = webView.settings
        webViewSettings.allowFileAccessFromFileURLs = false
        webViewSettings.allowUniversalAccessFromFileURLs = false
        webViewSettings.allowFileAccess = false
        webViewSettings.allowContentAccess = false

        webView.loadUrl("https://appassets.androidplatform.net/assets/leespraat_luister.html")

        return root
    }
}