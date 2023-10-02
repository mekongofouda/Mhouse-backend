import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SponsorDto } from './dto/sponsor.dto';
import { ListSponsorDto } from './dto/list-sponsor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sponsor } from './entities/sponsor.entity';
import { Repository } from 'typeorm';
import { PostEntity } from 'src/post/entities/post.entity';

@Injectable()
export class SponsorService {

  constructor(
    @InjectRepository(PostEntity) 
    private readonly postRepository: Repository<PostEntity>,

    @InjectRepository(Sponsor) 
    private readonly sponsorRepository: Repository<Sponsor>
  ){}

  async sponsor(sponsorDto: SponsorDto): Promise<Sponsor> {
    //Get post to add at the sponsor
    const post = await this.postRepository.findOneBy({refPost: sponsorDto.refPost});
    if (!post) {
      throw new HttpException("Post not found", HttpStatus.NOT_FOUND)
    }

    //Create the sponsor object with Dto to save it 
    const sponsor = await this.sponsorRepository.create(sponsorDto); 
    if (!sponsor) {
      throw new BadRequestException("Sponsor not found");
    }

    //Set properties
    sponsor.post = post;

    try {
      await this.sponsorRepository.save(sponsor);
    } catch (error) {
      throw new ConflictException("L'email et le numéro de téléphone doivent être déjà utilisés");
    }
    return sponsor;
    
  }

  // async listSponsor(listSponsorDto: ListSponsorDto) {
  //   const refAccount = listSponsorDto.refAccount;
  //   const refPost = listSponsorDto.refPost;
  //   const createdAt = listSponsorDto.createdAt;
  //   const updatedAt = listSponsorDto.updatedAt;

  //   const qb = this.sponsorRepository.createQueryBuilder("sponsor");

  //   qb.select("sponsor")
  //   if (refAccount) {
  //     qb.where("sponsor.refUser = :refUser")
  //     .setParameters({
  //       refAccount
  //     })
  //   }
  //   if (refPost) {
  //     qb.andWhere("sponsor.refRole = :refRole")
  //     .setParameters({
  //       refPost
  //     })
  //   }
  //   if (createdAt) {
  //     qb.where("sponsor.createdAt = :createdAt")
  //     .setParameters({
  //       createdAt
  //     })
  //   }
  //   if (updatedAt) {
  //     qb.where("sponsor.updatedAt = :updatedAt")
  //     .setParameters({
  //       updatedAt
  //     })
  //   }
  //   return await qb.getRawMany();
  // }

  // async showSponsorDetail(refSponsor: string) {
  //   const sponsor = await this.sponsorRepository.findOne({where:{refSponsor}});
  //   if (sponsor == null) {
  //     throw new HttpException("Sponsor not found", HttpStatus.NOT_FOUND)
  //   }    
  //   return sponsor;
  //}
}
