import { AppDataSource } from "../../../database/data-source";
import { RefreshToken } from "../../../entities/RefreshToken";

export class RefreshTokenRepository {

  private repository =
    AppDataSource.getRepository(
      RefreshToken
    );

  async findByToken(
    token: string
  ) {

    return this.repository.findOne({

      where: {
        token
      },

      relations: {
        user: true
      }

    });

  }

  async create(
    data: Partial<RefreshToken>
  ) {

    const refreshToken =
      this.repository.create(data);

    return this.repository.save(
      refreshToken
    );

  }

  async revoke(
    id: number
  ) {

    await this.repository.update(
      id,
      {
        isRevoked: true
      }
    );

  }

}