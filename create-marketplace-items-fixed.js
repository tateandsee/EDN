const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Define the marketplace items to create
const marketplaceItems = [
  // SFW Items - Caucasian
  {
    title: "Professional Caucasian Executive - Business Attire",
    description: "A sophisticated Caucasian business executive in professional attire, perfect for corporate presentations and business-related content.",
    type: "AI_MODEL",
    category: "SFW",
    price: 95,
    isNsfw: false,
    ethnicity: "Caucasian",
    hairColor: "Dark",
    eyeColor: "Blue",
    positivePrompt: "Professional Caucasian business executive, age 18-25, wearing tailored business suit, perfect anatomy, flawless hands and fingers, corporate setting, professional lighting, photorealistic, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Caucasian Fitness Model - Athletic Build",
    description: "A fit Caucasian fitness model with athletic build, ideal for health and wellness content, sportswear promotions, and fitness-related projects.",
    type: "AI_MODEL", 
    category: "SFW",
    price: 88,
    isNsfw: false,
    ethnicity: "Caucasian",
    hairColor: "Blond",
    eyeColor: "Green",
    positivePrompt: "Athletic Caucasian fitness model, age 18-25, toned physique, sportswear, gym setting, perfect anatomy, flawless hands and fingers, fitness photography, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Caucasian Fashion Model - High Fashion",
    description: "A stunning Caucasian fashion model showcasing high fashion, perfect for luxury brand campaigns, fashion magazines, and style-related content.",
    type: "AI_MODEL",
    category: "SFW", 
    price: 118,
    isNsfw: false,
    ethnicity: "Caucasian",
    hairColor: "Red",
    eyeColor: "Brown",
    positivePrompt: "High fashion Caucasian model, age 18-25, designer clothing, runway pose, perfect anatomy, flawless hands and fingers, fashion photography, studio lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Caucasian Student - Casual Style",
    description: "A relatable Caucasian student in casual attire, perfect for educational content, youth marketing, and lifestyle projects.",
    type: "AI_MODEL",
    category: "SFW",
    price: 72,
    isNsfw: false,
    ethnicity: "Caucasian", 
    hairColor: "Blond",
    eyeColor: "Blue",
    positivePrompt: "Casual Caucasian student, age 18-25, everyday clothing, university setting, perfect anatomy, flawless hands and fingers, lifestyle photography, natural lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Caucasian Artist - Creative Studio",
    description: "A creative Caucasian artist in studio environment, perfect for art-related content, creative projects, and inspirational materials.",
    type: "AI_MODEL",
    category: "SFW",
    price: 85,
    isNsfw: false,
    ethnicity: "Caucasian",
    hairColor: "Dark", 
    eyeColor: "Green",
    positivePrompt: "Creative Caucasian artist, age 18-25, art studio, creative environment, perfect anatomy, flawless hands and fingers, artistic photography, soft lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  
  // SFW Items - Asian
  {
    title: "Asian Technology Professional - Modern Office",
    description: "A professional Asian technology expert in modern office setting, perfect for tech content, corporate presentations, and innovation projects.",
    type: "AI_MODEL",
    category: "SFW",
    price: 92,
    isNsfw: false,
    ethnicity: "Asian",
    hairColor: "Dark",
    eyeColor: "Brown",
    positivePrompt: "Professional Asian technology expert, age 18-25, modern office, tech environment, perfect anatomy, flawless hands and fingers, corporate photography, clean lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Asian Fashion Influencer - Street Style",
    description: "A trendy Asian fashion influencer showcasing street style, perfect for fashion content, social media campaigns, and youth culture projects.",
    type: "AI_MODEL",
    category: "SFW",
    price: 105,
    isNsfw: false,
    ethnicity: "Asian",
    hairColor: "Dark",
    eyeColor: "Brown",
    positivePrompt: "Trendy Asian fashion influencer, age 18-25, street style fashion, urban setting, perfect anatomy, flawless hands and fingers, fashion photography, natural lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Asian Medical Student - Academic Setting",
    description: "A dedicated Asian medical student in academic setting, perfect for educational content, healthcare marketing, and professional development materials.",
    type: "AI_MODEL",
    category: "SFW",
    price: 78,
    isNsfw: false,
    ethnicity: "Asian",
    hairColor: "Dark",
    eyeColor: "Brown",
    positivePrompt: "Dedicated Asian medical student, age 18-25, academic setting, laboratory environment, perfect anatomy, flawless hands and fingers, professional photography, bright lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Asian Musician - Performance Setting",
    description: "A talented Asian musician in performance setting, perfect for music content, entertainment projects, and cultural materials.",
    type: "AI_MODEL",
    category: "SFW",
    price: 96,
    isNsfw: false,
    ethnicity: "Asian",
    hairColor: "Dark",
    eyeColor: "Brown",
    positivePrompt: "Talented Asian musician, age 18-25, performance setting, musical instrument, perfect anatomy, flawless hands and fingers, performance photography, stage lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Asian Chef - Culinary Environment",
    description: "A skilled Asian chef in culinary environment, perfect for food content, cooking shows, and restaurant marketing materials.",
    type: "AI_MODEL",
    category: "SFW",
    price: 82,
    isNsfw: false,
    ethnicity: "Asian",
    hairColor: "Dark",
    eyeColor: "Brown",
    positivePrompt: "Skilled Asian chef, age 18-25, kitchen environment, culinary setting, perfect anatomy, flawless hands and fingers, food photography, warm lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  
  // SFW Items - Mixed Race
  {
    title: "Mixed Race Entrepreneur - Startup Environment",
    description: "An innovative mixed race entrepreneur in startup environment, perfect for business content, innovation projects, and entrepreneurial materials.",
    type: "AI_MODEL",
    category: "SFW",
    price: 98,
    isNsfw: false,
    ethnicity: "Mixed Race",
    hairColor: "Dark",
    eyeColor: "Green",
    positivePrompt: "Innovative mixed race entrepreneur, age 18-25, startup environment, business setting, perfect anatomy, flawless hands and fingers, corporate photography, modern lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Mixed Race Athlete - Sports Setting",
    description: "A dynamic mixed race athlete in sports setting, perfect for fitness content, athletic campaigns, and motivational materials.",
    type: "AI_MODEL",
    category: "SFW",
    price: 89,
    isNsfw: false,
    ethnicity: "Mixed Race",
    hairColor: "Dark",
    eyeColor: "Brown",
    positivePrompt: "Dynamic mixed race athlete, age 18-25, sports setting, athletic environment, perfect anatomy, flawless hands and fingers, sports photography, action lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Mixed Race Creative Designer - Studio Space",
    description: "A creative mixed race designer in studio space, perfect for design content, creative projects, and artistic materials.",
    type: "AI_MODEL",
    category: "SFW",
    price: 94,
    isNsfw: false,
    ethnicity: "Mixed Race",
    hairColor: "Blond",
    eyeColor: "Blue",
    positivePrompt: "Creative mixed race designer, age 18-25, design studio, creative space, perfect anatomy, flawless hands and fingers, design photography, studio lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Mixed Race Teacher - Educational Setting",
    description: "A dedicated mixed race teacher in educational setting, perfect for academic content, educational projects, and learning materials.",
    type: "AI_MODEL",
    category: "SFW",
    price: 76,
    isNsfw: false,
    ethnicity: "Mixed Race",
    hairColor: "Dark",
    eyeColor: "Green",
    positivePrompt: "Dedicated mixed race teacher, age 18-25, educational setting, classroom environment, perfect anatomy, flawless hands and fingers, educational photography, natural lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Mixed Race Environmental Scientist - Field Work",
    description: "A passionate mixed race environmental scientist in field work setting, perfect for science content, environmental projects, and research materials.",
    type: "AI_MODEL",
    category: "SFW",
    price: 87,
    isNsfw: false,
    ethnicity: "Mixed Race",
    hairColor: "Dark",
    eyeColor: "Brown",
    positivePrompt: "Passionate mixed race environmental scientist, age 18-25, field work setting, natural environment, perfect anatomy, flawless hands and fingers, scientific photography, outdoor lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  
  // SFW Items - Persian
  {
    title: "Persian Architect - Modern Design",
    description: "A sophisticated Persian architect showcasing modern design, perfect for architecture content, design projects, and professional materials.",
    type: "AI_MODEL",
    category: "SFW",
    price: 102,
    isNsfw: false,
    ethnicity: "Persian",
    hairColor: "Dark",
    eyeColor: "Brown",
    positivePrompt: "Sophisticated Persian architect, age 18-25, modern design, architectural setting, perfect anatomy, flawless hands and fingers, professional photography, clean lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Persian Fashion Designer - Creative Studio",
    description: "A talented Persian fashion designer in creative studio, perfect for fashion content, design projects, and creative materials.",
    type: "AI_MODEL",
    category: "SFW",
    price: 108,
    isNsfw: false,
    ethnicity: "Persian",
    hairColor: "Dark",
    eyeColor: "Green",
    positivePrompt: "Talented Persian fashion designer, age 18-25, creative studio, fashion setting, perfect anatomy, flawless hands and fingers, fashion photography, artistic lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Persian Medical Professional - Healthcare Setting",
    description: "A compassionate Persian medical professional in healthcare setting, perfect for medical content, healthcare projects, and professional materials.",
    type: "AI_MODEL",
    category: "SFW",
    price: 95,
    isNsfw: false,
    ethnicity: "Persian",
    hairColor: "Dark",
    eyeColor: "Brown",
    positivePrompt: "Compassionate Persian medical professional, age 18-25, healthcare setting, medical environment, perfect anatomy, flawless hands and fingers, medical photography, clinical lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Persian Artist - Traditional Art",
    description: "A skilled Persian artist creating traditional art, perfect for cultural content, artistic projects, and heritage materials.",
    type: "AI_MODEL",
    category: "SFW",
    price: 91,
    isNsfw: false,
    ethnicity: "Persian",
    hairColor: "Dark",
    eyeColor: "Brown",
    positivePrompt: "Skilled Persian artist, age 18-25, traditional art, cultural setting, perfect anatomy, flawless hands and fingers, artistic photography, warm lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Persian Engineer - Technical Environment",
    description: "A brilliant Persian engineer in technical environment, perfect for engineering content, technical projects, and innovation materials.",
    type: "AI_MODEL",
    category: "SFW",
    price: 99,
    isNsfw: false,
    ethnicity: "Persian",
    hairColor: "Dark",
    eyeColor: "Green",
    positivePrompt: "Brilliant Persian engineer, age 18-25, technical environment, engineering setting, perfect anatomy, flawless hands and fingers, technical photography, industrial lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  
  // NSFW Items - Caucasian
  {
    title: "Caucasian Boudoir Model - Elegant Lingerie",
    description: "An elegant Caucasian boudoir model in sophisticated lingerie, perfect for artistic nude photography, intimate content, and premium adult materials.",
    type: "AI_MODEL",
    category: "NSFW",
    price: 225,
    isNsfw: true,
    ethnicity: "Caucasian",
    hairColor: "Blond",
    eyeColor: "Blue",
    positivePrompt: "Elegant Caucasian boudoir model, age 18-25, sophisticated lingerie, intimate setting, perfect anatomy, flawless hands and fingers, artistic nude photography, soft lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Caucasian Artistic Nude - Classical Pose",
    description: "A classical Caucasian artistic nude in traditional pose, perfect for fine art photography, artistic expression, and sophisticated adult content.",
    type: "AI_MODEL",
    category: "NSFW",
    price: 275,
    isNsfw: true,
    ethnicity: "Caucasian",
    hairColor: "Red",
    eyeColor: "Green",
    positivePrompt: "Classical Caucasian artistic nude, age 18-25, traditional pose, artistic setting, perfect anatomy, flawless hands and fingers, fine art photography, dramatic lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Caucasian Intimate Portrait - Sensual Mood",
    description: "A sensual Caucasian intimate portrait with artistic mood, perfect for romantic content, intimate photography, and emotional adult materials.",
    type: "AI_MODEL",
    category: "NSFW",
    price: 195,
    isNsfw: true,
    ethnicity: "Caucasian",
    hairColor: "Dark",
    eyeColor: "Brown",
    positivePrompt: "Sensual Caucasian intimate portrait, age 18-25, artistic mood, intimate setting, perfect anatomy, flawless hands and fingers, artistic photography, mood lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Caucasian Fantasy Art - Mythical Theme",
    description: "A mystical Caucasian fantasy art with mythical theme, perfect for fantasy content, artistic expression, and imaginative adult materials.",
    type: "AI_MODEL",
    category: "NSFW",
    price: 245,
    isNsfw: true,
    ethnicity: "Caucasian",
    hairColor: "Blond",
    eyeColor: "Blue",
    positivePrompt: "Mystical Caucasian fantasy art, age 18-25, mythical theme, fantasy setting, perfect anatomy, flawless hands and fingers, fantasy photography, ethereal lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Caucasian Luxury Lingerie - High Fashion",
    description: "A luxurious Caucasian lingerie model in high fashion setting, perfect for premium adult content, fashion photography, and sophisticated materials.",
    type: "AI_MODEL",
    category: "NSFW",
    price: 285,
    isNsfw: true,
    ethnicity: "Caucasian",
    hairColor: "Red",
    eyeColor: "Green",
    positivePrompt: "Luxurious Caucasian lingerie model, age 18-25, high fashion setting, premium environment, perfect anatomy, flawless hands and fingers, fashion photography, elegant lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  
  // NSFW Items - Asian
  {
    title: "Asian Artistic Nude - Traditional Style",
    description: "A traditional Asian artistic nude with cultural elements, perfect for artistic photography, cultural expression, and sophisticated adult content.",
    type: "AI_MODEL",
    category: "NSFW",
    price: 255,
    isNsfw: true,
    ethnicity: "Asian",
    hairColor: "Dark",
    eyeColor: "Brown",
    positivePrompt: "Traditional Asian artistic nude, age 18-25, cultural elements, artistic setting, perfect anatomy, flawless hands and fingers, cultural photography, soft lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Asian Intimate Boudoir - Elegant Setting",
    description: "An elegant Asian intimate boudoir in sophisticated setting, perfect for romantic content, intimate photography, and artistic adult materials.",
    type: "AI_MODEL",
    category: "NSFW",
    price: 215,
    isNsfw: true,
    ethnicity: "Asian",
    hairColor: "Dark",
    eyeColor: "Brown",
    positivePrompt: "Elegant Asian intimate boudoir, age 18-25, sophisticated setting, intimate environment, perfect anatomy, flawless hands and fingers, artistic photography, warm lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Asian Fantasy Art - Mystical Theme",
    description: "A mystical Asian fantasy art with traditional elements, perfect for fantasy content, artistic expression, and imaginative adult materials.",
    type: "AI_MODEL",
    category: "NSFW",
    price: 235,
    isNsfw: true,
    ethnicity: "Asian",
    hairColor: "Dark",
    eyeColor: "Brown",
    positivePrompt: "Mystical Asian fantasy art, age 18-25, traditional elements, fantasy setting, perfect anatomy, flawless hands and fingers, fantasy photography, ethereal lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Asian Sensual Portrait - Artistic Mood",
    description: "An artistic Asian sensual portrait with creative mood, perfect for romantic content, intimate photography, and emotional adult materials.",
    type: "AI_MODEL",
    category: "NSFW",
    price: 205,
    isNsfw: true,
    ethnicity: "Asian",
    hairColor: "Dark",
    eyeColor: "Brown",
    positivePrompt: "Artistic Asian sensual portrait, age 18-25, creative mood, intimate setting, perfect anatomy, flawless hands and fingers, artistic photography, mood lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Asian Luxury Lingerie - Modern Style",
    description: "A modern Asian luxury lingerie model in contemporary setting, perfect for premium adult content, fashion photography, and sophisticated materials.",
    type: "AI_MODEL",
    category: "NSFW",
    price: 265,
    isNsfw: true,
    ethnicity: "Asian",
    hairColor: "Dark",
    eyeColor: "Brown",
    positivePrompt: "Modern Asian luxury lingerie model, age 18-25, contemporary setting, premium environment, perfect anatomy, flawless hands and fingers, fashion photography, elegant lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  
  // NSFW Items - Mixed Race
  {
    title: "Mixed Race Artistic Nude - Contemporary Style",
    description: "A contemporary mixed race artistic nude with modern elements, perfect for artistic photography, cultural expression, and sophisticated adult content.",
    type: "AI_MODEL",
    category: "NSFW",
    price: 245,
    isNsfw: true,
    ethnicity: "Mixed Race",
    hairColor: "Dark",
    eyeColor: "Green",
    positivePrompt: "Contemporary mixed race artistic nude, age 18-25, modern elements, artistic setting, perfect anatomy, flawless hands and fingers, artistic photography, dramatic lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Mixed Race Intimate Boudoir - Elegant Style",
    description: "An elegant mixed race intimate boudoir in sophisticated setting, perfect for romantic content, intimate photography, and artistic adult materials.",
    type: "AI_MODEL",
    category: "NSFW",
    price: 225,
    isNsfw: true,
    ethnicity: "Mixed Race",
    hairColor: "Blond",
    eyeColor: "Blue",
    positivePrompt: "Elegant mixed race intimate boudoir, age 18-25, sophisticated setting, intimate environment, perfect anatomy, flawless hands and fingers, artistic photography, soft lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Mixed Race Fantasy Art - Cultural Fusion",
    description: "A unique mixed race fantasy art with cultural fusion, perfect for fantasy content, artistic expression, and imaginative adult materials.",
    type: "AI_MODEL",
    category: "NSFW",
    price: 255,
    isNsfw: true,
    ethnicity: "Mixed Race",
    hairColor: "Dark",
    eyeColor: "Brown",
    positivePrompt: "Unique mixed race fantasy art, age 18-25, cultural fusion, fantasy setting, perfect anatomy, flawless hands and fingers, fantasy photography, mystical lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Mixed Race Sensual Portrait - Artistic Vision",
    description: "An artistic mixed race sensual portrait with creative vision, perfect for romantic content, intimate photography, and emotional adult materials.",
    type: "AI_MODEL",
    category: "NSFW",
    price: 215,
    isNsfw: true,
    ethnicity: "Mixed Race",
    hairColor: "Red",
    eyeColor: "Green",
    positivePrompt: "Artistic mixed race sensual portrait, age 18-25, creative vision, intimate setting, perfect anatomy, flawless hands and fingers, artistic photography, mood lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Mixed Race Luxury Lingerie - High Fashion",
    description: "A luxurious mixed race lingerie model in high fashion setting, perfect for premium adult content, fashion photography, and sophisticated materials.",
    type: "AI_MODEL",
    category: "NSFW",
    price: 275,
    isNsfw: true,
    ethnicity: "Mixed Race",
    hairColor: "Dark",
    eyeColor: "Blue",
    positivePrompt: "Luxurious mixed race lingerie model, age 18-25, high fashion setting, premium environment, perfect anatomy, flawless hands and fingers, fashion photography, elegant lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  
  // NSFW Items - Persian
  {
    title: "Persian Artistic Nude - Classical Elegance",
    description: "A classical Persian artistic nude with traditional elegance, perfect for artistic photography, cultural expression, and sophisticated adult content.",
    type: "AI_MODEL",
    category: "NSFW",
    price: 265,
    isNsfw: true,
    ethnicity: "Persian",
    hairColor: "Dark",
    eyeColor: "Brown",
    positivePrompt: "Classical Persian artistic nude, age 18-25, traditional elegance, artistic setting, perfect anatomy, flawless hands and fingers, artistic photography, classical lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Persian Intimate Boudoir - Royal Setting",
    description: "A royal Persian intimate boudoir in luxurious setting, perfect for romantic content, intimate photography, and artistic adult materials.",
    type: "AI_MODEL",
    category: "NSFW",
    price: 235,
    isNsfw: true,
    ethnicity: "Persian",
    hairColor: "Dark",
    eyeColor: "Green",
    positivePrompt: "Royal Persian intimate boudoir, age 18-25, luxurious setting, intimate environment, perfect anatomy, flawless hands and fingers, artistic photography, opulent lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Persian Fantasy Art - Mythical Beauty",
    description: "A mythical Persian fantasy art with ancient beauty, perfect for fantasy content, artistic expression, and imaginative adult materials.",
    type: "AI_MODEL",
    category: "NSFW",
    price: 275,
    isNsfw: true,
    ethnicity: "Persian",
    hairColor: "Dark",
    eyeColor: "Brown",
    positivePrompt: "Mythical Persian fantasy art, age 18-25, ancient beauty, fantasy setting, perfect anatomy, flawless hands and fingers, fantasy photography, mystical lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Persian Sensual Portrait - Exotic Mood",
    description: "An exotic Persian sensual portrait with artistic mood, perfect for romantic content, intimate photography, and emotional adult materials.",
    type: "AI_MODEL",
    category: "NSFW",
    price: 225,
    isNsfw: true,
    ethnicity: "Persian",
    hairColor: "Dark",
    eyeColor: "Green",
    positivePrompt: "Exotic Persian sensual portrait, age 18-25, artistic mood, intimate setting, perfect anatomy, flawless hands and fingers, artistic photography, mood lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Persian Luxury Lingerie - Palace Style",
    description: "A palatial Persian luxury lingerie model in royal setting, perfect for premium adult content, fashion photography, and sophisticated materials.",
    type: "AI_MODEL",
    category: "NSFW",
    price: 295,
    isNsfw: true,
    ethnicity: "Persian",
    hairColor: "Dark",
    eyeColor: "Brown",
    positivePrompt: "Palatial Persian luxury lingerie model, age 18-25, royal setting, premium environment, perfect anatomy, flawless hands and fingers, fashion photography, royal lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  }
]

async function createMarketplaceItems() {
  try {
    console.log('Creating 50 marketplace items...')
    
    // Get a default user ID (you might need to create one first)
    const defaultUser = await prisma.user.findFirst()
    if (!defaultUser) {
      console.log('No user found. Creating a default user...')
      const newUser = await prisma.user.create({
        data: {
          email: 'marketplace@edn.com',
          name: 'EDN Marketplace',
          role: 'CREATOR'
        }
      })
      console.log('Created default user:', newUser.id)
    }
    
    const user = await prisma.user.findFirst()
    const userId = user.id
    
    let createdCount = 0
    
    for (const itemData of marketplaceItems) {
      try {
        // Create placeholder thumbnail URL
        const thumbnailUrl = `/placeholder-${itemData.ethnicity.toLowerCase().replace(' ', '-')}-${itemData.category.toLowerCase()}.jpg`
        
        // Create marketplace item
        const item = await prisma.marketplaceItem.create({
          data: {
            title: itemData.title,
            description: itemData.description,
            type: itemData.type,
            category: itemData.category,
            price: itemData.price,
            currency: 'USD',
            thumbnail: thumbnailUrl,
            images: JSON.stringify([thumbnailUrl]),
            tags: JSON.stringify([
              itemData.ethnicity,
              itemData.hairColor,
              itemData.eyeColor,
              itemData.category
            ]),
            isNsfw: itemData.isNsfw,
            userId: userId,
            positivePrompt: itemData.positivePrompt,
            negativePrompt: itemData.negativePrompt,
            fullPrompt: `${itemData.positivePrompt} ${itemData.negativePrompt}`
          }
        })
        
        console.log(`Created item ${createdCount + 1}: ${item.title}`)
        createdCount++
        
      } catch (error) {
        console.error(`Error creating item ${itemData.title}:`, error)
        // Continue with next item even if one fails
      }
    }
    
    console.log(`\nSuccessfully created ${createdCount} marketplace items`)
    
    // Verify total count
    const totalItems = await prisma.marketplaceItem.count()
    console.log(`Total marketplace items in database: ${totalItems}`)
    
    await prisma.$disconnect()
  } catch (error) {
    console.error('Error:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

createMarketplaceItems()