import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    const userCount = await prisma.user.count();
    const adminUser = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    const locationCount = await prisma.location.count();
    const internalLocations = await prisma.location.findMany({ where: { type: "INTERNAL" } });
    
    console.log({
        userCount,
        hasAdmin: !!adminUser,
        locationCount,
        internalLocations: internalLocations.length
    });
    await prisma.$disconnect();
}
main();
