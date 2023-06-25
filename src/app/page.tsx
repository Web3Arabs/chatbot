// في الصفحة فيجب ان نجعلها تُعرض من جانب العميل وليس السيرفر useState بما اننا سنقوم بإضافة
"use client";
import { useState } from "react";

export default function Home() {
  /**
   * عبارة عن مجموعة من الكائنات لمساعدة روبوت المحادثة على تتبع محفوظات محادثته مع مستخدم معين
   * ستتم إعادة تعيينه عند إعادة التحميل
   * content و role : كل كائن له خاصيتان
   */
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "مرحباً، كيف يمكننا مساعدتك؟",
    },
  ]);
  // المدخلات التي سيعطيها المستخدم للبوت
  const [theTextarea, setTheTextarea] = useState("");
  // OpenAI ستظهر للمستخدم نص اثناء الإنتظار لرد
  const [isLoading, setIsLoading] = useState(false);

  /**
   * OpenAI تقوم هذه الدالة بالإتصال برد
   */
  const getResponse = async () => {
    // يظهر للمستخدم انه ما زال البوت يقوم بالرد وعليه الإنتظار حتى ينتهي
    setIsLoading(true);
    // فيها messages مصفوفة مؤقتة ووضع جميع عناصر مصفوفة
    let mess = messages;
    /**
     * ندفع مدخلات المستخدم إلى هذه المصفوفة المؤقتة ونضبط رسائلنا
     * لقد قمنا بفعل هذا لأنه ليس من الجيد دفع البيانات الى المصفوفة الأساسية
     * فلذلك قمنا بإنشاء مصفوفة مؤقتة
     */
    mess.push({ role: "user", content: theTextarea });
    // نقوم بإرجاع خانة إدخال المحتوى من جاب المستخدم فارغة
    setTheTextarea("");

    // الخاص بنا الذي لم نقوم بإنشائه بعد API نقوم بإرسال طلب الى
    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ messages }),
    });

    // output نقوم بطلب إرجاع البيانات والمخرجات
    const data = await response.json();
    const { output } = data;

    // التي تحتوي ايضاً على بيانات الادخال messages نقوم بإضافة بيانات الاخراج التي ارسلت لنا من البوت الى مصفوفة
    setMessages((prevMessages) => [...prevMessages, output]);
    // والتي تعني ان البوت قد انتهى من كتابة رده false نقوم بإرجاعها الى
    setIsLoading(false);
  }

  return (
    <main dir="rtl" className="m-2">
      <div>
        <div>
          {/* messages إستدعاء جميع البيانات من مصفوفة */}
          {messages.map((e) => {
            return <div key={e.content}>{e.content}</div>
          })}

          {/* فيظهر للمستخدم بأن البوت ما زال يقوم بالرد true قيمتها isLoading في حال كان */}
          {isLoading ? <div className="text-red-900">جاري الرد...</div> : ""}
        </div>
        {
          /**
           * theTextarea لإستقبال البيانات من المستخدم وتخزينها في المتغيرtextarea قمنا بإنشاء خانة
           * اثناء النقر عليه getResponse ثم قمنا بإنشار زر يتصل بالدالة
           */
        }
        <div className="flex items-center mt-6">
          <textarea
            value={theTextarea}
            onChange={(event) => setTheTextarea(event.target.value)}
            className="w-72 text-black bg-gray-200 px-2 rouded"
          />
          <button
            onClick={getResponse}
            className="bg-red-800 text-white mr-5 px-6 py-3 rounded-sm"
          >
            إرسال
          </button>
        </div>
      </div>
    </main>
  );
}
