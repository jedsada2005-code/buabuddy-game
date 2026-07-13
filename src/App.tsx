import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Home, BookOpen, LineChart as LineIcon, Newspaper, User, Users, Heart, Zap, Bell,
  Gift, ShoppingBag, Star, CheckCircle, X, ChevronRight, TrendingUp, TrendingDown,
  PlayCircle,
  Lock, Flame, Trophy, Target, Wallet, Clock, PieChart as PieIcon,
  Settings, RotateCcw,
} from 'lucide-react';
import {
  LineChart, Line, ResponsiveContainer, YAxis,
} from 'recharts';

// ============================================================
// ASSETS
// ============================================================
const BUA_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/Buabuddy__1_-removebg-preview.png';
const BUA_SEED_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/bua-seed1.png';
const BUA_SAVER_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/bua%20saver.png';
const BUA_INVESTOR_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/bua%20investor.png';
const VALUE_HUNTER_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/value%20hunter.png';
const GLOBAL_EXPLORER_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/global%20exploer.png';
const RISK_GUARDIAN_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/risk%20gardian.png';
const DIVIDEND_KEEPER_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/dividend%20keeper.png';
const BUA_TRADER_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/bua%20trader.png';
const ESG_HERO_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/esg%20hero.png';
const INVESTMENT_MASTER_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/investment%20master.png';
const BG_IMG  = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/background.png';
const BG_MASTER_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/BG%20master.png';

// ============================================================
// TYPES
// ============================================================
type EvolutionStage = 'bua-seed' | 'bua-saver' | 'bua-investor' | 'specialized-bua' | 'investment-master';
type LearningPhase  = 'basics' | 'money-management' | 'investment-basics' | 'goal-based' | 'specialization';
type InvestmentPath = 'value-hunter' | 'global-explorer' | 'risk-guardian' | 'dividend-keeper' | 'bua-trader' | 'esg-hero';
type QuestCategory = 'basic' | 'money-management' | 'investment' | 'goal' | 'specialization';
type QuestType = 'lesson' | 'quiz' | 'scenario' | 'action' | 'trade';
type QuestStatus = 'available' | 'in-progress' | 'reward' | 'done' | 'locked';

interface Quest {
  id: string;
  category: QuestCategory;
  type: QuestType;
  icon: string;
  title: string;
  desc: string;
  requiredLevel: number;
  prerequisiteQuestIds?: string[];
  prerequisiteLessonIds?: string[];
  lessonId?: string;
  lesson?: string;
  question?: string;
  options?: string[];
  correct?: number;
  exp: number;
  coins: number;
  badgeId?: string;
}

interface InvestmentPathInfo {
  icon: string;
  imageUrl?: string;
  name: string;
  style: string;
  strength: string;
  badgeId: string;
}

interface FriendProfile {
  id: string;
  name: string;
  level: number;
  title: string;
  bio: string;
  favoriteLesson: string;
  investmentPath?: InvestmentPath;
  houseEmoji: string;
  houseNote: string;
  coins: number;
}

interface VideoLesson {
  id: string;
  chapter: string;
  order: number;
  title: string;
  url: string;
  thumbnailUrl: string;
  focus: string;
  summary: string[];
  exp: number;
  coins: number;
  question: string;
  options: string[];
  correct: number;
}

interface PlayerProgress {
  level: number;
  currentExp: number;
  totalExp: number;
  completedQuestIds: string[];
  completedLessonIds: string[];
  claimedRewardIds: string[];
  unlockedFeatureIds: string[];
  earnedBadgeIds: string[];
  currentEvolutionStage: EvolutionStage;
  selectedInvestmentPath?: InvestmentPath;
  coins: number;
  happy: number;
  energy: number;
  streak: number;
  checkedInToday: boolean;
  feedCount: number;
  lessonCount: number;
  tradeCount: number;
  readNews: string[];
}

interface SavedGameState {
  version: number;
  player: PlayerProgress;
  tradingCash: number;
  holdings: Record<string, { shares: number; avgCost: number }>;
  tradeHistory: any[];
}

// ============================================================
// EXP SYSTEM
// ============================================================
const SAVE_VERSION = 1;

function getRequiredExp(level: number): number {
  return 100 + level * 40;
}

function getLearningPhase(level: number): LearningPhase {
  if (level <= 5)  return 'basics';
  if (level <= 9)  return 'money-management';
  if (level <= 15) return 'investment-basics';
  if (level <= 19) return 'goal-based';
  return 'specialization';
}

function getEvolutionStage(level: number): EvolutionStage {
  if (level < 5)  return 'bua-seed';
  if (level < 10) return 'bua-saver';
  if (level < 20) return 'bua-investor';
  if (level < 50) return 'specialized-bua';
  return 'investment-master';
}

const PHASE_INFO: Record<LearningPhase, { name: string; color: string; next: string; nextLevel: number }> = {
  'basics':            { name: '📚 พื้นฐานการเงิน',        color: 'sky',    next: 'จัดการเงิน',          nextLevel: 6  },
  'money-management':  { name: '💰 จัดการเงิน',            color: 'green',  next: 'ปลดล็อกพอร์ตจำลอง',   nextLevel: 10 },
  'investment-basics': { name: '📈 พื้นฐานการลงทุน',       color: 'blue',   next: 'ลงทุนตามเป้าหมาย',    nextLevel: 16 },
  'goal-based':        { name: '🎯 ลงทุนตามเป้าหมาย',      color: 'purple', next: 'เลือกเส้นทางลงทุน',   nextLevel: 20 },
  'specialization':    { name: '🏆 เส้นทางเฉพาะทาง',       color: 'orange', next: 'Investment Master',    nextLevel: 50 },
};

const EVOLUTION_INFO: Record<EvolutionStage, { name: string; desc: string; minLevel: number }> = {
  'bua-seed':        { name: 'Bua Seed',         desc: 'เริ่มต้นเรียนรู้',              minLevel: 1  },
  'bua-saver':       { name: 'Bua Saver',        desc: 'นักออมที่ดี',                  minLevel: 5  },
  'bua-investor':    { name: 'Bua Investor',     desc: 'เริ่มลงทุนอย่างฉลาด',         minLevel: 10 },
  'specialized-bua': { name: 'Specialized Bua', desc: 'เชี่ยวชาญเส้นทางเฉพาะ',       minLevel: 20 },
  'investment-master':{ name: 'Investment Master', desc: 'ปรมาจารย์การลงทุน',         minLevel: 50 },
};

// ============================================================
// FEATURE UNLOCKS
// ============================================================
interface FeatureUnlock {
  id: string; name: string; description: string;
  requiredLevel: number; icon: string; route?: string;
  requiredLessonIds?: string[];
  requiredQuestIds?: string[];
}

const FEATURE_UNLOCKS: FeatureUnlock[] = [
  { id: 'daily-quest',     name: 'ภารกิจประจำวัน',      description: 'รับรางวัล EXP และ Bua Coin ทุกวัน', requiredLevel: 1,  icon: '🎯' },
  { id: 'checkin',         name: 'เช็คอินรายวัน',        description: 'สะสมรางวัลต่อเนื่อง 7 วัน',          requiredLevel: 1,  icon: '🎁' },
  { id: 'shop',            name: 'ร้านค้า',              description: 'ซื้ออาหารให้น้องบัว',                  requiredLevel: 1,  icon: '🛒' },
  { id: 'money-quests',    name: 'เควสต์จัดการเงิน',    description: 'เรียนรู้การจัดการเงินอย่างชาญฉลาด',   requiredLevel: 6,  icon: '💰' },
  { id: 'portfolio',       name: 'พอร์ตจำลอง',           description: 'ฝึกลงทุนด้วยเงินจำลอง',               requiredLevel: 10, icon: '📊',
    requiredQuestIds: ['mq1', 'mq2', 'mq3', 'mq4', 'mq5', 'iq1', 'iq2', 'iq3'],
    requiredLessonIds: ['lesson-emergency-fund', 'lesson-risk-return', 'lesson-risk-profile', 'lesson-pre-investment-final'] },
  { id: 'dca-simulation',  name: 'จำลอง DCA',            description: 'ฝึกลงทุนแบบ DCA',                     requiredLevel: 11, icon: '🔄' },
  { id: 'goals',           name: 'เป้าหมายการเงิน',      description: 'ตั้งเป้าหมายและติดตามความคืบหน้า',     requiredLevel: 16, icon: '🎯' },
  { id: 'inv-path',        name: 'เลือกเส้นทางลงทุน',    description: 'ค้นพบสไตล์การลงทุนของคุณ',            requiredLevel: 20, icon: '🌟' },
];

function getNextUnlock(level: number): FeatureUnlock | null {
  return FEATURE_UNLOCKS.find(f => f.requiredLevel > level) ?? null;
}

// ============================================================
// BADGES
// ============================================================
const BADGES = [
  { id: 'first-step',      icon: '🌱', name: 'First Step',          desc: 'เริ่มต้นการเดินทาง'                    },
  { id: 'smart-saver',     icon: '💰', name: 'Smart Saver',         desc: 'สะสม 1,000 Bua Coin'                   },
  { id: 'money-planner',   icon: '📋', name: 'Smart Money Planner', desc: 'ทำเควสต์จัดการเงินครบ 3 บท'            },
  { id: 'emergency-ready', icon: '🛡️', name: 'Emergency Ready',     desc: 'เรียนบทเงินสำรองฉุกเฉินจบแล้ว'          },
  { id: 'invest-ready',    icon: '🚀', name: 'Investment Ready',    desc: 'ผ่านการทดสอบก่อนลงทุน'                 },
  { id: 'first-portfolio', icon: '📊', name: 'First Portfolio',     desc: 'สร้างพอร์ตแรกสำเร็จ'                   },
  { id: 'diversified',     icon: '🌐', name: 'Diversification Beginner', desc: 'กระจายพอร์ตได้ดี'               },
  { id: 'path-chosen',     icon: '🌟', name: 'Path Chosen',         desc: 'เลือกเส้นทางลงทุนแล้ว'                 },
  { id: 'value-hunter-badge', icon: '🔎', name: 'Value Hunter',     desc: 'เลือกเส้นทางนักล่ามูลค่า'              },
  { id: 'global-explorer-badge', icon: '🌏', name: 'Global Explorer', desc: 'เลือกเส้นทางนักสำรวจโลก'             },
  { id: 'risk-guardian-badge', icon: '🛡️', name: 'Risk Guardian',  desc: 'เลือกเส้นทางผู้พิทักษ์ความเสี่ยง'       },
  { id: 'dividend-keeper-badge', icon: '💎', name: 'Dividend Keeper', desc: 'เลือกเส้นทางผู้ดูแลปันผล'             },
  { id: 'bua-trader-badge', icon: '⚡', name: 'Bua Trader',          desc: 'เลือกเส้นทางนักเทรดจำลอง'              },
  { id: 'esg-hero-badge',   icon: '🌿', name: 'ESG Hero',            desc: 'เลือกเส้นทางลงทุนยั่งยืน'              },
  { id: 'trader',          icon: '📈', name: 'นักเทรด',              desc: 'ซื้อขาย 5 ครั้ง'                       },
  { id: 'stock101-master', icon: '📘', name: 'Stock 101',             desc: 'เรียนบทพื้นฐานหุ้น 101 ครบทุกคลิป'      },
  { id: 'friend',          icon: '❤️', name: 'เพื่อนรัก',           desc: 'ให้อาหาร 5 ครั้ง'                      },
];

const INVESTMENT_PATHS: Record<InvestmentPath, InvestmentPathInfo> = {
  'value-hunter':    { icon: '🔎', imageUrl: VALUE_HUNTER_IMG, name: 'Value Hunter',    style: 'มองหาสินทรัพย์ที่ราคาต่ำกว่ามูลค่าพื้นฐาน', strength: 'ใจเย็น วิเคราะห์เป็นระบบ และไม่ไล่ตามกระแส', badgeId: 'value-hunter-badge' },
  'global-explorer': { icon: '🌏', imageUrl: GLOBAL_EXPLORER_IMG, name: 'Global Explorer', style: 'กระจายการลงทุนข้ามประเทศและอุตสาหกรรม', strength: 'มองภาพใหญ่และรับมือการเปลี่ยนแปลงของโลก', badgeId: 'global-explorer-badge' },
  'risk-guardian':  { icon: '🛡️', imageUrl: RISK_GUARDIAN_IMG, name: 'Risk Guardian',   style: 'ให้ความสำคัญกับการคุมความเสี่ยงและเงินสดสำรอง', strength: 'รักษาวินัยและลดการตัดสินใจตามอารมณ์', badgeId: 'risk-guardian-badge' },
  'dividend-keeper':{ icon: '💎', imageUrl: DIVIDEND_KEEPER_IMG, name: 'Dividend Keeper', style: 'ชอบสินทรัพย์ที่สร้างกระแสเงินสดสม่ำเสมอ', strength: 'อดทนและเน้นความต่อเนื่องระยะยาว', badgeId: 'dividend-keeper-badge' },
  'bua-trader':     { icon: '⚡', imageUrl: BUA_TRADER_IMG, name: 'Bua Trader',       style: 'เรียนรู้จังหวะตลาดผ่านการซื้อขายจำลอง', strength: 'สังเกตไว ทดลองไว และบันทึกบทเรียนจากทุกดีล', badgeId: 'bua-trader-badge' },
  'esg-hero':       { icon: '🌿', imageUrl: ESG_HERO_IMG, name: 'ESG Hero',         style: 'เลือกลงทุนโดยคำนึงถึงสิ่งแวดล้อม สังคม และธรรมาภิบาล', strength: 'เชื่อมเป้าหมายการเงินเข้ากับผลกระทบที่ดี', badgeId: 'esg-hero-badge' },
};

const INVESTMENT_PATH_MASTERS: Record<InvestmentPath, { masterName: string; theme: string }> = {
  'value-hunter': { masterName: 'Value Master', theme: 'เชี่ยวชาญการประเมินมูลค่าและเลือกหุ้นคุณภาพในราคาสมเหตุสมผล' },
  'global-explorer': { masterName: 'Global Master', theme: 'เชี่ยวชาญการมองภาพโลกและกระจายพอร์ตข้ามประเทศ' },
  'risk-guardian': { masterName: 'Risk Master', theme: 'เชี่ยวชาญการคุมความเสี่ยง วินัย และการปกป้องพอร์ต' },
  'dividend-keeper': { masterName: 'Dividend Master', theme: 'เชี่ยวชาญหุ้น/สินทรัพย์ที่สร้างกระแสเงินสดสม่ำเสมอ' },
  'bua-trader': { masterName: 'Trading Master', theme: 'เชี่ยวชาญจังหวะตลาด แผนซื้อขาย และการจำกัดความเสี่ยง' },
  'esg-hero': { masterName: 'ESG Master', theme: 'เชี่ยวชาญการลงทุนยั่งยืนและผลกระทบเชิงบวก' },
};

// ============================================================
// STATIC DATA (Quests, News, Shop, etc.)
// ============================================================
const MONEY_QUEST_IDS = ['mq1', 'mq2', 'mq3', 'mq4', 'mq5'];

