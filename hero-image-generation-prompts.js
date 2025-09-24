// Hero Image Generation Prompts for EDN Platform
// Following the detailed requirements for attention-grabbing, world-class headers

const HERO_IMAGE_PROMPTS = {
  // SFW PROMPTS
  sfw: {
    homepage: {
      prompt: `Three stunning hyper-realistic AI-generated female models aged 21-30 in a cozy bedroom with fairy lights and soft bedding, 2025 aesthetic. 
      Model 1: Vibrant red hair with fiery curls, wearing colorful Y2K-inspired bikini, charming smile, hands on hips, confident pose.
      Model 2: Sleek black straight hair, wearing elegant lace lingerie in subtle pastel colors, relaxed lean, natural makeup.
      Model 3: Voluminous blonde beachy waves, wearing stylish crop top and shorts, girl next door vibe, warm lighting.
      All models have large, sculpted fake breasts and flawless, voluptuous bodies. Pastel highlights, subtle retro-digital blur, soft natural lighting. 
      Kinetic typography: "Discover Glamour with EDN" with shimmer effects. Photorealistic, 8K, ultra-detailed, professional photography.`,
      negativePrompt: `unrealistic proportions, extra limbs, extra fingers, missing teeth, unnatural breast shapes, low-quality textures, blurry visuals, outdated attire, flat lighting, generic backgrounds, awkward poses, lifeless hair, unbalanced colors, rendering artifacts, sexually explicit content, cluttered composition`
    },
    
    dashboard: {
      prompt: `Three gorgeous hyper-realistic AI-generated female models aged 21-30 in a modern kitchen with sleek counters, 2025 aesthetic.
      Model 1: Vibrant red hair with fiery curls, wearing chic nurse scrubs (fitted), analyzing data on tablet, confident professional pose.
      Model 2: Sleek black tousled hair, wearing tailored blouse and pencil skirt (sexy office girl), pointing at analytics dashboard, intelligent expression.
      Model 3: Voluminous blonde beachy waves, wearing stylish athleisure, relaxed yet focused pose, holding coffee cup.
      All models have large, sculpted fake breasts and flawless, voluptuous bodies. Clean, modern environment with subtle tech elements. Pastel highlights, soft natural lighting.
      Kinetic typography: "Analytics Excellence with EDN" with morphing effects. Photorealistic, 8K, ultra-detailed, professional photography.`,
      negativePrompt: `unrealistic proportions, extra limbs, extra fingers, missing teeth, unnatural breast shapes, low-quality textures, blurry visuals, outdated attire, harsh lighting, generic backgrounds, awkward poses, lifeless hair, unbalanced colors, rendering artifacts, sexually explicit content, cluttered composition`
    },
    
    create: {
      prompt: `Three creative hyper-realistic AI-generated female models aged 21-30 in an urban loft with warm lighting and city views, 2025 aesthetic.
      Model 1: Vibrant red hair with fiery curls, wearing colorful artistic bikini, holding digital camera, dynamic creative pose.
      Model 2: Sleek black straight hair, wearing elegant lingerie with artistic elements, posing as if creating digital art, focused expression.
      Model 3: Voluminous blonde beachy waves, wearing stylish crop top and creative accessories, demonstrating AI tools, enthusiastic pose.
      All models have large, sculpted fake breasts and flawless, voluptuous bodies. Creative environment with art supplies and tech gadgets. Warm ambient lighting.
      Kinetic typography: "Create Magic with EDN" with shimmer effects. Photorealistic, 8K, ultra-detailed, professional photography.`,
      negativePrompt: `unrealistic proportions, extra limbs, extra fingers, missing teeth, unnatural breast shapes, low-quality textures, blurry visuals, outdated attire, harsh lighting, generic backgrounds, awkward poses, lifeless hair, unbalanced colors, rendering artifacts, sexually explicit content, cluttered composition`
    },
    
    marketplace: {
      prompt: `Three fashionable hyper-realistic AI-generated female models aged 21-30 in a rooftop garden with lush greenery and sunset glow, 2025 aesthetic.
      Model 1: Vibrant red hair with fiery curls, wearing high-end designer bikini, showcasing luxury items, confident model pose.
      Model 2: Sleek black tousled hair, wearing elegant lace lingerie, browsing premium content, sophisticated expression.
      Model 3: Voluminous blonde beachy waves, wearing stylish crop top and shorts, presenting marketplace items, charming smile.
      All models have large, sculpted fake breasts and flawless, voluptuous bodies. Luxury shopping environment with premium displays. Golden hour lighting.
      Kinetic typography: "Premium Gallery with EDN" with morphing effects. Photorealistic, 8K, ultra-detailed, professional photography.`,
      negativePrompt: `unrealistic proportions, extra limbs, extra fingers, missing teeth, unnatural breast shapes, low-quality textures, blurry visuals, outdated attire, harsh lighting, generic backgrounds, awkward poses, lifeless hair, unbalanced colors, rendering artifacts, sexually explicit content, cluttered composition`
    },
    
    distribute: {
      prompt: `Three connected hyper-realistic AI-generated female models aged 21-30 in a modern kitchen with sleek counters, 2025 aesthetic.
      Model 1: Vibrant red hair with fiery curls, wearing stylish bikini, managing multiple device screens, tech-savvy pose.
      Model 2: Sleek black straight hair, wearing tailored blouse and pencil skirt, coordinating content distribution, professional expression.
      Model 3: Voluminous blonde beachy waves, wearing casual chic outfit, sharing content across platforms, enthusiastic gesture.
      All models have large, sculpted fake breasts and flawless, voluptuous bodies. Modern tech environment with multiple screens and platforms. Clean, bright lighting.
      Kinetic typography: "Distribute Everywhere with EDN" with shimmer effects. Photorealistic, 8K, ultra-detailed, professional photography.`,
      negativePrompt: `unrealistic proportions, extra limbs, extra fingers, missing teeth, unnatural breast shapes, low-quality textures, blurry visuals, outdated attire, harsh lighting, generic backgrounds, awkward poses, lifeless hair, unbalanced colors, rendering artifacts, sexually explicit content, cluttered composition`
    },
    
    pricing: {
      prompt: `Three luxurious hyper-realistic AI-generated female models aged 21-30 in an urban loft with warm lighting and city views, 2025 aesthetic.
      Model 1: Vibrant red hair with fiery curls, wearing elegant premium bikini, presenting value propositions, confident pose.
      Model 2: Sleek black tousled hair, wearing sophisticated lingerie, showcasing premium features, refined expression.
      Model 3: Voluminous blonde beachy waves, wearing stylish upscale attire, demonstrating premium benefits, welcoming smile.
      All models have large, sculpted fake breasts and flawless, voluptuous bodies. Premium luxury environment with elegant decor. Warm, sophisticated lighting.
      Kinetic typography: "Premium Value with EDN" with morphing effects. Photorealistic, 8K, ultra-detailed, professional photography.`,
      negativePrompt: `unrealistic proportions, extra limbs, extra fingers, missing teeth, unnatural breast shapes, low-quality textures, blurry visuals, outdated attire, harsh lighting, generic backgrounds, awkward poses, lifeless hair, unbalanced colors, rendering artifacts, sexually explicit content, cluttered composition`
    }
  },
  
  // NSFW PROMPTS
  nsfw: {
    homepage: {
      prompt: `Three stunning hyper-realistic AI-generated female models aged 21-30 in a neon-lit bedroom with pink/cyan highlights and velvet drapes, 2025 aesthetic.
      Model 1: Vibrant red hair with fiery curls, wearing bold metallic micro-bikini, seductive arched back pose, sultry gaze.
      Model 2: Sleek black tousled hair, wearing revealing strappy dominatrix leather corset, bold dynamic pose, confident expression.
      Model 3: Voluminous blonde beachy waves, wearing sheer minimal lace thong, reclining seductive pose, alluring look.
      All models have large, sculpted fake breasts and flawless, voluptuous bodies. Moody neon environment with velvet textures. Bold neon highlights, grainy blur effect.
      Kinetic typography: "Unleash Desire with EDN" with intense shimmer effects. Photorealistic, 8K, ultra-detailed, professional photography.`,
      negativePrompt: `unrealistic proportions, extra limbs, extra fingers, missing teeth, unnatural breast shapes, low-quality textures, blurry visuals, outdated attire, harsh lighting, generic backgrounds, awkward poses, lifeless hair, unbalanced colors, rendering artifacts, explicit nudity, non-consensual themes, offensive content`
    },
    
    dashboard: {
      prompt: `Three alluring hyper-realistic AI-generated female models aged 21-30 in a sultry kitchen with dim lighting and sleek surfaces, 2025 aesthetic.
      Model 1: Vibrant red hair with fiery curls, wearing revealing nurse scrubs, seductively analyzing data on tablet, bold pose.
      Model 2: Sleek black straight hair, wearing unbuttoned blouse and micro-skirt (sexy office girl), seductively pointing at analytics, intense gaze.
      Model 3: Voluminous blonde beachy waves, wearing sheer crop top and micro-shorts, provocatively managing dashboard, sultry expression.
      All models have large, sculpted fake breasts and flawless, voluptuous bodies. Sensual tech environment with moody ambient lighting. Neon accents, grainy blur.
      Kinetic typography: "Seductive Analytics with EDN" with morphing effects. Photorealistic, 8K, ultra-detailed, professional photography.`,
      negativePrompt: `unrealistic proportions, extra limbs, extra fingers, missing teeth, unnatural breast shapes, low-quality textures, blurry visuals, outdated attire, harsh lighting, generic backgrounds, awkward poses, lifeless hair, unbalanced colors, rendering artifacts, explicit nudity, non-consensual themes, offensive content`
    },
    
    create: {
      prompt: `Three provocative hyper-realistic AI-generated female models aged 21-30 in a neon-lit creative space with pink/cyan highlights, 2025 aesthetic.
      Model 1: Vibrant red hair with fiery curls, wearing bold metallic micro-bikini, seductively handling camera equipment, dynamic pose.
      Model 2: Sleek black tousled hair, wearing revealing strappy dominatrix outfit, creating digital art with intense focus, bold expression.
      Model 3: Voluminous blonde beachy waves, wearing sheer minimal lingerie, provocatively demonstrating AI tools, sultry gaze.
      All models have large, sculpted fake breasts and flawless, voluptuous bodies. Edgy creative environment with neon lighting. Bold textures, grainy blur.
      Kinetic typography: "Create Desire with EDN" with shimmer effects. Photorealistic, 8K, ultra-detailed, professional photography.`,
      negativePrompt: `unrealistic proportions, extra limbs, extra fingers, missing teeth, unnatural breast shapes, low-quality textures, blurry visuals, outdated attire, harsh lighting, generic backgrounds, awkward poses, lifeless hair, unbalanced colors, rendering artifacts, explicit nudity, non-consensual themes, offensive content`
    },
    
    marketplace: {
      prompt: `Three enticing hyper-realistic AI-generated female models aged 21-30 in a moonlit garden with lush greenery, 2025 aesthetic.
      Model 1: Vibrant red hair with fiery curls, wearing bold print micro-bikini, seductively showcasing luxury items, arched back pose.
      Model 2: Sleek black straight hair, wearing revealing sheer lingerie, provocatively browsing premium content, intense gaze.
      Model 3: Voluminous blonde beachy waves, wearing sheer crop top and micro-shorts, alluringly presenting marketplace items, sultry expression.
      All models have large, sculpted fake breasts and flawless, voluptuous bodies. Moonlit luxury environment with sensual atmosphere. Neon highlights, grainy blur.
      Kinetic typography: "Seductive Gallery with EDN" with morphing effects. Photorealistic, 8K, ultra-detailed, professional photography.`,
      negativePrompt: `unrealistic proportions, extra limbs, extra fingers, missing teeth, unnatural breast shapes, low-quality textures, blurry visuals, outdated attire, harsh lighting, generic backgrounds, awkward poses, lifeless hair, unbalanced colors, rendering artifacts, explicit nudity, non-consensual themes, offensive content`
    },
    
    distribute: {
      prompt: `Three captivating hyper-realistic AI-generated female models aged 21-30 in a car interior with urban vibe and neon accents, 2025 aesthetic.
      Model 1: Vibrant red hair with fiery curls, wearing bold metallic micro-bikini, seductively managing multiple device screens, bold pose.
      Model 2: Sleek black tousled hair, wearing unbuttoned blouse and micro-skirt, provocatively coordinating content distribution, sultry gaze.
      Model 3: Voluminous blonde beachy waves, wearing sheer revealing outfit, alluringly sharing content across platforms, intense expression.
      All models have large, sculpted fake breasts and flawless, voluptuous bodies. Urban car environment with neon lighting. Bold textures, grainy blur.
      Kinetic typography: "Seductive Distribution with EDN" with shimmer effects. Photorealistic, 8K, ultra-detailed, professional photography.`,
      negativePrompt: `unrealistic proportions, extra limbs, extra fingers, missing teeth, unnatural breast shapes, low-quality textures, blurry visuals, outdated attire, harsh lighting, generic backgrounds, awkward poses, lifeless hair, unbalanced colors, rendering artifacts, explicit nudity, non-consensual themes, offensive content`
    },
    
    pricing: {
      prompt: `Three luxurious hyper-realistic AI-generated female models aged 21-30 in a neon-lit bedroom with velvet drapes and urban views, 2025 aesthetic.
      Model 1: Vibrant red hair with fiery curls, wearing bold metallic premium micro-bikini, seductively presenting value propositions, arched back pose.
      Model 2: Sleek black straight hair, wearing revealing strappy dominatrix outfit, provocatively showcasing premium features, intense gaze.
      Model 3: Voluminous blonde beachy waves, wearing sheer minimal lingerie, alluringly demonstrating premium benefits, sultry expression.
      All models have large, sculpted fake breasts and flawless, voluptuous bodies. Luxury neon environment with velvet textures. Bold neon highlights, grainy blur.
      Kinetic typography: "Seductive Value with EDN" with morphing effects. Photorealistic, 8K, ultra-detailed, professional photography.`,
      negativePrompt: `unrealistic proportions, extra limbs, extra fingers, missing teeth, unnatural breast shapes, low-quality textures, blurry visuals, outdated attire, harsh lighting, generic backgrounds, awkward poses, lifeless hair, unbalanced colors, rendering artifacts, explicit nudity, non-consensual themes, offensive content`
    }
  }
};

