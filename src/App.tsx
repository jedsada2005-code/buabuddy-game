import { useState, useEffect, useRef, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from './supabaseClient';
import {
  Home, BookOpen, LineChart as LineIcon, User, Users, Heart, Zap, Bell,
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
const BUA_SAVER_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/Bua%20Saver%20%281%29.png';
const BUA_INVESTOR_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/Bua%20Investor%20%282%29.png';
const VALUE_HUNTER_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/value%20hunter.png';
const GLOBAL_EXPLORER_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/global%20exploer.png';
const RISK_GUARDIAN_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/risk%20gardian.png';
const DIVIDEND_KEEPER_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/dividend%20keeper.png';
const BUA_TRADER_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/bua%20trader.png';
const ESG_HERO_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/esg%20hero.png';
const VALUE_MASTER_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/Value%20Master.png';
const GLOBAL_MASTER_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/Global%20Master.png';
const GUARDIAN_MASTER_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/Gardian%20Master.png';
const DIVIDEND_MASTER_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/Dividend%20Master.png';
const ESG_MASTER_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/ESG%20Master.png';
const TRADING_MASTER_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/Trading%20Master%20(1).png';
const INVESTMENT_MASTER_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/investment%20master.png';
const BG_IMG  = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/background.png';
const BG_VALUE_MASTER_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/BG_Value%20.png';
const BG_GLOBAL_MASTER_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/BG%20Global%20Master.png';
const BG_GUARDIAN_MASTER_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/BG%20Risk%20Gardian.png';
const BG_DIVIDEND_MASTER_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/BG%20dividend%20master.png';
const BG_ESG_MASTER_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/BG%20esg%20master.png';
const BG_TRADING_MASTER_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/BG%20trading%20Master.png';
const BG_MASTER_IMG = 'https://raw.githubusercontent.com/jedsada2005-code/bua-assets/main/BG%20master.png';

// ============================================================
// TYPES
// ============================================================
type EvolutionStage = 'bua-seed' | 'bua-saver' | 'bua-investor' | 'specialized-bua' | 'investment-master';
type LearningPhase  = 'basics' | 'money-management' | 'investment-basics' | 'goal-based' | 'specialization';
type InvestmentPath = 'value-hunter' | 'global-explorer' | 'risk-guardian' | 'dividend-keeper' | 'bua-trader' | 'esg-hero';
type QuestCategory = 'basic' | 'money-management' | 'investment' | 'goal' | 'specialization';
type QuestType = 'lesson' | 'quiz' | 'scenario' | 'action' | 'trade' | 'friend';
type QuestStatus = 'available' | 'in-progress' | 'reward' | 'done' | 'locked';
type AssetCategory = 'thai' | 'us' | 'etf' | 'bond' | 'commodity' | 'esg';
type AssetVolatility = 'very-low' | 'low' | 'medium' | 'high' | 'very-high';

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
  trading: TradingStats;
}

type RankTrend = 'up' | 'down' | 'same';

interface TradingStats {
  initialCapital: number;
  portfolioValue: number;
  returnPct: number;
  tradeCount: number;
  portfolioUnlocked?: boolean;
  winRatePct?: number;
  rankTrend?: RankTrend;
}

interface LessonQuizQuestion {
  question: string;
  options: string[];
  correct: number;
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
  quizQuestions?: LessonQuizQuestion[];
  passingScore?: number;
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

interface CloudProfile {
  user_id: string;
  display_name: string;
  friend_code: string;
  level: number;
  selected_investment_path?: string | null;
  current_evolution_stage: string;
  coins: number;
  updated_at?: string;
}

interface CloudPortfolioSnapshot {
  user_id: string;
  portfolio_unlocked: boolean;
  portfolio_value: number;
  return_pct: number;
  trade_count: number;
  updated_at?: string;
}

type EvolutionMilestone = 'stage' | 'path' | 'path-master' | 'investment-master';

interface EvolutionCutsceneState {
  fromStage: EvolutionStage;
  toStage: EvolutionStage;
  investmentPath?: InvestmentPath;
  milestone: EvolutionMilestone;
}

interface FriendRequestView {
  id: string;
  requester_id: string;
  receiver_id: string;
  profile: FriendProfile;
}

type SyncStatus = 'local-only' | 'loading' | 'saving' | 'synced' | 'error';

// ============================================================
// EXP SYSTEM
// ============================================================
const SAVE_VERSION = 2;
const LEGACY_INITIAL_TRADING_CASH = 100000;
const INITIAL_TRADING_CASH = 1000000;
const MOCK_USD_THB_RATE = 35.5;

function calcTradingReturnPct(portfolioValue: number, initialCapital = INITIAL_TRADING_CASH): number {
  return initialCapital > 0 ? ((portfolioValue - initialCapital) / initialCapital) * 100 : 0;
}

function getRequiredExp(level: number): number {
  // Prototype tuning: keep level-up feedback fast so players can see evolution/unlocks sooner.
  return 70 + level * 20;
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
  'specialization':    { name: '🏆 เส้นทางเฉพาะทาง',       color: 'orange', next: 'Path Master',          nextLevel: 50 },
};

const EVOLUTION_INFO: Record<EvolutionStage, { name: string; desc: string; minLevel: number }> = {
  'bua-seed':        { name: 'Bua Seed',         desc: 'เริ่มต้นเรียนรู้',              minLevel: 1  },
  'bua-saver':       { name: 'Bua Saver',        desc: 'นักออมที่ดี',                  minLevel: 5  },
  'bua-investor':    { name: 'Bua Investor',     desc: 'เริ่มลงทุนอย่างฉลาด',         minLevel: 10 },
  'specialized-bua': { name: 'Specialized Bua', desc: 'เชี่ยวชาญเส้นทางเฉพาะ',       minLevel: 20 },
  'investment-master':{ name: 'Investment Master', desc: 'ปรมาจารย์การลงทุนที่ผ่าน Master ครบทุกสาย', minLevel: 50 },
};

function getEvolutionMascotStage(stage: EvolutionStage): number {
  if (stage === 'bua-saver') return 2;
  if (stage === 'bua-investor') return 3;
  if (stage === 'specialized-bua' || stage === 'investment-master') return 4;
  return 1;
}

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
    requiredLessonIds: ['stock101-1-1'] },
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
  { id: 'value-master-badge', icon: '🏆', name: 'Value Master',       desc: 'เป็นมาสเตอร์สาย Value Hunter'          },
  { id: 'global-master-badge', icon: '🏆', name: 'Global Master',     desc: 'เป็นมาสเตอร์สาย Global Explorer'       },
  { id: 'risk-master-badge', icon: '🏆', name: 'Risk Master',         desc: 'เป็นมาสเตอร์สาย Risk Guardian'         },
  { id: 'dividend-master-badge', icon: '🏆', name: 'Dividend Master', desc: 'เป็นมาสเตอร์สาย Dividend Keeper'       },
  { id: 'trading-master-badge', icon: '🏆', name: 'Trading Master',   desc: 'เป็นมาสเตอร์สาย Bua Trader'            },
  { id: 'esg-master-badge', icon: '🏆', name: 'ESG Master',           desc: 'เป็นมาสเตอร์สาย ESG Hero'              },
  { id: 'investment-master-badge', icon: '👑', name: 'Investment Master', desc: 'ได้รับ Badge Master ครบทุกสาย'       },
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

const INVESTMENT_PATH_MASTERS: Record<InvestmentPath, { masterName: string; theme: string; badgeId: string }> = {
  'value-hunter': { masterName: 'Value Master', theme: 'เชี่ยวชาญการประเมินมูลค่าและเลือกหุ้นคุณภาพในราคาสมเหตุสมผล', badgeId: 'value-master-badge' },
  'global-explorer': { masterName: 'Global Master', theme: 'เชี่ยวชาญการมองภาพโลกและกระจายพอร์ตข้ามประเทศ', badgeId: 'global-master-badge' },
  'risk-guardian': { masterName: 'Risk Master', theme: 'เชี่ยวชาญการคุมความเสี่ยง วินัย และการปกป้องพอร์ต', badgeId: 'risk-master-badge' },
  'dividend-keeper': { masterName: 'Dividend Master', theme: 'เชี่ยวชาญหุ้น/สินทรัพย์ที่สร้างกระแสเงินสดสม่ำเสมอ', badgeId: 'dividend-master-badge' },
  'bua-trader': { masterName: 'Trading Master', theme: 'เชี่ยวชาญจังหวะตลาด แผนซื้อขาย และการจำกัดความเสี่ยง', badgeId: 'trading-master-badge' },
  'esg-hero': { masterName: 'ESG Master', theme: 'เชี่ยวชาญการลงทุนยั่งยืนและผลกระทบเชิงบวก', badgeId: 'esg-master-badge' },
};

const PATH_MASTER_BADGE_IDS = (Object.values(INVESTMENT_PATH_MASTERS).map(master => master.badgeId));
const INVESTMENT_MASTER_BADGE_ID = 'investment-master-badge';

function hasAllPathMasterBadges(earnedBadgeIds: string[]): boolean {
  return PATH_MASTER_BADGE_IDS.every(id => earnedBadgeIds.includes(id));
}

function getPlayerEvolutionStage(player: Pick<PlayerProgress, 'level' | 'earnedBadgeIds'>): EvolutionStage {
  if (player.level >= 50 && hasAllPathMasterBadges(player.earnedBadgeIds)) return 'investment-master';
  if (player.level >= 20) return 'specialized-bua';
  return getEvolutionStage(player.level);
}

function getBadgeIdsForLevelAndPath(level: number, selectedInvestmentPath: InvestmentPath | undefined, currentBadgeIds: string[]): string[] {
  const nextBadgeIds = [...currentBadgeIds];
  if (level >= 50 && selectedInvestmentPath) {
    const pathMasterBadgeId = INVESTMENT_PATH_MASTERS[selectedInvestmentPath].badgeId;
    if (!nextBadgeIds.includes(pathMasterBadgeId)) nextBadgeIds.push(pathMasterBadgeId);
  }
  if (level >= 50 && hasAllPathMasterBadges(nextBadgeIds) && !nextBadgeIds.includes(INVESTMENT_MASTER_BADGE_ID)) {
    nextBadgeIds.push(INVESTMENT_MASTER_BADGE_ID);
  }
  return nextBadgeIds;
}

// ============================================================
// STATIC DATA (Quests, Shop, etc.)
// ============================================================
const MONEY_QUEST_IDS: string[] = [];

const QUESTS: Quest[] = [
  {
    id: 'q1',
    category: 'basic',
    type: 'lesson',
    icon: '🎬',
    title: 'เรียนคลิปแรก Stock101',
    desc: 'ไปเรียนคลิป “ทำความรู้จักหุ้นฉบับมือใหม่ - Stock101” และผ่าน Quiz หลังบทเรียน',
    requiredLevel: 1,
    lessonId: 'stock101-1-1',
    exp: 120,
    coins: 80,
    badgeId: 'first-step',
  },
  {
    id: 'q4',
    category: 'basic',
    type: 'action',
    icon: '🍎',
    title: 'ให้อาหารน้องบัว 1 ครั้ง',
    desc: 'ซื้ออาหารในร้านค้าเพื่อเพิ่มความสุขหรือพลังงานให้น้องบัว',
    requiredLevel: 1,
    exp: 50,
    coins: 30,
  },
  {
    id: 'q6',
    category: 'investment',
    type: 'trade',
    icon: '📈',
    title: 'ซื้อหุ้นใน Simulation 1 ตัว',
    desc: 'ปลดล็อก Portfolio Simulation แล้วลองซื้อหุ้นจำลอง 1 รายการ',
    requiredLevel: 10,
    prerequisiteLessonIds: ['stock101-1-1'],
    exp: 130,
    coins: 90,
    badgeId: 'first-portfolio',
  },
  {
    id: 'q7',
    category: 'basic',
    type: 'friend',
    icon: '🏠',
    title: 'เยี่ยมบ้านเพื่อน 1 คน',
    desc: 'เข้าไปดูบ้านเพื่อนและมาสคอตน้องบัวของเพื่อน 1 คน',
    requiredLevel: 1,
    exp: 70,
    coins: 40,
    badgeId: 'friend',
  },
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
    label: `เรียนบทเรียน "${STOCK101_LESSONS.find(lesson => lesson.id === id)?.title ?? QUESTS.find(q => q.lessonId === id)?.title ?? id}"`,
    done: player.completedLessonIds.includes(id),
    actionQuestId: QUESTS.find(q => q.lessonId === id)?.id,
  }));
  return [
    { id: 'portfolio-level', label: `ถึง Level ${PORTFOLIO_UNLOCK.requiredLevel}`, done: player.level >= PORTFOLIO_UNLOCK.requiredLevel, current: `Lv.${player.level}` },
    ...lessonItems,
    ...questItems,
  ];
}

const SHOP = [
  { id: 's1', icon: '🍎', name: 'ผลไม้สด',         price: 15,  happy: 10, energy: 5  },
  { id: 's2', icon: '🥗', name: 'อาหารคลีน',       price: 30,  happy: 15, energy: 20 },
  { id: 's3', icon: '🍰', name: 'ขนมพิเศษ',        price: 50,  happy: 25, energy: 15 },
  { id: 's4', icon: '⚡', name: 'เครื่องดื่มชูกำลัง', price: 40, happy: 5,  energy: 30 },
  { id: 's5', icon: '🎁', name: 'กล่องเซอร์ไพรส์', price: 100, happy: 30, energy: 30 },
];

const FEED_REACTIONS = [
  'ขอบคุณนะ! อิ่มแล้วว 🌸',
  'อร่อยมาก! น้องบัวมีแรงขึ้นแล้ว ✨',
  'ใจดีจังเลย ขอบคุณที่ดูแลน้องบัวนะ 💖',
  'เติมพลังแล้ว ไปเรียนเรื่องหุ้นกันต่อไหม? 📚',
  'พลังงานพร้อม ใจพร้อม ลงทุนต้องมีแผนด้วยนะ 📈',
  'คุณดูแลน้องบัวเก่งขึ้นทุกวันเลยนะ!',
  'ขอบคุณที่ไม่ลืมน้องบัวนะ 🥺',
  'ผู้ดูแลที่ดี = นักลงทุนที่มีวินัย! 🌟',
];

const HIGH_STAT_FEED_REACTIONS = [
  'สดใสมาก! พร้อมลุยภารกิจแล้ว 🌟',
  'พลังเต็มเปี่ยม วันนี้ต้องทำได้ดีแน่!',
  'อิ่มใจ อิ่มพลัง พร้อมเรียนรู้ต่อเลย 💪',
];

