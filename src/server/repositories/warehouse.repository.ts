import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class WarehouseRepository {
  async findAll() {
    return prisma.warehouse.findMany({
      include: {
        locations: true,
      },
      orderBy: { name: "asc" },
    });
  }

  async findById(id: string) {
    return prisma.warehouse.findUnique({
      where: { id },
      include: {
        locations: true,
      },
    });
  }

  async create(data: Prisma.WarehouseCreateInput) {
    return prisma.warehouse.create({ data });
  }

  async update(id: string, data: Prisma.WarehouseUpdateInput) {
    return prisma.warehouse.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.warehouse.delete({ where: { id } });
  }
}

export class LocationRepository {
  async findAll(params?: { where?: Prisma.LocationWhereInput }) {
    return prisma.location.findMany({
      ...params,
      include: {
        warehouse: true,
      },
      orderBy: { name: "asc" },
    });
  }

  async findById(id: string) {
    return prisma.location.findUnique({
      where: { id },
      include: {
        warehouse: true,
      },
    });
  }

  async create(data: Prisma.LocationUncheckedCreateInput) {
    return prisma.location.create({ data });
  }

  async update(id: string, data: Prisma.LocationUncheckedUpdateInput) {
    return prisma.location.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.location.delete({ where: { id } });
  }
}
