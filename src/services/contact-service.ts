import { User } from "@prisma/client";
import { ContactReponse, CreateContactRequest, toContactResponse } from "../models/contact-mode";
import { Validation } from "../validations/validation";
import { ContactValidations } from "../validations/contact-validation";
import { prismaClient } from "../applicaion/database";
import { ResponseError } from "../error/reponse-error";


export class ContactService {
  static async create(
    user: User,
    request: CreateContactRequest
  ): Promise<ContactReponse> {
    const createRequest = Validation.validate(
      ContactValidations.CRETAE,
      request
    );

    const record = {
      ...createRequest,
      ...{ username: user.username },
    };

    const contact = await prismaClient.contact.create({
      data: record,
    });

    return toContactResponse(contact);
  }

  static async get(user: User, id: number): Promise<ContactReponse> {
    const contact = await prismaClient.contact.findUnique({
      where: {
        id: id,
        username: user.username,
      },
    });

    if (!contact) {
      throw new ResponseError(404, "Contact is not found");
    }

    return toContactResponse(contact);
  }

}