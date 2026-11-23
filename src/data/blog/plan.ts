/**
 * The 50-article plan for the Arabic MoreIELTS blog. Only articles that exist
 * in posts.ts are published; links to the others are hidden until they ship.
 * The first article of each cluster is the cluster hub.
 */
export type Cluster = "scores" | "listening" | "reading" | "writing" | "speaking" | "vocab" | "planning";

export const CLUSTERS: Record<Cluster, string> = {
  scores: "الدرجات والاختبار",
  listening: "الاستماع",
  reading: "القراءة",
  writing: "الكتابة",
  speaking: "المحادثة",
  vocab: "المفردات والقواعد",
  planning: "الخطة ويوم الاختبار",
};

export const PLAN: { slug: string; title: string; cluster: Cluster }[] = [
  // scores (6)
  { slug: "ielts-band-scores-explained", title: "درجات الآيلتس: كيف تُحسب الدرجة الكلية ودرجة كل مهارة", cluster: "scores" },
  { slug: "academic-vs-general-training", title: "آيلتس أكاديمي أم جنرال: أيهما يناسبك؟", cluster: "scores" },
  { slug: "ielts-format-and-timing", title: "نظام اختبار الآيلتس: المهارات الأربع وأوقاتها", cluster: "scores" },
  { slug: "what-ielts-band-do-you-need", title: "كم درجة آيلتس تحتاج للدراسة والهجرة والعمل؟", cluster: "scores" },
  { slug: "ielts-paper-vs-computer", title: "آيلتس ورقي أم على الكمبيوتر: الفرق والاختيار", cluster: "scores" },
  { slug: "ielts-retake-and-remark", title: "إعادة الاختبار وطلب إعادة التصحيح: متى تستحق؟", cluster: "scores" },
  // listening (8)
  { slug: "ielts-listening-guide", title: "دليل الاستماع في الآيلتس: الأقسام الأربعة وكيف تستعد", cluster: "listening" },
  { slug: "ielts-listening-form-completion", title: "إكمال النماذج في الاستماع: الأرقام والأسماء والتهجئة", cluster: "listening" },
  { slug: "ielts-listening-multiple-choice", title: "الاختيار من متعدد في الاستماع: كيف تتجنب الإجابات الخادعة", cluster: "listening" },
  { slug: "ielts-listening-map-labelling", title: "الخرائط والمخططات في الاستماع: كلمات الاتجاه والمكان", cluster: "listening" },
  { slug: "ielts-listening-section-4", title: "القسم الرابع في الاستماع: محاضرة أكاديمية بلا استراحة", cluster: "listening" },
  { slug: "ielts-listening-accents", title: "اللهجات في الاستماع: البريطانية والأسترالية والأمريكية", cluster: "listening" },
  { slug: "ielts-listening-common-mistakes", title: "أخطاء الاستماع الشائعة التي تخسرك الدرجات", cluster: "listening" },
  { slug: "ielts-listening-practice-routine", title: "روتين يومي لتحسين الاستماع في ثلاثة أسابيع", cluster: "listening" },
  // reading (10)
  { slug: "ielts-reading-guide", title: "دليل القراءة في الآيلتس: 60 دقيقة وثلاث نصوص", cluster: "reading" },
  { slug: "ielts-reading-time-management", title: "إدارة الوقت في القراءة: كيف تنهي النصوص الثلاثة", cluster: "reading" },
  { slug: "ielts-true-false-not-given-tips", title: "صح أم خطأ أم غير مذكور: القاعدة التي تحسم الإجابة", cluster: "reading" },
  { slug: "ielts-matching-headings-tips", title: "مطابقة العناوين: خطوات سريعة لحل أصعب نوع", cluster: "reading" },
  { slug: "ielts-reading-skimming-scanning", title: "المسح السريع والبحث عن المعلومة في القراءة", cluster: "reading" },
  { slug: "ielts-reading-paraphrase", title: "إعادة الصياغة في القراءة: لماذا لا تجد نفس الكلمات", cluster: "reading" },
  { slug: "ielts-reading-sentence-completion", title: "إكمال الجمل والملخصات: كيف تختار الكلمة الصحيحة", cluster: "reading" },
  { slug: "ielts-reading-multiple-choice", title: "الاختيار من متعدد في القراءة: استبعد قبل أن تختار", cluster: "reading" },
  { slug: "ielts-reading-vocabulary-building", title: "بناء مفردات القراءة الأكاديمية من النصوص نفسها", cluster: "reading" },
  { slug: "ielts-reading-score-7-plan", title: "خطة رفع القراءة من 6 إلى 7 في أربعة أسابيع", cluster: "reading" },
  // writing (12)
  { slug: "ielts-writing-guide", title: "دليل الكتابة في الآيلتس: المهمة الأولى والثانية ومعايير التصحيح", cluster: "writing" },
  { slug: "ielts-writing-task-2-structure", title: "هيكل مقال المهمة الثانية: من المقدمة إلى الخاتمة", cluster: "writing" },
  { slug: "ielts-writing-task-1-academic", title: "المهمة الأولى أكاديمي: وصف الرسوم البيانية خطوة بخطوة", cluster: "writing" },
  { slug: "ielts-writing-task-1-general-letter", title: "المهمة الأولى جنرال: كتابة الرسالة الرسمية وغير الرسمية", cluster: "writing" },
  { slug: "ielts-writing-opinion-essay", title: "مقال الرأي: كيف تكتب موقفًا واضحًا", cluster: "writing" },
  { slug: "ielts-writing-discussion-essay", title: "مقال النقاش: عرض الرأيين وإبداء رأيك", cluster: "writing" },
  { slug: "ielts-writing-problem-solution-essay", title: "مقال المشكلة والحل: أفكار وجمل جاهزة", cluster: "writing" },
  { slug: "ielts-writing-linking-words", title: "أدوات الربط في الكتابة: استخدمها بدقة لا بكثرة", cluster: "writing" },
  { slug: "ielts-writing-grammar-mistakes", title: "أخطاء القواعد التي يقع فيها العرب في الكتابة", cluster: "writing" },
  { slug: "ielts-writing-ideas-for-topics", title: "كيف تجد أفكارًا لأي موضوع في دقيقتين", cluster: "writing" },
  { slug: "ielts-writing-band-7-sample", title: "نموذج مقال بدرجة 7 مع شرح سبب الدرجة", cluster: "writing" },
  { slug: "ielts-writing-feedback-and-rewrite", title: "كيف تستفيد من تصحيح مقالك وتعيد كتابته", cluster: "writing" },
  // speaking (8)
  { slug: "ielts-speaking-guide", title: "دليل المحادثة في الآيلتس: الأجزاء الثلاثة ومعايير التصحيح", cluster: "speaking" },
  { slug: "ielts-speaking-part-1", title: "الجزء الأول في المحادثة: أسئلة قصيرة وإجابات طبيعية", cluster: "speaking" },
  { slug: "ielts-speaking-part-2-cue-card", title: "الجزء الثاني: كيف تتحدث دقيقتين من بطاقة الموضوع", cluster: "speaking" },
  { slug: "ielts-speaking-part-3", title: "الجزء الثالث: كيف تناقش أفكارًا مجردة بثقة", cluster: "speaking" },
  { slug: "ielts-speaking-fluency", title: "الطلاقة في المحادثة: كيف تتوقف عن التردد", cluster: "speaking" },
  { slug: "ielts-speaking-pronunciation", title: "النطق في الآيلتس: أصوات يخطئ فيها الناطقون بالعربية", cluster: "speaking" },
  { slug: "ielts-speaking-nerves", title: "التوتر في اختبار المحادثة: طرق عملية للتغلب عليه", cluster: "speaking" },
  { slug: "ielts-speaking-practice-routine", title: "كيف تتدرب على المحادثة وحدك وتسجل صوتك", cluster: "speaking" },
  // vocab (3)
  { slug: "ielts-vocabulary-guide", title: "مفردات الآيلتس: كيف تتعلم الكلمات التي تظهر فعلًا", cluster: "vocab" },
  { slug: "ielts-collocations", title: "التعبيرات المتلازمة: السر وراء لغة طبيعية", cluster: "vocab" },
  { slug: "ielts-topic-vocabulary", title: "مفردات المواضيع الشائعة: التعليم والتقنية والبيئة والصحة", cluster: "vocab" },
  // planning (3)
  { slug: "ielts-study-plan-8-weeks", title: "خطة مذاكرة آيلتس لمدة 8 أسابيع", cluster: "planning" },
  { slug: "ielts-test-day-checklist", title: "يوم الاختبار: ما تحضره وما تفعله بالترتيب", cluster: "planning" },
  { slug: "ielts-mock-tests-how-to-use", title: "الاختبارات التجريبية: كيف تستخدمها وتحلل نتيجتها", cluster: "planning" },
];
