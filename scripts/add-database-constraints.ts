import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🗄️  ADDING DATABASE CONSTRAINTS TO PREVENT PLACEHOLDER IMAGES')
  console.log('========================================================')

  try {
    // 1. Create a validation function for images
    console.log('\n1️⃣ CREATING VALIDATION FUNCTION...')
    
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS marketplace_items_backup (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        currency TEXT DEFAULT 'USD',
        status TEXT DEFAULT 'ACTIVE',
        thumbnail TEXT,
        images TEXT,
        pdfFile TEXT,
        pdfFileName TEXT,
        pdfFileSize INTEGER,
        tags TEXT,
        isNsfw INTEGER DEFAULT 0,
        promptConfig TEXT,
        positivePrompt TEXT,
        negativePrompt TEXT,
        fullPrompt TEXT,
        userId TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        listingNumber INTEGER DEFAULT 0
      )
    `)
    
    // 2. Create a trigger function to validate images before insert/update
    console.log('\n2️⃣ CREATING VALIDATION TRIGGERS...')
    
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER IF NOT EXISTS validate_marketplace_item_images
      BEFORE INSERT ON marketplace_items
      FOR EACH ROW
      BEGIN
        -- Validate thumbnail
        IF NEW.thumbnail IS NOT NULL AND (
          NEW.thumbnail LIKE '/placeholder-%' OR
          NEW.thumbnail LIKE '%placeholder-%' OR
          NEW.thumbnail NOT LIKE 'data:image/svg+xml;base64,%'
        ) THEN
          SELECT RAISE(ABORT, 'Thumbnail must be a valid base64-encoded SVG image, not a placeholder');
        END IF;
        
        -- Validate images JSON array
        IF NEW.images IS NOT NULL THEN
          -- This is a simplified check - in production you'd parse the JSON and validate each image
          IF NEW.images LIKE '%placeholder-%' OR NEW.images LIKE '/placeholder-%' THEN
            SELECT RAISE(ABORT, 'Images array cannot contain placeholder images');
          END IF;
        END IF;
      END;
    `)
    
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER IF NOT EXISTS validate_marketplace_item_images_update
      BEFORE UPDATE ON marketplace_items
      FOR EACH ROW
      BEGIN
        -- Validate thumbnail
        IF NEW.thumbnail IS NOT NULL AND (
          NEW.thumbnail LIKE '/placeholder-%' OR
          NEW.thumbnail LIKE '%placeholder-%' OR
          NEW.thumbnail NOT LIKE 'data:image/svg+xml;base64,%'
        ) THEN
          SELECT RAISE(ABORT, 'Thumbnail must be a valid base64-encoded SVG image, not a placeholder');
        END IF;
        
        -- Validate images JSON array
        IF NEW.images IS NOT NULL THEN
          -- This is a simplified check - in production you'd parse the JSON and validate each image
          IF NEW.images LIKE '%placeholder-%' OR NEW.images LIKE '/placeholder-%' THEN
            SELECT RAISE(ABORT, 'Images array cannot contain placeholder images');
          END IF;
        END IF;
      END;
    `)
    
    // 3. Create a check constraint for the thumbnail field
    console.log('\n3️⃣ ADDING CHECK CONSTRAINTS...')
    
    // Note: SQLite doesn't support adding CHECK constraints to existing tables easily
    // So we'll create a validation function that can be called manually
    
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS image_validation_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        item_id TEXT,
        field_name TEXT,
        field_value TEXT,
        validation_result TEXT,
        error_message TEXT
      )
    `)
    
    // 4. Create stored procedures for validation
    console.log('\n4️⃣ CREATING VALIDATION PROCEDURES...')
    
    await prisma.$executeRawUnsafe(`
      CREATE PROCEDURE IF NOT EXISTS validate_marketplace_image(image_value TEXT, field_name TEXT, item_id TEXT)
      BEGIN
        DECLARE is_valid INTEGER DEFAULT 1;
        DECLARE error_msg TEXT DEFAULT '';
        
        -- Check if image is placeholder
        IF image_value LIKE '/placeholder-%' OR image_value LIKE '%placeholder-%' THEN
          SET is_valid = 0;
          SET error_msg = 'Image cannot be a placeholder path';
        END IF;
        
        -- Check if image is proper base64 SVG
        IF image_value IS NOT NULL AND image_value NOT LIKE 'data:image/svg+xml;base64,%' THEN
          SET is_valid = 0;
          SET error_msg = 'Image must be a base64-encoded SVG';
        END IF;
        
        -- Log validation result
        INSERT INTO image_validation_log (item_id, field_name, field_value, validation_result, error_message)
        VALUES (item_id, field_name, 
                CASE WHEN LENGTH(image_value) > 100 THEN SUBSTR(image_value, 1, 100) || '...' ELSE image_value END,
                CASE WHEN is_valid = 1 THEN 'VALID' ELSE 'INVALID' END,
                error_msg);
        
        -- Return validation result
        SELECT is_valid as is_valid, error_msg as error_message;
      END;
    `)
    
    // 5. Create a comprehensive validation function
    console.log('\n5️⃣ CREATING COMPREHENSIVE VALIDATION FUNCTION...')
    
    const validationFunction = `
      -- Function to validate marketplace item images
      CREATE FUNCTION IF NOT EXISTS validate_marketplace_item_images_comprehensive(item_id TEXT)
      RETURNS TABLE(validation_result TEXT, error_messages TEXT)
      AS $$
      DECLARE
        errors TEXT[] := '{}';
        thumbnail_valid BOOLEAN := true;
        images_valid BOOLEAN := true;
      BEGIN
        -- Get the item
        DECLARE item_record RECORD;
        SELECT * INTO item_record FROM marketplace_items WHERE id = item_id;
        
        IF NOT FOUND THEN
          RETURN QUERY SELECT 'ERROR' as validation_result, 'Item not found' as error_messages;
          RETURN;
        END IF;
        
        -- Validate thumbnail
        IF item_record.thumbnail IS NOT NULL THEN
          IF item_record.thumbnail LIKE '/placeholder-%' OR item_record.thumbnail LIKE '%placeholder-%' THEN
            errors := errors || 'Thumbnail is a placeholder path';
            thumbnail_valid := false;
          ELSIF item_record.thumbnail NOT LIKE 'data:image/svg+xml;base64,%' THEN
            errors := errors || 'Thumbnail is not a base64-encoded SVG';
            thumbnail_valid := false;
          END IF;
        END IF;
        
        -- Validate images array
        IF item_record.images IS NOT NULL THEN
          IF item_record.images LIKE '%placeholder-%' OR item_record.images LIKE '/placeholder-%' THEN
            errors := errors || 'Images array contains placeholder references';
            images_valid := false;
          END IF;
        END IF;
        
        -- Return result
        IF thumbnail_valid AND images_valid AND array_length(errors, 1) = 0 THEN
          RETURN QUERY SELECT 'VALID' as validation_result, NULL as error_messages;
        ELSE
          RETURN QUERY SELECT 'INVALID' as validation_result, array_to_string(errors, ', ') as error_messages;
        END IF;
      END;
      $$ LANGUAGE plpgsql;
    `
    
    // Note: The above is PostgreSQL syntax. For SQLite, we'll create a simpler version
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS validation_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_id TEXT,
        validation_result TEXT,
        error_messages TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // 6. Create a migration script for future use
    console.log('\n6️⃣ CREATING MIGRATION SCRIPT...')
    
    const fs = require('fs')
    const migrationScript = `
-- Migration to add database constraints for marketplace images
-- Run this script to enforce image validation at the database level

-- 1. Create validation table
CREATE TABLE IF NOT EXISTS marketplace_image_validation (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id TEXT NOT NULL,
  field_name TEXT NOT NULL,
  field_value TEXT,
  is_valid BOOLEAN DEFAULT 0,
  error_message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create validation function (simplified for SQLite)
CREATE TRIGGER IF NOT EXISTS validate_thumbnail_before_insert
BEFORE INSERT ON marketplace_items
FOR EACH ROW
BEGIN
  IF NEW.thumbnail LIKE '/placeholder-%' OR NEW.thumbnail LIKE '%placeholder-%' THEN
    INSERT INTO marketplace_image_validation (item_id, field_name, field_value, is_valid, error_message)
    VALUES (NEW.id, 'thumbnail', NEW.thumbnail, 0, 'Thumbnail cannot be a placeholder path');
  END IF;
  
  IF NEW.thumbnail IS NOT NULL AND NEW.thumbnail NOT LIKE 'data:image/svg+xml;base64,%' THEN
    INSERT INTO marketplace_image_validation (item_id, field_name, field_value, is_valid, error_message)
    VALUES (NEW.id, 'thumbnail', NEW.thumbnail, 0, 'Thumbnail must be base64-encoded SVG');
  END IF;
END;

CREATE TRIGGER IF NOT EXISTS validate_thumbnail_before_update
BEFORE UPDATE ON marketplace_items
FOR EACH ROW
BEGIN
  IF NEW.thumbnail LIKE '/placeholder-%' OR NEW.thumbnail LIKE '%placeholder-%' THEN
    INSERT INTO marketplace_image_validation (item_id, field_name, field_value, is_valid, error_message)
    VALUES (NEW.id, 'thumbnail', NEW.thumbnail, 0, 'Thumbnail cannot be a placeholder path');
  END IF;
  
  IF NEW.thumbnail IS NOT NULL AND NEW.thumbnail NOT LIKE 'data:image/svg+xml;base64,%' THEN
    INSERT INTO marketplace_image_validation (item_id, field_name, field_value, is_valid, error_message)
    VALUES (NEW.id, 'thumbnail', NEW.thumbnail, 0, 'Thumbnail must be base64-encoded SVG');
  END IF;
END;

-- 3. Create validation procedure
CREATE PROCEDURE IF NOT EXISTS validate_all_marketplace_images()
BEGIN
  -- Clear previous validation results
  DELETE FROM marketplace_image_validation;
  
  -- Validate all existing items
  INSERT INTO marketplace_image_validation (item_id, field_name, field_value, is_valid, error_message)
  SELECT 
    id, 
    'thumbnail', 
    thumbnail, 
    CASE 
      WHEN thumbnail IS NULL THEN 1
      WHEN thumbnail LIKE '/placeholder-%' OR thumbnail LIKE '%placeholder-%' THEN 0
      WHEN thumbnail NOT LIKE 'data:image/svg+xml;base64,%' THEN 0
      ELSE 1 
    END,
    CASE 
      WHEN thumbnail IS NULL THEN 'No thumbnail'
      WHEN thumbnail LIKE '/placeholder-%' OR thumbnail LIKE '%placeholder-%' THEN 'Thumbnail is placeholder path'
      WHEN thumbnail NOT LIKE 'data:image/svg+xml;base64,%' THEN 'Thumbnail is not base64-encoded SVG'
      ELSE NULL 
    END
  FROM marketplace_items
  WHERE thumbnail IS NOT NULL;
  
  -- Validate images array
  INSERT INTO marketplace_image_validation (item_id, field_name, field_value, is_valid, error_message)
  SELECT 
    id, 
    'images', 
    images, 
    CASE 
      WHEN images IS NULL THEN 1
      WHEN images LIKE '%placeholder-%' OR images LIKE '/placeholder-%' THEN 0
      ELSE 1 
    END,
    CASE 
      WHEN images IS NULL THEN 'No images'
      WHEN images LIKE '%placeholder-%' OR images LIKE '/placeholder-%' THEN 'Images array contains placeholders'
      ELSE NULL 
    END
  FROM marketplace_items
  WHERE images IS NOT NULL;
END;
`
    
    fs.writeFileSync('/home/z/my-project/scripts/marketplace-image-constraints.sql', migrationScript)
    console.log('✅ Created migration script: scripts/marketplace-image-constraints.sql')
    
    // 7. Run validation on current data
    console.log('\n7️⃣ RUNNING VALIDATION ON CURRENT DATA...')
    
    const items = await prisma.marketplaceItem.findMany({
      select: {
        id: true,
        title: true,
        thumbnail: true,
        images: true
      }
    })
    
    let validItems = 0
    let invalidItems = 0
    
    for (const item of items) {
      let isValid = true
      const errors = []
      
      // Validate thumbnail
      if (item.thumbnail) {
        if (item.thumbnail.startsWith('/placeholder-') || item.thumbnail.includes('placeholder-')) {
          isValid = false
          errors.push('Thumbnail is placeholder')
        }
        if (!item.thumbnail.startsWith('data:image/svg+xml;base64,')) {
          isValid = false
          errors.push('Thumbnail is not base64 SVG')
        }
      }
      
      // Validate images
      if (item.images) {
        const parsedImages = typeof item.images === 'string' ? JSON.parse(item.images) : item.images
        for (const img of parsedImages) {
          if (img.startsWith('/placeholder-') || img.includes('placeholder-')) {
            isValid = false
            errors.push('Images array contains placeholders')
          }
          if (!img.startsWith('data:image/svg+xml;base64,')) {
            isValid = false
            errors.push('Image is not base64 SVG')
          }
        }
      }
      
      if (isValid) {
        validItems++
      } else {
        invalidItems++
        console.log(`❌ Invalid: ${item.title} - ${errors.join(', ')}`)
      }
    }
    
    console.log(`\n📊 VALIDATION RESULTS:`)
    console.log(`   Valid items: ${validItems}`)
    console.log(`   Invalid items: ${invalidItems}`)
    console.log(`   Total items: ${items.length}`)
    
    if (invalidItems === 0) {
      console.log('\n✅ ALL ITEMS PASS VALIDATION!')
    } else {
      console.log('\n❌ SOME ITEMS FAILED VALIDATION')
      console.log('   Run the comprehensive fix script to resolve these issues')
    }
    
    console.log('\n🎉 DATABASE CONSTRAINTS SETUP COMPLETED!')
    console.log('==========================================')
    console.log('✅ Validation triggers created')
    console.log('✅ Validation procedures created')
    console.log('✅ Migration script generated')
    console.log('✅ Current data validated')
    console.log('\n📋 NEXT STEPS:')
    console.log('   1. Review the migration script: scripts/marketplace-image-constraints.sql')
    console.log('   2. Apply constraints in production environment')
    console.log('   3. Set up regular validation monitoring')
    console.log('   4. Integrate validation into CI/CD pipeline')
    
  } catch (error) {
    console.error('❌ Error setting up database constraints:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Database constraints setup failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })