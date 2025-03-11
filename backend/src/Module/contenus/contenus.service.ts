// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
// import { Contenu, ContenuDocument } from './schemas/contenu.schema';
// import { CreateContenuDto } from './dto/create-contenu.dto';
// import { UpdateContenuDto } from './dto/update-contenu.dto';


// @Injectable()
// export class ContenuService {
//   constructor(@InjectModel(Contenu.name) private contenuModel: Model<ContenuDocument>) {}

//   async create(createContenuDto: CreateContenuDto): Promise<Contenu> {
//     const contenu = new this.contenuModel(createContenuDto);
//     return contenu.save();
//   }

//   async findAll(): Promise<Contenu[]> {
//     return this.contenuModel.find().exec();
//   }

//   async findOne(id: string): Promise<Contenu> {
//     const contenu = await this.contenuModel.findById(id).exec();
//     if (!contenu) {
//       throw new NotFoundException(`Contenu with ID ${id} not found`);
//     }
//     return contenu;
//   }

//   async update(id: string, updateContenuDto: UpdateContenuDto): Promise<Contenu> {
//     const updatedContenu = await this.contenuModel.findByIdAndUpdate(id, updateContenuDto, { new: true }).exec();
//     if (!updatedContenu) {
//       throw new NotFoundException(`Contenu with ID ${id} not found`);
//     }
//     return updatedContenu;
//   }

//   async remove(id: string): Promise<Contenu> {
//     const deletedContenu = await this.contenuModel.findByIdAndDelete(id).exec();
//     if (!deletedContenu) {
//       throw new NotFoundException(`Contenu with ID ${id} not found`);
//     }
//     return deletedContenu;
//   }
  
      
// }


import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Contenu, ContenuDocument, Unite, UniteDocument } from './schemas/contenu.schema';
import { ContenuSpecifique, ContenuSpecifiqueDocument } from './schemas/contenu.schema';  // Import the other models
import { Partenaire, PartenaireDocument } from './schemas/contenu.schema'; 
import { Temoignage, TemoignageDocument } from './schemas/contenu.schema';
import { FAQ, FAQDocument } from './schemas/contenu.schema';
import { Evenement, EvenementDocument } from './schemas/contenu.schema';
import { APropos, AProposDocument } from './schemas/contenu.schema';
import { Article, ArticleDocument } from './schemas/contenu.schema';
import { Actualite, ActualiteDocument } from './schemas/contenu.schema';
import { Service, ServiceDocument } from './schemas/contenu.schema';
import { Solution, SolutionDocument } from './schemas/contenu.schema';
import { CreateContenuDto } from './dto/create-contenu.dto';
import { UpdateContenuDto } from './dto/update-contenu.dto';

@Injectable()
export class ContenuService {
  constructor(
    @InjectModel(Contenu.name) private contenuModel: Model<ContenuDocument>,
    @InjectModel(ContenuSpecifique.name) private contenuSpecifiqueModel: Model<ContenuSpecifiqueDocument>,
    @InjectModel(Partenaire.name) private partenaireModel: Model<PartenaireDocument>,
    @InjectModel(Temoignage.name) private temoignageModel: Model<TemoignageDocument>,
    @InjectModel(FAQ.name) private faqModel: Model<FAQDocument>,
    @InjectModel(Evenement.name) private evenementModel: Model<EvenementDocument>,
    @InjectModel(APropos.name) private aProposModel: Model<AProposDocument>,
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    @InjectModel(Actualite.name) private actualiteModel: Model<ActualiteDocument>,
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
    @InjectModel(Solution.name) private solutionModel: Model<SolutionDocument>,
    @InjectModel(Unite.name) private uniteModel: Model<UniteDocument>
    
) {}

  async create(createContenuDto: CreateContenuDto, type: string): Promise<any> {
    let contenu;
    switch (type) {
      case 'ContenuSpecifique':
        contenu = new this.contenuSpecifiqueModel(createContenuDto);
        break;
      case 'Partenaire':
        contenu = new this.partenaireModel(createContenuDto);
        break;
      case 'Temoignage':
        contenu = new this.temoignageModel(createContenuDto);
        break;
      case 'FAQ':
        contenu = new this.faqModel(createContenuDto);
        break;
      case 'Evenement':
        contenu = new this.evenementModel(createContenuDto);
        break;
      case 'APropos':
        contenu = new this.aProposModel(createContenuDto);
        break;
      case 'Article':
        contenu = new this.articleModel(createContenuDto);
        break;
      case 'Actualite':
        contenu = new this.actualiteModel(createContenuDto);
        break;
      case 'Service':
        contenu = new this.serviceModel(createContenuDto);
        break;
      case 'Solution':
        contenu = new this.solutionModel(createContenuDto);
        break;
      case 'Unite':
        contenu = new this.uniteModel(createContenuDto);
        break;

      default:
        contenu = new this.contenuModel(createContenuDto);
    }
    return contenu.save();
  }

  async findAll(type: string): Promise<any[]> {
    switch (type) {
      case 'ContenuSpecifique':
        return this.contenuSpecifiqueModel.find().exec();
      case 'Partenaire':
        return this.partenaireModel.find().exec();
      case 'Temoignage':
        return this.temoignageModel.find().exec();
      case 'FAQ':
        return this.faqModel.find().exec();   
      case 'Evenement':
        return this.evenementModel.find().exec();  
      case 'APropos':
        return this.aProposModel.find().exec();       
      case 'Article':
        return this.articleModel.find().exec();        
      case 'Actualite':
        return this.actualiteModel.find().exec();       
      case 'Service':
        return this.serviceModel.find().exec();       
      case 'Solution':
        return this.solutionModel.find().exec();
      case 'Unite':
        return this.uniteModel.find().exec();

      default:
        return this.contenuModel.find().exec();
    }
  }

  async findOne(id: string, type: string): Promise<any> {
    switch (type) {
      case 'ContenuSpecifique':
        return this.contenuSpecifiqueModel.findById(id).exec();
      case 'Partenaire':
        return this.partenaireModel.findById(id).exec();
      case 'Temoignage':
        return this.temoignageModel.findById(id).exec();
      case 'FAQ':
        return this.faqModel.findById(id).exec();
      case 'Evenement':
        return this.evenementModel.findById(id).exec(); 
      case 'APropos':
        return this.aProposModel.findById(id).exec();      
      case 'Article':
        return this.articleModel.findById(id).exec();        
      case 'Actualite':
        return this.actualiteModel.findById(id).exec();      
      case 'Service':
        return this.serviceModel.findById(id).exec();     
      case 'Solution':
        return this.solutionModel.findById(id).exec();
      case 'Unite':
        return this.uniteModel.findById(id).exec();
        
      default:
        return this.contenuModel.findById(id).exec();
    }
  }

  async update(id: string, updateContenuDto: UpdateContenuDto, type: string): Promise<any> {
    let updatedContenu;
    switch (type) {
      case 'ContenuSpecifique':
        updatedContenu = await this.contenuSpecifiqueModel.findByIdAndUpdate(id, updateContenuDto, { new: true }).exec();
        break;
      case 'Partenaire':
        updatedContenu = await this.partenaireModel.findByIdAndUpdate(id, updateContenuDto, { new: true }).exec();
        break;
      case 'Temoignage':
        updatedContenu = await this.temoignageModel.findByIdAndUpdate(id, updateContenuDto, { new: true }).exec();
        break;
      case 'FAQ':
        updatedContenu = await this.faqModel.findByIdAndUpdate(id, updateContenuDto, { new: true }).exec();
        break;
      case 'Evenement':
        updatedContenu = await this.evenementModel.findByIdAndUpdate(id, updateContenuDto, { new: true }).exec();
        break;
      case 'APropos':
        updatedContenu = await this.aProposModel.findByIdAndUpdate(id, updateContenuDto, { new: true }).exec();
        break;
      case 'Article':
        updatedContenu = await this.articleModel.findByIdAndUpdate(id, updateContenuDto, { new: true }).exec();
        break;
      case 'Actualite':
        updatedContenu = await this.actualiteModel.findByIdAndUpdate(id, updateContenuDto, { new: true }).exec();
        break;
      case 'Service':
        updatedContenu = await this.serviceModel.findByIdAndUpdate(id, updateContenuDto, { new: true }).exec();
        break;
      case 'Solution':
        updatedContenu = await this.solutionModel.findByIdAndUpdate(id, updateContenuDto, { new: true }).exec();
        break;
      case 'Unite':
        updatedContenu = await this.uniteModel.findByIdAndUpdate(id, updateContenuDto, { new: true }).exec();
        break;
      default:
        updatedContenu = await this.contenuModel.findByIdAndUpdate(id, updateContenuDto, { new: true }).exec();
    }

    if (!updatedContenu) {
      throw new NotFoundException(`Contenu with ID ${id} not found`);
    }
    return updatedContenu;
  }

  async remove(id: string, type: string): Promise<any> {
    let deletedContenu;
    switch (type) {
      case 'ContenuSpecifique':
        deletedContenu = await this.contenuSpecifiqueModel.findByIdAndDelete(id).exec();
        break;
      case 'Partenaire':
        deletedContenu = await this.partenaireModel.findByIdAndDelete(id).exec();
        break;
      case 'Temoignage':
        deletedContenu = await this.temoignageModel.findByIdAndDelete(id).exec();
        break;
      case 'FAQ':
        deletedContenu = await this.faqModel.findByIdAndDelete(id).exec();
        break;
      case 'Evenement':
        deletedContenu = await this.evenementModel.findByIdAndDelete(id).exec();
        break;
      case 'APropos':
        deletedContenu = await this.aProposModel.findByIdAndDelete(id).exec();
        break;
      case 'Article':
        deletedContenu = await this.articleModel.findByIdAndDelete(id).exec();
        break;
      case 'Actualite':
        deletedContenu = await this.actualiteModel.findByIdAndDelete(id).exec();
        break;
      case 'Service':
        deletedContenu = await this.serviceModel.findByIdAndDelete(id).exec();
        break;
      case 'Solution':
        deletedContenu = await this.solutionModel.findByIdAndDelete(id).exec();
        break;
      case 'Unite':
        deletedContenu = await this.uniteModel.findByIdAndDelete(id).exec();
        break;
      default:
        deletedContenu = await this.contenuModel.findByIdAndDelete(id).exec();
    }

    if (!deletedContenu) {
      throw new NotFoundException(`Contenu with ID ${id} not found`);
    }
    return deletedContenu;
  }
}
