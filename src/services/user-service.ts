import { User } from "@prisma/client";
import { prismaClient } from "../applicaion/database";
import { ResponseError } from "../error/reponse-error";
import {
  CreateUserRequest,
  LoginUserRequest,
  toUserResponse,
  UpdateUserRequest,
  UserResponse,
} from "../models/user-model";
import { UserValidation } from "../validations/user-validation";
import { Validation } from "../validations/validation";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export class UserService {
  static async register(request: CreateUserRequest): Promise<UserResponse> {
    const registerRequest = Validation.validate(
      UserValidation.REGISTER,
      request
    );

    const totalUserWithSameUsername = await prismaClient.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (totalUserWithSameUsername != 0) {
      throw new ResponseError(400, "username already exist");
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await prismaClient.user.create({
      data: registerRequest,
    });
    return toUserResponse(user);
  }

  static async login(request: LoginUserRequest): Promise<UserResponse> {
    const loginUserRequest = Validation.validate(UserValidation.LOGIN, request);
    let user = await prismaClient.user.findUnique({
      where: {
        username: loginUserRequest.username,
      },
    });

    if (!user) {
      throw new ResponseError(401, "username or Password is wrong");
    }

    const isMatch = await bcrypt.compare(
      loginUserRequest.password,
      user.password
    );
    if (!isMatch) {
      throw new ResponseError(401, "username or Password is wrong");
    }

    user = await prismaClient.user.update({
      where: {
        username: loginUserRequest.username,
      },
      data: {
        token: uuidv4(),
      },
    });

    const response = toUserResponse(user);
    response.token = user.token!;
    return response;
  }

  static async get(user: User): Promise<UserResponse> {
    return toUserResponse(user);
  }

  static async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    const updateRequest = Validation.validate(UserValidation.UPDATE, request);

    if (updateRequest.name) {
      user.name = updateRequest.name;
    }
    
    
    if (updateRequest.password) {
      user.password = await bcrypt.hash(updateRequest.password, 10);
    }

    const result = await prismaClient.user.update({
      where: {
        username: user.username,
      },
      data: user,
    });
    return toUserResponse(result);
  }
}
