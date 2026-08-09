import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UserRepository } from "./repository/user.repository";
import { AppError } from "../../common/errors/AppError";


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

            throw new AppError(
                "User not found",
                404
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

            throw new AppError(
                "User not found",
                404
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
