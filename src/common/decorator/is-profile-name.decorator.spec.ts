import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { IsProfileName } from './is-profile-name.decorator';

class TestProfileNameDto {
  @IsProfileName()
  profileName!: string;
}

describe('IsProfileName Decorator', () => {
  async function validateInput(value: any) {
    const instance = plainToInstance(TestProfileNameDto, {
      profileName: value,
    });
    const errors = await validate(instance);
    return { instance, errors };
  }

  it('should pass valid profile names', async () => {
    const validNames = [
      'john_doe',
      'alex.racer',
      'speed-demon99',
      'marcus123',
      'pro.driver-99_fast',
      'abc',
      '123_456',
    ];

    for (const name of validNames) {
      const { errors, instance } = await validateInput(name);
      expect(errors.length).toBe(0);
      expect(instance.profileName).toBe(name);
    }
  });

  it('should transform uppercase and trim spaces automatically', async () => {
    const { errors, instance } = await validateInput('  Speed_Racer  ');
    expect(errors.length).toBe(0);
    expect(instance.profileName).toBe('speed_racer');
  });

  it('should fail on invalid formats', async () => {
    const invalidNames = [
      'ab', // too short (< 3)
      'a'.repeat(31), // too long (> 30)
      '_leading_symbol',
      '.leading_dot',
      '-leading_dash',
      'trailing_symbol_',
      'trailing_dot.',
      'trailing_dash-',
      'consecutive..dots',
      'consecutive__underscores',
      'consecutive--dashes',
      'mixed._delimiters',
      'space inside',
      'john@doe',
      'john#speed',
      'user!name',
      'user$name',
    ];

    for (const name of invalidNames) {
      const { errors } = await validateInput(name);
      expect(errors.length).toBeGreaterThan(0);
    }
  });
});