const LOW_STAT_FEED_REACTIONS = [
  'ดีขึ้นแล้วน้า แต่อยากพักอีกนิด 🥺',
  'ขอบคุณนะ เริ่มมีแรงขึ้นแล้ว!',
  'ได้พลังเพิ่มแล้ว ดูแลกันต่ออีกนิดนะ 🌱',
];

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function getFeedReaction(happy: number, energy: number): string {
  if (happy >= 90 && energy >= 90) return pickRandom(HIGH_STAT_FEED_REACTIONS);
  if (happy < 55 || energy < 55) return pickRandom(LOW_STAT_FEED_REACTIONS);
  return pickRandom(FEED_REACTIONS);
}

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
    trading: { initialCapital: INITIAL_TRADING_CASH, portfolioValue: 95400, returnPct: -4.6, tradeCount: 4, winRatePct: 25, rankTrend: 'same' },
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
    trading: { initialCapital: INITIAL_TRADING_CASH, portfolioValue: 98800, returnPct: -1.2, tradeCount: 8, winRatePct: 38, rankTrend: 'down' },
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
    trading: { initialCapital: INITIAL_TRADING_CASH, portfolioValue: 118400, returnPct: 18.4, tradeCount: 22, winRatePct: 64, rankTrend: 'up' },
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
    trading: { initialCapital: INITIAL_TRADING_CASH, portfolioValue: 107800, returnPct: 7.8, tradeCount: 15, winRatePct: 57, rankTrend: 'up' },
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
    passingScore: 3,
    quizQuestions: [
      {
        question: 'หากอัตราเงินเฟ้ออยู่ที่ 10% ราคาเบอร์เกอร์จาก 100 บาท จะเพิ่มขึ้นเป็นเท่าใดในอีก 10 ปีข้างหน้า ตามตัวอย่างที่ยกในวิดีโอ?',
        options: ['110 บาท', '260 บาท', '130 บาท', '200 บาท'],
        correct: 1,
      },
      {
        question: 'ทำไม “สภาพคล่อง” (Liquidity) ถึงเป็นปัจจัยสำคัญที่นักลงทุนต้องพิจารณา?',
        options: [
          'เพื่อป้องกันความเสี่ยงจากเงินเฟ้อได้ 100%',
          'เพื่อให้สามารถเปลี่ยนสินทรัพย์เป็นเงินสดได้ทันท่วงทีเมื่อมีความจำเป็นต้องใช้เงิน',
          'เพื่อลดภาระภาษีจากการถือครองสินทรัพย์ระยะยาว',
          'เพื่อให้สินทรัพย์มีมูลค่าเพิ่มขึ้นอย่างรวดเร็วภายในระยะเวลาสั้น ๆ',
        ],
        correct: 1,
      },
      {
        question: 'ข้อดีของการลงทุนในหุ้นที่แตกต่างจากการลงทุนในอสังหาริมทรัพย์อย่างเห็นได้ชัดคืออะไร?',
        options: [
          'หุ้นมีสภาพคล่องสูงกว่า สามารถซื้อขายเปลี่ยนมือได้ง่ายผ่านระบบดิจิทัล',
          'หุ้นให้ผลตอบแทนที่คงที่และแน่นอนกว่าในทุกปี',
          'การลงทุนในหุ้นให้ความรู้สึกเป็นเจ้าของมากกว่าการถือโฉนดที่ดิน',
          'การถือหุ้นไม่ต้องเสียภาษีจากเงินปันผลเลย',
        ],
        correct: 0,
      },
      {
        question: 'สำหรับมือใหม่ที่มีเงินทุนจำกัดแต่อยากกระจายความเสี่ยงไปในบริษัทชั้นนำหลายแห่ง เครื่องมือใดที่เหมาะสมที่สุดตามคำแนะนำในคลิป?',
        options: [
          'การเลือกซื้อหุ้นรายตัวที่ราคาต่ำที่สุดในตลาด',
          'การฝากเงินไว้ในบัญชีออมทรัพย์พิเศษที่มีดอกเบี้ยสูง',
          'การลงทุนในกองทุน ETF (Exchange Traded Fund)',
          'การกู้ยืมเงินเพื่อนำมาลงทุนในหุ้นเพียงบริษัทเดียวที่มั่นใจ',
        ],
        correct: 2,
      },
      {
        question: 'การออมเงินเดือนละ 1,000 บาท ใน ETF ที่ให้ผลตอบแทนประมาณ 12% ต่อปี เป็นเวลา 40 ปี จะมีเงินเก็บรวมประมาณเท่าใด?',
        options: ['ประมาณ 480,000 บาท', 'ประมาณ 5 ล้านบาท', 'ประมาณ 12 ล้านบาท', 'ประมาณ 1 ล้านบาท'],
        correct: 2,
      },
    ],
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
// PORTFOLIO SIMULATION ASSETS
// Base prices are delayed reference quotes checked on 15 Jul 2026.
// ============================================================
const INITIAL_STOCKS: {
  sym: string;
  name: string;
  logo: string;
  cat: AssetCategory;
  base: number;
  currency: 'THB' | 'USD';
  assetType: string;
  sector: string;
  volatility: AssetVolatility;
  risk: 'Defensive' | 'Balanced' | 'Growth' | 'Aggressive';
  pathTags: InvestmentPath[];
  desc: string;
}[] = [
  // Thai stocks
  { sym: 'PTT',   name: 'PTT PCL',                    logo: '⛽', cat: 'thai', base: 38.25,  currency: 'THB', assetType: 'หุ้นไทย', sector: 'Energy',        volatility: 'medium', risk: 'Balanced',   pathTags: ['value-hunter','dividend-keeper'], desc: 'หุ้นพลังงานขนาดใหญ่ เหมาะฝึกอ่านวัฏจักรสินค้าโภคภัณฑ์และเงินปันผล' },
  { sym: 'CPALL', name: 'CP ALL PCL',                 logo: '🏪', cat: 'thai', base: 46.25,  currency: 'THB', assetType: 'หุ้นไทย', sector: 'Consumer',      volatility: 'medium', risk: 'Balanced',   pathTags: ['value-hunter','dividend-keeper'], desc: 'ค้าปลีกเชิงรับ เหมาะฝึกดูรายได้สม่ำเสมอและคุณภาพธุรกิจ' },
  { sym: 'KBANK', name: 'Kasikornbank',               logo: '🏦', cat: 'thai', base: 231.00, currency: 'THB', assetType: 'หุ้นไทย', sector: 'Banking',       volatility: 'medium', risk: 'Balanced',   pathTags: ['value-hunter','dividend-keeper'], desc: 'หุ้นธนาคาร เหมาะฝึกดูดอกเบี้ย สินเชื่อ และคุณภาพสินทรัพย์' },
  { sym: 'AOT',   name: 'Airports of Thailand',       logo: '✈️', cat: 'thai', base: 63.00,  currency: 'THB', assetType: 'หุ้นไทย', sector: 'Transport',     volatility: 'medium', risk: 'Growth',     pathTags: ['global-explorer','bua-trader'], desc: 'หุ้นสนามบิน เชื่อมโยงท่องเที่ยวและเศรษฐกิจโลก' },
  { sym: 'ADVANC',name: 'Advanced Info Service',      logo: '📶', cat: 'thai', base: 382.00, currency: 'THB', assetType: 'หุ้นไทย', sector: 'Telecom',       volatility: 'low',    risk: 'Defensive',  pathTags: ['risk-guardian','dividend-keeper'], desc: 'หุ้นสื่อสารกระแสเงินสดแข็งแรง เหมาะสาย defensive และ dividend' },
  { sym: 'SCB',   name: 'SCB X',                      logo: '💜', cat: 'thai', base: 157.00, currency: 'THB', assetType: 'หุ้นไทย', sector: 'Banking',       volatility: 'medium', risk: 'Balanced',   pathTags: ['value-hunter','dividend-keeper'], desc: 'หุ้นการเงินขนาดใหญ่ เหมาะฝึกดู valuation และ dividend yield' },
  { sym: 'BDMS',  name: 'Bangkok Dusit Medical',      logo: '🏥', cat: 'thai', base: 19.30,  currency: 'THB', assetType: 'หุ้นไทย', sector: 'Healthcare',    volatility: 'low',    risk: 'Defensive',  pathTags: ['risk-guardian','global-explorer'], desc: 'หุ้นโรงพยาบาล เหมาะฝึกมองธุรกิจคุณภาพและรายได้เชิงรับ' },

  // US stocks
  { sym: 'AAPL',  name: 'Apple Inc.',                 logo: '🍎', cat: 'us',   base: 314.86, currency: 'USD', assetType: 'หุ้น US', sector: 'Technology',    volatility: 'medium', risk: 'Growth',     pathTags: ['global-explorer','value-hunter'], desc: 'หุ้นเทคโนโลยีขนาดใหญ่ เหมาะฝึกมองแบรนด์ กระแสเงินสด และ valuation' },
  { sym: 'MSFT',  name: 'Microsoft Corp.',            logo: '🪟', cat: 'us',   base: 384.93, currency: 'USD', assetType: 'หุ้น US', sector: 'Technology',    volatility: 'medium', risk: 'Growth',     pathTags: ['global-explorer','value-hunter'], desc: 'หุ้นเทค/คลาวด์ขนาดใหญ่ ใช้เรียนรู้ธุรกิจคุณภาพและ recurring revenue' },
  { sym: 'NVDA',  name: 'NVIDIA Corp.',               logo: '🟢', cat: 'us',   base: 211.80, currency: 'USD', assetType: 'หุ้น US', sector: 'AI/Semicon',    volatility: 'very-high', risk: 'Aggressive', pathTags: ['global-explorer','bua-trader'], desc: 'หุ้น AI/ชิป ความผันผวนสูง เหมาะฝึก momentum และการคุมความเสี่ยง' },
  { sym: 'GOOG',  name: 'Alphabet Class C',           logo: '🔎', cat: 'us',   base: 357.33, currency: 'USD', assetType: 'หุ้น US', sector: 'Technology',    volatility: 'high',   risk: 'Growth',     pathTags: ['global-explorer','value-hunter'], desc: 'หุ้นแพลตฟอร์มและ AI เหมาะฝึกมอง moat และการเติบโตระยะยาว' },
  { sym: 'AMZN',  name: 'Amazon.com',                 logo: '📦', cat: 'us',   base: 247.49, currency: 'USD', assetType: 'หุ้น US', sector: 'Consumer/Cloud',volatility: 'high',   risk: 'Growth',     pathTags: ['global-explorer','bua-trader'], desc: 'หุ้น e-commerce/cloud เหมาะฝึกดูการเติบโตและ margin' },
  { sym: 'META',  name: 'Meta Platforms',             logo: '🧠', cat: 'us',   base: 661.04, currency: 'USD', assetType: 'หุ้น US', sector: 'Social/AI',     volatility: 'high',   risk: 'Growth',     pathTags: ['global-explorer','bua-trader'], desc: 'หุ้นโซเชียลและ AI เหมาะฝึกอ่าน sentiment และงบลงทุนอนาคต' },
  { sym: 'TSLA',  name: 'Tesla Inc.',                 logo: '⚡', cat: 'us',   base: 396.36, currency: 'USD', assetType: 'หุ้น US', sector: 'EV',           volatility: 'very-high', risk: 'Aggressive', pathTags: ['bua-trader','global-explorer'], desc: 'หุ้น EV ความผันผวนสูง เหมาะฝึกแผนซื้อขายและ stop-loss จำลอง' },
  { sym: 'JPM',   name: 'JPMorgan Chase',             logo: '🏛️', cat: 'us',   base: 342.89, currency: 'USD', assetType: 'หุ้น US', sector: 'Banking',       volatility: 'medium', risk: 'Balanced',   pathTags: ['value-hunter','dividend-keeper'], desc: 'หุ้นธนาคารระดับโลก เหมาะฝึกมองวัฏจักรดอกเบี้ยและกำไรธนาคาร' },

  // ETFs / bonds / commodities / ESG
  { sym: 'SPY',   name: 'SPDR S&P 500 ETF',           logo: '🇺🇸', cat: 'etf',  base: 751.83, currency: 'USD', assetType: 'ETF',     sector: 'US Market',    volatility: 'low',    risk: 'Balanced',   pathTags: ['global-explorer','risk-guardian'], desc: 'ETF ตลาดหุ้นสหรัฐฯ ใช้ฝึกการกระจายความเสี่ยงด้วยดัชนีใหญ่' },
  { sym: 'QQQ',   name: 'Invesco Nasdaq 100 ETF',     logo: '💻', cat: 'etf',  base: 719.71, currency: 'USD', assetType: 'ETF',     sector: 'US Growth',    volatility: 'high',   risk: 'Growth',     pathTags: ['global-explorer','bua-trader'], desc: 'ETF Nasdaq 100 เน้นหุ้นเติบโตและเทคโนโลยี ขยับแรงกว่า broad market' },
  { sym: 'BND',   name: 'Vanguard Total Bond ETF',    logo: '🧱', cat: 'bond', base: 72.62,  currency: 'USD', assetType: 'Bond ETF',sector: 'Bonds',        volatility: 'very-low', risk: 'Defensive', pathTags: ['risk-guardian','dividend-keeper'], desc: 'ETF ตราสารหนี้ ความผันผวนต่ำ ใช้เรียนรู้บทบาทสินทรัพย์ป้องกันความเสี่ยง' },
  { sym: 'BNDX',  name: 'Vanguard Intl Bond ETF',     logo: '🌐', cat: 'bond', base: 48.01,  currency: 'USD', assetType: 'Bond ETF',sector: 'Global Bonds', volatility: 'very-low', risk: 'Defensive', pathTags: ['risk-guardian','global-explorer'], desc: 'ETF ตราสารหนี้ต่างประเทศ ช่วยสอนเรื่อง diversification ข้ามประเทศ' },
  { sym: 'GLD',   name: 'SPDR Gold Shares',           logo: '🥇', cat: 'commodity', base: 510.00, currency: 'USD', assetType: 'Gold ETF', sector: 'Gold', volatility: 'medium', risk: 'Balanced', pathTags: ['risk-guardian','bua-trader'], desc: 'ETF ทองคำ ใช้ฝึกบทบาทสินทรัพย์หลบภัยและการเคลื่อนไหวต่างจากหุ้น' },
  { sym: 'USO',   name: 'United States Oil Fund',     logo: '🛢️', cat: 'commodity', base: 120.17, currency: 'USD', assetType: 'Oil ETF',  sector: 'Oil',  volatility: 'high', risk: 'Aggressive', pathTags: ['bua-trader','global-explorer'], desc: 'ETF น้ำมัน ความผันผวนสูง เหมาะฝึกอ่านปัจจัยมหภาคและสินค้าโภคภัณฑ์' },
  { sym: 'ESGU',  name: 'iShares ESG Aware MSCI USA', logo: '🌿', cat: 'esg',  base: 164.70, currency: 'USD', assetType: 'ESG ETF', sector: 'US ESG',       volatility: 'low',    risk: 'Balanced',   pathTags: ['esg-hero','global-explorer'], desc: 'ETF หุ้นสหรัฐฯ ที่คัดกรอง ESG เหมาะกับสายลงทุนยั่งยืน' },
  { sym: 'ICLN',  name: 'iShares Global Clean Energy',logo: '☀️', cat: 'esg',  base: 13.50,  currency: 'USD', assetType: 'ESG ETF', sector: 'Clean Energy', volatility: 'high',   risk: 'Growth',     pathTags: ['esg-hero','bua-trader'], desc: 'ETF พลังงานสะอาด ความผันผวนสูง ใช้สอน ESG growth และความเสี่ยงธีมลงทุน' },
];

const ASSET_FILTERS: { id: 'all' | AssetCategory | 'my-path'; label: string }[] = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'thai', label: 'หุ้นไทย' },
  { id: 'us', label: 'หุ้น US' },
  { id: 'etf', label: 'ETF' },
  { id: 'bond', label: 'Bond' },
  { id: 'commodity', label: 'Gold/Oil' },
  { id: 'esg', label: 'ESG' },
  { id: 'my-path', label: 'สายของฉัน' },
];

const ASSET_VOLATILITY_RANGE: Record<AssetVolatility, number> = {
  'very-low': 0.45,
  low: 1.10,
  medium: 2.20,
  high: 4.20,
  'very-high': 6.50,
};

const ASSET_RISK_BADGE: Record<string, string> = {
  Defensive: 'bg-blue-50 text-blue-600',
  Balanced: 'bg-emerald-50 text-emerald-600',
  Growth: 'bg-orange-50 text-orange-600',
  Aggressive: 'bg-red-50 text-red-500',
};

const MARKET_TICK_MS = 5 * 60 * 1000;

const getMarketTick = (now = Date.now()) => Math.floor(now / MARKET_TICK_MS);
const getNextMarketTickTime = (tick = getMarketTick()) => (tick + 1) * MARKET_TICK_MS;
const getMsUntilNextMarketTick = (now = Date.now()) => Math.max(250, MARKET_TICK_MS - (now % MARKET_TICK_MS) + 100);

const seededRandom = (seed: string) => {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h += h << 13; h ^= h >>> 7;
  h += h << 3;  h ^= h >>> 17;
  h += h << 5;
  return (h >>> 0) / 4294967296;
};

const seededRange = (seed: string, min: number, max: number) => min + seededRandom(seed) * (max - min);

const genSpark = (base: number, pts = 20, seed = 'default', volatility: AssetVolatility = 'medium') => {
  const arr: { i: number; v: number }[] = [];
  const range = ASSET_VOLATILITY_RANGE[volatility];
  let v = base * (1 + seededRange(`${seed}-start`, -range / 180, range / 260));
  for (let i = 0; i < pts; i++) {
    v += seededRange(`${seed}-pt-${i}`, -0.48, 0.52) * base * (0.0025 + range * 0.0012);
    arr.push({ i, v: Math.max(base * (1 - range / 35), v) });
  }
  return arr;
};

