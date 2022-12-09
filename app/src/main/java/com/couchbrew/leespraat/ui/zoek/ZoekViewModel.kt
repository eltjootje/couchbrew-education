package com.couchbrew.leespraat.ui.zoek

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class ZoekViewModel : ViewModel() {

    private val _text = MutableLiveData<String>().apply {
        value = "Kies het woordje bij het plaatje."
    }
    val text: LiveData<String> = _text
}