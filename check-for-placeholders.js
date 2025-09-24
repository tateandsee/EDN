const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function checkForPlaceholders() {
  try {
    console.log('=== Checking for Any Placeholder Images ===')
    
    // Check database for any placeholder references
    const items = await prisma.marketplaceItem.findMany({
      select: {
        id: true,
        title: true,
        thumbnail: true,
        images: true
      }
    })

    console.log(`Checking ${items.length} marketplace items...`)

    let placeholderCount = 0
    const placeholderItems = []

    items.forEach(item => {
      // Check thumbnail for placeholder indicators
      if (item.thumbnail) {
        const thumbnailLower = item.thumbnail.toLowerCase()
        if (thumbnailLower.includes('placeholder') || 
            thumbnailLower.includes('missing') ||
            thumbnailLower.includes('not-found') ||
            !item.thumbnail.startsWith('data:image/svg+xml;base64,')) {
          placeholderCount++
          placeholderItems.push({
            id: item.id,
            title: item.title,
            type: 'thumbnail',
            value: item.thumbnail.substring(0, 100) + '...'
          })
        }
      } else {
        placeholderCount++
        placeholderItems.push({
          id: item.id,
          title: item.title,
          type: 'thumbnail',
          value: 'NULL'
        })
      }

      // Check images array for placeholder indicators
      if (item.images) {
        try {
          const images = JSON.parse(item.images)
          images.forEach((image, index) => {
            const imageLower = image.toLowerCase()
            if (imageLower.includes('placeholder') || 
                imageLower.includes('missing') ||
                imageLower.includes('not-found') ||
                !image.startsWith('data:image/svg+xml;base64,')) {
              placeholderCount++
              placeholderItems.push({
                id: item.id,
                title: item.title,
                type: `images[${index}]`,
                value: image.substring(0, 100) + '...'
              })
            }
          })
        } catch (e) {
          placeholderCount++
          placeholderItems.push({
            id: item.id,
            title: item.title,
            type: 'images',
            value: 'INVALID JSON'
          })
        }
      } else {
        placeholderCount++
        placeholderItems.push({
          id: item.id,
          title: item.title,
          type: 'images',
          value: 'NULL'
        })
      }
    })

    console.log(`\nPlaceholder Issues Found: ${placeholderCount}`)

    if (placeholderItems.length > 0) {
      console.log('\nItems with placeholder issues:')
      placeholderItems.forEach(item => {
        console.log(`  ${item.id} - ${item.title} (${item.type}): ${item.value}`)
      })
    } else {
      console.log('✅ No placeholder images found in database!')
    }

    // Check public folder for placeholder files
    console.log('\n=== Checking Public Folder for Placeholder Files ===')
    const publicDir = path.join(__dirname, 'public')
    
    function findPlaceholderFiles(dir) {
      const files = fs.readdirSync(dir)
      const placeholderFiles = []

      files.forEach(file => {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)
        
        if (stat.isDirectory()) {
          placeholderFiles.push(...findPlaceholderFiles(filePath))
        } else if (file.toLowerCase().includes('placeholder')) {
          placeholderFiles.push(filePath)
        }
      })

      return placeholderFiles
    }

    try {
      const placeholderFiles = findPlaceholderFiles(publicDir)
      console.log(`Placeholder files in public folder: ${placeholderFiles.length}`)
      
      if (placeholderFiles.length > 0) {
        console.log('Placeholder files found:')
        placeholderFiles.forEach(file => {
          console.log(`  ${file}`)
        })
      } else {
        console.log('✅ No placeholder files found in public folder!')
      }
    } catch (error) {
      console.log('Could not check public folder for placeholder files')
    }

    // Check for any remaining placeholder references in code
    console.log('\n=== Checking Code for Placeholder References ===')
    const srcDir = path.join(__dirname, 'src')
    let placeholderReferences = []
    let placeholderFiles = []
    
    function findPlaceholderReferences(dir) {
      const files = fs.readdirSync(dir)
      const references = []

      files.forEach(file => {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)
        
        if (stat.isDirectory()) {
          references.push(...findPlaceholderReferences(filePath))
        } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js')) {
          try {
            const content = fs.readFileSync(filePath, 'utf8')
            if (content.toLowerCase().includes('placeholder')) {
              const lines = content.split('\n')
              lines.forEach((line, index) => {
                if (line.toLowerCase().includes('placeholder')) {
                  references.push({
                    file: filePath,
                    line: index + 1,
                    content: line.trim()
                  })
                }
              })
            }
          } catch (error) {
            // Skip files that can't be read
          }
        }
      })

      return references
    }

    try {
      placeholderFiles = findPlaceholderFiles(publicDir)
      console.log(`Placeholder files in public folder: ${placeholderFiles.length}`)
      
      if (placeholderFiles.length > 0) {
        console.log('Placeholder files found:')
        placeholderFiles.forEach(file => {
          console.log(`  ${file}`)
        })
      } else {
        console.log('✅ No placeholder files found in public folder!')
      }
    } catch (error) {
      console.log('Could not check public folder for placeholder files')
    }

    try {
      placeholderReferences = findPlaceholderReferences(srcDir)
      console.log(`Placeholder references in code: ${placeholderReferences.length}`)
      
      if (placeholderReferences.length > 0) {
        console.log('Placeholder references found:')
        placeholderReferences.forEach(ref => {
          console.log(`  ${ref.file}:${ref.line} - ${ref.content}`)
        })
      } else {
        console.log('✅ No placeholder references found in code!')
      }
    } catch (error) {
      console.log('Could not check code for placeholder references')
    }

    // Final status
    const totalPlaceholders = placeholderCount + (placeholderFiles ? placeholderFiles.length : 0) + placeholderReferences.length
    
    console.log('\n=== FINAL PLACEHOLDER CHECK STATUS ===')
    if (totalPlaceholders === 0) {
      console.log('🎉 NO PLACEHOLDERS FOUND ANYWHERE!')
      console.log('✅ Database: All images are custom SVG data URLs')
      console.log('✅ Public Folder: No placeholder image files')
      console.log('✅ Code: No placeholder references')
      console.log('✅ EDN Marketplace is 100% placeholder-free!')
    } else {
      console.log(`❌ Found ${totalPlaceholders} placeholder-related issues`)
      console.log(`  - Database: ${placeholderCount} issues`)
      console.log(`  - Files: ${placeholderFiles.length || 0} files`)
      console.log(`  - Code: ${placeholderReferences.length || 0} references`)
    }

    return {
      databasePlaceholders: placeholderCount,
      filePlaceholders: placeholderFiles.length || 0,
      codeReferences: placeholderReferences.length || 0,
      totalPlaceholders,
      isClean: totalPlaceholders === 0
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkForPlaceholders()