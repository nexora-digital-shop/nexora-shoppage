/* NEXORA Seller Portal localization — no paid translation API required. */
(() => {
  "use strict";

  const locales = ["id", "en", "ko", "ja"];
  const dictionaries = {
    id: {},
    en: {
      "NEXORA Seller Portal": "NEXORA Seller Portal",
      "Akun": "Account",
      "← Kembali ke marketplace": "← Back to marketplace",
      "Kelola tokomu. Jangkau lebih luas.": "Manage your store. Reach more customers.",
      "Satu portal untuk penjual online dan jastiper. Mulai dari pendaftaran toko, katalog, sampai pengelolaan pesanan.": "One portal for online sellers and personal shoppers. Start with store registration, catalog setup, and order management.",
      "✓ Satu akun untuk seller dan jastiper": "✓ One account for sellers and personal shoppers",
      "✓ Ready stock, preorder, dan request item": "✓ Ready stock, preorders, and item requests",
      "✓ Toko baru berstatus draft sampai siap ditinjau": "✓ New stores stay in draft until reviewed",
      "✓ Dirancang untuk ponsel dan desktop": "✓ Designed for phones and desktop",
      "Portal terhubung ke Supabase Auth. Gunakan akun uji terlebih dahulu. Jangan pernah membagikan kata sandi atau kunci rahasia.": "This portal connects to Supabase Auth. Use a test account first. Never share passwords or secret keys.",
      "Masuk": "Log in",
      "Daftar akun": "Create account",
      "Selamat datang kembali": "Welcome back",
      "Masuk ke akun penjual NEXORA.": "Log in to your NEXORA seller account.",
      "Email": "Email",
      "Kata sandi": "Password",
      "Buat akun NEXORA": "Create a NEXORA account",
      "Buat satu akun untuk berbelanja atau membuka toko sebagai penjual/jastiper.": "Create one account to shop or open a store as a seller/personal shopper.",
      "Nama tampilan": "Display name",
      "Satu akun dapat digunakan untuk berbelanja sekaligus berjualan. Buat toko setelah berhasil masuk.": "One account can be used for both shopping and selling. Create a store after logging in.",
      "Buat kata sandi": "Create password",
      "Buat akun": "Create account",
      "Memeriksa koneksi autentikasi…": "Checking authentication connection…",
      "Keluar": "Log out",
      "Lihat pratinjau pembukaan toko": "Preview store setup",
      "Lihat pratinjau dashboard": "Preview dashboard",
      "Rancangan pembukaan toko": "Store setup draft",
      "Buat satu toko untuk akun yang sedang login.": "Create one store for the signed-in account.",
      "Toko baru otomatis berstatus draft.": "New stores automatically start in draft status.",
      "Nama toko": "Store name",
      "Alamat toko (slug)": "Store address (slug)",
      "Negara": "Country",
      "Indonesia": "Indonesia",
      "Malaysia": "Malaysia",
      "Singapura": "Singapore",
      "Korea Selatan": "South Korea",
      "Jepang": "Japan",
      "Mata uang": "Currency",
      "Deskripsi toko": "Store description",
      "Buat toko": "Create store",
      "Kembali": "Back",
      "Pemilik toko ditentukan oleh sesi login dan fungsi database yang aman.": "Store ownership is determined by the login session and a secure database function.",
      "Seller workspace": "Seller workspace",
      "Ringkasan toko": "Store overview",
      "Ringkasan dibaca dari database untuk akun yang sedang login.": "This overview is read from the database for the signed-in account.",
      "AREA PENJUAL": "SELLER AREA",
      "Data toko belum dimuat.": "Store data has not loaded yet.",
      "Produk tersimpan": "Saved products",
      "Pesanan tersimpan": "Saved orders",
      "Status toko": "Store status",
      "Buka formulir toko": "Open store form",
      "📦 Kelola produk": "📦 Manage products",
      "Fitur tambah, edit, dan hapus produk belum diaktifkan. Angka di atas hanya menghitung data yang tersimpan.": "Adding, editing, and deleting products are not enabled yet. The figures above only count saved records.",
      "🧾 Pesanan": "🧾 Orders",
      "Ringkasan membaca jumlah pesanan; alur checkout dan pengelolaan pesanan belum aktif.": "The overview reads the order count; checkout and order management are not active yet.",
      "🏪 Profil toko": "🏪 Store profile",
      "Informasi toko ditampilkan dari database. Pengeditan profil belum tersedia.": "Store information is displayed from the database. Profile editing is not available yet.",
      "⚙️ Pengaturan": "⚙️ Settings",
      "Pengaturan akun, keamanan, dan paket masih dalam pengembangan.": "Account, security, and plan settings are still in development.",
      "Muat ulang data": "Refresh data",
      "Kembali ke akun": "Back to account",
      "NEXORA · Technology Without Borders · Versi awal integrasi autentikasi dan pembukaan toko. Fitur pesanan dan pembayaran belum aktif.": "NEXORA · Technology Without Borders · Initial authentication and store setup integration. Orders and payments are not active yet.",
      "nama@email.com": "name@email.com",
      "Kata sandi akun": "Account password",
      "Nama kamu": "Your name"
    },
    ko: {
      "NEXORA Seller Portal": "NEXORA 판매자 포털",
      "Akun": "계정",
      "← Kembali ke marketplace": "← 마켓플레이스로 돌아가기",
      "Kelola tokomu. Jangkau lebih luas.": "스토어를 관리하고 더 많은 고객에게 다가가세요.",
      "Satu portal untuk penjual online dan jastiper. Mulai dari pendaftaran toko, katalog, sampai pengelolaan pesanan.": "온라인 판매자와 구매대행자를 위한 포털입니다. 스토어 등록, 상품 카탈로그, 주문 관리부터 시작하세요.",
      "✓ Satu akun untuk seller dan jastiper": "✓ 판매자와 구매대행자 모두 하나의 계정 사용",
      "✓ Ready stock, preorder, dan request item": "✓ 재고 상품, 예약 주문 및 상품 요청",
      "✓ Toko baru berstatus draft sampai siap ditinjau": "✓ 신규 스토어는 검토 전까지 임시 저장 상태",
      "✓ Dirancang untuk ponsel dan desktop": "✓ 모바일과 데스크톱에 최적화",
      "Portal terhubung ke Supabase Auth. Gunakan akun uji terlebih dahulu. Jangan pernah membagikan kata sandi atau kunci rahasia.": "이 포털은 Supabase Auth에 연결됩니다. 먼저 테스트 계정을 사용하세요. 비밀번호나 비밀 키를 공유하지 마세요.",
      "Masuk": "로그인",
      "Daftar akun": "계정 만들기",
      "Selamat datang kembali": "다시 오신 것을 환영합니다",
      "Masuk ke akun penjual NEXORA.": "NEXORA 판매자 계정에 로그인하세요.",
      "Email": "이메일",
      "Kata sandi": "비밀번호",
      "Buat akun NEXORA": "NEXORA 계정 만들기",
      "Buat satu akun untuk berbelanja atau membuka toko sebagai penjual/jastiper.": "하나의 계정으로 쇼핑하거나 판매자/구매대행자로 스토어를 개설할 수 있습니다.",
      "Nama tampilan": "표시 이름",
      "Satu akun dapat digunakan untuk berbelanja sekaligus berjualan. Buat toko setelah berhasil masuk.": "하나의 계정으로 구매와 판매를 모두 이용할 수 있습니다. 로그인 후 스토어를 만드세요.",
      "Buat kata sandi": "비밀번호 만들기",
      "Buat akun": "계정 만들기",
      "Memeriksa koneksi autentikasi…": "인증 연결 확인 중…",
      "Keluar": "로그아웃",
      "Lihat pratinjau pembukaan toko": "스토어 개설 미리보기",
      "Lihat pratinjau dashboard": "대시보드 미리보기",
      "Rancangan pembukaan toko": "스토어 개설 초안",
      "Buat satu toko untuk akun yang sedang login.": "현재 로그인한 계정으로 스토어 하나를 만드세요.",
      "Toko baru otomatis berstatus draft.": "새 스토어는 자동으로 임시 저장 상태가 됩니다.",
      "Nama toko": "스토어 이름",
      "Alamat toko (slug)": "스토어 주소(slug)",
      "Negara": "국가",
      "Indonesia": "인도네시아",
      "Malaysia": "말레이시아",
      "Singapura": "싱가포르",
      "Korea Selatan": "대한민국",
      "Jepang": "일본",
      "Mata uang": "통화",
      "Deskripsi toko": "스토어 설명",
      "Buat toko": "스토어 만들기",
      "Kembali": "뒤로",
      "Pemilik toko ditentukan oleh sesi login dan fungsi database yang aman.": "스토어 소유자는 로그인 세션과 보안 데이터베이스 함수로 결정됩니다.",
      "Seller workspace": "판매자 작업 공간",
      "Ringkasan toko": "스토어 요약",
      "Ringkasan dibaca dari database untuk akun yang sedang login.": "요약 정보는 로그인한 계정의 데이터베이스에서 불러옵니다.",
      "AREA PENJUAL": "판매자 영역",
      "Data toko belum dimuat.": "스토어 데이터를 아직 불러오지 못했습니다.",
      "Produk tersimpan": "저장된 상품",
      "Pesanan tersimpan": "저장된 주문",
      "Status toko": "스토어 상태",
      "Buka formulir toko": "스토어 양식 열기",
      "📦 Kelola produk": "📦 상품 관리",
      "Fitur tambah, edit, dan hapus produk belum diaktifkan. Angka di atas hanya menghitung data yang tersimpan.": "상품 추가, 수정, 삭제 기능은 아직 활성화되지 않았습니다. 위 숫자는 저장된 데이터만 집계합니다.",
      "🧾 Pesanan": "🧾 주문",
      "Ringkasan membaca jumlah pesanan; alur checkout dan pengelolaan pesanan belum aktif.": "요약에는 주문 수만 표시됩니다. 결제 및 주문 관리 기능은 아직 활성화되지 않았습니다.",
      "🏪 Profil toko": "🏪 스토어 프로필",
      "Informasi toko ditampilkan dari database. Pengeditan profil belum tersedia.": "스토어 정보는 데이터베이스에서 표시됩니다. 프로필 수정은 아직 지원되지 않습니다.",
      "⚙️ Pengaturan": "⚙️ 설정",
      "Pengaturan akun, keamanan, dan paket masih dalam pengembangan.": "계정, 보안 및 요금제 설정은 개발 중입니다.",
      "Muat ulang data": "데이터 새로고침",
      "Kembali ke akun": "계정으로 돌아가기",
      "NEXORA · Technology Without Borders · Versi awal integrasi autentikasi dan pembukaan toko. Fitur pesanan dan pembayaran belum aktif.": "NEXORA · Technology Without Borders · 인증 및 스토어 개설 초기 통합 버전입니다. 주문 및 결제 기능은 아직 활성화되지 않았습니다.",
      "nama@email.com": "name@email.com",
      "Kata sandi akun": "계정 비밀번호",
      "Nama kamu": "이름"
    },
    ja: {
      "NEXORA Seller Portal": "NEXORA 出店者ポータル",
      "Akun": "アカウント",
      "← Kembali ke marketplace": "← マーケットプレイスに戻る",
      "Kelola tokomu. Jangkau lebih luas.": "ショップを管理して、より多くのお客様へ。",
      "Satu portal untuk penjual online dan jastiper. Mulai dari pendaftaran toko, katalog, sampai pengelolaan pesanan.": "オンライン販売者と買い物代行者のためのポータルです。ショップ登録、商品カタログ、注文管理から始めましょう。",
      "✓ Satu akun untuk seller dan jastiper": "✓ 販売者と買い物代行者が1つのアカウントを共有",
      "✓ Ready stock, preorder, dan request item": "✓ 在庫商品、予約注文、商品リクエスト",
      "✓ Toko baru berstatus draft sampai siap ditinjau": "✓ 新しいショップは審査まで下書き状態",
      "✓ Dirancang untuk ponsel dan desktop": "✓ スマートフォンとデスクトップに対応",
      "Portal terhubung ke Supabase Auth. Gunakan akun uji terlebih dahulu. Jangan pernah membagikan kata sandi atau kunci rahasia.": "このポータルはSupabase Authに接続されています。まずテストアカウントを使用してください。パスワードや秘密鍵を共有しないでください。",
      "Masuk": "ログイン",
      "Daftar akun": "アカウント登録",
      "Selamat datang kembali": "おかえりなさい",
      "Masuk ke akun penjual NEXORA.": "NEXORAの販売者アカウントにログインしてください。",
      "Email": "メールアドレス",
      "Kata sandi": "パスワード",
      "Buat akun NEXORA": "NEXORAアカウントを作成",
      "Buat satu akun untuk berbelanja atau membuka toko sebagai penjual/jastiper.": "1つのアカウントで買い物をしたり、販売者・買い物代行者としてショップを開設したりできます。",
      "Nama tampilan": "表示名",
      "Satu akun dapat digunakan untuk berbelanja sekaligus berjualan. Buat toko setelah berhasil masuk.": "1つのアカウントで購入と販売の両方を利用できます。ログイン後にショップを作成してください。",
      "Buat kata sandi": "パスワードを作成",
      "Buat akun": "アカウントを作成",
      "Memeriksa koneksi autentikasi…": "認証接続を確認しています…",
      "Keluar": "ログアウト",
      "Lihat pratinjau pembukaan toko": "ショップ開設をプレビュー",
      "Lihat pratinjau dashboard": "ダッシュボードをプレビュー",
      "Rancangan pembukaan toko": "ショップ開設の下書き",
      "Buat satu toko untuk akun yang sedang login.": "現在ログイン中のアカウントでショップを1つ作成します。",
      "Toko baru otomatis berstatus draft.": "新しいショップは自動的に下書き状態になります。",
      "Nama toko": "ショップ名",
      "Alamat toko (slug)": "ショップURL（スラッグ）",
      "Negara": "国",
      "Indonesia": "インドネシア",
      "Malaysia": "マレーシア",
      "Singapura": "シンガポール",
      "Korea Selatan": "韓国",
      "Jepang": "日本",
      "Mata uang": "通貨",
      "Deskripsi toko": "ショップの説明",
      "Buat toko": "ショップを作成",
      "Kembali": "戻る",
      "Pemilik toko ditentukan oleh sesi login dan fungsi database yang aman.": "ショップの所有者はログインセッションと安全なデータベース関数によって決まります。",
      "Seller workspace": "販売者ワークスペース",
      "Ringkasan toko": "ショップ概要",
      "Ringkasan dibaca dari database untuk akun yang sedang login.": "概要はログイン中のアカウントのデータベースから読み込まれます。",
      "AREA PENJUAL": "販売者エリア",
      "Data toko belum dimuat.": "ショップデータはまだ読み込まれていません。",
      "Produk tersimpan": "保存済み商品",
      "Pesanan tersimpan": "保存済み注文",
      "Status toko": "ショップの状態",
      "Buka formulir toko": "ショップフォームを開く",
      "📦 Kelola produk": "📦 商品管理",
      "Fitur tambah, edit, dan hapus produk belum diaktifkan. Angka di atas hanya menghitung data yang tersimpan.": "商品追加・編集・削除機能はまだ有効ではありません。上の数値は保存済みデータのみを集計しています。",
      "🧾 Pesanan": "🧾 注文",
      "Ringkasan membaca jumlah pesanan; alur checkout dan pengelolaan pesanan belum aktif.": "概要には注文数のみ表示されます。チェックアウトと注文管理はまだ有効ではありません。",
      "🏪 Profil toko": "🏪 ショッププロフィール",
      "Informasi toko ditampilkan dari database. Pengeditan profil belum tersedia.": "ショップ情報はデータベースから表示されます。プロフィール編集はまだ利用できません。",
      "⚙️ Pengaturan": "⚙️ 設定",
      "Pengaturan akun, keamanan, dan paket masih dalam pengembangan.": "アカウント、セキュリティ、プラン設定は開発中です。",
      "Muat ulang data": "データを再読み込み",
      "Kembali ke akun": "アカウントに戻る",
      "NEXORA · Technology Without Borders · Versi awal integrasi autentikasi dan pembukaan toko. Fitur pesanan dan pembayaran belum aktif.": "NEXORA · Technology Without Borders · 認証とショップ開設の初期統合版です。注文と決済機能はまだ有効ではありません。",
      "nama@email.com": "name@email.com",
      "Kata sandi akun": "アカウントのパスワード",
      "Nama kamu": "お名前"
    }
  };

  const messagePrefixes = {
    en: {
      "Data toko tidak dapat dimuat: ": "Could not load store data: ",
      "Gagal memeriksa sesi: ": "Could not check session: ",
      "Login gagal: ": "Login failed: ",
      "Pendaftaran gagal: ": "Registration failed: ",
      "Toko belum dibuat: ": "Store was not created: ",
      "Berhasil! Toko dibuat dengan ID ": "Success! Store created with ID ",
      "Login sebagai: ": "Logged in as: ",
      "Permintaan toko gagal: ": "Store request failed: ",
      "Gagal keluar: ": "Could not log out: "
    },
    ko: {
      "Data toko tidak dapat dimuat: ": "스토어 데이터를 불러오지 못했습니다: ",
      "Gagal memeriksa sesi: ": "세션을 확인하지 못했습니다: ",
      "Login gagal: ": "로그인 실패: ",
      "Pendaftaran gagal: ": "가입 실패: ",
      "Toko belum dibuat: ": "스토어를 만들지 못했습니다: ",
      "Berhasil! Toko dibuat dengan ID ": "완료! 스토어 ID: ",
      "Login sebagai: ": "로그인 계정: ",
      "Permintaan toko gagal: ": "스토어 요청 실패: ",
      "Gagal keluar: ": "로그아웃 실패: "
    },
    ja: {
      "Data toko tidak dapat dimuat: ": "ショップデータを読み込めませんでした: ",
      "Gagal memeriksa sesi: ": "セッションを確認できませんでした: ",
      "Login gagal: ": "ログインに失敗しました: ",
      "Pendaftaran gagal: ": "登録に失敗しました: ",
      "Toko belum dibuat: ": "ショップを作成できませんでした: ",
      "Berhasil! Toko dibuat dengan ID ": "完了しました。ショップID: ",
      "Login sebagai: ": "ログイン中: ",
      "Permintaan toko gagal: ": "ショップのリクエストに失敗しました: ",
      "Gagal keluar: ": "ログアウトに失敗しました: "
    }
  };

  const fixedMessages = {
    en: {
      "Sesi login tidak ditemukan. Silakan masuk kembali.": "Login session not found. Please log in again.",
      "Memuat data toko dari Supabase…": "Loading store data from Supabase…",
      "Belum ada toko untuk akun ini. Buat toko terlebih dahulu untuk melanjutkan.": "This account has no store yet. Create a store to continue.",
      "Koneksi database gagal. Periksa koneksi lalu pilih Muat ulang data.": "Database connection failed. Check your connection and select Refresh data.",
      "Akun berhasil terhubung. Kamu dapat membuka toko.": "Account connected. You can create a store.",
      "Belum login. Masuk dengan akun yang sudah dibuat, atau daftar akun baru.": "Not logged in. Use an existing account or create a new one.",
      "Koneksi autentikasi gagal. Periksa internet lalu muat ulang halaman.": "Authentication connection failed. Check your internet connection and reload the page.",
      "Isi email dan kata sandi terlebih dahulu.": "Enter your email and password first.",
      "Sedang masuk…": "Logging in…",
      "Login berhasil. Akun siap digunakan untuk pengujian.": "Login successful. The account is ready for testing.",
      "Login tidak dapat diselesaikan karena koneksi bermasalah. Coba lagi.": "Login could not be completed because of a connection problem. Try again.",
      "Isi nama (minimal 2 karakter), email, dan kata sandi minimal 8 karakter.": "Enter a name (at least 2 characters), an email, and a password of at least 8 characters.",
      "Sedang membuat akun…": "Creating account…",
      "Akun berhasil dibuat dan langsung login.": "Account created and logged in.",
      "Akun dibuat. Periksa email untuk konfirmasi, lalu kembali ke tab Masuk. Tautan konfirmasi perlu URL situs yang sudah dikonfigurasi setelah portal dipublikasikan.": "Account created. Check your email for confirmation, then return to the Log in tab. The confirmation link requires the site URL to be configured after the portal is published.",
      "Pendaftaran tidak dapat diselesaikan karena koneksi bermasalah. Coba lagi.": "Registration could not be completed because of a connection problem. Try again.",
      "Silakan login terlebih dahulu.": "Please log in first.",
      "Sesi login tidak ditemukan. Silakan login kembali.": "Login session not found. Please log in again.",
      "Nama toko harus 2–100 karakter.": "Store name must be 2–100 characters.",
      "Slug harus 3–50 karakter, huruf kecil, angka, atau tanda hubung; tidak boleh diawali/diakhiri tanda hubung.": "Slug must be 3–50 characters using lowercase letters, numbers, or hyphens; it cannot start or end with a hyphen.",
      "Mengirim permintaan ke database…": "Sending request to the database…",
      "Permintaan toko gagal karena koneksi bermasalah. Coba lagi.": "Store request failed because of a connection problem. Try again.",
      "Kamu sudah keluar dari akun.": "You have logged out.",
      "Keluar gagal karena koneksi bermasalah. Coba lagi.": "Logout failed because of a connection problem. Try again."
    },
    ko: {
      "Sesi login tidak ditemukan. Silakan masuk kembali.": "로그인 세션을 찾을 수 없습니다. 다시 로그인하세요.",
      "Memuat data toko dari Supabase…": "Supabase에서 스토어 데이터를 불러오는 중…",
      "Belum ada toko untuk akun ini. Buat toko terlebih dahulu untuk melanjutkan.": "이 계정에는 아직 스토어가 없습니다. 계속하려면 먼저 스토어를 만드세요.",
      "Koneksi database gagal. Periksa koneksi lalu pilih Muat ulang data.": "데이터베이스 연결에 실패했습니다. 연결을 확인한 후 데이터를 새로고침하세요.",
      "Akun berhasil terhubung. Kamu dapat membuka toko.": "계정이 연결되었습니다. 스토어를 만들 수 있습니다.",
      "Belum login. Masuk dengan akun yang sudah dibuat, atau daftar akun baru.": "로그인하지 않았습니다. 기존 계정으로 로그인하거나 새 계정을 만드세요.",
      "Koneksi autentikasi gagal. Periksa internet lalu muat ulang halaman.": "인증 연결에 실패했습니다. 인터넷 연결을 확인하고 페이지를 새로고침하세요.",
      "Isi email dan kata sandi terlebih dahulu.": "이메일과 비밀번호를 먼저 입력하세요.",
      "Sedang masuk…": "로그인 중…",
      "Login berhasil. Akun siap digunakan untuk pengujian.": "로그인에 성공했습니다. 테스트 계정을 사용할 수 있습니다.",
      "Login tidak dapat diselesaikan karena koneksi bermasalah. Coba lagi.": "연결 문제로 로그인할 수 없습니다. 다시 시도하세요.",
      "Isi nama (minimal 2 karakter), email, dan kata sandi minimal 8 karakter.": "이름(2자 이상), 이메일, 비밀번호(8자 이상)를 입력하세요.",
      "Sedang membuat akun…": "계정을 만드는 중…",
      "Akun berhasil dibuat dan langsung login.": "계정이 생성되고 로그인되었습니다.",
      "Akun dibuat. Periksa email untuk konfirmasi, lalu kembali ke tab Masuk. Tautan konfirmasi perlu URL situs yang sudah dikonfigurasi setelah portal dipublikasikan.": "계정이 생성되었습니다. 이메일을 확인한 후 로그인 탭으로 돌아오세요. 확인 링크를 사용하려면 포털 게시 후 사이트 URL을 설정해야 합니다.",
      "Pendaftaran tidak dapat diselesaikan karena koneksi bermasalah. Coba lagi.": "연결 문제로 가입할 수 없습니다. 다시 시도하세요.",
      "Silakan login terlebih dahulu.": "먼저 로그인하세요.",
      "Sesi login tidak ditemukan. Silakan login kembali.": "로그인 세션을 찾을 수 없습니다. 다시 로그인하세요.",
      "Nama toko harus 2–100 karakter.": "스토어 이름은 2~100자여야 합니다.",
      "Slug harus 3–50 karakter, huruf kecil, angka, atau tanda hubung; tidak boleh diawali/diakhiri tanda hubung.": "슬러그는 소문자, 숫자, 하이픈으로 구성된 3~50자여야 하며 하이픈으로 시작하거나 끝날 수 없습니다.",
      "Mengirim permintaan ke database…": "데이터베이스에 요청을 보내는 중…",
      "Permintaan toko gagal karena koneksi bermasalah. Coba lagi.": "연결 문제로 스토어 요청에 실패했습니다. 다시 시도하세요.",
      "Kamu sudah keluar dari akun.": "로그아웃되었습니다.",
      "Keluar gagal karena koneksi bermasalah. Coba lagi.": "연결 문제로 로그아웃하지 못했습니다. 다시 시도하세요."
    },
    ja: {
      "Sesi login tidak ditemukan. Silakan masuk kembali.": "ログインセッションが見つかりません。もう一度ログインしてください。",
      "Memuat data toko dari Supabase…": "Supabaseからショップデータを読み込んでいます…",
      "Belum ada toko untuk akun ini. Buat toko terlebih dahulu untuk melanjutkan.": "このアカウントにはショップがありません。続行するにはショップを作成してください。",
      "Koneksi database gagal. Periksa koneksi lalu pilih Muat ulang data.": "データベースに接続できません。接続を確認して「データを再読み込み」を選択してください。",
      "Akun berhasil terhubung. Kamu dapat membuka toko.": "アカウントが接続されました。ショップを作成できます。",
      "Belum login. Masuk dengan akun yang sudah dibuat, atau daftar akun baru.": "ログインしていません。既存のアカウントでログインするか、新規登録してください。",
      "Koneksi autentikasi gagal. Periksa internet lalu muat ulang halaman.": "認証に接続できません。インターネット接続を確認してページを再読み込みしてください。",
      "Isi email dan kata sandi terlebih dahulu.": "メールアドレスとパスワードを入力してください。",
      "Sedang masuk…": "ログイン中…",
      "Login berhasil. Akun siap digunakan untuk pengujian.": "ログインしました。テスト用アカウントを使用できます。",
      "Login tidak dapat diselesaikan karena koneksi bermasalah. Coba lagi.": "接続の問題でログインできませんでした。もう一度お試しください。",
      "Isi nama (minimal 2 karakter), email, dan kata sandi minimal 8 karakter.": "名前（2文字以上）、メールアドレス、パスワード（8文字以上）を入力してください。",
      "Sedang membuat akun…": "アカウントを作成しています…",
      "Akun berhasil dibuat dan langsung login.": "アカウントが作成され、ログインしました。",
      "Akun dibuat. Periksa email untuk konfirmasi, lalu kembali ke tab Masuk. Tautan konfirmasi perlu URL situs yang sudah dikonfigurasi setelah portal dipublikasikan.": "アカウントを作成しました。メールを確認し、ログインタブに戻ってください。確認リンクを使用するには、ポータル公開後にサイトURLの設定が必要です。",
      "Pendaftaran tidak dapat diselesaikan karena koneksi bermasalah. Coba lagi.": "接続の問題で登録できませんでした。もう一度お試しください。",
      "Silakan login terlebih dahulu.": "先にログインしてください。",
      "Sesi login tidak ditemukan. Silakan login kembali.": "ログインセッションが見つかりません。もう一度ログインしてください。",
      "Nama toko harus 2–100 karakter.": "ショップ名は2～100文字で入力してください。",
      "Slug harus 3–50 karakter, huruf kecil, angka, atau tanda hubung; tidak boleh diawali/diakhiri tanda hubung.": "スラッグは小文字、数字、ハイフンを使った3～50文字で、ハイフンで始めたり終えたりできません。",
      "Mengirim permintaan ke database…": "データベースにリクエストを送信しています…",
      "Permintaan toko gagal karena koneksi bermasalah. Coba lagi.": "接続の問題でショップを作成できませんでした。もう一度お試しください。",
      "Kamu sudah keluar dari akun.": "ログアウトしました。",
      "Keluar gagal karena koneksi bermasalah. Coba lagi.": "接続の問題でログアウトできませんでした。もう一度お試しください。"
    }
  };

  const allMessages = {
    id: {},
    en: fixedMessages.en,
    ko: fixedMessages.ko,
    ja: fixedMessages.ja
  };

  const placeholderTranslations = {
    en: { "nama@email.com": "name@email.com", "Kata sandi akun": "Account password", "Nama kamu": "Your name" },
    ko: { "nama@email.com": "name@email.com", "Kata sandi akun": "계정 비밀번호", "Nama kamu": "이름" },
    ja: { "nama@email.com": "name@email.com", "Kata sandi akun": "アカウントのパスワード", "Nama kamu": "お名前" }
  };

  const textNodes = new WeakMap();
  let currentLocale = "id";
  let select;

  function translate(value) {
    if (currentLocale === "id" || typeof value !== "string") return value;
    const exact = allMessages[currentLocale]?.[value] || dictionaries[currentLocale]?.[value];
    if (exact) return exact;
    const successPrefix = "Berhasil! Toko dibuat dengan ID ";
    const successSuffix = " dan status awal draft.";
    if (value.startsWith(successPrefix) && value.endsWith(successSuffix)) {
      const storeId = value.slice(successPrefix.length, -successSuffix.length);
      const suffixes = {
        en: " and its initial status is draft.",
        ko: "이며 초기 상태는 임시 저장입니다.",
        ja: "で、初期状態は下書きです。"
      };
      return (messagePrefixes[currentLocale]?.[successPrefix] || successPrefix) + storeId + suffixes[currentLocale];
    }
    const prefixes = messagePrefixes[currentLocale] || {};
    for (const [prefix, translatedPrefix] of Object.entries(prefixes)) {
      if (value.startsWith(prefix)) return translatedPrefix + value.slice(prefix.length);
    }
    return value;
  }

  function setMessage(element, value) {
    if (!element) return;
    element.dataset.nexoraMessage = value;
    element.textContent = translate(value);
  }

  function applyLocale(locale) {
    currentLocale = locales.includes(locale) ? locale : "id";
    document.documentElement.lang = currentLocale;
    const titles = {
      id: "NEXORA Seller Portal",
      en: "NEXORA Seller Portal",
      ko: "NEXORA 판매자 포털",
      ja: "NEXORA 出店者ポータル"
    };
    document.title = titles[currentLocale];

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || ["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!textNodes.has(node)) textNodes.set(node, node.nodeValue);
      const original = textNodes.get(node);
      const leading = original.match(/^\s*/)?.[0] || "";
      const trailing = original.match(/\s*$/)?.[0] || "";
      const core = original.trim();
      node.nodeValue = core ? leading + translate(core) + trailing : original;
    }

    document.querySelectorAll("[data-nexora-message]").forEach(element => {
      element.textContent = translate(element.dataset.nexoraMessage);
    });

    document.querySelectorAll("input[placeholder],textarea[placeholder]").forEach(element => {
      if (!element.dataset.nexoraOriginalPlaceholder) element.dataset.nexoraOriginalPlaceholder = element.placeholder;
      const original = element.dataset.nexoraOriginalPlaceholder;
      element.placeholder = placeholderTranslations[currentLocale]?.[original] || original;
    });

    document.querySelectorAll("[aria-label]").forEach(element => {
      if (element === select) return;
      if (!element.dataset.nexoraOriginalAriaLabel) element.dataset.nexoraOriginalAriaLabel = element.getAttribute("aria-label") || "";
      element.setAttribute("aria-label", translate(element.dataset.nexoraOriginalAriaLabel));
    });

    if (select) select.value = currentLocale;
    if (select) select.setAttribute("aria-label", ({
      id: "Pilih bahasa",
      en: "Choose language",
      ko: "언어 선택",
      ja: "言語を選択"
    })[currentLocale]);
  }

  function init() {
    select = document.getElementById("languageSelect");
    let saved = "";
    try { saved = localStorage.getItem("nexora-seller-language") || ""; } catch {}
    const browser = (navigator.language || "id").slice(0, 2).toLowerCase();
    const initial = saved || (locales.includes(browser) ? browser : "id");
    applyLocale(initial);
    if (select) {
      select.addEventListener("change", () => {
        const locale = select.value;
        try { localStorage.setItem("nexora-seller-language", locale); } catch {}
        applyLocale(locale);
      });
    }
  }

  window.NEXORA_I18N = { applyLocale, setMessage, translate, locales };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();