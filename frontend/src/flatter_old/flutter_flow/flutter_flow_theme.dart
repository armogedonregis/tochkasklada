// ignore_for_file: overridden_fields, annotate_overrides

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:shared_preferences/shared_preferences.dart';

const kThemeModeKey = '__theme_mode__';

SharedPreferences? _prefs;

abstract class FlutterFlowTheme {
  static Future initialize() async =>
      _prefs = await SharedPreferences.getInstance();

  static ThemeMode get themeMode {
    final darkMode = _prefs?.getBool(kThemeModeKey);
    return darkMode == null
        ? ThemeMode.system
        : darkMode
            ? ThemeMode.dark
            : ThemeMode.light;
  }

  static void saveThemeMode(ThemeMode mode) => mode == ThemeMode.system
      ? _prefs?.remove(kThemeModeKey)
      : _prefs?.setBool(kThemeModeKey, mode == ThemeMode.dark);

  static FlutterFlowTheme of(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? DarkModeTheme()
        : LightModeTheme();
  }

  @Deprecated('Use primary instead')
  Color get primaryColor => primary;
  @Deprecated('Use secondary instead')
  Color get secondaryColor => secondary;
  @Deprecated('Use tertiary instead')
  Color get tertiaryColor => tertiary;

  late Color primary;
  late Color secondary;
  late Color tertiary;
  late Color alternate;
  late Color primaryText;
  late Color secondaryText;
  late Color primaryBackground;
  late Color secondaryBackground;
  late Color accent1;
  late Color accent2;
  late Color accent3;
  late Color accent4;
  late Color success;
  late Color warning;
  late Color error;
  late Color info;

  late Color grayAlpha;
  late Color tertiaryText;
  late Color white;
  late Color background;
  late Color attentionBG;
  late Color promo;
  late Color shadow;
  late Color tertiaryBackground;

  @Deprecated('Use displaySmallFamily instead')
  String get title1Family => displaySmallFamily;
  @Deprecated('Use displaySmall instead')
  TextStyle get title1 => typography.displaySmall;
  @Deprecated('Use headlineMediumFamily instead')
  String get title2Family => typography.headlineMediumFamily;
  @Deprecated('Use headlineMedium instead')
  TextStyle get title2 => typography.headlineMedium;
  @Deprecated('Use headlineSmallFamily instead')
  String get title3Family => typography.headlineSmallFamily;
  @Deprecated('Use headlineSmall instead')
  TextStyle get title3 => typography.headlineSmall;
  @Deprecated('Use titleMediumFamily instead')
  String get subtitle1Family => typography.titleMediumFamily;
  @Deprecated('Use titleMedium instead')
  TextStyle get subtitle1 => typography.titleMedium;
  @Deprecated('Use titleSmallFamily instead')
  String get subtitle2Family => typography.titleSmallFamily;
  @Deprecated('Use titleSmall instead')
  TextStyle get subtitle2 => typography.titleSmall;
  @Deprecated('Use bodyMediumFamily instead')
  String get bodyText1Family => typography.bodyMediumFamily;
  @Deprecated('Use bodyMedium instead')
  TextStyle get bodyText1 => typography.bodyMedium;
  @Deprecated('Use bodySmallFamily instead')
  String get bodyText2Family => typography.bodySmallFamily;
  @Deprecated('Use bodySmall instead')
  TextStyle get bodyText2 => typography.bodySmall;

  String get displayLargeFamily => typography.displayLargeFamily;
  TextStyle get displayLarge => typography.displayLarge;
  String get displayMediumFamily => typography.displayMediumFamily;
  TextStyle get displayMedium => typography.displayMedium;
  String get displaySmallFamily => typography.displaySmallFamily;
  TextStyle get displaySmall => typography.displaySmall;
  String get headlineLargeFamily => typography.headlineLargeFamily;
  TextStyle get headlineLarge => typography.headlineLarge;
  String get headlineMediumFamily => typography.headlineMediumFamily;
  TextStyle get headlineMedium => typography.headlineMedium;
  String get headlineSmallFamily => typography.headlineSmallFamily;
  TextStyle get headlineSmall => typography.headlineSmall;
  String get titleLargeFamily => typography.titleLargeFamily;
  TextStyle get titleLarge => typography.titleLarge;
  String get titleMediumFamily => typography.titleMediumFamily;
  TextStyle get titleMedium => typography.titleMedium;
  String get titleSmallFamily => typography.titleSmallFamily;
  TextStyle get titleSmall => typography.titleSmall;
  String get labelLargeFamily => typography.labelLargeFamily;
  TextStyle get labelLarge => typography.labelLarge;
  String get labelMediumFamily => typography.labelMediumFamily;
  TextStyle get labelMedium => typography.labelMedium;
  String get labelSmallFamily => typography.labelSmallFamily;
  TextStyle get labelSmall => typography.labelSmall;
  String get bodyLargeFamily => typography.bodyLargeFamily;
  TextStyle get bodyLarge => typography.bodyLarge;
  String get bodyMediumFamily => typography.bodyMediumFamily;
  TextStyle get bodyMedium => typography.bodyMedium;
  String get bodySmallFamily => typography.bodySmallFamily;
  TextStyle get bodySmall => typography.bodySmall;

