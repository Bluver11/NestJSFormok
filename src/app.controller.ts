import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Render,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { RegistrationDto } from './registration.dto';
import { User } from './user';
import { Response } from 'express';
import { ControlDto } from './control.dto';
import { Package } from './package';

const users: User[] = [new User('admin@example.com', 'asdf1234', 23)];
const package: Package[] = [new Package('AA1234', 'Good', 'Kefe')];

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  index() {
    return { message: 'Welcome to the homepage' };
  }

  @Get('register')
  @Render('registerForm')
  registerForm() {
    return { errors: [] };
  }

  @Post('register')
  @HttpCode(200)
  @Render('registerForm')
  register(@Body() registration: RegistrationDto, @Res() res: Response) {
    const errors: string[] = [];
    if (!registration.email.includes('@')) {
      errors.push('Az email cím formátuma nem megfelelő!');
    }
    if (registration.password.length < 8) {
      errors.push('A jelszó legalább 8 karakter hosszú legyen!');
    }
    if (registration.password !== registration.passwordagain) {
      errors.push('A két jelszó nem egyezik meg');
    }
    const age = parseInt(registration.age);
    if (age < 18 || isNaN(age)) {
      errors.push('Az életkornak 18ánál nagyobb számnak kell, hogy legyen');
    }
    if (errors.length > 0) {
      return {
        errors,
      };
    } else {
      users.push(new User(registration.email, registration.password, age));
      console.log(users);
      res.redirect('/register');
    }
  }

  @Post('login')
  login() {
    return 'Logged in';
  }

  @Get('controlcenter')
  @Render('packagecontrolForm')
  packagecontrolForm() {
    return {};
  }

  @Post('control')
  @Render('packagecontrolForm')
  control(@Body() control: ControlDto) {
    const faults: string[] = [];
    const regex = RegExp(/^[0-9{4}][a-z]{2}$/i);
    const input = control.serialnumber;
    if () {
      faults.push('A serial numbernek a betűt kell tartalmaznia!');
    }
    if(control.condition =='perfect'||control.condition=='damaged'){
      faults.push('A termék csak perfect vagy damaged lehet')
    }
    if(control.name.length !>3)
    {
      faults.push('A névnek legalább 3 karakter hosszúnak kell lennie.')
    }
    if (faults.length > 0) {
      return {
        faults,
      };
    } else {
      package.push(
        new Package(control.serialnumber, control.condition, control.name));
    }
  }
}
