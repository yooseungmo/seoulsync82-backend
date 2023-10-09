import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { GoogleAuthGuard } from "src/commons/auth/google-auth.guard";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";
import { GoogleLoginAuthOutputDto } from "./dto/google-login-auth.dto";
import { GoogleRequest, KakaoRequest } from "./interfaces/auth.interface";

@Controller()
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}    

  //-----------------------구글 로그인-----------------------------//
  // @Get("/user/login/google")
  // // @Get("/auth/google/callback")
  // @UseGuards(AuthGuard("google"))
  // async loginGoogle(
  //   // @Req() req: Request & IOAuthUser,
  //   // @Res() res: Response
  // ) {
  //   console.log(1)
  //   return await this.authService.OAuthLogin({ });
  // }

//-----------------------구글 로그인-----------------------------//

  @Get("/user/login/google")
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() _req: Request) {
    console.log(232332)
  }

  /* Get Google Auth Callback */
  @Get('/auth/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(
    @Req() req: GoogleRequest,
    // @Res({ passthrough: true }) res: Response,
    @Res() res: Response,
  )
  // : Promise<GoogleLoginAuthOutputDto> 
  {
    // async googleAuthRedirect(@Req() req, @Res() res) {
    const { user } = req;
    console.log(user)
    // res.redirect('http://localhost:3000/auth/test-guard2');
    return res.send(user);
    // return this.authService.googleLogin(req, res);
  }


  //-----------------------카카오 로그인-----------------------------//

  @Get("/user/login/kakao")
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuth(@Req() _req: Request) {
    console.log(232332)
  }

  /* Get kakao Auth Callback */
  @Get('/auth/kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuthCallback(
    @Req() req: KakaoRequest,
    // @Res({ passthrough: true }) res: Response,
    @Res() res: Response,
  )
  // : Promise<GoogleLoginAuthOutputDto> 
  {
    // async googleAuthRedirect(@Req() req, @Res() res) {
    const { user } = req;
    console.log(user)
    // res.redirect('http://localhost:3000/auth/test-guard2');
    return res.send(user);
    // return this.authService.googleLogin(req, res);
  }


}