const QUESTS: Quest[] = [
  { id: 'q1', category: 'basic', type: 'lesson', icon: '📚', title: 'ETF คืออะไร?', desc: 'อ่านบทความให้จบ', requiredLevel: 1, lessonId: 'lesson-etf-basics',
    lesson: 'ETF (Exchange Traded Fund) คือกองทุนรวมที่ซื้อขายในตลาดหลักทรัพย์ได้เหมือนหุ้น มีค่าธรรมเนียมต่ำ กระจายความเสี่ยง เหมาะกับนักลงทุนมือใหม่',
    question: 'ETF ย่อมาจากอะไร?',
    options: ['Exchange Traded Fund', 'Electronic Trading Form', 'European Trade Fund', 'Equity Transfer Fund'],
    correct: 0, exp: 120, coins: 80 },
  { id: 'q2', category: 'basic', type: 'quiz', icon: '🎯', title: 'การกระจายความเสี่ยง', desc: 'ตอบคำถามให้ถูก', requiredLevel: 1,
    question: 'การกระจายความเสี่ยง (Diversification) คืออะไร?',
    options: ['ลงทุนหุ้นตัวเดียวทั้งหมด', 'ลงทุนในสินทรัพย์หลากหลาย', 'เก็บเงินสดเท่านั้น', 'กู้เงินมาลงทุน'],
    correct: 1, exp: 150, coins: 100 },
  { id: 'q3', category: 'basic', type: 'quiz', icon: '⚠️', title: 'ระบุการหลอกลวง', desc: 'ฝึกระวังภัยลงทุน', requiredLevel: 1,
    question: 'ข้อใดเป็นสัญญาณของการหลอกลวงการลงทุน?',
    options: ['มีใบอนุญาตจาก ก.ล.ต.', 'เปิดเผยข้อมูลโปร่งใส', 'รับประกันผลตอบแทนสูงไม่มีความเสี่ยง', 'มีประวัติยาวนาน'],
    correct: 2, exp: 200, coins: 150 },
  { id: 'q4', category: 'basic', type: 'action', icon: '🍎', title: 'ให้อาหาร Bua Buddy', desc: 'ดูแลความสุข 1 ครั้ง', requiredLevel: 1, exp: 50, coins: 30 },
  { id: 'q5', category: 'basic', type: 'lesson', icon: '📰', title: 'อ่านข่าวตลาด', desc: 'อ่านข่าวการเงิน 1 บทความ', requiredLevel: 1, lessonId: 'lesson-market-news',
    lesson: 'การติดตามข่าวสารตลาดช่วยให้เข้าใจปัจจัยที่กระทบราคาหลักทรัพย์ เช่น อัตราดอกเบี้ย เงินเฟ้อ นโยบายรัฐ',
    question: 'การติดตามข่าวสารช่วยอะไร?',
    options: ['ทำกำไรทันที', 'เข้าใจปัจจัยกระทบตลาด', 'รับประกันผลตอบแทน', 'หลีกเลี่ยงการขาดทุน'],
    correct: 1, exp: 80, coins: 50 },
  { id: 'q6', category: 'basic', type: 'trade', icon: '💎', title: 'ลองซื้อหุ้นครั้งแรก', desc: 'ทำการซื้อขายจำลอง 1 ครั้ง', requiredLevel: 1, exp: 130, coins: 90 },
  { id: 'mq1', category: 'money-management', type: 'scenario', icon: '💸', title: 'แบ่งเงินอย่างไรดี?', desc: 'ฝึกแยกเงินใช้ เงินออม และเงินที่พร้อมลงทุนผ่านสถานการณ์จำลอง', requiredLevel: 6, lessonId: 'lesson-money-allocation',
    lesson: 'ก่อนเริ่มลงทุน ควรจัดลำดับเงินให้ชัด: เงินใช้จ่ายจำเป็น เงินออม/เป้าหมาย เงินสำรองฉุกเฉิน และเงินส่วนที่รับความเสี่ยงได้ แนวคิดนี้เป็นบทเรียนจำลอง ไม่ใช่ระบบกระเป๋าเงินจริงในแอป',
    question: 'น้องบัวมี 1,000 Coin สำหรับสถานการณ์จำลอง ควรตัดสินใจอย่างไรดีที่สุด?',
    options: ['ใช้จ่ายทั้งหมด 1,000', 'ออมทั้งหมด 1,000 โดยไม่เหลือใช้จ่ายจำเป็น', 'แบ่งใช้จ่ายจำเป็น ออม และกันเงินฉุกเฉินก่อนคิดเรื่องลงทุน', 'ลงทุนทั้งหมด 1,000 ทันที'],
    correct: 2, exp: 180, coins: 120 },
  { id: 'mq2', category: 'money-management', type: 'scenario', icon: '🛡️', title: 'เงินสำรองฉุกเฉิน', desc: 'รับมือสถานการณ์ไม่คาดฝันก่อนนำเงินไปลงทุน', requiredLevel: 6, prerequisiteQuestIds: ['mq1'], lessonId: 'lesson-emergency-fund',
    lesson: 'เงินสำรองฉุกเฉินช่วยให้เราไม่ต้องขายสินทรัพย์หรือตัดสินใจลงทุนผิดจังหวะเมื่อมีเหตุไม่คาดคิด ควรเป็นเงินที่เข้าถึงง่ายและไม่ผันผวนมาก',
    question: 'โทรศัพท์น้องบัวพัง ซ่อม 800 Coin น้องบัวควรทำอะไรในสถานการณ์จำลอง?',
    options: ['ขายหุ้นที่ลงทุนไว้ทันที', 'กู้เงินเพื่อนมาซ่อม', 'ใช้เงินสำรองฉุกเฉินที่เตรียมไว้', 'ไม่ซ่อม'],
    correct: 2, exp: 180, coins: 120, badgeId: 'emergency-ready' },
  { id: 'mq3', category: 'money-management', type: 'scenario', icon: '🎮', title: 'อยากได้ vs. เป้าหมายใหญ่', desc: 'ฝึกคิดเรื่อง needs, wants และค่าเสียโอกาส', requiredLevel: 7, prerequisiteQuestIds: ['mq2'], lessonId: 'lesson-opportunity-cost',
    lesson: 'Needs คือสิ่งจำเป็นต่อชีวิตหรือเป้าหมายหลัก ส่วน wants คือสิ่งที่อยากได้ ค่าเสียโอกาสคือสิ่งที่เรายอมสละเมื่อเลือกทางหนึ่งแทนอีกทางหนึ่ง',
    question: 'น้องบัวอยากซื้อชุดลิมิเต็ด 500 Coin แต่กำลังเก็บเงินซื้อจักรยาน ควรคิดอย่างไร?',
    options: ['ซื้อชุดก่อน เดี๋ยวค่อยออมใหม่', 'เทียบกับเป้าหมายจักรยาน แล้วรอถ้าชุดทำให้เป้าหมายล่าช้าเกินไป', 'กู้เงินซื้อชุด', 'ละทิ้งเป้าหมายจักรยานทันที'],
    correct: 1, exp: 160, coins: 110 },
  { id: 'mq4', category: 'money-management', type: 'lesson', icon: '📉', title: 'เงินเฟ้อคืออะไร?', desc: 'เข้าใจกำลังซื้อที่ลดลงและเหตุผลที่ต้องวางแผน', requiredLevel: 7, prerequisiteQuestIds: ['mq3'], lessonId: 'lesson-inflation',
    lesson: 'เงินเฟ้อทำให้ของชิ้นเดิมมีราคาแพงขึ้นเมื่อเวลาผ่านไป ถ้าเงินออมเติบโตช้ากว่าเงินเฟ้อ กำลังซื้อจริงจะลดลง การลงทุนจึงเป็นเครื่องมือหนึ่ง แต่ต้องเริ่มหลังจัดการเงินพื้นฐานแล้ว',
    question: 'ขนมน้องบัวเคยราคา 50 Coin ตอนนี้ขึ้นเป็น 60 Coin สาเหตุหลักคืออะไร?',
    options: ['ร้านค้าโลภมาก', 'เงินเฟ้อทำให้ราคาสินค้าสูงขึ้น', 'ขนมอร่อยขึ้น', 'Bua Coin มีค่ามากขึ้น'],
    correct: 1, exp: 160, coins: 110 },
  { id: 'mq5', category: 'money-management', type: 'scenario', icon: '🚀', title: 'พร้อมลงทุนแล้วหรือยัง?', desc: 'ภารกิจสรุปก่อนเข้าสู่พอร์ตจำลอง', requiredLevel: 8, prerequisiteQuestIds: ['mq4'], lessonId: 'lesson-investing-readiness',
    lesson: 'เงินที่จะนำไปลงทุนควรเป็นเงินที่ไม่กระทบค่าใช้จ่ายจำเป็น มีเงินสำรองเพียงพอ และมีเวลาให้รับความผันผวนได้ การลงทุนทั้งหมดโดยไม่กันเงินพื้นฐานไว้มีความเสี่ยงสูง',
    question: 'น้องบัวมี 5,000 Coin มีค่าใช้จ่ายรายเดือน เงินสำรองน้อย และเป้าหมายระยะยาว ควรตัดสินใจอย่างไร?',
    options: ['ลงทุนทั้งหมด 5,000', 'ลงทุน 0 และไม่วางแผนอะไรต่อ', 'จัดค่าใช้จ่ายและเงินสำรองก่อน แล้วค่อยลงทุนเฉพาะส่วนที่รับความเสี่ยงได้', 'กู้เงินมาลงทุนเพิ่ม'],
    correct: 2, exp: 250, coins: 200, badgeId: 'invest-ready' },
  { id: 'iq1', category: 'investment', type: 'lesson', icon: '⚖️', title: 'Risk & Return เบื้องต้น', desc: 'เข้าใจว่าผลตอบแทนที่สูงขึ้นมักมากับความเสี่ยงที่สูงขึ้น', requiredLevel: 9, prerequisiteQuestIds: ['mq5'], lessonId: 'lesson-risk-return',
    lesson: 'การลงทุนมีโอกาสได้ผลตอบแทนมากกว่าเงินฝาก แต่ราคาสินทรัพย์อาจขึ้นลงได้ ความเสี่ยงไม่ใช่เรื่องน่ากลัวถ้าเข้าใจเวลา เป้าหมาย และขนาดเงินที่รับความผันผวนได้',
    question: 'ข้อใดอธิบายความสัมพันธ์ระหว่างความเสี่ยงและผลตอบแทนได้ดีที่สุด?',
    options: ['ผลตอบแทนสูงแปลว่าไม่มีความเสี่ยง', 'สินทรัพย์ที่มีโอกาสให้ผลตอบแทนสูงมักมีความผันผวนสูงกว่า', 'เงินสดให้ผลตอบแทนสูงที่สุดเสมอ', 'ความเสี่ยงไม่มีผลต่อการลงทุน'],
    correct: 1, exp: 180, coins: 120 },
  { id: 'iq2', category: 'investment', type: 'scenario', icon: '🧭', title: 'Risk Profile Quiz', desc: 'สำรวจระดับความเสี่ยงที่เหมาะกับตัวเองก่อนเริ่มจำลองพอร์ต', requiredLevel: 9, prerequisiteQuestIds: ['iq1'], lessonId: 'lesson-risk-profile',
    lesson: 'Risk profile ช่วยให้เลือกพอร์ตที่เหมาะกับตัวเอง โดยดูจากเป้าหมาย ระยะเวลา ความมั่นคงของเงินสำรอง และความสบายใจเมื่อเห็นพอร์ตผันผวน',
    question: 'ถ้าน้องบัวเห็นพอร์ตจำลองลดลง 10% ในระยะสั้น แต่เป้าหมายยังอีกหลายปี ควรทำอย่างไร?',
    options: ['ขายทุกอย่างทันทีโดยไม่ทบทวนแผน', 'กู้เงินเพิ่มเพื่อลงทุนคืนทุน', 'ทบทวนแผน ความเสี่ยง และเป้าหมายก่อนตัดสินใจ', 'เลิกเรียนเรื่องลงทุนทั้งหมด'],
    correct: 2, exp: 180, coins: 120 },
  { id: 'iq3', category: 'investment', type: 'scenario', icon: '🔐', title: 'ด่านสุดท้ายก่อนสร้างพอร์ต', desc: 'ยืนยันว่าพร้อมใช้พอร์ตจำลองเพื่อการเรียนรู้ ไม่ใช่คำแนะนำลงทุนจริง', requiredLevel: 10, prerequisiteQuestIds: ['iq2'], lessonId: 'lesson-pre-investment-final',
    lesson: 'พอร์ตจำลองมีไว้ฝึกคิดเรื่องสินทรัพย์ ความเสี่ยง และการกระจายการลงทุน ผลลัพธ์ในแอปเป็นการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุนจริง',
    question: 'ก่อนเริ่มพอร์ตจำลอง น้องบัวควรจำอะไรไว้เสมอ?',
    options: ['ผลลัพธ์จำลองรับประกันกำไรจริง', 'ควรลงทุนจริงตามเกมทันที', 'ใช้พอร์ตจำลองเพื่อเรียนรู้และตัดสินใจจริงด้วยข้อมูลรอบด้าน', 'ไม่ต้องสนใจความเสี่ยงถ้าตอบ quiz ผ่าน'],
    correct: 2, exp: 220, coins: 180, badgeId: 'first-portfolio' },
];

const PORTFOLIO_UNLOCK = FEATURE_UNLOCKS.find(f => f.id === 'portfolio')!;

function isPortfolioReady(player: PlayerProgress, level = player.level): boolean {
  const questsDone = (PORTFOLIO_UNLOCK.requiredQuestIds ?? []).every(id => player.completedQuestIds.includes(id));
  const lessonsDone = (PORTFOLIO_UNLOCK.requiredLessonIds ?? []).every(id => player.completedLessonIds.includes(id));
  return level >= PORTFOLIO_UNLOCK.requiredLevel && questsDone && lessonsDone;
}

function getPortfolioChecklist(player: PlayerProgress) {
  const questItems = (PORTFOLIO_UNLOCK.requiredQuestIds ?? []).map(id => {
    const q = QUESTS.find(item => item.id === id);
    return { id, label: `ทำเควสต์ "${q?.title ?? id}"`, done: player.completedQuestIds.includes(id), actionQuestId: id };
  });
  const lessonItems = (PORTFOLIO_UNLOCK.requiredLessonIds ?? []).map(id => ({
    id,
    label: `เรียนบท "${QUESTS.find(q => q.lessonId === id)?.title ?? id}"`,
    done: player.completedLessonIds.includes(id),
    actionQuestId: QUESTS.find(q => q.lessonId === id)?.id,
  }));
  return [
    { id: 'portfolio-level', label: `ถึง Level ${PORTFOLIO_UNLOCK.requiredLevel}`, done: player.level >= PORTFOLIO_UNLOCK.requiredLevel, current: `Lv.${player.level}` },
    ...lessonItems,
    ...questItems,
  ];
}

const NEWS = [
  { id: 'n1', icon: '📈', title: 'ดอกเบี้ยขึ้น มีผลอย่างไร?', summary: 'ธนาคารกลางขึ้นดอกเบี้ย 0.25%', body: 'เมื่อดอกเบี้ยสูงขึ้น เงินฝากให้ผลตอบแทนดีขึ้น แต่หุ้นและพันธบัตรอาจราคาลด นักลงทุนระยะยาวไม่ควรตื่นตระหนก', tag: 'นโยบายการเงิน' },
  { id: 'n2', icon: '🌏', title: 'ETF กำลังเติบโตในเอเชีย', summary: 'นักลงทุนรุ่นใหม่หันมาสนใจ ETF', body: 'ETF กลายเป็นทางเลือกยอดนิยมของ Gen Z เพราะค่าธรรมเนียมต่ำ ซื้อขายง่าย และกระจายความเสี่ยงในตัว', tag: 'เทรนด์ลงทุน' },
  { id: 'n3', icon: '💸', title: 'เงินเฟ้อกับเงินออม', summary: 'เก็บเงินสดอย่างเดียวอาจไม่พอ', body: 'เงินเฟ้อทำให้กำลังซื้อลดลงทุกปี ถ้าฝากเงินได้ดอกเบี้ย 1% แต่เงินเฟ้อ 3% เท่ากับเงินคุณ "หาย" ไป 2% ทุกปี', tag: 'พื้นฐาน' },
  { id: 'n4', icon: '🛡️', title: 'กองทุนสำรองฉุกเฉิน', summary: 'ก่อนลงทุนต้องมีเงินสำรอง 3-6 เดือน', body: 'ก่อนเริ่มลงทุน ควรมีเงินสำรองฉุกเฉินเท่ากับค่าใช้จ่าย 3-6 เดือน เก็บในที่ถอนได้ง่าย เช่น บัญชีออมทรัพย์ดอกเบี้ยสูง', tag: 'การวางแผน' },
];

const SHOP = [
  { id: 's1', icon: '🍎', name: 'ผลไม้สด',         price: 15,  happy: 10, energy: 5  },
  { id: 's2', icon: '🥗', name: 'อาหารคลีน',       price: 30,  happy: 15, energy: 20 },
  { id: 's3', icon: '🍰', name: 'ขนมพิเศษ',        price: 50,  happy: 25, energy: 15 },
  { id: 's4', icon: '⚡', name: 'เครื่องดื่มชูกำลัง', price: 40, happy: 5,  energy: 30 },
  { id: 's5', icon: '🎁', name: 'กล่องเซอร์ไพรส์', price: 100, happy: 30, energy: 30 },
];

const CHECKIN_REWARDS = [50, 80, 100, 150, 200, 250, 500];

// ============================================================
// MOCK FRIENDS (Prototype only)
// ============================================================
const FRIENDS: FriendProfile[] = [
  {
    id: 'mint',
    name: 'Mint',
    level: 3,
    title: 'เพื่อนสายเริ่มต้น',
    bio: 'กำลังฝึกเก็บเหรียญและเรียนรู้พื้นฐาน ETF กับน้องบัวตัวจิ๋ว',
    favoriteLesson: 'ETF คืออะไร?',
    houseEmoji: '🌱',
    houseNote: 'บ้านเริ่มต้นเล็ก ๆ มีมุมอ่านบทเรียนการเงิน',
    coins: 620,
  },
  {
    id: 'poon',
    name: 'Poon',
    level: 8,
    title: 'สายออมเงิน',
    bio: 'ชอบวางแผนค่าใช้จ่าย แบ่งเงินออม และดูแลน้องบัวให้โตเป็น Bua Saver',
    favoriteLesson: 'เงินสำรองฉุกเฉิน',
    houseEmoji: '💰',
    houseNote: 'บ้านอบอุ่น มีขวดโหลออมเงินและปฏิทินเช็คอิน',
    coins: 1450,
  },
  {
    id: 'beam',
    name: 'Beam',
    level: 14,
    title: 'สายเริ่มลงทุน',
    bio: 'ปลดล็อก Bua Investor แล้ว กำลังฝึกอ่านความเสี่ยงและจัดพอร์ตจำลอง',
    favoriteLesson: 'Risk & Return เบื้องต้น',
    houseEmoji: '📊',
    houseNote: 'บ้านมีจอกระดานกราฟและโต๊ะวางแผนพอร์ตจำลอง',
    coins: 2380,
  },
  {
    id: 'fah',
    name: 'Fah',
    level: 24,
    title: 'สาย Risk Guardian',
    bio: 'เลือกเส้นทางผู้พิทักษ์ความเสี่ยง เน้นวินัย เงินสดสำรอง และไม่ตัดสินใจตามอารมณ์',
    favoriteLesson: 'Risk Profile Quiz',
    investmentPath: 'risk-guardian',
    houseEmoji: '🛡️',
    houseNote: 'บ้านขั้นสูง มีโล่ความเสี่ยงและห้องวิเคราะห์ก่อนลงทุน',
    coins: 5200,
  },
];

