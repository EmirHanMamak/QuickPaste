# QuickPaste Tasarım Envanteri

Bu doküman QuickPaste projesindeki mevcut ekranları, pencereleri, panelleri ve UI bileşenlerini tasarım çalışması için haritalandırır. Amaç, uygulamadaki her görünür yüzeyi ayrı ayrı anlayıp yeni tasarım kararlarını daha düzenli verebilmektir.

## Genel Mimari

QuickPaste bir Tauri desktop uygulamasıdır. Projede dört ayrı pencere ve ana pencere içinde dört ana panel bulunur.

### Tauri Pencereleri

1. **Main Window**
   - Ana QuickPaste arayüzüdür.
   - Varsayılan boyut: `500x800`.
   - Ortada açılır.
   - Resize edilebilir.
   - Border/decorations yoktur.
   - Always-on-top aktiftir.
   - Taskbar'da görünmez.

2. **Welcome Window**
   - İlk açılış onboarding ekranıdır.
   - Ayrı `welcome.html` dosyasıyla çalışır.
   - Varsayılan boyut: `1200x900`.
   - Minimum boyut: `900x700`.
   - İlk açılışta gösterilir, sonra yalnızca Settings üzerinden açılabilir.

3. **Suggestions Window**
   - Text Expansion autocomplete/suggestion popup'ıdır.
   - Ayrı `suggestions.html` dosyasıyla çalışır.
   - Boyut: `420x280`.
   - Always-on-top çalışır.
   - Trigger yazarken küçük öneri penceresi olarak görünür.

4. **Launcher Window**
   - Hızlı snippet seçme/yapıştırma için kullanılan ayrı pencere modudur.
   - Boyut: `680x520`.
   - Aynı ana arayüzün launcher-mode varyantı gibi çalışır.
   - Settings ve ağır ekranlardan çok hızlı seçim deneyimine odaklanır.

### Ana Pencere İçindeki Paneller

Ana pencere içinde yatay kayan bir `panelTrack` bulunur. Bu track dört paneli taşır:

1. **Ana Sayfa**
2. **Text Expansion**
3. **Dashboard**
4. **Settings**

Beklenen davranış: Header'daki butona basıldığında sadece ilgili panel görünmelidir. Aynı anda iki panel yarım yarım görünmemelidir.

---

## 1. Main Window / Ana Shell

Ana shell uygulamanın temel iskeletidir.

### Görsel Yapı

- Üstte sabit header bulunur.
- Ortada aktif panel alanı bulunur.
- Altta sabit footer bulunur.
- Sağ altta floating add button vardır.
- Toast, dialog, command palette ve quick look gibi overlay katmanları bu pencere üzerinde açılır.

### Header

Header sol tarafta uygulama adını, sağ tarafta navigation/action butonlarını taşır.

Sol taraf:

- `QuickPaste` başlığı.
- Mavi/accent renkte görünür.
- Kullanıcı için uygulama kimliğini sabit tutar.

Sağ taraf buton sırası:

1. **Ana Sayfa**
   - İkon: `home`
   - Görev: Snippet listesi paneline döner.
   - Tooltip: `Main Page / Ana Sayfa`

2. **Pin**
   - İkon: `push_pin`
   - Görev: Pencereyi pinned/unpinned yapar.
   - Aktifken pencere blur olduğunda kapanmaz.
   - Diğer header butonlarından daha belirgin görünür.

3. **Text Expansion**
   - İkon: `text_snippet`
   - Görev: Text Expansion panelini açar.
   - Sistem genelinde çalışan trigger yönetimine götürür.

4. **Dashboard**
   - İkon yerine üç küçük renkli bar kullanır.
   - Görev: Dashboard & Stats panelini açar.

5. **Launcher**
   - İkon: `bolt`
   - Şu anda hidden/disabled durumdadır.
   - Hızlı launcher penceresi için ayrılmıştır.

6. **Settings**
   - İkon: `settings`
   - Görev: Settings panelini açar.

7. **Close**
   - İkon: `close`
   - Görev: Pencereyi kapatmak yerine hide eder.

### Footer

Footer ekranın altında sabittir.

Sol taraf:

- Result label gösterilir.
- Örnek: `2 snippets`, `0 snippets`.

Orta/ek bilgi:

- Paste stack badge gerektiğinde görünür.
- Örnek: `📚 3 left`.

Sağ taraf:

- Floating add button bulunur.
- Yuvarlak, büyük, accent renkli bir `+` butonudur.
- Yeni snippet ekleme dialog'unu açar.

---

## 2. Ana Sayfa / Snippet Listesi

Ana Sayfa, uygulamanın en sık kullanılan ekranıdır. Kullanıcı snippet arar, filtreler, seçer, kopyalar, yapıştırır, düzenler ve siler.

### Üst Search Alanı

İlk satırda arama ve kategori filtresi bulunur.

#### Search Input

- Solunda search ikonu vardır.
- Placeholder: `Search snippets…`
- Genişliği yaklaşık yüzde 50 olarak ayarlanmıştır.
- Küçük ve kompakt bir input'tur.
- Kullanıcı yazdıkça liste filtrelenir.

Arama kapsamı:

- Snippet title
- Snippet content
- Category
- Tags

#### Category Filter

- Search input'un sağında bulunur.
- Varsayılan seçenek: `All`.
- Kategoriler dinamik olarak snippet verilerinden üretilir.
- Seçim değiştiğinde liste filtrelenir.

### Toolbar

Search satırının altında ikinci bir toolbar satırı vardır.

#### Sort Select

Seçenekler:

- `📌 Default`
- `A → Z`
- `Z → A`
- `🔥 Most Used`
- `🕐 Newest`
- `📅 Oldest`

Görev:

- Snippet listesinin sıralamasını değiştirir.

#### From Clipboard

- İkon: `content_paste`
- Label: `From Clipboard`
- Mevcut panodaki metni yeni snippet olarak ekleme akışını başlatır.
- Clipboard boşsa toast gösterir.
- Aynı içerik zaten varsa duplicate uyarısı verir.
- İçerik uygunsa Add Snippet dialog'unu prefill eder.

#### Select

- İkon: `check_box`
- Label: `Select`
- Multi-select mode'u açar.
- Aktif olduğunda buton primary renge döner.

### Bulk Action Bar

Normalde gizlidir. Select mode açılınca görünür.

İçerik:

- `0 selected` label
- `📚 Stack` butonu
- `🗑 Delete` butonu
- `✕ Cancel` butonu

Davranış:

- Seçili snippet sayısını gösterir.
- Delete seçili snippet'leri siler.
- Cancel multi-select mode'u kapatır.
- Stack seçili snippet'leri sıralı paste akışına hazırlamak için kullanılır.

### Snippet Listesi

Ana içerik scroll alanıdır. Snippet kartları dikey listelenir.

#### Snippet Kart Yapısı

Her kartta şu alanlar bulunabilir:

- Drag handle
- Pin indicator
- Type badge
- Emoji
- Snippet title
- Secret lock
- Smart type badge
- Macro badge
- Expression badge
- Linked snippet badge
- Shortcut label
- Trigger label
- Content preview
- Reveal button
- Smart action buttons
- Category chip
- Tag chip'leri
- Character count
- Use count
- Time ago
- Copy button
- Quick Look button

#### Kart Üst Satırı

Üst satırda snippet'in kimliği ve hızlı rozetleri yer alır.

Örnek görünenler:

- `📌`
- Type icon
- Başlık
- `Alt+1`
- `⚡ :email`
- `🔗 Macro`
- `fx`
- `[[ref]]`

#### İçerik Preview

- Normal snippet'lerde içerik kısa preview olarak görünür.
- Secret/password snippet'lerde içerik `••••••••••••` şeklinde maskelenir.
- Secret snippet'lerde `👁 Show` butonu bulunur.
- Açıldığında buton `🙈 Hide` olur.

#### Meta Satırı

Alt satırda küçük chip ve sayaçlar bulunur.

Örnekler:

- `📁 GENERAL`
- Tag chip'leri
- `43c`
- `67 uses`
- `1h ago`

#### Kart Aksiyonları

Sağ tarafta/kart içinde iki hızlı buton vardır:

- `📋` Copy-only
- `👁` Quick Look

#### Kart Davranışları

- Kart tıklanınca snippet aktif uygulamaya paste edilir.
- Copy-only butonu yalnızca panoya kopyalar.
- Quick Look butonu preview overlay açar.
- Sağ tık context menu açar.
- Drag & drop ile sıralama değiştirilebilir.
- Multi-select modda tıklama seçim yapar.

### Empty State

Snippet yoksa veya arama sonucu yoksa boş durum görünür.

Arama sonucu yoksa:

- İkon: `🔍`
- Başlık: `No results found`
- Açıklama: `Try fuzzy search or a different category.`

Hiç snippet yoksa template önerileri gösterilebilir:

- `Email Signature`
- `SQL Select`
- `Git Commit`
- `TODO Comment`

---

## 3. Add/Edit Snippet Dialog

Snippet ekleme ve düzenleme modalıdır.

### Açıldığı Yerler

- Footer'daki `+` butonu
- Snippet context menu `Edit`
- Clipboard import akışı
- Command palette `New Snippet`

### Header

- Back button
- Başlık: `Add Snippet` veya `Edit Snippet`

### Form Alanları

#### Title

- Placeholder: `Snippet name…`
- Snippet kartındaki ana başlığı belirler.

#### Content

- Placeholder: `Type or paste content…`
- Çok satırlı textarea.
- Altında character counter bulunur.
- Uzun metinlerde warning/limit state alır.

#### Shortcut

- Readonly input.
- Placeholder: `None`
- Kullanıcı tıklayıp klavye kombinasyonu basar.
- Sağında clear `✕` butonu vardır.
- Uygun olmayan shortcut için warning çıkar.

#### Type

Dropdown seçenekleri:

- `📝 Text`
- `💻 Code`
- `🔗 URL`
- `🔒 Password`

#### Project / Category

- Placeholder: `e.g., MamakSDK Vault`
- Snippet kartında folder chip olarak görünür.

#### Expansion Trigger

- Placeholder: `e.g., :email`
- Snippet için otomatik genişletme trigger'ı tanımlar.

#### Tags

- Placeholder: `code, vault`
- Virgülle ayrılmış tag sistemi.

#### Emoji

- Placeholder: `🔥`
- Kartta type icon yerine kullanılabilir.

#### Slot

Dropdown seçenekleri:

- `None`
- `1 (Alt+1)`
- `2 (Alt+2)`
- `3 (Alt+3)`
- `4 (Alt+4)`
- `5 (Alt+5)`
- `6 (Alt+6)`
- `7 (Alt+7)`
- `8 (Alt+8)`
- `9 (Alt+9)`

#### Macro Chain

- Placeholder: `Step 1, tab, Step 2, enter…`
- Snippet zinciri oluşturmak için kullanılır.

#### Color Label

Renk seçenekleri:

- None
- Red
- Orange
- Yellow
- Green
- Blue
- Purple
- Pink

#### Secret Toggle

- Label: `Hide content (secret / password)`
- Aktifse içerik kartta maskelenir.

### Footer

Butonlar:

- `Cancel`
- `Save`

---

## 4. Snippet Context Menu

Snippet kartına sağ tıklayınca açılan küçük menüdür.

### Menü Öğeleri

- `📌 Pin` veya `📌 Unpin`
- `✏️ Edit`
- `⧉ Duplicate`
- `✨ Transform`
- `👁 Quick Look`
- `🗑 Delete`

### Transform Submenu

`Transform` öğesi bir alt menü açar.

Davranış:

- İçeriği dönüştüren aksiyonlar listelenir.
- Seçilen dönüşüm snippet içeriğine uygulanır.
- Snippet kaydedilir.
- Toast ile kullanıcıya geri bildirim verilir.

### Tasarım Notu

- Delete öğesi kırmızı renkle ayrılmalıdır.
- Transform öğesinde sağ ok hissi korunmalıdır.
- Menü küçük, hızlı ve kart üstü floating his vermelidir.

---

## 5. Quick Look Overlay

Snippet içeriğini büyük preview olarak açan overlay'dir.

### Açıldığı Yerler

- Karttaki `👁` butonu
- Context menu `Quick Look`
- Klavye/komut paleti akışları

### Görünüm

- Fullscreen koyu translucent overlay.
- Ortada maksimum `600px` genişliğinde panel.
- Panel rounded, bordered ve shadow'ludur.
- Sağ üstte copy ve close butonları bulunur.

### İçerik

- Snippet icon/type icon
- Snippet title
- Type badge
- Büyük content preview alanı
- Use count
- Character count
- Category etiketi

### Secret State

Secret snippet'lerde içerik yine maskeli görünür.

---

## 6. Command Palette

Hızlı komut ve snippet arama overlay'idir.

### Görünüm

- Fullscreen koyu overlay.
- Üstten boşluklu ortalanmış panel.
- Search input.
- Sonuç listesi.

### Input

- Placeholder: `Type a command...`

### Sistem Komutları

- `➕ New Snippet`
- `⚙ Settings`
- `📊 Dashboard`
- `📤 Export Data`
- `📥 Import Data`
- `🗑 Clear All`

### Snippet Arama

- Kullanıcı normal arama yaparsa snippet'lerde fuzzy search çalışır.
- Sonuçlarda icon, label, description ve type badge bulunur.

### Davranış

- `>` ile command mode kullanılabilir.
- Arrow up/down ile seçim değişir.
- Enter seçili item'ı çalıştırır.
- Escape kapatır.
- Overlay dışına tıklayınca kapanır.

---

## 7. Placeholder Modal

Snippet içinde doldurulabilir placeholder varsa çıkan modal katmanıdır.

### Görünüm

- Fullscreen koyu overlay.
- Ortada küçük modal.
- Başlık: `Fill Placeholders`
- JS tarafından oluşturulan input alanları.

