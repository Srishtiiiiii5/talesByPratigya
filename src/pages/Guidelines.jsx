import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

export default function Guidelines() {
  const { lang } = useLanguage()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="section-title hindi-text text-center mb-10">
          {lang === 'hi' ? 'दिशानिर्देश' : 'Guidelines'}
        </h1>

        {lang === 'en' ? <EnglishContent /> : <HindiContent />}
      </motion.div>
    </div>
  )
}

function EnglishContent() {
  return (
    <div className="card p-8 sm:p-12 space-y-6 text-ink-600 dark:text-ink-200 leading-relaxed">
      <p className="font-semibold text-gold-600 dark:text-gold-400 text-lg font-serif">
        © 2026 Pratigya Singh | Keeper of Stories. All Rights Reserved.
      </p>

      <p className="hindi-text">
        Every word you read here is not just written — it is claimed.
        Every character breathes under my name. Every plot is woven from imagination that belongs solely to its creator.
      </p>

      <p className="hindi-text">
        This website is a sanctuary of original storytelling, where narratives are born, shaped, and owned by Pratigya Singh.
        From whispered dialogues to roaring plot twists, all content — including stories, characters, concepts, titles,
        and creative expressions — is protected under copyright law.
      </p>

      <p className="hindi-text italic text-ink-500 dark:text-ink-300 border-l-4 border-gold-500 pl-4">
        You may read, feel, and lose yourself in these worlds…<br />
        but you may not take them.
      </p>

      <p className="hindi-text">
        No part of this work may be copied, rewritten, reproduced, republished, translated, or distributed in any form
        without explicit written permission.
      </p>

      <p className="hindi-text italic text-ink-500 dark:text-ink-300 border-l-4 border-gold-500 pl-4">
        Because stories carry souls —<br />
        and stolen souls always find their way back to justice.
      </p>

      <p className="hindi-text font-semibold">
        Unauthorized use will be pursued with appropriate legal action.
      </p>

      <p className="hindi-text text-gold-700 dark:text-gold-400 font-serif text-lg font-semibold text-center pt-4">
        Enter as a reader. Leave as a believer. But never as a thief.
      </p>
    </div>
  )
}

function HindiContent() {
  return (
    <div className="card p-8 sm:p-12 space-y-6 text-ink-600 dark:text-ink-200 leading-relaxed hindi-text">
      <p>
        इस वेबसाइट talesbypratigya.com पर उपलब्ध समस्त सामग्री, जिसमें कहानियाँ, कविताएँ, लेख, पटकथा, पात्रों के नाम,
        कल्पित दुनिया (World-building), ग्राफिक्स, और ऑडियो-विजुअल तत्व शामिल हैं, प्रतिज्ञा सिंह की अनन्य बौद्धिक
        संपदा हैं। ये सभी कार्य भारतीय कॉपीराइट अधिनियम, 1957 और अंतर्राष्ट्रीय कॉपीराइट संधियों (Berne Convention)
        द्वारा सुरक्षित हैं।
      </p>

      <div>
        <p className="font-semibold mb-3">
          लेखक की स्पष्ट लिखित अनुमति के बिना निम्नलिखित गतिविधियाँ सख्त वर्जित हैं:
        </p>
        <ul className="space-y-2 pl-4">
          <li className="flex gap-2">
            <span className="text-gold-500 mt-1">•</span>
            <span>सामग्री को किसी भी रूप में (डिजिटल या प्रिंट) कॉपी, स्कैन, या री-प्रोड्यूस करना।</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gold-500 mt-1">•</span>
            <span>कहानियों का अनुवाद (Translation) या रूपांतरण (Adaptation) करना।</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gold-500 mt-1">•</span>
            <span>सोशल मीडिया, ब्लॉग्स, या यूट्यूब जैसे प्लेटफॉर्म्स पर कहानी के अंशों का उपयोग करना।</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gold-500 mt-1">•</span>
            <span>एआई (AI) मॉडल्स को प्रशिक्षित करने के लिए इस डेटा का उपयोग करना।</span>
          </li>
        </ul>
      </div>

      <div>
        <p className="font-semibold mb-3">
          साहित्यिक चोरी (Plagiarism) या अनधिकृत उपयोग पाए जाने पर, लेखक बिना किसी पूर्व सूचना के निम्नलिखित कदम
          उठाने का अधिकार सुरक्षित रखता है:
        </p>
        <ul className="space-y-3 pl-4">
          <li className="flex gap-2">
            <span className="text-gold-500 mt-1">*</span>
            <span>
              धारा 63 के तहत उल्लंघनकर्ता को 6 महीने से 3 साल तक का कारावास और ₹50,000 से ₹2,00,000 तक का जुर्माना
              हो सकता है।<br />
              धारा 65: अनधिकृत प्रतियों के निर्माण के लिए उपयोग किए गए उपकरणों की जब्ती।
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-gold-500 mt-1">*</span>
            <span>डिजिटल प्लेटफॉर्म्स से आपकी वेबसाइट/पेज को स्थायी रूप से हटवाना।</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gold-500 mt-1">*</span>
            <span>आर्थिक नुकसान और मानसिक क्षति के लिए हर्जाने का दावा।</span>
          </li>
        </ul>
      </div>

      <div className="border-t border-cream-200 dark:border-ink-600 pt-6">
        <p className="mb-2">
          यदि आप इस सामग्री का उपयोग शैक्षणिक या व्यावसायिक उद्देश्यों के लिए करना चाहते हैं, तो कृपया औपचारिक
          अनुमति प्राप्त करने के लिए निम्नलिखित माध्यम से संपर्क करें:
        </p>
        <p>
          ईमेल:{' '}
          <a
            href="mailto:talesbypratigya@gmail.com"
            className="text-gold-600 dark:text-gold-400 hover:underline"
          >
            talesbypratigya@gmail.com
          </a>
        </p>
      </div>

      <p className="italic border-l-4 border-gold-500 pl-4 text-ink-500 dark:text-ink-300">
        "मेरी कहानियाँ मेरा श्रम और मेरी पहचान हैं। इनका सम्मान करें। अनधिकृत उपयोग के विरुद्ध शून्य सहनशीलता
        (Zero Tolerance) की नीति अपनाई जाएगी।"
      </p>

      <p className="font-semibold text-gold-600 dark:text-gold-400 text-center pt-2">
        © 2026 प्रतिज्ञा सिंह talesbypratigya.com | सर्वाधिकार सुरक्षित।
      </p>
    </div>
  )
}
