// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { ContenuService } from './contenus.service';
// import { CreateContenuDto } from './dto/create-contenu.dto';
// import { UpdateContenuDto } from './dto/update-contenu.dto';

// @Controller('contenus')
// export class ContenuController {
//   constructor(private readonly contenuService: ContenuService) {}

//   @Post()
//   create(@Body() createContenuDto: CreateContenuDto) {
//     return this.contenuService.create(createContenuDto);
//   }

//   @Get()
//   findAll() {
//     return this.contenuService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.contenuService.findOne(id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateContenuDto: UpdateContenuDto) {
//     return this.contenuService.update(id, updateContenuDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.contenuService.remove(id);
//   }

  
// }


import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContenuService } from './contenus.service';
import { CreateContenuDto } from './dto/create-contenu.dto';
import { UpdateContenuDto } from './dto/update-contenu.dto';

@Controller('contenus')
export class ContenuController {
  constructor(private readonly contenuService: ContenuService) {}

  @Post(':type')
  create(@Param('type') type: string, @Body() createContenuDto: CreateContenuDto) {
    return this.contenuService.create(createContenuDto, type);
  }

  @Get(':type')
  findAll(@Param('type') type: string) {
    return this.contenuService.findAll(type);
  }

  @Get(':type/:id')
  findOne(@Param('type') type: string, @Param('id') id: string) {
    return this.contenuService.findOne(id, type);
  }

  @Patch(':type/:id')
  update(@Param('type') type: string, @Param('id') id: string, @Body() updateContenuDto: UpdateContenuDto) {
    return this.contenuService.update(id, updateContenuDto, type);
  }

  @Delete(':type/:id')
  remove(@Param('type') type: string, @Param('id') id: string) {
    return this.contenuService.remove(id, type);
  }


  // @Get(':type/entreprise/:entrepriseId')
  // async getContenuByEntreprise(@Param('type') type: string, @Param('entrepriseId') entrepriseId: string): Promise<any[]> {
  //   return this.contenuService.findContenuByEntreprise(type, entrepriseId);
  // }

  @Get(':type/entreprise/:entrepriseId')
  async getContenuByEntreprise(
    @Param('type') type: string,
    @Param('entrepriseId') entrepriseId: string,
  ): Promise<any[]> {
    return this.contenuService.findContenuByEntreprise(type, entrepriseId);
  }




  @Patch('FAQ/:id/styles')
  updateFaqStyles(@Param('id') id: string, @Body() styles: Record<string, any>) {
    return this.contenuService.updateFaqStyles(id, styles);
  }


  @Patch('Unite/:id/styles')
  updateUniteStyles(@Param('id') id: string, @Body() styles: Record<string, any>) {
    return this.contenuService.updateUniteStyles(id, styles);
  }

  @Patch('Service/:id/styles')
  updateServiceStyles(@Param('id') id: string, @Body() styles: Record<string, any>) {
    return this.contenuService.updateServiceStyles(id, styles);
  }

  @Patch('Solution/:id/styles')
  updateSolutionStyles(@Param('id') id: string, @Body() styles: Record<string, any>) {
    return this.contenuService.updateSolutionStyles(id, styles);
  }
  
}
