'use client'

import { useUpgradePopup } from '@/components/upgrade-popup'
import { UpgradePopup } from '@/components/upgrade-popup'

export function UpgradePopupWrapper() {
  const { 
    isOpen, 
    hideUpgradePopup, 
    currentPlan, 
    hitLimit, 
    recommendedPlan, 
    usagePercentage 
  } = useUpgradePopup()

  return (
    <UpgradePopup
      isOpen={isOpen}
      onClose={hideUpgradePopup}
      currentPlan={currentPlan}
      hitLimit={hitLimit}
      recommendedPlan={recommendedPlan}
      usagePercentage={usagePercentage}
    />
  )
}