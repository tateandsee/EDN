import { db } from './src/lib/db';

async function checkListings() {
  const listings = await db.marketplaceListing.findMany({
    where: { type: 'NSFW' },
    take: 5,
    select: { id: true, title: true, prompt: true }
  });
  console.log(JSON.stringify(listings, null, 2));
}

checkListings().catch(console.error);