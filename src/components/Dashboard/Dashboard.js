import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  ChatBubbleLeftRightIcon,
  LanguageIcon,
  GlobeAltIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  StarIcon,
  SparklesIcon,
  MicrophoneIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ArrowRightIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline';
import { addNotification } from '../../store/slices/uiSlice';
import TranslationInterface from '../Translation/TranslationInterface';
import QuickTranslate from './QuickTranslate';
import RecentTranslations from './RecentTranslations';
import LanguageStats from './LanguageStats';
import ActivityFeed from './ActivityFeed';
import LiveTranslationCard from './LiveTranslationCard';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAnimating, setIsAnimating] = useState(false);
  const [liveStats, setLiveStats] = useState({
    translationsToday: 0,
    activeUsers: 0,
    messagesExchanged: 0,
    languagesUsed: 0
  });
  
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate live stats updates
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        translationsToday: prev.translationsToday + Math.floor(Math.random() * 3),
        activeUsers: Math.max(1, prev.activeUsers + (Math.random() > 0.7 ? 1 : -1)),
        messagesExchanged: prev.messagesExchanged + Math.floor(Math.random() * 5),
        languagesUsed: Math.min(20, prev.languagesUsed + (Math.random() > 0.8 ? 1 : 0))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleQuickAction = (action) => {
    switch(action) {
      case 'translate':
        setActiveTab('translate');
        break;
      case 'chat':
        navigate('/chat');
        break;
      case 'voice':
        dispatch(addNotification({
          type: 'info',
          message: 'Voice translation feature coming soon!'
        }));
        break;
      default:
        break;
    }
  };

  const StatCard = ({ icon: Icon, title, value, change, color = 'blue' }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-${color}-500 transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className={`text-2xl font-bold text-gray-900 dark:text-${color}-400 mt-1`}>{value.toLocaleString()}</p>
          {change && (
            <p className={`text-sm mt-1 ${change > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {change > 0 ? '+' : ''}{change}% from yesterday
            </p>
          )}
        </div>
        <div className={`p-3 bg-${color}-100 dark:bg-${color}-900/20 rounded-lg`}>
          <Icon className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`} />
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ icon: Icon, title, description, action, color = 'blue' }) => (
    <button
      onClick={() => handleQuickAction(action)}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-left transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-${color}-300 focus:outline-none focus:ring-2 focus:ring-${color}-500 focus:ring-offset-2`}
    >
      <div className={`inline-flex p-3 bg-${color}-100 dark:bg-${color}-900/20 rounded-lg mb-4`}>
        <Icon className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      <div className={`flex items-center text-${color}-600 font-medium text-sm`}>
        Get Started
        <ArrowRightIcon className="h-4 w-4 ml-1" />
      </div>
    </button>
  );

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={LanguageIcon}
                title="Translations Today"
                value={liveStats.translationsToday}
                change={12}
                color="blue"
              />
              <StatCard
                icon={UserGroupIcon}
                title="Active Users"
                value={liveStats.activeUsers}
                change={8}
                color="green"
              />
              <StatCard
                icon={ChatBubbleLeftRightIcon}
                title="Messages Exchanged"
                value={liveStats.messagesExchanged}
                change={15}
                color="purple"
              />
              <StatCard
                icon={GlobeAltIcon}
                title="Languages Used"
                value={liveStats.languagesUsed}
                change={5}
                color="orange"
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <SparklesIcon className="h-5 w-5 mr-2 text-yellow-500" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <QuickActionCard
                  icon={LanguageIcon}
                  title="Start Translating"
                  description="Translate text between 20+ languages instantly"
                  action="translate"
                  color="blue"
                />
                <QuickActionCard
                  icon={ChatBubbleLeftRightIcon}
                  title="Join Chat Room"
                  description="Connect with people globally in real-time"
                  action="chat"
                  color="green"
                />
                <QuickActionCard
                  icon={MicrophoneIcon}
                  title="Voice Translation"
                  description="Speak and translate in real-time"
                  action="voice"
                  color="purple"
                />
              </div>
            </div>

            {/* Recent Activity & Language Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <RecentTranslations />
              <LanguageStats />
              <LiveTranslationCard />
            </div>
          </div>
        );

      case 'translate':
        return <TranslationInterface />;

      case 'activity':
        return <ActivityFeed />;

      case 'settings':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Cog6ToothIcon className="h-5 w-5 mr-2" />
              Settings
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Default Language</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Your preferred translation language</p>
                    </div>
                    <select className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>Hindi</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Auto-detect Language</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Automatically detect source language</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <GlobeAltIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Universal Translator</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back, {user?.displayName || 'User'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Cog6ToothIcon className="h-5 w-5" />
              </button>
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.displayName?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: GlobeAltIcon },
              { id: 'translate', label: 'Translate', icon: LanguageIcon },
              { id: 'activity', label: 'Activity', icon: ClockIcon },
              { id: 'settings', label: 'Settings', icon: Cog6ToothIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