// Image generation settings
const GENERATION_SETTINGS = {
  width: 1920,
  height: 1080,
  steps: 50,
  cfg_scale: 7.5,
  seed: -1,
  style: "photorealistic",
  quality: "ultra_hd"
};

// Function to generate all hero images
async function generateAllHeroImages() {
  const pages = ['homepage', 'dashboard', 'create', 'marketplace', 'distribute', 'pricing'];
  const modes = ['sfw', 'nsfw'];
  
  for (const mode of modes) {
    for (const page of pages) {
      const promptData = HERO_IMAGE_PROMPTS[mode][page];
      const outputPath = `/home/z/my-project/public/hero-${page}-${mode}.jpg`;
      
      console.log(`Generating ${mode} ${page} hero image...`);
      
      try {
        // Use the z-ai-web-dev-sdk to generate images
        const ZAI = require('z-ai-web-dev-sdk');
        const zai = await ZAI.create();
        
        const response = await zai.images.generations.create({
          prompt: promptData.prompt,
          negative_prompt: promptData.negativePrompt,
          width: GENERATION_SETTINGS.width,
          height: GENERATION_SETTINGS.height,
          steps: GENERATION_SETTINGS.steps,
          cfg_scale: GENERATION_SETTINGS.cfg_scale,
          seed: GENERATION_SETTINGS.seed,
          style: GENERATION_SETTINGS.style,
          quality: GENERATION_SETTINGS.quality
        });
        
        // Save the generated image
        const imageBase64 = response.data[0].base64;
        const fs = require('fs');
        fs.writeFileSync(outputPath, imageBase64, 'base64');
        
        console.log(`✓ Generated ${mode} ${page} hero image: ${outputPath}`);
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`✗ Failed to generate ${mode} ${page} hero image:`, error.message);
      }
    }
  }
}

// Export for use in other scripts
module.exports = {
  HERO_IMAGE_PROMPTS,
  GENERATION_SETTINGS,
  generateAllHeroImages
};

// If run directly, execute generation
if (require.main === module) {
  generateAllHeroImages();
}