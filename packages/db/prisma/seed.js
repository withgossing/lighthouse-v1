const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    // Create Users
    const user1 = await prisma.user.upsert({
        where: { email: "general@example.com" },
        update: {},
        create: {
            externalId: "mock-user-1",
            email: "general@example.com",
            name: "General User",
            role: "USER"
        }
    });

    const admin1 = await prisma.user.upsert({
        where: { email: "admin@example.com" },
        update: {},
        create: {
            externalId: "mock-admin-1",
            email: "admin@example.com",
            name: "IT Admin User",
            role: "ADMIN"
        }
    });

    // Create Parent Categories
    const network = await prisma.category.create({
        data: { name: "Network & VPN", description: "Internet, VPN, Wi-Fi issues" }
    });
    const hardware = await prisma.category.create({
        data: { name: "Hardware", description: "Laptops, monitors, peripherals" }
    });
    const software = await prisma.category.create({
        data: { name: "Software", description: "OS, applications, licenses" }
    });

    // Create Child Categories
    await prisma.category.create({
        data: { name: "Cannot connect to Wi-Fi", parentId: network.id }
    });
    await prisma.category.create({
        data: { name: "VPN Access Denied", parentId: network.id }
    });

    await prisma.category.create({
        data: { name: "Broken Screen", parentId: hardware.id }
    });
    await prisma.category.create({
        data: { name: "Request New Mouse/Keyboard", parentId: hardware.id }
    });

    console.log("Seeded successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
