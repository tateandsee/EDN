/**
 * AI Integration Test Runner
 * Simple script to test all AI model integrations
 */

import { aiIntegrationTester } from './src/lib/ai-integration-test'

async function runAIIntegrationTests() {
  console.log('🚀 Starting AI Integration Tests...')
  console.log('='.repeat(60))
  
  try {
    const report = await aiIntegrationTester.runAllTests()
    
    console.log('\n' + '='.repeat(60))
    console.log('📊 FINAL TEST REPORT')
    console.log('='.repeat(60))
    console.log(`🕒 Test Run Time: ${report.summary.totalDuration}ms`)
    console.log(`🎯 Overall Status: ${report.overallStatus.toUpperCase()}`)
    console.log(`📈 Success Rate: ${report.summary.successRate.toFixed(1)}%`)
    console.log(`✅ Passed: ${report.summary.passed}`)
    console.log(`❌ Failed: ${report.summary.failed}`)
    console.log(`⏭️ Skipped: ${report.summary.skipped}`)
    
    console.log('\n📋 TEST SUITES:')
    report.testSuites.forEach(suite => {
      const statusIcon = suite.failed === 0 ? '✅' : suite.failed <= 2 ? '⚠️' : '❌'
      console.log(`${statusIcon} ${suite.name}: ${suite.successRate.toFixed(1)}% (${suite.passed}/${suite.passed + suite.failed})`)
    })
    
    if (report.issues.length > 0) {
      console.log('\n🚨 ISSUES DETECTED:')
      report.issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`)
      })
    }
    
    if (report.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:')
      report.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`)
      })
    }
    
    console.log('\n' + '='.repeat(60))
    
    if (report.overallStatus === 'passed') {
      console.log('🎉 ALL AI INTEGRATIONS WORKING PERFECTLY!')
      console.log('✅ System is ready for production deployment')
    } else if (report.overallStatus === 'partial') {
      console.log('⚠️  MOST AI INTEGRATIONS WORKING')
      console.log('🔧 Address minor issues before full deployment')
    } else {
      console.log('❌ CRITICAL ISSUES DETECTED')
      console.log('🛠️  Fix all failed tests before deployment')
    }
    
    console.log('='.repeat(60))
    
    return report
    
  } catch (error) {
    console.error('❌ Test execution failed:', error)
    throw error
  }
}

// Run the tests
runAIIntegrationTests().catch(console.error)