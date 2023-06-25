import { NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';

/**
 * API دون مشاكل سنحتاج إلى تهيئتها بمفتاح OpenAI لنتمكن من استخدام حزمة
 * في السابق .env الذي قمنا بإضافته في ملف
*/
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(req: Request, res: NextResponse) {
  // req.json() متغير يقوم اولاً بتخزين
  const body = await req.json()

  /**
   * OpenAI نقوم بإستخدام واجهة برمجة التطبيقات الخاصة ب
   * "gpt-3.5-turbo" نحدد النموذج ليكون
   * على أنها المصفوفة التي مررناها من الواجهة الأمامية messages التعامل مع الرسائل
   * بمثابة حافظة للمحادثة messages تبدو
   * بإستخدام هذا يعرف الروبوت الخاص بنا ما حدث في الماضي ويقدم إجابات وفقًا لذلك
  */
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: body.messages,
  });
  console.log(completion.data.choices[0].message);

  // gpt-3.5-turbo يستخرج أول كائن رسالة من ردود
  const theResponse = completion.data.choices[0].message;

  // نقوم بإعادتها إلى الواجهة الامامية
  return NextResponse.json({ output: theResponse }, { status: 200 })
};
