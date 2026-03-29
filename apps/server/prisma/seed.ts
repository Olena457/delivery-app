import { PrismaClient, Category, Shop } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.user.deleteMany();

  const categoriesData = [
    { name: 'Main Dishes', search: 'food,dinner,meat' },
    { name: 'Desserts', search: 'cake,sweet,dessert' },
    { name: 'Drinks', search: 'beverage,drink,coffee' },
  ];

  const categories: (Category & { search: string })[] = [];

  for (const cat of categoriesData) {
    const createdCat = await prisma.category.create({
      data: { name: cat.name },
    });
    categories.push({ ...createdCat, search: cat.search });
  }

  const shops: Shop[] = [];
  for (let i = 0; i < 5; i++) {
    const randomRating = faker.number.float({
      min: 1,
      max: 5,
      fractionDigits: 1,
    });
    const shop = await prisma.shop.create({
      data: {
        name: faker.company.name() + ' Kitchen',
        description: faker.commerce.productDescription(),
        rating: randomRating,
      },
    });
    shops.push(shop);
  }

  for (const shop of shops) {
    console.log(`Adding products and reviews to: ${shop.name}`);

    const reviewCount = faker.number.int({ min: 3, max: 8 });
    for (let r = 0; r < reviewCount; r++) {
      await prisma.review.create({
        data: {
          rating: faker.number.int({ min: 1, max: 5 }),
          shopId: shop.id,
        },
      });
    }

    for (let j = 0; j < 45; j++) {
      const category = categories[j % categories.length];

      let title = 'Delicious Item';
      if (category.name === 'Main Dishes') {
        title = faker.commerce.productName();
      } else if (category.name === 'Desserts') {
        title = faker.commerce.product() + ' Cake';
      } else if (category.name === 'Drinks') {
        title = faker.commerce.product() + ' Juice';
      }

      const imageUrl =
        j % 25 === 0
          ? null
          : `https://loremflickr.com/320/240/${category.search.split(',')[0]}?lock=${faker.number.int(1000)}`;

      await prisma.product.create({
        data: {
          title,
          price: parseFloat(faker.commerce.price({ min: 150, max: 850 })),
          image: imageUrl,
          shopId: shop.id,
          categoryId: category.id,
        },
      });
    }
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
