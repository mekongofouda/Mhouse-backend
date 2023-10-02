import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Privilege } from './entities/privilege.entity';
import { Repository } from 'typeorm';
import { ListPrivilegeDto } from './dto/list-privilege.dto';
import { AddPrivilegeDto } from './dto/add-privilege.dto';
import { UpdateDiscussionDto } from 'src/discussion/dto/update-discussion.dto';
import { Role } from 'src/role/entities/role.entity';

@Injectable()
export class PrivilegeService {

  constructor(
    @InjectRepository(Privilege) 
    private readonly privilegeRepository: Repository<Privilege>,
    @InjectRepository(Role) 
    private readonly roleRepository: Repository<Role>

  ){}

  async addPrivilege(addPrivilegeDto: AddPrivilegeDto) {
    //Find if the role with the given refRole exist
    const role = await this.roleRepository.findOneBy({refRole: addPrivilegeDto.refRole});
    if (!role) {
      throw new HttpException("Role not found", HttpStatus.NOT_FOUND)
    }

    //Create a privilege to save with the Dto  
    const privilege = this.privilegeRepository.create({
      ...addPrivilegeDto
    });

    privilege.roles = [];

    return await this.privilegeRepository.save(privilege);
  }

  // async listPrivilege(listPrivilegeDto: ListPrivilegeDto): Promise<Privilege[]> {

  //   const refUser = listPrivilegeDto.refUser;
  //   const refRole = listPrivilegeDto.refRole;
  //   const resource = listPrivilegeDto.resource;
  //   const createdAt = listPrivilegeDto.createdAt;
  //   const updatedAt = listPrivilegeDto.updatedAt;

  //   const qb = this.privilegeRepository.createQueryBuilder("privilege");

  //   qb.select("privilege")
  //   if (refUser) {
  //     qb.where("privilege.refUser = :refUser")
  //     .setParameters({
  //       refUser
  //     })
  //   }
  //   if (refRole) {
  //     qb.andWhere("privilege.refRole = :refRole")
  //     .setParameters({
  //       refRole
  //     })
  //   }
  //   if (resource) {
  //     qb.where("privilege.resource = :resource")
  //     .setParameters({
  //       resource
  //     })
  //   } 
  //   if (createdAt) {
  //     qb.where("privilege.createdAt = :createdAt")
  //     .setParameters({
  //       createdAt
  //     })
  //   }
  //   if (updatedAt) {
  //     qb.where("privilege.updatedAt = :updatedAt")
  //     .setParameters({
  //       updatedAt
  //     })
  //   }
  //   return await qb.getRawMany();
  // }

  // async showPrivilegeDetail(refPrivilege: string): Promise<Privilege | null> {
  //   const privilege = await this.privilegeRepository.findOne({where:{refPrivilege}});
  //   console.log(privilege);
  //   if (privilege == null) {
  //     throw new HttpException("Privilege not found", HttpStatus.NOT_FOUND)
  //   }    
  //   return privilege;
  // }

  // async updatePrivilege(refPrivilege: string, updatePrivilegeDto: UpdateDiscussionDto): Promise<Privilege> {
  //   const privilege = await this.privilegeRepository.findOne({where:{refPrivilege}});
  //   if (privilege == null) {
  //     throw new HttpException("Privilege not found", HttpStatus.NOT_FOUND)
  //   }    
  //   Object.assign(privilege, updatePrivilegeDto);
  //   return await this.privilegeRepository.save(privilege);
  // }

  // async deletePrivilege(refPrivilege: string) {
  //   const privilege = await this.privilegeRepository.findOneBy({refPrivilege});
  //   if (privilege == null) {
  //     throw new HttpException("Privilege not found", HttpStatus.NOT_FOUND)
  //   }    
  //   return await this.privilegeRepository.softRemove(privilege);
  // }
}
