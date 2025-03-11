import { IsNotEmpty } from "class-validator";

export class SlideDto {
      
  @IsNotEmpty()
  titre: string;
  police: string;
  code: string;
  position: string;
  url: string;
} 
