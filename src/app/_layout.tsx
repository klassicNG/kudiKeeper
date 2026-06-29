import './global.css';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Platform, Pressable, ScrollView, Vibration, Alert } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useStore } from '../store/useStore';

export default function RootLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const {
    theme, toggleTheme, notifications, unreadCount, clearUnread,
    isAuthenticated, pin, isAppUnlocked, setPin, verifyPin, lockApp, logout, resetPin
  } = useStore();

  const isAuthPage = pathname === '/' || pathname === '/index' || pathname === '/onboarding';

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'pie-chart' },
    { name: 'Log Expense', path: '/expense', icon: 'plus-circle' },
    { name: 'Budget Planner', path: '/budget', icon: 'target' },
    { name: 'Savings Goals', path: '/savings', icon: 'award' },
  ];

  const handleNavigation = (path: string) => {
    setIsMenuOpen(false);
    router.push(path as any);
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
    router.replace('/');
  };

  const toggleNotifications = () => {
    setIsMenuOpen(false);
    setIsNotifOpen(!isNotifOpen);
    if (!isNotifOpen && unreadCount > 0) clearUnread();
  };

  const handlePinPress = (value: string | number) => {
    if (value === 'del') {
      setEnteredPin(prev => prev.slice(0, -1));
      setPinError(false);
      return;
    }

    if (enteredPin.length < 4) {
      const newPin = enteredPin + value;
      setEnteredPin(newPin);

      if (newPin.length === 4) {
        if (!pin) {
          setPin(newPin);
          setEnteredPin('');
        } else {
          if (newPin === pin) {
            verifyPin();
            setEnteredPin('');
            setPinError(false);
          } else {
            setPinError(true);
            if (Platform.OS !== 'web') Vibration.vibrate();
            setTimeout(() => {
              setEnteredPin('');
              setPinError(false);
            }, 500);
          }
        }
      }
    }
  };

  const keypadLayout = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'];

  return (
    <ImageBackground
      source={{
        uri: theme === 'dark'
          ? 'https://images.unsplash.com/photo-1642543492481-44e81e3914a1?q=80&w=2800&auto=format&fit=crop'
          : 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2829&auto=format&fit=crop'
      }}
      className="flex-1 justify-center items-center bg-slate-900"
      resizeMode="cover"
    >
      <View className={`absolute inset-0 ${theme === 'dark' ? 'bg-slate-950/85' : 'bg-emerald-950/70'}`} />

      <View
        className={
          Platform.OS === 'web'
            ? "w-full max-w-[400px] h-full max-h-[850px] rounded-[48px] overflow-hidden relative shadow-2xl"
            : "flex-1 w-full h-full overflow-hidden relative"
        }
        style={Platform.OS === 'web' ? { height: '850px', border: '10px solid #0f172a' } : { flex: 1 }}
      >

        {/* HEADER */}
        {!isAuthPage && (
          <View
            className="flex-row justify-between items-center px-6 pt-12 pb-4 border-b border-white/5 z-40"
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)' }}
          >
            <TouchableOpacity onPress={() => { setIsNotifOpen(false); setIsMenuOpen(!isMenuOpen); }} className="w-10 h-10 bg-white/5 rounded-xl items-center justify-center border border-white/10">
              <Feather name={isMenuOpen ? "x" : "menu"} size={20} color="white" />
            </TouchableOpacity>

            <View className="flex-row items-center">
              <Text className="text-emerald-400 text-lg font-sans font-black mr-1">₦</Text>
              <Text className="text-white font-sans font-bold tracking-widest text-xs uppercase">KudiKeeper</Text>
            </View>

            <View className="flex-row gap-2">
              <TouchableOpacity onPress={toggleNotifications} className={`w-10 h-10 rounded-xl items-center justify-center border border-white/10 relative ${isNotifOpen ? 'bg-white/20' : 'bg-white/5'}`}>
                <Feather name="bell" size={18} color="white" />
                {unreadCount > 0 && <View className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900" />}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (Platform.OS === 'web') {
                    if (window.confirm("Are you sure you want to reset your Security PIN?")) resetPin();
                  } else {
                    Alert.alert(
                      "Reset PIN",
                      "Are you sure you want to reset your Security PIN?",
                      [
                        { text: "Cancel", style: "cancel" },
                        { text: "Reset", style: "destructive", onPress: () => resetPin() }
                      ]
                    );
                  }
                }}
                className="w-10 h-10 bg-amber-500/10 rounded-xl items-center justify-center border border-amber-500/20"
              >
                <Feather name="key" size={16} color="#f59e0b" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* NOTIFICATIONS DROPDOWN */}
        {!isAuthPage && isNotifOpen && (
          <Pressable className="absolute inset-0 z-30 bg-black/40 pt-28 px-4" onPress={() => setIsNotifOpen(false)}>
            <View className="w-full max-h-96 bg-slate-900/95 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
              <View className="p-4 border-b border-white/10 flex-row justify-between items-center"><Text className="text-white font-serif font-bold text-lg">Notifications</Text></View>
              <ScrollView showsVerticalScrollIndicator={false} className="p-2">
                {notifications.map((notif) => (
                  <View key={notif.id} className="p-3 mb-2 rounded-2xl bg-white/5 flex-row gap-3 items-start">
                    <View className={`w-8 h-8 rounded-full items-center justify-center mt-1 ${notif.type === 'warning' ? 'bg-red-500/20' : notif.type === 'success' ? 'bg-emerald-500/20' : 'bg-sky-500/20'}`}>
                      <Feather name={notif.type === 'warning' ? 'alert-triangle' : notif.type === 'success' ? 'check-circle' : 'info'} size={14} color={notif.type === 'warning' ? '#ef4444' : notif.type === 'success' ? '#10b981' : '#38bdf8'} />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row justify-between items-center mb-1"><Text className="text-white font-sans font-bold text-sm">{notif.title}</Text><Text className="text-white/40 font-sans text-[10px]">{notif.time}</Text></View>
                      <Text className="text-white/70 font-sans text-xs leading-relaxed">{notif.message}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        )}

        {/* MENU DROPDOWN */}
        {!isAuthPage && isMenuOpen && (
          <Pressable className="absolute inset-0 z-30 bg-black/60 pt-28 px-4" onPress={() => setIsMenuOpen(false)}>
            <View className="w-full bg-slate-900/90 rounded-3xl p-4 border border-white/10 shadow-2xl">
              {navItems.map((item, index) => (
                <TouchableOpacity key={index} onPress={() => handleNavigation(item.path)} className={`flex-row items-center p-4 rounded-2xl mb-2 ${pathname === item.path ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-transparent'}`}>
                  <Feather name={item.icon as any} size={20} color={pathname === item.path ? '#10b981' : '#94a3b8'} />
                  <Text className={`ml-4 font-sans font-bold tracking-wide ${pathname === item.path ? 'text-emerald-400' : 'text-slate-300'}`}>{item.name}</Text>
                </TouchableOpacity>
              ))}
              <View className="h-[1px] w-full bg-white/10 my-2" />
              <TouchableOpacity onPress={handleLogout} className="flex-row items-center p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                <Feather name="log-out" size={20} color="#ef4444" />
                <Text className="ml-4 font-sans font-bold tracking-wide text-red-400">Log Out</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        )}

        {/* SECURE PIN OVERLAY */}
        {isAuthenticated && !isAppUnlocked && (
          <View className="absolute inset-0 z-[100] items-center justify-center bg-slate-950/95">
            <View className="items-center mb-12">
              <View className="w-16 h-16 rounded-full bg-emerald-500/20 items-center justify-center border border-emerald-500/30 mb-6">
                <Feather name="lock" size={28} color="#10b981" />
              </View>
              <Text className="text-white text-2xl font-serif font-bold mb-2">
                {!pin ? 'Create Security PIN' : 'Enter PIN to Unlock'}
              </Text>
              <Text className={`text-sm font-sans ${pinError ? 'text-red-400 font-bold' : 'text-white/50'}`}>
                {pinError ? 'Incorrect PIN. Try again.' : 'Secure your financial records.'}
              </Text>
            </View>

            <View className="flex-row gap-6 mb-16">
              {[0, 1, 2, 3].map((index) => (
                <View key={index} className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${enteredPin.length > index ? pinError ? 'bg-red-500 border-red-500' : 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-transparent border-white/20'}`} />
              ))}
            </View>

            <View className="w-full px-8 flex-row flex-wrap justify-center gap-y-6">
              {keypadLayout.map((key, index) => (
                <View key={index} className="w-[33%] items-center justify-center">
                  {key !== '' ? (
                    <TouchableOpacity onPress={() => handlePinPress(key)} className="w-20 h-20 rounded-full items-center justify-center bg-white/[0.03] border border-white/5 active:bg-emerald-500/20">
                      {key === 'del' ? <Feather name="delete" size={24} color="white" /> : <Text className="text-white text-3xl font-sans font-light">{key}</Text>}
                    </TouchableOpacity>
                  ) : <View className="w-20 h-20" />}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* MAIN PAGE CONTENT */}
        <View className="flex-1 z-0">
          <Slot />
        </View>

      </View>
    </ImageBackground>
  );
}