import 'dart:convert';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:timeago/timeago.dart' as timeago;
import 'lat_lng.dart';
import 'place.dart';
import 'uploaded_file.dart';
import '/backend/schema/structs/index.dart';
import '/backend/schema/enums/enums.dart';
import '/backend/supabase/supabase.dart';
import '/auth/supabase_auth/auth_util.dart';

String? generateInviteToken() {
  /// Генерирует случайный токен для использования в системе приглашений.

  final length = 21; // Установить желаемую длину пароля
  const letterLowercase = 'abcdefghijklmnopqrstuvwxyz';
  const letterUppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const number = '0123456789';
  const symbol = '_ ~';

  // Создать объект для генерации случайных чисел
  final random = math.Random.secure();

  // Функция для получения случайного символа из строки
  String getRandomString(String str) {
    return str[random.nextInt(str.length)];
  }

  // Гарантировать, что в пароле будут символы из каждого набора
  final inviteChars = [
    getRandomString(letterLowercase),
    getRandomString(letterUppercase),
    getRandomString(number),
    getRandomString(symbol),
  ];

  // Заполнить оставшуюся часть пароля случайными символами из всех наборов
  for (var i = inviteChars.length; i < length; i++) {
    final allChars = letterLowercase + letterUppercase + number + symbol;
    inviteChars.add(getRandomString(allChars));
  }

  // Перемешать символы токена для обеспечения их случайного распределения
  inviteChars.shuffle(random);

  // Объединить символы для создания итоговой строки токена
  return inviteChars.join();
}

void main() {
  final invite = generateInviteToken();
  print(invite); // Вывести сгенерированный токен
}

DateTime yesterdayTimeView(DateTime expirationDate) {
  return expirationDate.subtract(Duration(hours: 28));
}

String setRoleID(String? userRole) {
  String roleID = 'operator'; // значение по умолчанию

  switch (userRole) {
    case 'Администратор':
      roleID = 'franchisor';
      break;
    case 'Франчайзер':
      roleID = 'franchisor';
      break;
    case 'Франчайзи':
      roleID = 'franchisee';
      break;
    case 'Менеджер':
      roleID = 'manager';
      break;
    case 'Оператор':
      roleID = 'operator';
      break;
    default:
      // уже установлено значение по умолчанию
      break;
  }

  return roleID;
}

bool? canViewAll(String? roleID) {
  // Проверяем, равен ли roleID 'franchisor'
  return roleID == 'franchisor';
}

List<PermLevel>? setPermLevel(String? roleID) {
  switch (roleID) {
    case 'franchisor':
      // Franchisor имеет доступ ко всем уровням
      return [
        PermLevel.full,
        PermLevel.franchise,
        PermLevel.management,
        PermLevel.operative
      ];
    case 'franchisee':
      // Franchisee не имеет полного доступа
      return [PermLevel.franchise, PermLevel.management, PermLevel.operative];
    case 'manager':
      // Manager не имеет доступа к созданию франшиз и полному управлению
      return [PermLevel.management, PermLevel.operative];
    case 'operator':
      // Operator имеет только оперативный уровень доступа
      return [PermLevel.operative];
    default:
      // По умолчанию только оперативный уровень доступа
      return [PermLevel.operative];
  }
}

String extractInviteID(String url) {
  // Длина inviteID, которую вы ожидаете
  int lengthOfID = 18;

  // Вычисляем начало ID, учитывая общую длину строки и длину ID
  int startIndex = url.length - lengthOfID;

  // Извлекаем подстроку, начиная с рассчитанного индекса до конца строки
  String inviteID = url.substring(startIndex);

  return inviteID;
}

DateTime? endWaitingData(int? waitingPeriod) {
  if (waitingPeriod == null) {
    return null; // Return null if the input is null
  }

  return DateTime.now().add(Duration(days: waitingPeriod));
}

DateTime createReserveTime(int timeForPayment) {
  // Получение текущего времени
  DateTime currentTime = DateTime.now();

  // Добавление количества часов к текущему времени
  DateTime reservationEndTime =
      currentTime.add(Duration(hours: timeForPayment));

  // Преобразование времени окончания бронирования в UTC
  DateTime reservationEndTimeUtc = reservationEndTime.toUtc();

  // Возвращение времени окончания бронирования в UTC
  return reservationEndTimeUtc;
}

DateTime endDataClientPromocode(int days) {
  return DateTime.now().add(Duration(days: days));
}

String? getLocationsForPriceTier(List<String> locationNames) {
// Пример функции для получения и объединения имен локаций

  return locationNames.join(', ');
}

