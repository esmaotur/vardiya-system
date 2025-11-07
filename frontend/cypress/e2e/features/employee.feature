Feature: Çalışan Ekleme

  Scenario: Yeni çalışan ekleme akışı
    Given kullanıcı anasayfayı ziyaret eder
    When kullanıcı yeni bir çalışan ekler
    Then başarılı bir bildirim görmeli
    Then yeni çalışan listede görünmeli
