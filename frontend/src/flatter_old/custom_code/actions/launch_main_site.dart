// Automatic FlutterFlow imports
import '/backend/schema/structs/index.dart';
import '/backend/schema/enums/enums.dart';
import '/backend/supabase/supabase.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'index.dart'; // Imports other custom actions
import '/flutter_flow/custom_functions.dart'; // Imports custom functions
import 'package:flutter/material.dart';
// Begin custom action code
// DO NOT REMOVE OR MODIFY THE CODE ABOVE!

import 'package:url_launcher/url_launcher.dart';

Future<void> launchMainSite(BuildContext context, String url) async {
  if (await canLaunch(url)) {
    await launch(
      url,
      forceWebView: false, // Открывает в браузере
      enableJavaScript: true, // Включает JavaScript
    );
  } else {
    throw 'Could not launch $url';
  }
}
