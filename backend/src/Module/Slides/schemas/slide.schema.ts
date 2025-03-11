import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Entreprise } from 'src/Module/entreprise/schemas/entreprise.schema';

export type SlideDocument = Slide & Document;

@Schema()
export class Slide extends Document {
  
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

  @Prop({ type: Types.ObjectId, ref: 'Entreprise'})
  entreprise: Entreprise;
}

export const SlideSchema = SchemaFactory.createForClass(Slide);
 