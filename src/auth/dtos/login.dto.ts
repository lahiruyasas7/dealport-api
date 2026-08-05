import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @Length(8, 50, { message: 'Password must be between 8 and 50 characters.' }) // Ensure password is between 8 and 50 characters
  @Matches(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
  @Matches(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
  @Matches(/[0-9]/, { message: "Password must contain at least one number." })
  @Matches(/[@$!%*?&#]/, { message: "Password must contain at least one special character (@$!%*?&#)." })
  password: string;
}