const buildMarketStocks = (tick = getMarketTick()) =>
  INITIAL_STOCKS.map(s => {
    const range = ASSET_VOLATILITY_RANGE[s.volatility];
    const drift = s.risk === 'Defensive' ? 0.04 : s.risk === 'Growth' ? 0.08 : s.risk === 'Aggressive' ? 0.12 : 0.06;
    const changePct = seededRange(`${s.sym}-${tick}-change`, -range, range) + drift;
    const price = s.base * (1 + changePct / 100);
    return {
      ...s,
      price,
      thbPrice: s.currency === 'USD' ? price * MOCK_USD_THB_RATE : price,
      changePct,
      spark: genSpark(s.base, 20, `${s.sym}-${tick}`, s.volatility),
      marketTick: tick,
    };
  });

const fmt = (n: number, d = 2) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const getAssetThbPrice = (asset: any) => asset?.thbPrice ?? asset?.price ?? 0;
const getHoldingAvgCostThb = (holding: { avgCost: number }, asset: any) => {
  const thbPrice = getAssetThbPrice(asset);
  if (asset?.currency === 'USD' && holding.avgCost < thbPrice * 0.5) {
    return holding.avgCost * MOCK_USD_THB_RATE;
  }
  return holding.avgCost;
};

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

function createDefaultPlayer(): PlayerProgress {
  return {
    ...DEFAULT_PLAYER,
    completedQuestIds: [...DEFAULT_PLAYER.completedQuestIds],
    completedLessonIds: [...DEFAULT_PLAYER.completedLessonIds],
    claimedRewardIds: [...DEFAULT_PLAYER.claimedRewardIds],
    unlockedFeatureIds: [...DEFAULT_PLAYER.unlockedFeatureIds],
    earnedBadgeIds: [...DEFAULT_PLAYER.earnedBadgeIds],
    readNews: [...DEFAULT_PLAYER.readNews],
  };
}

function migrateSavedGameState(state: SavedGameState | null | undefined): SavedGameState | null {
  if (!state?.player) return null;

  const safeState: SavedGameState = {
    ...state,
    holdings: state.holdings ?? {},
    tradeHistory: state.tradeHistory ?? [],
  };

  if (safeState.version === SAVE_VERSION) return safeState;

  if (safeState.version === 1) {
    return {
      ...safeState,
      version: SAVE_VERSION,
      tradingCash: (safeState.tradingCash ?? LEGACY_INITIAL_TRADING_CASH) + (INITIAL_TRADING_CASH - LEGACY_INITIAL_TRADING_CASH),
    };
  }

  return null;
}

function loadGame(): SavedGameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedGameState;
    return migrateSavedGameState(parsed);
  } catch { return null; }
}

function saveGame(state: SavedGameState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* silent */ }
}

function createSaveState(
  player: PlayerProgress,
  tradingCash: number,
  holdings: Record<string, { shares: number; avgCost: number }>,
  tradeHistory: any[]
): SavedGameState {
  return { version: SAVE_VERSION, player, tradingCash, holdings, tradeHistory };
}

function generateFriendCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'BUA-';
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

async function loadGameFromCloud(userId: string): Promise<SavedGameState | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('game_saves')
    .select('save_data')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return (data?.save_data as SavedGameState | undefined) ?? null;
}

async function saveGameToCloud(userId: string, state: SavedGameState): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('game_saves')
    .upsert({
      user_id: userId,
      save_data: state,
      updated_at: new Date().toISOString(),
    });
  if (error) throw error;
}

async function ensureCloudProfile(userId: string, email: string | undefined, state: SavedGameState): Promise<CloudProfile | null> {
  if (!supabase) return null;
  const { data: existing, error: selectError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (selectError) throw selectError;
  if (existing) return existing as CloudProfile;

  const displayName = email?.split('@')[0] || 'Bua Player';
  for (let attempt = 0; attempt < 6; attempt++) {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        user_id: userId,
        display_name: displayName,
        friend_code: generateFriendCode(),
        level: state.player.level,
        selected_investment_path: state.player.selectedInvestmentPath ?? null,
        current_evolution_stage: state.player.currentEvolutionStage,
        coins: state.player.coins,
      })
      .select('*')
      .single();
    if (!error) return data as CloudProfile;
    if (!String(error.message).toLowerCase().includes('duplicate')) throw error;
  }
  throw new Error('Cannot generate unique friend code. Please try again.');
}

async function syncCloudProfileSummary(userId: string, player: PlayerProgress): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('profiles')
    .update({
      level: player.level,
      selected_investment_path: player.selectedInvestmentPath ?? null,
      current_evolution_stage: player.currentEvolutionStage,
      coins: player.coins,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);
  if (error) throw error;
}

function toInvestmentPath(value?: string | null): InvestmentPath | undefined {
  return value && value in INVESTMENT_PATHS ? value as InvestmentPath : undefined;
}

function getFriendshipPair(userA: string, userB: string): [string, string] {
  return userA < userB ? [userA, userB] : [userB, userA];
}

function normalizePortfolioSnapshot(row: any): CloudPortfolioSnapshot {
  return {
    user_id: row.user_id,
    portfolio_unlocked: Boolean(row.portfolio_unlocked),
    portfolio_value: Number(row.portfolio_value ?? INITIAL_TRADING_CASH),
    return_pct: Number(row.return_pct ?? 0),
    trade_count: Number(row.trade_count ?? 0),
    updated_at: row.updated_at,
  };
}

async function savePortfolioSnapshotToCloud(
  userId: string,
  snapshot: Omit<CloudPortfolioSnapshot, 'user_id' | 'updated_at'>
): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('portfolio_snapshots')
    .upsert({
      user_id: userId,
      portfolio_unlocked: snapshot.portfolio_unlocked,
      portfolio_value: snapshot.portfolio_value,
      return_pct: snapshot.return_pct,
      trade_count: snapshot.trade_count,
      updated_at: new Date().toISOString(),
    });
  if (error) throw error;
}

function mapCloudProfileToFriend(profile: CloudProfile, snapshot?: CloudPortfolioSnapshot): FriendProfile {
  const investmentPath = toInvestmentPath(profile.selected_investment_path);
  const evolutionStage = getEvolutionStage(profile.level);
  const pathInfo = investmentPath ? INVESTMENT_PATHS[investmentPath] : null;
  const portfolioUnlocked = Boolean(snapshot?.portfolio_unlocked);
  const returnPct = portfolioUnlocked ? Number(snapshot?.return_pct ?? 0) : 0;

  return {
    id: profile.user_id,
    name: profile.display_name,
    level: profile.level,
    title: pathInfo ? pathInfo.name : EVOLUTION_INFO[evolutionStage].name,
    bio: 'เพื่อนจริงจาก Cloud Save สามารถเยี่ยมบ้าน ดูเลเวล สายการลงทุน และแข่งอันดับ Return ได้',
    favoriteLesson: profile.level >= 10 ? 'พื้นฐานการลงทุนในหุ้น 101' : 'ทำความรู้จักหุ้นฉบับมือใหม่',
    investmentPath,
    houseEmoji: '🏠',
    houseNote: pathInfo ? `กำลังพัฒนาสาย ${pathInfo.name}` : 'กำลังเริ่มเส้นทางนักลงทุน',
    coins: profile.coins,
    trading: {
      initialCapital: INITIAL_TRADING_CASH,
      portfolioUnlocked,
      portfolioValue: portfolioUnlocked ? Number(snapshot?.portfolio_value ?? INITIAL_TRADING_CASH) : INITIAL_TRADING_CASH,
      returnPct,
      tradeCount: portfolioUnlocked ? Number(snapshot?.trade_count ?? 0) : 0,
      winRatePct: undefined,
      rankTrend: returnPct > 0 ? 'up' : returnPct < 0 ? 'down' : 'same',
    },
  };
}