### Footer

- `Cancel`
- `Paste`

### Davranış

- Kullanıcı placeholder değerlerini girer.
- `Paste` ile doldurulmuş içerik aktif uygulamaya gönderilir.

---

## 8. Toast Notifications

Kısa süreli bildirim sistemidir.

### Kullanıldığı Durumlar

- Snippet copied
- Snippet duplicated
- Transform applied
- Window pinned/unpinned
- Text expansion saved/deleted/imported/exported
- Clipboard empty
- Copy failed
- Defaults installed

### Tipler

- Success
- Error
- Info

### Tasarım Notu

Toast'lar tema token'larına bağlı olmalı ve çok yer kaplamamalıdır.

---

## 9. Text Expansion Panel

Ana pencere içindeki ikinci paneldir. Sistem genelinde çalışan trigger/replacement yönetimini sağlar.

### Üst Başlık

Label:

- `Text Expansion`
- Türkçe: `Metin Genişletme`

Başlık:

- `System-wide snippets`
- Türkçe: `Sistem genelinde snippet'ler`

Açıklama:

- `Type a trigger in any app, then press Space, Enter, Tab, or punctuation to expand it instantly.`
- Türkçe: `Herhangi bir uygulamada tetikleyici yazın; ardından Space, Enter, Tab veya noktalama ile anında genişletin.`

### Header Aksiyonları

- `Defaults`
- `Import`
- `Export`
- `Back`

Türkçe:

- `Varsayılan Paketler`
- `İçe Aktar`
- `Dışa Aktar`
- `Geri`

### Toolbar

#### Search

- Placeholder: `Search triggers, replacements, app filters...`
- Türkçe: `Tetikleyici, replacement veya uygulama filtresi ara...`

#### New Button

- Label: `New`
- Yeni expansion formunu temizler/açar.

### Ana Grid

İki kolonlu yapı vardır:

1. Sol: Snippet List
2. Sağ: New/Edit Expansion Form

Dar ekranlarda bu yapı tek kolona dönmelidir.

### Text Expansion Snippet List

Sol listedeki her kartta şu bilgiler bulunur:

- Trigger badge
- Enabled/Paused badge
- Description
- Case sensitivity göstergesi
- Replacement preview
- Word boundary badge
- App filter badge

Örnek kart bilgileri:

- `:date`
- `Enabled`
- `aa` veya `Aa`
- `Word boundary`
- `All apps`

Boş liste:

- İkon: `✦`
- Başlık: `No text expansions found`
- Açıklama: `Try a different search or create a new trigger.`

Türkçe:

- `Metin genişletme bulunamadı`
- `Farklı bir arama deneyin veya yeni bir tetikleyici oluşturun.`

### New/Edit Expansion Form

Form başlığı:

- `New Expansion`
- `Edit Expansion`

Form aksiyonları:

- `New`
- `Delete`
- `Save`

#### Trigger

- Placeholder: `:mail`
- Duplicate trigger kabul edilmez.

#### Description

- Placeholder: `Optional note`

#### Replacement

- Çok satırlı textarea.
- Placeholder: `Type your replacement here...`
- Dynamic variable destekler.

#### Conflict Warning

- `⚠ Trigger conflict detected. Same trigger cannot be saved twice.`
- Türkçe: `⚠ Tetikleyici çakışması var. Aynı tetikleyici iki kez kaydedilemez.`

#### Toggle Alanları

- Enabled
- Case Sensitive
- Word Boundary

#### Application Filter

Dropdown seçenekleri:

- `All apps`
- `Only Unity`
- `Only Rider`
- `Only VS Code`
- `Only Chrome`
- `Custom exe names`

Türkçe:

- `Tüm uygulamalar`
- `Sadece Unity`
- `Sadece Rider`
- `Sadece VS Code`
- `Sadece Chrome`
- `Özel exe adları`

Custom placeholder:

- `Unity.exe, Rider64.exe, Code.exe`

#### Dynamic Variables

Gösterilen değişkenler:

- `{{date}}`
- `{{time}}`
- `{{datetime}}`
- `{{clipboard}}`
- `{{uuid}}`
- `{{random:1-100}}`

Açıklama:

- `Variables resolve when the expansion fires, not when it is saved.`
- Türkçe: `Değişkenler kayıt edilirken değil, genişleme çalıştığı anda çözülür.`

### Default Packs Alanı

Başlık:

- `Default Packs`
- Türkçe: `Varsayılan Paketler`

Buton:

- `Install All`
- Türkçe: `Tümünü Kur`

Paket kartlarında:

- Paket başlığı
- Paket açıklaması
- Kurulum sayacı
- `Install Pack`
- Her item için trigger, replacement preview ve `Install Item`