// ============================================================
// VIDEO LESSONS (Prototype: Chapter 1)
// ============================================================
const STOCK101_LESSONS: VideoLesson[] = [
  {
    id: 'stock101-1-1',
    chapter: 'บทที่ 1: พื้นฐานการลงทุนในหุ้น 101',
    order: 1,
    title: 'ทำความรู้จักหุ้นฉบับมือใหม่ - Stock101',
    url: 'https://youtu.be/uzH2TG6Hy4c?si=UAMZlor9emnQAJtX',
    thumbnailUrl: 'https://img.youtube.com/vi/uzH2TG6Hy4c/hqdefault.jpg',
    focus: 'เข้าใจว่าหุ้นคืออะไร และผู้ถือหุ้นมีความหมายอย่างไร',
    summary: [
      'หุ้นคือส่วนหนึ่งของความเป็นเจ้าของกิจการ',
      'ผลตอบแทนจากหุ้นอาจมาจากเงินปันผลและส่วนต่างราคา',
      'ราคาหุ้นขึ้นลงได้ จึงต้องเข้าใจความเสี่ยงก่อนลงทุน',
    ],
    exp: 100,
    coins: 60,
    question: 'ข้อใดอธิบาย “หุ้น” ได้ถูกต้องที่สุดสำหรับมือใหม่?',
    options: [
      'เงินฝากที่รับประกันผลตอบแทนแน่นอน',
      'ส่วนหนึ่งของความเป็นเจ้าของกิจการที่มีโอกาสได้ผลตอบแทนและมีความเสี่ยง',
      'สลากรางวัลที่ซื้อแล้วต้องได้กำไร',
      'หนี้ที่บริษัทต้องจ่ายคืนผู้ซื้อหุ้นเสมอ',
    ],
    correct: 1,
  },
  {
    id: 'stock101-1-2',
    chapter: 'บทที่ 1: พื้นฐานการลงทุนในหุ้น 101',
    order: 2,
    title: 'ซื้อขายหุ้น ผ่าน Streaming - Stock101',
    url: 'https://youtu.be/3voY0FWMWxw?si=oicyMC9AyCgvgbtm',
    thumbnailUrl: 'https://img.youtube.com/vi/3voY0FWMWxw/hqdefault.jpg',
    focus: 'รู้จัก flow เบื้องต้นของการซื้อขายหุ้นผ่านแอป Streaming',
    summary: [
      'การซื้อขายหุ้นต้องมีบัญชีและส่งคำสั่งผ่านระบบซื้อขาย',
      'ควรตรวจชื่อหุ้น ราคา จำนวน และประเภทคำสั่งก่อนยืนยัน',
      'การฝึกด้วยพอร์ตจำลองช่วยลดความผิดพลาดก่อนลงเงินจริง',
    ],
    exp: 110,
    coins: 70,
    question: 'ก่อนกดยืนยันคำสั่งซื้อขายหุ้น สิ่งใดควรตรวจสอบเสมอ?',
    options: [
      'สีของปุ่มในแอปเท่านั้น',
      'ชื่อหุ้น ราคา จำนวน และฝั่งซื้อ/ขาย',
      'จำนวนเพื่อนในเกม',
      'ราคาหุ้นเมื่อปีที่แล้วอย่างเดียว',
    ],
    correct: 1,
  },
  {
    id: 'stock101-1-3',
    chapter: 'บทที่ 1: พื้นฐานการลงทุนในหุ้น 101',
    order: 3,
    title: 'แนะนำการลงทุนในหุ้นเบื้องต้นสำหรับมือใหม่ - Stock101',
    url: 'https://youtu.be/lPEzeiQDgqM?si=jwdLk_UT5HwdYC8y',
    thumbnailUrl: 'https://img.youtube.com/vi/lPEzeiQDgqM/hqdefault.jpg',
    focus: 'วาง mindset มือใหม่ก่อนเริ่มลงทุนหุ้นจริง',
    summary: [
      'มือใหม่ควรเริ่มจากเข้าใจเป้าหมาย ระยะเวลา และความเสี่ยงที่รับได้',
      'ไม่ควรซื้อหุ้นเพราะตามกระแสหรือเพราะมีคนบอกมาอย่างเดียว',
      'การกระจายความเสี่ยงช่วยลดผลกระทบจากหุ้นตัวใดตัวหนึ่ง',
    ],
    exp: 120,
    coins: 80,
    question: 'พฤติกรรมใดเหมาะกับนักลงทุนมือใหม่มากที่สุด?',
    options: [
      'ซื้อหุ้นตามข่าวลือทันทีเพื่อไม่ให้พลาด',
      'ทุ่มเงินทั้งหมดในหุ้นตัวเดียว',
      'ศึกษาเป้าหมาย ความเสี่ยง และค่อย ๆ เริ่มลงทุนอย่างมีแผน',
      'ซื้อขายทุกวันแม้ยังไม่เข้าใจธุรกิจ',
    ],
    correct: 2,
  },
  {
    id: 'stock101-1-4',
    chapter: 'บทที่ 1: พื้นฐานการลงทุนในหุ้น 101',
    order: 4,
    title: 'แกะงบการเงินพื้นฐาน - Stock101',
    url: 'https://youtu.be/zseP1YZ13QE?si=GmV0d4klOw-6OBaR',
    thumbnailUrl: 'https://img.youtube.com/vi/zseP1YZ13QE/hqdefault.jpg',
    focus: 'อ่านงบการเงินพื้นฐานเพื่อดูสุขภาพของบริษัท',
    summary: [
      'งบการเงินช่วยให้เห็นรายได้ กำไร สินทรัพย์ หนี้สิน และกระแสเงินสด',
      'กำไรอย่างเดียวไม่พอ ควรดูหนี้และเงินสดประกอบด้วย',
      'การอ่านงบช่วยให้ลงทุนจากข้อมูล ไม่ใช่จากความรู้สึก',
    ],
    exp: 140,
    coins: 90,
    question: 'งบการเงินช่วยนักลงทุนเรื่องใดมากที่สุด?',
    options: [
      'รับประกันว่าหุ้นจะขึ้นทันที',
      'ดูสุขภาพกิจการ เช่น รายได้ กำไร หนี้ และกระแสเงินสด',
      'บอกเลขราคาหุ้นวันพรุ่งนี้แบบแน่นอน',
      'แทนการวางแผนความเสี่ยงทั้งหมด',
    ],
    correct: 1,
  },
  {
    id: 'stock101-1-5',
    chapter: 'บทที่ 1: พื้นฐานการลงทุนในหุ้น 101',
    order: 5,
    title: 'พื้นฐานการจับจังหวะเทรดหุ้น เมื่อไหร่ ซื้อ ถือ ขาย - Stock101',
    url: 'https://youtu.be/5C-ROkChjcY?si=8dDG9jO7RU2kLL2B',
    thumbnailUrl: 'https://img.youtube.com/vi/5C-ROkChjcY/hqdefault.jpg',
    focus: 'เข้าใจการคิดก่อนซื้อ ถือ หรือขาย ไม่ใช่ตัดสินใจตามอารมณ์',
    summary: [
      'การซื้อ ถือ หรือขายควรมีเหตุผลและแผนล่วงหน้า',
      'ควรแยกการลงทุนตามแผนออกจากการตัดสินใจเพราะกลัวหรือโลภ',
      'มือใหม่ควรฝึกบันทึกเหตุผลของทุกการตัดสินใจลงทุน',
    ],
    exp: 150,
    coins: 100,
    question: 'ข้อใดเป็นวิธีคิดที่ดีเมื่อจะซื้อ ถือ หรือขายหุ้น?',
    options: [
      'ตัดสินใจทันทีตามอารมณ์ตลาด',
      'ซื้อเมื่อทุกคนพูดถึง แล้วขายเมื่อเริ่มกลัว',
      'มีเหตุผล แผน และเงื่อนไขก่อนตัดสินใจ',
      'ถือทุกตัวตลอดไปโดยไม่ดูข้อมูลใหม่',
    ],
    correct: 2,
  },
];

const STOCK101_CHAPTER_BONUS = {
  exp: 300,
  coins: 200,
  badgeId: 'stock101-master',
  badgeName: 'Stock 101',
};

// ============================================================
// MOCK STOCKS
// ============================================================
const INITIAL_STOCKS = [
  { sym: 'NVDA',  name: 'Nvidia Corp',            logo: '🟢', cat: 'us', base: 192.53 },
  { sym: 'MSFT',  name: 'Microsoft Corp',          logo: '🪟', cat: 'us', base: 372.97 },
  { sym: 'TSM',   name: 'Taiwan Semiconductor',    logo: '🔴', cat: 'us', base: 432.35 },
  { sym: 'AVGO',  name: 'Broadcom Inc.',            logo: '🔺', cat: 'us', base: 365.02 },
  { sym: 'AAPL',  name: 'Apple Inc.',               logo: '🍎', cat: 'us', base: 245.18 },
  { sym: 'PTT',   name: 'ปตท.',                     logo: '⛽', cat: 'th', base: 34.50  },
  { sym: 'CPALL', name: 'ซีพี ออลล์',              logo: '🏪', cat: 'th', base: 58.25  },
  { sym: 'KBANK', name: 'กสิกรไทย',                logo: '🏦', cat: 'th', base: 142.50 },
  { sym: 'AOT',   name: 'ท่าอากาศยานไทย',           logo: '✈️', cat: 'th', base: 62.75  },
];

const genSpark = (base: number, pts = 20) => {
  const arr: { i: number; v: number }[] = [];
  let v = base * 0.97;
  for (let i = 0; i < pts; i++) {
    v += (Math.random() - 0.48) * base * 0.015;
    arr.push({ i, v: Math.max(base * 0.9, v) });
  }
  return arr;
};

const fmt = (n: number, d = 2) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

// ============================================================
// LOCALSTORAGE HELPERS
// ============================================================
const STORAGE_KEY = 'bua_buddy_save';

const DEFAULT_PLAYER: PlayerProgress = {
  level: 1, currentExp: 0, totalExp: 0,
  completedQuestIds: [], completedLessonIds: [], claimedRewardIds: [],
  unlockedFeatureIds: ['daily-quest', 'checkin', 'shop'],
  earnedBadgeIds: ['first-step'],
  currentEvolutionStage: 'bua-seed',
  selectedInvestmentPath: undefined,
  coins: 500, happy: 80, energy: 75,
  streak: 0, checkedInToday: false,
  feedCount: 0, lessonCount: 0, tradeCount: 0, readNews: [],
};

function loadGame(): SavedGameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedGameState;
    if (parsed.version !== SAVE_VERSION) return null; // version mismatch → fresh start
    return parsed;
  } catch { return null; }
}

function saveGame(state: SavedGameState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* silent */ }
}

