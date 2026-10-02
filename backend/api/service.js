import AsyncLock from "async-lock";
import fs from "fs";
import jwt from "jsonwebtoken";
import { AccessError, InputError } from "./error.js";

const lock = new AsyncLock();
const JWT_SECRET = process.env.JWT_SECRET;
const isTest = process.env.NODE_ENV === "test";
const DATABASE_FILE = isTest
  ? "./database.test.json"
  : process.env.DATABASE_FILE || "./database.json";
const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = process.env;
const useRemoteStorage = Boolean(
  !isTest && UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN,
);

if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET is not configured. Copy .env.example to .env for local development.",
  );
}

let admins = {};

const writeAdmins = (nextAdmins) =>
  lock.acquire("saveData", async () => {
    if (useRemoteStorage) {
      const response = await fetch(`${UPSTASH_REDIS_REST_URL}/set/admins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
        },
        body: JSON.stringify({ admins: nextAdmins }),
      });

      if (!response.ok) {
        throw new Error("Writing to Upstash Redis failed");
      }
      return;
    }

    fs.writeFileSync(
      DATABASE_FILE,
      JSON.stringify({ admins: nextAdmins }, null, 2),
    );
  });

const loadAdmins = async () => {
  if (useRemoteStorage) {
    const response = await fetch(`${UPSTASH_REDIS_REST_URL}/get/admins`, {
      headers: {
        Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error("Reading from Upstash Redis failed");
    }

    const data = await response.json();
    admins = data.result ? JSON.parse(data.result).admins || {} : {};
    return;
  }

  try {
    const data = JSON.parse(fs.readFileSync(DATABASE_FILE, "utf8"));
    admins = data.admins || {};
  } catch (error) {
    if (error?.code !== "ENOENT") {
      throw error;
    }

    admins = {};
    fs.writeFileSync(DATABASE_FILE, JSON.stringify({ admins }, null, 2));
  }
};

export const ready = loadAdmins();

export const save = async () => {
  await ready;
  await writeAdmins(admins);
};

export const reset = async () => {
  await ready;

  if (useRemoteStorage) {
    throw new Error("Refusing to reset remote storage");
  }

  admins = {};
  await writeAdmins(admins);
};

export const userLock = async (callback) => {
  await ready;
  return lock.acquire("userAuthLock", callback);
};

export const getEmailFromAuthorization = async (authorization) => {
  await ready;

  try {
    const token = authorization.replace("Bearer ", "");
    const { email } = jwt.verify(token, JWT_SECRET);
    if (!(email in admins)) {
      throw new AccessError("Invalid token");
    }
    return email;
  } catch {
    throw new AccessError("Invalid token");
  }
};

export const login = (email, password) =>
  userLock(() => {
    const normalizedEmail = String(email ?? "").trim().toLowerCase();

    if (
      normalizedEmail in admins &&
      admins[normalizedEmail].password === password
    ) {
      return jwt.sign({ email: normalizedEmail }, JWT_SECRET, {
        algorithm: "HS256",
      });
    }

    throw new InputError("Incorrect email or password.");
  });

export const logout = (email) =>
  userLock(() => {
    admins[email].sessionActive = false;
  });

export const register = (email, password, name) =>
  userLock(() => {
    const normalizedEmail = String(email ?? "").trim().toLowerCase();
    const normalizedName = String(name ?? "").trim();

    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      throw new InputError("A valid email address is required");
    }
    if (!normalizedName) {
      throw new InputError("Name is required");
    }
    if (!password) {
      throw new InputError("Password is required");
    }
    if (normalizedEmail in admins) {
      throw new InputError("Email address already registered");
    }

    admins[normalizedEmail] = {
      name: normalizedName,
      password,
      store: {},
    };

    return jwt.sign({ email: normalizedEmail }, JWT_SECRET, {
      algorithm: "HS256",
    });
  });

export const getStore = (email) =>
  userLock(() => admins[email].store);

export const setStore = (email, store) =>
  userLock(() => {
    admins[email].store = store;
  });
