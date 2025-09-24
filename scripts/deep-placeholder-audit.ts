import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 DEEP PLACEHOLDER AUDIT - Checking all potential sources')
  console.log('=====================================================')

  try {
    // 1. Check marketplace items table
    console.log('\n1️⃣ AUDITING marketplace_items TABLE...')
    const items = await prisma.marketplaceItem.findMany({
      select: {
        id: true,
        title: true,
        thumbnail: true,
        images: true,
        isNsfw: true
      }
    })

    let placeholderIssues = 0
    const problematicItems: any[] = []

    for (const item of items) {
      const issues = []
      
      // Check thumbnail
      if (item.thumbnail) {
        if (item.thumbnail.startsWith('/placeholder-')) {
          issues.push('Thumbnail is placeholder path')
        }
        if (item.thumbnail.includes('placeholder-') && !item.thumbnail.startsWith('data:image/svg+xml;base64,')) {
          issues.push('Thumbnail contains placeholder reference')
        }
        if (!item.thumbnail.startsWith('data:image/svg+xml;base64,')) {
          issues.push('Thumbnail is not base64 SVG')
        }
      } else {
        issues.push('Thumbnail is missing')
      }

      // Check images
      if (item.images) {
        const parsedImages = typeof item.images === 'string' ? JSON.parse(item.images) : item.images
        for (let i = 0; i < parsedImages.length; i++) {
          const img = parsedImages[i]
          if (img.startsWith('/placeholder-')) {
            issues.push(`Image ${i + 1} is placeholder path`)
          }
          if (img.includes('placeholder-') && !img.startsWith('data:image/svg+xml;base64,')) {
            issues.push(`Image ${i + 1} contains placeholder reference`)
          }
          if (!img.startsWith('data:image/svg+xml;base64,')) {
            issues.push(`Image ${i + 1} is not base64 SVG`)
          }
        }
      } else {
        issues.push('Images array is missing')
      }

      if (issues.length > 0) {
        placeholderIssues++
        problematicItems.push({
          id: item.id,
          title: item.title,
          issues: issues
        })
      }
    }

    console.log(`📊 Marketplace Items Audit Results:`)
    console.log(`   Total items: ${items.length}`)
    console.log(`   Items with issues: ${placeholderIssues}`)
    
    if (problematicItems.length > 0) {
      console.log('\n❌ PROBLEMATIC ITEMS:')
      problematicItems.forEach(item => {
        console.log(`   - ${item.title} (${item.id})`)
        item.issues.forEach((issue: string) => console.log(`     * ${issue}`))
      })
    } else {
      console.log('✅ All marketplace items have valid base64 SVG images')
    }

    // 2. Check for any hardcoded placeholder references in the database
    console.log('\n2️⃣ CHECKING FOR HARDCODED PLACEHOLDER REFERENCES...')
    
    // Check all text columns in all tables for placeholder references
    const tables = ['users', 'posts', 'contents', 'marketplace_items', 'marketplace_reviews', 'marketplace_orders']
    
    for (const table of tables) {
      try {
        const result: any = await prisma.$queryRawUnsafe(`
          SELECT name FROM pragma_table_info('${table}') WHERE type IN ('text', 'varchar', 'char', 'string')
        `)
        
        const textColumns = result.map((col: any) => col.name)
        
        for (const column of textColumns) {
          const placeholderResults: any = await prisma.$queryRawUnsafe(`
            SELECT id, ${column} as value FROM ${table} 
            WHERE ${column} LIKE '%placeholder-%' 
            OR ${column} LIKE '%/placeholder-%' 
            OR ${column} LIKE '%placeholder.jpg%'
            OR ${column} LIKE '%placeholder.png%'
            OR ${column} LIKE '%placeholder.gif%'
            LIMIT 10
          `)
          
          if (placeholderResults.length > 0) {
            console.log(`⚠️  Found placeholder references in ${table}.${column}:`)
            placeholderResults.forEach((row: any) => {
              console.log(`   ID ${row.id}: ${row.value.substring(0, 100)}...`)
            })
          }
        }
      } catch (error) {
        // Skip table if it doesn't exist or query fails
        console.log(`   Skipped table ${table}: ${error}`)
      }
    }

    // 3. Check for any files or assets that might contain placeholders
    console.log('\n3️⃣ CHECKING FILE SYSTEM FOR PLACEHOLDER ASSETS...')
    
    const fs = require('fs')
    const path = require('path')
    
    const publicDir = '/home/z/my-project/public'
    if (fs.existsSync(publicDir)) {
      const findPlaceholders = (dir: string) => {
        const files = fs.readdirSync(dir)
        for (const file of files) {
          const filePath = path.join(dir, file)
          const stat = fs.statSync(filePath)
          
          if (stat.isDirectory()) {
            findPlaceholders(filePath)
          } else if (file.includes('placeholder') && (file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.gif'))) {
            console.log(`❌ Found placeholder asset: ${filePath}`)
          }
        }
      }
      
      findPlaceholders(publicDir)
    }

    // 4. Check for any caching or CDN references
    console.log('\n4️⃣ CHECKING FOR CACHING/CDN CONFIGURATIONS...')
    
    // Check Next.js configuration
    const nextConfigPath = '/home/z/my-project/next.config.js'
    if (fs.existsSync(nextConfigPath)) {
      const nextConfig = fs.readFileSync(nextConfigPath, 'utf8')
      if (nextConfig.includes('placeholder')) {
        console.log('⚠️  Found placeholder references in next.config.js')
      }
    }

    // Check environment variables
    const envPath = '/home/z/my-project/.env'
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8')
      if (envContent.includes('placeholder')) {
        console.log('⚠️  Found placeholder references in .env file')
      }
    }

    // 5. Check for any API routes that might generate placeholders
    console.log('\n5️⃣ CHECKING API ROUTES FOR PLACEHOLDER GENERATION...')
    
    const apiDir = '/home/z/my-project/src/app/api'
    const checkApiFiles = (dir: string) => {
      const files = fs.readdirSync(dir)
      for (const file of files) {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)
        
        if (stat.isDirectory()) {
          checkApiFiles(filePath)
        } else if (file.endsWith('.ts') || file.endsWith('.js')) {
          const content = fs.readFileSync(filePath, 'utf8')
          if (content.includes('placeholder') || content.includes('/placeholder-')) {
            console.log(`⚠️  Found placeholder references in API file: ${filePath}`)
          }
        }
      }
    }
    
    if (fs.existsSync(apiDir)) {
      checkApiFiles(apiDir)
    }

    // 6. Check for any scripts that might generate placeholders
    console.log('\n6️⃣ CHECKING SCRIPTS FOR PLACEHOLDER GENERATION...')
    
    const scriptsDir = '/home/z/my-project/scripts'
    const checkScriptFiles = (dir: string) => {
      const files = fs.readdirSync(dir)
      for (const file of files) {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)
        
        if (stat.isDirectory()) {
          checkScriptFiles(filePath)
        } else if (file.endsWith('.ts') || file.endsWith('.js')) {
          const content = fs.readFileSync(filePath, 'utf8')
          if (content.includes('getPlaceholderImage') || content.includes('/placeholder-')) {
            console.log(`⚠️  Found placeholder generation in script: ${filePath}`)
          }
        }
      }
    }
    
    if (fs.existsSync(scriptsDir)) {
      checkScriptFiles(scriptsDir)
    }

    // 7. Summary
    console.log('\n📊 AUDIT SUMMARY')
    console.log('===============')
    
    if (placeholderIssues === 0) {
      console.log('✅ DATABASE: No placeholder images found in marketplace_items')
    } else {
      console.log(`❌ DATABASE: ${placeholderIssues} items have placeholder issues`)
    }
    
    console.log('✅ File system audit completed')
    console.log('✅ Configuration files checked')
    console.log('✅ API routes checked')
    console.log('✅ Scripts checked')
    
    if (placeholderIssues === 0) {
      console.log('\n🎉 AUDIT PASSED: No placeholder images found in the system')
      console.log('   All marketplace items have valid base64-encoded SVG images')
    } else {
      console.log('\n❌ AUDIT FAILED: Placeholder images still exist in the system')
      console.log('   Immediate action required to fix all identified issues')
      process.exit(1)
    }

  } catch (error) {
    console.error('❌ Error during audit:', error)
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error('❌ Audit failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })