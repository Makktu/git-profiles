"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
// * 1. Basic Types
const githubApiBaseUrl = 'https://api.github.com';
let rateLimitRemaining = null;
let rateLimitReset = null;
let isFetching = false;
// 2. Function to fetch user data
function fetchGitHubUserData(username) {
    return __awaiter(this, void 0, void 0, function* () {
        isFetching = true;
        const url = `${githubApiBaseUrl}/users/${username}`;
        try {
            const response = yield (0, node_fetch_1.default)(url); // * the Node fetch call
            // Update rate limit information
            rateLimitRemaining = Number(response.headers.get('x-ratelimit-remaining'));
            rateLimitReset = response.headers.get('x-ratelimit-reset')
                ? new Date(Number(response.headers.get('x-ratelimit-reset')) * 1000)
                : null;
            if (!response.ok) {
                throw new Error(`⚠️  ___Github API request failed with status ${response.statusText}`);
            }
            console.log(response);
            const data = yield response.json(); // will add interfaces later for better typing
            return data;
        }
        catch (error) {
            console.error(error);
            return null; // ! handle error better than this
        }
        finally {
            isFetching = false;
        }
    });
}
// 3. Example usage
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const username = 'Makktu'; // ! replace with Github username
        const user = yield fetchGitHubUserData(username);
        if (user) {
            console.log('🟢 Github data retrieved successfully');
            console.log(`User Data: ${username}: ${user.name}`);
            console.log(`Email: ${user.email ? user.email : '❗No email found'}`);
            console.log('Rate Limit Remaining:', rateLimitRemaining);
            console.log('Rate Limit Reset:', rateLimitReset);
        }
    });
}
main();
