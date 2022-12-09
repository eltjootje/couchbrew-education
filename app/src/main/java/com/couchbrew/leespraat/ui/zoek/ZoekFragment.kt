package com.couchbrew.leespraat.ui.zoek

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import com.couchbrew.leespraat.R

class ZoekFragment : Fragment() {

    private lateinit var zoekViewModel: ZoekViewModel

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {
        zoekViewModel =
                ViewModelProvider(this).get(ZoekViewModel::class.java)
        val root = inflater.inflate(R.layout.fragment_zoek, container, false)
        val textView: TextView = root.findViewById(R.id.text_zoek)
        zoekViewModel.text.observe(viewLifecycleOwner, Observer {
            textView.text = it
        })
        return root
    }
}