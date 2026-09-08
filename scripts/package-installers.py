"""
Đóng gói bản cài desktop vừa build thành đúng 2 file .zip mà auth.html trỏ tới.

Chạy SAU `cd electron && npm run build:all`:
    python scripts/package-installers.py

Nén THẲNG từ dist/ vào downloads/*.zip, KHÔNG tạo file .exe trung gian trong
downloads/ nữa. Lý do: firebase.json đã ignore '**/*.exe' nên file .exe trong
downloads/ chưa bao giờ được deploy (kiểm chứng: URL .exe trên production trả
404) - nó chỉ là bản sao thừa chiếm ~165MB đĩa cục bộ.
"""

import os
import sys
import zipfile

# Console Windows mặc định cp1252, in tiếng Việt sẽ ném UnicodeEncodeError
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

JOBS = [
    # (file build ra trong dist/, tên .exe BÊN TRONG zip, file zip đích)
    ("dist/HabitMastery-Setup-1.0.0.exe", "HabitMastery-Setup.exe", "downloads/HabitMastery-Setup.zip"),
    ("dist/HabitMastery-Portable-1.0.0.exe", "HabitMastery-Portable.exe", "downloads/HabitMastery-Portable.zip"),
]


def main():
    missing = [s for s, _, _ in JOBS if not os.path.exists(os.path.join(ROOT, s))]
    if missing:
        print("LỖI: chưa có file build. Chạy `cd electron && npm run build:all` trước.")
        for m in missing:
            print("  thiếu:", m)
        return 1

    for src, arcname, dest in JOBS:
        src_p, dest_p = os.path.join(ROOT, src), os.path.join(ROOT, dest)
        with zipfile.ZipFile(dest_p, "w", zipfile.ZIP_DEFLATED) as z:
            z.write(src_p, arcname)
        print(f"{dest}: {os.path.getsize(dest_p) / 1e6:.1f} MB  (chứa {arcname})")

    # Nhắc: đổi dung lượng thì nhãn trên trang tải cũng phải đổi theo
    print("\nNhớ đối chiếu nhãn dung lượng trong auth.html + i18n.js (cả vi/en/zh)")
    print("nếu kích thước thay đổi đáng kể, rồi build lại vì 2 file đó cũng nằm")
    print("trong extraResources của bản cài.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
