import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UserRepository } from "./repository/user.repository";


export class UserService {

  private userRepository =
    new UserRepository();

  async getProfile(
    userId: number
  ) {

    const user =
      await this.userRepository.findById(
        userId
      );

    if (!user) {

      throw new Error(
        "User not found"
      );

    }

    return user;

  }

  async updateProfile(
    userId: number,
    data: UpdateProfileDto
  ) {

    const user =
      await this.userRepository.findById(
        userId
      );

    if (!user) {

      throw new Error(
        "User not found"
      );

    }

    await this.userRepository.update(
      userId,
      data
    );

    return await this.userRepository.findById(
      userId
    );

  }

}