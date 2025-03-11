import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCarrousselDto } from './dto/create-carroussel.dto';
import { UpdateCarrousselDto } from './dto/update-carroussel.dto';
import { Carroussel, CarrousselDocument } from './schemas/carroussel.schema';

@Injectable()
export class CarrousselService {
  constructor(@InjectModel(Carroussel.name) private carrousselModel: Model<CarrousselDocument>) {}

  async create(createCarrousselDto: CreateCarrousselDto): Promise<Carroussel> {
    const carroussel = new this.carrousselModel(createCarrousselDto);
    return carroussel.save();
  }

  async findAll(): Promise<Carroussel[]> {
    return this.carrousselModel.find().exec();
  }

  async findOne(id: string): Promise<Carroussel> {
    const carroussel = await this.carrousselModel.findById(id).exec();
    if (!carroussel) {
      throw new NotFoundException(`Carroussel with ID ${id} not found`);
    }
    return carroussel;
  }

  async update(id: string, updateCarrousselDto: UpdateCarrousselDto): Promise<Carroussel> {
    const updatedCarroussel = await this.carrousselModel.findByIdAndUpdate(id, updateCarrousselDto, { new: true }).exec();
    if (!updatedCarroussel) {
      throw new NotFoundException(`Carroussel with ID ${id} not found`);
    }
    return updatedCarroussel;
  }

  async remove(id: string): Promise<Carroussel> {
    const deletedCarroussel = await this.carrousselModel.findByIdAndDelete(id).exec();
    if (!deletedCarroussel) {
      throw new NotFoundException(`Carroussel with ID ${id} not found`);
    }
    return deletedCarroussel;
  }
  
  async findCarrousselByEntreprise(entrepriseId: string): Promise<Carroussel[]> {
        try {
          const carroussels = await this.carrousselModel.find({ entreprise: new Types.ObjectId(entrepriseId) }).exec();
          return carroussels;
        } catch (error) {
          throw new Error(`Erreur lors de la récupération des utilisateurs par entreprise : ${error.message}`);
        }
      }
  
    async addContenuToCarroussel(carrousselId: string, contenuId: string) {
        await this.carrousselModel.findByIdAndUpdate(
          carrousselId,
          { $push: { contenu: contenuId } }
        );
      }
      
}
