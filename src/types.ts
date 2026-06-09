export interface ConstellationBasic {
  name: string;          // 中文名称 (e.g., 白羊座)
  englishName: string;   // 英文名称 (e.g., Aries)
  symbol: string;        // 星座符号 (e.g., ♈)
  dateRange: string;     // 日期范围 (e.g., 3月21日 - 4月19日)
  element: '火' | '土' | '风' | '水'; // 元素属性
  polarity: '阳性' | '阴性';          // 阴阳性
  rulingPlanet: string;  // 守护星
  guardianGod: string;   // 守护神
  coreTrait: string;     // 最大特征
  keyPersonality: string;// 关键性格
}

export interface ConstellationPersonality {
  advantages: string[];  // 优点
  disadvantages: string[]; // 缺点
  overall: string;       // 整体性格
  behaviorMode: string;  // 行为模式
}

export interface ConstellationLove {
  loveView: string;      // 爱情观
  preference: string;    // 择偶偏好
  guide: string;         // 相处指南
  bestMatches: string[]; // 最配星座
  worstMatches: string[]; // 不合星座
}

export interface ConstellationLife {
  luckyColor: string;    // 幸运色
  luckyNumber: number[]; // 幸运数字
  luckyStone: string;    // 幸运石
  outfit: string;        // 适合穿搭
  decompression: string; // 解压缩方式
}

export interface ConstellationCareer {
  jobs: string[];        // 适合职业
  strengths: string;     // 工作优势
  learningStyle: string; // 学习特点
}

export interface ConstellationGrowth {
  direction: string;     // 提升方向
  pitfalls: string;      // 避坑指南
}

export interface ConstellationData {
  id: string; // lowcase english name (e.g., aries)
  basic: ConstellationBasic;
  personality: ConstellationPersonality;
  love: ConstellationLove;
  life: ConstellationLife;
  career: ConstellationCareer;
  growth: ConstellationGrowth;
  stars: Array<{ x: number; y: number; brightness: number; name?: string }>; // for custom drawing stars
  lines: Array<[number, number]>; // star indexes to connect for drawing the constellation vector
}

export interface HistoryRecord {
  id: string;
  queryDate: string; // displayed query date (e.g. 公历: 2026-06-06 or 农历: 2026年五月初六)
  isLunar: boolean;
  constellationId: string;
  constellationName: string;
  timestamp: number;
}

export interface AppSettings {
  myConstellationId: string;
  theme: 'light' | 'dark';
}