### Paket Kategorileri

Mevcut default paketler:

- `Core / Essentials`
- `Daily / General Productivity`
- `Git / Version Control`
- `Unity / Lifecycle`
- `Unity / Debug & Logging`
- `Unity / Attributes & Serialization`
- `Unity / Components & GameObject`
- `Unity / Coroutines & Time`
- `Unity / Physics`
- `Unity / Math`
- `Unity / Transform & Rotation`
- `Unity / Input`
- `Unity / UI & TMP`
- `Unity / Events & Architecture`
- `Unity / General C# Utilities`

Türkçe karşılıklar:

- `Çekirdek / Temel`
- `Günlük Verimlilik`
- `Git / Sürüm Kontrolü`
- `Unity / Yaşam Döngüsü`
- `Unity / Debug ve Loglama`
- `Unity / Özellikler ve Serileştirme`
- `Unity / Bileşenler ve GameObject`
- `Unity / Coroutine ve Zaman`
- `Unity / Fizik`
- `Unity / Matematik`
- `Unity / Transform ve Rotasyon`
- `Unity / Input`
- `Unity / UI ve TMP`
- `Unity / Olaylar ve Mimari`
- `Unity / Genel C# Yardımcıları`

### Core Essentials Örnekleri

- `:date`
- `:time`
- `:datetime`
- `:uuid`
- `:clip`
- `:sig`

### Unity Trigger Kuralı

- Unity snippet'leri `U` ile başlar.
- Örnek: `Ulog`, `Ulogw`, `Uloge`.
- Unity paketlerinde app filter genelde `unity.exe`, `rider64.exe`, `rider.exe`, `code.exe` gibi süreçleri hedefler.

---

## 10. Dashboard & Stats Panel

Ana pencere içindeki üçüncü paneldir.

### Başlık

- `Dashboard & Stats`

### Stat Cards

Üstte üç metrik kartı bulunur:

1. `Total Pastes`
2. `Time Saved`
3. `Chars Copied`

Görünüm:

- Büyük accent renkli sayı.
- Altında uppercase küçük label.
- Kart border'ı hover durumunda accent'e yaklaşır.

Örnek değerler:

- `77`
- `3m 51s`
- `3.2k`

### Most Used Snippets

Başlık:

- `🔥 Most Used Snippets`

İçerik:

- En çok kullanılan snippet'ler liste halinde render edilir.

### 7-Day Activity

Başlık:

- Monitoring ikonu
- `7-Day Activity`

İçerik:

- Son 7 gün için bar chart görünümü.
- Bar'lar kart içinde alt hizalıdır.

### Metrics Breakdown

Başlık:

- Pie chart ikonu
- `Metrics Breakdown`

Satırlar:

- `Text Snippets`
- `Code Snippets`
- `URLs`
- `Passwords`

Her satırda:

- Label
- Progress bar
- Tema/accent renklerinden gelen dolgu rengi

---

## 11. Settings Panel

Ana pencere içindeki dördüncü paneldir. Uygulama davranış ve görünüm ayarları burada toplanır.

### Hotkey

Kart başlığı:

- `Global Shortcut`

İkon:

- Keyboard

İçerik:

- Kbd chip row
- Hotkey input
- Reset button
- Açıklama: `Summon QuickPaste from anywhere.`

Input:

- Readonly
- Placeholder: `Click & press keys to set…`

Reset:

- `↺`

### Preferences

#### Default Auto-Paste

- İkon: `⚡`
- Açıklama: `Automatically paste selected item.`
- Toggle switch

#### Start with Windows

- İkon: `🚀`
- Açıklama: `Launch QuickPaste on login.`
- Toggle switch

#### Welcome Screen

- İkon: `🪟`
- Açıklama: `The onboarding screen opens automatically only on first launch. You can reopen it from here anytime.`
- Buton: `Open`

Davranış:

- Welcome ekranını manuel açar.

### Text Tools

Kart:

- İkon: `text_snippet`
- Başlık: `Text Expansion`
- Açıklama: `Manage system-wide triggers, app filters, and dynamic variables.`
- Buton: `Open Text Expansion`

### Appearance

#### Dark Mode

- İkon: `🌙`
- Açıklama: `Switch to dark color theme.`
- Toggle switch

#### Accent Color

- İkon: `🎨`
- Açıklama: `Choose your preferred accent color.`
- Theme picker grid
- Custom color input

Custom açıklaması:

- `Pick any accent. QuickPaste will rebuild the full theme around it.`

#### Window Opacity

- İkon: `💧`
- Range slider
- Yüzde label
- Örnek: `100%`

### Clipboard

#### Clipboard History

- İkon: `📋`
- Açıklama: `Auto-capture everything you copy.`
- Toggle switch

