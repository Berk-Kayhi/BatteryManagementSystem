# Battery Management System + AI Prediction

Battery Management System; batarya telemetri verilerini MQTT üzerinden canlı alan, Socket.IO ile frontend'e aktaran, PostgreSQL üzerinde geçmiş kayıt tutan ve fake-ai servisiyle SOC tahmini üreten full-stack bir web uygulamasıdır.

Proje React tabanlı bir frontend, Node.js/Express backend, PostgreSQL + Sequelize veri katmanı, Mosquitto MQTT broker'ı, Python veri yayıncı servisi ve FastAPI tabanlı fake-ai tahmin servisinden oluşur. Backend tabloları SQL başlangıç dosyası yerine Sequelize modelleriyle oluşturur.

## Teknolojiler

- Frontend: React, Vite, TypeScript, Tailwind CSS, Recharts, Socket.IO Client
- Backend: Node.js, Express, Sequelize, PostgreSQL, JWT, Socket.IO, MQTT
- Yapay zeka servisi: Python, FastAPI
- Data Publisher: Python, paho-mqtt, CSV veri akışı
- Çalıştırma ortamı: Docker, Docker Compose, Mosquitto

## Proje Yapısı

```text
frontend/             React tabanlı frontend arayüzü
backend/              Express API, Sequelize modelleri, MQTT ve Socket.IO akışı
data-publisher/       CSV verisini MQTT topic'ine yayınlayan Python servis
fake-ai/              SOC tahmini üreten FastAPI servisi
mosquitto/config/     MQTT broker yapılandırması
csv-data/             Simüle edilen batarya telemetri CSV verisi
assets/               README görselleri
docker-compose.yml    Uygulama servislerinin Docker tanımı
.env.example          Ortam değişkenleri şablonu
```

## Kurulum

Önce ortam değişkenleri dosyasını oluşturun:

```bash
cp .env.example .env
```

`.env` içindeki `JWT_SECRET` ve veritabanı değerlerini kendi ortamınıza göre değiştirin. Docker Compose servisleri ortam değişkenlerini bu dosyadan okur; `docker-compose.yml` içinde inline environment bloğu tutulmaz.

Ardından uygulamayı başlatın:

```bash
docker compose up --build
```

Servisler varsayılan olarak şu adreslerde çalışır:

- Frontend: `http://localhost:5173`
- Backend API ve Socket.IO: `http://localhost:3001`
- PostgreSQL: `localhost:5432`
- MQTT Broker: `localhost:1883`
- Fake AI Service: `http://localhost:8001`

Frontend'i ayrıca lokal çalıştırmak için:

```bash
cd frontend
npm install
npm run dev
```

## Veri Akışı

1. `data-publisher` servisi `csv-data/data.csv` dosyasındaki batarya verilerini sırayla okur.
2. Her kayıt `sensor/data` MQTT topic'ine yayınlanır.
3. Backend servisi bu topic'e abone olur ve canlı sensör verisini Socket.IO üzerinden `live_data` olarak frontend'e gönderir.
4. Backend son sensör verisini düzenli aralıklarla fake-ai servisine gönderir.
5. Fake-ai servisi SOC tahmini üretir.
6. Backend sensör SOC, AI SOC ve ilgili batarya metriklerini Sequelize modeli üzerinden `timestamp_` tablosuna kaydeder.
7. Frontend canlı verileri Socket.IO ile, geçmiş verileri fetch tabanlı API servisleriyle görüntüler.

## Kullanım

1. `http://localhost:5173` adresini açın.
2. Kayıt ekranından kullanıcı oluşturun veya mevcut hesabınızla giriş yapın.
3. Şebeke haritası ekranında sistem görünümünü takip edin.
4. Sensör ekranında canlı batarya telemetrisini görüntüleyin.
5. Sistem durumu ekranında SOC, SOH ve gerilim düşüşü grafiklerini izleyin.
6. Tahmin panelinde sensör SOC ve AI SOC değerlerini karşılaştırın.
7. Geçmiş kayıtlar ekranında zaman damgalı SOC kayıtlarını inceleyin.