  Typography get typography => ThemeTypography(this);
}

class LightModeTheme extends FlutterFlowTheme {
  @Deprecated('Use primary instead')
  Color get primaryColor => primary;
  @Deprecated('Use secondary instead')
  Color get secondaryColor => secondary;
  @Deprecated('Use tertiary instead')
  Color get tertiaryColor => tertiary;

  late Color primary = const Color(0xFFF62D40);
  late Color secondary = const Color(0xFFF8888F);
  late Color tertiary = const Color(0xFFBE9B8C);
  late Color alternate = const Color(0xFFCDD4D7);
  late Color primaryText = const Color(0xFF34444B);
  late Color secondaryText = const Color(0xFF5F7388);
  late Color primaryBackground = const Color(0xFFF4F7F9);
  late Color secondaryBackground = const Color(0xFFFFFFFF);
  late Color accent1 = const Color(0x0CFC1E34);
  late Color accent2 = const Color(0x8EA5938E);
  late Color accent3 = const Color(0x2CB8CFA2);
  late Color accent4 = const Color(0x3DB0BFC7);
  late Color success = const Color(0xFF7E9C5A);
  late Color warning = const Color(0xFFCCA643);
  late Color error = const Color(0xFFBF0D1F);
  late Color info = const Color(0xFFFFFFFF);

  late Color grayAlpha = Color(0x318A9CAE);
  late Color tertiaryText = Color(0xFF7891AB);
  late Color white = Color(0xFFFFFFFF);
  late Color background = Color(0xFF1A1F24);
  late Color attentionBG = Color(0x23C6B47B);
  late Color promo = Color(0xFFFAEDEE);
  late Color shadow = Color(0x1D8A98A7);
  late Color tertiaryBackground = Color(0x99F4F7F9);
}

abstract class Typography {
  String get displayLargeFamily;
  TextStyle get displayLarge;
  String get displayMediumFamily;
  TextStyle get displayMedium;
  String get displaySmallFamily;
  TextStyle get displaySmall;
  String get headlineLargeFamily;
  TextStyle get headlineLarge;
  String get headlineMediumFamily;
  TextStyle get headlineMedium;
  String get headlineSmallFamily;
  TextStyle get headlineSmall;
  String get titleLargeFamily;
  TextStyle get titleLarge;
  String get titleMediumFamily;
  TextStyle get titleMedium;
  String get titleSmallFamily;
  TextStyle get titleSmall;
  String get labelLargeFamily;
  TextStyle get labelLarge;
  String get labelMediumFamily;
  TextStyle get labelMedium;
  String get labelSmallFamily;
  TextStyle get labelSmall;
  String get bodyLargeFamily;
  TextStyle get bodyLarge;
  String get bodyMediumFamily;
  TextStyle get bodyMedium;
  String get bodySmallFamily;
  TextStyle get bodySmall;
}

class ThemeTypography extends Typography {
  ThemeTypography(this.theme);

  final FlutterFlowTheme theme;

