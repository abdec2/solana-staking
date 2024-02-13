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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var fs_1 = require("fs");
var anchor = require("@coral-xyz/anchor");
var anchor_1 = require("@coral-xyz/anchor");
var web3_js_1 = require("@solana/web3.js");
var spl_token_1 = require("@solana/spl-token");
var chai_1 = require("chai");
describe("solana-staking-blog", function () {
    // Configure the client to use the local cluster.
    var provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    var program = anchor.workspace
        .SolanaStakingBlog;
    var WALLET_PATH = (0, path_1.join)(process.env["HOME"], ".config/solana/id.json");
    var admin = web3_js_1.Keypair.fromSecretKey(Buffer.from(JSON.parse((0, fs_1.readFileSync)(WALLET_PATH, { encoding: "utf-8" }))));
    var user = web3_js_1.Keypair.generate();
    var poolInfo = web3_js_1.Keypair.generate();
    var userInfo = web3_js_1.Keypair.generate();
    var token;
    var adminTokenAccount;
    var userTokenAccount;
    before(function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = provider.connection).confirmTransaction;
                    return [4 /*yield*/, provider.connection.requestAirdrop(user.publicKey, 10 * web3_js_1.LAMPORTS_PER_SOL)];
                case 1: return [4 /*yield*/, _b.apply(_a, [_c.sent(), "confirmed"])];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, spl_token_1.Token.createMint(provider.connection, admin, admin.publicKey, null, 9, spl_token_1.TOKEN_PROGRAM_ID)];
                case 3:
                    token = _c.sent();
                    return [4 /*yield*/, token.createAccount(admin.publicKey)];
                case 4:
                    adminTokenAccount = _c.sent();
                    return [4 /*yield*/, token.createAccount(user.publicKey)];
                case 5:
                    userTokenAccount = _c.sent();
                    return [4 /*yield*/, token.mintTo(userTokenAccount, admin.publicKey, [admin], 1e10)];
                case 6:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("Initialize", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _adminTokenAccount, tx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, token.getAccountInfo(adminTokenAccount)];
                case 1:
                    _adminTokenAccount = _a.sent();
                    chai_1.assert.strictEqual(_adminTokenAccount.amount.toNumber(), 0);
                    return [4 /*yield*/, program.methods
                            .initialize(new anchor_1.BN(1), new anchor_1.BN(1e10))
                            .accounts({
                            admin: admin.publicKey,
                            poolInfo: poolInfo.publicKey,
                            stakingToken: token.publicKey,
                            adminStakingWallet: adminTokenAccount,
                            systemProgram: web3_js_1.SystemProgram.programId,
                        })
                            .signers([admin, poolInfo])
                            .rpc()];
                case 2:
                    tx = _a.sent();
                    console.log("Your transaction signature", tx);
                    return [2 /*return*/];
            }
        });
    }); });
    it("Stake", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _userTokenAccount, tx, _adminTokenAccount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, token.getAccountInfo(userTokenAccount)];
                case 1:
                    _userTokenAccount = _a.sent();
                    chai_1.assert.strictEqual(_userTokenAccount.amount.toNumber(), 1e10);
                    return [4 /*yield*/, program.methods
                            .stake(new anchor_1.BN(1e10))
                            .accounts({
                            user: user.publicKey,
                            admin: admin.publicKey,
                            userInfo: userInfo.publicKey,
                            userStakingWallet: userTokenAccount,
                            adminStakingWallet: adminTokenAccount,
                            stakingToken: token.publicKey,
                            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                            systemProgram: web3_js_1.SystemProgram.programId,
                        })
                            .signers([user, userInfo])
                            .rpc()];
                case 2:
                    tx = _a.sent();
                    console.log("Your transaction signature", tx);
                    return [4 /*yield*/, token.getAccountInfo(adminTokenAccount)];
                case 3:
                    _adminTokenAccount = _a.sent();
                    chai_1.assert.strictEqual(_adminTokenAccount.amount.toNumber(), 1e10);
                    return [2 /*return*/];
            }
        });
    }); });
    it("Claim Reward", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _adminTokenAccount, tx, _userTokenAccount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, token.getAccountInfo(adminTokenAccount)];
                case 1:
                    _adminTokenAccount = _a.sent();
                    chai_1.assert.strictEqual(_adminTokenAccount.amount.toNumber(), 1e10);
                    return [4 /*yield*/, program.methods
                            .claimReward()
                            .accounts({
                            user: user.publicKey,
                            admin: admin.publicKey,
                            userInfo: userInfo.publicKey,
                            userStakingWallet: userTokenAccount,
                            adminStakingWallet: adminTokenAccount,
                            stakingToken: token.publicKey,
                            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                        })
                            .rpc()];
                case 2:
                    tx = _a.sent();
                    console.log("Your transaction signature", tx);
                    return [4 /*yield*/, token.getAccountInfo(userTokenAccount)];
                case 3:
                    _userTokenAccount = _a.sent();
                    chai_1.assert.strictEqual(_userTokenAccount.amount.toNumber(), 1);
                    return [2 /*return*/];
            }
        });
    }); });
    it("Unstake", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _adminTokenAccount, tx, _userTokenAccount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, token.getAccountInfo(adminTokenAccount)];
                case 1:
                    _adminTokenAccount = _a.sent();
                    chai_1.assert.strictEqual(_adminTokenAccount.amount.toNumber(), 1e10);
                    return [4 /*yield*/, program.methods
                            .unstake()
                            .accounts({
                            user: user.publicKey,
                            admin: admin.publicKey,
                            userInfo: userInfo.publicKey,
                            userStakingWallet: userTokenAccount,
                            adminStakingWallet: adminTokenAccount,
                            stakingToken: token.publicKey,
                            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                        })
                            .rpc()];
                case 2:
                    tx = _a.sent();
                    console.log("Your transaction signature", tx);
                    return [4 /*yield*/, token.getAccountInfo(userTokenAccount)];
                case 3:
                    _userTokenAccount = _a.sent();
                    chai_1.assert.strictEqual(_userTokenAccount.amount.toNumber(), 1e10 + 2);
                    return [2 /*return*/];
            }
        });
    }); });
});
