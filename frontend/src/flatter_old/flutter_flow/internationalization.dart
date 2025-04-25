import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

const _kLocaleStorageKey = '__locale_key__';

class FFLocalizations {
  FFLocalizations(this.locale);

  final Locale locale;

  static FFLocalizations of(BuildContext context) =>
      Localizations.of<FFLocalizations>(context, FFLocalizations)!;

  static List<String> languages() => ['ru', 'en'];

  static late SharedPreferences _prefs;
  static Future initialize() async =>
      _prefs = await SharedPreferences.getInstance();
  static Future storeLocale(String locale) =>
      _prefs.setString(_kLocaleStorageKey, locale);
  static Locale? getStoredLocale() {
    final locale = _prefs.getString(_kLocaleStorageKey);
    return locale != null && locale.isNotEmpty ? createLocale(locale) : null;
  }

  String get languageCode => locale.toString();
  String? get languageShortCode =>
      _languagesWithShortCode.contains(locale.toString())
          ? '${locale.toString()}_short'
          : null;
  int get languageIndex => languages().contains(languageCode)
      ? languages().indexOf(languageCode)
      : 0;

  String getText(String key) =>
      (kTranslationsMap[key] ?? {})[locale.toString()] ?? '';

  String getVariableText({
    String? ruText = '',
    String? enText = '',
  }) =>
      [ruText, enText][languageIndex] ?? '';

  static const Set<String> _languagesWithShortCode = {
    'ar',
    'az',
    'ca',
    'cs',
    'da',
    'de',
    'dv',
    'en',
    'es',
    'et',
    'fi',
    'fr',
    'gr',
    'he',
    'hi',
    'hu',
    'it',
    'km',
    'ku',
    'mn',
    'ms',
    'no',
    'pt',
    'ro',
    'ru',
    'rw',
    'sv',
    'th',
    'uk',
    'vi',
  };
}

/// Used if the locale is not supported by GlobalMaterialLocalizations.
class FallbackMaterialLocalizationDelegate
    extends LocalizationsDelegate<MaterialLocalizations> {
  const FallbackMaterialLocalizationDelegate();

  @override
  bool isSupported(Locale locale) => _isSupportedLocale(locale);

  @override
  Future<MaterialLocalizations> load(Locale locale) async =>
      SynchronousFuture<MaterialLocalizations>(
        const DefaultMaterialLocalizations(),
      );

  @override
  bool shouldReload(FallbackMaterialLocalizationDelegate old) => false;
}

/// Used if the locale is not supported by GlobalCupertinoLocalizations.
class FallbackCupertinoLocalizationDelegate
    extends LocalizationsDelegate<CupertinoLocalizations> {
  const FallbackCupertinoLocalizationDelegate();

  @override
  bool isSupported(Locale locale) => _isSupportedLocale(locale);

  @override
  Future<CupertinoLocalizations> load(Locale locale) =>
      SynchronousFuture<CupertinoLocalizations>(
        const DefaultCupertinoLocalizations(),
      );

  @override
  bool shouldReload(FallbackCupertinoLocalizationDelegate old) => false;
}

class FFLocalizationsDelegate extends LocalizationsDelegate<FFLocalizations> {
  const FFLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) => _isSupportedLocale(locale);

  @override
  Future<FFLocalizations> load(Locale locale) =>
      SynchronousFuture<FFLocalizations>(FFLocalizations(locale));

  @override
  bool shouldReload(FFLocalizationsDelegate old) => false;
}

Locale createLocale(String language) => language.contains('_')
    ? Locale.fromSubtags(
        languageCode: language.split('_').first,
        scriptCode: language.split('_').last,
      )
    : Locale(language);

bool _isSupportedLocale(Locale locale) {
  final language = locale.toString();
  return FFLocalizations.languages().contains(
    language.endsWith('_')
        ? language.substring(0, language.length - 1)
        : language,
  );
}

