import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string) {
  return createHash("sha256").update(`almadinah:${password}`).digest("hex");
}

const hoursJson = JSON.stringify({
  monday: "11:00 AM – 12:00 AM",
  tuesday: "11:00 AM – 12:00 AM",
  wednesday: "11:00 AM – 12:00 AM",
  thursday: "11:00 AM – 12:00 AM",
  friday: "11:00 AM – 12:00 AM",
  saturday: "11:00 AM – 12:00 AM",
  sunday: "11:00 AM – 12:00 AM",
});

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.ledgerEntry.deleteMany();
  await prisma.stockMove.deleteMany();
  await prisma.order.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.storeSettings.deleteMany();

  await prisma.storeSettings.create({
    data: {
      id: "store",
      name: "Al Madinah Pakwan and Sheermal House",
      googleListingName: "Al Madina Pakwan And Sheermaal Center",
      tagline: "Fresh sheermal, pakwan trays, and home-style Karachi flavors from Gulistan-e-Johar.",
      description:
        "A neighborhood Pakistani restaurant and bakery known for soft sheermal, tandoori roti, rich korma, biryani, and catering-ready pakwan. Visit us at A-35, Block 4 / Block 3 Gulistan-e-Johar — cash payments welcome for pickup and delivery.",
      address: "A-35, Block 4 Block 3 Gulistan-e-Johar",
      city: "Karachi",
      postalCode: "75500",
      country: "Pakistan",
      phone: "+92 310 7784620",
      email: "orders@almadinah.pk",
      plusCode: "W4HM+HJ Gulistan-e-Johar, Karachi",
      latitude: 24.9288794,
      longitude: 67.1340984,
      googleMapsUrl:
        "https://www.google.com/maps/place/Al+Madina+Pakwan+And+Sheermaal+Center/@24.9288794,67.1340984,17z/data=!3m1!4b1!4m6!3m5!1s0x3eb338f3dcd3e6ef:0xccc28227b3b9d6b1!8m2!3d24.9288794!4d67.1340984!16s%2Fg%2F11ddwhkc5t",
      googleShareUrl: "https://share.google/Dt1YKtNeIkhfiHcWQ",
      rating: 3.9,
      reviewCount: 51,
      currency: "PKR",
      taxRate: 0,
      deliveryFee: 150,
      freeDeliveryMin: 2000,
      minOrderAmount: 300,
      pickupEnabled: true,
      deliveryEnabled: true,
      cashOnly: true,
      hoursJson,
      heroImage: "/images/brand/photo-1.jpg",
    },
  });

  await prisma.adminUser.create({
    data: {
      email: "admin@almadinah.pk",
      passwordHash: hashPassword("admin123"),
      name: "Store Admin",
      role: "admin",
    },
  });

  const categories = await Promise.all(
    [
      {
        name: "Sheermal & Breads",
        slug: "sheermal-breads",
        description: "Soft sweet sheermal, taftan, and fresh tandoori breads from our tandoor.",
        sortOrder: 1,
      },
      {
        name: "Pakwan & Trays",
        slug: "pakwan-trays",
        description: "Family and catering trays — korma, haleem-style savory, and feast platters.",
        sortOrder: 2,
      },
      {
        name: "Rice & Biryani",
        slug: "rice-biryani",
        description: "Fragrant biryani and pulao prepared for everyday meals and gatherings.",
        sortOrder: 3,
      },
      {
        name: "Sweets & Combos",
        slug: "sweets-combos",
        description: "Sweet sheermal packs, tea-time combos, and festive bakery selections.",
        sortOrder: 4,
      },
      {
        name: "Savory Sides",
        slug: "savory-sides",
        description: "Naan, chapati, raita, and sides that round out a proper Karachi thaal.",
        sortOrder: 5,
      },
    ].map((c) => prisma.category.create({ data: c })),
  );

  const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  const products = [
    {
      name: "Classic Sheermal",
      slug: "classic-sheermal",
      description: "Soft, lightly sweet sheermal brushed with ghee — the house favorite for tea and iftar.",
      price: 100,
      categoryId: bySlug["sheermal-breads"],
      image: "/images/brand/photo-2.jpg",
      stock: 120,
      unit: "piece",
      isFeatured: true,
      tags: "popular,sweet,tandoor",
    },
    {
      name: "Sheermal Pack (7)",
      slug: "sheermal-pack-7",
      description: "Seven soft sheermal ready for family breakfast or guests — better value than singles.",
      price: 640,
      compareAt: 700,
      categoryId: bySlug["sheermal-breads"],
      image: "/images/brand/photo-2.jpg",
      stock: 40,
      unit: "pack",
      isFeatured: true,
      tags: "combo,value",
    },
    {
      name: "Taftan",
      slug: "taftan",
      description: "Puffed, golden taftan from the tandoor — slightly crisp edges, soft center.",
      price: 80,
      categoryId: bySlug["sheermal-breads"],
      image: "/images/brand/photo-4.jpg",
      stock: 90,
      unit: "piece",
      tags: "tandoor",
    },
    {
      name: "Tandoori Roti",
      slug: "tandoori-roti",
      description: "Everyday tandoori roti praised by guests for taste and fair rates.",
      price: 20,
      categoryId: bySlug["sheermal-breads"],
      image: "/images/brand/photo-4.jpg",
      stock: 200,
      unit: "piece",
      isFeatured: true,
      tags: "popular,tandoor",
    },
    {
      name: "Chicken Korma Tray (Full)",
      slug: "chicken-korma-tray-full",
      description: "Rich, aromatic chicken korma tray for 8–10 people — guests say your taste buds will be grateful.",
      price: 4500,
      categoryId: bySlug["pakwan-trays"],
      image: "/images/brand/photo-1.jpg",
      stock: 15,
      unit: "tray",
      isFeatured: true,
      tags: "catering,korma",
    },
    {
      name: "Chicken Korma (Half Tray)",
      slug: "chicken-korma-half",
      description: "Half tray of house korma — ideal for smaller gatherings and office lunches.",
      price: 2400,
      categoryId: bySlug["pakwan-trays"],
      image: "/images/brand/photo-1.jpg",
      stock: 20,
      unit: "tray",
      tags: "catering,korma",
    },
    {
      name: "Mutton Korma Tray (Full)",
      slug: "mutton-korma-tray-full",
      description: "Slow-cooked mutton korma with deep spice — a celebration classic.",
      price: 6500,
      categoryId: bySlug["pakwan-trays"],
      image: "/images/brand/photo-3.jpg",
      stock: 8,
      unit: "tray",
      tags: "catering,premium",
    },
    {
      name: "Mixed Pakwan Feast Tray",
      slug: "mixed-pakwan-feast",
      description: "Assorted savory pakwan tray pairing korma with sides for weekend thaal.",
      price: 5200,
      categoryId: bySlug["pakwan-trays"],
      image: "/images/brand/photo-3.jpg",
      stock: 10,
      unit: "tray",
      isFeatured: true,
      tags: "catering",
    },
    {
      name: "Chicken Biryani (Plate)",
      slug: "chicken-biryani-plate",
      description: "Fragrant chicken biryani plate — a neighborhood staple for lunch and dinner.",
      price: 350,
      categoryId: bySlug["rice-biryani"],
      image: "/images/brand/photo-1.jpg",
      stock: 60,
      unit: "plate",
      isFeatured: true,
      tags: "popular,biryani",
    },
    {
      name: "Chicken Biryani Tray",
      slug: "chicken-biryani-tray",
      description: "Full biryani tray for family dawat — layered rice, tender chicken, and warm spice.",
      price: 3800,
      categoryId: bySlug["rice-biryani"],
      image: "/images/brand/photo-1.jpg",
      stock: 12,
      unit: "tray",
      tags: "catering,biryani",
    },
    {
      name: "Beef Pulao (Plate)",
      slug: "beef-pulao-plate",
      description: "Comforting beef pulao with aromatic rice — perfect with raita and salad.",
      price: 320,
      categoryId: bySlug["rice-biryani"],
      image: "/images/brand/photo-3.jpg",
      stock: 45,
      unit: "plate",
      tags: "pulao",
    },
    {
      name: "Sweet Sheermal & Chai Combo",
      slug: "sheermal-chai-combo",
      description: "Two classic sheermal with house chai pairing suggestion for afternoon guests.",
      price: 250,
      compareAt: 280,
      categoryId: bySlug["sweets-combos"],
      image: "/images/brand/photo-2.jpg",
      stock: 50,
      unit: "combo",
      isFeatured: true,
      tags: "combo,sweet",
    },
    {
      name: "Festival Sheermal Box (12)",
      slug: "festival-sheermal-box",
      description: "Dozen sheermal packed for Eid, mehndi, or office distribution.",
      price: 1100,
      categoryId: bySlug["sweets-combos"],
      image: "/images/brand/photo-2.jpg",
      stock: 25,
      unit: "box",
      tags: "festive,value",
    },
    {
      name: "Naan (Butter)",
      slug: "butter-naan",
      description: "Soft butter naan from the tandoor — frequently mentioned alongside our breads.",
      price: 60,
      categoryId: bySlug["savory-sides"],
      image: "/images/brand/photo-4.jpg",
      stock: 150,
      unit: "piece",
      tags: "naan,tandoor",
    },
    {
      name: "Chapati (2 pcs)",
      slug: "chapati-2",
      description: "Fresh chapati pair — simple, soft, and ready for korma.",
      price: 40,
      categoryId: bySlug["savory-sides"],
      image: "/images/brand/photo-4.jpg",
      stock: 180,
      unit: "pack",
      tags: "chapati",
    },
    {
      name: "Raita Cup",
      slug: "raita-cup",
      description: "Cool yogurt raita to balance spicy korma and biryani.",
      price: 80,
      categoryId: bySlug["savory-sides"],
      image: "/images/brand/photo-3.jpg",
      stock: 70,
      unit: "cup",
      tags: "side",
    },
  ];

  for (const p of products) {
    const product = await prisma.product.create({ data: p });
    await prisma.stockMove.create({
      data: {
        productId: product.id,
        delta: product.stock,
        reason: "initial_stock",
        note: "Seed inventory",
      },
    });
  }

  const coupons = [
    {
      code: "SHEERMAL10",
      description: "10% off orders over Rs 1,000",
      type: "percent",
      value: 10,
      minOrder: 1000,
      maxUses: 200,
    },
    {
      code: "JOHAR150",
      description: "Rs 150 off delivery orders over Rs 1,500",
      type: "fixed",
      value: 150,
      minOrder: 1500,
      maxUses: 100,
    },
  ];
  for (const c of coupons) {
    await prisma.coupon.create({ data: c });
  }

  const customer = await prisma.customer.create({
    data: {
      name: "Ahmed Khan",
      phone: "+92 300 1234567",
      email: "ahmed@example.com",
      address: "Block 3 Gulistan-e-Johar, Karachi",
    },
  });

  const sheermal = await prisma.product.findUniqueOrThrow({ where: { slug: "classic-sheermal" } });
  const korma = await prisma.product.findUniqueOrThrow({ where: { slug: "chicken-korma-half" } });
  const biryani = await prisma.product.findUniqueOrThrow({ where: { slug: "chicken-biryani-plate" } });

  const order = await prisma.order.create({
    data: {
      orderNumber: "AM-1001",
      customerId: customer.id,
      guestName: customer.name,
      guestPhone: customer.phone,
      guestEmail: customer.email,
      fulfillment: "delivery",
      address: customer.address,
      status: "completed",
      paymentMethod: "cash_on_delivery",
      paymentStatus: "paid",
      subtotal: sheermal.price * 6 + biryani.price * 2,
      discount: 0,
      deliveryFee: 150,
      tax: 0,
      total: sheermal.price * 6 + biryani.price * 2 + 150,
      trackingToken: "track-demo-1001",
      notes: "Please call on arrival",
      items: {
        create: [
          {
            productId: sheermal.id,
            name: sheermal.name,
            price: sheermal.price,
            quantity: 6,
            lineTotal: sheermal.price * 6,
          },
          {
            productId: biryani.id,
            name: biryani.name,
            price: biryani.price,
            quantity: 2,
            lineTotal: biryani.price * 2,
          },
        ],
      },
    },
  });

  await prisma.ledgerEntry.create({
    data: {
      type: "sale",
      category: "Order sales",
      description: `Sale ${order.orderNumber}`,
      amount: order.total,
      orderId: order.id,
      entryDate: new Date(),
    },
  });

  await prisma.ledgerEntry.create({
    data: {
      type: "expense",
      category: "Ingredients",
      description: "Flour, ghee, and spice restock",
      amount: 8500,
      entryDate: new Date(Date.now() - 86400000),
    },
  });

  await prisma.ledgerEntry.create({
    data: {
      type: "expense",
      category: "Utilities",
      description: "Gas cylinder refill for tandoor",
      amount: 3200,
      entryDate: new Date(Date.now() - 172800000),
    },
  });

  await prisma.order.create({
    data: {
      orderNumber: "AM-1002",
      guestName: "Fatima Siddiqui",
      guestPhone: "+92 321 7654321",
      fulfillment: "pickup",
      status: "preparing",
      paymentMethod: "cash_on_delivery",
      paymentStatus: "pending",
      subtotal: korma.price,
      discount: 0,
      deliveryFee: 0,
      tax: 0,
      total: korma.price,
      trackingToken: "track-demo-1002",
      items: {
        create: [
          {
            productId: korma.id,
            name: korma.name,
            price: korma.price,
            quantity: 1,
            lineTotal: korma.price,
          },
        ],
      },
    },
  });

  console.log("Seed complete: Al Madinah Pakwan and Sheermal House");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
