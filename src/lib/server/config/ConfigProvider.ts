import { configSchema, type AppConfig } from "./config.schema";
import { env } from '$env/dynamic/private';
import fs from "node:fs/promises";
import { fileExists } from "$lib/common/file";
import * as z from "zod";
import { EventEmitter } from "../common/EventEmitter";

interface ConfigEvents {
    init: [AppConfig],
    change: [AppConfig]
}

export type onChangeHandler = (config: AppConfig) => void;

export class ConfigProvider {
    private DEFAULT_CONFIG_PATH = './default.app.config.json';
    private static _instance: ConfigProvider | null = null;
    private config: AppConfig | null = null;
    private eventEmitter = new EventEmitter<ConfigEvents>();
    private isReady = false;

    private get configPath() {
        if (!env.CONFIG_PATH || env.CONFIG_PATH.trim().length === 0) {
            return './config.json';
        }

        return env.CONFIG_PATH!;
    }

    private constructor() {}

    static getInstance() {
        if (!this._instance) {
            this._instance = new ConfigProvider();
        }

        return this._instance;
    }

    async init() {
        if (!await fileExists(this.configPath)) {
            console.log(`Config not found... Copying default config to: ${this.configPath}`);
            await this.copyDefaultConfig();
        }

        await this.loadConfig();
        this.eventEmitter.emit('init', this.config!);
        this.isReady = true;
    }

    getConfig(): AppConfig {
        if (this.config === null) {
            throw new Error("Config is not initialized. Call ConfigProvider.init() before getConfig().");
        }

        return structuredClone(this.config);
    }

    async setConfig(config: AppConfig) {
        try {
            configSchema.parse(config);
        } catch (e) {
            if (e instanceof z.ZodError) {
                console.error("Invalid config soft skipping save");
                return;
            }
        }

        this.config = config;
        await this.saveConfig();
        this.handleOnChange();
    }

    async setKey<K extends keyof AppConfig>(
        key: K,
        value: AppConfig[K]
    ): Promise<void> {
        if (this.config === null) {
            throw new Error("Config is null");
        }

        try {
            configSchema.shape[key].parse(value);
        } catch (e) {
            if (e instanceof z.ZodError) {
                console.error("Invalid config soft skipping save in setKey");
                return;
            }
        }

        this.config[key] = value;
        await this.saveConfig();
        this.handleOnChange();
    }

    getKey(key: keyof AppConfig) {
        if (this.config === null) {
            throw new Error("Config is null");
        }

        return this.config[key];
    }

    onInit(handler: onChangeHandler) {
        if (this.isReady) {
            handler(this.config!);
            return;
        }

        this.eventEmitter.once('init', handler);
    }

    onChange(handler: onChangeHandler) {
        this.eventEmitter.on('change', handler)
    }

    offChange(handler: onChangeHandler) {
        this.eventEmitter.off('change', handler);
    }

    private handleOnChange() {
        if (this.config === null) {
            throw new Error("Config is null");
        }

        this.eventEmitter.emit('change', this.config);
    }

    private async copyDefaultConfig() {
        await fs.cp(this.DEFAULT_CONFIG_PATH, this.configPath);
    }

    private async loadConfig() {
        const configContent = await fs.readFile(this.configPath);
        const rawConfig = JSON.parse(configContent.toString());

        this.config = await configSchema.parseAsync(rawConfig);
    }

    private async saveConfig() {
        await fs.writeFile(this.configPath, JSON.stringify(this.config));
    }
}