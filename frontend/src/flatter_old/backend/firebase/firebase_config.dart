import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';

Future initFirebase() async {
  if (kIsWeb) {
    await Firebase.initializeApp(
        options: FirebaseOptions(
            apiKey: "AIzaSyDpx58laS889KPDdvwXoIzCoUNrv6OE8J8",
            authDomain: "tochka-crm-wuuvjl.firebaseapp.com",
            projectId: "tochka-crm-wuuvjl",
            storageBucket: "tochka-crm-wuuvjl.appspot.com",
            messagingSenderId: "846505131612",
            appId: "1:846505131612:web:196dd6d9fb49c47518f099"));
  } else {
    await Firebase.initializeApp();
  }
}