List<String> generateID(String ruName) {
  // Функция для транслитерации
  final translitMap = {
    'а': 'a',
    'б': 'b',
    'в': 'v',
    'г': 'g',
    'д': 'd',
    'е': 'e',
    'ё': 'e',
    'ж': 'zh',
    'з': 'z',
    'и': 'i',
    'й': 'i',
    'к': 'k',
    'л': 'l',
    'м': 'm',
    'н': 'n',
    'о': 'o',
    'п': 'p',
    'р': 'r',
    'с': 's',
    'т': 't',
    'у': 'u',
    'ф': 'f',
    'х': 'kh',
    'ц': 'ts',
    'ч': 'ch',
    'ш': 'sh',
    'щ': 'shch',
    'ъ': '',
    'ы': 'y',
    'ь': '',
    'э': 'e',
    'ю': 'yu',
    'я': 'ya',
    'А': 'A',
    'Б': 'B',
    'В': 'V',
    'Г': 'G',
    'Д': 'D',
    'Е': 'E',
    'Ё': 'E',
    'Ж': 'ZH',
    'З': 'Z',
    'И': 'I',
    'Й': 'I',
    'К': 'K',
    'Л': 'L',
    'М': 'M',
    'Н': 'N',
    'О': 'O',
    'П': 'P',
    'Р': 'R',
    'С': 'S',
    'Т': 'T',
    'У': 'U',
    'Ф': 'F',
    'Х': 'KH',
    'Ц': 'TS',
    'Ч': 'CH',
    'Ш': 'SH',
    'Щ': 'SHCH',
    'Ъ': '',
    'Ы': 'Y',
    'Ь': '',
    'Э': 'E',
    'Ю': 'YU',
    'Я': 'YA'
  };

  String transliterate(String ruName) {
    return ruName.split('').map((char) => translitMap[char] ?? char).join('');
  }

  // Проверка входного параметра
  if (ruName == null || ruName.isEmpty) {
    return [];
  }

  // Транслитерация названия
  String transliteratedName = transliterate(ruName).toUpperCase();
  List<String> ids = [];

  // Первый вариант — первые три буквы транслитерации названия
  if (transliteratedName.length >= 3) {
    ids.add(transliteratedName.substring(0, 3));
  } else {
    ids.add(transliteratedName.padRight(
        3, 'X')); // Дополнение до 3 символов, если длина меньше 3
  }

  // Второй вариант — три согласные буквы
  String consonants = transliteratedName.replaceAll(RegExp(r'[AEIOUY]'), '');
  if (consonants.length >= 3) {
    ids.add(consonants.substring(0, 3));
  } else {
    ids.add((consonants +
            transliteratedName
                .replaceAll(RegExp(r'[^AEIOUY]'), '')
                .substring(0, 3 - consonants.length))
        .substring(0, 3));
  }

  // Третий вариант — первая буква и две случайные буквы из названия
  math.Random random = math.Random();
  List<String> letters = transliteratedName.split('');
  letters.shuffle(random);
  String randomLetters = letters
      .where((letter) => letter != transliteratedName[0])
      .take(2)
      .join('');
  ids.add(transliteratedName[0] + randomLetters);

  // Четвертый вариант — первая буква, последняя буква и случайная буква из середины
  if (transliteratedName.length > 2) {
    String middleLetter =
        transliteratedName[random.nextInt(transliteratedName.length - 2) + 1];
    ids.add(transliteratedName[0] +
        middleLetter +
        transliteratedName[transliteratedName.length - 1]);
  } else {
    ids.add(transliteratedName.padRight(
        3, 'X')); // Дополнение до 3 символов, если длина меньше 3
  }

  return ids;
}

String? findFirstUniqueId(
  List<String> generatedIds,
  List<String> existingIds,
) {
  for (String genId in generatedIds) {
    if (!existingIds.contains(genId)) {
      return genId; // Возвращаем первый уникальный ID
    }
  }
  return null; // Если уникальный ID не найден, возвращаем null
}

String? generateRandomId(String currentID) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  math.Random random = math.Random(); // Используем псевдоним
  String id = currentID[0]; // Используем первую букву из currentID
  for (int i = 1; i < 3; i++) {
    id += letters[random.nextInt(letters.length)];
  }
  return id;
}

void exampleFunction() {
  // Пример генерации и проверки ID
  List<String> existingIds = ['SVL', 'SHU', 'NEW', 'KUD'];

  String currentID = 'KUD'; // Пример текущего ID
  String? newId;
  do {
    newId = generateRandomId(currentID);
  } while (existingIds.contains(newId));

  print(newId); // Вывод нового уникального ID
}

bool isWorkingHours() {
  DateTime now = DateTime.now();
  int currentHour = now.hour;
  int currentDay = now.weekday;

  bool isWorkingDay =
      currentDay >= DateTime.monday && currentDay <= DateTime.friday;
  bool isWorkingTime = currentHour >= 9 && currentHour < 20;

  return isWorkingDay && isWorkingTime;
}

DateTime addBookingTime(DateTime expirationDate) {
  // Получаем текущее время
  DateTime currentTime = DateTime.now();
  // Добавляем 24 часа к текущему времени
  return currentTime.add(Duration(hours: 28));
}

String? fromRatioToPercent(double? availableRatio) {
  if (availableRatio == null) {
    return null;
  }
  return '${(availableRatio * 100).toInt()}%';
}

int? montsPayments(
  DateTime? firstPayment,
  DateTime? expirationDate,
) {
  // Проверяем, что даты не null
  if (firstPayment == null || expirationDate == null) {
    return null;
  }

  // Вычисляем разницу в месяцах
  int months = (expirationDate.year - firstPayment.year) * 12 +
      expirationDate.month -
      firstPayment.month;

  // Проверяем, если последний день месяца учитывается
  if (expirationDate.day < firstPayment.day) {
    months--;
  }

  // Проверяем, что expirationDate не ранее текущего месяца
  DateTime now = DateTime.now();
  if (expirationDate.isBefore(DateTime(now.year, now.month, 1))) {
    return null;
  }

  // Возвращаем количество месяцев
  return months;
}

DateTime? paymentEndDate(
  int days,
  DateTime startDate,
) {
  // Вычисление даты окончания аренды
  DateTime endDate = startDate.add(Duration(days: days));
  return endDate;
}

DateTime convertTimeToServerTime(DateTime appTime) {
  return appTime.toUtc();
}
