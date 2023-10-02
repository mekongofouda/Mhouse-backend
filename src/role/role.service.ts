import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddRoleDto } from './dto/add-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ListRoleDto } from './dto/list-role.dto';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from 'src/account/entities/account.entity';

@Injectable()
export class RoleService {

  constructor(
    @InjectRepository(AccountEntity) 
    private readonly accountRepository: Repository<AccountEntity>,

    @InjectRepository(Role) 
    private readonly roleRepository: Repository<Role>
  ){}

  async addRole(addRoleDto: AddRoleDto) {   
    const role = this.roleRepository.create(addRoleDto);
    return await this.roleRepository.save(addRoleDto);
  }

  async listRole(listRoleDto: ListRoleDto): Promise<Role[]> {

    const createdAt = listRoleDto.createdAt;
    const updatedAt = listRoleDto.updatedAt;

    const qb = this.roleRepository.createQueryBuilder("role");

    if (createdAt) {
      qb.where("role.createdAt = :createdAt")
      .setParameters({
        createdAt
      })
    }
    if (updatedAt) {
      qb.where("role.updatedAt = :updatedAt")
      .setParameters({
        updatedAt
      })
    }
    return await qb.getRawMany();
  }

  async showRoleDetail(refRole: string) {
    const role = await this.roleRepository.findOne({where:{refRole}});
    console.log(role);
    if (role == null) {
      throw new HttpException("Role not found", HttpStatus.NOT_FOUND)
    }    
    return role;
  }

  async updateRole(refRole: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.findOne({where:{refRole}});
    if (role == null) {
      throw new HttpException("Role not found", HttpStatus.NOT_FOUND)
    }    
    Object.assign(role, updateRoleDto);
    return await this.roleRepository.save(role);
  }

  async deleteRole(refRole: string) {
    const role = await this.roleRepository.findOneBy({refRole});
    if (role == null) {
      throw new HttpException("Role not found", HttpStatus.NOT_FOUND)
    }    
    return await this.roleRepository.softRemove(role);
  }
}