  String get displayLargeFamily => 'Tochka';
  TextStyle get displayLarge => TextStyle(
        fontFamily: 'Tochka',
        color: theme.primaryText,
        fontWeight: FontWeight.w900,
        fontSize: 64.0,
      );
  String get displayMediumFamily => 'Tochka';
  TextStyle get displayMedium => TextStyle(
        fontFamily: 'Tochka',
        color: theme.primaryText,
        fontWeight: FontWeight.bold,
        fontSize: 44.0,
      );
  String get displaySmallFamily => 'Tochka';
  TextStyle get displaySmall => TextStyle(
        fontFamily: 'Tochka',
        color: theme.primaryText,
        fontWeight: FontWeight.bold,
        fontSize: 36.0,
      );
  String get headlineLargeFamily => 'Montserrat';
  TextStyle get headlineLarge => GoogleFonts.getFont(
        'Montserrat',
        color: theme.primaryText,
        fontWeight: FontWeight.w300,
        fontSize: 32.0,
      );
  String get headlineMediumFamily => 'Montserrat';
  TextStyle get headlineMedium => GoogleFonts.getFont(
        'Montserrat',
        color: theme.primaryText,
        fontWeight: FontWeight.w300,
        fontSize: 24.0,
      );
  String get headlineSmallFamily => 'Tochka';
  TextStyle get headlineSmall => TextStyle(
        fontFamily: 'Tochka',
        color: theme.primaryText,
        fontWeight: FontWeight.bold,
        fontSize: 24.0,
      );
  String get titleLargeFamily => 'Tochka';
  TextStyle get titleLarge => TextStyle(
        fontFamily: 'Tochka',
        color: theme.primaryText,
        fontWeight: FontWeight.bold,
        fontSize: 22.0,
      );
  String get titleMediumFamily => 'Montserrat';
  TextStyle get titleMedium => GoogleFonts.getFont(
        'Montserrat',
        color: theme.info,
        fontWeight: FontWeight.normal,
        fontSize: 18.0,
      );
  String get titleSmallFamily => 'Montserrat';
  TextStyle get titleSmall => GoogleFonts.getFont(
        'Montserrat',
        color: theme.info,
        fontWeight: FontWeight.w500,
        fontSize: 16.0,
      );
  String get labelLargeFamily => 'Montserrat';
  TextStyle get labelLarge => GoogleFonts.getFont(
        'Montserrat',
        color: theme.secondaryText,
        fontWeight: FontWeight.normal,
        fontSize: 16.0,
      );
  String get labelMediumFamily => 'Montserrat';
  TextStyle get labelMedium => GoogleFonts.getFont(
        'Montserrat',
        color: theme.secondaryText,
        fontWeight: FontWeight.normal,
        fontSize: 14.0,
      );
  String get labelSmallFamily => 'Montserrat';
  TextStyle get labelSmall => GoogleFonts.getFont(
        'Montserrat',
        color: theme.secondaryText,
        fontWeight: FontWeight.normal,
        fontSize: 12.0,
      );
  String get bodyLargeFamily => 'Montserrat';
  TextStyle get bodyLarge => GoogleFonts.getFont(
        'Montserrat',
        color: theme.primaryText,
        fontWeight: FontWeight.normal,
        fontSize: 16.0,
      );
  String get bodyMediumFamily => 'Montserrat';
  TextStyle get bodyMedium => GoogleFonts.getFont(
        'Montserrat',
        color: theme.primaryText,
        fontWeight: FontWeight.normal,
        fontSize: 14.0,
      );
  String get bodySmallFamily => 'Montserrat';
  TextStyle get bodySmall => GoogleFonts.getFont(
        'Montserrat',
        color: theme.primaryText,
        fontWeight: FontWeight.normal,
        fontSize: 12.0,
      );
}

class DarkModeTheme extends FlutterFlowTheme {
  @Deprecated('Use primary instead')
  Color get primaryColor => primary;
  @Deprecated('Use secondary instead')
  Color get secondaryColor => secondary;
  @Deprecated('Use tertiary instead')
  Color get tertiaryColor => tertiary;

  late Color primary = const Color(0xFFFE3F52);
  late Color secondary = const Color(0xFFF47B84);
  late Color tertiary = const Color(0xFFBE9B8C);
  late Color alternate = const Color(0xFF496B79);
  late Color primaryText = const Color(0xFFFFFFFF);
  late Color secondaryText = const Color(0xFFC0C9CC);
  late Color primaryBackground = const Color(0xFF1D272A);
  late Color secondaryBackground = const Color(0xFF28373B);
  late Color accent1 = const Color(0x23FA3D50);
  late Color accent2 = const Color(0xA6DFCDC5);
  late Color accent3 = const Color(0x50BAD0A7);
  late Color accent4 = const Color(0xB2424E5B);
  late Color success = const Color(0xFF92B767);
  late Color warning = const Color(0xFFE6C052);
  late Color error = const Color(0xFFBF0D1F);
  late Color info = const Color(0xFFFFFFFF);

  late Color grayAlpha = Color(0x3E67696E);
  late Color tertiaryText = Color(0xFF708A93);
  late Color white = Color(0xFFFFFFFF);
  late Color background = Color(0xFF1A1F24);
  late Color attentionBG = Color(0x2DD8C29F);
  late Color promo = Color(0xFFFACFD2);
  late Color shadow = Color(0x3808090A);
  late Color tertiaryBackground = Color(0x991D272A);
}

extension TextStyleHelper on TextStyle {
  TextStyle override({
    String? fontFamily,
    Color? color,
    double? fontSize,
    FontWeight? fontWeight,
    double? letterSpacing,
    FontStyle? fontStyle,
    bool useGoogleFonts = true,
    TextDecoration? decoration,
    double? lineHeight,
    List<Shadow>? shadows,
  }) =>
      useGoogleFonts
          ? GoogleFonts.getFont(
              fontFamily!,
              color: color ?? this.color,
              fontSize: fontSize ?? this.fontSize,
              letterSpacing: letterSpacing ?? this.letterSpacing,
              fontWeight: fontWeight ?? this.fontWeight,
              fontStyle: fontStyle ?? this.fontStyle,
              decoration: decoration,
              height: lineHeight,
              shadows: shadows,
            )
          : copyWith(
              fontFamily: fontFamily,
              color: color,
              fontSize: fontSize,
              letterSpacing: letterSpacing,
              fontWeight: fontWeight,
              fontStyle: fontStyle,
              decoration: decoration,
              height: lineHeight,
              shadows: shadows,
            );
}