// ============================================================
// MASCOT
// ============================================================
const BuaCoinIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <span
    className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br from-amber-200 via-yellow-400 to-orange-500 border-2 border-amber-500 shadow-sm text-amber-950 font-black ring-1 ring-yellow-100 ${className}`}
    style={{ width: size, height: size, fontSize: size * 0.52, lineHeight: 1 }}
  >
    ฿
  </span>
);

const BuaMascot = ({ size = 180, mood = 'happy', stage = 1, evolutionStage, investmentPath }: { size?: number; mood?: string; stage?: number; evolutionStage?: EvolutionStage; investmentPath?: InvestmentPath }) => {
  const pathImage = investmentPath ? INVESTMENT_PATHS[investmentPath]?.imageUrl : undefined;
  const imageSrc = evolutionStage === 'investment-master' ? INVESTMENT_MASTER_IMG : pathImage ?? (evolutionStage === 'bua-seed' ? BUA_SEED_IMG : evolutionStage === 'bua-saver' ? BUA_SAVER_IMG : evolutionStage === 'bua-investor' ? BUA_INVESTOR_IMG : BUA_IMG);
  return (
  <div style={{ width: size, height: size, position: 'relative', display: 'inline-block', background: 'transparent' }}>
    <img src={imageSrc} alt="Bua Buddy"
      style={{ width: '100%', height: '100%', objectFit: 'contain',
        filter: mood === 'sad' ? 'grayscale(40%) brightness(0.85)' : 'none', transition: 'filter 0.3s' }} />
    {mood === 'happy' && <>
      <div style={{ position: 'absolute', top: '10%', left:  '0%', fontSize: size * 0.11 }}>✨</div>
      <div style={{ position: 'absolute', top: '15%', right: '0%', fontSize: size * 0.09 }}>✨</div>
    </>}
  </div>
  );
};

// ============================================================
// LEVEL UP MODAL
// ============================================================
const LevelUpModal = ({ level, onClose, nextUnlock }: { level: number; onClose: () => void; nextUnlock: FeatureUnlock | null }) => (
  <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl">
      <div className="text-6xl mb-3">🎉</div>
      <div className="font-bold text-2xl text-gray-800 mb-1">เลเวลอัพ!</div>
      <div className="text-4xl font-black text-blue-500 mb-3">Lv.{level}</div>
      <div className="text-sm text-gray-500 mb-4">ยอดเยี่ยมมาก! น้องบัวภูมิใจในตัวคุณมาก 🐾</div>
      {nextUnlock && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 mb-4 text-left">
          <div className="text-[11px] font-bold text-blue-500 mb-1">🔓 ปลดล็อกถัดไป (Lv.{nextUnlock.requiredLevel})</div>
          <div className="font-bold text-gray-800 text-sm">{nextUnlock.icon} {nextUnlock.name}</div>
          <div className="text-xs text-gray-500">{nextUnlock.description}</div>
        </div>
      )}
      <button onClick={onClose} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-full shadow active:scale-95">
        ไปต่อ! 🚀
      </button>
    </div>
  </div>
);

const PortfolioUnlockModal = ({ onStartTutorial, onClose }: { onStartTutorial: () => void; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/60 z-[75] flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl overflow-hidden relative">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-purple-100 via-blue-100 to-green-100"/>
      <div className="relative">
        <div className="text-5xl mb-2">📊</div>
        <div className="mx-auto mb-2 w-28 h-28 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
          <BuaMascot size={100} mood="happy" stage={2}/>
        </div>
        <div className="font-bold text-xl text-gray-800 mb-2">ปลดล็อกพอร์ตจำลองแล้ว!</div>
        <div className="text-sm text-gray-600 leading-relaxed mb-4">
          คุณเข้าใจพื้นฐานการจัดการเงินแล้ว พร้อมช่วยน้องบัวสร้างพอร์ตแรก!
        </div>
        <button onClick={onStartTutorial} className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white font-bold py-3 rounded-full shadow active:scale-95 mb-2">
          เริ่ม tutorial พอร์ต
        </button>
        <button onClick={onClose} className="w-full text-xs font-bold text-gray-400 py-2">ไว้ทีหลัง</button>
      </div>
    </div>
  </div>
);

const PortfolioTutorialModal = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep] = useState(0);
  const steps = [
    { icon: '💵', title: 'เงินจำลอง', body: 'เงินในพอร์ตนี้ใช้ฝึกตัดสินใจเท่านั้น ไม่ใช่เงินจริงและไม่ใช่คำแนะนำลงทุนจริง' },
    { icon: '📈', title: 'ซื้อขายจำลอง', body: 'ลองซื้อขายเพื่อดูว่าราคาและความผันผวนส่งผลต่อมูลค่าพอร์ตอย่างไร' },
    { icon: '🧺', title: 'กระจายความเสี่ยง', body: 'พอร์ตที่ถือหลายสินทรัพย์มักรับมือความผันผวนได้ดีกว่าการทุ่มทั้งหมดไว้จุดเดียว' },
    { icon: '🩺', title: 'Health Score', body: 'คะแนนสุขภาพพอร์ตช่วยสะท้อนการกระจายตัว ความกระจุกตัว และสัดส่วนเงินสดแบบง่าย ๆ' },
  ];
  const current = steps[step];
  return (
    <div className="fixed inset-0 bg-black/60 z-[76] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="font-bold text-gray-800">Portfolio Tutorial</div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X size={16}/></button>
        </div>
        <div className="text-center py-4">
          <div className="text-6xl mb-3">{current.icon}</div>
          <div className="font-bold text-xl text-gray-800 mb-2">{current.title}</div>
          <div className="text-sm text-gray-600 leading-relaxed">{current.body}</div>
        </div>
        <div className="flex justify-center gap-1 mb-4">
          {steps.map((_, i) => <div key={i} className={`h-2 rounded-full transition-all ${i === step ? 'w-6 bg-blue-500' : 'w-2 bg-gray-200'}`}/>)}
        </div>
        <button onClick={() => step === steps.length - 1 ? onClose() : setStep(s => s + 1)}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-full shadow active:scale-95">
          {step === steps.length - 1 ? 'เริ่มสร้างพอร์ต' : 'ถัดไป'}
        </button>
      </div>
    </div>
  );
};

const EvolutionModal = ({ stage, onClose }: { stage: EvolutionStage; onClose: () => void }) => {
  const info = EVOLUTION_INFO[stage];
  const stageVisual = stage === 'bua-investor' ? 3 : stage === 'specialized-bua' || stage === 'investment-master' ? 4 : stage === 'bua-saver' ? 2 : 1;
  return (
    <div className="fixed inset-0 bg-black/60 z-[74] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl">
        <div className="text-5xl mb-2">✨</div>
        <div className="mx-auto mb-3 w-32 h-32 rounded-full bg-gradient-to-br from-blue-50 to-pink-50 border border-blue-100 flex items-center justify-center">
          <BuaMascot size={120} mood="happy" stage={stageVisual} evolutionStage={stage}/>
        </div>
        <div className="text-xs font-bold text-blue-500 mb-1">วิวัฒนาการใหม่</div>
        <div className="font-black text-2xl text-gray-800 mb-1">{info.name}</div>
        <div className="text-sm text-gray-600 mb-4">{info.desc}</div>
        <button onClick={onClose} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-full shadow active:scale-95">
          เยี่ยมเลย!
        </button>
      </div>
    </div>
  );
};

const InvestmentPathModal = ({ onSelect, onClose }: { onSelect: (path: InvestmentPath) => void; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/60 z-[77] flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
      <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between">
        <div>
          <div className="font-bold text-gray-800">เลือกเส้นทางลงทุน</div>
          <div className="text-[11px] text-gray-500">เลือกได้ครั้งเดียวสำหรับ milestone Lv.20</div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X size={16}/></button>
      </div>
      <div className="p-4 space-y-3">
        {(Object.entries(INVESTMENT_PATHS) as [InvestmentPath, InvestmentPathInfo][]).map(([id, path]) => (
          <button key={id} onClick={() => onSelect(id)}
            className="w-full bg-gradient-to-br from-white to-blue-50 rounded-2xl p-4 border border-blue-100 text-left shadow-sm active:scale-95">
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center overflow-hidden shadow-sm border border-blue-100 shrink-0">
                {path.imageUrl ? <img src={path.imageUrl} alt={path.name} className="w-full h-full object-contain"/> : <span className="text-4xl">{path.icon}</span>}
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-800 text-sm">{path.name}</div>
                <div className="text-xs text-gray-600 mt-1">{path.style}</div>
                <div className="text-[11px] text-blue-600 font-bold mt-2">จุดแข็ง: {path.strength}</div>
              </div>
              <ChevronRight size={16} className="text-gray-300 mt-1"/>
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
);

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  // --- Load or init ---
  const saved = loadGame();

  const [player,      setPlayer]      = useState<PlayerProgress>(saved?.player ?? DEFAULT_PLAYER);
  const [tradingCash, setTradingCash] = useState(saved?.tradingCash ?? 100000);
  const [holdings,    setHoldings]    = useState<Record<string, { shares: number; avgCost: number }>>(saved?.holdings ?? {});
  const [tradeHistory,setTradeHistory]= useState<any[]>(saved?.tradeHistory ?? []);
  const [stocks,      setStocks]      = useState(() =>
    INITIAL_STOCKS.map(s => {
      const cp = (Math.random() - 0.5) * 8;
      return { ...s, price: s.base * (1 + cp / 100), changePct: cp, spark: genSpark(s.base) };
    })
  );

  const [screen,     setScreen]     = useState('home');
  const [modal,      setModal]      = useState<any>(null);
  const [reward,     setReward]     = useState<any>(null);
  const [quizState,  setQuizState]  = useState({ step: 'lesson', answer: null as number | null });
  const [investTab,  setInvestTab]  = useState('market');
  const [cat,        setCat]        = useState('us');
  const [selected,   setSelected]   = useState<any>(null);
  const [tradeQty,   setTradeQty]   = useState(1);
  const [levelUpInfo,setLevelUpInfo]= useState<{ level: number } | null>(null);
  const [portfolioUnlockInfo, setPortfolioUnlockInfo] = useState(false);
  const [showPortfolioTutorial, setShowPortfolioTutorial] = useState(false);
  const [evolutionInfo, setEvolutionInfo] = useState<EvolutionStage | null>(null);
  const [showPathModal, setShowPathModal] = useState(false);
  const [pathPromptDismissed, setPathPromptDismissed] = useState(false);
  const [showDev,    setShowDev]    = useState(false);

  const dayRef = useRef(1);

  // --- Persist on change ---
  useEffect(() => {
    const state: SavedGameState = { version: SAVE_VERSION, player, tradingCash, holdings, tradeHistory };
    saveGame(state);
  }, [player, tradingCash, holdings, tradeHistory]);

  // --- Derived ---
  const expNeeded     = getRequiredExp(player.level);
  const phase         = getLearningPhase(player.level);
  const phaseInfo     = PHASE_INFO[phase];
  const nextUnlock    = getNextUnlock(player.level);
  const evoStage      = getEvolutionStage(player.level);
  const evoInfo       = EVOLUTION_INFO[evoStage];
  const sceneBgImg    = evoStage === 'investment-master' ? BG_MASTER_IMG : BG_IMG;
  const selectedPathInfo = player.selectedInvestmentPath ? INVESTMENT_PATHS[player.selectedInvestmentPath] : null;
  const mood          = player.happy < 30 || player.energy < 30 ? 'sad' : 'happy';
  const mascotStage   = player.level >= 30 ? 4 : player.level >= 20 ? 3 : player.level >= 10 ? 2 : 1;

  const holdingsValue = Object.entries(holdings).reduce((s, [sym, h]) => {
    const st = stocks.find(x => x.sym === sym); return s + (st ? st.price * h.shares : 0);
  }, 0);
  const totalCost  = Object.entries(holdings).reduce((s, [, h]) => s + h.avgCost * h.shares, 0);
  const totalValue = tradingCash + holdingsValue;
  const totalPnL   = holdingsValue - totalCost;
  const totalPnLPct= totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  const portfolioUnlocked = player.unlockedFeatureIds.includes('portfolio');
  const portfolioChecklist = getPortfolioChecklist(player);
  const portfolioReady = isPortfolioReady(player);
  const largestHoldingPct = holdingsValue > 0
    ? Math.max(...Object.entries(holdings).map(([sym, h]) => {
        const st = stocks.find(x => x.sym === sym);
        return st ? (st.price * h.shares / holdingsValue) * 100 : 0;
      }))
    : 0;
  const cashPct = totalValue > 0 ? (tradingCash / totalValue) * 100 : 100;
  const portfolioHealthScore = Math.max(0, Math.min(100,
    40
    + Math.min(Object.keys(holdings).length, 5) * 10
    + (largestHoldingPct > 55 ? -15 : 10)
    + (cashPct > 85 ? -10 : cashPct >= 10 && cashPct <= 40 ? 10 : 0)
  ));

  useEffect(() => {
    if (!portfolioUnlocked && portfolioReady) {
      setPlayer(p => ({ ...p, unlockedFeatureIds: [...new Set([...p.unlockedFeatureIds, 'portfolio'])] }));
      setPortfolioUnlockInfo(true);
    }
  }, [portfolioReady, portfolioUnlocked]);

  useEffect(() => {
    if (player.level >= 20 && !player.selectedInvestmentPath && !pathPromptDismissed) {
      setShowPathModal(true);
    }
  }, [player.level, player.selectedInvestmentPath, pathPromptDismissed]);

  // ============================================================
  // EXP / LEVEL UP
  // ============================================================
  const gainExp = useCallback((amount: number) => {
    setPlayer(p => {
      let exp   = p.currentExp + amount;
      let level = p.level;
      let needed = getRequiredExp(level);
      let leveled = false;
      while (exp >= needed) {
        exp   -= needed;
        level += 1;
        needed = getRequiredExp(level);
        leveled = true;
      }
      const nextEvolutionStage = getEvolutionStage(level);
      // Check new features
      const newFeatures = FEATURE_UNLOCKS
        .filter(f => f.id !== 'portfolio' && f.requiredLevel <= level && !p.unlockedFeatureIds.includes(f.id))
        .map(f => f.id);

      if (leveled) setLevelUpInfo({ level });
      if (nextEvolutionStage !== p.currentEvolutionStage) setEvolutionInfo(nextEvolutionStage);
      return {
        ...p, level, currentExp: exp, totalExp: p.totalExp + amount,
        unlockedFeatureIds: [...new Set([...p.unlockedFeatureIds, ...newFeatures])],
        currentEvolutionStage: nextEvolutionStage,
      };
    });
  }, []);

  const selectInvestmentPath = (path: InvestmentPath) => {
    const pathInfo = INVESTMENT_PATHS[path];
    setPlayer(p => ({
      ...p,
      selectedInvestmentPath: path,
      currentEvolutionStage: getEvolutionStage(Math.max(p.level, 20)),
      unlockedFeatureIds: [...new Set([...p.unlockedFeatureIds, 'inv-path'])],
      earnedBadgeIds: [...new Set([...p.earnedBadgeIds, 'path-chosen', pathInfo.badgeId])],
    }));
    setShowPathModal(false);
    setPathPromptDismissed(false);
    setEvolutionInfo('specialized-bua');
    showReward(150, 200, `เลือกเส้นทาง ${pathInfo.name} แล้ว!`);
  };

  // ============================================================
  // REWARD POPUP
  // ============================================================
  const showReward = (exp: number, coins: number, msg: string) => {
    if (exp > 0) gainExp(exp);
    if (coins > 0) setPlayer(p => ({ ...p, coins: p.coins + coins }));
    setReward({ exp, coins, msg });
    setTimeout(() => setReward(null), 2500);
  };

  // ============================================================
  // QUEST LOGIC
  // ============================================================
  const hasQuestPrerequisites = (q: Quest) => {
    const questReady = (q.prerequisiteQuestIds ?? []).every(id => player.completedQuestIds.includes(id));
    const lessonReady = (q.prerequisiteLessonIds ?? []).every(id => player.completedLessonIds.includes(id));
    return player.level >= q.requiredLevel && questReady && lessonReady;
  };

  const getQuestStatus = (q: Quest): QuestStatus => {
    if (!hasQuestPrerequisites(q)) return 'locked';
    if (player.claimedRewardIds.includes(q.id)) return 'done';
    if (player.completedQuestIds.includes(q.id)) return 'reward';
    if (q.lessonId && player.completedLessonIds.includes(q.lessonId)) return 'in-progress';
    return 'available';
  };

  const startQuest = (q: Quest) => {
    const status = getQuestStatus(q);
    if (status === 'locked' || status === 'done' || status === 'reward') return;
    setModal(q);
    setQuizState({ step: q.lesson && !player.completedLessonIds.includes(q.lessonId ?? '') ? 'lesson' : 'quiz', answer: null });
  };

  const completeLesson = (q: Quest) => {
    if (!q.lessonId || player.completedLessonIds.includes(q.lessonId)) {
      setQuizState({ step: 'quiz', answer: null });
      return;
    }
    setPlayer(p => ({
      ...p,
      completedLessonIds: [...p.completedLessonIds, q.lessonId!],
      lessonCount: p.lessonCount + 1,
    }));
    setQuizState({ step: 'quiz', answer: null });
  };

  const completeQuest = (q: Quest, correct: boolean) => {
    if (player.completedQuestIds.includes(q.id)) return;
    if (q.type !== 'action' && q.type !== 'trade' && !correct) {
      setQuizState({ step: 'quiz', answer: null });
      return;
    }
    setPlayer(p => ({
      ...p,
      completedQuestIds: [...p.completedQuestIds, q.id],
      completedLessonIds: q.lessonId && !p.completedLessonIds.includes(q.lessonId) ? [...p.completedLessonIds, q.lessonId] : p.completedLessonIds,
    }));
    showReward(0, 0, 'เควสต์พร้อมรับรางวัล! 🎉');
    setModal(null); setQuizState({ step: 'lesson', answer: null });
  };

  const claimQuestReward = (q: Quest) => {
    if (!player.completedQuestIds.includes(q.id) || player.claimedRewardIds.includes(q.id)) return;
    const claimedMoneyQuestIds = new Set([
      ...player.claimedRewardIds.filter(id => MONEY_QUEST_IDS.includes(id)),
      ...(MONEY_QUEST_IDS.includes(q.id) ? [q.id] : []),
    ]);
    const newBadgeIds = [
      q.badgeId,
      claimedMoneyQuestIds.size >= 3 ? 'money-planner' : undefined,
    ].filter((id): id is string => Boolean(id) && !player.earnedBadgeIds.includes(id));

    setPlayer(p => ({
      ...p,
      claimedRewardIds: [...p.claimedRewardIds, q.id],
      earnedBadgeIds: [...new Set([...p.earnedBadgeIds, ...newBadgeIds])],
    }));
    showReward(q.exp, q.coins, 'รับรางวัลเควสต์แล้ว!');
  };

  // ============================================================
  // SHOP / CHECKIN
  // ============================================================
  const buyItem = (item: any) => {
    if (player.coins < item.price) { showReward(0, 0, 'Bua Coin ไม่พอ!'); return; }
    setPlayer(p => ({
      ...p,
      coins: p.coins - item.price,
      happy: Math.min(100, p.happy + item.happy),
      energy: Math.min(100, p.energy + item.energy),
      feedCount: p.feedCount + 1,
      completedQuestIds: p.completedQuestIds.includes('q4') ? p.completedQuestIds : [...p.completedQuestIds, 'q4'],
    }));
    showReward(5, 0, `${item.icon} น้องบัวมีความสุขขึ้น!`);
  };

  const claimCheckin = () => {
    if (player.checkedInToday) return;
    const day = player.streak % 7;
    setPlayer(p => ({ ...p, streak: p.streak + 1, checkedInToday: true }));
    showReward(50, CHECKIN_REWARDS[day], `เช็คอินวันที่ ${day + 1}!`);
  };

  // ============================================================
  // TRADING
  // ============================================================
  const advanceDay = () => {
    setStocks(prev => prev.map(s => {
      const d = (Math.random() - 0.48) * 6;
      const np = s.price * (1 + d / 100);
      return { ...s, price: np, changePct: d, spark: [...s.spark.slice(1), { i: s.spark.length, v: np }] };
    }));
    dayRef.current += 1;
    showReward(0, 0, `📅 วันที่ ${dayRef.current} — ราคาอัพเดท!`);
  };

  const buyStock = (stock: any, qty: number) => {
    const cost = stock.price * qty;
    if (cost > tradingCash) { showReward(0, 0, '💸 เงินไม่พอ!'); return; }
    setTradingCash(c => c - cost);
    setHoldings(h => {
      const cur = h[stock.sym] || { shares: 0, avgCost: 0 };
      const tot = cur.shares + qty;
      return { ...h, [stock.sym]: { shares: tot, avgCost: (cur.avgCost * cur.shares + cost) / tot } };
    });
    setTradeHistory(hist => [{ type: 'buy', sym: stock.sym, qty, price: stock.price, time: Date.now() }, ...hist]);
    setPlayer(p => ({ ...p, tradeCount: p.tradeCount + 1 }));
    if (!player.completedQuestIds.includes('q6')) {
      setPlayer(p => ({
        ...p,
        completedQuestIds: [...p.completedQuestIds, 'q6'],
        claimedRewardIds: [...p.claimedRewardIds, 'q6'],
      }));
      showReward(130, 90, '🎉 เควสต์ซื้อหุ้นสำเร็จ!');
    } else { showReward(10, 5, `✅ ซื้อ ${stock.sym} ${qty} หุ้น`); }
    setSelected(null);
  };

  const sellStock = (stock: any, qty: number) => {
    const cur = holdings[stock.sym];
    if (!cur || cur.shares < qty) { showReward(0, 0, '❌ หุ้นไม่พอขาย!'); return; }
    setTradingCash(c => c + stock.price * qty);
    setHoldings(h => {
      const rem = cur.shares - qty;
      if (rem === 0) { const nh = { ...h }; delete nh[stock.sym]; return nh; }
      return { ...h, [stock.sym]: { ...cur, shares: rem } };
    });
    setTradeHistory(hist => [{ type: 'sell', sym: stock.sym, qty, price: stock.price, time: Date.now() }, ...hist]);
    setPlayer(p => ({ ...p, tradeCount: p.tradeCount + 1 }));
    showReward(10, 5, `💰 ขาย ${stock.sym} ${qty} หุ้น`);
    setSelected(null);
  };

  // ============================================================
  // DEV PANEL
  // ============================================================
  const DevPanel = () => {
    return (
      <div className="fixed bottom-20 right-2 z-[80] bg-gray-900 text-white rounded-2xl p-3 w-52 shadow-2xl text-xs">
        <div className="font-bold text-yellow-400 mb-2 flex items-center gap-1"><Settings size={12}/> Dev Panel</div>
        <button onClick={() => gainExp(100)} className="w-full mb-1 bg-blue-600 rounded-lg py-1 active:scale-95">+100 EXP</button>
        <button onClick={() => gainExp(500)} className="w-full mb-1 bg-blue-700 rounded-lg py-1 active:scale-95">+500 EXP</button>
        <button onClick={() => setPlayer(p => ({ ...p, coins: p.coins + 1000 }))} className="w-full mb-1 bg-yellow-600 rounded-lg py-1 active:scale-95">+1,000 Bua Coin</button>
        <button onClick={() => setPlayer(p => ({ ...p, level: p.level + 5, currentExp: 0, currentEvolutionStage: getEvolutionStage(p.level + 1) }))} className="w-full mb-1 bg-green-600 rounded-lg py-1 active:scale-95">+5 Level</button>
        <button onClick={() => setPlayer(p => ({ ...p, level: 10, currentExp: 0, currentEvolutionStage: getEvolutionStage(10), unlockedFeatureIds: [...p.unlockedFeatureIds, 'portfolio', 'money-quests'] }))} className="w-full mb-1 bg-purple-600 rounded-lg py-1 active:scale-95">Set Lv.10 + Unlock Portfolio</button>
        <button onClick={() => { setPlayer(p => ({ ...p, level: 20, currentExp: 0, currentEvolutionStage: getEvolutionStage(20), unlockedFeatureIds: [...FEATURE_UNLOCKS.map(f => f.id)] })); setShowPathModal(true); }} className="w-full mb-1 bg-orange-600 rounded-lg py-1 active:scale-95">Set Lv.20 + Path</button>
        <button onClick={() => setPlayer(p => ({ ...p, completedQuestIds: [...new Set([...p.completedQuestIds, ...MONEY_QUEST_IDS])] }))} className="w-full mb-1 bg-teal-600 rounded-lg py-1 active:scale-95">Complete Money Quests</button>
        <button onClick={() => setPlayer(p => ({ ...p, completedLessonIds: [...new Set([...p.completedLessonIds, ...STOCK101_LESSONS.map(l => l.id)])], earnedBadgeIds: [...new Set([...p.earnedBadgeIds, STOCK101_CHAPTER_BONUS.badgeId])] }))} className="w-full mb-1 bg-indigo-600 rounded-lg py-1 active:scale-95">Complete Stock 101</button>
        <button onClick={() => { localStorage.removeItem(STORAGE_KEY); window.location.reload(); }} className="w-full bg-red-700 rounded-lg py-1 active:scale-95 flex items-center justify-center gap-1"><RotateCcw size={10}/> Reset All</button>
      </div>
    );
  };

  // ============================================================
  // STAT PILL
  // ============================================================
  const StatPill = ({ icon: Icon, color, label, value, max }: any) => (
    <div className="flex items-center gap-1.5 bg-white rounded-xl px-2.5 py-1.5 shadow-sm flex-1">
      <Icon size={16} className={color} fill="currentColor"/>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-gray-500 leading-none">{label}</div>
        <div className="text-xs font-bold text-gray-800 leading-tight">{value}{max && <span className="text-gray-400 font-normal"> / {max}</span>}</div>
      </div>
    </div>
  );

  // ============================================================
  // HOME SCREEN
  // ============================================================
  const HomeScreen = () => {
    const availQuests = QUESTS.filter(q => ['available', 'in-progress', 'reward'].includes(getQuestStatus(q)));
    const nextQuest = availQuests[0];
    return (
      <div className="pb-24">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 bg-gradient-to-b from-sky-100 to-sky-50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center border-2 border-red-400 overflow-hidden">
              <img src={BUA_IMG} alt="Bua" className="w-full h-full object-contain"/>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="font-bold text-gray-800">Lv.{player.level}</div>
                <div className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">{evoInfo.name}</div>
              </div>
              {/* EXP bar */}
              <div className="h-2 bg-white rounded-full overflow-hidden shadow-inner mt-1">
                <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, (player.currentExp / expNeeded) * 100)}%` }}/>
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5">EXP {player.currentExp} / {expNeeded}</div>
            </div>
            <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 shadow-md">
              <BuaCoinIcon size={20}/>
              <span className="font-bold text-gray-800 text-sm">{player.coins.toLocaleString()}</span>
            </div>
            <button onClick={() => setPlayer(p => ({ ...p, checkedInToday: false, happy: Math.max(20, p.happy - 15), energy: Math.max(20, p.energy - 15) }))}
              className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center relative">
              <Bell size={16} className="text-gray-600"/>
              {!player.checkedInToday && <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"/>}
            </button>
          </div>

          {/* Learning phase banner */}
          <div className={`bg-${phaseInfo.color}-50 border border-${phaseInfo.color}-200 rounded-xl px-3 py-2 mb-3 flex items-center justify-between`}>
            <div>
              <div className="text-[10px] text-gray-500">เฟสการเรียนรู้</div>
              <div className="font-bold text-gray-800 text-xs">{phaseInfo.name}</div>
            </div>
            {nextUnlock && (
              <div className="text-right">
                <div className="text-[10px] text-gray-500">ปลดล็อกถัดไป Lv.{nextUnlock.requiredLevel}</div>
                <div className="text-xs font-bold text-blue-600">{nextUnlock.icon} {nextUnlock.name}</div>
              </div>
            )}
          </div>

          {/* Mascot scene */}
          <div className="relative rounded-3xl overflow-hidden shadow-inner"
            style={{ backgroundImage: `url(${sceneBgImg})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '260px' }}>
            <div className="absolute top-4 left-3 bg-white rounded-2xl rounded-bl-sm px-3 py-2 shadow-md max-w-[60%] z-10">
              <div className="text-[11px] text-gray-700 leading-snug">
                {mood === 'happy' ? `สวัสดี! Lv.${player.level} แล้วนะ พร้อมเรียนรู้ต่อไหม? 😎` : 'หิวจังเลย... ให้อาหารหน่อยน้า 🥺'}
              </div>
              <div className="absolute -bottom-1 left-3 w-2 h-2 bg-white transform rotate-45"/>
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10"
              style={{ background: 'transparent', animation: 'float 3s ease-in-out infinite' }}>
              <BuaMascot size={160} mood={mood} stage={mascotStage} evolutionStage={evoStage} investmentPath={player.selectedInvestmentPath}/>
            </div>
            <div className="absolute right-2 top-4 flex flex-col gap-1.5 z-20">
              <button onClick={claimCheckin} className="bg-white rounded-2xl w-12 h-12 shadow-lg flex flex-col items-center justify-center relative active:scale-95 transition">
                <Gift size={17} className="text-red-500"/><div className="text-[8px] font-bold text-gray-700">เช็คอิน</div>
                {!player.checkedInToday && <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">1</div>}
              </button>
              <button onClick={() => setScreen('quests')} className="bg-white rounded-2xl w-12 h-12 shadow-lg flex flex-col items-center justify-center active:scale-95 transition">
                <Target size={17} className="text-blue-500"/><div className="text-[8px] font-bold text-gray-700">ภารกิจ</div>
              </button>
              <button onClick={() => setScreen('friends')} className="bg-white rounded-2xl w-12 h-12 shadow-lg flex flex-col items-center justify-center active:scale-95 transition">
                <Users size={17} className="text-pink-500"/><div className="text-[8px] font-bold text-gray-700">Friend</div>
              </button>
              <button onClick={() => setModal('shop')} className="bg-white rounded-2xl w-12 h-12 shadow-lg flex flex-col items-center justify-center active:scale-95 transition">
                <ShoppingBag size={17} className="text-orange-500"/><div className="text-[8px] font-bold text-gray-700">ร้านค้า</div>
              </button>
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <StatPill icon={Heart} color="text-pink-500"   label="ความสุข"  value={player.happy}  max={100}/>
            <StatPill icon={Zap}   color="text-yellow-500" label="พลังงาน"  value={player.energy} max={100}/>
            <div className="flex items-center gap-1.5 bg-white rounded-xl px-2.5 py-1.5 shadow-sm flex-1">
              <BuaCoinIcon size={24} className="shrink-0"/>
              <div className="flex-1 min-w-0"><div className="text-[10px] text-gray-500">Bua Coin</div><div className="text-xs font-bold">{player.coins.toLocaleString()}</div></div>
            </div>
          </div>
        </div>

        {/* Next quest card */}
        <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="font-bold text-gray-800 text-sm">ภารกิจวันนี้</div>
            <button onClick={() => setScreen('quests')} className="text-xs text-blue-500 flex items-center gap-1 font-medium">ดูทั้งหมด <ChevronRight size={14}/></button>
          </div>
          {nextQuest ? (
            <div className="flex items-center gap-3">
              <div className="text-3xl">{nextQuest.icon}</div>
              <div className="flex-1">
                <div className="font-bold text-gray-800 text-sm">{nextQuest.title}</div>
                <div className="text-xs text-gray-500 mb-1">{nextQuest.desc}</div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-bold">⭐ +{nextQuest.exp}</span>
                  <span className="bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full font-bold inline-flex items-center gap-1"><BuaCoinIcon size={12}/> +{nextQuest.coins}</span>
                </div>
              </div>
              {getQuestStatus(nextQuest) === 'reward' ? (
                <button onClick={() => claimQuestReward(nextQuest)}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow active:scale-95">รับรางวัล</button>
              ) : (
                <button onClick={() => { if (nextQuest.type === 'trade') setScreen('invest'); else if (nextQuest.type === 'action') setModal('shop'); else startQuest(nextQuest); }}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow active:scale-95">{getQuestStatus(nextQuest) === 'in-progress' ? 'ทำต่อ' : 'เริ่ม'}</button>
              )}
            </div>
          ) : <div className="text-center text-gray-400 text-sm py-4">🎉 เควสต์ที่มีทำเสร็จหมดแล้ว!</div>}
        </div>

        {/* Lesson card */}
        <div className="mx-4 mt-3">
          <button onClick={() => setScreen('lessons')} className="w-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 shadow-md text-left text-white overflow-hidden relative">
            <div className="absolute -right-5 -bottom-8 text-8xl opacity-15">📘</div>
            <div className="relative flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <PlayCircle size={26}/>
              </div>
              <div className="flex-1">
                <div className="text-[10px] opacity-80 font-bold">Bua Learning Journey</div>
                <div className="font-black text-base">บทที่ 1: พื้นฐานการลงทุนในหุ้น 101</div>
                <div className="text-xs opacity-80 mt-0.5">
                  เรียนผ่านวิดีโอ 5 คลิป + Quiz หลังคลิป
                </div>
              </div>
              <ChevronRight size={18} className="opacity-80"/>
            </div>
            <div className="relative mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-700"
                style={{ width: `${(STOCK101_LESSONS.filter(l => player.completedLessonIds.includes(l.id)).length / STOCK101_LESSONS.length) * 100}%` }}/>
            </div>
            <div className="relative text-[10px] opacity-80 mt-1">
              เรียนจบแล้ว {STOCK101_LESSONS.filter(l => player.completedLessonIds.includes(l.id)).length}/{STOCK101_LESSONS.length} คลิป
            </div>
          </button>
        </div>

        {/* Portfolio card */}
        <div className="mx-4 mt-3">
          {portfolioUnlocked ? (
            <button onClick={() => setScreen('invest')} className="w-full bg-white rounded-2xl p-4 shadow-md text-left">
              <div className="font-bold text-gray-800 text-sm mb-2">พอร์ตลงทุนของฉัน</div>
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-3 flex items-center gap-3">
                <div className="flex-1"><div className="text-[10px] text-gray-500">มูลค่ารวม</div><div className="font-bold text-lg text-gray-800">{fmt(totalValue, 0)} <span className="text-xs text-gray-500">บาท</span></div></div>
                <div className="text-right"><div className="text-[10px] text-gray-500">กำไร/ขาดทุน</div><div className={`font-bold text-sm ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>{totalPnL >= 0 ? '+' : ''}{fmt(totalPnLPct)}%</div></div>
                <ChevronRight size={16} className="text-gray-400"/>
              </div>
            </button>
          ) : (
            <div className="bg-white rounded-2xl p-4 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <Lock size={16} className="text-gray-400"/><div className="font-bold text-gray-500 text-sm">พอร์ตจำลอง</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-gray-500 mb-2">ต้องการเพื่อปลดล็อก</div>
                {portfolioChecklist.slice(0, 4).map((c, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs mb-1">
                    {c.done ? <CheckCircle size={12} className="text-green-500"/> : <div className="w-3 h-3 rounded-full border border-gray-300"/>}
                    <span className={c.done ? 'text-green-600 font-bold' : 'text-gray-500'}>{c.label}</span>
                  </div>
                ))}
                <div className="text-[10px] text-gray-400 mt-1">{portfolioChecklist.filter(c => c.done).length} / {portfolioChecklist.length} เงื่อนไข</div>
              </div>
            </div>
          )}
        </div>

        {player.level >= 20 && (
          <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{selectedPathInfo?.icon ?? '🌟'}</div>
              <div className="flex-1">
                <div className="font-bold text-gray-800 text-sm">เส้นทางลงทุน</div>
                {selectedPathInfo ? (
                  <>
                    <div className="text-xs font-bold text-blue-600">{selectedPathInfo.name}</div>
                    <div className="text-[11px] text-gray-500">{selectedPathInfo.style}</div>
                  </>
                ) : (
                  <div className="text-xs text-gray-500">เลือกสไตล์การลงทุนของคุณและน้องบัว</div>
                )}
              </div>
              {!selectedPathInfo && (
                <button onClick={() => setShowPathModal(true)}
                  className="bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs font-bold px-3 py-2 rounded-full active:scale-95">
                  เลือก
                </button>
              )}
            </div>
          </div>
        )}

        {/* Check-in 7-day */}
        <div className="mx-4 mt-3 mb-3 bg-white rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="font-bold text-gray-800 text-sm flex items-center gap-1.5"><Flame size={16} className="text-orange-500"/> เช็คอิน 7 วัน</div>
            <div className="text-xs text-orange-500 font-bold">{player.streak} วัน 🔥</div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {CHECKIN_REWARDS.map((r, i) => {
              const claimed = i < player.streak % 7;
              const today   = i === player.streak % 7 && !player.checkedInToday;
              return (
                <div key={i} className={`rounded-lg p-1 text-center border-2 ${claimed ? 'bg-green-50 border-green-300' : today ? 'bg-yellow-50 border-yellow-400' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="text-[8px] text-gray-500 font-bold">วัน {i+1}</div>
                  <div className="text-sm flex justify-center">{claimed ? '✅' : i === 6 ? '🎁' : <BuaCoinIcon size={14}/>}</div>
                  <div className="text-[8px] font-bold text-gray-700">+{r}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ============================================================
  // LESSON SCREEN (Chapter 1: Stock 101)
  // ============================================================
  const LessonScreen = () => {
    const firstIncomplete = STOCK101_LESSONS.find(l => !player.completedLessonIds.includes(l.id)) ?? STOCK101_LESSONS[0];
    const [activeLessonId, setActiveLessonId] = useState(firstIncomplete.id);
    const [quizOpen, setQuizOpen] = useState(false);
    const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

    const completedCount = STOCK101_LESSONS.filter(l => player.completedLessonIds.includes(l.id)).length;
    const activeLesson = STOCK101_LESSONS.find(l => l.id === activeLessonId) ?? firstIncomplete;
    const activeIndex = STOCK101_LESSONS.findIndex(l => l.id === activeLesson.id);
    const activeCompleted = player.completedLessonIds.includes(activeLesson.id);
    const activeUnlocked = activeIndex === 0 || player.completedLessonIds.includes(STOCK101_LESSONS[activeIndex - 1]?.id);

    const openLesson = (lesson: VideoLesson, unlocked: boolean) => {
      if (!unlocked) return;
      setActiveLessonId(lesson.id);
      setQuizOpen(false);
      setQuizAnswer(null);
    };

    const completeVideoLesson = (lesson: VideoLesson) => {
      const alreadyCompleted = player.completedLessonIds.includes(lesson.id);
      if (!alreadyCompleted) {
        const nextCompleted = [...new Set([...player.completedLessonIds, lesson.id])];
        const chapterCompleted = STOCK101_LESSONS.every(item => nextCompleted.includes(item.id));
        const totalRewardExp = lesson.exp + (chapterCompleted ? STOCK101_CHAPTER_BONUS.exp : 0);
        const totalRewardCoins = lesson.coins + (chapterCompleted ? STOCK101_CHAPTER_BONUS.coins : 0);

        setPlayer(p => {
          return {
            ...p,
            completedLessonIds: nextCompleted,
            lessonCount: p.lessonCount + 1,
            earnedBadgeIds: chapterCompleted ? [...new Set([...p.earnedBadgeIds, STOCK101_CHAPTER_BONUS.badgeId])] : p.earnedBadgeIds,
          };
        });
        showReward(
          totalRewardExp,
          totalRewardCoins,
          chapterCompleted
            ? `จบบทหุ้น 101 แล้ว! ได้ Badge ${STOCK101_CHAPTER_BONUS.badgeName}`
            : `ผ่าน Quiz ${lesson.order}/5 แล้ว!`
        );
      }

      const nextLesson = STOCK101_LESSONS[activeIndex + 1];
      if (nextLesson) {
        setActiveLessonId(nextLesson.id);
        setQuizOpen(false);
        setQuizAnswer(null);
      } else {
        setQuizOpen(false);
      }
    };

    return (
      <div className="pb-24 px-4 pt-4 bg-gradient-to-b from-blue-50 via-indigo-50 to-white min-h-screen">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[10px] text-blue-500 font-bold">Bua Learning Journey</div>
            <div className="font-black text-xl text-gray-800">บทที่ 1: พื้นฐานการลงทุนในหุ้น 101</div>
            <div className="text-xs text-gray-500">ดูคลิป → ทำ Quiz → ปลดล็อกคลิปถัดไป</div>
          </div>
          <button onClick={() => setScreen('home')} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center active:scale-95">
            <X size={16} className="text-gray-500"/>
          </button>
        </div>

        <div className="bg-white rounded-3xl p-4 shadow-md mb-4 border border-blue-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-pink-100 flex items-center justify-center">
              <BuaMascot size={52} mood="happy" stage={1} evolutionStage="bua-seed"/>
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-800 text-sm">เป้าหมายบทนี้</div>
              <div className="text-xs text-gray-500 leading-relaxed">ให้น้องบัวเข้าใจหุ้นตั้งแต่ความหมาย การซื้อขาย Mindset การอ่านงบ ไปจนถึงการคิดก่อนซื้อ/ถือ/ขาย</div>
            </div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700"
              style={{ width: `${(completedCount / STOCK101_LESSONS.length) * 100}%` }}/>
          </div>
          <div className="text-[10px] text-gray-500 mt-1 text-right">เรียนจบ {completedCount}/{STOCK101_LESSONS.length} คลิป</div>
          <div className="flex items-center justify-between gap-2 mt-1">
            <div className="text-[10px] text-orange-600 font-bold">
              โบนัสจบบท: +{STOCK101_CHAPTER_BONUS.exp}⭐ +{STOCK101_CHAPTER_BONUS.coins} Coin +Badge
            </div>
            <div className="text-[10px] text-gray-500 text-right">เรียนจบ {completedCount}/{STOCK101_LESSONS.length} คลิป</div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {STOCK101_LESSONS.map((lesson, index) => {
            const completed = player.completedLessonIds.includes(lesson.id);
            const unlocked = index === 0 || player.completedLessonIds.includes(STOCK101_LESSONS[index - 1]?.id);
            const active = lesson.id === activeLesson.id;
            return (
              <button key={lesson.id} onClick={() => openLesson(lesson, unlocked)}
                className={`w-full rounded-2xl p-3 text-left border transition active:scale-[0.99] ${
                  active ? 'bg-blue-600 border-blue-600 text-white shadow-md' :
                  completed ? 'bg-green-50 border-green-200 text-gray-800' :
                  unlocked ? 'bg-white border-blue-100 text-gray-800 shadow-sm' :
                  'bg-gray-50 border-gray-100 text-gray-400'
                }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    active ? 'bg-white/20' : completed ? 'bg-green-500 text-white' : unlocked ? 'bg-blue-50 text-blue-500' : 'bg-gray-200'
                  }`}>
                    {completed ? <CheckCircle size={18}/> : unlocked ? <PlayCircle size={18}/> : <Lock size={16}/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold opacity-80">คลิป {lesson.order}/5</div>
                    <div className="font-bold text-sm leading-tight">{lesson.title}</div>
                    <div className={`text-[11px] mt-0.5 ${active ? 'text-white/80' : 'text-gray-500'}`}>{lesson.focus}</div>
                    <div className={`flex items-center gap-2 mt-1 text-[10px] font-bold ${active ? 'text-white' : 'text-blue-500'}`}>
                      <span className={`${active ? 'bg-white/20' : 'bg-blue-50'} px-2 py-0.5 rounded-full`}>⭐ +{lesson.exp} EXP</span>
                      <span className={`${active ? 'bg-white/20' : 'bg-yellow-50 text-yellow-700'} px-2 py-0.5 rounded-full inline-flex items-center gap-1`}><BuaCoinIcon size={11}/> +{lesson.coins}</span>
                    </div>
                  </div>
                  <ChevronRight size={15} className={active ? 'text-white/80' : 'text-gray-300'}/>
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-3xl shadow-md overflow-hidden border border-blue-100">
          {!activeUnlocked ? (
            <div className="p-5 text-center">
              <Lock size={28} className="mx-auto text-gray-300 mb-2"/>
              <div className="font-bold text-gray-700">คลิปนี้ยังล็อกอยู่</div>
              <div className="text-xs text-gray-500 mt-1">เรียนคลิปก่อนหน้าและผ่าน Quiz ก่อนนะ</div>
            </div>
          ) : (
            <>
              <div className="relative aspect-video bg-gray-900 overflow-hidden">
                <img src={activeLesson.thumbnailUrl} alt={activeLesson.title} className="w-full h-full object-cover opacity-90"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10"/>
                <div className="absolute inset-0 flex items-center justify-center">
                  <a href={activeLesson.url} target="_blank" rel="noreferrer"
                    className="w-20 h-20 rounded-full bg-red-600 text-white shadow-2xl flex items-center justify-center active:scale-95">
                    <PlayCircle size={42} fill="currentColor"/>
                  </a>
                </div>
                <div className="absolute left-4 right-4 bottom-4">
                  <div className="text-white text-[10px] font-bold opacity-80 mb-1">YouTube Lesson</div>
                  <div className="text-white font-black text-lg leading-tight drop-shadow">{activeLesson.title}</div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="text-[10px] text-blue-500 font-bold">คลิป {activeLesson.order}/5</div>
                    <div className="font-black text-gray-800 text-lg leading-tight">{activeLesson.title}</div>
                  </div>
                  {activeCompleted && <div className="bg-green-100 text-green-600 text-[10px] font-bold px-2 py-1 rounded-full shrink-0">เรียนจบแล้ว</div>}
                </div>

                <div className="bg-blue-50 rounded-2xl p-3 mb-3 border border-blue-100">
                  <div className="text-[10px] text-blue-600 font-bold mb-1">จำให้ได้หลังดูคลิป</div>
                  <ul className="space-y-1">
                    {activeLesson.summary.map(point => (
                      <li key={point} className="text-xs text-gray-700 leading-relaxed flex gap-2">
                        <span className="text-blue-400">•</span><span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`rounded-2xl p-3 mb-3 border ${
                  activeCompleted ? 'bg-green-50 border-green-200' : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className={`text-[10px] font-bold mb-1 ${activeCompleted ? 'text-green-600' : 'text-orange-600'}`}>
                        {activeCompleted ? 'รับรางวัลคลิปนี้แล้ว' : 'รางวัลเมื่อผ่าน Quiz คลิปนี้'}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-white rounded-full px-2.5 py-1 text-xs font-black text-blue-600 shadow-sm">⭐ +{activeLesson.exp} EXP</span>
                        <span className="bg-white rounded-full px-2.5 py-1 text-xs font-black text-yellow-700 shadow-sm inline-flex items-center gap-1"><BuaCoinIcon size={13}/> +{activeLesson.coins} Bua Coin</span>
                      </div>
                    </div>
                    {activeCompleted ? <CheckCircle size={20} className="text-green-500 shrink-0"/> : <Gift size={20} className="text-orange-500 shrink-0"/>}
                  </div>
                  {activeLesson.order === STOCK101_LESSONS.length && !player.earnedBadgeIds.includes(STOCK101_CHAPTER_BONUS.badgeId) && (
                    <div className="mt-2 bg-white/70 rounded-xl p-2 text-[11px] text-orange-700 font-bold">
                      🎁 โบนัสจบบท: +{STOCK101_CHAPTER_BONUS.exp} EXP +{STOCK101_CHAPTER_BONUS.coins} Bua Coin และ Badge {STOCK101_CHAPTER_BONUS.badgeName}
                    </div>
                  )}
                </div>

                <a href={activeLesson.url} target="_blank" rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-red-500 text-white font-bold py-3 rounded-full shadow active:scale-95 mb-3">
                  <PlayCircle size={18} fill="currentColor"/> เปิดดูคลิปบน YouTube
                </a>

                {!quizOpen && !activeCompleted && (
                  <button onClick={() => setQuizOpen(true)}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 rounded-full shadow active:scale-95">
                    ดูจบแล้ว ทำ Quiz
                  </button>
                )}

                {(quizOpen || activeCompleted) && (
                  <div className="border-t pt-4 mt-4">
                    <div className="font-bold text-gray-800 text-sm mb-2">Quiz หลังบทเรียน</div>
                    <div className="bg-gray-50 rounded-2xl p-3 text-sm font-medium text-gray-800 mb-3">{activeLesson.question}</div>
                    <div className="space-y-2">
                      {activeLesson.options.map((option, index) => {
                        const selectedAnswer = quizAnswer === index;
                        const showResult = activeCompleted || quizAnswer !== null;
                        const correctAnswer = index === activeLesson.correct;
                        return (
                          <button key={option} disabled={activeCompleted}
                            onClick={() => setQuizAnswer(index)}
                            className={`w-full text-left rounded-2xl p-3 border-2 text-sm transition ${
                              showResult && correctAnswer ? 'bg-green-50 border-green-400 text-green-700' :
                              showResult && selectedAnswer && !correctAnswer ? 'bg-red-50 border-red-400 text-red-700' :
                              selectedAnswer ? 'bg-blue-50 border-blue-400 text-blue-700' :
                              'bg-white border-gray-100 text-gray-700'
                            }`}>
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                showResult && correctAnswer ? 'bg-green-500 text-white' :
                                showResult && selectedAnswer && !correctAnswer ? 'bg-red-500 text-white' :
                                selectedAnswer ? 'bg-blue-500 text-white' :
                                'bg-gray-100 text-gray-500'
                              }`}>
                                {String.fromCharCode(65 + index)}
                              </div>
                              <span>{option}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {!activeCompleted && quizAnswer !== null && (
                      quizAnswer === activeLesson.correct ? (
                        <button onClick={() => completeVideoLesson(activeLesson)}
                          className="w-full mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 rounded-full shadow active:scale-95">
                          {activeLesson.order === STOCK101_LESSONS.length
                            ? `รับรางวัลรวม +${activeLesson.exp + STOCK101_CHAPTER_BONUS.exp}⭐ +${activeLesson.coins + STOCK101_CHAPTER_BONUS.coins} Coin`
                            : `รับรางวัล +${activeLesson.exp}⭐ +${activeLesson.coins} Coin และปลดล็อกต่อไป`}
                        </button>
                      ) : (
                        <button onClick={() => setQuizAnswer(null)}
                          className="w-full mt-4 bg-orange-500 text-white font-bold py-3 rounded-full shadow active:scale-95">
                          ยังไม่ถูก ลองตอบใหม่อีกครั้ง
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // ============================================================
  // QUESTS SCREEN
  // ============================================================
  const QuestsScreen = () => {
    const [tab, setTab] = useState<QuestStatus>('available');
    const questGroups = QUESTS.reduce<Record<QuestStatus, Quest[]>>((groups, q) => {
      groups[getQuestStatus(q)].push(q);
      return groups;
    }, { available: [], 'in-progress': [], reward: [], done: [], locked: [] });

    const renderQuestAction = (q: Quest) => {
      const status = getQuestStatus(q);
      if (status === 'reward') {
        return <button onClick={() => claimQuestReward(q)} className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-2 rounded-full active:scale-95">รับรางวัล</button>;
      }
      if (status === 'done') {
        return <CheckCircle size={18} className="text-green-500"/>;
      }
      if (status === 'locked') {
        return <Lock size={16} className="text-gray-300"/>;
      }
      if (q.type === 'action') {
        return <button onClick={() => setModal('shop')} className="bg-orange-500 text-white text-xs font-bold px-3 py-2 rounded-full active:scale-95">ทำเลย</button>;
      }
      if (q.type === 'trade') {
        return <button onClick={() => setScreen('invest')} className="bg-purple-500 text-white text-xs font-bold px-3 py-2 rounded-full active:scale-95">ไปเทรด</button>;
      }
      return <button onClick={() => startQuest(q)} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-3 py-2 rounded-full active:scale-95">{status === 'in-progress' ? 'ทำต่อ' : 'เริ่ม'}</button>;
    };

    const QuestCard = ({ q }: { q: Quest }) => {
      const status = getQuestStatus(q);
      const missingQuest = (q.prerequisiteQuestIds ?? []).find(id => !player.completedQuestIds.includes(id));
      const lockedText = player.level < q.requiredLevel
        ? `ปลดล็อกเมื่อถึง Level ${q.requiredLevel}`
        : missingQuest
          ? `ต้องทำ "${QUESTS.find(x => x.id === missingQuest)?.title ?? missingQuest}" ก่อน`
          : 'ต้องเรียนบทก่อนหน้าก่อน';
      return (
        <div className={`bg-white rounded-2xl p-4 shadow-sm border ${status === 'done' ? 'border-green-200 opacity-75' : status === 'locked' ? 'border-gray-100 opacity-50' : status === 'reward' ? 'border-yellow-200' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className="text-3xl">{q.icon}</div>
            <div className="flex-1">
              <div className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                {q.title}
                {q.category === 'money-management' && <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">จัดการเงิน</span>}
              </div>
              <div className="text-xs text-gray-500 mb-1.5">{status === 'locked' ? lockedText : q.desc}</div>
              {status !== 'locked' && status !== 'done' && (
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-bold">⭐ +{q.exp}</span>
                  <span className="bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full font-bold inline-flex items-center gap-1"><BuaCoinIcon size={12}/> +{q.coins}</span>
                  {q.badgeId && <span className="bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full font-bold">🏅 Badge</span>}
                </div>
              )}
              {status === 'done' && <div className="text-xs text-green-600 font-medium">สำเร็จและรับรางวัลแล้ว</div>}
              {status === 'reward' && <div className="text-xs text-yellow-700 font-medium">ทำสำเร็จแล้ว รอรับรางวัล</div>}
            </div>
            {renderQuestAction(q)}
          </div>
        </div>
      );
    };

    const activeQuests = questGroups[tab];
    return (
      <div className="pb-24 min-h-screen bg-gradient-to-b from-sky-50 to-white">
        <div className="px-4 pt-4 pb-2">
          <div className="font-bold text-xl text-gray-800 mb-1">ภารกิจ</div>
          <div className="text-xs text-gray-500">เรียนรู้และรับรางวัล!</div>
        </div>
        <div className="grid grid-cols-4 gap-1.5 px-4 mb-3">
          {([
            ['available', 'พร้อมทำ'],
            ['in-progress', 'กำลังทำ'],
            ['reward', 'รับรางวัล'],
            ['done', 'สำเร็จ'],
          ] as [QuestStatus, string][]).map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`py-2 rounded-full text-[10px] font-bold ${tab === id ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 border'}`}>
              {label} ({questGroups[id].length})
            </button>
          ))}
        </div>
        <div className="px-4 space-y-3">
          {activeQuests.length === 0 && <div className="text-center text-gray-400 text-sm py-10">ยังไม่มีเควสต์ในสถานะนี้</div>}
          {activeQuests.map(q => <QuestCard key={q.id} q={q}/>)}
          {tab === 'available' && questGroups.locked.slice(0, 3).map(q => <QuestCard key={q.id} q={q}/>)}
        </div>
      </div>
    );
  };

  // ============================================================
  // INVEST SCREEN
  // ============================================================
  const InvestScreen = () => {
    if (!portfolioUnlocked) {
      return (
        <div className="pb-24 min-h-screen bg-gradient-to-b from-purple-50 to-white px-4 pt-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">🔒</div>
            <div className="font-bold text-xl text-gray-800 mb-2">พอร์ตจำลอง</div>
            <div className="text-sm text-gray-500">Portfolio Simulation จะปลดล็อกเมื่อคุณถึง Level 10 และผ่านบทเรียนที่กำหนด</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
            <div className="font-bold text-gray-800 text-sm mb-3">เงื่อนไขปลดล็อก</div>
            {portfolioChecklist.map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-sm mb-2">
                {c.done ? <CheckCircle size={16} className="text-green-500 flex-shrink-0"/> : <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0"/>}
                <span className={c.done ? 'text-green-700 font-medium' : 'text-gray-500'}>{c.label}</span>
                {'current' in c && c.current && <span className="ml-auto text-xs text-gray-400">{c.current}</span>}
              </div>
            ))}
          </div>
          <button onClick={() => setScreen('quests')} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-full shadow">ไปทำเควสต์ต่อ 📚</button>
        </div>
      );
    }

    // Unlocked — full trading UI
    const filtered = stocks.filter(s => s.cat === cat);
    return (
      <div className="pb-24 min-h-screen bg-gray-50">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 px-4 pt-5 pb-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xl font-bold">ลงทุน</div>
            <button onClick={advanceDay} className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 active:scale-95"><Clock size={12}/> วันถัดไป</button>
          </div>
          <div className="bg-white/15 rounded-2xl p-3">
            <div className="text-[11px] opacity-80">มูลค่าพอร์ตรวม</div>
            <div className="text-2xl font-bold">{fmt(totalValue)} <span className="text-sm opacity-80">บาท</span></div>
            <div className="flex items-center gap-3 mt-1 text-xs">
              <div className="flex items-center gap-1"><Wallet size={12}/> เงินสด {fmt(tradingCash, 0)}</div>
              <div className={`flex items-center gap-1 font-bold ${totalPnL >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                {totalPnL >= 0 ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                {totalPnL >= 0 ? '+' : ''}{fmt(totalPnL)} ({totalPnLPct >= 0 ? '+' : ''}{fmt(totalPnLPct)}%)
              </div>
            </div>
            <div className="mt-3 bg-white/15 rounded-xl p-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold">Portfolio Health Score</span>
                <span className="font-black">{portfolioHealthScore}/100</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${portfolioHealthScore >= 75 ? 'bg-green-300' : portfolioHealthScore >= 50 ? 'bg-yellow-300' : 'bg-red-300'}`}
                  style={{ width: `${portfolioHealthScore}%` }}/>
              </div>
              <div className="text-[10px] opacity-80 mt-1">คะแนนจากการกระจายพอร์ต ความกระจุกตัว และเงินสดคงเหลือ</div>
            </div>
          </div>
        </div>
        <div className="flex bg-white border-b">
          {(['market','portfolio','history'] as const).map(t => (
            <button key={t} onClick={() => setInvestTab(t)} className={`flex-1 py-3 text-sm font-bold transition ${investTab === t ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-400'}`}>
              {t === 'market' ? 'ตลาด' : t === 'portfolio' ? 'พอร์ตของฉัน' : 'ประวัติ'}
            </button>
          ))}
        </div>
        {investTab === 'market' && (
          <div className="pb-4">
            <div className="flex gap-2 px-4 py-3">
              <button onClick={() => setCat('us')} className={`px-4 py-1.5 rounded-full text-xs font-bold ${cat === 'us' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border'}`}>หุ้นสหรัฐฯ</button>
              <button onClick={() => setCat('th')} className={`px-4 py-1.5 rounded-full text-xs font-bold ${cat === 'th' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border'}`}>หุ้นไทย</button>
            </div>
            <div className="px-3 space-y-1">
              {filtered.map(s => {
                const up = s.changePct >= 0;
                return (
                  <button key={s.sym} onClick={() => { setSelected(s); setTradeQty(1); }} className="w-full bg-white rounded-2xl p-3 flex items-center gap-3 shadow-sm active:scale-98 transition">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">{s.logo}</div>
                    <div className="text-left w-20 flex-shrink-0">
                      <div className="font-bold text-gray-800 text-sm">{s.sym}</div>
                      <div className="text-[10px] text-gray-400 truncate">{s.name}</div>
                    </div>
                    <div className="flex-1 h-9">
                      <ResponsiveContainer><LineChart data={s.spark}><YAxis domain={['dataMin','dataMax']} hide/><Line type="monotone" dataKey="v" stroke={up ? '#10B981' : '#EF4444'} strokeWidth={1.5} dot={false}/></LineChart></ResponsiveContainer>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-gray-800 text-sm">{fmt(s.price)}</div>
                      <div className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>{up ? '↗ +' : '↘ '}{fmt(s.changePct)}%</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {investTab === 'portfolio' && (
          <div className="p-4 space-y-3">
            {Object.keys(holdings).length === 0
              ? <div className="text-center text-gray-400 py-16"><PieIcon size={48} className="mx-auto mb-3 opacity-30"/><div className="text-sm">ยังไม่มีหุ้นในพอร์ต</div></div>
              : Object.entries(holdings).map(([sym, h]) => {
                  const st = stocks.find(s => s.sym === sym); if (!st) return null;
                  const val = st.price * h.shares, cost2 = h.avgCost * h.shares, pnl = val - cost2, pct = (pnl/cost2)*100, up = pnl >= 0;
                  return (
                    <button key={sym} onClick={() => { setSelected(st); setTradeQty(1); }} className="w-full bg-white rounded-2xl p-3 shadow-sm text-left active:scale-98">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">{st.logo}</div>
                        <div className="flex-1"><div className="font-bold text-gray-800 text-sm">{sym}</div><div className="text-[10px] text-gray-400">{h.shares} หุ้น @ {fmt(h.avgCost)}</div></div>
                        <div className="text-right"><div className="font-bold text-sm">{fmt(val)}</div><div className={`text-[11px] font-bold ${up ? 'text-green-600' : 'text-red-500'}`}>{up?'+':''}{fmt(pnl)} ({up?'+':''}{fmt(pct)}%)</div></div>
                      </div>
                    </button>
                  );
                })}
          </div>
        )}
        {investTab === 'history' && (
          <div className="p-4 space-y-2">
            {tradeHistory.length === 0
              ? <div className="text-center text-gray-400 py-16"><Clock size={48} className="mx-auto mb-3 opacity-30"/><div className="text-sm">ยังไม่มีประวัติ</div></div>
              : tradeHistory.map((t, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${t.type==='buy' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>{t.type==='buy'?'ซื้อ':'ขาย'}</div>
                    <div className="flex-1"><div className="font-bold text-sm">{t.sym}</div><div className="text-[10px] text-gray-400">{t.qty} หุ้น @ {fmt(t.price)}</div></div>
                    <div className="font-bold text-sm">{fmt(t.price*t.qty)}</div>
                  </div>
                ))}
          </div>
        )}
        <div className="px-4 py-2 text-[9px] text-amber-700 text-center bg-amber-50">⚠️ ข้อมูลจำลองเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุนจริง</div>
      </div>
    );
  };

  // ============================================================
  // NEWS SCREEN
  // ============================================================
  const NewsScreen = () => (
    <div className="pb-24 px-4 pt-4 bg-gradient-to-b from-sky-50 to-white min-h-screen">
      <div className="font-bold text-xl text-gray-800 mb-1">ข่าวตลาด</div>
      <div className="text-xs text-gray-500 mb-4">เรียนรู้จากเหตุการณ์การเงิน</div>
      <div className="space-y-3">
        {NEWS.map(n => {
          const read = player.readNews.includes(n.id);
          return (
            <button key={n.id} onClick={() => setModal({ news: n })} className="w-full bg-white rounded-2xl p-4 shadow-sm text-left">
              <div className="flex items-start gap-3">
                <div className="text-3xl">{n.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1"><span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">{n.tag}</span>{read && <CheckCircle size={12} className="text-green-500"/>}</div>
                  <div className="font-bold text-gray-800 text-sm mb-0.5">{n.title}</div>
                  <div className="text-xs text-gray-500">{n.summary}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  // ============================================================
  // PROFILE SCREEN
  // ============================================================
  const ProfileScreen = () => {
    const earned = BADGES.filter(b => player.earnedBadgeIds.includes(b.id));
    const CoreNode = ({ label, sub, reached }: { label: string; sub: string; reached: boolean }) => (
      <div className={`relative rounded-2xl p-3 border ${reached ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${reached ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
            {reached ? '✓' : '•'}
          </div>
          <div className="flex-1">
            <div className="font-black text-gray-800 text-sm">{label}</div>
            <div className="text-[10px] text-gray-500">{sub}</div>
          </div>
        </div>
      </div>
    );
    const PathMasterCard = ({ id, path }: { id: InvestmentPath; path: InvestmentPathInfo }) => {
      const selected = player.selectedInvestmentPath === id;
      const master = INVESTMENT_PATH_MASTERS[id];
      const pathUnlocked = player.level >= 20;
      const pathMasterReached = selected && player.level >= 35;
      return (
        <div className={`rounded-2xl p-3 border transition ${selected ? 'bg-gradient-to-r from-orange-50 to-pink-50 border-orange-300 shadow-sm' : pathUnlocked ? 'bg-white border-gray-100' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
          <div className="flex items-start gap-2">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${selected ? 'bg-white shadow-sm' : 'bg-gray-50'}`}>
              {path.imageUrl ? <img src={path.imageUrl} alt={path.name} className="w-full h-full object-contain"/> : <span className="text-xl">{path.icon}</span>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <div className="font-bold text-gray-800 text-xs">{path.name}</div>
                <span className="text-gray-300">→</span>
                <div className={`font-black text-xs ${pathMasterReached ? 'text-orange-600' : 'text-gray-700'}`}>{master.masterName}</div>
              </div>
              <div className="text-[10px] text-gray-500 leading-snug mt-0.5">{master.theme}</div>
              <div className="mt-2">
                {pathMasterReached ? (
                  <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">Master สำเร็จ</span>
                ) : selected ? (
                  <span className="text-[10px] bg-blue-100 text-blue-600 font-bold px-2 py-0.5 rounded-full">กำลังพัฒนา</span>
                ) : pathUnlocked ? (
                  <span className="text-[10px] bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded-full">ยังไม่ได้เลือก</span>
                ) : (
                  <span className="text-[10px] bg-gray-100 text-gray-400 font-bold px-2 py-0.5 rounded-full">ล็อก</span>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    };
    return (
      <div className="pb-24 px-4 pt-4 bg-gradient-to-b from-sky-50 to-white min-h-screen">
        <div className="font-bold text-xl text-gray-800 mb-4">โปรไฟล์</div>
        <div className="bg-gradient-to-br from-red-400 to-red-500 rounded-2xl p-4 text-white shadow-lg mb-4">
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/40"><BuaMascot size={70} stage={mascotStage} evolutionStage={evoStage} investmentPath={player.selectedInvestmentPath}/></div>
            <div className="flex-1">
              <div className="text-xs opacity-80">Lv.{player.level} — {evoInfo.name}</div>
              <div className="font-bold text-lg leading-tight">{evoInfo.desc}</div>
              <div className="text-xs opacity-70 mt-0.5">{phaseInfo.name}</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="bg-white/15 rounded-lg p-2 text-center"><div className="text-[10px] opacity-80">บทเรียน</div><div className="font-bold">{player.lessonCount}</div></div>
            <div className="bg-white/15 rounded-lg p-2 text-center"><div className="text-[10px] opacity-80">เทรด</div><div className="font-bold">{player.tradeCount}</div></div>
            <div className="bg-white/15 rounded-lg p-2 text-center"><div className="text-[10px] opacity-80">สตรีค</div><div className="font-bold">{player.streak}🔥</div></div>
          </div>
        </div>
        {player.level >= 20 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
            <div className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-1.5"><Target size={14} className="text-blue-500"/> เส้นทางลงทุน</div>
            {selectedPathInfo ? (
              <div className="flex items-start gap-3 bg-blue-50 rounded-xl p-3">
                <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center overflow-hidden shadow-sm border border-blue-100 shrink-0">
                  {selectedPathInfo.imageUrl ? <img src={selectedPathInfo.imageUrl} alt={selectedPathInfo.name} className="w-full h-full object-contain"/> : <span className="text-3xl">{selectedPathInfo.icon}</span>}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-800 text-sm">{selectedPathInfo.name}</div>
                  <div className="text-xs text-gray-600">{selectedPathInfo.style}</div>
                  <div className="text-[11px] text-blue-600 font-bold mt-1">จุดแข็ง: {selectedPathInfo.strength}</div>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowPathModal(true)} className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold py-3 rounded-full shadow active:scale-95">
                เลือกเส้นทางลงทุน
              </button>
            )}
          </div>
        )}
        {/* Master evolution tree */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
          <div className="font-bold text-gray-800 text-sm mb-1 flex items-center gap-1.5"><Trophy size={14} className="text-orange-500"/> Evolution Tree</div>
          <div className="text-xs text-gray-500 mb-4">เส้นทางการเติบโตจากน้องบัวเริ่มต้น ไปจนถึง Investment Master</div>

          <div className="space-y-2">
            <CoreNode label="Bua Seed" sub="Lv.1+ เริ่มรู้จักหุ้นและพื้นฐานการลงทุน" reached={player.level >= 1}/>
            <div className="ml-5 h-4 border-l-2 border-blue-100"/>
            <CoreNode label="Bua Saver" sub="Lv.5+ เข้าใจการออม เงินสำรอง และวินัยก่อนลงทุน" reached={player.level >= 5}/>
            <div className="ml-5 h-4 border-l-2 border-blue-100"/>
            <CoreNode label="Bua Investor" sub="Lv.10+ เริ่มสร้างพอร์ตจำลองและเข้าใจ Risk & Return" reached={player.level >= 10}/>
            <div className="ml-5 h-4 border-l-2 border-blue-100"/>
            <CoreNode label="Investment Paths" sub="Lv.20+ เลือกสายเฉพาะทางของน้องบัว" reached={player.level >= 20}/>
          </div>

          <div className="mt-4 pl-3 border-l-2 border-orange-100 space-y-2">
            {(Object.entries(INVESTMENT_PATHS) as [InvestmentPath, InvestmentPathInfo][]).map(([id, path]) => (
              <PathMasterCard key={id} id={id} path={path}/>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2">
            <div className={`rounded-2xl p-3 border ${player.level >= 50 ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-100 opacity-70'}`}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">🏅</div>
                <div className="flex-1">
                  <div className="font-black text-gray-800 text-sm">All Masters Completed</div>
                  <div className="text-[10px] text-gray-500">เป้าหมายระยะยาว: สะสมความเชี่ยวชาญครบทุกสาย</div>
                </div>
              </div>
            </div>
            <div className={`rounded-2xl p-3 border ${evoStage === 'investment-master' ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-70'}`}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">👑</div>
                <div className="flex-1">
                  <div className="font-black text-gray-800 text-sm">Investment Master</div>
                  <div className="text-[10px] text-gray-500">ปลายทางสูงสุดของน้องบัว: เข้าใจพอร์ต กลยุทธ์ และวินัยการลงทุน</div>
                </div>
                {evoStage === 'investment-master' && <CheckCircle size={16} className="text-yellow-600"/>}
              </div>
            </div>
          </div>
        </div>
        {/* Evolution stages */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
          <div className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-1.5"><Star size={14} className="text-yellow-500"/> วิวัฒนาการ</div>
          <div className="space-y-2">
            {(Object.entries(EVOLUTION_INFO) as [EvolutionStage, typeof EVOLUTION_INFO[EvolutionStage]][]).map(([key, info]) => {
              const reached = player.level >= info.minLevel;
              return (
                <div key={key} className={`flex items-center gap-2 p-2 rounded-xl ${reached ? 'bg-blue-50' : 'bg-gray-50 opacity-50'}`}>
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow text-base">{reached ? '🐣' : '🔒'}</div>
                  <div className="flex-1"><div className="text-[10px] text-gray-500">Lv.{info.minLevel}+</div><div className="font-bold text-xs text-gray-800">{info.name}</div></div>
                  {reached && <CheckCircle size={14} className="text-green-500"/>}
                </div>
              );
            })}
          </div>
        </div>
        {/* Badges */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-1.5"><Trophy size={14} className="text-yellow-500"/> ความสำเร็จ ({earned.length}/{BADGES.length})</div>
          <div className="grid grid-cols-4 gap-2">
            {BADGES.map(b => {
              const e = player.earnedBadgeIds.includes(b.id);
              return (
                <div key={b.id} className={`rounded-xl p-2 text-center ${e ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200' : 'bg-gray-50 opacity-50'}`}>
                  <div className="text-2xl">{e ? b.icon : '🔒'}</div>
                  <div className="text-[9px] font-bold text-gray-700 leading-tight mt-0.5">{b.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ============================================================
  // FRIEND SCREEN (Prototype)
  // ============================================================
  const FriendScreen = () => {
    const [selectedFriend, setSelectedFriend] = useState<FriendProfile | null>(null);

    if (selectedFriend) {
      const friendEvoStage = getEvolutionStage(selectedFriend.level);
      const friendEvoInfo = EVOLUTION_INFO[friendEvoStage];
      const friendPhaseInfo = PHASE_INFO[getLearningPhase(selectedFriend.level)];
      const friendPathInfo = selectedFriend.investmentPath ? INVESTMENT_PATHS[selectedFriend.investmentPath] : null;
      const friendMascotStage = selectedFriend.level >= 30 ? 4 : selectedFriend.level >= 20 ? 3 : selectedFriend.level >= 10 ? 2 : 1;
      const friendBgImg = friendEvoStage === 'investment-master' ? BG_MASTER_IMG : BG_IMG;

      return (
        <div className="pb-24 px-4 pt-4 bg-gradient-to-b from-pink-50 via-sky-50 to-white min-h-screen">
          <button onClick={() => setSelectedFriend(null)} className="text-xs font-bold text-blue-500 flex items-center gap-1 mb-3">
            ← กลับไปหน้ารายชื่อเพื่อน
          </button>

          <div className="bg-white rounded-3xl shadow-md overflow-hidden">
            <div className="relative min-h-[310px] overflow-hidden"
              style={{ backgroundImage: `url(${friendBgImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/10"/>
              <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
                <div className="bg-white/95 rounded-2xl px-3 py-2 shadow">
                  <div className="text-[10px] text-gray-500 font-bold">บ้านของเพื่อน</div>
                  <div className="font-black text-gray-800 text-xl">{selectedFriend.name}</div>
                </div>
                <div className="bg-white/95 rounded-2xl px-3 py-2 shadow text-right">
                  <div className="text-[10px] text-gray-500 font-bold">Level</div>
                  <div className="font-black text-blue-500 text-xl">Lv.{selectedFriend.level}</div>
                </div>
              </div>

              <div className="absolute top-24 left-4 bg-white rounded-2xl rounded-bl-sm px-3 py-2 shadow-md max-w-[58%] z-10">
                <div className="text-[11px] text-gray-700 leading-snug">
                  {selectedFriend.houseEmoji} ยินดีต้อนรับ! {selectedFriend.houseNote}
                </div>
                <div className="absolute -bottom-1 left-3 w-2 h-2 bg-white transform rotate-45"/>
              </div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
                style={{ background: 'transparent', animation: 'float 3s ease-in-out infinite' }}>
                <BuaMascot
                  size={190}
                  mood="happy"
                  stage={friendMascotStage}
                  evolutionStage={friendEvoStage}
                  investmentPath={selectedFriend.investmentPath}
                />
              </div>
            </div>

            <div className="p-4">
              <div className="font-bold text-gray-800 text-lg">{selectedFriend.title}</div>
              <div className="text-sm text-gray-600 leading-relaxed mt-1">{selectedFriend.bio}</div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3">
                  <div className="text-[10px] text-blue-500 font-bold">วิวัฒนาการ</div>
                  <div className="font-bold text-gray-800 text-sm">{friendEvoInfo.name}</div>
                  <div className="text-[11px] text-gray-500">{friendEvoInfo.desc}</div>
                </div>
                <div className="bg-pink-50 border border-pink-100 rounded-2xl p-3">
                  <div className="text-[10px] text-pink-500 font-bold">สาย/รูปแบบ</div>
                  <div className="font-bold text-gray-800 text-sm">{friendPathInfo ? `${friendPathInfo.icon} ${friendPathInfo.name}` : selectedFriend.title}</div>
                  <div className="text-[11px] text-gray-500">{friendPhaseInfo.name}</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-3">
                  <div className="text-[10px] text-yellow-600 font-bold">Bua Coin</div>
                  <div className="font-bold text-gray-800 text-sm inline-flex items-center gap-1"><BuaCoinIcon size={14}/> {selectedFriend.coins.toLocaleString()}</div>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-2xl p-3">
                  <div className="text-[10px] text-green-600 font-bold">บทเรียนโปรด</div>
                  <div className="font-bold text-gray-800 text-sm leading-tight">{selectedFriend.favoriteLesson}</div>
                </div>
              </div>

              {friendPathInfo && (
                <div className="mt-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-3 border border-blue-100">
                  <div className="text-[10px] text-blue-500 font-bold mb-1">จุดเด่นของสายนี้</div>
                  <div className="text-xs text-gray-700 leading-relaxed">{friendPathInfo.strength}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="pb-24 px-4 pt-4 bg-gradient-to-b from-pink-50 via-sky-50 to-white min-h-screen">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-bold text-xl text-gray-800">Friend</div>
            <div className="text-xs text-gray-500">เลือกเพื่อนเพื่อไปเยี่ยมบ้านน้องบัวของแต่ละคน</div>
          </div>
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center">
            <Users size={22} className="text-pink-500"/>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4 border border-pink-100">
          <div className="font-bold text-gray-800 text-sm mb-1">Prototype Mode</div>
          <div className="text-xs text-gray-500 leading-relaxed">
            ตอนนี้เป็นเพื่อนจำลอง 4 คน เพื่อทดสอบ flow รายชื่อเพื่อน → เยี่ยมบ้าน → ดูมาสคอต/Level/สายของเพื่อน
          </div>
        </div>

        <div className="space-y-3">
          {FRIENDS.map(friend => {
            const friendEvoStage = getEvolutionStage(friend.level);
            const friendEvoInfo = EVOLUTION_INFO[friendEvoStage];
            const friendPathInfo = friend.investmentPath ? INVESTMENT_PATHS[friend.investmentPath] : null;
            const friendMascotStage = friend.level >= 30 ? 4 : friend.level >= 20 ? 3 : friend.level >= 10 ? 2 : 1;

            return (
              <button key={friend.id} onClick={() => setSelectedFriend(friend)}
                className="w-full bg-white rounded-3xl p-3 shadow-sm text-left active:scale-[0.99] transition border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-50 to-pink-50 flex items-center justify-center border border-blue-100 overflow-hidden shrink-0">
                    <BuaMascot
                      size={74}
                      mood="happy"
                      stage={friendMascotStage}
                      evolutionStage={friendEvoStage}
                      investmentPath={friend.investmentPath}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-black text-gray-800">{friend.name}</div>
                      <div className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">Lv.{friend.level}</div>
                    </div>
                    <div className="text-xs font-bold text-gray-700">{friend.title}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">
                      {friendEvoInfo.name}{friendPathInfo ? ` • ${friendPathInfo.icon} ${friendPathInfo.name}` : ''} • {friend.favoriteLesson}
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-pink-500">
                      เยี่ยมบ้าน <ChevronRight size={12}/>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // ============================================================
  // QUEST MODAL (lesson + quiz)
  // ============================================================
  const QuestModal = () => {
    if (!modal || modal === 'shop' || modal?.news) return null;
    const q = modal as Quest;
    const isLesson = quizState.step === 'lesson' && q.lesson;
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
        <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="text-4xl">{q.icon}</div>
              <button onClick={() => setModal(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X size={16}/></button>
            </div>
            <div className="font-bold text-gray-800 text-lg mb-1">{q.title}</div>
            {isLesson && <>
              <div className="bg-blue-50 rounded-2xl p-3 my-3 border border-blue-100">
                <div className="text-[11px] font-bold text-blue-600 mb-1 flex items-center gap-1"><BookOpen size={12}/> บทเรียน</div>
                <div className="text-sm text-gray-700 leading-relaxed">{q.lesson}</div>
              </div>
              <button onClick={() => completeLesson(q)} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-full shadow">ทดสอบความรู้ →</button>
            </>}
            {!isLesson && <>
              <div className="bg-blue-50 rounded-2xl p-3 my-3 border border-blue-100">
                <div className="text-[11px] font-bold text-blue-600 mb-1">คำถาม</div>
                <div className="text-sm text-gray-800 font-medium">{q.question}</div>
              </div>
              <div className="space-y-2 mb-3">
                {(q.options ?? []).map((opt: string, i: number) => {
                  const sel = quizState.answer === i, show = quizState.answer !== null, ok = i === q.correct;
                  return (
                    <button key={i} onClick={() => quizState.answer === null && setQuizState({ ...quizState, answer: i })}
                      className={`w-full text-left p-3 rounded-2xl border-2 text-sm font-medium transition ${show&&ok ? 'bg-green-50 border-green-400 text-green-700' : show&&sel&&!ok ? 'bg-red-50 border-red-400 text-red-700' : sel ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${show&&ok ? 'bg-green-500 text-white' : show&&sel&&!ok ? 'bg-red-500 text-white' : sel ? 'bg-blue-500 text-white' : 'bg-white border border-gray-300'}`}>
                          {show&&ok ? '✓' : show&&sel&&!ok ? '✗' : String.fromCharCode(65+i)}
                        </div>
                        <span>{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              {quizState.answer !== null && (
                <button onClick={() => completeQuest(q, quizState.answer === q.correct)}
                  className={`w-full font-bold py-3 rounded-full shadow ${quizState.answer === q.correct ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : 'bg-gradient-to-r from-orange-400 to-orange-500 text-white'}`}>
                  {quizState.answer === q.correct ? `🎉 รับ +${q.exp}⭐ +${q.coins} Coin` : 'ลองใหม่อีกครั้ง'}
                </button>
              )}
            </>}
          </div>
        </div>
      </div>
    );
  };

  // SHOP MODAL
  const ShopModal = () => {
    if (modal !== 'shop') return null;
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-end" onClick={() => setModal(null)}>
        <div className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between">
            <div><div className="font-bold text-gray-800 flex items-center gap-2"><ShoppingBag size={18} className="text-orange-500"/> ร้านค้า</div><div className="text-[11px] text-gray-500">มี <span className="font-bold text-yellow-600 inline-flex items-center gap-1"><BuaCoinIcon size={12}/> {player.coins}</span></div></div>
            <button onClick={() => setModal(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X size={16}/></button>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            {SHOP.map(item => {
              const cannotAfford = player.coins < item.price;
              return (
                <div key={item.id} className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-3 border border-orange-100">
                  <div className="text-4xl text-center mb-1">{item.icon}</div>
                  <div className="font-bold text-xs text-center text-gray-800">{item.name}</div>
                  <div className="text-[10px] text-center text-gray-500 mt-1">+{item.happy}❤ +{item.energy}⚡</div>
                  <button
                    onClick={() => buyItem(item)}
                    disabled={cannotAfford}
                    className={`w-full mt-2 rounded-full py-1.5 text-xs font-bold inline-flex items-center justify-center gap-1 ${cannotAfford ? 'bg-gray-200 text-gray-400' : 'bg-orange-500 text-white'}`}
                  >
                    <BuaCoinIcon size={12}/> {item.price}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // NEWS MODAL
  const NewsModal = () => {
    if (!modal?.news) return null;
    const n = modal.news, read = player.readNews.includes(n.id);
    const finishReadingNews = () => {
      setPlayer(p => ({ ...p, readNews: [...p.readNews, n.id] }));
      showReward(40, 30, 'อ่านข่าวเสร็จ!');
      setModal(null);
    };
    const newsAction = read ? (
      <div className="text-center text-green-500 font-bold mt-4 text-sm">✓ อ่านแล้ว</div>
    ) : (
      <button
        onClick={finishReadingNews}
        className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-full shadow"
      >
        อ่านจบ +30 Coin +40⭐
      </button>
    );

    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-end" onClick={() => setModal(null)}>
        <div className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="text-2xl">{n.icon}</span><span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">{n.tag}</span></div>
            <button onClick={() => setModal(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X size={16}/></button>
          </div>
          <div className="p-4">
            <div className="font-bold text-gray-800 text-lg mb-2">{n.title}</div>
            <div className="text-sm text-gray-600 italic mb-3">{n.summary}</div>
            <div className="text-sm text-gray-700 leading-relaxed">{n.body}</div>
            {newsAction}
          </div>
        </div>
      </div>
    );
  };

  // TRADE MODAL
  const TradeModal = () => {
    if (!selected) return null;
    const selectedHolding = holdings[selected.sym];

    return (
      <div className="absolute inset-0 bg-black/40 z-50 flex items-end" onClick={() => setSelected(null)}>
        <div className="bg-white rounded-t-3xl w-full p-5" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl">{selected.logo}</div>
              <div><div className="font-bold text-gray-800">{selected.sym}</div><div className="text-xs text-gray-400">{selected.name}</div></div>
            </div>
            <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X size={16}/></button>
          </div>
          <div className="bg-gray-50 rounded-2xl p-3 mb-4">
            <div className="text-2xl font-bold text-gray-800">{fmt(selected.price)} <span className="text-xs text-gray-400">บาท</span></div>
            <div className={`text-xs font-bold ${selected.changePct >= 0 ? 'text-green-600' : 'text-red-500'}`}>{selected.changePct >= 0 ? '↗ +' : '↘ '}{fmt(selected.changePct)}% วันนี้</div>
            <div className="h-24 mt-1"><ResponsiveContainer><LineChart data={selected.spark}><YAxis domain={['dataMin','dataMax']} hide/><Line type="monotone" dataKey="v" stroke={selected.changePct >= 0 ? '#10B981' : '#EF4444'} strokeWidth={2} dot={false}/></LineChart></ResponsiveContainer></div>
          </div>
          {holdings[selected.sym] && <div className="bg-purple-50 rounded-xl p-2.5 mb-3 text-xs text-purple-700 flex justify-between"><span>ถืออยู่ {holdings[selected.sym].shares} หุ้น</span><span>ต้นทุน {fmt(holdings[selected.sym].avgCost)}</span></div>}
          {selectedHolding ? (
            <div className="bg-purple-50 rounded-xl p-2.5 mb-3 text-xs text-purple-700 flex justify-between">
              <span>ถืออยู่ {selectedHolding.shares} หุ้น</span>
              <span>ต้นทุน {fmt(selectedHolding.avgCost)}</span>
            </div>
          ) : null}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-gray-700">จำนวนหุ้น</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setTradeQty(q => Math.max(1, q-1))} className="w-9 h-9 rounded-full bg-gray-100 font-bold text-lg active:scale-95">−</button>
              <span className="font-bold text-lg w-10 text-center">{tradeQty}</span>
              <button onClick={() => setTradeQty(q => q+1)} className="w-9 h-9 rounded-full bg-gray-100 font-bold text-lg active:scale-95">+</button>
            </div>
          </div>
          <div className="text-center text-sm text-gray-500 mb-3">รวม <span className="font-bold text-gray-800">{fmt(selected.price * tradeQty)} บาท</span></div>
          <div className="flex gap-3">
            <button onClick={() => sellStock(selected, tradeQty)} disabled={!holdings[selected.sym]} className={`flex-1 py-3 rounded-full font-bold ${holdings[selected.sym] ? 'bg-red-500 text-white active:scale-95' : 'bg-gray-200 text-gray-400'}`}>ขาย</button>
            <button onClick={() => sellStock(selected, tradeQty)} disabled={!selectedHolding} className={`flex-1 py-3 rounded-full font-bold ${selectedHolding ? 'bg-red-500 text-white active:scale-95' : 'bg-gray-200 text-gray-400'}`}>ขาย</button>
            <button onClick={() => buyStock(selected, tradeQty)} className="flex-1 py-3 rounded-full font-bold bg-green-500 text-white active:scale-95">ซื้อ</button>
          </div>
        </div>
      </div>
    );
  };

  // NAV
  const NavItem = ({ id, icon: Icon, label }: any) => (
    <button onClick={() => setScreen(id)} className={`flex-1 flex flex-col items-center gap-0.5 py-2 transition ${screen === id ? 'text-blue-500' : 'text-gray-400'}`}>
      <Icon size={20} fill={screen === id ? 'currentColor' : 'none'} strokeWidth={screen === id ? 2.5 : 2}/>
      <span className={`text-[10px] ${screen === id ? 'font-bold' : 'font-medium'}`}>{label}</span>
    </button>
  );

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="bg-gradient-to-br from-sky-100 via-blue-50 to-pink-50 min-h-screen flex items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md min-h-screen sm:min-h-0 sm:h-[820px] sm:rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="h-full overflow-y-auto">
          {screen === 'home'    && <HomeScreen/>}
          {screen === 'lessons' && <LessonScreen/>}
          {screen === 'quests'  && <QuestsScreen/>}
          {screen === 'invest'  && <InvestScreen/>}
          {screen === 'news'    && <NewsScreen/>}
          {screen === 'friends' && <FriendScreen/>}
          {screen === 'profile' && <ProfileScreen/>}
        </div>

        {/* Bottom Nav */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex shadow-lg">
          <NavItem id="home"    icon={Home}     label="หน้าหลัก"/>
          <NavItem id="quests"  icon={BookOpen}  label="ภารกิจ"/>
          <NavItem id="invest"  icon={LineIcon}  label="ลงทุน"/>
          <NavItem id="news"    icon={Newspaper} label="ข่าว"/>
          <NavItem id="friends" icon={Users}     label="Friend"/>
          <NavItem id="profile" icon={User}      label="โปรไฟล์"/>
        </div>

        {/* Modals */}
        <ShopModal/>
        <NewsModal/>
        <QuestModal/>
        <TradeModal/>

        {/* Level Up Modal */}
        {levelUpInfo && (
          <LevelUpModal level={levelUpInfo.level} nextUnlock={getNextUnlock(levelUpInfo.level)}
            onClose={() => setLevelUpInfo(null)}/>
        )}

        {portfolioUnlockInfo && (
          <PortfolioUnlockModal
            onStartTutorial={() => { setPortfolioUnlockInfo(false); setShowPortfolioTutorial(true); }}
            onClose={() => setPortfolioUnlockInfo(false)}
          />
        )}

        {showPortfolioTutorial && (
          <PortfolioTutorialModal onClose={() => { setShowPortfolioTutorial(false); setScreen('invest'); }}/>
        )}

        {evolutionInfo && (
          <EvolutionModal stage={evolutionInfo} onClose={() => setEvolutionInfo(null)}/>
        )}

        {showPathModal && !player.selectedInvestmentPath && (
          <InvestmentPathModal
            onSelect={selectInvestmentPath}
            onClose={() => { setShowPathModal(false); setPathPromptDismissed(true); }}
          />
        )}

        {/* Reward popup */}
        {reward && (
          <div className="fixed top-1/4 left-1/2 -translate-x-1/2 z-[60] pointer-events-none">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-2xl px-6 py-4 shadow-2xl animate-bounce">
              <div className="text-center font-bold text-sm mb-1">{reward.msg}</div>
              {(reward.exp > 0 || reward.coins > 0) && (
                <div className="flex items-center gap-3 justify-center">
                  {reward.exp > 0  && <div className="flex items-center gap-1 text-sm font-bold"><Star size={14} fill="white"/> +{reward.exp}</div>}
                  {reward.coins > 0 && <div className="flex items-center gap-1 text-sm font-bold"><BuaCoinIcon size={14}/> +{reward.coins}</div>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dev Panel toggle */}
        <button onClick={() => setShowDev(d => !d)}
          className="fixed top-4 right-4 z-[90] bg-gray-900 text-yellow-400 rounded-full w-9 h-9 flex items-center justify-center shadow-lg text-xs font-bold border border-yellow-500/40">
          {showDev ? '✕' : '⚙'}
        </button>
        {showDev && <DevPanel/>}
      </div>
    </div>
  );
}
