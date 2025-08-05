import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Goal {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  selected?: boolean;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  age?: number;
  goals: Goal[];
  onboardingStep: number;
  onboardingComplete: boolean;
  healthScore: number;
  streak: number;
}

interface UserStore {
  user: User | null;
  currentStep: number;
  isLoading: boolean;
  
  // Actions
  setUser: (user: Partial<User>) => void;
  updateUserGoals: (goals: Goal[]) => void;
  nextStep: () => void;
  setStep: (step: number) => void;
  completeOnboarding: () => void;
  setLoading: (loading: boolean) => void;
  resetUser: () => void;
}

const defaultUser: User = {
  id: '',
  name: '',
  goals: [],
  onboardingStep: 0,
  onboardingComplete: false,
  healthScore: 0,
  streak: 0
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      currentStep: 0,
      isLoading: false,

      setUser: (userData) => {
        set((state) => ({
          user: state.user 
            ? { ...state.user, ...userData }
            : { ...defaultUser, ...userData }
        }));
      },

      updateUserGoals: (goals) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              goals
            }
          });
        }
      },

      nextStep: () => {
        set((state) => ({
          currentStep: state.currentStep + 1,
          user: state.user 
            ? { ...state.user, onboardingStep: state.currentStep + 1 }
            : state.user
        }));
      },

      setStep: (step) => {
        set((state) => ({
          currentStep: step,
          user: state.user 
            ? { ...state.user, onboardingStep: step }
            : state.user
        }));
      },

      completeOnboarding: () => {
        set((state) => ({
          user: state.user 
            ? { ...state.user, onboardingComplete: true }
            : state.user
        }));
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      resetUser: () => {
        set({ 
          user: null, 
          currentStep: 0, 
          isLoading: false 
        });
      }
    }),
    {
      name: 'self-user-storage',
      partialize: (state) => ({
        user: state.user,
        currentStep: state.currentStep
      })
    }
  )
);