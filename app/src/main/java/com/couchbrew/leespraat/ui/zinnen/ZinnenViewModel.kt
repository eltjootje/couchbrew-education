package com.couchbrew.leespraat.ui.zinnen

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class ZinnenViewModel : ViewModel() {

    private val _text = MutableLiveData<String>().apply {
        value = "Maak zinnen van de woordjes of de plaatjes."
    }
    val text: LiveData<String> = _text
}