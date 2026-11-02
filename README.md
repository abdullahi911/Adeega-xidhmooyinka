# Xirmo Internet — Platform & Admin Dashboard

Adeegga casriga ah ee xirmooyinka internet-ka (SafariCom & EthioTelecom) oo leh qeyb gaar ah oo maamul (Admin Dashboard).

---

## 🚀 Tilmaamaha Nidaamka (Features)

### 1. Bogga Dadweynaha (Public Website)
- **Brand Cusub**: Waxaa loo beddelay **Xirmo Internet**.
- **Ogeysiisyada Tooska ah**: Ogeysiisyada maamuluhu daabaco waxay toos uga soo baxayaan dusha sare ee bogga hore iyagoo leh calaamado iyo faahfaahin buuxda.
- **Xirmooyinka Internet-ka**: Xirmooyinka SafariCom iyo EthioTelecom (Maalinle, Isbuucle, Bille) waxay si toos ah uga imanayaan xogkeydka (database).
- **Naqshad Casri ah**: Waxaa la ilaaliyay midabada buluugga iyo caddaanka (Blue-and-White theme).

### 2. Qeybta Maamulka (Admin Dashboard)
- **Waddada Maamulka**: `/admin` ama `/admin/dashboard`.
- **Waddada Galitaanka**: `/admin/login`.
- **Amni Buuxa**:
  - Ma jiro meel ay dadka caadiga ah iska diiwaangelin karaan (No public registration/signup).
  - Qof kasta oo booqda qeybta maamulka isagoon haysan rukhsad waxaa toos loogu wareejinayaa `/admin/login`.
  - Eraygarinka waxaa lagu xafiday hab sir ah oo loo adeegsaday Web Crypto SHA-256 iyo Cryptographic Salt.
- **Awoodaha Maamulaha**:
  - Wax ka beddelka qiimayaasha xirmooyinka.
  - Wax ka beddelka xaddiga MB iyo GB (Data values).
  - Wax ka beddelka magacyada, faahfaahinta, iyo astaamaha xirmooyinka.
  - Maamulidda xirmooyinka maalinlaha, isbuuclaha, iyo bille-ka ah.
  - Ku darista xirmooyin cusub (SafariCom ama EthioTelecom).
  - Tirtiridda xirmooyinka.
  - Daminta ama shididda helitaanka xirmooyinka (Active/Inactive toggle).
  - Maamulidda ogeysiisyada: Abuurid, wax ka beddel, tirtirid, iyo daabacid/damid.
  - Beddelidda eraygarinka maamulaha.

---

## 🔑 Macluumaadka Galitaanka Maamulaha (Admin Credentials)

* **Email:** `admin@xirmo.so`
* **Password:** `AdminPassword123!`

*(Fiiro gaar ah: Maamuluhu wuxuu eraygarinkan kaga beddelan karaa gudaha Admin Dashboard-ka qeybta "Amniga & Eraygarinka").*

---

## 🗄️ Xogkeydka (Database Setup)

Nidaamku wuxuu taageeraa laba hab oo xogkeyd ah:

1. **Built-in Resilient Database (Default - Diyaar ah)**:
   - Uma baahna wax habayn dheeraad ah.
   - Wuxuu isla markiiba ku shaqeynayaa kaydinta joogtada ah ee browser-ka oo leh multi-tab synchronization iyo default seed data.
2. **Supabase Cloud Database (Ikhtiyaari)**:
   - Ku dar `VITE_SUPABASE_URL` iyo `VITE_SUPABASE_ANON_KEY` faylka `.env`.
   - Ku dhex shub faylka `supabase_schema.sql` SQL Editor-ka Supabase.

---

## 🛠️ Sida Loo Kiciyo Mashruuca (Getting Started)

```bash
# Soo deji ku-tiirsanayaasha
npm install

# Kici server-ka tijaabada
npm run dev

# Dhis nidaamka diyaarinta wax-soo-saarka (Production build)
npm run build
```