async function loadCloudFriends(userId: string): Promise<FriendProfile[]> {
  if (!supabase) return [];
  const { data: friendships, error } = await supabase
    .from('friendships')
    .select('user_id_1,user_id_2')
    .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`);
  if (error) throw error;

  const friendIds = Array.from(new Set((friendships ?? []).map((row: any) => (
    row.user_id_1 === userId ? row.user_id_2 : row.user_id_1
  )).filter(Boolean)));
  if (friendIds.length === 0) return [];

  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .in('user_id', friendIds);
  if (profileError) throw profileError;

  const { data: snapshots, error: snapshotError } = await supabase
    .from('portfolio_snapshots')
    .select('*')
    .in('user_id', friendIds);
  if (snapshotError) throw snapshotError;

  const snapshotMap = new Map((snapshots ?? []).map(row => {
    const snapshot = normalizePortfolioSnapshot(row);
    return [snapshot.user_id, snapshot];
  }));

  return (profiles ?? []).map(profile => mapCloudProfileToFriend(
    profile as CloudProfile,
    snapshotMap.get(profile.user_id)
  ));
}

async function loadCloudFriendRequests(userId: string): Promise<{ incoming: FriendRequestView[]; outgoing: FriendRequestView[] }> {
  if (!supabase) return { incoming: [], outgoing: [] };
  const { data: requests, error } = await supabase
    .from('friend_requests')
    .select('id,requester_id,receiver_id,status,created_at')
    .eq('status', 'pending')
    .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  if (error) throw error;

  const requestRows = requests ?? [];
  const profileIds = Array.from(new Set(requestRows.map((row: any) => (
    row.requester_id === userId ? row.receiver_id : row.requester_id
  )).filter(Boolean)));
  if (profileIds.length === 0) return { incoming: [], outgoing: [] };

  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .in('user_id', profileIds);
  if (profileError) throw profileError;

  const profileMap = new Map((profiles ?? []).map(profile => [profile.user_id, mapCloudProfileToFriend(profile as CloudProfile)]));
  const toView = (row: any): FriendRequestView | null => {
    const otherId = row.requester_id === userId ? row.receiver_id : row.requester_id;
    const profile = profileMap.get(otherId);
    return profile ? { id: row.id, requester_id: row.requester_id, receiver_id: row.receiver_id, profile } : null;
  };

  return {
    incoming: requestRows.filter((row: any) => row.receiver_id === userId).map(toView).filter(Boolean) as FriendRequestView[],
    outgoing: requestRows.filter((row: any) => row.requester_id === userId).map(toView).filter(Boolean) as FriendRequestView[],
  };
}

async function createCloudFriendRequest(userId: string, friendCode: string): Promise<CloudProfile> {
  if (!supabase) throw new Error('ยังไม่ได้เชื่อมต่อ Supabase');
  const code = friendCode.trim().toUpperCase();
  if (!code) throw new Error('กรุณาใส่ Friend ID ก่อน');

  const { data: target, error: targetError } = await supabase
    .from('profiles')
    .select('*')
    .eq('friend_code', code)
    .maybeSingle();
  if (targetError) throw targetError;
  if (!target) throw new Error('ไม่พบ Friend ID นี้ ลองตรวจสอบตัวอักษรอีกครั้ง');
  if (target.user_id === userId) throw new Error('นี่คือ Friend ID ของคุณเองน้า');

  const [userId1, userId2] = getFriendshipPair(userId, target.user_id);
  const { data: existingFriendship, error: friendshipError } = await supabase
    .from('friendships')
    .select('id')
    .eq('user_id_1', userId1)
    .eq('user_id_2', userId2)
    .maybeSingle();
  if (friendshipError) throw friendshipError;
  if (existingFriendship) throw new Error('เป็นเพื่อนกันอยู่แล้ว');

  const { error } = await supabase
    .from('friend_requests')
    .insert({
      requester_id: userId,
      receiver_id: target.user_id,
      status: 'pending',
    });
  if (error) {
    const msg = String(error.message).toLowerCase();
    if (msg.includes('duplicate')) throw new Error('ส่งคำขอไปแล้ว รอเพื่อนกดยืนยันก่อน');
    throw error;
  }

  return target as CloudProfile;
}

async function respondToCloudFriendRequest(requestId: string, action: 'accept' | 'reject'): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.rpc(
    action === 'accept' ? 'accept_friend_request' : 'reject_friend_request',
    { request_id: requestId }
  );
  if (error) throw error;
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

const BuaMascot = ({ size = 180, mood = 'happy', stage = 1, evolutionStage, investmentPath, imageOverride, imageScale = 1, imageOffsetX = 0, imageOffsetY = 0 }: { size?: number; mood?: string; stage?: number; evolutionStage?: EvolutionStage; investmentPath?: InvestmentPath; imageOverride?: string; imageScale?: number; imageOffsetX?: number; imageOffsetY?: number }) => {
  const pathImage = investmentPath ? INVESTMENT_PATHS[investmentPath]?.imageUrl : undefined;
  const imageSrc = imageOverride ?? (evolutionStage === 'investment-master' ? INVESTMENT_MASTER_IMG : pathImage ?? (evolutionStage === 'bua-seed' ? BUA_SEED_IMG : evolutionStage === 'bua-saver' ? BUA_SAVER_IMG : evolutionStage === 'bua-investor' ? BUA_INVESTOR_IMG : BUA_IMG));
  const stageImageScale = evolutionStage === 'bua-saver' && !imageOverride ? 2.25
    : evolutionStage === 'bua-investor' && !imageOverride ? 2.25
    : 1;
  const stageOffsetY = evolutionStage === 'bua-saver' && !imageOverride ? size * 0.42
    : evolutionStage === 'bua-investor' && !imageOverride ? size * 0.48
    : 0;
  return (
  <div style={{ width: size, height: size, position: 'relative', display: 'inline-block', background: 'transparent' }}>
    <img src={imageSrc} alt="Bua Buddy"
      style={{ width: '100%', height: '100%', objectFit: 'contain',
        transform: `translate(${imageOffsetX}px, ${imageOffsetY + stageOffsetY}px) scale(${imageScale * stageImageScale})`, transformOrigin: 'center bottom',
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

const EvolutionCutscene = ({
  cutscene,
  onClose,
  imageOverride,
  imageScale,
  imageOffsetX,
  imageOffsetY,
  investmentPath,
}: {
  cutscene: EvolutionCutsceneState;
  onClose: () => void;
  imageOverride?: string;
  imageScale?: number;
  imageOffsetX?: number;
  imageOffsetY?: number;
  investmentPath?: InvestmentPath | null;
}) => {
  const activePath = cutscene.investmentPath ?? investmentPath ?? undefined;
  const pathInfo = activePath ? INVESTMENT_PATHS[activePath] : null;
  const pathMasterInfo = activePath ? INVESTMENT_PATH_MASTERS[activePath] : null;
  const toInfo = EVOLUTION_INFO[cutscene.toStage];
  const toName = cutscene.milestone === 'path-master' && pathMasterInfo
    ? pathMasterInfo.masterName
    : cutscene.milestone === 'path' && pathInfo
    ? pathInfo.name
    : toInfo.name;
  const toDesc = cutscene.milestone === 'path-master' && pathMasterInfo
    ? pathMasterInfo.theme
    : cutscene.milestone === 'path' && pathInfo
    ? pathInfo.strength
    : toInfo.desc;
  const themeKey = activePath ?? cutscene.toStage;
  const theme = {
    'value-hunter': { icon: '🔎', aura: 'from-amber-300 via-yellow-200 to-orange-400', text: 'text-amber-700', chip: 'bg-amber-100 text-amber-700', particle: '📘' },
    'global-explorer': { icon: '🌏', aura: 'from-sky-300 via-blue-200 to-indigo-400', text: 'text-blue-700', chip: 'bg-blue-100 text-blue-700', particle: '✨' },
    'risk-guardian': { icon: '🛡️', aura: 'from-cyan-300 via-blue-200 to-slate-400', text: 'text-cyan-700', chip: 'bg-cyan-100 text-cyan-700', particle: '🛡️' },
    'dividend-keeper': { icon: '💎', aura: 'from-emerald-300 via-green-200 to-yellow-300', text: 'text-emerald-700', chip: 'bg-emerald-100 text-emerald-700', particle: '🪙' },
    'bua-trader': { icon: '⚡', aura: 'from-purple-300 via-fuchsia-200 to-pink-400', text: 'text-purple-700', chip: 'bg-purple-100 text-purple-700', particle: '📈' },
    'esg-hero': { icon: '🌿', aura: 'from-lime-300 via-green-200 to-emerald-400', text: 'text-green-700', chip: 'bg-green-100 text-green-700', particle: '🍃' },
    'investment-master': { icon: '👑', aura: 'from-yellow-300 via-pink-200 to-blue-400', text: 'text-yellow-700', chip: 'bg-yellow-100 text-yellow-700', particle: '👑' },
    'specialized-bua': { icon: '🌟', aura: 'from-pink-300 via-purple-200 to-blue-400', text: 'text-pink-700', chip: 'bg-pink-100 text-pink-700', particle: '🌸' },
    'bua-investor': { icon: '📈', aura: 'from-blue-300 via-sky-200 to-cyan-400', text: 'text-blue-700', chip: 'bg-blue-100 text-blue-700', particle: '✨' },
    'bua-saver': { icon: '💰', aura: 'from-green-300 via-emerald-200 to-sky-300', text: 'text-emerald-700', chip: 'bg-emerald-100 text-emerald-700', particle: '💫' },
    'bua-seed': { icon: '🌱', aura: 'from-lime-300 via-green-100 to-sky-200', text: 'text-lime-700', chip: 'bg-lime-100 text-lime-700', particle: '✨' },
  }[themeKey] ?? { icon: '✨', aura: 'from-blue-300 via-pink-200 to-purple-400', text: 'text-blue-700', chip: 'bg-blue-100 text-blue-700', particle: '✨' };
  const particles = Array.from({ length: 26 }, (_, i) => ({
    id: i,
    left: 8 + ((i * 37) % 84),
    delay: (i % 9) * 0.16,
    duration: 2.2 + (i % 5) * 0.18,
    size: 14 + (i % 4) * 4,
  }));

  return (
    <div className="fixed inset-0 bg-slate-950/80 z-[78] flex items-center justify-center p-4 overflow-hidden">
      <style>{`
        @keyframes bua-evo-reveal { 0% { transform: translateY(56px) scale(.22) rotate(-10deg); opacity: 0; filter: brightness(2.5) blur(12px); } 24% { opacity: 1; transform: translateY(-22px) scale(1.24) rotate(3deg); filter: brightness(1.75) blur(0); } 48% { transform: translateY(6px) scale(.96) rotate(-1deg); } 72% { transform: translateY(-5px) scale(1.04); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: brightness(1); } }
        @keyframes bua-evo-ring { 0% { transform: translate(-50%, -50%) rotate(0deg) scale(.72); opacity: .25; } 45% { opacity: 1; } 100% { transform: translate(-50%, -50%) rotate(360deg) scale(1.22); opacity: .45; } }
        @keyframes bua-evo-float { 0% { transform: translateY(140px) rotate(0deg) scale(.65); opacity: 0; } 18% { opacity: 1; } 100% { transform: translateY(-260px) rotate(220deg) scale(1.15); opacity: 0; } }
        @keyframes bua-evo-flash { 0% { opacity: .85; } 18% { opacity: .35; } 38%, 100% { opacity: 0; } }
        @keyframes bua-evo-card { 0% { transform: translateY(26px) scale(.94); opacity: 0; } 46% { transform: translateY(26px) scale(.94); opacity: 0; } 100% { transform: translateY(0) scale(1); opacity: 1; } }
      `}</style>

      <div className={`absolute inset-0 bg-gradient-to-br ${theme.aura} opacity-40`}/>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,.42),transparent_38%)]"/>

      {particles.map(p => (
        <div
          key={p.id}
          className="absolute bottom-[-40px] pointer-events-none"
          style={{
            left: `${p.left}%`,
            animation: `bua-evo-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            fontSize: p.size,
          }}
        >
          {p.id % 4 === 0 ? theme.particle : p.id % 4 === 1 ? '✨' : p.id % 4 === 2 ? '🌸' : '✦'}
        </div>
      ))}

      <div className="relative w-full max-w-md min-h-[680px] rounded-[2rem] overflow-hidden shadow-2xl border border-white/30 bg-white/85 backdrop-blur-xl">
        <div className={`absolute -top-28 left-1/2 w-[430px] h-[430px] rounded-full bg-gradient-to-br ${theme.aura} blur-2xl opacity-70 -translate-x-1/2`}/>
        <div className="absolute top-[210px] left-1/2 w-60 h-60 rounded-full border-4 border-white/70 border-dashed" style={{ animation: 'bua-evo-ring 3.1s linear infinite' }}/>
        <div className="absolute top-[210px] left-1/2 w-40 h-40 rounded-full border border-white/80" style={{ animation: 'bua-evo-ring 2.4s linear infinite reverse' }}/>
        <div className="absolute inset-0 bg-white pointer-events-none" style={{ animation: 'bua-evo-flash 3.4s ease-out forwards' }}/>

        <div className="relative z-10 px-6 pt-8 text-center">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${theme.chip} shadow-sm`}>
            {theme.icon} EVOLUTION MOMENT
          </div>
          <div className="text-4xl font-black text-white drop-shadow-[0_3px_12px_rgba(0,0,0,.25)] mt-5">Evolution!</div>
          <div className="mt-2 text-xs font-bold text-white/90 drop-shadow">แสงแห่งการเติบโตของน้องบัว</div>
        </div>

        <div className="absolute top-[170px] left-1/2 -translate-x-1/2 z-30 w-72 h-72 flex items-center justify-center">
          <div style={{ animation: 'bua-evo-reveal 3.25s ease-out forwards' }}>
            <BuaMascot
              size={210}
              mood="happy"
              stage={getEvolutionMascotStage(cutscene.toStage)}
              evolutionStage={cutscene.toStage}
              investmentPath={activePath}
              imageOverride={imageOverride}
              imageScale={imageScale ?? 1}
              imageOffsetX={imageOffsetX ?? 0}
              imageOffsetY={imageOffsetY ?? 0}
            />
          </div>
        </div>

        <div className="absolute left-4 right-4 bottom-5 z-40" style={{ animation: 'bua-evo-card 3.35s ease-out forwards' }}>
          <div className="bg-white/95 rounded-3xl p-5 text-center shadow-xl border border-white">
            <div className={`text-xs font-black mb-1 ${theme.text}`}>วิวัฒนาการสำเร็จ</div>
            <div className="font-black text-2xl text-gray-900">{toName}</div>
            <div className="text-sm text-gray-600 leading-relaxed mt-2">{toDesc}</div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] font-bold">
              <div className="rounded-2xl bg-blue-50 text-blue-600 p-2">ร่างใหม่</div>
              <div className="rounded-2xl bg-yellow-50 text-yellow-700 p-2">Badge</div>
              <div className="rounded-2xl bg-pink-50 text-pink-600 p-2">พลังใจ +</div>
            </div>
            <button onClick={onClose} className={`mt-4 w-full bg-gradient-to-r ${theme.aura} text-white font-black py-3 rounded-full shadow active:scale-95`}>
              ไปต่อ! ✨
            </button>
          </div>
        </div>
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

const AuthScreen = ({ onLocalMode }: { onLocalMode: () => void }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const submit = async () => {
    if (!supabase || !email || !password) return;
    setLoading(true);
    setMessage('');
    const { error } = mode === 'signin'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    if (mode === 'signup') {
      setMessage('สมัครสำเร็จแล้ว ถ้า Supabase เปิด email confirmation ให้เช็กอีเมลก่อนเข้าเกมนะ');
    }
  };

  return (
    <div className="bg-gradient-to-br from-sky-100 via-blue-50 to-pink-50 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 border border-blue-100">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center border border-blue-100">
            <BuaMascot size={58} mood="happy" evolutionStage="bua-seed"/>
          </div>
          <div>
            <div className="text-[10px] text-blue-500 font-black">Cloud Save Phase 1</div>
            <div className="font-black text-2xl text-gray-800">Bua Buddy Login</div>
            <div className="text-xs text-gray-500">ล็อกอินเพื่อเก็บข้อมูลเกมไว้บน database</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-gray-100 rounded-2xl p-1 mb-4">
          <button onClick={() => setMode('signin')} className={`py-2 rounded-xl text-sm font-bold ${mode === 'signin' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>เข้าสู่ระบบ</button>
          <button onClick={() => setMode('signup')} className={`py-2 rounded-xl text-sm font-bold ${mode === 'signup' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>สมัครใหม่</button>
        </div>

        <div className="space-y-3">
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-400"
          />
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-400"
          />
          <button
            onClick={submit}
            disabled={loading || !email || !password}
            className={`w-full rounded-full py-3 font-black shadow ${loading || !email || !password ? 'bg-gray-200 text-gray-400' : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white active:scale-95'}`}
          >
            {loading ? 'กำลังเชื่อมต่อ...' : mode === 'signin' ? 'เข้าสู่เกม' : 'สร้างบัญชี'}
          </button>
        </div>

        {message && <div className="mt-3 text-xs text-center text-orange-600 bg-orange-50 border border-orange-100 rounded-2xl p-3">{message}</div>}

        <button onClick={onLocalMode} className="w-full mt-4 text-xs text-gray-500 font-bold underline">
          เล่นแบบ local ต่อไปก่อน
        </button>
      </div>
    </div>
  );
};

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  // --- Load or init ---
  const saved = loadGame();

  const [player,      setPlayer]      = useState<PlayerProgress>(saved?.player ?? createDefaultPlayer());
  const [tradingCash, setTradingCash] = useState(saved?.tradingCash ?? INITIAL_TRADING_CASH);
  const [holdings,    setHoldings]    = useState<Record<string, { shares: number; avgCost: number }>>(saved?.holdings ?? {});
  const [tradeHistory,setTradeHistory]= useState<any[]>(saved?.tradeHistory ?? []);
  const [marketTick, setMarketTick] = useState(() => getMarketTick());
  const [stocks, setStocks] = useState(() => buildMarketStocks(getMarketTick()));

  const [screen,     setScreen]     = useState('home');
  const [modal,      setModal]      = useState<any>(null);
  const [reward,     setReward]     = useState<any>(null);
  const [mascotBubble, setMascotBubble] = useState<{ text: string; id: number } | null>(null);
  const [quizState,  setQuizState]  = useState({ step: 'lesson', answer: null as number | null });
  const [investTab,  setInvestTab]  = useState('market');
  const [cat,        setCat]        = useState<'all' | AssetCategory | 'my-path'>('all');
  const [selected,   setSelected]   = useState<any>(null);
  const [tradeQty,   setTradeQty]   = useState(1);
  const [levelUpInfo,setLevelUpInfo]= useState<{ level: number } | null>(null);
  const [portfolioUnlockInfo, setPortfolioUnlockInfo] = useState(false);
  const [showPortfolioTutorial, setShowPortfolioTutorial] = useState(false);
  const [evolutionInfo, setEvolutionInfo] = useState<EvolutionCutsceneState | null>(null);
  const [showPathModal, setShowPathModal] = useState(false);
  const [pathPromptDismissed, setPathPromptDismissed] = useState(false);
  const [showDev,    setShowDev]    = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [cloudProfile, setCloudProfile] = useState<CloudProfile | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(isSupabaseConfigured ? 'loading' : 'local-only');
  const [cloudLoading, setCloudLoading] = useState(isSupabaseConfigured);
  const [localMode, setLocalMode] = useState(!isSupabaseConfigured);
  const [cloudFriends, setCloudFriends] = useState<FriendProfile[]>([]);
  const [incomingFriendRequests, setIncomingFriendRequests] = useState<FriendRequestView[]>([]);
  const [outgoingFriendRequests, setOutgoingFriendRequests] = useState<FriendRequestView[]>([]);
  const [friendLoading, setFriendLoading] = useState(false);
  const [friendMessage, setFriendMessage] = useState('');

  const cloudLoadedRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const portfolioSnapshotTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mascotBubbleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!supabase) {
      setCloudLoading(false);
      setSyncStatus('local-only');
      return;
    }

    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setCloudLoading(false);
      if (!data.session) setSyncStatus('local-only');
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setCloudProfile(null);
      setCloudFriends([]);
      setIncomingFriendRequests([]);
      setOutgoingFriendRequests([]);
      setFriendMessage('');
      cloudLoadedRef.current = false;
      if (nextSession) {
        setCloudLoading(true);
        setSyncStatus('loading');
      } else {
        setLocalMode(false);
        setCloudLoading(false);
        setSyncStatus('local-only');
      }
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const scheduleNextMarketTick = () => {
      const nextTick = getMarketTick();
      setMarketTick(nextTick);
      timer = setTimeout(scheduleNextMarketTick, getMsUntilNextMarketTick());
    };

    scheduleNextMarketTick();
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    setStocks(buildMarketStocks(marketTick));
  }, [marketTick]);

  useEffect(() => {
    if (!selected?.sym) return;
    const latestSelected = stocks.find(stock => stock.sym === selected.sym);
    if (latestSelected && latestSelected.marketTick !== selected.marketTick) {
      setSelected(latestSelected);
    }
  }, [stocks, selected?.sym, selected?.marketTick]);

  useEffect(() => {
    if (!supabase || !session || localMode) return;
    let active = true;

    const bootstrapCloudSave = async () => {
      setCloudLoading(true);
      setSyncStatus('loading');
      try {
        const fallbackState = createSaveState(player, tradingCash, holdings, tradeHistory);
        const profile = await ensureCloudProfile(session.user.id, session.user.email, fallbackState);
        const cloudState = await loadGameFromCloud(session.user.id);
        const migratedCloudState = migrateSavedGameState(cloudState);

        if (!active) return;
        if (migratedCloudState) {
          setPlayer(migratedCloudState.player);
          setTradingCash(migratedCloudState.tradingCash);
          setHoldings(migratedCloudState.holdings);
          setTradeHistory(migratedCloudState.tradeHistory);
          saveGame(migratedCloudState);
          if (cloudState?.version !== SAVE_VERSION) {
            await saveGameToCloud(session.user.id, migratedCloudState);
          }
        } else {
          await saveGameToCloud(session.user.id, fallbackState);
        }

        if (!active) return;
        setCloudProfile(profile);
        cloudLoadedRef.current = true;
        setSyncStatus('synced');
      } catch (error) {
        console.error('Cloud save bootstrap failed', error);
        if (active) setSyncStatus('error');
      } finally {
        if (active) setCloudLoading(false);
      }
    };

    bootstrapCloudSave();
    return () => { active = false; };
  }, [session?.user.id, localMode]);

  // --- Persist on change ---
  useEffect(() => {
    const state = createSaveState(player, tradingCash, holdings, tradeHistory);
    saveGame(state);

    if (!supabase || !session || localMode || !cloudLoadedRef.current) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSyncStatus('saving');
    saveTimerRef.current = setTimeout(async () => {
      try {
        await saveGameToCloud(session.user.id, state);
        await syncCloudProfileSummary(session.user.id, player);
        setSyncStatus('synced');
      } catch (error) {
        console.error('Cloud save failed', error);
        setSyncStatus('error');
      }
    }, 1200);
  }, [player, tradingCash, holdings, tradeHistory, session?.user.id, localMode]);

  const refreshCloudFriends = useCallback(async () => {
    if (!supabase || !session || localMode) {
      setCloudFriends([]);
      setIncomingFriendRequests([]);
      setOutgoingFriendRequests([]);
      return;
    }

    setFriendLoading(true);
    try {
      const [friends, requests] = await Promise.all([
        loadCloudFriends(session.user.id),
        loadCloudFriendRequests(session.user.id),
      ]);
      setCloudFriends(friends);
      setIncomingFriendRequests(requests.incoming);
      setOutgoingFriendRequests(requests.outgoing);
    } catch (error) {
      console.error('Friend sync failed', error);
      setFriendMessage('โหลดรายชื่อเพื่อนไม่สำเร็จ ลองตรวจว่า run SQL Phase 2 แล้วหรือยัง');
    } finally {
      setFriendLoading(false);
    }
  }, [session?.user.id, localMode]);

  useEffect(() => {
    refreshCloudFriends();
  }, [refreshCloudFriends, cloudProfile?.friend_code]);

  useEffect(() => {
    if (screen !== 'friends' || !session || localMode) return;
    refreshCloudFriends();
    const interval = setInterval(refreshCloudFriends, 10000);
    return () => clearInterval(interval);
  }, [screen, session?.user.id, localMode, refreshCloudFriends]);

  const sendFriendRequest = useCallback(async (friendCode: string) => {
    if (!session) {
      setFriendMessage('ต้อง login ก่อนถึงจะเพิ่มเพื่อนจริงได้');
      return;
    }
    setFriendLoading(true);
    setFriendMessage('');
    try {
      const target = await createCloudFriendRequest(session.user.id, friendCode);
      setFriendMessage(`ส่งคำขอไปหา ${target.display_name} แล้ว`);
      await refreshCloudFriends();
    } catch (error) {
      console.error('Send friend request failed', error);
      setFriendMessage(error instanceof Error ? error.message : 'ส่งคำขอไม่สำเร็จ');
    } finally {
      setFriendLoading(false);
    }
  }, [session?.user.id, refreshCloudFriends]);

  const handleFriendRequest = useCallback(async (requestId: string, action: 'accept' | 'reject') => {
    setFriendLoading(true);
    setFriendMessage('');
    try {
      await respondToCloudFriendRequest(requestId, action);
      setFriendMessage(action === 'accept' ? 'รับเพื่อนแล้ว! ไปเยี่ยมบ้านได้เลย' : 'ปฏิเสธคำขอแล้ว');
      await refreshCloudFriends();
    } catch (error) {
      console.error('Friend request response failed', error);
      setFriendMessage(error instanceof Error ? error.message : 'จัดการคำขอไม่สำเร็จ');
    } finally {
      setFriendLoading(false);
    }
  }, [refreshCloudFriends]);

  // --- Derived ---
  const expNeeded     = getRequiredExp(player.level);
  const phase         = getLearningPhase(player.level);
  const phaseInfo     = PHASE_INFO[phase];
  const nextUnlock    = getNextUnlock(player.level);
  const evoStage      = getPlayerEvolutionStage(player);
  const selectedPathMasterInfo = player.selectedInvestmentPath ? INVESTMENT_PATH_MASTERS[player.selectedInvestmentPath] : null;
  const selectedPathMasterReached = Boolean(
    player.level >= 50 &&
    player.selectedInvestmentPath &&
    selectedPathMasterInfo &&
    player.earnedBadgeIds.includes(selectedPathMasterInfo.badgeId)
  );
  const allPathMastersCompleted = hasAllPathMasterBadges(player.earnedBadgeIds);
  const evoInfo       = selectedPathMasterReached && !allPathMastersCompleted && selectedPathMasterInfo
    ? { name: selectedPathMasterInfo.masterName, desc: selectedPathMasterInfo.theme, minLevel: 50 }
    : EVOLUTION_INFO[evoStage];
  const selectedPathMasterAssets = selectedPathMasterReached && player.selectedInvestmentPath === 'value-hunter'
    ? { mascot: VALUE_MASTER_IMG, background: BG_VALUE_MASTER_IMG }
    : selectedPathMasterReached && player.selectedInvestmentPath === 'global-explorer'
    ? { mascot: GLOBAL_MASTER_IMG, background: BG_GLOBAL_MASTER_IMG }
    : selectedPathMasterReached && player.selectedInvestmentPath === 'risk-guardian'
    ? { mascot: GUARDIAN_MASTER_IMG, background: BG_GUARDIAN_MASTER_IMG }
    : selectedPathMasterReached && player.selectedInvestmentPath === 'dividend-keeper'
    ? { mascot: DIVIDEND_MASTER_IMG, background: BG_DIVIDEND_MASTER_IMG }
    : selectedPathMasterReached && player.selectedInvestmentPath === 'esg-hero'
    ? { mascot: ESG_MASTER_IMG, background: BG_ESG_MASTER_IMG }
    : selectedPathMasterReached && player.selectedInvestmentPath === 'bua-trader'
    ? { mascot: TRADING_MASTER_IMG, background: BG_TRADING_MASTER_IMG }
    : null;
  const isInvestmentMaster = evoStage === 'investment-master';
  const mascotImageOverride = isInvestmentMaster ? undefined : selectedPathMasterAssets?.mascot;
  const mascotImageScale = isInvestmentMaster ? 1.0
    : (selectedPathMasterAssets && player.selectedInvestmentPath === 'value-hunter') ? 2.40
    : (selectedPathMasterAssets && player.selectedInvestmentPath === 'risk-guardian') ? 2.40
    : (selectedPathMasterAssets && player.selectedInvestmentPath === 'dividend-keeper') ? 2.40
    : (selectedPathMasterAssets && player.selectedInvestmentPath === 'bua-trader') ? 2.40
    : selectedPathMasterAssets ? 2.15 : 1;
  const mascotImageOffset = isInvestmentMaster
    ? { x: 8, y: 0 }
    : player.selectedInvestmentPath === 'value-hunter' && selectedPathMasterAssets
    ? { x: 8, y: 100 }
    : player.selectedInvestmentPath === 'global-explorer' && selectedPathMasterAssets
    ? { x: -8, y: 100 }
    : player.selectedInvestmentPath === 'risk-guardian' && selectedPathMasterAssets
    ? { x: 8, y: 100 }
    : player.selectedInvestmentPath === 'dividend-keeper' && selectedPathMasterAssets
    ? { x: 8, y: 100 }
    : player.selectedInvestmentPath === 'esg-hero' && selectedPathMasterAssets
    ? { x: 8, y: 80 }
    : player.selectedInvestmentPath === 'bua-trader' && selectedPathMasterAssets
    ? { x: 8, y: 80 }
    : selectedPathMasterAssets ? { x: 8, y: 60 } : { x: 0, y: 0 };
  const profileMascotImageOffset = isInvestmentMaster
    ? { x: 4, y: 0 }
    : player.selectedInvestmentPath === 'global-explorer' && selectedPathMasterAssets
    ? { x: 4, y: 35 }
    : player.selectedInvestmentPath === 'risk-guardian' && selectedPathMasterAssets
    ? { x: 4, y: 35 }
    : player.selectedInvestmentPath === 'dividend-keeper' && selectedPathMasterAssets
    ? { x: 4, y: 35 }
    : player.selectedInvestmentPath === 'esg-hero' && selectedPathMasterAssets
    ? { x: 4, y: 35 }
    : player.selectedInvestmentPath === 'bua-trader' && selectedPathMasterAssets
    ? { x: 4, y: 35 }
    : selectedPathMasterAssets ? { x: 4, y: 25 } : { x: 0, y: 0 };
  const modalMascotImageOffset = isInvestmentMaster
    ? { x: 4, y: 0 }
    : player.selectedInvestmentPath === 'value-hunter' && selectedPathMasterAssets
    ? { x: -11, y: 200 }
    : profileMascotImageOffset;
  const sceneBgImg    = evoStage === 'investment-master' ? BG_MASTER_IMG : selectedPathMasterAssets?.background ?? BG_IMG;
  const selectedPathInfo = player.selectedInvestmentPath ? INVESTMENT_PATHS[player.selectedInvestmentPath] : null;
  const mood          = player.happy < 30 || player.energy < 30 ? 'sad' : 'happy';
  const mascotStage   = player.level >= 30 ? 4 : player.level >= 20 ? 3 : player.level >= 10 ? 2 : 1;

  const holdingsValue = Object.entries(holdings).reduce((s, [sym, h]) => {
    const st = stocks.find(x => x.sym === sym); return s + (st ? getAssetThbPrice(st) * h.shares : 0);
  }, 0);
  const totalCost  = Object.entries(holdings).reduce((s, [sym, h]) => {
    const st = stocks.find(x => x.sym === sym);
    return s + (st ? getHoldingAvgCostThb(h, st) : h.avgCost) * h.shares;
  }, 0);
  const totalValue = tradingCash + holdingsValue;
  const totalPnL   = holdingsValue - totalCost;
  const totalPnLPct= totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  const portfolioUnlocked = player.unlockedFeatureIds.includes('portfolio');
  const portfolioChecklist = getPortfolioChecklist(player);
  const portfolioReady = isPortfolioReady(player);
  const largestHoldingPct = holdingsValue > 0
    ? Math.max(...Object.entries(holdings).map(([sym, h]) => {
        const st = stocks.find(x => x.sym === sym);
        return st ? (getAssetThbPrice(st) * h.shares / holdingsValue) * 100 : 0;
      }))
    : 0;
  const cashPct = totalValue > 0 ? (tradingCash / totalValue) * 100 : 100;
  const portfolioHealthScore = Math.max(0, Math.min(100,
    40
    + Math.min(Object.keys(holdings).length, 5) * 10
    + (largestHoldingPct > 55 ? -15 : 10)
    + (cashPct > 85 ? -10 : cashPct >= 10 && cashPct <= 40 ? 10 : 0)
  ));
  const playerTradingReturnPct = calcTradingReturnPct(totalValue);
  const activeFriends = session && !localMode ? cloudFriends : FRIENDS;
  const tradeRankings = [
    {
      id: 'player',
      name: 'You',
      level: player.level,
      title: evoInfo.name,
      isPlayer: true,
      investmentPath: player.selectedInvestmentPath,
      evolutionStage: evoStage,
      mascotStage,
      portfolioUnlocked,
      portfolioValue: portfolioUnlocked ? totalValue : INITIAL_TRADING_CASH,
      returnPct: portfolioUnlocked ? playerTradingReturnPct : 0,
      tradeCount: portfolioUnlocked ? player.tradeCount : 0,
      winRatePct: undefined as number | undefined,
      rankTrend: portfolioUnlocked && playerTradingReturnPct > 0 ? 'up' as RankTrend : portfolioUnlocked && playerTradingReturnPct < 0 ? 'down' as RankTrend : 'same' as RankTrend,
    },
    ...activeFriends.map(friend => ({
      id: friend.id,
      name: friend.name,
      level: friend.level,
      title: friend.title,
      isPlayer: false,
      investmentPath: friend.investmentPath,
      evolutionStage: getEvolutionStage(friend.level),
      mascotStage: friend.level >= 30 ? 4 : friend.level >= 20 ? 3 : friend.level >= 10 ? 2 : 1,
      portfolioUnlocked: friend.trading.portfolioUnlocked ?? false,
      portfolioValue: friend.trading.portfolioValue,
      returnPct: friend.trading.returnPct,
      tradeCount: friend.trading.tradeCount,
      winRatePct: friend.trading.winRatePct,
      rankTrend: friend.trading.rankTrend ?? 'same' as RankTrend,
    })),
  ]
    .sort((a, b) => Number(b.portfolioUnlocked) - Number(a.portfolioUnlocked) || b.returnPct - a.returnPct || b.portfolioValue - a.portfolioValue || a.tradeCount - b.tradeCount)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
  const playerTradeRank = tradeRankings.find(entry => entry.isPlayer);

  useEffect(() => {
    if (!supabase || !session || localMode || !cloudLoadedRef.current) return;
    if (portfolioSnapshotTimerRef.current) clearTimeout(portfolioSnapshotTimerRef.current);

    portfolioSnapshotTimerRef.current = setTimeout(async () => {
      try {
        await savePortfolioSnapshotToCloud(session.user.id, {
          portfolio_unlocked: portfolioUnlocked,
          portfolio_value: portfolioUnlocked ? totalValue : INITIAL_TRADING_CASH,
          return_pct: portfolioUnlocked ? playerTradingReturnPct : 0,
          trade_count: portfolioUnlocked ? player.tradeCount : 0,
        });
        await refreshCloudFriends();
      } catch (error) {
        console.error('Portfolio snapshot sync failed', error);
        setFriendMessage('ซิงก์ Portfolio Ranking ไม่สำเร็จ ลองตรวจว่า run SQL Snapshot แล้วหรือยัง');
      }
    }, 350);
  }, [session?.user.id, localMode, portfolioUnlocked, totalValue, playerTradingReturnPct, player.tradeCount, refreshCloudFriends]);

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

  useEffect(() => {
    const nextBadgeIds = getBadgeIdsForLevelAndPath(player.level, player.selectedInvestmentPath, player.earnedBadgeIds);
    const nextEvolutionStage = getPlayerEvolutionStage({ ...player, earnedBadgeIds: nextBadgeIds });
    const badgeChanged = nextBadgeIds.length !== player.earnedBadgeIds.length;
    const stageChanged = nextEvolutionStage !== player.currentEvolutionStage;
    if (badgeChanged || stageChanged) {
      const gainedBadgeIds = nextBadgeIds.filter(id => !player.earnedBadgeIds.includes(id));
      const gainedPathMasterBadge = gainedBadgeIds.find(id => PATH_MASTER_BADGE_IDS.includes(id));
      const gainedInvestmentMasterBadge = gainedBadgeIds.includes(INVESTMENT_MASTER_BADGE_ID);
      if (stageChanged || gainedPathMasterBadge || gainedInvestmentMasterBadge) {
        setEvolutionInfo({
          fromStage: player.currentEvolutionStage,
          toStage: nextEvolutionStage,
          investmentPath: player.selectedInvestmentPath,
          milestone: gainedInvestmentMasterBadge ? 'investment-master' : gainedPathMasterBadge ? 'path-master' : 'stage',
        });
      }
      setPlayer(p => ({
        ...p,
        earnedBadgeIds: nextBadgeIds,
        currentEvolutionStage: nextEvolutionStage,
      }));
    }
  }, [player.level, player.selectedInvestmentPath, player.earnedBadgeIds.join('|'), player.currentEvolutionStage]);

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
      const nextBadgeIds = getBadgeIdsForLevelAndPath(level, p.selectedInvestmentPath, p.earnedBadgeIds);
      const nextEvolutionStage = getPlayerEvolutionStage({ ...p, level, earnedBadgeIds: nextBadgeIds });
      const gainedBadgeIds = nextBadgeIds.filter(id => !p.earnedBadgeIds.includes(id));
      const gainedPathMasterBadge = gainedBadgeIds.find(id => PATH_MASTER_BADGE_IDS.includes(id));
      const gainedInvestmentMasterBadge = gainedBadgeIds.includes(INVESTMENT_MASTER_BADGE_ID);
      // Check new features
      const newFeatures = FEATURE_UNLOCKS
        .filter(f => f.id !== 'portfolio' && f.requiredLevel <= level && !p.unlockedFeatureIds.includes(f.id))
        .map(f => f.id);

      if (leveled) setLevelUpInfo({ level });
      if (nextEvolutionStage !== p.currentEvolutionStage || gainedPathMasterBadge || gainedInvestmentMasterBadge) {
        setEvolutionInfo({
          fromStage: p.currentEvolutionStage,
          toStage: nextEvolutionStage,
          investmentPath: p.selectedInvestmentPath,
          milestone: gainedInvestmentMasterBadge ? 'investment-master' : gainedPathMasterBadge ? 'path-master' : 'stage',
        });
      }
      return {
        ...p, level, currentExp: exp, totalExp: p.totalExp + amount,
        earnedBadgeIds: nextBadgeIds,
        unlockedFeatureIds: [...new Set([...p.unlockedFeatureIds, ...newFeatures])],
        currentEvolutionStage: nextEvolutionStage,
      };
    });
  }, []);

  const selectInvestmentPath = (path: InvestmentPath) => {
    const pathInfo = INVESTMENT_PATHS[path];
    setPlayer(p => {
      const baseBadgeIds = [...new Set([...p.earnedBadgeIds, 'path-chosen', pathInfo.badgeId])];
      const nextBadgeIds = getBadgeIdsForLevelAndPath(p.level, path, baseBadgeIds);
      const nextEvolutionStage = getPlayerEvolutionStage({ ...p, selectedInvestmentPath: path, earnedBadgeIds: nextBadgeIds });
      const gainedBadgeIds = nextBadgeIds.filter(id => !p.earnedBadgeIds.includes(id));
      const gainedPathMasterBadge = gainedBadgeIds.find(id => PATH_MASTER_BADGE_IDS.includes(id));
      const gainedInvestmentMasterBadge = gainedBadgeIds.includes(INVESTMENT_MASTER_BADGE_ID);
      setEvolutionInfo({
        fromStage: p.currentEvolutionStage,
        toStage: nextEvolutionStage,
        investmentPath: path,
        milestone: gainedInvestmentMasterBadge ? 'investment-master' : gainedPathMasterBadge ? 'path-master' : 'path',
      });
      return {
        ...p,
        selectedInvestmentPath: path,
        currentEvolutionStage: nextEvolutionStage,
        unlockedFeatureIds: [...new Set([...p.unlockedFeatureIds, 'inv-path'])],
        earnedBadgeIds: nextBadgeIds,
      };
    });
    setShowPathModal(false);
    setPathPromptDismissed(false);
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

  const showMascotBubble = (text: string) => {
    if (mascotBubbleTimerRef.current) clearTimeout(mascotBubbleTimerRef.current);
    setMascotBubble({ text, id: Date.now() });
    mascotBubbleTimerRef.current = setTimeout(() => setMascotBubble(null), 4200);
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
    if (q.lessonId && player.completedLessonIds.includes(q.lessonId)) return q.lesson ? 'in-progress' : 'reward';
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
    if (q.type !== 'action' && q.type !== 'trade' && q.type !== 'friend' && !correct) {
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
    const completedByLesson = Boolean(q.lessonId && player.completedLessonIds.includes(q.lessonId));
    if ((!player.completedQuestIds.includes(q.id) && !completedByLesson) || player.claimedRewardIds.includes(q.id)) return;
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
      completedQuestIds: p.completedQuestIds.includes(q.id) ? p.completedQuestIds : [...p.completedQuestIds, q.id],
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
    const nextHappy = Math.min(100, player.happy + item.happy);
    const nextEnergy = Math.min(100, player.energy + item.energy);
    setPlayer(p => ({
      ...p,
      coins: p.coins - item.price,
      happy: Math.min(100, p.happy + item.happy),
      energy: Math.min(100, p.energy + item.energy),
      feedCount: p.feedCount + 1,
      completedQuestIds: p.completedQuestIds.includes('q4') ? p.completedQuestIds : [...p.completedQuestIds, 'q4'],
    }));
    setScreen('home');
    setModal(null);
    showMascotBubble(getFeedReaction(nextHappy, nextEnergy));
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
  const buyStock = (stock: any, qty: number) => {
    const cost = getAssetThbPrice(stock) * qty;
    if (cost > tradingCash) { showReward(0, 0, '💸 เงินไม่พอ!'); return; }
    setTradingCash(c => c - cost);
    setHoldings(h => {
      const cur = h[stock.sym] || { shares: 0, avgCost: 0 };
      const tot = cur.shares + qty;
      const curAvgCost = getHoldingAvgCostThb(cur, stock);
      return { ...h, [stock.sym]: { shares: tot, avgCost: (curAvgCost * cur.shares + cost) / tot } };
    });
    setTradeHistory(hist => [{ type: 'buy', sym: stock.sym, qty, price: getAssetThbPrice(stock), quotePrice: stock.price, currency: stock.currency, time: Date.now() }, ...hist]);
    setPlayer(p => ({
      ...p,
      tradeCount: p.tradeCount + 1,
      completedQuestIds: p.completedQuestIds.includes('q6') ? p.completedQuestIds : [...p.completedQuestIds, 'q6'],
    }));
    if (!player.completedQuestIds.includes('q6')) {
      showReward(0, 0, '🎉 ภารกิจซื้อสินทรัพย์สำเร็จ! ไปรับรางวัลได้');
    } else { showReward(10, 5, `✅ ซื้อ ${stock.sym} ${qty} หน่วย`); }
    setSelected(null);
  };

  const sellStock = (stock: any, qty: number) => {
    const cur = holdings[stock.sym];
    if (!cur || cur.shares < qty) { showReward(0, 0, '❌ จำนวนสินทรัพย์ไม่พอขาย!'); return; }
    setTradingCash(c => c + getAssetThbPrice(stock) * qty);
    setHoldings(h => {
      const rem = cur.shares - qty;
      if (rem === 0) { const nh = { ...h }; delete nh[stock.sym]; return nh; }
      return { ...h, [stock.sym]: { ...cur, shares: rem } };
    });
    setTradeHistory(hist => [{ type: 'sell', sym: stock.sym, qty, price: getAssetThbPrice(stock), quotePrice: stock.price, currency: stock.currency, time: Date.now() }, ...hist]);
    setPlayer(p => ({ ...p, tradeCount: p.tradeCount + 1 }));
    showReward(10, 5, `💰 ขาย ${stock.sym} ${qty} หน่วย`);
    setSelected(null);
  };

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setSession(null);
    setCloudProfile(null);
    cloudLoadedRef.current = false;
    setLocalMode(false);
    setSyncStatus(isSupabaseConfigured ? 'local-only' : 'local-only');
  };

  const resetGameProgress = async () => {
    const freshPlayer = createDefaultPlayer();
    const freshState = createSaveState(freshPlayer, INITIAL_TRADING_CASH, {}, []);

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    if (portfolioSnapshotTimerRef.current) clearTimeout(portfolioSnapshotTimerRef.current);

    saveGame(freshState);
    setPlayer(freshPlayer);
    setTradingCash(INITIAL_TRADING_CASH);
    setHoldings({});
    setTradeHistory([]);
    setSelected(null);
    setModal(null);
    setReward(null);
    setLevelUpInfo(null);
    setPortfolioUnlockInfo(false);
    setShowPortfolioTutorial(false);
    setEvolutionInfo(null);
    setShowPathModal(false);
    setPathPromptDismissed(false);
    setScreen('home');

    if (!supabase || !session || localMode || !cloudLoadedRef.current) {
      showReward(0, 0, 'รีเซ็ตข้อมูลในเครื่องแล้ว');
      return;
    }

    setSyncStatus('saving');
    try {
      await saveGameToCloud(session.user.id, freshState);
      await syncCloudProfileSummary(session.user.id, freshPlayer);
      try {
        await savePortfolioSnapshotToCloud(session.user.id, {
          portfolio_unlocked: false,
          portfolio_value: INITIAL_TRADING_CASH,
          return_pct: 0,
          trade_count: 0,
        });
      } catch (snapshotError) {
        console.warn('Portfolio snapshot reset skipped', snapshotError);
      }
      setCloudProfile(profile => profile ? {
        ...profile,
        level: freshPlayer.level,
        selected_investment_path: null,
        current_evolution_stage: freshPlayer.currentEvolutionStage,
        coins: freshPlayer.coins,
      } : profile);
      setSyncStatus('synced');
      showReward(0, 0, 'รีเซ็ต Progress และ Cloud Save แล้ว');
    } catch (error) {
      console.error('Reset cloud save failed', error);
      setSyncStatus('error');
      showReward(0, 0, 'รีเซ็ตในเครื่องแล้ว แต่ Cloud Save ยังไม่สำเร็จ');
    }
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
        <button onClick={() => setEvolutionInfo({
          fromStage: 'bua-seed',
          toStage: 'bua-saver',
          milestone: 'stage',
        })} className="w-full mb-1 bg-cyan-600 rounded-lg py-1 active:scale-95">Test Evolution FX</button>
        <button onClick={() => setPlayer(p => {
          const level = p.level + 5;
          const earnedBadgeIds = getBadgeIdsForLevelAndPath(level, p.selectedInvestmentPath, p.earnedBadgeIds);
          return { ...p, level, earnedBadgeIds, currentExp: 0, currentEvolutionStage: getPlayerEvolutionStage({ ...p, level, earnedBadgeIds }) };
        })} className="w-full mb-1 bg-green-600 rounded-lg py-1 active:scale-95">+5 Level</button>
        <button onClick={() => setPlayer(p => {
          const level = 10;
          return { ...p, level, currentExp: 0, currentEvolutionStage: getPlayerEvolutionStage({ ...p, level }), unlockedFeatureIds: [...p.unlockedFeatureIds, 'portfolio', 'money-quests'] };
        })} className="w-full mb-1 bg-purple-600 rounded-lg py-1 active:scale-95">Set Lv.10 + Unlock Portfolio</button>
        <button onClick={() => { setPlayer(p => {
          const level = 20;
          return { ...p, level, currentExp: 0, currentEvolutionStage: getPlayerEvolutionStage({ ...p, level }), unlockedFeatureIds: [...FEATURE_UNLOCKS.map(f => f.id)] };
        }); setShowPathModal(true); }} className="w-full mb-1 bg-orange-600 rounded-lg py-1 active:scale-95">Set Lv.20 + Path</button>
        <button onClick={() => setPlayer(p => {
          const level = 50;
          const selectedInvestmentPath = p.selectedInvestmentPath ?? 'dividend-keeper';
          const baseBadgeIds = [...new Set([...p.earnedBadgeIds, 'path-chosen', INVESTMENT_PATHS[selectedInvestmentPath].badgeId])];
          const earnedBadgeIds = getBadgeIdsForLevelAndPath(level, selectedInvestmentPath, baseBadgeIds);
          const nextEvolutionStage = getPlayerEvolutionStage({ ...p, level, earnedBadgeIds });
          setEvolutionInfo({
            fromStage: p.currentEvolutionStage,
            toStage: nextEvolutionStage,
            investmentPath: selectedInvestmentPath,
            milestone: 'path-master',
          });
          return { ...p, level, selectedInvestmentPath, earnedBadgeIds, currentExp: 0, currentEvolutionStage: nextEvolutionStage };
        })} className="w-full mb-1 bg-pink-600 rounded-lg py-1 active:scale-95">Set Lv.50 Path Master</button>
        <button onClick={() => setPlayer(p => {
          const level = Math.max(50, p.level);
          const earnedBadgeIds = [...new Set([...p.earnedBadgeIds, ...PATH_MASTER_BADGE_IDS, INVESTMENT_MASTER_BADGE_ID])];
          const nextEvolutionStage = getPlayerEvolutionStage({ ...p, level, earnedBadgeIds });
          setEvolutionInfo({
            fromStage: p.currentEvolutionStage,
            toStage: nextEvolutionStage,
            investmentPath: p.selectedInvestmentPath,
            milestone: 'investment-master',
          });
          return { ...p, level, earnedBadgeIds, currentExp: 0, currentEvolutionStage: nextEvolutionStage };
        })} className="w-full mb-1 bg-yellow-700 rounded-lg py-1 active:scale-95">Complete All Masters</button>
        <button onClick={() => setPlayer(p => ({ ...p, completedQuestIds: [...new Set([...p.completedQuestIds, ...MONEY_QUEST_IDS])] }))} className="w-full mb-1 bg-teal-600 rounded-lg py-1 active:scale-95">Complete Money Quests</button>
        <button onClick={() => setPlayer(p => ({ ...p, completedLessonIds: [...new Set([...p.completedLessonIds, ...STOCK101_LESSONS.map(l => l.id)])], earnedBadgeIds: [...new Set([...p.earnedBadgeIds, STOCK101_CHAPTER_BONUS.badgeId])] }))} className="w-full mb-1 bg-indigo-600 rounded-lg py-1 active:scale-95">Complete Stock 101</button>
        <button onClick={resetGameProgress} className="w-full bg-red-700 rounded-lg py-1 active:scale-95 flex items-center justify-center gap-1"><RotateCcw size={10}/> Reset Progress</button>
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
              <BuaMascot size={52} stage={mascotStage} evolutionStage={evoStage} investmentPath={player.selectedInvestmentPath} imageOverride={mascotImageOverride} imageScale={mascotImageScale} imageOffsetX={profileMascotImageOffset.x} imageOffsetY={profileMascotImageOffset.y}/>
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
            <style>{`
              @keyframes mascot-bubble-bounce-stable {
                0% { opacity: 1; transform: translateY(14px) scale(.9); }
                12% { opacity: 1; transform: translateY(-5px) scale(1.04); }
                22% { opacity: 1; transform: translateY(0) scale(1); }
                100% { opacity: 1; transform: translateY(0) scale(1); }
              }
            `}</style>
            {mascotBubble && (
              <div
                key={mascotBubble.id}
                className="absolute left-[14px] top-[72px] z-30 w-[160px] min-h-[64px] rounded-[24px] bg-white border-[4px] border-black shadow-2xl flex items-center justify-center text-center px-3 py-2"
                style={{ animation: 'mascot-bubble-bounce-stable 4.2s cubic-bezier(.16, 1, .3, 1) forwards' }}
              >
                <div className="text-[11px] font-bold text-gray-700 leading-snug">
                  {mascotBubble.text}
                </div>
                <div className="absolute -bottom-[28px] right-7 w-0 h-0 border-l-[22px] border-l-transparent border-r-[8px] border-r-transparent border-t-[28px] border-t-black rotate-[-18deg]"/>
                <div className="absolute -bottom-[19px] right-[38px] w-0 h-0 border-l-[15px] border-l-transparent border-r-[6px] border-r-transparent border-t-[21px] border-t-white rotate-[-18deg]"/>
              </div>
            )}
            <div className={`absolute ${evoStage === 'bua-saver' && !mascotImageOverride ? '-bottom-4' : evoStage === 'bua-investor' && !mascotImageOverride ? '-bottom-2' : 'bottom-2'} left-1/2 -translate-x-1/2 z-10`}
              style={{ background: 'transparent', animation: 'float 3s ease-in-out infinite' }}>
              <BuaMascot size={160} mood={mood} stage={mascotStage} evolutionStage={evoStage} investmentPath={player.selectedInvestmentPath} imageOverride={mascotImageOverride} imageScale={mascotImageScale} imageOffsetX={mascotImageOffset.x} imageOffsetY={mascotImageOffset.y}/>
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
                <div className="text-right"><div className="text-[10px] text-gray-500">Return รวม</div><div className={`font-bold text-sm ${playerTradingReturnPct >= 0 ? 'text-green-500' : 'text-red-500'}`}>{playerTradingReturnPct >= 0 ? '+' : ''}{fmt(playerTradingReturnPct)}%</div></div>
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
    const [lessonQuizAnswers, setLessonQuizAnswers] = useState<Record<number, number>>({});
    const [lessonQuizSubmitted, setLessonQuizSubmitted] = useState(false);
    const lessonDetailRef = useRef<HTMLDivElement | null>(null);

    const completedCount = STOCK101_LESSONS.filter(l => player.completedLessonIds.includes(l.id)).length;
    const activeLesson = STOCK101_LESSONS.find(l => l.id === activeLessonId) ?? firstIncomplete;
    const activeIndex = STOCK101_LESSONS.findIndex(l => l.id === activeLesson.id);
    const activeCompleted = player.completedLessonIds.includes(activeLesson.id);
    const activeUnlocked = activeIndex === 0 || player.completedLessonIds.includes(STOCK101_LESSONS[activeIndex - 1]?.id);
    const activeQuizQuestions = activeLesson.quizQuestions ?? [{
      question: activeLesson.question,
      options: activeLesson.options,
      correct: activeLesson.correct,
    }];
    const activePassingScore = activeLesson.passingScore ?? activeQuizQuestions.length;
    const activeAnsweredCount = activeQuizQuestions.filter((_, index) => lessonQuizAnswers[index] !== undefined).length;
    const activeQuizScore = activeQuizQuestions.reduce((score, question, index) => (
      lessonQuizAnswers[index] === question.correct ? score + 1 : score
    ), 0);
    const activeQuizPassed = lessonQuizSubmitted && activeQuizScore >= activePassingScore;

    const openLesson = (lesson: VideoLesson, unlocked: boolean) => {
      if (!unlocked) return;
      setActiveLessonId(lesson.id);
      setQuizOpen(false);
      setLessonQuizAnswers({});
      setLessonQuizSubmitted(false);
      setTimeout(() => {
        lessonDetailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
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
            completedQuestIds: lesson.id === 'stock101-1-1' && !p.completedQuestIds.includes('q1')
              ? [...p.completedQuestIds, 'q1']
              : p.completedQuestIds,
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
        setLessonQuizAnswers({});
        setLessonQuizSubmitted(false);
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

        <div ref={lessonDetailRef} className="bg-white rounded-3xl shadow-md overflow-hidden border border-blue-100 scroll-mt-4">
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
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="font-bold text-gray-800 text-sm">Quiz หลังบทเรียน</div>
                        <div className="text-[11px] text-gray-500">
                          ตอบให้ครบ {activeQuizQuestions.length} ข้อ แล้วระบบจะเฉลยพร้อมกัน ต้องถูกอย่างน้อย {activePassingScore}/{activeQuizQuestions.length}
                        </div>
                      </div>
                      <div className="bg-blue-50 text-blue-600 rounded-full px-2.5 py-1 text-[10px] font-black shrink-0">
                        {activeCompleted ? 'ผ่านแล้ว' : `${activeAnsweredCount}/${activeQuizQuestions.length}`}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {activeQuizQuestions.map((question, questionIndex) => {
                        const selectedOption = lessonQuizAnswers[questionIndex];
                        const showResult = activeCompleted || lessonQuizSubmitted;
                        return (
                          <div key={`${activeLesson.id}-q-${questionIndex}`} className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                            <div className="flex items-start gap-2 mb-3">
                              <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-black shrink-0">
                                {questionIndex + 1}
                              </div>
                              <div className="text-sm font-bold text-gray-800 leading-relaxed">{question.question}</div>
                            </div>
                            <div className="space-y-2">
                              {question.options.map((option, optionIndex) => {
                                const selectedAnswer = selectedOption === optionIndex;
                                const correctAnswer = optionIndex === question.correct;
                                return (
                                  <button
                                    key={option}
                                    disabled={activeCompleted || lessonQuizSubmitted}
                                    onClick={() => setLessonQuizAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }))}
                                    className={`w-full text-left rounded-2xl p-3 border-2 text-sm transition ${
                                      showResult && correctAnswer ? 'bg-green-50 border-green-400 text-green-700' :
                                      showResult && selectedAnswer && !correctAnswer ? 'bg-red-50 border-red-400 text-red-700' :
                                      selectedAnswer ? 'bg-blue-50 border-blue-400 text-blue-700' :
                                      'bg-white border-gray-100 text-gray-700'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                        showResult && correctAnswer ? 'bg-green-500 text-white' :
                                        showResult && selectedAnswer && !correctAnswer ? 'bg-red-500 text-white' :
                                        selectedAnswer ? 'bg-blue-500 text-white' :
                                        'bg-gray-100 text-gray-500'
                                      }`}>
                                        {String.fromCharCode(65 + optionIndex)}
                                      </div>
                                      <span>{option}</span>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {!activeCompleted && !lessonQuizSubmitted && (
                      <button
                        onClick={() => setLessonQuizSubmitted(true)}
                        disabled={activeAnsweredCount < activeQuizQuestions.length}
                        className={`w-full mt-4 font-bold py-3 rounded-full shadow active:scale-95 ${
                          activeAnsweredCount < activeQuizQuestions.length
                            ? 'bg-gray-200 text-gray-400'
                            : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                        }`}
                      >
                        {activeAnsweredCount < activeQuizQuestions.length
                          ? `ตอบให้ครบก่อน (${activeAnsweredCount}/${activeQuizQuestions.length})`
                          : 'ส่งคำตอบและดูเฉลย'}
                      </button>
                    )}

                    {!activeCompleted && lessonQuizSubmitted && (
                      <div className={`mt-4 rounded-2xl p-3 border ${activeQuizPassed ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                        <div className={`font-black text-sm ${activeQuizPassed ? 'text-green-700' : 'text-orange-700'}`}>
                          คะแนนของคุณ: {activeQuizScore}/{activeQuizQuestions.length}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {activeQuizPassed
                            ? 'ผ่านแล้ว! รับรางวัลและปลดล็อกบทเรียนถัดไปได้เลย'
                            : `ยังไม่ผ่าน ต้องถูกอย่างน้อย ${activePassingScore}/${activeQuizQuestions.length} ลองทบทวนคลิปแล้วทำใหม่อีกครั้งนะ`}
                        </div>
                        {activeQuizPassed ? (
                          <button onClick={() => completeVideoLesson(activeLesson)}
                            className="w-full mt-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 rounded-full shadow active:scale-95">
                            {activeLesson.order === STOCK101_LESSONS.length
                              ? `รับรางวัลรวม +${activeLesson.exp + STOCK101_CHAPTER_BONUS.exp}⭐ +${activeLesson.coins + STOCK101_CHAPTER_BONUS.coins} Coin`
                              : `รับรางวัล +${activeLesson.exp}⭐ +${activeLesson.coins} Coin และปลดล็อกต่อไป`}
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setLessonQuizAnswers({});
                              setLessonQuizSubmitted(false);
                            }}
                            className="w-full mt-3 bg-orange-500 text-white font-bold py-3 rounded-full shadow active:scale-95"
                          >
                            ทำ Quiz ใหม่
                          </button>
                        )}
                      </div>
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
      if (q.type === 'friend') {
        return <button onClick={() => setScreen('friends')} className="bg-pink-500 text-white text-xs font-bold px-3 py-2 rounded-full active:scale-95">ไปเยี่ยม</button>;
      }
      if (q.type === 'lesson' && !q.lesson) {
        return <button onClick={() => setScreen('lessons')} className="bg-blue-500 text-white text-xs font-bold px-3 py-2 rounded-full active:scale-95">ไปเรียน</button>;
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
          <button onClick={() => setScreen('lessons')} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-full shadow">ไปเรียนบทเรียน 📚</button>
        </div>
      );
    }

    // Unlocked — full trading UI
    const filtered = stocks.filter(s => {
      if (cat === 'all') return true;
      if (cat === 'my-path') {
        return player.selectedInvestmentPath ? s.pathTags.includes(player.selectedInvestmentPath) : true;
      }
      return s.cat === cat;
    });
    const nextMarketUpdateLabel = new Date(getNextMarketTickTime(marketTick)).toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return (
      <div className="pb-24 min-h-screen bg-gray-50">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 px-4 pt-5 pb-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xl font-bold">ลงทุน</div>
            <div className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
              <Clock size={12}/> อัปเดตราคา {nextMarketUpdateLabel}
            </div>
          </div>
          <div className="bg-white/15 rounded-2xl p-3">
            <div className="text-[11px] opacity-80">มูลค่าพอร์ตรวม</div>
            <div className="text-2xl font-bold">{fmt(totalValue)} <span className="text-sm opacity-80">บาท</span></div>
            <div className="flex items-center gap-3 mt-1 text-xs">
              <div className="flex items-center gap-1"><Wallet size={12}/> เงินสด {fmt(tradingCash, 0)}</div>
              <div className={`flex items-center gap-1 font-bold ${playerTradingReturnPct >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                {playerTradingReturnPct >= 0 ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                Return รวม {playerTradingReturnPct >= 0 ? '+' : ''}{fmt(playerTradingReturnPct)}%
              </div>
            </div>
            <div className="mt-1 text-[11px] opacity-80">
              กำไร/ขาดทุนของสินทรัพย์ที่ถือ: {totalPnL >= 0 ? '+' : ''}{fmt(totalPnL)} บาท ({totalPnLPct >= 0 ? '+' : ''}{fmt(totalPnLPct)}%)
            </div>
            <div className="mt-1 text-[10px] opacity-70">
              Ranking ใช้สูตร Return รวมเทียบเงินต้น {fmt(INITIAL_TRADING_CASH, 0)} บาท
            </div>
            <div className="mt-3 bg-amber-100/95 text-amber-900 rounded-xl px-3 py-2 text-[10px] leading-relaxed font-medium">
              ⚠️ ราคาสินทรัพย์ใน Portfolio Simulation เป็น Mock Up สำหรับ Prototype เท่านั้น
              ไม่ได้ขยับตามราคาตลาดจริง และไม่ใช่คำแนะนำการลงทุน
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
            <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
              {ASSET_FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setCat(f.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${cat === f.id ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border'}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="px-3 space-y-1">
              {filtered.map(s => {
                const up = s.changePct >= 0;
                const pathMatch = player.selectedInvestmentPath && s.pathTags.includes(player.selectedInvestmentPath);
                return (
                  <button key={s.sym} onClick={() => { setSelected(s); setTradeQty(1); }} className="w-full bg-white rounded-2xl p-3 flex items-center gap-3 shadow-sm active:scale-98 transition">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">{s.logo}</div>
                    <div className="text-left w-24 flex-shrink-0">
                      <div className="font-bold text-gray-800 text-sm">{s.sym}</div>
                      <div className="text-[10px] text-gray-400 truncate">{s.name}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{s.assetType}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${ASSET_RISK_BADGE[s.risk]}`}>{s.risk}</span>
                      </div>
                      {pathMatch && <div className="text-[9px] text-purple-600 font-bold mt-0.5">เหมาะกับสายของฉัน</div>}
                    </div>
                    <div className="flex-1 h-9">
                      <ResponsiveContainer><LineChart data={s.spark}><YAxis domain={['dataMin','dataMax']} hide/><Line type="monotone" dataKey="v" stroke={up ? '#10B981' : '#EF4444'} strokeWidth={1.5} dot={false}/></LineChart></ResponsiveContainer>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-gray-800 text-sm">{fmt(s.price)}</div>
                      <div className="text-[9px] text-gray-400">{s.currency}</div>
                      {s.currency === 'USD' && <div className="text-[9px] text-gray-400">≈ ฿{fmt(getAssetThbPrice(s), 0)}</div>}
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
              ? <div className="text-center text-gray-400 py-16"><PieIcon size={48} className="mx-auto mb-3 opacity-30"/><div className="text-sm">ยังไม่มีสินทรัพย์ในพอร์ต</div></div>
              : Object.entries(holdings).map(([sym, h]) => {
                  const st = stocks.find(s => s.sym === sym); if (!st) return null;
                  const avgCostThb = getHoldingAvgCostThb(h, st);
                  const val = getAssetThbPrice(st) * h.shares, cost2 = avgCostThb * h.shares, pnl = val - cost2, pct = (pnl/cost2)*100, up = pnl >= 0;
                  return (
                    <button key={sym} onClick={() => { setSelected(st); setTradeQty(1); }} className="w-full bg-white rounded-2xl p-3 shadow-sm text-left active:scale-98">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">{st.logo}</div>
                        <div className="flex-1"><div className="font-bold text-gray-800 text-sm">{sym}</div><div className="text-[10px] text-gray-400">{h.shares} หน่วย @ ฿{fmt(avgCostThb)}</div></div>
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
                    <div className="flex-1"><div className="font-bold text-sm">{t.sym}</div><div className="text-[10px] text-gray-400">{t.qty} หน่วย @ ฿{fmt(t.price)}</div></div>
                    <div className="font-bold text-sm">{fmt(t.price*t.qty)}</div>
                  </div>
                ))}
          </div>
        )}
        <div className="px-4 py-2 text-[9px] text-amber-700 text-center bg-amber-50">
          ⚠️ ราคาและผลตอบแทนในเกมเป็น Mock Up เพื่อการเรียนรู้เท่านั้น ไม่ได้อ้างอิงการเคลื่อนไหวจริงแบบ real-time
        </div>
      </div>
    );
  };

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
      const pathMasterReached = player.earnedBadgeIds.includes(master.badgeId);
      const pathUnlocked = player.level >= 20;
      const displayImageUrl = id === 'value-hunter' && pathMasterReached ? VALUE_MASTER_IMG
        : id === 'global-explorer' && pathMasterReached ? GLOBAL_MASTER_IMG
        : id === 'risk-guardian' && pathMasterReached ? GUARDIAN_MASTER_IMG
        : id === 'dividend-keeper' && pathMasterReached ? DIVIDEND_MASTER_IMG
        : id === 'esg-hero' && pathMasterReached ? ESG_MASTER_IMG
        : id === 'bua-trader' && pathMasterReached ? TRADING_MASTER_IMG
        : path.imageUrl;
      return (
        <div className={`rounded-2xl p-3 border transition ${pathMasterReached ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 shadow-sm' : selected ? 'bg-gradient-to-r from-orange-50 to-pink-50 border-orange-300 shadow-sm' : pathUnlocked ? 'bg-white border-gray-100' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
          <div className="flex items-start gap-2">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${selected ? 'bg-white shadow-sm' : 'bg-gray-50'}`}>
              {displayImageUrl ? <img src={displayImageUrl} alt={pathMasterReached ? master.masterName : path.name} className="w-full h-full object-contain"/> : <span className="text-xl">{path.icon}</span>}
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
                  <span className="text-[10px] bg-blue-100 text-blue-600 font-bold px-2 py-0.5 rounded-full">Lv.50 เพื่อเป็น {master.masterName}</span>
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
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/40"><BuaMascot size={70} stage={mascotStage} evolutionStage={evoStage} investmentPath={player.selectedInvestmentPath} imageOverride={mascotImageOverride} imageScale={mascotImageScale} imageOffsetX={profileMascotImageOffset.x} imageOffsetY={profileMascotImageOffset.y}/></div>
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

        <div className="bg-white rounded-2xl p-4 shadow-sm mb-3 border border-blue-100">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-bold text-gray-800 text-sm">Account & Cloud Save</div>
              <div className="text-xs text-gray-500 mt-0.5">
                {!isSupabaseConfigured
                  ? 'ยังไม่ได้ตั้งค่า Supabase: ตอนนี้บันทึกในเครื่องเท่านั้น'
                  : localMode
                  ? 'Local Mode: เล่นต่อได้ แต่ยังไม่ sync database'
                  : session
                  ? session.user.email
                  : 'ยังไม่ได้เข้าสู่ระบบ'}
              </div>
              <div className={`text-[11px] font-bold mt-2 ${
                syncStatus === 'synced' ? 'text-green-600' :
                syncStatus === 'saving' || syncStatus === 'loading' ? 'text-blue-600' :
                syncStatus === 'error' ? 'text-red-500' : 'text-gray-400'
              }`}>
                {syncStatus === 'synced' ? '● Cloud synced' :
                 syncStatus === 'saving' ? '● Saving to cloud...' :
                 syncStatus === 'loading' ? '● Loading cloud save...' :
                 syncStatus === 'error' ? '● Cloud sync error' :
                 '● Local save only'}
              </div>
              {cloudProfile?.friend_code && (
                <div className="mt-2 inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-xs font-black">
                  Friend ID: {cloudProfile.friend_code}
                </div>
              )}
            </div>
            {session && !localMode ? (
              <button onClick={signOut} className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-2 rounded-full active:scale-95">Logout</button>
            ) : isSupabaseConfigured && localMode ? (
              <button onClick={() => setLocalMode(false)} className="bg-blue-500 text-white text-xs font-bold px-3 py-2 rounded-full active:scale-95">Login</button>
            ) : null}
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
            <div className={`rounded-2xl p-3 border ${allPathMastersCompleted ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-100 opacity-70'}`}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">🏅</div>
                <div className="flex-1">
                  <div className="font-black text-gray-800 text-sm">All Masters Completed</div>
                  <div className="text-[10px] text-gray-500">ต้องมี Badge Master ครบทุกสายก่อนปลดล็อก Investment Master</div>
                </div>
                {allPathMastersCompleted && <CheckCircle size={16} className="text-purple-600"/>}
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
              const reached = key === 'investment-master' ? evoStage === 'investment-master' : player.level >= info.minLevel;
              return (
                <div key={key} className={`flex items-center gap-2 p-2 rounded-xl ${reached ? 'bg-blue-50' : 'bg-gray-50 opacity-50'}`}>
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow text-base">{reached ? '🐣' : '🔒'}</div>
                  <div className="flex-1"><div className="text-[10px] text-gray-500">{key === 'investment-master' ? 'ต้องมี Master Badge ครบทุกสาย' : `Lv.${info.minLevel}+`}</div><div className="font-bold text-xs text-gray-800">{info.name}</div></div>
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
    const [friendTab, setFriendTab] = useState<'friends' | 'ranking'>('friends');
    const [friendCodeInput, setFriendCodeInput] = useState('');
    const isCloudFriendMode = Boolean(session && !localMode);
    const visitFriend = (friend: FriendProfile) => {
      setSelectedFriend(friend);
      if (!player.completedQuestIds.includes('q7')) {
        setPlayer(p => ({
          ...p,
          completedQuestIds: p.completedQuestIds.includes('q7') ? p.completedQuestIds : [...p.completedQuestIds, 'q7'],
        }));
        showReward(0, 0, '🏠 ภารกิจเยี่ยมบ้านเพื่อนสำเร็จ! ไปรับรางวัลได้');
      }
    };

    if (selectedFriend) {
      const friendEvoStage = getEvolutionStage(selectedFriend.level);
      const friendEvoInfo = EVOLUTION_INFO[friendEvoStage];
      const friendPhaseInfo = PHASE_INFO[getLearningPhase(selectedFriend.level)];
      const friendPathInfo = selectedFriend.investmentPath ? INVESTMENT_PATHS[selectedFriend.investmentPath] : null;
      const friendMascotStage = selectedFriend.level >= 30 ? 4 : selectedFriend.level >= 20 ? 3 : selectedFriend.level >= 10 ? 2 : 1;
      const friendBgImg = friendEvoStage === 'investment-master' ? BG_MASTER_IMG : BG_IMG;
      const friendRank = tradeRankings.find(entry => entry.id === selectedFriend.id);
      const friendPortfolioUnlocked = Boolean(friendRank?.portfolioUnlocked);

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

              {friendRank && (
                <div className="mt-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-3 border border-purple-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-purple-500 font-bold">Trade Ranking</div>
                      <div className="font-black text-gray-800 text-sm">Rank #{friendRank.rank}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-black text-lg ${!friendPortfolioUnlocked ? 'text-gray-400' : friendRank.returnPct >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {friendPortfolioUnlocked ? `${friendRank.returnPct >= 0 ? '+' : ''}${fmt(friendRank.returnPct)}%` : '—'}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {friendPortfolioUnlocked ? `${fmt(friendRank.portfolioValue, 0)} บาท` : 'ยังไม่เปิด Portfolio'}
                      </div>
                    </div>
                  </div>
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
            <div className="text-xs text-gray-500">เยี่ยมบ้านเพื่อนและแข่ง Trade Ranking จาก Return</div>
          </div>
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center">
            <Users size={22} className="text-pink-500"/>
          </div>
        </div>

        <div className="bg-white p-1 rounded-2xl shadow-sm border border-pink-100 mb-4 grid grid-cols-2 gap-1">
          <button onClick={() => setFriendTab('friends')} className={`py-2 rounded-xl text-xs font-black transition ${friendTab === 'friends' ? 'bg-pink-500 text-white shadow' : 'text-gray-500'}`}>
            บ้านเพื่อน
          </button>
          <button onClick={() => setFriendTab('ranking')} className={`py-2 rounded-xl text-xs font-black transition ${friendTab === 'ranking' ? 'bg-purple-500 text-white shadow' : 'text-gray-500'}`}>
            Trade Ranking
          </button>
        </div>

        {friendTab === 'ranking' ? (
          <div className="space-y-3">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-4 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs opacity-80">Season 1</div>
                  <div className="font-black text-xl">🏆 Trade Ranking</div>
                  <div className="text-[11px] opacity-80 mt-1">เรียงอันดับจาก Return เทียบเงินต้น {fmt(INITIAL_TRADING_CASH, 0)} บาท</div>
                </div>
                <div className="bg-white/20 rounded-2xl px-3 py-2 text-center">
                  <div className="text-[10px] opacity-80">Your Rank</div>
                  <div className="font-black text-2xl">#{playerTradeRank?.rank ?? '-'}</div>
                </div>
              </div>
            </div>

            {tradeRankings.map(entry => {
              const friend = activeFriends.find(f => f.id === entry.id);
              const pathInfo = entry.investmentPath ? INVESTMENT_PATHS[entry.investmentPath] : null;
              const rankBadge = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`;
              const trendIcon = entry.rankTrend === 'up' ? '↗' : entry.rankTrend === 'down' ? '↘' : '→';
              const returnUp = entry.returnPct >= 0;
              const entryPortfolioUnlocked = Boolean(entry.portfolioUnlocked);

              return (
                <button
                  key={entry.id}
                  onClick={() => friend && visitFriend(friend)}
                  className={`w-full rounded-3xl p-3 shadow-sm text-left transition border active:scale-[0.99] ${entry.isPlayer ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200' : 'bg-white border-gray-100'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 text-center font-black text-lg shrink-0">{rankBadge}</div>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-50 to-pink-50 border border-blue-100 flex items-center justify-center overflow-hidden shrink-0">
                      <BuaMascot
                        size={52}
                        mood="happy"
                        stage={entry.mascotStage}
                        evolutionStage={entry.evolutionStage}
                        investmentPath={entry.investmentPath}
                        imageOverride={entry.isPlayer ? mascotImageOverride : undefined}
                        imageScale={entry.isPlayer && mascotImageOverride ? 1.35 : 1}
                        imageOffsetY={entry.isPlayer && mascotImageOverride ? 8 : 0}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <div className="font-black text-gray-800 truncate">{entry.name}</div>
                        {entry.isPlayer && <span className="text-[9px] bg-blue-500 text-white px-1.5 py-0.5 rounded-full font-bold">YOU</span>}
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-bold">Lv.{entry.level}</span>
                      </div>
                      <div className="text-[11px] text-gray-500 truncate">
                        {pathInfo ? `${pathInfo.icon} ${pathInfo.name}` : entry.title} • {entryPortfolioUnlocked ? `${entry.tradeCount} trades` : 'ยังไม่เปิด Portfolio'}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {entryPortfolioUnlocked ? `พอร์ต ${fmt(entry.portfolioValue, 0)} บาท ${entry.winRatePct ? `• Win ${entry.winRatePct}%` : ''}` : 'ต้องปลดล็อก Portfolio Simulation ก่อนถึงจะมี Return'}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`font-black text-lg ${!entryPortfolioUnlocked ? 'text-gray-400' : returnUp ? 'text-green-600' : 'text-red-500'}`}>
                        {entryPortfolioUnlocked ? `${returnUp ? '+' : ''}${fmt(entry.returnPct)}%` : '—'}
                      </div>
                      <div className={`text-[10px] font-bold ${!entryPortfolioUnlocked ? 'text-gray-400' : entry.rankTrend === 'up' ? 'text-green-500' : entry.rankTrend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                        {entryPortfolioUnlocked ? `${trendIcon} trend` : 'locked'}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 text-[11px] text-amber-700 leading-relaxed">
              สูตร Ranking: Return = (มูลค่าพอร์ตปัจจุบัน - เงินต้นเริ่มต้น) / เงินต้นเริ่มต้น × 100
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-4 border border-pink-100">
              <div className="font-bold text-gray-800 text-sm mb-1">{isCloudFriendMode ? 'Cloud Friend Mode' : 'Prototype Mode'}</div>
              <div className="text-xs text-gray-500 leading-relaxed">
                {isCloudFriendMode
                  ? 'เพิ่มเพื่อนจริงด้วย Friend ID แล้วเยี่ยมบ้านเพื่อดูมาสคอต Level และสายการลงทุนของเพื่อน'
                  : 'ตอนนี้เป็นเพื่อนจำลอง 4 คน เพื่อทดสอบ flow รายชื่อเพื่อน → เยี่ยมบ้าน → ดูมาสคอต/Level/สายของเพื่อน'}
              </div>
            </div>

            {isCloudFriendMode && (
              <div className="bg-white rounded-3xl p-4 shadow-sm mb-4 border border-blue-100">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-black text-gray-800 text-sm">เพิ่มเพื่อนด้วย Friend ID</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      ID ของคุณ: <span className="font-black text-blue-600">{cloudProfile?.friend_code ?? 'กำลังโหลด...'}</span>
                    </div>
                  </div>
                  <button
                    onClick={refreshCloudFriends}
                    disabled={friendLoading}
                    className="text-[10px] font-bold text-blue-500 bg-blue-50 px-3 py-1.5 rounded-full disabled:opacity-50"
                  >
                    รีเฟรช
                  </button>
                </div>

                <div className="flex gap-2 mt-3">
                  <input
                    value={friendCodeInput}
                    onChange={e => setFriendCodeInput(e.target.value.toUpperCase())}
                    placeholder="เช่น BUA-ABCDE"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2 text-sm font-bold outline-none focus:border-blue-300"
                  />
                  <button
                    onClick={() => {
                      sendFriendRequest(friendCodeInput);
                      setFriendCodeInput('');
                    }}
                    disabled={friendLoading || !friendCodeInput.trim()}
                    className="bg-pink-500 text-white rounded-2xl px-4 py-2 text-xs font-black shadow disabled:opacity-40"
                  >
                    ส่งคำขอ
                  </button>
                </div>

                {friendMessage && (
                  <div className="mt-3 text-[11px] font-bold text-blue-600 bg-blue-50 rounded-2xl px-3 py-2">
                    {friendMessage}
                  </div>
                )}

                {incomingFriendRequests.length > 0 && (
                  <div className="mt-4">
                    <div className="text-[11px] font-black text-gray-700 mb-2">คำขอเป็นเพื่อน</div>
                    <div className="space-y-2">
                      {incomingFriendRequests.map(request => (
                        <div key={request.id} className="bg-pink-50 border border-pink-100 rounded-2xl p-3 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center overflow-hidden shrink-0">
                            <BuaMascot
                              size={38}
                              mood="happy"
                              stage={request.profile.level >= 30 ? 4 : request.profile.level >= 20 ? 3 : request.profile.level >= 10 ? 2 : 1}
                              evolutionStage={getEvolutionStage(request.profile.level)}
                              investmentPath={request.profile.investmentPath}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-black text-gray-800 text-sm truncate">{request.profile.name}</div>
                            <div className="text-[10px] text-gray-500">Lv.{request.profile.level} • {request.profile.title}</div>
                          </div>
                          <button onClick={() => handleFriendRequest(request.id, 'accept')} disabled={friendLoading} className="bg-green-500 text-white rounded-full px-3 py-1.5 text-[10px] font-black disabled:opacity-50">รับ</button>
                          <button onClick={() => handleFriendRequest(request.id, 'reject')} disabled={friendLoading} className="bg-gray-200 text-gray-600 rounded-full px-3 py-1.5 text-[10px] font-black disabled:opacity-50">ปฏิเสธ</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {outgoingFriendRequests.length > 0 && (
                  <div className="mt-4">
                    <div className="text-[11px] font-black text-gray-700 mb-2">รอเพื่อนยืนยัน</div>
                    <div className="flex flex-wrap gap-2">
                      {outgoingFriendRequests.map(request => (
                        <div key={request.id} className="bg-gray-50 border border-gray-100 rounded-full px-3 py-1.5 text-[11px] font-bold text-gray-600">
                          {request.profile.name} • pending
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              {activeFriends.length === 0 && (
                <div className="bg-white border border-dashed border-pink-200 rounded-3xl p-6 text-center">
                  <div className="text-3xl mb-2">🌱</div>
                  <div className="font-black text-gray-800">ยังไม่มีเพื่อนใน Cloud</div>
                  <div className="text-xs text-gray-500 mt-1">เอา Friend ID ของเพื่อนมาใส่ด้านบน หรือให้เพื่อนส่งคำขอมาหาคุณ</div>
                </div>
              )}

              {activeFriends.map(friend => {
                const friendEvoStage = getEvolutionStage(friend.level);
                const friendEvoInfo = EVOLUTION_INFO[friendEvoStage];
                const friendPathInfo = friend.investmentPath ? INVESTMENT_PATHS[friend.investmentPath] : null;
                const friendMascotStage = friend.level >= 30 ? 4 : friend.level >= 20 ? 3 : friend.level >= 10 ? 2 : 1;
                const friendRank = tradeRankings.find(entry => entry.id === friend.id);
                const friendPortfolioUnlocked = Boolean(friend.trading.portfolioUnlocked);

                return (
                  <button key={friend.id} onClick={() => visitFriend(friend)}
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
                          {friendRank && <div className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-bold">Rank #{friendRank.rank}</div>}
                        </div>
                        <div className="text-xs font-bold text-gray-700">{friend.title}</div>
                        <div className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">
                          {friendEvoInfo.name}{friendPathInfo ? ` • ${friendPathInfo.icon} ${friendPathInfo.name}` : ''} • {friendPortfolioUnlocked ? `Return ${friend.trading.returnPct >= 0 ? '+' : ''}${fmt(friend.trading.returnPct)}%` : 'ยังไม่เปิด Portfolio'}
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
          </>
        )}
      </div>
    );
  };

  // ============================================================
  // QUEST MODAL (lesson + quiz)
  // ============================================================
  const QuestModal = () => {
    if (!modal || modal === 'shop') return null;
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

  // TRADE MODAL
  const TradeModal = () => {
    if (!selected) return null;
    const selectedHolding = holdings[selected.sym];
    const selectedThbPrice = getAssetThbPrice(selected);
    const selectedAvgCostThb = selectedHolding ? getHoldingAvgCostThb(selectedHolding, selected) : 0;

    return (
      <div className="absolute inset-0 bg-black/40 z-50 flex items-end" onClick={() => setSelected(null)}>
        <div className="bg-white rounded-t-3xl w-full p-5" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl">{selected.logo}</div>
              <div>
                <div className="font-bold text-gray-800">{selected.sym}</div>
                <div className="text-xs text-gray-400">{selected.name}</div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{selected.assetType}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${ASSET_RISK_BADGE[selected.risk]}`}>{selected.risk}</span>
                </div>
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X size={16}/></button>
          </div>
          <div className="bg-gray-50 rounded-2xl p-3 mb-4">
            <div className="text-2xl font-bold text-gray-800">{fmt(selected.price)} <span className="text-xs text-gray-400">{selected.currency}</span></div>
            {selected.currency === 'USD' && (
              <div className="text-xs font-bold text-purple-600">
                คิดซื้อขายเป็นเงินบาท ≈ ฿{fmt(selectedThbPrice)} / หน่วย
              </div>
            )}
            <div className={`text-xs font-bold ${selected.changePct >= 0 ? 'text-green-600' : 'text-red-500'}`}>{selected.changePct >= 0 ? '↗ +' : '↘ '}{fmt(selected.changePct)}% รอบ 5 นาทีนี้</div>
            <div className="text-[11px] text-gray-500 mt-1">{selected.desc}</div>
            <div className="h-24 mt-1"><ResponsiveContainer><LineChart data={selected.spark}><YAxis domain={['dataMin','dataMax']} hide/><Line type="monotone" dataKey="v" stroke={selected.changePct >= 0 ? '#10B981' : '#EF4444'} strokeWidth={2} dot={false}/></LineChart></ResponsiveContainer></div>
          </div>
          {selectedHolding ? (
            <div className="bg-purple-50 rounded-xl p-2.5 mb-3 text-xs text-purple-700 flex justify-between">
              <span>ถืออยู่ {selectedHolding.shares} หน่วย</span>
              <span>ต้นทุน ฿{fmt(selectedAvgCostThb)}</span>
            </div>
          ) : null}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-gray-700">จำนวนหน่วย</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setTradeQty(q => Math.max(1, q-1))} className="w-9 h-9 rounded-full bg-gray-100 font-bold text-lg active:scale-95">−</button>
              <span className="font-bold text-lg w-10 text-center">{tradeQty}</span>
              <button onClick={() => setTradeQty(q => q+1)} className="w-9 h-9 rounded-full bg-gray-100 font-bold text-lg active:scale-95">+</button>
            </div>
          </div>
          <div className="text-center text-sm text-gray-500 mb-3">
            รวม <span className="font-bold text-gray-800">฿{fmt(selectedThbPrice * tradeQty)}</span>
            {selected.currency === 'USD' && <div className="text-[10px] text-gray-400">FX Mock Up: 1 USD = {fmt(MOCK_USD_THB_RATE)} บาท</div>}
          </div>
          <div className="flex gap-3">
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
  if (isSupabaseConfigured && !localMode && cloudLoading) {
    return (
      <div className="bg-gradient-to-br from-sky-100 via-blue-50 to-pink-50 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 shadow-2xl text-center w-full max-w-sm border border-blue-100">
          <BuaMascot size={90} mood="happy" evolutionStage="bua-seed"/>
          <div className="font-black text-gray-800 mt-3">กำลังโหลด Cloud Save...</div>
          <div className="text-xs text-gray-500 mt-1">เชื่อมต่อบัญชีและข้อมูลเกมของคุณ</div>
        </div>
      </div>
    );
  }

  if (isSupabaseConfigured && !localMode && !session) {
    return <AuthScreen onLocalMode={() => {
      setLocalMode(true);
      setSyncStatus('local-only');
      setCloudLoading(false);
    }}/>;
  }

  return (
    <div className="bg-gradient-to-br from-sky-100 via-blue-50 to-pink-50 min-h-screen flex items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md min-h-screen sm:min-h-0 sm:h-[820px] sm:rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="h-full overflow-y-auto">
          {screen === 'home'    && <HomeScreen/>}
          {screen === 'lessons' && <LessonScreen/>}
          {screen === 'quests'  && <QuestsScreen/>}
          {screen === 'invest'  && <InvestScreen/>}
          {screen === 'friends' && <FriendScreen/>}
          {screen === 'profile' && <ProfileScreen/>}
        </div>

        {/* Bottom Nav */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex shadow-lg">
          <NavItem id="home"    icon={Home}     label="หน้าหลัก"/>
          <NavItem id="quests"  icon={BookOpen}  label="ภารกิจ"/>
          <NavItem id="invest"  icon={LineIcon}  label="Portfolio simulation"/>
          <NavItem id="friends" icon={Users}     label="Friend"/>
          <NavItem id="profile" icon={User}      label="โปรไฟล์"/>
        </div>

        {/* Modals */}
        <ShopModal/>
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
          <EvolutionCutscene
            cutscene={evolutionInfo}
            onClose={() => setEvolutionInfo(null)}
            imageOverride={mascotImageOverride}
            imageScale={mascotImageScale}
            imageOffsetX={modalMascotImageOffset.x}
            imageOffsetY={modalMascotImageOffset.y}
            investmentPath={player.selectedInvestmentPath}
          />
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
