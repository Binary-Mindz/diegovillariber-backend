import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto , LoginDto ,ForgetPasswordDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from '@/common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService

  ) {}

 async createUser(dto : CreateAuthDto) {
    const hashedPassword =await bcrypt.hash(dto.chosePassword, 10);
    const newuser = await this.prisma.client.user.create({
        data: {
            first_name: dto.firstName,
            last_name: dto.lastName,
            email: dto.email,
            phone: dto.phoneNumber,
            zip_code: dto.zipCode,
            password: hashedPassword,

        }
      })
    return newuser;
  }

  async loginuser(dto: LoginDto){
    const user = await this.prisma.client.user.findUnique({
      where :{
        email : dto.email
      }
    })

    if (!user) throw new UnauthorizedException('Invalid User');

    const isPasswordValid = await bcrypt.compare(dto.Password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid Password');
    
    const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    return {
      accessToken,
      user: {
          id: user.id,
          email: user.email,
          role: user.role,
      },
    }
  }

  async forgetpassword(dto: ForgetPasswordDto ){
    const user = this.prisma.client.user.findUnique({
      where:{
        email: dto.email
      }
    })

    if(!user) throw new UnauthorizedException('Invalid User');
  }
}