#### Auto-Clean History

- İkon: `🧹`
- Açıklama: `Remove clipboard history after N days.`
- Dropdown

Seçenekler:

- `1 Day`
- `3 Days`
- `7 Days`
- `14 Days`
- `30 Days`
- `90 Days`
- `Never`

### Storage

Kart:

- İkon: folder
- Başlık: `Storage Path`
- Path label
- `Export Data`
- `Import Data`

### Danger Zone

Buton:

- `🗑 Clear All Data`

Görünüm:

- Kırmızı destructive action olarak tasarlanmıştır.

### About

İçerik:

- `QuickPaste v0.1.0`
- `© 2026 Emir Han Mamak · Mamak Studio`

---

## 12. Welcome Window

Welcome ekranı ayrı bir tam ekran onboarding penceresidir.

### Amaç

- İlk kurulumda default paket seçtirmek.
- Kullanıcıdan basit profil bilgisi almak.
- Text expansion defaultlarını kişiselleştirmek.
- Kullanıcı isterse kurulumu erteleyebilmek.

### Header

Sol taraf:

- Eyebrow: `Setup`
- Başlık: `Choose your default packs`
- Açıklama: `Pick the packs you want QuickPaste to install on first launch. You can keep it minimal or install everything at once.`

Sağ taraf:

- `Maybe Later`

Türkçe:

- Başlık: `Varsayılan paketleri seçin`
- Açıklama: `QuickPaste ilk açılışta hangi paketleri kuracağını bilsin. İsterseniz minimal, isterseniz tam kurulum yapabilirsiniz.`
- Buton: `Sonra`

### Sol Kolon: Your Profile

Kart başlığı:

- `Your Profile`
- Türkçe: `Profil Bilgileri`

Alanlar:

- Name
- Role
- Stack

Placeholder'lar:

- `Can`
- `Unity Developer`
- `Unity, Rider, VS Code`

### Sol Kolon: Selected Packs

Kart başlığı:

- `Selected Packs`

Summary:

- `0 packs · 0 snippets`

Butonlar:

- `Select All`
- `Clear Selection`

Türkçe:

- `Tümünü Seç`
- `Seçimi Temizle`

### Sol Kolon: Dynamic Variables

Chip'ler:

- `{{date}}`
- `{{time}}`
- `{{datetime}}`
- `{{clipboard}}`
- `{{uuid}}`
- `{{random:1-100}}`

### Sağ Kolon: Available Packs

Başlık:

- `Available Packs`

Açıklama:

- `Core essentials, productivity packs, and Unity Game Dev packs.`

Paket kartları:

- Paket adı
- Paket açıklaması
- Checkbox
- Paket id
- Kurulu/toplam snippet sayısı

Alt alan:

- Açıklama: `You can revisit this later from Settings.`
- Buton: `Install Selected Defaults`

Türkçe:

- `Seçili Varsayılanları Kur`

### Davranış

- İlk açılışta otomatik açılır.
- Kullanıcı `Maybe Later` derse normal uygulama başlar.
- Kullanıcı paket seçip kurarsa default expansion'lar eklenir.
- Onboarding tamamlandıktan sonra otomatik tekrar açılmaz.
- Settings üzerinden tekrar açılabilir.

---

## 13. Suggestions Popup

Text Expansion autocomplete penceresidir.

### Amaç

Kullanıcı herhangi bir uygulamada trigger yazarken yakın eşleşmeleri küçük popup içinde göstermek.

Örnek:

- Kullanıcı `:ul` yazar.
- Sistem `Ulog`, `Ulogw`, `Uloge` gibi uygun sonuçları gösterebilir.

### Görünüm

- Küçük rounded pencere.
- Koyu gradient shell.
- Border ve shadow vardır.
- Always-on-top çalışır.

### Header

- Eyebrow: `QuickPaste`
- Başlık: `Suggestions`
- Filter input

Input placeholder:

- `Filter suggestions...`

### Query Row

- Label: `Query:`
- Yanında aktif query değeri.

### Suggestion List

Liste item'ları JS tarafından render edilir.

Item içinde:

- Trigger
- Replacement preview
- Description
- Select/click aksiyonu

### Footer

- `Click a suggestion to expand it in the active app.`

### Davranış

- Popup trigger yazılan uygulamanın yakınında çıkar.
- Kullanıcı öneriye tıklayınca expansion aktif uygulamaya uygulanır.
- Hedef pencere focus'u restore edilmeye çalışılır.

---

## 14. Launcher Window

Launcher ayrı bir pencere olarak tanımlıdır ancak ana arayüzün launcher-mode varyantı gibi çalışır.

### Amaç

