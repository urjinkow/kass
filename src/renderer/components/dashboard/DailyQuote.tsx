import React from 'react';
import './DailyQuote.css';

const DEFAULT_QUOTES = [
  "Өөрийгөө дийлсэн хүн мянган дайсныг дийлснээс илүү.",
  "Аз жаргал бол бэлэн зүйл биш, таны үйлдлээс үүдэлтэй.",
  "Уур бол халуун нүүрс барьсантай адил, өөрийгөө л түлнэ.",
  "Өнгөрсөн зүйлд бүү зовоор, ирээдүйд бүү санаа зов, одоо энэ мөчид анхаарлаа төвлөрүүл.",
  "Мянган аялал нэг алхамаас эхэлдэг.",
  "Бусдад гэрэл өгөхийн тулд өөрөө шатах хэрэггүй.",
  "Тайван сэтгэл бол хамгийн том баялаг.",
  "Сайн үйлс жижиг ч гэсэн хэзээ ч дэмий хоосон байдаггүй.",
  "Өршөөл бол сул дорой байдал биш, хүч чадал юм.",
  "Ухаалаг хүн үгээрээ биш, үйлдлээрээ заадаг.",
  "Амьдрал бол тусгал шиг, та инээвэл тэр ч инээнэ.",
  "Өөрчлөлт өөрөөсөө эхэлдэг.",
];

export const DailyQuote: React.FC = () => {
  // Get quote based on day of year
  const getQuoteOfDay = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const index = dayOfYear % DEFAULT_QUOTES.length;
    return DEFAULT_QUOTES[index];
  };

  const quote = getQuoteOfDay();

  return (
    <div className="daily-quote glass-card">
      <div className="quote-header">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="dharma-wheel">
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="12" y1="4" x2="12" y2="8" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="12" y1="16" x2="12" y2="20" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="4" y1="12" x2="8" y2="12" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="16" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="6.34" y1="6.34" x2="9.17" y2="9.17" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="14.83" y1="14.83" x2="17.66" y2="17.66" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="6.34" y1="17.66" x2="9.17" y2="14.83" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="14.83" y1="9.17" x2="17.66" y2="6.34" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        <span className="quote-title">Өдрийн мэргэн үг</span>
      </div>
      <p className="quote-text">"{quote}"</p>
      <p className="quote-attribution">— Бурханы сургаал</p>
    </div>
  );
};
