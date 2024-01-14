import {UserModel} from "../../model/user-model";

/**
 * Repository class is used as in-memory database for user connection.
 * It is designed around Singleton pattern, so it can be easily instanced and all calls and data can be shared across whole application.
 */
export class UserRepository {
    private static instance: UserRepository;

    private users: Map<number, UserModel> = new Map();

    public static getRepository(): UserRepository {
        if (!this.instance) {
            this.instance = new UserRepository();
        }

        return this.instance;
    }

    public getUser(userId: number): UserModel | undefined {
        return this.users.get(userId);
    }

    public getUsers(): UserModel[] {
        return [...this.users.values()];
    }

    public addUser(user: UserModel) {
        this.users.set(user.id, user);
    }

    public removeUser(userId: number) {
        this.users.delete(userId);
    }
}