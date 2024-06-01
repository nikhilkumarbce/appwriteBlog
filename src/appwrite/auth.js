import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";

class AuthService {
    constructor() {
        this.client = new Client();
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // Call another method, maybe emit an event or perform additional actions
                return this.login({ email, password });
            } else {
                return userAccount; // Return the created user account information
            }
        } catch (error) {
            throw error; // Re-throw the error for handling at a higher level
        }
    }

    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.error("Error fetching current user:", error);
            return null;
        }
    }

    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.error("Error logging out:", error);
        }
    }
}

const authService = new AuthService();
export default authService;
