import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// High-quality placeholder image URLs for each model
const sfwImageUrls = [
  {
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1544723795-3fb53e6b3e3d?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1544723795-3fb53e6b3e3d?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544723795-3fb53e6b3e3d?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face'
    ]
  }
]

// NSFW image URLs (using more sophisticated portrait photography)
const nsfwImageUrls = [
  {
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face'
    ]
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face'
    ]
  }
]

async function main() {
  console.log('🖼️  Assigning placeholder images to marketplace items...')

  try {
    // Get all marketplace items
    const items = await prisma.marketplaceItem.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'asc' }
    })

    console.log(`📦 Found ${items.length} marketplace items`)

    // Separate SFW and NSFW items
    const sfwItems = items.filter(item => !item.isNsfw)
    const nsfwItems = items.filter(item => item.isNsfw)

    console.log(`📊 SFW Items: ${sfwItems.length}`)
    console.log(`📊 NSFW Items: ${nsfwItems.length}`)

    // Update SFW items
    for (let i = 0; i < sfwItems.length; i++) {
      const item = sfwItems[i]
      const imageData = sfwImageUrls[i % sfwImageUrls.length]
      
      console.log(`🎯 Updating SFW item ${i + 1}/${sfwItems.length}: ${item.title}`)
      
      await prisma.marketplaceItem.update({
        where: { id: item.id },
        data: {
          thumbnail: imageData.thumbnail,
          images: JSON.stringify(imageData.images)
        }
      })
    }

    // Update NSFW items
    for (let i = 0; i < nsfwItems.length; i++) {
      const item = nsfwItems[i]
      const imageData = nsfwImageUrls[i % nsfwImageUrls.length]
      
      console.log(`🎯 Updating NSFW item ${i + 1}/${nsfwItems.length}: ${item.title}`)
      
      await prisma.marketplaceItem.update({
        where: { id: item.id },
        data: {
          thumbnail: imageData.thumbnail,
          images: JSON.stringify(imageData.images)
        }
      })
    }

    console.log('\n✅ All marketplace images updated successfully!')

    // Verify the updates
    const sampleItems = await prisma.marketplaceItem.findMany({
      where: { status: 'ACTIVE' },
      take: 5
    })

    console.log('\n📝 Sample Updated Items:')
    sampleItems.forEach((item, index) => {
      console.log(`\n${index + 1}. ${item.title}`)
      console.log(`   Thumbnail: ${item.thumbnail}`)
      try {
        const images = JSON.parse(item.images || '[]')
        console.log(`   Images: ${images.length} images`)
        images.forEach((img: string, idx: number) => {
          console.log(`     ${idx + 1}. ${img}`)
        })
      } catch (e) {
        console.log(`   Images: Error parsing images`)
      }
    })

  } catch (error) {
    console.error('❌ Error assigning placeholder images:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Error assigning placeholder images:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })