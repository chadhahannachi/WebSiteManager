import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Contenu } from 'src/Module/contenus/schemas/contenu.schema';
import { Entreprise } from 'src/Module/entreprise/schemas/entreprise.schema';


export type CarrousselDocument = Carroussel & Document;

@Schema()
export class Carroussel extends Document {
  
  @Prop({ required: true })
  titre: string;

  @Prop({ required: true })
  police: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  position: string;

  @Prop({ required: true })
  url: string;

  @Prop()
  isArchived: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Contenu' })
  contenu: Contenu;

  @Prop({ type: Types.ObjectId, ref: 'Entreprise'})
    entreprise: Entreprise;

}

export const CarrousselSchema = SchemaFactory.createForClass(Carroussel);

