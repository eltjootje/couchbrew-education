package com.couchbrew.leespraat.ui.zinnen

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import com.couchbrew.leespraat.R

class ZinnenFragment : Fragment() {

    private lateinit var zinnenViewModel: ZinnenViewModel

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {
        zinnenViewModel =
                ViewModelProvider(this).get(ZinnenViewModel::class.java)
        val root = inflater.inflate(R.layout.fragment_zinnen, container, false)
        val textView: TextView = root.findViewById(R.id.text_zinnen)
        zinnenViewModel.text.observe(viewLifecycleOwner, Observer {
            textView.text = it
        })
        return root
    }
}