'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, Server, Settings, Shield, Terminal } from 'lucide-react';

const steps = [
  { id: 1, label: 'Initializing infrastructure', icon: Server },
  { id: 2, label: 'Installing dependencies', icon: Settings },
  { id: 3, label: 'Configuring access controls', icon: Shield },
  { id: 4, label: 'Environment ready', icon: Terminal },
];

interface ProvisioningStepsProps {
  currentStep: number;
}

export function ProvisioningSteps({ currentStep }: ProvisioningStepsProps) {
  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="space-y-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex items-center gap-4"
            >
              <div className="relative">
                <AnimatePresence mode="wait">
                  {isCompleted ? (
                    <motion.div
                      key="completed"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-10 h-10 rounded-sm bg-[#00e676]/10 border border-[#00e676]/30 flex items-center justify-center"
                    >
                      <CheckCircle className="w-5 h-5 text-[#00e676]" />
                    </motion.div>
                  ) : isActive ? (
                    <motion.div
                      key="active"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="w-10 h-10 rounded-sm bg-[#00e676] flex items-center justify-center shadow-[0_0_16px_rgba(0,230,118,0.4)]"
                    >
                      <Loader2 className="w-5 h-5 text-[#06060a] animate-spin" />
                    </motion.div>
                  ) : (
                    <div className="w-10 h-10 rounded-sm bg-[#14141f] border border-[#1a1a2e] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#5a5a6a]" />
                    </div>
                  )}
                </AnimatePresence>

                {index < steps.length - 1 && (
                  <div
                    className={`absolute left-1/2 top-10 w-px h-6 -translate-x-1/2 ${
                      isCompleted ? 'bg-[#00e676]' : 'bg-[#1a1a2e]'
                    }`}
                  />
                )}
              </div>

              <div className="flex-1">
                <p
                  className={`text-sm font-medium font-[family-name:var(--font-mono)] ${
                    isActive
                      ? 'text-[#00e676]'
                      : isCompleted
                      ? 'text-[#8a8a9a]'
                      : 'text-[#5a5a6a]'
                  }`}
                >
                  {step.label}
                </p>
                {isActive && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-[#5a5a6a] mt-0.5 font-[family-name:var(--font-mono)]"
                  >
                    This may take a moment...
                  </motion.p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
