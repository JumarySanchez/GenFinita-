
import React, { createContext, useContext, useState, useEffect } from 'react';
import { pocketbaseClient as pb } from '@/lib/pocketbaseClient';

const AuthContext = createContext(null);
const SUBSCRIPTION_STORAGE_KEY = 'genfinita_subscription_plan';
const TRIAL_USES_STORAGE_KEY = 'genfinita_trial_uses';
const STUDENT_VERIFIED_STORAGE_KEY = 'genfinita_student_verified';
const TRIAL_PLAN_LIMIT = 3;
const STUDENT_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.edu$/i;
const STUDENT_ID_REGEX = /^[A-Za-z0-9\-]{6,24}$/;

function readStorage(key, fallback) {
	if (typeof window === 'undefined') {
		return fallback;
	}

	const value = window.localStorage.getItem(key);
	return value === null ? fallback : value;
}

function writeStorage(key, value) {
	if (typeof window === 'undefined') {
		return;
	}

	window.localStorage.setItem(key, String(value));
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [subscriptionPlan, setSubscriptionPlan] = useState(() => readStorage(SUBSCRIPTION_STORAGE_KEY, 'free'));
  const [trialUses, setTrialUses] = useState(() => Number(readStorage(TRIAL_USES_STORAGE_KEY, '0')) || 0);
  const [studentVerified, setStudentVerified] = useState(() => readStorage(STUDENT_VERIFIED_STORAGE_KEY, 'false') === 'true');

  useEffect(() => {
    if (pb.authStore.isValid) {
      setCurrentUser(pb.authStore.model);
    }
    setInitialLoading(false);
  }, []);

  useEffect(() => {
    writeStorage(SUBSCRIPTION_STORAGE_KEY, subscriptionPlan);
  }, [subscriptionPlan]);

  useEffect(() => {
    writeStorage(TRIAL_USES_STORAGE_KEY, trialUses);
  }, [trialUses]);

  useEffect(() => {
    writeStorage(STUDENT_VERIFIED_STORAGE_KEY, studentVerified);
  }, [studentVerified]);

  const login = async (email, password) => {
    const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
    setCurrentUser(authData.record);
    return authData;
  };

  const signup = async (email, password, passwordConfirm, name) => {
    const record = await pb.collection('users').create({
      email,
      password,
      passwordConfirm,
      name,
    }, { $autoCancel: false });
    
    await login(email, password);
    return record;
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
  };

  const startTrial = () => {
    setSubscriptionPlan('trial');
    setTrialUses(0);
  };

  const upgradeSubscription = (plan = 'pro') => {
    setSubscriptionPlan(plan);
    if (plan !== 'student') {
      setStudentVerified(false);
    }
  };

  const verifyStudentAndUpgrade = ({ studentEmail, studentId }) => {
    const normalizedEmail = studentEmail.trim().toLowerCase();
    const normalizedStudentId = studentId.trim();

    if (!STUDENT_EMAIL_REGEX.test(normalizedEmail)) {
      return {
        ok: false,
        error: 'Please use a valid student email ending in .edu',
      };
    }

    if (!STUDENT_ID_REGEX.test(normalizedStudentId)) {
      return {
        ok: false,
        error: 'Please enter a valid student ID (6-24 letters, numbers, or dashes)',
      };
    }

    setSubscriptionPlan('student');
    setStudentVerified(true);

    return {
      ok: true,
    };
  };

  const consumeTrialUse = () => {
    setTrialUses((current) => current + 1);
  };

  const trialRemaining = subscriptionPlan === 'trial' ? Math.max(TRIAL_PLAN_LIMIT - trialUses, 0) : 0;
  const hasGeneratorAccess = subscriptionPlan === 'pro' || subscriptionPlan === 'student' || trialRemaining > 0;

  const updateUser = async (data) => {
    const updated = await pb.collection('users').update(currentUser.id, data, { $autoCancel: false });
    setCurrentUser(updated);
    return updated;
  };

  const value = {
    currentUser,
    initialLoading,
    login,
    signup,
    logout,
    updateUser,
    subscriptionPlan,
    trialUses,
    studentVerified,
    trialRemaining,
    hasGeneratorAccess,
    startTrial,
    upgradeSubscription,
    verifyStudentAndUpgrade,
    consumeTrialUse,
    isAuthenticated: pb.authStore.isValid,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