final kTranslationsMap = <Map<String, Map<String, String>>>[
  // login
  {
    'sv11tvpa': {
      'ru': 'точка',
      'en': 'tochka',
    },
    'jb1j1vnz': {
      'ru': '.',
      'en': '.',
    },
    'fmg476j8': {
      'ru': 'CRM',
      'en': 'CRM',
    },
    'oi99onu9': {
      'ru': 'точка',
      'en': 'dot',
    },
    'w18ulwwh': {
      'ru': 'система управления складами',
      'en': 'warehouse management system',
    },
    'yji5o7bb': {
      'ru': 'Почта',
      'en': 'Email',
    },
    'nagx6ga9': {
      'ru': '',
      'en': '',
    },
    'rigyl7oj': {
      'ru': 'Пароль',
      'en': 'Password',
    },
    'rb3sdh63': {
      'ru': '',
      'en': '',
    },
    'z2d5excx': {
      'ru': 'Это обязательное поле',
      'en': 'This is a required field',
    },
    'osyu1s03': {
      'ru': 'Это не похоже на емейл',
      'en': 'This doesn\'t look like email',
    },
    'dcy752t0': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    'pt964efa': {
      'ru': 'Это обязательное поле',
      'en': '',
    },
    'wvewn8ri': {
      'ru': 'Кажется, в пароле есть ошибка',
      'en': 'There seems to be an error in the password',
    },
    'fkk85qdo': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    '3f1nu16t': {
      'ru': 'Войти',
      'en': 'Login',
    },
    'ei4sbemu': {
      'ru': 'Не помню ',
      'en': 'I do not remember ',
    },
    'h1130h4x': {
      'ru': 'пароль',
      'en': 'password',
    },
    '7jftr6b2': {
      'ru': 'Home',
      'en': 'Home',
    },
  },
  // paymentsDetails
  {
    '2ini9e99': {
      'ru': '',
      'en': 'Email',
    },
    'zzyrh02i': {
      'ru': 'Поиск клиентов',
      'en': '',
    },
    'ucz240nv': {
      'ru': 'ID ячейки',
      'en': 'Transaction ID',
    },
    'c7jid4ai': {
      'ru': '1-KUD0-06B',
      'en': 'TXN123456789',
    },
    'ngtfs1m9': {
      'ru': 'Аренда до',
      'en': 'Date',
    },
    'yfr52sf1': {
      'ru': '23 июн 2024',
      'en': 'Fri, Jun 23 - 4:30pm',
    },
    'hx5d6g8j': {
      'ru': 'Сумма платежа',
      'en': 'Amount',
    },
    'wl4d7sug': {
      'ru': '5 990 ₽',
      'en': '\$500.00',
    },
    'bhoslw4v': {
      'ru': 'Статус платежа',
      'en': 'Status',
    },
    '6ikeq7ku': {
      'ru': 'Исполнен',
      'en': 'Completed',
    },
    '8s9rrg8a': {
      'ru': 'Метод платежа',
      'en': 'Payment Method',
    },
    '0wn98pkm': {
      'ru': 'Visa ****1234',
      'en': 'Visa ****1234',
    },
    'tiuy5hib': {
      'ru': 'Детали платежа',
      'en': 'Transaction Breakdown',
    },
    'ofh358e3': {
      'ru': 'Стоимость аренды',
      'en': 'Subtotal',
    },
    'f4b0i7yl': {
      'ru': '4 911.8  ₽',
      'en': '\$480.00',
    },
    'dghi2aiv': {
      'ru': 'НДС',
      'en': 'Tax',
    },
    'yp455ixg': {
      'ru': '1078.2 ₽',
      'en': '\$20.00',
    },
    '2h2ckyr8': {
      'ru': 'Итого',
      'en': 'Total',
    },
    'ys40h3qz': {
      'ru': '5 990 ₽',
      'en': '\$500.00',
    },
    'yymu9zkq': {
      'ru': 'Комментарий',
      'en': 'Notes',
    },
    'ui0l733c': {
      'ru': 'Аренда  ячейки XS в Кудрово на 30 дней',
      'en': 'Transaction for monthly subscription.',
    },
    'pe516ezq': {
      'ru': 'Клиент',
      'en': 'Customer Details',
    },
    'jooysos6': {
      'ru': 'Haily Brown',
      'en': 'Haily Brown',
    },
    'k961fy5k': {
      'ru': '@brownisthenewblack',
      'en': '@brownisthenewblack',
    },
    'uvs0vb72': {
      'ru': 'Address',
      'en': 'Address',
    },
    'fxeleub8': {
      'ru': '123 West Hollywood Blvd. San Mateo, CA. 90294',
      'en': '123 West Hollywood Blvd. San Mateo, CA. 90294',
    },
    'suhm5vvv': {
      'ru': 'Report Now',
      'en': 'Report Now',
    },
    'aj2z4h8z': {
      'ru': 'Message',
      'en': 'Message',
    },
    '2pif23o5': {
      'ru': 'Клиент',
      'en': 'Customer Details',
    },
    'yk5iljff': {
      'ru': 'Имя клиента',
      'en': 'Haily Brown',
    },
    'x5yqtrjy': {
      'ru': 'email@email.ru',
      'en': '@brownisthenewblack',
    },
    '1r7rzpra': {
      'ru': '+7 (911) 222-33-44',
      'en': 'Address',
    },
    'dnrt8to0': {
      'ru': 'Физ',
      'en': '',
    },
    'w2hgaer4': {
      'ru': 'Информация:',
      'en': 'Address',
    },
    'rr9amizt': {
      'ru': 'Кудрово',
      'en': '123 West Hollywood Blvd. San Mateo, CA. 90294',
    },
    'nznwarpj': {
      'ru': 'Сообщение клиенту',
      'en': 'Message Customer',
    },
    '62y0agma': {
      'ru': 'История платежей',
      'en': 'Report Now',
    },
    '18ig9p0m': {
      'ru': 'Order Details',
      'en': 'Order Details',
    },
  },
  // users
  {
    '0avnkdj1': {
      'ru': '',
      'en': 'Email',
    },
    'l2ptdehg': {
      'ru': 'Поиск пользователя',
      'en': '',
    },
    'o6nwleu3': {
      'ru': 'Сортировать по правам:',
      'en': '',
    },
    'yc97vjbz': {
      'ru': 'Инфо',
      'en': '',
    },
    'ozmjfnth': {
      'ru': 'Фр.',
      'en': 'Franchise',
    },
    'rolg699l': {
      'ru': 'Почта',
      'en': 'Franchise',
    },
    'i860x3bt': {
      'ru': 'Телефон',
      'en': '',
    },
    'xedvlrr3': {
      'ru': 'Кто пригласил',
      'en': '',
    },
    'sfqgxn2n': {
      'ru': 'Создан',
      'en': '',
    },
  },
  // clients
  {
    '3g9alcq6': {
      'ru': '',
      'en': 'Email',
    },
    '40pdnlsb': {
      'ru': 'Поиск ',
      'en': 'Search',
    },
    '3wqfeee3': {
      'ru': 'Клиент',
      'en': '',
    },
    'u4lrwik1': {
      'ru': 'Статус',
      'en': '',
    },
    'cmjmkatn': {
      'ru': 'Платежи',
      'en': '',
    },
    '5nzn6549': {
      'ru': '\n',
      'en': '',
    },
    'mam1wgpj': {
      'ru': '\n',
      'en': '',
    },
    '6jv6da2r': {
      'ru': 'Edit Column 1',
      'en': '',
    },
    'dvmqka2p': {
      'ru': 'Последний',
      'en': '',
    },
    'en648noj': {
      'ru': 'Ячеек',
      'en': '',
    },
  },
  // requests
  {
    '3s4j3ilg': {
      'ru': '',
      'en': 'Email',
    },
    'kaylumjf': {
      'ru': 'Поиск пользователя',
      'en': '',
    },
    'v3er8ntf': {
      'ru': 'Лид',
      'en': '',
    },
    '4l2ak1om': {
      'ru': 'Доступно',
      'en': '',
    },
    '7zhntpj8': {
      'ru': 'Локация',
      'en': '',
    },
    'pc8ho419': {
      'ru': 'Р-р',
      'en': '',
    },
    '9xw5gk8o': {
      'ru': 'Дата заяки',
      'en': '',
    },
  },
  // myaccount
  {
    '9uaiku2e': {
      'ru': 'Выйти',
      'en': 'Exit',
    },
    'z56ctp0a': {
      'ru': 'Роль',
      'en': 'Role',
    },
    'lrs5tfr1': {
      'ru': 'Дата создания',
      'en': 'Created at',
    },
    'k3dcdnyf': {
      'ru': 'Почта',
      'en': 'Email',
    },
    'nkuupyl1': {
      'ru': 'Телефон',
      'en': 'Зрщту',
    },
    'n7aw46dv': {
      'ru': 'Зона франшизы',
      'en': 'Zone',
    },
    'q510tbud': {
      'ru': 'Полный доступ',
      'en': 'fullPermissions',
    },
    '13ohnaur': {
      'ru': 'Редактировать',
      'en': 'Edit',
    },
    'oyd8fuax': {
      'ru': 'Изменить почту \nили пароль:',
      'en': 'Email or password\nchange:',
    },
  },
  // register
  {
    'cgqa5w1t': {
      'ru': 'точка',
      'en': 'tochka',
    },
    '4gyt8r7a': {
      'ru': '.',
      'en': '.',
    },
    'za3a36x8': {
      'ru': 'CRM',
      'en': 'CRM',
    },
    'e2v5i7ic': {
      'ru': 'точка',
      'en': 'dot',
    },
    '6na2om7o': {
      'ru': 'система управления складами',
      'en': 'warehouse management system',
    },
    '1flc09fw': {
      'ru': 'Почта',
      'en': 'Email',
    },
    '5w3wo7ww': {
      'ru': '',
      'en': '',
    },
    '1b6ueasq': {
      'ru': 'Телефон',
      'en': 'Phone',
    },
    'ui2cu7m3': {
      'ru': '',
      'en': '',
    },
    '5u887o39': {
      'ru': 'Пароль',
      'en': 'Password',
    },
    'eyh2nu9q': {
      'ru': '',
      'en': '',
    },
    'erk7tchf': {
      'ru': 'Это обязательное поле',
      'en': 'This is a required field',
    },
    '5g99q0xb': {
      'ru': 'Это не похоже на емейл',
      'en': 'This doesn\'t look like email',
    },
    'yig6kx2x': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    'q9bupd0h': {
      'ru': 'Field is required',
      'en': '',
    },
    'q8t0ptfb': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    'yem13ugu': {
      'ru': 'Это обязательное поле',
      'en': '',
    },
    'tw5gejzq': {
      'ru': 'Кажется, в пароле есть ошибка',
      'en': 'There seems to be an error in the password',
    },
    'rz71hqnr': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    '3pyxfqh0': {
      'ru': 'Регистрация',
      'en': 'Sign up',
    },
    'rcy6h3ci': {
      'ru': 'У меня уже есть ',
      'en': 'I do not remember ',
    },
    '87mfic8o': {
      'ru': 'учетная запись',
      'en': 'an account',
    },
    'snxqvywm': {
      'ru': 'Home',
      'en': 'Home',
    },
  },
  // locpreview
  {
    'qp6ukyp6': {
      'ru': 'ID ячейки',
      'en': '',
    },
    '216qi9p1': {
      'ru': 'Статус',
      'en': '',
    },
    '0qa3eyl5': {
      'ru': 'Размер',
      'en': '',
    },
    'dp2v21ah': {
      'ru': 'Истекает',
      'en': '',
    },
    'p7k573kb': {
      'ru': 'Клиент',
      'en': '',
    },
    'tmxfqfup': {
      'ru': '\n',
      'en': '',
    },
    'b4w6kkgw': {
      'ru': '\n',
      'en': '',
    },
    'fk8j99gf': {
      'ru': 'Edit Column 1',
      'en': '',
    },
    'vcntdei5': {
      'ru': '-',
      'en': '',
    },
    'usosrcd9': {
      'ru': 'Order Details',
      'en': 'Order Details',
    },
  },
  // payments
  {
    'j0p6gxms': {
      'ru': '',
      'en': 'Email',
    },
    'n1g8q03t': {
      'ru': 'Поиск пользователя',
      'en': '',
    },
    'w1jin05g': {
      'ru': 'Дата',
      'en': '',
    },
    'h56iuuy6': {
      'ru': 'Сумма, ₽',
      'en': '',
    },
    'njzqtnjh': {
      'ru': 'Клиент',
      'en': '',
    },
    'gxdho1gz': {
      'ru': '\n',
      'en': '',
    },
    'dz2jojdw': {
      'ru': '\n',
      'en': '',
    },
    'oiguu2m0': {
      'ru': 'Edit Column 1',
      'en': '',
    },
    '3yxax4yz': {
      'ru': 'Ячейка',
      'en': '',
    },
    'ftk9ylr0': {
      'ru': 'Р-р',
      'en': '',
    },
    'fptc9qrl': {
      'ru': 'Аренда до',
      'en': '',
    },
    'qtbja31e': {
      'ru': 'Фр',
      'en': '',
    },
    '2hf3iec5': {
      'ru': 'Дней',
      'en': '',
    },
    'qf21xtix': {
      'ru': 'Дата',
      'en': '',
    },
    'sxkpl8e0': {
      'ru': 'Сумма, ₽',
      'en': '',
    },
    'lwpst89y': {
      'ru': 'Клиент',
      'en': '',
    },
    'b2y2n6lw': {
      'ru': '\n',
      'en': '',
    },
    'f0rz3qsg': {
      'ru': '\n',
      'en': '',
    },
    'rtinnopd': {
      'ru': 'Edit Column 1',
      'en': '',
    },
    'wlklrqbl': {
      'ru': 'Ячейка',
      'en': '',
    },
    'q3oen6p3': {
      'ru': 'Р-р',
      'en': '',
    },
    'qh8laf9d': {
      'ru': 'Аренда до',
      'en': '',
    },
    '9rprenee': {
      'ru': 'Дней',
      'en': '',
    },
    'uwf9l9sj': {
      'ru': 'Order Details',
      'en': 'Order Details',
    },
  },
  // siteFormIframe
  {
    '6dbee9ng': {
      'ru': 'Бронировать',
      'en': 'tochka',
    },
    'n8o8veq7': {
      'ru': ' ',
      'en': '.',
    },
    'vvqvibx5': {
      'ru': 'точка',
      'en': 'dot',
    },
    'b2yk4oba': {
      'ru': 'Option 1',
      'en': '',
    },
    '2lbnz76f': {
      'ru': 'Option 1',
      'en': '',
    },
    'opffo1qf': {
      'ru': ' ₽/',
      'en': '',
    },
    'pvphpkq6': {
      'ru': 'Hello World',
      'en': '',
    },
    'qmhkkjqk': {
      'ru': 'Как к вам обращаться?',
      'en': 'Email',
    },
    'yn1u1kei': {
      'ru': '',
      'en': '',
    },
    'oxewm7p0': {
      'ru': 'Почта',
      'en': 'Email',
    },
    'bpxacerg': {
      'ru': '',
      'en': '',
    },
    'y0liyobf': {
      'ru': 'Телефон',
      'en': 'Phone',
    },
    'y34wzc9c': {
      'ru': '',
      'en': '',
    },
    'loh2bo9y': {
      'ru': 'Это обязательное поле',
      'en': 'This is a required field',
    },
    'jdufrzro': {
      'ru': 'Это не похоже на емейл',
      'en': 'This doesn\'t look like email',
    },
    'x9x4vti4': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    'jeoha9zd': {
      'ru': 'Field is required',
      'en': '',
    },
    '664ky4s7': {
      'ru': 'Это не похоже на емейл',
      'en': '',
    },
    'atxuuwg9': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    'zkpg0re6': {
      'ru': 'Field is required',
      'en': '',
    },
    'nerax5mc': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    '5clpfmfp': {
      'ru': 'Отправить заявку',
      'en': 'Sign up',
    },
    '7p52rwh0': {
      'ru': '*',
      'en': 'an account',
    },
    'd8e78sk7': {
      'ru': 'Отправляя заявку, вы принимаете ',
      'en': 'I do not remember ',
    },
    '7bd9za9u': {
      'ru': 'политику конфиденциальности ',
      'en': 'an account',
    },
    'dc346suy': {
      'ru': 'сайта',
      'en': '',
    },
    '3ahm1rqn': {
      'ru': 'Home',
      'en': 'Home',
    },
  },
  // promocodes
  {
    'l1aqshz5': {
      'ru': '',
      'en': 'Email',
    },
    '1zijzeuq': {
      'ru': 'Поиск',
      'en': '',
    },
    '47wy3am3': {
      'ru': 'Промокод',
      'en': 'Data',
    },
    'vxq6cmwl': {
      'ru': 'Скидка',
      'en': 'Franchise',
    },
    'gfx2047a': {
      'ru': 'Применен',
      'en': 'Franchise',
    },
    'br05zvwm': {
      'ru': 'Годен до',
      'en': '',
    },
    'yfbu6133': {
      'ru': 'Фр',
      'en': '',
    },
    'v5aa0ivb': {
      'ru': 'Для платежей, ₽',
      'en': '',
    },
    '3dgbxyfz': {
      'ru':
          'Укажите, если нужно, чтобы отразился прямо в приложении пользователя:',
      'en': '',
    },
    'c8yvbuv9': {
      'ru': 'Email пользователя',
      'en': '',
    },
  },
  // prices
  {
    'noyb006e': {
      'ru': 'Год. коэф (мес)',
      'en': '',
    },
    'ntp2w9id': {
      'ru':
          'Стоимость аренды за год при единовременной оплате. Рекомендуемый коэф-т: 10. \n\nТо есть стоимость года = 10 месяцем аренды. \nЕсли вы применяете коэф-т 12, то скидки при аренде за год не будет. \nТакже может быть дробным числом, например: 10,5',
      'en': '',
    },
    'uxxjpj7w': {
      'ru': 'ID',
      'en': '',
    },
    'dugx69j8': {
      'ru': 'Зона',
      'en': '',
    },
    'thihwd25': {
      'ru': 'Order Details',
      'en': 'Order Details',
    },
  },
  // adresses
  {
    '1natc96v': {
      'ru': 'Адрес',
      'en': 'Chtate user',
    },
    '0gk5zdhx': {
      'ru': 'Название',
      'en': 'Data',
    },
    'obpk8dhb': {
      'ru': 'ID',
      'en': 'Franchise',
    },
    'tr5pdggs': {
      'ru': 'Фр.',
      'en': 'Franchise',
    },
    '1cowem73': {
      'ru': 'Адрес',
      'en': 'Franchise',
    },
    's5ox3mlz': {
      'ru': 'Тир цен',
      'en': '',
    },
    'oh7ym9s2': {
      'ru': 'Адрес на сайте',
      'en': '',
    },
  },
  // waitingList
  {
    'cpulayz0': {
      'ru': '',
      'en': 'Email',
    },
    'qp2cmk71': {
      'ru': 'Поиск пользователя',
      'en': '',
    },
    '0c1bp6c9': {
      'ru': 'Клиент',
      'en': '',
    },
    '7ms9hsg0': {
      'ru': 'Ждет до',
      'en': 'Franchise',
    },
    'y1lz1dv2': {
      'ru': 'Актуальность',
      'en': 'Franchise',
    },
    'ajegfh2s': {
      'ru': 'Доступно',
      'en': '',
    },
    '1k5tscx5': {
      'ru': 'Локация',
      'en': '',
    },
    'ytr7hhry': {
      'ru': 'Р-р',
      'en': '',
    },
    'tdoozqh9': {
      'ru': 'Дата заяки',
      'en': '',
    },
  },
  // crmsettings
  {
    '8uwqm4vu': {
      'ru': 'Настройки меню',
      'en': 'Payment Details',
    },
    'afw8i8jh': {
      'ru': 'Отображение счетчиков в навигации',
      'en': 'Attention! The action is limited',
    },
    'qjhuk9eb': {
      'ru': 'Видеть как франчайзер',
      'en': '',
    },
    'ba22pnwb': {
      'ru': 'Если выключено, только по своей франшизе',
      'en': '',
    },
    'ia3lb8ov': {
      'ru': 'Локации',
      'en': '',
    },
    'zkgdcg0q': {
      'ru': 'Показывать свободные ячейки',
      'en': '',
    },
    'ton61mys': {
      'ru': 'Клиенты',
      'en': '',
    },
    'p3jrbuf7': {
      'ru': 'Новых за месяц. Включить -- только за день',
      'en': '',
    },
    'eqkaxist': {
      'ru': 'Платежи',
      'en': '',
    },
    '9kdlxmzq': {
      'ru': 'Новых за месяц. Включить -- только за день',
      'en': '',
    },
    '42zojczc': {
      'ru': 'Заявки',
      'en': '',
    },
    't8jrjjxi': {
      'ru': 'Все необработанные. Включить -- только за день',
      'en': '',
    },
    'mfj7kl2n': {
      'ru': 'Лист ожидания',
      'en': '',
    },
    'pjz44g02': {
      'ru': 'Вся очередь. Включить -- только совпадения',
      'en': '',
    },
    'ah027tue': {
      'ru': 'Пользователи',
      'en': '',
    },
    'pwxtacky': {
      'ru': 'Новых за месяц. Включить -- только за день',
      'en': '',
    },
  },
  // gotoLK
  {
    'fdi9htd9': {
      'ru': 'Ячейка забронирована ',
      'en': '',
    },
    'zm45g4hl': {
      'ru': 'Перейти к оплате',
      'en': '',
    },
    'w0pou7p4': {
      'ru':
          'На следующей странице можно выбрать\nсрок аренды и создать аккаунт',
      'en': '',
    },
    'v33sh3s1': {
      'ru': 'Ссылку для доступа \nпродублировали на почту.',
      'en': '',
    },
    '2ro3sui9': {
      'ru': 'Home',
      'en': '',
    },
  },
  // recallInfo
  {
    'rad8o8io': {
      'ru': 'Вернуться на сайт',
      'en': '',
    },
    'ngsqqlos': {
      'ru': 'Home',
      'en': '',
    },
  },
  // booking
  {
    'zfywf0th': {
      'ru': 'Клиент',
      'en': '',
    },
    'xga4z8xh': {
      'ru': 'Бронь',
      'en': '',
    },
    '622o8u8p': {
      'ru': 'Адрес',
      'en': '',
    },
    'mrr0598i': {
      'ru': '\n',
      'en': '',
    },
    'q4ekm5tw': {
      'ru': '\n',
      'en': '',
    },
    'rv05e06b': {
      'ru': 'Edit Column 1',
      'en': '',
    },
    '7fe97q0b': {
      'ru': 'Р-р',
      'en': '',
    },
    '38b794l5': {
      'ru': 'Истекает',
      'en': '',
    },
    'bft83gp7': {
      'ru': '+24 ч',
      'en': '',
    },
    'mgr3xqdo': {
      'ru': 'Обновляет бронь на сутки\nс текущего момента',
      'en': '',
    },
  },
  // clientname
  {
    'pomx6uem': {
      'ru': 'Информация об аренде',
      'en': 'Payment Details',
    },
    'c04snoco': {
      'ru': 'Арендованнные ячейки',
      'en': 'Transaction ID',
    },
    'x0xpp5f2': {
      'ru': 'Последний платеж',
      'en': 'Date',
    },
    'xaurxvi6': {
      'ru': 'Всего платежей',
      'en': 'Amount',
    },
    '8disuovg': {
      'ru': 'Бронирования',
      'en': 'Status',
    },
    'vibenzo3': {
      'ru': 'Клиент',
      'en': 'Customer Details',
    },
    'i090cjwv': {
      'ru': 'Дата платеже',
      'en': '',
    },
    'my01jkaw': {
      'ru': 'Ячейка',
      'en': '',
    },
    'iueyrflu': {
      'ru': 'Срок, дн',
      'en': '',
    },
    'voicpote': {
      'ru': 'Сумма',
      'en': '',
    },
    'oja1tzda': {
      'ru': 'Истекает',
      'en': '',
    },
  },
  // changeMail
  {
    'plmfoegw': {
      'ru':
          'Никогда не регистрировались\nна точке склада? \n\nПожалуйста заполните заявку заново \nс корректным адресом',
      'en': '',
    },
    'jp0ojid1': {
      'ru': 'Заполнить заново',
      'en': '',
    },
    'ml24vm5p': {
      'ru': 'Это мой адрес',
      'en': '',
    },
    'lk7rvblb': {
      'ru': 'Home',
      'en': '',
    },
  },
  // gotoApp
  {
    'soukgxou': {
      'ru': 'Ячейка забронирована ',
      'en': '',
    },
    'yilwdq0r': {
      'ru': 'Перейти к оплате',
      'en': '',
    },
    'uqc08otr': {
      'ru': 'Перейдите в личный кабинет для оплаты',
      'en': '',
    },
    'nfjug61u': {
      'ru': 'Home',
      'en': '',
    },
  },
  // clientsQuestions
  {
    'q1hg6r0j': {
      'ru': '',
      'en': '',
    },
    '5klan197': {
      'ru': 'Поиск ',
      'en': '',
    },
    '9rhfjtfp': {
      'ru': 'Новые',
      'en': '',
    },
    'xmegm663': {
      'ru': 'С ответами',
      'en': '',
    },
    'gy2g4ozf': {
      'ru': 'Новые',
      'en': '',
    },
    'beu17666': {
      'ru': 'Тема',
      'en': '',
    },
    'm0hh39wq': {
      'ru': 'Вопрос',
      'en': '',
    },
    'th7elznk': {
      'ru': 'Ответ',
      'en': '',
    },
    'ojnhr27t': {
      'ru': '\n',
      'en': '',
    },
    'qeq3076u': {
      'ru': '\n',
      'en': '',
    },
    'dan0u6gi': {
      'ru': 'Edit Column 1',
      'en': '',
    },
    'g4zgf7w7': {
      'ru': 'Автор ответа',
      'en': '',
    },
    '4q2deh9z': {
      'ru': 'Редактировать',
      'en': '',
    },
  },
  // merchants
  {
    '0qlox5wa': {
      'ru': 'Франшиза',
      'en': '',
    },
    'i4cgx37z': {
      'ru': 'Мерчант',
      'en': '',
    },
    'lu5t8qsc': {
      'ru': 'Почта франчайзи',
      'en': '',
    },
    't5p8buo4': {
      'ru': 'Edit Column 1',
      'en': '',
    },
    'chxevyu8': {
      'ru': 'Статус',
      'en': '',
    },
    '0gymkay1': {
      'ru': 'Pass',
      'en': '',
    },
    'bqduj7mb': {
      'ru': 'Действия',
      'en': '',
    },
    'tuwxtk6j': {
      'ru': 'Order Details',
      'en': '',
    },
  },
  // assessErrorPage
  {
    'tqcdcevy': {
      'ru': 'Упс! У вас нет доступа',
      'en': '',
    },
    '8t3pw7uo': {
      'ru':
          'Кажется, у вас недостаточно прав\n для просмотра содержимого этой страниы',
      'en': '',
    },
    'p7s6nzxx': {
      'ru': 'Назад',
      'en': '',
    },
  },
  // merchantView
  {
    't26p6qac': {
      'ru': 'Дата добавления',
      'en': '',
    },
    'zam6r3ej': {
      'ru': 'Терминал',
      'en': '',
    },
    'azw58qwt': {
      'ru': 'Валюта',
      'en': '',
    },
    'jylyvhac': {
      'ru': 'Зашифрованный пароль',
      'en': '',
    },
    'qwm8dk06': {
      'ru': 'Редактировать',
      'en': '',
    },
    'n6fx0qaf': {
      'ru': 'Франшиза',
      'en': '',
    },
    'm7jfqo7q': {
      'ru': 'Мерчант',
      'en': '',
    },
    'afg1e70l': {
      'ru': 'Почта франчайзи',
      'en': '',
    },
    '01kqt1hf': {
      'ru': 'Edit Column 1',
      'en': '',
    },
    'k7ahsbq6': {
      'ru': 'Order Details',
      'en': '',
    },
  },
  // createUser
  {
    '2elsatal': {
      'ru': 'Имя Фамилия',
      'en': 'Full name',
    },
    'fjjfrs1m': {
      'ru': '',
      'en': '',
    },
    'vqvz8i0v': {
      'ru': '',
      'en': '',
    },
    '5qv3gk7i': {
      'ru': 'Менеджер',
      'en': 'Manager',
    },
    '50xrtp93': {
      'ru': 'Оператор',
      'en': 'Operator',
    },
    'teycxab4': {
      'ru': 'Менеджер',
      'en': 'Manager',
    },
    '2l9cjy7h': {
      'ru': 'Права менеджера:',
      'en': '',
    },
    'ekz8dvd9': {
      'ru': 'Информация о клиентах',
      'en': '',
    },
    'kkkdamiw': {
      'ru': 'Информация о статусе ячеек',
      'en': '',
    },
    'w7qb6c8g': {
      'ru': 'Информация о заявках',
      'en': '',
    },
    'lx3woblr': {
      'ru': 'Создание скидок и промокодов',
      'en': '',
    },
    'lr37xrfa': {
      'ru': 'Просмотр платежей',
      'en': '',
    },
    '80wkkri8': {
      'ru': 'Информация о клиентах',
      'en': '',
    },
    'uhd5exk3': {
      'ru': 'Информация о статусе ячеек',
      'en': '',
    },
    'pu5dyp0c': {
      'ru': 'Информация о заявках',
      'en': '',
    },
    'm95po4tg': {
      'ru': 'Создание скидок и промокодов',
      'en': '',
    },
    'i2lu9yh7': {
      'ru': 'Просмотр платежей',
      'en': '',
    },
    '3mke6bxk': {
      'ru': 'Права оператора:',
      'en': '',
    },
    '6xt2ac41': {
      'ru': 'Информация о клиентах',
      'en': '',
    },
    '3w2obu48': {
      'ru': 'Информация о статусе ячеек',
      'en': '',
    },
    'x9jg1bp8': {
      'ru': 'Информация о заявках',
      'en': '',
    },
    'ena375xv': {
      'ru': 'Создание скидок и промокодов',
      'en': '',
    },
    'gl5slmod': {
      'ru': 'Просмотр платежей',
      'en': '',
    },
    'z24zk3go': {
      'ru': 'Информация о клиентах',
      'en': '',
    },
    'co2tp8kv': {
      'ru': 'Информация о статусе ячеек',
      'en': '',
    },
    'gfewfmkp': {
      'ru': 'Информация о заявках',
      'en': '',
    },
    'e65vbqsl': {
      'ru': 'Почта',
      'en': '',
    },
    'fu88vu3m': {
      'ru': '',
      'en': '',
    },
    'wp44q91p': {
      'ru': '',
      'en': '',
    },
    '5sfq709g': {
      'ru': 'Токен приглашения',
      'en': 'Invite ID',
    },
    '2ebxpwwh': {
      'ru': '',
      'en': '',
    },
    'xngw9uuj': {
      'ru': 'Обязательное поле',
      'en': '',
    },
    'm2quop9f': {
      'ru': 'Пожалуйста, введите Имя и Фамилию',
      'en': '',
    },
    '4g2j7331': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    'ciab8xlb': {
      'ru': 'Обязательное поле',
      'en': '',
    },
    '4ozfy9yh': {
      'ru': 'Это не похоже на емейл',
      'en': '',
    },
    'gz8h0u1o': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    'g51ww9x1': {
      'ru': 'Field is required',
      'en': '',
    },
    'ulpz9sj5': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    'uqw5vpws': {
      'ru': 'Отправить инвайт',
      'en': 'Send invite',
    },
    't9pfgbk2': {
      'ru': 'Отмена',
      'en': 'Cancel',
    },
  },
  // editMyInfo
  {
    '7gr3urq2': {
      'ru': 'Имя Фамилия',
      'en': 'Full name',
    },
    'g9hj8ds6': {
      'ru': 'Телефон',
      'en': 'Phone',
    },
    'n5ftwaqb': {
      'ru': 'Обязательное поле',
      'en': '',
    },
    'oqyyqtrp': {
      'ru': 'Пожалуйста, введите Имя и Фамилию',
      'en': '',
    },
    'i7vwt4oe': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    'f6w65b1d': {
      'ru': 'Обязательное поле',
      'en': '',
    },
    '4nj9meg6': {
      'ru': 'Это не похоже на емейл',
      'en': '',
    },
    '0b7snugo': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    '9gy5mvu6': {
      'ru': 'Field is required',
      'en': '',
    },
    'lu8bghjv': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    '6miaw6jf': {
      'ru': 'Сохранить',
      'en': 'Send invite',
    },
    'bkitc5ki': {
      'ru': 'Отмена',
      'en': 'Cancel',
    },
  },
  // changeEmail
  {
    '9ip0igvk': {
      'ru': 'Новый емейл',
      'en': '',
    },
    'h3d8yrh2': {
      'ru': '',
      'en': '',
    },
    'n5o9imoo': {
      'ru': 'Обязательное поле',
      'en': '',
    },
    '2myx4wbv': {
      'ru': 'Пожалуйста, введите Имя и Фамилию',
      'en': '',
    },
    'zk3peqm2': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    'hmd3m5ri': {
      'ru': 'Обязательное поле',
      'en': '',
    },
    '6xryqfg5': {
      'ru': 'Это не похоже на емейл',
      'en': '',
    },
    'hz2qqmx4': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    'urg0934h': {
      'ru': 'Field is required',
      'en': '',
    },
    '55cpmucf': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    'la5lk907': {
      'ru': 'Изменить почту',
      'en': 'Change Email',
    },
    '0m6ayfrw': {
      'ru': 'Отмена',
      'en': 'Cancel',
    },
  },
  // changePassword
  {
    'qdbj5yyj': {
      'ru': 'Новый емейл',
      'en': '',
    },
    'kaq22heq': {
      'ru': 'Field is required',
      'en': '',
    },
    'q65dhfnk': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    '7a6wf52n': {
      'ru': 'Изменить',
      'en': 'Change ',
    },
    'ohl1vgss': {
      'ru': 'Отмена',
      'en': 'Cancel',
    },
  },
  // ModalInvite
  {
    'qyo7gbu1': {
      'ru': 'Ссылка для нового сотрудника',
      'en': '',
    },
    'iqi7lqwk': {
      'ru':
          'Это действие пока не автоматизировано, поэтому просто поделитесь этой ссылкой с приглашаемым:\n',
      'en': '',
    },
  },
  // locationInfo
  {
    's6y76zl3': {
      'ru': '-',
      'en': '',
    },
    'zjv78owv': {
      'ru': '1-KUD4',
      'en': '',
    },
    'thxqttw6': {
      'ru': 'Свободных:',
      'en': 'Available:',
    },
    'c3z9wll2': {
      'ru': 'За 30 дн',
      'en': '',
    },
    'kl56odeo': {
      'ru': ' ₽',
      'en': '',
    },
    'vhaywn56': {
      'ru': '24 (20)',
      'en': '',
    },
    'frd9lato': {
      'ru': ' ₽',
      'en': '',
    },
    'y3n89usm': {
      'ru': '24 (20)',
      'en': '',
    },
  },
  // locCardCellInfo
  {
    'k2rfnuzv': {
      'ru': ' / ',
      'en': '',
    },
    'fzvo6ltn': {
      'ru': '4/12',
      'en': '',
    },
  },
  // cellfromSizeinfo
  {
    'kfpp8cpt': {
      'ru': ' м²',
      'en': '',
    },
    'nhxnnfir': {
      'ru': '14 м²',
      'en': 'Available:',
    },
    'tbh89nrl': {
      'ru': '/',
      'en': '',
    },
    '8addngti': {
      'ru': '12',
      'en': '',
    },
    '0l60d4pq': {
      'ru': '₽ / год',
      'en': '',
    },
    'ykk0jw7a': {
      'ru': '14 м²',
      'en': 'Available:',
    },
    '6fmshkh1': {
      'ru': '₽',
      'en': '',
    },
  },
  // cellsInLocTable
  {
    'pvwgspb7': {
      'ru': '23/05/24',
      'en': '',
    },
  },
  // requestSended
  {
    'mdkndmfu': {
      'ru': 'Спасибо за заявку',
      'en': '',
    },
    'x9lfo75j': {
      'ru':
          'Наш ИИ-сторож Тихон уже проверяет, есть ли свободные ячейки по вашему запросу.\nОтчет по резльтатам сейчас будет у вас в почте',
      'en': '',
    },
  },
  // requestTable
  {
    '4ih5thhv': {
      'ru': 'Александра',
      'en': 'Franchise',
    },
  },
  // editRequest
  {
    'vmw4xpme': {
      'ru': 'Пожелания:',
      'en': 'Created at',
    },
    '3jp1sgsu': {
      'ru': 'Сколько готов ждать:',
      'en': 'Fri, Jun 23 - 4:30pm',
    },
    'bdb105sn': {
      'ru': '2 месяца',
      'en': '',
    },
    '30ib19b0': {
      'ru': '',
      'en': '',
    },
    'w7wpy0ag': {
      'ru': 'Search for an item...',
      'en': '',
    },
    'wpt3haea': {
      'ru': '7  дней',
      'en': '',
    },
    'uyfyj40f': {
      'ru': '2 недели',
      'en': '',
    },
    '3l27hvmp': {
      'ru': 'Месяц',
      'en': '',
    },
    'ri31cpfu': {
      'ru': '2 месяца',
      'en': '',
    },
    '3ooub1ow': {
      'ru': 'Показать доступные варианты:',
      'en': 'Fri, Jun 23 - 4:30pm',
    },
    '8qb0742h': {
      'ru': 'Локация',
      'en': '',
    },
    'vtvhfn9q': {
      'ru': 'Search for an item...',
      'en': '',
    },
    'qa3zieni': {
      'ru': 'Выбрать',
      'en': '',
    },
    '7egubywe': {
      'ru': 'Шушары',
      'en': '',
    },
    'xvnc76d9': {
      'ru': 'Кудрово',
      'en': '',
    },
    'cgkpwjxd': {
      'ru': 'Кудрово 1',
      'en': '',
    },
    '2fdi5o3n': {
      'ru': 'Кудрово 2',
      'en': '',
    },
    'fsxvths2': {
      'ru': 'Размер',
      'en': '',
    },
    'e2gvzs77': {
      'ru': 'Search for an item...',
      'en': '',
    },
    '50uuirn8': {
      'ru': 'Выбрать',
      'en': '',
    },
    'ue80kev6': {
      'ru': 'Шушары',
      'en': '',
    },
    'v9hop2wu': {
      'ru': 'Кудрово',
      'en': '',
    },
    'uh3hqj1r': {
      'ru': 'Кудрово 1',
      'en': '',
    },
    'gyzm3mb1': {
      'ru': 'Кудрово 2',
      'en': '',
    },
    'r4980kgw': {
      'ru': 'Доступные:',
      'en': '',
    },
    'e2utmpsk': {
      'ru': 'Номер ячейки',
      'en': '',
    },
    'r1hgawap': {
      'ru': 'Search for an item...',
      'en': '',
    },
    '2yctf3k7': {
      'ru': 'Доступно:',
      'en': '',
    },
    'c12aym6p': {
      'ru': 'Шушары',
      'en': '',
    },
    'odsmdhr7': {
      'ru': 'Кудрово',
      'en': '',
    },
    'd4uwk4og': {
      'ru': 'Кудрово 1',
      'en': '',
    },
    'g5ccp4pr': {
      'ru': 'Кудрово 2',
      'en': '',
    },
    'lgbn7i1q': {
      'ru': 'Промокод',
      'en': 'Fri, Jun 23 - 4:30pm',
    },
    'pa5aewsh': {
      'ru': 'Обязательное поле',
      'en': '',
    },
    'n36k9geo': {
      'ru': 'Пожалуйста, введите Имя и Фамилию',
      'en': '',
    },
    'omlwa59y': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    'rcbvamvy': {
      'ru': 'Обязательное поле',
      'en': '',
    },
    '8nf0hqgi': {
      'ru': 'Это не похоже на емейл',
      'en': '',
    },
    'a7qigno3': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    'bqp704ip': {
      'ru': 'Field is required',
      'en': '',
    },
    'am0u3jjs': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    'u3mdp816': {
      'ru': 'Бронь по умолчанию: 3ч',
      'en': '',
    },
    'x4uev4oh': {
      'ru': 'На 24ч',
      'en': '',
    },
    'n8pg7pph': {
      'ru': 'В лист ожидания',
      'en': 'Save',
    },
    'u56au1t9': {
      'ru': 'Отказ',
      'en': 'Save',
    },
    '80vge9mx': {
      'ru': 'Заявка не обработана',
      'en': 'Cancel',
    },
  },
  // promoGenerator
  {
    '4c01tjxw': {
      'ru': 'Срок, дн',
      'en': '',
    },
    'euzvypys': {
      'ru': 'Search for an item...',
      'en': '',
    },
    '10753i12': {
      'ru': 'Срок, дн',
      'en': '',
    },
    '4ys6mpls': {
      'ru': '24 ч',
      'en': '',
    },
    'x2wf2l71': {
      'ru': 'Неделя',
      'en': '',
    },
    'nj0lnpru': {
      'ru': 'Месяц',
      'en': '',
    },
    'mp6lri3l': {
      'ru': 'Год',
      'en': '',
    },
    'og8tw153': {
      'ru': 'Применений',
      'en': '',
    },
    'i969eq3h': {
      'ru': '',
      'en': '',
    },
    'tdw7r20w': {
      'ru': '1',
      'en': '',
    },
    'syqxs424': {
      'ru': 'Диапазон стоимости, к которой можно применить промокод:',
      'en': '',
    },
    'e3hnfgv2': {
      'ru': 'Минимум',
      'en': '',
    },
    '5yggcd1j': {
      'ru': '',
      'en': '',
    },
    '3ig3u9da': {
      'ru': '3000',
      'en': '',
    },
    '4kbjiw0b': {
      'ru': 'Максимум',
      'en': '',
    },
    'thvzspjp': {
      'ru': '',
      'en': '',
    },
    'tgmleqon': {
      'ru': '200000',
      'en': '',
    },
    'hjzw71vj': {
      'ru': '',
      'en': '',
    },
    'e3oh6p3a': {
      'ru': '99',
      'en': '',
    },
    '2195fdn1': {
      'ru': 'Создать',
      'en': 'Save',
    },
    'f77jdvlp': {
      'ru': 'Промокод:',
      'en': '',
    },
    'c5spuu4p': {
      'ru': '',
      'en': '',
    },
  },
  // promocodeRow
  {
    'pfj1n86n': {
      'ru': ' из ',
      'en': '',
    },
    'vr399ph1': {
      'ru': '100',
      'en': 'Franchise',
    },
  },
  // tablePriceHeading
  {
    'zekqje0m': {
      'ru': 'Размер: ',
      'en': '',
    },
    '2htj5cbk': {
      'ru': 'Размер: M',
      'en': '',
    },
    'fa3t7gkg': {
      'ru': 'Месяц, ₽',
      'en': 'Data',
    },
    'y7xq2hps': {
      'ru': 'День, ₽',
      'en': 'Data',
    },
  },
  // priceHeadRow
  {
    '0h6z1bm7': {
      'ru': ':',
      'en': '',
    },
    'jbuq3l9b': {
      'ru': 'M: ',
      'en': '',
    },
    'bxya09xr': {
      'ru': 'месяц, ₽',
      'en': '',
    },
    'oixg0d81': {
      'ru': 'день, ₽',
      'en': '',
    },
  },
  // editPrice
  {
    '46id1r14': {
      'ru': 'Цены на ячейки М, ₽:',
      'en': '',
    },
    '2v0omxux': {
      'ru': 'Месяц',
      'en': '',
    },
    'bw4dnat7': {
      'ru': '',
      'en': '',
    },
    'll6rzwj8': {
      'ru': 'День',
      'en': '',
    },
    '8rk9qdd9': {
      'ru': '',
      'en': '',
    },
    'a9f9hl85': {
      'ru': 'Цены на ячейки S, ₽:',
      'en': '',
    },
    'xlbqspjh': {
      'ru': 'Месяц',
      'en': '',
    },
    'k3dqz4li': {
      'ru': '',
      'en': '',
    },
    '25tzy6l8': {
      'ru': 'День',
      'en': '',
    },
    '0hhrydg8': {
      'ru': '',
      'en': '',
    },
    'r0jr7eym': {
      'ru': 'Цены на ячейки XS, ₽:',
      'en': '',
    },
    'gchrqlgl': {
      'ru': 'Месяц',
      'en': '',
    },
    '3dw6hi22': {
      'ru': '',
      'en': '',
    },
    '7pqhysrk': {
      'ru': 'День',
      'en': '',
    },
    'q6ddtopg': {
      'ru': '',
      'en': '',
    },
    'r7jjd2m6': {
      'ru': 'Годовая цена (в отношении цены на месяц)',
      'en': '',
    },
    '80pux6zn': {
      'ru': '',
      'en': '',
    },
    '947svmu3': {
      'ru': 'Обязательное поле',
      'en': '',
    },
    'ouondqnw': {
      'ru': 'Пожалуйста, введите Имя и Фамилию',
      'en': '',
    },
    'dx1w8wlg': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    'dgc5lbol': {
      'ru': 'Обязательное поле',
      'en': '',
    },
    'n1poazxs': {
      'ru': 'Это не похоже на емейл',
      'en': '',
    },
    '6y0uobm3': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    'wqy192i4': {
      'ru': 'Field is required',
      'en': '',
    },
    'argayc5a': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    'wrz1w6bk': {
      'ru': 'Сохранить изменения цен',
      'en': 'Change Email',
    },
    'hxbdm69v': {
      'ru': 'Отмена',
      'en': 'Cancel',
    },
  },
  // createNewPrices
  {
    'e93zcnns': {
      'ru': 'Цены на ячейки М, ₽:',
      'en': '',
    },
    '2t9g3xi9': {
      'ru': 'Месяц',
      'en': '',
    },
    'n6cs247p': {
      'ru': '',
      'en': '',
    },
    '628isayh': {
      'ru': 'День',
      'en': '',
    },
    'h8w5y5xu': {
      'ru': '',
      'en': '',
    },
    'tp4g09a6': {
      'ru': 'Цены на ячейки S, ₽:',
      'en': '',
    },
    'q2fbngf7': {
      'ru': 'Месяц',
      'en': '',
    },
    'wtn118i7': {
      'ru': '',
      'en': '',
    },
    '4f4evvph': {
      'ru': 'День',
      'en': '',
    },
    'f16jxcge': {
      'ru': '',
      'en': '',
    },
    'p2pedpzf': {
      'ru': 'Цены на ячейки XS, ₽:',
      'en': '',
    },
    'uxnuz487': {
      'ru': 'Месяц',
      'en': '',
    },
    'yro639xi': {
      'ru': '',
      'en': '',
    },
    '64quf2ph': {
      'ru': 'День',
      'en': '',
    },
    'jhbl01ax': {
      'ru': '',
      'en': '',
    },
    'akcgybug': {
      'ru': 'Годовая цена (в отношении цены на месяц)',
      'en': '',
    },
    'kht6o6eo': {
      'ru': '',
      'en': '',
    },
    'gtq63fb1': {
      'ru': 'Обязательное поле',
      'en': '',
    },
    'ypj1e9he': {
      'ru': 'Пожалуйста, введите Имя и Фамилию',
      'en': '',
    },
    '36jf4pjf': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    'fqwa8nf2': {
      'ru': 'Обязательное поле',
      'en': '',
    },
    'p30wm42g': {
      'ru': 'Это не похоже на емейл',
      'en': '',
    },
    'feflp6ei': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    '91hoepg4': {
      'ru': 'Field is required',
      'en': '',
    },
    '24o6dy8v': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    'n3o6bnbn': {
      'ru': 'Создать группу цен',
      'en': 'Change Email',
    },
    '539gpimx': {
      'ru': 'Отмена',
      'en': 'Cancel',
    },
  },
  // editAdress
  {
    '95ut8f31': {
      'ru': 'Название',
      'en': '',
    },
    'mqo3o01v': {
      'ru': '',
      'en': '',
    },
    'kje4bd1w': {
      'ru': 'ID',
      'en': '',
    },
    'qywd414u': {
      'ru': 'KUD',
      'en': '',
    },
    '1drvuc9t': {
      'ru': 'Адрес',
      'en': '',
    },
    'odbqi8e9': {
      'ru': '',
      'en': '',
    },
    'vm0co7z6': {
      'ru': 'Город',
      'en': '',
    },
    '2nwl6kc9': {
      'ru': '',
      'en': '',
    },
    '4h4xu55m': {
      'ru': 'Адрес на сайте',
      'en': '',
    },
    'k60b4jyb': {
      'ru': '',
      'en': '',
    },
    'wwdfdfio': {
      'ru': 'Франшиза:',
      'en': '',
    },
    'q96tnpiz': {
      'ru': 'Search for an item...',
      'en': '',
    },
    'qf0rwqkb': {
      'ru': 'Выбрать',
      'en': '',
    },
    'v4muqaba': {
      'ru': 'Шушары',
      'en': '',
    },
    'mbslwu2c': {
      'ru': 'Кудрово',
      'en': '',
    },
    '6co57z2p': {
      'ru': 'Кудрово 1',
      'en': '',
    },
    'hy72eeoz': {
      'ru': 'Кудрово 2',
      'en': '',
    },
    'y3anagld': {
      'ru': 'Группа цен:',
      'en': '',
    },
    'g5emzbbq': {
      'ru': 'Search for an item...',
      'en': '',
    },
    'enendhkl': {
      'ru': 'Выбрать',
      'en': '',
    },
    'fw4yjttn': {
      'ru': 'Шушары',
      'en': '',
    },
    '8k9ihiyz': {
      'ru': 'Кудрово',
      'en': '',
    },
    'qq2uq1ck': {
      'ru': 'Кудрово 1',
      'en': '',
    },
    'i6jctkud': {
      'ru': 'Кудрово 2',
      'en': '',
    },
    'is3hwshw': {
      'ru': 'Обязательное поле',
      'en': '',
    },
    'dkmkdynh': {
      'ru': 'Пожалуйста, введите Имя и Фамилию',
      'en': '',
    },
    'f427ztna': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    '72xkk2c7': {
      'ru': 'Обязательное поле',
      'en': '',
    },
    '55uuf57g': {
      'ru': 'Это не похоже на емейл',
      'en': '',
    },
    'x0p2unlk': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    'lost8vbz': {
      'ru': 'Field is required',
      'en': '',
    },
    'lb4osme1': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    'tbpr8w1q': {
      'ru': 'Изменить адрес',
      'en': 'Change Email',
    },
    'kx7p2l46': {
      'ru': 'Отмена',
      'en': 'Cancel',
    },
  },
  // createAdress
  {
    'j6fhrl4c': {
      'ru': 'Название',
      'en': '',
    },
    'izu2e6z7': {
      'ru': '',
      'en': '',
    },
    'vg7e96s2': {
      'ru': '',
      'en': '',
    },
    '6qfutz5f': {
      'ru': 'Адрес',
      'en': '',
    },
    'udihunlw': {
      'ru': '',
      'en': '',
    },
    'ythyyl7b': {
      'ru': '',
      'en': '',
    },
    't7m3ygjo': {
      'ru': 'Город',
      'en': '',
    },
    '9u2efg2e': {
      'ru': '',
      'en': '',
    },
    '8i83alng': {
      'ru': '',
      'en': '',
    },
    'nxvqjdjl': {
      'ru': 'Адрес на сайте',
      'en': '',
    },
    '83to5gkl': {
      'ru': '',
      'en': '',
    },
    '84goyobl': {
      'ru': '',
      'en': '',
    },
    'ztp7sb6k': {
      'ru': 'Франшиза:',
      'en': '',
    },
    '7jc7xijf': {
      'ru': 'не выбрано',
      'en': '',
    },
    'aduqzr95': {
      'ru': 'Search for an item...',
      'en': '',
    },
    '9m95lomu': {
      'ru': 'Выбрать',
      'en': '',
    },
    '5evv8wi9': {
      'ru': 'Шушары',
      'en': '',
    },
    'fhig3gnk': {
      'ru': 'Кудрово',
      'en': '',
    },
    'arvg8fhi': {
      'ru': 'Кудрово 1',
      'en': '',
    },
    'q111yzfa': {
      'ru': 'Кудрово 2',
      'en': '',
    },
    'sl59mf6l': {
      'ru': 'Группа цен:',
      'en': '',
    },
    '9n4h7qf8': {
      'ru': 'не выбрано',
      'en': '',
    },
    'sz5nr9h4': {
      'ru': 'Search for an item...',
      'en': '',
    },
    'fdeikhoy': {
      'ru': 'Выбрать',
      'en': '',
    },
    'fkyibosl': {
      'ru': 'Шушары',
      'en': '',
    },
    'umsj8tv5': {
      'ru': 'Кудрово',
      'en': '',
    },
    'yrlwzipq': {
      'ru': 'Кудрово 1',
      'en': '',
    },
    'c3h6fbe6': {
      'ru': 'Кудрово 2',
      'en': '',
    },
    'rjgv5uf8': {
      'ru': 'Обязательное поле',
      'en': '',
    },
    'vmbjnrsd': {
      'ru': 'Пожалуйста, введите Имя и Фамилию',
      'en': '',
    },
    'zob4roxf': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    'y1icuz8j': {
      'ru': 'Обязательное поле',
      'en': '',
    },
    'ief1fqor': {
      'ru': 'Это не похоже на емейл',
      'en': '',
    },
    'nek8uo69': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    '5juiiow7': {
      'ru': 'Field is required',
      'en': '',
    },
    '7v7r7ays': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    'kogroebp': {
      'ru': 'Создать адрес',
      'en': 'Change Email',
    },
    '75r8ldpo': {
      'ru': 'Отмена',
      'en': 'Cancel',
    },
  },
  // locCard
  {
    'metu7kt3': {
      'ru': 'Ячеек:',
      'en': '',
    },
    'b454q7dn': {
      'ru': ' (',
      'en': '',
    },
    'ndxpy9v5': {
      'ru': ')',
      'en': '',
    },
    'of5ub9k4': {
      'ru': '24 (20)',
      'en': '',
    },
    'ymldby14': {
      'ru': 'Цены:',
      'en': '',
    },
    'cqhc1887': {
      'ru': 'За 30 дн',
      'en': '',
    },
    'pgufkczu': {
      'ru': ' ₽',
      'en': '',
    },
    'b1ci2kbe': {
      'ru': '24 (20)',
      'en': '',
    },
    'pksoa5jc': {
      'ru': ' ₽',
      'en': '',
    },
    '1ayry1ze': {
      'ru': '24 (20)',
      'en': '',
    },
  },
  // cardOfFranchise
  {
    'se7iezc7': {
      'ru': 'MerchantID: ',
      'en': '',
    },
    'i6vlugaa': {
      'ru': 'Редактировать ',
      'en': '',
    },
  },
  // waitlistTable
  {
    'ill9o5ml': {
      'ru': 'Высокая',
      'en': 'Franchise',
    },
  },
  // logo
  {
    'byab1roc': {
      'ru': 'точка.склада',
      'en': 'wh.point',
    },
  },
  // navBottomShit
  {
    '4mn5tlsj': {
      'ru': 'Мой аккаунт',
      'en': 'SRM settings',
    },
  },
  // nav
  {
    'z9d3d1ad': {
      'ru': 'Бизнес',
      'en': '',
    },
    '3apk19p1': {
      'ru': 'CRM',
      'en': 'SRM settings',
    },
  },
  // requestSendedMatch
  {
    'syonjwr5': {
      'ru': 'Ура! Ячейка найдена!',
      'en': '',
    },
    'kdrm7z2g': {
      'ru':
          'AI-сторож Тихон нашел подходящий вариант. \nМожно сразу оплатить и заезжать.\n\nЕсть вопросы? Закажите звонок.',
      'en': '',
    },
    'exgm5y0q': {
      'ru': 'Забронировать сейчас',
      'en': '',
    },
    '4mv4ruyn': {
      'ru': 'Свяжитесь со мной ',
      'en': '',
    },
  },
  // clientsRowTable
  {
    'exbkf5l0': {
      'ru': 'Последний платеж',
      'en': '',
    },
    'k3nkrd72': {
      'ru': 'Сумма',
      'en': '',
    },
    'vd1adwrx': {
      'ru': '23/05/24',
      'en': '',
    },
  },
  // sizeLocView
  {
    'd2x71fj6': {
      'ru': ' м²',
      'en': '',
    },
    'ckcs9uhx': {
      'ru': '14 м²',
      'en': '',
    },
    '6u92ufqs': {
      'ru': '/',
      'en': '',
    },
    'vlzzoxzn': {
      'ru': '12',
      'en': '',
    },
    'n2bssuf0': {
      'ru': '₽ / год',
      'en': '',
    },
    'oyivhr8k': {
      'ru': '14 м²',
      'en': '',
    },
    'n6zibn67': {
      'ru': '₽',
      'en': '',
    },
  },
  // requestSendedMatchCopy
  {
    'c366nfsd': {
      'ru': 'Ура! Ячейка найдена!',
      'en': '',
    },
    'y6mrmy0q': {
      'ru':
          'AI-сторож Тихон нашел подходящий вариант. \nМожно сразу оплатить и заезжать.\n\nЕсть вопросы? Закажите звонок.',
      'en': '',
    },
    'v9jgcnf7': {
      'ru': 'Забронировать сейчас',
      'en': '',
    },
    '3cmj35rg': {
      'ru': 'Свяжитесь со мной ',
      'en': '',
    },
  },
  // requestSendedMatchClient
  {
    'sb7vjzpp': {
      'ru':
          'AI-сторож Тихон нашел подходящий вариант. \nМожно сразу оплатить и заезжать.\n\nЕсть вопросы? Закажите звонок.',
      'en': '',
    },
    'ghztbb4g': {
      'ru': 'Забронировать сейчас',
      'en': '',
    },
    'epu4r0vg': {
      'ru': 'Свяжитесь со мной ',
      'en': '',
    },
  },
  // requestSendedMatchCopy3
  {
    'h4znkoa3': {
      'ru': 'Ура! Ячейка найдена!',
      'en': '',
    },
    'at8ish72': {
      'ru':
          'AI-сторож Тихон нашел подходящий вариант. \nМожно сразу оплатить и заезжать.\n\nЕсть вопросы? Закажите звонок.',
      'en': '',
    },
    'rpw1w0tc': {
      'ru': 'Забронировать сейчас',
      'en': '',
    },
    '726da84i': {
      'ru': 'Свяжитесь со мной ',
      'en': '',
    },
  },
  // requestSendedMatchCopy4
  {
    'juz4mkys': {
      'ru': 'Ура! Ячейка найдена!',
      'en': '',
    },
    'fyq39ldf': {
      'ru':
          'AI-сторож Тихон нашел подходящий вариант. \nМожно сразу оплатить и заезжать.\n\nЕсть вопросы? Закажите звонок.',
      'en': '',
    },
    'p8cje75d': {
      'ru': 'Забронировать сейчас',
      'en': '',
    },
    'kjet1o51': {
      'ru': 'Свяжитесь со мной ',
      'en': '',
    },
  },
  // addAnswer
  {
    '3t4y7ukm': {
      'ru': 'Прикрепленное изображение:',
      'en': '',
    },
    'studkph5': {
      'ru':
          'Ответьте по сути.\nПриветствие, имя пользователя и тд\nприкрепится к ответу автоматически:',
      'en': '',
    },
    'iwsck9fs': {
      'ru': 'Ответ:',
      'en': '',
    },
    'odjpeud7': {
      'ru': '',
      'en': '',
    },
    'bnlpm7pa': {
      'ru': 'Обязательное поле',
      'en': '',
    },
    '1po0enwb': {
      'ru': 'Пожалуйста, введите Имя и Фамилию',
      'en': '',
    },
    'uubtr22o': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    'kfj0uwxb': {
      'ru': 'Обязательное поле',
      'en': '',
    },
    '2ibcrf8i': {
      'ru': 'Это не похоже на емейл',
      'en': '',
    },
    '7uzty07d': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    'nxwxhpj6': {
      'ru': 'Field is required',
      'en': '',
    },
    'v9rk0tus': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
  },
  // adminNotes
  {
    'ine9waoj': {
      'ru': 'Заметки:',
      'en': '',
    },
    'v61nq06n': {
      'ru': '',
      'en': '',
    },
  },
  // createMerchant
  {
    'q2jo2ejn': {
      'ru': 'Имя терминала*',
      'en': '',
    },
    '7os467p3': {
      'ru': 'Например, tochka-1 или ip-pupkin',
      'en': '',
    },
    'qazhmtoj': {
      'ru': '',
      'en': '',
    },
    'edj8rc1f': {
      'ru': 'Допустима только латиница (строчные), знак \"-\" и цифры',
      'en': '',
    },
    '4ykupryy': {
      'ru': 'Выберите тип терминала:',
      'en': '',
    },
    'reulb1w9': {
      'ru': 'Тестовый',
      'en': '',
    },
    'ulhcil7p': {
      'ru': 'Тестовый',
      'en': '',
    },
    'aa2vc8ta': {
      'ru': 'Рабочий',
      'en': '',
    },
    '4bjg52lq': {
      'ru': 'Неактивный',
      'en': '',
    },
    '0k2b2k1a': {
      'ru': 'Ключ терминала*',
      'en': '',
    },
    'u8llnlns': {
      'ru': '',
      'en': '',
    },
    'qx4h2i8f': {
      'ru': '',
      'en': '',
    },
    '71n3l0hd': {
      'ru': 'Пароль от терминала*',
      'en': '',
    },
    'k4c38omt': {
      'ru': '',
      'en': '',
    },
    '03567yrl': {
      'ru': '',
      'en': '',
    },
    'ryvxdp3p': {
      'ru': 'Пароль будет зашифрован и недоступен для просмотра',
      'en': '',
    },
    'q7j8ljux': {
      'ru': 'Обязательное поле',
      'en': '',
    },
    '23r1jntd': {
      'ru': 'Слишком короткое имя',
      'en': '',
    },
    '5ptbjsct': {
      'ru': 'В пароле есть недопустимые символы, заглавные буквы или кириллица',
      'en': '',
    },
    '8odfa2sp': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    'rr6pqc5q': {
      'ru': 'Обязательное поле',
      'en': '',
    },
    '3hd6de22': {
      'ru': 'Слишком коротко',
      'en': '',
    },
    'hl1ptbk4': {
      'ru': 'Слишком коротко',
      'en': '',
    },
    'kuv17qru': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    'xltj4kcp': {
      'ru': 'Обязательное поле',
      'en': '',
    },
    '7wn5kbjf': {
      'ru': 'Слишком короткий',
      'en': '',
    },
    '4ifb80es': {
      'ru': 'Не плхоже на пароль от терминала',
      'en': '',
    },
    '27f8s77g': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    '8uixioi0': {
      'ru': 'Создать',
      'en': '',
    },
    'qj3zavzs': {
      'ru': 'Отмена',
      'en': '',
    },
  },
  // updateMerchant
  {
    'rz9qk5u8': {
      'ru': 'Тип терминала:',
      'en': '',
    },
    '4477xq26': {
      'ru': 'Тестовый',
      'en': '',
    },
    'qwd9bg2j': {
      'ru': 'Рабочий',
      'en': '',
    },
    'evzblaw0': {
      'ru': 'Неактивный',
      'en': '',
    },
    'ltrt5wic': {
      'ru': 'Ключ терминала*',
      'en': '',
    },
    'i0n0q96f': {
      'ru': '',
      'en': '',
    },
    'a5erpj12': {
      'ru': 'Пароль от терминала*',
      'en': '',
    },
    'mjzw4w6y': {
      'ru': '',
      'en': '',
    },
    'agwoa9uf': {
      'ru': 'Пароль будет зашифрован и недоступен для просмотра',
      'en': '',
    },
    '96togtj9': {
      'ru': 'Обязательное поле',
      'en': '',
    },
    'gtl0hgg2': {
      'ru': 'Слишком коротко',
      'en': '',
    },
    'w9ssyhk2': {
      'ru': 'Слишком коротко',
      'en': '',
    },
    'atiay4o0': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    '0zepd6yp': {
      'ru': 'Обязательное поле',
      'en': '',
    },
    'y98118o7': {
      'ru': 'Слишком короткий',
      'en': '',
    },
    '5ozx1tam': {
      'ru': 'Не плхоже на пароль от терминала',
      'en': '',
    },
    '0my90hja': {
      'ru': 'Please choose an option from the dropdown',
      'en': '',
    },
    '0s1iyjmj': {
      'ru': 'Сохранить',
      'en': '',
    },
    'e8zwlabj': {
      'ru': 'Отмена',
      'en': '',
    },
  },
  // Miscellaneous
  {
    'e1not1i4': {
      'ru': 'Войти',
      'en': 'To come in',
    },
    '1zok81yn': {
      'ru': 'Email',
      'en': 'Email',
    },
    '22dovh7k': {
      'ru': '32',
      'en': '12',
    },
    'bxalhb6z': {
      'ru': 'Платежи',
      'en': 'Payments',
    },
    '4dl545mc': {
      'ru': 'Бизнес',
      'en': 'Business',
    },
    'imd118ko': {
      'ru': 'Report Now',
      'en': 'Report Now',
    },
    'nj6h8gm6': {
      'ru': 'Message Customer',
      'en': 'Message Customer',
    },
    'xpphug3z': {
      'ru': 'Почта',
      'en': '',
    },
    'bj2j95zc': {
      'ru': '',
      'en': '',
    },
    '2n5eljqk': {
      'ru': '',
      'en': '',
    },
    'ae30466l': {
      'ru': 'Шушары',
      'en': '',
    },
    'r4jg35um': {
      'ru': 'Кудрово',
      'en': '',
    },
    'x81d7g1e': {
      'ru': 'Кудрово 1',
      'en': '',
    },
    'ixsv1efm': {
      'ru': 'Кудрово 2',
      'en': '',
    },
    'ocuzkqi2': {
      'ru': 'Все локации',
      'en': '',
    },
    'w8cu4dlo': {
      'ru': 'Search for an item...',
      'en': '',
    },
    '9tlym0ax': {
      'ru': 'Выбрать',
      'en': '',
    },
    'u0rm6if5': {
      'ru': 'Информация о клиентах',
      'en': '',
    },
    'fnxk1kih': {
      'ru': 'Информация о статусе ячеек',
      'en': '',
    },
    '8ahynzle': {
      'ru': 'Информация о заявках',
      'en': '',
    },
    '6smr5yot': {
      'ru': 'Создание скидок и промокодов',
      'en': '',
    },
    'g06svkj9': {
      'ru': 'Просмотр платежей',
      'en': '',
    },
    '29qommlj': {
      'ru': 'Информация о клиентах',
      'en': '',
    },
    'o0br6mxz': {
      'ru': 'Информация о статусе ячеек',
      'en': '',
    },
    'a17rc33n': {
      'ru': 'Информация о заявках',
      'en': '',
    },
    '58qca72u': {
      'ru': 'Зона франшизы',
      'en': 'Payment Method',
    },
    'cpnghqb0': {
      'ru': 'Имя Фамилия',
      'en': 'Payment Details',
    },
    'i2i1v7fa': {
      'ru': 'Название роли',
      'en': 'TXN123456789',
    },
    'gdjwsggr': {
      'ru': 'Изменить почту',
      'en': 'Create  user',
    },
    'u9r0jz8n': {
      'ru': 'Менеджер',
      'en': 'Manager',
    },
    'mrwqgl16': {
      'ru': 'Оператор',
      'en': 'Operator',
    },
    'pfgjwyf0': {
      'ru': 'Менеджер',
      'en': 'Manager',
    },
    'a6xduso5': {
      'ru': 'Фр.',
      'en': 'Franchise',
    },
    'uq8pnall': {
      'ru': 'Home',
      'en': 'Home',
    },
    '59elmsz8': {
      'ru': 'Телефон',
      'en': 'Phone',
    },
    '0vo4t8w2': {
      'ru': '',
      'en': '',
    },
    'u32s7qeq': {
      'ru': 'Отправить заявку',
      'en': 'Sign up',
    },
    'zc7u5pns': {
      'ru': 'Локации',
      'en': '',
    },
    '500ylbbe': {
      'ru': 'Показывать индикатор свободных ячеек',
      'en': '',
    },
    'nsoav472': {
      'ru': 'Имя Фамилия',
      'en': 'Full name',
    },
    'nbyd5ugz': {
      'ru': '',
      'en': '',
    },
    'rix59nn9': {
      'ru': '',
      'en': '',
    },
    'qpmzojq0': {
      'ru': 'Option 1',
      'en': '',
    },
    'nggtro3v': {
      'ru': 'XS',
      'en': '',
    },
    'o34popha': {
      'ru': '',
      'en': '',
    },
    '813not7z': {
      'ru': '',
      'en': '',
    },
    'x6pt73dy': {
      'ru': '',
      'en': '',
    },
    'jh4ui4ou': {
      'ru': '',
      'en': '',
    },
    'zd9mj3tv': {
      'ru': '',
      'en': '',
    },
    'uv1f1379': {
      'ru': '',
      'en': '',
    },
    'j75murz6': {
      'ru': '',
      'en': '',
    },
    'k72frxlj': {
      'ru': '',
      'en': '',
    },
    '6d22nllk': {
      'ru': '',
      'en': '',
    },
    'sk85vaff': {
      'ru': '',
      'en': '',
    },
    'jptwncky': {
      'ru': '',
      'en': '',
    },
    '1h7glbq7': {
      'ru': '',
      'en': '',
    },
    'aprxhw9z': {
      'ru': '',
      'en': '',
    },
    '6mwr0hne': {
      'ru': '',
      'en': '',
    },
    '18ash2b1': {
      'ru': '',
      'en': '',
    },
    'bowitqwq': {
      'ru': '',
      'en': '',
    },
    'h1lr1se6': {
      'ru': '',
      'en': '',
    },
    'nlqop27s': {
      'ru': '',
      'en': '',
    },
    '8rqixe5l': {
      'ru': '',
      'en': '',
    },
    'yo56qi2u': {
      'ru': '',
      'en': '',
    },
    '4bdffzgu': {
      'ru': '',
      'en': '',
    },
    'uqgm7dkd': {
      'ru': '',
      'en': '',
    },
    '7h96d5wm': {
      'ru': '',
      'en': '',
    },
    'kfu9jeh6': {
      'ru': '',
      'en': '',
    },
    'cth59xy0': {
      'ru': '',
      'en': '',
    },
    '3zhtpwej': {
      'ru': '',
      'en': '',
    },
    'ihtrobt1': {
      'ru': '',
      'en': '',
    },
  },
].reduce((a, b) => a..addAll(b));
