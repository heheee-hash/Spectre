import { WarehouseRepository, LocationRepository } from "../repositories/warehouse.repository";
import { warehouseCreateSchema, warehouseUpdateSchema } from "@/schemas/warehouse.schema";
import { locationCreateSchema, locationUpdateSchema } from "@/schemas/location.schema";

const warehouseRepo = new WarehouseRepository();
const locationRepo = new LocationRepository();

export class WarehouseService {
  async getWarehouses() {
    return warehouseRepo.findAll();
  }

  async getWarehouseById(id: string) {
    return warehouseRepo.findById(id);
  }

  async createWarehouse(data: any) {
    const validated = warehouseCreateSchema.parse(data);
    return warehouseRepo.create(validated);
  }

  async updateWarehouse(id: string, data: any) {
    const validated = warehouseUpdateSchema.parse(data);
    return warehouseRepo.update(id, validated);
  }

  async deleteWarehouse(id: string) {
    return warehouseRepo.delete(id);
  }
}

export class LocationService {
  async getLocations(warehouseId?: string) {
    return locationRepo.findAll({
      where: warehouseId ? { warehouseId } : undefined,
    });
  }

  async getLocationById(id: string) {
    return locationRepo.findById(id);
  }

  async createLocation(data: any) {
    const validated = locationCreateSchema.parse(data);
    return locationRepo.create(validated);
  }

  async updateLocation(id: string, data: any) {
    const validated = locationUpdateSchema.parse(data);
    return locationRepo.update(id, validated);
  }

  async deleteLocation(id: string) {
    return locationRepo.delete(id);
  }
}