- QuickPaste'i hızlı çağırma.
- Snippet arama ve seçme.
- Hızlı paste deneyimi.

### Pencere Özellikleri

- Boyut: `680x520`
- Resizable değildir.
- Always-on-top çalışır.
- Transparent yapıdadır.
- Taskbar'da görünmez.

### Launcher Mode Farkları

- Bazı header butonları gizlenir.
- Settings ve ağır paneller yerine hızlı snippet seçimi ön plandadır.
- Blur davranışı ana pencereden farklıdır.
- Background window ile etkileşim için özel davranış bulunur.

### Tasarım Notu

Launcher, ana uygulamanın compact picker versiyonu gibi tasarlanmalıdır. Burada amaç yönetim değil, hızlı seçimdir.

---

## 15. Eski Text Expansion Onboarding Overlay

`index.html` içinde `textExpansionOnboardingOverlay` adında eski/embedded onboarding markup'ı hâlâ bulunur.

### İçerik

- Setup header
- Maybe Later
- Profile kartı
- Selected Packs kartı
- Available Packs kartı
- Install Selected Defaults

### Tasarım Notu

Yeni yapı ayrı `welcome.html` penceresine taşındığı için bu overlay legacy kalmış olabilir. Tasarım ve temizlik aşamasında bu alanın gerçekten kullanılıp kullanılmadığı kontrol edilmelidir.

---

## 16. Tema ve Görsel Dil

Projede tema sistemi CSS variable/token mantığına taşınmış durumdadır.

### Ana Token'lar

- `--qp-bg`
- `--qp-surface`
- `--qp-surface-2`
- `--qp-border`
- `--qp-text`
- `--qp-muted`
- `--qp-primary`
- `--qp-primary-contrast`
- `--qp-shadow`
- `--qp-success`
- `--qp-info`
- `--qp-warning`

### Mevcut Görsel Karakter

- Dark mode ağırlıklı.
- Koyu kartlar.
- Rounded corner yoğun.
- Accent renk çoğunlukla mavi.
- Header sade ve ikon odaklı.
- Kartlar border ve hover state ile ayrılıyor.
- Dialog ve popup'larda overlay/backdrop kullanılıyor.
- Floating add button ana aksiyon olarak güçlü görünüyor.

### Tasarımda Korunması Gerekenler

- Accent color değişince tüm primary butonlar, active state'ler, border'lar ve grafikler uyumlu değişmeli.
- Dark/light mode aynı component mantığını korumalı.
- Inline hardcoded renkler mümkün olduğunca tema token'larına bağlanmalı.

---

## 17. Tasarım İçin Component Listesi

Yeni tasarım dosyasında ayrı ayrı component olarak ele alınması önerilen parçalar:

1. Main Shell
2. Header Navigation
3. Footer
4. Floating Add Button
5. Search Input
6. Category Filter
7. Sort Select
8. Toolbar Button
9. Bulk Action Bar
10. Snippet Card
11. Secret Snippet Card
12. Snippet Empty State
13. Context Menu
14. Transform Submenu
15. Add/Edit Snippet Dialog
16. Placeholder Modal
17. Quick Look Overlay
18. Command Palette
19. Toast
20. Text Expansion Header
21. Text Expansion Search Toolbar
22. Text Expansion Snippet Card
23. Text Expansion Form
24. App Filter Selector
25. Dynamic Variable Chips
26. Default Pack Card
27. Dashboard Stat Card
28. Dashboard Chart Card
29. Settings Card
30. Toggle Switch
31. Theme Picker
32. Welcome Profile Card
33. Welcome Pack Card
34. Suggestions Popup Item
35. Launcher Compact List

---

## 18. Geliştirilebilir Tasarım Alanları

Bu bölüm, mevcut ekranların daha profesyonel ve tutarlı hale getirilebileceği yerleri listeler.

### Header Navigation

Mevcut durumda header ikonları işlevsel ama görsel hiyerarşi karışabilir. Özellikle Pin butonu diğerlerinden daha büyük ve daha ağır görünüyor.

İyileştirme önerileri:

- Ana sayfa butonu her zaman en solda kalmalı.
- Aktif panel butonu net şekilde selected state almalı.
- Pin butonu action olarak nav butonlarından görsel olarak ayrılabilir.
- Close butonu en sağda ve destructive/secondary bir tonla gösterilebilir.
- Tooltip metinleri Türkçe/İngilizce lokalizasyonla tutarlı olmalı.

### Ana Sayfa Search Alanı

Mevcut search width yüzde 50 yapılmış. Bu kompakt görünüm istenmiş ama küçük ekranlarda category filter ile çakışma riski var.

İyileştirme önerileri:

