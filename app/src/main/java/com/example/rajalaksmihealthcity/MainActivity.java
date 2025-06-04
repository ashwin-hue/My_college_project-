package com.example.rajalaksmihealthcity;

import android.Manifest;


import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.activity.result.ActivityResultLauncher;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.bumptech.glide.Glide;
import com.journeyapps.barcodescanner.ScanContract;
import com.journeyapps.barcodescanner.ScanOptions;
import com.squareup.picasso.Picasso;

import org.json.JSONException;
import org.json.JSONObject;

import jp.wasabeef.picasso.transformations.CropCircleTransformation;

public class MainActivity extends AppCompatActivity {

    Button button;
    String baseUrl = "http://10.10.6.194:4000/api/patient/";


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);



        button = findViewById(R.id.btn_scan);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ScanOptions options = new ScanOptions();
                options.setPrompt("Volume up");
                options.setBarcodeImageEnabled(true);
                options.setOrientationLocked(true);
                options.setCaptureActivity(Capture.class);
                barLauncer.launch(options);
            }
        });
    }

    ActivityResultLauncher<ScanOptions> barLauncer = registerForActivityResult(new ScanContract(), result -> {
        LayoutInflater inflater = LayoutInflater.from(this);
        View dialogView = inflater.inflate(R.layout.card_design, null);

        //int patient_id = Integer.parseInt(result.getContents().toString());
        int patient_id = 10000;

        String url = baseUrl+result.getContents().toString();

        RequestQueue queue = Volley.newRequestQueue(    this);
        //Toast.makeText(MainActivity.this, result.getContents().toString(), Toast.LENGTH_LONG).show();


        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(
                Request.Method.GET,
                url,
                null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        TextView name = dialogView.findViewById(R.id.card_name);
                        TextView id = dialogView.findViewById(R.id.card_id);
                        TextView plan = dialogView.findViewById(R.id.card_plan);
                        TextView date = dialogView.findViewById(R.id.card_date);

                        ImageView imageView = dialogView.findViewById(R.id.imageView3);


                        try {
                            name.setText(String.valueOf(response.getString("name")));
                            id.setText("ID : "+String.valueOf(response.getString("id")));
                            plan.setText("Plan : "+String.valueOf(response.getString("plan")));
                            date.setText("Valid date : " + String.valueOf(response.getString("valid_date")));

                            String img_url = response.getString("image").toString();

                                Picasso.get()
                                        .load(img_url)
                                        .placeholder(R.drawable.profile)
                                        .transform(new CropCircleTransformation()) // for circle
                                        .error(R.drawable.profile)
                                        .into(imageView);



                        } catch (JSONException e) {
                            throw new RuntimeException(e);
                        }

                        Button btn_book = dialogView.findViewById(R.id.btn_book);

                        btn_book.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                if (ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.CALL_PHONE)
                                        != PackageManager.PERMISSION_GRANTED) {
                                    ActivityCompat.requestPermissions(MainActivity.this,
                                            new String[]{Manifest.permission.CALL_PHONE},
                                            1);
                                } else {
                                    Intent callIntent = new Intent(Intent.ACTION_CALL);
                                    callIntent.setData(Uri.parse("tel:+918148839723"));
                                    startActivity(callIntent);
                                }

                            }
                        });

                        AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this);
                        builder.setView(dialogView);
                        builder.show();
                        //Toast.makeText(MainActivity.this, "Patient Data: " + response.toString(), Toast.LENGTH_LONG).show();
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Toast.makeText(MainActivity.this, "User not found", Toast.LENGTH_LONG).show();

                    }
                }
        );

        queue.add(jsonObjectRequest);
    });
}