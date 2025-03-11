import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Entreprise } from 'src/Module/entreprise/schemas/entreprise.schema';

export type PageDocument = Page & Document;

@Schema()
export class Page extends Document {
  
  
  @Prop({ required: true })
  titre: string;

  @Prop({ required: true })
  url: string;
 
  @Prop()
  isArchived: boolean;
  
  @Prop({ type: Types.ObjectId, ref: 'Entreprise' })
  entreprise: Entreprise;
  
}

export const PageSchema = SchemaFactory.createForClass(Page);
 