import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, ImageBackground, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../store/useStore';

export default function AuthScreen() {
  const [isLoginMode, setIsLoginMode] = useState(false); // Tracks if user is logging in or signing up

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();
  const { login, isAuthenticated, userType } = useStore();

  useEffect(() => {
    if (isAuthenticated) {
      if (userType) {
        router.replace('/dashboard');
      } else {
        router.replace('/onboarding');
      }
    }
  }, [isAuthenticated, userType, router]);

  const handleAuth = () => {
    if (isLoginMode) {
      // Bulletproof Login Validation
      if (!email.trim() || !password.trim()) {
        alert("⚠️ Please enter both your email and password.");
        return; // HARD STOP
      }
      login();
      router.replace('/dashboard');
    } else {
      // Bulletproof Signup Validation
      if (!fullName.trim() || !email.trim() || !password.trim()) {
        alert("⚠️ You cannot leave any fields blank!");
        return; // HARD STOP
      }
      // Optional: Add basic email format checking
      if (!email.includes('@')) {
        alert("⚠️ Please enter a valid email address.");
        return; // HARD STOP
      }
      login();
      router.replace('/onboarding');
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a1?q=80&w=2800&auto=format&fit=crop' }}
      className="flex-1 justify-center items-center bg-slate-900"
      resizeMode="cover"
    >
      <View className="absolute inset-0 bg-slate-950/80" />

      <View
        className="w-full max-w-[400px] h-full max-h-[850px] rounded-[48px] overflow-hidden relative justify-center px-6 shadow-2xl"
        style={Platform.OS === 'web' ? { height: '850px', border: '10px solid #0f172a' } : { flex: 1 }}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="w-full">

          <View
            className="w-full p-8 rounded-[32px] border border-white/10"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
          >

            <View className="mb-10 items-center">
              <View className="w-16 h-16 bg-emerald-500/20 rounded-2xl items-center justify-center mb-5 border border-emerald-500/30">
                <Text className="text-emerald-400 text-3xl font-sans font-black">₦</Text>
              </View>
              <Text className="text-white text-3xl font-sans font-bold tracking-tight mb-2">
                {isLoginMode ? 'Welcome Back' : 'KudiKeeper'}
              </Text>
              <Text className="text-slate-400 text-sm font-sans text-center px-4">
                {isLoginMode ? 'Enter your details to access your vault.' : 'Master your budget and track every expense.'}
              </Text>
            </View>

            <View className="space-y-5">

              {/* Only show Full Name on Signup */}
              {!isLoginMode && (
                <View>
                  <Text className="text-slate-400 text-[10px] font-sans font-bold uppercase tracking-widest mb-2 ml-1">Full Name</Text>
                  <TextInput
                    className="w-full bg-slate-900/60 text-white font-sans rounded-2xl px-5 py-4 border border-white/5"
                    placeholder="John Doe"
                    placeholderTextColor="#475569"
                    value={fullName}
                    onChangeText={setFullName}
                    style={Platform.OS === 'web' ? { outline: 'none' } : {}}
                  />
                </View>
              )}

              <View>
                <Text className="text-slate-400 text-[10px] font-sans font-bold uppercase tracking-widest mb-2 ml-1">Email Address</Text>
                <TextInput
                  className="w-full bg-slate-900/60 text-white font-sans rounded-2xl px-5 py-4 border border-white/5"
                  placeholder="hello@kudikeeper.com"
                  placeholderTextColor="#475569"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  style={Platform.OS === 'web' ? { outline: 'none' } : {}}
                />
              </View>

              <View className="mb-4">
                <Text className="text-slate-400 text-[10px] font-sans font-bold uppercase tracking-widest mb-2 ml-1">Password</Text>
                <TextInput
                  className="w-full bg-slate-900/60 text-white font-sans rounded-2xl px-5 py-4 border border-white/5"
                  placeholder="••••••••"
                  placeholderTextColor="#475569"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  style={Platform.OS === 'web' ? { outline: 'none' } : {}}
                />
              </View>

              <TouchableOpacity
                onPress={handleAuth}
                className="w-full bg-emerald-500 py-4 rounded-2xl items-center justify-center mt-2 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
              >
                <Text className="text-slate-950 font-sans font-black uppercase tracking-wider">
                  {isLoginMode ? 'Secure Login' : 'Create Account'}
                </Text>
              </TouchableOpacity>

            </View>

            {/* Toggle Button */}
            <TouchableOpacity onPress={() => setIsLoginMode(!isLoginMode)} className="mt-8 items-center">
              <Text className="text-slate-400 text-sm font-sans">
                {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                <Text className="text-emerald-400 font-bold">{isLoginMode ? 'Sign Up' : 'Log In'}</Text>
              </Text>
            </TouchableOpacity>

          </View>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}