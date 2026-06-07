# Tài liệu tự học Go (Golang) — Từ cơ bản đến nâng cao

Chào mừng bạn! Đây là bộ tài liệu tổng hợp kiến thức lập trình Go (Golang) được hệ thống hóa từ những bước đi chập chững đầu tiên cho đến các chủ đề nâng cao. Hy vọng tài liệu này sẽ là người bạn đồng hành hữu ích giúp bạn tiếp cận Go một cách dễ dàng, trực quan và có hệ thống hơn.

Go là một ngôn ngữ thú vị. Nó mang triết lý tối giản, rất dễ tiếp cận nhưng lại cực kỳ hiệu quả khi giải quyết các bài toán lớn. Nội dung ở đây không chỉ dừng lại ở cú pháp bề nổi mà còn cố gắng giải thích các nguyên lý vận hành bên dưới để bạn hiểu rõ bản chất của mã nguồn mình viết ra.

---

## 🎯 Những gì bạn sẽ gặt hái được

Sau khi đi qua các nội dung trong bộ tài liệu này, bạn sẽ tích lũy được:
* **Khả năng viết code Go đúng chuẩn**: Biết cách tổ chức mã nguồn rõ ràng, tường minh và chuẩn mực (idiomatic Go).
* **Hiểu cách Go vận hành bộ nhớ**: Nắm được hoạt động của con trỏ, phân biệt Stack vs Heap và cơ chế hoạt động của bộ thu gom rác (Garbage Collector).
* **Tự tin lập trình song song**: Biết cách phối hợp Goroutine, Channel và các công cụ đồng bộ để giải quyết các bài toán xử lý đồng thời (concurrency).
* **Nền tảng cho các kỹ thuật phức tạp**: Làm quen và thực hành với Generics, Reflection cũng như các công cụ đo lường, tối ưu hóa hiệu năng (benchmarking/profiling).

---

## 🗺️ Lộ trình học tập chi tiết

Nội dung được sắp xếp theo trình tự tăng dần về độ khó để bạn tiện theo dõi:

### Chương 1: Khởi đầu với Go
* Làm quen cú pháp cơ bản của một chương trình Go.
* Các kiểu khai báo biến (`var`, `:=`) và hằng số (`const`).
* Sử dụng các câu lệnh điều kiện (`if-else`, `switch-case`) và vòng lặp (`for`).
* Quy tắc đặt tên và tổ chức code cơ bản.

### Chương 2: Kiểu dữ liệu & Con trỏ
* Khái niệm con trỏ (`Pointer`) và cách Go chuyển giao địa chỉ vùng nhớ.
* Cách làm việc với mảng (`Array`), mảng động (`Slice`) và bảng băm (`Map`).
* Xử lý chuỗi ký tự (`String`) và chuyển đổi kiểu dữ liệu an toàn.

### Chương 3: Hàm & Defer
* Cách viết hàm, truyền tham số và quản lý nhiều giá trị trả về.
* Tìm hiểu về hàm ẩn danh (Anonymous Functions) và kỹ thuật đóng gói trạng thái (`Closure`).
* Sử dụng `defer` để dọn dẹp tài nguyên (đóng file, giải phóng khóa) một cách an toàn.

### Chương 4: Struct & Interface
* Khai báo Struct và kỹ thuật ghép nối các đối tượng (Composition).
* Cách định nghĩa phương thức (`Method`) đính kèm cho struct.
* Thiết kế mã nguồn linh hoạt thông qua `Interface` và kỹ thuật kiểm tra kiểu dữ liệu (`Type Assertion`).

### Chương 5: Lập trình song song (Concurrency)
* Cách hoạt động của luồng siêu nhẹ `Goroutine`.
* Giao tiếp an toàn giữa các luồng qua `Channel` và cấu trúc rẽ nhánh `select`.
* Đồng bộ hóa trạng thái sử dụng `Mutex`, `WaitGroup` và `Once`.
* Quản lý hủy bỏ và vòng đời của tiến trình chạy ngầm với `Context`.

### Chương 6: Generics
* Viết code linh hoạt thông qua tham số hóa kiểu dữ liệu (`Type parameters`).
* Thiết lập ràng buộc kiểu dữ liệu (`Type constraints`) cho các hàm và struct dùng chung.

### Chương 7: Quản lý bộ nhớ & Garbage Collector
* Phân biệt vùng nhớ Stack (tốc độ nhanh, tự giải phóng) và Heap (do bộ thu gom rác quản lý).
* Tìm hiểu cơ chế Escape Analysis giúp trình biên dịch quyết định nơi phân bổ dữ liệu.
* Cơ chế hoạt động của bộ thu gom rác (Garbage Collector) và một số mẹo tối ưu hóa cấp phát vùng nhớ.

### Chương 8: Kỹ thuật nâng cao & Tối ưu hiệu năng
* Đọc và phân tích kiểu dữ liệu động tại thời điểm chạy (`Reflection`).
* Can thiệp bộ nhớ tầm thấp với con trỏ không an toàn `unsafe.Pointer` để tối ưu hiệu năng.
* Sử dụng `Build Tags` để cấu hình biên dịch mã nguồn theo từng môi trường.
* Viết bài kiểm tra tốc độ (`Benchmarking`) và phân tích tắc nghẽn tài nguyên (`Profiling`).

### Chương 9: Tra cứu từ khóa nhanh
* Bảng giải nghĩa ngắn gọn kèm ví dụ thực tế cho 63 từ khóa và khái niệm quan trọng của ngôn ngữ Go, giúp bạn tra cứu nhanh mỗi khi gặp cú pháp lạ hoặc cần ôn tập lại.

---

Chúc bạn có những trải nghiệm thú vị và bổ ích trong hành trình học tập ngôn ngữ Go! Nếu có đóng góp hoặc câu hỏi nào, đừng ngần ngại ghi chú lại để cùng thảo luận và cải tiến tài liệu nhé.
