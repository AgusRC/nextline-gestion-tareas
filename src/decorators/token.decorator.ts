import { createParamDecorator } from "@nestjs/common";
import { jwtDecode } from "jwt-decode";
import { TokenInterface } from "src/interfaces/token-interface.interface";

export const TokenData = createParamDecorator<TokenInterface>((data, req) => {
  const tokenString = String(req.args[0].headers.authorization).substring(
    7,
    String(req.args[0].headers.authorization).length,
  );
  return jwtDecode(tokenString);
});