## API Uçları

- `POST /api/auth/register`: Yeni kullanıcı oluşturur.
- `POST /api/auth/login`: Kullanıcı girişi yapar ve HTTP-only cookie üretir.
- `POST /api/auth/logout`: Oturumu kapatır.
- `GET /api/auth/me`: Aktif kullanıcı bilgisini döndürür.
- `DELETE /api/auth/delete`: Aktif kullanıcı hesabını siler.
- `GET /api/data/timestamp`: Tüm SOC tahmin kayıtlarını döndürür.
- `GET /api/data/latest`: Son 10 SOC tahmin kaydını döndürür.

## Ekran Görüntüleri

README görselleri [`assets`](assets) klasöründe tutulur.

### Sistem Durumu

![Batarya sistem durumu paneli](assets/Battery%20Management%20System.jpg)

Sistem durumu ekranında SOH, SOC ve gerilim düşüşü oranı canlı telemetriye göre takip edilir; alt grafiklerde batarya sağlığı ve şarj durumunun zaman içindeki değişimi görüntülenir.

### Tahmin Paneli

![Yapay zeka SOC tahmin paneli](assets/Battery%20Management%20System%202.jpg)

Tahmin panelinde fake-ai servisinden gelen AI SOC değeri ile sensörden okunan SOC değeri aynı grafikte karşılaştırılır; alt bölümde zaman damgalı kayıt listesi anlık olarak izlenir.

### Geçmiş Kayıtlar

![SOC geçmiş kayıtlar ekranı](assets/Battery%20Management%20System%203.jpg)

Geçmiş kayıtlar ekranında PostgreSQL üzerinde tutulan SOC tahminleri zaman damgasına göre listelenir; kullanıcı son 20, son 50 veya tüm kayıtları filtreleyerek inceleyebilir.

### Şebeke Haritası

![Network topolojisi ekranı](assets/Battery%20Management%20System%204.jpg)

Şebeke haritası ekranında trafo merkezleri ve AST/ESS bağlantıları interaktif topoloji üzerinde gösterilir; AST2 üzerinden bağlı ESS birimine geçilerek canlı batarya telemetri ekranına ulaşılır.

### Canlı Sensör Verisi

![Canlı batarya telemetri kartları](assets/Battery%20Management%20System%205.jpg)

Canlı sensör ekranında MQTT üzerinden gelen batarya telemetrisi kartlar halinde sunulur; gerilim, akım, güç, sıcaklık, SOC, SOH ve limit değerleri artış/düşüş durumlarıyla birlikte anında güncellenir.

![Canlı sensör gerilim grafiği](assets/Battery%20Management%20System%206.jpg)

Gerilim, akım ve güç kartlarından seçilen metrik için modal grafik açılır; son 10 veri kaydı üzerinden ölçüm değerinin kısa dönemli hareketi takip edilir.

## Geliştirme Komutları

Docker kullanmadan servisleri ayrı ayrı çalıştırmak isterseniz ilgili dizinlerde bağımlılıkları kurup geliştirme komutlarını çalıştırabilirsiniz:

```bash
cd backend && npm install && npm start
cd frontend && npm install && npm run dev
cd data-publisher && pip install -r requirements.txt && python publisher.py
cd fake-ai && pip install -r requirements.txt && uvicorn fake-ai:app --host 0.0.0.0 --port 8001
```

Bu yöntemle çalıştırırken `.env` içindeki `DB_HOST`, `MQTT_HOST`, `FAKE_AI_URL`, `VITE_API_BASE_URL` ve `VITE_SOCKET_URL` değerlerini lokal servis adreslerine göre güncellemeniz gerekir.

## Lisans

Bu proje özel bir kaynak inceleme lisansı ile sunulur. Kaynak kodları inceleme ve değerlendirme amacıyla görüntülenebilir; değiştirilmiş sürümlerin ticari amaçla kullanımı, dağıtımı veya satışı yasaktır. Ayrıntılar için `LICENSE` dosyasına bakabilirsiniz.