- Geniş ekranda search ve category yan yana.
- Dar ekranda search full width, filter ikinci satır.
- Toolbar butonları chip/button group gibi tasarlanabilir.
- `From Clipboard` ve `Select` butonları yarım boy kompakt olarak korunmalı.

### Snippet Card

Snippet kartı çok zengin bilgi taşıyor. Bu güçlü ama kalabalık olabilir.

İyileştirme önerileri:

- Üst satırda yalnızca başlık, pin, shortcut ve trigger gösterilebilir.
- İkincil rozetler hover/expanded state'e taşınabilir.
- Secret state daha güvenli ve net bir görsel dille ayrılabilir.
- Copy ve Quick Look aksiyonları hover'da görünür yapılabilir.
- Category ve tag chip'leri daha küçük ve hizalı hale getirilebilir.

### Text Expansion Panel

Bu ekran profesyonel bir yönetim ekranı gibi çalışıyor ama dar pencerede iki kolon sıkışabilir.

İyileştirme önerileri:

- Desktop genişlikte iki kolon.
- Dar genişlikte önce liste, sonra form.
- Form sticky action bar kullanabilir.
- Trigger conflict warning daha görünür ama panik yaratmayan bir tasarıma alınabilir.
- Dynamic variables alanı küçük docs/help drawer gibi tasarlanabilir.

### Default Packs

Paket listesi hem onboarding'de hem Text Expansion panelinde kullanılıyor.

İyileştirme önerileri:

- Paketler kategori gruplarına ayrılabilir: Core, Daily, Git, Unity.
- Unity paketleri ayrı accent veya icon set ile ayrılabilir.
- Her pakette snippet sayısı daha belirgin olabilir.
- `Install Pack` ve `Install Item` butonları installed state'te daha sade görünmeli.

### Dashboard

Dashboard mevcut haliyle işlevsel ama görsel olarak daha etkileyici olabilir.

İyileştirme önerileri:

- Üç stat card daha büyük ve farklı yoğunlukta tasarlanabilir.
- 7-day activity gerçek mini chart gibi geliştirilebilir.
- Most Used Snippets listesinde snippet kartlarının mini versiyonları kullanılabilir.
- Metrics Breakdown renkleri theme token'larından daha tutarlı üretilebilir.

### Settings

Settings ekranı çok sayıda karttan oluşuyor. Şu an her şey dikey listede.

İyileştirme önerileri:

- Bölümler net separator ve icon başlıklarla ayrılmalı.
- Danger Zone daha aşağıda ve daha sakin ama net destructive görünmeli.
- Appearance bölümü tasarım açısından en önemli bölüm olduğu için daha görsel olabilir.
- Welcome Screen ve Text Expansion butonları aynı pattern'e bağlanabilir.

### Welcome Screen

Welcome ekranı ayrı ve tam ekran olduğu için daha özel bir deneyim olabilir.

İyileştirme önerileri:

- Sol kolon profil ve özet, sağ kolon paket seçimi olarak korunmalı.
- Paket kartları daha görsel hale getirilebilir.
- Unity paketleri için Game Dev hissi veren özel ikonlar kullanılabilir.
- `Maybe Later` daha sakin secondary action olmalı.
- `Install Selected Defaults` ana CTA olarak güçlü kalmalı.

### Suggestions Popup

Popup küçük olduğu için çok dikkatli sadeleşmeli.

İyileştirme önerileri:

- Filter input opsiyonel olarak daha küçük yapılabilir.
- En iyi eşleşme ilk sırada daha belirgin gösterilebilir.
- Trigger ve replacement preview tek satırda okunabilir olmalı.
- Klavye ile seçim state'i görsel olarak net olmalı.
- Popup, yazılan caret'in biraz altında ama ekran dışına taşmadan konumlanmalı.

### Launcher

Launcher ayrı bir deneyim gibi tasarlanmalı.

İyileştirme önerileri:

- Ana uygulama header'ı yerine minimal search-first layout kullanılabilir.
- Snippet kartları daha kompakt olmalı.
- Sadece en kritik aksiyonlar görünmeli: search, paste, copy, close.
- Settings/Dashboard gibi yönetim aksiyonları launcher'da geri planda kalmalı.

---

## 19. Tasarım Öncelik Sırası

Yeni tasarım yapılacaksa önerilen sıra:

1. Main Shell, Header ve Footer
2. Ana Sayfa ve Snippet Card
3. Add/Edit Snippet Dialog
4. Text Expansion Panel
5. Welcome Window
6. Suggestions Popup
7. Settings
8. Dashboard
9. Command Palette ve Quick Look
10. Toast, Context Menu ve küçük overlay'ler

Bu sıra, uygulamanın en sık kullanılan ve en çok kullanıcı algısı oluşturan alanlarından başlayarak ilerler.

