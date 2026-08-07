import { AppDataSource }
  from "../../../database/data-source";

import { User }
  from "../../../entities/User";

export class UserRepository {

  private repository =
    AppDataSource.getRepository(User);

  async findByEmail(
    email: string
  ) {

    return this.repository.findOne({

      where: {
        email
      }

    });

  }

  async findById(
    id: number
  ) {

    return this.repository.findOne({

      where: {
        id
      }

    });

  }

  async create(
    data: Partial<User>
  ) {

    const user =
      this.repository.create(data);

    return this.repository.save(user);

  }

  async update(
    id: number,
    data: Partial<User>
  ) {

    await this.repository.update(
      id,
      data
    );

  }

}